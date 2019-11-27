const MENU = [
  {
    path: '/finance/flatManage/list',
    name: 'flatManage-list',
    icon: 'icons-finance-flatManage',
    permissions: 'CCBA21606000000',
    hidden: false,
    meta: {
      component: resolve => require(['./flatList.vue'], resolve),
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
      component: resolve => require(['./flatRecord.vue'], resolve),
      title: '平账记录'
    }
  }
]
export default {MENU}
