<template>
  <!-- 联系单备案商品信息列表的组件 -->
  <section>
    <div>
      <el-table class='sys-table-table dec-table'
        ref = 'manualGoodsTable'
       :data="initParams"
       :height="200"
        @selection-change="changeFun"
       border highlight-current-row size="mini">
        <el-table-column  type="selection" align='center' width="37"></el-table-column>
        <el-table-column prop="contrItem" label="备案序号" min-width="80"></el-table-column>
        <el-table-column prop="gname" label="商品名称" min-width="200"></el-table-column>
        <el-table-column prop="codeT" label="商品编号" min-width="100"></el-table-column>
        <el-table-column prop="codeS" label="附加编号" min-width="100"></el-table-column>
        <el-table-column prop="gmodel" label="规格型号" min-width="200"></el-table-column>
        <el-table-column prop="gQty" label="成交数量" min-width="100"></el-table-column>
        <el-table-column prop="gUnitName" label="成交单位" min-width="80"></el-table-column>
        <el-table-column prop="qty1" label="法定数量" min-width="100"></el-table-column>
        <el-table-column prop="unit1Name" label="法定单位" min-width="80"></el-table-column>
        <el-table-column prop="declTotal" label="成交总价" min-width="100"></el-table-column>
        <el-table-column prop="currName" label="币制" min-width="100"></el-table-column>
        <el-table-column prop="originCountryName" label="原产国" min-width="100"></el-table-column>
      </el-table>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class="dialog-primary-btn" @click='configBtn()'>确定</el-button>
      <el-button class="dialog-btn" @click="cancleBtn()">取消</el-button>
    </div>
  </section>
</template>

<script>
// import util from '@/common/util'
export default {
  name: 'manual-goods',
  props: {
    initParams: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      tableChecked: []
    }
  },
  methods: {
    configBtn () {
      if (this.tableChecked === 0) {
        this.messageTips('请选择商品数据!')
        return
      }
      if (this.tableChecked > 50) {
        this.messageTips('商品数量不能超过50条!')
        return
      }
      this.$confirm('是否要将商品的“最终目的国”赋值为CHN：中国，“征免方式”赋值为1:照章征税？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$emit('close:manualGoods', {list: this.tableChecked, flag: 'Y'})
      }).catch(() => {
        this.$emit('close:manualGoods', {list: this.tableChecked, flag: 'N'})
      })
    },
    cancleBtn () {
      this.$emit('close:manualGoods', null)
    },
    changeFun (value) {
      this.tableChecked = value
    }
  }
}
</script>

<style scoped lang="less">

</style>
