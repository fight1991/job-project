import CarlareParams from './carlareParams/index' // 汽车申报参数
import PassCode from './passCode/index' // 通关代码
import DeclareParams from './declareParams/index' // 商品申报参数
import indexComponent from '@/view/pages/index.vue'
import newTabComponent from '../component/newTab.vue'

const MENU = [
  {
    path: '/passParams/index',
    name: 'passParams-index',
    hidden: false,
    permissions: 'WF000000',
    component: indexComponent,
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
      component: newTabComponent,
      title: '编辑详情'
    }
  },
  PassCode.MENU,
  DeclareParams.MENU,
  CarlareParams.MENU
]
export default {MENU}
