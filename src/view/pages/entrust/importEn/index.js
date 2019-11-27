// 进口委托
const MENU = {
  path: '/entrust/importEntrust',
  name: 'importEntrust',
  icon: 'icons-menu-importEn',
  permissions: 'CCBA21501000000',
  meta: {
    component: resolve => require(['./index.vue'], resolve),
    title: '进口委托'
  }
}
export default {MENU}
