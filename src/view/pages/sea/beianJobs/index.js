// 加工贸易账册-电子底账
const MENU = {
  path: '/sea/beianJobs',
  name: 'sea-beianJobs',
  icon: 'icons-menu-beianJobs',
  permissions: 'CCBA20901000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '电子底账'
  },
  children: [
    {
      path: '/sea/accountBook_sea/list',
      name: 'accountBook_sea',
      permissions: 'CCBA20901010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '加工贸易账册'
      }
    },
    {
      path: '/sea/bwl_sea/list',
      name: 'bwl_sea',
      permissions: 'CCBA20901020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '物流账册'
      }
    },
    {
      path: '/sea/cmb_sea/list',
      name: 'cmb_sea',
      permissions: 'CCBA20901030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '加工贸易耗料单'
      }
    },
    {
      path: '/sea/accountBookQuery_sea/list',
      name: 'accountBookQuery_sea',
      permissions: 'CCBA20901040000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '加工贸易账册查询'
      }
    },
    {
      path: '/sea/bwlQuery_sea/list',
      name: 'bwlQuery_sea',
      permissions: 'CCBA20901050000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '物流账册查询'
      }
    },
    {
      path: '/sea/cmbQuery_sea/list',
      name: 'cmbQuery_sea',
      permissions: 'CCBA20901060000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '加工贸易耗料单查询'
      }
    }
  ]
}
export default {MENU}
