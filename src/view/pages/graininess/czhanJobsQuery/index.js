// 海关监管-场站作业查询
import abstractComponent from '@/view/common/abstract.vue'
import graininessczhanJobsQueryIndexComponent from './index.vue'

const MENU = {
  path: '/graininess/czhanJobsQuery',
  name: 'graininess-czhanJobsQuery',
  icon: 'icons-menu-czjbquery',
  permissions: 'CCBA21005000000',
  component: abstractComponent,
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
        component: graininessczhanJobsQueryIndexComponent,
        title: '业务申报表查询'
      }
    },
    {
      path: '/graininess/applyIxEQuery_gra/list',
      name: 'applyIxEQuery_gra',
      permissions: 'CCBA21005020000',
      hidden: false,
      meta: {
        component: graininessczhanJobsQueryIndexComponent,
        title: '申报表货物进出查询'
      }
    },
    {
      path: '/graininess/stockQuery_gra/list',
      name: 'stockQuery_gra',
      permissions: 'CCBA21005030000',
      hidden: false,
      meta: {
        component: graininessczhanJobsQueryIndexComponent,
        title: '出入库单查询'
      }
    },
    {
      path: '/graininess/releseQuery_gra/list',
      name: 'releseQuery_gra',
      permissions: 'CCBA21005040000',
      hidden: false,
      meta: {
        component: graininessczhanJobsQueryIndexComponent,
        title: '核放单查询'
      }
    },
    {
      path: '/graininess/stockReleseQuery_gra/list',
      name: 'stockReleseQuery_gra',
      permissions: 'CCBA21005050000',
      hidden: false,
      meta: {
        component: graininessczhanJobsQueryIndexComponent,
        title: '出入库单生成核放单查询'
      }
    },
    {
      path: '/graininess/taxReleseQuery_gra/list',
      name: 'taxReleseQuery_gra',
      permissions: 'CCBA21005060000',
      hidden: false,
      meta: {
        component: graininessczhanJobsQueryIndexComponent,
        title: '核注清单生成核放单查询'
      }
    },
    {
      path: '/sea/carInfoQuery_gra/list',
      name: 'carInfoQuery_gra',
      permissions: 'CCBA21005070000',
      hidden: false,
      meta: {
        component: graininessczhanJobsQueryIndexComponent,
        title: '车辆信息查询'
      }
    }
  ]
}
export default {MENU}
