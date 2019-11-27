import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import MockData from './data'

const SuccessCode = 200
const SetResTime = 300
const SuccessRes = { 'code': '0000' }

export default {
  bootstrap: () => {
    let mock = new MockAdapter(axios)
    // token校验
    mock.onPost('login/login/getLoginUserInfo').reply(req => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([SuccessCode, MockData.Data.token()])
        }, SetResTime)
      })
    })
    // 上传文件
    mock.onPost('saas-upload/upload/uploadFile').reply(req => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([SuccessCode, MockData.Data.upload()])
        }, SetResTime)
      })
    })
    // 任意地址 mock
    mock.onAny().reply(req => {
      let method = req.method
      // 处理删除事件
      if (method === 'delete') {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([SuccessCode, SuccessRes])
          }, SetResTime)
        })
      }
    })
  }
}
