// 业务数据查询
const MENU = {
  path: '/iExport/dataQuery',
  name: 'dataQuery',
  icon: 'icons-menu-dataQuery',
  permissions: 'CCBA20205000000',
  component: resolve => require(['../../common/abstract.vue'], resolve),
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
        component: resolve => require(['./declaration/decQueryList/index.vue'], resolve),
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
        component: resolve => require(['./declaration/summaryDecQuery.vue'], resolve),
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
        component: resolve => require(['./declaration/businessTracke.vue'], resolve),
        title: '业务跟踪台帐'
      }
    }
  ]
}
export default {MENU}
