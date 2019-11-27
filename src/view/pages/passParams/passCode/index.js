// 通关参数-通关代码
const MENU = {
  path: '/passParams/passCode',
  name: 'passParams-passCode',
  icon: 'icons-menu-passCode',
  permissions: 'CCBA21201000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
  meta: {
    title: '通关代码'
  },
  children: [
    {
      path: '/passParams/customs/list',
      name: 'customs',
      permissions: 'CCBA21201010000',
      hidden: false,
      meta: {
        component: resolve => require(['./customs.vue'], resolve),
        title: '关区'
      }
    },
    {
      path: '/passParams/country/list',
      name: 'country',
      permissions: 'CCBA21201020000',
      hidden: false,
      meta: {
        component: resolve => require(['./country.vue'], resolve),
        title: '国别（地区）'
      }
    },
    {
      path: '/passParams/money/list',
      name: 'money',
      permissions: 'CCBA21201030000',
      hidden: false,
      meta: {
        component: resolve => require(['./money.vue'], resolve),
        title: '币制'
      }
    },
    {
      path: '/passParams/unit/list',
      name: 'unit',
      permissions: 'CCBA21201040000',
      hidden: false,
      meta: {
        component: resolve => require(['./unit.vue'], resolve),
        title: '计量单位'
      }
    },
    {
      path: '/passParams/controlMode/list',
      name: 'controlMode',
      permissions: 'CCBA21201050000',
      hidden: false,
      meta: {
        component: resolve => require(['./controlMode.vue'], resolve),
        title: '监管方式'
      }
    },
    {
      path: '/passParams/transport/list',
      name: 'transport',
      permissions: 'CCBA21201060000',
      hidden: false,
      meta: {
        component: resolve => require(['./transport.vue'], resolve),
        title: '运输方式'
      }
    },
    {
      path: '/passParams/redemp/list',
      name: 'redemp',
      permissions: 'CCBA21201070000',
      hidden: false,
      meta: {
        component: resolve => require(['./redemp.vue'], resolve),
        title: '征免性质'
      }
    },
    {
      path: '/passParams/port/list',
      name: 'port',
      permissions: 'CCBA21201080000',
      hidden: false,
      meta: {
        component: resolve => require(['./port.vue'], resolve),
        title: '港口'
      }
    },
    {
      path: '/passParams/pakageKinds/list',
      name: 'pakageKinds',
      permissions: 'CCBA21201090000',
      hidden: false,
      meta: {
        component: resolve => require(['./pakageKinds.vue'], resolve),
        title: '包装种类'
      }
    },
    {
      path: '/passParams/bargain/list',
      name: 'bargain',
      permissions: 'CCBA21201100000',
      hidden: false,
      meta: {
        component: resolve => require(['./bargain.vue'], resolve),
        title: '成交方式'
      }
    },
    {
      path: '/passParams/regulate/list',
      name: 'regulate',
      permissions: 'CCBA21201110000',
      hidden: false,
      meta: {
        component: resolve => require(['./regulate.vue'], resolve),
        title: '监管证件'
      }
    },
    {
      path: '/passParams/licensePass/list',
      name: 'licensePass',
      permissions: 'CCBA21201120000',
      hidden: false,
      meta: {
        component: resolve => require(['./license.vue'], resolve),
        title: '随附单据'
      }
    },
    {
      path: '/passParams/tradePro/list',
      name: 'tradePro',
      permissions: 'CCBA21201130000',
      hidden: false,
      meta: {
        component: resolve => require(['./tradePro.vue'], resolve),
        title: '优惠贸易协定'
      }
    },
    {
      path: '/passParams/inLandArea/list',
      name: 'inLandArea',
      permissions: 'CCBA21201140000',
      hidden: false,
      meta: {
        component: resolve => require(['./inLandArea.vue'], resolve),
        title: '国内地区'
      }
    },
    {
      path: '/passParams/taxFree/list',
      name: 'taxFree',
      permissions: 'CCBA21201150000',
      hidden: false,
      meta: {
        component: resolve => require(['./taxFree.vue'], resolve),
        title: '征减免税方式'
      }
    },
    {
      path: '/passParams/inLandPort/list',
      name: 'inLandPort',
      permissions: 'CCBA21201160000',
      hidden: false,
      meta: {
        component: resolve => require(['./inLandPort.vue'], resolve),
        title: '国内口岸'
      }
    }
  ]
}
export default {MENU}
