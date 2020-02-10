// 商品资料库
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/dataCenter/goods',
  name: 'goods',
  icon: 'icons-menu-productInfo',
  permissions: 'CCBA20301000000',
  component: abstractComponent,
  meta: {
    title: '商品资料库'
  },
  children: [
    {
      path: '/dataCenter/goods/noBonded',
      name: 'noBonded',
      permissions: 'CCBA20301010000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "commodity" */ '../../iExport/declaration/commodity/commodity.vue'),
        title: '商品数据库'
      }
    }, {
      path: '/dataCenter/goods/bonded',
      name: 'bonded',
      permissions: 'CCBA20301020000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "goods-model" */ '../../iExport/declaration/goodsModel.vue'),
        title: '保税商品库'
      }
    }
  ]
}
export default {MENU}
