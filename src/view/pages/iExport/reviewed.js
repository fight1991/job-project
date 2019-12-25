// 报关单审核
import abstractComponent from '@/view/common/abstract.vue'
const decCheckListComponent = () => import(/* webpackChunkName: "dec-check-list" */ './declaration/decCheck.vue')
const decCheckComponent = () => import(/* webpackChunkName: "dec-check" */ './declaration/declareCheck/declareCheck.vue')

const MENU = {
  path: '/iExport/reviewed',
  name: 'reviewed',
  icon: 'icons-menu-dec-check',
  permissions: 'CCBA20204000000',
  component: abstractComponent,
  meta: {
    title: '审单'
  },
  children: [
    {
      path: '/iExport/reviewed/decReviewedList',
      name: 'decReviewedList',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204010000',
      hidden: false,
      meta: {
        component: decCheckListComponent,
        title: '报关单审核'
      }
    },
    {
      path: '/iExport/reviewed/decReviewed/edit/:pid',
      name: 'decReviewedEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204010000',
      hidden: true,
      meta: {
        component: decCheckComponent,
        title: '报关单可视化审核编辑',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/reviewed/decReviewed/look/:pid',
      name: 'decReviewedLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204010000',
      hidden: true,
      meta: {
        component: decCheckComponent,
        title: '报关单可视化审核预览',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/reviewed/summaryDecReviewed/edit/:pid',
      name: 'summaryDecReviewedEdit',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204010000',
      hidden: true,
      meta: {
        component: decCheckComponent,
        title: '概要申报可视化审核编辑',
        operationType: 'edit'
      }
    },
    {
      path: '/iExport/reviewed/summaryDecReviewed/look/:pid',
      name: 'summaryDecReviewedLook',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204010000',
      hidden: true,
      meta: {
        component: decCheckComponent,
        title: '概要申报可视化审核预览',
        operationType: 'look'
      }
    },
    {
      path: '/iExport/reviewed/taxReviewed',
      name: 'taxReviewed',
      icon: 'icons-menu-price',
      permissions: 'CCBA20204020000',
      hidden: false,
      meta: {
        component: resolve => require(['./blankPage.vue'], resolve),
        title: '核注清单审核'
      }
    }
  ]
}
export default {MENU}
