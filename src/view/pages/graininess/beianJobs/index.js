// 加工贸易账册-电子底账
const MENU = {
  path: '/graininess/beianJobs',
  name: 'graininess-beianJobs',
  icon: 'icons-menu-beianJobs',
  permissions: 'CCBA21001000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '电子底账'
  },
  children: [
    {
      path: '/graininess/bwl_gra/list',
      name: 'bwl_gra',
      permissions: 'CCBA21001010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '物流账册'
      }
    },
    {
      path: '/graininess/bwlQuery_gra/list',
      name: 'bwlQuery_gra',
      permissions: 'CCBA21001020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '物流账册查询'
      }
    }
  ]
}
export default {MENU}
