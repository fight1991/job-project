const PAD_LIMIT = 8192
export default {
  /**
   * 是否为string类型
   * StringUtils.isString('')      = true
   * StringUtils.isString(undefined)      = false
   * StringUtils.isString(null)      = false
   */
  isString: function (str) {
    return typeof (str) === 'string'
  },
  /**
   * <p>Checks if a String is empty ("") or null.</p>
   *
   * <pre>
   * StringUtils.isEmpty(null)      = true
   * StringUtils.isEmpty(undefined) = true
   * StringUtils.isEmpty("")        = true
   * StringUtils.isEmpty(" ")       = false
   * StringUtils.isEmpty("bob")     = false
   * StringUtils.isEmpty("  bob  ") = false
   * </pre>
   *
   * <p>NOTE: This method changed in Lang version 2.0.
   * It no longer trims the String.
   * That functionality is available in isBlank().</p>
   *
   * @param str  the String to check, may be null
   * @return <code>true</code> if the String is empty or null
   */
  isEmpty: function (str) {
    return str == null || str === undefined || str === ''
  },
  /**
   * <p>Checks if a String is not empty ("") and not null.</p>
   *
   * <pre>
   * StringUtils.isNotEmpty(null)      = false
   * StringUtils.isNotEmpty("")        = false
   * StringUtils.isNotEmpty(" ")       = true
   * StringUtils.isNotEmpty("bob")     = true
   * StringUtils.isNotEmpty("  bob  ") = true
   * </pre>
   *
   * @param str  the String to check, may be null
   * @return <code>true</code> if the String is not empty and not null
   */
  isNotEmpty: function (str) {
    return !this.isEmpty(str)
  },
  /**
  * StringUtils.isBlank(null)      = true
  * StringUtils.isBlank(undefined) = true
  * StringUtils.isBlank("")        = true
  * StringUtils.isBlank(" ")       = true
  * StringUtils.isBlank("bob")     = false
  * StringUtils.isBlank("  bob  ") = false
   */
  isBlank: function (str) {
    return str == null || str === undefined || /^\s*$/.test(str)
  },
  /**
  * StringUtils.isNotBlank(null)      = false
  * StringUtils.isNotBlank(undefined)      = false
  * StringUtils.isNotBlank("")        = false
  * StringUtils.isNotBlank(" ")       = false
  * StringUtils.isNotBlank("bob")     = true
  * StringUtils.isNotBlank("  bob  ") = true
   */
  isNotBlank: function (str) {
    return !this.isBlank(str)
  },
  /**
  * StringUtils.trim(null)          = null
  * StringUtils.trim(undefined)     = undefined
  * StringUtils.trim("")            = ""
  * StringUtils.trim("     ")       = ""
  * StringUtils.trim("abc")         = "abc"
  * StringUtils.trim("    abc    ") = "abc"
   */
  trim: function (str) {
    return this.isString(str) ? str.trim() : str
  },
  /**
   *
   * <pre>
   * StringUtils.trimToNull(null)          = null
   * StringUtils.trimToNull(undefined)          = null
   * StringUtils.trimToNull("")            = null
   * StringUtils.trimToNull("     ")       = null
   * StringUtils.trimToNull("abc")         = "abc"
   * StringUtils.trimToNull("    abc    ") = "abc"
   * </pre>
   *
   * @param str  the String to be trimmed, may be null
   * @return the trimmed String,
   *  <code>null</code> if only chars &lt;= 32, empty or null String input
   */
  trimToNull: function (str) {
    let ts = this.trim(str)
    return this.isEmpty(ts) ? null : ts
  },
  /**
   * <p>Removes control characters (char &lt;= 32) from both
   * ends of this String returning an empty String ("") if the String
   * is empty ("") after the trim or if it is <code>null</code>.
   *
   * <pre>
   * StringUtils.trimToEmpty(null)          = ""
   * StringUtils.trimToEmpty(undefined)     = ""
   * StringUtils.trimToEmpty("")            = ""
   * StringUtils.trimToEmpty("     ")       = ""
   * StringUtils.trimToEmpty("abc")         = "abc"
   * StringUtils.trimToEmpty("    abc    ") = "abc"
   * </pre>
   *
   * @param str  the String to be trimmed, may be null
   * @return the trimmed String, or an empty String if <code>null</code> input
   */
  trimToEmpty: function (str) {
    return this.isString(str) ? this.trim(str) : ''
  },
  startsWith: function (str, prefix) {
    return this.isString(str) && str.indexOf(prefix) === 0
  },
  endsWith: function (str, suffix) {
    return this.isString(str) && str.lastIndexOf(suffix) === 0
  },
  /**
   * 查找字符串 str 是否包含searchSeq
   * @param {*} str 被查询的字符串
   * @param {*} searchSeq 需要查询的内容
   */
  contains: function (str, searchSeq) {
    return this.isString(str) && str.indexOf(searchSeq) >= 0
  },
  equals: function (str1, str2) {
    return this.isString(str1) && this.isString(str2) && str1 === str2
  },
  equalsIgnoreCase: function (str1, str2) {
    return this.isString(str1) && this.isString(str2) && str1.toLocaleLowerCase() === str2.toLocaleLowerCase()
  },
  /**
   * 判断制定字符串是否报关空格
   * 包含 返回 true  不包含返回 false
   */
  containsWhitespace: function (str) {
    return this.contains(str, ' ')
  },
  // 生成指定个数的字符
  repeat: function (ch, repeatTimes) {
    let result = ''
    for (let i = 0; i < repeatTimes; i++) {
      result += ch
    }
    return result
  },
  /**
   * 去除字符串中所有的空白符
   * <pre>
   * StringUtils.deleteSpaces(null)           = null
   * StringUtils.deleteSpaces(undefined)      = undefined
   * StringUtils.deleteSpaces("")             = ""
   * StringUtils.deleteSpaces("abc")          = "abc"
   * StringUtils.deleteSpaces(" \t  abc \n ") = "abc"
   * StringUtils.deleteSpaces("ab  c")        = "abc"
   * StringUtils.deleteSpaces("a\nb\tc     ") = "abc"
   * </pre>
   *
   * <p>Spaces are defined as <code>{' ', '\t', '\r', '\n', '\b'}</code>
   * in line with the deprecated <code>isSpace</code> method.</p>
   *
   */
  deleteWhitespace: function (str) {
    if (!this.isString(str)) {
      return str
    }
    return str.replace(/\s+/g, '')
  },
  /**
   *
   * @param {*} str 原字符串
   * @param {*} size 字符串的长度
   * @param {*} padStr 需要追加的字符 必须为
   */
  rightPad: function (str, size, padStr) {
    if (!this.isString(str)) {
      return str
    }
    if (this.isEmpty(padStr)) {
      // 如果 padStr 为 null or undefined 转为 ' '
      padStr = ' '
    }
    if (isNaN(size)) {
      size = 0
    } else {
      size = +size
    }
    let padLen = padStr.length()
    let strLen = str.length()
    let pads = size - strLen
    if (pads <= 0) {
      // 如果可能，返回原始字符串
      return str
    }
    if (padLen === 1 && pads <= PAD_LIMIT) {
      return this.rightPad(str, size, padStr.charAt(0))
    }
    if (pads === padLen) {
      return str.concat(padStr)
    } else if (pads < padLen) {
      return str.concat(padStr.substring(0, pads))
    } else {
      let padding = pads.split('')
      let padChars = padStr.toCharArray()
      for (let i = 0; i < pads; i++) {
        padding[i] = padChars[i % padLen]
      }
      return str.concat(padding.join(''))
    }
  },
  leftPad: function (str, size, padStr) {
    return this.repeat(padStr, size) + str
  },
  // 首小写字母转大写
  capitalize: function (str) {
    if (str === null || str.length === 0) {
      return str
    }
    return str.replace(/^[a-z]/, function (matchStr) {
      return matchStr.toLocaleUpperCase()
    })
  },
  // 首大写字母转小写
  uncapitalize: function (str) {
    if (str === null || str.length === 0) {
      return str
    }
    return str.replace(/^[A-Z]/, function (matchStr) {
      return matchStr.toLocaleLowerCase()
    })
  },
  // 大写转小写，小写转大写
  swapCase: function (str) {
    return str.replace(/[a-z]/ig, function (matchStr) {
      if (matchStr >= 'A' && matchStr <= 'Z') {
        return matchStr.toLocaleLowerCase()
      } else if (matchStr >= 'a' && matchStr <= 'z') {
        return matchStr.toLocaleUpperCase()
      }
    })
  },
  // 统计含有的子字符串的个数
  countMatches: function (str, sub) {
    if (this.isEmpty(str) || this.isEmpty(sub)) {
      return 0
    }
    let count = 0
    let index = 0
    while ((index = str.indexOf(sub, index)) !== -1) {
      index += sub.length
      count++
    }
    return count
  },
  // 只包含字母
  isAlpha: function (str) {
    return /^[a-z]+$/i.test(str)
  },
  // 只包含字母、空格
  isAlphaSpace: function (str) {
    return /^[a-z\s]*$/i.test(str)
  },
  // 只包含字母、数字
  isAlphanumeric: function (str) {
    return /^[a-z0-9]+$/i.test(str)
  },
  // 只包含字母、数字和空格
  isAlphanumericSpace: function (str) {
    return /^[a-z0-9\s]*$/i.test(str)
  },
  // 数字
  isNumeric: function (str) {
    return /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(str)
  },
  // 小数
  isDecimal: function (str) {
    return /^[-+]?(?:0|[1-9]\d*)\.\d+$/.test(str)
  },
  // 负小数
  isNegativeDecimal: function (str) {
    return /^\\-?(?:0|[1-9]\d*)\.\d+$/.test(str)
  },
  // 正小数
  isPositiveDecimal: function (str) {
    return /^\+?(?:0|[1-9]\d*)\.\d+$/.test(str)
  },
  // 整数
  isInteger: function (str) {
    return /^[-+]?(?:0|[1-9]\d*)$/.test(str)
  },
  // 正整数
  isPositiveInteger: function (str) {
    return /^\+?(?:0|[1-9]\d*)$/.test(str)
  },
  // 负整数
  isNegativeInteger: function (str) {
    return /^\\-?(?:0|[1-9]\d*)$/.test(str)
  },
  // 只包含数字和空格
  isNumericSpace: function (str) {
    return /^[\d\s]*$/.test(str)
  },
  isWhitespace: function (str) {
    return /^\s*$/.test(str)
  },

  isAllLowerCase: function (str) {
    return /^[a-z]+$/.test(str)
  },

  isAllUpperCase: function (str) {
    return /^[A-Z]+$/.test(str)
  },

  defaultString: function (str, defaultStr) {
    return str == null ? defaultStr : str
  },

  defaultIfBlank: function (str, defaultStr) {
    return this.isBlank(str) ? defaultStr : str
  },

  defaultIfEmpty: function (str, defaultStr) {
    return this.isEmpty(str) ? defaultStr : str
  },
  // 字符串反转
  reverse: function (str) {
    if (this.isBlank(str)) {
      return str
    }
    return str.split('').reverse().join('')
  },
  // 删掉特殊字符(英文状态下)
  removeSpecialCharacter: function (str) {
    return str.replace(/[!-/:-@\\[-`{-~]/g, '')
  },
  // 只包含特殊字符、数字和字母（不包括空格，若想包括空格，改为[ -~]）
  isSpecialCharacterAlphanumeric: function (str) {
    return /^[!-~]+$/.test(str)
  },
  /**
    * 校验时排除某些字符串，即不能包含某些字符串
    * @param {Object} conditions:里面有多个属性，如下：
    *
    * @param {String} matcherFlag 匹配标识
    * 0:数字；1：字母；2：小写字母；3:大写字母；4：特殊字符,指英文状态下的标点符号及括号等；5:中文;
    * 6:数字和字母；7：数字和小写字母；8：数字和大写字母；9：数字、字母和特殊字符；10：数字和中文；
    * 11：小写字母和特殊字符；12：大写字母和特殊字符；13：字母和特殊字符；14：小写字母和中文；15：大写字母和中文；
    * 16：字母和中文；17：特殊字符、和中文；18：特殊字符、字母和中文；19：特殊字符、小写字母和中文；20：特殊字符、大写字母和中文；
    * 100：所有字符;
    * @param {Array} excludeStrArr 排除的字符串，数组格式
    * @param {String} length 长度，可为空。1,2表示长度1到2之间；10，表示10个以上字符；5表示长度为5
    * @param {Boolean} ignoreCase 是否忽略大小写
    * conditions={matcherFlag:"0",excludeStrArr:[],length:"",ignoreCase:true}
    */
  isPatternMustExcludeSomeStr: function (str, conditions) {
    // 参数
    let matcherFlag = conditions.matcherFlag
    let excludeStrArr = conditions.excludeStrArr
    let length = conditions.length
    let ignoreCase = conditions.ignoreCase
    // 拼正则
    let size = excludeStrArr.length
    let regex = (size === 0) ? '^' : '^(?!.*(?:{0}))'
    let subPattern = ''
    for (let i = 0; i < size; i++) {
      excludeStrArr[i] = this.escapeMetacharacterOfStr(excludeStrArr[i])
      subPattern += excludeStrArr[i]
      if (i !== size - 1) {
        subPattern += '|'
      }
    }
    regex = this.format(regex, [subPattern])
    switch (matcherFlag) {
      case '0':
        regex += '\\d'
        break
      case '1':
        regex += '[a-zA-Z]'
        break
      case '2':
        regex += '[a-z]'
        break
      case '3':
        regex += '[A-Z]'
        break
      case '4':
        regex += '[!-/:-@\\[-`{-~]'
        break
      case '5':
        regex += '[\u4E00-\u9FA5]'
        break
      case '6':
        regex += '[a-zA-Z0-9]'
        break
      case '7':
        regex += '[a-z0-9]'
        break
      case '8':
        regex += '[A-Z0-9]'
        break
      case '9':
        regex += '[!-~]'
        break
      case '10':
        regex += '[0-9\u4E00-\u9FA5]'
        break
      case '11':
        regex += '[a-z!-/:-@\\[-`{-~]'
        break
      case '12':
        regex += '[A-Z!-/:-@\\[-`{-~]'
        break
      case '13':
        regex += '[a-zA-Z!-/:-@\\[-`{-~]'
        break
      case '14':
        regex += '[a-z\u4E00-\u9FA5]'
        break
      case '15':
        regex += '[A-Z\u4E00-\u9FA5]'
        break
      case '16':
        regex += '[a-zA-Z\u4E00-\u9FA5]'
        break
      case '17':
        regex += '[\u4E00-\u9FA5!-/:-@\\[-`{-~]'
        break
      case '18':
        regex += '[\u4E00-\u9FA5!-~]'
        break
      case '19':
        regex += '[a-z\u4E00-\u9FA5!-/:-@\\[-`{-~]'
        break
      case '20':
        regex += '[A-Z\u4E00-\u9FA5!-/:-@\\[-`{-~]'
        break
      case '100':
        regex += '[\\s\\S]'
        break
      default:
        alert(matcherFlag + ':This type is not supported!')
    }
    regex += this.isNotBlank(length) ? '{' + length + '}' : '+'
    regex += '$'
    let pattern = new RegExp(regex, ignoreCase ? 'i' : '')
    return pattern.test(str)
  },
  /**
  * @param {String} message
  * @param {Array} arr
  * 消息格式化
  */
  format: function (message, arr) {
    return message.replace(/{(\d+)}/g, function (matchStr, group1) {
      return arr[group1]
    })
  },
  /**
  * 把连续出现多次的字母字符串进行压缩。如输入:aaabbbbcccccd 输出:3a4b5cd
  * @param {String} str
  * @param {Boolean} ignoreCase : true or false
  */
  compressRepeatedStr: function (str, ignoreCase) {
    let pattern = new RegExp('([a-z])\\1+', ignoreCase ? 'ig' : 'g')
    return str.replace(pattern, function (matchStr, group1) {
      return matchStr.length + group1
    })
  },
  /**
    * 校验必须同时包含某些字符串
    * @param {String} str
    * @param {Object} conditions:里面有多个属性，如下：
    *
    * @param {String} matcherFlag 匹配标识
    * 0:数字；1：字母；2：小写字母；3:大写字母；4：特殊字符,指英文状态下的标点符号及括号等；5:中文;
    * 6:数字和字母；7：数字和小写字母；8：数字和大写字母；9：数字、字母和特殊字符；10：数字和中文；
    * 11：小写字母和特殊字符；12：大写字母和特殊字符；13：字母和特殊字符；14：小写字母和中文；15：大写字母和中文；
    * 16：字母和中文；17：特殊字符、和中文；18：特殊字符、字母和中文；19：特殊字符、小写字母和中文；20：特殊字符、大写字母和中文；
    * 100：所有字符;
    * @param {Array} excludeStrArr 排除的字符串，数组格式
    * @param {String} length 长度，可为空。1,2表示长度1到2之间；10，表示10个以上字符；5表示长度为5
    * @param {Boolean} ignoreCase 是否忽略大小写
    * conditions={matcherFlag:"0",containStrArr:[],length:"",ignoreCase:true}
    *
    */

  isPatternMustContainSomeStr: function (str, conditions) {
    // 参数
    let matcherFlag = conditions.matcherFlag
    let containStrArr = conditions.containStrArr
    let length = conditions.length
    let ignoreCase = conditions.ignoreCase
    // 创建正则
    let size = containStrArr.length
    let regex = '^'
    let subPattern = ''
    for (let i = 0; i < size; i++) {
      containStrArr[i] = this.escapeMetacharacterOfStr(containStrArr[i])
      subPattern += '(?=.*' + containStrArr[i] + ')'
    }
    regex += subPattern
    switch (matcherFlag) {
      case '0':
        regex += '\\d'
        break
      case '1':
        regex += '[a-zA-Z]'
        break
      case '2':
        regex += '[a-z]'
        break
      case '3':
        regex += '[A-Z]'
        break
      case '4':
        regex += '[!-/:-@\\[-`{-~]'
        break
      case '5':
        regex += '[\u4E00-\u9FA5]'
        break
      case '6':
        regex += '[a-zA-Z0-9]'
        break
      case '7':
        regex += '[a-z0-9]'
        break
      case '8':
        regex += '[A-Z0-9]'
        break
      case '9':
        regex += '[!-~]'
        break
      case '10':
        regex += '[0-9\u4E00-\u9FA5]'
        break
      case '11':
        regex += '[a-z!-/:-@\\[-`{-~]'
        break
      case '12':
        regex += '[A-Z!-/:-@\\[-`{-~]'
        break
      case '13':
        regex += '[a-zA-Z!-/:-@\\[-`{-~]'
        break
      case '14':
        regex += '[a-z\u4E00-\u9FA5]'
        break
      case '15':
        regex += '[A-Z\u4E00-\u9FA5]'
        break
      case '16':
        regex += '[a-zA-Z\u4E00-\u9FA5]'
        break
      case '17':
        regex += '[\u4E00-\u9FA5!-/:-@\\[-`{-~]'
        break
      case '18':
        regex += '[\u4E00-\u9FA5!-~]'
        break
      case '19':
        regex += '[a-z\u4E00-\u9FA5!-/:-@\\[-`{-~]'
        break
      case '20':
        regex += '[A-Z\u4E00-\u9FA5!-/:-@\\[-`{-~]'
        break
      case '100':
        regex += '[\\s\\S]'
        break
      default:
        alert(matcherFlag + ':This type is not supported!')
    }
    regex += this.isNotBlank(length) ? '{' + length + '}' : '+'
    regex += '$'
    let pattern = new RegExp(regex, ignoreCase ? 'i' : '')
    return pattern.test(str)
  },
  // 中文校验
  isChinese: function (str) {
    return /^[\u4E00-\u9FA5]+$/.test(str)
  },
  // 去掉中文字符
  removeChinese: function (str) {
    return str.replace(/[\u4E00-\u9FA5]+/gm, '')
  },
  // 转义元字符
  escapeMetacharacter: function (str) {
    let metacharacter = '^$()*+.[]|\\-?{}|'
    if (metacharacter.indexOf(str) >= 0) {
      str = '\\' + str
    }
    return str
  },
  // 转义字符串中的元字符
  escapeMetacharacterOfStr: function (str) {
    return str.replace(/[\^$*\\+\\.\\|\\\-\\?\\{\\}\\|]/gm, '\\$&')
  }
}
