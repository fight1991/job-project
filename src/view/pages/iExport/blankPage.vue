
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
    if (this.$route.name === 'tax_I_Template') { // 进口核注清单模板
      this.url = pathList.iExport['tax_I_Template'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'tax_E_Template') { // 出口核注清单模板
      this.url = pathList.iExport['tax_E_Template'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'importTaxList') { // 进口核注清单新增
      this.url = pathList.iExport['importTaxList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'exportTaxList') { // 出口核注清单新增
      this.url = pathList.iExport['exportTaxList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'taxTemplateList') {
      this.url = pathList.iExport['taxTemplateList'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'taxReviewed') { // 核注清单审核
      this.url = pathList.iExport['taxReviewed'] + '?sysId=CCBA&tabId=' + this.$route.name
    } else if (this.$route.name === 'taxInfo') {
      this.url = pathList.iExport['taxInfo'] + '?sysId=CCBA&tabId=' + this.$route.name
    }
  }
}
</script>
<style scoped lang="less">
</style>
