// 进出口模板
const MENU = {
  path: '/eImport/eiTemplate',
  name: 'eiTemplate',
  icon: 'icons-menu-iEDefault',
  permissions: 'CCBA20201000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '进出口模板'
  },
  children: [
    {
      path: '/eImport/eiTemplate/import',
      name: 'iTemplate',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进口报关单模板'
      }
    },
    {
      path: '/eImport/eiTemplate/export',
      name: 'eTemplate',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口报关单模板'
      }
    },
    {
      path: '/eImport/templates/datainput/I/taxList',
      name: 'tax_I_Template',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '进口核注清单模板'
      }
    },
    {
      path: '/eImport/templates/datainput/E/taxList',
      name: 'tax_E_Template',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口核注清单模板'
      }
    },
    {
      path: '/eImport/eiTemplate/list',
      name: 'templateList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '报关单模板查询'
      }
    },
    {
      path: '/eImport/templates/dataQuery/taxListTemplateQuery',
      name: 'taxTemplateList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '核注清单模板查询'
      }
    },
    {
      path: '/eImport/eiTemplate/shipping',
      name: 'shipping',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '出口导入模板'
      }
    },
    {
      path: '/eImport/customizeTemplate/list',
      name: 'customizeTemplate',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201050000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '自定义模板'
      }
    }
  ]
}
export default {MENU}
