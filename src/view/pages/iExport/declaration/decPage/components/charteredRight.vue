<template>
  <section>
    <div class="charter-form">
      <div class="border">
        <el-form ref="charterForm" :model="charterForm" :rules="charterRules" size="mini" label-width="250px" @keyup.enter.native="switchFoucsByEnter">
          <el-row>
            <el-col :span="12">
              <el-form-item label="应税特许权使用费金额" prop="royaltyAmount" :class="{'require-color': controller.requireColor}">
                <el-input v-model="charterForm.royaltyAmount" :disabled="isDetail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="币制" :class="{'require-color': controller.requireColor}">
                <el-select placeholder=" " v-model="charterForm.currName" :disabled="isDetail"
                  @focus="tipsFillMessage('tradeCurr', 'saasCurr4','SAAS_CURR')"
                  remote clearable filterable   default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCurr4')"
                  ref="tradeCurr" dataRef ='tradeCurr'
                  style="width:100%" >
                  <el-option
                    v-for="item in saasCurr4"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="应税特许权使用费类型" :class="{'require-color': controller.requireColor,'disable-color':isDetail}">
                <el-checkbox-group v-model="preDecRoyaltyFee" :disabled="isDetail">
                  <el-checkbox v-for="(item,index) in rightTypeList" :key="item.value+index" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否已经过海关审查确定" :class="{'disable-color':isDetail}">
                <el-radio-group v-model="charterForm.isCusAudit" :disabled="isDetail">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否已向海关申请价格预裁定" :class="{'disable-color':isDetail}">
                <el-radio-group v-model="charterForm.isCusPricePreDetermin" :disabled="isDetail">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="价格预裁定决定书编号">
                <el-input v-model="charterForm.pricePreDeterminNo" :disabled="isDetail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="特许权使用费合同/协议编号" :class="{'require-color': controller.requireColor}">
                <el-input v-model="charterForm.contractNo" :disabled="isDetail"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同/协议签订时间" :class="{'require-color': controller.requireColor}">
                <el-date-picker v-model="charterForm.issueDateTime" :disabled="isDetail" type="date" :editable='false' style="width:100%;" placeholder=" " format='yyyy-MM-dd' value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同/协议起始执行时间" :class="{'require-color': controller.requireColor}">
                <el-date-picker v-model="charterForm.effectiveDateTime" :disabled="isDetail" type="date" :editable='false' style="width:100%;" placeholder=" " format='yyyy-MM-dd' value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同/协议终止时间" :class="{'require-color': controller.requireColor}">
                <el-date-picker v-model="charterForm.expirationDateTime" :disabled="isDetail" type="date" :editable='false' style="width:100%;" placeholder=" " format='yyyy-MM-dd' value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="与进口货物有关的特许权许可方或转让方" :class="{'require-color': controller.requireColor}">
                <el-input v-model="charterForm.authorizer" :disabled="isDetail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="与进口货物有关的特许权被许可方或受让方" :class="{'require-color': controller.requireColor}">
                <el-input v-model="charterForm.authorizedPerson" :disabled="isDetail"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应税特许权使用费支付方式" :class="{'require-color': controller.requireColor,'disable-color':isDetail}">
                <el-radio-group v-model="charterForm.payType" :disabled="isDetail">
                  <el-radio label="0">一次性支付</el-radio>
                  <el-radio label="1">定期支付</el-radio>
                  <el-radio label="2">其他支付方式</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本次支付时间" :class="{'require-color': controller.requireColor}">
                <el-date-picker v-model="charterForm.payTime" :disabled="isDetail" type="date" :editable='false' style="width:100%;" placeholder=" " format='yyyy-MM-dd' value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="定期支付计提周期" prop="payPeriod">
                <el-row>
                  <el-col :span="20">
                    <el-input v-model="charterForm.payPeriod" :disabled="isDetail"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <div class="borderR">&nbsp;月</div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本次支付对应的计提周期起止时间">
                <el-row>
                  <el-col :span="11">
                    <el-date-picker v-model="charterForm.periodStartDate" :disabled="isDetail" type="date" :editable='false' style="width:100%;" placeholder=" " format='yyyy-MM-dd' value-format="yyyy-MM-dd"></el-date-picker>
                  </el-col>
                  <el-col :span="2">
                    <div class="borderR txt-c">至</div>
                  </el-col>
                  <el-col :span="11">
                    <el-date-picker v-model="charterForm.periodEndDate" :disabled="isDetail" type="date" :editable='false' style="width:100%;" placeholder=" " format='yyyy-MM-dd' value-format="yyyy-MM-dd"></el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="随附材料清单(有关材料附后)" :class="{'require-color': controller.requireColor,'disable-color':isDetail}" class="charter-more-item">
                <el-checkbox-group v-model="edocType" :disabled="isDetail">
                  <el-checkbox v-for="(item,index) in edocTypeList" :key="item.value+index" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="说明" :class="{'require-color': controller.requireColor}" class="charter-textarea">
                <el-input v-model="charterForm.statment" :disabled="isDetail"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="对以上申报内容是否需要海关予以保密？" :class="{'require-color': controller.requireColor,'disable-color':isDetail}">
                <el-radio-group v-model="charterForm.isSecret" :disabled="isDetail">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="borderR txt-c">兹申明对本申报表各项填报内容及随附材料的真实性和完整性承担法律责任。</div></el-col>
            <el-col :span="12">
              <el-form-item label="申报人">
                <el-input v-model="charterForm.opName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="charter-title txt-c">填报说明</div>
      <div class="charter-intro">
        <p>一、申报人对特许权使用费合同/协议项下当次支付的应税特许权使用费进行申报。</p>
        <p>二、“应税特许权使用费金额”和“币制”栏目为必填项，填写已支付的金额和币制。</p>
        <p>三、“应税特许权使用费类型”栏目为必填项。</p>
        <p>四、“是否已经过海关审查确定”、“是否已向海关申请价格预裁定”和“价格预裁定决定书编号”栏目为非必填项。对于此前已经海关审查确定应税特许权使用费的，申报人应在“是否已经过海关审查确定”栏目中勾选“是”，并在“说明”栏中填写相关情况，同时提供相应资料。对于此前已向海关申请价格预裁定的，应在“是否已向海关申请价格预裁定”栏目中勾选“是”，并在“说明”栏中填写相关情况，同时提供相应资料。其中，已于此前已获得价格预裁定决定书的，应在“价格预裁定决定书编号”栏目中填写价格预裁定决定书的编号。不存在上述情形的，相关栏目无需填写。本次申报如果存在与此前海关审查确定或价格预裁定内容不一致的，申报人应在“说明”栏中说明不一致的有关内容，包括合同、进口商、贸易方式、商品范围及其他不一致的内容。</p>
        <p>五、“特许权使用费合同/协议编号”、“合同/协议签订时间”、“合同/协议起始执行时间”、“合同/协议终止时间”、“与进口货物有关的特许权许可方或转让方”和“与进口货物有关的特许权被许可方或受让方”栏目为必填项。申报人应填写载明特许权使用费支付条款的合同/协议或特许权使用费合同/协议的起始执行时间和终止时间。如果合同/协议约定为一次性支付特许权使用费，应在“合同/协议终止时间”栏填写与“合同/协议起始执行时间”栏相同的时间；如果合同/协议未明确约定终止时间，“合同/协议终止时间”栏目填写为合同/协议起始执行之日后10年。</p>
        <p>六、“应税特许权使用费支付方式”和“本次支付时间”栏目为必填项，“定期支付计提周期”和“本次支付对应的计提周期起止时间”栏目为非必填项。“应税特许权使用费支付方式”勾选“一次性支付”的，需填写“本次支付时间”栏目，无需填写“定期支付计提周期”和“本次支付对应的计提周期起止时间”栏目。“应税特许权使用费支付方式”勾选“定期支付”的，需填写“本次支付时间”、“定期支付计提周期”和“本次支付对应的计提周期起止时间”栏目。其中，“定期支付计提周期”栏按月为单位填写，“本次支付对应的计提周期起止时间”栏填写本次支付对应的合同/协议约定的计提周期起止时间。“应税特许权使用费支付方式”勾选“其他支付方式”的，需填写“本次支付时间”栏目，无需填写“定期支付计提周期”栏和“本次支付对应的计提周期起止时间”栏，并在“说明”栏中填写相关情况，同时提供相应资料。</p>
        <p>七、申报人申报应税特许权使用费，需提供以下材料：（一）应税特许权使用费涉及的原进口货物报关单海关编号；1.当次支付的应税特许权使用费对应单份报关单的，提供原进口货物报关单海关编号；2.当次支付的应税特许权使用费对应多份报关单或多项进口货物的，应在随附材料清单中填写与该特许权使用费有关的报关单海关编号及相关货物情况，在“说明”栏填写特许权使用费分摊到相关报关单或相关货物的分摊方法，并提供分摊特许权使用费所使用的会计原则及客观量化的数据资料。（二）特许权使用费合同/协议、发票、特许权使用费支付凭证；（三）企业从税务部门获得的代扣代缴税款纳税凭证；（四）对照《审价办法》第十三条和第十四条的规定，就“特许权使用费是否与进口货物有关”及“特许权使用费的支付是否构成进口货物向中华人民共和国境内销售的条件”提供相关书面说明。</p>
      </div>
    </div>
    <div class="txt-c charter-btn">
      <el-button size="mini" type="primary" @click="confirmData" :disabled="isDetail">确定</el-button>
      <el-button size="mini" @click="closeDialog" :disabled="isDetail">取消</el-button>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'

