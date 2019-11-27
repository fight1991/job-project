
const MENU = {
  path: '/expressDeclare/shipBill',
  name: 'expressDeclare-shipBill',
  icon: 'icons-menu-shipBill',
  permissions: 'CCBA21203000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '快件舱单'
  },
  children: [
    {
      path: '/expressDeclare/shipBill/list',
      name: 'shipBillList',
      permissions: 'CCBA21203010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '快件舱单申报'
      }
    },
    {
      path: '/expressDeclare/shipBill/detail/:type/:id/:status',
      name: 'shipBillDetail',
      permissions: 'CCBA21203020000',
      hidden: true,
      meta: {
        component: resolve => require(['./detail.vue'], resolve),
        title: '快件舱单申报详情'
      }
    }
  ]
}
export default {MENU}
