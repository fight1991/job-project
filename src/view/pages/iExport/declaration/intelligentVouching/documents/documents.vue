<template>
  <!-- 表体——随附单证组件 -->
  <section class='sys-dec-class'>
    <div class="dec-div">
      <el-row>
        <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDoc" :disabled="controller.isDisabled || (controller.isDocument && controller.isWholeDec)">&nbsp;新增</el-button>
        <el-button size="mini" icon="fa fa-trash-o" class="secondButton" @click="delDoc" :disabled="controller.isDisabled || (controller.isDocument && controller.isWholeDec)">&nbsp;删除</el-button>
        <el-button size="mini" class="secondButton" @click="openOriginRel">原产地</el-button>
        <el-checkbox size="mini" v-model="billSync" :disabled="controller.isDisabled" class='document-checkbox' style='float:right' @change="changebillSync">智能清单同步</el-checkbox>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="licenselist"
            :height='190' style="width: 100%" size="mini"
            ref="decLicTable"
            highlight-current-row border
            @select="decLicCheckChange"
            @selection-change="decLicChange"
            @row-click= 'backDecLicInfo' >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="docuCode" label="单证代码" min-width="80">
              <template slot-scope="scope">
                <span v-show='scope.row.docuCode == "a" && scope.row.certCode !=="NA"' @click.stop='matchEMS(scope.row)' class='span-match'>匹配</span>
                <span>{{scope.row.docuCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="certCode" label="单证编号" min-width="100"></el-table-column>
        </el-table>
        </el-col>
      </el-row>
      <div>
        <el-form ref="docuRuleForm" :rules="docuRuleForm"
          @keyup.enter.native="switchFoucsByEnter"
          :model="decLicense" label-width="100px"  size="mini">
          <el-row>
            <el-col :span="24">
              <el-form-item label="随附单证代码"  :class="{ 'require-color': controller.requireColor }"  prop="docuCode">
                <el-select placeholder=" " v-model="decLicense.docuCode"
                  @focus="tipsFillMessage('docuCode', 'saasLicensedocu','SAAS_LICENSEDOCU')"
                  remote  default-first-option clearable  filterable
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasLicensedocu')"
                  @change= "docuCodeChanage"
                    ref="docuCode" dataRef ='docuCode'
                  :disabled="controller.isDisabled || (controller.isDocument && controller.isWholeDec)" style="width:100%">
                  <el-option
                    v-for="item in saasLicensedocu"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="随附单证编号"  :class="{ 'require-color': controller.requireColor }"  ref="certCode">
                <el-input v-model="decLicense.certCode" :readonly="controller.isDisabled || (controller.isDocument && controller.isWholeDec)" @change= "certCodeChange"
                  @focus="tipsFillMessage('certCode')"
                  :maxlength='32'
                  @keyup.enter.native="beforeSaveDecLic"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 弹出框 联系单备案商品信息列表 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="联系单备案商品信息列表"
      :visible.sync="manualGoodsVisabled"
      :close-on-click-modal='false'
      append-to-body
      class='sys-dec-dialog'
      width="800px">
      <manual-goods :initParams="initManualGoods" @close:manualGoods="backManualGoods" v-if="manualGoodsVisabled"></manual-goods>
    </el-dialog>
    <!-- 弹出框 联系单备案商品信息列表 结束 -->
    <!-- 原产地证 -->
    <origin-certificate :originRelVisible='originRelVisible' :decLicense="decLicense" :isDisabled='controller.isDisabled' :tableLength='tableListLength'  @close:originCertificate="backOriginCertificate"></origin-certificate>
    <!-- 核注清单查询企业信息 -->
    <select-company :selectCompanyVisiable='selectCompanyVisiable' :companyList="companyList" :emsType='emsType' @close:selectCompany="backSelectCompany"></select-company>
    <!-- 核注清单匹配信息 -->
    <match-ems :matchEmsVisiable='matchEmsVisiable' :compareResult="compareResult" @close:matchEms="backMatchEms"></match-ems>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../common/decUtil'
import originCertificate from '../documents/components/originCertificate'
import manualGoods from '../documents/components/manualGoods'
import selectCompany from '../documents/components/selectCompany'
import matchEms from '../documents/components/matchEms'
import decBus from '../common/bus.js'
export default {
  name: 'dec-documents',
  components: {
    originCertificate,
    selectCompany,
    matchEms,
    manualGoods
  },
  props: {
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      licenselist: [],
      initManualGoods: {},
      manualGoodsVisabled: false,
      billSync: false,
      checkedDecLicList: [], // 被选中的 随附单证 集装箱数据
      decLicense: this.resetDocumentsFrom(),
      originRelVisible: false,
      selectCompanyVisiable: false,
      matchEmsVisiable: false,
      compareResult: {},
      emsType: 'query',
      tableListLength: 0,
      docuRuleForm: {
        docuCode: [
          {validator: this.checkValid, message: '输入随附单证代码', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        // 随附单证
        'docuCode': '^[0-9a-zA-Z]{1,6}$' // 随附单证代码
      },
      head: {
        cusCiqNo: {filed: 'decSeqNo', name: '统一编号'}, // 统一编号 对应 报关单统一编号 备注：产品决定改为统一编号
        manualNo: {filed: 'putrecNo', name: '备案号'}, // 备案号 对应 手(账)册编号
        tradeCode: {filed: 'bizopEtpsno', name: '境内收发货人10位海关编码'}, // 境内收发货人10位海关编码 对应 经营单位编码
        tradeCoScc: {filed: 'bizopEtpsSccd', name: '境内收发货人18位社会信用代码'}, // 境内收发货人18位社会信用代码 对应 经营单位社会信用代码
        tradeName: {filed: 'bizopEtpsNm', name: '境内收发货人企业名称'}, // 境内收发货人企业名称 对应 经营单位名称
        ownerCode: {filed: 'rcvgdEtpsno', name: '消费使用单位10位海关编码'}, // 消费使用单位10位海关编码 对应 加工单位编码
        ownerCodeScc: {filed: 'rvsngdEtpsSccd', name: '消费使用单位18位社会信用代码'}, // 消费使用单位18位社会信用代码 对应 加工单位社会信用代码
        ownerName: {filed: 'rcvgdEtpsNm', name: '消费使用单位企业名称'}, // 消费使用单位企业名称 对应 加工单位名称
        agentCode: {filed: 'dclEtpsno', name: '申报单位10位海关编码'}, // 申报单位10位海关编码 对应 申报单位编码
        agentCodeScc: {filed: 'dclEtpsSccd', name: '申报单位18位社会信用代码'}, // 申报单位18位社会信用代码 对应 申报单位社会信用代码
        agentName: {filed: 'dclEtpsNm', name: '申报单位企业名称'}, // 申报单位企业名称 对应 申报单位名称
        tradeMode: {filed: 'supvModecd', name: '监管方式'}, // 监管方式 对应 监管方式
        trafMode: {filed: 'trspModecd', name: '运输方式'}, // 运输方式 对应 运输方式
        iEPort: {filed: 'impexpPortcd', name: '进境关别'}, // 进境关别 对应 进境关别/出境关别
        customMaster: {filed: 'dclPlcCuscd', name: '申报地海关'}, // 申报地海关 对应 主管海关
        tradeCountry: {filed: 'stshipTrsarvNatcd', name: '启运国地区/运抵国(地区)'} // 启运国地区/运抵国(地区) 对应 启运国(地区)/运抵国地区
      },
      body: {
        // gNo: {filed: 'gdsSeqno', name: '序号'}, // 序号 对应 序号
        contrItem: {filed: 'putrecSeqno', name: '备案序号'}, // 备案序号 对应 备案序号
        codeTs: {filed: 'gdecd', name: '商品编号'}, //  商品编号 对应  商品编号
        gName: {filed: 'gdsNm', name: '商品名称'}, // 商品名称 对应 商品名称
        gModel: {filed: 'gdsSpcfModelDesc', name: '规格型号'}, // 规格型号 对应 规格型号
        tradeCurr: {filed: 'dclCurrcd', name: '币制'}, // 币制 对应 币制
        gUnit: {filed: 'dclUnitcd', name: '成交计量单位'}, // 成交计量单位 对应 申报计量单位
        unit1: {filed: 'lawfUnitcd', name: '法定第一计量单'}, // 法定第一计量单 对应 法定计量单位
        unit2: {filed: 'secdLawfUnitcd', name: '法定第二计量单位'}, // 法定第二计量单位 对应 法定第二计量单位
        gQty: {filed: 'dclQty', name: '成交数量'}, // 成交数量 对应 申报数量
        qty1: {filed: 'lawfQty', name: '法定第一数量'}, // 法定第一数量 对应 法定数量
        qty2: {filed: 'secdLawfQty', name: '法定第二数量'}, // 法定第二数量 对应 法定第二数量
        declPrice: {filed: 'dclUprcAmt', name: '单价'}, // 单价 对应 企业申报单价
        declTotal: {filed: 'dclTotalAmt', name: '总价'}, // 总价 对应 企业申报总价
        originCountry: {filed: 'natcd', name: '原产国(地区）'}, // 原产国(地区） 对应 原产国(地区）
        destinationCountry: {filed: 'destinationNatcd', name: '最终目的国(地区）'}, // 最终目的国(地区） 对应 最终目的国(地区）
        dutyMode: {filed: 'lvyrlfModecd', name: '征免方式'} // 征免方式 对应 征免方式
      },
      selectObj: {
        obj: '',
        params: ''
      },
      saasLicensedocu: [],
      docuSelect: { // 随附单证
        'docuCode': {obj: 'saasLicensedocu', params: 'SAAS_LICENSEDOCU'} // 随附单证代码
      }
    }
  },
  watch: {
    licenselist: 'resetlic'
  },
  created () {
    this.billSync = window.localStorage.billSync === 'true'
    decBus.$on('setDocFieldToSate', this.setDocFieldToSate)
  },
  computed: {
    controller () {
      return this.$store.state[this.moduleName].controller
    },
    tipsNoteShow () {
      return this.$store.state[this.moduleName].tipsNoteShow
    },
    tipsNote () {
      return this.$store.state[this.moduleName].tipsNote
    },
    companyList () {
      return this.$store.state[this.moduleName].companyList
    },
    emsCompareResult () {
      return this.$store.state[this.moduleName].emsCompareResult
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    }
  },
  methods: {
    // 统计随附单证
    resetlic () {
      let arr = []
      if (this.licenselist.length > 0) {
        for (let i in this.licenselist) {
          arr.push(this.licenselist[i].docuCode)
        }
        this.$store.commit(this.moduleName + '/changeShow', {key: 'attaDocuCdstr', value: arr.join(',')})
      } else {
        this.$store.commit(this.moduleName + '/changeShow', {key: 'attaDocuCdstr', value: ''})
      }
    },
    checkValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['docuRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 清除 随附单证 新增数据
    refreshDoc () {
      this.decLicense = this.resetDocumentsFrom()
      this.saasLicensedocu = []
    },
    resetDocumentsFrom () {
      return { // 随附单证数据
        pid: '', // 主键
        decPid: '', // 外键
        certCode: '', // 单证编号
        docuCode: '', // 单证代码
        gNo: '', // 序号
        decEcoRealations: [] // 原产地证明
      }
    },
    // 删除随附单证
    delDoc () {
      let delData = this.checkedDecLicList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$confirm('确定删除选中数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.licenselist) {
              if (delData[index].docuCode === this.licenselist[item].docuCode) {
                if (delData[index].docuCode === 'c') {
                  decBus.$emit('modifyManualGoods', null)
                }
                this.licenselist.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedDecLicList = []
          // 重新 初始化 form表单
          this.refreshDoc()
        }).catch(() => {
        })
      }
    },
    // 获取 随附单证 被选中的值
    decLicChange (value) {
      this.checkedDecLicList = value
    },
    // 点击多选框时候的操作
    decLicCheckChange (selection, row) {
      let flag = false
      for (let i in selection) {
        if (selection[i].gNo === row.gNo) {
          flag = true
          break
        }
      }
      if (flag) {
        this.backDecLicInfo(row)
      } else {
        this.$refs.decLicTable.toggleRowSelection(row, false)
        this.refreshDoc()
      }
    },
    // 随附单证 判断重复的方法
    docuCodeChanage (value) {
      let index = -1
      index = this.licenselist.findIndex((item, i) => {
        return item.docuCode === value
      })
      if (index > -1) {
        this.decLicense.docuCode = ''
        this.saasLicensedocu = []
        this.$refs['docuCode'].focus()
        this.messageTips('随附单证代码不能重复')
      }
    },
    certCodeChange () {
      if (['Y', 'E', 'R', 'F', 'J', 'k', 'd'].includes(this.decLicense.docuCode)) {
        // 直接删除以前的原产地
        this.decLicense.decEcoRealations = []
      }
    },
    beforeSaveDecLic () {
      // 校验
      this.$refs['docuRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          if (this.decLicense.docuCode === 'U') {
            if (!/^[0-9A-Za-z]{12}:[0-9]{1,2}$/.test(this.decLicense.certCode)) {
              this.messageTips('随附单证代码U时，随附单证编号录入规则为12位通关证明编码:商品项号')
              return
            }
          }
          if (this.decLicense.docuCode === 'A') {
            if (!/^[0-9A-Za-z]{15}$|^[0-9A-Za-z]{18}$/.test(this.decLicense.certCode)) {
              this.messageTips('随附单证代码A时，随附单证编号录入规则固定为15位或18位字符')
              return
            }
          }
          if (this.decLicense.docuCode === 'a' && this.controller.funFlag === 'declaration') {
            if (!/^QD[0-9]{6}[IE]{1}[0-9]{9}$|^$/.test(this.decLicense.certCode)) {
              this.messageTips('随附单证代码a时，随附单证编号填写以QD开头的18位核注清单号')
              return
            }
            // 开放智能补录
            decBus.$emit('setBodyControllerFieldValue', {'isJinEr': true})
          }
          if (['Y', 'E', 'R', 'F', 'J', 'k', 'd'].includes(this.decLicense.docuCode)) {
            // 原产地证
            // 直接删除以前的原产地 原产地未发生变化不清空
            // this.decLicense.decEcoRealations = []
            this.openOriginRel()
          } else if (this.decLicense.docuCode === 'c' && this.controller.iEFlag === 'I') {
            // 去掉修改为相同值时的调用 或者为完整申报时
            if ((this.controller.cDisabled === true && !util.isEmpty(this.decLicense.gNo)) || this.controller.isWholeDec) {
              if (this.licenselist[+this.decLicense.gNo - 1].certCode === this.decLicense.certCode) {
                this.saveDecLic()
                return
              }
            }
            decBus.$emit('setHeadFieldToSate', 'manualNo')
            let manualNo = this.$store.state[this.moduleName].manualNo
            decBus.$emit('setHeadFieldToSate', 'tradeMode')
            let tradeMode = this.$store.state[this.moduleName].tradeMode
            // 打开联系单备案商品信息列表
            if (util.isEmpty(manualNo)) {
              this.messageTips('随附单证代码c时，备案号不可为空')
              return
            }
            if (!['0245', '0444', '0445', '0446', '0544', '0545', '0644', '0844', '0845'].includes(tradeMode)) {
              this.messageTips('随附单证代码c时,监管方式必须为0245、0444、0445、0446、0544、0545、0644、0844、0845')
              return
            }
            this.queryManualGoods()
          } else if (this.decLicense.docuCode === 'a') {
            if (this.billSync) {
              decBus.$emit('getHeadCompany', null)
              this.emsType = 'query'
              this.selectCompanyVisiable = true
            } else {
              this.saveDecLic()
            }
          } else {
            this.saveDecLic()
          }
        }
      })
    },
    // 改变智能清单初始设置
    changebillSync () {
      window.localStorage.billSync = this.billSync
    },
    // 查询联系单备案商品信息
    queryManualGoods () {
      decBus.$emit('setHeadFieldToSate', 'manualNo')
      let manualNo = this.$store.state[this.moduleName].manualNo
      decBus.$emit('setHeadFieldToSate', 'tradeMode')
      let tradeMode = this.$store.state[this.moduleName].tradeMode
      this.$post({
        url: 'API@/dec-common/dec/common/queryManualList',
        data: {
          'certCode': this.decLicense.certCode,
          'docuCode': this.decLicense.docuCode,
          'iEFlag': this.controller.iEFlag,
          'manualNo': manualNo,
          'tradeMode': tradeMode
        },
        success: (res) => {
          if (res.result !== null && res.result.length > 0) {
            this.initManualGoods = util.simpleClone(res.result)
            this.openManualGoods()
          } else {
            this.messageTips('查无联系单备案商品信息！')
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 保存 随附单证
    saveDecLic () {
      // 确报以前需要原产地对应信息，xiu改后又不需要原产地对应信息
      let arr = ['Y', 'E', 'R', 'F', 'J', 'k', 'd']
      if (!arr.includes(this.decLicense.docuCode)) {
        this.decLicense.decEcoRealations = []
      } else { // 如果是原产地, 防止单证编号修改而 对应关系里的单证编号没有被修改
        for (let n in this.decLicense.decEcoRealations) {
          let no = this.decLicense.certCode.split('>')
          if (no.length === 2) {
            this.decLicense.decEcoRealations[n].certType = this.decLicense.docuCode + no[0].replace('<', '')
            this.decLicense.decEcoRealations[n].ecoCertno = no[1]
          } else {
            this.decLicense.decEcoRealations[n].certType = this.decLicense.docuCode
            this.decLicense.decEcoRealations[n].ecoCertno = this.decLicense.certCode
          }
        }
      }
      if (this.decLicense.docuCode !== 'c' && util.isEmpty(this.decLicense.certCode)) {
        this.decLicense.certCode = 'NA'
      }
      let gNo = this.decLicense.gNo
      if (util.isEmpty(gNo)) { // 如果gNo 无值  走新增路线
        this.decLicense.gNo = this.licenselist.length + 1
        this.licenselist.push(util.simpleClone(this.decLicense))
      } else { // 如果gNo 有值  走修改路线
        for (let i in this.licenselist) {
          if (this.licenselist[i].gNo === gNo) {
            // 如果 修改是从c改变的。则需要清除表体数据,不为完整申报时
            if (this.licenselist[i].docuCode === 'c' && this.decLicense.docuCode !== 'c' && this.controller.iEFlag === 'I' && !this.controller.isWholeDec) {
              decBus.$emit('modifyManualGoods', null)
            }
            this.licenselist[i] = this.decLicense
            // 为了刷新列表的 操作
            this.licenselist.push({})
            this.licenselist.pop()
            break
          }
        }
      }
      this.refreshDoc()
    },
    // 打开 原产地对应关系 弹出框
    openOriginRel () {
      let str = this.decLicense.docuCode
      let isFlag = false
      let arr = ['Y', 'E', 'R', 'F', 'J', 'k', 'd']
      for (let i in arr) {
        if (str === arr[i]) {
          isFlag = true
        }
      }
      if (isFlag) {
        // TODO
        decBus.$emit('setTableListToSate', null)
        this.tableListLength = this.$store.state[this.moduleName].tableList.length
        this.originRelVisible = true
      } else {
        this.messageTips('单证代码不是Y/E/R/F/J/k/d!')
      }
    },
    // 原产地证回参
    backOriginCertificate (param) {
      this.decLicense.decEcoRealations = util.simpleClone(param.decEcoRealations)
      // 防止快速点击原产地的x关闭原产地证
      if (!this.decLicense.docuCode) {
        return
      }
      this.saveDecLic()
      this.originRelVisible = false
    },
    // 单击 随附单证 反填 数据
    backDecLicInfo (row) {
      this.$refs.decLicTable.toggleRowSelection(row, true)
      this.setValueForDecLicForm(row)
    },
    setValueForDecLicForm (data) {
      this.decLicense = util.simpleClone(data)
      this.initDocumentsSelect(this, this.docuSelect, this.decLicense)
    },
    // 打开 联系单备案商品信息列表
    openManualGoods () {
      this.manualGoodsVisabled = true
    },
    backManualGoods (pramas) {
      if (pramas !== null) {
        decBus.$emit('setManualGoods', {params: pramas})
        this.saveDecLic()
      }
      this.manualGoodsVisabled = false
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
    },
    checkParamsList (query, type = 'select') {
      decUtil.selectSearch(this, query, type)
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      decUtil.switchFoucsByEnter(e, this.foucsByEnter)
    },
    foucsByEnter (e, next, secondNext) {
      // 下个元素存在
      if (next) {
        if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
          return false
        } else {
          next.focus()
          next.select()
        }
      }
    },
    backSelectCompany (param) {
      if (param !== null) {
        // 查询核注清单数据 此查询 需要覆盖规格型号和表体商品的境内目的地/货源地代码
        if (param.emsType === 'query') {
          // 查询核注清单并且反填
          this.queryAndBackData(param)
        } else if (param.emsType === 'match') {
          // 查询核注清单并且匹配
          this.queryAndMacthData(param)
        }
      } else {
        this.selectCompanyVisiable = false
      }
    },
    // 查询数据 直接反填
    queryAndBackData (param) {
      this.$post({
        url: 'API@/dec-common/dec/ems/getSingleInvt',
        data: {
          'bondInvtNo': this.decLicense.certCode,
          'tradeCode': param.customCode,
          'type': '1' // 掉单一数据 重设gModel
        },
        success: (res) => {
          // 回填数据
          if (res.result) {
            let headVo = res.result.invtHeadType
            headVo['decSeqNo'] = res.result.decSeqNo
            // 若原本报关单中有数据，选择了核注清单并且同步后，原报关单中数据会清空，并用核注清单中的数据覆盖回填
            // 1. 先清空原有的表头和表体数据 只保留 状态 报关单的类型 decPid等关键字段
            decBus.$emit('resetHeadData', headVo, this.head)
            // 表体
            decBus.$emit('emsDataBack', res.result.invtListType, this.body)
            this.saveDecLic()
            this.selectCompanyVisiable = false
          } else {
            this.messageTips('未能查找到您所填写的核注清单，请再次进行确认')
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
          this.selectCompanyVisiable = false
        }
      })
    },
    queryAndMacthData (param) {
      this.$post({
        url: 'API@/dec-common/dec/ems/getSingleInvt',
        data: {
          'bondInvtNo': this.decLicense.certCode,
          'tradeCode': param.customCode,
          'type': '0' // 不用覆盖gModel
        },
        success: (res) => {
          if (res.result) {
            // 有数据 匹配
            let headVo = res.result.invtHeadType
            headVo['decSeqNo'] = res.result.decSeqNo
            this.compareDecAndEms(headVo, res.result.invtListType)
            let compareResult = this.emsCompareResult
            // 如果统一编号不匹配的前提下报错
            if (compareResult.tips.length > 0) {
              this.messageTips(compareResult.tips)
              return
            }
            if (compareResult.compareHead.length === 0 && compareResult.compareBody.length === 0) {
              // 如果对比结果有没有差异则直接提示
              this.$alert('当前核注清单与报关单完全匹配', '提示', {
                modalAppendToBody: true,
                domMount: this.$el.parentNode,
                confirmButtonText: '确定',
                type: 'success',
                callback: action => {
                  this.selectCompanyVisiable = false
                }
              })
            } else {
              // 对比结果有差异 则显示对比框
              // 设置初始化值
              this.compareResult = {
                compareHead: compareResult.compareHead,
                compareBody: compareResult.compareBody,
                tips: compareResult.tips
              }
              this.matchEmsVisiable = true
            }
          } else {
            // 无数据
            this.messageTips('未能查找到您所填写的核注清单，请再次进行确认')
          }
        }
      })
    },
    matchEMS (row) {
      this.backDecLicInfo(row)
      // 1. 通过随附单据编号 直接到系统查询 有没有核注清单 如果有则直接进入
      if (this.decLicense.certCode) {
        this.$post({
          url: 'API@/dec-common/dec/ems/getInvt',
          data: {'bondInvtNo': this.decLicense.certCode},
          success: (res) => {
            if (!util.isEmpty(res.result.head)) {
              // 如果有值 进入对比
              // 有数据 匹配 如果
              this.compareDecAndEms(res.result.head, res.result.bodys)
              let compareResult = this.emsCompareResult
              // 如果统一编号不匹配的前提下报错
              if (compareResult.tips.length > 0) {
                this.messageTips(compareResult.tips)
                return
              }
              if (compareResult.compareHead.length === 0 && compareResult.compareBody.length === 0) {
                // 如果对比结果有没有差异则直接提示
                this.$alert('当前核注清单与报关单完全匹配', '提示', {
                  modalAppendToBody: true,
                  domMount: this.$el.parentNode,
                  confirmButtonText: '确定',
                  type: 'success',
                  callback: action => {
                  }
                })
              } else {
                // 对比结果有差异 则显示对比框
                // 设置初始化值
                this.compareResult = {
                  compareHead: compareResult.compareHead,
                  compareBody: compareResult.compareBody,
                  tips: compareResult.tips
                }
                this.matchEmsVisiable = true
              }
            }
          },
          other: (res) => {
            // 如果本地没有数据 则先显示选择公司的弹出框
            decBus.$emit('getHeadCompany', null)
            this.emsType = 'match'
            this.selectCompanyVisiable = true
          }
        })
      }
    },
    // 对比核注清单和报关单
    compareDecAndEms (headVo, bodyVo) {
      this.$emit('compareDecAndEms', {
        headVo: headVo,
        bodyVo: bodyVo,
        head: this.head,
        body: this.body
      })
    },
    backMatchEms (param) {
      if (param !== null) {
        // 反填数据
        // 表头赋值
        decBus.$emit('emsDataHeadBack', param.compareHead)
        // 表体赋值
        decBus.$emit('emsDataBackAll', param.compareBody, param.coverFlag)
        this.matchEmsVisiable = false
        this.selectCompanyVisiable = false
      } else {
        this.matchEmsVisiable = false
        this.selectCompanyVisiable = false
        this.$refs['certCode'].$children[1].focus()
        this.$refs['certCode'].$children[1].select()
      }
    },
    // 提供给外面调用
    initDocumentsSelect () {
      decUtil.initSelect(this, this.docuSelect, this.decLicense)
    },
    getDocumentsDetail (listVo) {
      this.licenselist = util.simpleClone(listVo)
    },
    initDocumentsData () {
      this.decLicense = this.resetDocumentsFrom()
      this.licenselist = []
      // this.saasLicensedocu = []
      if (this.controller.iEFlag === 'I') { // 进口
        decBus.$emit('setHeadFieldValue', {'iEDate': decUtil.getTodayDate()})
      }
    },
    clearDocumentsData () {
      this.decLicense.pid = ''
      this.decLicense.decPid = ''
      for (let n in this.licenselist) {
        this.licenselist[n].pid = ''
        this.licenselist[n].decPid = ''
      }
    },
    setDocFieldToSate () {
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'licenselist', value: this.licenselist})
    }
  }
}
</script>
<style lang="less" scoped>
@import '../common/decCss';
.span-match {
    font-size: 12px;
    background-color: #096AC6;
    color: #fff;
    margin-right: 5px;
    cursor: pointer;
}
</style>
