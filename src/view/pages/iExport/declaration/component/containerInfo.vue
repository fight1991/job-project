<template>
  <!-- 反填集装箱信心 -->
  <section >
    <div>
      <el-table
        ref="containerInfoTable"
        :data="containerList"
        highlight-current-row border
        size='mini'
        max-height="300" style="width: 100%">
        <el-table-column  type='index' label="序号" min-width="50"></el-table-column>
        <el-table-column  property="no" label="集装箱号" min-width="100"></el-table-column>
        <el-table-column  property="model" label="集装箱规格" min-width="120"></el-table-column>
      </el-table>
    </div>
    <div slot="footer"  class="sys-dialog-footer  text-center">
      <el-button class='dialog-primary-btn' @click="configBtn">回填集装箱数据</el-button>
      <el-button class='dialog-primary-btn' @click="closeBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'container-info',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      containerList: []
    }
  },
  created () {
    this.containerList = util.simpleClone(this.initParams.list)
  },
  mounted () {
  },
  methods: {
    // 关闭舱单组件
    closeBtn () {
      this.$emit('closedecele', {})
    },
    // 返回选择舱单数据
    configBtn () {
      this.$emit('submitdatas', {
        containerInfo: this.containerList // 运输工具名称
      })
    }
  }
}
</script>

<style scoped lang="less">
  .text-center {
    text-align: center;
  }
</style>
