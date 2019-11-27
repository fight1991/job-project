<template>
<!-- 表体——商品列表组件 -->
  <section>
    <!-- 弹出框 商品列表 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="商品列表"
      :visible.sync="productListVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened = 'openProductListAfter'
      :before-close='saveProductList'
      v-dialogDrag
      width="640px">
      <el-table
        ref="productListTable"
        :data="productList"
        highlight-current-row border
        size='mini'
        class="wrap-table"
        @keyup.native='updownSelect'
        max-height="300" style="width: 100%">
        <span>从商品归类表中查询到了下列商品，请选择：</span>
        <el-table-column  min-width="50"  >
          <template slot-scope="scope">
              <el-radio v-model="productListRadio"  @keyup.enter.native="saveProductList" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column  property="codeTs" label="商品编号" min-width="100"></el-table-column>
        <el-table-column  property="gName" label="商品名称" min-width="200"></el-table-column>
        <el-table-column  property="noteS" label="备注" min-width="100"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" @click="saveProductList" :disabled="isDisabled">确定</el-button>
        <el-button class="dialog-btn" @click="saveProductList">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 弹出框 商品列表 结束 -->
  </section>
</template>
<script>
import util from '@/common/util.js'
import decUtil from '../../common/decUtil'
// import decBus from '../../common/bus.js'
export default {
  name: 'goods-info',
  props: {
    productListVisible: {
      type: Boolean,
      default: false
    },
    productList: {
      type: Array,
      require: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      productListRadio: 0 // 选中的商品
    }
  },
  methods: {
    // 商品列表
    openProductListAfter () {
      this.productListRadio = 0
      this.$nextTick(_ => {
        this.$refs['productListTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[0].focus()
      })
    },
    // 下拉键切换选择
    updownSelect (e) {
      let browerType = decUtil.myBrowser()
      if (browerType === 'Chrome') {
        return
      }
      let len = this.productList.length
      if (len === 0) {
        return
      } else {
        len--
      }
      if (e && e.keyCode === 38) { // 上
        if (this.productListRadio === 0) {
          this.productListRadio = len
        } else {
          this.productListRadio--
        }
      }
      if (e && e.keyCode === 40) { // 下
        if (this.productListRadio === len) {
          this.productListRadio = 0
        } else {
          this.productListRadio++
        }
      }
    },
    // 确定所选的商品
    saveProductList () {
      this.$emit('close:goodsInfo', {checkedgoods: util.simpleClone(this.productList[this.productListRadio])})
    }
  }
}
</script>
<style lang="less" scoped>

</style>
