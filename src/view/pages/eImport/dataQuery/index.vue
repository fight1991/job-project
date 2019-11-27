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
  created () {
  },
  mounted () {
    if (!this.$route.query.status) {
      // 如果status不存在,说明不是从控制台看板跳转过来的
      this.url = pathList.eImport[this.$route.name] + `?sysId=CCBA&tabId' + this.$route.name`
    } else {
      let {iEFlag, status, startTime, endTime} = this.$route.query
      this.url = pathList.eImport[this.$route.name] + `?sysId=CCBA&iEFlag=${iEFlag}&status=${status}&startTime=${startTime}&endTime=${endTime}`
    }
  }
}
</script>
<style scoped lang="less">
</style>
