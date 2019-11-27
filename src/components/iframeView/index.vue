<template>
<div class='iframe-view'  v-loading="loading">
  <iframe @load='stateLoad()' :id='id' width='100%' :src="url" height="100%"  sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto></iframe>
</div>
</template>

<script>
export default {
  name: 'iframe-view',
  props: ['url'],
  data () {
    return {
      loading: true,
      id: new Date().getTime()
    }
  },
  mounted () {
    this.loading = true
  },
  methods: {
    // 遮罩处理
    stateLoad () {
      this.loading = false
    }
  },
  beforeDestroy () {}
}
</script>

<style lang="less" scoped>
.iframe-view{
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  iframe{
    position: relative;
    box-sizing: border-box;
  }
}
.autoH{
  height: auto;
}
.defultH{
  height: 200px;
}
</style>
