import Router from 'vue-router'
import Errors from './view/error'
import config from './config/config'
import util from './common/util'
import base64 from '@/common/base64'
import IEPort from './view/pages/iExport/router'
import DataCenter from './view/pages/dataCenter/router'
import ReportCenter from './view/pages/reportCenter/router'
import Aircraft from './view/pages/aircraft/router'
import WWW from './view/www/index'
import Account from './view/pages/account/router'
import Hand from './view/pages/handBook/router'
import Circulation from './view/pages/circulation/router'
import Graininess from './view/pages/graininess/router'
import Sea from './view/pages/sea/router'
import PassParams from './view/pages/passParams/router'
import ExpressDeclare from './view/pages/expressDeclare/router'
import ContractManage from './view/pages/contract/router'
import Finance from './view/pages/finance/router'
import Entrust from './view/pages/entrust/router'
import ExpertAnswer from './view/pages/expertAnswer/router'
import UserAnswer from './view/pages/userAnswer/router'

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/control'
  }, {
    path: '/main',
    name: 'main',
    component: resolve => require(['./view/pages/main.vue'], resolve),
    meta: {
      title: '主页'
    },
    children: []
  }, {
    path: '/index',
    name: 'www',
    hidden: true,
    icon: 'el-icon-menu',
    permissions: 'WF000000',
    component: resolve => require(['./view/www/index.vue'], resolve),
    meta: {
      title: 'CCBA官网'
    },
    children: []
  }, {
    path: '/control',
    name: 'control',
    hidden: true,
    icon: 'el-icon-menu',
    permissions: 'WF000000',
    component: resolve => require(['./view/control/index.vue'], resolve),
    meta: {
      title: '工作台'
    }
  }, {
    path: '/news/detail',
    name: 'detail',
    hidden: true,
    permissions: 'WF000000',
    component: resolve => require(['./view/control/components/detail.vue'], resolve),
    meta: {
      title: '详情'
    }
  }, {
    path: '/news/newsList',
    name: 'newsList',
    hidden: true,
    permissions: 'WF000000',
    component: resolve => require(['./view/control/components/newsList.vue'], resolve),
    meta: {
      title: '资讯列表'
    }
  },
  Errors.MENU
]

// routes[1].children.push(Errors.MENU)
routes[1].children.push(...IEPort.MENU)
routes[1].children.push(...DataCenter.MENU)
routes[1].children.push(...ReportCenter.MENU)
routes[1].children.push(...Aircraft.MENU)
routes[1].children.push(...Account.MENU)
routes[1].children.push(...Hand.MENU)
routes[1].children.push(...Circulation.MENU)
routes[1].children.push(...Graininess.MENU)
routes[1].children.push(...Sea.MENU)
routes[1].children.push(...PassParams.MENU)
routes[1].children.push(...ExpressDeclare.MENU)
routes[1].children.push(...ContractManage.MENU)
routes[1].children.push(...Finance.MENU)
routes[1].children.push(...Entrust.MENU)
routes[1].children.push(...ExpertAnswer.MENU)
routes[1].children.push(...UserAnswer.MENU)
routes[2].children.push(...WWW.MENU)
const router = new Router({
  mode: 'history',
  base: 'ccba2',
  routes: routes
})

