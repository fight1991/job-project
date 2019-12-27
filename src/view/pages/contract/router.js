import indexComponent from '@/view/pages/index.vue'

const MENU = [
  {
    path: '/contract/index',
    name: 'contract-index',
    hidden: false,
    icon: 'el-icon-menu1',
    permissions: 'WF000000',
    component: indexComponent,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/contract/list',
    name: 'contract-list',
    icon: 'icons-menu-contractList',
    permissions: 'CCBA21401000000',
    meta: {
      component: () => import(/* webpackChunkName: "contract-list" */ './contractList.vue'),
      title: '合同列表'
    }
  },
  {
    path: '/contract/addContract/:flag/:pkSeqNo',
    name: 'contract-add',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "contract-add" */ './addContract.vue'),
      title: '新建合同'
    }
  },
  {
    path: '/contract/detailContract/:pkSeqNo',
    name: 'contract-detail',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "contract-detail" */ './detailContract.vue'),
      title: '合同详情'
    }
  },
  {
    path: '/contract/check',
    name: 'contract-check',
    icon: 'icons-menu-contractCheck',
    permissions: 'CCBA21402000000',
    meta: {
      component: () => import(/* webpackChunkName: "contract-check" */ './contractCheck.vue'),
      title: '合同审核'
    }
  }
]
export default {MENU}
