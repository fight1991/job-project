<template>
  <div class="footer">
    <div class="footer-top">
      <div class="content mainer clearfix">
        <div class="companyInfo fl">
          <h3>合作伙伴:</h3>
          <div class="partner fl" v-for="(item,index) in partner" :key="index">
            <a :href="item.url" target="_blank" v-if="item.url.indexOf('www') > 0">
              <div class="icon fl"><i :class="[item.iconClass,'www-icon']"></i></div>
              <div class="name fl">{{item.name}}</div>
            </a>
            <a :href="item.url" onclick="return false;" target="_blank" v-else>
              <div class="icon fl"><i :class="[item.iconClass,'www-icon']" alt=""></i></div>
              <div class="name fl">{{item.name}}</div>
            </a>
          </div>
        </div>
        <div class="link fr">
          <img src="https://www.5itrade.cn/files/CCBA/erweima.png" alt="">
          <p>关注智慧通关小程序</p>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="copy">{{copyTxt}}</p>
    </div>
  </div>
</template>

<script>
import {partner} from '@/config/www'
export default {
  data () {
    return {
      copyTxt: 'Copyrights © 2010-2020 朗新金关信息科技有限公司 苏IPC备17069948号-2',
      partner: partner
    }
  }
}
</script>

<style lang="less" scoped>
  .fsize22 {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 22px;
  }
  .footer-top {
    padding: 30px 5px;
    background-color: #0A5CA0;
    color: #fff;
    .content {
      position: relative;
    }
    .companyInfo  {
      width: 850px;
      h3 {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 10px;
      }
      .partner {
        margin-right: 10px;
        width:32%;
        padding: 5px 0;
        // line-height: 40px;
        color: #fff;
        .name {
          color: #fff;
          padding-left: 15px;
        }
      }
      .detail {
        margin-top: 15px;
        .text {
          display: inline-block;
          padding-left: 10px;
        }
        p {
          padding-left: 22px;
          height: 35px;
          line-height: 35px;
          position: relative;
            &:nth-child(1) {
              margin-bottom: 10px;
            }
        }
        .left {
          margin-right: 50px;
        }
      }
    }
  }
  .link {
    position:absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%)
  }
  .link p {
    margin-top: 5px;
    text-align: center;
  }
  .footer-bottom {
    text-align:center;
    height: 40px;
    line-height: 30px;
    background-color: #EBEBEB;
    padding: 5px 0;
    box-sizing: border-box;
  }
</style>
