// 逻辑检控设置
import abstractComponent from '@/view/common/abstract.vue'
const priceRangeComponent = () => import(/* webpackChunkName: "price-range" */ './prosecution/priceRange.vue')
const shipRelationComponent = () => import(/* webpackChunkName: "ship-relation" */ './prosecution/ship.vue')

const MENU = {
  path: '/iExport/prosecution',
  name: 'prosecution',
  icon: 'icons-menu-setting',
  permissions: 'CCBA20207000000',
  component: abstractComponent,
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
        component: priceRangeComponent,
        title: '价格区间提示'
      }
    }, {
      path: '/iExport/prosecution/ship',
      name: 'ship',
      icon: 'icons-menu-price',
      permissions: 'CCBA20207020000',
      hidden: false,
      meta: {
        component: shipRelationComponent,
        title: '运输方式关系'
      }
    }
  ]
}
export default {MENU}
