const MENU = [
  {
    path: '/finance/expense/list',
    name: 'expense-list',
    icon: 'icons-finance-offerAccount',
    permissions: 'CCBA21603000000',
    hidden: false,
    meta: {
      component: resolve => require(['./expenseList.vue'], resolve),
      title: '费用台账'
    }
  },
  {
    path: '/finance/expense/detail',
    name: 'expense-detail',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: resolve => require(['./expenseDetail.vue'], resolve),
      title: '台账详情'
    }
  },
  {
    path: '/finance/pdf/view',
    name: 'pdf-view',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: resolve => require(['./pdfView.vue'], resolve),
      title: 'pdf预览'
    }
  }
]
export default {MENU}
