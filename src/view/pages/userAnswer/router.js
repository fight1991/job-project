
const MENU = [
  {
    path: '/userAnswer/index',
    name: 'userAnswer-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/userAnswer/userList',
    icon: 'icons-menu-index',
    name: 'userAnswer-list',
    permissions: 'ccba2010',
    meta: {
      component: resolve => require(['./userList.vue'], resolve),
      title: '首页(用户)'
    }
  },
  {
    path: '/userAnswer/lookListUser',
    icon: 'icons-menu-problem',
    name: 'userAnswer-look',
    permissions: 'ccba2010',
    meta: {
      component: resolve => require(['./lookListUser.vue'], resolve),
      title: '我的提问'
    }
  },
  {
    path: '/userAnswer/detailUser/:questionId/:userId',
    name: 'userAnswer-detail',
    hidden: true,
    meta: {
      component: resolve => require(['./detailUser.vue'], resolve),
      title: '查看详情'
    }
  }
]
export default {MENU}
