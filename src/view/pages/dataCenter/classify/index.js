// 归类管理

const MENU = {
  path: '/dataCenter/classify',
  name: 'classify',
  icon: 'icons-menu-classify',
  permissions: 'CCBA20306000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '归类管理'
  },
  children: [
    {
      path: '/dataCenter/classify/precedentClassify',
      name: 'precedentClassify',
      permissions: 'CCBA20306010000',
      hidden: false,
      meta: {
        component: resolve => require(['./precedentClassify.vue'], resolve),
        title: '智能归类'
      }
    }
  ]
}
export default {MENU}
