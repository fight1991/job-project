import abstractComponent from '@/view/common/abstract.vue'
import notFoundComponent from './404.vue'
import serverErrorComponent from './500.vue'
import systemMaintainComponent from './wait.vue'

const MENU = {
  path: '/error',
  name: '错误',
  hidden: true,
  component: abstractComponent,
  meta: {
    title: '错误'
  },
  children: [{
    path: '/error/404',
    name: '页面错误',
    hidden: true,
    component: notFoundComponent,
    meta: {
      title: '页面错误'
    }
  }, {
    path: '/error/500',
    name: '系统错误',
    hidden: true,
    component: serverErrorComponent,
    meta: {
      title: '系统错误'
    }
  }, {
    path: '/error/wait',
    name: '系统维护',
    hidden: true,
    component: systemMaintainComponent,
    meta: {
      title: '系统维护'
    }
  }]
}

export default {MENU}
