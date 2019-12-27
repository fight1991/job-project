// 海关监管-通关作业
import abstractComponent from '@/view/common/abstract.vue'
import graininessLareJobsIndexComponent from './index.vue'

const MENU = {
  path: '/graininess/lareJobs',
  name: 'graininess-lareJobs',
  icon: 'icons-menu-lareJobs',
  permissions: 'CCBA21002000000',
  component: abstractComponent,
  meta: {
    title: '通关作业'
  },
  children: [
    {
      path: '/graininess/taxList_I_gra/list',
      name: 'taxList_I_gra',
      permissions: 'CCBA21002010000',
      hidden: false,
      meta: {
        component: graininessLareJobsIndexComponent,
        title: '保税核注清单（进口）'
      }
    },
    {
      path: '/graininess/taxList_E_gra/list',
      name: 'taxList_E_gra',
      permissions: 'CCBA21002020000',
      hidden: false,
      meta: {
        component: graininessLareJobsIndexComponent,
        title: '保税核注清单（出口）'
      }
    },
    {
      path: '/graininess/centDeclare_gra/list',
      name: 'centDeclare_gra',
      permissions: 'CCBA21002030000',
      hidden: false,
      meta: {
        component: graininessLareJobsIndexComponent,
        title: '集中报关'
      }
    },
    {
      path: '/graininess/clearance_gra/list',
      name: 'clearance_gra',
      permissions: 'CCBA21002040000',
      hidden: false,
      meta: {
        component: graininessLareJobsIndexComponent,
        title: '清单结关'
      }
    },
    {
      path: '/graininess/taxListQuery_gra/list',
      name: 'taxListQuery_gra',
      permissions: 'CCBA21002050000',
      hidden: false,
      meta: {
        component: graininessLareJobsIndexComponent,
        title: '保税核注清单查询'
      }
    },
    {
      path: '/graininess/clearanceQuery_gra/list',
      name: 'clearanceQuery_gra',
      permissions: 'CCBA21002060000',
      hidden: false,
      meta: {
        component: graininessLareJobsIndexComponent,
        title: '清单结关查询'
      }
    }
  ]
}
export default {MENU}
