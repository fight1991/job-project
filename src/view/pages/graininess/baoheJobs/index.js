// 加工贸易账册-核销核算
import abstractComponent from '@/view/common/abstract.vue'
import graininesscBaoheJobsIndexComponent from './index.vue'

const MENU = {
  path: '/graininess/baoheJobs',
  name: 'graininess-baoheJobs',
  icon: 'icons-menu-baoheJobs',
  permissions: 'CCBA21003000000',
  component: resolve => abstractComponent,
  meta: {
    title: '核销核算'
  },
  children: [
    {
      path: '/sea/phDataList_gra/list',
      name: 'phDataList_gra',
      permissions: 'CCBA21003010000',
      hidden: false,
      meta: {
        component: graininesscBaoheJobsIndexComponent,
        title: '物流账册平衡表'
      }
    }
  ]
}
export default {MENU}
