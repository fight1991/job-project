<template>
  <div class="corpDisplay">
    <div class="title">企业风采</div>
    <div class="content-area clearfix">
      <div class="banner-default fl default" v-if="bannerList.length===0">
        <img class="default-left" src="https://www.5itrade.cn/files/CCBA/noPhoto.png" alt="">
        <p>暂无描述</p>
      </div>
      <div class="banner fl" v-else>
        <el-carousel height="300px" @change="getContent" :autoplay="true">
          <el-carousel-item  v-for="item in bannerList" :key="item.pid">
            <!-- <h3>{{ item }}</h3> -->
            <a :href="item.link === '' || item.link=== null ? 'javascript:;' : item.link " :target="item.link ? '_blank':'_self'">
              <img :src="item.pic" alt="">
            </a>
          </el-carousel-item>
        </el-carousel>
        <div class="intro">{{intro}}</div>
      </div>
      <div class="link-icon fr">
        <div class="items" v-for="item in iconList" :key="item.pid">
          <a :href="getURL()" target="_blank" v-if="item.link === 'other' && $store.state.userLoginInfo.adminFlag === 'true'" class="list-icon-com_default">
            <i></i>
            <p>{{item.title}}</p>
          </a>
          <a v-if="item.link != 'other'" :href="item.link === '' || item.link=== null ? 'javascript:;' : item.link " :target="item.link ? '_blank':'_self'">
            <img :src="item.pic" alt="">
            <p>{{item.title}}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from './eventBus.js'
import config from '@/config/config'
export default {
  data () {
    return {
      intro: '',
      bannerList: [],
      iconList: [
        {
          pid: 'unique',
          pic: '',
          link: 'other',
          title: '自定义'
        }
      ]
    }
  },
  created () {
    this.getAllCorpDIY()
    eventBus.$on('getAllCorpDIY', this.getAllCorpDIY)
  },
  methods: {
    // 获取轮播图片title
    getContent (index) {
      if (this.bannerList[index]) {
        this.intro = this.bannerList[index]['title']
      }
    },
    // 企业风采图片列表
    getAllCorpDIY () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/workspace/getAllCorpDIY',
        data: {},
        showErrorMessage: false,
        router: this.$router,
        success: (res) => {
          if (res.result.activities) {
            this.bannerList = res.result.activities
          } else {
            this.bannerList = []
          }
          if (res.result.links) {
            if (res.result.links.length <= 5) {
              this.iconList = [...res.result.links, ...this.iconList]
            } else {
              this.iconList = res.result.links
            }
          } else {
            this.iconList = [
              {
                pid: 'unique',
                pic: '',
                link: 'other',
                title: '自定义'
              }
            ]
          }
        }
      })
    },
    getURL () {
      let url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/companyAdmin/index?corpDisplay=true&corpId=' + this.$store.state.userLoginInfo.companyCode + '&sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID']
      return url
    }
  }
}
</script>
<style lang="less" scoped>
.corpDisplay {
  padding: 10px 20px
}
.title {
  line-height: 30px;
  color: @font-color-main;
  font-weight: bold;
}
.content-area {
  display: flex;
}
.default {
    img {
      display: block;
      margin: 35px auto 0 auto;
      width: 100%;
    }
    p {
      text-align: center;
      margin: 10px 0;
      color: @font-color-title;
    }
    .default-right {
      width: 24px;
      height: 24px;
    }
  }
.banner,.banner-default {
  width: 70%;
  height: 300px;
  padding-left: 20px;
  box-sizing: border-box;
  margin-top: 15px;
  border-radius: 3px;
  .intro {
    font-size: 16px;
    text-align: center;
    padding: 5px;
    color: #4c4c4c;
    margin-top: 5px;
  }
  a {
    display: block;
    height: 100%;
    width: 100%;
  }
}
.link-icon {
  width: 40%;
  height: 300px;
  padding-left: 22px;
  padding-right: 20px;
  box-sizing: border-box;
  margin-top: 15px;
  // display: flex;
  // justify-content: flex-start;
  // flex-wrap: wrap;
  // align-items: flex-start;
  .items {
    float: left;
    text-align: center;
    margin-bottom:50px;
    width: 48%;
    padding: 0 10px;
    box-sizing: border-box;
    min-width: 45px;
    // align-self: flex-start;
    img {
      width: 24px;
      height: 24px;
    }
  }
  p {
      margin:5px 0;
      font-size: 12px;
      color: @font-color-title;
  }
}
.el-carousel__item {
  overflow: visible;
  width: 100%;
  height: 100%;
  img {
    height: 100%;
    width: 100%;
  }
}

</style>
