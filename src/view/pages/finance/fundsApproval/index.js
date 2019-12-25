const MENU = [
  {
    path: '/finance/fundsApproval/list',
    name: 'fundsApproval-list',
    icon: 'icons-menu-fundApproval',
    permissions: 'CCBA21608000000',
    hidden: false,
    meta: {
      component: () => import(/* webpackChunkName: "approval-list" */ './approvalList.vue'),
      title: '请款审批'
    }
  }
]
export default {MENU}
