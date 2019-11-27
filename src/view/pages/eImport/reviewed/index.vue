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
    if (this.$route.name === 'decReviewed') {
      this.url = pathList.eImport['decReviewed'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'taxReviewed') {
      this.url = pathList.eImport['taxReviewed'] + '?sysId=CCBA&tabId=' + this.$route.name
    }
  }
}
</script>
<style scoped lang="less">
</style>
