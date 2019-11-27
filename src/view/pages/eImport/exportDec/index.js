// 关检整合申报
const MENU = {
  path: '/eImport/exportDec',
  name: 'exportDec',
  icon: 'icons-menu-exportDec',
  permissions: 'CCBA20210000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '出口制单'
  },
  children: [
    {
      path: '/eImport/exportDec/export',
      name: 'exportDeclaration',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口报关单'
      }
    },
    {
      path: '/eImport/exportDec/exportRecord',
      name: 'exportRecord',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出境备案清单'
      }
    },
    {
      path: '/eImport/exportDec/exportTaxList',
      name: 'exportTaxList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口核注清单'
      }
    },
    {
      path: '/eImport/exportDec/exportDecList',
      name: 'exportDecList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210040000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口转关提前报关'
      }
    },
    {
      path: '/eImport/exportDec/exportRecList',
      name: 'exportRecList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210050000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出境转关提前备案清单'
      }
    },
    {
      path: '/eImport/exportDec/exportSecList',
      name: 'exportSecList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210060000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口二次转关'
      }
    }
  ]
}
export default {MENU}
