// 备案管理
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/aircraft/record',
  name: 'record',
  icon: 'icons-menu-beianManage',
  permissions: 'CCBA20401000000',
  component: abstractComponent,
  meta: {
    title: '备案管理'
  },
  children: [
    {
      path: '/aircraft/record/airplan',
      name: 'airplanList',
      permissions: 'CCBA20401010000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "airplan-list" */ './airPlanList.vue'),
        title: '当日飞行计划备案'
      }
    },
    {
      path: '/aircraft/airPlan/editDetail/:type/:id',
      name: 'airplanDetail',
      permissions: 'CCBA20401010000',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "airplan-detail" */ './airPlanDetail.vue'),
        title: '当日飞行计划备案信息'
      }
    }
  ]
}
export default {MENU}
