// 保税获取流转-综合查询
const MENU = {
  path: '/circulation/queryList',
  name: 'circulation-queryList',
  icon: 'icons-menu-queryList',
  permissions: 'CCBA21103000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '综合查询'
  },
  children: [
    {
      path: '/circulation/multipleQuery/list',
      name: 'multipleQuery',
      permissions: 'CCBA21103010000',
      hidden: false,
      meta: {
        component: resolve => require(['./multipleQuery.vue'], resolve),
        title: '综合查询'
      }
    }
  ]
}
export default {MENU}
