<template>
  <!-- 同步覆盖提示的组件 -->
  <section>
    <div class='div-class'>
      <span>此数据在系统存在, 是否覆盖?</span>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style='text-align: right;'>
      <el-checkbox v-model="checked" style='margin-right: 116px;'>下次不再提示</el-checkbox>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
      <el-button class='dialog-primary-btn' @click="configBtn">确认</el-button>
    </div>
  </section>
</template>

<script>
// import util from '@/common/util'
export default {
  name: 'sync-cover',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {
          seqNo: '',
          iEFlag: ''
        }
      }
    }
  },
  data () {
    return {
      checked: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    configBtn () {
      this.$emit('backData', {check: this.checked, seqNo: this.initParams.seqNo, iEFlag: this.initParams.iEFlag})
    },
    cancleBtn () {
      this.$emit('cancLeData')
    }
  }
}
</script>

<style scoped lang="less">
.div-class {
    font-size: 14px;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
