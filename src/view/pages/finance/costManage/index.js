const MENU = [
  {
    path: '/finance/cost/list',
    name: 'cost-list',
    icon: 'icons-finance-costManage',
    permissions: 'CCBA21601000000',
    hidden: false,
    meta: {
      component: resolve => require(['./costList.vue'], resolve),
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
