// 进出口模板
const MENU = {
  path: '/iExport/iETemplate',
  name: 'iETemplate',
  icon: 'icons-menu-iEDefault',
  permissions: 'CCBA20201000000',
  component: resolve => require(['../../common/abstract.vue'], resolve),
  meta: {
    title: '进出口模板'
  },
  children: [
    {
      path: '/iExport/eiTemplate/decTemplate/import/add/new',
      name: 'iDecTemplateAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201020000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/decTemplate.vue'], resolve),
        title: '进口报关单模板',
        iEFlag: 'import',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/eiTemplate/decTemplate/import/edit/:pid',
      name: 'iDecTemplateEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201020000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decTemplate.vue'], resolve),
        title: '进口报关单模板',
        iEFlag: 'import',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/eiTemplate/decTemplate/import/look/:pid',
      name: 'iDecTemplateLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201020000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decTemplate.vue'], resolve),
        title: '进口报关单模板',
        iEFlag: 'import',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/eiTemplate/decTemplate/export/add/new',
      name: 'eDecTemplateAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/decTemplate.vue'], resolve),
        title: '出口报关单模板',
        iEFlag: 'export',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/eiTemplate/decTemplate/export/edit/:pid',
      name: 'eDecTemplateEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decTemplate.vue'], resolve),
        title: '出口报关单模板',
        iEFlag: 'export',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/eiTemplate/decTemplate/export/look/:pid',
      name: 'eDecTemplateLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decTemplate.vue'], resolve),
        title: '出口报关单模板',
        iEFlag: 'export',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/templates/datainput/I/taxList',
      name: 'tax_I_Template',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./blankPage.vue'], resolve),
        title: '进口核注清单模板'
      }
    },
    {
      path: '/iExport/templates/datainput/E/taxList',
      name: 'tax_E_Template',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./blankPage.vue'], resolve),
        title: '出口核注清单模板'
      }
    },
    {
      path: '/iExport/eiTemplate/list',
      name: 'templateList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201010000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/decTemplateQuery.vue'], resolve),
        title: '报关单模板查询'
      }
    },
    {
      path: '/iExport/templates/dataQuery/taxListTemplateQuery',
      name: 'taxTemplateList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./blankPage.vue'], resolve),
        title: '核注清单模板查询'
      }
    },
    {
      path: '/iExport/eiTemplate/shipping',
      name: 'shipping',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/shipping.vue'], resolve),
        title: '出口导入模板'
      }
    },
    {
      path: '/iExport/customizeTemplate/list',
      name: 'customizeTemplateList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20201050000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/customizeTemplate/list.vue'], resolve),
        title: '自定义模板'
      }
    },
    {
      path: '/iExport/customizeTemplate/:operationType/:pid',
      name: 'customizeTemplate',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/customizeTemplate/detail.vue'], resolve),
        title: '自定义模版'
      }
    }
  ]
}
export default {MENU}
