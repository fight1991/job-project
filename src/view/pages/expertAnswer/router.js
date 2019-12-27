import indexComponent from '@/view/pages/index.vue'

const MENU = [
  {
    path: '/expertAnswer/index',
    name: 'expertAnswer-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: indexComponent,
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
      component: () => import(/* webpackChunkName: "expert-answerer-list" */ './expertList.vue'),
      title: '首页(专家)'
    }
  },
  {
    path: '/expertAnswer/lookListExpert',
    name: 'expertAnswer-look',
    permissions: 'ccba2010',
    icon: 'icons-menu-solute',
    meta: {
      component: () => import(/* webpackChunkName: "look-list-expert" */ './lookListExpert.vue'),
      title: '我的解答'
    }
  },
  {
    path: '/expertAnswer/detailExpert/:questionId/:userId',
    name: 'expertAnswer-detail',
    meta: {
      component: () => import(/* webpackChunkName: "expert-answerer-detail" */ './detailExpert.vue'),
      title: '查看详情'
    }
  }
]
export default {MENU}
