// 通关参数-通关代码
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/passParams/passCode',
  name: 'passParams-passCode',
  icon: 'icons-menu-passCode',
  permissions: 'CCBA21201000000',
  component: abstractComponent,
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
        component: () => import(/* webpackChunkName: "customs" */ './customs.vue'),
        title: '关区'
      }
    },
    {
      path: '/passParams/country/list',
      name: 'country',
      permissions: 'CCBA21201020000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "country" */ './country.vue'),
        title: '国别（地区）'
      }
    },
    {
      path: '/passParams/money/list',
      name: 'money',
      permissions: 'CCBA21201030000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "money" */ './money.vue'),
        title: '币制'
      }
    },
    {
      path: '/passParams/unit/list',
      name: 'unit',
      permissions: 'CCBA21201040000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "unit" */ './unit.vue'),
        title: '计量单位'
      }
    },
    {
      path: '/passParams/controlMode/list',
      name: 'controlMode',
      permissions: 'CCBA21201050000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "control-mode" */ './controlMode.vue'),
        title: '监管方式'
      }
    },
    {
      path: '/passParams/transport/list',
      name: 'transport',
      permissions: 'CCBA21201060000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "transport" */ './transport.vue'),
        title: '运输方式'
      }
    },
    {
      path: '/passParams/redemp/list',
      name: 'redemp',
      permissions: 'CCBA21201070000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "redemp" */ './redemp.vue'),
        title: '征免性质'
      }
    },
    {
      path: '/passParams/port/list',
      name: 'port',
      permissions: 'CCBA21201080000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "port" */ './port.vue'),
        title: '港口'
      }
    },
    {
      path: '/passParams/pakageKinds/list',
      name: 'pakageKinds',
      permissions: 'CCBA21201090000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "pakage-kinds" */ './pakageKinds.vue'),
        title: '包装种类'
      }
    },
    {
      path: '/passParams/bargain/list',
      name: 'bargain',
      permissions: 'CCBA21201100000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "bargain" */ './bargain.vue'),
        title: '成交方式'
      }
    },
    {
      path: '/passParams/regulate/list',
      name: 'regulate',
      permissions: 'CCBA21201110000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "regulate" */ './regulate.vue'),
        title: '监管证件'
      }
    },
    {
      path: '/passParams/licensePass/list',
      name: 'licensePass',
      permissions: 'CCBA21201120000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "license" */ './license.vue'),
        title: '随附单据'
      }
    },
    {
      path: '/passParams/tradePro/list',
      name: 'tradePro',
      permissions: 'CCBA21201130000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "trade-pro" */ './tradePro.vue'),
        title: '优惠贸易协定'
      }
    },
    {
      path: '/passParams/inLandArea/list',
      name: 'inLandArea',
      permissions: 'CCBA21201140000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "in-land-area" */ './inLandArea.vue'),
        title: '国内地区'
      }
    },
    {
      path: '/passParams/taxFree/list',
      name: 'taxFree',
      permissions: 'CCBA21201150000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "tax-free" */ './taxFree.vue'),
        title: '征减免税方式'
      }
    },
    {
      path: '/passParams/inLandPort/list',
      name: 'inLandPort',
      permissions: 'CCBA21201160000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "in-land-port" */ './inLandPort.vue'),
        title: '国内口岸'
      }
    }
  ]
}
export default {MENU}
