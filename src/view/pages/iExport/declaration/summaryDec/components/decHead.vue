<template>
  <section>
    <div class='dec-div mg-b-15'>
      <el-form ref="headRuleForm" :model="decHead" :rules="headRuleForm" label-width="112px" size="mini" @keyup.enter.native="switchFoucsByEnter">
        <el-row>
          <el-col :span="12">
            <el-form-item label="申报地海关" :class="{ 'require-color': controller.requireColor}"  prop="customMaster">
              <el-select placeholder=" " v-model="decHead.customMaster"
                @focus="tipsFillMessage('customMaster', 'saasCustomsRel1','SAAS_CUSTOMS_REL')"
                filterable remote clearable
                default-first-option
                :remote-method="checkParamsList"
                @clear="clearSelct('saasCustomsRel1')"
                ref="customMaster" dataRef ='customMaster'
                :disabled="controller.isDisabled" style="width:100%">
                  <el-option
                    v-for="item in saasCustomsRel1"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申报日期">
              <el-date-picker
                v-model="decHead.dDate"
                type="date"
                :editable='false'
                style="width:100%"
                disabled
                @focus="tipsFillMessage('dDate')"
                placeholder=" "
                format='yyyyMMdd'
                value-format="yyyyMMdd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申报状态">
              <el-input v-model="decHead.statusValue" readonly  @focus="tipsFillMessage('statusValue')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="统一编号">
              <el-input v-model="decHead.seqNo" readonly @focus="tipsFillMessage('seqNo')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="海关编号">
              <el-input v-model="decHead.entryId" readonly @focus="tipsFillMessage('entryId')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="controller.iEFlag == 'I' ? '进境关别':'出境关别'" :class="{ 'require-color': controller.requireColor}" prop="iEPort">
              <el-select placeholder=" " v-model="decHead.iEPort"
              default-first-option remote
              filterable ref="iEPort" dataRef ='iEPort'
              :remote-method="checkParamsList"
              @clear="clearSelct('saasCustomsRel2')"
              @focus="tipsFillMessage('iEPort', 'saasCustomsRel2','SAAS_CUSTOMS_REL')"
              clearable :disabled="controller.isDisabled" style="width:100%" >
                <el-option
                  v-for="item in saasCustomsRel2"
                  :showLabel="showCustomsCode? '' : item.nameField"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="境内收发货人">
              <el-col :span="6">
                <el-form-item prop="tradeCoScc" ref="tradeCoScc">
                  <el-input :class="{ 'require-color': controller.requireColor}"
                    v-model="decHead.tradeCoScc" :maxlength="18" placeholder="18位社会信用代码"
                    @focus="tipsFillMessage('tradeCoScc')"
                    dataRef='tradeCoScc'
                    @blur="queryCropInfo('tradeCoScc', $event)"
                    :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="tradeCode" ref="tradeCode">
                  <el-input :class="{ 'require-color': controller.requireColor }"
                    v-model="decHead.tradeCode" :maxlength="10" placeholder="10位海关编码"
                    @focus="tipsFillMessage('tradeCode')"
                    dataRef='tradeCode'
                    @blur="queryCropInfo('tradeCode', $event)"
                    :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="isShowInput.isCheck">
                <el-form-item prop="consigneeCode" ref="consigneeCode">
                  <el-input v-model="decHead.consigneeCode" placeholder="10位检验检疫编码" :class="{ 'require-color': controller.requireColor }"
                    @focus="tipsFillMessage('consigneeCode')"
                    :maxlength="10" :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="isShowInput.isCheck?10:14">
                <el-form-item prop="tradeName" ref='tradeName'>
                  <el-autocomplete
                    :class="{ 'require-color': controller.requireColor }"
                    :maxlength="70"
                    placeholder="企业名称(中文),输入两位字符开始匹配"
                    size='mini'
                    @input='checklen("decHead", "tradeName", 70)'
                    @focus="tipsFillMessage('tradeName')"
                    v-model="decHead.tradeName"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    :select-when-unmatched='true'
                    :highlight-first-item='true'
                    :readonly="controller.isDisabled"
                    @select="handleSelect($event, '1')">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isShowInput.isDoc">
          <el-col :span="24" >
            <el-form-item label="消费使用单位">
              <el-col :span="6">
                <el-form-item prop="ownerCodeScc" ref="ownerCodeScc" >
                  <el-input :class="{ 'require-color': controller.requireColor}" :maxlength="18"
                  @focus="tipsFillMessage('ownerCodeScc')"
                  dataRef='ownerCodeScc'
                  @blur="queryCropInfo('ownerCodeScc', $event)"
                  v-model="decHead.ownerCodeScc" placeholder="18位社会信用代码" :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="ownerCode" ref="ownerCode">
                  <el-input :class="{ 'require-color': controller.requireColor }" :maxlength="10"
                    @focus="tipsFillMessage('ownerCode')"
                    dataRef='ownerCode'
                    @blur="queryCropInfo('ownerCode', $event)"
                    v-model="decHead.ownerCode" placeholder="10位海关编码" :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="isShowInput.isCheck">
                <el-form-item prop="ownerCiqCode" ref="ownerCiqCode">
                  <el-input v-model="decHead.ownerCiqCode" :maxlength="10" :class="{ 'require-color': controller.requireColor }"
                    @focus="tipsFillMessage('ownerCiqCode')"
                    placeholder="10位检验检疫编码" :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="isShowInput.isCheck?10:14">
                <el-form-item prop="ownerName" ref="ownerName">
                  <el-autocomplete
                    :class="{ 'require-color': controller.requireColor }"
                    :maxlength="70"
                    placeholder="企业名称,输入两位字符开始匹配"
                    size='mini'
                    @input='checklen("decHead", "ownerName", 100)'
                    @focus="tipsFillMessage('ownerName')"
                    v-model="decHead.ownerName"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    :select-when-unmatched='true'
                    :highlight-first-item='true'
                    :readonly="controller.isDisabled"
                    @select="handleSelect($event, '3')">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="申报单位">
              <el-col :span="6">
                <el-form-item prop="agentCodeScc" ref="agentCodeScc">
                  <el-input :class="{ 'require-color': controller.requireColor }" :maxlength="18"
                    @focus="tipsFillMessage('agentCodeScc')"
                    @blur="queryCropInfo('agentCodeScc', $event)"
                    v-model="decHead.agentCodeScc" placeholder="18位社会信用代码" :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="agentCode" ref="agentCode">
                  <el-input :class="{ 'require-color': controller.requireColor }" :maxlength="10"
                  @focus="tipsFillMessage('agentCode')"
                  @blur="queryCropInfo('agentCode', $event)"
                    v-model="decHead.agentCode" placeholder="10位海关编码" :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="isShowInput.isCheck">
                <el-form-item prop="declRegNo" ref="declRegNo">
                  <el-input :maxlength="10" v-model="decHead.declRegNo" placeholder="10位检验检疫编码" :class="{ 'require-color': controller.requireColor }"
                    @focus="tipsFillMessage('declRegNo')"
                    :readonly="controller.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="isShowInput.isCheck?10:14">
                <el-form-item prop="agentName" ref="agentName">
                  <el-autocomplete
                    :class="{ 'require-color': controller.requireColor }"
                    :maxlength="70"
                    placeholder="企业名称,输入两位字符开始匹配"
                    size='mini'
                    @focus="tipsFillMessage('agentName')"
                    v-model="decHead.agentName"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    :select-when-unmatched='true'
                    :highlight-first-item='true'
                    :readonly="controller.isDisabled"
                    @select="handleSelect($event, '4')">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="运输方式"  :class="{ 'require-color': controller.requireColor}" prop="trafMode">
              <el-select placeholder=" " v-model="decHead.trafMode"
                @focus="tipsFillMessage('trafMode', 'saasTransportType','SAAS_TRANSPORT_TYPE')"
                ref="trafMode" dataRef ='trafMode'
                remote default-first-option
                :remote-method="checkParamsList"
                @clear="clearSelct('saasTransportType')"
                clearable filterable :disabled="controller.isDisabled" style="width:100%">
                <el-option
                  v-for="item in saasTransportType"
                  :key="item.codeField"
                  :showLabel="showCustomsCode? '' : item.nameField"
                  :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运输工具名称" >
              <el-input v-model="decHead.trafName" :maxlength="50"
              @focus="tipsFillMessage('trafName')"
              :readonly="controller.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航次号">
              <el-input v-model="decHead.voyageNo" :maxlength="32"
                @focus="tipsFillMessage('voyageNo')"
                :readonly="controller.isDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提运单号" prop="billNo" ref="billNo">
                <el-input v-model="decHead.billNo" :maxlength="32"
                @focus="tipsFillMessage('billNo')"
                :readonly="controller.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="监管方式" :class="{ 'require-color': controller.requireColor}" prop="tradeMode">
              <el-select placeholder=" " v-model="decHead.tradeMode"
                @focus="tipsFillMessage('tradeMode', 'saasTrade','SAAS_TRADE')"
                ref="tradeMode" dataRef='tradeMode'
                remote default-first-option
                :remote-method="checkParamsList"
                @clear="clearSelct('saasTrade')"
                clearable filterable
                :disabled="controller.isDisabled || controller.cDisabled" style="width:100%">
                <el-option
                  v-for="item in saasTrade"
                  :key="item.codeField"
                  :showLabel="showCustomsCode? '' : item.nameField"
                  :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="毛重(KG)" prop="grossWt" ref="grossWt">
              <el-input v-model="decHead.grossWt" :maxlength="20" dataRef='grossWt'
                :class="{'require-color': controller.requireColor}"
                @focus="tipsFillMessage('grossWt')"
                :readonly="controller.isDisabled">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isShowInput.isDoc">
          <el-col :span="6">
            <el-form-item label="许可证号" prop="licenseNo" ref="licenseNo">
              <el-input v-model="decHead.licenseNo"  :maxlength="20"
                @focus="tipsFillMessage('licenseNo')" dataRef ='licenseNo'
                @keyup.native="changeLicenseNo"
                :readonly="controller.isDisabled">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 选择海关编码和检验检疫编码 -->
    <!-- <customs-code :customsCodeVisabled='customsCodeVisabled' :initParams="initCustomsCode"  @close:customsCode="receptionCustomsCode"></customs-code> -->
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../decPage/common/decUtil'
import customsCode from '../../decPage/decHead/components/customsCode'
import summaryBus from '../common/bus.js'
// import { mapState } from 'vuex'
export default {
  components: {
    customsCode
  },
  data () {
    return {
      decHead: this.resetHeadForm(),
      saasCustomsRel1: [], // 申报地海关
      saasCustomsRel2: [], // 进境关别
      saasTransportType: [], // 运输方式
      saasTrade: [], // 监管方式
      headSelect: {
        'customMaster': {obj: 'saasCustomsRel1', params: 'SAAS_CUSTOMS_REL'}, // 申报地海关
        'iEPort': {obj: 'saasCustomsRel2', params: 'SAAS_CUSTOMS_REL'}, // 进境关别
        'trafMode': {obj: 'saasTransportType', params: 'SAAS_TRANSPORT_TYPE'}, // 运输方式
        'tradeMode': {obj: 'saasTrade', params: 'SAAS_TRADE'}
      },
      headRuleForm: {
        customMaster: [ // 申报地海关
          {validator: this.checkHeadValid, message: '输入4位代码或名称', trigger: 'blur'}
        ],
        licenseNo: [ // 许可证号
          {validator: this.checkHeadValid, message: '请输入正确格式的许可证号', trigger: 'blur'}
        ],
        tradeCoScc: [ // 境内收发货人 18位社会信用代码
          {validator: this.checkHeadValid, message: '输入18位信用代码', trigger: 'blur'}
        ],
        tradeCode: [ // 境内收发货人 10位海关编码
          {validator: this.checkHeadValid, message: '输入10位海关编码', trigger: 'blur'}
        ],
        tradeName: [ // 境内收发货人 企业名称(中文)
          {validator: this.checkHeadValid, message: '输入70个字以内海关注册单位名称（中文）', trigger: 'blur'}
        ],
        ownerCodeScc: [ // 消费生产使用/生产销售单位 18位社会信用代码
          {validator: this.checkHeadValid, message: '输入18位信用代码', trigger: 'blur'}
        ],
        ownerCode: [ // 消费生产使用/生产销售单位 10位海关编码
          {validator: this.checkHeadValid, message: '输入9或10位海关编码或者"NO"', trigger: 'blur'}
        ],
        ownerName: [ // 消费生产使用/生产销售单位 企业名称
          {validator: this.checkHeadValid, message: '输入企业名称', trigger: 'blur'}
        ],
        agentCodeScc: [ // 申报单位 18位社会信用代码
          {validator: this.checkHeadValid, message: '输入18位社会信用代码', trigger: 'blur'}
        ],
        agentCode: [ // 申报单位 10位海关编码
          {validator: this.checkHeadValid, message: '输入10位海关编码', trigger: 'blur'}
        ],
        agentName: [ // 申报单位 企业名称
          {validator: this.checkHeadValid, message: '输入企业名称', trigger: 'blur'}
        ],
        trafMode: [ // 运输方式
          {validator: this.checkHeadValid, message: '输入运输代码（1位）或名称', trigger: 'blur'}
        ],
        tradeMode: [ // 监管方式
          {validator: this.checkHeadValid, message: '输入贸易代码4位', trigger: 'blur'}
        ],
        billNo: [ // 提运单号
          {validator: this.checkHeadValid, message: '仅包含字母数字下划线*', trigger: 'blur'}
        ],
        grossWt: [ // 毛重(KG)
          {validator: this.checkHeadValid, message: '输入整数不超过14位小数不超过5位的数', trigger: 'blur'},
          {validator: this.checkWeightValid, message: '毛重不足1时，按1填报', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        'customMaster': '^\\d{4}$', // 申报地海关
        'licenseNo': '^[0-9a-zA-Z]{2}-[0-9a-zA-Z]{2}-[0-9a-zA-Z]{1,14}$|^$', // 许可证号
        'tradeCoScc': '^[0-9a-zA-Z]{18}$|^NO$|^$', // 境内收发货人 18位社会信用代码
        'tradeCode': '^[0-9a-zA-Z]{10}$|^$', // 境内收发货人 10位海关编码
        'tradeName': '^.{1,70}$|^$', // 境内收发货人 企业名称(中文)
        'ownerCodeScc': '^[0-9a-zA-Z]{18}$|^NO$|^$', // 消费生产使用/生产销售单位 18位社会信用代码
        'ownerCode': '^[0-9a-zA-Z]{9,10}$|^NO$|^$', // 消费生产使用/生产销售单位 10位海关编码
        'ownerName': '^.{1,70}$|^$', // 消费生产使用/生产销售单位 企业名称
        'agentCodeScc': '^[0-9a-zA-Z]{18}$|^$', // 申报单位 18位社会信用代码
        'agentCode': '^[0-9a-zA-Z]{10}$|^$', // 申报单位 10位海关编码
        'agentName': '^.{1,70}$|^$', // 申报单位 企业名称
        'trafMode': '^[0-9a-zA-Z]{1}$|^$', // 运输方式
        'tradeMode': '^[0-9a-zA-Z]{4}$|^$', // 监管方式
        'billNo': '^.{0,32}$', // 提运单号
        'grossWt': '^\\d{1,14}(\\.\\d{1,5})?$|^$' // 毛重(KG)
      },
      selectObj: {
        obj: '',
        params: ''
      },
      isShowInput: {
        isDoc: false, // 是否涉证
        isCheck: false, // 是否涉检
        isTax: false // 是否涉税
      },
      headController: {
        isSeqNo: false // 是否切换为 统一编号 默认为关检关联号
      },
      customsCodeVisabled: false, // 选择海关编码和检验检疫编码
      initCustomsCode: {} // 选择海关编码和检验检疫编码
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
    switch () {
      return this.$store.state[this.moduleName].switch
    },
    swtichCheck () {
      return this.$store.state[this.moduleName].swtichCheck
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    }
  },
  props: {
    moduleName: {
      type: String
    }
  },
  created () {
  },
  watch: {
    declareType (newVal, oldVal) {
      this.isShowInput.isTax = newVal.indexOf(3) !== -1
      if (newVal.indexOf(1) !== -1) {
        this.isShowInput.isDoc = true
      } else {
        this.isShowInput.isDoc = false
        this.decHead.ownerCodeScc = ''
        this.decHead.ownerCode = ''
        this.decHead.ownerCiqCode = ''
        this.decHead.ownerName = ''
        this.decHead.licenseNo = ''
      }
      if (newVal.indexOf(2) !== -1) {
        this.isShowInput.isCheck = true
      } else {
        this.isShowInput.isCheck = false
        this.decHead.consigneeCode = ''
        this.decHead.ownerCiqCode = ''
        this.decHead.declRegNo = ''
      }
    }
  },
  methods: {
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
          } else if (ref === 'despPortCode' && this.controller.iEFlag === 'I') { // 进口启运港
            this.openOtherPriceFactor()
          } else if (ref === 'entyPortCode' && this.controller.iEFlag === 'E') {
            this.openOtherPriceFactor()
          } else if (ref === 'orgCode') {
            this.$refs['vsaOrgCode'].focus()
            this.$refs['vsaOrgCode'].$children[0].select()
          } else {
            next.focus()
            next.select()
          }
        }
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
        if (ref === 'origBoxFlag') { // 原箱运输
          this.openSpecialBusiContent()
        } else if (ref === 'grossWt' && this.isShowInput.isDoc === false) { // 毛重
          summaryBus.$emit('getGNameFocus', null)
        } else if (ref === 'licenseNo') { // 许可证号
          summaryBus.$emit('getGNameFocus', null)
        } else if (ref === 'correlationReasonFlag' && this.controller.iEFlag === 'E') {
          this.openSpecialBusiContent()
        }
      }
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
    },
    resetHeadForm () {
      return {
        pid: '', // 主键
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
        entryType: 'M', // 报关单类型
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
        billtype: '1', // 备案清单类型
        decRoyaltyFeeVO: null // 特许权使用费
      }
    },
    initHeadData () {
      this.decHead = this.resetHeadForm()
      this.saasCustomsRel1 = [] // 申报地海关
      this.saasCustomsRel2 = [] // 进境关别
      this.saasTransportType = [] // 运输方式
      this.saasTrade = [] // 监管方式
      this.decHead.iEFlag = this.controller.iEFlag
      this.decHead.declTrnrel = this.controller.declTrnrel
      this.initDefautHeadData('1')
      // if (this.controller.funFlag === 'recordList') {
      //   this.initbilltype()
      // }
    },
    // 初始化返填申报单位的数据
    initDefautHeadData (value) {
      let logInfo = this.$store.state.userLoginInfo
      if (value === '1') {
        this.decHead.agentCode = logInfo.tradeCode
        this.decHead.agentCodeScc = logInfo.sccCode
        this.decHead.agentName = logInfo.cusCorpName
        this.decHead.declRegNo = logInfo.ciqCode
      }
      this.controller.userName = logInfo.userName
      this.controller.agentName = logInfo.cusCorpName
      this.controller.userId = logInfo.userId
    },
    /**
     * 设置head 的数据 数据格式为：
     * {
     *  iEPort: ''0001',
     *  dDate: '20190101'
     * }
     */
    setHeadFieldValue (param) {
      for (let key in param) {
        this.decHead[key] = param[key]
      }
    },
    /**
     * 控制输入中英文字符长度，一个中文当做2个长度来控制
     * @param type form
     * @param inpt input 字段名
     * @param maxlen 最大长度
    */
    checklen (type, ipnut, maxlen) {
      decUtil.checklen(this, type, ipnut, maxlen)
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
    },
    checkParamsList (query, type = 'select') {
      decUtil.selectSearch(this, query, type)
    },
    /**
     * filed 表头字段名
     * obj 参数值
     * params 参数table
     */
    initHeadSingleSeLect (field, value, selectObj) {
      this.decHead[field] = value
      this.selectObj = selectObj
      this.checkParamsList(value, 'init')
    },
    initbilltype () {
      this.initHeadSingleSeLect('billtype', '1', {
        obj: 'billType',
        params: 'BILL_TYPE'
      })
    },
    // 选择海关编码接收数据
    receptionCustomsCode (res) {
      this.customsCodeVisabled = false
      let value = res.type
      if (value === 'tradeCoScc' || value === 'tradeCode' || value === 'tradeName') {
        if (!util.isEmpty(res.tradeCode)) {
          this.decHead.tradeCode = res.tradeCode
        }
        if (!util.isEmpty(res.ciqCode)) {
          this.decHead.consigneeCode = res.ciqCode
        }
        // 重新聚焦
      } else if (value === 'agentCodeScc' || value === 'agentCode' || value === 'agentName') {
        if (!util.isEmpty(res.tradeCode)) {
          this.decHead.agentCode = res.tradeCode
        }
        if (!util.isEmpty(res.ciqCode)) {
          this.decHead.declRegNo = res.ciqCode
        }
        // 重新聚焦
      } else {
        if (!util.isEmpty(res.tradeCode)) {
          this.decHead.ownerCode = res.tradeCode
        }
        if (!util.isEmpty(res.ciqCode)) {
          this.decHead.ownerCiqCode = res.ciqCode
        }
      }
    },
    // 查询企业信息
    queryCropInfo (value, e) {
      if (e.target.readOnly) {
        return
      }
      let param = {
        cusCorpName: '',
        sccCode: '',
        tradeCode: ''
      }
      if (value === 'tradeCoScc') {
        if (this.decHead.tradeCoScc.length === 18) {
          param.sccCode = this.decHead.tradeCoScc
        } else {
          return false
        }
      } else if (value === 'tradeCode') {
        if (this.decHead.tradeCode.length === 10) {
          param.tradeCode = this.decHead.tradeCode
        } else {
          return false
        }
      } else if (value === 'ownerCodeScc') {
        if (this.decHead.ownerCodeScc.length === 18) {
          param.sccCode = this.decHead.ownerCodeScc
        } else {
          return false
        }
      } else if (value === 'ownerCode') {
        if (this.decHead.ownerCode.length === 10 || this.decHead.ownerCode.length === 9) {
          param.tradeCode = this.decHead.ownerCode
        } else {
          return false
        }
      } else if (value === 'agentCodeScc') {
        if (this.decHead.agentCodeScc.length === 18) {
          param.sccCode = this.decHead.agentCodeScc
        } else {
          return false
        }
      } else if (value === 'agentCode') {
        if (this.decHead.agentCode.length === 10) {
          param.tradeCode = this.decHead.agentCode
        } else {
          return false
        }
      } else if (value === 'tradeName') {
        if (!util.isEmpty(this.decHead.tradeName)) {
          param.cusCorpName = this.decHead.tradeName
        } else {
          return false
        }
      } else if (value === 'ownerName') {
        if (!util.isEmpty(this.decHead.ownerName)) {
          param.cusCorpName = this.decHead.ownerName
        } else {
          return false
        }
      } else if (value === 'agentName') {
        if (!util.isEmpty(this.decHead.agentName)) {
          param.cusCorpName = this.decHead.agentName
        } else {
          return false
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getCorpInf',
        data: param,
        success: (res) => {
          if (res.result && res.result.sccCode) {
            if (value === 'tradeCoScc' || value === 'tradeName' || value === 'tradeCode') {
              this.decHead.tradeCoScc = res.result.sccCode
              this.decHead.tradeName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              if (util.isEmpty(res.result.tradeCodeExt)) {
                this.decHead.tradeCode = res.result.regCusCode
              }
              if (util.isEmpty(res.result.ciqCodeExt)) {
                !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.consigneeCode = res.result.regCiqCode)
              }
              this.tradeCorpId = res.result.corpId
              if (util.isEmpty(this.decHead.ownerCodeScc)) {
                if (util.isEmpty(res.result.tradeCodeExt)) {
                  this.decHead.ownerCode = res.result.regCusCode
                }
                if (util.isEmpty(res.result.ciqCodeExt)) {
                  !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.ownerCiqCode = res.result.regCiqCode)
                }
                // 自动带出一样的
                this.decHead.ownerCodeScc = res.result.sccCode
                this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                // this.ownerCorpId = res.result.corpId
              }
            } else if (value === 'agentCodeScc' || value === 'agentCode' || value === 'agentName') {
              this.decHead.agentCodeScc = res.result.sccCode
              this.decHead.agentName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              if (util.isEmpty(res.result.tradeCodeExt)) {
                this.decHead.agentCode = res.result.regCusCode
              }
              if (util.isEmpty(res.result.ciqCodeExt)) {
                !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.declRegNo = res.result.regCiqCode)
              }
              this.agentCorpId = res.result.corpId
            } else {
              this.decHead.ownerCodeScc = res.result.sccCode
              this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              if (util.isEmpty(res.result.tradeCodeExt)) {
                this.decHead.ownerCode = res.result.regCusCode
              }
              if (util.isEmpty(res.result.ciqCodeExt)) {
                !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.ownerCiqCode = res.result.regCiqCode)
              }
              // this.ownerCorpId = res.result.corpId
            }
            // 判断是十位海关编码或者十位检验检疫编码是否有两个
            if (!util.isEmpty(res.result.ciqCodeExt) || !util.isEmpty(res.result.tradeCodeExt)) {
              let tradeCodeList = []
              let ciqCodeList = []
              if (!util.isEmpty(res.result.regCusCode)) {
                tradeCodeList.push({
                  nameField: res.result.regCusCode,
                  codeField: res.result.regCusCode
                })
              }
              if (!util.isEmpty(res.result.tradeCodeExt)) {
                tradeCodeList.push({
                  nameField: res.result.tradeCodeExt,
                  codeField: res.result.tradeCodeExt
                })
              }
              if (!util.isEmpty(res.result.regCiqCode)) {
                ciqCodeList.push({
                  nameField: res.result.regCiqCode,
                  codeField: res.result.regCiqCode
                })
              }
              if (!util.isEmpty(res.result.ciqCodeExt)) {
                ciqCodeList.push({
                  nameField: res.result.ciqCodeExt,
                  codeField: res.result.ciqCodeExt
                })
              }
              this.initCustomsCode = {
                tradeCodeList: tradeCodeList,
                ciqCodeList: ciqCodeList,
                type: value
              }
              this.customsCodeVisabled = true
            }
          }
        }
      })
    },
    // 可搜索框的远程搜索
    querySearch (queryString, cb) {
      if (queryString.length < 2) {
        let back = []
        cb(back)
        return
      }
      let param = {
        'corpName': queryString,
        'returnProps': ['corpName', 'corpId', 'sccCode', 'tradeCode', 'cusCorpName', 'ciqCode']
      }
      this.$post({
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: param,
        success: (res) => {
          if (res.result && res.result.length > 0) {
            let json = JSON.stringify(res.result).replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          } else {
            let back = []
            cb(back)
          }
        }
      })
    },
    // 通过公司名称编码名称查询公司信息
    handleSelect (item, para) {
      // 如果海关名称存在 则 直接复制  如果企业海关名称不存在则发往海关查询
      if (util.isEmpty(item.cusCorpName) || util.isEmpty(item.sccCode) || util.isEmpty(item.tradeCode) || util.isEmpty(item.ciqCode)) { // 如果企业海关编码或十八位社会信用代码或十位海关干编码不存在，则去查找
        let param = {
          cusCorpName: '',
          sccCode: '',
          tradeCode: ''
        }
        if (util.isEmpty(item.value)) {
          return
        }
        param.cusCorpName = item.value
        this.$post({
          url: 'API@/dec-common/dec/common/getCorpInf',
          data: param,
          success: (res) => {
            if (res.result && res.result.sccCode) {
              if (para === '1') { // 境内收发货人
                this.decHead.tradeCoScc = res.result.sccCode
                this.decHead.tradeCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.tradeName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.consigneeCode = res.result.regCiqCode)
              } else if (para === '4') { // 申报单位
                this.decHead.agentCodeScc = res.result.sccCode
                this.decHead.agentCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.agentName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.declRegNo = res.result.regCiqCode)
              } else if (para === '3') { // 生产消费使用单位
                this.decHead.ownerCodeScc = res.result.sccCode
                this.decHead.ownerCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.ownerCiqCode = res.result.regCiqCode)
              }
            }
          }
        })
      } else { // 如果企业海关编码或十八位社会信用代码或十位海关干编码存在
        if (para === '1') { // 境内收发货人
          this.decHead.tradeCoScc = item.sccCode // 社会信用代码
          this.decHead.tradeCode = item.tradeCode // 海关十位编码
          this.decHead.tradeName = item.cusCorpName // 赋值 企业海关名称
          if (!util.isEmpty(item.ciqCode)) { // 检验检疫十位编码
            this.decHead.consigneeCode = item.ciqCode
          }
          if (util.isEmpty(this.decHead.ownerCodeScc)) {
            // 自动带出一样的
            this.decHead.ownerCodeScc = this.decHead.tradeCoScc
            this.decHead.ownerCode = this.decHead.tradeCode
            this.decHead.ownerName = this.decHead.tradeName
            this.decHead.ownerCiqCode = this.decHead.consigneeCode
          }
          return
        }
        if (para === '3') { // 生产销售单位/消费使用单位
          this.decHead.ownerCodeScc = item.sccCode
          this.decHead.ownerCode = item.tradeCode
          this.decHead.ownerName = item.cusCorpName
          if (!util.isEmpty(item.ciqCode)) {
            this.decHead.ownerCiqCode = item.ciqCode
          }
          return
        }
        if (para === '4') { // 申报单位
          this.decHead.agentCodeScc = item.sccCode // 社会信用代码
          this.decHead.agentCode = item.tradeCode // 十位海关编码
          this.decHead.agentName = item.cusCorpName
          if (!util.isEmpty(item.ciqCode)) {
            this.decHead.declRegNo = item.ciqCode // 检验检疫代码
          }
        }
      }
    },
    checkHeadValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['headRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    checkWeightValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (value === '' || !reg.test(value)) {
        callback()
      } else {
        let _value = +value
        if (_value < 1) {
          setTimeout(() => {
            this.$refs['headRuleForm'].clearValidate([name])
          }, 2000)
          callback(new Error())
        } else {
          callback()
        }
      }
    },
    // 设置许可证的输入
    changeLicenseNo (e) {
      if (e.keyCode !== 13) {
        if (this.decHead.licenseNo.length === 2 || this.decHead.licenseNo.length === 5) {
          this.decHead.licenseNo = this.decHead.licenseNo + '-'
        }
      }
    },
    focusCustomMaster () {
      this.$nextTick(_ => {
        this.$refs['customMaster'].focus()
      })
    }, /**
     * 初始化 下拉框
     * @param arr 定义的每个模块的数据
     * @param form 表单
     */
    initHeadSelect () {
      decUtil.initSelect(this, this.headSelect, this.decHead)
    },
    // 获取报关表头信息并赋值
    getHeadDetail (HeadVo) {
      this.decHead = util.simpleClone(HeadVo)
      this.decHead.netWt = decUtil.removeZero(this.decHead.netWt)
      this.decHead.grossWt = decUtil.removeZero(this.decHead.grossWt)
      this.decHead.entryType = 'M'
      this.decHead.billtype = '1'
      if (this.controller.funFlag === 'declaration') {
        this.decHead.declTrnrel = '0'
      } else if (this.controller.funFlag === 'recordList') {
        this.decHead.declTrnrel = '2'
      }
      // 当 关检关联号为空 并且 统一编号不为空时 显示统一编号 其他情况显示 关检关联号
      if (!util.isEmpty(this.decHead.seqNo) && util.isEmpty(this.decHead.cusCiqNo)) {
        this.headController.isSeqNo = true
      } else {
        this.headController.isSeqNo = false
      }
      // 防止 用户申报后刷新 引起可编辑的bug
      // 不允许编辑的状态 报关单状态 和操作状态
      let forbiddenStatus = ['002', '005', '1', '2', '4', '5', '7', '8', '9', '10', '11', '12'] // 报关单状态
      let forbiddenIsExamine = ['3', 'R', '6'] // 操作状态
      if (forbiddenStatus.includes(this.decHead.status) || forbiddenIsExamine.includes(this.decHead.isExamine)) {
        this.controller.isDisabled = true
      }
      // 给表头select 框 初始化赋值
      this.initHeadSelect()
    },
    // 校验企业信用等级
    checkTradeName (messageTips) {
      this.$post({
        url: 'API@/saas-dictionary/dictionary/checkCopCredit',
        data: this.decHead.tradeName,
        success: (res) => {
          if (res.result) {
            if (res.result === 'abnormal') {
              let mesLen = messageTips.length + 1
              messageTips.push(mesLen + '.' + '境内收发货人信用等级未达标')
              this.$store.commit(this.moduleName + '/changeDecPage', {key: 'headMessageTips', value: messageTips})
            } else {
              this.$store.commit(this.moduleName + '/changeDecPage', {key: 'headMessageTips', value: messageTips})
            }
          }
        }
      })
    },
    sendDec (operType, param) {
      param['decHeadVO'] = this.decHead
      if (operType === 'G') {
        param['sendFlag'] = true
      }
      let [a, b, c] = ['0', '0', '0']
      for (let i in this.declareType) {
        if (this.declareType[i] === 1) {
          a = '1'
        } else if (this.declareType[i] === 2) {
          b = '1'
        } else if (this.declareType[i] === 3) {
          c = '1'
        }
      }
      param.decHeadVO['twoStepFlag'] = a + b + c
      this.$post({
        url: 'API@/dec-common/dec/ts/saveTs',
        data: param,
        success: (res) => {
          if (this.decHead.pid === '') {
            this.decHead.pid = res.result.pid
            this.controller.pid = res.result.pid
            this.decHead.status = res.result.status
            this.decHead.statusValue = res.result.statusValue
          }
          // if (this.swtichCheck === 'Y' && this.decHead.isExamine !== '6') { // 需要审核
          //   let message = ''
          //   if (operType === 'G') {
          //     message = '数据没有通过审核,不能发送'
          //   } else {
          //     message = '数据没有通过审核,不能申报'
          //   }
          //   this.messageTips(message)
          //   return false
          // }
          // 暂存成功后 申报 先校验能不能申报
          this.$post({
            url: 'API@/dec-common/dec/ts/declareTs',
            data: {
              'seqNos': [this.decHead.pid],
              'operType': operType
            },
            success: (res) => {
              this.messageTips(res.message, 'success')
              this.decHead.status = res.result.status
              this.decHead.statusValue = res.result.statusValue
              this.controller.isDisabled = true
              this.controller.completeBtn = true
            },
            other: (res) => {
              // this.messageTips(res.message, 'error')
              this.$alert(res.message, '提示', {
                modalAppendToBody: true,
                domMount: this.$el.parentNode,
                dangerouslyUseHTMLString: true,
                confirmButtonText: '我知道了',
                type: 'warning',
                customClass: 'confirm-tips-warning',
                callback: action => {
                }
              })
            }
          })
        }
      })
    },
    // 保存报关单
    saveDecHeadFieldVerify () {
      // 校验
      this.$refs['headRuleForm'].validate((valid) => {
        if (valid === false) {
          this.isShowText1 = 'fa fa-angle-double-down'
          this.isShow1 = true
          this.$store.commit(this.moduleName + '/changeDecPage', {key: 'headValidResult', value: false})
        } else {
          this.$store.commit(this.moduleName + '/changeDecPage', {key: 'headValidResult', value: true})
        }
      })
    },
    // 报关单暂存表头校验
    verifyDecHeadBeforeSave () {
      let messageTips = []
      let mesLen
      // let _tradeMode = this.decHead.tradeMode // 监管方式
      // let net = +this.decHead.netWt
      // let gross = +this.decHead.grossWt
      let custom = this.decHead.customMaster // 申报地海关
      if (['0603', '2904', '2909', '3116', '3117', '4201', '5304', '5345', '5202', '5208'].indexOf(custom) === -1) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '申报地海关不属于两步申报试点海关')
      }
      // 运输方式为2的时候，船名航次提单号如没有输，提示
      if (this.decHead.trafMode === '2') {
        let trafModeTips = []
        if (!this.decHead.trafName) {
          trafModeTips.push('运输工具名称')
        }
        if (!this.decHead.voyageNo) {
          trafModeTips.push('航次号')
        }
        if (!this.decHead.billNo) {
          trafModeTips.push('提运单号')
        }
        if (trafModeTips.length > 0) {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '运输方式为水运时,需要输入:' + trafModeTips.join('、'))
        }
      }
      /** 进口FOB，运、保费未填写完整时，提示：进口FOB，需要填写运、保费
        进口C&F，保费未填写完整时，提示：进口C&F，需要填写保险费
        进口C&I，运费未填写完整时，提示：进口C&I，需要填写运费
        进口EXW，运、保费未填写完整时，提示：进口EXW，需要填写运、保费
        出口CIF，运、保费未填写完整时，提示：出口CIF，需要填写运、保费
        出口C&F时，运费未填写完整时，提示：出口C&F，需要填写运费
        出口C&I时，保费未填写完整时，提示：出口C&I，需要填写保险费
        出口EXW时，运费未填写完整时，提示：出口EXW，需要填写运费
        校验规则：
        1.标记选择“率”时，校验标记、费/率2个字段是否有内容；
        2.标记选择“单价”或“总价”时，校验标记、费/率、币制3个字段是否有内容
       */
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'headMessageTips', value: messageTips})
    },
    clearHeadData () {
      // 清除 统一编号
      this.decHead.seqNo = ''
      // 清除 预录入编号
      this.decHead.preEntryId = ''
      this.decHead.bossId = ''
      this.decHead.clientSeqno = ''
      this.decHead.dDate = ''
      this.decHead.cusCiqNo = ''
      if (this.controller.iEFlag === 'E') {
        this.decHead.iEDate = ''
      }
      // 随附单据
      this.decHead.decEdocRealations = []
      // 标记号码 标记唛码附件
      this.decHead.decMarkLobs = []
      // 海关编号
      this.decHead.entryId = ''
      // 清除所有的主键
      this.decHead.decPid = ''
      this.decHead.pid = ''
      this.decHead.isExamine = ''
      this.decHead.status = ''
      this.decHead.isExamine = ''
      this.decHead.statusValue = ''
      delete this.decHead.dataSource
      delete this.decHead.sysSource
      delete this.decHead.feePid
      delete this.decHead.expenseId
      delete this.decHead.emailAddress
    }
  }
}
</script>
<style scoped lang="less">
@import '../../decPage/common/decCss';
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
  }
</style>
