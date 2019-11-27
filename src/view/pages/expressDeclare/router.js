import ShipBill from './shipBill/index' // 快件舱单
import DeclareBill from './declareBill/index' // 通关代码
const MENU = [
  {
    path: '/expressDeclare/index',
    name: 'expressDeclare-index',
    hidden: false,
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/expressDeclare/new/:sysData',
    name: 'expressDeclare-new',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: resolve => require(['../component/newTab.vue'], resolve),
      title: '编辑详情'
    }
  },
  ShipBill.MENU,
  DeclareBill.MENU
]
export default {MENU}
