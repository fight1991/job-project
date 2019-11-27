// 关检整合申报
const MENU = {
  path: '/iExport/exportVouching',
  name: 'exportVouching',
  icon: 'icons-menu-exportDec',
  permissions: 'CCBA20210000000',
  component: resolve => require(['../../common/abstract.vue'], resolve),
  meta: {
    title: '出口制单'
  },
  children: [
    {
      path: '/iExport/exportVouching/exportDec/add/new',
      name: 'exportDecAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210010000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/decPage/decPage.vue'], resolve),
        title: '出口报关单',
        funFlag: 'declaration',
        iEFlag: 'export',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/exportVouching/exportDec/edit/:pid',
      name: 'exportDecEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210010000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decPage/decPage.vue'], resolve),
        title: '出口报关单',
        funFlag: 'declaration',
        iEFlag: 'export',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/exportVouching/exportDec/look/:pid',
      name: 'exportDecLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210010000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decPage/decPage.vue'], resolve),
        title: '出口报关单',
        funFlag: 'declaration',
        iEFlag: 'export',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/exportVouching/exportRecord/add/new',
      name: 'exportRecordAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210020000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/decPage/decPage.vue'], resolve),
        title: '出境备案清单',
        funFlag: 'recordList',
        iEFlag: 'export',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/exportVouching/exportRecord/edit/:pid',
      name: 'exportRecordEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210020000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decPage/decPage.vue'], resolve),
        title: '出境备案清单',
        funFlag: 'recordList',
        iEFlag: 'export',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/exportVouching/exportRecord/look/:pid',
      name: 'exportRecordLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210020000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/decPage/decPage.vue'], resolve),
        title: '出境备案清单',
        funFlag: 'recordList',
        iEFlag: 'export',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/exportVouching/exportTaxList',
      name: 'exportTaxList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210030000',
      hidden: false,
      meta: {
        component: resolve => require(['./blankPage.vue'], resolve),
        title: '出口核注清单'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitDec/add/new',
      name: 'exportTransitDecAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210040000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出口转关提前报关',
        funFlag: 'declaration',
        iEFlag: 'export',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitDec/edit/:pid',
      name: 'exportTransitDecEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210040000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出口转关提前报关',
        funFlag: 'declaration',
        iEFlag: 'export',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitDec/look/:pid',
      name: 'exportTransitDecLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210040000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出口转关提前报关',
        funFlag: 'declaration',
        iEFlag: 'export',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitRecordList/add/new',
      name: 'exportTransitRecordListAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210050000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出境转关提前备案清单',
        funFlag: 'recordList',
        iEFlag: 'export',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitRecordList/edit/:pid',
      name: 'exportTransitRecordListEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210050000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出境转关提前备案清单',
        funFlag: 'recordList',
        iEFlag: 'export',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitRecordList/look/:pid',
      name: 'exportTransitRecordListLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210050000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出境转关提前备案清单',
        funFlag: 'recordList',
        iEFlag: 'export',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitSecondDec/add/new',
      name: 'exportTransitSecondDecAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210060000',
      hidden: false,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出口二次转关',
        funFlag: 'secondDec',
        iEFlag: 'export',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitSecondDec/edit/:pid',
      name: 'exportTransitSecondDecEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210060000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出口二次转关',
        funFlag: 'secondDec',
        iEFlag: 'export',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/exportVouching/exportTransitSecondDec/look/:pid',
      name: 'exportTransitSecondDecLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20210060000',
      hidden: true,
      meta: {
        component: resolve => require(['./declaration/customsTransit.vue'], resolve),
        title: '出口二次转关',
        funFlag: 'secondDec',
        iEFlag: 'export',
        operationType: 'look'
      }
    }
  ]
}
export default {MENU}
