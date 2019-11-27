
const MENU = {
  path: '/passParams/carParams',
  name: 'passParams-carParams',
  icon: 'icons-menu-carParams',
  permissions: 'CCBA21203000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
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
        component: resolve => require(['./ceCompare.vue'], resolve),
        title: '中英文对照'
      }
    },
    {
      path: '/passParams/carParter/list',
      name: 'carParter',
      permissions: 'CCBA21203020000',
      hidden: false,
      meta: {
        component: resolve => require(['./carParter.vue'], resolve),
        title: '汽车零部件清单'
      }
    }
  ]
}
export default {MENU}
