// 海关监管-场站作业
import abstractComponent from '@/view/common/abstract.vue'
import graininessczhanJobsIndexComponent from './index.vue'

const MENU = {
  path: '/graininess/czhanJobs',
  name: 'graininess-czhanJobs',
  icon: 'icons-menu-czjb',
  permissions: 'CCBA21004000000',
  component: abstractComponent,
  meta: {
    title: '场站作业'
  },
  children: [
    {
      path: '/graininess/apply_gra/list',
      name: 'apply_gra',
      permissions: 'CCBA21004010000',
      hidden: false,
      meta: {
        component: graininessczhanJobsIndexComponent,
        title: '业务申报表'
      }
    },
    {
      path: '/graininess/stock_gra/list',
      name: 'stock_gra',
      permissions: 'CCBA21004020000',
      hidden: false,
      meta: {
        component: graininessczhanJobsIndexComponent,
        title: '出入库单'
      }
    },
    {
      path: '/graininess/auditRelese_gra/list',
      name: 'auditRelese_gra',
      permissions: 'CCBA21004030000',
      hidden: false,
      meta: {
        component: graininessczhanJobsIndexComponent,
        title: '核放单'
      }
    },
    {
      path: '/sea/carInfo_gra/list',
      name: 'carInfo_gra',
      permissions: 'CCBA21004040000',
      hidden: false,
      meta: {
        component: graininessczhanJobsIndexComponent,
        title: '车辆信息'
      }
    }
  ]
}
export default {MENU}
