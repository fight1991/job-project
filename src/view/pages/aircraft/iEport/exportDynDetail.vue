<template>
  <section class='sys-main'>
    <el-form :label-width="isEdit?'92px':'133px'" :model="submitData" :rules="rules" ref="submitData" class="airvehicle-form-b" size="mini">
      <!-- 头部 -->
      <el-row class='sys-header'>
          <el-row>
            <el-form-item label="申报对象:" label-width="70px" v-if="!isEdit">
              <span class="color-txt">{{submitData.cdsDclTypeValue}}</span>
            </el-form-item>
          </el-row>
          <!-- 返回按钮 end-->
          <el-row v-if="isEdit">
            <el-col :span="18">
              <el-button size="mini" class="default-btn" @click="saveData">暂存</el-button>
              <el-button type="primary" size="mini" class="primary-btn" @click="declare">申报</el-button>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申报对象" label-width="65px">
                <el-select v-model="submitData.cdsDclType" style="width:100%;">
                  <el-option v-for="item in cdsDclTypeList" :key="item.value+'cdsDclTypeList'" :value="item" :label="item.text"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
      </el-row>
      <!-- 头部end -->
      <!-- 主显示框 -->
      <el-row class="airvehicle-panel">
          <el-row class="import-edit-title">报给单位</el-row>
          <el-row :gutter="30" class="pd-l-15 mg-b-10">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'海关关区':'海关关区：'" prop="cusCustomsCode">
                <el-select size="mini" v-model="submitData.cusCustomsCode" v-if="isEdit" style="width:100%;"
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
                <span v-else class="color-txt">{{submitData.cusCustomsCode}}-{{submitData.cusCustomsCodeValue}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="import-edit-title">航空器信息</el-row>
          <el-row :gutter="30" class="pd-l-15 mg-b-10">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'航空器注册编号':'航空器注册编号：'" prop="aircraftNo" :class="{'more-txt-lh': isEdit}">
                <el-input size="mini" v-model="submitData.aircraftNo" maxlength="25" clearable v-if="isEdit"></el-input>
                <span v-else class="color-txt">{{submitData.aircraftNo}}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'注册海关关区':'注册海关关区：'" prop="cusCustomsCodeReg" :class="{'more-txt-lh': isEdit}">
                <el-select size="mini" v-model="submitData.cusCustomsCodeReg" v-if="isEdit" style="width:100%;"
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
                <span v-else class="color-txt">{{submitData.cusCustomsCodeReg}}-{{submitData.cusCustomsCodeRegValue}}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'航空器备案类型':'航空器备案类型：'" prop="putrecAirType" :class="{'more-txt-lh': isEdit}">
                <el-select size="mini" v-model="submitData.putrecAirType" v-if="isEdit" clearable style="width:100%;">
                  <el-option v-for="item in putrecAirTypeList" :value="item.value" :label="item.text" :key="item.value"></el-option>
                </el-select>
                <span v-else class="color-txt">{{submitData.putrecAirType}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="import-edit-title">航班信息</el-row>
          <el-row :gutter="30" class="pd-l-15 mg-b-10">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'进港航班号':'进港航班号：'" prop="voyageOut">
                <el-input size="mini" clearable v-model="submitData.voyageOut" v-if="isEdit" maxlength="20"></el-input>
                <span v-else class="color-txt">{{submitData.voyageOut}}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'航班日期':'航班日期：'" prop="arrivalDate">
                <el-date-picker size="mini" v-model="submitData.arrivalDate" v-if="isEdit" type="date" style="width:100%"></el-date-picker>
                <span v-else class="color-txt">{{submitData.arrivalDate | date('yyyy-MM-dd')}}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'停机位':'停机位：'" prop="stayId">
                <el-input size="mini" v-model.number="submitData.stayId" clearable v-if="isEdit" maxlength="35"></el-input>
                <span v-else class="color-txt">{{submitData.stayId}}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'出发港':'出发港：'" prop="fromAirport">
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
              <el-form-item :label="isEdit?'目的港':'目的港：'" prop="toAirport">
                <el-select size="mini" v-model="submitData.toAirport" v-if="isEdit" style="width:100%;"
                  @focus="tipsFillMessage('portListA','SAAS_SW_AIRPORT_CODE')"
                  filterable remote default-first-option clearable
                  :remote-method="checkParamsList"
                  @change="checkParamsList">
                  <el-option
                    v-for="item in portListA"
                    :key="item.codeField"
                    :label="item.codeField+'-'+item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                <span v-else class="color-txt">{{submitData.toAirport}}-{{submitData.toAirportValue}}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isEdit?'离港时间':'离港时间：'" prop="departureDateTime">
                <el-date-picker size="mini"  v-model="submitData.departureDateTime" type="datetime" v-if="isEdit" style="width:100%"></el-date-picker>
                <span v-else class="color-txt">{{submitData.departureDateTime | date()}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="import-edit-title">备注信息</el-row>
          <el-row :gutter="30" class="pd-l-15">
            <el-col :span="24" v-if="isEdit">
              <el-form-item label="海关备注">
                <el-input type="textarea" rows="4" v-model="submitData.note" maxlength="200" v-if="isEdit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-else>
              <el-form-item label="备注：">
                <span class="break-text color-txt">{{submitData.note}}</span>
              </el-form-item>
            </el-col>
          </el-row>
      </el-row>
      <!-- 主显示框end -->
    </el-form>
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
        cusCustomsCode: [{ required: true, message: '请选择海关关区', trigger: 'change' }],
        aircraftNo: [{ required: true, message: '请输入航空器注册编号', trigger: 'blur' }],
        cusCustomsCodeReg: [{ required: true, message: '请选择注册海关关区', trigger: 'change' }],
        putrecAirType: [{ required: true, message: '请选择航空器备案类型', trigger: 'change' }],
        fromAirport: [{ required: true, message: '请选择出发港', trigger: 'change' }],
        toAirport: [{ required: true, message: '请选择目的港', trigger: 'change' }],
        voyageOut: [{ required: true, message: '请输入出港航班号', trigger: 'blur' }, { validator: validator.numEn, message: '请输入大写英文、数字', trigger: 'blur' }],
        arrivalDate: [{ required: true, message: '请选择航班日期', trigger: 'blur' }],
        stayId: [{ required: true, message: '请输入停机位', trigger: 'blur' }, {validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        departureDateTime: [{ required: true, message: '请选择离港时间', trigger: 'blur' }]
      },
      submitData: {
        aircraftNo: '',
        putrecAirType: '',
        fromAirport: '',
        toAirport: '',
        cusCustomsCode: '',
        cusCustomsCodeReg: '',
        voyageOut: '',
        arrivalDate: '',
        departureDateTime: '',
        note: ''
      }, // 查询传参
      putrecAirTypeList: [{
        value: '1',
        text: '航线航空器'
      }, {
        value: '2',
        text: '通用航空器'
      }], // 航空器备案类型
      cdsDclTypeList: [{
        value: '0601',
        text: '海关出境/港预报'
      }, {
        value: '0602',
        text: '海关出境/港确报'
      }], // 申报对象
      isEdit: true, // true 编辑 false 详情
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
      }, {
        obj: 'portListA',
        params: 'SAAS_SW_AIRPORT_CODE'
      }],
      portList: [], // 出发港数据
      portListA: [], // 目的港数据
      cusCustomsCodeList: [], // 海关关区数据
      cusCustomsCodeListA: [] // 注册海关关区数据
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
        this.portListA = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE')).slice(0, 30)
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
          this.portListA = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE')).slice(0, 30)
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
    // 暂存
    saveData () {
      this.$refs['submitData'].validate((valId) => {
        if (!valId) {
          return false
        }
        let data = util.simpleClone(this.submitData)
        if (this.submitData.cdsDclType instanceof Object) {
          data.cdsDclType = this.submitData.cdsDclType.value
          data.cdsDclTypeValue = this.submitData.cdsDclType.text
        }
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/common/saveCdsAirDeclareVO',
          data: data,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '暂存成功',
              type: 'success'
            })
            // this.getDetail()
            // this.$router.push({name: '出境、港动态申报'})
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
        url: 'API@/dec-common/cds/common/declareCdsAir',
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
    // 获取详情
    getDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/getCdsDeclare',
        data: {iprtTmpNO: this.$route.params.id},
        router: this.$router,
        success: (res) => {
          this.submitData = util.isEmpty(res.result) ? {} : res.result
          if (this.$route.params.type === 'edit') {
            this.submitData.putrecAirType = this.submitData.putrecAirType === '通用航空器' ? '2' : '1'
            this.submitData.cdsDclType = {
              text: this.submitData.cdsDclTypeValue,
              value: this.submitData.cdsDclType
            }
          }
          for (let i of this.selectList) {
            if (i.obj === 'cusCustomsCodeList') {
              this.selectObj = i
              this.checkParamsList(this.submitData.cusCustomsCode)
            } else if (i.obj === 'cusCustomsCodeListA') {
              this.selectObj = i
              this.checkParamsList(this.submitData.cusCustomsCodeReg)
            } else if (i.obj === 'portList') {
              this.selectObj = i
              this.checkParamsList(this.submitData.fromAirport)
            } else {
              this.selectObj = i
              this.checkParamsList(this.submitData.toAirport)
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
