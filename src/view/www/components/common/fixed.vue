<template>
  <div class="fixNav">
    <div class="iconBox">
      <div class="email small">
        <span class="text">电子邮箱</span>
        <div class="detail angle-right">51baoguan@chinacba.org</div>
      </div>
      <div class="backTop small">
        <span class="text" @click="backTop">返回顶部</span>
      </div>
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
      .text:hover + .detail {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .small {
      .text {
        font-size: 15px;
        font-weight: 300;
        color: white;
        background: #5ea6d6;
        display: inline-block;
        width: 2em;
        padding: 4px 10px;
        border-radius: 5px;
        margin-top: 5px;
        cursor: pointer;
        &:hover{
          background: #0b5ba0;
        }
      }
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
      top: 50%;
      right: -11px;
      transform: translateY(-50%)
    }
</style>
