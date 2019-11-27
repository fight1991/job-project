<template>
  <!-- 转关运输申报单 -->
  <section class='sys-dec-class'>
    <div class='dec-div'>
      <el-form :model="initTransfer.statusForm" label-width="112px" size="mini" @keyup.enter.native="switchFoucsByEnter">
        <el-row>
          <el-col :span="6">
            <el-form-item label="转关状态" :class="{'require-color': requireColor}">
              <el-input v-model="initTransfer.statusForm.trnStatusValue" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="pd-l-5">
            <el-button type="primary" class="vertical-mid" icon="fa fa-eye" disabled @click="openReturnCompent" >&nbsp;查看回执</el-button>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" class="vertical-mid" icon="fa fa-eye" disabled @click="exportTrans" >&nbsp;导出</el-button>
            <el-button type="primary" class="vertical-mid" icon="fa fa-eye" disabled @click="checkPrint" >&nbsp;核对单打印</el-button>
            <el-button type="primary" class="vertical-mid" icon="fa fa-eye" disabled @click="decPrint" >&nbsp;申报单打印</el-button>
            <el-button type="primary" class="vertical-mid" icon="fa fa-eye" disabled @click="processPrint" >&nbsp;验放单打印</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class='dec-div'>
      <el-form :model="initTransfer.transDcForm" ref="transDcForm" :rules="trnHeadRules" label-width="112px" size="mini" @keyup.enter.native="switchFoucsByEnter">
        <el-row>
          <el-col :span="24">
            <span class="trans-panel-title">转关运输提前报关申报</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="转关申报单号">
              <el-input v-model="initTransfer.transDcForm.transDclNo" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转关类型" :class="{ 'require-color': requireColor }" prop="transFlag">
              <el-select placeholder=" " v-model="initTransfer.transDcForm.transFlag" :disabled="initTransfer.isDisabled"
                @focus="tipsFillMessage('transFlag','transType','TRANS_TYPE')"
                remote default-first-option clearable  filterable
                :remote-method="checkParamsList"
                @clear="clearSelct('transType')"
                ref="transFlag" dataRef ='transFlag'
                style="width:100%">
                <el-option
                  v-for="item in transType"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="境内运输方式" :class="{ 'require-color': requireColor }" prop="inbordTrafMode">
              <el-select placeholder=" " v-model="initTransfer.transDcForm.inbordTrafMode" :disabled="initTransfer.isDisabled"
                @focus="tipsFillMessage('inbordTrafMode','inbordTrafModeList','SAAS_TRANSPORT_TYPE')"
                remote default-first-option clearable  filterable
                :remote-method="checkParamsList"
                @clear="clearSelct('inbordTrafModeList')"
                ref="inbordTrafMode" dataRef ='inbordTrafMode'
                style="width:100%">
                <el-option
                  v-for="item in inbordTrafModeList"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预计抵运日期" :class="{ 'require-color': requireColor }" prop="validDate">
              <el-input v-model="initTransfer.transDcForm.validDate" @focus="tipsFillMessage('validDate')" placeholder='YYYYMMDD' maxlength='8' :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="境内运输工具编号">
              <el-input v-model="initTransfer.transDcForm.inbordTrspmcNo" @focus="tipsFillMessage('inbordTrspmcNo')" maxlength='13' :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="境内运输工具名称">
              <el-input v-model="initTransfer.transDcForm.inbordTrspmcName" maxlength='50' @focus="tipsFillMessage('inbordTrspmcName')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="境内运输工具航次">
              <el-input v-model="initTransfer.transDcForm.inbordTrspmcVygNo" maxlength='32' @focus="tipsFillMessage('inbordTrspmcVygNo')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转关单申报类型" :class="{ 'require-color': requireColor }">
              <el-select placeholder=" " v-model="initTransfer.transDcForm.transType" :disabled="initTransfer.isDisabled"
                @focus="tipsFillMessage('transType','transTypeList','TRANS_TYPE_LIST')"
                remote default-first-option clearable  filterable
                :remote-method="checkParamsList"
                @clear="clearSelct('transTypeList')"
                ref="transType" dataRef ='transType'
                style="width:100%">
                <el-option
                  v-for="item in transTypeList"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否启用电子关锁" :class="{ 'require-color': requireColor }">
              <el-select placeholder=" " v-model="initTransfer.transDcForm.esealFlag" :disabled="initTransfer.isDisabled"
                @focus="tipsFillMessage('esealFlag','esealFlagList','ESEAL_FLAG')"
                remote default-first-option clearable  filterable
                :remote-method="checkParamsList"
                @clear="clearSelct('esealFlagList')"
                ref="esealFlag" dataRef ='esealFlag'
                @change="esealChange"
                style="width:100%">
                <el-option
                  v-for="item in esealFlagList"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="!isGdCustom">
            <el-form-item label="承运单位编号" prop="contractorCode">
              <el-input v-model="initTransfer.transDcForm.contractorCode" @focus="tipsFillMessage('contractorCode')" maxlength='9' :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!isGdCustom">
            <el-form-item label="承运单位名称">
              <el-input v-model="initTransfer.transDcForm.contractorName" id="contractorName" maxlength='70' @focus="tipsFillMessage('contractorName')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isGdCustom">
            <el-form-item label="载货清单号" prop="transNo" key="transNo">
              <el-input v-model="initTransfer.transDcForm.transNo" @focus="tipsFillMessage('transNo')" maxlength='16' :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isGdCustom">
            <el-form-item label="备注">
              <el-input v-model="initTransfer.transDcForm.note" id="contractorName" maxlength='50' @focus="tipsFillMessage('note')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class='dec-div'>
      <el-form :model="initTransfer.billInfoForm" ref="billInfoForm" :rules="billRules" label-width="112px" size="mini" @keyup.enter.native="switchFoucsByEnter">
        <el-row>
          <el-col :span="24">
            <span class="trans-panel-title">提运单信息</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="提运单序号">
              <el-input v-model="initTransfer.billInfoForm.billSeqNo" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运输工具编号" prop="trafNo">
              <el-input v-model="initTransfer.billInfoForm.trafNo" ref="trafNo" @focus="tipsFillMessage('trafNo')" maxlength='32' :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="船舶名称">
              <el-input v-model="initTransfer.billInfoForm.shipNameEn" maxlength='50' @focus="tipsFillMessage('shipNameEn')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="航次" prop="cusVoyageNo">
              <el-input v-model="initTransfer.billInfoForm.cusVoyageNo" maxlength='32' @focus="tipsFillMessage('cusVoyageNo')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提单号" prop="billNo">
              <el-input v-model="initTransfer.billInfoForm.billNo" maxlength='32' @focus="tipsFillMessage('billNo')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="集装箱数">
              <el-input v-model="initTransfer.billInfoForm.contaCount" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="进出境日期" :class="{ 'require-color': requireColor }" prop="docuCode">
              <el-date-picker
                v-model="initTransfer.billInfoForm.iEDate" :disabled="initTransfer.isDisabled"
                type="date"
                :editable='false'
                style="width:100%"
                placeholder=" "
                @focus="tipsFillMessage('iEDate')"
                format='yyyy-MM-dd'
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class='dec-div'>
      <el-row>
        <el-col :span="24">
          <span class="trans-panel-title">集装箱信息</span>
        </el-col>
      </el-row>
      <el-row>
        <el-button size="mini" icon="fa fa-plus" class="secondButton" :disabled="initTransfer.isDisabled" @click='refreshContaInfo'>&nbsp;新增</el-button>
        <el-button size="mini" icon="fa fa-trash-o" class="secondButton" :disabled="initTransfer.isDisabled" @click='delContaInfo'>&nbsp;删除</el-button>
        <el-button size="mini" icon="fa fa-sign-in" class="secondButton" disabled @click='importContaInfo'>&nbsp;导入</el-button>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-table
          ref="contaInfoTable"
          :data="initTransfer.contaInfoList"
          highlight-current-row
          :height='230'
          style="width: 100%"
          size="mini" border
          @select="contaInfoCheckChange"
          @selection-change="contaInfoChange"
          @row-click='rowClickContaInfo'>
            <el-table-column type='selection' width="37"></el-table-column>
            <el-table-column prop="contSeqNo" label="集装箱序号" min-width="218"></el-table-column>
            <el-table-column prop="containerNo" label="集装箱号" min-width="175"></el-table-column>
            <el-table-column prop="sealNo" label="关锁号" min-width="100"></el-table-column>
            <el-table-column prop="sealQty" label="关锁个数" min-width="175"></el-table-column>
            <el-table-column prop="containerMdCode" label="规格代码" min-width="175"></el-table-column>
            <el-table-column prop="inbordTransName" label="境内运输工具名称" min-width="347"></el-table-column>
            <el-table-column prop="transWeight" label="运输工具实际重量(Kg)" min-width="433"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!--- table 结束  -->
      <el-form ref="contaInfoForm" :rules="contaInfoRules" @keyup.enter.native="switchFoucsByEnter"  :model="initTransfer.contaInfoForm" hide-required-asterisk size="mini">
        <el-row>
          <el-col :span="4">
            <el-form-item label="集装箱号" label-width="80px"  :class="{ 'require-color': requireColor }" prop='containerNo'>
              <el-input v-model="initTransfer.contaInfoForm.containerNo" maxlength="11" @focus="tipsFillMessage('containerNo')" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="关锁号" label-width="70px" prop="sealNo" :class="{ 'require-color': requireColor && initTransfer.transDcForm.esealFlag=='Y'}">
              <el-input v-model="initTransfer.contaInfoForm.sealNo" @focus="tipsFillMessage('sealNo')" maxlength="12" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="关锁个数" label-width="80px" prop="sealQty">
              <el-input v-model="initTransfer.contaInfoForm.sealQty" @focus="tipsFillMessage('sealQty')" :readonly="initTransfer.transDcForm.esealFlag=='Y'||initTransfer.isDisabled" maxlength="4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="运输工具实际重量(Kg)" label-width="150px" prop="transWeight">
              <el-input v-model="initTransfer.contaInfoForm.transWeight" @focus="tipsFillMessage('transWeight')" maxlength="18" :readonly="initTransfer.isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="规格代码" label-width="80px" >
              <el-select placeholder=" " v-model="initTransfer.contaInfoForm.containerMdCode" :disabled="initTransfer.isDisabled"
                @focus="tipsFillMessage('containerMdCode','saasContainerModel','SAAS_CONTAINER_MODEL')"
                remote default-first-option
                :remote-method="checkParamsList"
                @clear="clearSelct('saasContainerModel')"
                ref="containerMdCode" dataRef ='containerMdCode'
                clearable  filterable style="width:100%">
                <el-option
                  v-for="item in saasContainerModel"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="境内运输工具名称" label-width="100px" >
              <el-input v-model="initTransfer.contaInfoForm.inbordTransName" :readonly="initTransfer.isDisabled" maxlength="50" enter='no' @keyup.enter.native="saveContaInfo" @focus="tipsFillMessage('inbordTransName')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row>
      <el-col :span="12" class="pd-r-3">
        <div class='dec-div'>
          <el-row>
            <span class="trans-panel-title">商品信息显示</span>
          </el-row>
            <el-row >
            <el-col :span="24">
              <el-table
              ref="goodsInfoTable"
              :data="goodsInfoList"
              highlight-current-row
              :height='240'
              style="width: 100%"
              size="mini" border>
                <!-- <el-table-column type='selection' width="37"></el-table-column> -->
                <el-table-column prop="gNo" label="商品序号" min-width="120"></el-table-column>
                <el-table-column prop="codeTs" label="商品编号" min-width="120"></el-table-column>
                <el-table-column prop="gName" label="商品名称" min-width="132"></el-table-column>
                <el-table-column prop="qty1" label="总数量" min-width="100"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12" class="pd-l-3">
        <div class='dec-div'>
          <el-row>
            <el-col :span='24'>
              <span class="trans-panel-title">集装箱与商品关系</span>
            </el-col>
          </el-row>
          <el-row>
            <el-button size="mini" icon="fa fa-plus" class="secondButton" :disabled="initTransfer.isDisabled" @click="freshContaGoods">&nbsp;新增</el-button>
            <el-button size="mini" icon="fa fa-trash-o" class="secondButton" :disabled="initTransfer.isDisabled" @click="delContaGoods">&nbsp;删除</el-button>
          </el-row>
            <el-row >
            <el-col :span="24">
              <el-table
              ref="contaGoodsTable"
              :data="initTransfer.contaGoodsList"
              highlight-current-row
              :height='200'
              style="width: 100%"
              size="mini" border
              @select="contaGoodsCheckChange"
              @selection-change="contaGoodsChange"
              @row-click='rowClickContaGoods'>
                <el-table-column type='selection' width="37"></el-table-column>
                <el-table-column prop="gNo" label="商品序号" min-width="120"></el-table-column>
                <el-table-column prop="containerNo" label="集装箱号" min-width="120"></el-table-column>
                <el-table-column prop="contaGoodsCount" label="件数" min-width="132"></el-table-column>
                <el-table-column prop="contaGoodsWeight" label="重量" min-width="100"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-form ref="contaGoodsForm" :rules="contaGoodsRule" @keyup.enter.native="switchFoucsByEnter" :model="initTransfer.contaGoodsForm" hide-required-asterisk label-width="100px" size="mini">
            <el-row  >
              <el-col :span="6">
                <el-form-item label="商品序号" :class="{ 'require-color': requireColor }" prop='gNo'>
                  <el-input v-model="initTransfer.contaGoodsForm.gNo" @focus="tipsFillMessage('gNo')" maxlength="10" :readonly="initTransfer.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="集装箱序号" :class="{ 'require-color': requireColor }" prop="contSeqNo">
                  <el-input v-model="initTransfer.contaGoodsForm.contSeqNo" @focus="tipsFillMessage('contSeqNo')" maxlength="10" :readonly="initTransfer.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品件数" prop="contaGoodsCount">
                  <el-input v-model="initTransfer.contaGoodsForm.contaGoodsCount" @focus="tipsFillMessage('contaGoodsCount')" maxlength="9" :readonly="initTransfer.isDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品毛重(Kg)" prop="contaGoodsWeight">
                  <el-input v-model="initTransfer.contaGoodsForm.contaGoodsWeight" @focus="tipsFillMessage('contaGoodsWeight')" :readonly="initTransfer.isDisabled" maxlength="18" @keyup.enter.native="saveContaGoods"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class='bottomDiv' v-show="tipsNoteShow"><span>{{tipsNote}}</span></div>
  </section>
