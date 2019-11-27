<template>
  <!-- 附注信息的组件 -->
  <section>
    <div>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="extraNote">
      </el-input>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class='dialog-primary-btn' @click="configBtn">确定</el-button>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'extra-note',
  props: {
    additionInfoLa: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      extraNote: ''
    }
  },
  mounted () {
    this.extraNote = this.additionInfoLa
  },
  methods: {
    configBtn () {
      this.$emit('backDatas', {extraNote: this.extraNote})
      this.extraNote = ''
    },
    cancleBtn () {
      this.$emit('cancLeData')
      this.extraNote = ''
    }
  }
}
</script>

<style scoped lang="less">

</style>
