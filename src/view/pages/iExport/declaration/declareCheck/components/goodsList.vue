<template>
  <div>
    <el-table class='sys-table-table dec-table' ref='goodsTable' :data="deCheckList" height="250" @cell-click = 'deCellClcik' :cell-class-name="deCellClass" border highlight-current-row size="mini">
      <el-table-column label="项号" prop="gNoColor" min-width="80">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].gNo" name="gNo">
            <span>{{scope.row.gNo}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="商品编号" prop="codeTsColor" min-width="100">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].codeTs" name="codeTs">
            <span>{{scope.row.codeTs}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="商品名称、规格型号" prop="gNameAndModelColor"  min-width="150">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].gNameAndModel" name="gNameAndModel">
            <span>{{scope.row.gName}}</span><br>
            <span>{{scope.row.gModel}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="数量及单位" prop="gQtyAndUnitColor"  min-width="100" align='right'>
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].gQtyAndUnit" name="gQtyAndUnit">
            <span>{{scope.row.gQty + scope.row.gUnitValue}}</span><br>
            <span>{{scope.row.qty1 + scope.row.unit1Value}}</span><br>
            <span>{{scope.row.qty2 + scope.row.unit2Value}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="最终目的国（地区）" prop="destinationCountryColor"  min-width="150">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].destinationCountry" name="destinationCountry">
            <span>{{scope.row.destinationCountryValue}}</span><br>
            <span>{{scope.row.destinationCountry}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="declPriceColor"  min-width="100" align='right'>
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].declPrice" name="declPrice">
            <span>{{scope.row.declPrice}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="总价" prop="declTotalColor"  min-width="100" align='right'>
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].declTotal" name="declTotal">
            <span>{{scope.row.declTotal}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="币制" prop="tradeCurrColor"  min-width="100" align='right'>
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].tradeCurr" name="tradeCurr">
            <span>{{scope.row.tradeCurrValue}}</span><br>
            <span>{{scope.row.tradeCurr}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="征免" prop="dutyModeColor" min-width="100">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].dutyMode" name="dutyMode">
            <span>{{scope.row.dutyModeValue}}</span><br>
            <span>{{scope.row.dutyMode}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="版本号" prop="exgVersionColor" min-width="100">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].exgVersion" name="exgVersion">
            <span>{{scope.row.exgVersion}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import tableListItem from '../common/tableListItem'
// import { mapState } from 'vuex'

export default {
  props: {
    deCheckList: {
      type: Array
    },
    decCheckConfigs: {
      type: Array
    },
    // 是否禁用popover
    disableList: {
      type: Boolean
    },
    moduleName: {
      type: String
    }
  },
  components: {
    tableListItem
  },
  data () {
    return {
      listItem: {}
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
  methods: {
    reRender () {
      this.deCheckList.push({})
      this.deCheckList.pop()
    },
    deCellClass ({row, column, rowIndex, columnIndex}) {
      return row[column.property] === 0 ? '' : ('c' + (row[column.property] + 1))
    },
    deCellClcik (row, column, cell, event) {
      if (this.isLook) {
        return
      }
      if (this.$store.state.ifDecOpen) {
        if (row[column.property] === 0) {
          row[column.property] = 2
        } else if (row[column.property] === 2) {
          row[column.property] = 1
        } else if (row[column.property] === 1) {
          row[column.property] = 0
        }
      } else {
        if (row[column.property] === 0) {
          row[column.property] = 1
        } else if (row[column.property] === 1) {
          row[column.property] = 0
        }
      }
      let rowIndex = this.deCheckList.indexOf(row)
      let property = column.property.substring(0, column.property.length - 5)
      let config = this.decCheckConfigs[rowIndex][property]
      if (this.$store.state.ifDecOpen) {
        if (config.color === 0) {
          config.color = 2
        } else if (config.color === 2) {
          config.color = 1
        } else if (config.color === 1) {
          config.color = 0
        }
      } else {
        if (config.color === 0) {
          config.color = 1
        } else if (config.color === 1) {
          config.color = 0
        }
      }
      this.reRender()
    }
  }
}
</script>
