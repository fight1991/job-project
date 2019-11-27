<template>
    <iframe-view :url='url'></iframe-view>
</template>
<script>
import pathList from '@/config/pathList'
export default {
  name: 'index',
  data () {
    return {
      url: ''

    }
  },
  mounted () {
    this.url = pathList.jinerInfo[this.$route.name] + '?sysId=CCBA&tabId=' + this.$route.name
  }
}
</script>
<style scoped lang="less">
</style>
