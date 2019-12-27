// 业务报表
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/reportCenter/business',
  name: 'business',
  icon: 'icons-menu-jobsList',
  permissions: 'CCBA20601000000',
  component: abstractComponent,
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
        component: () => import(/* webpackChunkName: "amount-st" */ './amountSt.vue'),
        title: '金额统计'
      }
    }, {
      path: '/reportCenter/business/certSt',
      name: 'certSt',
      permissions: 'CCBA20601020000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "cert-st" */ './certSt.vue'),
        title: '单量统计'
      }
    }, {
      path: '/reportCenter/business/advanceSt',
      name: 'advanceSt',
      permissions: 'CCBA20601020000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "advance-st" */ './advanceSt.vue'),
        title: '提前申报'
      }
    }, {
      path: '/reportCenter/business/trendSt',
      name: 'trendSt',
      permissions: 'CCBA20601030000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "trend-st" */ './trendSt.vue'),
        title: '趋势统计'
      }
    }, {
      path: '/reportCenter/business/importSt',
      name: 'importSt',
      permissions: 'CCBA20601040000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "import-st" */ './importSt.vue'),
        title: '进口报表'
      }
    }, {
      path: '/reportCenter/business/exportSt',
      name: 'exportSt',
      permissions: 'CCBA20601050000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "export-st" */ './exportSt.vue'),
        title: '出口报表'
      }
    }
  ]
}
export default {MENU}
