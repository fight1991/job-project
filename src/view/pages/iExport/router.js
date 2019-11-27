import Prosecution from './prosecution' // 逻辑检控设置
import EiTemplate from './iETemplate' // 进出口模板
import OrderReceiving from './orderReceiving' // 接单
import importVouching from './importVouching' // 进口制单
import exportVouching from './exportVouching' // 出口制单
import Reviewed from './reviewed' // 审单
import DataQuery from './dataQuery' // 业务数据查询
const MENU = [
  {
    path: '/iExport/index',
    name: 'iExport-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: resolve => require(['./blankPage.vue'], resolve),
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
      component: resolve => require(['./declaration/decRegister.vue'], resolve),
      title: '异常状态登记'
    }
  },
  { // 这是用于postMessage传递的方式过来的打开
    path: '/iExport/ems/:sysData',
    name: 'iExport-ems',
    permissions: 'SAASOM0504000000',
    hidden: false,
    meta: {
      component: resolve => require(['./newTab.vue'], resolve),
      title: '编辑详情'
    }
  },
  { // 这是用于push 方法过来 这两都是临时的方法。金二迁移过来后就没有用了
    path: '/iExport/new',
    name: 'iExport-new',
    permissions: 'SAASOM0504000000',
    hidden: false,
    meta: {
      component: resolve => require(['./otherNewTab.vue'], resolve),
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
      component: resolve => require(['./declaration/intelligentVouching/queryConidtion.vue'], resolve),
      title: '智能制单测试'
    }
  },
  {
    path: '/iExport/intelligentTest/vouching',
    name: 'intelligentVouchingQueryTest',
    icon: 'icons-menu-aiCenter',
    permissions: 'CCBA20211000000',
    meta: {
      component: resolve => require(['./declaration/intelligentVouching/queryConidtionTest.vue'], resolve),
      title: '智能制单中心'
    }
  },
  {
    path: '/iExport/intelligentTest/:funFlag/:iEFlag/:operationType/:pid',
    name: 'intelligentVouchingTest',
    hidden: true,
    icon: 'icons-menu-decRegister',
    permissions: 'CCBA20211000000',
    meta: {
      component: resolve => require(['./declaration/intelligentVouching/decPage.vue'], resolve),
      title: '智能制单录入'
    }
  },
  {
    path: '/iExport/intelligent/:funFlag/:iEFlag/:operationType/:pid',
    name: 'intelligentVouching',
    hidden: true,
    icon: 'icons-menu-decRegister',
    permissions: 'CCBA20212000000',
    meta: {
      component: resolve => require(['./declaration/decPage/decPage.vue'], resolve),
      title: '智能制单录入测试'
    }
  }
]
export default {MENU}
