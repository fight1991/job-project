<template>
<!-- 表体——危险货物信息组件 -->
  <section>
    <el-dialog
      title="提示"
      :visible.sync="sendTipsVisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body='false'
       @closed ="closeSendTips()"
      width="350px">
      <div class='div-class'>
        <span>请确认当前报关单是否需要自报自缴，若需要，请勾选自报自缴按钮，若不需要，请点击直接发送。</span>
      </div>
      <div slot="footer" class="sys-dialog-footer" style='text-align: right;'>
        <el-checkbox v-model="checked" style='margin-right: 100px;'>自报自缴</el-checkbox>
        <el-button class='dialog-primary-btn' @click="configBtn">直接发送</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>

export default {
  name: 'danger-goods',
  props: {
    sendTipsVisable: {
      type: Boolean,
      default: false
    },
    operType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checked: false
    }
  },
  methods: {
    configBtn () {
      this.$emit('close:sendTipsClose', {checked: this.checked, operType: this.operType})
    },
    closeSendTips () {
      this.$emit('update:sendTipsVisable', false)
    }
  }
}
</script>
<style lang="less" scoped>
.div-class {
    font-size: 14px;
    margin-left: 20px;
    margin-top: 10px;
}
</style>
