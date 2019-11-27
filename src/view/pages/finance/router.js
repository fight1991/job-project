import offer from './offerManage/index'
import expense from './expense/index'
import cost from './costManage/index'
import account from './accountManage/index'
import bill from './billManage/index'
import flat from './flatManage/index'
import approval from './fundsApproval/index'
import summary from './summary/index'
const MENU = [
  {
    path: '/finance/index',
    name: 'sea-index',
    hidden: false,
    permissions: 'WF000000',
    component: resolve => require(['./index.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  ...cost.MENU,
  ...offer.MENU,
  ...expense.MENU,
  ...account.MENU,
  ...bill.MENU,
  ...flat.MENU,
  ...approval.MENU,
  ...summary.MENU
]
export default {MENU}
