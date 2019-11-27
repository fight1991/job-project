// 客户管理
const MENU = {
  path: '/dataCenter/customer',
  name: 'customer',
  icon: 'icons-menu-customer',
  permissions: 'CCBA20305000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '客户管理'
  },
  children: [
    {
      path: '/dataCenter/customer/customerInfo',
      name: 'customerInfo',
      icon: 'icons-menu-price',
      permissions: 'CCBA20305010000',
      hidden: false,
      meta: {
        component: resolve => require(['./customerInfo.vue'], resolve),
        title: '客户信息'
      }
    },
    {
      path: '/dataCenter/customer/customerDetail',
      name: 'customerDetail',
      hidden: true,
      meta: {
        component: resolve => require(['./customerDetail.vue'], resolve),
        title: '客户详情'
      }
    },
    {
      path: '/dataCenter/customer/customerAudit',
      name: 'customerAudit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20305020000',
      hidden: false,
      meta: {
        component: resolve => require(['./customerAudit.vue'], resolve),
        title: '客户审核'
      }
    }
  ]
}
export default {MENU}
