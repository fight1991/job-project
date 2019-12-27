// 保税货物流转-同步申报表
import abstractComponent from '@/view/common/abstract.vue'
import circulationSynDecFormIndexComponent from './index.vue'

const MENU = {
  path: '/circulation/synDecForm',
  name: 'circulation-synDecForm',
  icon: 'icons-menu-synDecForm',
  permissions: 'CCBA21104000000',
  component: abstractComponent,
  meta: {
    title: '同步申报表'
  },
  children: [
    {
      path: '/circulation/synDecForm/list',
      name: 'synDecForm',
      permissions: 'CCBA21104010000',
      hidden: false,
      meta: {
        component: circulationSynDecFormIndexComponent,
        title: '同步申报表'
      }
    }
  ]
}
export default {MENU}
