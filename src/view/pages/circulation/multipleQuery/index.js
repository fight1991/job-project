// 保税获取流转-综合查询
import abstractComponent from '@/view/common/abstract.vue'
import circulationQueryListIndexComponent from './multipleQuery.vue'

const MENU = {
  path: '/circulation/queryList',
  name: 'circulation-queryList',
  icon: 'icons-menu-queryList',
  permissions: 'CCBA21103000000',
  component: abstractComponent,
  meta: {
    title: '综合查询'
  },
  children: [
    {
      path: '/circulation/multipleQuery/list',
      name: 'multipleQuery',
      permissions: 'CCBA21103010000',
      hidden: false,
      meta: {
        component: circulationQueryListIndexComponent,
        title: '综合查询'
      }
    }
  ]
}
export default {MENU}
