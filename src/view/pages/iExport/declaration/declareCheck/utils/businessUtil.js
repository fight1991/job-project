import {decHeadItems} from './decHeadConstants'
import {decListItems} from './decListItemConstants'
import {containerListItems} from './containerConstants'
import utils from '@/common/util'

function generateHeadCheck (headItems, decHead, decVerifyHead, headNotes) {
  let result = {}
  headItems.forEach((item) => {
    let key = item.key
    let notes = headNotes && utils.isEmptyObject(headNotes[key + 'Note']) ? [] : headNotes[key + 'Note']
    result[key] = {
      ...item,
      color: +decVerifyHead[key],
      visible: false,
      value: decHead[key + 'Note'] || '',
      notes: notes.reverse()
    }
  })
  return result
}

function promiseCodeChangName (code) {
  if (code === '0') {
    return '否'
  } else if (code === '1') {
    return '是'
  } else if (code === '9') {
    return '空'
  } else {
    return ''
  }
}

export default{
  generateDecHeadCheck (decHead = {}, decVerifyHead = {}, headNotes = {}) {
    return generateHeadCheck(decHeadItems, decHead, decVerifyHead, headNotes)
  },
  generateDecListCheck (decList, decVerifyList, listNotes) {
    let results = []
    decList.forEach((decItem, index) => {
      let result = {}
      decListItems.forEach((item) => {
        let key = item.key
        let notes = listNotes && listNotes[index] && listNotes[index][key + 'Note'] ? listNotes[index][key + 'Note'] : []
        let decVerifyListItem = decVerifyList && decVerifyList[index] ? decVerifyList[index] : {}
        result[key] = {
          ...item,
          color: utils.isDef(decVerifyListItem[key + 'Color']) ? +decVerifyListItem[key + 'Color'] : 0,
          visible: false,
          value: decItem[key + 'Note'] || '',
          notes: notes.reverse()
        }
      })
      results.push(result)
    })
    return results
  },
  generateContainerListCheck (containerList, containerVerifyList, listNotes) {
    let results = []
    containerList.forEach((containerItem, index) => {
      let result = {}
      containerListItems.forEach((item) => {
        let key = item.key
        let notes = listNotes && listNotes[index] && listNotes[index][key + 'Note'] ? listNotes[index][key + 'Note'] : []
        let containerVerifyListItem = containerVerifyList && containerVerifyList[index] ? containerVerifyList[index] : {}
        result[key] = {
          ...item,
          color: utils.isDef(containerVerifyListItem[key + 'Color']) ? +containerVerifyListItem[key + 'Color'] : 0,
          visible: false,
          value: containerItem[key + 'Note'] || '',
          notes: notes.reverse()
        }
      })
      results.push(result)
    })
    return results
  },
  allDecDataColorCheck (headConfig, listConfigs, containerListConfigs, isImport) {
    for (let x in headConfig) {
      if ((['overseasConsignorCode', 'goodSplace', 'despPortCode', 'despDate', 'origBoxFlag', 'userInfo', 'overseasConsignorAddr', 'cmplDschrgDt'].indexOf(headConfig[x].key) >= 0 && !isImport) || (['overseasConsigneeCode'].indexOf(headConfig[x].key) >= 0 && isImport)) {

      } else {
        if (headConfig[x].color === 0) {
          return true
        }
      }
    }
    for (let x1 = 0; x1 < listConfigs.length; x1++) {
      for (let y1 in listConfigs[x1]) {
        if (listConfigs[x1][y1].color === 0) {
          return true
        }
      }
    }
    for (let x2 = 0; x2 < containerListConfigs.length; x2++) {
      for (let y2 in containerListConfigs[x2]) {
        if (containerListConfigs[x2][y2].color === 0) {
          return true
        }
      }
    }
    return false
  },
  getDefaultDecListItemConfig () {
    let result = {}
    decListItems.forEach((item) => {
      let key = item.key
      result[key] = {
        ...item,
        color: 0,
        visible: false,
        value: '',
        notes: []
      }
    })
    return result
  },
  formatDecList (decList, decVerifyList) {
    let purpose = ''
    let purposeValue = ''
    let approveNo = ''
    let sum1 = 0 // 总价 不区分币制
    let sum2 = 0 // 成交数量 不区分单位
    let sum3 = 0 // 第一法定数量 不区分单位
    let sum4 = 0 // 第二法定数量 不区分单位
    let dataMap1 = {} // 总价
    let dataMap2 = {} // 成交数量
    let dataMap3 = {} // 第一法定数量
    let dataMap4 = {} // 第二法定数量
    decList && decList.forEach((item, index) => {
      let verifyInfo = decVerifyList[index]
      if (verifyInfo) {
        item.contrItemColor = +verifyInfo.contrItemColor
        item.declPriceColor = +verifyInfo.declPriceColor
        item.declTotalColor = +verifyInfo.declTotalColor
        item.tradeCurrColor = +verifyInfo.tradeCurrColor
        item.exgVersionColor = +verifyInfo.exgVersionColor
        item.gNoAllColor = +verifyInfo.gNoAllColor
        item.codeTsColor = +verifyInfo.codeTsColor
        item.gNameAndModelColor = +verifyInfo.gNameAndModelColor
        item.gQtyAndUnitColor = +verifyInfo.gQtyAndUnitColor
        item.gNoAllColor = +verifyInfo.gNoAllColor
        item.priceAndTotalColor = +verifyInfo.priceAndTotalColor
        item.originCountryColor = +verifyInfo.originCountryColor
        item.destinationCountryColor = +verifyInfo.destinationCountryColor
        item.districtCodeAndColor = +verifyInfo.districtCodeAndColor
        item.dutyModeColor = +verifyInfo.dutyModeColor
        item.gNoColor = +verifyInfo.gNoColor
        item.codeTsColor = +verifyInfo.codeTsColor
        item.gNameColor = +verifyInfo.gNameColor
        item.ciqCodeColor = +verifyInfo.ciqCodeColor
        item.goodsSpecColor = +verifyInfo.goodsSpecColor
        item.showGoodsAttrValueColor = +verifyInfo.showGoodsAttrValueColor
        item.purposeColor = +verifyInfo.purposeColor
        item.licenseTypeNoColor = +verifyInfo.licenseTypeNoColor
        item.dangerGoodsInfoColor = +verifyInfo.dangerGoodsInfoColor
      } else {
        item.contrItemColor = 0
        item.declPriceColor = 0
        item.declTotalColor = 0
        item.tradeCurrColor = 0
        item.exgVersionColor = 0
        item.gNoAllColor = 0
        item.codeTsColor = 0
        item.gNameAndModelColor = 0
        item.gQtyAndUnitColor = 0
        item.gNoAllColor = 0
        item.priceAndTotalColor = 0
        item.originCountryColor = 0
        item.destinationCountryColor = 0
        item.districtCodeAndColor = 0
        item.dutyModeColor = 0
        item.gNoColor = 0
        item.codeTsColor = 0
        item.gNameColor = 0
        item.ciqCodeColor = 0
        item.goodsSpecColor = 0
        item.showGoodsAttrValueColor = 0
        item.purposeColor = 0
        item.licenseTypeNoColor = 0
        item.dangerGoodsInfoColor = 0
      }
      if (index === 0) {
        purpose = item.purpose
        purposeValue = item.purposeValue
        if (item.decGoodsLimits.length > 0) {
          approveNo = item.decGoodsLimits[0].licenceNo
        }
      }
      // 格式化数据 去掉多余的零
      item.declPrice = utils.removeZero(item.declPrice)
      item.gQty = utils.removeZero(item.gQty)
      item.qty1 = utils.removeZero(item.qty1)
      item.qty2 = utils.removeZero(item.qty2)
      item.declTotal = utils.removeZero(item.declTotal)
      // 计算 总价、成交数量、第一数量、第二数量
      if (utils.isEmpty(item.declTotal)) {
        item.declTotal = ''
      }
      if (utils.isEmpty(item.gQty)) {
        item.gQty = ''
      }
      if (utils.isEmpty(item.qty1)) {
        item.qty1 = ''
      }
      if (utils.isEmpty(item.qty2)) {
        item.qty2 = ''
      }
      // 计算商品列表要素的统计数量
      sum1 = utils.Add(sum1, item.declTotal)
      sum2 = utils.Add(sum2, item.gQty)
      sum3 = utils.Add(sum3, item.qty1)
      sum4 = utils.Add(sum4, item.qty2)
      // 统计报关单 统计的数量
      dataMap1[item.tradeCurrValue] = utils.Add(dataMap1[item.tradeCurrValue], item.declTotal)
      dataMap2[item.gUnitValue] = utils.Add(dataMap2[item.gUnitValue], item.gQty)
      dataMap3[item.unit1Value] = utils.Add(dataMap3[item.unit1Value], item.qty1)
      dataMap4[item.unit2Value] = utils.Add(dataMap4[item.unit2Value], item.qty2)
      // 货物属性的显示转换
      if (item.goodsAttrList.length > 0) {
        let goods = item.goodsAttrList
        let goodsValue = []
        for (let n in goods) {
          goodsValue.push(goods[n].goodsAttrValue)
        }
        item.showGoodsAttrValue = goodsValue.join(',')
      }
      // 危险货物信息
      let dangerValue = []
      item.noDangFlag && dangerValue.push(item.noDangFlag)
      item.unCode && dangerValue.push(item.unCode)
      item.dangName && dangerValue.push(item.dangName)
      if (item.dangPackType === '1') {
        dangerValue.push('一类')
      } else if (item.dangPackType === '2') {
        dangerValue.push('二类')
      } else if (item.dangPackType === '3') {
        dangerValue.push('三类')
      } else {
        dangerValue.push('')
      }
      item.dangPackSpec && dangerValue.push(item.dangPackSpec)
      if (dangerValue.length > 1) {
        item.dangerGoodsInfo = dangerValue.join('|')
      }
      // 检验检疫货物规格
      let goodspec = []
      if (!utils.isEmpty(item.stuffNote)) {
        goodspec.push(item.stuffNote)
      }
      if (!utils.isEmpty(item.prodValidDt)) {
        goodspec.push(item.prodValidDt)
      }
      if (!utils.isEmpty(item.prodQgp)) {
        goodspec.push(item.prodQgp)
      }
      if (!utils.isEmpty(item.engManentCnm)) {
        goodspec.push(item.engManentCnm)
      }
      if (!utils.isEmpty(item.goodsSpec)) {
        goodspec.push(item.goodsSpec)
      }
      if (!utils.isEmpty(item.goodsModel)) {
        goodspec.push(item.goodsModel)
      }
      if (!utils.isEmpty(item.goodsBrand)) {
        goodspec.push(item.goodsBrand)
      }
      if (!utils.isEmpty(item.produceDate)) {
        goodspec.push(item.produceDate)
      }
      if (!utils.isEmpty(item.prodBatchNo)) {
        goodspec.push(item.prodBatchNo)
      }
      if (!utils.isEmpty(item.mnufctrRegNo)) {
        goodspec.push(item.mnufctrRegNo)
      }
      item.goodsSpec = goodspec.join(';')
      // 许可证类别及编号
      if (item.decGoodsLimits.length > 0) {
        let goodsLimits = item.decGoodsLimits
        let goodsLimitsValue = []
        for (let m in goodsLimits) {
          let str = '(' + goodsLimits[m].licTypeCode + ')' + ' ' + goodsLimits[m].licTypeCodeValue + ',' + goodsLimits[m].licenceNo
          goodsLimitsValue.push(str)
        }
        item.licenseTypeNo = goodsLimitsValue.join(';')
      }
    })
    let arr1 = []
    let arr2 = []
    let arr3 = []
    let arr4 = []
    for (let key1 in dataMap1) {
      if (dataMap1[key1] !== 0) {
        arr1.push(dataMap1[key1] + ' ' + key1)
      }
    }
    for (let key2 in dataMap2) {
      if (dataMap2[key2] !== 0) {
        arr2.push(dataMap2[key2] + ' ' + key2)
      }
    }
    for (let key3 in dataMap3) {
      if (dataMap3[key3] !== 0) {
        arr3.push(dataMap3[key3] + ' ' + key3)
      }
    }
    for (let key4 in dataMap4) {
      if (dataMap4[key4] !== 0) {
        arr4.push(dataMap4[key4] + ' ' + key4)
      }
    }
    let str
    if (arr1.length > 0) {
      str = '总价：' + arr1.join(',') + ';'
    } else {
      str = '总价：' + ' ' + ';'
    }
    if (arr2.length > 0) {
      str += '成交数量合计：' + arr2.join(',') + ';'
    } else {
      str += '成交数量合计：' + ' ' + ';'
    }
    if (arr3.length > 0) {
      str += '法定第一数量合计：' + arr3.join(',') + ';'
    } else {
      str += '法定第一数量合计：' + ' ' + ';'
    }
    if (arr3.length > 0) {
      str += '法定第二数量合计：' + arr4.join(',')
    } else {
      str += '法定第二数量合计：' + ' '
    }
    return {
      purpose: purpose,
      purposeValue: purposeValue,
      approveNo: approveNo,
      totalPrice: sum1,
      gQtyTotal: sum2,
      gQty1Total: sum3,
      gQty2Total: sum4,
      statistics: str
    }
  },
  generateSpecialFlag (decHead) {
    let nameList = ['国际赛事', '特殊进出军工物资', '国际援助物资', '国际会议']
    let nameList2 = ['直通放行', '直通放行', '外交礼遇', '转关']
    let showList = []
    if (decHead.specDeclFlag !== '') {
      let arr = decHead.specDeclFlag.split('')
      for (let i in arr) {
        if (arr[i] === '1') {
          showList.push(nameList[i])
        }
      }
    }
    if (decHead.specDeclFlag2 !== '') {
      let arr2 = decHead.specDeclFlag2.split('')
      for (let n in arr2) {
        if (arr2[n] === '1') {
          showList.push(nameList2[n])
        }
      }
    }
    return showList.join(',')
  },
  // 其他价格影响因素 格式化
  generatePromiseItems (decHead) {
    // eslint-disable-next-line
    let result = [, , ]
    if (decHead.promiseItmes) {
      let promiseArr = decHead.promiseItmes.split('')
      result = [promiseCodeChangName(promiseArr[0]), promiseCodeChangName(promiseArr[1]), promiseCodeChangName(promiseArr[2])]
    }
    return result
  },
  generateNote (decHead, container) {
    // 备注
    let str = ''
    if (!utils.isEmpty(decHead.noteS)) {
      str += '备注: ' + decHead.noteS + ';'
    }
    if (!utils.isEmpty(decHead.markNo)) {
      str += '标记唛码: ' + decHead.markNo + ';'
    }
    if (!utils.isEmpty(decHead.relId)) {
      str += ' 关联报关单号: ' + decHead.relId
    }
    if (!utils.isEmpty(decHead.relManno)) {
      str += ' 关联备案号: ' + decHead.relManno
    }
    let no = container.length
    let num = 0
    let contaNoArr = []
    if (no > 0) {
      for (let m in container) {
        if (container[m].containerSizeValue.indexOf('L') > 0) {
          num += 2
        } else if (container[m].containerSizeValue.indexOf('S') > 0) {
          num++
        }
        contaNoArr.push(container[m].containerNo)
      }
      str += ' 集装箱标箱数及号码: ' + num + ';'
      str += ' ' + contaNoArr.join(';')
    }
    return str
  },
  // 原产地对应关系
  /**
   * 1。如果Y证 需要 显示出 单证类型和单证号以及原地产对应关系
   * 其他的则只显示对应关系
   */
  generateLicenseInfo (licenses, decHead) {
    let origStr = []
    let docStr = []
    for (let x in licenses) {
      if (['Y', 'E', 'R', 'F', 'J'].includes(licenses[x].docuCode)) {
        let Ystr = ''
        if (licenses[x].docuCode === 'Y') {
          Ystr = licenses[x].docuCode + licenses[x].certCode + ':'
        }
        let arr = []
        for (let y in licenses[x].decEcoRealations) {
          arr.push(licenses[x].decEcoRealations[y].decGno + '-' + licenses[x].decEcoRealations[y].ecoGno)
        }
        if (arr.length > 0) {
          origStr.push(Ystr + arr.join('、'))
        }
      }
      docStr.push((licenses[x].docuCodeValue || '') + ' ' + (licenses[x].certCode || ''))
    }
    // 随附单证及编号 随附单证1 为 随附单证  随附单证2 为随附单据
    let strDoc = ''
    if (docStr.length > 0) {
      strDoc = '随附单证1: ' + docStr.join(';')
    }
    let billArr = []
    if (decHead.decEdocRealations !== null) {
      for (let z in decHead.decEdocRealations) {
        billArr.push(decHead.decEdocRealations[z].edocCodeValue)
      }
    }
    let billArrStr = ''
    if (billArr.length > 0) {
      billArrStr = ' 随附单证2: ' + billArr.join(';')
    }
    return {
      originRelation: origStr.join(','),
      docuAndcertCode: strDoc + billArrStr
    }
  },
  // 企业资质的格式化处理
  generateCompanyCer (decHead) {
    if (decHead.decCopLimits.length === 0) {
      return ''
    }
    let list = decHead.decCopLimits
    let value = []
    for (let i in list) {
      let str = '(' + (list[i].entQualiftypeCode || '') + ')' + ' ' + (list[i].entQualiftypeCodeValue || '') + ' ' + (list[i].entQualifNo || '')
      value.push(str)
    }
    return value.join(' ; ')
  },
  // 使用人格式化处理
  generateUserInfo (decHead) {
    if (decHead.decDecUsers.length === 0) {
      return ''
    }
    let list = decHead.decDecUsers
    let value = []
    for (let i in list) {
      let str = (list[i].useOrgpersonCode || '') + '(' + (list[i].useOrgpersonTel || '') + ')'
      value.push(str)
    }
    return value.join(' ; ')
  },
  // 检验检疫签证申报要素格式化处理
  generateInspDecElem (decHead) {
    if (decHead.decRequestCerts.length === 0) {
      return ''
    }
    let list = decHead.decRequestCerts
    let value = []
    for (let i in list) {
      let str = (list[i].appCertCode || '') + '(' + (list[i].appCertCodeValue || '') + ' ' + (list[i].applOri || '') + ' ' + (list[i].applCopyQuan || '') + ' )'
      value.push(str)
    }
    return value.join(' ; ')
  },
  generateDecVerifyContainerVOs (container, containerListConfigs) {
    let results = []
    let result = {}
    let config
    let key
    container && container.forEach((item, index) => {
      result = {}
      config = containerListConfigs[index]
      containerListItems.forEach(listItem => {
        key = listItem.key
        result[key + 'Color'] = config[key].color
        result[key + 'Note'] = config[key].value
      })
      result.decPid = item.decPid
      result.pid = item.pid
      results.push(result)
    })
    return results
  },
  generateDecVerifyHeadVO (decHead, headConfig) {
    let result = {}
    let key
    decHeadItems.forEach(item => {
      key = item.key
      result[key] = headConfig[key].color
      result[key + 'Note'] = headConfig[key].value
    })
    result.createUser = decHead.createUser
    result.decPid = decHead.decPid
    result.pid = decHead.pid
    return result
  },
  generateDecVerifyListVOs (deCheckList, listConfigs) {
    let results = []
    let result = {}
    let config
    let key
    deCheckList && deCheckList.forEach((item, index) => {
      result = {}
      config = listConfigs[index]
      decListItems.forEach(listItem => {
        key = listItem.key
        result[key + 'Color'] = config[key].color
        result[key + 'Note'] = config[key].value
      })
      result.decPid = item.decPid
      result.gNo = item.gNo
      result.pid = item.pid
      result.districtCodeAndColor = item.districtCodeAndColor
      result.gNoAllColor = item.gNoAllColor
      result.priceAndTotalColor = item.priceAndTotalColor
      result.createTime = item.createTime
      result.createUser = item.createUser
      results.push(result)
    })
    return results
  },
  generateReviewedLog (newData, oldData) {
    let decVerifyHeadVO = {}
    let decVerifyListVOs = []
    let decVerifyContainerVOs = []
    let decVerify = {}
    let decVerifyContainer = {}
    let newItems = this.generatePromiseItems(newData.decHeadVO)
    let oldItems = this.generatePromiseItems(oldData.decHeadVO)
    let newformatDecList = this.formatDecList(newData.decListVO, [])
    let oldformatDecList = this.formatDecList(oldData.decListVO, [])
    let newLicenseInfo = this.generateLicenseInfo(newData.decLicensesVO, newData.decHeadVO)
    let oldLicenseInfo = this.generateLicenseInfo(oldData.decLicensesVO, oldData.decHeadVO)
    let formatDecKeys = ['purpose', 'approveNo']
    let licenseKeys = ['originRelation', 'docuAndcertCode']
    decHeadItems.forEach(item => {
      if (item.relatedFields && item.relatedFields.length) {
        let note = ''
        item.relatedFields.forEach(field => {
          let oldValue = oldData.decHeadVO[field]
          let newValue = newData.decHeadVO[field]
          if (licenseKeys.indexOf(field) !== -1) {
            oldValue = oldLicenseInfo[field]
            newValue = newLicenseInfo[field]
          }
          if (formatDecKeys.indexOf(field) !== -1) {
            oldValue = oldformatDecList[field]
            newValue = newformatDecList[field]
          }
          if (field === 'decCopLimits') {
            oldValue = this.generateCompanyCer({decCopLimits: oldValue})
            newValue = this.generateCompanyCer({decCopLimits: newValue})
          }
          if (field === 'decRequestCerts') {
            oldValue = this.generateInspDecElem({decRequestCerts: oldValue})
            newValue = this.generateInspDecElem({decRequestCerts: newValue})
          }
          if (field === 'decDecUsers') {
            oldValue = this.generateUserInfo({decDecUsers: oldValue})
            newValue = this.generateUserInfo({decDecUsers: newValue})
          }
          if (field === 'promiseItem1') {
            oldValue = oldItems[0]
            newValue = newItems[0]
          }
          if (field === 'promiseItem2') {
            oldValue = oldItems[1]
            newValue = newItems[1]
          }
          if (field === 'promiseItem3') {
            oldValue = oldItems[2]
            newValue = newItems[2]
          }
          if (field === 'note') {
            oldValue = this.generateNote(oldData.decHeadVO, oldData.decContainersVO)
            newValue = this.generateNote(newData.decHeadVO, newData.decContainersVO)
          }
          if (field === 'specialFlag') {
            oldValue = this.generateSpecialFlag(oldData.decHeadVO)
            newValue = this.generateSpecialFlag(newData.decHeadVO)
          }
          if (oldValue !== newValue) {
            note += '更改' + (oldValue || '') + '为' + (newValue || '') + ','
          }
        })
        if (note) {
          decVerifyHeadVO[item.key + 'Note'] = note.substr(0, note.length - 1)
          decVerifyHeadVO[item.key] = 1
        }
      }
    })
    decVerifyHeadVO.decPid = newData.decHeadVO.decPid
    decVerifyHeadVO.auditOpinion = ''
    if (newData.decListVO.length === oldData.decListVO.length) {
      newData.decListVO.forEach((item, index) => {
        decVerify = {}
        decVerify.gNo = item.gNo
        decListItems.forEach(listItem => {
          if (listItem.relatedFields && listItem.relatedFields.length) {
            let note = ''
            listItem.relatedFields.forEach(field => {
              let oldValue = oldData.decListVO[index][field]
              let newValue = newData.decListVO[index][field]
              if (oldValue !== newValue) {
                note += '更改' + (oldValue || '') + '为' + (newValue || '') + ','
              }
            })
            if (note) {
              decVerify[listItem.key + 'Note'] = note.substr(0, note.length - 1)
              decVerify[listItem.key + 'Color'] = 1
            }
          }
        })
        decVerifyListVOs.push(decVerify)
      })
    }
    if (newData.decContainersVO.length === oldData.decContainersVO.length) {
      newData.decContainersVO.forEach((item, index) => {
        decVerifyContainer = {}
        containerListItems.forEach(listItem => {
          if (listItem.relatedFields && listItem.relatedFields.length) {
            let note = ''
            listItem.relatedFields.forEach(field => {
              let oldValue = oldData.decContainersVO[index][field]
              let newValue = newData.decContainersVO[index][field]
              if (oldValue !== newValue) {
                note += '更改' + (oldValue || '') + '为' + (newValue || '') + ','
              }
            })
            if (note) {
              decVerifyContainer[listItem.key + 'Note'] = note.substr(0, note.length - 1)
              decVerifyContainer[listItem.key + 'Color'] = 1
            }
          }
        })
        decVerifyContainerVOs.push(decVerifyContainer)
      })
    }
    return {
      'decVerifyHeadVO': decVerifyHeadVO, // 报关单表头
      'decVerifyListVOs': decVerifyListVOs, // 报关单 表体
      'decVerifyContainerVOs': decVerifyContainerVOs // 报关单集装箱
    }
  }
}
