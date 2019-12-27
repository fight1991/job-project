// 客户管理
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/dataCenter/customer',
  name: 'customer',
  icon: 'icons-menu-customer',
  permissions: 'CCBA20305000000',
  component: abstractComponent,
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
        component: () => import(/* webpackChunkName: "customer-info" */ './customerInfo.vue'),
        title: '客户信息'
      }
    },
    {
      path: '/dataCenter/customer/customerDetail',
      name: 'customerDetail',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "customer-detail" */ './customerDetail.vue'),
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
        component: () => import(/* webpackChunkName: "customer-audit" */ './customerAudit.vue'),
        title: '客户审核'
      }
    }
  ]
}
export default {MENU}
