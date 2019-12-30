export default{
  generateDecHead () {
    return {
      preEntryId: '', // 预录入编号
      bossId: '', // 关联编号(台账编号)
      clientSeqno: '', // 客户端报关单编号
      seqNo: '', // 统一编号
      cusCiqNo: '', // 关检关联号
      entryId: '', // 海关编号
      agentCode: '', // 申报单位海关代码
      agentCodeScc: '', // 申报单位信用代码
      agentName: '', // 申报单位名称
      billNo: '', // 提单号
      blno: '', // B/L号提货单号
      bonNo: '', // 保税/监管场地
      chkBond: '0', // 自主报税
      chkPayment: '0', // 自报自缴
      chkSurety: '0', // 担保验放
      chkTax: '0', // 税单无纸化
      chkOther: '0', // 水运中转
      cmplDschrgDt: '', // 卸毕日期
      consigneeCode: '', // 境内收发货人10位检验检疫编码
      contrNo: '', // 合同协议号
      correlationReasonFlag: '', // 关联理由
      correlationaNo: '', // 关联号码
      cusFie: '', // 场地代码
      customMaster: '', // 申报地海关
      customMasterValue: '', // 申报地海关名称
      cutMode: '', // 征免性质
      isExamine: '', // 系统状态
      cutModeValue: '', // cutModeValue
      decCopLimits: [], // 企业资质
      decDecUsers: [], // 使用人
      decEdocRealations: [], // 随附单据
      decMarkLobs: [], // 标记号码 标记唛码附件
      decRequestCerts: [], // 所需单证
      decSign: {}, // 标签签名
      declRegNo: '', // 申报单位10位检验检疫编码
      despDate: '', // 启运日期
      dDate: '', // 申报日期
      despPortCode: '', // 启运港代码
      despPortCodeValue: '', // 启运港名称
      distinatePort: '', // 经停港/指运港
      distinatePortValue: '', // 经停港/指运港名称
      domesticConsigneeEname: '', // 境内收货人名称（外文）
      entryType: '', // 报关单类型
      entyPortCode: '', // 入境/离境口岸代码
      entyPortCodeValue: '', // 入境/离境口岸名称
      feeCurr: '', // 运费币制
      feeMark: '', // 运费类型
      feeRate: '', // 运费
      goodSplace: '', // 存放地点
      grossWt: '', // 毛重
      iEDate: '', // 进出口日期
      iEFlag: '', // 进出口标识
      iEPort: '', // 进出境关别
      iEPortValue: '', // 进出境关别名称
      inspOrgCode: '', // 口岸检验检疫机关
      insurCurr: '', // 保费币制
      insurMark: '', // 保费类型
      insurRate: '', // 保费
      licenseNo: '', // 许可证号
      manualNo: '', // 备案号
      markNo: '', // 标记唛码
      netWt: '', // 净重
      noteS: '', // 备注
      orgCode: '', // 检验检疫受理机关
      origBoxFlag: '', // 原集装箱标识
      otherCurr: '', // 杂费币制
      otherMark: '', // 杂费类型
      otherRate: '', // 杂费
      otherPacks: [], // 其他包装
      overseasConsigneeCname: '', // 境外收货人名称(中文)
      overseasConsigneeEname: '',
      overseasConsignorAddr: '', // 境外发货人地址
      overseasConsignorCode: '', // 境外发货人代码
      overseasConsignorEname: '', // 境外发货人名称（外文）
      ownerCiqCode: '', // 消费使用单位10位检验检疫编码
      ownerCode: '', // 消费使用单位海关十位
      ownerCodeScc: '', // 消费生产使用单位信用代码
      ownerName: '', // 消费使用单位名称
      packNo: '', // 件数
      promiseItmes: '', // 其他事项确认
      purpOrgCode: '', // 目的地检验检疫机关
      relId: '', // 关联报关单号
      relManno: '', // 关联备案号
      specDeclFlag: '', // 特种业务标识
      specDeclFlag2: '', // 特种业务标识(直通放行、外交礼遇、转关)
      decPid: '', // 报关单主键
      tradeAreaCode: '', // 贸易国(地区)
      tradeAreaCodeValue: '', // 贸易国(地区)名称
      tradeCoScc: '', // 境内收发货人统一社会代码
      tradeCode: '', // 境内收发货人海关十位
      tradeCountry: '', // 启运国（地区）/运抵国（地区）
      tradeCountryValue: '', // 启运国（地区）/运抵国（地区）名称
      tradeMode: '', // 监管方式
      tradeModeValue: '', // 监管方式名称
      tradeName: '', // 境内收发货人名称
      trafMode: '', // 运输方式代码
      trafModeValue: '', // 运输方式代码名称
      trafName: '', // 运输工具代码名称
      transMode: '', // 成交方式
      transModeValue: '', // 成交方式名称
      voyageNo: '', // 航次号
      voyageNoValue: '', // 航次号名称
      vsaOrgCode: '', // 领证机关
      wrapType: '', // 包装种类
      wrapTypeValue: '', // 包装种类名称
      status: '', // 报关单状态
      statusValue: '', // 报关单状态名称
      gEnName: '', // 商品英文名称
      remarkInfo: '', // 附注
      declTrnrel: '', // 报关/转关关系标志
      billtype: '', // 备案清单类型
      decRoyaltyFeeVO: null // 特许权使用费
    }
  },
  generateDecBody () {
    return {
      decListPid: '', // 表体主键
      decPid: '', // 报关单主键
      ciqName: '', // 检验检疫名称
      codeTs: '', // 商品编号
      contrItem: '', // 备案序号
      dangName: '', // 危险货物名称
      dangPackSpec: '', // 危包规格
      dangPackType: '', // 危包类别
      decGoodsLimits: [], // 产品资质
      declPrice: '', // 单价
      declTotal: '', // 总价
      destCode: '', // 目的地代码
      destinationCountry: '', // 最终目的国（地区）
      districtCode: '', // 最终目的国（地区）名称
      dutyMode: '', // 征减免税方式
      engManentCnm: '', // 境外生产企业名称
      exgNo: '', // 货号
      exgVersion: '', // 版本号
      gModel: '', // 规格型号
      controlMa: '', // 监管要求
      gName: '', // 商品名称
      gNo: '', // 项号
      gQty: '', // 成交数量
      gUnit: '', // 成交计量单位
      gUnitValue: '', // 成交计量单位名称
      goodsAttr: '', // 货物属性 code
      goodsBrand: '', // 货物品牌
      goodsModel: '', // 货物型号
      stuffNote: '', // 成分/原料/组分
      goodsSpec: '', // 货物规格
      noDangFlag: '', // 非危险化学品
      origPlaceCode: '', // 原产地区代码
      originCountry: '', // 原产国
      originCountryValue: '', // 原产国名称
      prodBatchNo: '', // 生产批号
      mnufctrRegno: '', // 生产单位代码
      prodQgp: '', // 产品保质期
      prodValidDt: '', // 产品有效期
      produceDate: '', // 生产日期
      purpose: '', // 用途
      qty1: '', // 法定第一数量
      qty2: '', // 法定第二数量
      tradeCurr: '', // 币制
      tradeCurrValue: '', // 币制名称
      unCode: '', // N编码
      unit1Value: '', // 法定第一计量单位名称
      unit1: '', // 法定第一计量单位
      unit2: '', // 法定第二计量单位
      unit2Value: '', // 法定第二计量单位名称
      decSupplements: [], // 补充申报
      declGoodsEname: '', // 申报货物名称（外文）
      ciqCode: '', // CIQ代码
      ref1: '' // 存放GTIN号
    }
  },
  generateDecAiHeadColor () {
    return {
      agentCode: 0, // 申报单位海关代码
      agentCodeScc: 0, // 申报单位信用代码
      agentName: 0, // 申报单位名称
      billNo: 0, // 提单号
      blno: 0, // B/L号提货单号
      consigneeCode: 0, // 境内收发货人10位检验检疫编码
      contrNo: 0, // 合同协议号
      customMaster: 0, // 申报地海关
      cutMode: 0, // 征免性质
      declRegNo: 0, // 申报单位10位检验检疫编码
      dDate: 0, // 申报日期
      despPortCode: 0, // 启运港代码
      distinatePort: 0, // 经停港/指运港
      entryType: 0, // 报关单类型
      entyPortCode: 0, // 入境/离境口岸代码
      feeCurr: 0, // 运费币制
      feeMark: 0, // 运费类型
      feeRate: 0, // 运费
      goodSplace: 0, // 存放地点
      grossWt: 0, // 毛重
      iEDate: 0, // 进出口日期
      iEPort: 0, // 进出境关别
      insurCurr: 0, // 保费币制
      insurMark: 0, // 保费类型
      insurRate: 0, // 保费
      licenseNo: 0, // 许可证号
      manualNo: 0, // 备案号
      markNo: 0, // 标记唛码
      netWt: 0, // 净重
      noteS: 0, // 备注
      otherCurr: 0, // 杂费币制
      otherMark: 0, // 杂费类型
      otherRate: 0, // 杂费
      overseasConsigneeEname: 0,
      overseasConsignorCode: 0, // 境外发货人代码
      overseasConsignorEname: 0, // 境外发货人名称（外文）
      ownerCiqCode: 0, // 消费使用单位10位检验检疫编码
      ownerCode: 0, // 消费使用单位海关十位
      ownerCodeScc: 0, // 消费生产使用单位信用代码
      ownerName: 0, // 消费使用单位名称
      packNo: 0, // 件数
      tradeAreaCode: 0, // 贸易国(地区)
      tradeCoScc: 0, // 境内收发货人统一社会代码
      tradeCode: 0, // 境内收发货人海关十位
      tradeCountry: 0, // 启运国（地区）/运抵国（地区）
      tradeMode: 0, // 监管方式
      tradeName: 0, // 境内收发货人名称
      trafMode: 0, // 运输方式代码
      trafName: 0, // 运输工具名称
      transMode: 0, // 成交方式
      voyageNo: 0, // 航次号
      wrapType: 0 // 包装种类
    }
  },
  generateDecAiBodyColor () {
    return {
      // ciqName: 0, // 检验检疫名称
      codeTs: 0, // 商品编号
      contrItem: 0, // 备案序号
      declPrice: 0, // 单价
      declTotal: 0, // 总价
      destCode: 0, // 目的地代码
      destinationCountry: 0, // 最终目的国（地区）
      districtCode: 0, // 最终目的国（地区）名称
      dutyMode: 0, // 征减免税方式
      exgNo: 0, // 货号
      exgVersion: 0, // 版本号
      gModel: 0, // 规格型号
      gName: 0, // 商品名称
      // gNo: 0, // 项号
      gQty: 0, // 成交数量
      gUnit: 0, // 成交计量单位
      // origPlaceCode: 0, // 原产地区代码 进口才有
      originCountry: 0, // 原产国
      qty1: 0, // 法定第一数量
      // qty2: 0, // 法定第二数量
      tradeCurr: 0 // 币制
      // unit1: 0, // 法定第一计量单位
      // unit2: 0 // 法定第二计量单位
    }
  }
}
