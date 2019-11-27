const MENU = [
  {
    path: '/finance/summary',
    name: 'flatManage-list',
    icon: 'icons-finance-summary',
    permissions: 'CCBA21607000000',
    component: () => import('@/view/common/abstract.vue'),
    meta: {
      title: '汇总统计'
    },
    children: [
      {
        path: '/finance/summary/detail',
        name: 'summary-detail',
        icon: 'icons-finance-flatManage',
        permissions: 'CCBA21607010000',
        hidden: true,
        meta: {
          component: () => import('./payDetail.vue'),
          title: '收付明细详情'
        }
      },
      {
        path: '/finance/summary/payList',
        name: 'summar-list',
        icon: 'icons-finance-flatManage',
        permissions: 'CCBA21607010000',
        hidden: false,
        meta: {
          component: () => import('./payList.vue'),
          title: '收付明细'
        }
      }
    ]
  }
]
export default {MENU}
