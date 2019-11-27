<template>
  <div style='height: 500px;'>
    <el-table class='sys-table-table dec-table' ref='checkContaTable' :data="containerList" max-height="400"
    @cell-click='checkContaCellClick' :cell-class-name="deCellClass" border highlight-current-row size="mini">
      <el-table-column label="集装箱号" prop="containerNo" align='center' min-width="80">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :config="containerCheckConfigs[scope.$index].containerNo" name="containerNo">
            <span class='content-font'>{{scope.row.containerNo}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="集装箱规格" align='center' prop="containerSize" min-width="100">
        <template slot-scope="scope">
           <table-list-item :moduleName="moduleName" :config="containerCheckConfigs[scope.$index].containerSize" name="containerSize">
            <span class='content-font'>{{scope.row.containerSize}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="拼箱标识" prop="lclFlag" align='center'  min-width="120">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :config="containerCheckConfigs[scope.$index].lclFlag" name="lclFlag">
            <span class='content-font'>{{scope.row.lclFlag === '0' ? '否' : scope.row.lclFlag === '1' ? '是' : ''}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="商品项号关系" prop="goodsNo"  min-width="150" align='center'>
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :config="containerCheckConfigs[scope.$index].goodsNo" name="goodsNo">
             <span class='content-font'>{{scope.row.goodsNo}}</span>
          </table-list-item>
        </template>
      </el-table-column>
      <el-table-column label="自重(KG)" prop="containerWeight" align='center' min-width="100">
        <template slot-scope="scope">
          <table-list-item :moduleName="moduleName" :config="containerCheckConfigs[scope.$index].containerWeight" name="containerWeight">
           <span class='content-font'>{{removeZero(scope.row.containerWeight)}}</span>
          </table-list-item>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <span>{{'集装箱条数: ' + containerNum}}</span>
    </div>
  </div>
</template>
<script>
import tableListItem from '../common/tableListItem'
import util from '@/common/util'
// import { mapState } from 'vuex'

export default {
  props: {
    containerList: {
      type: Array
    },
    containerCheckConfigs: {
      type: Array
    },
    moduleName: {
      type: String
    }
  },
  components: {
    tableListItem
  },
  computed: {
    // ...mapState({
    //   isImport: state => state.checkData.isImport,
    //   isLook: state => state.checkData.isLook
    // }),
    isImport () {
      return this.$store.state[this.moduleName].isImport
    },
    isLook () {
      return this.$store.state[this.moduleName].isLook
    },
    containerNum: function () {
      let result = 0
      if (this.containerList && this.containerList.length) {
        result = this.containerList.length
      }
      return result
    }
  },
  methods: {
    removeZero (value) {
      if (util.isEmpty(value)) {
        return ''
      } else {
        return parseFloat(value) === 0 ? '' : parseFloat(value)
      }
    },
    reRender () {
      this.containerList.push({})
      this.containerList.pop()
    },
    deCellClass ({row, column, rowIndex, columnIndex}) {
      return this.containerCheckConfigs[rowIndex][column.property].color === 0 ? '' : ('c' + (this.containerCheckConfigs[rowIndex][column.property].color + 1))
    },
    checkContaCellClick (row, column, cell, event) {
      if (this.isLook) {
        return
      }
      let rowIndex = this.containerList.indexOf(row)
      let config = this.containerCheckConfigs[rowIndex][column.property]
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
  .content-font{
    display: inline-block;
    font-size: 13px;
    line-height: 25px;
    width: 100%;
    margin-block-start: 0;
    margin-block-end: 0;
  }
</style>
