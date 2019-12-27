// 海关监管-场站作业查询
import abstractComponent from '@/view/common/abstract.vue'
import seaCzhanJobsQueryIndexComponent from './index.vue'

const MENU = {
  path: '/sea/czhanJobsQuery',
  name: 'sea-czhanJobsQuery',
  icon: 'icons-menu-czjbquery',
  permissions: 'CCBA20905000000',
  component: abstractComponent,
  meta: {
    title: '场站作业查询'
  },
  children: [
    {
      path: '/sea/applyQuery_sea/list',
      name: 'applyQuery_sea',
      permissions: 'CCBA20905010000',
      hidden: false,
      meta: {
        component: seaCzhanJobsQueryIndexComponent,
        title: '业务申报表查询'
      }
    },
    {
      path: '/sea/applyIxEQuery_sea/list',
      name: 'applyIxEQuery_sea',
      permissions: 'CCBA20905020000',
      hidden: false,
      meta: {
        component: seaCzhanJobsQueryIndexComponent,
        title: '申报表货物进出查询'
      }
    },
    {
      path: '/sea/stockQuery_sea/list',
      name: 'stockQuery_sea',
      permissions: 'CCBA20905030000',
      hidden: false,
      meta: {
        component: seaCzhanJobsQueryIndexComponent,
        title: '出入库单查询'
      }
    },
    {
      path: '/sea/releseQuery_sea/list',
      name: 'releseQuery_sea',
      permissions: 'CCBA20905040000',
      hidden: false,
      meta: {
        component: seaCzhanJobsQueryIndexComponent,
        title: '核放单查询'
      }
    },
    {
      path: '/sea/stockReleseQuery_sea/list',
      name: 'stockReleseQuery_sea',
      permissions: 'CCBA20905050000',
      hidden: false,
      meta: {
        component: seaCzhanJobsQueryIndexComponent,
        title: '出入库单生成核放单查询'
      }
    },
    {
      path: '/sea/taxReleseQuery_sea/list',
      name: 'taxReleseQuery_sea',
      permissions: 'CCBA20905060000',
      hidden: false,
      meta: {
        component: seaCzhanJobsQueryIndexComponent,
        title: '核注清单生成核放单查询'
      }
    },
    {
      path: '/sea/carInfoQuery_sea/list',
      name: 'carInfoQuery_sea',
      permissions: 'CCBA20905070000',
      hidden: false,
      meta: {
        component: seaCzhanJobsQueryIndexComponent,
        title: '车辆信息查询'
      }
    }
  ]
}
export default {MENU}
