// 出境/港申报
const MENU = {
  path: '/aircraft/iEport',
  name: 'aircraft-iEport',
  icon: 'icons-menu-ieport',
  permissions: 'CCBA20402000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
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
        component: resolve => require(['./importDynList.vue'], resolve),
        title: '进境/港动态申报'
      }
    },
    {
      path: '/aircraft/importDynamic/editDetail/:type/:id',
      name: 'importDynamicDetail',
      permissions: 'CCBA20402010000',
      hidden: true,
      meta: {
        component: resolve => require(['./importDynDetail.vue'], resolve),
        title: '进境/港动态申报信息'
      }
    },
    {
      path: '/aircraft/importDocument/list',
      name: 'importDocumentList',
      permissions: 'CCBA20402020000',
      hidden: false,
      meta: {
        component: resolve => require(['./importDocList.vue'], resolve),
        title: '进境/港单证申报'
      }
    },
    {
      path: '/aircraft/importDocument/editDetail/:type/:id',
      name: 'importDocumentDetail',
      permissions: 'CCBA20402020000',
      hidden: true,
      meta: {
        component: resolve => require(['./importDocDetail.vue'], resolve),
        title: '进境/港单证申报信息'
      }
    },
    {
      path: '/aircraft/exportDynamic/list',
      name: 'exportDynamicList',
      permissions: 'CCBA20402030000',
      hidden: false,
      meta: {
        component: resolve => require(['./exportDynList.vue'], resolve),
        title: '出境/港动态申报'
      }
    },
    {
      path: '/aircraft/exportDynamic/editDetail/:type/:id',
      name: 'exportDynamicDetail',
      permissions: 'CCBA20402030000',
      hidden: true,
      meta: {
        component: resolve => require(['./exportDynDetail.vue'], resolve),
        title: '出境/港动态申报信息'
      }
    },
    {
      path: '/aircraft/exportDocument/list',
      name: 'exportDocumentList',
      permissions: 'CCBA20402040000',
      hidden: false,
      meta: {
        component: resolve => require(['./exportDocList.vue'], resolve),
        title: '出境/港单证申报'
      }
    },
    {
      path: '/aircraft/exportDocument/editDetail/:type/:id',
      name: 'exportDocumentDetail',
      permissions: 'CCBA20402040000',
      hidden: true,
      meta: {
        component: resolve => require(['./exportDocDetail.vue'], resolve),
        title: '出境/港单证申报信息'
      }
    },
    {
      path: '/aircraft/airCancel/list',
      name: 'airCancel',
      permissions: 'CCBA20402050000',
      hidden: false,
      meta: {
        component: resolve => require(['./airCancelList.vue'], resolve),
        title: '航班取消申报'
      }
    }
  ]
}
export default {MENU}
