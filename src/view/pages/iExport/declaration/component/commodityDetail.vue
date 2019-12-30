<template>
  <!-- 查看回执 组件 -->
  <section class="sys-main">
    <el-header style="height:0px">
    </el-header>
    <div class='sys-jiner-class'>
      <el-container>
        <el-main style="padding:0px 0px 20px;">
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
          </el-main>
        </el-container>
      </div>
      <div slot="footer" class="sys-dialog-footer query-btn">
        <el-button type="primary" size="mini" @click="addFun">确定</el-button>
        <el-button size="mini" @click="closeOrder">取消</el-button>
      </div>
      <!-- 弹出框 检验检疫编码列表 开始 -->
    <el-dialog :modal-append-to-body='false'
     title="检验检疫编码列表"
    :visible.sync="encodeTableVisible" width="640px"
    class="dec-query-table" :modal='false'
    :close-on-click-modal="false">
      <el-table  ref="encodeTable" :data="encodeTableList" highlight-current-row border size='mini'  @selection-change="encodeTableChanged" max-height="300" style="width: 100%">
        <el-table-column width="50" align="center">
          <template slot-scope="scope">
            <el-radio v-model="encodeListRadio" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column  property="gNameNote" label="名称" min-width="100"></el-table-column>
        <el-table-column  property="typeName" label="类型" min-width="100"></el-table-column>
        <el-table-column  property="codeTs" label="HS代码" min-width="100"></el-table-column>
        <el-table-column  property="hsGName" label="HS名称" min-width="100"></el-table-column>
      </el-table>
      <span slot="footer" class="sys-dialog-footer query-btn">
        <el-button type="primary" size="mini" @click="saveEncodeTableVaue" :disabled="isView">确定</el-button>
        <el-button size="mini" @click="closeEncodeTable">取消</el-button>
      </span>
    </el-dialog>
    <!--检验检疫货物规格 弹出框 结束-->
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
    <el-dialog :modal-append-to-body='false' title="检验检疫货物规格"
    :visible.sync="goodsSpecVisible"
    width="540px" :modal='false'
    :close-on-click-modal="false">
      <div class="sys-jiner-class">
      <div class="border">
        <el-form label-width="100px" @keyup.enter.native="switchFoucsByEnter" size="mini" label-position="right" :data="goodsSpecForm">
          <el-row >
            <el-col :span="24">
              <el-form-item label="成分/原料/组分">
                <el-input v-model="goodsSpecForm.stuffNote" autofocus></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="产品有效期">
                <el-date-picker
                  v-model="goodsSpecForm.prodValidDt"
                  type="date"
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder=" ">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="产品保质期(天)">
                <el-input v-model="goodsSpecForm.prodQgp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="境外生产企业">
                <el-input v-model="goodsSpecForm.engManentCnm"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物规格">
                <el-input v-model="goodsSpecForm.goodsSpec"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物型号">
                <el-input v-model="goodsSpecForm.goodsModel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物品牌">
                <el-input v-model="goodsSpecForm.goodsBrand"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="生产日期">
                <el-date-picker
                  v-model="goodsSpecForm.produceDate"
                  @change='produceDateChange'
                  type="dates"
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder=" ">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if = "baseInfo.iEFlag == 'I'">
            <el-row >
              <el-col :span="24">
                <el-form-item label="生产批次">
                  <el-input v-model="goodsSpecForm.prodBatchNo" enter='no' @keyup.enter.native="saveGoodsSpec"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row >
              <el-col :span="24">
                <el-form-item label="生产批次">
                  <el-input v-model="goodsSpecForm.prodBatchNo"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row >
              <el-col :span="24">
                <el-form-item label="生产单位代码">
                  <el-input v-model="goodsSpecForm.mnufctrRegno" @keyup.enter.native="saveGoodsSpec"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      </div>
      <span slot="footer" class="sys-dialog-footer query-btn">
        <el-button type="primary" @click="saveGoodsSpec" :disabled="isView">确定</el-button>
      </span>
    </el-dialog>
    <!--检验检疫货物规格 弹出框 结束-->
    <!-- 弹出框 产品许可证/审批/备案信息  开始 -->
    <el-dialog :modal-append-to-body='false' title="产品许可证/审批/备案信息" :visible.sync="filingInfoVisible" :before-close="filingInfoClose" width="70%" :modal='false' :close-on-click-modal="false">
      <div class="sys-jiner-class">
      <div class="border m-b-10">
        <el-form label-width="100px" :model="filingInfoForm" size="mini" @keyup.enter.native="switchFoucsByEnter" label-position="right" ref="licRuleForm" :rules="licRuleForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品编码">
                <el-input v-model="baseInfo.codeTs" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品名称">
                <el-input v-model="baseInfo.gName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检验检疫名称">
                <el-input v-model="baseInfo.ciqName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="序号">
                <el-input v-model="filingInfoForm.gNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="许可证类别" :class="{ 'require-color': controller.requireColor }"  prop="licTypeCode" ref="licTypeCode">
                <el-select size="mini" filterable v-model="filingInfoForm.licTypeCode" class="select-Color" :disabled="isView">
                  <el-option
                    v-for="item in LicTypeList"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="许可证编号" :class="{ 'require-color': controller.requireColor }" prop="licenceNo" ref="licenceNo">
                <el-input v-model="filingInfoForm.licenceNo" :maxlength="40"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="核销货物序号" prop="licWrtofDetailno" ref="licWrtofDetailno">
                <el-input v-model="filingInfoForm.licWrtofDetailno" :maxlength="2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="核销数量"  prop="licWrtofQty" ref="licWrtofQty">
                <el-input v-model="filingInfoForm.licWrtofQty" :maxlength="20" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="核销数量单位"  prop="licWrtofQtyUnit" ref="licWrtofQtyUnit">
                <el-select size="mini" filterable v-model="filingInfoForm.licWrtofQtyUnit" class="select-Color" :disabled="isView">
                  <el-option
                    v-for="item in paramsOptions['SAAS_UNIT']"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="m-b-10">
          <el-button @click="AddfilingInfo" class="list-btns list-icon-add" :disabled="isView"><i></i>新增</el-button>
          <el-button @click="savefilingInfo" class="list-btns list-icon-save"  :disabled="isView"><i></i>保存</el-button>
          <el-button @click="delfilingInfo" class="list-btns list-icon-delete"  :disabled="isView"><i></i>删除</el-button>
          <el-button class="list-btns" @click="openLicVIN">许可证VIN信息</el-button>
      </div>
      <div class="query-table dec-query-table dec-table">
        <el-table ref="filingInfoTable" :data="baseInfo.decGoodsLimits"
          highlight-current-row border size='mini'
          @selection-change="filingInfoChangeFun"
          @row-click="backFilingInfo"
          height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
          <el-table-column  property="licTypeCode" label="许可证类别代码" min-width="80"></el-table-column>
          <el-table-column  property="licTypeCodeValue" label="许可证类别名称" min-width="100"></el-table-column>
          <el-table-column  property="licenceNo" label="许可证编号" min-width="80"></el-table-column>
          <el-table-column  property="licWrtofDetailno" label="核销货物序号" min-width="50"></el-table-column>
          <el-table-column  property="licWrtofQty" label="核销数量" min-width="100"></el-table-column>
          <el-table-column  property="licWrtofQtyUnitValue" label="核销数量单位" min-width="80"></el-table-column>
        </el-table>
      </div>
      </div>
    </el-dialog>
    <!-- 弹出框 产品许可证/审批/备案信息 结束 -->
    <!-- 弹出框 许可证VIN  开始 -->
    <el-dialog :modal-append-to-body='false'
    title="编辑许可证VIN"
    :visible.sync="licVINVisible"
    :before-close="licVINClose" width="70%"
    :modal='false'
    :close-on-click-modal="false">
      <div class="sys-jiner-class">
       <div class="border m-b-10">
          <el-form label-width="120px" :model="licVINForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
            <el-row  >
              <el-col :span="6">
                <el-form-item label="序号">
                  <el-input v-model="licVINForm.gNo" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="许可证类别">
                  <el-select size="mini" filterable v-model="licVINForm.licTypeCode" class="select-Color" disabled>
                    <el-option
                      v-for="item in LicTypeList"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="许可证编号">
                  <el-input v-model="licVINForm.licenceNo" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="6">
                <el-form-item label="VIN序号">
                  <el-input v-model="licVINForm.vinNo" :maxlength="100" autofocus></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="提/运单日期" class="select-Color">
                  <el-date-picker
                    v-model="licVINForm.billLaddate"
                    type="date"
                    :editable='false'
                    style="width:100%;"
                    value-format="yyyy-MM-dd"
                    placeholder=" ">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="质量保质期">
                  <el-input v-model="licVINForm.qualityQgp" :maxlength="100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="车辆识别代码(VIN)" >
                  <el-input v-model="licVINForm.vinCode" :maxlength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="9">
                <el-form-item label="发动机号或电机号" >
                  <el-input v-model="licVINForm.motorNo" :maxlength="100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="发票号">
                  <el-input v-model="licVINForm.invoiceNo" :maxlength="30" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发票所列数量" >
                  <el-input v-model="licVINForm.invoiceNum" placeholder="只能输入自然数"  :maxlength="14" @blur="invoiceNumValid"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="12">
                <el-form-item label="品名(中文名称)" >
                  <el-input v-model="licVINForm.prodCnnm"  :maxlength="500" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品名(英文名称)" >
                  <el-input v-model="licVINForm.prodEnnm"  :maxlength="500" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="12">
                <el-form-item label="型号（英文">
                  <el-input v-model="licVINForm.modelEn"  :maxlength="500" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="底盘(车架)号" >
                  <el-input v-model="licVINForm.chassisNo"  :maxlength="20" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单价">
                  <el-input v-model="licVINForm.pricePerunit"  :maxlength="20" enter = 'no' @keyup.enter.native ='savelicVIN'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
       </div>
      <div class="m-b-10">
          <el-button @click="AddlicVIN" class='list-btns list-icon-add' :disabled="isView"><i></i>新增</el-button>
          <el-button @click="savelicVIN" class='list-btns list-icon-save' :disabled="isView"><i></i>保存</el-button>
          <el-button @click="dellicVIN" class='list-btns list-icon-delete' :disabled="isView"><i></i>删除</el-button>
      </div>
      <div class="query-table dec-query-table dec-table">
      <el-table  ref="licVINTable" :data="filingInfoForm.decGoodsLimitvins"
        highlight-current-row border size='mini'
        @selection-change="licVINChangeFun"
        @row-click="backLicVINInfo"
        height="300" style="width: 100%">
        <el-table-column  type="selection" min-width="50" align="center"></el-table-column>
        <el-table-column  property="vinNo" label="VIN序号" min-width="80"></el-table-column>
        <el-table-column  property="billLaddate" label="提/运单日期" min-width="120"></el-table-column>
        <el-table-column  property="qualityQgp" label="质量保质期" min-width="90"></el-table-column>
        <el-table-column  property="motorNo" label="发动机号或电机号" min-width="125"></el-table-column>
        <el-table-column  property="vinCode" label="车辆识别代码(VIN)" min-width="130"></el-table-column>
        <el-table-column  property="chassisNo" label="底盘(车架)号" min-width="120"></el-table-column>
        <el-table-column  property="invoiceNo" label="发票号" min-width="100"></el-table-column>
        <el-table-column  property="invoiceNum" label="发票所列数量" min-width="100"></el-table-column>
        <el-table-column  property="prodCnnm" label="品名(中文名称)" min-width="120"></el-table-column>
        <el-table-column  property="prodEnnm" label="品名(英文名称)" min-width="120"></el-table-column>
        <el-table-column  property="modelEn" label="型号(英文)" min-width="120"></el-table-column>
        <el-table-column  property="pricePerunit" label="单价" min-width="50"></el-table-column>
      </el-table>
      </div>
      </div>
    </el-dialog>
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
import decelementView from '../decPage/decList/components/decelement.vue'

