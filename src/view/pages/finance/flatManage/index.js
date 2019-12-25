const MENU = [
  {
    path: '/finance/flatManage/list',
    name: 'flatManage-list',
    icon: 'icons-menu-flatManage',
    permissions: 'CCBA21606000000',
    hidden: false,
    meta: {
      component: () => import(/* webpackChunkName: "flat-list" */ './flatList.vue'),
      title: '平账管理'
    }
  },
  {
    path: '/finance/flatManage/recordList',
    name: 'flatManage-recordList',
    icon: 'icons-finance-flatManage',
    permissions: 'CCBA21606000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "flat-record" */ './flatRecord.vue'),
      title: '平账记录'
    }
  }
]
export default {MENU}
