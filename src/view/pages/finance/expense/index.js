const MENU = [
  {
    path: '/finance/expense/list',
    name: 'expense-list',
    icon: 'icons-menu-account',
    permissions: 'CCBA21603000000',
    hidden: false,
    meta: {
      component: () => import(/* webpackChunkName: "expense-list" */ './expenseList.vue'),
      title: '费用台账'
    }
  },
  {
    path: '/finance/expense/detail',
    name: 'expense-detail',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "expense-detail" */ './expenseDetail.vue'),
      title: '台账详情'
    }
  },
  {
    path: '/finance/expense/multiExpenseRegister',
    name: 'expense-multiExpenseRegister',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "multi-expense-register" */ './multiExpenseRegister.vue'),
      title: '批量费用登记'
    }
  }
]
export default {MENU}
