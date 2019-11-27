const filters = {
  money: (value, decimals = 2, dec = '.', sep = ',') => {
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
    let re = /(-?\d+)(\d{3})/
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
  date: (value, format = 'yyyy-MM-dd hh:mm:ss') => {
    if (value !== null && value !== undefined && value !== '') {
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
  strNum: (value, num) => {
    let str = ''
    if (value !== null && value !== '' && value !== undefined) {
      str = value.length < num ? value : value.substring(0, num - 1) + '···'
    }
    return str
  }
}

export default filters
