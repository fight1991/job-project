<template>
  <!-- 查看回执 组件 -->
  <section>
    <el-dialog :modal-append-to-body='false' :title="typeValue=='view'?'商品资料详情查看':'商品资料详情编辑'"
     :visible.sync="dialogShow"
      width="1100px"
      class="order-dialog commodityDetail-dialog"
      @open="openDialog"
      @close="$emit('update:detailVisible', false)"
      :close-on-click-modal="false">
      <div class='sys-jiner-class'>
        <el-container>
            <!---表头开始  -->
          <div class='dec-div'>
            <el-form ref="baseInfo" :model="baseInfo" :rules="baseRule" class="order-label" label-width="100px" size="mini" @keyup.enter.native="switchFoucsByEnter">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="进出口标志" :class="{ 'require-color': controller.requireColor }">
                    <el-select size="mini" filterable v-model="baseInfo.iEFlag" class="select-Color" :disabled="isView">
                      <el-option label="进口" value="I"></el-option>
                      <el-option label="出口" value="E"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="境内收发货人">
                    <el-autocomplete
                      :maxlength="70"
                      placeholder="企业名称,输入两位字符开始匹配"
                      size='mini'
                      v-model="baseInfo.tradeName"
                      :fetch-suggestions="querySearch"
                      :trigger-on-focus="false"
                      :highlight-first-item='true'
                        :readOnly="isView">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="baseInfo.iEFlag == 'I' ? '消费使用单位':'生产销售单位'">
                    <el-autocomplete
                      :maxlength="70"
                      placeholder="企业名称,输入两位字符开始匹配"
                      size='mini'
                      v-model="baseInfo.ownerName"
                      :fetch-suggestions="querySearch"
                      :trigger-on-focus="false"
                      :highlight-first-item='true'
                        :readOnly="isView">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="商品编码">
                    <el-input v-model="baseInfo.codeTs" :readOnly="isView"  enter = 'no' @input="codeTsChangeF" @keyup.enter.native="openProductList()"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="检验检疫名称" style="border-right: 1px solid #B7B7B7 !important;">
                    <el-col :span="20" >
                      <el-input v-model="baseInfo.ciqName" readOnly></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button class="btn-pop"
                      style="border-radius:0px;margin-left:0px;width:100%;height:100%;line-height:inherit;background-color:#287fca"
                      icon="fa fa-ellipsis-h" @click="openEncodeTableContent"></el-button>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="商品名称">
                    <el-input v-model="baseInfo.gName" :readOnly="isView" maxlength="32"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="规格型号">
                    <el-input v-model="baseInfo.gModel" readOnly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <el-form-item label-width="0">
                    <el-button title="重新归类" icon="fa fa-ellipsis-h" @click="openElement"  class="btn-pop"
                      style="border-radius:0px;margin-left:0px;width:98%;height:100%;line-height:inherit;background-color:#287fca"></el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="成交计量单位" :class="{ 'require-color': controller.requireColor }">
                    <el-select size="mini" filterable v-model="baseInfo.gUnit" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_UNIT']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="单价">
                    <el-input v-model="baseInfo.declPrice" maxlength="19" :readOnly="isView"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="币制">
                    <el-select size="mini" filterable v-model="baseInfo.tradeCurr" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_CURR']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <template slot="label"><div title="法定第一计量单位">{{'法定第一计量单位' | strNum(7)}}</div></template>
                    <el-select size="mini" filterable v-model="baseInfo.unit1" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_UNIT']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item>
                    <template slot="label"><div title="最终目的国（地区）">{{'最终目的国（地区）' | strNum(7)}}</div></template>
                    <el-select size="mini" filterable v-model="baseInfo.destinationCountry" class="select-Color" :disabled="isView" placeholder="境外收发货人代码">
                      <el-option
                        v-for="item in paramsOptions['SAAS_COUNTRY']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                  <template slot="label"><div title="法定第二计量单位">{{'法定第二计量单位' | strNum(7)}}</div></template>
                    <el-select size="mini" filterable v-model="baseInfo.unit2" class="select-Color" disabled>
                      <el-option
                        v-for="item in paramsOptions['SAAS_UNIT']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="原产国（地区）">
                    <el-select size="mini" filterable v-model="baseInfo.originCountry" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_COUNTRY']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="原产地区">
                    <el-select size="mini" filterable v-model="baseInfo.origPlaceCode" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_CIQ_ORIGIN_PLACE']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item :label="baseInfo.iEFlag == 'I' ? '境内目的地' :'境内货源地'">
                    <el-select size="mini" filterable v-model="baseInfo.districtCode" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_DISTRICT_REL']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-select size="mini" filterable v-model="baseInfo.destCode" class="select-Color" :disabled="isView" :placeholder="baseInfo.iEFlag == 'I' ?  '目的地代码' : '境内货源地代码'">
                      <el-option
                        v-for="item in paramsOptions['SAAS_CIQ_CITY_CN']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="征免方式">
                    <el-select size="mini" filterable v-model="baseInfo.dutyMode" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_LEVYMODE']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-button type="text" title="展开" style="float:right;margin-right:10px;color:#d4d0db;" @click="expand"><i class="fa fa-angle-double-down f-18"></i></el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isExpand">
                <el-col :span="11">
                  <el-form-item label="检验检疫货物规格" :class="{ 'require-color': controller.requireColor }">
                  <template slot="label"><div title="检验检疫货物规格">{{'检验检疫货物规格' | strNum(7)}}</div></template>
                    <el-input v-model="baseInfo.showGoodsSpec" readOnly maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <el-form-item label-width="0">
                    <el-button  class="btn-pop"
                    style="border-radius:0px;margin-left:0px;width:98%;height:100%;line-height:inherit;background-color:#287fca;border-right:#d8d8d8"
                    icon="fa fa-ellipsis-h" @click="openGoodsSpecContent"></el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-button style="width:100%;background-color:#287fca;color: #ffffff;float:right;height:24px;border-radius:0px;border-top:none;border-bottom:none;"  @click="openfilingInfoContent">产品资质</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="商品英文名称" :class="{ 'require-color': controller.requireColor }"  prop="packNo">
                    <el-input v-model="baseInfo.declGoodsEname" :readOnly="isView" maxlength="9"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isExpand">
                <el-col :span="11">
                  <el-form-item label="货物属性" :class="{ 'require-color': controller.requireColor }"  prop="packNo">
                    <el-input v-model="showGoodsAttrValue"   readOnly maxlength="9"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <el-form-item label-width="0" style="border-right: 1px solid #B7B7B7 !important;">
                    <el-button  class="btn-pop"
                    style="border-radius:0px;margin-left:0px;width:100%;height:100%;line-height:inherit;background-color:#287fca"
                    icon="fa fa-ellipsis-h"
                    @click="openGoodAtrrContent"></el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="用途" prop="grossWt">
                    <el-select size="mini" filterable v-model="baseInfo.purpose" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in paramsOptions['SAAS_USER_TO']"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="非危险化学品" prop="netWt">
                    <el-select size="mini" filterable v-model="baseInfo.noDangFlag" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in commonPara"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isExpand">
                <el-col :span="6">
                  <el-form-item label="UN编码" :class="{ 'require-color': controller.requireColor }"  prop="customMaster">
                    <el-input v-model="baseInfo.unCode" :readOnly="isView"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="危险货物名称">
                    <el-input v-model="baseInfo.dangName" :readOnly="isView"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="危包类别" prop="billingCycle">
                    <el-select size="mini" filterable v-model="baseInfo.dangPackType" class="select-Color" :disabled="isView">
                      <el-option
                        v-for="item in dangerType"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="危包规格" prop="billingCycle">
                    <el-input v-model="baseInfo.dangPackSpec" :readOnly="isView" maxlength="3" enter = 'no' @keyup.enter.native="addFun"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-container>
      </div>
      <el-row slot="footer" class="sys-dialog-footer query-btn mg-t-20" v-show="!isView" type="flex" justify="center">
        <el-button type="primary" size="mini" @click="addFun">确定</el-button>
        <el-button size="mini" class="mg-l-10" @click="$emit('update:detailVisible', false)">取消</el-button>
      </el-row>
    </el-dialog>
    <!-- 弹出框 检验检疫编码列表 开始 -->
    <encode-info :visible.sync="encodeTableVisible" :isView="isView" :encodeTableList.sync="encodeTableList" :ciqCo="baseInfo.ciqCode" @back:encode="closeEncodeTable"></encode-info>
    <!-- 弹出框 检验检疫货物规格 结束-->
    <!-- 弹出框 商品列表 开始 -->
    <el-dialog :modal-append-to-body='false' title="商品列表"
    :visible.sync="productListVisible"  width="640px"
    :modal='false' class='sys-jiner-class'
    :close-on-click-modal="false">
      <el-table ref="productListTable" :data="productList" highlight-current-row border size='mini' max-height="300" style="width: 100%">
        <span>从商品归类表中查询到了下列商品，请选择：</span>
        <el-table-column  min-width="50"  >
          <template slot-scope="scope">
              <el-radio v-model="productListRadio"  @keyup.enter.native="saveProductList" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column  property="codeTs" label="商品编号" min-width="100"></el-table-column>
        <el-table-column  property="gName" label="商品名称" min-width="200"></el-table-column>
        <el-table-column  property="noteS" label="备注" min-width="100"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn Btn-font-14" @click="saveProductList" :disabled="controller.isDisabled">确定</el-button>
        <el-button class="dialog-btn Btn-font-14" @click="closeProductList">取消</el-button>
      </span>
    </el-dialog>
    <!-- 弹出框 商品列表 结束 -->
    <!-- 弹出框 商品规范申报-商品申报要素 开始 -->
    <el-dialog :modal-append-to-body='false' title="商品规范申报-商品申报要素"
      :visible.sync="elementVisible"
      width="640px" :modal='false'
      class='sys-dec-class'
      v-loading="$store.state.loading"
      :close-on-click-modal="false">
      <decelement-view :datas="decElementPara" @submitdatas="backDecListSpace" @closedecele="cancleElement" v-if="elementVisible"></decelement-view>
    </el-dialog>
    <!-- 弹出框 商品规范申报-商品申报要素 结束 -->
    <!-- 检验检疫货物规格 弹出框 开始-->
    <goods-spec :visible.sync="goodsSpecVisible" :isView="isView" :infoData="goodsSpecData" :iEFlag="baseInfo.iEFlag" @back:goodsSpec="backGoodsSpec"></goods-spec>
    <!--检验检疫货物规格 弹出框 结束-->
    <!-- 弹出框 产品许可证/审批/备案信息  开始 -->
    <filing-info :visible.sync="filingInfoVisible" :isView="isView" :licTypeList="LicTypeList" :paramsOptions="paramsOptions" :baseInfo.sync="baseInfo" :controller="controller" @back:filingInfo="backFilingInfo" @delete:filingInfo="deleteDecGoodsLimits"></filing-info>
    <!-- 弹出框 产品许可证/审批/备案信息 结束 -->
    <!-- 弹出框 货物属性 开始 -->
    <el-dialog :modal-append-to-body='false'
    title="货物属性"
    :visible.sync="goodsAttrVisible"
     width="640px" :modal='false'
     class='commodity-checkbox-style'
     :close-on-click-modal="false">
      <el-row :gutter="30" style='border: 0px;' class="sys-jiner-class">
        <el-checkbox-group v-model="goodsAttrCollection" @change='goodsAttrChange'>
          <el-col :span="6" v-for="(item,index) in saasGoodsAttr" :key="index" class="m-b-10">
            <div style="width:100%;height:100%">
              <el-checkbox-button :label="item.codeField + '-' + item.nameField" border style="width:100%;height:100%"></el-checkbox-button>
            </div>
          </el-col>
        </el-checkbox-group>
      </el-row>
      <span slot="footer" class="sys-dialog-footer query-btn">
        <el-button type="primary" size="mini" @click="saveGoodsAttr" :disabled="isView">确定</el-button>
        <el-button size="mini" @click="closeGoodsAttr">取消</el-button>
      </span>
    </el-dialog>
    <!-- 弹出框 货物属性 结束 -->
  </section>
