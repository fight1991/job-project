import mainComponent from '../www/components/main.vue'
import productionComponent from '../www/components/production.vue'
import aboutUsComponent from '../www/components/aboutUs.vue'
import contactUsComponent from '../www/components/orderInline.vue'
import talentComponent from '../www/components/talent.vue'
const MENU = [
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '首页'
    },
    component: mainComponent
  },
  {
    path: '/production',
    name: 'production',
    meta: {
      title: '产品介绍'
    },
    component: productionComponent
  },
  {
    path: '/aboutUs',
    name: 'aboutUs',
    meta: {
      title: '关于我们'
    },
    component: aboutUsComponent
  },
  {
    path: '/contactUs',
    name: 'contactUs',
    meta: {
      title: '在线预约'
    },
    component: resolve => contactUsComponent
  },
  {
    path: '/talent',
    name: 'talent',
    meta: {
      title: '人才招聘'
    },
    component: talentComponent
  },
  {
    path: '/talent/jobList',
    name: 'jobList',
    meta: {
      title: '职位列表'
    },
    component: () => import(/* webpackChunkName: "job-list" */ '../www/components/jobList.vue')
  },
  {
    path: '/talent/jobDetail',
    name: 'jobDetail',
    meta: {
      title: '职位详情'
    },
    component: () => import(/* webpackChunkName: "job-detail" */ '../www/components/jobDetail.vue')
  }
]
export default { MENU }
