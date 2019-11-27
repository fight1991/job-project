<template>
  <el-dialog @open="openDialog" :show-close="false" :visible.sync="visible" class="process" width="50%" :close-on-click-modal="false">
    <el-progress :percentage="progressValue" :text-inside="true" :stroke-width="20" :color="color"></el-progress>
  </el-dialog>
</template>
<script>
export default {
  name: 'line-progress',
  data () {
    return {
      progressValue: 0
    }
  },
  props: {
    color: { // 进度条颜色
      type: String,
      default: '#409eff'
    },
    url: { // api地址
      type: String,
      default: '',
      required: true
    },
    time: { // 监听进度频率ms
      type: Number,
      default: 3000
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  methods: {
    // 对话框显示
    openDialog () {
      this.progressValue = 0
      // 开始请求
      this.getProgress()
    },
    getProgress () {
      this.$post({
        url: this.url,
        data: {},
        isLoad: false,
        success: ({result}) => {
          this.progressValue = result
          if (result !== '100' && result) {
            setTimeout(this.getProgress, this.time)
          } else {
            setTimeout(() => { this.$emit('update:visible', false) }, 600)
            this.$emit('complete', result)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
