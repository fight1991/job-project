const MENU = [
  {
    path: '/finance/offerManage/list',
    name: 'offerManage-list',
    permissions: 'CCBA21602000000',
    icon: 'icons-menu-offerManage',
    hidden: false,
    meta: {
      component: () => import(/* webpackChunkName: "offer-list" */ './offerList.vue'),
      title: '报价管理'
    }
  },
  {
    path: '/finance/offerManage/detail',
    name: 'offerManage-detail',
    permissions: 'CCBA21602000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "offer-detail" */ './offerDetail.vue'),
      title: '报价详情'
    }
  },
  {
    path: '/finance/offerManage/offerAdd',
    name: 'offerManage-offerAdd',
    permissions: 'CCBA21602000000',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "offer-add" */ './offerAdd.vue'),
      title: '新建报价'
    }
  }
]
export default {MENU}
