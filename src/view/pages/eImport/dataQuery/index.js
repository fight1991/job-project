// 业务数据查询
const MENU = {
  path: '/eImport/dataQuery',
  name: 'dataQuery',
  icon: 'icons-menu-dataQuery',
  permissions: 'CCBA20205000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '业务数据查询'
  },
  children: [
    {
      path: '/eImport/dataQuery/decInfo',
      name: 'decInfo',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '报关数据查询'
      }
    },
    {
      path: '/eImport/dataQuery/summaryDecInfo',
      name: 'summaryDecInfo',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205040000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '概要申报数据查询'
      }
    },
    {
      path: '/eImport/dataQuery/taxInfo',
      name: 'taxInfo',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '核注清单查询'
      }
    },
    {
      path: '/eImport/dataQuery/tLedger',
      name: 'tLedger',
      icon: 'icons-menu-price',
      permissions: 'CCBA20205030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '业务跟踪台帐'
      }
    }
  ]
}
export default {MENU}
