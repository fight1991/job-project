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
    if (this.$route.name === 'exportDeclaration') {
      this.url = pathList.eImport['decExport'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'exportRecord') {
      this.url = pathList.eImport['recordExport'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'exportTaxList') {
      this.url = pathList.eImport['exportTaxList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'exportDecList') {
      this.url = pathList.eImport['exportDecList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'exportRecList') {
      this.url = pathList.eImport['exportRecList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'exportSecList') {
      this.url = pathList.eImport['exportSecList'] + '?sysId=CCBA&tabId=' + this.$route.name
    }
  }
}
</script>
<style scoped lang="less">
</style>
