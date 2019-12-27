import beianJobs from './beianJobs/index' // 电子底账
import czhanJobs from './czhanJobs/index' // 场站业务
import lareJobs from './lareJobs/index' // 通关作业
import baoheJobs from './baoheJobs/index' // 核算核销
import czhanJobsQuery from './czhanJobsQuery/index' // 场站业务查询
import indexComponent from '@/view/pages/index.vue'
import newTabComponent from '../component/newTab.vue'

const MENU = [
  {
    path: '/graininess/index',
    name: 'graininess-index',
    hidden: false,
    permissions: 'WF000000',
    component: indexComponent,
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
      component: newTabComponent,
      title: '编辑详情'
    }
  },
  {
    path: '/graininess/new/:sysData',
    name: 'graininess-ems',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: newTabComponent,
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
