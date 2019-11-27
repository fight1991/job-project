// 商品资料库
const MENU = {
  path: '/dataCenter/goods',
  name: 'goods',
  icon: 'icons-menu-productInfo',
  permissions: 'CCBA20301000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
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
        component: resolve => require(['../../iExport/declaration/commodity.vue'], resolve),
        title: '商品数据库'
      }
    }, {
      path: '/dataCenter/goods/bonded',
      name: 'bonded',
      permissions: 'CCBA20301020000',
      hidden: false,
      meta: {
        component: resolve => require(['../../iExport/declaration/goodsModel.vue'], resolve),
        title: '保税商品库'
      }
    }
  ]
}
export default {MENU}