router.beforeEach((to, from, next) => {
  let childSys = to.path.split('/')
  if (childSys.length >= 2) {
    let json = {
      type: '',
      title: ''
    }
    switch (childSys[1]) {
      case 'iExport':
        json = {
          type: 'iExport',
          title: '进出口管理',
          permissions: 'CCBA20200000000'
        }
        break
      case 'dataCenter':
        json = {
          type: 'dataCenter',
          title: '资料中心',
          permissions: 'CCBA20300000000'
        }
        break
      case 'reportCenter':
        json = {
          type: 'reportCenter',
          title: '报表中心',
          permissions: 'CCBA20600000000'
        }
        break
      case 'aircraft':
        json = {
          type: 'aircraft',
          title: '航空器申报',
          permissions: 'CCBA20400000000'
        }
        break
      case 'account':
        json = {
          type: 'account',
          title: '加工贸易账册',
          permissions: 'CCBA20700000000'
        }
        break
      case 'handBook':
        json = {
          type: 'handBook',
          title: '加工贸易手册',
          permissions: 'CCBA20800000000'
        }
        break
      case 'circulation':
        json = {
          type: 'circulation',
          title: '保税货物流转',
          permissions: 'CCBA21100000000'
        }
        break
      case 'graininess':
        json = {
          type: 'graininess',
          title: '保税物流管理',
          permissions: 'CCBA21000000000'
        }
        break
      case 'sea':
        json = {
          type: 'sea',
          title: '海关特殊监管区域',
          permissions: 'CCBA20900000000'
        }
        break
      case 'passParams':
        json = {
          type: 'passParams',
          title: '通关参数',
          permissions: 'CCBA21200000000'
        }
        break
      case 'expressDeclare':
        json = {
          type: 'expressDeclare',
          title: '快件申报',
          permissions: 'CCBA21200000000'
        }
        break
      case 'contract':
        json = {
          type: 'contract',
          title: '合同管理',
          permissions: 'CCBA21400000000'
        }
        break
      case 'finance':
        json = {
          type: 'finance',
          title: '物流费用管理系统',
          permissions: 'CCBA21400000000'
        }
        break
      case 'entrust':
        json = {
          type: 'entrust',
          title: '业务委托',
          permissions: 'CCBA21500000000'
        }
        break
      case 'expertAnswer':
        json = {
          type: 'expertAnswer',
          title: '专家答疑',
          permissions: 'ccba2010'
        }
        break
      case 'userAnswer':
        json = {
          type: 'userAnswer',
          title: '专家答疑',
          permissions: 'ccba2010'
        }
        break
    }
    router.app.$options.store.commit('setChildSys', json)
    if (from.fullPath === '/' && to.params && to.params.sysData && window.sessionStorage.getItem('fromLogin') === 'true') {
      window.sessionStorage.removeItem('fromLogin')
      next('/' + childSys[1] + '/index')
    }
  }
  /* 登录校验：
     1、登录页面直接放行
  */
  if (to.path === '/index' || to.path === '/production' || to.path === '/charge' || to.path === '/aboutUs' || to.path === '/contactUs' || to.path === '/productOrder' || to.path.includes('/talent')) {
    if (!util.isEmpty(to.query.token)) {
      router.app.$options.store.commit('setToken', to.query.token)
      window.localStorage.setItem('token', to.query.token)
    } else if (!util.isEmpty(window.localStorage.getItem('token'))) {
      router.app.$options.store.commit('setToken', window.localStorage.getItem('token'))
    }
    next()
  } else if (to.path === '/login') {
    util.clearLoginStorage()
    window.sessionStorage.clear()
    let callbackUrl = util.delTokenUrl()
    let goLoginUrl = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/login?callback=' + callbackUrl + '&sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID']
    window.open(goLoginUrl, '_self')
  } else {
    if (!router.app.$options.store.state.isFirst) {
      if (router.app.$options.store.state.userLoginInfo.token === '') {
        next('/login')
      } else {
        next()
      }
    } else {
      if (to.path === '/error/404' || to.path === '/error/500' || to.path === '/error/wait') {
        next()
      } else {
        if (!util.isEmpty(to.query.token)) {
          router.app.$options.store.commit('setToken', to.query.token)
          window.localStorage.setItem('token', to.query.token)
        } else if (!util.isEmpty(window.localStorage.getItem('token'))) {
          router.app.$options.store.commit('setToken', window.localStorage.getItem('token'))
        } else {
          next('/login')
        }
        router.app.$options.store.dispatch('ajax', {
          url: 'API@/login/login/getLoginUserInfo',
          data: {
            ssoToken: window.localStorage.getItem('token')
          },
          router: router,
          success: (res) => {
            let datas = {
              token: window.localStorage.getItem('token'), // token数据
              userId: util.isEmpty(res.result.userId) ? '' : res.result.userId,
              userName: util.isEmpty(res.result.userName) ? '' : res.result.userName,
              mobile: util.isEmpty(res.result.mobile) ? '' : res.result.mobile,
              userPhoto: util.isEmpty(res.result.userPhoto) ? '' : res.result.userPhoto,
              companyName: util.isEmpty(res.result.corpName) ? '' : res.result.corpName,
              adminFlag: util.isEmpty(res.result.adminFlag) ? '' : res.result.adminFlag,
              sccCode: util.isEmpty(res.result.sccCode) ? '' : res.result.sccCode,
              companyCode: util.isEmpty(res.result.corpId) ? '' : res.result.corpId,
              cusCorpName: util.isEmpty(res.result.cusCorpName) ? '' : res.result.cusCorpName, // 企业海关名
              ciqCode: util.isEmpty(res.result.ciqCode) ? '' : res.result.ciqCode, // 企业检验检疫代码
              tradeCode: util.isEmpty(res.result.tradeCode) ? '' : res.result.tradeCode // 企业十位海关代码
            }
            if (!util.isEmpty(res.result.userTitleList)) {
              sessionStorage.setItem('userTitleList', JSON.stringify(res.result.userTitleList))
            }
            router.app.$options.store.commit('userLoginInfo', datas)
            router.app.$options.store.commit('isFirstChange')
            router.app.$options.store.dispatch('ajax', {
              url: 'API@/login/userPrivilege/getUserPrivileges',
              data: {},
              router: router,
              success: (res) => {
                let json = {}
                let datas = res.result
                for (let x = 0, len = datas.length; x < len; x++) {
                  json[datas[x].objectId] = datas[x].auth
                }
                json.ccba2010 = 'true'
                window.localStorage.setItem('ccbaMenuCodes', JSON.stringify(json))
                let currentModule = to.path.split('/')[1]
                if (currentModule === 'userAnswer' || currentModule === 'expertAnswer') {
                  router.app.$options.store.dispatch('ajax', {
                    url: 'API@/saas-activity/expertQA/getUserIdentity',
                    data: {},
                    router: router,
                    success: res => {
                      this.expert = res.result.expert
                      if (this.expert && currentModule === 'userAnswer') {
                        next('/expertAnswer/expertList')
                      } else if (!this.expert && currentModule === 'expertAnswer') {
                        next('/userAnswer/usertList')
                      } else {
                        next()
                      }
                    }
                  })
                } else {
                  next()
                }
              }
            })
          }
        })
      }
    }
  }
})

