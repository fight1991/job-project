import CarlareParams from './carlareParams/index' // 汽车申报参数
import PassCode from './passCode/index' // 通关代码
import DeclareParams from './declareParams/index' // 商品申报参数
const MENU = [
  {
    path: '/passParams/index',
    name: 'passParams-index',
    hidden: false,
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/passParams/new/:sysData',
    name: 'passParams-new',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: resolve => require(['../component/newTab.vue'], resolve),
      title: '编辑详情'
    }
  },
  PassCode.MENU,
  DeclareParams.MENU,
  CarlareParams.MENU
]
export default {MENU}
