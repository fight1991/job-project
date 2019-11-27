<template>
  <!-- 对比模板与现在的区别 -->
  <section>
    <!-- 不同字段的列表 -->
    <el-table
    ref="decListTable"
    :data="initParams.compareList"
    highlight-current-row
    :height='230'
    style="width: 100%"
    size="mini" border
    @selection-change="dataChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fieldName" label="字段名" width="220"></el-table-column>
      <el-table-column prop="templateValue" label="模板值" min-width="80"></el-table-column>
      <el-table-column prop="value" label="现值" min-width="100"></el-table-column>
    </el-table>
    <el-checkbox v-model="isQuote">
      是否引用模板中的商品
    </el-checkbox>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class='dialog-primary-btn' @click="configBtn">确定</el-button>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'compare-template',
  props: {
    initParams: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isQuote: '', // 是否引用模板列表
      checkedData: [], // 被选择的数据
      decBody: [] // 表体数据
    }
  },
  mounted () {
    this.checkedData = []
    let list = this.initParams.compareList
    this.$nextTick(_ => {
      if (list.length > 0) {
        list.forEach(item => {
          if (item.templateValue) {
            this.$refs.decListTable.toggleRowSelection(item, true)
          }
        })
      } else {
        this.$refs.decListTable.clearSelection()
      }
    })
  },
  methods: {
    configBtn () {
      if (this.isQuote) {
        this.decBody = this.initParams.decList
      }
      this.$emit('backDatas', {
        replaceData: this.checkedData,
        isBodyData: this.isQuote,
        decBody: this.decBody
      })
    },
    cancleBtn () {
      this.$emit('cancLeData')
    },
    // 获取选择的值
    dataChange (value) {
      this.checkedData = value
    }
  }
}
</script>

<style scoped lang="less">

</style>
