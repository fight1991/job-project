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
    if (this.$route.name === 'iTemplate') {
      this.url = pathList.eImport['decImTemplate'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'eTemplate') {
      this.url = pathList.eImport['decExTemplate'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'templateList') {
      this.url = pathList.eImport['decTemplateList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'shipping') {
      this.url = pathList.eImport['shipping'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'taxTemplateList') {
      this.url = pathList.eImport['taxTemplateList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'tax_I_Template') {
      this.url = pathList.eImport['tax_I_Template'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'tax_E_Template') {
      this.url = pathList.eImport['tax_E_Template'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'customizeTemplate') {
      this.url = pathList.eImport['customizeTemplate'] + '?sysId=CCBA&tabId=' + this.$route.name
    }
  }
}
</script>
<style scoped lang="less">
</style>
