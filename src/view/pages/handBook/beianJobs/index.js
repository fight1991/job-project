// 加工贸易手册-电子底账
import abstractComponent from '@/view/common/abstract.vue'
import handBookBeianJobsIndexComponent from './index.vue'

const MENU = {
  path: '/handBook/beianJobs',
  name: 'handBook-beianJobs',
  icon: 'icons-menu-beianJobs',
  permissions: 'CCBA20801000000',
  component: abstractComponent,
  meta: {
    title: '电子底账'
  },
  children: [
    {
      path: '/handBook/handAdd/list',
      name: 'handAdd',
      permissions: 'CCBA20801010000',
      hidden: false,
      meta: {
        component: handBookBeianJobsIndexComponent,
        title: '加工贸易手册'
      }
    },
    {
      path: '/handBook/exaluate/list',
      name: 'exaluate',
      permissions: 'CCBA20801020000',
      hidden: false,
      meta: {
        component: handBookBeianJobsIndexComponent,
        title: '不作价设备使用情况'
      }
    },
    {
      path: '/handBook/handQuery/list',
      name: 'handQuery',
      permissions: 'CCBA20801030000',
      hidden: false,
      meta: {
        component: handBookBeianJobsIndexComponent,
        title: '加工贸易手册查询'
      }
    },
    {
      path: '/handBook/evaluateQuery/list',
      name: 'evaluateQuery',
      permissions: 'CCBA20801040000',
      hidden: false,
      meta: {
        component: handBookBeianJobsIndexComponent,
        title: '不作价设备使用情况查询'
      }
    },
    {
      path: '/handBook/relieveQuery/list',
      name: 'relieveQuery',
      permissions: 'CCBA20801050000',
      hidden: false,
      meta: {
        component: handBookBeianJobsIndexComponent,
        title: '不作价设备解除监管查询'
      }
    }
  ]
}
export default {MENU}
