export default {
  // 开发
  dev: {
    // 开发
    SYSID: 'CCBA', // 系统id
    HOST: 'https://test.5itrade.cn/ccba2',
    COMMON: 'https://test.5itrade.cn/common', // 公共登录、注册等跳转地址
    FILE: 'https://test.5itrade.cn/zuul', // 文件上传
    API: 'https://test.5itrade.cn', // api接口服务器地址
    WWW: 'https://www.51baoguan.cn:8091/login/index?flag=1', // 旧版官网切换地址
    FINCE: 'https://test.5itrade.cn/ccba2', // 跳转至物流费用系统
    EMS: 'https://test.5itrade.cn/ems' // 跳转至金二
    // COMMON: 'http://172.21.206.31:8072', // 公共登录、注册等跳转地址
    // FILE: 'http://172.21.206.31:8072/zuul', // 文件上传
    // API: 'http://172.21.206.31:9999', // api接口服务器地址
    // WWW: 'https://www.51baoguan.cn:8091/login/index?flag=1' // 旧版官网切换地址
  },
  // 测试、准生产、生产
  prod: {
    SYSID: 'CCBA', // 系统id
    COMMON: 'http://172.21.206.31:8072', // 公共登录、注册等跳转地址
    FILE: 'http://172.21.206.31:8086', // 文件上传
    API: 'http://172.21.206.31:9999', // api接口服务器地址
    WWW: 'https://www.51baoguan.cn', // 旧版官网切换地址
    FINCE: 'https://www.5itrade.cn/ccba2', // 跳转至物流费用系统
    EMS: 'https://test.5itrade.cn/ems' // 跳转至金二
  }
}
