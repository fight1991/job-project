<template>
  <!-- 报关单审核组件 -->
  <section class='sys-main sys-dec-check sys-dec-class' ref="ai-container">
    <div :class="{'check-container': doubleScreenIsShow}" style="transform:translate(0,0)">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="报关单" name="declare">
          <!-- 表头信息 -->
          <decHead :headConfig="headConfig" :moduleName="moduleName" @drawArea="drawArea" :isFromAi="isFromAi" :decHead="decHead" :decOther="decOther" :disabledSpecialEle="!tabConfig.declare"></decHead>
          <!-- 报关单 列表 -->
          <decList :deCheckList="deCheckList" :moduleName="moduleName" @drawBoyArea="drawBoyArea" :isFromAi="isFromAi" :decCheckConfigs="listConfigs" :disableList="!tabConfig.declare" :decOther="decOther"></decList>
          <!-- 表尾信息 -->
          <table>
            <tr>
              <checkItem :moduleName="moduleName" colspan="3" :checkData="headConfig['promiseItem1']">
                <span class='content-font'>{{decOther.promiseItem1}}</span>
              </checkItem>
              <checkItem :moduleName="moduleName" colspan="2" :checkData="headConfig['promiseItem2']">
                <span class='content-font'>{{decOther.promiseItem2}}</span>
              </checkItem>
              <checkItem :moduleName="moduleName" colspan="3" :checkData="headConfig['promiseItem3']">
                <span class='content-font'>{{decOther.promiseItem3}}</span>
              </checkItem>
              <checkItem :moduleName="moduleName" colspan="2" :checkData="headConfig['chkPayment']">
                <span class='content-font'>{{chkPayment}}</span>
              </checkItem>
            </tr>
          </table>
          <!-- 审批意见 -->
          <table class="auditTable">
            <tr>
              <td width="10%">
                <span class='title-name'>审批意见</span>
              </td>
              <td width="90%">
                <el-input v-model="auditOpinion" :disabled="isLook"></el-input>
              </td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="商检单" name="inspection" :lazy="lazy">
          <!-- 表头信息 -->
          <inspectHead :moduleName="moduleName" :headConfig="headConfig" :decHead="decHead" :decOther="decOther" :disabledSpecialEle="!tabConfig.inspection"></inspectHead>
          <!-- 商检列表 -->
          <inspectList :moduleName="moduleName" :deCheckList="deCheckList" :decCheckConfigs="listConfigs" :disableList="!tabConfig.inspection"></inspectList>
          <!-- 审批意见 -->
          <table>
            <tr>
              <td width="10%">
                <span class='title-name'>审批意见</span>
              </td>
              <td width="90%">
                <el-input v-model="auditOpinion" :disabled="isLook"></el-input>
              </td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="商品附加页" name="goods" :lazy="lazy">
          <goodsHead :moduleName="moduleName" :headConfig="headConfig" :decHead="decHead" :decOther="decOther" :disabledSpecialEle="!tabConfig.goods"></goodsHead>
          <goodsList :moduleName="moduleName" :deCheckList="deCheckList" :decCheckConfigs="listConfigs" :disableList="!tabConfig.goods"></goodsList>
          <table>
            <tr>
              <td width="10%">
                <span class='title-name'>审批意见</span>
              </td>
              <td width="90%">
                <el-input v-model="auditOpinion" :disabled="isLook"></el-input>
              </td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="集装箱附加页" name="container" :lazy="lazy">
          <containerList :moduleName="moduleName" v-if="containerListConfigs" :containerList="container" :containerCheckConfigs="containerListConfigs"></containerList>
          <table>
            <tr>
              <td width="10%">
                <span class='title-name'>审批意见</span>
              </td>
              <td width="90%">
                <el-input v-model="auditOpinion" :disabled="isLook"></el-input>
              </td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="sys-dialog-footer text-center">
        <el-button class='dialog-primary-btn' @click="checkReject" v-show="!isLook">审核驳回</el-button>
        <el-button class='dialog-primary-btn' @click="checkPassed"  v-show="!isLook">审核通过</el-button>
        <el-button class='dialog-primary-btn' @click="directEdit" v-permissions="'CCBA20204010200'">直接编辑</el-button>
      </div>
    </div>
    <dec-ai-detail v-if="doubleScreenIsShow" :pageFlag="'check'" :pagePos="pagePos" :isFromAi="isFromAi" :moduleName="moduleName" ref="aiDetail"></dec-ai-detail>
  </section>
