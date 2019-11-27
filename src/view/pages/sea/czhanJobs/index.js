// 海关监管-场站业务
const MENU = {
  path: '/sea/czhanJobs',
  name: 'sea-czhanJobs',
  icon: 'icons-menu-czjb',
  permissions: 'CCBA20904000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '场站作业'
  },
  children: [
    {
      path: '/sea/apply_sea/list',
      name: 'apply_sea',
      permissions: 'CCBA20904010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '业务申报表'
      }
    },
    {
      path: '/sea/stock_sea/list',
      name: 'stock_sea',
      permissions: 'CCBA20904020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出入库单'
      }
    },
    {
      path: '/sea/auditRelese_sea/list',
      name: 'auditRelese_sea',
      permissions: 'CCBA20904030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '核放单'
      }
    },
    {
      path: '/sea/carInfo_sea/list',
      name: 'carInfo_sea',
      permissions: 'CCBA20904040000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '车辆信息'
      }
    }
  ]
}
export default {MENU}
