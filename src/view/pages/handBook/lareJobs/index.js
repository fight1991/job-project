// 加工贸易手册-通关作业
const MENU = {
  path: '/handBook/lareJobs',
  name: 'handBook-lareJobs',
  icon: 'icons-menu-lareJobs',
  permissions: 'CCBA20802000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '通关作业'
  },
  children: [
    {
      path: '/handBook/taxList_I_hand/list',
      name: 'taxList_I_hand',
      permissions: 'CCBA20802010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '保税核注清单（进口）'
      }
    },
    {
      path: '/handBook/taxList_E_hand/list',
      name: 'taxList_E_hand',
      permissions: 'CCBA20802020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '保税核注清单（出口）'
      }
    },
    {
      path: '/handBook/taxListQuery_hand/list',
      name: 'taxListQuery_hand',
      permissions: 'CCBA20802030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '保税核注清单查询'
      }
    }
  ]
}
export default {MENU}
