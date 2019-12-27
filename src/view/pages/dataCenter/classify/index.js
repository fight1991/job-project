// 归类管理
import abstractComponent from '@/view/common/abstract.vue'

const MENU = {
  path: '/dataCenter/classify',
  name: 'classify',
  icon: 'icons-menu-classify',
  permissions: 'CCBA20306000000',
  component: abstractComponent,
  meta: {
    title: '归类管理'
  },
  children: [
    {
      path: '/dataCenter/classify/precedentClassify',
      name: 'precedentClassify',
      permissions: 'CCBA20306010000',
      hidden: false,
      meta: {
        component: () => import(/* webpackChunkName: "precedent-classify" */ './precedentClassify.vue'),
        title: '智能归类'
      }
    }
  ]
}
export default {MENU}
