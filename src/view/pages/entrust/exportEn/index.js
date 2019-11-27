// 出口委托
const MENU = {
  path: '/entrust/exportEntrust',
  name: 'exportEntrust',
  icon: 'icons-menu-exportEn',
  permissions: 'CCBA21502000000',
  meta: {
    component: resolve => require(['./index.vue'], resolve),
    title: '出口委托'
  }
}
export default {MENU}