</template>

<script>
import util from '@/common/util'
import businessUtil from './utils/businessUtil'
import decHead from './components/decHead'
import decList from './components/decList'
import inspectHead from './components/inspectHead'
import inspectList from './components/inspectList'
import containerList from './components/containerList'
import goodsHead from './components/goodsHead'
import goodsList from './components/goodsList'
import checkItem from './common/checkItem'
import declareCheckStore from './declareCheckStore'
import decUtil from '../decPage/common/decUtil'

import decAiDetail from '../decPage/components/decAiDetail'
export default {
  name: 'declare-check',
  components: {
    decHead,
    decList,
    inspectHead,
    inspectList,
    containerList,
    goodsHead,
    goodsList,
    checkItem,
    decAiDetail
  },
  data () {
    return {
      pagePos: {
        totalW: 0,
        otherW: 0
      },
      moduleName: '',
      isFromAi: false, // 是否是ai制单
      doubleScreenIsShow: false, // 在非预览情况下, 有数据则展示双屏
      auditOpinion: '', // 审核意见
      lazy: true,
      headConfig: businessUtil.generateDecHeadCheck(),
      listConfigs: null,
      containerListConfigs: null,
      extraNote: '',
      deCheckList: [], // 报关单表体数据
      visible: false,
      operationType: '',
      activeName: 'declare',
      decOther: { // 处理特殊的反填
        promiseItem1: '',
        promiseItem2: '',
        promiseItem3: '',
        note: '', // 标记唛码及备注
        specialFlag: '', // 特殊业务标识
        companyCer: '', // 企业资质
        userInfo: '', // 使用人
        inspDecElem: '', // 检验检疫签证申报要素
        purpose: '', // 用途
        purposeValue: '', // 用途中文名
        originRelation: '', // 原产地对应关系
        approveNo: '', // 许可证/审批号
        totalPrice: '', // 总价
        gQtyTotal: '', // 成交数量合计
        gQty1Total: '', // 法定数量合计
        gQty2Total: '', // 第二数量合计
        docuAndcertCode: '', // 随附单证及编号
        statistics: '' // 报关单的数据统计
      },
      decHead: {},
      container: [], // 报关单集装箱
      checkReview: 'Y' // 是否需要复核
    }
  },
  beforeDestroy () {
    this.$store.unregisterModule(this.moduleName)
    window.removeEventListener('resize', this.getContainerWith)
  },
  created () {
    let pid = this.$route.params.pid || ''
    this.moduleName = 'declare-check' + pid
    // 动态注册模块存储
    this.$store.registerModule(this.moduleName, declareCheckStore)
    // 获取审核数据
    this.getInitData()
    this.getDecOpenConf()
    // 获取 复核状态
    this.getSwitchCheck()
    this.$store.commit(this.moduleName + '/changeCheckPage', {key: 'isLook', value: this.$route.meta.operationType === 'look'})
    window.addEventListener('resize', this.getContainerWith)
  },
  watch: {
    '$store.state.collapse': function () {
      this.getContainerWith()
    }
  },
  computed: {
    isImport () {
      return this.$store.state[this.moduleName].isImport
    },
    isLook () {
      return this.$store.state[this.moduleName].isLook
    },
    chkPayment () {
      return this.$store.state[this.moduleName].chkPayment
    },
    tabConfig: function () {
      return {
        declare: this.activeName === 'declare',
        inspection: this.activeName === 'inspection',
        goods: this.activeName === 'goods'
      }
    }
  },
  methods: {
    // 获取主要容器的宽度
    getContainerWith () {
      this.$nextTick(() => {
        let outHtml = this.$refs['ai-container']
        let dom = outHtml.querySelector('.check-container')
        if (dom) {
          this.pagePos.otherW = dom.offsetWidth
        }
        this.pagePos.totalW = outHtml.offsetWidth
      })
    },
    // 框选表头区域
    drawArea (data) {
      this.$refs.aiDetail.drawArea(data)
    },
    // 框选表体区域
    drawBoyArea (data) {
      this.$refs.aiDetail.drawBoyArea(data)
    },
    // 获取审核数据
    getInitData () {
      let param = {
        'pid': this.$route.params.pid
      }
      if (!util.isEmpty(this.$route.query.type)) {
        param['type'] = '1'
      }
      param['categoryType'] = this.$route.query.decType ? this.$route.query.decType : 'dec'
      this.$post({
        url: 'API@/dec-common/dec/common/queryVerifyInfo',
        data: param,
        success: (res) => {
          this.$store.commit(this.moduleName + '/changeCheckPage', {key: 'isImport', value: res.result.decHeadVO.iEFlag === 'I'})
          this.deCheckList = res.result.decListVO // 报关单表体信息
          this.decHead = res.result.decHeadVO // 报关单 表头信息
          this.$store.commit(this.moduleName + '/changeCheckPage', {key: 'chkPayment', value: this.decHead.chkPayment === '1' ? '是' : '否'})
          this.$store.commit(this.moduleName + '/setCheckPage', {iEFlag: this.decHead.iEFlag})
          // 是ai制单, 则展示ai窗口
          // 非ai制单,则展示pdf窗口
          if (this.decHead.ocrNo) {
            this.isFromAi = true
            this.doubleScreenIsShow = true
            this.$nextTick(() => {
              this.$refs.aiDetail.getDecByOcr(this.decHead.ocrNo, false)
              this.getContainerWith()
            })
          } else {
            this.isFromAi = false
            if (this.decHead.decEdocRealations && this.decHead.decEdocRealations.length > 0) {
              this.doubleScreenIsShow = true
              this.$nextTick(() => {
                this.$refs.aiDetail.setPicData([...this.decHead.decEdocRealations])
                this.getContainerWith()
              })
            } else {
              this.doubleScreenIsShow = false
            }
          }
          this.container = res.result.decContainersVO // 报关单集装箱
          let check = res.result.decVerifyVO // 报关单审核信息
          let decListCheckRec
          if (res.result.decVerifyVO.decVerifyListVOs) {
            decListCheckRec = res.result.decVerifyVO.decVerifyListVOs
          } else {
            decListCheckRec = res.result.decListVO
          }
          this.auditOpinion = check.decVerifyHeadVO.auditOpinion
          this.headConfig = businessUtil.generateDecHeadCheck(this.decHead, check.decVerifyHeadVO, res.result.decVerifyVO.headMap)
          this.listConfigs = businessUtil.generateDecListCheck(this.deCheckList, decListCheckRec, res.result.decVerifyVO.listMap)
          this.containerListConfigs = businessUtil.generateContainerListCheck(this.container, check.decVerifyContainerVOs, res.result.decVerifyVO.containerMap)
          let decOtherInfo = businessUtil.formatDecList(this.deCheckList, check.decVerifyListVOs)
          this.generateDecOther(decOtherInfo, this.decHead, res.result.decLicensesVO)
        }
      })
    },
    // 获取 开关
    getDecOpenConf () {
      this.$post({
        url: 'API@/dec-common/ccba/review/isReview',
        data: ['confirm_audit_result_for_visual_audit'],
        loading: true,
        success: (res) => {
          if (!util.isEmpty(res.result['confirm_audit_result_for_visual_audit'].value)) {
            this.$store.commit('setifDecOpen', res.result['confirm_audit_result_for_visual_audit'].value === 'Y')
          }
        }
      })
    },
    generateDecOther (decOtherInfo, decHead, licenses) {
      this.decOther.purpose = decOtherInfo.purpose
      this.decOther.purposeValue = decOtherInfo.purposeValue
      this.decOther.approveNo = decOtherInfo.approveNo
      this.decOther.totalPrice = decOtherInfo.totalPrice
      this.decOther.gQtyTotal = decOtherInfo.gQtyTotal
      this.decOther.gQty1Total = decOtherInfo.gQty1Total
      this.decOther.gQty2Total = decOtherInfo.gQty2Total
      this.decOther.statistics = decOtherInfo.statistics
      this.decOther.specialFlag = businessUtil.generateSpecialFlag(decHead)
      if (!util.isEmpty(decHead.promiseItmes)) {
        [this.decOther.promiseItem1, this.decOther.promiseItem2, this.decOther.promiseItem3] = businessUtil.generatePromiseItems(decHead)
      }
      this.decOther.note = businessUtil.generateNote(decHead, this.container)
      let licenseInfo = businessUtil.generateLicenseInfo(licenses, decHead)
      this.decOther.originRelation = licenseInfo.originRelation
      this.decOther.docuAndcertCode = licenseInfo.docuAndcertCode
      this.decOther.companyCer = businessUtil.generateCompanyCer(decHead)
      this.decOther.userInfo = businessUtil.generateUserInfo(decHead)
      this.decOther.inspDecElem = businessUtil.generateInspDecElem(decHead)
    },
    // 获取是否开启复核开关
    getSwitchCheck () {
      this.$post({
        url: 'API@/dec-common/ccba/review/isReview',
        data: ['customs_declaration_review'],
        success: (res) => {
          if (!util.isEmpty(res.result['customs_declaration_review'].value)) {
            this.checkReview = res.result['customs_declaration_review'].value
          }
        }
      })
    },
    // 更改驳回时的状态
    rejectUpdateStatus (pid) {
      // 2.修改审核状态
      this.$post({
        url: 'API@/dec-common/dec/common/updateExamStatus',
        data: {
          'bossId': this.decHead.bossId, // 报关单id
          'status': '4', // 4 为审核驳回状态
          'iEFlag': this.decHead.iEFlag,
          'pid': pid,
          'type': this.$route.query.decType ? this.$route.query.decType : 'dec'
        },
        success: (res) => {
          this.messageTips('操作成功', 'success')
          // 跳审核页面
          this.$store.dispatch('CloseTab', this.$route.params.setId)
        }
      })
    },
    // 提交 审核结果
    checkReject () {
      if (this.$store.state.ifDecOpen && businessUtil.allDecDataColorCheck(this.headConfig, this.listConfigs, this.containerListConfigs, this.isImport)) {
        this.messageTips('所有栏位必须为非白色')
        return
      }
      let param = this.checkData()
      this.$post({
        url: 'API@/dec-common/dec/common/saveVerifyInfo',
        data: param,
        success: (res) => {
          // 更改状态
          this.rejectUpdateStatus(res.result)
        }
      })
    },
    // 提交的审核数据
    checkData () {
      let decVerifyContainerVOs = businessUtil.generateDecVerifyContainerVOs(this.container, this.containerListConfigs)
      let decVerifyHeadVO = businessUtil.generateDecVerifyHeadVO(this.decHead, this.headConfig)
      decVerifyHeadVO.auditOpinion = this.auditOpinion
      let decVerifyListVOs = businessUtil.generateDecVerifyListVOs(this.deCheckList, this.listConfigs)
      return {
        // 审核结果
        'decVerifyHeadVO': decVerifyHeadVO, // 报关单表头
        'decVerifyListVOs': decVerifyListVOs, // 报关单 表体
        'decVerifyContainerVOs': decVerifyContainerVOs // 报关单集装箱
      }
    },
    // 审核通过
    checkPassed () {
      if (this.$store.state.ifDecOpen && businessUtil.allDecDataColorCheck(this.headConfig, this.listConfigs, this.containerListConfigs, this.isImport)) {
        this.messageTips('所有栏位必须为非白色')
        return
      }
      let param = this.checkData()
      this.$post({
        url: 'API@/dec-common/dec/common/saveVerifyInfo',
        data: param,
        success: (res) => {
          // 2. 更改数据状态
          if (this.decHead.isExamine === 'R' && this.checkReview === 'Y') {
            // 复核开启
            let param = {
              'bossId': this.decHead.bossId, // 接单编号
              'decPid': this.decHead.decPid, // 报关单主键
              'iEFlag': this.decHead.iEFlag, // 进出口
              'pid': res.result,
              'status': 'R',
              'type': this.$route.query.decType ? this.$route.query.decType : 'dec'
            }
            this.$confirm('是否需要复核？', '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              confirmButtonText: '是',
              cancelButtonText: '否',
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning'
            }).then(() => {
              this.submitPassCheck(param)
            }).catch(() => {
              param['status'] = '6'
              this.submitPassCheck(param)
            })
          } else if ((this.decHead.isExamine === 'R' && this.checkReview === 'N') || (this.decHead.isExamine === '3' && this.checkReview === 'N')) {
            let param = {
              'bossId': this.decHead.bossId, // 接单编号
              'decPid': this.decHead.decPid, // 报关单主键
              'iEFlag': this.decHead.iEFlag,
              'pid': res.result,
              'status': '6',
              'type': this.$route.query.decType ? this.$route.query.decType : 'dec'
            }
            this.submitPassCheck(param)
          } else {
            let param = {
              'bossId': this.decHead.bossId, // 接单编号
              'decPid': this.decHead.decPid, // 报关单主键
              'iEFlag': this.decHead.iEFlag,
              'pid': res.result,
              'status': 'R',
              'type': this.$route.query.decType ? this.$route.query.decType : 'dec'
            }
            this.submitPassCheck(param)
          }
        }
      })
    },
    // 提交审核通过的动作
    submitPassCheck (param) {
      this.$post({
        url: 'API@/dec-common/dec/common/updateExamStatus',
        data: param,
        success: (res) => {
          this.messageTips('操作成功', 'success')
          // 跳审核页面
          this.$store.dispatch('CloseTab', this.$route.params.setId)
        }
      })
    },
    closeTab () {
      this.$store.dispatch('CloseTab', this.$store.state.TabsStore.currentTab.tabId)
    },
    directEdit () {
      let pageType
      if (this.decHead.declTrnrel === '0') {
        pageType = 'declaration'
      } else if (this.decHead.row.declTrnrel === '2') {
        pageType = 'recordList'
      } else {
        pageType = 'declaration'
      }
      this.closeTab()
      decUtil.gotoDecPage(pageType, this.decHead.iEFlag === 'I' ? 'import' : 'export', 'edit', this.decHead.decPid, 'dec', {fromPage: 'reviewed'}, this)
    }
  }
}
</script>

