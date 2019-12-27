// 数据中心-KPI报表
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/reportCenter/kpiData',
  name: 'kpiData',
  permissions: 'CCBA20602000000',
  icon: 'icons-menu-kpiList',
  component: abstractComponent,
  meta: {
    title: 'KPI报表'
  },
  children: [
    {
      path: '/reportCenter/kpiData/workLoad',
      name: 'workComputer',
      permissions: 'CCBA20602010000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "work-load" */ './workLoad.vue'),
        title: '工作量统计'
      }
    }
  ]
}
export default {MENU}
