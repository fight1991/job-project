// 关检整合申报
const MENU = {
  path: '/eImport/importDec',
  name: 'importDec',
  icon: 'icons-menu-importDec',
  permissions: 'CCBA20209000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '进口制单'
  },
  children: [
    {
      path: '/eImport/importDec/import',
      name: 'importDec',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进口报关单'
      }
    },
    {
      path: '/eImport/importDec/importRecord',
      name: 'importRecord',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进境备案清单'
      }
    }, {
      path: '/eImport/importDec/importSummaryDec',
      name: 'importSummaryDec',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209060000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进口报关单(概要申报)'
      }
    },
    {
      path: '/eImport/importDec/importSummaryRecord',
      name: 'importSummaryRecord',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209070000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进境备案清单(概要申报)'
      }
    },
    {
      path: '/eImport/importDec/importTaxList',
      name: 'importTaxList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进口核注清单'
      }
    },
    {
      path: '/eImport/importDec/importDecList',
      name: 'importDecList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209040000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进口转关提前报关'
      }
    },
    {
      path: '/eImport/importDec/importRecList',
      name: 'importRecList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209050000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进境转关提前备案清单'
      }
    }
  ]
}
export default {MENU}