export default {
  name: 'return-receipt',
  props: {
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
    decelementView
  },
  data () {
    return {
      isView: false,
      baseRule: {
        // 'packNo': [{validator: this.num, message: '请输入数字', trigger: 'blur'}],
        // 'grossWt': [{required: true, message: '请输入毛重', trigger: 'blur'}, {validator: validator.num1F2, message: '小数点后最多支持录入5位', trigger: 'blur'}],
        // 'netWt': [{required: true, message: '请输入净重', trigger: 'blur'}, {validator: validator.num1F2, message: '小数点后最多支持录入5位', trigger: 'blur'}],
        // 'billingCycle': [{validator: this.num, message: '请输入数字', trigger: 'blur'}]
      },
      licRuleForm: {
        licTypeCode: [ // 许可证类别
          {required: true, message: '输入许可证类别', trigger: 'change'}
        ]
      },
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
      baseInfo: {
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
        mnufctrRegNo: '' // 生产单位代码
      },
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
      encodeListRadio: 0, // 选中的检验检验编码列表
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
      goodsSpecForm: { // 检验检疫货物规格 字段
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
      filingInfoVisible: false, // 许可证备案信息 显示隐藏控制字段
      filingInfoForm: { // 许可证备案信息表
        goodsLimitPid: '', // 主键
        decListPid: '', // 表体 主键
        gNo: '', // 序号
        licTypeCode: '', // 许可证类别代码
        licTypeCodeValue: '', // 许可证类别名称
        licWrtofQty: '', // 许可证核销数量
        licWrtofQtyUnit: '', // 许可证核销数量单位
        licWrtofQtyUnitVaue: '', // 许可证核销数量单位名称
        licenceNo: '', // 许可证编号
        licWrtofDetailno: '', // 许可证核销明细序号
        goodsNo: '', // 商品序号
        decGoodsLimitvins: [] // 许可证VIN
      },
      licVINForm: { // 许可证VIN 信息
        pid: '', // 主键
        goodsLimitPid: '', // 产品资质许可证信息表PID
        billLaddate: '', // 提/运单日期
        chassisNo: '', // 底盘(车架)号
        gNo: '', // 序号
        invoiceNum: '', // 发票所列数量
        licTypeCode: '', // 许可证类别代码
        licenceNo: '', // 许可证编号
        modelEn: '', // 型号（英文）
        motorNo: '', // 发动机号或电机号
        pricePerunit: '', // 单价
        prodCnnm: '', // 品名（中文名称）
        prodEnnm: '', // 品名（英文名称）
        qualityQgp: '', // 质量保质期
        vinCode: '', // 车辆识别代码（VIN）
        vinNo: ''// VIN序号
      },
      // licVINList: [], // 许可证VIN list表
      licVINVisible: false, // 许可证VIN 显示隐藏控制字段
      goodsAttrVisible: false, // 货物属性 显示隐藏控制字段
      goodsAttrCollection: [], // 货物属性被选择的集合
      saasGoodsAttr: [],
      LicTypeList: [],
      iLicType: [],
      eLicType: [],
      carModelList: [
        {
          label: '1T',
          value: '1'
        }, {
          label: '2T',
          value: '2'
        }, {
          label: '5T',
          value: '3'
        }, {
          label: '8T',
          value: '4'
        }, {
          label: '10T',
          value: '5'
        }, {
          label: '20GP',
          value: '6'
        }, {
          label: '20HQ',
          value: '7'
        }, {
          label: '45GP',
          value: '8'
        }, {
          label: '45HQ',
          value: '9'
        }, {
          label: '17.5',
          value: '10'
        }
      ],
      commonPara: [
        {
          codeField: '0',
          nameField: '否'
        },
        {
          codeField: '1',
          nameField: '是'
        }],
      dangerType: [
        {
          codeField: '1',
          nameField: '一类'
        },
        {
          codeField: '2',
          nameField: '二类'
        },
        {
          codeField: '3',
          nameField: '三类'
        }
      ]
    }
  },
  created () {
    if (this.typeValue === 'view') {
      this.isView = true
      this.decListPid = this.id
      this.commodityDetail()
    } else {
      this.isView = false
      this.decListPid = this.id
      this.commodityDetail()
    }
  },
  mounted () {
    this.getCommonParams()
    this.wrapList = util.isEmpty(window.localStorage.getItem('WRAPLIST')) ? [] : JSON.parse(window.localStorage.getItem('WRAPLIST'))
  },
  methods: {
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      e.srcElement.blur()
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
        return e.srcElement === v
      })
      // 下一个元素
      let next = newFocusable[parseInt(index) + 1]
      // 上一个元素
      let prev = newFocusable[parseInt(index) - 1]
      if (e.shiftKey) { // shift+enter 光标向上个元素移动
        if (prev) {
          if (e.target.attributes.shiftEnter && e.srcElement.attributes.shiftEnter.nodeValue === 'no') {
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
    // 生产日期的change事件 如果 生产日期为null 则 赋值为空
    produceDateChange () {
      if (util.isEmpty(this.goodsSpecForm.produceDate) || this.goodsSpecForm.length === 0) {
        this.goodsSpecForm.produceDate = ''
      }
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
          this.goodsSpecForm.stuffNote = res.result.stuffNote
          this.goodsSpecForm.prodValidDt = res.result.prodValidDt
          this.goodsSpecForm.prodQgp = res.result.prodQgp
          this.goodsSpecForm.engManentCnm = res.result.engManentCnm
          this.goodsSpecForm.goodsSpec = res.result.goodsSpec
          this.goodsSpecForm.goodsModel = res.result.goodsModel
          this.goodsSpecForm.goodsBrand = res.result.goodsBrand
          if (!util.isEmpty(res.result.produceDate)) {
            this.goodsSpecForm.produceDate = res.result.produceDate.split(';')
          } else {
            this.goodsSpecForm.produceDate = ''
          }
          this.goodsSpecForm.prodBatchNo = res.result.prodBatchNo
          this.goodsSpecForm.mnufctrRegno = res.result.mnufctrRegno
          // 规格型号
          let param = []
          for (let index in this.goodsSpecForm) {
            if (util.isEmpty(this.goodsSpecForm[index]) === false) {
              param.push(this.goodsSpecForm[index])
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
    // 检验检疫编码表 获取选中的值
    encodeTableChanged (value) {
      this.encodeTableList = util.simpleClone(value)
    },
    // 保存 并反填检验检疫编码表
    saveEncodeTableVaue () {
      let ciqData = util.simpleClone(this.encodeTableList[this.encodeListRadio])
      this.baseInfo.ciqName = ciqData.gNameNote
      this.baseInfo.ciqCode = ciqData.ciqCo
      this.encodeTableVisible = false
    },
    // 关闭检验检疫编码表
    closeEncodeTable () {
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
    // 保存 检验检疫货物规格
    saveGoodsSpec () {
      let param = []
      for (let index in this.goodsSpecForm) {
        if (util.isEmpty(this.goodsSpecForm[index]) === false) {
          param.push(this.goodsSpecForm[index])
        }
      }
      this.baseInfo.showGoodsSpec = param.join(',')
      // 赋值到decList
      this.baseInfo.stuffNote = this.goodsSpecForm.stuffNote
      this.baseInfo.prodValidDt = this.goodsSpecForm.prodValidDt
      this.baseInfo.prodQgp = this.goodsSpecForm.prodQgp
      this.baseInfo.engManentCnm = this.goodsSpecForm.engManentCnm
      this.baseInfo.goodsSpec = this.goodsSpecForm.goodsSpec
      this.baseInfo.goodsModel = this.goodsSpecForm.goodsModel
      this.baseInfo.goodsBrand = this.goodsSpecForm.goodsBrand
      if (!util.isEmpty(this.goodsSpecForm.produceDate)) {
        this.baseInfo.produceDate = this.goodsSpecForm.produceDate.join(';')
      } else {
        this.baseInfo.produceDate = ''
      }
      this.baseInfo.prodBatchNo = this.goodsSpecForm.prodBatchNo
      this.baseInfo.mnufctrRegno = this.goodsSpecForm.mnufctrRegno
      this.goodsSpecVisible = false
    },
    // 清空 产品资质 备案信息
    AddfilingInfo () {
      this.filingInfoForm = { // 许可证备案信息表
        goodsLimitPid: '', // 主键
        decListPid: '', // 表体 主键
        gNo: '', // 序号
        licTypeCode: '', // 许可证类别代码
        licTypeCodeValue: '', // 许可证类别名称
        licWrtofQty: '', // 许可证核销数量
        licWrtofQtyUnit: '', // 许可证核销数量单位
        licWrtofQtyUnitVaue: '', // 许可证核销数量单位名称
        licenceNo: '', // 许可证编号
        licWrtofDetailno: '', // 许可证核销明细序号
        goodsNo: '', // 商品序号
        decGoodsLimitvins: [] // 许可证VIN
      }
      this.saasLicType1 = []
      this.saasUnit4 = []
    },
    // 关闭 产品资质  备案信息 弹出框
    filingInfoClose () {
      // 清除input数据
      this.AddfilingInfo()
      this.filingInfoVisible = false
    },
    // 保存 产品资质 备案信息
    savefilingInfo () {
      let flag = this.savefilingInfoNoRefresh()
      if (flag === true) {
        // 重新 初始化表单
        this.AddfilingInfo()
      }
    },
    // 保存 产品资质 备案信息 不清除 表单数据
    savefilingInfoNoRefresh () {
      let flag = false
      this.$refs['licRuleForm'].validate((valid) => {
        if (valid === false) {
          flag = false
        } else {
          // 许可证类型 code 转name
          for (let i in this.LicTypeList) {
            if (this.LicTypeList[i].codeField === this.filingInfoForm.licTypeCode) {
              this.filingInfoForm.licTypeCodeValue = this.LicTypeList[i].nameField
            }
          }
          // 核销数量单位code 转name
          for (let i in this.paramsOptions['SAAS_UNIT']) {
            if (this.paramsOptions['SAAS_UNIT'][i].codeField === this.filingInfoForm.licWrtofQtyUnit) {
              this.filingInfoForm.licWrtofQtyUnitValue = this.paramsOptions['SAAS_UNIT'][i].nameField
            }
          }
          if (util.isEmpty(this.filingInfoForm.gNo)) {
            // 新增
            this.filingInfoForm.gNo = this.baseInfo.decGoodsLimits.length + 1
            this.baseInfo.decGoodsLimits.push(util.simpleClone(this.filingInfoForm))
          } else {
            // 修改
            let index = parseInt(this.filingInfoForm.gNo) - 1
            this.baseInfo.decGoodsLimits[index] = util.simpleClone(this.filingInfoForm)
            this.baseInfo.decGoodsLimits.push({})
            this.baseInfo.decGoodsLimits.pop()
          }
          flag = true
        }
      })
      return flag
    },
    // 删除 产品资质 备案信息
    delfilingInfo () {
      let delData = this.checkedFilingInfoList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.baseInfo.decGoodsLimits) {
              if (delData[index].gNo === this.baseInfo.decGoodsLimits[item].gNo) {
                this.baseInfo.decGoodsLimits.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedFilingInfoList = []
          // 重新排序
          for (let i in this.baseInfo.decGoodsLimits) {
            this.baseInfo.decGoodsLimits[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化表单
          this.AddfilingInfo()
        }).catch(() => {
        })
      }
    },
    // 产品资质 备案信息 获取被选中的值
    filingInfoChangeFun (value) {
      this.checkedFilingInfoList = value
    },
    // 反填数据 产品资质 备案信息
    backFilingInfo (row) {
      // 初始化数据
      this.filingInfoForm = util.simpleClone(row)
    },
    // 打开 许可证VIN
    openLicVIN () {
      // 判断时否满足 弹出 条件
      this.$refs['licRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          // 赋值
          this.licVINForm.licTypeCode = this.filingInfoForm.licTypeCode
          this.licVINForm.licenceNo = this.filingInfoForm.licenceNo
          // 显示弹出框
          this.licVINVisible = true
        }
      })
    },
    // 新增 许可证VIN
    AddlicVIN () {
      this.licVINForm = { // 许可证VIN 信息
        pid: '', // 主键
        goodsLimitPid: '', // 产品资质许可证信息表PID
        billLaddate: '', // 提/运单日期
        chassisNo: '', // 底盘(车架)号
        gNo: '', // 序号
        invoiceNum: '', // 发票所列数量
        licTypeCode: '', // 许可证类别代码
        licenceNo: '', // 许可证编号
        modelEn: '', // 型号（英文）
        motorNo: '', // 发动机号或电机号
        pricePerunit: '', // 单价
        prodCnnm: '', // 品名（中文名称）
        prodEnnm: '', // 品名（英文名称）
        qualityQgp: '', // 质量保质期
        vinCode: '', // 车辆识别代码（VIN）
        vinNo: ''// VIN序号
      }
      this.licVINForm.licTypeCode = this.filingInfoForm.licTypeCode
      this.licVINForm.licenceNo = this.filingInfoForm.licenceNo
      this.saasLicType2 = []
    },
    // 关闭许可证VIN 弹窗
    licVINClose () {
      // 清除input 数据
      this.AddlicVIN()
      this.licVINVisible = false
    },
    // 单独校验 发票所列数量
    invoiceNumValid () {
      if (!(/^\d{1,14}$|^$/.test(this.licVINForm.invoiceNum))) {
        this.licVINForm.invoiceNum = ''
      }
    },
    // 保存、修改 许可证VIN
    savelicVIN () {
      if (util.isEmpty(this.licVINForm.gNo)) {
        // 新增
        this.licVINForm.gNo = this.filingInfoForm.decGoodsLimitvins.length + 1
        this.filingInfoForm.decGoodsLimitvins.push(util.simpleClone(this.licVINForm))
      } else {
        // 修改
        let index = parseInt(this.licVINForm.gNo) - 1
        this.filingInfoForm.decGoodsLimitvins[index] = util.simpleClone(this.licVINForm)
        // 为了刷新列表的 操作
        this.filingInfoForm.decGoodsLimitvins.push({})
        this.filingInfoForm.decGoodsLimitvins.pop()
      }
      // 重新 初始化 form表单
      this.AddlicVIN()
      // 以防 备案信息还没有保存 这里保存一边
      this.savefilingInfoNoRefresh()
    },
    // 删除 许可证VIN
    dellicVIN () {
      let delData = this.checkedLicVINVList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.filingInfoForm.decGoodsLimitvins) {
              if (delData[index].gNo === this.filingInfoForm.decGoodsLimitvins[item].gNo) {
                this.filingInfoForm.decGoodsLimitvins.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedLicVINVList = []
          // 重新排序
          for (let i in this.filingInfoForm.decGoodsLimitvins) {
            this.filingInfoForm.decGoodsLimitvins[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化 form表单
          this.AddlicVIN()
        }).catch(() => {
        })
      }
    },
    // 许可证VIN talbe 选择事件
    licVINChangeFun (value) {
      this.checkedLicVINVList = value
    },
    // 许可证VIN talbe 反填值
    backLicVINInfo (row) {
      this.licVINForm = util.simpleClone(row)
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
.commodity-primary-btn {
    height: 30px;
    width: 70px;
    line-height: 30px;
    padding: 0 15px !important;
    border: 1px solid;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    border: none;
    background-color: #287fca;
    color: #ffffff!important;
}
  .commodity-btn {
    height: 30px;
    width: 70px;
    line-height: 30px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #dedede;
    background-color: #ffffff;
    color: #3C3C3C;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    margin-right:5px;
  }
  .commodity-btn.is-disabled,.commodity-btn.is-disabled:focus, .commodity-btn.is-disabled:hover{
    background-color:#d8d8d8;
    color:#808080;
  }
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
    line-height: 22px;
  }
  .sys-dialog-footer{
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
    // position:absolute;
    .el-button {
      height: 30px;
      padding: 7px 20px;
      margin-left: 10px;
      font-size: 14px;
      border-radius: 4px;
    }
  }
</style>
