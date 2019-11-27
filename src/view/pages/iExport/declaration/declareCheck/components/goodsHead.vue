<template>
  <section>
    <div>
      <el-row class='border-none'>
        <el-col :span="12">
          <span class='title-name'>统一编号:</span>
          <span class='content-font'>{{decHead.cusCiqNo ? decHead.cusCiqNo : decHead.seqNo}}</span>
        </el-col>
        <el-col :span="12">
          <span class='title-name'>海关编号:</span>
            <span class='content-font span-block'>{{decHead.entryId}}</span>
            <span class='content-font'>{{'(' + decHead.customMasterValue + ')'}}</span>
        </el-col>
      </el-row>
      <table>
        <tr>
          <checkItem :moduleName="moduleName"  colspan="3" :checkData="headConfig['goodsNote']">
            <span class='content-font'>{{decHead.noteS + decHead.markNo}}</span>
          </checkItem>
        </tr>
        <tr v-if="isImport">
          <checkItem :moduleName="moduleName"  :checkData="headConfig['purpose']" width="33%">
            <span class='content-font'>{{ '(' + decOther.purpose + ')'}}</span>
            <span class='content-font'>{{decOther.purposeValue}}</span>
          </checkItem>
          <checkItem :moduleName="moduleName"  :checkData="headConfig['cmplDschrgDt']" width="33%" :label="'卸毕日期:'" :disabled="disabledSpecialEle">
            <span class='content-font'>{{decHead.cmplDschrgDt}}</span>
          </checkItem>
          <checkItem :moduleName="moduleName"  :checkData="headConfig['blno']" width="34%" :label="'B/L号:'" :disabled="disabledSpecialEle">
            <span class='content-font'>{{decHead.blno}}</span>
          </checkItem>
        </tr>
        <tr v-else>
          <checkItem :moduleName="moduleName"  :checkData="headConfig['purpose']" width="33%">
            <span class='content-font'>{{ '(' + decOther.purpose + ')'}}</span>
            <span class='content-font'>{{decOther.purposeValue}}</span>
          </checkItem>
          <checkItem :moduleName="moduleName"  colspan="2" :checkData="headConfig['blno']" :label="'B/L号:'" width="67%" :disabled="disabledSpecialEle">
            <span class='content-font'>{{decHead.blno}}</span>
          </checkItem>
        </tr>
        <tr >
          <checkItem :moduleName="moduleName"  colspan="3" :checkData="headConfig['approveNo']">
            <span class='content-font'>{{decOther.approveNo}}</span>
          </checkItem>
        </tr>
        <tr >
          <checkItem :moduleName="moduleName"  colspan="3" :checkData="headConfig['originRelation']">
            <span class='content-font'>{{decOther.originRelation}}</span>
          </checkItem>
        </tr>
        <tr>
          <checkItem :moduleName="moduleName"  :checkData="headConfig['billNo']" :label="'提单号:'" :disabled="disabledSpecialEle">
            <span class='content-font'>{{decHead.billNo}}</span>
          </checkItem>
          <checkItem :moduleName="moduleName"  :checkData="headConfig['voyageNo']">
            <span class='content-font'>{{decHead.voyageNo}}</span>
          </checkItem>
          <checkItem :moduleName="moduleName"  :checkData="headConfig['trafName']">
            <span class='content-font'>{{decHead.trafName}}</span>
          </checkItem>
        </tr>
      </table>
    </div>
    <div class='tips'>
      <span class='title-name'>tips: 总价</span>
      <span class='content-font'>{{decOther.totalPrice}}</span>
      <span class='title-name'>,成交数量合计</span>
      <span class='content-font'>{{decOther.gQtyTotal}}</span>
      <span class='title-name'>法定数量合计</span>
      <span class='content-font'>{{decOther.gQty1Total}}</span>
      <span class='title-name'>第二数量合计</span>
      <span class='content-font'>{{decOther.gQty2Total}}</span>
    </div>
  </section>
</template>
<script>
import checkItem from '../common/checkItem'
// import { mapState } from 'vuex'

export default {
  props: {
    // 是否是进口
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
  computed: {
    isImport () {
      return this.$store.state[this.moduleName].isImport
    },
    isLook () {
      return this.$store.state[this.moduleName].isLook
    }
  },
  components: {
    checkItem
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
