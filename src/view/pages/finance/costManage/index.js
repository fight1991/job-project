const MENU = [
  {
    path: '/finance/cost/list',
    name: 'cost-list',
    icon: 'icons-menu-account-finance-manage',
    permissions: 'CCBA21601000000',
    hidden: false,
    meta: {
      component: () => import(/* webpackChunkName: "cost-list" */ './costList.vue'),
      title: '费用项管理'
    }
  }
  // {
  //   path: '/finance/expense/detail',
  //   name: 'expense-detail',
  //   permissions: 'CCBA21003010000',
  //   hidden: false,
  //   meta: {
  //     component: resolve => require(['./offerDetail.vue'], resolve),
  //     title: '台账详情'
  //   }
  // }
]
export default {MENU}
