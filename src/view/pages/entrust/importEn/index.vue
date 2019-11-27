<template>
    <iframe-view :url='url'></iframe-view>
</template>
<script>
import base64 from '@/common/base64'
import pathList from '@/config/pathList'
export default {
  name: 'index',
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    let params = ''
    if (this.$route.params.sysData || this.$route.query.sysData) {
      // 说明从从子系统打开此页面
      let datas = []
      if (this.$route.params.sysData) {
        datas = JSON.parse(base64.decode(this.$route.params.sysData))
      } else if (this.$route.query.sysData) {
        datas = JSON.parse(base64.decode(this.$route.query.sysData))
      }
      let data = JSON.parse(datas.params)
      for (let item in data) {
        params += `&${item}=${data[item]}`
      }
      params += `&tabId=${datas.tabId}`
    }
    this.url = pathList.entrust['importEntrustList'] + '?sysId=CCBA' + params
  }
}
</script>
<style scoped lang="less">
</style>
