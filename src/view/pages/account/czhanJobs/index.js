// 加工贸易账册-外发加工
import abstractComponent from '@/view/common/abstract.vue'
import accountCzhanJobsIndexComponent from './index.vue'

const MENU = {
  path: '/account/czhanJobs',
  name: 'account-czhanJobs',
  icon: 'icons-menu-czhanJobs',
  permissions: 'CCBA20704000000',
  component: abstractComponent,
  meta: {
    title: '外发加工'
  },
  children: [
    {
      path: '/handBook/declareFormAcc/list',
      name: 'declareFormAcc',
      permissions: 'CCBA20704010000',
      hidden: false,
      meta: {
        component: accountCzhanJobsIndexComponent,
        title: '外发加工申报表'
      }
    },
    {
      path: '/handBook/deliveryAcc/list',
      name: 'deliveryAcc',
      permissions: 'CCBA20704020000',
      hidden: false,
      meta: {
        component: accountCzhanJobsIndexComponent,
        title: '外发加工发货单'
      }
    },
    {
      path: '/handBook/recipientAcc/list',
      name: 'recipientAcc',
      permissions: 'CCBA20704030000',
      hidden: false,
      meta: {
        component: accountCzhanJobsIndexComponent,
        title: '外发加工收货单'
      }
    },
    {
      path: '/handBook/declareFormAccQuery/list',
      name: 'declareFormAccQuery',
      permissions: 'CCBA20704040000',
      hidden: false,
      meta: {
        component: accountCzhanJobsIndexComponent,
        title: '外发加工申报表查询'
      }
    },
    {
      path: '/handBook/recipientAccQuery/list',
      name: 'recipientAccQuery',
      permissions: 'CCBA20704050000',
      hidden: false,
      meta: {
        component: accountCzhanJobsIndexComponent,
        title: '外发加工收发货单查询'
      }
    }
  ]
}
export default {MENU}
