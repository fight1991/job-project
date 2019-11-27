import baoheJobs from './baoheJobs/index' // 核销核算
import beianJobs from './beianJobs/index' // 电子底账
import czhanJobs from './czhanJobs/index' // 外发加工
import lareJobs from './lareJobs/index' // 通关作业
const MENU = [
  {
    path: '/account/index',
    name: 'account-index',
    hidden: false,
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/account/new/:sysData',
    name: 'account-new',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: resolve => require(['../component/newTab.vue'], resolve),
      title: '编辑详情'
    }
  },
  {
    path: '/account/new/:sysData',
    name: 'account-ems',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: resolve => require(['../component/newTab.vue'], resolve),
      title: '编辑详情'
    }
  },
  beianJobs.MENU,
  lareJobs.MENU,
  baoheJobs.MENU,
  czhanJobs.MENU
]
export default {MENU}
