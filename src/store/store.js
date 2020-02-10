import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import util from '@/common/util'
import config from '../config/config'
import TabsStore from '../components/tabs/store'

Vue.use(Vuex)
axios.defaults.timeout = 60000 // 请求的超时时间
axios.defaults.withCredentials = true // 允许携带cookie
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
export default new Vuex.Store({
  modules: {
    TabsStore
  },
  state: {
    // pagination: {
    //   pageIndex: 1, // 当前页
    //   pageSize: 10, // 每页数据条数
    //   total: 0 // 总条数
    // },
    // 分页的数据
    pagination: {
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数据条数
      total: 0, // 总条数
      pageSizes: [10, 20, 50, 100, 200]
    },
    ifDecOpen: false,
    appCount: 0, // 联系人未读数量
    paramVersion: '',
    sysId: config[env]['SYSID'],
    // 登陆后的用户数据信息
    userLoginInfo: {
      userId: '',
      token: '', // token数据
      userName: '', // 用户姓名
      companyType: '', // 公司类型
      isAdmin: '',
      companyCode: '', // 公司id
      mobile: '', // 手机号
      userPhoto: '', // 用户头像
      companyName: '',
      sccCode: '',
      adminFlag: '',
      cusCorpName: '', // 企业海关名
      ciqCode: '', // 企业检验检疫代码
      tradeCode: '' // 企业十位海关代码
    },
    childSys: {
      type: '',
      title: '',
      permissions: ''
    }, // 子级系统
    isFirst: true, // 是否初次进入系统
    loading: false, // loading
    collapse: false, // 菜单折叠
    menuShow: true, // 移动式菜单
    labelWidth: '100px', // form 表单 label 宽度
    tableHeight: '800', // table表格高度
    controlPanelList: [], // 已勾选看板
    sysType: util.checkSys() // 登录平台
  },
  actions: {
    ajax: function ({ commit }, {url, data, headers, success, other, error, isPageList = false, isLoad = true, router, showErrorMessage = true}) {
      let urlArr = url.split('@')
      let baseURL = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'][urlArr[0]]
      axios.defaults.baseURL = baseURL
      axios.defaults.headers.common = {
        'ssoToken': window.localStorage.getItem('token'),
        'X-Requested-With': 'XMLHttpReques'
      }
      for (let key in headers) {
        axios.defaults.headers.common[key] = headers[key]
      }
      commit('POST', {
        url: urlArr[1], // 请求的接口地址
        data: data, // 入参
        headers: headers, // 头参数
        success: success, // 成功回调
        other: other, // 非系统错误的错误回调
        error: error, // 系统错误回调方法
        isPageList: isPageList, // 是否是分页list
        isLoad: isLoad, // 是否显示loading
        router: router, // 操作路由
        showErrorMessage: showErrorMessage
      })
    },
    upload: function ({ commit }, {url, data, success, other, error, isLoad = true, router}) {
      let urlArr = url.split('@')
      let baseURL = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'][urlArr[0]]
      axios.defaults.baseURL = baseURL
      let ssoToken = ''
      if (window.localStorage.getItem('token')) {
        ssoToken = window.localStorage.getItem('token')
      } else {
        ssoToken = ''
      }
      axios.defaults.headers.common = {
        'Content-Type': 'multipart/form-data',
        'ssoToken': ssoToken,
        'appWebFlag': '1',
        'sysId': config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'],
        'X-Requested-With': 'XMLHttpReques'
      }
      commit('UPLOAD', {
        url: urlArr[1], // 请求的接口地址
        data: data, // 入参
        success: success, // 成功回调
        other: other, // 非系统错误的错误回调
        error: error, // 系统错误回调方法
        isLoad: isLoad, // 是否显示loading
        router: router // 操作路由
      })
    }
  },
  mutations: {
    // post的请求
    POST (state, {url, data, success, other, error, showErrorMessage = true, isLoad, router}) {
      let params = {
        'appWebFlag': '1', // 请求终端类型。1：PC端，其他设备待定
        'sysId': config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'],
        'reqData': data
      }
      // if (isPageList) {
      //   // 分页时增加分页数据
      //   params.reqData.page = {
      //     pageSize: state.pagination.pageSize,
      //     pageIndex: state.pagination.pageIndex
      //   }
      // }
      if (isLoad) {
        state.loading = true
      }
      axios.post(url, params).then((result) => {
        if (isLoad) {
          setTimeout(() => {
            state.loading = false
          }, 500)
        }
        let _result = result.data
        if (_result.code === '0000') {
          success(_result)
        } else {
          if (other) {
            other(_result)
          } else if (_result.code === '0001') {
            // 业务报错
            Vue.prototype.$message({
              message: _result.message,
              type: 'error'
            })
          } else if (_result.code === '0002') {
            // token 失效
            Vue.prototype.$message({
              message: '登录信息失效，请重新登录！',
              type: 'error'
            })
            router.push('/login')
          } else {
            // 系统报错
            if (showErrorMessage) {
              Vue.prototype.$message({
                message: _result.message,
                type: 'error'
              })
            }
          }
        }
      }).catch((err) => {
        setTimeout(() => {
          state.loading = false
        }, 500)
        if (error) {
          error(err)
        } else {
          switch (err.status) {
            case 401:
              router.push('/login')
              break
            case 404:
              router.push('/error/404')
              break
            case 500:
              router.push('/error/500')
              break
            default:
              util.errorReport('', '', '', this, err)
              router.push('/error/wait')
          }
        }
      })
    },
    // upload的请求
    UPLOAD (state, {url, data, success, other, error, isLoad, router}) {
      if (isLoad) {
        state.loading = true
      }
      axios.post(url, data).then((result) => {
        if (isLoad) {
          setTimeout(() => {
            state.loading = false
          }, 500)
        }
        let _result = result.data
        if (_result.code === '0000') {
          success(_result)
        } else {
          if (other) {
            other(_result)
          } else if (_result.code === '0001') {
            // 业务报错
            Vue.prototype.$message({
              message: _result.message,
              type: 'error'
            })
          } else if (_result.code === '0002') {
            // token 失效
            Vue.prototype.$message({
              message: '登录信息失效，请重新登录！',
              type: 'error'
            })
            router.push('/login')
          } else {
            // 系统报错
            Vue.prototype.$message({
              message: _result.message,
              type: 'error'
            })
          }
        }
      }).catch((err) => {
        setTimeout(() => {
          state.loading = false
        }, 500)
        if (error) {
          error(err)
        } else {
          switch (err.status) {
            case 401:
              router.push('/login')
              break
            case 404:
              router.push('/error/404')
              break
            case 500:
              router.push('/error/500')
              break
            default:
              router.push('/error/wait')
          }
        }
      })
    },
    // 设置子系统
    setChildSys: function (state, data) {
      state.childSys = data
      TabsStore.mutations.SetChildSysData(TabsStore.state, data.type)
    },
    // 设置token
    setToken: function (state, token) {
      state.userLoginInfo.token = token
    },
    // 用户登录信息变更
    userLoginInfo: function (state, data) {
      state.userLoginInfo.userName = data.userName
      state.userLoginInfo.companyType = data.companyType
      state.userLoginInfo.companyCode = data.companyCode
      state.userLoginInfo.mobile = data.mobile
      state.userLoginInfo.isAdmin = data.isAdmin
      state.userLoginInfo.userPhoto = data.userPhoto
      state.userLoginInfo.companyName = data.companyName
      state.userLoginInfo.adminFlag = data.adminFlag
      state.userLoginInfo.sccCode = data.sccCode
      state.userLoginInfo.userId = data.userId
      state.userLoginInfo.cusCorpName = data.cusCorpName
      state.userLoginInfo.ciqCode = data.ciqCode
      state.userLoginInfo.tradeCode = data.tradeCode
    },
    // 用户切换公司信息变更
    userCompanyInfo: function (state, data) {
      state.userLoginInfo.companyType = data.companyType
      state.userLoginInfo.companyCode = data.companyCode
      state.userLoginInfo.isAdmin = data.isAdmin
      state.userLoginInfo.companyName = data.companyName
      state.userLoginInfo.sccCode = data.sccCode
      state.userLoginInfo.adminFlag = data.adminFlag
      state.userLoginInfo.cusCorpName = data.cusCorpName
      state.userLoginInfo.ciqCode = data.ciqCode
      state.userLoginInfo.tradeCode = data.tradeCode
    },
    // 初次进入系统后 变更状态
    isFirstChange: function (state, value) {
      state.isFirst = false
    },
    // 折叠操作
    collapse: function (state, value) {
      state.collapse = value
    },
    menuShow: function (state, value) {
      state.menuShow = value
    },
    // 获取已勾选看板
    getPanel: function (state, value) {
      state.controlPanelList = value
    },
    // 获取版本号
    versionInit: function (state, value) {
      state.paramVersion = value
    }
  }
})
