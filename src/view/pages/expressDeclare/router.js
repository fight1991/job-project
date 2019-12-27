import ShipBill from './shipBill/index' // 快件舱单
import DeclareBill from './declareBill/index' // 通关代码
import indexComponent from '@/view/pages/index.vue'
import newTabComponent from '../component/newTab.vue'

const MENU = [
  {
    path: '/expressDeclare/index',
    name: 'expressDeclare-index',
    hidden: false,
    permissions: 'WF000000',
    component: indexComponent,
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
      component: newTabComponent,
      title: '编辑详情'
    }
  },
  ShipBill.MENU,
  DeclareBill.MENU
]
export default {MENU}
