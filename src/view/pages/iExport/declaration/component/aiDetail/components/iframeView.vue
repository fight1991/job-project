<template>
<div class='iframe-view' v-loading="loading">
  <iframe @load="loadIsOver" :src="url + '#page=1&view=FitH,top'" class="iframe" frameborder="0"></iframe>
</div>
</template>

<script>
/*
* 浏览器pdf预览配置
* #page=1&view=FitH,top iframe中全屏展示,显示第一页
* #view=fit 自适应
*
*/
export default {
  name: 'iframe-pdf',
  props: ['url'],
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.loading = true
  },
  methods: {
    // 遮罩处理
    loadIsOver () {
      this.loading = false
    }
  },
  beforeDestroy () {}
}
</script>

<style lang="less" scoped>
.iframe {
  height: 100%;
  // pointer-events: none;
  width: 100%;
}
.iframe-view {
  height: 100%;
  width: 100%;
}
</style>
