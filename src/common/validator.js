const enNum = /^[a-zA-Z0-9]+$/
const Zz0 = /^([1-9]\d*|[0]{1,1})$/
const float2 = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
const numLine = /^[\d/]+$/
const numComma = /^[\d,]+$/
const mobile = /^(1)(3|4|5|6|7|8|9)\d{9}$/
const email = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
const discount = /(^(0)(\.([0-9][1-9]|[1-9]\d|[1-9])$))|(^([1-9]|[1-9]\d)(\.\d{1,2}|\.{0})$)|(^(100)(\.[0]{1,2}|\.{0})$)/
const num0F2 = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/
const num1F2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
const numFu = /(^(([1-9]+\d*)|(0{1}))(\.\d{1,2})?$)|(^-([1-9]+\d*(\.\d{1,2})?|0\.(0[1-9]{1}|[1-9]{1}\d?))$)/
const numCode = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

export default {
  // 手机号码判断
  mobile: function (rule, value, callback) {
    if (!mobile.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 身份证号
  numCode: function (rule, value, callback) {
    if (!value) {
      callback()
    } else if (!numCode.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 验证邮箱
  email: function (rule, value, callback) {
    if (!email.test(value)) {
      callback(new Error())
    } else {
      callback()
    }
  },
  // 英文+数字判断
  enNum: function (rule, value, callback) {
    if (!enNum.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 正整数（包含0）判断
  Zz0: function (rule, value, callback) {
    if (!Zz0.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 正浮点数（包含0）最多两位小数判断
  float2: function (rule, value, callback) {
    if (!float2.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 数字和/
  numLine: function (rule, value, callback) {
    if (!numLine.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 数字和,
  numComma: function (rule, value, callback) {
    if (!numComma.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 折扣0-100 两位小数
  discount: function (rule, value, callback) {
    if (!discount.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 大于等于0 两位小数
  num0F2: function (rule, value, callback) {
    if (!num0F2.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 大于0 两位小数
  num1F2: function (rule, value, callback) {
    if (!num1F2.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 数字（可负数） 两位小数
  numFu: function (rule, value, callback) {
    if (!numFu.test(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  }
}
