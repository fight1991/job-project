<template>
  <div class="mainer charge">
    <div class="left">
      <ul ref="uls">
        <li v-for="(item,index) in parter " :key="item.src" @click.prevent="showContent(index)">
          <a href="javascript:;">
            <img :src="item.src" alt="">
            <p>{{item.title}}</p>
          </a>
        </li>
      </ul>
      <a href="javascript:;" @click="clickUp"><div class="arrow-all arrow-up "><span class="iconfont icon-shangjiantou"></span></div></a>
      <a href="javascript:;" @click="clickDown"><div class="arrow-all arrow-down"><span class="iconfont icon-iconfontarrows"></span></div></a>
    </div>
    <div class="right">
      <h3>{{content.title}}</h3>
      <div class="detail" v-for="(item,index) in content.detail" :key="index">
        <p class="title"><span class="dot"></span>{{item.little}} </p>
        <div class="content">{{item.phrap}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      parter: [
        {
          src: require('@/assets/www-img/images/lunbo/henanyuehai.png'),
          title: '河南悦海国际货运代理有限公司',
          detail: [
            {
              little: '客户介绍',
              phrap: '河南悦海国际货运代理有限公司是于2000年8月经国家商务部批准成立的国家一级货运代理,并于2002年3月一次性通过ISO9000认证。主要承接海运、空运、陆海联运、国际联运等进出口货物的国际运输业务；代理报关、报验、咨询等业务；并办理地面代理、货物分拣装卸整理。'
            },
            {
              little: '企业痛点',
              phrap: '企业为提升市场竞争力，需提高自身认证企业等级。而AEO认证是一项严谨的管理优化工程，不但需在硬件上提升，还需有相配套的信息化系统给与支持。这正是河南悦海所缺少的方面。'
            },
            {
              little: '服务内容',
              phrap: '提供完善的信息化管理系统， 涵盖企业的完整业务。 可在线对业务数据进行继续与操作。按照企业需求进行智能化数据分析和整合，保证数据在多部门之间进行协同流转。'
            },
            {
              little: '系统价值',
              phrap: '能够完整、准确、有效记录企业的生产经营、进出口及代理报关活动，保留3年及更多历史数据。尤其是财、通关、物流运输等方面数据。支持智能报表生成与分析，以及多种形式的数据导出。通过系统串联业务流程中的多角色、企业中的多部门，实现更大范围内的协同。帮助企业降低通关成本，提升效率，降低风险，成为AEO认证企业。'
            }
          ]
        },
        {
          src: require('@/assets/www-img/images/lunbo/huaguangyuanhai.png'),
          title: '湖南华光源海国际物流股份有限公司',
          detail: [
            {
              little: '客户介绍',
              phrap: '湖南华光源海国际物流股份有限公司是一家集船务代理、物流运输、货运代理，报关、报检等为一体的综合服务企业。船务板块以长江流域内支线集装箱航运业务为核心；已与26家国际班轮公司达成订舱、签单、箱管合作；货代业务辅以报关、报检、LOCAL服务为客户提供增值服务。'
            },
            {
              little: '企业痛点',
              phrap: 'ERP系统不具备制单功能，已经录入的数据，需要在制单环节重复录入，效率低下。'
            },
            {
              little: '服务内容',
              phrap: '提供API接口，采集ERP系统中的提运单号等数据与海关总署对接，提供舱单信息查询服务。'
            },
            {
              little: '系统价值',
              phrap: '制单时调用API接口，直接导入提运单号、集装箱号，提高制单效率；根据导入的提运单号，通过舱单信息查询服务，二次完善制单信息，进一步提高制单效率。'
            }
          ]
        },
        {
          src: require('@/assets/www-img/images/lunbo/shidahuanyu.png'),
          title: '无锡世达环宇国际货运代理有限公司',
          detail: [
            {
              little: '客户介绍',
              phrap: '无锡世达环宇国际货运代理有限公司创立于2009年，是中华人民共和国批准的具有一级资质的国际货运代理企业。主要服务项目有国际物流、国内物流、工程设备作业，保税物流、DC仓储。'
            },
            {
              little: '企业痛点',
              phrap: '航班落地时间晚，需要人工实时关注航班动态进行手动申报。需要手动在单一窗口、QP录入，大量重复性的人工操作，费事费力。'
            },
            {
              little: '服务内容',
              phrap: '小程序提供航班动态实时更新推送功能，可以实时关注到航班动态。PC端的航空器申报页面提供导入功能，并可以根据航班动态进行自动申报。'
            },
            {
              little: '系统价值',
              phrap: '航班动态实时更新，系统根据航班落地时间进行自动申报，减轻了人工操作压力，降低实时申报的时间成本。系统批量导入减少重复性录入，减低录入时间，节省人力资源，减少手工录入差错。'
            }
          ]
        },
        {
          src: require('@/assets/www-img/images/lunbo/wanli.png'),
          title: '上海万历报关有限公司',
          detail: [
            {
              little: '客户介绍',
              phrap: '上海万历报关有限公司是一家资深、优质的报关服务供应商，二十余年专注于报关领域。它是现存为数不多的全国首批报关企业以及全国首批拥有预归类资质的报关企业。下属的3家子公司，分别从事国内外货运代理以及报关服务，可以完整覆盖国际贸易的各个环节。'
            },
            {
              little: '企业痛点',
              phrap: '3家子公司分别使用不同的系统，数据无法共享；报关行ERP系统支持制单，但是无法导入单一窗口；无法跟踪申报后的报关单状态。'
            },
            {
              little: '服务内容',
              phrap: '分别对接3家子公司的ERP系统，完成数据共享、制单、反馈报关状态；对接单一窗口，完成申报以及后续的报关状态获取。'
            },
            {
              little: '系统价值',
              phrap: '降低了企业在单一窗口二次制单的时间成本；企业在ERP系统中即可完成对报关状态的跟踪，提高工作效率。'
            }
          ]
        }
      ],
      content: {
        title: '河南悦海国际货运代理有限公司',
        detail: [
          {
            little: '客户介绍',
            phrap: '河南悦海国际货运代理有限公司是于2000年8月经国家商务部批准成立的国家一级货运代理,并于2002年3月一次性通过ISO9000认证。主要承接海运、空运、陆海联运、国际联运等进出口货物的国际运输业务；代理报关、报验、咨询等业务；并办理地面代理、货物分拣装卸整理'
          },
          {
            little: '企业痛点',
            phrap: '企业为提升市场竞争力，需提高自身认证企业等级。而AEO认证是一项严谨的管理优化工程，不但需在硬件上提升，还需有相配套的信息化系统给与支持。这正是河南悦海所缺少的方面。'
          },
          {
            little: '服务内容',
            phrap: '提供完善的信息化管理系统， 涵盖企业的完整业务。 可在线对业务数据进行继续与操作。按照企业需求进行智能化数据分析和整合，保证数据在多部门之间进行协同流转。'
          },
          {
            little: '系统价值',
            phrap: '能够完整、准确、有效记录企业的生产经营、进出口及代理报关活动，保留3年及更多历史数据。尤其是财、通关、物流运输等方面数据。支持智能报表生成与分析，以及多种形式的数据导出。通过系统串联业务流程中的多角色、企业中的多部门，实现更大范围内的协同。帮助企业降低通关成本，提升效率，降低风险，成为AEO认证企业。'
          }
        ]
      },
      current: ''
    }
  },
  created () {
  },
  mounted () {
    this.showContent(0)
  },
  methods: {
    clickDown () {
      let temp = this.parter.splice(this.parter.length - 1, 1)
      this.parter.unshift(...temp)
      if (this.current === 0 || this.current) {
        this.content = this.parter[this.current]
      }
      this.$nextTick(() => {
        let lis = Array.from(this.$refs['uls'].querySelectorAll('li'))
        lis.forEach(v => {
          v.classList.remove('now')
        })
        lis[this.current].classList.add('now')
      })
    },
    clickUp () {
      let temp = this.parter.splice(0, 1)
      this.parter.push(...temp)
      if (this.current === 0 || this.current) {
        this.content = this.parter[this.current]
      }
      this.$nextTick(() => {
        let lis = Array.from(this.$refs['uls'].querySelectorAll('li'))
        lis.forEach(v => {
          v.classList.remove('now')
        })
        lis[this.current].classList.add('now')
      })
    },
    showContent (index) {
      this.current = index
      let lis = Array.from(this.$refs['uls'].querySelectorAll('li'))
      lis.forEach((v, i) => {
        if (index === i) {
          v.classList.add('now')
        } else {
          v.classList.remove('now')
        }
      })
      this.content = this.parter[index]
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter,.fade-leave-to {
            opacity: 0;
        }
  .fade-enter-active ,.fade-leave-active {
      transition: opacity 3s;

}

  .image {
    padding: 15px 0;
    img {
      width: 90px;
      margin: 0 auto;
    }
  }
  .mainer {
    padding: 30px 0;
    // height: 600px;
    text-align: center;
    display: flex;
    .left {
      text-align: center;
      overflow: hidden;
      width: 260px;
      position: relative;
      // border: 1px solid red;
      padding: 20px 0;
      ul {
        background-color: #fff;
        transition: 1s all;
        padding: 0;
      }
      .arrow-all {
        height: 20px;
        width: 100%;
        font-size: 18px;
        color: #666;
        background-color: #ccc;
        line-height: 20px;
        position: absolute!important;
        left: 0;
      }
      .arrow-up {
        top: 0;
      }
      .arrow-down {
        bottom: 0;
      }
      li {
        padding: 10px;
        border: 1px solid #ccc;
        margin: 10px 0;
        p {
          margin: 10px 0;
        }
      }
      .now {
        border:1px solid #0A5CA0;
      }
      img {
        width: 90px;
        margin: 0 auto;
      }
    }
    .right {
      flex: 1;
      text-align: left;
      padding: 20px;
      margin-left: 20px;
      border: 1px solid #ccc;
      h3 {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
      }
      .title {
        font-weight: bold;
        margin: 10px 0;
        font-size: 14px;
        font-family: "Microsoft YaHei"
      }
      .content {
        text-indent: 2em;
        line-height:24px;
      }
      .dot {
        width: 8px;
        height: 8px;
        background-color: #0A5CA0;
        border-radius: 50%;
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 1px;
      }
    }
  }

  @keyframes scroll {
    from {
      transform: translateY(0px)
    }
    to {
       transform: translateY(478px)
    }
  }

</style>
