<template>
  <div class="footer">
    <div class="container">
      <div class="quikFunction">
        <div class="icon">
          <div class="text"><i class="el-icon-menu"></i></div>
          <p>快捷功能</p>
        </div>
      </div>
      <div class="quikItems">
        <div class="item-detail" v-for="item in quickItems" :key="item.id" @click="routerTo(item.path)"  v-permissions="item.permissions">
          <img :src="item.icon" alt="">
          <span>{{item.text}}</span>
        </div>
      </div>
      <div class="btn-control">
        <div class="left">
          <div class="arrow" @click.prevent="sendHeight">
            <img :src="arrowSrc.arrowDown" alt="" v-if="bigIsShow">
            <img :src="arrowSrc.arrowUp" alt="" v-else>
          </div>
          <!-- <div class="manage"><img src="../../../assets/img/icon/btm_set.png" alt=""><span>管理</span></div> -->
        </div>
        <div class="erweima-little" v-if="!bigIsShow">
          <div class="little-ewm"><img src="../../../assets/img/icon/btm_QR.png" alt=""></div>
          <div class="zhihui">智慧通关</div>
        </div>
        <div class="erweima-big" v-if="bigIsShow">
          <div class="big-text">智慧通关小程序实时通关查询</div>
          <div class="big-ewm"><img src="../../../assets/img/icon/btm_QRcode.png" alt=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import config from '../../../config/config'
import pathList from '../../../config/pathList'
export default {
  data () {
    return {
      bigIsShow: false,
      arrowSrc: {
        arrowUp: require('../../../assets/img/icon/btm_fold_1.png'),
        arrowDown: require('../../../assets/img/icon/btm_fold_2.png')
      },
      quickItems: pathList.keyBoardPath
    }
  },
  created () {
  },
  methods: {
    // 底部展开与关闭
    sendHeight () {
      this.bigIsShow = !this.bigIsShow
      let height = ''
      if (this.bigIsShow) {
        height = 170
      } else {
        height = 50
      }
      this.$emit('pullHeight', height)
    },
    // 路由跳转
    routerTo (path) {
      if (location.pathname === '') {
        this.$message({
          type: 'warning',
          message: '页面开发中....'
        })
        return
      }
      window.open(path)
    }

  }
}
</script>

<style lang="less" scoped>
.footer {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 5px;
  // border-bottom: 1px solid red;
  background-color: @aid-color-dark;
}
 .container {
   box-sizing:border-box;
   padding-left: 94px;
   padding-right: 190px;
   width: 985px;
   height: 100%;
  //  background-color: red;
   margin: 0 auto;
   position: relative;
   .quikItems {
     width: 720px;
     overflow: hidden;
     display: flex;
     flex-wrap: wrap;
     align-items: center;
     color: #fff;
     .item-detail {
       box-sizing: border-box;
       width: 140px;
       padding: 13px;
       cursor: pointer;
       span {
         margin-left: 5px;
       }
       img {
         width: 24px;
         height: 24px;
       }
     }
   }
   .quikFunction {
     position: absolute;
     left: 0;
     bottom: 0;
     width: 94px;
     height: 100%;
     background-color: #0a5ca0;
     text-align: center;
     color: #fff;
     .icon {
       position: absolute;
       width: 100%;
       height: 50px;
       left: 0;
       top: -5px;
       background-color: #0a5ca0;
       padding-top: 5px;
     }
     p {
       margin: 0;
     }
     .text i{
       font-size: 30px;
     }
   }
   .btn-control {
     position: absolute;
     bottom: 0;
     right: 0;
     width: 190px;
     height: 100%;
     display: flex;
     .erweima-little {
       background-color: @aid-color-light;
       box-sizing: border-box;
       width: 130px;
       display: flex;
       padding:10px 15px;
       .zhihui {
         height: 30px;
         line-height: 30px;
         color: #fff;
         margin-left: 10px;
       }
     }
     .erweima-big {
       height: 100%;
       background-color: @aid-color-light;
       width: 130px;
       color: #fff;
       text-align: center;
       padding: 10px;
       box-sizing: border-box;
       img {
         display: block;
         margin: 0 auto;
         margin-top: 10px;
       }
     }
     .left {
       position: relative;
       img {
         display: block;
         margin: 0 auto;
         margin-top: 5px;
       }
       .arrow,.manage {
         position: absolute;
         left:0;
         width: 60px;
         height:50px;
         background-color: #0a5ca0;
         cursor: pointer;
       }
       .arrow {
         top: 0;
         z-index: 6;
       }
       .manage {
         bottom: 0;
         z-index:5;
         color: #fff;
         text-align: center;
         img {
           margin-top: 5px;
         }
       }
       width: 60px;
       background-color: #0a5ca0;
     }
   }
 }
 @media screen and (max-width:1060px) {
 .container .quikItems {
   width: 580px;
 }
 .container {
   width: 845px;
 }
}
</style>
