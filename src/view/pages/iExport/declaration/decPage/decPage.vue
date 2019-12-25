<template>
  <!-- 进出口报关单 新增 详情 修改 合用界面-->
  <section class='sys-main sys-dec-class dec-section-edit'>
    <el-header class= 'topDiv'>
      <!-- 操作按钮-->
      <template v-if="controller && controller.fromPage === 'reviewed'">
        <!-- <el-row class='reviewTip list-icon-Tips dec-h-24'>
          <i></i>
          请注意，您可在此界面进行报关单的编辑，完成后，无需再审核，点击确认编辑，数据状态变为审核通过，可直接进行后续操作。
        </el-row> -->
        <div class="reviewTip list-icon-Tips flex">
          <i></i>
          <div class="text">请注意，您可在此界面进行报关单的编辑，完成后，无需再审核，点击确认编辑，数据状态变为审核通过，可直接进行后续操作。</div>
        </div>
      </template>
      <template v-else>
        <el-row style='margin-right:54px' v-if = 'pageType == "dec"'>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-plus" @click="addDecHead" :disabled="controller.isDisabled || queryEntrust || controller.isWholeDec" v-if='!controller.isSummary'>&nbsp;新增</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-save" @click="saveDecHead" :disabled="controller.isDisabled || queryEntrust">&nbsp;暂存</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-copy" @click="copyDecHead" :disabled="queryEntrust || controller.isWholeDec" v-if='!controller.isSummary'>&nbsp;复制</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-print" @click="printDecHead" >&nbsp;打印</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-trash-o" @click="delDecHead" :disabled="controller.isDisabled || queryEntrust" v-if='!controller.isSummary'>&nbsp;删除</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-paste" :disabled="controller.isDisabled || controller.initTemplateBtn || queryEntrust || controller.isWholeDec" v-if='!controller.isSummary' @click="initTemplateVisible = true">&nbsp;初始值模板</el-button>
          <!-- <el-button type="primary" size="mini" icon="fa fa-file-text" :disabled="controller.isDisabled">&nbsp;资质查询</el-button> -->
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-file" :disabled="controller.isDisabled || queryEntrust" @click="openAdditionInfo">&nbsp;附注</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-file-pdf-o" @click="openAccDoc" :disabled="controller.accDocDisabled">&nbsp;随附单据</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-dollar" v-if="controller.iEFlag=='I'" :disabled="charterDis || queryEntrust" @click="charterRight" >特许权使用费</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-upload" @click="sumbitCheck" :disabled="queryEntrust || controller.isDisabled" v-if='!controller.isSummary' >&nbsp;提交审核</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-cloud-download" :disabled="controller.isDisabled || queryEntrust" v-if="controller.iEFlag=='E'" @click="eleBillShow">&nbsp;引用电子底账</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-upload" v-show='controller.ocrShow' :disabled="queryEntrust" @click="lookOCR" v-if='!controller.isSummary'>&nbsp;查看OCR单证</el-button>
          <el-button type="primary" class="dec-h-24" size="mini" v-if="controller.iEFlag=='I'&&!controller.isSummary" @click="switchFeeEstimate" :disabled="this.feeEstimateState">&nbsp;税费预估</el-button>
          <el-button type="primary" class="dec-h-24" size="mini" v-if="controller.isSummary || controller.isWholeDec" @click="gotoSummaryDec" >&nbsp;查看概要申报</el-button>
          <el-button type="primary" class="dec-h-24" size="mini" v-if='controller.isGenerModel' @click='generModel'>&nbsp;生成模板</el-button>
          <el-dropdown @command="OCRMadeCert"  >
            <el-button type="primary" class="dec-h-24" size="mini" :disabled="!controller.pid &&['2','4','3','R','6'].indexOf(isExamine) < 0" >&nbsp;智能制单</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="upload" :disabled="['3','R','6'].indexOf(isExamine) >= 0">上传文件</el-dropdown-item>
              <el-dropdown-item command="record">识别记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="primary" size="mini" icon="fa fa-upload" :disabled="controller.isDisabled">&nbsp;税单查看</el-button> -->
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-paper-plane-o" @click="declareData('G')" style='float: right;' :disabled="controller.isSendDisabled || queryEntrust" v-if='!controller.isSummary'>&nbsp;发送</el-button>
          <el-button type="primary" title="仅上海地区可用" class='dec-h-24' size="mini" icon="fa fa-paper-plane-o" @click="declareData('C')" style='float: right;margin-right:5px' :disabled="controller.isDisabled || isDisabledDec || queryEntrust" v-if='!controller.isSummary'>&nbsp;申报</el-button>
        </el-row>
        <el-row style='margin-right:54px' v-if = 'pageType == "ai"'>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-save" @click="saveAI" >&nbsp;保存</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-save" @click="saveDec" >&nbsp;校验并生成报关单</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-trash-o" @click="deleteAI" >&nbsp;删除</el-button>
        </el-row>
      </template>
    </el-header>
    <div class='dec-container-div' :style="{ width: aiWidth }">
      <el-container>
        <el-container>
          <el-main style="padding:3px 5px 20px 0px;">
            <!---表头开始  -->
            <dec-head ref='decHead' :moduleName="moduleName" @drawArea='drawArea'></dec-head>
            <!---表头结束  -->
            <!---表体开始  -->
            <dec-list ref='decList' @drawBoyArea='drawBoyArea' @backStatisticsData='backStatisticsData' :moduleName="moduleName"></dec-list>
          </el-main>
        </el-container>
        <el-aside style="padding-top: 3px;width: 245px;">
          <!-- 集装箱信息 开始-->
          <dec-container ref='decContainer' :moduleName="moduleName"></dec-container>
          <!-- 集装箱信息 结束-->
          <!-- 随附单证 开始 -->
          <dec-documents ref='decDocuments' @compareDecAndEms='compareDecAndEms' :moduleName="moduleName"></dec-documents>
          <!-- 随附单证 结束 -->
          <div class="dec-div">
            <el-form ref="datasForm" :rules='datasForm' :model="datasFormDate"  @keyup.enter.native="switchFoucsByEnter"  label-width="100px" size="mini">
              <el-row >
                  <el-col :span="24">
                    <el-form-item label="关联报关单">
                      <el-input v-model="datasFormDate.relId" @focus="tipsFillMessage('relId')" :readonly="controller.isDisabled" :maxlength="18"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="关联备案" prop='relManno'>
                      <el-input v-model="datasFormDate.relManno" @focus="tipsFillMessage('relManno')" :readonly="controller.isDisabled" :maxlength="12"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="保税/监管场地">
                      <el-input v-model="datasFormDate.bonNo"  @focus="tipsFillMessage('bonNo')" :readonly="controller.isDisabled" :maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="场地代码">
                      <el-input v-model="datasFormDate.cusFie" @focus="tipsFillMessage('cusFie')" :readonly="controller.isDisabled" :maxlength="255"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-form>
          </div>
          <!-- 统计 开始 -->
          <div class="dec-div" style="background-color: #e1f0ff;">
            <el-row >
              <el-col :span="16">
                <label >总价:</label>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <span >{{statisticsData.totalPrice}}</span>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16">
                <label >成交数量合计</label>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <span >{{statisticsData.totalGQty}}</span>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16">
                <label >法定第一数量合计</label>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <span >{{statisticsData.totalQty1}}</span>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16">
                <label >法定第二数量合计</label>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <span>{{statisticsData.totalQty2}}</span>
              </el-col>
            </el-row>
          </div>
          <!-- 统计 结束 -->
        </el-aside>
        <div v-if="controller && controller.fromPage === 'reviewed'" class="operDiv">
          <div v-show="tipsNoteShow" class="tipShow"> {{tipsNote}} </div>
          <div class="operButton" :style='"margin-top:"+(tipsNoteShow?"":"17px")'>
            <el-button style="width:52px;margin-right:30px" type="primary" class='dec-h-24' size="mini" @click="toReviewEdit" v-show="!isLook">取消</el-button>
            <el-button type="primary" class='dec-h-24' size="mini" @click="directEdit"  v-show="!isLook">确认编辑</el-button>
          </div>
        </div>
        <div class='bottomDiv' v-show="tipsNoteShow" v-else><span>{{tipsNote}}</span></div>
      </el-container>
      <!-- 弹出框 附注信息 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="附注信息"
        :visible.sync="additionInfoLaVisible"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        v-dialogDrag
        width="640px">
        <extra-note :additionInfoLa="additionInfoLa"  @backDatas="saveExtraNote" @cancLeData="cancleExtraNote" v-if="additionInfoLaVisible"></extra-note>
      </el-dialog>
      <!-- 弹出框 附注信息 结束 -->
      <!-- 弹出框 随附单据 开始 -->
      <accompanying-documents :initParams="accDocData"  @backDatas="receptionAccDocData" @cancLeData="cancleAccDocData" :accDocVisible="accDocVisible" :showCustomsCode="showCustomsCode"></accompanying-documents>
      <!-- 弹出框 随附单据 结束 -->
      <!-- 弹出框 打印报关单 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="打印报关单"
        :visible.sync="printCompnentVisible"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :show-close='false'
        v-dialogDrag
        width="640px">
        <decprint-view :initParams="printCompnentParam"  @cancLeData="closePrintCompnent"  v-if="printCompnentVisible"></decprint-view>
      </el-dialog>
      <!-- 弹出框 打印报关单 结束 -->
      <!-- 弹出框 初始值模板 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="初始值模板选择"
        :visible.sync="initTemplateVisible"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :show-close='false'
        v-dialogDrag
        width="640px">
        <init-template :initParams="controller.iEFlag"  @backDatas="receptionTemplateData"  @cancLeData="closeTemplateCompnent"  v-if="initTemplateVisible"></init-template>
      </el-dialog>
      <!-- 弹出框 初始值模板 结束 -->
      <!-- 弹出框 报关补充申报 开始 -->
        <supplement-declare :initParams="initSupplDec"  @backDatas="backSupplDec"  @cancLeData="closeSupplDec"  v-if="supplDecVisible"></supplement-declare>
      <!-- 弹出框 报关补充申报 结束 -->
      <!-- 弹出框 对比模板与现在的区别 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="选择需要引用模板数据"
        :visible.sync="compareVisible"
        :show-close='true'
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="800px">
        <compare-template :initParams="initCompare"  @backDatas="compareData" @cancLeData="cancleCompareData"  v-if="compareVisible"></compare-template>
      </el-dialog>
      <!-- 弹出框 对比模板与现在的区别 结束 -->
      <!-- 弹出框 标记唛码和备注 开始 -->
      <dec-note :initParams="initNote" @backDatas="receptionNoteData"  v-if="noteCompnentVisible"></dec-note>
      <!-- 弹出框 标记唛码和备注 结束 -->
      <!-- 弹出框 特许权使用费 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="特许权使用费"
        :visible.sync="charterVisabled"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        v-dialogDrag
        class='sys-dec-class'
        width="75%">
        <dec-charter :data="initCharter" :username="controller.userName" :type="$route.params.operationType" @getData="getCharterForm" @closeTemplate="closeCharter" v-if="charterVisabled" :showCustomsCode="showCustomsCode"></dec-charter>
      </el-dialog>
      <!-- 弹出框 特许权使用费 结束 -->
          <!-- 弹出框 税费预估 开始-->
      <el-dialog :modal-append-to-body='false'
        title="税费预估"
        :visible.sync="feeEstimateVisible"
        :close-on-click-modal="false"
        class="sys-dec-dialog"
        v-dialogDrag
        v-loading="$store.state.loading"
        width="1000px"
      >
        <fee-estimate :feeEstimateData="this.feeEstimateData" v-if="this.feeEstimateVisible"></fee-estimate>
      </el-dialog>
      <!-- 弹出框 税费预估 结束-->
      <!-- 引用电子底账 弹窗 -->
        <electric-bill :electricVisible.sync="electricVisible" @close:electricBill="getElectricBill"></electric-bill>
      <!-- 引用电子底账 弹窗 end -->
      <!-- 引用上传识别文件 弹窗 -->
      <smart-orc :samrtOrcVisable.sync="samrtOrcVisable" :decPid='$refs.decHead.decHead.decPid' @close:smartOrcClose="smartOrcClose" v-if="samrtOrcVisable"></smart-orc>
      <!-- 引用上传识别文件 弹窗 end -->
      <!-- 引用识别记录 弹窗 -->
      <ocr-record :orcRecordVisable.sync="orcRecordVisable" @close:orcRecordClose="orcRecordClose" @backOrcdata="backOrcdata" :total='{decHeadVO: $refs.decHead.decHead,
        decListVO: $refs.decList.tableList}' @getTradeSelects='getTradeSelects' v-if="orcRecordVisable"></ocr-record>
      <!-- 引用识别记录 弹窗 end -->
      <dec-ai-detail :moduleName="moduleName" ref="aiDetail" @ai:formatedData="aiDataHandle"></dec-ai-detail>
      <!-- ai 校验结果 -->
      <ai-valid :validResult = 'validResult' :aiValidVisable.sync="aiValidVisable"></ai-valid>
      <!-- 发送时 自报自缴的提示 -->
      <send-Tips :sendTipsVisable.sync="sendTipsVisable" :operType='sendTipsOperType' @close:sendTipsClose="sendTipsClose" ></send-Tips>
    </div>
  </section>
