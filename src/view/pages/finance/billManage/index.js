const MENU = [
  {
    path: '/finance/billManage/list',
    name: 'billManage-list',
    icon: 'icons-menu-billManage',
    permissions: 'CCBA21605000000',
    hidden: false,
    meta: {
      component: () => import(/* webpackChunkName: "bill-list" */ './billList.vue'),
      title: '发票管理'
    }
  },
  {
    path: '/finance/billManage/invoiceDetail',
    name: 'billManage-invoiceDetail',
    permissions: 'CCBA21605000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "invoice-detail" */ './invoiceDetail.vue'),
      title: '发票详情'
    }
  }
]
export default {MENU}
