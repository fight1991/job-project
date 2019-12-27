import config from '@/config/config'
export default {
  // 是否为空：true为空-false不为空
  isEmpty: function (obj) {
    if (obj === null || obj === undefined || obj === '') {
      return true
    }
    return false
  },
  // 检测系统的平台
  checkSys: function () {
    let ua = navigator.userAgent.toLowerCase()
    let sys = 'pc'
    if (ua.indexOf('micromessenger') !== -1) {
      sys = 'wx'
    } else if (ua.indexOf('android') > -1 || ua.indexOf('Linux') > -1) {
      sys = 'android'
    } else if (ua.indexOf('iphone') > -1) {
      sys = 'ios'
    } else if (ua.indexOf('windows phone') > -1) {
      sys = 'winphone'
    }
    return sys
  },
  /** 日期格式化
   * value:值；format：yyyy-MM-dd hh:mm:ss
  */
  dateFormat: function (value, format = 'yyyy-MM-dd hh:mm:ss') {
    if (!this.isEmpty(value)) {
      let time
      if (!value) return ''
      if (typeof value === 'string') {
        value = value.split('.')[0]
        time = new Date(value.replace(/-/g, '/').replace(/T|Z/g, ' ').trim())
      } else if (typeof value === 'object') {
        time = new Date(value)
      }
      let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        'S': time.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (let k in o) { if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    } else {
      format = ''
    }
    return format
  },
  // 金额格式化：带千分符+两位小数
  formatMoney: (value, decimals = 2, dec = '.', sep = ',') => {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * */
    value = (value + '').replace(/[^0-9+-Ee.]/g, '')
    let n = !isFinite(+value) ? 0 : +value
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let s = ''
    let toFixedFix = function (n, prec) {
      let k = Math.pow(10, prec)
      return '' + Math.round(n * k) / k
    }

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    var re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      if ((s[1] || '').length < 2) {
        s[1] += new Array(2 - s[1].length + 1).join('0')
      }
    }
    return s.join(dec)
  },
  // 对象深拷贝
  simpleClone: function (data) {
    var obj = {}
    obj = JSON.parse(JSON.stringify(data))
    return obj
  },
  // 字符串截取+省略号
  getStrByNum: function (value, num) {
    let str = ''
    if (value !== null && value !== '' && value !== undefined) {
      str = value.length < num ? value : value.substring(0, num - 1) + '···'
    }
    return str
  },
  // 删除数组某个值
  removeByValue: function (obj, val) {
    for (var i = 0; i < obj.length; i++) {
      if (obj[i] === val) {
        obj.splice(i, 1)
        break
      }
    }
  },
  // 预览文件
  fileView: function (url) {
    let width = 800
    let height = 500
    let top = (window.screen.availHeight - height) / 2
    let left = (window.screen.availWidth - width) / 2
    window.open(url, '文件查看', 'height=' + height + ', width=' + width + ', top=' + top + ', left=' + left + ',toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no')
  },
  // 获取N天后的日期
  getNdayDate: function (startDay, days) {
    var d = startDay
    var year = d.getFullYear()
    var mon = d.getMonth() + 1
    var day = d.getDate()
    if (day <= days) {
      if (mon > 1) {
        mon = mon - 1
      } else {
        year = year - 1
        mon = 12
      }
    }
    d.setDate(d.getDate() + days)
    year = d.getFullYear()
    mon = d.getMonth() + 1
    day = d.getDate()
    return year + '/' + (mon < 10 ? ('0' + mon) : mon) + '/' + (day < 10 ? ('0' + day) : day)
  },
  /**
 * 获取去除token的地址
 */
  delTokenUrl: function () {
    let url = window.location.href
    let callbackUrl = url.split('?')[0]
    if (url.indexOf('?') !== -1) {
      let obj = this.GetRequest()
      if (Object.keys(obj).length > 0) {
        callbackUrl += '?'
        let x = 1
        for (let item in obj) {
          if (item !== 'token') {
            if (x === 1) {
              callbackUrl += item + '=' + obj[item]
            } else {
              callbackUrl += ':::' + item + '=' + obj[item]
            }
            x++
          }
        }
      }
    }
    return callbackUrl
  },
  /**
 * 截取ip地址后面的参数的对象
 */
  GetRequest () {
    let url = location.search // 获取url中"?"符后的字串
    let theRequest = {}
    if (url.indexOf('?') !== -1) {
      let str = url.substr(1)
      let strs = str.split('&')
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
    }
    return theRequest
  },
  /**
   * @description 通过文件名的后缀得出 文件类型
   * @param {String} fileName 文件名 带文件后缀 如 111.pdf  222.xls 333.jpeg
   * @return {String} 返回 文件类型  或者空
   */
  getFileTypeByName: function (fileName) {
    let computFileType = ''
    let type = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
    switch (type) {
      case 'xls':
        computFileType = 'application/vnd.ms-excel'
        break
      case 'xlsx':
        computFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
      case 'doc':
        computFileType = 'application/msword'
        break
      case 'docx':
        computFileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      case 'jpg':
        computFileType = 'image/jpeg'
        break
      case 'jpeg':
        computFileType = 'image/jpeg'
        break
      case 'png':
        computFileType = 'image/png'
        break
      case 'gif':
        computFileType = 'image/gif'
        break
      case 'tif':
        computFileType = 'image/tif'
        break
      case 'bmp':
        computFileType = 'image/bmp'
        break
      case 'pdf':
        computFileType = 'application/pdf'
        break
      case 'zip':
        computFileType = 'application/x-zip-compressed'
        break
      default :
        computFileType = ''
    }
    return computFileType
  },
  // 复制相同字段
  copyObj (obj1, obj2) {
    if (obj1 && obj2) {
      for (let b in obj2) {
        obj1[b] = obj2[b]
      }
    }
  },
  // 判断是否是空对象
  objIsEmpty (obj) {
    let flag = false
    for (let k in obj) {
      if (!k) {
        flag = true
      }
      break
    }
    return flag
  },
  clearLoginStorage () {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('ccbaMenuCodes')
  },
  errorReport (err, vm, info, store, syncError) {
    if (process.env.NODE_ENV !== 'production') {
      if (syncError) {
        console.error(syncError.stack)
      } else {
        console.error(err.stack)
      }
      return
    }
    if (syncError) { // 捕获异步错误
      let { message, stack } = syncError
      let params = {
        logType: 'client',
        logTime: this.dateFormat(new Date()),
        moduleName: '',
        location: location.host + location.pathname, // 去除参数的地址
        url: '', // 服务地址
        indexNumber: '',
        lineNumber: '',
        message: message,
        stack: stack,
        containerType: window.navigator.userAgent,
        remark: '异步错误',
        sysId: ''
      }
      // 发送ajax请求
      store.dispatch('ajax', {
        url: 'API@plat-manager/errorLog/addErrorLog',
        data: params,
        success: () => {}
      })
      return
    }
    let { message, stack } = err
    // 获取地址
    let { href } = vm.$router.resolve({
      path: vm.$route.path
    })
    let sysId = href.split('/')[1]
    let tempStr = stack.split(/\n/)[1].replace(/\s+/g, '')
    let funIndex = tempStr.indexOf('(')
    let srcIndex = ''
    let line = ''
    let column = ''
    if (process.env.NODE_ENV === 'production') {
      srcIndex = tempStr.indexOf('static')
    } else {
      srcIndex = tempStr.indexOf('./src')
    }
    let src = tempStr.slice(srcIndex, tempStr.length - 1)
    line = src.split(':')[1]
    column = src.split(':')[2]
    // 得到函数名
    let funName = tempStr.slice(4, funIndex)
    let obj = {
      logType: 'client',
      logTime: this.dateFormat(new Date()),
      moduleName: vm.$route.meta.title, // 模块名称
      location: location.host + location.pathname, // 去除参数的地址
      url: vm.$route.fullPath, // 服务地址
      indexNumber: column,
      lineNumber: line,
      message: message,
      stack: stack,
      containerType: window.navigator.userAgent,
      remark: funName + '|' + info,
      sysId: sysId
    }
    // 发送ajax请求
    store.dispatch('ajax', {
      url: 'API@plat-manager/errorLog/addErrorLog',
      data: obj,
      success: () => {}
    })
  },
  getQueryString (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },
  /**
   * @function 加法函数，用来得到精确的加法结果
   * @description  javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
   * @param arg1 第一个加数
   * @param arg2 第二个加数
   * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
     @returns 两数相加的结果
   */
  Add (arg1, arg2) {
    if (this.isEmpty(arg1)) {
      arg1 = 0
    }
    if (this.isEmpty(arg2)) {
      arg2 = 0
    }
    let arg1Arr = arg1.toString().split('.')
    let arg2Arr = arg2.toString().split('.')
    let d1 = arg1Arr.length === 2 ? arg1Arr[1] : ''
    let d2 = arg2Arr.length === 2 ? arg2Arr[1] : ''
    let maxLen = Math.max(d1.length, d2.length)
    let m = Math.pow(10, maxLen)
    let result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen))
    let d = arguments[2] // arguments 为获取所有传入的参数 取第三个参数
    return typeof d === 'number' ? Number((result).toFixed(d)) : result
  },
  removeZero (value) {
    if (this.isEmpty(value)) {
      return ''
    } else {
      return parseFloat(value) === 0 ? '' : parseFloat(value)
    }
  },
  isDef (v) {
    return v !== undefined && v !== null
  },
  isEmptyObject: function (obj) {
    let result = this.isEmpty(obj)
    if (!result) {
      result = Object.getOwnPropertyNames(obj).length === 0
    }
    return result
  },
  // 存放Session
  setSession: function (arr = []) {
    for (let x in arr) {
      window.sessionStorage.setItem(arr[x].key, arr[x].value)
    }
  },
  // 跳转:子系统指定回跳地址
  gotoCallBackUrl () {
    let token = encodeURIComponent(window.localStorage.getItem('token'))
    let callback = window.sessionStorage.getItem('callback')
    // window.sessionStorage.clear()
    if (this.isEmpty(callback)) {
      window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['LOGIN'] + '?token=' + token, '_self')
    } else {
      if (callback.indexOf('?') !== -1) {
        callback = callback.replace(/:::/g, '&')
        window.open(callback + '&token=' + token, '_self')
      } else {
        window.open(callback + '?token=' + token, '_self')
      }
    }
  },
  // 下载
  downLoadUrl  ({name, url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['modelUrl']}) {
    let link = document.createElement('a')
    link.setAttribute('download', name)
    link.href = url
    // link.click()
    link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}))
  },
  // 判断数组中是否有某元素
  isExistInArray (val, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        return true
      }
    }
    return false
  },
  // 通过 回车键 切换焦点
  switchFoucsByEnter (e) {
    e.srcElement.blur()
    // 获取当前焦点所在的 form表单
    let form = e.srcElement.form
    // 获取form表单下的所有 input
    let focusable = form.querySelectorAll('input')
    let newFocusable = []
    // 排除 disabled 属性的 input
    for (let n in focusable) {
      if (focusable[n].disabled === false) {
        newFocusable.push(focusable[n])
      }
    }
    focusable = newFocusable
    // 排除disabled元素
    let index
    for (let i in focusable) {
      if (e.srcElement === focusable[i]) {
        index = i
        break
      }
    }
    // 下一个元素
    let next = focusable[parseInt(index) + 1]
    // 上一个元素
    let prev = focusable[parseInt(index) - 1]
    if (e.shiftKey) { // shift+enter 光标向上个元素移动
      if (prev) {
        if (e.srcElement.attributes.shiftEnter && e.srcElement.attributes.shiftEnter.nodeValue === 'no') {
          return false
        } else {
          if (e.srcElement.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
            let ref = e.srcElement.parentElement.offsetParent.attributes.dataRef.nodeValue
            arguments[1].$refs[ref].blur()
          }
          prev.focus()
        }
      }
    } else if (e.ctrlKey && this.localName === 'textarea') { // Ctrl+enter 在textaera中换行
      let myValue = '\n'
      let t = e.srcElement
      if (document.selection) { // ie<9
        t.focus()
        let sel = document.selection.createRange()
        sel.text = myValue
        t.focus()
        sel.moveStart('character', -1)
      } else if (t.selectionStart || t.selectionStart === '0') { // 现代浏览器
        let startPos = t.selectionStart
        let endPos = t.selectionEnd
        let scrollTop = t.scrollTop
        t.value = t.value.substring(0, startPos) + myValue + t.value.substring(endPos, t.value.length)
        t.focus()
        // 因为myValue回车显示为\n
        t.selectionStart = startPos + myValue.length
        t.selectionEnd = startPos + myValue.length
        t.scrollTop = scrollTop
      } else {
        t.value += myValue
        t.focus()
      }
    } else {
      if (e.srcElement.localName === 'textarea') { // enter 光标向下个元素移动
        e.preventDefault()
        e.stopPropagation()
      }
      // 下个元素存在
      if (next) {
        if (e.srcElement.attributes.enter && e.srcElement.attributes.enter.nodeValue === 'no') {
          return false
        } else {
          if (e.srcElement.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
            let ref = e.srcElement.parentElement.offsetParent.attributes.dataRef.nodeValue
            arguments[1].$refs[ref].blur()
          }
          next.focus()
        }
      }
      return false
    }
  },
  // 清空对象中的值
  removeValueInObj: function (obj) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string' || typeof obj[key] === 'number' || obj[key] === null) {
        obj[key] = ''
      } else if (typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          obj[key] = []
        } else {
          obj[key] = {}
        }
      }
    })
    return obj
  },
  /**
   * @description 计算字符串的字节
   * @param {String} value 需要计算长度的字符串
   * @param {Number} defaultFlag 一个中文占几个字节
   */
  decGetlen: function (value, defaultFlag) {
    if (!defaultFlag) {
      defaultFlag = 2
    } else {
      defaultFlag = +defaultFlag
    }
    let realLength = 0
    if (!value) {
      return 0
    }
    let str = value
    let len = str.length
    // utf-8字节长度
    for (let i = 0; i < len; i++) {
      let charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) {
        realLength += 1
      } else {
        // 如果是中文则长度加2
        realLength += defaultFlag
      }
    }
    return realLength
  },
  /**
   * 此方法一个中文站两个字符
   * @description 控制字符长度输入，如果长度超出则自动清除
   * @param {String} value 需计算的字符串
   * @param {int} maxlen 需要保留的长度
   */
  getFixlenOfString (value, maxlen) {
    if (typeof (value) !== 'string') {
      return ''
    }
    let len = value.length
    // utf-8字节长度
    let realLength = 0
    let charCode
    for (var i = 0; i < len; i++) {
      charCode = value.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128 && charCode !== 10) {
        realLength += 1
      } else {
        // 如果是中文则长度加2
        realLength += 2
      }
      if (realLength > maxlen) {
        return value.substr(0, i)
      }
    }
    return value
  },
  /**
   * @description 判断数组中是否有空 null undefined的元素 有则 返回false  没有返回 true
   * @param {Array} arr 需要判断的数组
   */
  validArray (arr) {
    if (arr instanceof Array) {
      for (let i in arr) {
        if (this.isEmpty(arr[i])) {
          return false
        }
      }
      return true
    } else {
      return false
    }
  },
  /**
   * @function 精确的除法运算
   * @description  函数返回较为精确的除法结果
   * @param arg1 除数
   * @param arg2 被除数
   * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
     @returns arg1除于arg2的结果
    */
  Div (arg1, arg2) {
    let r1 = arg1.toString()
    let r2 = arg2.toString()
    let m
    let resultVal
    let d = arguments[2]
    m = (r2.split('.')[1] ? r2.split('.')[1].length : 0) - (r1.split('.')[1] ? r1.split('.')[1].length : 0)
    resultVal = Number(r1.replace('.', '')) / Number(r2.replace('.', '')) * Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  }
}