</template>

<script>
import util from '@/common/util.js'
import businessUtil from '../declareCheck/utils/businessUtil'
import decUtil from './common/decUtil'
import decBus from './common/bus'
import decHead from '../decPage/decHead/decHead'
import decList from '../decPage/decList/decList'
import decContainer from '../decPage/container/container'
import decDocuments from '../decPage/documents/documents'
import accompanyingDocuments from './components/accompanyingDocuments'
import decAiDetail from './components/decAiDetail'
import aiValid from './components/aiValid'
import decPageStore from './decPageStore'
import sendTips from './components/sendTips'
import extraNote from './components/extraNote'
import smartOrc from './components/smartOrc'
import ocrRecord from './components/ocrRecord'
import decprintView from './components/decPrint'
import initTemplate from './components/initTemplate'
import supplementDeclare from '../../declaration/component/supplementDeclare.vue'
import compareTemplate from './components/compareTemplate'
import decCharter from './components/charteredRight'
import feeEstimate from './components/feeEstimate'
import electricBill from './components/electricBill'

export default {
  components: {
    decHead,
    decList,
    decContainer,
    smartOrc,
    decDocuments,
    ocrRecord,
    extraNote,
    accompanyingDocuments,
    decprintView,
    initTemplate,
    supplementDeclare,
    compareTemplate,
    decCharter,
    feeEstimate,
    electricBill,
    decAiDetail,
    aiValid,
    sendTips
  },
  data () {
    return {
      originalResult: '',
      isExamine: '',
      moduleName: '',
      tabId: '',
      asideWidth: 20,
      requestCount: 0,
      additionInfoLaVisible: false,
      additionInfoLa: '',
      accDocVisible: false,
      printCompnentVisible: false,
      initTemplateVisible: false,
      supplDecVisible: false,
      compareVisible: false,
      noteCompnentVisible: false,
      samrtOrcVisable: false,
      aiValidVisable: false,
      sendTipsVisable: false,
      validResult: [],
      orcRecordVisable: false,
      charterVisabled: false,
      initCharter: null,
      isDisabledDec: true,
      feeEstimateVisible: false,
      feeEstimateData: null,
      feeEstimateState: true,
      electricVisible: false,
      sendTipsOperType: '',
      datasFormDate: {
        relId: '',
        relManno: '',
        bonNo: '',
        cusFie: ''
      },
      datasForm: {
        relManno: [ //  关联备案号
          {validator: this.checkDatasValid, message: '关联备案号只能12位', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        'relManno': '[0-9a-zA-Z]{12}$|^$' // 关联备案号
      },
      queryEntrust: false, // 委托跳转
      accDocData: {
      },
      statisticsData: {
        totalPrice: 0.00, // 总价
        totalGQty: 0, // 成交数量合计
        totalQty1: 0, // 法定第一数量合计
        totalQty2: 0 // 法定第二数量合计
      },
      unDialogVisible: 'none',
      picList: [],
      ocrFields: {},
      orcListFomart: [],
      activeName: '',
      picUrl: '',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      signDiv: 'none',
      zoom2: 1,
      aiWidth: '100%',
      rotate: 0, // 旋转角度
      pageType: 'dec'
    }
  },
  beforeDestroy () {
    this.$store.unregisterModule(this.moduleName)
  },
  created () {
    let params = this.$route.params
    let meta = this.$route.meta
    if (this.$route.query.aiType && this.$route.query.operation) {
      this.pageType = 'ai'
      this.moduleName = params.funFlag + '-' + params.iEFlag + '-' + params.operationType + '-' + params.pid + 'AI'
    } else {
      let id = params.pid ? params.pid : 'new'
      this.moduleName = meta.funFlag + '-' + meta.iEFlag + '-' + meta.operationType + '-' + id
    }
    if (this.$route.query.aiType) {
      this.aiWidth = '1000px'
      this.$store.commit('collapse', true)
    }
    this.$store.registerModule(this.moduleName, decPageStore)
    let showFied = {
      attaDocuCdstr: '', // 随附单证
      contaCount: '', // 集装箱数
      entQualifTypeCodeS: '', // 企业资质类别
      entQualifTypeCodeSName: '', // 企业资质编号
      entQualifTypeGNo: '' // 企业资质编号 gNo
    }
    this.$store.commit(this.moduleName + '/changeDecPage', {key: 'showFied', value: showFied})
    if (this.$route.query.fromPage) {
      this.controller.fromPage = this.$route.query.fromPage
    }
    // 如果路径参数存在summary 则证明 这条数据为概要申报之前的完整申报数据
    if (this.$route.query.summary) {
      this.controller.isSummary = true
    }
    if (this.$route.query.aiType && this.$route.query.operation) {
      // 智能制单的 新增界面
      this.controller.operationType = this.$route.params.operationType
      this.controller.funFlag = this.$route.params.funFlag
      this.controller.iEFlag = (this.$route.params.iEFlag === 'import' ? 'I' : 'E')
      this.controller.pid = this.controller.operationType !== 'add' ? this.$route.params.pid : ''
      this.controller.isDisabled = (this.controller.operationType === 'look')
    } else {
      this.controller.operationType = this.$route.meta.operationType
      this.controller.funFlag = this.$route.meta.funFlag
      this.controller.iEFlag = (this.$route.meta.iEFlag === 'import' ? 'I' : 'E')
      this.controller.pid = this.controller.operationType !== 'add' ? this.$route.params.pid : ''
      this.controller.isDisabled = this.controller.operationType === 'look'
    }
    if (this.controller.operationType === 'look') {
      this.controller.requireColor = false
    }
    // 判断是否从 补充申报查询界面过来
    let isSuppDec = window.sessionStorage.getItem('isSuppDec')
    if (!util.isEmpty(isSuppDec)) {
      this.$nextTick(_ => {
        this.$refs.decList.supplementFlag = true
      })
      window.sessionStorage.removeItem('isSuppDec')
    }
    // 判断是否是委托跳转过来
    if (this.$route.query.entrust) {
      this.queryEntrust = true
    }
    window.localStorage.setItem('COMMON_PARA', JSON.stringify([{codeField: '0', nameField: '否'}, {codeField: '1', nameField: '是'}]))
    window.localStorage.setItem('DANGER_LEVEL', JSON.stringify([{codeField: '1', nameField: '一类'}, {codeField: '2', nameField: '二类'}, {codeField: '3', nameField: '三类'}]))
    window.localStorage.setItem('PRICE_FACTOR', JSON.stringify([{codeField: '0', nameField: '否'}, {codeField: '1', nameField: '是'}, {codeField: '9', nameField: '空'}]))
    // 获取初始数据
    this.$all([
      // 海关关区  运输方式 企业资质类别 许可证类别 贸易条款
      this.getCommonParams(['SAAS_CUSTOMS_REL', 'SAAS_TRANSPORT_TYPE', 'SAAS_ENT_QUALIF_TYPE', 'SAAS_LIC_TYPE', 'SAAS_TRADE']),
      // 成交方式 包装种类 征免性质 港口参数表 币值信息表
      this.getCommonParams(['SAAS_TRANSAC', 'SAAS_WRAP', 'SAAS_LEVYTYPE', 'SAAS_PORT_LIN', 'SAAS_CURR']),
      // 国别信息表  入离境口岸 计量单位表 原产地区 境内目的地
      this.getCommonParams(['SAAS_COUNTRY', 'SAAS_INLAND_PORT', 'SAAS_UNIT', 'SAAS_CIQ_ORIGIN_PLACE', 'SAAS_DISTRICT_REL']),
      // 目的地代码  征免方式 集装箱规格表  随附单证代码 用途代码
      this.getCommonParams(['SAAS_CIQ_CITY_CN', 'SAAS_LEVYMODE', 'SAAS_CONTAINER_MODEL', 'SAAS_LICENSEDOCU', 'SAAS_USER_TO']),
      // 申报要素品牌类型 关联理由  货物属性  检验检疫机关代码  检验检疫签证申报要素 随附单据
      this.getCommonParams1(),
      // 获取检验检验申报要素 和 其他包装类型
      this.getspecialParams()
    ]).then(() => {
      this.specialInit()
    })
    // 获取校验质检的信息关联表
    this.getCiqParams()
    // 查询所有的开关
    this.getSwitchCheck()
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
    isDirectDec () {
      return this.$store.state[this.moduleName].isDirectDec
    },
    charterDis () {
      return this.$store.state[this.moduleName].charterDis
    },
    switch () {
      return this.$store.state[this.moduleName].switch
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    }
  },
  mounted () {
    // 获取tabId  为了CCBA
    this.tabId = this.getQueryString('tabId')
    let type = this.$route.query.type // 取路径的参数
    let operation = this.controller.operationType
    if (this.controller.iEFlag === 'I') {
      this.controller.iEFlagDisabled = false
    } else {
      this.controller.iEFlagDisabled = true
    }
    // 备案清单、报关单标识
    if (this.controller.funFlag === 'declaration') {
      this.$refs.decHead.decHead.declTrnrel = '0'
      this.controller.declTrnrel = '0'
    } else if (this.controller.funFlag === 'recordList') {
      this.$refs.decHead.decHead.declTrnrel = '2'
      this.controller.declTrnrel = '2'
    }
    if (operation === 'look' || operation === 'edit' || (operation === 'add' && !util.isEmpty(type))) {
      // this.controller.initTemplateBtn = true
      // 这里的初始化不需要反填信息
      this.$nextTick(_ => {
        this.$refs.decHead.initDefautHeadData()
      })
    } else if (operation === 'add') {
      this.$nextTick(_ => {
        this.$refs.decHead.decHead.iEFlag = this.controller.iEFlag
        this.$refs.decList.decList.gNo = this.$refs.decList.tableList.length + 1
        if (this.controller.funFlag === 'recordList') {
          this.$refs.decHead.initbilltype()
        }
        if (this.controller.iEFlag === 'I') {
          this.$refs.decHead.decHead.iEDate = decUtil.getTodayDate()
        }
        this.$refs.decHead.decHead.markNo = 'N/M'
        this.$refs.decHead.computLength('2')
        this.$refs.decHead.initDefautHeadData('1')
        // 初始化默认模板
        this.initDefaultTemplate()
      })
    }
  },
  destroyed () {
    decBus.deleteBus(this.moduleName)
  },
  methods: {
    toReviewEdit () {
      this.closeTab()
      let pid = this.controller.pid
      let tabName = '报关单可视化审核编辑'
      let routeName = 'decReviewedEdit'
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + 'edit' + pid
        },
        query: {
          decType: 'dec'
        }
      })
    },
    directEdit () {
      this.$confirm('您是否确认要保存当前的审核直接编辑？若确认，系统将保存当前报关单变更内容，审核状态将直接变为审核通过。若您开通了【审核通过直接发送】功能，那么，报关单将直接进行发送。', '提示', {
        confirmButtonText: '是的,我确认',
        cancelButtonText: '稍等,我再想想',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.saveDecHead()
      }).catch(() => {
      })
    },
    drawArea (data) {
      this.$refs.aiDetail.drawArea(data)
    },
    drawBoyArea (data) {
      this.$refs.aiDetail.drawBoyArea(data)
    },
    getDecVo () {
      let cropLimit = this.$refs.decHead.cropLimit
      let tableDecContainerlist = this.$refs.decContainer.tableDecContainerlist
      for (let i in tableDecContainerlist) {
        tableDecContainerlist[i].decPid = ''
      }
      let decHeadVo = util.simpleClone(this.$refs.decHead.decHead)
      decHeadVo['relId'] = this.datasFormDate.relId
      decHeadVo['relManno'] = this.datasFormDate.relManno
      decHeadVo['bonNo'] = this.datasFormDate.bonNo
      decHeadVo['cusFie'] = this.datasFormDate.cusFie
      // 判断企业资质里面有没有 合格
      if (!util.isEmpty(cropLimit.entQualiftypeCode)) {
        decHeadVo.decCopLimits.push(cropLimit)
      }
      // 后端要求清除的
      delete decHeadVo.createTime
      delete decHeadVo.createUser
      delete decHeadVo.inputName
      delete decHeadVo.inputerName
      let param = {
        decContainersVO: tableDecContainerlist,
        decHeadVO: decHeadVo,
        decLicensesVO: this.$refs.decDocuments.licenselist,
        decListVO: this.$refs.decList.tableList
      }
      return param
    },
    // 保存修改的值
    saveAI () {
      let decVo = this.getDecVo()
      // 直接保存decVo和 颜色
      this.$post({
        url: 'API@/dec-common/dec/orc/saveDecDocument',
        data: {
          ocrNo: this.$route.params.pid,
          decData: JSON.stringify(decVo), // 报关单数据vo
          decColorInfo: JSON.stringify(
            {
              headAiColor: this.$refs.decHead.headAiColor,
              bodyAiColor: this.$refs.decList.bodyAiColorList
            } // 颜色vo
          )
        },
        success: (res) => {
          // 先关闭当前页签
          this.messageTips('保存成功', 'success')
        }
      })
    },
    closeTab () {
      this.$store.dispatch('CloseTab', this.$store.state.TabsStore.currentTab.tabId)
    },
    // 验证并保存到报关单
    saveDec () {
      // 直接保存decVo和 颜色
      let taskId = this.$route.params.pid
      let decVo = this.getDecVo()
      this.$post({
        url: 'API@/dec-common/dec/orc/validateAndSaveDec',
        data: {
          ocrNo: this.$route.params.pid,
          decData: JSON.stringify(decVo), // 报关单数据vo
          decVO: decVo,
          decColorInfo: JSON.stringify(
            {
              headAiColor: this.$refs.decHead.headAiColor,
              bodyAiColor: this.$refs.decList.bodyAiColorList
            } // 颜色vo
          )
        },
        success: (res) => {
          if (!res.result.data) {
            return
          }
          // 先关闭当前页签
          this.closeTab()
          // 跳到报关单页面
          this.controller.pid = res.result.data.decPid
          let funFlag = this.controller.declTrnrel === '0' ? 'declaration' : 'recordList'
          let flag = this.controller.iEFlag === 'I' ? 'import' : 'export'
          let queryParam = {
            'aiType': 'Intelligent',
            'taskId': taskId // 智能制单流水号
          }
          decUtil.gotoDecPage(funFlag, flag, 'edit', this.controller.pid, '', queryParam, this)
        },
        other: (res) => {
          if (res.result) {
            this.validResult = res.result.data.msg
            this.aiValidVisable = true
          }
        }
      })
    },
    // 删除AI
    deleteAI () {
      let type = this.$route.query.aiType // 'Intelligent' 是否是智能制单
      let operation = this.$route.query.operation // add 为第一次操作
      if (!(type && type === 'Intelligent' && operation && operation === 'add')) {
        this.messageTips('没有可删除的数据', 'error')
        return false
      }
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        // 删除
        this.$post({
          url: 'API@/dec-common/dec/orc/deleteDecDocument',
          data: [this.$route.params.pid],
          success: (res) => {
            // 先关闭当前页签
            this.closeTab()
          }
        })
      }).catch(() => {
      })
    },
    // 校验
    checkDatasValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['datasForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    getTradeSelects () {
      this.$refs.decHead.tipsFillMessage('origBoxFlag', 'commomPara1', 'COMMON_PARA')
      this.$refs.decHead.checkParamsList(this.$refs.decHead.decHead.trafMode)
      this.$refs.decHead.initHeadSelect()
    },
    // 完整申报跳 概要申报
    gotoSummaryDec () {
      let pid = ''
      let status = ''
      // 查询概要申报的状态和id
      if (this.controller.isSummary) {
        pid = this.controller.pid
        status = this.$refs.decHead.decHead.status
      } else {
        status = this.$refs.decHead.decHead.tsStatus
        pid = this.$refs.decHead.decHead.tsPid
      }
      this.togoSummaryDec(pid, status)
    },
    backOrcdata () {

    },
    togoSummaryDec (pid, status) {
      let tabName = ''
      let routeName
      let operationType = 'look'
      // 1. 概要申报未发送前的完整申报跳概要申报 直接使用decPid
      // 2. 概要申报发送之后的完整申报跳概要申报 使用概要申报的decPid
      // 概要申报 申报状态： 1概要暂存；2概要申报；3申报失败；4概要申报入库；6概要申报退单；7概要申报审结；12补充申报；8删单；11查验；9提货放行。
      if (['001', '3', '6'].includes(status) && this.controller.operationType !== 'look') {
        operationType = 'edit'
      }
      if (this.controller.funFlag === 'declaration') {
        tabName = '进口报关单(概要申报)'
        routeName = 'importSummaryDecEdit'
      } else {
        tabName = '进境备案清单(概要申报)'
        routeName = 'importSummaryRecordEdit'
      }
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + operationType + pid
        }
      })
    },
    saveDecHead () {
      this.$refs['datasForm'].validate((valid) => {
        if (valid === false) {
          return false
        }
      })
      let flag = this.$refs.decHead.saveDecHeadFieldVerify()
      if (!flag) {
        return false
      }
      let messageTips = this.verifyDecBeforeSave()
      if (messageTips.length > 0) {
        let tips = messageTips.join('<br>')
        this.$confirm(tips, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '继续暂存',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          customClass: 'confirm-tips-warning',
          type: 'warning'
        }).then(() => {
          this.singleSaveDecHead()
        }).catch(() => {
        })
      } else {
        this.singleSaveDecHead()
      }
    },
    // 报关单暂存表头校验
    verifyDecBeforeSave () {
      let mesLen
      let tableList = this.$refs.decList.tableList // 表体
      let decHead = this.$refs.decHead.decHead // 表头
      let licenselist = this.$refs.decDocuments.licenselist // 随附单据
      let messageTips = this.$refs.decHead.verifyDecHeadBeforeSave()
      // let messageTips = this.$store.state[this.moduleName].headMessageTips
      // 表头表体重量检控
      if (decHead.netWt && tableList.length > 0) {
        let listTotalNet = 0
        let [unitCheck, gUnitFlag, unit1Flag, unit2Flag] = [true, false, false, false]
        tableList.forEach((v, i) => {
          gUnitFlag = (v.gUnit && (v.gUnit === '035' || v.gUnit === '036')) === '' ? true : v.gUnit && (v.gUnit === '035' || v.gUnit === '036')
          unit1Flag = (v.unit1 && (v.unit1 === '035' || v.unit1 === '036')) === '' ? true : v.unit1 && (v.unit1 === '035' || v.unit1 === '036')
          unit2Flag = (v.unit2 && (v.unit2 === '035' || v.unit2 === '036')) === '' ? true : v.unit2 && (v.unit2 === '035' || v.unit2 === '036')
          if (!gUnitFlag || !unit1Flag || !unit2Flag) unitCheck = false
          let middle = ''
          if (v.gUnit === '036' && !util.isEmpty(v.gQty)) { // 克
            listTotalNet = decUtil.Add(listTotalNet, v.gQty)
          } else if (v.gUnit === '035' && !util.isEmpty(v.gQty)) {
            middle = decUtil.Mul(v.gQty, 1000)
            listTotalNet = decUtil.Add(listTotalNet, middle)
          } else if (v.unit1 === '036' && !util.isEmpty(v.qty1)) {
            listTotalNet = decUtil.Add(listTotalNet, v.qty1)
          } else if (v.unit1 === '035' && !util.isEmpty(v.qty1)) {
            middle = decUtil.Mul(v.qty1, 1000)
            listTotalNet = decUtil.Add(listTotalNet, v.middle)
          } else if (v.unit2 === '036' && !util.isEmpty(v.qty2)) {
            listTotalNet = decUtil.Add(listTotalNet, v.qty2)
          } else if (v.unit2 === '035' && !util.isEmpty(v.qty2)) {
            middle = decUtil.Mul(v.qty2, 1000)
            listTotalNet = decUtil.Add(listTotalNet, v.middle)
          }
        })
        let netWtg = decUtil.Mul(decHead.netWt, 1000)
        if (unitCheck) {
          if (netWtg < listTotalNet) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '表体商品重量大于表头总净重')
          } else if (netWtg > listTotalNet) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '表体商品重量小于表头总净重')
          }
        } else {
          if (netWtg < listTotalNet) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '表体商品重量需要小于或等于表头总净重')
          }
        }
      }
      // 随附单证代码为“Y”时，需要上传随附单据“00000001 合同”以及“00000003 提/运单”，未上传时提示
      let licenseIndex = licenselist.findIndex((v, i) => {
        return v.docuCode === 'Y'
      })
      if (licenseIndex > -1) {
        let decEdocRealations = decHead.decEdocRealations
        if (decEdocRealations.length > 0) {
          let index1 = decEdocRealations.findIndex((v, i) => {
            return v.edocCode === '00000001'
          })
          let index2 = decEdocRealations.findIndex((v, i) => {
            return v.edocCode === '00000003'
          })
          if (index2 === -1) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000003-提/运单')
          }
          if (index1 === -1) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000001-发票')
          }
        } else {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000003-提/运单')
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000001-发票')
        }
      }
      // 提示 需要添加的随附单证
      let needArr = []
      // 先算出本票报关单需要的所有单证
      for (let n in tableList) {
        if (!util.isEmpty(tableList[n].controlMa)) {
          needArr.push(...tableList[n].controlMa.split(','))
        }
      }
      needArr = decUtil.unique(needArr)
      // 判单 一些特殊单证
      // 1.当进口时
      if (this.controller.iEFlag === 'I') {
        // 6旧机电产品禁止进口提示：项号X、X、X为旧机电产品时，禁止进口
        let arrIndex1 = needArr.findIndex((v, i) => {
          return v === '6'
        })
        // 9禁止进口商品提示：项号X、X、X为禁止进口商品
        let arrIndex2 = needArr.findIndex((v, i) => {
          return v === '9'
        })
        // A检验检疫商品表头以及表体涉检必填项未填时，提示：项号X、X、X涉检，请完善检验检疫信息
        // D出/入境货物通关单（毛坯钻石用）
        let arrIndex3 = needArr.findIndex((v, i) => {
          return v === 'A' || v === 'D'
        })
        let tipsArr1 = [] // 旧机电产品
        let tipsArr2 = [] // 禁止进口商品
        let tipsArr3 = [] // A D
        tableList.forEach((item) => {
          if (!util.isEmpty(item.controlMa)) {
            if (arrIndex1 > -1 && item.controlMa.indexOf('6') > -1) {
              tipsArr1.push(item.gNo)
            }
            if (arrIndex2 > -1 && item.controlMa.indexOf('9') > -1) {
              tipsArr2.push(item.gNo)
            }
            if (arrIndex3 > -1 && (item.controlMa.indexOf('A') > -1 || item.controlMa.indexOf('D') > -1)) {
              tipsArr3.push(item.gNo)
            }
          }
        })
        if (tipsArr1.length > 0) {
          needArr.splice(arrIndex1, 1)
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '项号' + tipsArr1.join('、') + '为旧机电产品时，禁止进口')
        }
        if (tipsArr2.length > 0) {
          needArr.splice(arrIndex2, 1)
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '项号' + tipsArr2.join('、') + '为禁止进口商品')
        }
        if (tipsArr3.length > 0) { // 有涉检
          // 检查检验信息是否完善
          let flag = false // false 代表质检信息已经完善 true 代表已经完善
          // 1.检验表头
          let checkFeildArr = []
          checkFeildArr.push(decHead.orgCode) // 检验检疫受理机关
          checkFeildArr.push(decHead.vsaOrgCode) // 领证机关
          checkFeildArr.push(decHead.inspOrgCode) // 口岸检验检疫机关
          checkFeildArr.push(decHead.despDate) // 启运日期
          let index = checkFeildArr.findIndex((v, i) => {
            return util.isEmpty(v)
          })
          if (index > -1) {
            flag = true
          }
          // 表体
          for (let xy in tableList) {
            if (!tableList[xy].purpose || tableList[xy].goodsAttr.length === 0) {
              flag = true
              break
            }
          }
          if (flag) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '涉检，请完善检验检疫信息')
          }
        }
        // 监管方式为“0110”且商品编码涉A时，
        // 商品表体的“检验检疫货物规格”的“货物品牌”、“货物规格”字段未填时提示：项号X需要补充货物品牌、货物规格信息；
        // “生产日期”、“生产批次”两个字段均为填写时提示：项号X需要补充生产日期或生产批次信息。
        let AmessageTips = []
        if (decHead.tradeMode === '0110') {
          for (let c in tableList) {
            let bodyVo = tableList[c]
            if (bodyVo.controlMa.indexOf('A') > -1) {
              if (util.isEmpty(bodyVo.goodsBrand) || util.isEmpty(bodyVo.goodsSpec)) {
                AmessageTips.push('   项号' + bodyVo.gNo + '需要补充货物品牌、货物规格信息')
              }
              if (util.isEmpty(bodyVo.produceDate) && util.isEmpty(bodyVo.prodBatchNo)) {
                AmessageTips.push('  项号' + bodyVo.gNo + '需要补充生产日期或生产批次信息')
              }
            }
          }
        }
        if (AmessageTips.length > 0) {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '当前申报的商品如含有食品、化妆品')
          messageTips.push(...AmessageTips)
        }
      } else { // 出口
        // 8禁止出口商品提示：项号X、X、X为禁止出口商品
        let arrIndex4 = needArr.findIndex((v, i) => {
          return v === '8'
        })
        let tipsArr4 = []
        tableList.forEach((item) => {
          if (arrIndex4 > -1 && item.controlMa.indexOf('8') > -1) {
            tipsArr4.push(item.gNo)
          }
        })
        if (tipsArr4.length > 0) {
          needArr.splice(arrIndex4, 1)
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '项号' + tipsArr4.join('、') + '为禁止出口商品')
        }
        // 出口随附单证类型不可为c-内销征税联系单，提示：出口随附单证代码不可为c。
        for (let mn in licenselist) {
          if (licenselist[mn].docuCode === 'c') {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口随附单证代码不可为c')
          }
        }
      }
      // 监管方式为“0255 来料深加工”、“0654 进料深加工”，且未添加添加随附单证时提示
      if (['0255', '0654'].includes(decHead.tradeMode)) {
        needArr.push('K')
      }
      // 进口时启运国为“CHN 中国”，且征免方式为“1 照章征税”，未添加添加随附单证时提示
      if (decHead.tradeCountry === 'CHN' && this.controller.iEFlag === 'I') {
        for (let m in tableList) {
          if (tableList[m].dutyMode === '1') {
            needArr.push('c')
            break
          }
        }
      }
      // 去掉 A证的提示
      for (let g in needArr) {
        if (needArr[g] === 'A') {
          needArr.splice(g, 1)
          break
        }
      }
      // 删除 已经有了的单证
      if (needArr.length > 0) {
        for (let x in licenselist) {
          for (let y in needArr) {
            if (licenselist[x].docuCode === needArr[y]) {
              needArr.splice(y, 1)
              break
            }
          }
        }
      }
      // 1、备案号格式为H****W******、T****W******，或随附单证中添加了a证，不提示需要添加内销征税联系单
      for (let n in needArr) {
        if (needArr[n] === 'c') {
          let _manualNo = decHead.manualNo
          let index = licenselist.findIndex((v, i) => {
            return v.docuCode === 'a'
          })
          if ((['H', 'T'].includes(_manualNo.charAt(0).toUpperCase()) && _manualNo.charAt(5).toUpperCase() === 'W') || index > -1) {
            needArr.splice(n, 1)
            break
          }
        }
      }
      if (needArr.length > 0) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '此票数据可能需要添加代码为: ' + needArr.join(',') + ' 的随附单证')
      }
      return messageTips
    },
    // 生成模板
    generModel () {
      let cropLimit = this.$refs.decHead.cropLimit
      let tableDecContainerlist = this.$refs.decContainer.tableDecContainerlist
      for (let i in tableDecContainerlist) {
        tableDecContainerlist[i].decPid = ''
      }
      let decHeadVo = util.simpleClone(this.$refs.decHead.decHead)
      // 判断企业资质里面有没有 合格
      if (!util.isEmpty(cropLimit.entQualiftypeCode)) {
        decHeadVo.decCopLimits.push(cropLimit)
      }
      decHeadVo.decPid = ''
      decHeadVo.entryId = ''
      decHeadVo.seqNo = ''
      decHeadVo.bossId = ''
      decHeadVo.preEntryId = ''
      decHeadVo.cusCiqNo = ''
      decHeadVo.statusValue = ''
      decHeadVo.status = ''
      decHeadVo.dDate = ''
      decHeadVo.decRequestCerts = []
      decHeadVo.decRoyaltyFeeVO = null
      decHeadVo.remarkInfo = ''
      decHeadVo.decEdocRealations = []
      decHeadVo.effective = '2'
      // 后端要求清除的
      delete decHeadVo.dataSource
      delete decHeadVo.sysSource
      delete decHeadVo.feePid
      delete decHeadVo.expenseId
      delete decHeadVo.emailAddress
      delete decHeadVo.xmlStatus
      delete decHeadVo.xmlUrl
      delete decHeadVo.ref5
      delete decHeadVo.twoStepFlag
      delete decHeadVo.createTime
      delete decHeadVo.createUser
      delete decHeadVo.inputName
      delete decHeadVo.inputerName
      // 清除 申报日期
      if (this.controller.iEFlag === 'E') {
        decHeadVo.iEDate = ''
      }
      let param = {
        decContainersVO: tableDecContainerlist.length > 0 ? [{...tableDecContainerlist[0], pid: '', decPid: ''}] : [],
        decHeadVO: decHeadVo,
        decLicensesVO: this.$refs.decDocuments.licenselist.length > 0 ? [{...this.$refs.decDocuments.licenselist[0], pid: '', decPid: ''}] : [],
        decListVO: this.$refs.decList.tableList.length > 0 ? [{...this.$refs.decList.tableList[0], decListPid: '', decPid: ''}] : []
      }
      // 报关单表体
      let licFlag = false // 判断是否需要赋值 产品资质
      let vinFlag = false // 判断是否需要赋值 许可证vin
      let decListVo = param.decListVO
      if (decListVo.length === 1) {
        decListVo[0].gNo = '1'
        this.$refs.decList.backDeccListInfo(decListVo[0])
        licFlag = true
      }
      // 表体下的 产品资质
      let filingInfoForm = []
      if (licFlag && this.$refs.decList.decList.decGoodsLimits.length === 1) {
        decBus.getBus(this.moduleName).$emit('setValueForFilingInfoForm', this.$refs.decList.decList.decGoodsLimits[0])
        filingInfoForm = this.$refs.decList.decList.decGoodsLimits[0]
        vinFlag = true
      }
      // 标题下 的产品资质 的 许可证vin
      if (vinFlag && filingInfoForm.decGoodsLimitvins.length === 1) {
        decBus.getBus(this.moduleName).$emit('setValueForlicVINForm', filingInfoForm.decGoodsLimitvins[0])
      }
      this.$refs.decList.decList.decGoodsLimits = []
      // 随附单证
      let decLicList = param.decLicensesVO
      if (decLicList.length === 1) {
        this.$refs.decDocuments.setValueForDecLicForm(decLicList[0])
      }
      // 集装箱
      let contaList = param.decContainersVO
      if (contaList.length === 1) {
        this.$refs.decContainer.setValueForDecContaForm(contaList[0])
      }
      this.$post({
        url: 'API@/dec-common/dec/initSetting/saveDecInit',
        data: param,
        success: (res) => {
          let tabName
          let routeName
          if (this.controller.iEFlag === 'I') {
            routeName = 'iDecTemplateEdit'
            tabName = '进口报关单模板'
          } else {
            routeName = 'eDecTemplateEdit'
            tabName = '出口报关单模板'
          }
          // 关闭新增界面
          this.closeTab()
          // 打开编辑界面
          this.$router.push({
            name: routeName,
            params: {
              'pid': res.result.decPid,
              'setTitle': tabName + '-' + res.result.decPid,
              'setId': routeName + 'edit' + res.result.decPid
            }
          })
        }
      })
    },
    singleSaveDecHead () {
      let cropLimit = this.$refs.decHead.cropLimit
      let tableDecContainerlist = this.$refs.decContainer.tableDecContainerlist
      for (let i in tableDecContainerlist) {
        tableDecContainerlist[i].decPid = ''
      }
      let decHeadVo = util.simpleClone(this.$refs.decHead.decHead)
      decHeadVo['relId'] = this.datasFormDate.relId
      decHeadVo['relManno'] = this.datasFormDate.relManno
      decHeadVo['bonNo'] = this.datasFormDate.bonNo
      decHeadVo['cusFie'] = this.datasFormDate.cusFie
      // 判断企业资质里面有没有 合格
      if (!util.isEmpty(cropLimit.entQualiftypeCode)) {
        decHeadVo.decCopLimits.push(cropLimit)
      }
      // 后端要求清除的
      delete decHeadVo.createTime
      delete decHeadVo.inputName
      delete decHeadVo.inputerName
      let url = 'API@/dec-common/dec/common/saveCommonDec'
      if (this.controller.isSummary) {
        url = 'API@/dec-common/dec/ts/saveTs'
      }
      // 判断是否是接单直接生成报关单,是--对比当前操作人和创建人--不一致 二次确认是否更改创建人
      if (decHeadVo.firstSaveFlag === '1') {
        if (this.controller.userId !== decHeadVo.createUser) {
          this.$confirm('是否确认将创建人改为自己?', '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            decHeadVo['createUser'] = this.controller.userId
            decHeadVo.firstSaveFlag = '0'
            this.saveDecReq(url, decHeadVo, tableDecContainerlist)
          }).catch(() => {
            delete decHeadVo.createUser
            decHeadVo.firstSaveFlag = '0'
            this.saveDecReq(url, decHeadVo, tableDecContainerlist)
          })
        } else {
          delete decHeadVo.createUser
          decHeadVo.firstSaveFlag = '0'
          this.saveDecReq(url, decHeadVo, tableDecContainerlist)
        }
      } else {
        delete decHeadVo.createUser
        decHeadVo.firstSaveFlag = '0'
        this.saveDecReq(url, decHeadVo, tableDecContainerlist)
      }
    },
    saveDecReq (url, decHeadVo, tableDecContainerlist) {
      let param = {
        decContainersVO: tableDecContainerlist,
        decHeadVO: decHeadVo,
        decLicensesVO: this.$refs.decDocuments.licenselist,
        decListVO: this.$refs.decList.tableList
      }
      if (this.controller && this.controller.fromPage === 'reviewed') {
        this.saveDesReqAndReviewedLog(param)
        return
      }
      this.$post({
        url: url,
        data: param,
        success: (res) => {
          this.messageTips(res.message, 'success')
          let result = res.result && res.result[0]
          if (!decHeadVo.decPid) {
            this.$refs.decHead.setHeadFieldValue({
              'decPid': result.decPid,
              'status': result.status,
              'statusValue': result.statusValue
            })
            this.controller.pid = result.decPid
            // 先关闭当前页签
            this.closeTab()
            // 再跳转到编辑页面
            let flag = this.controller.iEFlag === 'I' ? 'import' : 'export'
            let funFlag = this.controller.declTrnrel === '0' ? 'declaration' : 'recordList'
            decUtil.gotoDecPage(funFlag, flag, 'edit', this.controller.pid, 'dec', {}, this)
          }
          this.$refs.decHead.setHeadFieldValue({ // 编辑的时候更新firstSaveFlag
            'firstSaveFlag': result.firstSaveFlag
          })
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    saveDesReqAndReviewedLog (param) {
      let decVerifySaveVO = businessUtil.generateReviewedLog(util.simpleClone(param), this.originalResult)
      let url = 'API@/dec-common/dec/common/decPass'
      let postParam = {
        decVO: param,
        decVerifySaveVO: decVerifySaveVO
      }
      this.$post({
        url: url,
        data: postParam,
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.closeTab()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
    },
    /**
     * 获取报关单详情
     */
    getDecDetail (pid) {
      let type = this.$route.query.aiType // 'Intelligent' 是否是智能制单
      let operation = this.$route.query.operation // add 为第一次操作
      let taskId = this.$route.query.taskId // 为智能制单 识别记录的id
      if (type && type === 'Intelligent') {
        // 2. 如果是智能制单的单子
        if (operation && operation === 'add') {
          // 2.1 如果是编辑没有保存到报关单时。只需要调取识别记录
          this.$refs.aiDetail.getDecByOcr(pid, true)
        } else {
          // 2.2 如果是已经保存过的智能制单的数据。 需要调取报关单数据和识别记录的数据
          this.getDecByCommon(pid)
          this.$refs.aiDetail.getDecByOcr(taskId, false)
        }
      } else {
        // 1. 如果是不是智能制单过来的单子
        this.getDecByCommon(pid)
      }
    },
    setFeildByDecVo ({decHeadVO, decListVO, decContainersVO = [], decLicensesVO = []}) {
      // 关联报关单号
      this.datasFormDate.relId = decHeadVO['relId']
      // 关联备案号
      this.datasFormDate.relManno = decHeadVO['relManno']
      // 保税/监管场地
      this.datasFormDate.bonNo = decHeadVO['bonNo']
      // 场地代码
      this.datasFormDate.cusFie = decHeadVO['cusFie']
      // 表头
      this.$refs.decHead.getHeadDetail(decHeadVO)
      // 表体
      this.$refs.decList.getBodyDetail(decListVO)
      // 集装箱
      this.$refs.decContainer.getContainersDetail(decContainersVO)
      // 随附单证
      this.$refs.decDocuments.getDocumentsDetail(decLicensesVO)
    },
    aiDataHandle (aiData) {
      this.setFeildByDecVo(aiData)
      if (aiData.flag) {
        this.$refs.decHead.focusCustomMaster()
      }
    },
    digitFormat () {
      let decHead = this.originalResult.decHeadVO
      decHead.netWt = decUtil.removeZero(decHead.netWt)
      decHead.grossWt = decUtil.removeZero(decHead.grossWt)
      decHead.feeRate = decUtil.removeZero(decHead.feeRate)
      decHead.insurRate = decUtil.removeZero(decHead.insurRate)
      decHead.otherRate = decUtil.removeZero(decHead.otherRate)
      let decListVO = this.originalResult.decListVO
      decListVO.forEach(decList => {
        decList.declPrice = decUtil.removeZero(decList.declPrice)
        decList.gQty = decUtil.removeZero(decList.gQty)
        decList.qty1 = decUtil.removeZero(decList.qty1)
        decList.qty2 = decUtil.removeZero(decList.qty2)
        decList.declTotal = decUtil.removeZero(decList.declTotal)
      })
    },
    // 调取报关单数据
    getDecByCommon (pid) {
      let url = 'API@/dec-common/dec/common/getDec'
      if (this.controller.isSummary) {
        url = 'API@/dec-common/dec/ts/getDec'
      }
      this.$post({
        url: url,
        isLoad: false,
        data: {
          seqNo: pid
        },
        success: (res) => {
          if (res.result) {
            this.originalResult = util.simpleClone(res.result)
            this.digitFormat()
            // 表头
            this.isExamine = res.result.decHeadVO.isExamine
            this.setFeildByDecVo(res.result)
            let decHeadVO = res.result.decHeadVO
            // 确定数据来源
            if (decHeadVO && decHeadVO.sysSource === 'INVT') { // 金二核注清单生成的报关单
              this.$refs.decList.bodyController.isJinEr = true
            }
            // 已提交单一窗口  提交单一窗口成功   发往单一窗口
            if (['002', '003', '005'].includes(decHeadVO.status)) { // 002 003 005 状态不可发送 其余状态后端判断
              this.controller.isSendDisabled = true
            }
            // 如果是概要申报申报之后的完整申报数据
            if (this.controller.isSummary === false && decHeadVO.twoStepFlag) {
              this.controller.isWholeDec = true
              this.controller.codeTsDisabled = true
              this.controller.isDocument = true
            }
            // 概要申报和完整申报
            if (this.controller.isSummary || this.controller.isWholeDec) {
              let twoStepArr = decHeadVO.twoStepFlag.split('')
              if (twoStepArr.length === 3) {
                this.controller.isDocument = (twoStepArr[0] === '1') // 是否涉证
                this.controller.isCIQ = (twoStepArr[1] === '1') // 否是涉检
                this.controller.isTax = (twoStepArr[2] === '1') // 是否涉税
              }
              // 如果没有填写进口日期 设置默认进口日期
              if (!this.$refs.decHead.decHead.iEDate) {
                this.$refs.decHead.decHead.iEDate = decUtil.getTodayDate()
              }
            }

            this.controller.isGenerModel = this.$refs.decHead.decHead.status === '9' || this.$refs.decHead.decHead.status === '10'
            if ((!this.controller.isCIQ && this.controller.isWholeDec) || this.controller.isSummary) {
              this.controller.codeTsDisabled = false
            }
            if (this.$refs.decList.supplementFlag) {
              this.openSuppDec()
            } else {
              // 当状态为审核驳回并且为编辑状态时。调用审核记录
              if (this.switch['show_audit_log_in_reject_status'] && this.switch['show_audit_log_in_reject_status'] === 'Y' && decHeadVO.isExamine === '4' && this.controller.operationType === 'edit') {
                // 需要获取审核驳回时报关单的数据 以便对比是否修改 以便改变颜色
                let checkVo = res.result.decVerifyVO
                if (checkVo) {
                  this.$refs.decHead.formatHeadCheckData(checkVo.decVerifyHeadVO, checkVo.headMap)
                  this.$refs.decList.formatBodyCheckData(checkVo.decVerifyListVOs, checkVo.listMap)
                }
                this.controller.showCheckTips = true
              } else {
                this.controller.showCheckTips = false
              }
              this.$refs.decHead.focusCustomMaster()
            }
            if (this.$refs.decHead.decHead.isExamine === '6') {
              this.feeEstimateState = false
            }
          }
        }
      })
    },
    // 加入 审核驳回后 错误数据分析
    // 处理复制过来的数据
    /**
     * @param 'copyDec' 处理复制过来的数据 'decHistory' 查看备份数据
     */
    initLocalStorageData (param) {
      let decVo = JSON.parse(window.localStorage.getItem(param))
      // 表头
      // 表头数据拆出来
      let decHeadVO = decVo.decHeadVO
      this.datasFormDate.relId = decHeadVO['relId']
      this.datasFormDate.relManno = decHeadVO['relManno']
      this.datasFormDate.bonNo = decHeadVO['bonNo']
      this.datasFormDate.cusFie = decHeadVO['cusFie']
      this.$refs.decHead.getHeadDetail(decHeadVO)
      this.$refs.decList.getBodyDetail(decVo.decListVO)
      // 集装箱
      this.$refs.decContainer.getContainersDetail(decVo.decContainersVO)
      // 随附单证
      this.$refs.decDocuments.getDocumentsDetail(decVo.decLicensesVO)
    },
    // 初始默认模板值
    initDefaultTemplate () {
      this.$post({
        url: 'API@/dec-common/dec/initSetting/queryDefultTemplate',
        data: {iEFlag: this.$refs.decHead.decHead.iEFlag},
        success: (res) => {
          if (res.result) {
            this.backInitTemplate(res.result)
          }
          this.$refs.decHead.focusCustomMaster()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 清空 报关单
    addDecHead () {
      this.$refs.decHead.initHeadData()
      this.$refs.decList.initBodyData()
      this.$refs.decContainer.initContainerData()
      this.$refs.decDocuments.initDocumentsData()
      this.controller.pid = ''
      this.controller.initTemplateBtn = false // 初始值模板 按钮可用
      this.controller.accDocDisabled = false // 随附单据
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'charterDis', value: true})
      // 聚焦点
      this.$refs.decHead.focusCustomMaster()
      this.initDefaultTemplate()
      // 删除现在的tab
      // this.$store.dispatch('CloseTab', this.$store.state.TabsStore.currentTab.tabId)
      // // 打开新增的tab
      // // 先关闭当前页签
      // this.$router.push({
      //   name: routeName,
      //   params: {
      //     'pid': this.controller.pid,
      //     'operationType': 'edit',
      //     'setTitle': tabName + '-' + this.controller.pid,
      //     'setId': routeName + 'edit' + this.controller.pid
      //   }
      // })
    },
    // 修改页签的名字
    modifyTabName () {
      let titleName = ''
      if (this.controller.iEFlag === 'I' && this.controller.declTrnrel === '0') {
        titleName = '进口报关单'
      } else if (this.controller.iEFlag === ' I' && this.controller.declTrnrel === '2') {
        titleName = '进口备案清单'
      } else if (this.controller.iEFlag === 'E' && this.controller.declTrnrel === '0') {
        titleName = '出口报关单'
      } else if (this.controller.iEFlag === 'E' && this.controller.declTrnrel === '2') {
        titleName = '出口备案清单'
      }
      window.parent.postMessage({type: 'editTitle', data: {tabId: this.$route.query.tabId, title: titleName}}, '*')
    },
    // 智能制单
    OCRMadeCert (command) {
      if (command === 'upload') {
        this.samrtOrcVisable = true
      } else {
        this.orcRecordVisable = true
      }
    },
    smartOrcClose () {
      this.samrtOrcVisable = false
    },
    orcRecordClose () {
      this.orcRecordVisable = false
    },
    // 复制 报关单
    copyDecHead () {
      // 做法 就是去掉所有的主键和状态
      if (util.isEmpty(this.controller.pid)) {
        this.messageTips('没有可复制的数据', 'error')
        return false
      }
      let decHeadVo = util.simpleClone(this.$refs.decHead.decHead)
      let cropLimit = this.$refs.decHead.cropLimit
      if (!util.isEmpty(cropLimit.entQualiftypeCode)) {
        decHeadVo.decCopLimits.push(cropLimit)
      }
      decHeadVo.seqNo = ''
      // 清除 预录入编号
      decHeadVo.preEntryId = ''
      decHeadVo.bossId = ''
      decHeadVo.clientSeqno = ''
      decHeadVo.dDate = ''
      decHeadVo.cusCiqNo = ''
      // 随附单据
      decHeadVo.decEdocRealations = []
      // 标记号码 标记唛码附件
      decHeadVo.decMarkLobs = []
      // 海关编号
      decHeadVo.entryId = ''
      // 清除所有的主键
      decHeadVo.decPid = ''
      decHeadVo.isExamine = ''
      decHeadVo.status = ''
      decHeadVo.statusValue = ''
      // firstSaveFlag默认为0
      decHeadVo.firstSaveFlag = '0'
      delete decHeadVo.dataSource
      delete decHeadVo.sysSource
      delete decHeadVo.feePid
      delete decHeadVo.expenseId
      delete decHeadVo.emailAddress
      delete decHeadVo.xmlStatus
      delete decHeadVo.xmlUrl
      delete decHeadVo.ref5
      delete decHeadVo.twoStepFlag
      // 清除 申报日期
      if (this.controller.iEFlag === 'E') {
        decHeadVo.iEDate = ''
      }
      let tableListC = util.simpleClone(this.$refs.decList.tableList)
      for (let i in tableListC) {
        tableListC[i].decListPid = ''
        tableListC[i].decPid = ''
      }
      let licenselistC = util.simpleClone(this.$refs.decDocuments.licenselist)
      for (let n in licenselistC) {
        licenselistC[n].pid = ''
        licenselistC[n].decPid = ''
      }
      let ContainerlistC = util.simpleClone(this.$refs.decContainer.tableDecContainerlist)
      for (let n in ContainerlistC) {
        ContainerlistC[n].pid = ''
        ContainerlistC[n].decPid = ''
      }
      let decVo = {
        decContainersVO: ContainerlistC,
        decHeadVO: decHeadVo,
        decLicensesVO: licenselistC,
        decListVO: tableListC
      }
      // 缓存数据
      window.localStorage.setItem('copyDec', JSON.stringify(decVo))
      let flag = this.controller.iEFlag === 'I' ? 'import' : 'export'
      let funFlag = this.$refs.decHead.decHead.declTrnrel === '0' ? 'declaration' : 'recordList'
      let queryParam = {
        'type': 'copy'
      }
      decUtil.gotoDecPage(funFlag, flag, 'add', this.controller.pid, 'dec', queryParam, this, 'copy')
    },
    // 打印 报关单
    printDecHead () {
      if (util.isEmpty(this.controller.pid)) {
        this.messageTips('没有可打印的数据', 'error')
        return false
      }
      this.printCompnentParam = {
        'type': this.controller.declTrnrel,
        'pidList': [this.controller.pid],
        'userId': this.controller.userId,
        'pageType': this.controller.isSummary ? 'summaryDec' : ''
      }
      this.printCompnentVisible = true
    },
    // 关闭打印组件
    closePrintCompnent () {
      this.printCompnentVisible = false
    },
    // 取消选择 初始化组件
    closeTemplateCompnent  () {
      this.initTemplateVisible = false
    },
    // 接收初始值模板数据
    receptionTemplateData (param) {
      let initTemplateData = util.simpleClone(param.templateData)
      if (param.type === 'sure') {
        if (util.isEmpty(this.controller.pid)) {
          // 如果是没有保存的数据 直接替换
          this.backInitTemplate(initTemplateData)
        } else {
          // 如果已经保存过后的数据 打开比较模板 TODO
          let list = this.$refs.decHead.compareDecHead(initTemplateData.decHeadVO)
          this.initCompare = {
            compareList: list,
            decList: initTemplateData.decListVO
          }
          this.compareVisible = true
        }
      } else {
        this.addDecHead()
        this.initTemplateVisible = false
      }
    },
    // 反填 初始化模板值
    backInitTemplate (initTemplateData) {
      let headVo = initTemplateData.decHeadVO
      if (util.isEmpty(headVo)) {
        return
      }
      delete headVo.effective
      delete headVo.isdefault
      headVo.decPid = ''
      headVo.status = ''
      headVo.statusValue = ''
      headVo['decMarkLobs'] = []
      headVo['decEdocRealations'] = []
      this.datasFormDate.relId = headVo['relId']
      this.datasFormDate.relManno = headVo['relManno']
      this.datasFormDate.bonNo = headVo['bonNo']
      this.datasFormDate.cusFie = headVo['cusFie']
      this.$refs.decHead.getHeadDetail(headVo)
      // 报关单表体
      let licFlag = false // 判断是否需要赋值 产品资质
      let vinFlag = false // 判断是否需要赋值 许可证vin
      let decListVo = initTemplateData.decListVO
      if (decListVo.length === 1) {
        decListVo[0].gNo = '1'
        this.$refs.decList.backDeccListInfo(decListVo[0])
        licFlag = true
      }
      // 表体下的 产品资质
      let filingInfoForm = []
      if (licFlag && this.$refs.decList.decList.decGoodsLimits.length === 1) {
        decBus.getBus(this.moduleName).$emit('setValueForFilingInfoForm', this.$refs.decList.decList.decGoodsLimits[0])
        filingInfoForm = this.$refs.decList.decList.decGoodsLimits[0]
        vinFlag = true
      }
      // 标题下 的产品资质 的 许可证vin
      if (vinFlag && filingInfoForm.decGoodsLimitvins.length === 1) {
        decBus.getBus(this.moduleName).$emit('setValueForlicVINForm', filingInfoForm.decGoodsLimitvins[0])
      }
      this.$refs.decList.decList.decGoodsLimits = []
      // 随附单证
      let decLicList = initTemplateData.decLicensesVO
      if (decLicList.length === 1) {
        this.$refs.decDocuments.setValueForDecLicForm(decLicList[0])
      }
      // 集装箱
      let contaList = initTemplateData.decContainersVO
      if (contaList.length === 1) {
        this.$refs.decContainer.setValueForDecContaForm(contaList[0])
      }
      if (headVo.manualNo.length === 12) {
        this.$refs.decHead.isManualNoChange = true
        this.$refs.decHead.queryBookHead()
      }
      this.initTemplateVisible = false
    },
    // 删除 报关单
    delDecHead () {
      this.$confirm('请确认是否删除整票报关单?', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        if (util.isEmpty(this.controller.pid)) {
          this.messageTips('没有可删除的数据', 'error')
          return false
        } else {
          let url = 'API@/dec-common/dec/common/delDec'
          if (this.isSummary) {
            url = 'API@/dec-common/dec/ts/delT'
          }
          this.$post({
            url: url,
            data: {
              'seqNos': [this.controller.pid]
            },
            success: (res) => {
              this.messageTips(res.message, 'success')
              this.closeTab()
            },
            other: (res) => {
              this.messageTips(res.message, 'error')
            }
          })
        }
      }).catch(() => {
      })
    },
    // 获取检验检验申报要素 和 其他包装种类 参数
    getspecialParams () {
      return {
        url: 'API@/saas-dictionary/dictionary/getCerts',
        data: {},
        success: (res) => {
          window.localStorage.setItem('decElementsList', JSON.stringify(res.result.CertElements))
          window.localStorage.setItem('otherPackList', JSON.stringify(res.result.Wraps))
        }
      }
    },
    // 获取校验质检的信息关联表
    getCiqParams () {
      let table = window.localStorage.getItem('CIQ_CHECK_TABLE')
      if (!util.isEmpty(table)) {
        return
      }
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getEpidemicAndTradeMode',
        data: {},
        isLoad: false,
        success: (res) => {
          window.localStorage.setItem('CUS_TRADE_MODE', JSON.stringify(res.result.cusTradeModeVo))
          window.localStorage.setItem('MAPPING_EPIDEMIC_AREA_CODE', JSON.stringify(res.result.epidemics))
        }
      })
    },
    // 打开随附单据 弹出框
    openAccDoc () {
      if (util.isEmpty(this.$refs.decHead.decHead.customMaster)) {
        this.messageTips('申报地海关不能为空', 'error')
        return false
      }
      this.accDocData = {
        'decHead': this.$refs.decHead.decHead,
        'decList': this.$refs.decList.tableList
      }
      this.accDocVisible = true
    },
    // 查看报关单是否需要审核
    getSwitchCheck () {
      // if (this.controller.operationType === 'look') {
      //   return
      // }
      this.$post({
        url: 'API@/dec-common/ccba/review/isReview',
        data: [],
        isLoad: false,
        success: (res) => {
          // 报关单人工审核
          if (res.result['customs_declaration_manual_audit']) {
            this.$store.commit(this.moduleName + '/changeDecPage', {key: 'swtichCheck', value: res.result['customs_declaration_manual_audit'].value})
          }
          // 报关单直接申报
          if (res.result['customs_declaration_direct']) {
            this.$store.commit(this.moduleName + '/changeDecPage', {key: 'isDirectDec', value: res.result['customs_declaration_direct'].value})
          }
          if (res.result['show_customs_param_code']) {
            this.$store.commit(this.moduleName + '/changeDecPage', {key: 'showCustomsCode', value: res.result['show_customs_param_code'].value === 'Y'})
          }
          if (this.isDirectDec === 'Y') {
            this.isDisabledDec = false
          } else {
            this.isDisabledDec = true
          }
          let _switch = []
          for (let item in res.result) {
            _switch[item] = res.result[item].value
          }
          this.$store.commit(this.moduleName + '/changeDecPage', {key: 'switch', value: _switch})
        }
      })
    },
    /**
     * operType G 为发送到单一窗口暂存  C 为发送到单一窗口申报
     */
    declareData (operType) {
      // 2.21 判断 自报自缴是否选择
      let tips = ''
      if (this.$refs.decHead.decHead.chkPayment === '1') {
        if (operType === 'G') {
          tips = '是否确认发送？'
        } else {
          tips = '是否确认申报？'
        }
        this.$confirm(tips, '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveAndDeclare(operType)
        }).catch(() => {
        })
      } else {
        this.sendTipsOperType = operType
        this.sendTipsVisable = true
      }
    },
    sendTipsClose (param) {
      if (param.checked) {
        this.$refs.decHead.decHead.chkPayment = '1'
      }
      this.saveAndDeclare(param.operType)
      this.sendTipsVisable = false
    },
    saveAndDeclare (operType) {
      // 校验
      let flag = this.$refs.decHead.saveDecHeadFieldVerify()
      if (!flag) {
        return false
      }
      let cropLimit = this.$refs.decHead.cropLimit
      let tableDecContainerlist = this.$refs.decContainer.tableDecContainerlist
      for (let i in tableDecContainerlist) {
        tableDecContainerlist[i].decPid = ''
      }
      let decHeadVo = util.simpleClone(this.$refs.decHead.decHead)
      //
      decHeadVo['relId'] = this.datasFormDate.relId
      decHeadVo['relManno'] = this.datasFormDate.relManno
      decHeadVo['bonNo'] = this.datasFormDate.bonNo
      decHeadVo['cusFie'] = this.datasFormDate.cusFie
      // 判断企业资质里面有没有 合格
      if (!util.isEmpty(cropLimit.entQualiftypeCode)) {
        decHeadVo.decCopLimits.push(cropLimit)
      }
      // 后端要求清除的
      delete decHeadVo.createTime
      delete decHeadVo.createUser
      delete decHeadVo.inputName
      delete decHeadVo.inputerName
      let param = {
        decContainersVO: tableDecContainerlist,
        decHeadVO: decHeadVo,
        decLicensesVO: this.$refs.decDocuments.licenselist,
        decListVO: this.$refs.decList.tableList
      }
      this.$refs.decHead.sendDec(operType, param)
    },
    // 提交审核
    sumbitCheck () {
      let pidList = []
      if (util.isEmpty(this.$refs.decHead.decHead.status)) {
        this.messageTips('请先暂存数据')
        return
      }
      // 3 带审核   R 带复核 6 审核通过
      if (['3', 'R', '6'].includes(this.$refs.decHead.decHead.isExamine)) {
        this.messageTips('当前数据已是在审核状态')
        return
      }
      pidList.push(this.$refs.decHead.decHead.decPid)
      // 发送请求
      this.$post({
        url: 'API@/dec-common/dec/common/submitVerity',
        data: {
          'list': pidList
        },
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.controller.isDisabled = false
        },
        other: (res) => {
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
    },
    // 查看OCR单证
    lookOCR () {
      // TODO
      this.$post({
        url: 'API@/dec-common/dec/orc/queryDecOCRPic',
        data: {seqNo: this.$refs.decHead.decHead.decPid},
        success: (res) => {
          if (!res.result) {
            this.messageTips('未查到ocr来源')
            return
          }
          window.open(res.result, '_blank')
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    getCommonParams (par) {
      return {
        useStorage: true,
        storageKey: par,
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {
        }
      }
    },
    // 获取公共字典list
    getCommonParams1 () {
      // 申报要素品牌类型 关联理由  货物属性  检验检疫机关代码  检验检疫签证申报要素 随附单据
      let par = ['SAAS_ELEMENT_BRAND', 'SAAS_CORRELATION_REASON', 'SAAS_GOODS_ATTR', 'SAAS_CIQ_ORGANIZATION', 'SAAS_CIQ_CERT_ELEMENT', 'SAAS_EDOC_CODE']
      return {
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          let _this = this
          this.$nextTick(_ => {
            _this.$refs.decList.saasGoodsAttr = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
          })
        },
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {
          let _this = this
          this.$nextTick(_ => {
            _this.$refs.decList.saasGoodsAttr = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
          })
        }
      }
    },
    specialInit () {
      if (this.controller.iEFlag === 'I') { // 进口
        this.$nextTick(_ => {
          this.$refs.decHead.setHeadFieldValue({'iEDate': decUtil.getTodayDate()})
        })
      }
      // 初始化 默认下拉框值
      this.$nextTick(_ => {
        this.$refs.decList.initBodyCountry()
      })
      let operation = this.controller.operationType
      let type = this.$route.query.type // 取路径的参数
      if ((operation === 'look' && util.isEmpty(type)) || operation === 'edit') {
        this.getDecDetail(this.$route.params.pid)
      } else if (operation === 'add' && !util.isEmpty(type)) {
        // 复制功能
        this.initLocalStorageData('copyDec')
      } else if (operation === 'look' && (type === 'lookHistory')) {
        // 这个功能是查看 历史记录的报关单
        this.initLocalStorageData('decHistory')
      }
      // 当 新增页面的时候 光标默认在 申报地海关 所以这里设置 默认的参数和表
      // this.$store.commit(this.moduleName + '/changeDecPage', {key: 'selectObj', value: {obj: 'saasCustomsRel1', params: 'SAAS_CUSTOMS_REL'}})
    },
    // 接受 随附单据 组件 传回的数据
    receptionAccDocData (param) {
      let data = util.simpleClone(param)
      this.$refs.decHead.setHeadFieldValue({'decEdocRealations': data.accDocList})
      this.$refs.decHead.setHeadFieldValue({'decMarkLobs': data.decMarkLobs[0].attachUrl ? util.simpleClone(data.decMarkLobs) : []})
      this.accDocVisible = false
    },
    // 随附单据组件  取消传输数据的操作
    cancleAccDocData (param) {
      this.accDocVisible = false
    },
    // 编辑商品英文名称的弹出框
    openGoodsEnConent () {
      this.goodsEnNameVisible = true
    },
    openAdditionInfo () {
      this.additionInfoLa = this.$refs.decHead.decHead.remarkInfo
      this.additionInfoLaVisible = true
    },
    // 附注信息
    saveExtraNote (value) {
      this.$refs.decHead.setHeadFieldValue({'remarkInfo': value.extraNote})
      this.additionInfoLaVisible = false
    },
    // 取消编辑 附注信息
    cancleExtraNote () {
      this.additionInfoLaVisible = false
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
    // 打开补充申报框
    openSuppDec () {
      this.supplDecVisible = true
      this.initSupplDec = {
        supplDecVisible: this.supplDecVisible, // 控制补充申报显示隐藏
        iEFlag: this.controller.iEFlag, // 进出口标识
        goodList: this.tableList, // 商品表
        contrNo: this.$refs.decHead.decHead.contrNo, // 合同协议号
        agentName: this.controller.agentName, // 申报企业名称
        userName: this.controller.userName, // 当前登陆人姓名
        isDisabled: this.controller.isDisabled // 只允许查看

      }
      this.supplDecVisible = true
    },
    // 补充申报 返回数据
    backSupplDec (param) {
      // 暂未开放
    },
    // 取消 关闭 补充申报
    closeSupplDec () {
      // 暂未开发
    },
    // 确定选择的模板数据
    compareData (param) {
      let flagChange = false
      for (let i in param.replaceData) {
        this.$refs.decHead.decHead[param.replaceData[i].field] = param.replaceData[i].templateValue
        if (param.replaceData[i].field === 'manualNo') {
          flagChange = true
        }
      }
      this.$refs.decHead.specialBusiChangeCodeName()
      let decListVo = param.decBody
      if (param.isBodyData) { // 给表体赋值
        // 报关单表体
        let licFlag = false // 判断是否需要赋值 产品资质
        let vinFlag = false // 判断是否需要赋值 许可证vin
        if (decListVo.length === 1) {
          decListVo[0].gNo = '1'
          this.$refs.decList.backDeccListInfo(decListVo[0])
          licFlag = true
        }
        // 表体下的 产品资质
        let filingInfoForm = []
        if (licFlag && this.$refs.decList.decList.decGoodsLimits.length === 1) {
          decBus.getBus(this.moduleName).$emit('setValueForFilingInfoForm', this.$refs.decList.decList.decGoodsLimits[0])
          filingInfoForm = this.$refs.decList.decList.decGoodsLimits[0]
          vinFlag = true
        }
        // 标题下 的产品资质 的 许可证vin
        if (vinFlag && filingInfoForm.decGoodsLimitvins.length === 1) {
          decBus.getBus(this.moduleName).$emit('setValueForlicVINForm', filingInfoForm.decGoodsLimitvins[0])
        }
        this.$refs.decList.decList.decGoodsLimits = []
      }
      this.initTemplateVisible = false
      this.compareVisible = false
      if (flagChange && this.$refs.decHead.decHead.manualNo.length === 12) {
        this.$refs.decHead.isManualNoChange = true
        this.$refs.decHead.queryBookHead()
      }
    },
    // 取消选择的模板数据
    cancleCompareData () {
      this.initTemplateVisible = false
      this.compareVisible = false
    },
    // 获取路径传参
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return (r[2])
      }
      return null
    },
    // 弹窗开启
    charterRight () {
      this.initCharter = this.$refs.decHead.decHead.decRoyaltyFeeVO
      this.charterVisabled = true
    },
    // 弹窗关闭
    closeCharter () {
      this.charterVisabled = false
    },
    // 获取特许权的传值
    getCharterForm (data) {
      this.$refs.decHead.setHeadFieldValue({'decRoyaltyFeeVO': data})
    },
    compareDecAndEms (params) {
      let decHead = this.$refs.decHead.decHead
      let tableList = this.$refs.decList.tableList
      let headVo = params.headVo
      let bodyVo = params.bodyVo
      let head = params.head
      let body = params.body
      let compareHead = []
      let compareBody = []
      let messges = []
      let tips = ''
      /**
       * 匹配功能先校验报关单统一编号，若报关单没有统一编号而和核注有，再进行表头表体其他字段的检测
        若报关单有统一编号，核注也有，则校验两边的报关单统一编号是否一致，若不一致直接提示“当前报关单与核注清单并不匹配，请使用其他核注清单数据”
       */
      if (decHead.cusCiqNo && decHead.cusCiqNo !== headVo.decSeqNo) {
        tips = '当前报关单与核注清单并不匹配，请使用其他核注清单数据'
        this.$store.commit(this.moduleName + '/changeDecPage',
          {key: 'emsCompareResult',
            value: {
              tips: tips,
              compareHead: compareHead,
              compareBody: compareBody
            }
          }
        )
        return
      }
      for (let key1 in head) {
        if (!headVo[head[key1].filed]) {
          headVo[head[key1].filed] = ''
        }
        if (headVo[head[key1].filed].toString() !== decHead[key1].toString()) {
          compareHead.push({
            fieldName: head[key1].name,
            decName: key1,
            billValue: headVo[head[key1].filed],
            decValue: decHead[key1]
          })
        }
      }
      // 比较商品的条目数
      // 条目数量不相当时，若报关单比核注清单少，则提示“表体数据多余X条，
      // 多余商品为序号X的XXXX（商品名称）”，若报关单比核注清单多，
      // 则提示“表体数据缺少X条，缺少商品为序号X的XXXX（商品名称）”
      if (bodyVo.length !== tableList.length) {
        if (tableList.length < bodyVo.length) {
          let i = tableList.length
          for (i; i < bodyVo.length; i++) {
            messges.push('序号' + bodyVo[i].gdsSeqno + '的' + bodyVo[i].gdsNm)
          }
          tips = '表体数据缺少' + messges.length + '条,' + '缺少商品为:' + messges.join('、')
        }
        if (tableList.length > bodyVo.length) {
          let i = bodyVo.length
          for (i; i < tableList.length; i++) {
            messges.push('序号' + tableList[i].gNo + '的' + tableList[i].gName)
          }
          tips = '表体数据多余' + messges.length + '条,' + '多余商品为:' + messges.join('、')
        }
      }
      if (tips.length === 0) {
        for (let n in bodyVo) {
          let vo = {}
          let billVo = bodyVo[n]
          let num = 0
          for (let key in body) {
            if (!billVo[body[key].filed]) {
              billVo[body[key].filed] = ''
            }
            if (billVo[body[key].filed].toString() !== tableList[n][key].toString()) {
              if (vo.fieldName === undefined) {
                let id = +n + 1
                vo = {
                  id: id,
                  gNo: tableList[n].gNo,
                  fieldName: body[key].name,
                  decName: key,
                  billValue: billVo[body[key].filed],
                  decValue: tableList[n][key]
                }
              } else {
                num++
                if (vo['children'] === undefined) {
                  vo['children'] = [{
                    id: +(vo.id + '' + num),
                    gNo: tableList[n].gNo,
                    fieldName: body[key].name,
                    decName: key,
                    billValue: bodyVo[n][body[key].filed],
                    decValue: tableList[n][key]
                  }]
                } else {
                  vo['children'].push({
                    id: +(vo.id + '' + num),
                    gNo: tableList[n].gNo,
                    fieldName: body[key].name,
                    decName: key,
                    billValue: bodyVo[n][body[key].filed],
                    decValue: tableList[n][key]
                  })
                }
              }
            }
          }
          if (vo.id !== undefined) {
            compareBody.push(vo)
          }
        }
      }
      this.$store.commit(this.moduleName + '/changeDecPage',
        {key: 'emsCompareResult',
          value: {
            tips: tips,
            compareHead: compareHead,
            compareBody: compareBody
          }
        }
      )
    },
    backStatisticsData (param) {
      this.statisticsData = {
        totalPrice: param.totalPrice, // 总价
        totalGQty: param.totalGQty, // 成交数量合计
        totalQty1: param.totalQty1, // 法定第一数量合计
        totalQty2: param.totalQty2 // 法定第二数量合计
      }
    },
    // 是否显示税费预估
    switchFeeEstimate () {
      let params = Object.assign({}, this.$refs.decHead.decHead) // 表头数据
      let tempTableList = Object.assign([], this.$refs.decList.tableList)
      let tempLicense = this.$refs.decDocuments.licenselist.find(o => o.docuCode === 'Y')
      if (tempLicense && tempLicense.decEcoRealations) {
        tempTableList.forEach((element) => { // 查找Y证
          let flag = tempLicense.decEcoRealations.find(o => o.decGno === element.gNo)
          if (flag) { // 是Y证的关联关系
            element.isY = true
          }
        })
      }
      params.taxList = tempTableList
      this.feeEstimateData = params
      this.feeEstimateVisible = true
    },
    // 引用电子底账
    eleBillShow () {
      this.electricVisible = true
    },
    getElectricBill (param) {
      this.$refs.decHead.initHeadData('electric')
      this.$refs.decList.initBodyData()
      this.$refs.decContainer.initContainerData()
      this.$refs.decDocuments.initDocumentsData()
      if (param.decHeadVO) {
        this.$refs.decHead.getHeadDetail(param.decHeadVO, 'electric')
      }
      if (param.decListVO) {
        this.$refs.decList.getBodyDetail(param.decListVO)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import './common/decCss';
.reviewTip{
    &.flex {
      display: flex;
      align-items: center;
    }
    box-sizing: border-box;
    height: 24px;
    border-bottom: unset;
    background-color: #ffe9c7;
    border: 1px solid #ffc56b;
    i {
      margin-right: 8px;
      padding-left: 1px;
    }
}
.operDiv{
  position: fixed;
  width: 100%;
  z-index: 999;
  min-width: 954px;
  background: #e8ebed;
  bottom: 0;
  height: 43px;
  font-size: 12px;
  padding: 7px 0;
  .tipShow{
    color:red
  }
  .operButton {
    height: 24px;
    text-align: center;
    .el-button--primary {
      width: 60px;
    }
  }
}
</style>
