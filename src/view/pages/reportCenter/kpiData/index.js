// 数据中心-KPI报表
const MENU = {
  path: '/reportCenter/kpiData',
  name: 'kpiData',
  permissions: 'CCBA20602000000',
  icon: 'icons-menu-kpiList',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: 'KPI报表'
  },
  children: [
    {
      path: '/reportCenter/kpiData/workLoad',
      name: 'workComputer',
      permissions: 'CCBA20602010000',
      hidden: false,
      meta: {
        component: resolve => require(['./workLoad.vue'], resolve),
        title: '工作量统计'
      }
    }
    // , {
    //   path: '/reportCenter/kpiData/decEdiCert',
    //   name: 'delDecSt',
    //   hidden: false,
    //   meta: {
    //     component: resolve => require(['./decEdiCert.vue'], resolve),
    //     title: '删改单报表'
    //   }
    // }
  ]
}
export default {MENU}
