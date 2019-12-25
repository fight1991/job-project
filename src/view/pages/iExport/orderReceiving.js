// 接单
import abstractComponent from '@/view/common/abstract.vue'
const receiveOrdersComponent = () => import(/* webpackChunkName: "receive-order" */ './declaration/receiveOrders.vue')

const MENU = {
  path: '/iExport/orderReceiving',
  name: 'orderReceiving',
  icon: 'icons-menu-receipt',
  permissions: 'CCBA20202000000',
  component: abstractComponent,
  meta: {
    title: '接单'
  },
  children: [
    {
      path: '/iExport/orderReceiving/iOrderReceiving',
      name: 'iOrderReceiving',
      icon: 'icons-menu-price',
      permissions: 'CCBA20202010000',
      hidden: false,
      meta: {
        component: receiveOrdersComponent,
        title: '进口接单',
        iEFlag: 'import'
      }
    }, {
      path: '/iExport/orderReceiving/eOrderReceiving',
      name: 'eOrderReceiving',
      icon: 'icons-menu-price',
      permissions: 'CCBA20202020000',
      hidden: false,
      meta: {
        component: receiveOrdersComponent,
        title: '出口接单',
        iEFlag: 'export'
      }
    }
  ]
}
export default {MENU}
