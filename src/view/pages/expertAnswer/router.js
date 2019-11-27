
const MENU = [
  {
    path: '/expertAnswer/index',
    name: 'expertAnswer-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/expertAnswer/expertList',
    name: 'expertAnswer-list',
    permissions: 'ccba2010',
    icon: 'icons-menu-index',
    meta: {
      component: resolve => require(['./expertList.vue'], resolve),
      title: '首页(专家)'
    }
  },
  {
    path: '/expertAnswer/lookListExpert',
    name: 'expertAnswer-look',
    permissions: 'ccba2010',
    icon: 'icons-menu-solute',
    meta: {
      component: resolve => require(['./lookListExpert.vue'], resolve),
      title: '我的解答'
    }
  },
  {
    path: '/expertAnswer/detailExpert/:questionId/:userId',
    name: 'expertAnswer-detail',
    meta: {
      component: resolve => require(['./detailExpert.vue'], resolve),
      title: '查看详情'
    }
  }
]
export default {MENU}
