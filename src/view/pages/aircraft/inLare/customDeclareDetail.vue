<template>
  <section class='sys-main'>
    <!-- 头部 -->
    <el-row class='sys-header'>
      <el-form label-width="0px">
        <el-row v-if="isEdit" class="mg-b-15">
          <el-button size="mini" class="default-btn" @click="saveData">暂存</el-button>
          <el-button type="primary" size="mini" class="primary-btn" @click="declare">申报</el-button>
        </el-row>
      </el-form>
    </el-row>
    <!-- 头部end -->
    <!-- 主显示框 -->
    <el-row class="airvehicle-panel">
      <el-form :label-width="isEdit?'92px':'133px'" :model="submitData" ref="submitData" :rules="rules" size="mini">
        <el-row class="import-edit-title">报给单位</el-row>
        <el-row :gutter="30" class="pd-l-15">
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
        <el-row class="import-edit-title">航空器信息</el-row>
        <el-row :gutter="30" class="pd-l-15 mg-b-10">
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航空器注册编号':'航空器注册编号：'" prop="aircraftNo" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable maxlength="25" v-model="submitData.aircraftNo" v-if="isEdit"></el-input>
              <span v-else class="color-txt">{{submitData.aircraftNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'注册海关关区':'注册海关关区：'">
              <el-select size="mini" v-model="submitData.cusCustomsCode1" v-if="isEdit" style="width:100%;"
                @focus="tipsFillMessage('cusCustomsCodeListA','SAAS_CUSTOMS_REL')"
                filterable remote default-first-option clearable
                :remote-method="checkParamsList"
                @change="checkParamsList">
                <el-option
                  v-for="item in cusCustomsCodeListA"
                  :key="item.codeField"
                  :label="item.codeField+'-'+item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
              <span v-else class="color-txt">{{submitData.cusCustomsCode1}}-{{submitData.cusCustomsCode1Value}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航空器备案类型':'航空器备案类型：'" prop="putrecAirType" :class="{'more-txt-lh': isEdit}">
              <el-select size="mini" v-model="submitData.putrecAirType" v-if="isEdit" clearable style="width:100%;">
                <el-option v-for="item in putrecAirTypeList" :value="item.value" :label="item.text" :key="item.value"></el-option>
              </el-select>
              <span v-else class="color-txt">{{submitData.putrecAirType==='1'?'航线航空器':'通用航空器'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="import-edit-title">在港申报信息</el-row>
        <el-row :gutter="30" class="pd-l-15 mg-b-10">
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'进港航班号':'进港航班号：'" prop="voyageIn">
              <el-input size="mini" clearable v-model="submitData.voyageIn" v-if="isEdit" maxlength="20"></el-input>
              <span v-else class="color-txt">{{submitData.voyageIn}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航班日期':'航班日期：'" prop="arrivalDate">
              <el-date-picker size="mini" v-model="submitData.arrivalDate" v-if="isEdit" type="date" style="width:100%"></el-date-picker>
              <span v-else class="color-txt">{{submitData.arrivalDate | date('yyyy-MM-dd')}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'停靠港':'停靠港：'" prop="stayAirport">
              <el-select size="mini" v-model="submitData.stayAirport" v-if="isEdit" style="width:100%;"
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
              <span v-else class="color-txt">{{submitData.stayAirport}}-{{submitData.stayAirportValue}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'停机位':'停机位：'" prop="stayId">
              <el-input size="mini" clearable v-model.number="submitData.stayId" v-if="isEdit" maxlength="35"></el-input>
              <span v-else class="color-txt">{{submitData.stayId}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="import-edit-title">备注信息</el-row>
        <el-row :gutter="30" class="pd-l-15 mg-b-10">
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'滞留原因':'滞留原因：'" prop="content">
              <el-select size="mini" v-model="submitData.content" v-if="isEdit" style="width:100%;">
                <el-option v-for="item in reasonList" :key="item.value" :value="item.value" :label="item.text"></el-option>
              </el-select>
              <span v-else class="color-txt">{{formatContent(submitData.content)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isEdit">
            <el-form-item label="海关备注" prop="memo">
              <el-input type="textarea" v-model="submitData.memo" rows="4" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="海关备注：">
              <span class="break-text color-txt">{{submitData.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
        cusCustomsCode2: [{ required: true, message: '请选择海关关区', trigger: 'change' }],
        aircraftNo: [{ required: true, message: '请输入航空器注册编号', trigger: 'blur' }],
        putrecAirType: [{ required: true, message: '请选择航空器备案类型', trigger: 'change' }],
        stayAirport: [{ required: true, message: '请选择停靠港', trigger: 'change' }],
        voyageIn: [{ required: true, message: '请输入进港航班号', trigger: 'blur' }, { validator: validator.numEn, message: '请输入大写英文、数字', trigger: 'blur' }],
        arrivalDate: [{ required: true, message: '请选择航班日期', trigger: 'blur' }],
        stayId: [{ required: true, message: '请输入停机位', trigger: 'blur' }, {validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        content: [{ required: true, message: '请选择滞留原因', trigger: 'change' }],
        memo: [{ required: true, message: '请输入海关备注', trigger: 'blur' }]
      },
      submitData: {
        cusCustomsCode2: '',
        cusCustomsCode1: '',
        putrecAirType: '',
        stayAirport: '',
        voyageIn: '',
        aircraftNo: '',
        arrivalDate: '',
        stayId: '',
        content: '',
        memo: ''
      }, // 查询传参
      putrecAirTypeList: [{
        value: '1',
        text: '航线航空器'
      }, {
        value: '2',
        text: '通用航空器'
      }], // 航空器备案类型
      reasonList: [{
        value: '1',
        text: '移泊'
      }, {
        value: '2',
        text: '待命'
      }, {
        value: '3',
        text: '维修'
      }, {
        value: '4',
        text: '其它'
      }],
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
        obj: 'cusCustomsCodeListA',
        params: 'SAAS_CUSTOMS_REL'
      }, {
        obj: 'portList',
        params: 'SAAS_SW_AIRPORT_CODE'
      }],
      portList: [], // 出发港数据
      cusCustomsCodeList: [], // 海关关区数据
      cusCustomsCodeListA: [], // 注册海关关区数据
      isEdit: true // true 编辑 false 详情
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
        this.cusCustomsCodeListA = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
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
          this.cusCustomsCodeListA = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
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
      if (value !== '') {
        if (!Number.isInteger(Number(value))) {
          callback(new Error(''))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 校验离港时间不得晚于抵港时间
    validateTimeA (rule, value, callback) {
      if (!(new Date(Date.parse(util.dateFormat(value).replace(/-/g, '/'))) < new Date(Date.parse(util.dateFormat(this.submitData.arrivalDateTime).replace(/-/g, '/'))))) {
        callback(new Error(''))
      } else {
        callback()
      }
    },
    validateTime (rule, value, callback) {
      if (!(new Date(Date.parse(util.dateFormat(value).replace(/-/g, '/'))) > new Date(Date.parse(util.dateFormat(this.submitData.departureDateTime).replace(/-/g, '/'))))) {
        callback(new Error(''))
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
          url: 'API@/dec-common/cds/other/saveCdsPortDeclareVO',
          data: this.submitData,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '暂存成功',
              type: 'success'
            })
            // this.getDetail()
            // this.$router.push({name: '进境、港动态申报'})
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
        url: 'API@/dec-common/cds/common/declarePort',
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
    formatContent (val) {
      let value = ''
      for (let i = 0; i < this.reasonList.length; i++) {
        if (this.reasonList[i].value === val) {
          value = this.reasonList[i].text
          break
        }
      }
      return value
    },
    // 获取详情
    getDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/other/getCdsPortDeclare',
        data: {iprtTmpNO: this.$route.params.id},
        router: this.$router,
        success: (res) => {
          this.submitData = util.isEmpty(res.result) ? {} : res.result
          if (this.$route.params.type === 'edit') {
            // if (this.submitData.content === '维修') {
            //   this.submitData.content = '3'
            // } else if (this.submitData.content === '移泊') {
            //   this.submitData.content = '1'
            // } else if (this.submitData.content === '待命') {
            //   this.submitData.content = '2'
            // } else {
            //   this.submitData.content = '4'
            // }
          }
          for (let i of this.selectList) {
            if (i.obj === 'cusCustomsCodeList') {
              this.selectObj = i
              this.checkParamsList(this.submitData.cusCustomsCode2)
            } else if (i.obj === 'cusCustomsCodeListA') {
              this.selectObj = i
              this.checkParamsList(this.submitData.cusCustomsCode1)
            } else {
              this.selectObj = i
              this.checkParamsList(this.submitData.stayAirport)
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import (less) '../css/common.less';
</style>
