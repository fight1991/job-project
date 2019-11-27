
const MENU = [
  {
    path: '/entrust/index',
    name: 'entrust-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/entrust/exportEntrust',
    name: 'exportEntrust',
    icon: 'icons-menu-exportEn',
    permissions: 'CCBA21502000000',
    meta: {
      component: resolve => require(['./entrustQuery.vue'], resolve),
      title: '出口委托',
      iEFlag: 'export'
    }
  },
  {
    path: '/entrust/importEntrust',
    name: 'importEntrust',
    icon: 'icons-menu-importEn',
    permissions: 'CCBA21501000000',
    meta: {
      component: resolve => require(['./entrustQuery.vue'], resolve),
      title: '进口委托',
      iEFlag: 'import'
    }
  },
  {
    path: '/entrust/businessEntrust/entrustPage/import/:type/:id',
    name: 'importEntrustInfo',
    meta: {
      component: resolve => require(['./component/entrustInfo.vue'], resolve),
      title: '进口委托信息',
      iEFlag: 'import'
    }
  },
  {
    path: '/entrust/businessEntrust/entrustPage/export/:type/:id',
    name: 'exportEntrustInfo',
    meta: {
      component: resolve => require(['./component/entrustInfo.vue'], resolve),
      title: '出口委托信息',
      iEFlag: 'export'
    }
  },
  {
    path: '/entrust/businessEntrust/statusList/:iEFlag/:code',
    name: 'entrustStateTracking',
    meta: {
      component: resolve => require(['./component/statusList.vue'], resolve),
      title: '状态跟踪'
    }
  }
]
export default {MENU}
