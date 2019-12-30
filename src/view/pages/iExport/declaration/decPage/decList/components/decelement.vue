<template>
<!--商品规范申报-商品申报要素  组件-->
  <section>
    <div class="border">
      <el-form ref="reqform" :model="reqform" :rules="rules"
        @keyup.enter.native="switchFoucsByEnter"
        label-width="150px" size="mini" :label-position="labelPosition">
        <el-row >
           <el-col :span="24">
              <el-form-item label="反填规则">
                <el-radio-group v-model="reqform.radio" @change = 'typeChange'>
                  <el-radio size="mini" label="1">税号</el-radio>
                  <el-radio size="mini" label="2">GTIN</el-radio>
                </el-radio-group>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="商品信息">
                <el-input :disabled="true"  :value="goodsInfo"></el-input>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row >
          <span style="font-weight:900">规格型号（根据海关规定，以下要素应全部填报）</span>
        </el-row>
        <el-row v-for="(dat,index) in datas.checkedgoods.elemntRequiredVOs" :key="'ele'+index" class='dec-elemet'>
           <el-col :span="24">
              <el-form-item
              :class= 'ifcolor(index)'
              :label="dat.element"
              v-model="reqform.datas"
              label-width="300px"
              :prop="index+''">
                  <el-select class="required-input spical-class"
                    v-model="reqform.datas[index]" v-if="dat.element=='品牌类型'"
                    default-first-option remote clearable filterable
                    @focus="tipsFillMessage('brandTypes','BRAND_TYPES')"
                    @clear="clearSelct('brandTypes')"
                    @change='formDataChange'
                    ref="brandTypes"
                    :remote-method="checkParamsList"
                    :disabled="datas.opeType === 'look'?true:false">
                    <el-option
                    v-for="item in brandTypes"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                    </el-option>
                  </el-select>
                  <el-select class="required-input spical-class"
                    filterable clearable remote default-first-option
                    v-model="reqform.datas[index]" v-else-if="dat.element=='出口享惠情况'"
                    @focus="tipsFillMessage('benefits','BENE_FITS')"
                    @clear="clearSelct('benefits')"
                    :remote-method="checkParamsList"
                    @change='formDataChange'
                    :disabled="datas.iEFlag=='I' || datas.opeType === 'look'?true:false">
                    <el-option
                    v-for="item in benefits"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                    </el-option>
                  </el-select>
                  <el-select class="required-input spical-class"
                    filterable clearable remote default-first-option
                    v-model="reqform.datas[index]" v-else-if="dat.element=='原厂商中文名称'"
                    ref='cropCNName'
                    @focus="tipsFillMessage('cropCNNameParam','CN_NAME')"
                    @clear="clearSelct('cropCNNameParam')"
                    @change="((val)=>{formDataChange(val, index, 'cropCNName')})"
                    :remote-method="checkParamsList"
                    :disabled="datas.opeType === 'look'?true:false">
                    <el-option
                    v-for="item in cropCNNameParam"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                    </el-option>
                  </el-select>
                  <el-select class="required-input spical-class"
                    filterable clearable remote default-first-option
                    v-model="reqform.datas[index]" v-else-if="dat.element=='原厂商英文名称'"
                    ref= 'cropENName'
                    @focus="tipsFillMessage('cropENNameParam','EN_NAME')"
                    @clear="clearSelct('cropENNameParam')"
                    @change="((val)=>{formDataChange(val, index, 'cropENName')})"
                    :remote-method="checkParamsList"
                    :disabled="datas.opeType === 'look'?true:false">
                    <el-option
                    v-for="item in cropENNameParam"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                    </el-option>
                  </el-select>
                  <el-select class="required-input spical-class"
                    filterable clearable remote default-first-option
                    v-model="reqform.datas[index]" v-else-if="dat.element=='反倾销税率'"
                    ref= 'dumpTaxRate'
                    @focus="tipsFillMessage('dumpTaxRate','DUMP_TAX_RATE')"
                    @clear="clearSelct('dumpTaxRate')"
                    @change='formDataChange("dumpTaxRate")'
                    :remote-method="checkParamsList"
                    :disabled="datas.opeType === 'look'?true:false">
                    <el-option
                    v-for="item in dumpTaxRate"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                    </el-option>
                  </el-select>
                  <el-select class="required-input spical-class"
                    filterable clearable remote default-first-option
                    v-model="reqform.datas[index]" v-else-if="dat.element=='反补贴税率'"
                    ref= 'subsidyTaxRate'
                    @focus="tipsFillMessage('subsidyTaxRate','SUBSIDY_TAX_RATE')"
                    @clear="clearSelct('subsidyTaxRate')"
                    @change='formDataChange("subsidyTaxRate")'
                    :remote-method="checkParamsList"
                    :disabled="datas.opeType === 'look'?true:false">
                    <el-option
                    v-for="item in subsidyTaxRate"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                    </el-option>
                  </el-select>
                  <el-select class="required-input spical-class"
                    filterable clearable remote default-first-option
                    v-model="reqform.datas[index]" v-else-if="dat.element=='是否符合价格承诺'"
                    ref= 'isPromisePrice'
                    @focus="tipsFillMessage('isPromisePrice','IS_PROMISE_PRICE')"
                    @clear="clearSelct('isPromisePrice')"
                    @change="((val)=>{formDataChange(val, index, 'isPromisePrice')})"
                    :remote-method="checkParamsList"
                    :disabled="datas.opeType === 'look'?true:false">
                    <el-option
                    v-for="item in isPromisePrice"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                    </el-option>
                  </el-select>
                  <el-input  v-else-if="dat.element=='GTIN'" v-model="reqform.datas[index]"
                    @input="formDataChange('', '', 'GTIN')"
                    ref='GTIN'
                    @blur="queryGtin(reqform.datas[index], $event)"
                    :maxlength="13"
                   :disabled="datas.opeType === 'look'?true:false"></el-input>
                  <el-input  v-else v-model="reqform.datas[index]"
                    @input="formDataChange"
                    style='height:auto;'
                   :disabled="datas.opeType === 'look'?true:false"></el-input>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="规格型号" label-width="150px">
                <el-input style="width:65%"  v-model="specModle" :disabled="datas.opeType === 'look'?true:false" enter='no' ref='specModle' @keyup.enter.native='splitSpecModle' @focus="specModleFocus"></el-input>
                <span>{{"（"+specModleLen+"/255字节）"}}</span>
              </el-form-item>
           </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;" v-if="btnIsShow">
      <el-button class="dialog-primary-btn" @click='submitdata()'>确定</el-button>
      <el-button class="dialog-btn" @click="closedecele()">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'dec-element',
  props: {
    datas: {
      type: Object,
      default: function () {
        return {
          checkedgoods: '', // 商品数据
          opeType: '', // 操作类型 add 新增  edit 编辑  look 查看
          gModel: '', // 规格型号
          iEFlag: '', // 进出口标志 I 进口 E 出口
          gName: '',
          gtin: '' // gtin码
        }
      }
    },
    btnIsShow: {
      default: true
    }
  },
  data () {
    return {
      rules: {}, // 校验规则
      reqform: {
        radio: '',
        datas: []
      },
      specModle: '',
      specModleLen: 0,
      labelPosition: 'left',
      brandTypes: [], // 品牌类型
      benefits: [], // 出口享惠
      cropCNNameParam: [], // 厂商中文名称
      cropENNameParam: [], // 厂商英文名称
      dumpTaxRate: [], // 反倾销税率
      subsidyTaxRate: [], // 反补贴税率
      isPromisePrice: [], // 是否符合价格承诺
      requireInput: [], // 统计必填项
      splitFlag: [], // 分隔标识 区分用普通'|'分隔符和'<>'分隔符
      dumpTaxRateAllParam: [], // 反倾销税率
      subsidyTaxRateAllParam: [], // 反补贴税率
      cropENNameAllParam: [], // 厂商英文名称
      cropCNNameAllParam: [], // 厂商中文名称
      selectObj: { // 设置定位下拉框和下拉参数
        obj: '',
        params: ''
      },
      goodsInfo: '',
      elementInfo: [],
      gtinIndex: '', // 记录gtin的位置
      gtinChange: false // 记录gtin是否修改。防止不断查gtin 数据
    }
  },
  created () { // 组件创建时的逻辑操作
    if (util.isEmpty(this.datas.gName)) {
      this.goodsInfo = this.datas.checkedgoods.codeTs + '-' + this.datas.checkedgoods.gName
    } else {
      this.goodsInfo = this.datas.checkedgoods.codeTs + '-' + this.datas.gName
    }
    // this.datas.checkedgoods.gModelList = []
    for (let a = 0; a < this.datas.checkedgoods.elemntRequiredVOs.length; a++) {
      let enti = this.datas.checkedgoods.elemntRequiredVOs[a]
      if (enti.element) {
        this.elementInfo.push(enti.element)
      }
      if (enti.decfacType === 9) {
        this.splitFlag.push(1)
      } else {
        this.splitFlag.push(0)
      }
      if (enti.element === '出口享惠情况') {
        // 取下拉值
        let benefitsParam = []
        for (let i in enti.decfacCodeContent) {
          benefitsParam.push({
            codeField: i,
            nameField: i + '-' + enti.decfacCodeContent[i]
          })
        }
        window.localStorage.setItem('BENE_FITS', JSON.stringify(benefitsParam))
        if (this.datas.iEFlag === 'I') {
          // 设定默认下拉值
          this.reqform.datas.push('3')
        } else {
          this.reqform.datas.push('')
        }
      } else if (enti.element === '品牌类型') {
        // 取下拉值
        let brandTypesParam = []
        for (let i in enti.decfacCodeContent) {
          brandTypesParam.push({
            codeField: i,
            nameField: i + '-' + enti.decfacCodeContent[i]
          })
        }
        window.localStorage.setItem('BRAND_TYPES', JSON.stringify(brandTypesParam))
        this.reqform.datas.push('')
      } else if (enti.element === '原厂商中文名称') {
        // 取下拉值
        let cropCNNameParam = []
        this.cropCNNameAllParam = enti.decfacContent.split('|')
        let list = this.unique(this.cropCNNameAllParam)
        for (let i in list) {
          cropCNNameParam.push({
            codeField: list[i],
            nameField: list[i]
          })
        }
        window.localStorage.setItem('CN_NAME', JSON.stringify(cropCNNameParam))
        this.reqform.datas.push('')
      } else if (enti.element === '原厂商英文名称') {
        // 取下拉值
        let cropENNameParam = []
        this.cropENNameAllParam = enti.decfacContent.split('|')
        let list = this.unique(this.cropENNameAllParam)
        for (let i in list) {
          if (util.isEmpty(list[i])) {
            continue
          }
          cropENNameParam.push({
            codeField: list[i],
            nameField: list[i]
          })
        }
        window.localStorage.setItem('EN_NAME', JSON.stringify(cropENNameParam))
        this.reqform.datas.push('')
      } else if (enti.element === '反倾销税率') {
        // 取下拉值
        let dumpTaxRate = []
        this.dumpTaxRateAllParam = enti.decfacContent.split('|')
        let list = this.unique(this.dumpTaxRateAllParam)
        for (let i in list) {
          dumpTaxRate.push({
            codeField: list[i],
            nameField: list[i]
          })
        }
        window.localStorage.setItem('DUMP_TAX_RATE', JSON.stringify(dumpTaxRate))
        this.reqform.datas.push('')
      } else if (enti.element === '反补贴税率') {
        // 取下拉值
        let subsidyTaxRate = []
        this.subsidyTaxRateAllParam = enti.decfacContent.split('|')
        let list = this.unique(enti.decfacContent.split('|'))
        for (let i in list) {
          subsidyTaxRate.push({
            codeField: list[i],
            nameField: list[i]
          })
        }
        window.localStorage.setItem('SUBSIDY_TAX_RATE', JSON.stringify(subsidyTaxRate))
        this.reqform.datas.push('')
      } else if (enti.element === '是否符合价格承诺') {
        // 取下拉值
        let isPromise = []
        for (let i in enti.decfacCodeContent) {
          isPromise.push({
            codeField: i,
            nameField: i + '-' + enti.decfacCodeContent[i]
          })
        }
        window.localStorage.setItem('IS_PROMISE_PRICE', JSON.stringify(isPromise))
        this.reqform.datas.push('')
      } else if (enti.element === 'GTIN') {
        if (this.datas.gtin) {
          this.reqform.datas.push(this.datas.gtin)
        } else {
          this.reqform.datas.push('')
        }
        this.gtinIndex = +a
      } else {
        this.reqform.datas.push('')
      }
      //  else if (enti.element === 'CAS') {
      //   this.rules[a + ''] = [{validator: this.casCheck, trigger: 'blur'}]
      // }
      if (enti.element === 'GTIN') {
        this.rules[a + ''] = [{validator: this.gtinCheck, trigger: 'blur'}]
      } else if (enti.elementNull === '1') {
        this.rules[a + ''] = [{validator: this.reqdatacheck, message: '不能为空', trigger: 'blur'}]
        this.requireInput.push(true)
      } else {
        this.requireInput.push(false)
      }
    }
    // 初始化 gMode 和 申报要素
    if (this.datas.gModel && this.datas.gModel.length !== 0) {
      if (this.datas.gModel.indexOf('|') === -1) { // 如果规格型号不符号天之要求 则不反填
        this.specModle = this.datas.gModel
        return
      }
      if (this.splitFlag.includes(1)) { // 例如 '1|3|1|1|1|1|1|1|1|<其他欧盟公司><Koninklijke Nedschroef Holding B.V.><0.26><0><1>'
        // arr ["1", "3", "1", "1", "1", "1", "1", "1", "1", "<其他欧盟公司><Koninklijke Nedschroef Holding B.V.><0.26><0><1>"]
        let arr = this.datas.gModel.split('|')
        let arr2 = arr.pop().replace(/></g, '|').replace(/[<>]/g, '').split('|')
        arr.push(...arr2)
        this.reqform.datas = arr
      } else {
        let arr = this.datas.gModel.split('|')
        for (let i in arr) {
          this.reqform.datas[i] = arr[i]
        }
      }
      this.specModle = this.datas.gModel
    } else {
      if (this.datas.opeType === 'edit' && this.datas.iEFlag === 'I') {
        this.specModle = '|3'
      }
    }
    // this.initSelect()
    // 填写规则
    this.reqform.radio = this.datas.backRule
  },
  mounted () { // 组件加载完毕，挂载数据时 执行的逻辑
    // 如果是历史商品库过来的数据 如果存在gtin 则自动调用gtin数据
    if (this.datas.gtin) {
      // 如果需要传入参数有gtin 则需要反填gtin 过来
      this.reqform.datas[this.gtinIndex] = this.datas.gtin
      this.initQueryGtin(this.datas.gtin)
    }
    // 聚焦点
    this.$nextTick(_ => {
      this.$refs['reqform'].$el[3].focus()
      this.$refs['reqform'].$el[3].select()
      // this.$refs['brandTypes'].focus()
      // this.$refs['brandTypes'].$children[0].select()
    })
    this.initSelect()
  },
  watch: {
    specModle: 'computLen'
  },
  methods: { // 组件定义的方法
    // 关闭组件
    closedecele () {
      this.reqform = {
        radio: '',
        datas: []
      }
      this.$emit('closedecele')
    },
    computLen () {
      this.specModleLen = util.decGetlen(this.specModle)
      if (this.specModleLen > 255) {
        this.$alert('规范申报要素归类后，规格型号数据:' + '<br>' + this.specModle + '<br>超长，大于255字节', '信息提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      }
    },
    // 确认 'look'状态不回传数据
    submitdata () {
      if (this.datas.opeType !== 'look') {
        if (this.specModleLen > 255) {
          this.$alert('规范申报要素归类后，规格型号数据:' + '<br>' + this.specModle + '<br>超长，大于255字节', '信息提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        } else {
          if (this.brandTypes.length === 0) {
            this.reqform.datas[0] = ''
          }
          if (this.datas.iEFlag === 'I') {
            if (this.reqform.datas[1] !== '3') {
              this.reqform.datas[1] = '3'
            }
            this.selectObj = {
              obj: 'benefits',
              params: 'BENE_FITS'
            }
            this.checkParamsList(this.reqform.datas[1])
          } else {
            if (this.benefits.length === 0) {
              this.reqform.datas[1] = ''
            }
          }
          this.formDataChange()
          this.$refs['reqform'].validate((valid) => {
            if (valid) {
              if (this.datas.gtin) {
                this.$emit('submitdatas', {codeTs: this.datas.checkedgoods.codeTs, specModel: this.specModle, gtin: this.reqform.datas[this.gtinIndex], opeType: this.datas.opeType}) // 回传参数
              } else {
                this.$emit('submitdatas', {codeTs: this.datas.checkedgoods.codeTs, specModel: this.specModle, gtin: null, opeType: this.datas.opeType}) // 回传参数
              }
            }
          })
        }
      } else {
        this.$emit('closedecele')
      }
    },
    // 必填项样式
    ifcolor (index) {
      if (this.requireInput[index]) {
        return 'require-color'
      }
    },
    // 必填项校验
    reqdatacheck (rule, value, callback) {
      if (!util.isEmpty(this.reqform.datas[parseInt(rule.field)])) {
        callback()
      } else {
        setTimeout(() => {
          this.$refs['reqform'].clearValidate([rule.field])
        }, 2000)
        callback(new Error(rule.message))
      }
    },
    gtinCheck (rule, value, callback) {
      if (this.reqform.radio !== '2') {
        callback()
        return
      }
      let result = this.checkGTIN(this.reqform.datas[parseInt(rule.field)])
      if (!result.flag) {
        setTimeout(() => {
          this.$refs['reqform'].clearValidate([rule.field])
        }, 2000)
        callback(new Error(result.tipMsg))
      } else {
        callback()
      }
    },
    casCheck (rule, value, callback) {
      let result = this.checkCAS(this.reqform.datas[parseInt(rule.field)])
      if (!result.flag) {
        setTimeout(() => {
          this.$refs['reqform'].clearValidate([rule.field])
        }, 2000)
        callback(new Error(result.tipMsg))
      } else {
        callback()
      }
    },
    /**
     * @description 根据表单数据变化动态设置规格型号
     *  @param {String} value 选择的值
     * @param {String} inputName 数据框的inputName
     */
    formDataChange (value, inputIndex, inputName) {
      if (inputName === 'isPromisePrice' && value === '1') { // 如果为 是否符合价格承诺
        this.reqform.datas[inputIndex - 1] = '0'
        this.reqform.datas[inputIndex - 2] = '0'
      }
      if (inputName === 'GTIN') {
        this.gtinChange = true
      }
      if (inputName === 'cropCNName') { // 如果为 原厂商中文名称
        if (util.isEmpty(value)) {
          this.reqform.datas[inputIndex + 1] = ''
          this.reqform.datas[inputIndex + 2] = ''
          this.reqform.datas[inputIndex + 3] = ''
        } else {
          let index = -1
          index = this.cropCNNameAllParam.findIndex((v, i) => {
            return v === value
          })
          if (index !== -1) {
            this.reqform.datas[inputIndex + 1] = this.cropENNameAllParam[index] // 厂商英文名
            this.reqform.datas[inputIndex + 2] = this.dumpTaxRateAllParam[index] ? this.dumpTaxRateAllParam[index] : '' // 反倾销税率
            this.reqform.datas[inputIndex + 3] = this.subsidyTaxRateAllParam[index] ? this.subsidyTaxRateAllParam[index] : ''// 反补贴税率
          }
        }
      }
      if (inputName === 'cropENName') { // 如果为 原厂商英文名称
        if (util.isEmpty(value)) {
          this.reqform.datas[inputIndex - 1] = ''
          this.reqform.datas[inputIndex + 1] = ''
          this.reqform.datas[inputIndex + 2] = ''
        } else {
          let index = -1
          index = this.cropENNameAllParam.findIndex((v, i) => {
            return v === value
          })
          if (index !== -1) {
            this.reqform.datas[inputIndex - 1] = this.cropCNNameAllParam[index]
            this.reqform.datas[inputIndex + 1] = this.dumpTaxRateAllParam[index] ? this.dumpTaxRateAllParam[index] : ''// 反倾销税率
            this.reqform.datas[inputIndex + 2] = this.subsidyTaxRateAllParam[index] ? this.subsidyTaxRateAllParam[index] : '' // 反补贴税率
          }
        }
      }
      let newdates = Array.from(this.reqform.datas)
      let str = ''
      let commonField = []
      if (this.splitFlag.includes(1)) { // 有反倾销德情况
        for (let i in newdates) {
          if (this.splitFlag[i] === 0) { // 普通用'|'分隔的字段
            commonField.push(newdates[i])
          } else if (this.splitFlag[i] === 1) { // 需要用'<>'分隔的字段
            str += '<' + newdates[i] + '>'
          }
        }
        commonField.push(str)
        this.specModle = commonField.join('|')
      } else { // 有反倾销德情况
        let indexPos = -1 // 记录最后一个有值的输入框的位置
        newdates.forEach((v, i) => {
          if (!util.isEmpty(v)) {
            indexPos = i
          }
        })
        if (indexPos === -1) { // 证明一个值都没有
          this.specModle = ''
        } else {
          let newArr = []
          for (let n in newdates) {
            if (+n > indexPos) {
              break
            }
            newArr.push(newdates[n])
          }
          this.specModle = newArr.join('|')
        }
      }
    },
    initQueryGtin (value) {
      let result = this.checkGTIN(value)
      if (!result.flag) {
        return false
      }
      this.$post({
        url: 'API@/saas-dictionary/gtin/getGtinDynamic',
        data: value,
        success: (res) => {
          this.gtinChange = false
          let info = res.result.chnInfo
          if (info && info.length > 0) {
            this.backGtin(info)
          }
        }
      })
    },
    queryGtin (value, event) {
      if (event && event.target.readOnly) {
        return
      }
      if (!value || !this.gtinChange) {
        return
      }
      let result = this.checkGTIN(value)
      if (!result.flag) {
        return false
      }
      this.$post({
        url: 'API@/saas-dictionary/gtin/getGtinDynamic',
        data: value,
        success: (res) => {
          this.gtinChange = false
          let info = res.result.chnInfo
          if (info && info.length > 0) {
            this.backGtin(info)
          } else {
            this.messageTips(res.result.checkResultInfo)
          }
        }
      })
    },
    backGtin (info) {
      let flag = false
      let gModelList = this.elementInfo
      info.forEach((v, i) => {
        if (gModelList.includes(v.propName)) {
          let index = gModelList.findIndex((value, i) => {
            return value === v.propName
          })
          if (index > -1 && v.propValue) {
            this.reqform.datas[index] = v.propValue
            if (v.propName === '原厂商中文名称') {
              this.formDataChange('王子制纸株式会社', index, 'cropCNName')
            } else if (v.propName === '原厂商英文名称') {
              this.formDataChange(v.propValue, index, 'cropENName')
            } else if (v.propName === '反倾销税率') {
              this.formDataChange('dumpTaxRate')
            } else if (v.propName === '反补贴税率') {
              this.formDataChange('subsidyTaxRate')
            } else if (v.propName === '是否符合价格承诺') {
              this.formDataChange(v.propValue, index, 'isPromisePrice')
            }
            flag = true
          }
        }
      })
      if (flag) {
        this.$forceUpdate()
        this.initSelect()
        this.formDataChange()
      }
    },
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
      let sumitFlag = false
      if (index === (newFocusable.length - 2)) {
        sumitFlag = true
      }
      // 上一个元素
      let prev = newFocusable[parseInt(index) - 1]
      if (e.shiftKey) { // shift+enter 光标向上个元素移动
        if (prev) {
          if (e.target.attributes.shiftEnter && e.target.attributes.shiftEnter.nodeValue === 'no') {
            return false
          } else {
            if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
              arguments[1].$refs[ref].blur()
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
        if (sumitFlag) {
          this.submitdata()
          return
        }
        // 下个元素存在
        if (next) {
          if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
            return false
          } else {
            if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
              arguments[1].$refs[ref].blur()
            }
            next.focus()
            next.select()
          }
        }
        return false
      }
    },
    // select 远程搜索方法
    checkParamsList (query) {
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      let filterList = []
      // 反倾销税率 和 反补贴税率 的特殊处理
      if (typeof (this.$refs.cropCNName) !== 'undefined' && !util.isEmpty(this.$refs.cropCNName['0'].value)) {
        if (['DUMP_TAX_RATE', 'SUBSIDY_TAX_RATE'].includes(this.selectObj.params)) { // 反倾销税率 和 反补贴税率 的特殊处理
          let value = this.$refs.cropCNName['0'].value
          let index = -1
          index = this.cropCNNameAllParam.findIndex((v, i) => {
            return v === value
          })
          if (index !== -1) { // 确定
            let arr = this.selectObj.params === 'DUMP_TAX_RATE' ? this.dumpTaxRateAllParam : this.subsidyTaxRateAllParam
            if (arr.length > 1 && arr[index] !== '0') {
              list = [{
                codeField: arr[index],
                nameField: arr[index]
              }, {
                codeField: '0',
                nameField: '0'
              }]
              filterList = list.filter(item => {
                let str = item.codeField + '-' + item.nameField
                return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
              })
              this[this.selectObj.obj] = filterList.slice(0, 10)
              return
            }
          }
        }
      }
      if (util.isEmpty(keyValue)) {
        // 如果时敲空格时触发下拉框远程搜索 取前10位数据
        this[this.selectObj.obj] = list.slice(0, 10)
      } else {
        // 厂商中文名称、厂商英文名称、反补贴税率、反倾销说率参数时只有code
        let fitlerParmaTable = ['CN_NAME', 'EN_NAME', 'DUMP_TAX_RATE', 'SUBSIDY_TAX_RATE']
        if (util.isExistInArray(this.selectObj.params, fitlerParmaTable)) { // 处理特殊的参数
          filterList = list.filter(item => {
            let str = item.codeField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
        } else { // 处理过滤普通的参数
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
        }
        // 取前10位数据
        this[this.selectObj.obj] = filterList.slice(0, 10)
      }
    },
    // 记录目前是哪个下拉框
    tipsFillMessage (obj, params) {
      this.selectObj = {
        obj: obj, // 下拉值
        params: params // 参数表名
      }
    },
    // 初始化下拉框数据
    initSelect () {
      this.selectObj = {
        obj: 'brandTypes',
        params: 'BRAND_TYPES'
      }
      if (!util.isEmpty(this.reqform.datas[0])) {
        this.checkParamsList(this.reqform.datas[0])
      }
      this.selectObj = {
        obj: 'benefits',
        params: 'BENE_FITS'
      }
      if (!util.isEmpty(this.reqform.datas[1])) {
        this.checkParamsList(this.reqform.datas[1])
      }
      // 初始化是否符合价格承诺
      if (this.splitFlag.includes(1)) { // 如果有decfacType = 9时 证明有反倾销这些字段 需要进行初始化
        let len = +this.splitFlag.length
        this.selectObj = {
          obj: 'isPromisePrice',
          params: 'IS_PROMISE_PRICE'
        }
        if (!util.isEmpty(this.reqform.datas[len - 1])) {
          this.checkParamsList(this.reqform.datas[len - 1])
        }
      }
    },
    // 数组去重的方法
    unique (arr) {
      let x = new Set(arr)
      return [...x]
    },
    // 点击下拉框的clearable的功能时 清除当前下拉框的选择值
    clearSelct (selecType) {
      this[selecType] = []
    },
    specModleFocus () {
      this.$refs['specModle'].focus()
      this.$refs['specModle'].select()
    },
    splitSpecModle () {
      if (!this.specModle.trim()) {
        return
      }
      if (this.specModle.indexOf('|') === -1) { // 如果规格型号不符号天之要求 则不反填
        return
      }
      let arr = []
      let dataLen = this.reqform.datas.length
      if (this.splitFlag.includes(1)) { // 例如 '1|3|1|1|1|1|1|1|1|<其他欧盟公司><Koninklijke Nedschroef Holding B.V.><0.26><0><1>'
        // arr ["1", "3", "1", "1", "1", "1", "1", "1", "1", "<其他欧盟公司><Koninklijke Nedschroef Holding B.V.><0.26><0><1>"]
        arr = this.specModle.split('|')
        let arr2 = arr.pop().replace(/></g, '|').replace(/[<>]/g, '').split('|')
        arr.push(...arr2)
        // 如果 出现超长的情况 自动截取
        arr = arr.slice(0, dataLen)
        if (arr[0]) {
          let list = JSON.parse(window.localStorage.getItem('BRAND_TYPES'))
          let index = list.findIndex((v, i) => {
            return v.codeField === arr[0]
          })
          if (index === -1) {
            arr[0] = ''
          }
        }
        if (arr[1]) {
          let list = JSON.parse(window.localStorage.getItem('BENE_FITS'))
          let index = list.findIndex((v, i) => {
            return v.codeField === arr[1]
          })
          if (index === -1) {
            arr[1] = ''
          }
        }
        if (arr.length > 0 && this.datas.iEFlag === 'I' && arr[1].toString() !== '3') {
          this.messageTips('进口时,出口享惠情应为[3-不适用于进口报关单]')
          arr[1] = '3'
        }
        this.reqform.datas = arr
      } else {
        arr = this.specModle.split('|')
        arr = arr.slice(0, dataLen)
        if (arr[0]) {
          let list = JSON.parse(window.localStorage.getItem('BRAND_TYPES'))
          let index = list.findIndex((v, i) => {
            return v.codeField === arr[0]
          })
          if (index === -1) {
            arr[0] = ''
          }
        }
        if (arr[1]) {
          let list = JSON.parse(window.localStorage.getItem('BENE_FITS'))
          let index = list.findIndex((v, i) => {
            return v.codeField === arr[1]
          })
          if (index === -1) {
            arr[1] = ''
          }
        }
        if (arr.length > 0 && this.datas.iEFlag === 'I' && arr[1].toString() !== '3') {
          this.messageTips('进口时,出口享惠情应为[3-不适用于进口报关单]')
          arr[1] = '3'
        }
        for (let i in arr) {
          this.reqform.datas[i] = arr[i]
        }
      }
      this.formDataChange()
      this.initSelect()
    },
    typeChange (value) {
      if (value === '2') {
        this.$refs['GTIN'][0].focus()
        this.$refs['GTIN'][0].select()
      } else {
        this.$refs['brandTypes'][0].focus()
        this.$refs['brandTypes'][0].$children[0].select()
        // 清空所有的选项
      }
    },
    /**
     * GTIN校验 暂未使用
     * @param gtin
     * @returns {Boolean}
     */
    checkGTIN (gtin) {
      if (!gtin) {
        return {flag: true, tipMsg: ''}
      }
      let reg = /^[0-9]*$/
      if (!reg.test(gtin)) {
        return {flag: false, tipMsg: 'GTIN必须全部是数字字符'}
      }
      if (!(gtin.length === 8 || (gtin.length >= 12 && gtin.length < 14))) {
        return {flag: false, tipMsg: 'GTIN必须是13位、12位或8位'}
      }
      let oddSum = 0
      let evenNumSum = 0
      for (let i = gtin.length - 1; i >= 0; i--) {
        if (gtin.length - i >= 2 && (gtin.length - i) % 2 === 0) {
          oddSum += Number(gtin.substring(i, i + 1))
        }
        if (gtin.length - i >= 3 && (gtin.length - i) % 2 === 1) {
          evenNumSum += Number(gtin.substring(i, i + 1))
        }
      }
      let finalNum = (10 - (oddSum * 3 + evenNumSum) % 10) % 10
      if (finalNum === Number(gtin.substring(gtin.length - 1))) {
        return {flag: true, tipMsg: ''}
      }
      return {flag: false, tipMsg: 'GTIN校验错误！'}
    },
    /**
     * 校验cas规则 暂未使用
     * @param cas
     * @returns {Boolean}
     */
    checkCAS (cas) {
      if (!cas) {
        return {flag: true, tipMsg: ''}
      }
      let casArray = cas.split('-')
      if (casArray === null || casArray.length !== 3) {
        return {flag: false, tipMsg: 'CAS校验错误！'}
      }
      if (!(casArray[0].length >= 2 && casArray[0].length <= 6 && casArray[1].length === 2 && casArray[2].length === 1)) {
        return {flag: false, tipMsg: 'CAS校验错误！'}
      }
      let firstCas = casArray[0] + casArray[1]
      let sum = 0
      for (let i = firstCas.length - 1; i >= 0; i--) {
        sum += Number(firstCas.substring(i, i + 1)) * (firstCas.length - i)
      }
      if (sum % 10 === Number(casArray[2])) {
        return {flag: true, tipMsg: ''}
      }
      return {flag: false, tipMsg: 'CAS校验错误！'}
    }
  }
}
</script>

<style scoped lang="less">
label {
  height: auto;
}
.border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
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