export default {
  data () {
    return {
      isDetail: false, // 是否是详情
      preDecRoyaltyFee: [], // 应税特许权使用费类型
      edocType: [], // 随附材料清单
      charterForm: {
        pid: '', // 主键
        decPid: '', // 报关单主键
        royaltyAmount: '', // 应税特许权使用费金额
        currName: '', // 币制
        currNameValue: '', // 币制名称
        royaltyFeeType: '', // 应税特许权使用费类型
        isCusAudit: '', // 是否已经过海关审查确定
        isCusPricePreDetermin: '', // 是否已向海关申请价格预裁定
        pricePreDeterminNo: '', // 价格预裁定决定书编号
        contractNo: '', // 特许权使用费合同/协议编号
        issueDateTime: '', // 合同/协议签订时间
        effectiveDateTime: '', // 合同/协议起始执行时间
        expirationDateTime: '', // 合同/协议终止时间
        authorizer: '', // 与进口货物有关的特许权许可方或转让方
        authorizedPerson: '', // 与进口货物有关的特许权被许可方或受让方
        payType: '', // 应税特许权使用费支付方式
        payTime: '', // 本次支付时间
        payPeriod: '', // 定期支付计提周期
        periodStartDate: '', // 本次支付对应的计提周期开始时间
        periodEndDate: '', // 本次支付对应的计提周期截止时间
        edocType: '', // 随附材料清单(有关材料附后)
        statment: '', // 说明
        isSecret: '', // 对以上申报内容是否需要海关予以保密？
        opName: '' // 申报人
      }, // 传参
      charterRules: {
        royaltyAmount: [{validator: this.checkValid, message: '输入整数位最多19位，小数位最多2位', trigger: 'blur'}], // 应税特许权使用费金额
        payPeriod: [{validator: this.checkValid, message: '输入数字，0-12', trigger: 'blur'}] // 定期支付计提周期
      }, // 校验规则
      ruleRegx: {
        'royaltyAmount': '^[1-9]{1}\\d{0,19}(\\.\\d{1,2})?$|^$', // 应税特许权使用费金额
        'payPeriod': '^0?[0-9]$|^1[0-2]$' // 定期支付计提周期
      },
      controller: {
        requireColor: true // 显示必填的颜色
      },
      rightTypeList: [{
        value: '0',
        label: '专利权或者专有技术使用权'
      }, {
        value: '1',
        label: '商标权'
      }, {
        value: '2',
        label: '著作权'
      }, {
        value: '3',
        label: '分销权、销售权或者其他类似权利'
      }], // 应税特许权使用费类型数据
      edocTypeList: [{
        value: '0',
        label: '特许权使用费涉及的原进口货物报关单海关编号'
      }, {
        value: '1',
        label: '特许权使用费合同/协议'
      }, {
        value: '2',
        label: '特许权使用费发票'
      }, {
        value: '3',
        label: '特许权使用费支付凭证'
      }, {
        value: '4',
        label: '代扣代缴税款纳税凭证'
      }, {
        value: '5',
        label: '特许权使用费其他材料'
      }], // 随附材料清单数据
      selectObj: {
        obj: '',
        parmas: ''
      },
      saasCurr4: []
    }
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'add'
    },
    username: {
      type: String,
      default: ''
    },
    showCustomsCode: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.charterForm.opName = util.simpleClone(this.username)
    let arr
    if (!this.data) {
      arr = []
    } else {
      arr = Object.keys(this.data)
    }
    if (arr.length !== 0) {
      this.getDetail()
    }
    if (this.type === 'look') {
      this.isDetail = true
    }
  },
  methods: {
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      e.target.blur()
      // 获取当前焦点所在的 form表单
      let form = e.target.form
      // 获取form表单下的所有 input  并把为数组转化为真数组
      let focusable = Array.from(form.querySelectorAll('input'))
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
            if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            }
            prev.focus()
          }
        }
      } else if (e.ctrlKey && this.localName === 'textarea') { // Ctrl+enter 在textaera中换行
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
        // 下个元素存在
        if (next) {
          if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
            return false
          } else {
            let ref
            if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
              // this.$refs[ref].blur()
            } else {
              if (!util.isEmpty(e.target.attributes.dataRef)) {
                ref = e.target.attributes.dataRef.nodeValue
              }
            }
            if (ref === 'tradeCoScc' || ref === 'ownerCodeScc') {
              // 如果是十八位信用代码
              if (ref === 'tradeCoScc') {
                if (this.decHead.tradeCoScc.length !== 18) {
                  next.focus()
                  next.select()
                } else {
                  secondNext.focus()
                  secondNext.select()
                }
              } else {
                if (this.decHead.ownerCodeScc.length !== 18) {
                  next.focus()
                  next.select()
                } else {
                  secondNext.focus()
                  secondNext.select()
                }
              }
            } else {
              next.focus()
              next.select()
            }
          }
        }
      }
    },
    // 获取报关单编辑、详情的特许权数据
    getDetail () {
      this.preDecRoyaltyFee = []
      this.edocType = []
      let data = util.simpleClone(this.data)
      if (data.royaltyFeeType.split('')[0] === '1') {
        this.preDecRoyaltyFee.push('0')
      }
      if (data.royaltyFeeType.split('')[1] === '1') {
        this.preDecRoyaltyFee.push('1')
      }
      if (data.royaltyFeeType.split('')[2] === '1') {
        this.preDecRoyaltyFee.push('2')
      }
      if (data.royaltyFeeType.split('')[3] === '1') {
        this.preDecRoyaltyFee.push('3')
      }
      if (data.edocType.split('')[0] === '1') {
        this.edocType.push('0')
      }
      if (data.edocType.split('')[1] === '1') {
        this.edocType.push('1')
      }
      if (data.edocType.split('')[2] === '1') {
        this.edocType.push('2')
      }
      if (data.edocType.split('')[3] === '1') {
        this.edocType.push('3')
      }
      if (data.edocType.split('')[4] === '1') {
        this.edocType.push('4')
      }
      if (data.edocType.split('')[5] === '1') {
        this.edocType.push('5')
      }
      this.charterForm = data
      this.selectObj = {
        obj: 'saasCurr4',
        params: 'SAAS_CURR'
      }
      this.checkParamsList(this.charterForm.currName)
    },
    // 去重
    unique (arr) {
      let x = new Set(arr)
      return [...x]
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      let fitlerParmaTable = ['SAAS_CURR']
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          this[this.selectObj.obj] = list.slice(0, 10)
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
        if (util.isExistInArray(this.selectObj.params, fitlerParmaTable)) {
          filterList1 = list.filter(item => {
            let str = item.otherField + ' ' + item.extendField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          filterList.push(...filterList1)
          filterList = this.unique(filterList)
        }
        if (type === 'init') {
          this[this.selectObj.obj] = filterList.slice(0, 10)
        } else if (type === 'select') {
          // this.$nextTick(() => {
          this[this.selectObj.obj] = filterList.slice(0, 10)
          // })
        }
      }
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      // 如果时下拉框 则设置当前下拉框的默认参数
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    checkValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        callback()
      } else {
        let name = rule.field
        let reg = new RegExp(this.ruleRegx[name])
        if (!reg.test(value)) {
          setTimeout(() => {
            this.$refs['charterForm'].clearValidate([name])
          }, 2000)
          callback(new Error(rule.message))
        } else {
          callback()
        }
      }
    },
    // 关闭弹窗
    closeDialog () {
      this.$emit('closeTemplate')
      this.charterForm = {
        pid: '', // 主键
        decPid: '', // 报关单主键
        royaltyAmount: '', // 应税特许权使用费金额
        currName: '', // 币制
        currNameValue: '', // 币制名称
        royaltyFeeType: '', // 应税特许权使用费类型
        isCusAudit: '', // 是否已经过海关审查确定
        isCusPricePreDetermin: '', // 是否已向海关申请价格预裁定
        pricePreDeterminNo: '', // 价格预裁定决定书编号
        contractNo: '', // 特许权使用费合同/协议编号
        issueDateTime: '', // 合同/协议签订时间
        effectiveDateTime: '', // 合同/协议起始执行时间
        expirationDateTime: '', // 合同/协议终止时间
        authorizer: '', // 与进口货物有关的特许权许可方或转让方
        authorizedPerson: '', // 与进口货物有关的特许权被许可方或受让方
        payType: '', // 应税特许权使用费支付方式
        payTime: '', // 本次支付时间
        payPeriod: '', // 定期支付计提周期
        periodStartDate: '', // 本次支付对应的计提周期开始时间
        periodEndDate: '', // 本次支付对应的计提周期截止时间
        edocType: '', // 随附材料清单(有关材料附后)
        statment: '', // 说明
        isSecret: '', // 对以上申报内容是否需要海关予以保密？
        opName: '' // 申报人
      }
      this.preDecRoyaltyFee = []
      this.edocType = []
      this.$nextTick(() => {
        this.$refs['charterForm'].clearValidate()
      })
    },
    // 确定保存数据
    confirmData () {
      let [a, b, c, d] = ['0', '0', '0', '0']
      for (let i in this.preDecRoyaltyFee) {
        if (this.preDecRoyaltyFee[i] === '0') {
          a = '1'
        } else if (this.preDecRoyaltyFee[i] === '1') {
          b = '1'
        } else if (this.preDecRoyaltyFee[i] === '2') {
          c = '1'
        } else if (this.preDecRoyaltyFee[i] === '3') {
          d = '1'
        }
      }
      this.charterForm.royaltyFeeType = a + b + c + d
      let [A, B, C, D, E, F] = ['0', '0', '0', '0', '0', '0']
      for (let i in this.edocType) {
        if (this.edocType[i] === '0') {
          A = '1'
        } else if (this.edocType[i] === '1') {
          B = '1'
        } else if (this.edocType[i] === '2') {
          C = '1'
        } else if (this.edocType[i] === '3') {
          D = '1'
        } else if (this.edocType[i] === '4') {
          E = '1'
        } else if (this.edocType[i] === '5') {
          F = '1'
        }
      }
      this.charterForm.edocType = A + B + C + D + E + F
      this.charterForm.opName = util.simpleClone(this.username)
      this.$refs['charterForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        this.$emit('getData', this.charterForm)
        this.$emit('closeTemplate')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.border{
  border: 1px solid #B7B7B7;
  border-bottom: 0;
}
.borderR{
  border-right: 1px solid #B7B7B7;
}
.txt-c{
  text-align: center;
}
.charter-title{
  border: 1px solid #B7B7B7;
  border-top: none;
  font-size: 16px;
  color: #4c4c4c;
}
.charter-intro {
  border: 1px solid #B7B7B7;
  border-top: none;
  padding: 5px;
  p{
    color: #4c4c4c;
    text-indent: 24px;
  }
}
.charter-btn{
  margin: 15px 0;
  .el-button{
    padding: 8px 20px;
    font-size: 14px;
    height: 30px;
    line-height: 13px;
    margin-right: 7px;
  }
}
.el-select-dropdown__item.selected {
  background: #0080ff;
  color: #ffffff;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
  background: #dbed8a;
  font-weight: bold;
}
.el-select-dropdown__item {
  font-size: 12px;
  padding: 0 15px;
  height: 22px;
  line-height: 22px;
  border: #c0c0c0 solid 1px;
}
.el-select-dropdown__list {
  padding: 0;
}
</style>
