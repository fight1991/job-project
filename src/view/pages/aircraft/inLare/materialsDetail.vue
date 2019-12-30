<template>
  <section class='sys-main'>
    <!-- 头部 -->
    <el-row class='sys-header'>
      <el-form label-width="0px">
        <!-- 返回按钮 end-->
        <el-row v-if="isEdit" class="mg-b-15">
          <el-button size="mini" @click="saveData">暂存</el-button>
          <el-button type="primary" size="mini" @click="declare">申报</el-button>
        </el-row>
      </el-form>
    </el-row>
    <!-- 头部end -->
    <!-- 主显示框 -->
    <el-row class="airvehicle-panel airvehicle-form">
      <el-form :label-width="isEdit?'92px':'173px'" :model="submitData" ref="submitData" :rules="rules" size="mini">
        <el-row class="import-edit-title">供退物料信息</el-row>
        <el-row :gutter="30" class="pd-l-15 mg-b-10">
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航空器注册编号':'航空器注册编号：'" prop="aircraftNo" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable maxlength="25" v-model="submitData.aircraftNo" v-if="isEdit"></el-input>
              <span v-else class="color-txt">{{submitData.aircraftNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航班号':'航班号：'" prop="flightNo">
              <el-input size="mini" clearable maxlength="20" v-model="submitData.flightNo" v-if="isEdit"></el-input>
              <span v-else class="color-txt">{{submitData.flightNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'供退标志':'供退标志：'" prop="iOFlag">
              <el-select v-model="submitData.iOFlag" clearable v-if="isEdit" style="width:100%;">
                <el-option v-for="item in signList" :label="item.text" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <span v-else class="color-txt">{{formatFlag(submitData.iOFlag)}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航班日期':'航班日期：'" prop="flightDate">
              <el-date-picker size="mini" v-model="submitData.flightDate" v-if="isEdit" type="date" style="width:100%"></el-date-picker>
              <span v-else class="color-txt">{{submitData.flightDate | date('yyyy-MM-dd')}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'运输工具服务企业代码':'运输工具服务企业代码：'" prop="enterpriseCode" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model="submitData.enterpriseCode" maxlength="20" v-if="isEdit"></el-input>
              <span v-else class="color-txt">{{submitData.enterpriseCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'出发/目的港':'出发/目的港：'" prop="fromAirport" :class="{'more-txt-lh': isEdit}">
              <el-select size="mini" v-model="submitData.fromAirport" v-if="isEdit" style="width:100%;"
                @focus="tipsFillMessage('portList','SAAS_SW_AIRPORT_CODE')"
                filterable remote default-first-option clearable
                :remote-method="checkParamsList"
                @change="checkParamsList">
                <el-option
                  v-for="item in portList"
                  :key="item.codeField"
                  :label="item.codeField+'-'+item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
              <span v-else class="color-txt">{{submitData.fromAirport}}-{{submitData.fromAirportValue}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'海关关区':'海关关区：'" prop="cusCustomsCode2">
              <el-select size="mini" v-model="submitData.cusCustomsCode2" v-if="isEdit" style="width:100%;"
                @focus="tipsFillMessage('cusCustomsCodeList','SAAS_CUSTOMS_REL')"
                filterable remote default-first-option clearable
                :remote-method="checkParamsList"
                @change="checkParamsList">
                <el-option
                  v-for="item in cusCustomsCodeList"
                  :key="item.codeField"
                  :label="item.codeField+'-'+item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
              <span v-else class="color-txt">{{submitData.cusCustomsCode2}}-{{submitData.cusCustomsCode2Value}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="airvehicle-form-row pd-l-15 mg-b-10" :gutter="30">
          <el-col :span="24" v-if="isEdit">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="submitData.column15" rows="2" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="备注">
              <span class="break-text color-txt">{{submitData.column15}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row class="airvehicle-panel airvehicle-table">
      <el-row class="import-edit-title">货物明细信息</el-row>
      <el-row class="airvehicle-table-icon mg-b-15" v-if="isEdit">
        <el-button size="mini" class="list-btns list-icon-delete" @click="deletes"><i></i>删除</el-button>
        <div class="airvehicle-list-drop" style="float:right;">
          <el-popover popper-class="airvehicle-table-popper">
            <ul>
              <li v-for="(item,index) in thList" :key="index">
                <el-checkbox size="mini" v-model="item.value">{{item.text}}</el-checkbox>
              </li>
            </ul>
            <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
          </el-popover>
        </div>
      </el-row>
      <el-table class='sys-table-table mg-b-30' :height="250" :data="submitData.suppliesList" border highlight-current-row size="mini" @selection-change="selectVal">
        <el-table-column  type="selection" width="40" align="center" v-if="isEdit"></el-table-column>
        <el-table-column label="序号" width="110" type="index" align="left" v-if="thList[0].value"></el-table-column>
        <el-table-column label="物料" prop="materielCode" align="left" min-width="130" v-if="thList[1].value"></el-table-column>
        <el-table-column label="物品名称" prop="materielName" align="left" min-width="130" v-if="thList[2].value"></el-table-column>
        <el-table-column label="计量单位" prop="metricUnit" align="left" min-width="110" v-if="thList[3].value"></el-table-column>
        <el-table-column label="申报数量" prop="declareNum" align="right" min-width="100" v-if="thList[4].value"></el-table-column>
        <el-table-column label="备注" prop="memo" align="left" min-width="180" v-if="thList[5].value"></el-table-column>
      </el-table>
    </el-row>
    <!-- 主显示框end -->
  </section>
</template>
<script>
import util from '@/common/util'
import validator from '@/common/validator'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      rules: {
        aircraftNo: [{ required: true, message: '请输入航空器注册编号', trigger: 'blur' }],
        flightNo: [{ required: true, message: '请输入航班号', trigger: 'blur' }, { validator: validator.numEn, message: '请输入大写英文、数字', trigger: 'blur' }],
        iOFlag: [{ required: true, message: '请选择供退标志', trigger: 'change' }],
        flightDate: [{ required: true, message: '请选择航班日期', trigger: 'blur' }],
        enterpriseCode: [{ required: true, message: '请输入运输工具服务企业代码', trigger: 'blur' }],
        fromAirport: [{ required: true, message: '请选择出发/目的港', trigger: 'change' }],
        cusCustomsCode2: [{ required: true, message: '请选择海关关区', trigger: 'change' }]
      },
      submitData: {
        aircraftNo: '',
        flightNo: '',
        flightDate: '',
        fromAirport: '',
        column15: '',
        iOFlag: '',
        enterpriseCode: '',
        cusCustomsCode2: '',
        suppliesList: []
      }, // 查询传参
      statusList: [{
        value: '0',
        text: '否'
      }, {
        value: '1',
        text: '是'
      }], // 是否列表
      signList: [{
        value: 'S',
        text: '供机'
      }, {
        value: 'R',
        text: '退机'
      }],
      isEdit: true, // true 编辑 false 详情
      thList: [{
        value: true,
        text: '序号'
      }, {
        value: true,
        text: '物料'
      }, {
        value: true,
        text: '物品名称'
      }, {
        value: true,
        text: '计量单位'
      }, {
        value: true,
        text: '申报数量'
      }, {
        value: true,
        text: '备注'
      }], // 表头
      resultList: [], // 表格数据
      tableNameList: {
        tableNames: [
          'SAAS_SW_AIRPORT_CODE', // 港口
          'SAAS_CUSTOMS_REL' // 海关关区
        ]
      }, // 字典标明
      selectObj: {
        obj: '',
        params: ''
      },
      selectList: [{
        obj: 'cusCustomsCodeList',
        params: 'SAAS_CUSTOMS_REL'
      }, {
        obj: 'portList',
        params: 'SAAS_SW_AIRPORT_CODE'
      }],
      portList: [], // 抵达港口数据
      cusCustomsCodeList: [], // 海关关区数据
      selectData: []
    }
  },
  created () {
    this.getCommonParam()
    if (this.$route.params.type === 'edit') {
      this.isEdit = true
    } else {
      this.isEdit = false
    }
  },
  methods: {
    // 判断缓存中是否有数据
    getCommonParam () {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map)
      } else {
        this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE')).slice(0, 30)
        this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
        this.getDetail()
      }
    },
    // 获取公共字典list
    getCommonParams (datas) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
          this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE')).slice(0, 30)
          this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
          this.getDetail()
        }
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    checkParamsList (query) {
      if (query) {
        let keyValue = query.toString().trim()
        let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          this[this.selectObj.obj] = list.slice(0, 30)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          this[this.selectObj.obj] = filterList.slice(0, 30)
        }
      } else {
        if (!util.isEmpty(JSON.parse(window.localStorage.getItem(this.selectObj.params)))) {
          this[this.selectObj.obj] = JSON.parse(window.localStorage.getItem(this.selectObj.params)).slice(0, 30)
        }
      }
    },
    // 校验数字
    validateNum (rule, value, callback) {
      if (!util.isEmpty(value)) {
        if (!Number.isInteger(Number(value))) {
          callback(new Error(''))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 暂存
    saveData () {
      this.$refs['submitData'].validate((valId) => {
        if (!valId) {
          return false
        }
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/other/saveCdsAirSuppliesDeclareVO',
          data: this.submitData,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '暂存成功',
              type: 'success'
            })
            // this.getDetail()
            // this.$router.push({name: '进境、港单证申报'})
          }
        })
      })
    },
    // 申报
    declare () {
      let ids = []
      ids.push(this.$route.params.id)
      let data = {
        ids: ids,
        operType: '0'
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/declareSupplyMaterial',
        data: data,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: res.result.statusValue,
            type: 'success'
          })
          this.getDetail()
        }
      })
    },
    // 格式化供退标志
    formatFlag (val) {
      let value = ''
      for (let i = 0; i < this.signList.length; i++) {
        if (this.signList[i].value === val) {
          value = this.signList[i].text
          break
        }
      }
      return value
    },
    // 获取详情
    getDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/other/getCdsSuppliesDeclare',
        data: {iprtTmpNO: this.$route.params.id},
        router: this.$router,
        success: (res) => {
          if (!util.isEmpty(res.result)) {
            this.submitData = res.result
            for (let i of this.selectList) {
              if (i.obj === 'cusCustomsCodeList') {
                this.selectObj = i
                this.checkParamsList(this.submitData.cusCustomsCode2)
              } else {
                this.selectObj = i
                this.checkParamsList(this.submitData.fromAirport)
              }
            }
          }
        }
      })
    },
    // 多选框
    selectVal (val) {
      this.selectData = val
    },
    // 删除
    deletes () {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'error'
        })
        return false
      }
      this.$confirm('确定删除选中数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        let ids = []
        for (let i of this.selectData) {
          ids.push(i.suppliesPid)
        }
        let data = {
          ids: ids,
          type: '6'
        }
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/common/deleteCds',
          data: data,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getDetail()
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import (less) '../css/common.less';
</style>
