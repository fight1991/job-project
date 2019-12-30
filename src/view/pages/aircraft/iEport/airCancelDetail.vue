<template>
  <section class='sys-main' style="padding:0 20px;">
    <el-row>
      <el-form :model="submitData" size="mini" :label-width="isDetail?'104px':'90px'" :rules="rules" ref="submitData">
        <el-row :gutter="30" class="pd-l-15">
          <el-col :span="12">
            <el-form-item :label="isDetail?'进出口标识：':'进出口标识'" prop="ioFlag">
              <el-select v-model="submitData.ioFlag" clearable filterable v-if="!isDetail" style="width:100%;">
                <el-option value="O" label="出口" key="O"></el-option>
                <el-option value="I" label="进口" key="I"></el-option>
              </el-select>
              <span v-else class="color-txt">{{submitData.ioFlag=='O'?'出口':'进口'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="isDetail?'航班号：':'航班号'" prop="voyageOut">
              <el-input v-model="submitData.voyageOut" clearable maxlength="20" v-if="!isDetail"></el-input>
              <span v-else class="color-txt"><span v-if="submitData.ioFlag =='O'">{{submitData.voyageOut}}</span><span v-else>{{submitData.voyageIn}}</span></span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="isDetail?'航班日期：':'航班日期'" prop="arrivalDate">
              <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="submitData.arrivalDate" v-if="!isDetail" style="width:100%"></el-date-picker>
              <span v-else class="color-txt">{{submitData.arrivalDate | date()}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="isDetail?'取消港关区：':'取消港关区'" prop="cusCustomsCode">
              <el-select size="mini" v-model="submitData.cusCustomsCode" v-if="!isDetail" style="width:100%;"
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
          <el-col :span="24">
            <el-form-item :label="isDetail?'取消港：':'取消港'" prop="fromAirport">
              <el-select size="mini" v-model="submitData.fromAirport" v-if="!isDetail" style="width:100%;"
                @focus="tipsFillMessage('portList','SAAS_SW_AIRPORT_CNCODE')"
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
              <span v-else class="color-txt"><span v-if="submitData.ioFlag =='O'">{{submitData.fromAirport}}-{{submitData.fromAirportValue}}</span><span v-else>{{submitData.toAirport}}-{{submitData.toAirportValue}}</span></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30" class="pd-l-15 mg-b-10">
          <el-col :span="24">
            <el-form-item :label="isDetail?'取消原因：':'取消原因'">
              <el-input maxlength="200" v-model="submitData.note" v-if="!isDetail"></el-input>
              <span v-else class="break-text color-txt">{{submitData.note}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style="text-align:center;" v-if="!isDetail">
      <el-button type="primary" size="mini" class="primary-btn" @click="confirm">确定</el-button>
      <el-button size="mini" class="default-btn" @click="close">取消</el-button>
    </el-row>
  </section>
</template>
<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
import validator from '@/common/validator'
export default {
  data () {
    return {
      isDetail: false, // 是否是详情
      submitData: {
        ioFlag: '',
        voyageIn: '',
        voyageOut: '',
        arrivalDate: '',
        fromAirport: '',
        toAirport: '',
        cusCustomsCode: '',
        note: '',
        cdsDclType: '0603'
      },
      rules: {
        ioFlag: [{ required: true, message: '请选择进出口标识', trigger: 'change' }],
        voyageOut: [{ required: true, message: '请输入航班号', trigger: 'blur' }, { validator: validator.numEn, message: '请输入大写英文、数字', trigger: 'blur' }],
        arrivalDate: [{ required: true, message: '请选择航班日期', trigger: 'change' }],
        fromAirport: [{ required: true, message: '请选择取消港', trigger: 'change' }],
        cusCustomsCode: [{ required: true, message: '请选择取消港关区', trigger: 'change' }]
      },
      tableNameList: {
        tableNames: [
          'SAAS_CUSTOMS_REL', // 海关关区
          'SAAS_SW_AIRPORT_CNCODE' // 港口
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
        params: 'SAAS_SW_AIRPORT_CNCODE'
      }],
      cusCustomsCodeList: [], // 海关关区数据
      portList: []
    }
  },
  props: {
    type: {
      type: String,
      default: 'add'
    },
    id: {
      type: String,
      default: ''
    }
  },
  created () {
    this.getCommonParam()
    if (this.type === 'detail') {
      this.getDetail()
      this.isDetail = true
    } else if (this.type === 'edit') {
      this.getDetail()
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
        this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
        this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CNCODE')).slice(0, 30)
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
          this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
          this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CNCODE')).slice(0, 30)
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
    // 关闭
    close () {
      this.$emit('close')
    },
    // 暂存
    confirm () {
      this.$refs['submitData'].validate((valId) => {
        if (!valId) {
          return false
        }
        let data = util.simpleClone(this.submitData)
        if (this.submitData.ioFlag === 'I') {
          data.voyageIn = this.submitData.voyageOut
          data.voyageOut = ''
          data.toAirport = this.submitData.fromAirport
          data.fromAirport = ''
          data.cdsDclType = '0403'
        } else {
          data.voyageIn = ''
          data.voyageOut = this.submitData.voyageOut
          data.toAirport = ''
          data.fromAirport = this.submitData.fromAirport
          data.cdsDclType = '0603'
        }
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/common/saveCdsCancelVO',
          data: data,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '暂存成功',
              type: 'success'
            })
            this.close()
          }
        })
      })
    },
    // 获取详情
    getDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/getCdsCancel',
        data: {iprtTmpNO: this.id},
        router: this.$router,
        success: (res) => {
          this.submitData = util.isEmpty(res.result) ? {} : res.result
          if (this.submitData.ioFlag === 'O') {
            this.submitData.voyageOut = res.result.voyageOut
            this.submitData.fromAirport = res.result.fromAirport
            for (let i of this.selectList) {
              if (i.obj === 'cusCustomsCodeList') {
                this.selectObj = i
                this.checkParamsList(this.submitData.cusCustomsCode)
              } else {
                this.selectObj = i
                this.checkParamsList(this.submitData.fromAirport)
              }
            }
          } else {
            this.submitData.voyageOut = res.result.voyageIn
            this.submitData.fromAirport = res.result.toAirport
            for (let i of this.selectList) {
              if (i.obj === 'cusCustomsCodeList') {
                this.selectObj = i
                this.checkParamsList(this.submitData.cusCustomsCode)
              } else {
                this.selectObj = i
                this.checkParamsList(this.submitData.toAirport)
              }
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
