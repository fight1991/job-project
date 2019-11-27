<template>
  <div class="div-class">
    <el-table class='sys-table-table dec-table' ref='deCheckTable' :data="deCheckList" height="250" @cell-click='deCellClcik' :cell-class-name="deCellClass"  dborder highlight-current-row size="mini">
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
      <el-table-column label="商品名称" prop="gNameColor" min-width="100">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].gName" name="gName">
            <span>{{scope.row.gName}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="检验检疫编码及名称" prop="ciqCodeColor" min-width="150">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].ciqCode" name="ciqCode">
            <span>{{scope.row.ciqCode}}</span><br>
            <span>{{scope.row.ciqName}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="检验检疫货物规格" prop="goodsSpecColor"  min-width="150">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].goodsSpec" name="goodsSpec">
            <span>{{scope.row.goodsSpec}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="货物属性" prop="showGoodsAttrValueColor"  min-width="150">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].showGoodsAttrValue" name="showGoodsAttrValue">
            <span>{{scope.row.showGoodsAttrValue}}</span><br>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="用途" prop="purposeColor"  min-width="150">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].purpose" name="purpose">
            <span>{{scope.row.purpose}}</span><br>
            <span>{{scope.row.purposeValue}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="许可证类别及编号" prop="licenseTypeNoColor" min-width="150">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].licenseTypeNo" name="licenseTypeNo">
            <span>{{scope.row.licenseTypeNo}}</span><br>
            <span></span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column  min-width="150" prop="dangerGoodsInfoColor" label="危险货物信息">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :disable="disableList" :config="decCheckConfigs[scope.$index].dangerGoodsInfo" name="dangerGoodsInfo">
            <span>{{scope.row.dangerGoodsInfo}}</span><br>
            <span></span>
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
<style scoped lang="less">
  .div-class {
    overflow:hidden;
    position: relative;
    width: 100%;
  }
</style>
