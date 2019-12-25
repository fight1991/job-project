// 业务报表
const MENU = {
  path: '/reportCenter/business',
  name: 'business',
  icon: 'icons-menu-jobsList',
  permissions: 'CCBA20601000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '业务报表'
  },
  children: [
    {
      path: '/reportCenter/business/amountSt',
      name: 'amountSt',
      permissions: 'CCBA20601010000',
      hidden: false,
      meta: {
        component: resolve => require(['./amountSt.vue'], resolve),
        title: '金额统计'
      }
    }, {
      path: '/reportCenter/business/certSt',
      name: 'certSt',
      permissions: 'CCBA20601020000',
      hidden: false,
      meta: {
        component: resolve => require(['./certSt.vue'], resolve),
        title: '单量统计'
      }
    }, {
      path: '/reportCenter/business/advanceSt',
      name: 'advanceSt',
      permissions: 'CCBA20601020000',
      hidden: false,
      meta: {
        component: resolve => require(['./advanceSt.vue'], resolve),
        title: '提前申报'
      }
    }, {
      path: '/reportCenter/business/trendSt',
      name: 'trendSt',
      permissions: 'CCBA20601030000',
      hidden: false,
      meta: {
        component: resolve => require(['./trendSt.vue'], resolve),
        title: '趋势统计'
      }
    }, {
      path: '/reportCenter/business/importSt',
      name: 'importSt',
      permissions: 'CCBA20601040000',
      hidden: false,
      meta: {
        component: resolve => require(['./importSt.vue'], resolve),
        title: '进口报表'
      }
    }, {
      path: '/reportCenter/business/exportSt',
      name: 'exportSt',
      permissions: 'CCBA20601050000',
      hidden: false,
      meta: {
        component: resolve => require(['./exportSt.vue'], resolve),
        title: '出口报表'
      }
    }
  ]
}
export default {MENU}
