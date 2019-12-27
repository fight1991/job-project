// 证书管理
const MENU = [
  {
    path: '/dataCenter/certificate',
    name: 'certificate',
    icon: 'icons-menu-certificate',
    permissions: 'CCBA20304000000',
    meta: {
      title: '证书管理',
      component: () => import(/* webpackChunkName: "certificate-list" */ './index.vue')
    }
  },
  {
    path: '/dataCenter/certificate/addCertificate',
    name: 'addCertificate',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "certificate-add" */ './addCertificate.vue'),
      title: '证书信息'
    }
  }, {
    path: '/dataCenter/certificate/detailListCertificate',
    name: 'detailListCertificate',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "certificate-detail" */ './detailListCertificate.vue'),
      title: '证书详情列表'
    }
  }
]
export default {MENU}
