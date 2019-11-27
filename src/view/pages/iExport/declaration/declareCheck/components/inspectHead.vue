<template>
  <div v-if = "isImport">
    <table>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['orgCode']">
          <span class='content-font'>{{"(" + decHead.orgCode + ")"}}</span>
          <p class='content-font'>{{decHead.orgCodeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['vsaOrgCode']">
          <span class='content-font'>{{"(" + decHead.vsaOrgCode + ")"}}</span>
          <p class='content-font'>{{decHead.vsaOrgCodeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['inspOrgCode']">
          <span class='content-font'>{{"(" + decHead.inspOrgCode + ")"}}</span>
          <p class='content-font'>{{decHead.inspOrgCodeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['despDate']">
          <p class='content-font'>{{decHead.despDate}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['blno']" :disabled="disabledSpecialEle">
          <p class='content-font'>{{decHead.blno}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="2" rowspan = '2' :checkData="headConfig['purpOrgCode']">
          <span class='content-font'>{{"(" + decHead.purpOrgCode + ")"}}</span>
          <p  class='content-font'>{{decHead.purpOrgCodeValue}}</p>
          <p  class='content-font'></p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="4" rowspan = '2' :checkData="headConfig['correlationaNo']">
          <p class='content-font'>{{decHead.correlationReasonFlag + '/' + decHead.correlationReasonFlagValue}}</p>
          <p  class='content-font'></p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="4" :checkData="headConfig['origBoxFlag']">
          <span class='content-font'>{{"(" + decHead.origBoxFlag + ")"}}</span>
          <p class='content-font'>{{decHead.origBoxFlag == '0' ? '否' : '是'}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="4" :checkData="headConfig['specialFlag']">
          <span class='content-font'>{{decOther.specialFlag}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="10" :checkData="headConfig['companyCer']">
          <span class='content-font'>{{decOther.companyCer}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="10" :checkData="headConfig['userInfo']">
          <span class='content-font'>{{decOther.userInfo}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="10" :checkData="headConfig['inspDecElem']">
          <span class='content-font'>{{decOther.inspDecElem}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="5" :checkData="headConfig['domesticConsigneeEname']">
          <span class='content-font'>{{decHead.domesticConsigneeEname}}</span>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="5" :checkData="headConfig['overseasConsignorCname']">
          <span class='content-font'>{{decHead.overseasConsignorCname}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="5" :checkData="headConfig['overseasConsignorAddr']">
          <span class='content-font'>{{decHead.overseasConsignorAddr}}</span>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="5" :checkData="headConfig['cmplDschrgDt']" :disabled="disabledSpecialEle">
          <span class='content-font'>{{decHead.cmplDschrgDt}}</span>
        </checkItem>
      </tr>
    </table>
  </div>
  <div v-else>
    <table>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['orgCode']">
          <span class='content-font'>{{"(" + decHead.orgCode + ")"}}</span>
          <p class='content-font'>{{decHead.orgCodeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['vsaOrgCode']">
          <span class='content-font'>{{"(" + decHead.vsaOrgCode + ")"}}</span>
          <p class='content-font'>{{decHead.vsaOrgCodeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['inspOrgCode']">
          <span class='content-font'>{{"(" + decHead.inspOrgCode + ")"}}</span>
          <p class='content-font'>{{decHead.inspOrgCodeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" rowspan = '2' :checkData="headConfig['purpOrgCode']">
          <span class='content-font'>{{"(" + decHead.purpOrgCode + ")"}}</span>
          <p  class='content-font'>{{decHead.purpOrgCodeValue}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="4" rowspan = '2' :checkData="headConfig['correlationaNo']">
          <p class='content-font'>{{decHead.correlationReasonFlag + '/' + decHead.correlationReasonFlagValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="4" :checkData="headConfig['specialFlag']">
          <span class='content-font'>{{decOther.specialFlag}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="10" :checkData="headConfig['companyCer']">
          <span class='content-font'>{{decOther.companyCer}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="10" :checkData="headConfig['inspDecElem']">
          <span class='content-font'>{{decOther.inspDecElem}}</span>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  colspan="5" :checkData="headConfig['domesticConsigneeEname']">
          <span class='content-font'>{{decHead.domesticConsigneeEname}}</span>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="5" :checkData="headConfig['overseasConsignorCname']">
          <span class='content-font'>{{decHead.overseasConsignorCname}}</span>
        </checkItem>
      </tr>
    </table>
  </div>
</template>
<script>
import checkItem from '../common/checkItem'
// import { mapState } from 'vuex'

export default {
  props: {
    headConfig: {
      type: Object
    },
    decHead: {
      type: Object
    },
    decOther: {
      type: Object
    },
    disabledSpecialEle: {
      type: Boolean
    },
    moduleName: {
      type: String
    }
  },
  components: {
    checkItem
  },
  computed: {
    isImport () {
      return this.$store.state[this.moduleName].isImport
    },
    isLook () {
      return this.$store.state[this.moduleName].isLook
    }
  },
  data () {
    return {

    }
  },
  methods: {
    syncSameSetting (field) {
      this.$emit('syncSetting', {field: field, config: this.headConfig[field]})
    }
  }
}
</script>
<style scoped lang="less">
  table,table tr th, table tr td { border:1px solid #e4eaec; }
  table { width: 100%; min-height: 25px; line-height: 25px; text-align: left; border-collapse: collapse;}
  table th {
    padding: 0px;
    font-size: 12px;
    color: white;
    background-color: #64A7EB;
    border-right-color: #e4eaec;
    height: 20px;
    vertical-align: middle;
  }
  .content-font{
    font-size: 13px;
    height: 25px;
    width: 100%;
    margin-block-start: 0;
    margin-block-end: 0;
  }
</style>
