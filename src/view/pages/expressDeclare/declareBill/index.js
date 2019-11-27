
const MENU = {
  path: '/expressDeclare/declareBill',
  name: 'expressDeclare-declareBill',
  icon: 'icons-menu-declareBill',
  permissions: 'CCBA21203000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '快件报关单'
  },
  children: [
    {
      path: '/expressDeclare/declareBill/list',
      name: 'declareBilllList',
      permissions: 'CCBA21203010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '快件报关单申报'
      }
    },
    {
      path: '/expressDeclare/declareBill/detail/:type/:id/:status',
      name: 'declareBillDetail',
      permissions: 'CCBA21203020000',
      hidden: true,
      meta: {
        component: resolve => require(['./detail.vue'], resolve),
        title: '快件报关单申报详情'
      }
    }
  ]
}
export default {MENU}
