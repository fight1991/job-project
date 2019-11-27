<template>
  <div class="fixNav">
    <div class="iconBox">
      <div class="email small">
        <a href="javascript:void(0);"></a>
        <div class="detail angle-right">51baoguan@chinacba.org</div>
      </div>
      <!-- <div class="switchOld small"><a href="javascript:void(0);" @click.prevent="switchOld"></a></div> -->
      <div class="backTop small"><a href="javascript:void(0);" @click="backTop"></a></div>
    </div>
  </div>
</template>

<script>
import pathList from '@/config/pathList'
import config from '@/config/config'
export default {
  data () {
    return {

    }
  },
  methods: {
    logIn () {
      let LoginUrl = pathList.WWWLOGINBACK
      window.open(LoginUrl, '_self')
    },
    switchOld () {
      let old = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['WWW']
      window.open(old, '_self')
    },
    backTop () {
      this.$emit('backTop')
    }
  }
}
</script>

<style lang="less" scoped>
  .iconBox {
    .email {
      position: relative;
      a:hover + .detail {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .small {
      &:nth-child(1) a {
        background:url("../../../../assets/www-img/images/email-2.png") no-repeat 100% center;
      }
      // &:nth-child(2) a {
      //   background:url("../../../../assets/www-img/images/qiehuan-.png") no-repeat 100% center;
      // }
      &:nth-child(2) a {
        background:url("../../../../assets/www-img/images/back-to-top.png") no-repeat 100% center;
      }
    }
    .small:nth-child(1) a:hover {
        background:url("../../../../assets/www-img/images/email-1.png") no-repeat 100% center;
        transform: translateX(0px);
      }
    // .small:nth-child(2):hover a {
    //   background:url("../../../../assets/www-img/images/qiehuan.png") no-repeat 100% center;
    // }
    .small:nth-child(2):hover a {
      background:url("../../../../assets/www-img/images/back-to-top-xz.png") no-repeat 100% center;
    }
    a {
      display: block;
      width: 50px;
      height: 50px;
      margin-top: 5px;
      // background-color: red;
    }
  }
  .detail {
      height: 50px;
      padding: 0 10px;
      line-height: 50px;
      background-color: #0B5BA0;
      position: absolute;
      right: 58px;
      top: 0px;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      transform: translateX(-100px);
      transition: 1s all;
      opacity: 0;
    }
    .angle-right::after {
      content: '';
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-left: 6px solid #0B5BA0;
      position: absolute;
      // background-color: green;
      top: 50%;
      right: -11px;
      transform: translateY(-50%)
    }
</style>
