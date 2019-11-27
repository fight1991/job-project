const MENU = [
  {
    path: '/finance/billManage/list',
    name: 'billManage-list',
    icon: 'icons-finance-billManage',
    permissions: 'CCBA21605000000',
    hidden: false,
    meta: {
      component: resolve => require(['./billList.vue'], resolve),
      title: '发票管理'
    }
  },
  {
    path: '/finance/billManage/invoiceDetail',
    name: 'billManage-invoiceDetail',
    permissions: 'CCBA21605000000',
    hidden: true,
    meta: {
      component: resolve => require(['./invoiceDetail.vue'], resolve),
      title: '发票详情'
    }
  }
]
export default {MENU}
