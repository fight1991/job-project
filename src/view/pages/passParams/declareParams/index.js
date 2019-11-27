// 通关参数-商品申报参数
const MENU = {
  path: '/passParams/productParams',
  name: 'passParams-productParams',
  icon: 'icons-menu-productParams',
  permissions: 'CCBA21202000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '商品申报参数'
  },
  children: [
    {
      path: '/passParams/taxRule/list',
      name: 'taxRule',
      permissions: 'CCBA21202010000',
      hidden: false,
      meta: {
        component: resolve => require(['./taxRule.vue'], resolve),
        title: '税则'
      }
    },
    {
      path: '/passParams/taxRule/detail',
      name: 'taxRuleInfo',
      hidden: true,
      meta: {
        component: resolve => require(['./taxRuleInfo.vue'], resolve),
        title: '税则详情'
      }
    },
    {
      path: '/passParams/calculatedRate/list',
      name: 'calculatedRate',
      permissions: 'CCBA21202070000',
      hidden: false,
      meta: {
        component: resolve => require(['./calculatedRate.vue'], resolve),
        title: '计征汇率'
      }
    },
    {
      path: '/passParams/favoredCountry/list',
      name: 'favoredCountry',
      permissions: 'CCBA21202080000',
      hidden: false,
      meta: {
        component: resolve => require(['./favoredCountry.vue'], resolve),
        title: '最惠国'
      }
    },
    {
      path: '/passParams/productCate/list',
      name: 'productCate',
      permissions: 'CCBA21202020000',
      hidden: false,
      meta: {
        component: resolve => require(['./productCate.vue'], resolve),
        title: '统计商品目录'
      }
    },
    {
      path: '/passParams/declareEle/list',
      name: 'declareEle',
      permissions: 'CCBA21202030000',
      hidden: false,
      meta: {
        component: resolve => require(['./declareEle.vue'], resolve),
        title: '规范申报要素'
      }
    },
    {
      path: '/passParams/checkCate/list',
      name: 'checkCate',
      permissions: 'CCBA21202040000',
      hidden: false,
      meta: {
        component: resolve => require(['./checkCate.vue'], resolve),
        title: '法检目录'
      }
    },
    {
      path: '/passParams/treeCate/list',
      name: 'treeCate',
      permissions: 'CCBA21202050000',
      hidden: false,
      meta: {
        component: resolve => require(['./treeCate.vue'], resolve),
        title: '3C目录'
      }
    },
    {
      path: '/passParams/CIQCode/list',
      name: 'CIQCode',
      permissions: 'CCBA21202060000',
      hidden: false,
      meta: {
        component: resolve => require(['./CIQCode.vue'], resolve),
        title: 'CIQ编码'
      }
    }
  ]
}
export default {MENU}
