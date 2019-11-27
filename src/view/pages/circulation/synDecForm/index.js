// 保税货物流转-同步申报表
const MENU = {
  path: '/circulation/synDecForm',
  name: 'circulation-synDecForm',
  icon: 'icons-menu-synDecForm',
  permissions: 'CCBA21104000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '同步申报表'
  },
  children: [
    {
      path: '/circulation/synDecForm/list',
      name: 'synDecForm',
      permissions: 'CCBA21104010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '同步申报表'
      }
    }
  ]
}
export default {MENU}
