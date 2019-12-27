import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/expressDeclare/shipBill',
  name: 'expressDeclare-shipBill',
  icon: 'icons-menu-expressShip',
  permissions: 'CCBA21203000000',
  component: abstractComponent,
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
        component: () => import(/* webpackChunkName: "ship-bill-list" */ './index.vue'),
        title: '快件舱单申报'
      }
    },
    {
      path: '/expressDeclare/shipBill/detail/:type/:id/:status',
      name: 'shipBillDetail',
      permissions: 'CCBA21203020000',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "ship-bill" */ './detail.vue'),
        title: '快件舱单申报详情'
      }
    }
  ]
}
export default {MENU}
