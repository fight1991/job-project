// 加工贸易账册-核销核算
import abstractComponent from '@/view/common/abstract.vue'
import seaBaoheJobsIndexComponent from './index.vue'

const MENU = {
  path: '/sea/baoheJobs',
  name: 'sea-baoheJobs',
  icon: 'icons-menu-baoheJobs',
  permissions: 'CCBA20903000000',
  component: abstractComponent,
  meta: {
    title: '核销核算'
  },
  children: [
    {
      path: '/sea/accountBookVer_sea/list',
      name: 'accountBookVer_sea',
      permissions: 'CCBA20903010000',
      hidden: false,
      meta: {
        component: seaBaoheJobsIndexComponent,
        title: '加工贸易账册报核'
      }
    },
    {
      path: '/sea/accountBookVerQuery_sea/list',
      name: 'accountBookVerQuery_sea',
      permissions: 'CCBA20903020000',
      hidden: false,
      meta: {
        component: seaBaoheJobsIndexComponent,
        title: '加工贸易账册报核查询'
      }
    },
    {
      path: '/sea/phDataList_sea/list',
      name: 'phDataList_sea',
      permissions: 'CCBA20903030000',
      hidden: false,
      meta: {
        component: seaBaoheJobsIndexComponent,
        title: '物流账册平衡表'
      }
    }
  ]
}
export default {MENU}
