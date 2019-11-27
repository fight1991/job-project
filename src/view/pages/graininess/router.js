import beianJobs from './beianJobs/index' // 电子底账
import czhanJobs from './czhanJobs/index' // 场站业务
import lareJobs from './lareJobs/index' // 通关作业
import baoheJobs from './baoheJobs/index' // 核算核销
import czhanJobsQuery from './czhanJobsQuery/index' // 场站业务查询
const MENU = [
  {
    path: '/graininess/index',
    name: 'graininess-index',
    hidden: false,
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/graininess/new/:sysData',
    name: 'graininess-new',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: resolve => require(['../component/newTab.vue'], resolve),
      title: '编辑详情'
    }
  },
  {
    path: '/graininess/new/:sysData',
    name: 'graininess-ems',
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
  czhanJobs.MENU,
  czhanJobsQuery.MENU
]
export default {MENU}
