// 加工贸易账册-核销核算
import abstractComponent from '@/view/common/abstract.vue'
import accountBaoheJobsIndexComponent from './index.vue'

const MENU = {
  path: '/account/baoheJobs',
  name: 'account-baoheJobs',
  icon: 'icons-menu-baoheJobs',
  permissions: 'CCBA20703000000',
  component: abstractComponent,
  meta: {
    title: '核销核算'
  },
  children: [
    {
      path: '/handBook/accountBookVerAcc/list',
      name: 'accountBookVerAcc',
      permissions: 'CCBA20703010000',
      hidden: false,
      meta: {
        component: accountBaoheJobsIndexComponent,
        title: '加工贸易账册报核'
      }
    },
    {
      path: '/handBook/accountBookVerAccQuery/list',
      name: 'accountBookVerAccQuery',
      permissions: 'CCBA20703020000',
      hidden: false,
      meta: {
        component: accountBaoheJobsIndexComponent,
        title: '加工贸易账册报核查询'
      }
    }
  ]
}
export default {MENU}