<style scoped lang="less">
  table,table tr th, table tr td { border:1px solid #e4eaec; }
  table { width: 100%; min-height: 25px; line-height: 25px; text-align: left; border-collapse: collapse;}
  table th {
    padding: 0px;
    font-size: 12px;
    color: white;
    background-color: #64A7EB;
    border-right-color: #e4eaec;
    height: 20px;
    vertical-align: middle;
  }
  .sys-main{
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: auto;
    margin-left:5px;
  }
 .c2 {
    background-color:#ffd0d8;
  }
  .c1 {
    background-color: #fff;
  }
  .tips{
    padding:5px 0;
  }
  .title-name{
    font-weight: bold
  }
  .content-font{
    font-size: 13px;
    height: 25px;
    width: 100%;
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .check-div {
    height: 27px;
    line-height: 27px;
    background-color: #ebebeb;
    border: 1px solid #e4eaec;
    font-size: 13px;
  }
  .border-none {
    border: 0;
  }
  .div-class {
    overflow:hidden;
    position: relative;
    width: 100%;
  }
  .check-content{
    min-height:25px;
  }
  .check-content-head{
    vertical-align: unset;
  }
  .text-center {
    text-align: center;
  }
  .check-container {
    width:50%!important;
    // min-width:815px!important;
    overflow-y: auto;
    height: 100%;
  }
</style>
