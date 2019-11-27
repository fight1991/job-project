// 接单
const MENU = {
  path: '/eImport/receipt',
  name: 'receipt',
  icon: 'icons-menu-receipt',
  permissions: 'CCBA20202000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '接单'
  },
  children: [
    {
      path: '/eImport/receipt/import',
      name: 'iReceipt',
      icon: 'icons-menu-price',
      permissions: 'CCBA20202010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进口接单'
      }
    }, {
      path: '/eImport/receipt/export',
      name: 'eReceipt',
      icon: 'icons-menu-price',
      permissions: 'CCBA20202020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口接单'
      }
    }
  ]
}
export default {MENU}
