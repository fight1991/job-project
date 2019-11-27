/**
  * axios封装
  * 请求拦截、响应拦截、错误统一处理
  */
import axios from 'axios'
import router from '../router'
import store from '../store/store'
import Vue from 'vue'
import commonParam from './commonParam'
import util from './util'
import config from '../config/config'

const baseHost = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']
let messageInstance
/**
  * 提示函数
  * 禁止点击蒙层、显示一秒后关闭
  */
const tip = msg => {
  if (messageInstance) return
  messageInstance = Vue.prototype.$message({
    message: msg,
    type: 'error',
    onClose: () => {
      messageInstance = null
    }
  })
}

// 创建axios实例
axios.defaults.timeout = 600000 // 请求的超时时间
axios.defaults.withCredentials = true

/**
  * 请求失败后的错误统一处理
  * @param {Number} status 请求失败的状态码
  */
const errorHandle = (err, error, isLoad) => {
  if (isLoad) {
    store.state.loading = false
  }
  util.errorReport('', '', '', store, err)
  if (error) {
    error(err)
  } else {
    switch (err.status) {
      case 401:
        window.sessionStorage.clear()
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
}

const resultHandle = ({result, useStorage = false, success, other, isPageList = false}) => {
  let _result = result.data
  if (_result.code === '0000') {
    if (isPageList) {
      store.state.pagination.total = _result.page.total
    }
    if (useStorage) {
      commonParam.saveParams(_result.result)
    }
    success && success(_result)
  } else {
    if (_result.code === '0001') {
      // 业务报错
      if (other) {
        other(_result)
      } else {
        tip(_result.message)
      }
    } else if (_result.code === '0002') {
      // token 失效
      tip('登录信息失效，请重新登录！')
      router.push('/login')
    } else if (_result.code === '0004') {
      // 权限不足
      tip('您的权限不足，请联系管理员！')
    } else {
      // 系统报错
      tip(_result.message)
    }
  }
}

const getParamVersion = (reslove) => {
  let data = {
    condition: 'PARAMVERSION'
  }
  return postBefore({
    url: 'API@/plat-manager/config/getWebClientConfigList',
    data: data,
    isPageList: true,
    isLoad: false,
    success: (res) => {
      let version = ''
      if (!util.isEmpty(res.result)) {
        if (res.result.length !== 0) {
          version = res.result[0].configValue
          store.commit('versionInit', version)
        }
      }
    }
  })
}

const useStorageHandle = ({url, data, success, other, error, isPageList = false, isLoad = true, storageKey, useStorage, replaceDataKey, hasStorageCallback}) => {
  let storageValue = commonParam.isRequire(storageKey)
  if (storageValue.length > 0) {
    data[replaceDataKey] = storageValue
    return true
  } else {
    if (hasStorageCallback) {
      hasStorageCallback()
    }
  }
  return false
}

const handlePostHeaderInfo = (url) => {
  let urlArr = url.split('@')
  let baseURL = baseHost[urlArr[0]]
  axios.defaults.baseURL = baseURL
  axios.defaults.headers.common = {
    'ssoToken': window.localStorage.getItem('token'),
    'X-Requested-With': 'XMLHttpReques'
  }
}

const handleUploadHeaderInfo = (url) => {
  let urlArr = url.split('@')
  let baseURL = baseHost[urlArr[0]]
  axios.defaults.baseURL = baseURL
  axios.defaults.headers.common = {
    'ssoToken': window.localStorage.getItem('token'),
    'X-Requested-With': 'XMLHttpReques',
    'Content-Type': 'multipart/form-data',
    'appWebFlag': '1',
    'sysId': store.state.sysId
  }
}

async function postBefore ({type = '', url, data, success, other, error, isPageList = false, isLoad = true, useStorage = false, progressCallback}) {
  let urlArr = url.split('@')
  if (type === 'upload') {
    handleUploadHeaderInfo(url)
  } else {
    handlePostHeaderInfo(url)
  }
  if (isLoad) {
    store.state.loading = true
  }
  try {
    let result = await postHandle({
      type: type, // 请求类型 upload为上传类型，不传或其他为普通post
      url: urlArr[1], // 请求的接口地址
      data: data, // 入参
      isPageList: isPageList, // 是否是分页list
      progressCallback: progressCallback
    })
    if (isLoad) {
      store.state.loading = false
    }
    resultHandle({isLoad, result, useStorage, success, other, isPageList})
  } catch (err) {
    errorHandle(err, error, isLoad)
  }
}

function postHandle ({type, url, data, isPageList, progressCallback}) {
  // 修改 动态设置 appWebFlag
  let webFlag = '1'
  if (!util.isEmpty(window.sessionStorage.getItem('appWebFlag'))) {
    webFlag = window.sessionStorage.getItem('appWebFlag')
  }
  let params = {
    'appWebFlag': webFlag, // 请求终端类型。1：PC端，其他设备待定
    'sysId': store.state.sysId,
    'reqData': data
  }
  if (type === 'upload') {
    params = data
  }
  if (isPageList && util.isEmpty(params.reqData.selfPage)) {
    // 分页时增加分页数据
    params.reqData.page = {
      pageSize: store.state.pagination.pageSize,
      pageIndex: store.state.pagination.currentPage
    }
  } else if (isPageList && !util.isEmpty(params.reqData.selfPage)) {
    params.reqData.page = {
      pageSize: data.selfPage.pageSize,
      pageIndex: data.selfPage.pageIndex
    }
  }
  if (type === 'upload') {
    return axios.post(url, params, {
      onUploadProgress: function (progressEvent) {
        // console.log('progressEvent', util.Div(progressEvent.loaded, progressEvent.total, 2))
        if (progressEvent.lengthComputable && progressCallback) {
          progressCallback(util.Div(progressEvent.loaded, progressEvent.total, 2))
        }
      }})
  } else {
    return axios.post(url, params)
  }
  // return axios.post(url, params)
}

async function post ({url, data, success, other, error, isPageList = false, isLoad = true, useStorage = false, storageKey, replaceDataKey = 'tableNames', hasStorageCallback}) {
  if (useStorage) {
    if (!store.state.paramVersion) {
      await getParamVersion()
    }
    if (useStorageHandle({url, data, success, other, error, isPageList, isLoad, storageKey, useStorage, replaceDataKey, hasStorageCallback})) {
      postBefore({url, data, success, other, error, isPageList, isLoad, useStorage})
    }
  } else {
    postBefore({url, data, success, other, error, isPageList, isLoad})
  }
}

async function upload ({url, data, success, other, error, isLoad = true, progressCallback}) {
  postBefore({type: 'upload', url, data, success, other, error, isLoad, progressCallback})
}

function getPromisePost ({url, data, successCallback, businessErrorCallback, errorCallback, isPageList = false, isLoad = true, useStorage = false}) {
  let urlArr = url.split('@')
  handlePostHeaderInfo(url)
  return postHandle({
    type: '', // 请求类型 upload为上传类型，不传或其他为普通post
    url: urlArr[1], // 请求的接口地址
    data: data, // 入参
    successCallback: successCallback, // 成功回调
    businessErrorCallback: businessErrorCallback, // 非系统错误的错误回调
    errorCallback: errorCallback, // 系统错误回调方法
    isPageList: isPageList, // 是否是分页list
    isLoad: isLoad, // 是否显示loading
    router: router, // 操作路由
    useStorage: useStorage
  })
}

async function all (requests) {
  let useStorageRequest = requests.filter((request) => request.useStorage === true)
  if (useStorageRequest && useStorageRequest.length !== 0) {
    if (!store.state.paramVersion) {
      await getParamVersion()
    }
  }
  let promiseRequest = []
  requests.forEach(request => {
    if (request.useStorage) {
      if (useStorageHandle(request)) {
        promiseRequest.push(request)
      }
    } else {
      promiseRequest.push(request)
    }
  })
  if (promiseRequest.length !== 0) {
    store.state.loading = true
    try {
      let results = await axios.all(promiseRequest.map(request => getPromisePost(request)))
      store.state.loading = false
      results.forEach((result, index) => {
        let currentRequest = promiseRequest[index]
        currentRequest.result = result
        resultHandle({
          result: result,
          useStorage: currentRequest.useStorage,
          success: currentRequest.success,
          other: currentRequest.other
        })
      })
    } catch (error) {
      errorHandle(error, null, true)
    }
  }
}

function gerBinaryFile ({url, successCallBack}) {
  axios({
    method: 'get',
    url: url,
    responseType: 'arraybuffer'
  }).then((res) => {
    successCallBack && successCallBack(res)
  })
}

// 将post挂载到vue的原型上
Vue.prototype.$post = post
Vue.prototype.$upload = upload
Vue.prototype.$all = all
Vue.prototype.$getBinaryFile = gerBinaryFile
