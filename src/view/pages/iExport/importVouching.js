// 关检整合申报
import abstractComponent from '@/view/common/abstract.vue'
const decPageComponent = () => import(/* webpackChunkName: "dec-page" */ './declaration/decPage/decPage.vue')
const summaryDecComponent = () => import(/* webpackChunkName: "summary-dec-page" */ './declaration/summaryDec/summaryDec.vue')
const customsTransitComponent = () => import(/* webpackChunkName: "customs-transit" */ './declaration/customsTransit.vue')

const MENU = {
  path: '/iExport/importVouching',
  name: 'importVouching',
  icon: 'icons-menu-importDec',
  permissions: 'CCBA20209000000',
  component: abstractComponent,
  meta: {
    title: '进口制单'
  },
  children: [
    {
      path: '/iExport/importVouching/importDec/add/new',
      name: 'importDecAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209010000',
      hidden: false,
      meta: {
        component: decPageComponent,
        title: '进口报关单',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/importVouching/importDec/edit/:pid',
      name: 'importDecEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209010000',
      hidden: true,
      meta: {
        component: decPageComponent,
        title: '进口报关单',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/importVouching/importDec/look/:pid',
      name: 'importDecLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209010000',
      hidden: true,
      meta: {
        component: decPageComponent,
        title: '进口报关单',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/importVouching/importRecord/add/new',
      name: 'importRecordAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209020000',
      hidden: false,
      meta: {
        component: decPageComponent,
        title: '进境备案清单',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/importVouching/importRecord/edit/:pid',
      name: 'importRecordEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209020000',
      hidden: true,
      meta: {
        component: decPageComponent,
        title: '进境备案清单',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/importVouching/importRecord/look/:pid',
      name: 'importRecordLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209020000',
      hidden: true,
      meta: {
        component: decPageComponent,
        title: '进境备案清单',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/importVouching/importSummaryDec/add/new',
      name: 'importSummaryDecAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209060000',
      hidden: false,
      meta: {
        component: summaryDecComponent,
        title: '进口报关单(概要申报)',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/importVouching/importSummaryDec/edit/:pid',
      name: 'importSummaryDecEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209060000',
      hidden: true,
      meta: {
        component: summaryDecComponent,
        title: '进口报关单(概要申报)',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/importVouching/importSummaryDec/look/:pid',
      name: 'importSummaryDeclook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209060000',
      hidden: true,
      meta: {
        component: summaryDecComponent,
        title: '进口报关单(概要申报)',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/importVouching/importSummaryRecord/add/new',
      name: 'importSummaryRecordAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209070000',
      hidden: false,
      meta: {
        component: summaryDecComponent,
        title: '进境备案清单(概要申报)',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/importVouching/importSummaryRecord/edit/:pid',
      name: 'importSummaryRecordEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209070000',
      hidden: true,
      meta: {
        component: summaryDecComponent,
        title: '进境备案清单(概要申报)',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/importVouching/importSummaryRecord/look/:pid',
      name: 'importSummaryRecordLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209070000',
      hidden: true,
      meta: {
        component: summaryDecComponent,
        title: '进境备案清单(概要申报)',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/importVouching/importTaxList',
      name: 'importTaxList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209030000',
      hidden: false,
      meta: {
        component: resolve => require(['./blankPage.vue'], resolve),
        title: '进口核注清单'
      }
    },
    {
      path: '/iExport/importVouching/importTransitDec/add/new',
      name: 'importTransitDecAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209040000',
      hidden: false,
      meta: {
        component: customsTransitComponent,
        title: '进口转关提前报关',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/importVouching/importTransitDec/edit/:pid',
      name: 'importTransitDecEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209040000',
      hidden: true,
      meta: {
        component: customsTransitComponent,
        title: '进口转关提前报关',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/importVouching/importTransitDec/look/:pid',
      name: 'importTransitDecLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209040000',
      hidden: true,
      meta: {
        component: customsTransitComponent,
        title: '进口转关提前报关',
        funFlag: 'declaration',
        iEFlag: 'import',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/importVouching/importTransitRecordList/add/new',
      name: 'importTransitRecordListAdd',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209050000',
      hidden: false,
      meta: {
        component: customsTransitComponent,
        title: '进境转关提前备案清单',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'add'
      }
    },
    {
      path: '/iExport/importVouching/importTransitRecordList/edit/:pid',
      name: 'importTransitRecordListEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209050000',
      hidden: true,
      meta: {
        component: customsTransitComponent,
        title: '进境转关提前备案清单',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/importVouching/importTransitRecordList/look/:pid',
      name: 'importTransitRecordListLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20209050000',
      hidden: true,
      meta: {
        component: customsTransitComponent,
        title: '进境转关提前备案清单',
        funFlag: 'recordList',
        iEFlag: 'import',
        operationType: 'look'
      }
    }
  ]
}
export default {MENU}
