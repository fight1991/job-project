import abstractComponent from '@/view/common/abstract.vue'
const MENU = {
  path: '/passParams/carParams',
  name: 'passParams-carParams',
  icon: 'icons-menu-carParams',
  permissions: 'CCBA21203000000',
  component: abstractComponent,
  meta: {
    title: '汽车申报参数'
  },
  children: [
    {
      path: '/passParams/ceCompare/list',
      name: 'ceCompare',
      permissions: 'CCBA21203010000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "ce-compare" */ './ceCompare.vue'),
        title: '中英文对照'
      }
    },
    {
      path: '/passParams/carParter/list',
      name: 'carParter',
      permissions: 'CCBA21203020000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "car-parter" */ './carParter.vue'),
        title: '汽车零部件清单'
      }
    }
  ]
}
export default {MENU}
