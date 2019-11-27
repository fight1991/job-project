import Record from './record/index' // 备案管理
import IEport from './iEport/index' // 进/出境/港申报
import InLare from './inLare/index' // 在港申报
const MENU = [
  {
    path: '/aircraft/index',
    name: 'aircraft-index',
    hidden: false,
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/aircraft/new/:sysData',
    name: 'aircraft-new',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: resolve => require(['../component/newTab.vue'], resolve),
      title: '编辑详情'
    }
  },
  Record.MENU,
  IEport.MENU,
  InLare.MENU
]
export default {MENU}
