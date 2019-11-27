<template>
  <div>
    <el-row class='border-none'>
      <el-col :span="12">
        <span class='title-name'>预录入编号:</span>
        <span class='content-font'>{{decHead.cusCiqNo ? decHead.cusCiqNo : decHead.seqNo}}</span>
      </el-col>
      <el-col :span="12">
        <span class='title-name'>海关编号:</span>
          <span class='content-font span-block'>{{decHead.entryId}}</span>
          <span class='content-font'>{{'(' + (decHead.customMasterValue || '') + ')'}}</span>
      </el-col>
    </el-row>
    <table>
      <tr>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['tradeCoScc']" width="25%">
          <span class='content-font'>{{"(" + (decHead.tradeCoScc || "") + ")"}}</span>
          <p class='content-font'>{{decHead.tradeName}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['iEPort']" colspan="2" width="20%">
          <span class='content-font'>{{"(" + (decHead.iEPort || "") + ")"}}</span>
          <p class='content-font'>{{decHead.iEPortValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['iEDate']" colspan="2" width="20%">
          <p class='content-font'>{{decHead.iEDate}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['dDate']" width="15%">
          <p class='content-font'>{{decHead.dDate}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['manualNo']" colspan="2" width="20%">
          <p class='content-font'>{{decHead.manualNo}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName" v-if="isImport" :isImport="isImport" :checkData="headConfig['overseasConsignorCode']" width="25%">
          <span >{{"(" + (decHead.overseasConsignorCode|| "") + ")"}}</span>
          <p>{{decHead.overseasConsignorEname}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" v-if="!isImport" :isImport="isImport" :checkData="headConfig['overseasConsigneeCode']" width="25%">
          <span>{{"(" + (decHead.overseasConsigneeCode|| "") + ")"}}</span>
          <p>{{decHead.overseasConsigneeEname}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" :isImport="isImport" :checkData="headConfig['trafMode']">
          <span class='content-font'>{{"(" + (decHead.trafMode|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.trafModeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" :isImport="isImport" :checkData="headConfig['nameVo']">
          <p class='content-font'>{{(decHead.trafName && decHead.voyageNo) ? (decHead.trafName + '/' + decHead.voyageNo) : (decHead.trafName || decHead.voyageNo)}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" :colspan="isImport?1:3" :isImport="isImport" :checkData="headConfig['billNo']" :disabled="disabledSpecialEle">
          <p class='content-font'>{{decHead.billNo}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" v-if="isImport" :isImport="isImport" :checkData="headConfig['goodSplace']">
          <p class='content-font'>{{decHead.goodSplace}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['ownerCodeScc']">
          <span class='content-font'>{{"(" + (decHead.ownerCodeScc|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.ownerName}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" :isImport="isImport" :checkData="headConfig['tradeMode']">
          <span class='content-font'>{{"(" + (decHead.tradeMode|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.tradeModeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" :isImport="isImport" :checkData="headConfig['cutMode']">
          <span class='content-font'>{{"("+ (decHead.cutMode|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.cutModeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" :colspan="isImport?1:3" :isImport="isImport" :checkData="headConfig['licenseNo']">
          <p class='content-font'>{{decHead.licenseNo}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" v-if="isImport" :isImport="isImport" :checkData="headConfig['despPortCode']">
          <span class='content-font'>{{"("+ (decHead.despPortCode|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.despPortCodeValue}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['contrNo']">
          <p class='content-font'>{{decHead.contrNo}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" :isImport="isImport" :checkData="headConfig['tradeAreaCode']">
          <span class='content-font'>{{"(" + (decHead.tradeAreaCode|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.tradeAreaCodeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" colspan="2" :isImport="isImport" :checkData="headConfig['tradeCountry']">
          <span class='content-font'>{{"(" + (decHead.tradeCountry|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.tradeCountryValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  :isImport="isImport" :checkData="headConfig['distinatePort']">
          <span class='content-font'>{{"(" + (decHead.distinatePort|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.distinatePortValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  colspan="2" :isImport="isImport" :checkData="headConfig['entyPortCode']">
          <span class='content-font'>{{"(" + (decHead.entyPortCode|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.entyPortCodeValue}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName"  :isImport="isImport" :checkData="headConfig['wrapType']">
          <span class='content-font'>{{"(" + (decHead.wrapType|| "") + ")" }}</span>
          <p class='content-font'>{{decHead.wrapTypeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  width= "10%" :isImport="isImport" :checkData="headConfig['packNo']">
          <p class='content-font'>{{decHead.packNo}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  width= "10%" :isImport="isImport" :checkData="headConfig['grossWt']">
          <p class='content-font'>{{decHead.grossWt}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  width= "10%" :isImport="isImport" :checkData="headConfig['netWt']">
          <p class='content-font'>{{decHead.netWt}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  width= "10%" :isImport="isImport" :checkData="headConfig['transMode']">
          <span class='content-font'>{{"(" + (decHead.transMode|| "") + ")"}}</span>
          <p class='content-font'>{{decHead.transModeValue}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" :isImport="isImport" :checkData="headConfig['feeMark']">
          <p class='content-font'>{{format(decHead.feeCurr, decHead.feeRate, decHead.feeMark)}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName" width= "10%" :isImport="isImport" :checkData="headConfig['insurMark']">
          <p class='content-font'>{{format(decHead.insurCurr, decHead.insurRate, decHead.insurMark)}}</p>
        </checkItem>
        <checkItem :moduleName="moduleName"  width= "10%" :isImport="isImport" :checkData="headConfig['otherMark']">
          <p class='content-font'>{{format(decHead.otherCurr, decHead.otherRate, decHead.otherMark)}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName" colspan="14" :isImport="isImport" :checkData="headConfig['docuAndcertCode']">
          <p class='content-font'>{{decOther.docuAndcertCode}}</p>
        </checkItem>
      </tr>
      <tr>
        <checkItem :moduleName="moduleName" colspan="14" :isImport="isImport" :checkData="headConfig['note']">
          <p class='content-font'>{{decOther.note}}</p>
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
    },
    format (arg1, arg2, arg3) {
      let d = [arg1, arg2, arg3]
      let str = ''
      d.forEach((e, i) => {
        if (e) str += i === d.length - 1 ? `${e}` : `${e}/`
      })
      return str
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
  .title-name{
    font-weight: bold
  }
  .content-font{
    font-size: 13px;
    height: 25px;
    width: 100%;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-left: 5px;
  }
  .span-block {
    width:150px;
    display: inline-block;
  }
</style>
