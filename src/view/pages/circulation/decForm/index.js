// 保税获取流转-申报表
const MENU = {
  path: '/circulation/decForm',
  name: 'circulation-decForm',
  icon: 'icons-menu-decForm',
  permissions: 'CCBA21101000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '申报表'
  },
  children: [
    {
      path: '/circulation/decForm/I/list',
      name: 'outedcform',
      permissions: 'CCBA21101010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '转出申报'
      }
    },
    {
      path: '/circulation/decForm/E/list',
      name: 'incform',
      permissions: 'CCBA21101020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '转入申报'
      }
    },
    {
      path: '/circulation/decForm/decFormQuery/list',
      name: 'decFormQuery',
      permissions: 'CCBA21101030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '申报表查询'
      }
    }
  ]
}

export default {MENU}