router.afterEach(route => {
  // 路径跳转后替换页面title
  let sysTitle = router.app.$options.store.state.childSys.title
  if (sysTitle) {
    document.title = '智慧通关-' + sysTitle || 'CCBA • 智慧通关服务平台'
  } else {
    document.title = '智慧通关-' + route.meta.title || 'CCBA • 智慧通关服务平台'
  }

  let path = route.fullPath
  // 判断路由是否携带了系统参数 token
  if (path.indexOf('token=') !== -1) {
    let pathAtt = path.split('?')
    let paramsObj = {}
    let paramsAtt = pathAtt[1].split('&')
    path = pathAtt[0]
    for (let i in paramsAtt) {
      paramsObj[paramsAtt[i].split('=')[0]] = unescape(paramsAtt[i].split('=')[1])
    }
    let x = 1
    for (let item in paramsObj) {
      if (item !== 'token') {
        if (x === 1) {
          path += '?' + item + '=' + paramsObj[item]
        } else {
          path += '&' + item + '=' + paramsObj[item]
        }
        x++
      }
    }
  }
  let fun = 'SetTabData'
  let tabData = ''
  // 本系统跳转后自定义title
  let title = route.query.setTitle || route.params.setTitle || route.meta.title
  let tabId = route.query.setId || route.params.setId || route.name
  // sysData 交互特有字段 不等于空  则使用自定义的title
  if (!util.isEmpty(route.params.sysData) || !util.isEmpty(route.query.sysData)) {
    let datas = []
    if (!util.isEmpty(route.params.sysData)) {
      datas = JSON.parse(base64.decode(route.params.sysData))
    } else if (!util.isEmpty(route.query.sysData)) {
      datas = JSON.parse(base64.decode(route.query.sysData))
    }
    let otherTabId = datas.tabId
    let businessTitle = datas.title
    let businessId = datas.id + ''
    if (businessId.split('-')[0] !== 'none') {
      title = businessTitle + '-' + businessId
    } else {
      title = businessTitle
    }
    if (!util.isEmpty(otherTabId)) {
      tabId = otherTabId
    }
    if (!util.isEmpty(datas.index) && datas.index !== 'null') {
      fun = 'SetTabDataIndex'
      tabData = datas.index
    }
  }
  router.app.$options.store.commit(fun, {
    tabId: tabId + '',
    title: title,
    component: route.meta.component,
    path: path,
    route: route,
    other: tabData,
    isDel: false
  })
})
export default router
