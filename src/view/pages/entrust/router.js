import indexComponent from '@/view/pages/index.vue'
const entrustQueryComponent = () => import(/* webpackChunkName: "entrust-query" */ './entrustQuery.vue')
const entrustInfoComponent = () => import(/* webpackChunkName: "entrust-info" */ './component/entrustInfo.vue')

const MENU = [
  {
    path: '/entrust/index',
    name: 'entrust-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: indexComponent,
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
      component: entrustQueryComponent,
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
      component: entrustQueryComponent,
      title: '进口委托',
      iEFlag: 'import'
    }
  },
  {
    path: '/entrust/businessEntrust/entrustPage/import/:type/:id',
    name: 'importEntrustInfo',
    meta: {
      component: entrustInfoComponent,
      title: '进口委托信息',
      iEFlag: 'import'
    }
  },
  {
    path: '/entrust/businessEntrust/entrustPage/export/:type/:id',
    name: 'exportEntrustInfo',
    meta: {
      component: entrustInfoComponent,
      title: '出口委托信息',
      iEFlag: 'export'
    }
  },
  {
    path: '/entrust/businessEntrust/statusList/:iEFlag/:code',
    name: 'entrustStateTracking',
    meta: {
      component: () => import(/* webpackChunkName: "entrust-track" */ './component/statusList.vue'),
      title: '状态跟踪'
    }
  }
]
export default {MENU}
