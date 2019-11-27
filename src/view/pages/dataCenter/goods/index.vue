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
    if (this.$route.name === 'noBonded') {
      this.url = pathList.dataCenter['noBonded'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else {
      this.url = pathList.dataCenter['bonded'] + '?sysId=CCBA&tabId=' + this.$route.name
    }
  }
}
</script>
<style scoped lang="less">
</style>
