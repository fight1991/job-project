// 许可证管理
const MENU = [
  {
    path: '/dataCenter/license',
    name: 'license',
    icon: 'icons-menu-allows',
    permissions: 'CCBA20302000000',
    meta: {
      title: '许可证管理',
      component: resolve => require(['./index.vue'], resolve)
    }
  },
  {
    path: '/dataCenter/license/addLicense',
    name: 'addLicense',
    hidden: true,
    meta: {
      component: resolve => require(['./addLicense.vue'], resolve),
      title: '许可证新增'
    }
  }, {
    path: '/dataCenter/license/detailListLicense',
    name: 'detailListLicense',
    hidden: true,
    meta: {
      component: resolve => require(['./detailListLicense.vue'], resolve),
      title: '许可证详情列表'
    }
  }, {
    path: '/dataCenter/license/manageDetail',
    name: 'manageDetail',
    hidden: true,
    meta: {
      component: resolve => require(['./manageDetail.vue'], resolve),
      title: '许可证详情编辑'
    }
  }
]
export default {MENU}
