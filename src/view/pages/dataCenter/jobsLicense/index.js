// 业务单据管理
const MENU = [
  {
    path: '/dataCenter/jobsLicense',
    name: 'jobsLicense',
    icon: 'icons-menu-jobsLicense',
    permissions: 'CCBA20303000000',
    meta: {
      title: '业务单据管理',
      component: () => import(/* webpackChunkName: "job-license-list" */ './index.vue')
    }
  },
  {
    path: '/dataCenter/jobsLicense/jobDetailList',
    name: 'jobDetailList',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "job-license-detail" */ './jobDetailList.vue'),
      title: '业务单据详情列表'
    }
  },
  {
    path: '/dataCenter/jobsLicense/detailJobs',
    name: 'detailJobs',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "job-license-detail" */ './detailJobs.vue'),
      title: '业务单据详情'
    }
  },

  {
    path: '/dataCenter/jobsLicense/editJobs',
    name: 'editJobs',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "job-license-edit" */ './editJobs.vue'),
      title: '编辑业务单据'
    }
  },
  {
    path: '/dataCenter/jobsLicense/importLicense',
    name: 'importLicense',
    hidden: true,
    meta: {
      component: () => import(/* webpackChunkName: "import-job-license" */ './importLicense.vue'),
      title: '导入业务单据'
    }
  }
]
export default {MENU}
