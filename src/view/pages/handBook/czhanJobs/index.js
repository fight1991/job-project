// 加工贸易手册-外发加工
const MENU = {
  path: '/handBook/czhanJobs',
  name: 'handBook-czhanJobs',
  icon: 'icons-menu-czhanJobs',
  permissions: 'CCBA20804000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '外发加工'
  },
  children: [
    {
      path: '/handBook/declareForm/list',
      name: 'declareForm',
      permissions: 'CCBA20804010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '外发加工申报表'
      }
    },
    {
      path: '/handBook/delivery/list',
      name: 'delivery',
      permissions: 'CCBA20804020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '外发加工发货单'
      }
    },
    {
      path: '/handBook/recipient/list',
      name: 'recipient',
      permissions: 'CCBA20804030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '外发加工收货单'
      }
    },
    {
      path: '/handBook/declareFormQuery/list',
      name: 'declareFormQuery',
      permissions: 'CCBA20804040000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '外发加工申报表查询'
      }
    },
    {
      path: '/handBook/recipientQuery/list',
      name: 'recipientQuery',
      permissions: 'CCBA20804050000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '外发加工收发货单查询'
      }
    }
  ]
}
export default {MENU}
