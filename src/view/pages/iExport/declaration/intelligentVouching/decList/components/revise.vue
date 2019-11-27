<template>
<!--量修改  组件-->
  <section class="sys-dec-class">
    <el-form :model="decList" label-width="100px" size="mini" @keyup.enter.native="switchFoucsByEnter">
      <table border="1" class="form-table">
        <tr>
          <td width="30px" style="text-align:center;"><el-checkbox dataRef="checkbox" v-model="checkList.tradeCurr"></el-checkbox></td>
          <td width="110px" class="form-table-txt">币制</td>
          <td>
            <el-select placeholder=" " v-model="decList.tradeCurr" size="mini"
              @focus="tipsFillMessage('','saasCurr','SAAS_CURR')"
              remote  filterable default-first-option
              :remote-method="checkParamsList">
              <el-option
                v-for="item in saasCurr"
                :key="item.codeField"
                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                :value="item.codeField">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td width="30px" style="text-align:center;"><el-checkbox dataRef="checkbox" v-model="checkList.originCountry"></el-checkbox></td>
          <td width="110px" class="form-table-txt">原产国(地区)</td>
          <td>
            <el-select placeholder=" " v-model="decList.originCountry" size="mini"
              @focus="tipsFillMessage('','saasCountry','SAAS_COUNTRY')"
              remote  filterable default-first-option
              :remote-method="checkParamsList">
              <el-option
                v-for="item in saasCountry"
                :key="item.codeField"
                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                :value="item.codeField">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td width="30px" style="text-align:center;"><el-checkbox v-model="checkList.destinationCountry"></el-checkbox></td>
          <td width="110px" class="form-table-txt">最终目的国(地区)</td>
          <td>
            <el-select placeholder=" " v-model="decList.destinationCountry" size="mini"
              @focus="tipsFillMessage('','saasCountry1','SAAS_COUNTRY')"
              remote  filterable default-first-option
              :remote-method="checkParamsList">
              <el-option
                v-for="item in saasCountry1"
                :key="item.codeField"
                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                :value="item.codeField">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td width="30px" style="text-align:center;"><el-checkbox v-model="checkList.districtCode"></el-checkbox></td>
          <td width="110px" class="form-table-txt">{{decParams.iEFlag == 'I' ? '境内目的地' :'境内货源地'}}</td>
          <td>
            <el-select v-model="decList.districtCode" placeholder=" " size="mini"
              @focus="tipsFillMessage('','saasDistrictRel','SAAS_DISTRICT_REL')"
              remote  filterable default-first-option
              :remote-method="checkParamsList">
              <el-option
                v-for="item in saasDistrictRel"
                :key="item.codeField"
                :label="item.codeField + ' ' + item.nameField"
                :value="item.codeField">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td width="30px" style="text-align:center;"><el-checkbox v-model="checkList.destCode"></el-checkbox></td>
          <td width="110px" class="form-table-txt">{{decParams.iEFlag == 'I' ?  '目的地代码' : '产地代码'}}</td>
          <td>
            <el-select v-model="decList.destCode" placeholder=" " size="mini"
              @focus="tipsFillMessage('','saasCiqCityCn','SAAS_CIQ_CITY_CN')"
              remote  filterable default-first-option
              :remote-method="checkParamsList">
              <el-option
                v-for="item in saasCiqCityCn"
                :key="item.codeField"
                :label="item.codeField + ' ' + item.nameField"
                :value="item.codeField">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td width="30px" style="text-align:center;"><el-checkbox v-model="checkList.dutyMode"></el-checkbox></td>
          <td width="110px" class="form-table-txt">征免方式</td>
          <td>
            <el-select placeholder=" " v-model="decList.dutyMode" size="mini"
              @focus="tipsFillMessage('','saasLevymode','SAAS_LEVYMODE')"
              remote  filterable default-first-option
              :remote-method="checkParamsList">
              <el-option
                v-for="item in saasLevymode"
                :key="item.codeField"
                :label="item.codeField + ' ' + item.nameField"
                :value="item.codeField">
              </el-option>
            </el-select>
          </td>
        </tr>
      </table>
    </el-form>
    <!-- <div class="tableborder">
        <el-row>
          <el-col :span="24">
            <el-form-item label="币制">
              <el-select placeholder=" " v-model="decList.tradeCurr"
                @focus="tipsFillMessage('','saasCurr','SAAS_CURR')"
                remote  filterable default-first-option
                :remote-method="checkParamsList">
                <el-option
                  v-for="item in saasCurr"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" >
            <el-form-item label="原产国(地区)">
              <el-select placeholder=" " v-model="decList.originCountry"
                @focus="tipsFillMessage('','saasCountry','SAAS_COUNTRY')"
                remote  filterable default-first-option
                :remote-method="checkParamsList">
                <el-option
                  v-for="item in saasCountry"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" >
            <el-form-item label="最终目的国(地区)">
              <el-select placeholder=" " v-model="decList.destinationCountry"
                @focus="tipsFillMessage('','saasCountry1','SAAS_COUNTRY')"
                remote  filterable default-first-option
                :remote-method="checkParamsList">
                <el-option
                  v-for="item in saasCountry1"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="decParams.iEFlag == 'I' ? '境内目的地' :'境内货源地'">
              <el-select v-model="decList.districtCode" placeholder=" "
                @focus="tipsFillMessage('','saasDistrictRel','SAAS_DISTRICT_REL')"
                remote  filterable default-first-option
                :remote-method="checkParamsList">
                <el-option
                  v-for="item in saasDistrictRel"
                  :key="item.codeField"
                  :label="item.codeField + ' ' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="decParams.iEFlag == 'I' ?  '目的地代码' : '产地代码'">
              <el-select v-model="decList.destCode" placeholder=" "
                @focus="tipsFillMessage('','saasCiqCityCn','SAAS_CIQ_CITY_CN')"
                remote  filterable default-first-option
                :remote-method="checkParamsList">
                <el-option
                  v-for="item in saasCiqCityCn"
                  :key="item.codeField"
                  :label="item.codeField + ' ' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="征免方式">
              <el-select placeholder=" " v-model="decList.dutyMode"
               @focus="tipsFillMessage('','saasLevymode','SAAS_LEVYMODE')"
                remote  filterable default-first-option
                :remote-method="checkParamsList">
                <el-option
                  v-for="item in saasLevymode"
                  :key="item.codeField"
                  :label="item.codeField + ' ' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
    </div> -->
    <div slot="footer"  class="sys-dialog-footer text-center">
      <el-button class='dialog-primary-btn' @click="submitdataBth">确定</el-button>
      <el-button class='dialog-btn' @click="closereviseBth">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import decUtil from '../../common/decUtil'
