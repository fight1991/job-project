// 保税获取流转-申报表
import abstractComponent from '@/view/common/abstract.vue'
import circulationDecFormIndexComponent from './index.vue'

const MENU = {
  path: '/circulation/decForm',
  name: 'circulation-decForm',
  icon: 'icons-menu-decForm',
  permissions: 'CCBA21101000000',
  component: abstractComponent,
  meta: {
    title: '申报表'
  },
  children: [
    {
      path: '/circulation/decForm/I/list',
      name: 'outedcform',
      permissions: 'CCBA21101010000',
      hidden: false,
      meta: {
        component: circulationDecFormIndexComponent,
        title: '转出申报'
      }
    },
    {
      path: '/circulation/decForm/E/list',
      name: 'incform',
      permissions: 'CCBA21101020000',
      hidden: false,
      meta: {
        component: circulationDecFormIndexComponent,
        title: '转入申报'
      }
    },
    {
      path: '/circulation/decForm/decFormQuery/list',
      name: 'decFormQuery',
      permissions: 'CCBA21101030000',
      hidden: false,
      meta: {
        component: circulationDecFormIndexComponent,
        title: '申报表查询'
      }
    }
  ]
}

export default {MENU}
