import baoheJobs from './baoheJobs/index' // 核销核算
import beianJobs from './beianJobs/index' // 电子底账
import czhanJobs from './czhanJobs/index' // 外发加工
import lareJobs from './lareJobs/index' // 通关作业
import indexComponent from '@/view/pages/index.vue'
import newTabComponent from '../component/newTab.vue'
const MENU = [
  {
    path: '/handBook/index',
    name: 'hand-index',
    hidden: false,
    permissions: 'WF000000',
    component: indexComponent,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/handBook/new/:sysData',
    name: 'handBook-new',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: newTabComponent,
      title: '编辑详情'
    }
  },
  {
    path: '/handBook/new/:sysData',
    name: 'handBook-ems',
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
  czhanJobs.MENU
]
export default {MENU}
