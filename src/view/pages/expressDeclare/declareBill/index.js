import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/expressDeclare/declareBill',
  name: 'expressDeclare-declareBill',
  icon: 'icons-menu-expressDec',
  permissions: 'CCBA21203000000',
  component: abstractComponent,
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
        component: () => import(/* webpackChunkName: "declare-bill-list" */ './index.vue'),
        title: '快件报关单申报'
      }
    },
    {
      path: '/expressDeclare/declareBill/detail/:type/:id/:status',
      name: 'declareBillDetail',
      permissions: 'CCBA21203020000',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "declare-bill" */ './detail.vue'),
        title: '快件报关单申报详情'
      }
    }
  ]
}
export default {MENU}
