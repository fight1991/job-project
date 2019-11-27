// 在港申报
const MENU = {
  path: '/aircraft/inLare',
  name: 'aircraft-inLare',
  icon: 'icons-menu-inLare',
  permissions: 'CCBA20403000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '在港申报'
  },
  children: [
    {
      path: '/aircraft/inLare/customPort',
      name: 'customPortList',
      permissions: 'CCBA20403010000',
      hidden: false,
      meta: {
        component: resolve => require(['./customDeclareList.vue'], resolve),
        title: '海关在港申报'
      }
    },
    {
      path: '/aircraft/customPort/editDetail/:type/:id',
      name: 'customPortDetail',
      permissions: 'CCBA20403010000',
      hidden: true,
      meta: {
        component: resolve => require(['./customDeclareDetail.vue'], resolve),
        title: '海关在港申报信息'
      }
    },
    {
      path: '/aircraft/inLare/materials',
      name: 'materialsList',
      permissions: 'CCBA20403020000',
      hidden: false,
      meta: {
        component: resolve => require(['./materialsList.vue'], resolve),
        title: '供退物料申报'
      }
    },
    {
      path: '/aircraft/materials/editDetail/:type/:id',
      name: 'materialsListDetail',
      permissions: 'CCBA20403020000',
      hidden: true,
      meta: {
        component: resolve => require(['./materialsDetail.vue'], resolve),
        title: '供退物料申报信息'
      }
    }
  ]
}
export default {MENU}
