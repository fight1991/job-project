<template>
  <div class="purchase">
    <div class="order mainer">
      <div class="title">
        <p class="big">产品订购</p>
        <p class="light">PRODUCT ORDER</p>
      </div>
      <div class="list">
        <div class="list-item" v-for="item in list" :key="item.id">
          <div class="title">{{item.title}}</div>
          <div class="imgBox url-prefix">
            <img :src="item.image" alt="">
            <el-tooltip effect="dark" placement="top">
              <div slot="content" style="width:192px;color:#fff">{{item.describe}}</div>
              <div class="describe txt-cut-3 moz">
                <span ref="spans">{{item.describe}}</span>
              </div>
            </el-tooltip>
            <!-- <div class="tips">{{item.describe}}</div> -->
          </div>
          <div class="btn-order"><button v-for="(item2,index) in item.status" :key="index" @click.prevent="goToPurchase">{{item2}}</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import config from '@/config/config'
import pathList from '@/config/pathList'
export default {
  data () {
    return {
      list: [
        {
          id: 1,
          title: '综合资讯',
          image: require('@/assets/www-img/images/purchase/news.png'),
          describe: '通过网络机器人提供及时、权威的外贸、通关相关的资讯信息。',
          status: ['免费']
        },
        {
          id: 2,
          title: '通关参数',
          image: require('@/assets/www-img/images/purchase/pass-paramas.png'),
          describe: '提供通关过程中所需的通关代码、商品申报参数、汽车申报参数等内容的在线查询。',
          status: ['免费']
        },
        {
          id: 3,
          title: '通关状态查询',
          image: require('@/assets/www-img/images/purchase/passState.png'),
          describe: '提供报关单、舱单等相关通关状态的查询。',
          status: ['免费']
        },
        {
          id: 4,
          title: '进出口管理',
          image: require('@/assets/www-img/images/purchase/ie-manage.png'),
          describe: '涵盖接单、制单、审单、申报、跟踪各项环节。支持用户在平台上完成于单一窗口申报前的所有操作。',
          status: ['¥1.00/票', '订购']
        },
        {
          id: 5,
          title: '物流跟踪',
          image: require('@/assets/www-img/images/purchase/trans-follow.png'),
          describe: '提供线上实时的物流全流程跟踪功能，从创建委托、操作员分配、节点跟踪、节点操作、单证同步，全程线上同步提醒、异常提示，摆脱传统物流中电话、邮件、跟踪不及时的困扰。',
          status: ['¥4,000.00元/年', '订购']
        },
        {
          id: 6,
          title: '物流费用管理',
          image: require('@/assets/www-img/images/purchase/trans-cost.png'),
          describe: '将线下物流费用管理转移至线上，将物流合同、报价等流程系统化，智能化，提供系统自动费用计算，灵活登账，通过算法统计汇总物流过程中的所有费用，大幅降低人工操作错误风险，降低成本。',
          status: ['¥4,000.00元/年', '订购']
        },
        {
          id: 7,
          title: '商品归类',
          image: require('@/assets/www-img/images/purchase/product-according.png'),
          describe: '提供商品归类查询及智能归类服务。',
          status: ['¥2,000.00元/年', '订购']
        },
        {
          id: 8,
          title: '金二账册',
          image: require('@/assets/www-img/images/purchase/jiner-account.png'),
          describe: '提供完整的加工贸易账册体系，为企业建立符合海关、企业需求和海关监管要求的加工电子账册而服务，优化“备案、通关、核销”三段式管理模式，实现预录入及数据传输功能。',
          status: ['¥2,000.00元/年', '订购']
        }
      ]
    }
  },
  mounted () {
    Array.from(this.$refs['spans']).forEach(v => {
      if (v.offsetHeight < 50) {
        // 省略号隐藏
        v.parentElement.classList.remove('moz')
      }
    })
  },
  methods: {
    goToPurchase (e) {
      console.log('改好')
      if (e.target.innerHTML === '订购') {
        let LoginUrl = pathList.WWWLOGINBACK
        window.open(LoginUrl, '_self')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@-moz-document url-prefix(){
  .moz{
    position: relative;
    // line-height: 20px;
    height: 60px;//设置最大高度，加上overflowhidden，正好是两行，使超出部分隐藏
    overflow: hidden;
   }
   .moz::after{
    content: "...";
    position: absolute;
    bottom: 0;
    right: 0;
    padding-left: 20px;//以上三个属性，可以后续调整，看要把...放在哪个位置
    background: -webkit-linear-gradient(left, transparent, #fff 55%);
    background: -o-linear-gradient(right, transparent, #fff 55%);
    background: -moz-linear-gradient(right, transparent, #fff 55%);
    background: linear-gradient(to right, transparent, #fff 55%);//背景色可写成渐变也可写成一样的颜色
  }
}
.order {
  padding: 60px 0;
  >.title {
    margin-bottom: 50px;
  }
}
.list {
  // box-shadow: 0 0 0 3px #FAFAFA;
  // background-color: #FAFAFA;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .btn-order {
      text-align: center;
      width: 100%;
      padding: 0;
      height: 85px;
      button {
        display: block;
        border: 1px solid #b2b2b2;
        padding: 5px 0;
        width: 100%;
        margin: 0 0 10px;
        border-radius: 4px;
        background-color: #fff;
        &:nth-child(2) {
          border: 1px solid #0b5ba0;
          color: #0b5ba0;
        }
        &:nth-child(1) {
          cursor:auto;
        }
      }
    }
  .list-item {
    // background-color: #fff;
    padding: 20px 24px 15px;
    box-sizing: border-box;
    width: 242px;
    border: 1px solid #b2b2b2;
    margin-bottom: 10px;
    border-radius: 5px;
    button {
      cursor: pointer;
    }
    &:hover {
      border: 1px solid #ff7125;
      button:nth-child(1) {
        border: 1px solid #ff7125;
        color: #ff7125
      }
      button:nth-child(2) {
        background-color: #0b5ba0;
        color: #fff
      }
    }
    .title {
      color: #333;
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      padding-bottom: 5px;
    }
    .describe {
      color: #808080;
      font-size: 12px;
      margin-top: 10px;
      height: 50px;
      margin-bottom: 10px;
    }
    img {
      display: block;
      margin: 0 auto;
      width: 72px;
    }

  }
}
</style>
