<template>
<!-- 其他包装组件 -->
  <section>
    <!-- 弹出框 其他包装信息 -->
    <el-dialog :modal-append-to-body='false'
      title="编辑其他包装信息"
      :visible.sync="otherPacksVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeOtherPacks'
      @open="otherPacksShow"
      class='sys-dec-class'
      v-dialogDrag
      width="700px">
      <div class="border">
        <el-table
          ref="otherPacksTable"
          :data="otherPackList"
          highlight-current-row border size='mini'
          @select="otherPacksChangeFun"
          max-height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
          <el-table-column  property="packType" label="包装材料种类代码" min-width="100"></el-table-column>
          <el-table-column  property="packTypeName" label="包装材料种类名称" min-width="200"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center">
        <el-button class='dialog-primary-btn' @click="saveOtherPackageInfo" :disabled="isDisabled">保存</el-button>
      </span>
    </el-dialog>
    <!-- -->
  </section>
</template>
<script>
import util from '@/common/util.js'
export default {
  name: 'other-packs',
  props: {
    otherPacksVisible: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    otherPacks: { // 选中的数据
      type: Array,
      required: true
    }
  },
  data () {
    return {
      preOtherPacks: [],
      otherPackList: []
    }
  },
  methods: {
    // 其他包装种类 设置初始化值
    otherPacksShow () {
      if (window.localStorage.getItem('otherPackList')) {
        this.otherPackList = JSON.parse(window.localStorage.getItem('otherPackList'))
      }
      // 初始化选中的值
      this.preOtherPacks = []
      let list = this.otherPacks
      this.$nextTick(_ => {
        if (list.length > 0) {
          list.forEach(item => {
            this.$refs.otherPacksTable.toggleRowSelection(this.otherPackList.find(d => {
              if (d.packType.toString() === item.packType) {
                this.preOtherPacks.push(d)
                return true
              }
            }), true)
          })
        } else {
          this.$refs.otherPacksTable.clearSelection()
        }
      })
    },
    // 其他包装种类  保存
    saveOtherPackageInfo () {
      this.$refs.otherPacksTable.clearSelection()
      this.$emit('close:otherPacks', {otherPacks: this.preOtherPacks})
    },
    closeOtherPacks () {
      this.$refs.otherPacksTable.clearSelection()
      this.$emit('update:otherPacksVisible', false)
    },
    // 其他包装种类 获取选中值
    otherPacksChangeFun (val) {
      this.preOtherPacks = util.simpleClone(val)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
