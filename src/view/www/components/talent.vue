<template>
  <div class="talent">
    <!-- 头图 -->
    <div class="header-img"></div>
    <!-- 介绍 -->
    <div class="banner">
      <div class="banner-bgimg" v-html="jobIntroduce.first"></div>
      <div class="banner-bgimg" v-html="jobIntroduce.second"></div>
      <div class="banner-bgimg" v-html="jobIntroduce.third"></div>
    </div>
    <div class="position-top">
      <p class="big">诚聘人才</p>
      <p class="light">RECRUITMENT TALENTS</p>
    </div>
    <div class="position">
      <div v-for="(item,index) in jobList" :key="index">
        <div class="pos-content" @click.prevent="toList(item.jobType,item.area)">
          <i class="www-icon icon-jiping" v-if="item.urgentYN === 'Y'"></i>
          <p class="pos-title">{{formatStatus(item.jobType)}}</p>
          <p class="pos-place">{{item.area}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {jobIntroduce, jobTypeList} from '@/config/www'
import util from '@/common/util'
export default {
  data () {
    return {
      jobIntroduce: {},
      jobList: [{
        jobType: '',
        urgentYN: '',
        area: ''
      }],
      jobTypeList: jobTypeList
    }
  },
  created () {
    this.jobIntroduce = jobIntroduce
    this.geijobList()
  },
  methods: {
    geijobList () {
      let data = {
        company: 'longshine',
        source: ['ccba'],
        page: {
          pageSize: 200,
          pageIndex: 1
        }
      }
      this.$store.dispatch('ajax', {
        url: 'API@/plat-manager/jobManage/getJobTypeListGW',
        data: data,
        router: this.$router,
        success: (res) => {
          this.jobList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 跳转到职位详情
    toList (jobType, area) {
      this.$router.push({
        path: '/talent/jobList',
        query: {
          jobType: jobType,
          area: encodeURIComponent(area)
        }
      })
    },
    // 格式化状态
    formatStatus (val) {
      for (let i in this.jobTypeList) {
        if (this.jobTypeList[i].value === val) {
          return this.jobTypeList[i].label
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.talent {
  color: #333;
  .header-img {
    height: 380px;
    background: url('https://www.5itrade.cn/files/CCBA/banner_img.jpg') no-repeat center;
    background-size: cover;
    box-sizing: border-box;
  }

  .banner {
    width: 1000px;
    display: flex;
    margin: 50px auto;
    justify-content: space-between;
    .banner-bgimg {
      width: 320px;
      height: 217px;
      background: url('https://www.5itrade.cn/files/CCBA/wz_bg.png') no-repeat center;
      background-size: cover;
    }
  }
  .position-top {
      margin-bottom: 30px;
    }
  .position {
    width: 1020px;
    display: flex;
    flex-wrap: wrap;
    margin: 0px auto;
    margin-bottom: 40px;
    .pos-content {
      cursor:pointer;
      flex: 1;
      position: relative;
      width: 320px;
      margin-right: 20px;
      margin-bottom: 20px;
      background-color: #f3fef1;
      border-radius: 2px;
      padding: 20px 30px;
      box-sizing: border-box;
      .pos-title {
        color:#333;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .pos-place {
        color:#666;
        font-size: 12px;
      }
      .icon-jiping{
        position: absolute;
        right: 0;
        top: 0;
      }
      .pos-content:first-child {
        margin-left: 0px;
      }
    }
  }
}
</style>