</template>
<script>
import util from '@/common/util'
// import commonParam from '../../../common/commonParam'
export default {
  name: 'bonded-transfer',
  props: {
    initTransfer: {
      type: Object,
      default: () => {
        return {
          iEFlag: this.$route.meta.iEFlag, // I E
          operationType: this.$route.meta.operationType, // look  edit
          pid: '', // 主键
          funFlag: this.$route.meta.funFlag, // 报关单 declaration  备案清单 recordList   二次转关 secondDec
          customMaster: '', // 报关单申报地海关
          isDisabled: false,
          statusForm: {
            trnStatus: '' // 转关状态
          },
          transDcForm: {
            transDecNo: '', // 转关单编号
            transFlag: '', // 转关类型
            inbordTrafMode: '', // 境内运输方式
            validDate: '', // 预计抵运日期
            inbordTrspmcNo: '', // 境内运输工具编号
            inbordTrspmcName: '', // 境内运输工具名称
            inbordTrspmcVygNo: '', // 境内运输工具航次
            transType: '', // 转关单申报类型
            esealFlag: '', // 是否启用电子关锁
            contractorCode: '', // 承运单位编号
            contractorName: '', // 承运单位名称
            transNo: '', // 载货清单号
            note: '' // 备注
          },
          billInfoForm: {
            billSeqNo: '', // 提运单序号
            trafNo: '', // 运输工具编号
            shipNameEn: '', // 船舶名称
            cusVoyageNo: '', // 航次
            billNo: '', // 提单号
            contaCount: '', // 集装箱数
            iEDate: '' // 进出境日期
          },
          contaInfoForm: {
            contSeqNo: '', // 集装箱序号
            containerNo: '', // 集装箱号
            sealNo: '', // 关锁号
            sealQty: '', // 关锁个数
            transWeight: '', // 运输工具实际重量(Kg)
            containerMdCode: '', // 规格代码
            inbordTransName: '' // 境内运输工具名称
          },
          contaGoodsForm: {
            gNo: '', // 商品序号
            contSeqNo: '', // 集装箱序号
            containerNo: '', // 集装箱号
            contaGoodsCount: '', // 商品件数
            contaGoodsWeight: '' // 商品毛重(Kg)
          },
          contaInfoList: [], // 集装箱信息
          goodsInfoList: [], // 商品信息
          contaGoodsList: [] // 集装箱商品关系信息
        }
      }
    },
    goodList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      transType: [],
      inbordTrafModeList: [], // 境内运输方式
      transTypeList: [], // 转关单申报类型
      esealFlagList: [], // 是否启用电子关锁
      saasContainerModel: [], // 集装箱规格代码
      handSelect: {
        'transFlag': {obj: 'transType', params: 'TRANS_TYPE'}, // 转关类型
        'inbordTrafMode': {obj: 'inbordTrafModeList', params: 'SAAS_TRANSPORT_TYPE'}, // 境内运输方式
        'transType': {obj: 'transTypeList', params: 'TRANS_TYPE_LIST'}, // 转关单申报类型
        'esealFlag': {obj: 'esealFlagList', params: 'ESEAL_FLAG'}, // 是否启用电子关锁
        'containerMdCode': {obj: 'saasContainerModel', params: 'SAAS_CONTAINER_MODEL'} // 集装箱规格代码
      },
      tableNameList: {
        tableNames: [
          'SAAS_TRANSPORT_TYPE', // 运输方式
          'SAAS_CONTAINER_MODEL' // 规格型号
        ]
      }, // 字典标明
      requireColor: true,
      trnHeadRules: {
        validDate: [{validator: this.headCheckVal, message: '请输入yyyyMMdd格式的日期', trigger: 'blur'}], // 预计抵运日期
        contractorCode: [{validator: this.headCheckVal, message: '请输入数字、字母', trigger: 'blur'}], // 承运单位编号
        transNo: [{validator: this.headCheckVal, message: '请输入数字、字母', trigger: 'blur'}] // 载货清单号
      },
      billRules: {
        trafNo: [{validator: this.billCheckVal, message: '请输入数字、字母、字符', trigger: 'blur'}], // 运输工具编号
        cusVoyageNo: [{validator: this.billCheckVal, message: '请输入数字、字母、字符', trigger: 'blur'}], // 航次
        billNo: [{validator: this.billCheckVal, message: '请输入数字、字母、字符', trigger: 'blur'}] // 提单号
      },
      contaInfoRules: {
        containerNo: [{validator: this.contaCheckVal, message: '', trigger: 'blur'}], // 集装箱号
        sealNo: [{validator: this.contaCheckVal, message: '', trigger: 'blur'}], // 关锁号
        sealQty: [{validator: this.contaCheckVal, message: '请输入数字', trigger: 'blur'}], // 关锁个数
        transWeight: [{validator: this.contaCheckVal, message: '运输工具实际重量(Kg)最多18位，小数最多3位，不可输入负数', trigger: 'blur'}] // 运输工具实际重量
      },
      contaGoodsRule: {
        gNo: [{validator: this.goodCheckVal, message: '请输入数字', trigger: 'blur'}], // 商品序号
        contSeqNo: [{validator: this.goodCheckVal, message: '请输入数字', trigger: 'blur'}], // 集装箱序号
        contaGoodsCount: [{validator: this.goodCheckVal, message: '请输入数字', trigger: 'blur'}], // 商品件数
        contaGoodsWeight: [{validator: this.goodCheckVal, message: '商品毛重最多18位，小数最多3位，不可输入负数', trigger: 'blur'}] // 商品毛重
      },
      tipsNoteShow: false,
      tipsNote: '',
      tipsMessage: {
        'cusVoyageNo': '航次号：根据业务类型填写运输工具的航次编号，无实际进出境的货物不填',
        'billNo': '提运单号：填报进出口货物提单或运单的编号',
        'containerNo': '集装箱号：输入集装箱号',
        'gNo': '序号：商品表体的序号，为连续的流水号，系统自动生成'
      },
      ruleRegx: {
        'validDate': '^20[0-9]{2}[0-1][0-9][0-3][0-9]$|^$', // 预计抵运日期
        'contractorCode': '^[a-zA-Z0-9]+$', // 承运单位编号
        'transNo': '^[a-zA-Z0-9]+$', // 载货清单号
        'trafNo': '^[^\u4e00-\u9fa5]+$', // 运输工具编号
        'cusVoyageNo': '^[^\u4e00-\u9fa5]+$', // 航次
        'billNo': '^[^\u4e00-\u9fa5]+$', // 提单号
        'sealNo': '^[0-9]+$', // 关锁号
        'sealQty': '^[0-9]+$', // 关锁个数
        'transWeight': '^\\d{1,14}(\\.\\d{1,3})?$|^$', // 运输工具实际重量
        'gNo': '^[0-9]+$', // 商品序号
        'contSeqNo': '^[0-9]+$', // 集装箱序号
        'contaGoodsCount': '^[0-9]+$', // 商品件数
        'contaGoodsWeight': '^\\d{1,14}(\\.\\d{1,3})?$|^$' // 商品毛重
      },
      goodsInfoList: [], // 报关单传来的商品列表
      selectConGoodList: [], // 多选集装和商品关系数据
      selectConList: [], // 多选集装箱数据
      isGdCustom: false // 是否是广东关区
    }
  },
  watch: {
    goodList (newVal, oldVal) {
      if (newVal) {
        this.goodsInfoList = newVal
      }
    },
    'initTransfer.customMaster' (newVal, oldVal) {
      let reg = /(^((5[1,2,3,7])|(6[0,7,8]))\d*$)|^5000$/
      if (reg.test(newVal)) {
        this.isGdCustom = true
        this.initTransfer.transDcForm.contractorCode = ''
        this.initTransfer.transDcForm.contractorName = ''
      } else {
        this.isGdCustom = false
        this.initTransfer.transDcForm.transNo = ''
        this.initTransfer.transDcForm.note = ''
      }
    },
    'initTransfer.contaInfoList': function () {
      this.computedConta()
    }
  },
  created () {
    let transList = []
    if (this.initTransfer.iEFlag === 'import') {
      if (this.initTransfer.funFlag === 'declaration') {
        transList = [{codeField: '1', nameField: '提前/转关报关单'}, {codeField: '1E', nameField: '提前/中欧班列'}, {codeField: '1G', nameField: '提前/工厂验放'}, {codeField: '1S', nameField: '提前/暂时进出口'}]
      } else if (this.initTransfer.funFlag === 'recordList') {
        transList = [{codeField: '1', nameField: '提前/转关备案清单'}, {codeField: '1E', nameField: '提前/中欧班列'}, {codeField: '1G', nameField: '提前/工厂验放'}, {codeField: '1S', nameField: '提前/暂时进出口'}]
      }
    } else {
      if (this.initTransfer.funFlag === 'declaration') {
        transList = [{codeField: '1', nameField: '提前/转关备案清单'}, {codeField: '1E', nameField: '提前/中欧班列'}, {codeField: '1G', nameField: '提前/工厂验放'}, {codeField: '1K', nameField: '提前出口空运联程'}, {codeField: '1P', nameField: '提前市场采购/出口'}, {codeField: '1S', nameField: '提前/暂时进出口'}]
      } else if (this.initTransfer.funFlag === 'recordList') {
        transList = [{codeField: '1', nameField: '提前/转关报关单'}, {codeField: '1E', nameField: '提前/中欧班列'}, {codeField: '1G', nameField: '提前/工厂验放'}, {codeField: '1K', nameField: '提前出口空运联程'}, {codeField: '1P', nameField: '提前市场采购/出口'}, {codeField: '1S', nameField: '提前/暂时进出口'}]
      } else if (this.initTransfer.funFlag === 'secondDec') {
        transList = [{codeField: 'AA', nameField: '出口二次转关'}]
      }
    }
    window.localStorage.setItem('TRANS_TYPE', JSON.stringify(transList))
    window.localStorage.setItem('TRANS_TYPE_LIST', JSON.stringify([{codeField: '0', nameField: '普通有纸申报'}, {codeField: '1', nameField: '无纸申报'}]))
    window.localStorage.setItem('ESEAL_FLAG', JSON.stringify([{codeField: 'N', nameField: '否'}, {codeField: 'Y', nameField: '是'}]))
    this.getCommonParam()
  },
  mounted () {
    this.initSelect()
  },
  methods: {
    // 默认初始化赋值
    initSelect () {
      // 判断当前是报关单/备案清单/二次转关赋值
      if (this.initTransfer.funFlag === 'declaration' || this.initTransfer.funFlag === 'recordList') {
        this.initTransfer.transDcForm.transFlag = '1'
        this.selectObj = {
          obj: 'transType',
          params: 'TRANS_TYPE'
        }
        this.checkParamsList('1', 'init')
      } else if (this.initTransfer.funFlag === 'secondDec') {
        this.initTransfer.transDcForm.transFlag = 'AA'
        this.selectObj = {
          obj: 'transType',
          params: 'TRANS_TYPE'
        }
        this.checkParamsList('AA', 'init')
      }
      this.initTransfer.transDcForm.esealFlag = 'N' // 是否启用电子关锁赋值
      this.selectObj = {
        obj: 'esealFlagList',
        params: 'ESEAL_FLAG'
      }
      this.checkParamsList('N', 'init')
      this.initTransfer.transDcForm.transType = '0' // 转关单申报类型赋值
      this.selectObj = {
        obj: 'transTypeList',
        params: 'TRANS_TYPE_LIST'
      }
      this.checkParamsList('0', 'init')
      this.initTransfer.transDcForm.validDate = util.dateFormat(new Date(), 'yyyyMMdd') // 预计抵运日期赋值
      let reg = /(^((5[1,2,3,7])|(6[0,7,8]))\d*$)|^5000$/
      if (reg.test(this.initTransfer.customMaster)) {
        this.isGdCustom = true
      } else {
        this.isGdCustom = false
      }
    },
    // 打开回执组件
    openReturnCompent () {
    },
    // 申报单打印
    checkPrint () {
    },
    // 核对单打印
    decPrint () {
    },
    // 验放单打印
    processPrint () {
    },
    // 导出
    exportTrans () {
    },
    // 新增集装箱信息
    refreshContaInfo () {
      this.initTransfer.contaInfoForm = {
        contSeqNo: '', // 集装箱序号
        containerNo: '', // 集装箱号
        sealNo: '', // 关锁号
        sealQty: '', // 关锁个数
        transWeight: '', // 运输工具实际重量(Kg)
        containerMdCode: '', // 规格代码
        inbordTransName: '' // 境内运输工具名称
      }
    },
    // 保存集装箱信息
    saveContaInfo () {
      this.$refs['contaInfoForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        if (util.isEmpty(this.initTransfer.contaInfoForm.contSeqNo)) {
          let inbordTransName = this.initTransfer.contaInfoForm.inbordTransName
          if (!util.isEmpty(inbordTransName) && this.initTransfer.contaInfoForm.containerMdCode === 'N') {
            this.checkContainer(inbordTransName, 10)
          }
          let flag = true
          this.initTransfer.contaInfoList.forEach(v => {
            if (this.initTransfer.contaInfoForm.containerNo.toString() === v.containerNo.toString()) {
              this.messageTips('集装箱号已存在！')
              flag = false
            }
          })
          if (!flag) return
          // 校验规格型号为非集装箱,集装箱号返填
          this.initTransfer.contaInfoForm.contSeqNo = this.initTransfer.contaInfoList.length + 1
          this.initTransfer.contaInfoList.push(util.simpleClone(this.initTransfer.contaInfoForm))
        } else {
          // 校验规格型号为非集装箱,集装箱号返填
          let inbordTransName = this.initTransfer.contaInfoForm.inbordTransName
          if (!util.isEmpty(inbordTransName) && this.initTransfer.contaInfoForm.containerMdCode === 'N') {
            this.checkContainer(inbordTransName, 10)
          }
          for (let v in this.initTransfer.contaInfoList) {
            if (this.initTransfer.contaInfoForm.contSeqNo === this.initTransfer.contaInfoList[v].contSeqNo) {
              continue
            }
            if (this.initTransfer.contaInfoForm.containerNo.toString() === this.initTransfer.contaInfoList[v].containerNo.toString()) {
              this.messageTips('集装箱号已存在！')
              return false
            }
          }
          this.initTransfer.contaInfoList.forEach((e, i) => {
            if (e.contSeqNo === this.initTransfer.contaInfoForm.contSeqNo) {
              this.initTransfer.contaInfoList.splice(i, 1, this.initTransfer.contaInfoForm)
            }
          })
        }
        this.computedConta()
        this.refreshContaInfo()
      })
    },
    // 校验规格型号为非集装箱
    checkContainer (str, maxlen) {
      let len = str.length
      // utf-8字节长度
      let realLength = 0
      let charCode
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128 && charCode !== 10) {
          realLength += 1
        } else {
          // 如果是中文则长度加2
          realLength += 2
        }
        if (realLength > maxlen) {
          this.initTransfer.contaInfoForm.inbordTransName = str.substr(0, i)
          this.initTransfer.contaInfoForm.containerNo = '#' + this.initTransfer.contaInfoForm.inbordTransName.substring(0, 10)
          return
        } else {
          this.initTransfer.contaInfoForm.containerNo = '#' + this.initTransfer.contaInfoForm.inbordTransName
        }
      }
    },
    // 计算 集装箱数
    computedConta () {
      let list = this.initTransfer.contaInfoList
      let num = 0
      if (list.length !== 0) {
        for (let i in list) {
          if (list[i].containerMdCode !== 'N' && !util.isEmpty(list[i].containerMdCode)) {
            num++
          }
        }
      }
      if (num > 0) {
        this.initTransfer.billInfoForm.contaCount = num
      } else {
        this.initTransfer.billInfoForm.contaCount = ''
      }
    },
    // 删除集装箱信息
    delContaInfo () {
      let delData = this.selectConList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.initTransfer.contaInfoList) {
              if (delData[index].contSeqNo.toString() === this.initTransfer.contaInfoList[item].contSeqNo.toString()) {
                this.initTransfer.contaInfoList.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.selectConList = []
          // 重新排序
          for (let i in this.initTransfer.contaInfoList) {
            this.initTransfer.contaInfoList[i].contSeqNo = parseInt(i) + 1
          }
          // 重新 初始化 form表单
          this.refreshContaInfo()
          this.computedConta()
        }).catch(() => {
        })
      }
    },
    // 集装箱信息 导入
    importContaInfo () {
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    contaInfoCheckChange (selection, row) {
    },
    // 当选择项发生变化时会触发该事件--集装箱
    contaInfoChange (value) {
      this.selectConList = util.simpleClone(value)
    },
    // 当某一行被点击时会触发该事件
    rowClickContaInfo (row, column, event) {
      this.initTransfer.contaInfoForm = util.simpleClone(row)
      if (!util.isEmpty(row.containerMdCode)) {
        this.checkParamsList(row.containerMdCode, 'init')
      }
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    goodsInfoCheckChange (selection, row) {
    },
    // 当选择项发生变化时会触发该事件
    goodsInfoChange (value) {
    },
    // 当某一行被点击时会触发该事件
    rowClickGoodsInfo (row, column, event) {
    },
    // 保存集装箱与商品关系
    saveContaGoods () {
      this.$refs['contaGoodsForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        if (util.isEmpty(this.initTransfer.contaGoodsForm.gNo)) {
          this.messageTips('商品序号不能为空！')
          return false
        }
        if (util.isEmpty(this.initTransfer.contaGoodsForm.contSeqNo)) {
          this.messageTips('集装箱序号不能为空！')
          return false
        }
        // 校验商品序号是否存在
        if (this.goodsInfoList.length !== 0) {
          if ((this.initTransfer.contaGoodsForm.gNo - 0) === 0 || this.initTransfer.contaGoodsForm.gNo > this.goodsInfoList.length) {
            this.messageTips('商品序号无效！')
            return false
          }
        } else {
          this.messageTips('商品序号无效！')
          return false
        }
        // 校验集装箱号是否存在
        if (this.initTransfer.contaInfoList.length !== 0) {
          if ((this.initTransfer.contaGoodsForm.contSeqNo - 0) === 0 || this.initTransfer.contaGoodsForm.contSeqNo > this.initTransfer.contaInfoList.length) {
            this.messageTips('集装箱序号无效！')
            return false
          }
        } else {
          this.messageTips('集装箱序号无效！')
          return false
        }
        if (this.initTransfer.contaInfoList.length !== 0) {
          this.initTransfer.contaInfoList.forEach(item => {
            if (this.initTransfer.contaGoodsForm.contSeqNo.toString() === item.contSeqNo.toString()) {
              this.initTransfer.contaGoodsForm.containerNo = item.containerNo
            }
          })
        }
        if (util.isEmpty(this.initTransfer.contaGoodsForm.relId)) {
          // 校验集装箱和商品关系是否重复
          if (this.initTransfer.contaGoodsList.length !== 0) {
            for (let i in this.initTransfer.contaGoodsList) {
              if (this.initTransfer.contaGoodsForm.gNo.toString() === this.initTransfer.contaGoodsList[i].gNo.toString() && this.initTransfer.contaGoodsForm.contSeqNo.toString() === this.initTransfer.contaGoodsList[i].contSeqNo.toString()) {
                this.messageTips('商品序号和集装箱号已存在！')
                return false
              }
            }
          }
          this.initTransfer.contaGoodsForm.relId = this.initTransfer.contaGoodsList.length + 1
          this.initTransfer.contaGoodsList.push(this.initTransfer.contaGoodsForm)
        } else {
          // 校验集装箱和商品关系是否重复
          if (this.initTransfer.contaGoodsList.length !== 0) {
            for (let i in this.initTransfer.contaGoodsList) {
              if (this.initTransfer.contaGoodsForm.relId === this.initTransfer.contaGoodsList[i].relId) {
                continue
              }
              if (this.initTransfer.contaGoodsForm.gNo.toString() === this.initTransfer.contaGoodsList[i].gNo.toString() && this.initTransfer.contaGoodsForm.contSeqNo.toString() === this.initTransfer.contaGoodsList[i].contSeqNo.toString()) {
                this.messageTips('商品序号和集装箱号已存在！')
                return false
              }
            }
          }
          this.initTransfer.contaGoodsList.forEach((e, i) => {
            if (this.initTransfer.contaGoodsForm.relId === e.relId) {
              this.initTransfer.contaGoodsList.splice(i, 1, this.initTransfer.contaGoodsForm)
            }
          })
        }
        this.freshContaGoods()
      })
    },
    // 删除集装箱与商品关系
    delContaGoods () {
      let delData = this.selectConGoodList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.initTransfer.contaGoodsList) {
              if (delData[index].gNo.toString() === this.initTransfer.contaGoodsList[item].gNo.toString() && delData[index].contSeqNo.toString() === this.initTransfer.contaGoodsList[item].contSeqNo.toString()) {
                this.initTransfer.contaGoodsList.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.selectConGoodList = []
          // 重新 初始化 form表单
          this.freshContaGoods()
        }).catch(() => {
        })
      }
    },
    // 集装箱与商品关系 新增(刷新)
    freshContaGoods () {
      this.initTransfer.contaGoodsForm = {
        gNo: '', // 商品序号
        contSeqNo: '', // 集装箱序号
        containerNo: '', // 集装箱号
        contaGoodsCount: '', // 商品件数
        contaGoodsWeight: '' // 商品毛重(Kg)
      }
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    contaGoodsCheckChange (selection, row) {
    },
    // 当选择项发生变化时会触发该事件--集装箱和商品
    contaGoodsChange (value) {
      this.selectConGoodList = util.simpleClone(value)
    },
    // 当某一行被点击时会触发该事件
    rowClickContaGoods (row, column, event) {
      this.initTransfer.contaGoodsForm = util.simpleClone(row)
    },
    // 获取详情 下拉赋值
    detailSelect (arr, form) {
      for (let key in arr) {
        let selectValue = form[key]
        this.selectObj = arr[key]
        if (util.isEmpty(selectValue)) {
          continue
        } else {
          this.checkParamsList(selectValue, 'init')
        }
      }
    },
    /**
   * 控制输入中英文字符长度，一个中文当做2个长度来控制
   * @param inpt
   * @param maxlen
   */
    checklen (type, ipnut, maxlen) {
      let str
      switch (type) {
        case 'transDcForm':
          str = this.initTransfer.transDcForm[ipnut]
          break
        case 'billInfoForm':
          str = this.initTransfer.billInfoForm[ipnut]
          break
        case 'contaInfoForm':
          str = this.initTransfer.contaInfoForm[ipnut]
          break
        case 'contaGoodsForm':
          str = this.initTransfer.contaGoodsForm[ipnut]
          break
        default:
          str = ''
      }
      let len = str.length
      // utf-8字节长度
      let realLength = 0
      let charCode
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128 && charCode !== 10) {
          realLength += 1
        } else {
          // 如果是中文则长度加2
          realLength += 2
        }
        if (realLength > maxlen) {
          switch (type) {
            case 'transDcForm':
              this.initTransfer.transDcForm[ipnut] = str.substr(0, i)
              break
            case 'billInfoForm':
              this.initTransfer.billInfoForm[ipnut] = str.substr(0, i)
              break
            case 'contaInfoForm':
              this.initTransfer.contaInfoForm[ipnut] = str.substr(0, i)
              break
            case 'contaGoodsForm':
              this.initTransfer.contaGoodsForm[ipnut] = str.substr(0, i)
              break
            default:
              str = ''
          }
          return
        }
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
      // 下下一个元素
      // let secondNext = newFocusable[parseInt(index) + 2]
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
            next.focus()
            next.select()
          }
        } else {
          if (e.target.id === 'contractorName') { // 光标向运输工具编号
            this.$refs['trafNo'].focus()
          }
        }
      }
    },
    // 判断缓存中是否有数据
    getCommonParam () {
      let par = this.tableNameList.tableNames
      this.$post({
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {

        },
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {

        }
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      // 1. 提示填写信息
      if (value !== '') {
        let para = this.tipsMessage[value]
        if (util.isEmpty(para)) {
          this.tipsNoteShow = false
          this.tipsNote = ''
        } else {
          this.tipsNoteShow = true
          this.tipsNote = para
        }
      }
      // 如果时下拉框 则设置当前下拉框的默认参数
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      this[selecType] = []
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = []
      if (this.selectObj.params === 'SAAS_CONTAINER_MODEL') {
        list = [...JSON.parse(window.localStorage.getItem(this.selectObj.params)), {codeField: 'N', elseField: '', extendField: 'null', nameField: '非集装箱', otherField: 'N'}]
      } else {
        list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      }
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          this[this.selectObj.obj] = list.slice(0, 10)
        })
      } else {
        let filterList = []
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        if (type === 'init') {
          this[this.selectObj.obj] = filterList.slice(0, 10)
        } else if (type === 'select') {
          this.$nextTick(() => {
            this[this.selectObj.obj] = filterList.slice(0, 10)
          })
        }
      }
    },
    // 电子锁变化
    esealChange (val) {
      this.initTransfer.contaInfoForm.sealQty = ''
    },
    // 校验表体
    headCheckVal (rule, value, callback) {
      let name = rule.field
      if (util.isEmpty(value)) {
        value = ''
      }
      let reg = new RegExp(this.ruleRegx[name])
      if (!util.isEmpty(value)) {
        if (!reg.test(value)) {
          setTimeout(() => {
            this.$refs['transDcForm'].clearValidate([name])
          }, 2000)
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 校验提运单
    billCheckVal (rule, value, callback) {
      let name = rule.field
      if (util.isEmpty(value)) {
        value = ''
      }
      let reg = new RegExp(this.ruleRegx[name])
      if (!util.isEmpty(value)) {
        if (!reg.test(value)) {
          setTimeout(() => {
            this.$refs['billInfoForm'].clearValidate([name])
          }, 2000)
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 校验集装箱信息
    contaCheckVal (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      if (name === 'sealNo') {
        if (this.initTransfer.transDcForm.esealFlag === 'Y') {
          if (util.isEmpty(value)) {
            setTimeout(() => {
              this.$refs['contaInfoForm'].clearValidate([name])
            }, 2000)
            callback(new Error('关锁号不能为空'))
          } else {
            let reg = new RegExp(this.ruleRegx[name])
            if (!reg.test(value)) {
              setTimeout(() => {
                this.$refs['contaInfoForm'].clearValidate([name])
              }, 2000)
              callback(new Error('请输入数字'))
            } else {
              callback()
            }
          }
        } else {
          let reg = new RegExp(this.ruleRegx[name])
          if (!util.isEmpty(value)) {
            if (!reg.test(value)) {
              setTimeout(() => {
                this.$refs['contaInfoForm'].clearValidate([name])
              }, 2000)
              callback(new Error('请输入数字'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      } else {
        if (name === 'containerNo') {
          if (this.initTransfer.contaInfoForm.containerMdCode === 'N' && !util.isEmpty(this.initTransfer.contaInfoForm.inbordTransName)) {
            callback()
          } else {
            if (util.isEmpty(value)) {
              setTimeout(() => {
                this.$refs['contaInfoForm'].clearValidate([name])
              }, 2000)
              callback(new Error('集装箱号不能为空'))
            } else {
              const containerNo = /^[A-Z0-9]+$/
              if (!containerNo.test(value)) {
                setTimeout(() => {
                  this.$refs['contaInfoForm'].clearValidate([name])
                }, 2000)
                callback(new Error('集装箱号前4位为大写字母，后7位为数字'))
              } else {
                callback()
              }
            }
          }
        } else {
          let reg = new RegExp(this.ruleRegx[name])
          if (!util.isEmpty(value)) {
            if (!reg.test(value)) {
              setTimeout(() => {
                this.$refs['contaInfoForm'].clearValidate([name])
              }, 2000)
              callback(new Error(rule.message))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    },
    goodCheckVal (rule, value, callback) {
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!util.isEmpty(value) && !reg.test(value)) {
        this.messageTips(rule.message)
        return false
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped lang="less">
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
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
.el-autocomplete-suggestion li {
  padding: 0 15px;
  margin: 0;
  line-height: 22px;
  cursor: pointer;
  color: #606266;
  font-size: 12px;
  list-style: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 22px;
  border: #c0c0c0 solid 1px;
}
.el-autocomplete-suggestion__list li:hover {
  background: #dbed8a;
  font-weight: bold;
}
.trans-panel-title{
  font-weight: bold;
  color: #63a4ec;
  font-size: 14px;
  padding-left: 10px;
}
.pd-l-5{
  padding-left: 5px;
}
.pd-r-5{
  padding-right: 5px;
}
.pd-l-3{
  padding-left: 3px;
}
.pd-r-3{
  padding-right: 3px;
}
.vertical-mid{
  vertical-align: middle;
}
.bottomDiv{
  position: fixed;
  width: 100%;
  z-index: 1000;
  min-width: 954px;
  background: #e8ebed;
  margin: 0 20px;
  bottom: 0;
  height: 19px;
  color: red;
  font-size: 12px;
}
</style>
