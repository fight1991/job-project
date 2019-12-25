<template>
  <!-- 表体——商品项号关系组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑商品项号关系"
      :visible.sync="goodsGNoVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-dialogDrag
      @open="GoodsGNoShow"
      :before-close='closeCompnent'
      width="640px">
      <el-table
        ref="goodsGNoTable"
        :data="tableList"
        highlight-current-row border
        size='mini'
        @selection-change="goodsGNoChange"
        max-height="300" style="width: 100%">
        <el-table-column label="选中" min-width="50" type="selection">
        </el-table-column>
        <el-table-column  property="gNo" label="商品编号" min-width="100"></el-table-column>
        <el-table-column  property="codeTs" label="商品编号" min-width="100"></el-table-column>
        <el-table-column  property="gName" label="商品名称" min-width="100"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" @click="saveGoodsGNo" :disabled="isDisabled">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import decBus from '../../common/bus'
import summaryBus from '../../../summaryDec/common/bus'
export default {
  name: 'goods-gno',
  props: {
    goodsGNoVisible: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    goodsNo: {
      type: String,
      default: ''
    },
    declareType: {
      type: String,
      default: ''
    },
    tableList: {
      type: Array
    },
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      checkedGoodsGNo: []
    }
  },
  methods: {
    // 商品项号关系 初始化值
    GoodsGNoShow () {
      let goodsNoArr = []
      if (!util.isEmpty(this.goodsNo.trim())) {
        goodsNoArr = this.goodsNo.split(',')
      }
      if (this.declareType) {
        summaryBus.getBus(this.moduleName).$emit('setTableListToSate', null)
      } else {
        decBus.getBus(this.moduleName).$emit('setTableListToSate', null)
      }
      if (this.tableList.length === 0) {
        return
      }
      let _this = this
      // 设置选中值
      this.$nextTick(_ => {
        if (goodsNoArr.length > 0) {
          goodsNoArr.forEach(item => {
            _this.tableList.forEach(d => {
              if (d.gNo.toString() === item.toString()) {
                _this.$refs.goodsGNoTable.toggleRowSelection(d, true)
              }
            })
          })
        } else {
          _this.$refs.goodsGNoTable.clearSelection()
        }
      })
    },
    // 商品项号关系 被选中的值
    goodsGNoChange (value) {
      this.checkedGoodsGNo = value
    },
    closeCompnent () {
      this.$emit('update:goodsGNoVisible', false)
    },
    // 确定 商品项号 选中的值
    saveGoodsGNo () {
      this.$emit('close:goodsGno', {checkedGoodsGNo: this.checkedGoodsGNo})
    }
  }
}
</script>
<style lang="less" scoped>

</style>
