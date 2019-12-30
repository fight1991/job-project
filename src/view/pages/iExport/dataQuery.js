// 业务数据查询
import abstractComponent from '@/view/common/abstract.vue'
const decQueryComponent = () => import(/* webpackChunkName: "dec-query" */ './declaration/decQueryList/index.vue')
const summaryDecQueryComponent = () => import(/* webpackChunkName: "summary-dec-query" */ './declaration/summaryDecQuery.vue')
const businessTrackeComponent = () => import(/* webpackChunkName: "dec-business-trackå" */ './declaration/businessTracke.vue')

const MENU = {
  path: '/iExport/dataQuery',
  name: 'dataQuery',
  icon: 'icons-menu-data-search',
  permissions: 'CCBA20205000000',
  component: abstractComponent,
  meta: {
    title: '业务数据查询'
  },
  children: [
    {
      path: '/iExport/dataQuery/decInfo',
      name: 'decInfo',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205010000',
      hidden: false,
      meta: {
        component: decQueryComponent,
        title: '报关数据查询'
      }
    },
    {
      path: '/iExport/dataQuery/summaryDecInfo',
      name: 'summaryDecInfo',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205040000',
      hidden: false,
      meta: {
        component: summaryDecQueryComponent,
        title: '概要申报数据查询'
      }
    },
    {
      path: '/iExport/dataQuery/taxInfo',
      name: 'taxInfo',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205020000',
      hidden: false,
      meta: {
        component: resolve => require(['./blankPage.vue'], resolve),
        title: '核注清单查询'
      }
    },
    {
      path: '/iExport/dataQuery/tLedger',
      name: 'tLedger',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205030000',
      hidden: false,
      meta: {
        component: businessTrackeComponent,
        title: '业务跟踪台帐'
      }
    }
  ]
}
export default {MENU}
