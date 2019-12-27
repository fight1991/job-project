// 许可证管理
const MENU = [
  {
    path: '/dataCenter/license',
    name: 'license',
    icon: 'icons-menu-allows',
    permissions: 'CCBA20302000000',
    meta: {
      title: '许可证管理',
      component: () => import(/* webpackChunkName: "license-list" */ './index.vue')
    }
  },
  {
    path: '/dataCenter/license/addLicense',
    name: 'addLicense',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "add-licence" */ './addLicense.vue'),
      title: '许可证新增'
    }
  }, {
    path: '/dataCenter/license/detailListLicense',
    name: 'detailListLicense',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "license-detail" */ './detailListLicense.vue'),
      title: '许可证详情列表'
    }
  }, {
    path: '/dataCenter/license/manageDetail',
    name: 'manageDetail',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "license-detail-edit" */ './manageDetail.vue'),
      title: '许可证详情编辑'
    }
  }
]
export default {MENU}
