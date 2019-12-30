<template>
  <table>
    <tr>
      <td width='10%'>
        <span class='title-name'>{{itemConfig['gNo'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('gNo')" width='10%' :checkData="itemConfig['gNo']" :isShowLabel="false">
        <span class='content-font' :style="listItem.gNo?'':'color：#CCC'">{{listItem.gNo || '暂无'}}</span>
      </checkItem>
      <td  width='10%'>
        <span class='title-name'>{{itemConfig['contrItem'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('contrItem')" width='10%' :checkData="itemConfig['contrItem']" :isShowLabel="false">
        <span class='content-font'>{{listItem.contrItem}}</span>
      </checkItem>
      <td  width='10%'>
        <span class='title-name'>{{itemConfig['codeTs'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('codeTs')" width='10%' :checkData="itemConfig['codeTs']" :isShowLabel="false">
        <span class='content-font'>{{listItem.codeTs}}</span>
      </checkItem>
      <td  width='10%'>
        <span class='title-name'>{{itemConfig['ciqName'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('ciqName')" colspan='3' :checkData="itemConfig['ciqName']" :isShowLabel="false">
        <span class='content-font'>{{listItem.ciqName}}</span>
      </checkItem>
    </tr>
    <tr>
      <td >
        <span class='title-name'>{{itemConfig['gName'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('gName')"  colspan='5' :checkData="itemConfig['gName']" :isShowLabel="false">
         <span class='content-font'>{{listItem.gName}}</span>
      </checkItem>
      <td >
        <span class='title-name'>{{itemConfig['gModel'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('gModel')"  colspan='5' :checkData="itemConfig['gModel']" :isShowLabel="false">
         <span class='content-font'>{{listItem.gModel}}</span>
      </checkItem>
    </tr>
    <tr>
      <td>
        <span class='title-name'>{{itemConfig['gQty'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('gQty')" :checkData="itemConfig['gQty']" :isShowLabel="false">
         <span class='content-font'>{{listItem.gQty}}</span>
      </checkItem>
      <td>
        <span class='title-name'>{{itemConfig['gUnit'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('gUnit')" :checkData="itemConfig['gUnit']" :isShowLabel="false">
         <span class='content-font'>{{listItem.gUnitValue}}</span>
      </checkItem>
      <td>
        <span class='title-name'>{{itemConfig['declPrice'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('declPrice')" :checkData="itemConfig['declPrice']" :isShowLabel="false">
         <span class='content-font'>{{listItem.declPrice}}</span>
      </checkItem>
      <td width='10%'>
        <span class='title-name'>{{itemConfig['declTotal'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('declTotal')" width='10%' :checkData="itemConfig['declTotal']" :isShowLabel="false">
         <span class='content-font'>{{listItem.declTotal}}</span>
      </checkItem>
      <td width='10%'>
        <span class='title-name'>{{itemConfig['tradeCurr'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('tradeCurr')" width='10%' :checkData="itemConfig['tradeCurr']" :isShowLabel="false">
         <span class='content-font'>{{listItem.tradeCurrValue}}</span>
      </checkItem>
    </tr>
    <tr>
      <td>
        <span class='title-name'>{{itemConfig['qty1'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('qty1')" width='10%' :checkData="itemConfig['qty1']" :isShowLabel="false">
         <span class='content-font'>{{listItem.qty1}}</span>
      </checkItem>
      <td>
        <span class='title-name'>{{itemConfig['unit1'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('unit1')" :checkData="itemConfig['unit1']" :isShowLabel="false">
         <span class='content-font'>{{listItem.unit1Value}}</span>
      </checkItem>
      <td >
        <span class='title-name'>{{itemConfig['exgVersion'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('exgVersion')" :checkData="itemConfig['exgVersion']" :isShowLabel="false">
         <span class='content-font'>{{listItem.exgVersion}}</span>
      </checkItem>
      <td >
        <span class='title-name'>{{itemConfig['exgNo'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('exgNo')" :checkData="itemConfig['exgNo']" :isShowLabel="false">
         <span class='content-font'>{{listItem.exgNo}}</span>
      </checkItem>
      <td >
        <span class='title-name'>{{itemConfig['destinationCountry'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('destinationCountry')" :checkData="itemConfig['destinationCountry']" :isShowLabel="false">
         <span class='content-font'>{{listItem.destinationCountryValue}}</span>
      </checkItem>
    </tr>
    <tr>
      <td >
        <span class='title-name'>{{itemConfig['qty2'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('qty2')" :checkData="itemConfig['qty2']" :isShowLabel="false">
         <span class='content-font'>{{listItem.qty2}}</span>
      </checkItem>
      <td >
        <span class='title-name'>{{itemConfig['unit2'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('unit2')" :checkData="itemConfig['unit2']" :isShowLabel="false">
         <span class='content-font'>{{listItem.unit2Value}}</span>
      </checkItem>
      <td>
        <span class='title-name'>{{itemConfig['originCountry'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('originCountry')" :checkData="itemConfig['originCountry']" :isShowLabel="false">
         <span class='content-font'>{{listItem.originCountryValue}}</span>
      </checkItem>
      <td >
        <span class='title-name'>{{isImport ? '境内目的地':'境内货源地'}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('districtCode')" colspan="2" :checkData="itemConfig['districtCode']" :isShowLabel="false">
         <span class='content-font'>{{listItem.districtCodeValue}}</span>
      </checkItem>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('destCode')" colspan="2" :checkData="itemConfig['destCode']" :isShowLabel="false">
         <span class='content-font'>{{listItem.destCodeValue}}</span>
      </checkItem>
    </tr>
    <tr>
      <td>
        <span class='title-name'>{{itemConfig['dutyMode'].label}}</span>
      </td>
      <checkItem :moduleName="moduleName" :disabled="disableList" @itemClick="changeBodyColor('dutyMode')" colspan="9" :checkData="itemConfig['dutyMode']" :isShowLabel="false">
         <span class='content-font'>{{listItem.dutyModeValue}}</span>
      </checkItem>
    </tr>
  </table>
</template>
<script>
import checkItem from '../common/checkItem'
import utils from '@/common/util'
// import { mapState } from 'vuex'

export default {
  props: {
    listItem: {
      type: Object
    },
    itemConfig: {
      type: Object
    },
    // 是否禁用popover
    disableList: {
      type: Boolean
    },
    decOther: {
      type: Object
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
  methods: {
    // 点击表体详情信息
    changeBodyColor (name) {
      if (this.isLook) {
        return
      }
      if (utils.isDef(this.listItem[name + 'Color'])) {
        if (this.$store.state.ifDecOpen) {
          if (this.listItem[name + 'Color'] === 0) {
            this.listItem[name + 'Color'] = 2
          } else if (this.listItem[name + 'Color'] === 2) {
            this.listItem[name + 'Color'] = 1
          } else if (this.listItem[name + 'Color'] === 1) {
            this.listItem[name + 'Color'] = 0
          }
        } else {
          if (this.listItem[name + 'Color'] === 0) {
            this.listItem[name + 'Color'] = 1
          } else if (this.listItem[name + 'Color'] === 1) {
            this.listItem[name + 'Color'] = 0
          }
        }
      }
      this.listItem['gNameAndModelColor'] = this.judgeColor(['gName', 'gModel'])
      this.itemConfig['gNameAndModel']['color'] = this.judgeColor(['gName', 'gModel'])
      this.listItem['gQtyAndUnitColor'] = this.judgeColor(['gQty', 'gUnit', 'qty1', 'unit1', 'qty2', 'unit2'])
      this.itemConfig['gQtyAndUnit']['color'] = this.judgeColor(['gQty', 'gUnit', 'qty1', 'unit1', 'qty2', 'unit2'])
      this.listItem['districtCodeAndColor'] = this.judgeColor(['districtCode', 'destCode'])
      this.itemConfig['districtCode']['color'] = this.judgeColor(['districtCode', 'destCode'])
      this.listItem['gNoAllColor'] = this.judgeColor(['contrItem', 'ciqName', 'exgVersion', 'exgNo', 'gNo'])
      this.itemConfig['gNoAll']['color'] = this.judgeColor(['contrItem', 'ciqName', 'exgVersion', 'exgNo', 'gNo'])
      this.listItem['priceAndTotalColor'] = this.judgeColor(['declPrice', 'declTotal', 'tradeCurr'])
      this.itemConfig['priceAndTotal']['color'] = this.judgeColor(['declPrice', 'declTotal', 'tradeCurr'])
      this.$emit('changeColor')
      if (this.$attrs.isFromAi) {
        this.$emit('drawBoyArea', {value: name, gNo: this.listItem.gNo})
      }
    },
    judgeColor (arr) {
      let arr0 = []
      let arr1 = []
      let arr2 = []
      for (let i in arr) {
        if (this.itemConfig[arr[i]].color === 0) {
          arr0.push(arr[i])
        } else if (this.itemConfig[arr[i]].color === 1) {
          arr1.push(arr[i])
        } else if (this.itemConfig[arr[i]].color === 2) {
          arr2.push(arr[i])
        }
      }
      if (arr1.length > 0) {
        return 1
      } else if (arr2.length > 0) {
        return 2
      } else {
        return 0
      }
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
    display: inline-block;
    font-size: 13px;
    line-height: 25px;
    width: 100%;
    margin-block-start: 0;
    margin-block-end: 0;
  }
</style>
