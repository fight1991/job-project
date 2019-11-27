// 删改单登记
const MENU = {
  path: '/eImport/decRegister',
  name: 'decRegister',
  icon: 'icons-menu-decRegister',
  permissions: 'CCBA20208000000',
  meta: {
    component: resolve => require(['./index.vue'], resolve),
    title: '异常状态登记'
  }
}
export default {MENU}
