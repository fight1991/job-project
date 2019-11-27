// 加工贸易账册-通关作业
const MENU = {
  path: '/account/lareJobs',
  name: 'account-lareJobs',
  icon: 'icons-menu-lareJobs',
  permissions: 'CCBA20702000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '通关作业'
  },
  children: [
    {
      path: '/account/taxList_I_acc/list',
      name: 'taxList_I_acc',
      permissions: 'CCBA20702010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '保税核注清单（进口）'
      }
    },
    {
      path: '/account/taxList_E_acc/list',
      name: 'taxList_E_acc',
      permissions: 'CCBA20702020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '保税核注清单（出口）'
      }
    },
    {
      path: '/account/taxListQuery_acc/list',
      name: 'taxListQuery_acc',
      permissions: 'CCBA20702030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '保税核注清单查询'
      }
    }
  ]
}
export default {MENU}
