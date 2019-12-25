import Prosecution from './prosecution' // 逻辑检控设置
import EiTemplate from './iETemplate' // 进出口模板
import OrderReceiving from './orderReceiving' // 接单
import importVouching from './importVouching' // 进口制单
import exportVouching from './exportVouching' // 出口制单
import Reviewed from './reviewed' // 审单
import DataQuery from './dataQuery' // 业务数据查询
import otherNewTabComponent from './otherNewTab.vue'
import newTabComponent from './newTab.vue'
import blankPageComponent from './blankPage.vue'
const MENU = [
  {
    path: '/iExport/index',
    name: 'iExport-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: blankPageComponent,
    meta: {
      title: '首页'
    }
  },
  Prosecution.MENU,
  EiTemplate.MENU,
  OrderReceiving.MENU,
  importVouching.MENU,
  exportVouching.MENU,
  Reviewed.MENU,
  {
    path: '/iExport/decRegister/list',
    name: 'decRegisterList',
    icon: 'icons-menu-decRegister',
    permissions: 'CCBA20208000000',
    meta: {
      component: () => import(/* webpackChunkName: "dec-register" */ './declaration/decRegister.vue'),
      title: '异常状态登记'
    }
  },
  { // 这是用于postMessage传递的方式过来的打开
    path: '/iExport/ems/:sysData',
    name: 'iExport-ems',
    permissions: 'SAASOM0504000000',
    hidden: false,
    meta: {
      component: newTabComponent,
      title: '编辑详情'
    }
  },
  { // 这是用于push 方法过来 这两都是临时的方法。金二迁移过来后就没有用了
    path: '/iExport/new',
    name: 'iExport-new',
    permissions: 'SAASOM0504000000',
    hidden: false,
    meta: {
      component: otherNewTabComponent,
      title: '编辑详情'
    }
  },
  DataQuery.MENU,
  {
    path: '/iExport/intelligent/vouching',
    name: 'intelligentVouchingQuery',
    icon: 'icons-menu-aiCenter',
    permissions: 'CCBA20212000000',
    meta: {
      component: () => import(/* webpackChunkName: "intelligent-list" */ './declaration/intelligentVouching/queryConidtion.vue'),
      title: 'AI智能制单中心'
    }
  },
  {
    path: '/iExport/intelligent/:funFlag/:iEFlag/:operationType/:pid',
    name: 'intelligentVouching',
    hidden: true,
    icon: 'icons-menu-aiCenter',
    permissions: 'CCBA20212000000',
    meta: {
      component: () => import(/* webpackChunkName: "dec-page" */ './declaration/decPage/decPage.vue'),
      title: '智能制单录入'
    }
  },
  {
    path: '/iExport/onlineTrust/query',
    name: 'onlineTrustQuery',
    icon: 'icons-menu-online-entrust',
    permissions: 'CCBA20205000000', // CCBA20214000000
    meta: {
      component: () => import(/* webpackChunkName: "online-trust-list" */ './onlineTrust/queryConidtion.vue'),
      title: '在线委托'
    }
  },
  {
    path: '/iExport/zyhy/intelligent/vouching',
    name: 'zyhyIntelQuery',
    icon: 'icons-menu-aiCenter',
    permissions: 'CCBA20213000000',
    meta: {
      component: () => import(/* webpackChunkName: "zyhy-list" */ './declaration/zyhy/index.vue'),
      title: '中远AI'
    }
  },
  {
    path: '/iExport/zyhy/intelligent/vouching/:taskId',
    name: 'zyhyIntelVouching',
    icon: 'icons-menu-aiCenter',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "zyhy-detail" */ './declaration/zyhy/detail.vue'),
      title: '制单详情'
    }
  }
]
export default {MENU}
