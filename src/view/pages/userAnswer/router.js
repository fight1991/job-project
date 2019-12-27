import indexComponent from '@/view/pages/index.vue'

const MENU = [
  {
    path: '/userAnswer/index',
    name: 'userAnswer-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: indexComponent,
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
      component: () => import(/* webpackChunkName: "user-list" */ './userList.vue'),
      title: '首页(用户)'
    }
  },
  {
    path: '/userAnswer/lookListUser',
    icon: 'icons-menu-problem',
    name: 'userAnswer-look',
    permissions: 'ccba2010',
    meta: {
      component: () => import(/* webpackChunkName: "look-list-user" */ './lookListUser.vue'),
      title: '我的提问'
    }
  },
  {
    path: '/userAnswer/detailUser/:questionId/:userId',
    name: 'userAnswer-detail',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "detail-user" */ './detailUser.vue'),
      title: '查看详情'
    }
  }
]
export default {MENU}
