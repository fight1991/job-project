<template>
<!-- 其表体组件 -->
  <section>
    <div class="dec-div">
      <el-form ref="bodyRuleForm" :rules="bodyRuleForm" @keyup.enter.native="switchFoucsByEnter"  :model="decList"  label-width="100px" size="mini" v-if="isShowInput.isCheck">
          <el-row  >
            <el-col :span="4">
              <el-form-item label="项号">
                <el-input v-model="decList.gNo" @focus="tipsFillMessage('gNo')" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="商品编号"  prop="codeTs" ref="codeTs">
                <el-input  :class="{ 'require-color': controller.requireColor }"
                @focus="tipsFillMessage('codeTs')"
                v-model="decList.codeTs"
                :readonly="controller.isDisabled"
                :maxlength="10" dataRef='codeTs'
                enter = 'no'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="检验检疫名称" >
                <el-col :span="21" >
                  <el-input v-model="decList.ciqName" readonly></el-input>
                  <!-- <div class='shade-div' @click ="cancelCiqName"></div> -->
                </el-col>
                <el-col :span="3">
                  <el-button class="btn-pop" icon="fa fa-ellipsis-h" @click="openEncodeTableContent"></el-button>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="14">
              <el-form-item label="商品名称" prop="gName" ref="gName" key="gNameA">
                <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="255"
                  @focus="tipsFillMessage('gName')" dataRef='gName'
                  v-model="decList.gName"  :readonly="controller.isDisabled">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="成交数量" prop="gQty" ref="gQty">
                <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="20"
                  @focus="tipsFillMessage('gQty')"
                  @blur="gQtyBlur"
                  enter='no'
                  v-model="decList.gQty"  :readonly="controller.isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="成交计量单位"  :class="{ 'require-color': controller.requireColor }">
                <el-select placeholder=" " v-model="decList.gUnit"
                  @focus="tipsFillMessage('gUnit', 'saasUnit1','SAAS_UNIT')"
                  ref="gUnit" dataRef ='gUnit'
                  remote  default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasUnit1')"
                  clearable filterable
                  :disabled="controller.isDisabled" style="width:100%">
                  <el-option
                    v-for="item in saasUnit1"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="4">
              <el-form-item label="法定第一计量单位">
                <el-select placeholder=" " v-model="decList.unit1"
                  @focus="tipsFillMessage('unit1', 'saasUnit2','SAAS_UNIT')"
                  remote  default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasUnit2')"
                  ref="unit1" dataRef ='unit1'
                  clearable filterable disabled style="width:100%">
                  <el-option
                    v-for="item in saasUnit2"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="法定第二计量单位">
                <el-select placeholder=" " v-model="decList.unit2"
                  @focus="tipsFillMessage('unit2', 'saasUnit3','SAAS_UNIT')"
                  remote  default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasUnit3')"
                  ref="unit2" dataRef ='unit2'
                  disabled
                  clearable filterable style="width:100%">
                  <el-option
                    v-for="item in saasUnit3"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="总价" prop="declTotal" label-width="50px">
                <el-input  :class="{ 'require-color': controller.requireColor }"
                :maxlength="18" v-model="decList.declTotal"
                @focus="tipsFillMessage('declTotal')"
                ref='declTotal'
                :readonly="controller.isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="币制" label-width="50px" :class="{ 'require-color': controller.requireColor }" prop="tradeCurr">
                <el-select placeholder=" " v-model="decList.tradeCurr"
                  @focus="tipsFillMessage('tradeCurr', 'saasCurr4','SAAS_CURR')"
                  remote clearable filterable   default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCurr4')"
                  ref="tradeCurr" dataRef ='tradeCurr'
                  :disabled="controller.isDisabled" style="width:100%" >
                  <el-option
                    v-for="item in saasCurr4"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="14" >
              <el-form-item label="原产国(地区)"  :class="{ 'require-color': controller.requireColor }" prop="originCountry">
                  <el-select placeholder=" " v-model="decList.originCountry"
                  @focus="tipsFillMessage('originCountry', 'saasCountry4','SAAS_COUNTRY')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCountry4')"
                  ref="originCountry" dataRef ='originCountry'
                  clearable filterable :disabled="controller.isDisabled" style="width:100%">
                  <el-option
                    v-for="item in saasCountry4"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row  >
              <el-col :span="14">
                <el-form-item label="货物属性">
                  <el-col :span="21">
                    <el-input v-model="showGoodsAttrValue"  @focus="tipsFillMessage('showGoodsAttrValue')" readonly></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodAtrrContent"></el-button>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="用途"  :class="{ 'require-color': controller.requireColor }"  prop="purpose">
                  <el-select placeholder=" " v-model="decList.purpose"
                    @focus="tipsFillMessage('purpose', 'saasUserTo','SAAS_USER_TO')"
                    remote default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasUserTo')"
                    dataRef ='purpose'  ref="purpose"
                    clearable  filterable :disabled="controller.isDisabled" style="width:100%"
                    @keyup.enter.native="directSaveDecList">
                  <el-option
                    v-for="item in saasUserTo"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item >
                  <el-button type="primary" class="w-100" @click="openfilingInfoContent">产品资质</el-button>
                </el-form-item>
              </el-col>
            </el-row>
      </el-form>
      <el-form ref="bodyRuleForm" :rules="bodyRuleForm" @keyup.enter.native="switchFoucsByEnter"  :model="decList"  label-width="100px" size="mini" v-else>
          <el-row  >
            <el-col :span="4">
              <el-form-item label="项号">
                <el-input v-model="decList.gNo" @focus="tipsFillMessage('gNo')" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="商品编号"  ref="codeTs2" prop="codeTs">
                <el-input  :class="{ 'require-color': controller.requireColor }"
                placeholder="请输入前六位商品编码"
                @focus="tipsFillMessage('codeTs')"
                v-model="decList.codeTs"
                :readonly="controller.isDisabled"
                :maxlength="6" dataRef='codeTs2'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="商品名称" prop="gName" ref="gName2" key="gNameB">
                <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="255"
                  @focus="tipsFillMessage('gName')" dataRef='gName2'
                  v-model="decList.gName"  :readonly="controller.isDisabled">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="4">
              <el-form-item label="成交数量" prop="gQty" ref="gQty">
                <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="20"
                  @focus="tipsFillMessage('gQty')"
                  @blur="gQtyBlur"
                  enter='no'
                  v-model="decList.gQty"  :readonly="controller.isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="成交计量单位"  :class="{ 'require-color': controller.requireColor }">
                <el-select placeholder=" " v-model="decList.gUnit"
                  @focus="tipsFillMessage('gUnit', 'saasUnit1','SAAS_UNIT')"
                  ref="gUnit" dataRef ='gUnit'
                  remote  default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasUnit1')"
                  clearable filterable
                  :disabled="controller.isDisabled" style="width:100%">
                  <el-option
                    v-for="item in saasUnit1"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
               <el-form-item label="总价" prop="declTotal" label-width="50px">
                <el-input  :class="{ 'require-color': controller.requireColor }"
                :maxlength="18" v-model="decList.declTotal"
                @focus="tipsFillMessage('declTotal')"
                ref='declTotal'
                :readonly="controller.isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="币制" label-width="50px" :class="{ 'require-color': controller.requireColor }" prop="tradeCurr">
                <el-select placeholder=" " v-model="decList.tradeCurr"
                  @focus="tipsFillMessage('tradeCurr', 'saasCurr4','SAAS_CURR')"
                  remote clearable filterable   default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCurr4')"
                  ref="tradeCurr" dataRef ='tradeCurr'
                  :disabled="controller.isDisabled" style="width:100%" >
                  <el-option
                    v-for="item in saasCurr4"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="14" >
              <el-form-item label="原产国(地区)"  :class="{ 'require-color': controller.requireColor }" prop="originCountry">
                  <el-select placeholder=" " v-model="decList.originCountry"
                  @focus="tipsFillMessage('originCountry', 'saasCountry4','SAAS_COUNTRY')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCountry4')"
                  ref="originCountry" dataRef ='originCountry'
                  clearable filterable :disabled="controller.isDisabled" style="width:100%"
                  @keyup.enter.native="directSaveDecList">
                  <el-option
                    v-for="item in saasCountry4"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
    </div>
    <!-- 商品列表 -->
    <goods-info :productListVisible='productListVisible' :isDisabled='controller.isDisabled' :productList="productList"  @close:goodsInfo="saveGoodsInfo"></goods-info>
    <!-- 检验检疫商品列表 -->
    <ciq-goods :encodeTableVisible.sync='encodeTableVisible' :isDisabled='controller.isDisabled' :encodeTableList="encodeTableList"  @close:ciqGoods="saveCiqGoods"></ciq-goods>
    <!-- 货物属性 -->
    <goods-attribute :goodsAttrVisible='goodsAttrVisible' :goodsAttrCollection="goodsAttrCollection" :saasGoodsAttr="saasGoodsAttr" :isDisabled='controller.isDisabled'  @close:goodsAttribute="backGoodsAttr"></goods-attribute>
    <!-- 产品许可证/审批/备案信息 -->
    <product-license :filingInfoVisible='filingInfoVisible' :decList="decList" :controller='controller'  @close:productLicense="backProductLicense"></product-license>
  </section>
