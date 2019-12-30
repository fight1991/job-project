// 出境/港申报
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/aircraft/iEport',
  name: 'aircraft-iEport',
  icon: 'icons-menu-ieport',
  permissions: 'CCBA20402000000',
  component: abstractComponent,
  meta: {
    title: '进/出境/港申报'
  },
  children: [
    {
      path: '/aircraft/importDynamic/list',
      name: 'importDynamicList',
      permissions: 'CCBA20402010000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "import-dyn-list" */ './importDynList.vue'),
        title: '进境/港动态申报'
      }
    },
    {
      path: '/aircraft/importDynamic/editDetail/:type/:id',
      name: 'importDynamicDetail',
      permissions: 'CCBA20402010000',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "import-dyn-detail" */ './importDynDetail.vue'),
        title: '进境/港动态申报信息'
      }
    },
    {
      path: '/aircraft/importDocument/list',
      name: 'importDocumentList',
      permissions: 'CCBA20402020000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "import-doc-list" */ './importDocList.vue'),
        title: '进境/港单证申报'
      }
    },
    {
      path: '/aircraft/importDocument/editDetail/:type/:id',
      name: 'importDocumentDetail',
      permissions: 'CCBA20402020000',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "import-doc-detail" */ './importDocDetail.vue'),
        title: '进境/港单证申报信息'
      }
    },
    {
      path: '/aircraft/exportDynamic/list',
      name: 'exportDynamicList',
      permissions: 'CCBA20402030000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "export-dyn-list" */ './exportDynList.vue'),
        title: '出境/港动态申报'
      }
    },
    {
      path: '/aircraft/exportDynamic/editDetail/:type/:id',
      name: 'exportDynamicDetail',
      permissions: 'CCBA20402030000',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "export-dyn-detail" */ './exportDynDetail.vue'),
        title: '出境/港动态申报信息'
      }
    },
    {
      path: '/aircraft/exportDocument/list',
      name: 'exportDocumentList',
      permissions: 'CCBA20402040000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "export-doc-list" */ './exportDocList.vue'),
        title: '出境/港单证申报'
      }
    },
    {
      path: '/aircraft/exportDocument/editDetail/:type/:id',
      name: 'exportDocumentDetail',
      permissions: 'CCBA20402040000',
      hidden: true,
      meta: {
        component: () => import(/* webpackChunkName: "export-doc-detail" */ './exportDocDetail.vue'),
        title: '出境/港单证申报信息'
      }
    },
    {
      path: '/aircraft/airCancel/list',
      name: 'airCancel',
      permissions: 'CCBA20402050000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "air-cancel-list" */ './airCancelList.vue'),
        title: '航班取消申报'
      }
    }
  ]
}
export default {MENU}
