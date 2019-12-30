
<template>
  <!-- 冻结原因 -->
   <section class="dec-common-dialog">
      <el-dialog
        title="冻结原因"
        :visible.sync="frozenReasonVisable"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body='false'
        @opened='openFrozenReason'
        :before-close='cancleBtn'
        width="540px">
      <div style='margin: 10px 10px;'>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          @keyup.native="computLength"
          @keydown.enter.native="prevent"
          v-model="frozenReason">
        </el-input>
        <p style='float: right;'> {{'' + len + '/100'}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="configBtn">确定</el-button>
        <el-button type="default" @click="cancleBtn">取消</el-button>
      </div>
      </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util.js'
export default {
  name: 'frozen-reason',
  props: {
    frozenReasonVisable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      len: 0,
      frozenReason: ''
    }
  },
  methods: {
    openFrozenReason () {
      this.frozenReason = ''
    },
    configBtn () {
      this.$emit('close:frozenReason', {frozenReason: this.frozenReason})
    },
    cancleBtn () {
      this.$emit('update:frozenReasonVisable', false)
    },
    prevent (e) {
      if (e.target.localName === 'textarea') { // enter 光标向下个元素移动
        e.preventDefault()
        e.stopPropagation()
      }
    },
    computLength () {
      this.frozenReason = util.getFixlenOfString(this.frozenReason, 100)
      this.len = util.decGetlen(this.frozenReason)
    }
  }
}
</script>

<style scoped lang="less">

</style>
