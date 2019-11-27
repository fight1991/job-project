import util from '@/common/util'
import {tipsMessage} from './tipsMessages'
// import BigDecimal from 'js-big-decimal'

export default {
  // 去重
  unique (arr) {
    let x = new Set(arr)
    return [...x]
  },
  // 获取今天的日期
  getTodayDate () {
    let date = new Date()
    let year = date.getFullYear()
    let mon = date.getMonth() + 1
    if (mon.toString().length === 1) {
      mon = '0' + mon
    }
    let day = date.getDate()
    if (day.toString().length === 1) {
      day = '0' + day
    }
    return year + '' + mon + '' + day
  },
  // 格式化数据  去掉小数点后面多余的0
  removeZero (value) {
    if (util.isEmpty(value)) {
      return ''
    } else {
      return parseFloat(value) === 0 ? '' : parseFloat(value)
    }
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
    if (util.isEmpty(arg1)) {
      arg1 = 0
    }
    if (util.isEmpty(arg2)) {
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
  /**
   * @function 减法函数，用来得到精确的减法结果
   * @description 函数返回较为精确的减法结果
   * @param arg1 第一个加数
   * @param arg2 第二个加数
   * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
     @returns 两数相减的结果
    */
  Sub (arg1, arg2) {
    return this.Add(arg1, -Number(arg2), arguments[2])
  },
  /**
   * @function 精确的乘法运算
   * @description  函数返回较为精确的乘法结果
   * @param arg1 第一个乘数
   * @param arg2 第二个乘数
   * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
     @returns 两数相乘的结果
    */
  Mul (arg1, arg2) {
    let r1 = arg1.toString()
    let r2 = arg2.toString()
    let m
    let resultVal
    let d = arguments[2] // arguments 为获取所有传入的参数 取第三个参数
    m = (r1.split('.')[1] ? r1.split('.')[1].length : 0) + (r2.split('.')[1] ? r2.split('.')[1].length : 0)
    resultVal = Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
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
  },
  // 获取浏览器类型
  myBrowser () {
    let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    let isOpera = (userAgent.indexOf('Opera') > -1)
    if (userAgent.indexOf('Opera') > -1) {
      return 'Opera'
    } // 判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
      return 'FF'
    } // 判断是否Firefox浏览器
    if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome'
    }
    if (userAgent.indexOf('Safari') > -1) {
      return 'Safari'
    } // 判断是否Safari浏览器
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      return 'IE'
    } // 判断是否IE浏览器
  },
  // 检验集装箱号
  verifyContainerNo (value) {
    // let value = this.decContainer.containerNo.split('')
    let getNumber = new Map()
    let num = 10
    // 生成字母与数字对照表
    for (let i = 0; i < 26; i++) {
      let word = String.fromCharCode((65 + i))
      // 对应码取消了11的倍数，比如11，22，33，所以我们要排除掉
      if (num === 11 || num === 22 || num === 33) {
        num += 1
      }
      getNumber.set(word, num)
      num += 1
    }
    let sum = 0
    // 取四个字母对应的数字，并进行计算
    for (let m = 0; m < 4; m++) {
      sum += getNumber.get(value[m]) * Math.pow(2, m)
    }
    // 对前6个数字进行计算
    for (let n = 4; n < 10; n++) {
      sum += value[n] * Math.pow(2, n)
    }
    // 再对10取余是防止出现校验码为10的情况，假如校验码为10，则取0
    let checkDigit = sum % 11 % 10
    // 判断校验码是否与最后一位数字相等
    if (checkDigit === Number(value[10])) {
      return true
    } else {
      return false
    }
  },
  prevent (e) {
    e.preventDefault()
    e.stopPropagation()
  },
  selectSearch (_this, query, type) {
    _this[_this.selectObj.obj] = []
    let keyValue = query.toString().trim()
    let list = JSON.parse(window.localStorage.getItem(_this.selectObj.params))
    if (!list) { // 异常处理，如果参数没有下载下来
      list = []
    }
    if (_this.selectObj.params === 'SAAS_LIC_TYPE' || _this.selectObj.params === 'SAAS_ENT_QUALIF_TYPE') { // 许可证类别
      list = list.filter(item => {
        return item.otherField.toUpperCase().indexOf(_this.controller.iEFlag) > -1
      })
    }
    let fitlerParmaTable = ['SAAS_CURR', 'SAAS_WRAP', 'SAAS_TRADE', 'SAAS_CONTAINER_MODEL', 'SAAS_COUNTRY', 'SAAS_PORT_LIN']
    if (util.isEmpty(keyValue)) {
      _this.$nextTick(() => {
        _this[_this.selectObj.obj] = list.slice(0, 20)
      })
    } else {
      let filterList = []
      let filterList1 = [] //
      let filterList2 = [] //
      filterList = list.filter(item => {
        let str = item.codeField + '-' + item.nameField
        return str.toLowerCase().startsWith(keyValue.toLowerCase())
      })
      filterList2 = list.filter(item => {
        let str = item.codeField + '-' + item.nameField
        return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
      })
      // 去重
      filterList.push(...filterList2)
      filterList = this.unique(filterList)
      if (fitlerParmaTable.includes(_this.selectObj.params)) {
        filterList1 = list.filter(item => {
          let str = item.otherField + ' ' + item.extendField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        filterList.push(...filterList1)
        filterList = this.unique(filterList)
      }
      if (type === 'init') {
        _this[_this.selectObj.obj] = filterList.slice(0, 20)
      } else if (type === 'select') {
        _this.$nextTick(() => {
          _this[_this.selectObj.obj] = filterList.slice(0, 20)
        })
      }
    }
  },
  // 提示需要填写的内容
  tipsMessageF (_this, value, obj, params, moduleName) {
    // 1. 提示填写信息
    if (value !== '') {
      let para = tipsMessage[value]
      if (util.isEmpty(para)) {
        _this.$store.commit(moduleName + '/changeDecPage', {key: 'tipsNoteShow', 'value': false})
        _this.$store.commit(moduleName + '/changeDecPage', {key: 'tipsNote', 'value': ''})
      } else {
        _this.$store.commit(moduleName + '/changeDecPage', {key: 'tipsNoteShow', 'value': true})
        _this.$store.commit(moduleName + '/changeDecPage', {key: 'tipsNote', 'value': para})
      }
    }
    // 设置为选中的太装
    if (value === 'declTotal') {
      _this.$nextTick(_ => {
        _this.$refs['declTotal'].focus()
        _this.$refs['declTotal'].select()
      })
    }
    // 如果时下拉框 则设置当前下拉框的默认参数
    _this.selectObj = {
      obj: obj,
      params: params
    }
    // 如果是规格型号 则选择
    if (value === 'gModel') {
      _this.$refs['gModel'].select()
    }
  },
  // 调用切换焦点的方法
  switchFoucsByEnter (e, callBack) {
    if (e.target.localName === 'button') {
      return
    }
    e.target.blur()
    // 获取当前焦点所在的 form表单
    let form = e.target.form
    // 获取form表单下的所有 input  并把为数组转化为真数组
    let focusable = Array.from(form.querySelectorAll('input,textarea'))
    let newFocusable = []
    // 过滤掉 被disable 修饰的 和 被readonly修饰但不含有placeholder的input
    newFocusable = focusable.filter(v => {
      return (!v.readOnly || v.placeholder) && !v.disabled
    })
    // 计算现在焦点在什么位置
    let index = newFocusable.findIndex((v, i) => {
      return e.target === v
    })
    // 下一个元素
    let next = newFocusable[parseInt(index) + 1]
    // 下下一个元素
    let secondNext = newFocusable[parseInt(index) + 2]
    // 上一个元素
    let prev = newFocusable[parseInt(index) - 1]
    if (e.shiftKey) { // shift+enter 光标向上个元素移动
      if (prev) {
        if (e.target.attributes.shiftEnter && e.target.attributes.shiftEnter.nodeValue === 'no') {
          return false
        } else {
          // if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
          //   // let ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
          //   // _this.$refs[ref].blur()
          // }
          prev.focus()
        }
      }
    } else if (e.ctrlKey && e.target.localName === 'textarea') { // Ctrl+enter 在textaera中换行
      let myValue = '\n'
      let t = e.target
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
      if (e.target.localName === 'textarea') { // enter 光标向下个元素移动
        e.preventDefault()
        e.stopPropagation()
      }
      callBack && callBack(e, next, secondNext)
    }
  },
  clearSelct (_this, selecType) {
    _this[selecType] = []
  },
  /**
   * 初始化 下拉框
   * @param arr 定义的每个模块的数据
   * @param form 表单
   */
  initSelect (_this, arr, form) {
    for (let key in arr) {
      let selectValue = form[key]
      _this.selectObj = arr[key]
      if (util.isEmpty(selectValue)) {
        continue
      } else {
        _this.checkParamsList(selectValue, 'init')
      }
    }
  },
  /**
   * 控制输入中英文字符长度，一个中文当做2个长度来控制
   * @param inpt
   * @param maxlen
  */
  checklen (_this, type, ipnut, maxlen) {
    let str
    switch (type) {
      case 'goodsSpecForm':
        str = _this.goodsSpecForm[ipnut]
        break
      case 'userForm':
        str = _this.userForm[ipnut]
        break
      case 'dangerForm':
        str = _this.dangerForm[ipnut]
        break
      case 'licVINForm':
        str = _this.licVINForm[ipnut]
        break
      case 'decHead':
        str = _this.decHead[ipnut]
        break
      default:
        str = ''
    }
    let len = str.length
    // utf-8字节长度
    let realLength = 0
    let charCode
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128 && charCode !== 10) {
        realLength += 1
      } else {
        // 如果是中文则长度加2
        realLength += 2
      }
      if (realLength > maxlen) {
        switch (type) {
          case 'goodsSpecForm':
            _this.goodsSpecForm[ipnut] = str.substr(0, i)
            break
          case 'userForm':
            _this.userForm[ipnut] = str.substr(0, i)
            break
          case 'dangerForm':
            _this.dangerForm[ipnut] = str.substr(0, i)
            break
          case 'licVINForm':
            _this.licVINForm[ipnut] = str.substr(0, i)
            break
          case 'decHead':
            _this.decHead[ipnut] = str.substr(0, i)
            break
          default:
            str = ''
        }
        return
      }
    }
  }
  // /**
  //  * 四舍六入五成双
  //  * @param num
  //  * @param digit   小数点多少位
  //  * calculationType：计算类型（加减乘除对应0,1,2,3）
  //  * @returns {Number}
  //  */
  // decToDecimal (num1, num2, digit, calculationType, roundingMode) {
  //   let calculationDatas = [num1 + ',' + num2]
  //   let digits = [digit]
  //   let calculationTypes = [calculationType]
  //   let roundingModes = [roundingMode]
  //   let resultList = this.decCalculation(calculationDatas, digits, calculationTypes, roundingModes, '1')
  //   return resultList[0]
  // },
  // /**
  //  *
  //  * @param calculations 计算值的集合
  //  * @param calculationType 计算类型,0,1,2,3分别对应加减乘除
  //  * @param roundingMode 计算结果小数保留的方式，四舍五入等
  //  * @param digit 保留小数的位数
  //  * @param isZeroNoShow 小数点后全为0是否显示，1显示，0不显示
  //  */
  // decCalculation (calculationDatas, digits, calculationTypes, roundingModes, isZeroNoShow) {
  //   let resultList = []
  //   if (!calculationDatas || calculationDatas.length < 1) {
  //     return resultList
  //   }
  //   if (!isZeroNoShow) {
  //     isZeroNoShow = 1
  //   }
  //   for (let i = 0; i < calculationDatas.length; i++) {
  //     if (!calculationDatas[i]) {
  //       return resultList
  //     }
  //     var calculationData = calculationDatas[i].split(',')
  //     var calculationDataMap = this.calculation(calculationData, calculationTypes[i],
  //       roundingModes[i], digits[i], isZeroNoShow)
  //     if (calculationDataMap) {
  //       resultList[resultList.length] = calculationDataMap.result
  //     }
  //   }
  //   return resultList
  // },
  // /**
  //  *
  //  * @param calculations 计算值的集合
  //  * @param calculationType 计算类型,0,1,2,3分别对应加减乘除
  //  * @param roundingMode 计算结果小数保留的方式，四舍五入等
  //  * @param digit 保留小数的位数
  //  * @param isZeroNoShow 小数点后全为0是否显示，1显示，0不显示
  //  */
  // calculation (calculations, calculationType, roundingMode, digit, isZeroNoShow) {
  //   let resultData = {}
  //   let result = ''
  //   if (!calculations || calculations.length < 1 || !calculationType || calculationType.length < 0) {
  //     resultData.result = result
  //     return resultData
  //   }
  //   if (!digit) {
  //     digit = '0'
  //   }
  //   if (!isZeroNoShow) {
  //     digit = '1'
  //   }
  //   let bigDecimalResult = new BigDecimal(calculations[0])
  //   let bigDecimal = null
  //   let calculation = ''
  //   for (var i = 1; i < calculations.length; i++) {
  //     if (!calculations[i]) {
  //       calculation = '0'
  //     } else {
  //       calculation = calculations[i]
  //     }
  //     bigDecimal = new BigDecimal(calculation)
  //     if (calculationType === '0') {
  //       bigDecimalResult = bigDecimalResult.add(bigDecimal).value
  //     } else if (calculationType === '1') {
  //       bigDecimalResult = bigDecimalResult.subtract(bigDecimal).value
  //     } else if (calculationType === '2') {
  //       // bigDecimalResult = bigDecimalResult.multiply(bigDecimal).value.setScale(parseInt(digit), parseInt(roundingMode))
  //       bigDecimalResult = new BigDecimal(bigDecimalResult.multiply(bigDecimal).value).round(+digit, BigDecimal.RoundingModes.CEILING).value
  //     } else if (calculationType === '3') {
  //       bigDecimal = new BigDecimal(calculations[i])
  //       if (calculation === '0') {
  //         resultData.result = ''
  //         return resultData
  //       } else {
  //         bigDecimalResult = new BigDecimal(bigDecimalResult.divide(bigDecimal).value).round(+digit, BigDecimal.RoundingModes.CEILING).value
  //         // bigDecimalResult = bigDecimalResult.divide(bigDecimal, parseInt(digit), parseInt(roundingMode)).value
  //       }
  //     } else {
  //       resultData.result = ''
  //       return resultData
  //     }
  //   }
  //   if (isZeroNoShow === '1' && parseInt(bigDecimalResult) === bigDecimalResult.toString()) {
  //     result = parseInt(bigDecimalResult)
  //   } else {
  //     result = bigDecimalResult.toString()
  //   }
  //   resultData.result = result
  //   return resultData
  // }
}
