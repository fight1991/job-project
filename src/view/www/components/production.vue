<template>
  <div class="production">
    <!-- 产品介绍模块 -->
    <div class="introItems">
      <div class="title">
        <p class="big">产品介绍</p>
        <p class="light">PRODUCT INTRODUCTION</p>
      </div>
      <div class="pro-intro mainer">
        <div class="text">
          {{text}}
        </div>
        <div class="pro-picture">
          <img src="@/assets/www-img/images/PI-Layout.png" alt="">
        </div>
      </div>
    </div>
    <!-- 产品流程区域 -->
    <div class="proFlow">
      <div class="title">
        <p class="big">产品流程</p>
        <p class="light">PRODUCT FLOW</p>
      </div>
      <div class="line-arrow mainer">
        <img :src="proFlow[0]" alt="">
      </div>
    </div>
    <!-- 功能区域 -->
    <div class="function">
      <div class="title">
        <p class="big">功能模块</p>
        <p class="light">FUNCTION</p>
      </div>
      <div class="item mainer">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(v , i ) in imgList" :key="i" class="item-card">
            <el-card :body-style="{ padding: '0px',height:'320px'}">
              <img :src="v.url" class="image">
              <div style="padding: 14px;">
                <span>{{v.title}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ v.pha }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 解决方案模块 -->
    <div class="solution">
      <div class="title">
        <p class="big">解决方案</p>
        <p class="light">SOLUTION</p>
      </div>
      <div class="sluItem mainer">
        <ul class="clearfix">
          <li class="item"><img :src="sluList[0]" alt=""></li>
          <li>
            <div class="details">
              <h3>通关解决方案</h3>
              <p>一站式查询税则信息、报关状态、舱单信息等通关信息，确保合规申报。</p>
              <p>提供标准化报关单导入模版，以及符合海关AEO认证要求的审单流程。</p>
              <p>700+条检控逻辑保障报关单内容的准确性，随附单据文件自动转换为符合单一窗口要求的PDF文件。</p>
              <p>无缝对接国际贸易单一窗口，报关状态实时跟踪。</p>
            </div>
          </li>
          <li>
            <div class="details">
              <h3>物流解决方案</h3>
              <p>连接物流环节中涉及的各参与方，各参与方协同参与。</p>
              <p>物流环节负责人员实时反馈物流环节状态，方便各参与方把控物流进度。</p>
              <p>物流动态全流程跟踪，提高企业对物流环节的风险预测能力和掌控能力。</p>
            </div>
          </li>
          <li class="item"><img :src="sluList[1]" alt=""></li>
          <li class="item"><img :src="sluList[2]" alt=""></li>
          <li>
            <div class="details">
              <h3>财务解决方案</h3>
              <p>满足AEO一般认证与高级认证要求，方便企业进行财务数据与资料整合管理。</p>
              <p>报价流程线上对接，询价审核在线完成，多角色物流费用真实预估。</p>
              <p>多种模式登账，费用账单自动生成，快速对账，自定义账单一键导出。</p>
              <p>提高对账效率与准确性，降低财务操作重复性，减少人工操作时间。</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="title">
        <p class="big">功能亮点</p>
        <p class="light">FUNCTIONAL HIGHTLIGHTS</p>
      </div>
      <div class="img mainer">
        <img src="@/assets/www-img/images/spots.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: `智慧通关服务平台是由中国报关协会和朗新科技通力合作联合运营的一款SaaS平台，该平台专注于通关服务科技赋能，贯通围绕进出口链路服务环节中的报关行、货代、仓储、物流等角色，运用人工智能、大数据、区块链、移动互联等先进技术和手段，促进新一代通关作业流程合规便利。`,
      imgList: [
        {
          url: require('@/assets/www-img/images/Function01.png'),
          title: '行业资讯',
          pha: '网罗海关总署，财政部，贸促会等与外贸相关的机构的官网各类法律法规、政策公告及相关信息，后台实时更新。'
        },
        {
          url: require('@/assets/www-img/images/Function02.png'),
          title: '财务与费用',
          pha: '维护费用信息，支持模板管理，自动结算相关费用。'
        },
        {
          url: require('@/assets/www-img/images/Function03.png'),
          title: '进出口管理',
          pha: '涵盖接单、制单、审单、申报、跟踪各项环节。支持用户在平台上完成于单一窗口申报前的所有操作。'
        },
        {
          url: require('@/assets/www-img/images/Function04.png'),
          title: '基础资料',
          pha: '维护客户、企业、证件等信息，支持模板导入。'
        },
        {
          url: require('@/assets/www-img/images/Function05.png'),
          title: '报表中心',
          pha: '涵盖综合业务报表与KPI报表，支持自主检索，生成满足内部或客户需要的报表；同时提供工作量统计、差错率分析等。'
        },
        {
          url: require('@/assets/www-img/images/Function06.png'),
          title: '系统管理',
          pha: '合理清晰的权限分配设置，同时支持自主分配操作权限。'
        }
      ],
      sluList: [
        require('@/assets/www-img/images/solution01.png'),
        require('@/assets/www-img/images/solution02.png'),
        require('@/assets/www-img/images/solution03.png')
      ],
      proFlow: [require('@/assets/www-img/images/flow.png')]
    }
  }
}
</script>

<style lang="less" scoped>

.introItems {
  padding: 40px 0;
}
.pro-intro {
  display: flex;
  .text {
    text-indent: 2em;
    line-height: 30px;
    color: #2E2E2E;
    padding: 20px 40px;
    flex: 1;
    font-size: 14px;
  }
  .pro-picture {
    width: 227px;
    margin-left: 10px;
    img {
      display: block;
      width: 100%;
    }
  }
}
.proFlow {
  // background-color: #0B5BA0;
  padding: 30px 5px;
  .line-arrow {
    margin-top: 40px;
    margin-bottom: 30px;
  }
}
.function {
  background-color: #F4F4F4;
  padding: 20px 0;
  .time {
    font-size: 13px;
    color: #999;
    line-height: 18px;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }
  .item-card {
    margin-bottom: 20px;
  }
}
.solution {
  padding: 30px 0;
  .img {
    margin: 40px auto;
    img {
      display: block;
      width:100%;
    }
  }
}
.sluItem {
  li {
    float: left;
    width: 50%;
    height: 310px;
    padding: 20px 0;
    overflow: hidden;
    img {
      width: 370px;
      margin: 0 auto;
      transition: all 1s;
      transform-origin: center center;
    }
    &:hover img{
      transform: scale(1.2)
    }
  .details {
    padding: 20px 0;
    padding-left: 40px;
    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    p {
      line-height: 26px;
      color: #333;
    }
  }
  }
}
</style>
