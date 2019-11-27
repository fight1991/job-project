
const MENU = [
  {
    path: '/contract/index',
    name: 'contract-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/contract/list',
    name: 'contract-list',
    icon: 'icons-menu-contractList',
    permissions: 'CCBA21401000000',
    meta: {
      component: resolve => require(['./contractList.vue'], resolve),
      title: '合同列表'
    }
  },
  {
    path: '/contract/addContract/:flag/:pkSeqNo',
    name: 'contract-add',
    hidden: true,
    meta: {
      component: resolve => require(['./addContract.vue'], resolve),
      title: '新建合同'
    }
  },
  {
    path: '/contract/detailContract/:pkSeqNo',
    name: 'contract-detail',
    hidden: true,
    meta: {
      component: resolve => require(['./detailContract.vue'], resolve),
      title: '合同详情'
    }
  },
  {
    path: '/contract/check',
    name: 'contract-check',
    icon: 'icons-menu-contractCheck',
    permissions: 'CCBA21402000000',
    meta: {
      component: resolve => require(['./contractCheck.vue'], resolve),
      title: '合同审核'
    }
  }
]
export default {MENU}
