<template>
<div class='iframe-view'  v-loading="loading">
  <iframe @load="loadIsOver" :src="url + '#view=fit'" class="iframe" frameborder="0"></iframe>
</div>
</template>

<script>
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
  pointer-events: none;
  width: 100%;
}
.iframe-view {
  height: 100%;
  width: 100%;
}
</style>
