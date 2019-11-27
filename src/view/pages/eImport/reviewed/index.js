// 报关单审核
const MENU = {
  path: '/eImport/reviewed',
  name: 'reviewed',
  icon: 'icons-menu-decCheck',
  permissions: 'CCBA20204000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '审单'
  },
  children: [
    {
      path: '/eImport/reviewed/decReviewed',
      name: 'decReviewed',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204010000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '报关单审核'
      }
    }, {
      path: '/eImport/reviewed/taxReviewed',
      name: 'taxReviewed',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204020000',
      hidden: false,
      meta: {
        component: resolve => require(['./index.vue'], resolve),
        title: '核注清单审核'
      }
    }
  ]
}
export default {MENU}
