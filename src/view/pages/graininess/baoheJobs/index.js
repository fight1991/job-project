// 加工贸易账册-核销核算
const MENU = {
  path: '/graininess/baoheJobs',
  name: 'graininess-baoheJobs',
  icon: 'icons-menu-baoheJobs',
  permissions: 'CCBA21003000000',
  component: resolve => require(['../../../common/abstract.vue'], resolve),
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
        component: resolve => require(['./index.vue'], resolve),
        title: '物流账册平衡表'
      }
    }
  ]
}
export default {MENU}
