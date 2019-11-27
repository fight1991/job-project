<template>
  <section class="entrust-main">
    <el-row :gutter="30">
      <el-col :span="18">
        <div class="entrust-panel">
          <el-row class="entrust-title">状态跟踪</el-row>
          <el-row>
            <el-col :span="19" :offset="2">
              <el-timeline>
                <el-timeline-item placement="top"
                  v-for="(activity, index) in timeList" :class="{'current-timeline': index==0}"
                  :key="index"
                  :color="activity.color"
                  :timestamp="activity.createTime">
                  【{{activity.statusName}}】&nbsp;&nbsp;{{activity.createUserName}}（{{activity.createCompanyName}}）&nbsp;&nbsp;{{activity.businessTypeValue}}{{activity.businessNo?('：'+activity.businessNo):''}}
                </el-timeline-item>
              </el-timeline>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="entrust-panel">
          <img src="@/assets/img/qrcode.jpg" class="qrcode" alt="">
          <div class="qrcode-tip">扫一扫，随时随地跟踪业务状态</div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  data () {
    return {
      timeList: []
    }
  },
  created () {
    this.getStatusList()
  },
  methods: {
    // 获取状态跟踪
    getStatusList () {
      let data = {
        entrustCode: this.$route.params.code,
        statusQueryFlag: 'entrust',
        innerNos: util.isEmpty(this.$route.query.innerNos) ? [] : [this.$route.query.innerNos]
      }
      this.$post({
        url: 'API@/dec-common/ccba/entrust/statusListQuery',
        data: data,
        success: (res) => {
          this.timeList = util.isEmpty(res.result) ? [] : res.result
          this.timeList[0].color = '#ff6c00'
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import(less) '@/assets/style/common';
.entrust-main {
  padding: 20px;
  font-size:12px;
  font-family: Arial,Microsoft YaHei,SimSun;
  height: calc(100% - 40px);
  overflow: auto;
  background: #f5f5f5;
}
.entrust-panel{
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
}
.entrust-title{
  font-size: 16px;
  margin-bottom: 25px;
}
.qrcode{
  width: 200px;
  height: 200px;
  display: block;
  margin: 10px auto;
}
.qrcode-tip{
  padding: 0 10px;
  font-size: 14px;
  text-align: center;
  margin-top: 30px;
}
</style>
