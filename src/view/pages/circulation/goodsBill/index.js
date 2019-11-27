// 保税获取流转-收发货单
const MENU = {
  path: '/circulation/goodsBill',
  name: 'circulation-goodsBill',
  icon: 'icons-menu-goodsBill',
  permissions: 'CCBA21102000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '收发货单'
  },
  children: [
    {
      path: '/circulation/goodsBill/deliverOut/list',
      name: 'deliverOut',
      permissions: 'CCBA21102010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '发货登记'
      }
    },
    {
      path: '/circulation/goodsBill/takeIn/list',
      name: 'takeIn',
      permissions: 'CCBA21102020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '收货登记'
      }
    },
    {
      path: '/circulation/goodsBill/query/list',
      name: 'query',
      permissions: 'CCBA21102030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '收发货单查询'
      }
    }
  ]
}
export default {MENU}
