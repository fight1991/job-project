const MENU = [
  {
    path: '/finance/fundsApproval/list',
    name: 'fundsApproval-list',
    icon: 'icons-finance-fundApproval',
    permissions: 'CCBA21608000000',
    hidden: false,
    meta: {
      component: resolve => require(['./approvalList.vue'], resolve),
      title: '请款审批'
    }
  }
]
export default {MENU}
