// 逻辑检控设置
const MENU = {
  path: '/iExport/prosecution',
  name: 'prosecution',
  icon: 'icons-menu-setting',
  permissions: 'CCBA20207000000',
  component: resolve => require(['../../common/abstract.vue'], resolve),
  meta: {
    title: '逻辑检控设置'
  },
  children: [
    {
      path: '/iExport/prosecution/priceRange',
      name: 'priceRange',
      icon: 'icons-menu-price',
      permissions: 'CCBA20207010000',
      hidden: false,
      meta: {
        component: resolve => require(['./prosecution/priceRange.vue'], resolve),
        title: '价格区间提示'
      }
    }, {
      path: '/iExport/prosecution/ship',
      name: 'ship',
      icon: 'icons-menu-price',
      permissions: 'CCBA20207020000',
      hidden: false,
      meta: {
        component: resolve => require(['./prosecution/ship.vue'], resolve),
        title: '运输方式关系'
      }
    }
  ]
}
export default {MENU}
