<template>
 <div class="detail ccba-control-detail">
   <div class="top-header">
     <div class="logo"></div>
   </div>
   <div class="container">
     <h2>{{detail.title}}</h2>
     <div class="time">{{detail.createTime}}</div>
     <div class="text" v-html="detail.content"></div>
   </div>
 </div>
</template>

<script>
export default {
  data () {
    return {
      detail: {}
    }
  },
  watch: {
    '$route': function (to, from) {
    }
  },
  created () {
    this.getNewsById()
  },
  methods: {
    // 获取新闻详情
    getNewsById () {
      let id = this.$route.query.pid
      this.$store.dispatch('ajax', {
        url: 'API@/login/workspace/getNews',
        data: {pid: id},
        router: this.$router,
        success: (res) => {
          this.detail = res.result
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  height: 100%;
  overflow:auto;
  background-color: @sys-color-gray;
}
  .container {
    width: 800px;
    margin: 84px auto 16px;
    padding: 30px 20px;
    box-sizing: border-box;
    min-height: calc(~"(100% - 100px)");
    background-color: #fff;
    border-radius: 10px;
    // background-color: pink;
    .text {
      // text-indent: 2em;
      color: @font-color-main;
      width: 100%;
      overflow-x: auto;
      img {
        width: 100%;
      }
    }
    p {
      padding: 5px 20px;
    }
    h2 {
      text-align: center;
    }
    .time {
      padding: 10px 0;
      text-align: center;
    }
  }

.top-header{
  background-color:@sys-color-main;
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 64px;
}
.logo{
    display: inline-block;
    width: 380px;
    height: 64px;
    background: url('../../../assets/img/icon/CCBA_logo.png') no-repeat 0 0;
    background-size: 280px 64px;
    background-size: cover;
    vertical-align: middle;
}
</style>
