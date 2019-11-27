import abstractComponent from '../common/abstract.vue'

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
    component: resolve => require(['./404.vue'], resolve),
    meta: {
      title: '页面错误'
    }
  }, {
    path: '/error/500',
    name: '系统错误',
    hidden: true,
    component: resolve => require(['./500.vue'], resolve),
    meta: {
      title: '系统错误'
    }
  }, {
    path: '/error/wait',
    name: '系统维护',
    hidden: true,
    component: resolve => require(['./wait.vue'], resolve),
    meta: {
      title: '系统维护'
    }
  }]
}

export default {MENU}
