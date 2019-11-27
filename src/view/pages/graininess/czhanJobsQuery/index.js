// 海关监管-场站作业查询
const MENU = {
  path: '/graininess/czhanJobsQuery',
  name: 'graininess-czhanJobsQuery',
  icon: 'icons-menu-czjbquery',
  permissions: 'CCBA21005000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '场站作业查询'
  },
  children: [
    {
      path: '/graininess/applyQuery_gra/list',
      name: 'applyQuery_gra',
      permissions: 'CCBA21005010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '业务申报表查询'
      }
    },
    {
      path: '/graininess/applyIxEQuery_gra/list',
      name: 'applyIxEQuery_gra',
      permissions: 'CCBA21005020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '申报表货物进出查询'
      }
    },
    {
      path: '/graininess/stockQuery_gra/list',
      name: 'stockQuery_gra',
      permissions: 'CCBA21005030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出入库单查询'
      }
    },
    {
      path: '/graininess/releseQuery_gra/list',
      name: 'releseQuery_gra',
      permissions: 'CCBA21005040000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '核放单查询'
      }
    },
    {
      path: '/graininess/stockReleseQuery_gra/list',
      name: 'stockReleseQuery_gra',
      permissions: 'CCBA21005050000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出入库单生成核放单查询'
      }
    },
    {
      path: '/graininess/taxReleseQuery_gra/list',
      name: 'taxReleseQuery_gra',
      permissions: 'CCBA21005060000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '核注清单生成核放单查询'
      }
    },
    {
      path: '/sea/carInfoQuery_gra/list',
      name: 'carInfoQuery_gra',
      permissions: 'CCBA21005070000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '车辆信息查询'
      }
    }
  ]
}
export default {MENU}