</template>

<script>
import util from '@/common/util'
import {carModelList, commonParam, dangerType} from './util/status'
import decelementView from '../decPage/decList/components/decelement.vue'
import encodeInfo from './components/encode.vue'
import goodsSpec from './components/goodsSpec.vue'
import filingInfo from './components/filingInfo.vue'
import decUtil from '../decPage/common/decUtil'
export default {
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    typeValue: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    }
  },
  components: {
    decelementView, encodeInfo, goodsSpec, filingInfo
  },
  watch: {
    'detailVisible' (newval) {
      this.dialogShow = newval
    }
  },
  data () {
    return {
      dialogShow: false,
      isView: false,
      baseRule: {},
      decListPid: '', // 接单编号
      labelPosition: 'right',
      controller: {
        requiredColor: true
      },
      showGoodsAttrValue: '',
      dataForm: {}, // 图片信息
      carVisible: false,
      wrapVisible: false,
      activeNameHead: 'baseInfo',
      total: '', // 数据总条数
      receiptList: [], // 回执信息
      checkedReceiptList: [], // 被选中的回执信息
      baseInfo: this.initForm(),
      isEdit: true,
      fileList: [],
      carFileList: [],
      fileorderList: [],
      carList: [],
      carForm: {}, // 派车信息
      wrapList: [], // 派车信息
      exportForm: {
        remarks: ''
      }, // 上传信息
      exportVisible: false, // 上传信息
      paramsOptions: {}, // 字典表
      selectList: [], // 包装种类勾选数据
      docList: [],
      idList: [],
      carSelectList: [],
      idSelectList: [],
      isExpand: true, // 折叠标志
      encodeTableVisible: false, // 检验检疫编码列表 显示隐藏控制字段
      encodeTableList: [], // 检验检疫编码列表 数据源
      checkedEncodeTableList: [], // 检验检疫编码列表 被选中数据
      codeTsChange: false, // 判断 商品编号值是否发生改变
      productList: [], // 商品列表 参数表
      productListVisible: false, // 商品列表 显示隐藏控制字段
      productListRadio: 0, // 选中的商品
      elementVisible: false, // 编辑申报要素 显示控制
      checkedgoods: {}, // 记录 当即选择的商品 以便编辑申报要
      decElementPara: {
        checkedgoods: '', // 加载数据
        opeType: '', // 操作类型
        gModel: '', // 规格型号
        iEFlag: '', // 进出口标志
        backRule: '', // 反填规则
        gName: '',
        gtin: '' // 存放Gtin的地方
      },
      goodsSpecVisible: false, // 检验检疫货物规格 显示隐藏控制字段
      filingInfoVisible: false, // 许可证备案信息 显示隐藏控制字段
      goodsSpecData: { // 检验检疫货物规格 字段
        stuffNote: '', // 成分/原料/组分
        prodValidDt: '', // 产品有效期
        prodQgp: '', // 产品保质期(天)
        engManentCnm: '', // 境外生产企业
        goodsSpec: '', // 货物规格
        goodsModel: '', // 货物型号
        goodsBrand: '', // 货物品牌
        produceDate: '', // 生产日期
        prodBatchNo: '', // 生产批次
        mnufctrRegno: '' // 生产单位代码
      },
      goodsAttrVisible: false, // 货物属性 显示隐藏控制字段
      goodsAttrCollection: [], // 货物属性被选择的集合
      saasGoodsAttr: [],
      LicTypeList: [],
      iLicType: [],
      eLicType: [],
      carModelList: carModelList,
      commonPara: commonParam,
      dangerType: dangerType
    }
  },
  created () {},
  mounted () {
    this.getCommonParams()
    this.wrapList = util.isEmpty(window.localStorage.getItem('WRAPLIST')) ? [] : JSON.parse(window.localStorage.getItem('WRAPLIST'))
  },
  methods: {
    openDialog () {
      this.decListPid = this.id
      this.commodityDetail()
      if (this.typeValue === 'view') {
        this.isView = true
      } else {
        this.isView = false
      }
    },
    initForm () {
      return {
        iEFlag: 'I',
        decListPid: '',
        tradeCoScc: '',
        tradeCode: '',
        goodsAttr: '',
        showGoodsSpec: '',
        ownerCodeScc: '',
        ownerCode: '',
        decGoodsLimits: [],
        goodsAttrList: [],
        stuffNote: '', // 成分/原料/组分
        prodValidDt: '', // 产品有效期
        prodQgp: '', // 产品保质期(天)
        engManentCnm: '', // 境外生产企业
        goodsSpec: '', // 货物规格
        goodsModel: '', // 货物型号
        goodsBrand: '', // 货物品牌
        produceDate: '', // 生产日期
        prodBatchNo: '', // 生产批次
        mnufctrRegNo: '', // 生产单位代码
        ciqCode: ''
      }
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
          let ref
          if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
            ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
            this.$refs[ref].blur()
          } else {
            if (!util.isEmpty(e.target.attributes.dataRef)) {
              ref = e.target.attributes.dataRef.nodeValue
            }
          }
          if (ref === 'gName') {
            this.$refs['codeTs'].$children[0].focus()
            this.$refs['codeTs'].$children[0].select()
          } else {
            next.focus()
            next.select()
          }
        }
      }
    },
    querySearch (queryString, cb) {
      if (queryString.length < 2) {
        let back = []
        cb(back)
        return
      }
      let param = {
        'corpName': queryString,
        'returnProps': ['corpName']
      }
      this.$post({
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: param,
        success: (res) => {
          if (res.success) {
            let json = JSON.stringify(res.result).replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          }
        }
      })
    },
    // 商品资料详情
    commodityDetail () {
      this.$post({
        url: 'API@/dec-common/dec/decListHis/getDecHisDetail',
        data: {decListPid: this.decListPid},
        success: (res) => {
          this.baseInfo = res.result
          for (let i in this.baseInfo.goodsAttrList) {
            if (i === '0') {
              this.showGoodsAttrValue = this.baseInfo.goodsAttrList[i].goodsAttrValue
            } else {
              this.showGoodsAttrValue = this.showGoodsAttrValue + ',' + this.baseInfo.goodsAttrList[i].goodsAttrValue
            }
          }
          this.goodsSpecData.stuffNote = res.result.stuffNote
          this.goodsSpecData.prodValidDt = res.result.prodValidDt
          this.goodsSpecData.prodQgp = res.result.prodQgp
          this.goodsSpecData.engManentCnm = res.result.engManentCnm
          this.goodsSpecData.goodsSpec = res.result.goodsSpec
          this.goodsSpecData.goodsModel = res.result.goodsModel
          this.goodsSpecData.goodsBrand = res.result.goodsBrand
          if (!util.isEmpty(res.result.produceDate)) {
            this.goodsSpecData.produceDate = res.result.produceDate.split(';')
          } else {
            this.goodsSpecData.produceDate = ''
          }
          this.goodsSpecData.prodBatchNo = res.result.prodBatchNo
          this.goodsSpecData.mnufctrRegno = res.result.mnufctrRegno
          // 规格型号
          let param = []
          for (let index in this.goodsSpecData) {
            if (util.isEmpty(this.goodsSpecData[index]) === false) {
              param.push(this.goodsSpecData[index])
            }
          }
          this.baseInfo.showGoodsSpec = param.join(',')
        }
      })
    },
    // 获取公共字典list
    getCommonParams () {
      let par = [
        'SAAS_UNIT', // 单位
        'SAAS_LEVYMODE', // 征免方式
        'SAAS_DISTRICT_REL', // 境内目的地
        'SAAS_COUNTRY', // 国家
        'SAAS_CIQ_ORIGIN_PLACE', // 地区
        'SAAS_CIQ_CITY_CN', // 地区
        'SAAS_LIC_TYPE', // 许可证类别
        'SAAS_GOODS_ATTR', // 商品属性
        'SAAS_USER_TO', // 用途
        'SAAS_CURR' // 币制
      ]
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getParam',
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          this.initSelectParam()
        },
        data: {
          'tableNames': par
        },
        success: (res) => {
          this.initSelectParam()
        }
      })
    },
    initSelectParam () {
      this.saasGoodsAttr = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
      this.paramsOptions = {
        'SAAS_UNIT': JSON.parse(window.localStorage.getItem('SAAS_UNIT')), // 单位
        'SAAS_LEVYMODE': JSON.parse(window.localStorage.getItem('SAAS_LEVYMODE')), // 征免方式
        'SAAS_DISTRICT_REL': JSON.parse(window.localStorage.getItem('SAAS_DISTRICT_REL')), // 境内目的地
        'SAAS_COUNTRY': JSON.parse(window.localStorage.getItem('SAAS_COUNTRY')), // 国家
        'SAAS_CIQ_ORIGIN_PLACE': JSON.parse(window.localStorage.getItem('SAAS_CIQ_ORIGIN_PLACE')), // 地区
        'SAAS_CIQ_CITY_CN': JSON.parse(window.localStorage.getItem('SAAS_CIQ_CITY_CN')), // 地区
        'SAAS_USER_TO': JSON.parse(window.localStorage.getItem('SAAS_USER_TO')), // 用途
        'SAAS_CURR': JSON.parse(window.localStorage.getItem('SAAS_CURR')) // 币制
      }
      this.iLicType = []
      this.eLicType = []
      let saasLicType = JSON.parse(window.localStorage.getItem('SAAS_LIC_TYPE'))
      for (let i in saasLicType) {
        if (saasLicType[i].otherField === 'I') {
          this.iLicType.push(saasLicType[i])
        } else {
          this.eLicType.push(saasLicType[i])
        }
      }
    },
    // 展开/收起
    expand () {
      if (this.isExpand) {
        this.isExpand = false
      } else {
        this.isExpand = true
      }
    },
    // 打开检验检疫编码表
    openEncodeTableContent () {
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getHSDetail',
        data: {
          'codeTs': this.baseInfo.codeTs,
          'iEFlag': this.baseInfo.iEFlag // 进出口标志
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
    // 关闭检验检疫编码表
    closeEncodeTable (params) {
      this.baseInfo.ciqName = params.gNameNote
      this.baseInfo.ciqCode = params.ciqCo
      this.encodeTableVisible = false
    },
    // 打开 产品资质  备案信息 弹出框
    openfilingInfoContent () {
      // 判断 是否能打开弹出框
      if (util.isEmpty(this.baseInfo.codeTs) || util.isEmpty(this.baseInfo.gName)) {
        this.messageTips('请输入商品编码和商品名称', 'error')
      } else {
        if (this.baseInfo.iEFlag === 'I') {
          this.LicTypeList = util.simpleClone(this.iLicType)
        } else {
          this.LicTypeList = util.simpleClone(this.eLicType)
        }
        this.filingInfoVisible = true
      }
    },
    // 商品编号值改变事件
    codeTsChangeF () {
      this.codeTsChange = true
    },
    // 打开 商品编号 弹出框
    openProductList () {
      if (!this.codeTsChange) { // 如果值没有发生变化
        return false
      }
      if (!this.baseInfo.codeTs) {
        return false
      }
      if (this.baseInfo.codeTs.length < 4) {
        this.messageTips('至少输入四位商品编号')
        this.$refs['codeTs'].$children[0].select()
        return false
      }
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          'codeTs': this.baseInfo.codeTs,
          'iEFlag': this.baseInfo.iEFlag // 进出口标志
        },
        success: (res) => {
          this.codeTsChange = false
          this.productList = res.result
          if (!this.productList || this.productList.length === 0) {
            this.messageTips('无此商品编号', 'error')
            this.baseInfo.codeTs = ''
            this.productList = []
          } else {
            this.productListVisible = true
          }
        }
      })
    },
    // 确定所选的商品
    saveProductList () {
      this.checkedgoods = util.simpleClone(this.productList[this.productListRadio])
      this.decElementPara = {
        checkedgoods: this.checkedgoods, // 加载数据
        opeType: this.typeValue === 'view' ? 'look' : 'add', // 操作类型 add 新增  edit 编辑  look 查看
        gModel: '', // 规格型号
        iEFlag: this.baseInfo.iEFlag, // 进出口标志
        gName: this.baseInfo.gName,
        gtin: '' // 存放Gtin的地方
      }
      this.baseInfo.codeTs = this.checkedgoods.codeTs
      if (util.isEmpty(this.baseInfo.gName)) {
        this.baseInfo.gName = this.checkedgoods.gName
      }
      if (util.isEmpty(this.checkedgoods.gUnit)) {
        this.baseInfo.gUnit = this.checkedgoods.unit1
      } else {
        this.baseInfo.gUnit = this.checkedgoods.gUnit
      }
      this.baseInfo.unit1 = this.checkedgoods.unit1
      this.baseInfo.unit2 = this.checkedgoods.unit2
      // this.unit2Change(this.checkedgoods.unit2)
      // 初始化下拉框 TODO
      // 设置 法定第一数量
      if (!util.isEmpty(this.baseInfo.gUnit) && (this.baseInfo.unit1 === this.baseInfo.gUnit)) {
        this.baseInfo.qty1 = this.checkedgoods.gQty
      }
      this.productListVisible = false
      this.elementVisible = true
    },
    // 取消选择 商品
    closeProductList () {
      this.productListVisible = false
      this.baseInfo.codeTs = ''
    },
    // 表体的 规格型号 反填
    backDecListSpace (value) {
      this.baseInfo.gModel = value.specModel
      this.elementVisible = false
    },
    // 取消 表体的规格型号 反填
    cancleElement () {
      this.elementVisible = false
    },
    // 打开检验检疫货物规格 弹出框
    openGoodsSpecContent () {
      this.goodsSpecVisible = true
    },
    backGoodsSpec (params) {
      this.baseInfo.showGoodsSpec = params.showGoodsSpec
      // 赋值到decList
      this.baseInfo.stuffNote = params.goodsSpecForm.stuffNote
      this.baseInfo.prodValidDt = params.goodsSpecForm.prodValidDt
      this.baseInfo.prodQgp = params.goodsSpecForm.prodQgp
      this.baseInfo.engManentCnm = params.goodsSpecForm.engManentCnm
      this.baseInfo.goodsSpec = params.goodsSpecForm.goodsSpec
      this.baseInfo.goodsModel = params.goodsSpecForm.goodsModel
      this.baseInfo.goodsBrand = params.goodsSpecForm.goodsBrand
      if (!util.isEmpty(params.goodsSpecForm.produceDate)) {
        this.baseInfo.produceDate = params.goodsSpecForm.produceDate.join(';')
      } else {
        this.baseInfo.produceDate = ''
      }
      this.baseInfo.prodBatchNo = params.goodsSpecForm.prodBatchNo
      this.baseInfo.mnufctrRegno = params.goodsSpecForm.mnufctrRegno
      this.goodsSpecVisible = false
    },
    backFilingInfo (params) {
      if (params.type === 'add') {
        this.baseInfo.decGoodsLimits.push(util.simpleClone(params.data))
      } else {
        this.baseInfo.decGoodsLimits[params.index] = util.simpleClone(params.data)
        this.baseInfo.decGoodsLimits.push({})
        this.baseInfo.decGoodsLimits.pop()
      }
    },
    deleteDecGoodsLimits (params) {
      for (let index in params) {
        for (let item in this.baseInfo.decGoodsLimits) {
          if (params[index].gNo === this.baseInfo.decGoodsLimits[item].gNo) {
            this.baseInfo.decGoodsLimits.splice(item, 1)
            break
          }
        }
      }
      // 重新排序
      for (let i in this.baseInfo.decGoodsLimits) {
        this.baseInfo.decGoodsLimits[i].gNo = parseInt(i) + 1
      }
    },
    // 打开货物属性弹出框
    openGoodAtrrContent () {
      this.goodsAttrCollection = [] // 先清空以前的数据
      if (this.baseInfo.goodsAttr.length > 0) {
        for (let index in this.baseInfo.goodsAttrList) {
          this.goodsAttrCollection.push(this.baseInfo.goodsAttrList[index].goodsAttr + '-' + this.baseInfo.goodsAttrList[index].goodsAttrValue)
        }
      }
      this.goodsAttrVisible = true
    },
    // 控制 货物属性 的选择不超过7条
    goodsAttrChange () {
      let goodsAttrLen = this.goodsAttrCollection.length
      if (goodsAttrLen > 7) {
        this.goodsAttrCollection.pop()
        this.messageTips('不能超过7条数据')
      }
    },
    // 保存 货物属性的值
    saveGoodsAttr () {
      this.baseInfo.goodsAttrList = []
      this.baseInfo.goodsAttr = ''
      for (let index in this.goodsAttrCollection) {
        this.baseInfo.goodsAttrList.push({
          goodsAttr: this.goodsAttrCollection[index].split('-')[0],
          goodsAttrValue: this.goodsAttrCollection[index].split('-')[1]
        })
        if (index === '0') {
          this.baseInfo.goodsAttr = this.goodsAttrCollection[index].split('-')[0]
          this.showGoodsAttrValue = this.goodsAttrCollection[index].split('-')[1]
        } else {
          this.baseInfo.goodsAttr = this.baseInfo.goodsAttr + ',' + this.goodsAttrCollection[index].split('-')[0]
          this.showGoodsAttrValue = this.showGoodsAttrValue + ',' + this.goodsAttrCollection[index].split('-')[1]
        }
      }
      this.goodsAttrVisible = false
    },
    // 取消 货物属性
    closeGoodsAttr () {
      this.goodsAttrVisible = false
    },
    // 商品暂存
    addFun (type, value) {
      this.$post({
        url: 'API@/dec-common/dec/decListHis/saveDecHis',
        data: this.baseInfo,
        success: (res) => {
          this.closeOrder()
        }
      })
    },
    // 关闭接单弹窗
    closeOrder () {
      this.$emit('closedecele')
    },
    num (rule, value, callback) {
      const num = /^[0-9]+$/
      if (util.isEmpty(value)) {
        callback()
      } else {
        if (!num.test(value)) {
          callback(new Error())
        } else {
          callback()
        }
      }
    },
    // 打开申报要素重新归类
    openElement () {
      if (util.isEmpty(this.baseInfo.gModel)) {
        this.messageTips('需要填写规格型号')
        return
      }
      this.getGoodsInfo()
    },
    // 查询商品信息
    getGoodsInfo () {
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          'codeTs': this.baseInfo.codeTs,
          'iEFlag': this.baseInfo.iEFlag
        },
        success: (res) => {
          let productList = res.result
          if (productList === null || productList === undefined || productList.length === 0) {
          } else {
            this.decElementPara = {
              checkedgoods: res.result[0], // 加载数据
              opeType: this.typeValue === 'view' ? 'look' : 'add', // 操作类型 add 新增  edit 编辑  look 查看
              gModel: this.baseInfo.gModel, // 规格型号
              iEFlag: this.baseInfo.iEFlag, // 进出口标志
              gName: this.baseInfo.gName,
              gtin: '' // 存放Gtin的地方
            }
            this.elementVisible = true
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .m-b-10{
    margin-bottom: 10px;
  }
  .border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
  }
  .dec-div{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
    line-height: 22px;
  }
</style>
