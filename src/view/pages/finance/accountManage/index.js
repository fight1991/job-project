const MENU = [
  {
    path: '/finance/accountManage/list',
    name: 'accountManage-list',
    icon: 'icons-finance-accountManage',
    permissions: 'CCBA21603000000',
    hidden: false,
    meta: {
      component: resolve => require(['./accountList.vue'], resolve),
      title: '账单管理'
    }
  },
  {
    path: '/finance/accountManage/detail',
    name: 'accountManage-detail',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: resolve => require(['./accountDetail.vue'], resolve),
      title: '对账单详情'
    }
  },
  {
    path: '/finance/accountManage/check',
    name: 'accountManage-check',
    permissions: 'CCBA21603000000',
    hidden: true,
    meta: {
      component: resolve => require(['./accountCheck.vue'], resolve),
      title: '账单驳回编辑'
    }
  }
]
export default {MENU}
