import Business from './business/index' // 业务报表
import KpiData from './kpiData/index' // KPI报表
import indexComponent from '@/view/pages/index.vue'
import newTabComponent from '../component/newTab.vue'

const MENU = [
  {
    path: '/reportCenter/index',
    name: 'reportCenter-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: indexComponent,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/reportCenter/new/:sysData',
    name: 'reportCenter-new',
    permissions: 'SAASOM0504000000',
    hidden: true,
    meta: {
      component: newTabComponent,
      title: '编辑详情'
    }
  },
  Business.MENU,
  KpiData.MENU
]
export default {MENU}
