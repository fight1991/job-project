<template>
    <iframe-view :url='url'></iframe-view>
</template>
<script>
// import base64 from '@/common/base64'
export default {
  name: 'index',
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    this.url = decodeURIComponent(this.$route.query.url)
  }
}
</script>
<style scoped lang="less">
</style>