</template>
<script>
import util from '@/common/util.js'
import decUtil from '../../decPage/common/decUtil'
// import { mapState } from 'vuex'
import goodsInfo from '../../decPage/decList/components/goodsInfo'
import ciqGoods from '../../decPage/decList/components/ciqGoods'
import goodsAttribute from '../../decPage/decList/components/goodsAttribute'
import productLicense from '../../decPage/decList/components/productLicense'
export default {
  name: 'dec-list',
  props: {
    checkedTableData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableList: {
      type: Array,
      default: () => {
        return []
      }
    },
    moduleName: {
      type: String
    }
  },
  components: {
    goodsInfo,
    ciqGoods,
    goodsAttribute,
    productLicense
  },
  data () {
    return {
      decList: {
        decListPid: '', // 表体主键
        decPid: '', // 报关单主键
        gNo: '1', // 项号
        codeTs: '', // 商品编号
        ciqName: '', // 检验检疫名称
        gName: '', // 商品名称
        gQty: '', // 成交数量
        gUnit: '', // 成交计量单位
        unit1: '', // 法定第一计量单位
        unit2: '', // 法定第二计量单位
        declTotal: '', // 总价
        tradeCurr: '', // 币制
        decGoodsLimits: [], // 产品资质
        gUnitValue: '', // 成交计量单位名称
        goodsAttr: '', // 货物属性 code
        goodsBrand: '', // 货物品牌
        goodsModel: '', // 货物型号
        stuffNote: '', // 成分/原料/组分
        goodsSpec: '', // 货物规格
        noDangFlag: '', // 非危险化学品
        origPlaceCode: '', // 原产地区代码
        purpose: '', // 用途
        ciqCode: '' // CIQ代码
      },
      isShowInput: {
        isDoc: false, // 是否涉证
        isCheck: false, // 是否涉检
        isTax: false // 是否涉税
      },
      showGoodsAttrValue: '', // 货物属性
      productListVisible: false,
      productList: [],
      encodeTableVisible: false, // 检验检疫商品列表
      encodeTableList: [], // 检验检疫商品列表
      filingInfoVisible: false, // 产品许可证/审批/备案信息
      goodsAttrCollection: [],
      goodsAttrVisible: false,
      bodyRuleForm: {
        codeTs: [ //  商品编号
          {validator: this.checkListValid, message: '请输入正确的商品编号', trigger: 'blur'}
        ],
        gName: [ //  商品名称
          {validator: this.checkListValid, message: '商品名称不能为空', trigger: 'blur'}
        ],
        gQty: [ //  成交数量
          {validator: this.checkListValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
        ],
        declTotal: [ //  总价
          {validator: this.checkListValid, message: '输入整数最多15位，小数最多2位的非负数', trigger: 'blur'}
        ],
        purpose: [ //  用途
          {validator: this.checkListValid, message: '输入用途', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        // 表体
        'gName': '^.{1,256}$', //  商品名称
        'gQty': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  成交数量
        'declTotal': '^\\d{1,15}(\\.\\d{1,2})?$|^$', //  总价
        'purpose': '^[0-9a-zA-Z]{1,3}$|^$' // 用途
      },
      selectObj: {
        obj: '',
        params: ''
      },
      bodySelect: { // 表体
        'gUnit': {obj: 'saasUnit1', params: 'SAAS_UNIT'}, // 成交计量单位
        'tradeCurr': {obj: 'saasCurr4', params: 'SAAS_CURR'}, // 币制
        'unit1': {obj: 'saasUnit2', params: 'SAAS_UNIT'}, // 法定第一计量单位
        'unit2': {obj: 'saasUnit3', params: 'SAAS_UNIT'}, // 法定第二计量单位
        'originCountry': {obj: 'saasCountry4', params: 'SAAS_COUNTRY'}, // 原产国(地区)
        'purpose': {obj: 'saasUserTo', params: 'SAAS_USER_TO'} // 用途
      },
      saasUnit1: [], // 成交计量单位
      saasCurr4: [], // 币制
      saasUnit2: [], // 法定第一计量单位
      saasUnit3: [], // 法定第二计量单位
      saasCountry4: [], // 原产国(地区)
      saasUserTo: [], // 用途
      saasGoodsAttr: [],
      isInsert: false
    }
  },
  created () {
  },
  watch: {
    declareType (newVal, oldVal) {
      if (newVal.indexOf(2) !== -1) {
        this.isShowInput.isCheck = true
        this.decList.ciqName = ''
        this.decList.unit1 = ''
        this.decList.unit2 = ''
        this.showGoodsAttrValue = ''
        this.decList.purpose = ''
      } else {
        this.isShowInput.isCheck = false
        if (this.decList.codeTs) {
          this.decList.codeTs = this.decList.codeTs.slice(0, 6)
        }
      }
    },
    'checkedTableData': function (newVal, oldVal) {
      this.decList = util.simpleClone(newVal)
    }
  },
  computed: {
    controller () {
      return this.$store.state[this.moduleName].controller
    },
    tipsMessage () {
      return this.$store.state[this.moduleName].tipsMessage
    },
    tipsNoteShow () {
      return this.$store.state[this.moduleName].tipsNoteShow
    },
    tipsNote () {
      return this.$store.state[this.moduleName].tipsNote
    },
    declareType () {
      return this.$store.state[this.moduleName].declareType
    },
    swtichCheck () {
      return this.$store.state[this.moduleName].swtichCheck
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    }
  },
  methods: {
    clearBodyItemData () {
      this.decList.decListPid = ''
      this.decList.decPid = ''
    },
    // 初始化
    initBodyForm () {
      return {
        decListPid: '', // 表体主键
        decPid: '', // 报关单主键
        gNo: '', // 项号
        codeTs: '', // 商品编号
        ciqName: '', // 检验检疫名称
        gName: '', // 商品名称
        gQty: '', // 成交数量
        gUnit: '', // 成交计量单位
        unit1: '', // 法定第一计量单位
        unit2: '', // 法定第二计量单位
        declTotal: '', // 总价
        tradeCurr: '', // 币制
        decGoodsLimits: [], // 产品资质
        gUnitValue: '', // 成交计量单位名称
        goodsAttr: '', // 货物属性 code
        goodsBrand: '', // 货物品牌
        goodsModel: '', // 货物型号
        stuffNote: '', // 成分/原料/组分
        goodsSpec: '', // 货物规格
        noDangFlag: '', // 非危险化学品
        origPlaceCode: '', // 原产地区代码
        purpose: '', // 用途
        ciqCode: '' // CIQ代码
      }
    },
    resetBodyForOther () {
      let decLen = this.tableList.length + 1
      let resetDecList = this.initBodyForm()
      resetDecList.gNo = decLen // 项号
      this.decList = resetDecList
      this.saasUnit1 = [] // 成交计量单位
      this.saasCurr4 = [] // 币制
      this.saasUnit2 = [] // 法定第一计量单位
      this.saasUnit3 = [] // 法定第二计量单位
      this.saasCountry4 = [] // 原产国(地区)
      this.saasUserTo = [] // 用途
      this.saasGoodsAttr = []
      this.showGoodsAttrValue = ''
    },
    // 主界面头部新增
    initBodyItemData () {
      this.decList = {
        decListPid: '', // 表体主键
        decPid: '', // 报关单主键
        gNo: '1', // 项号
        codeTs: '', // 商品编号
        ciqName: '', // 检验检疫名称
        gName: '', // 商品名称
        gQty: '', // 成交数量
        gUnit: '', // 成交计量单位
        unit1: '', // 法定第一计量单位
        unit2: '', // 法定第二计量单位
        declTotal: '', // 总价
        tradeCurr: '', // 币制
        decGoodsLimits: [], // 产品资质
        gUnitValue: '', // 成交计量单位名称
        goodsAttr: '', // 货物属性 code
        goodsBrand: '', // 货物品牌
        goodsModel: '', // 货物型号
        stuffNote: '', // 成分/原料/组分
        goodsSpec: '', // 货物规格
        noDangFlag: '', // 非危险化学品
        origPlaceCode: '', // 原产地区代码
        purpose: '', // 用途
        ciqCode: '' // CIQ代码
      }
      this.saasUnit1 = [] // 成交计量单位
      this.saasCurr4 = [] // 币制
      this.saasUnit2 = [] // 法定第一计量单位
      this.saasUnit3 = [] // 法定第二计量单位
      this.saasCountry4 = [] // 原产国(地区)
      this.saasUserTo = [] // 用途
      this.saasGoodsAttr = []
      this.showGoodsAttrValue = ''
    },
    // 成交数量聚焦
    gQtyFocus () {
      this.$refs['gQty'].$children[1].focus()
      this.$refs['gQty'].$children[1].select()
    },
    // 商品编码聚焦
    gNoFocus () {
      this.$refs['codeTs'].$children[1].focus()
      this.$refs['codeTs'].$children[1].select()
    },
    // 商品名称聚焦
    gNameFocus () {
      this.$refs['gName'].$children[1].focus()
      this.$refs['gName'].$children[1].select()
    },
    // 打开 商品编号 弹出框
    openProductList (flag) {
      if (util.isEmpty(this.decList.codeTs)) {
        return false
      }
      if (this.decList.codeTs.length < 4) {
        this.messageTips('至少输入四位商品编号')
        this.$refs['codeTs'].$children[1].select()
        return false
      }
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          'codeTs': this.decList.codeTs,
          'iEFlag': 'I'
        },
        success: (res) => {
          this.productList = res.result
          if (this.productList === null || this.productList === undefined || this.productList.length === 0) {
            this.messageTips('无此商品编号', 'error')
            this.decList.codeTs = ''
            this.productList = []
            this.$refs['codeTs'].$children[1].select()
          } else {
            this.productListVisible = true
          }
        }
      })
    },
    // 商品列表 回参
    saveGoodsInfo (param) {
      let checkedgoods = param.checkedgoods
      this.decList.codeTs = checkedgoods.codeTs
      if (checkedgoods.controlMa === '无') {
        this.decList.controlMa = ''
      } else {
        let maArr = []
        let controlMa = checkedgoods.controlMa.split('')
        // 出口的许可证
        let exportArr = ['3', '4', '5', '8', 'B', 'E', 'G', 'H', 'x', 'y']
        for (let i in controlMa) {
          // 里面如果有出口的许可证 则去除
          if (!exportArr.includes(controlMa[i])) {
            maArr.push(controlMa[i])
          }
        }
        this.decList.controlMa = maArr.join(',')
      }
      this.decList.gName = checkedgoods.gName
      if (util.isEmpty(checkedgoods.gUnit)) {
        this.decList.gUnit = checkedgoods.unit1
      } else {
        this.decList.gUnit = checkedgoods.gUnit
      }
      this.decList.unit1 = checkedgoods.unit1
      this.decList.unit2 = checkedgoods.unit2
      // 初始化下拉框 TODO
      decUtil.initSelect(this, this.bodySelect, this.decList)
      this.productListVisible = false
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getHSDetail',
        data: {
          'codeTs': this.decList.codeTs,
          'iEFlag': 'I'
        },
        success: (res) => {
          this.encodeTableList = res.result
          if (!this.encodeTableList || this.encodeTableList.length === 0) {
            this.encodeTableList = []
          } else if (this.encodeTableList.length === 1) {
            this.decList.ciqName = this.encodeTableList[0].gNameNote
            this.decList.ciqCode = this.encodeTableList[0].ciqCo
            this.encodeTableList = []
            this.gQtyFocus()
          } else {
            this.encodeTableVisible = true
          }
        }
      })
    },
    saveCiqGoods (param) {
      if (param.ciqData) {
        this.decList.ciqName = param.ciqData.gNameNote
        this.decList.ciqCode = param.ciqData.ciqCo
      }
      this.encodeTableVisible = false
      this.gQtyFocus()
    },
    // 打开检验检疫编码表
    openEncodeTableContent () {
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getHSDetail',
        data: {
          'codeTs': this.decList.codeTs,
          'iEFlag': 'I'
        },
        success: (res) => {
          this.encodeTableList = res.result
          if (!this.encodeTableList || this.encodeTableList.length === 0) {
            this.messageTips('无此商品编号', 'error')
            this.encodeTableList = []
          } else {
            this.encodeTableVisible = true
          }
        }
      })
    },
    gQtyBlur () {
      this.$refs['gUnit'].focus()
    },
    // 打开 产品资质  备案信息 弹出框
    openfilingInfoContent () {
      // 判断 是否能打开弹出框
      this.$refs['bodyRuleForm'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          // 显示弹出框
          this.filingInfoVisible = true
        }
      })
    },
    // 产品资质备案信息弹出框 回参
    backProductLicense (param) {
      if (param) {
        this.decList.decGoodsLimits = util.simpleClone(param.decGoodsLimits)
        if (+this.decList.gNo > this.tableList.length) {
          this.filingInfoVisible = false
        } else {
          this.saveDecListNoRefresh()
          this.filingInfoVisible = false
        }
      }
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
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
        let ref
        if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
          if (!util.isEmpty(e.target.attributes.dataRef)) {
            ref = e.target.attributes.dataRef.nodeValue
          }
          if (ref === 'codeTs') {
            this.openProductList(true)
          }
          return false
        } else {
          if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
            ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
            // this.$refs[ref].blur()
          } else {
            if (!util.isEmpty(e.target.attributes.dataRef)) {
              ref = e.target.attributes.dataRef.nodeValue
            }
          }
          if (ref === 'gName') {
            this.gNoFocus()
          } else if (ref === 'originCountry' && this.isShowInput.isCheck) {
            this.openGoodAtrrContent()
          } else {
            next.focus()
            next.select()
          }
        }
      }
    },
    checkListValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg
      if (name === 'codeTs') {
        if (this.isShowInput.isCheck) {
          reg = /^\d{1,10}$/
        } else {
          reg = /^\d{6}$/
        }
      } else {
        reg = new RegExp(this.ruleRegx[name])
      }
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['bodyRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 初始化下拉框
    initBodySelect () {
      decUtil.initSelect(this, this.bodySelect, this.decList)
    },
    // 格式话反填表体时的数据
    formatDecList (data) {
      // 货物属性 转化为name
      let goodsAttrValue = []
      let list = data.goodsAttr.split(',')
      let comList = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
      for (let n in list) {
        for (let i in comList) {
          if (list[n] === comList[i].codeField) {
            goodsAttrValue.push(comList[i].nameField)
          }
        }
      }
      this.showGoodsAttrValue = goodsAttrValue.join(',')
      // 初始化表体下拉框
      this.$nextTick(() => {
        this.initBodySelect()
      })
    },
    // 直接保存报关单表体,需要添加报关单表体的校验逻辑
    directSaveDecList () {
      let flag = true
      if (this.tableList.length === 50) {
        for (let i in this.tableList) {
          if (this.tableList[i].gNo === this.decList.gNo) { // 存在相同的gNo 走修改
            flag = false
            break
          }
        }
      } else {
        flag = false
      }
      if (flag) {
        this.messageTips('表体数据不能超过50条')
        return
      }
      this.$refs['bodyRuleForm'].validate((valid) => {
        if (valid) {
          this.saveDecListNoRefresh()
          // 传 decList是因为需要有些字段不需要清空
          this.saveRefreshDecList(util.simpleClone(this.decList))
          // this.refreshDecList()
        }
      })
    },
    // 表体字段的初始化聚焦
    focusDecList () {
      if (this.isShowInput.isCheck) {
        this.gNameFocus()
      } else {
        this.$refs['codeTs2'].$children[1].focus()
        this.$refs['codeTs2'].$children[1].select()
      }
    },
    // 保存报关单表体时 需要清除数据
    saveRefreshDecList (listVo) {
      let decLen = this.tableList.length + 1
      let resetDecList = this.initBodyForm()
      resetDecList.gNo = decLen // 项号
      this.decList = resetDecList
      this.showGoodsAttrValue = ''
      decUtil.initSelect(this, this.bodySelect, this.decList)
      this.focusDecList()
    },
    // 打开货物属性弹出框
    openGoodAtrrContent () {
      this.saasGoodsAttr = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
      this.goodsAttrCollection = [] // 先清空以前的数据
      if (!util.isEmpty(this.decList.goodsAttr)) {
        let goodsAttrList = this.decList.goodsAttr.split(',')
        let goodsAttrValueList = this.showGoodsAttrValue.split(',')
        for (let index in goodsAttrList) {
          this.goodsAttrCollection.push(goodsAttrList[index] + '-' + goodsAttrValueList[index])
        }
      }
      this.goodsAttrVisible = true
    },
    // 保存 货物属性的值
    backGoodsAttr (param) {
      if (param !== null) {
        this.goodsAttrCollection = util.simpleClone(param.goodsAttrCollection)
        let goodsAttrList = []
        let goodsAttrValueList = []
        for (let index in this.goodsAttrCollection) {
          goodsAttrList.push(this.goodsAttrCollection[index].split('-')[0])
          goodsAttrValueList.push(this.goodsAttrCollection[index].split('-')[1])
        }
        this.decList.goodsAttr = goodsAttrList.join(',')
        this.showGoodsAttrValue = goodsAttrValueList.join(',')
      }
      this.goodsAttrVisible = false
      // 焦点到 用途
      this.$refs['purpose'].focus()
    },
    /**
     * 保存 报关单表体信息 不清空数据
     * 1.判断 本条数据 是否为插入数据
     * 2.判断 本条数据 是否为修改
     * 3.判断 本条数据 是否为新增
     */
    saveDecListNoRefresh () {
      // code 转 name 方便 table里的显示
      this.gUnitChangeName(this.decList.gUnit)
      this.tradeCurrChangeName(this.decList.tradeCurr)
      this.originCountryChangeName(this.decList.originCountry)
      let gNo = this.decList.gNo
      // 判断是否为插入
      if (this.isInsert) { // 走插入
        let i = parseInt(gNo) - 1
        let insertData = util.simpleClone(this.decList)
        delete insertData.isInsert
        // 插入
        this.tableList.splice(i, 0, insertData)
        // 重新排序
        for (let n in this.tableList) {
          this.tableList[n].gNo = parseInt(n) + 1
        }
        this.$emit('backData', insertData)
        return true
      }
      // 一个变量 记录 是否为新增新
      let isModify = true
      for (let i in this.tableList) {
        if (this.tableList[i].gNo === gNo) { // 存在相同的gNo 走修改
          this.tableList[i] = util.simpleClone(this.decList)
          // 为了刷新列表
          this.tableList.push({})
          this.tableList.pop()
          this.$emit('backData', this.tableList[i])
          isModify = false
          break
        }
      }
      if (isModify) { // 走新增
        this.tableList.push(util.simpleClone(this.decList))
      }
    },
    // 成交计量单位 code 转 name
    gUnitChangeName (value) {
      for (let i in this.saasUnit1) {
        if (this.saasUnit1[i].codeField === value) {
          this.decList.gUnitValue = this.saasUnit1[i].nameField
          break
        }
      }
    },
    // 币制 code 转 name
    tradeCurrChangeName (value) {
      for (let i in this.saasCurr4) {
        if (this.saasCurr4[i].codeField === value) {
          this.decList.tradeCurrValue = this.saasCurr4[i].nameField
          break
        }
      }
    },
    // 原产地国（地区） code 转 name
    originCountryChangeName (value) {
      for (let i in this.saasCountry4) {
        if (this.saasCountry4[i].codeField === value) {
          this.decList.originCountryValue = this.saasCountry4[i].nameField
          break
        }
      }
    },
    changeGno (flag) {
      this.decList.gNo = flag + ''
    },
    changeIsInsert (flag) {
      this.isInsert = flag
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../decPage/common/decCss';
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
}
</style>
