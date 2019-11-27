<template>
  <div class="index">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel :interval="3000" :autoplay="true" :height="bannerHeight + 'px'">
        <el-carousel-item v-for="(item,index) in bannerList" :key="item.imageUrl">
          <div class="imgBox" ref="imgBox"  @click.prevent="order('anchor',index)">
            <img :src="item.imageUrl" alt="" ref="image" :class="bannerList[index].linkUrl ? {'pointer-cls': true} : {'pointer-cls': false}">
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="link">
        <!-- 生态协调区域 -->
      <div class="title">
        <p class="big">生态、协同</p>
        <p class="light">ECOLOGY、COLLABORATION</p>
      </div>
      <div class="link-items mainer">
        <div class="link-detail" v-for="item in linkList" :key="item.id" @click="goToLink(item)">
          <img :src="item.icon" alt="">
          <p v-html="item.text"></p>
        </div>
      </div>
    </div>
    <div class="mainer">
      <!-- 专业区域 -->
      <div class="pro">
        <div class="title">
          <p class="big">专业</p>
          <p class="light">PROFESSIONAL</p>
        </div>
        <div class="detail clearfix">
          <div class="item" v-for="item in pro" :key="item.imgURL">
            <img :src="item.imgURL" alt="">
            <p class="up">{{item.up}}</p>
            <p class="down">{{item.down}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 智能区域 -->
    <div class="intel">
      <div class="content mainer">
        <div class="title">
          <div class="big">智能</div>
          <div class="light">INTELLIGENCE</div>
        </div>
        <div class="detail clearfix">
          <div class="item first">
            <img src="@/assets/www-img/images/intel01.png" alt="">
          </div>
          <div class="item text">
            <div class="title">智能单证识别</div>
            <p>可以将各个客户的不同清单数据，自动抓取形成标准的清单模板，一键生成报关单，避免人工录入差错，轻松实现快速制单提高作业效率。</p>
          </div>
          <div class="item">
            <img src="@/assets/www-img/images/intel02.png" alt="">
          </div>
          <div class="item">
            <img src="@/assets/www-img/images/intel03.png" alt="">
          </div>
          <div class="item text">
            <div class="title">智能逻辑检控</div>
            <p>采用官方制单校验规则，进行风险预警及二次复核，确保申报合规，自动生成标准单证清单；分析操作员历史制单情况，提供参考模板，提高制单准确率及效率。</p>
          </div>
          <div class="item">
            <img src="@/assets/www-img/images/intel04.png" alt="">
          </div>
          <div class="item text">
            <div class="title">大数据+人工智能</div>
            <p>基于海量数据支持，进行大数据分析，通过平台数据分析、算法精准匹配，辅助决策并提供相应报表，真正走在智能化潮流的前端。</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 高效区域 -->
    <div class="effi mainer">
      <div class="title">
        <div class="big">高效</div>
        <div class="light">EFFICIENCY</div>
      </div>
      <div class="list">
        <div class="list-item clearfix">
          <div class="media fl" v-for="item in list" :key="item.imgURL">
            <div class="media-left media-middle">
              <a href="javascript:;">
                <img class="media-object" :src="item.imgURL" alt="">
              </a>
            </div>
            <div class="media-body">
              <h4 class="media-heading">{{item.title}}</h4>
              <p>{{item.text}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 预约演示区域 -->
    <div class="order">
      <div class="button">
        <button class="btn btn-default" @click="register">立即注册</button>
        <button @click.prevent="order('anchor','other')" class="btn btn-warning pull-right">预约演示</button>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../common/eventBus'
import pathList from '@/config/pathList'
import '@/assets/www-style/font/iconfont.css'
import { linkList } from '@/config/www'
export default {
  data () {
    return {
      bannerHeight: 380,
      imgBL: 380 / 1440,
      isShow: true,
      expert: true,
      pro: [
        {
          imgURL: require('@/assets/www-img/images/pro01.png'),
          up: '平台由中国报关协会联合运营，保持行业权威优势。',
          down: '在中国报关协会的指导下，合力提供一个安全、公平、统一的运营环境，提升行业信息及时传递。'
        },
        {
          imgURL: require('@/assets/www-img/images/pro02.png'),
          up: '深耕领域超过15年，关务信息化行业领导者。',
          down: '行业一流团队，为众多报关、货代、世界500强知名进出口企业提供通关信息服务产品。'
        },
        {
          imgURL: require('@/assets/www-img/images/pro03.png'),
          up: '优秀的通关信息化整体解决方案咨询专家。',
          down: '可根据企业通关、物流、仓储、关务管理的现状及痛点，为企业制定最优合规便利信息化解决方案。'
        }
      ],
      list: [
        {
          imgURL: require('@/assets/www-img/images/ef01.png'),
          title: '无纸化单证自动转换',
          text: '原来，客户提供电子档的资料需要打印单证、然后统一扫描，再上传到单一窗口。现在，WORD、PDF、EXCEL等自动生成符合无纸化申报要求的文件格式，省去打印和扫描的步骤，轻松提效50%以上。'
        },
        {
          imgURL: require('@/assets/www-img/images/ef02.png'),
          title: '可视化审单',
          text: '原来，在电脑上录入，审核人员打印后逐一审核。现在，首创报关环节全线上操作，直接在电脑上完成审单和校对，无需打印，无需纸质留档完美满足AEO认证申请系统需求，有效保障申报正确率。'
        },
        {
          imgURL: require('@/assets/www-img/images/ef03.png'),
          title: 'AEO合规',
          text: '智慧通关服务平台完美满足AEO认证要求，主要参考标准为：内部控制标准、财务状况标准、守法规范标准、贸易安全标准和附加标准。'
        },
        {
          imgURL: require('@/assets/www-img/images/ef04.png'),
          title: '制单风险预警',
          text: '通过数据化的展示，实时统计制单易错点，在制单过程中自动警示历史易错点，显著提高制单准确率。清晰列出操作员历史累积错误统计，为企业培训与操作员技能优化提供有效的数据支持。'
        },
        {
          imgURL: require('@/assets/www-img/images/ef05.png'),
          title: '商品数据库',
          text: '申报录单自动提示选取，一次录入即可反复使用，制单速度提效80%以上。'
        }, {
          imgURL: require('@/assets/www-img/images/ef06.png'),
          title: '通关状态全透明',
          text: '通关物流状态数据实时同步，随时了解通关进度，方寸之间尽显从容。'
        }
      ],
      bannerList: [],
      linkList: []
    }
  },
  mounted () {
    this.setSize()
    window.addEventListener('resize', this.setSize)
  },
  created () {
    this.getBanner()
    let path = linkList[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']
    this.linkList = path
  },
  methods: {
    order (anchor, index) {
      // 链接地址不存在
      if (index >= 0 && !this.bannerList[index].linkUrl) {
        return
      }
      // 立即预约 轮播图跳转 或点击按钮跳转
      if ((index >= 0 && this.bannerList[index].linkUrl.indexOf('#') > -1) || index === 'other') {
        this.$router.push('/contactUs#anchor')
        eventBus.$emit('changeStyle', null)
      } else if (index >= 0 && this.bannerList[index].linkUrl.indexOf('talent') > -1) {
        this.$router.push('/talent')
        eventBus.$emit('changeStyle', null)
      } else { // 其他链接地址
        window.open(this.bannerList[index].linkUrl, '_blank')
      }
      console.log(this.requiredPointer)
    },
    register () {
      let registerUrl = pathList.WWWLOGINBACK
      window.open(registerUrl, '_self')
    },
    setSize () {
      this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (this.screenWidth >= 1000) {
        this.bannerHeight = this.imgBL * this.screenWidth - 6
      } else {
        this.bannerHeight = this.imgBL * 1000
      }
    },
    getBanner () {
      this.$store.dispatch('ajax', {
        url: 'API@/plat-manager/carouselManager/showCarousel',
        data: {
          code: 'CONFIG:CCBA_FIRST_PAGE'
        },
        router: this.$router,
        success: res => {
          this.bannerList = res.result
          this.isShow = false
        }
      })
    },
    goToLink (item) {
      window.open(item.link, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
// 轮播图区域
.block {
  .imgBox {
    position: relative;
    button {
      position:absolute;
      border: none;
      left: 40%;
      top: 68%;
      width: 189px;
      height: 65px;
      background: url("../../../assets/www-img/images/order.png") no-repeat center 100%;
    }
  }
}
// 生态区域
.link {
  background-color: #f0f5ff;
  padding: 40px 0 20px;
  .link-items {
    display: flex;
    // justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .link-detail {
    width: 20%;
    margin: 20px 0 30px;
    cursor: pointer;
    img {
      display: block;
      width: 80px;
      margin: 0 auto;
    }
    p {
      margin: 0;
      padding: 0;
      font-size: 12px;
      margin: 10px 0;
      text-align: center;
      color: black;
      font-weight: bold;
    }
  }
}
// 专业区域
.big {
    font-size: 22px;
    color: #2E2E2E;
    font-weight: bold;
    text-align: center;
  }
.light {
    color: #999;
    font-size: 16px;
    text-align: center;
    margin: 5px 0 20px 0;
  }
.pro {
  height: 350px;
  padding: 30px 0;
  .item {
    img {
      width: 86px;
      margin: 0 auto 26px auto;
    }
    float: left;
    width: 33.3%;
    padding: 0 40px;
    .up {
      margin-bottom: 16px;
      font-size: 14px;
      color: #333;
    }
    .down {
      font-size: 12px;
      color: #808080;
    }
  }
}
// 智能区域
.intel {
  background-color: #fff;
  padding: 0 0 70px 0;
  .detail {
    .item {
      float: left;
      width: 25%;
      overflow: hidden;
      img {
        transition: all 1s;
        transform-origin: center center;
      }
      &:hover img{
      transform: scale(1.5)
    }
      &.text {
        padding: 40px 20px 20px;
        background-color: #f0f5ff;
      }
      .title {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-bottom: 10px;
      }
      p {
        font-size: 12px;
        color: #4d4d4d;
        line-height: 26px;
      }
    }
    .first {
      width: 50%;
    }
    .text {
      height: 200px;
    }
  }
}
// 高效区域
.effi {
  padding: 40px 0;
}
.list-item {
    img {
    width: 74px;
    height: 74px;
  }
  .media {
    display: flex;
    width: 50%;
    height: 105px;
    margin-top: 30px;
    &:nth-child(2n+1) {
      padding-right: 30px;
    }
    &:nth-child(2n) {
      padding-left: 30px;
    }
  }
  .media-body {
    padding: 0 10px 0 20px;
    .media-heading {
      font-weight: bold;
      font-size: 18px;
      color: #333;
      margin-bottom: 5px;
    }
    p {
      line-height: 20px;
      font-size: 12px;
      color: #808080;
    }
  }
}
// 预约演示区域
.order {
  height: 155px;
  padding-top: 50px;
  background: url('../../../assets/www-img/images/contact.png') no-repeat center;
  background-size: cover;
  box-sizing: border-box;
  .button {
    width: 450px;
    margin: 0 auto;
    cursor: pointer;
    .btn-default {
      background-color: #fff;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-warning {
      background-color: #FE7200;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button {
      width: 200px;
      height: 60px;
      font-size: 24px;
      font-weight: bold;
      &:nth-child(1) {
        color: #0A5CA0;
        border:none;
      }
      &:nth-child(2) {
        color: #fff;
      }
    }
  }
}

</style>
