const MENU = [
  {
    path: '/finance/accountManage/list',
    name: 'accountManage-list',
    icon: 'icons-menu-accountManage',
    permissions: 'CCBA21603000000',
    hidden: false,
    meta: {
      component: () => import(/* webpackChunkName: "account-list" */ './accountList.vue'),
      title: '账单管理'
    }
  },
  {
    path: '/finance/accountManage/detail',
    name: 'accountManage-detail',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "account-detail" */ './accountDetail.vue'),
      title: '对账单详情'
    }
  },
  {
    path: '/finance/accountManage/check',
    name: 'accountManage-check',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "account-check" */ './accountCheck.vue'),
      title: '账单驳回编辑'
    }
  }
]
export default {MENU}