export default {
  name: 'revise',
  props: {
    // 下拉参数
    decParams: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      decList: {
        tradeCurr: '', // 币制代码
        tradeCurrValue: '', // 币制名称
        originCountry: '', // 原产国代码
        originCountryValue: '', // 原产国名称
        destinationCountry: '', // 最终目的国(地区)代码
        destinationCountryValue: '', // 最终目的国(地区)名称
        districtCode: '', // 境内目的地代码
        destCode: '', // '目的地代码' : '产地代码'
        dutyMode: '', // 征免方式代码
        dutyModeValue: '' // 征免方式名称
      },
      saasCurr: [], // 币制
      saasCountry: [], // 原产国(地区)
      saasCountry1: [], // 最终目的国
      saasDistrictRel: [], // 境内目的地' :'境内货源地
      saasLevymode: [], // 征免方式
      saasCiqCityCn: [], // '目的地代码' : '产地代码'
      selectObj: {
        obj: '',
        params: ''
      },
      bodySelect: {
        'tradeCurr': {obj: 'saasCurr', params: 'SAAS_CURR'}, // 币制
        'destinationCountry': {obj: 'saasCountry1', params: 'SAAS_COUNTRY'}, // 最终目的国(地区)
        'originCountry': {obj: 'saasCountry', params: 'SAAS_COUNTRY'}, // 原产国(地区)
        'districtCode': {obj: 'saasDistrictRel', params: 'SAAS_DISTRICT_REL'}, // '境内目的地' :'境内货源地'
        'destCode': {obj: 'saasCiqCityCn', params: 'SAAS_CIQ_CITY_CN'}, // '目的地代码' : '境内货源地代码'
        'dutyMode': {obj: 'saasLevymode', params: 'SAAS_LEVYMODE'} // 征免方式
      },
      checkList: {
        tradeCurr: false,
        destinationCountry: false,
        originCountry: false,
        districtCode: false,
        destCode: false,
        dutyMode: false
      }
    }
  },
  mounted () {
    this.initForm()
  },
  methods: {
    initForm () {
      this.decList = {
        tradeCurr: '', // 币制代码
        tradeCurrValue: '', // 币制名称
        originCountry: '', // 原产国代码
        originCountryValue: '', // 原产国名称
        destinationCountry: '', // 最终目的国(地区)代码
        destinationCountryValue: '', // 最终目的国(地区)名称
        districtCode: '', // 境内目的地代码
        destCode: '', // '目的地代码' : '产地代码'
        dutyMode: '', // 征免方式代码
        dutyModeValue: '' // 征免方式名称
      }
      this.decList = this.decParams.checkForm
      decUtil.initSelect(this, this.bodySelect, this.decList)
    },
    // 币制 code 转 name
    tradeCurrChangeName () {
      let saasCurr = JSON.parse(window.localStorage.getItem('SAAS_CURR'))
      for (let i in saasCurr) {
        if (saasCurr[i].codeField === this.decList.tradeCurr) {
          this.decList.tradeCurrValue = saasCurr[i].nameField
          break
        }
      }
    },
    // 原产地国（地区） code 转 name
    originCountryChangeName () {
      let saasCountry = JSON.parse(window.localStorage.getItem('SAAS_COUNTRY'))
      for (let i in saasCountry) {
        if (saasCountry[i].codeField === this.decList.originCountry) {
          this.decList.originCountryValue = saasCountry[i].nameField
          break
        }
      }
    },
    // 最终目的国（地区） code 转 name
    destinationCountryChangeName () {
      let saasCountry = JSON.parse(window.localStorage.getItem('SAAS_COUNTRY'))
      for (let i in saasCountry) {
        if (saasCountry[i].codeField === this.decList.destinationCountry) {
          this.decList.destinationCountryValue = saasCountry[i].nameField
          break
        }
      }
    },
    // 征免方式 code 转 name
    dutyModeChangeName () {
      let saasLevymode = JSON.parse(window.localStorage.getItem('SAAS_LEVYMODE'))
      for (let i in saasLevymode) {
        if (saasLevymode[i].codeField === this.decList.dutyMode) {
          this.decList.dutyModeValue = saasLevymode[i].nameField
          break
        }
      }
    },
    // 确认
    submitdataBth () {
      this.tradeCurrChangeName()
      this.originCountryChangeName()
      this.dutyModeChangeName()
      this.destinationCountryChangeName()
      this.$emit('close:reviseView', {
        tradeCurr: this.decList.tradeCurr,
        tradeCurrValue: this.decList.tradeCurrValue,
        originCountry: this.decList.originCountry,
        originCountryValue: this.decList.originCountryValue,
        districtCode: this.decList.districtCode,
        destCode: this.decList.destCode,
        dutyMode: this.decList.dutyMode,
        dutyModeValue: this.decList.dutyModeValue,
        destinationCountry: this.decList.destinationCountry,
        destinationCountryValue: this.decList.destinationCountryValue,
        checkList: this.checkList
      })
    },
    // 取消
    closereviseBth () {
      this.$emit('close:reviseView', null)
    },
    // 当前下拉框的加载参数和参数表
    tipsFillMessage (value, obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 远程搜索
    checkParamsList (query) {
      let keyValue = query.trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      let filterList = []
      if (util.isEmpty(keyValue)) {
        this[this.selectObj.obj] = list.slice(0, 10)
      } else {
        filterList = list.filter(item => {
          let str = ''
          if (['SAAS_COUNTRY', 'SAAS_CURR'].includes(this.selectObj.params)) {
            str = item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField
          } else {
            str = item.codeField + '-' + item.nameField
          }
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        this[this.selectObj.obj] = filterList.slice(0, 10)
      }
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      decUtil.switchFoucsByEnter(e, this.foucsByEnter)
    },
    foucsByEnter (e, next, secondNext) {
      // 下个元素存在
      if (next) {
        if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
          return false
        } else {
          next.focus()
          next.select()
        }
      } else {
        this.submitdataBth()
      }
    }
  }
}
</script>

<style scoped lang="less">
.tableborder{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
 }
 .el-select-dropdown__item.selected {
        background: #0080ff;
        color: #ffffff;
    }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      background: #dbed8a;
      font-weight: bold;
  }
  .el-select-dropdown__item {
      font-size: 12px;
      padding: 0 15px;
      height: 22px;
      line-height: 22px;
      border: #c0c0c0 solid 1px;
  }
  .el-select-dropdown__list {
        padding: 0;
    }
  .text-center {
    text-align: center;
  }
</style>
