<template>
  <div class="talent">
    <div class="title">
      <p class="big">人才招聘</p>
      <p class="light">TALENT RECRUITMENT</p>
    </div>
    <div class="mainer items-info">
      <div class="item-detail" v-for="item in jobs" :key="item.aid">
        <div class="zp-title">
          <div class="link">
            <div class="name">{{item.link.name}}</div>
            <div class="tel">{{item.link.tel}}</div>
          </div>
          <div class="email">{{item.link.email}}</div>
          <div class="company">{{item.link.company}}</div>
        </div>
        <div class="zp-info" v-for="item1 in item.zp_info" :key="item1.pid">
          <div class="job-title">{{item1.jobTitle}}</div>
          <div class="self-info">
            <div class="money marg-r" v-html="item1.wage"><span class="text-light">月薪:</span><span class="pad-l">{{item1.wage}}</span></div>
            <div class="culture marg-r" v-html="item1.culture"><span class="text-light">学历:</span><span class="pad-l">{{item1.culture}}</span></div>
            <div class="place" v-html="item1.place"><span class="text-light">地点:</span><span class="pad-l">{{item1.place}}</span></div>
          </div>
          <div class="duty" v-for="item2 in item1.detail" :key="item2.id">
            <div class="duty-title">{{item2.title}}</div>
            <p v-for="(item3,index) in item2.info" :key="index" v-html="item3"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {jobs} from '@/config/www'
export default {
  data () {
    return {
      jobs: jobs
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
 .talent {
   padding: 40px 0;
   color: #333;
 }
 .zp-title {
   padding: 15px;
   height:100px;
   background:url("../../../assets/www-img/images/talent-head.png") no-repeat;
   .email,.company {
     margin: 10px 0;
     color: #808080;
   }
   .link {
     display: flex;
     height: 40px;
     line-height: 40px;
     .name {
       font-size: 20px;
       font-weight: bold;
       color: #333;
     }
     .tel {
       font-size: 16px;
       font-weight: bold;
       line-height: 46px;
       text-indent: 8px;
       padding-right: 26px;
       background: url("../../../assets/www-img/images/tel.png") no-repeat;
       background-position: right 15px;
     }
   }
 }
 .zp-info {
   padding: 15px;
 }
 .job-title {
   font-size: 16px;
   font-weight: bold;
   color: #333;
   padding: 10px 0;
 }
 .item-detail {
   padding: 15px;
   border: 1px solid #ccc;
   margin-bottom: 50px;
   &:first-child {
     margin-top: 40px;
   }
 }
 .self-info {
   font-size: 14px;
   display: flex;
   padding: 10px 0;
   .marg-r {
     margin-right: 60px;
   }
   .money>.pad-l{
     color: #FEA12E;
   }
   .text-light {
     color: #808080;
   }
 }
 .pad-l {
     padding-left: 10px;
   }
  .company {
    padding-bottom: 10px;
    .text-light {
     color: #808080;
   }
  }
  .duty {
    font-size: 12px;
    .duty-title {
      padding: 5px 0;
    }
    p {
      margin: 8px 0;
    }
  }
</style>
