// 备案管理
const MENU = {
  path: '/aircraft/record',
  name: 'record',
  icon: 'icons-menu-beianManage',
  permissions: 'CCBA20401000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
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
        component: resolve => require(['./airPlanList.vue'], resolve),
        title: '当日飞行计划备案'
      }
    },
    {
      path: '/aircraft/airPlan/editDetail/:type/:id',
      name: 'airplanDetail',
      permissions: 'CCBA20401010000',
      hidden: true,
      meta: {
        component: resolve => require(['./airPlanDetail.vue'], resolve),
        title: '当日飞行计划备案信息'
      }
    }
  ]
}
export default {MENU}
