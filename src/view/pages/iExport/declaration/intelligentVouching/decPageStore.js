export default {
  namespaced: true,
  state () {
    return {
      controller: {
        operationType: 'add', // 记录操作类型  详情 新增  修改
        iEFlag: 'I', // 记录是进口页面还是出口页面 I E
        funFlag: 'declaration', // 功能页面 declaration 报关单 recordList 备案清单 summary 概要申报的完整申报
        declTrnrel: '', // 0 报关单   2 备案清单
        pid: '', // 报关单id
        isDisabled: false, // 判断 input button 禁用
        requireColor: true, // 显示必填的颜色
        accDocDisabled: true, // 控制 随附单据 按钮的字段
        initTemplateBtn: false, // 控制初始值模板按钮
        userName: '', // 当前登陆人姓名
        agentName: '', // 申报企业名称
        districtCode: '',
        ocrShow: false, // 如果未ocr识别过来 则为true
        cDisabled: false, // 当由c单证时 控制输入项
        userId: '',
        showCheckTips: false, // 审核结果的显示
        isWholeDec: false, // 是否是概要申报申报之后的完整申报 与 概要申报未申报之前的完善申报做出区分 概要申报之前的完整申报数据在概要申报表，申报之后在报关单表
        isSummary: false, // 概要申报
        isDocument: false, // 是否涉证
        isCIQ: false, // 否是涉检
        isTax: false, // 是否涉税
        codeTsDisabled: false
      },
      showFied: {
        attaDocuCdstr: '', // 随附单证
        contaCount: '', // 集装箱数
        entQualifTypeCodeS: '', // 企业资质类别
        entQualifTypeCodeSName: '', // 企业资质编号
        entQualifTypeGNo: '' // 企业资质编号 gNo
      },
      goodsEnNameList: [], // 商品英文名称List
      tipsNote: '', // 提示 正确的输入
      tipsNoteShow: false, // 输入提示栏是否显示
      swtichCheck: 'Y', // 审核开关
      isDirectDec: 'N', // 是否直接申报
      switch: {}, // 所有的开关 主要用于逻辑检控
      charterDis: true,
      companyList: [], // 选择公司
      emsCompareResult: {
        tips: '',
        compareHead: [],
        compareBody: []
      },
      // 各模块的数据
      manualNo: '',
      tradeMode: '',
      tradeCountry: '',
      tradeName: '',
      distinatePort: '',
      cutMode: '',
      ownerCode: '',
      tradeAreaCode: '',
      noteS: '',
      otherPacks: [],
      licenselist: [],
      tableList: [],
      showCustomsCode: false // 是否显示参数代码 CCBA+2.10/2
    }
  },
  mutations: {
    changeDecPage (state, {key, value}) {
      if (state[key] !== undefined) {
        Object.assign(state, {[key]: value})
      }
    },
    changeShow (state, {key, value}) {
      if (state.showFied[key] !== undefined) {
        Object.assign(state.showFied, {[key]: value})
      }
    }
  },
  actions: {
  },
  getters: {
  }
}
