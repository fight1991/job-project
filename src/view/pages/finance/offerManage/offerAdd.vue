<template>
  <section class="sys-main">
    <div class="originInfo">
      <el-row class="form-items">
        <el-form label-width="0px" :model="submitData" :rules="ruleForm" ref="submitData" size="mini" label-position="left">
          <!-- 基本信息 -->
          <div class="baseInfo">
            <el-row class="title">基本信息</el-row>
            <el-row :gutter="50">
              <el-col :span="8">
                <el-form-item label="报价名称" :label-width="labelFormWidth.five" prop="quotationHeadVO.itemName">
                  <el-input size="mini" clearable v-model="submitData.quotationHeadVO.itemName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报价含税" :label-width="labelFormWidth.five" prop="quotationHeadVO.rateFlag">
                  <el-select size="mini" clearable  v-model="submitData.quotationHeadVO.rateFlag" style="width:100%;">
                    <el-option key="1" :label="'含税'" :value="true"></el-option>
                    <el-option key="0" :label="'不含税'" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item  label-position="left">
                  <el-checkbox v-model="submitData.quotationHeadVO.singleFlag" name="singleFlag">项目独立报价</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="50">
              <el-col :span="8">
                <el-form-item label="委托企业" :label-width="labelFormWidth.five" prop="quotationHeadVO.entrustCompanyName">
                  <el-select v-model="submitData.quotationHeadVO.entrustCompanyName" :maxlength="30" style="width:100%"
                    filterable remote clearable @change="translatecorp"
                    :remote-method="getcorps"
                    allow-create
                    default-first-option >
                    <el-option
                      v-for="item in corpList"
                      :key="item.corpId"
                      :label="item.corpName"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期" :label-width="labelFormWidth.five" prop="quotationHeadVO.dates">
                  <el-date-picker
                    style="width:100%"
                    v-model="submitData.quotationHeadVO.dates"
                    type="daterange"
                    align="right"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 应收费用 -->
          <div class="acceptOffer">
            <el-row class="title">应收费用</el-row>
            <el-row class="accept-body" v-for="(item1, index1) in submitData.quotationReceivableBodyVOList" :key="'key_1' + index1">
              <span class="deleteBody" @click="delFeeBody(index1,true)"><img src="@/assets/img/delete_all.png" alt=""></span>
              <!-- 第一行 -->
              <el-row :gutter="50" class="base-line">
                <el-row :gutter="50" class="margin_0 base-line-one">
                  <el-col :span="12" class="padding_0">
                    <el-form-item label="进/出境关别" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.impexpPortcdNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                        placeholder="请选择进出境关别,最多9条"
                        @focus="tipsFill('impexpPortList','SAAS_CUSTOMS_REL')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in impexpPortList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField + '-' + item.nameField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-right:0">
                    <el-form-item label="申报地海关" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.dclPlcCuscdNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                         placeholder="请选择申报地海关,最多9条"
                        @focus="tipsFill('dclPlcCusList','SAAS_CUSTOMS_REL')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in dclPlcCusList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField + '-' + item.nameField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="50" class="margin_0">
                  <el-col :span="12" class="padding_0">
                    <el-form-item label="出发地/港" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.departureNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                         placeholder="请选择出发地/港,最多9条"
                        @focus="tipsFill('departureList','SAAS_TJ_PORT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in departureList"
                          :key="item.codeField"
                          :label="item.nameField + '-' + item.otherField"
                          :value="item.codeField + '~' + item.nameField + item.otherField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-right:0">
                    <el-form-item label="目的地/港" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.destinationNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                         placeholder="请选择目的地/港,最多9条"
                        @focus="tipsFill('destinationList','SAAS_TJ_PORT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in destinationList"
                          :key="item.codeField"
                          :label="item.nameField + '-' + item.otherField"
                          :value="item.codeField + '~' + item.nameField + item.otherField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
              <!-- 进口 -->
              <el-row :gutter="50" class="margin_0 import">
                <el-row class="title-flag margin_0">进口</el-row>
                <el-row class="margin_0 ei-line" :gutter="8" v-for="(item2, index2) in item1.feeOptionImportVOs" :key="'key_1_I' + index2">
                  <el-col :span="8" style="padding-left:0">
                    <el-form-item>
                      <el-select size="mini" placeholder="请选择费用名称" clearable  v-model="item2.feeOptionName" :maxlength="20" style="width:100%;" @change="getFeeRate(item2, 'quotationReceivableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.feePrice')">
                        <el-option v-for="item in optionsList"
                          :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.feePrice'" :rules="item2.feeOptionName ? valid.feePriceTrue : valid.feePriceFalse">
                      <el-input size="mini" v-model="item2.feePrice" clearable placeholder="单价" :disabled="!item2.feeOptionName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.feeRate'" :rules="(item2.feeOptionName && valid.feeRate) || {}">
                      <el-select size="mini" placeholder="税率" clearable :disabled="item2.rateIsDisabled || editOp || !item2.feeOptionName"  v-model="item2.feeRate" style="width:100%;">
                        <el-option key="0" :label="'0%'" :value="0"></el-option>
                        <el-option key="6" :label="'6%'" :value="6"></el-option>
                        <el-option key="9" :label="'9%'" :value="9"></el-option>
                        <el-option key="13" :label="'13%'" :value="13"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.curr'" :rules="(item2.feeOptionName && valid.curr) || {}">
                      <!-- <el-select  v-model="item2.curr" placeholder="币制"
                        filterable clearable remote default-first-option
                        :disabled="!item2.feeOptionName"
                        @focus="tipsFill('currList','SAAS_CURR')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in currList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select> -->
                      <el-input v-model="item2.curr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.unit'" :rules="(item2.feeOptionName && valid.unit) || {}">
                      <el-select  v-model="item2.unit" placeholder="计量单位"
                        filterable clearable remote default-first-option
                        :disabled="!item2.feeOptionName"
                        @focus="tipsFill('unitList','SAAS_SEA_UNIT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in unitList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- 删除图标 -->
                  <span class="delete-icon" @click="delItems(index1,index2,'0',true)">
                    <img src="@/assets/img/delete.png" alt="">
                  </span>
                </el-row>
                <el-row class="margin_0">
                  <el-button class="addMore" @click="addFeeMore(index1,'0',true)">添加更多</el-button>
                </el-row>
              </el-row>
              <!-- 出口 -->
              <el-row :gutter="50" class="margin_0 export">
                <el-row class="title-flag margin_0">出口</el-row>
                <el-row class="margin_0 ei-line" :gutter="8" v-for="(item3, index3) in item1.feeOptionExportVOs" :key="'key_1_E' + index3">
                  <el-col :span="8" style="padding-left:0">
                    <el-form-item>
                      <el-select size="mini" placeholder="请选择费用名称" clearable  v-model="item3.feeOptionName" :maxlength="20" style="width:100%;" @change="getFeeRate(item3, 'quotationReceivableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.feePrice')">
                        <el-option v-for="item in optionsList"
                          :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <!-- 费用项有值,其余4项做必填项校验 -->
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.feePrice'" :rules="item3.feeOptionName ? valid.feePriceTrue : valid.feePriceFalse">
                      <el-input size="mini" v-model="item3.feePrice" clearable placeholder="单价" :disabled="!item3.feeOptionName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.feeRate'" :rules="(item3.feeOptionName && valid.feeRate) || {}">
                      <el-select size="mini" placeholder="税率" clearable :disabled="item3.rateIsDisabled || editOp || item3.feeOptionName" v-model="item3.feeRate" style="width:100%;">
                        <el-option key="0" :label="'0%'" :value="0"></el-option>
                        <el-option key="6" :label="'6%'" :value="6"></el-option>
                        <el-option key="9" :label="'9%'" :value="9"></el-option>
                        <el-option key="13" :label="'13%'" :value="13"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.curr'" :rules="(item3.feeOptionName && valid.curr) || {}">
                      <!-- <el-select  v-model="item3.curr" placeholder="币制"
                        filterable clearable remote default-first-option
                        :disabled="!item3.feeOptionName"
                        @focus="tipsFill('currList','SAAS_CURR')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in currList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select> -->
                      <el-input v-model="item3.curr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationReceivableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.unit'" :rules="(item3.feeOptionName && valid.unit) || {}">
                      <el-select  v-model="item3.unit" placeholder="计量单位"
                        filterable clearable remote default-first-option
                        :disabled="!item3.feeOptionName"
                        @focus="tipsFill('unitList','SAAS_SEA_UNIT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in unitList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- 删除图标 -->
                  <span class="delete-icon" @click="delItems(index1,index3,'1',true)">
                    <img src="@/assets/img/delete.png" alt="">
                  </span>
                </el-row>
                <el-row class="margin_0">
                  <el-button class="addMore" @click="addFeeMore(index1,'1',true)">添加更多</el-button>
                </el-row>
              </el-row>
            </el-row>
            <el-row>
              <span class="moreOport" @click="addMorePort(true)">设置更多口岸</span>
            </el-row>
          </div>
          <!-- 应付费用 -->
          <div class="payOffer acceptOffer">
            <el-row class="title">应付费用</el-row>
            <el-row class="accept-body" v-for="(item1, index1) in submitData.quotationPayableBodyVOList" :key="'key_0' + index1">
              <span class="deleteBody" @click="delFeeBody(index1,false)"><img src="@/assets/img/delete_all.png" alt=""></span>
              <!-- 第一行 -->
              <el-row :gutter="50" class="base-line">
                <el-row :gutter="50" class="margin_0 base-line-one">
                  <el-col :span="12" class="padding_0">
                    <el-form-item label="进/出境关别" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.impexpPortcdNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                         placeholder="请选择进出境关别,最多9条"
                        @focus="tipsFill('impexpPortList','SAAS_CUSTOMS_REL')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in impexpPortList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField + '-' + item.nameField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-right:0">
                    <el-form-item label="申报地海关" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.dclPlcCuscdNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                         placeholder="请选择申报地海关,最多9条"
                        @focus="tipsFill('dclPlcCusList','SAAS_CUSTOMS_REL')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in dclPlcCusList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField + '-' + item.nameField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="50" class="margin_0">
                  <el-col :span="12" class="padding_0">
                    <el-form-item label="出发地/港" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.departureNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                        placeholder="请选择出发地/港,最多9条"
                        @focus="tipsFill('departureList','SAAS_TJ_PORT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in departureList"
                          :key="item.codeField"
                          :label="item.nameField + '-' + item.otherField"
                          :value="item.codeField + '~' + item.nameField + item.otherField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-right:0">
                    <el-form-item label="目的地/港" label-width="85px">
                      <el-select  v-model="item1.quotationFeeVO.destinationNames"
                        filterable clearable remote default-first-option
                        multiple autocomplete :multiple-limit="9"
                         placeholder="请选择进目的地/港,最多9条"
                        @focus="tipsFill('destinationList','SAAS_TJ_PORT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in destinationList"
                          :key="item.codeField"
                          :label="item.nameField + '-' + item.otherField"
                          :value="item.codeField + '~' + item.nameField + item.otherField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
              <!-- 进口 -->
              <el-row :gutter="50" class="margin_0 import">
                <el-row class="title-flag margin_0">进口</el-row>
                <el-row class="margin_0 ei-line" :gutter="8" v-for="(item2, index2) in item1.feeOptionImportVOs" :key="'key_0_I' + index2">
                  <el-col :span="8" style="padding-left:0">
                    <el-form-item>
                      <el-select size="mini" placeholder="请选择费用名称" clearable  v-model="item2.feeOptionName" :maxlength="20" style="width:100%;" @change="getFeeRate(item2, 'quotationReceivableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.feePrice')">
                        <el-option v-for="item in optionsList"
                          :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.feePrice'" :rules="item2.feeOptionName ? valid.feePriceTrue : valid.feePriceFalse">
                      <el-input size="mini" v-model="item2.feePrice" clearable placeholder="单价" :disabled="!item2.feeOptionName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.feeRate'" :rules="(item2.feeOptionName && valid.feeRate) || {}">
                      <el-select size="mini" placeholder="税率" clearable :disabled="item2.rateIsDisabled || editOp || !item2.feeOptionName"  v-model="item2.feeRate" style="width:100%;">
                        <el-option key="0" :label="'0%'" :value="0"></el-option>
                        <el-option key="6" :label="'6%'" :value="6"></el-option>
                        <el-option key="9" :label="'9%'" :value="9"></el-option>
                        <el-option key="13" :label="'13%'" :value="13"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.curr'" :rules="(item2.feeOptionName && valid.curr) || {}">
                      <!-- <el-select  v-model="item2.curr" placeholder="币制"
                        filterable clearable remote default-first-option
                        :disabled="!item2.feeOptionName"
                        @focus="tipsFill('currList','SAAS_CURR')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in currList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select> -->
                      <el-input v-model="item2.curr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionImportVOs.' + index2 + '.unit'" :rules="(item2.feeOptionName && valid.unit) || {}">
                      <el-select  v-model="item2.unit" placeholder="计量单位"
                        filterable clearable remote default-first-option
                        :disabled="!item2.feeOptionName"
                        @focus="tipsFill('unitList','SAAS_SEA_UNIT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in unitList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- 删除图标 -->
                  <span class="delete-icon" @click="delItems(index1,index2,'0',false)">
                    <img src="@/assets/img/delete.png" alt="">
                  </span>
                </el-row>
                <el-row class="margin_0">
                  <el-button class="addMore" @click="addFeeMore(index1,'0',false)">添加更多</el-button>
                </el-row>
              </el-row>
              <!-- 出口 -->
              <el-row :gutter="50" class="margin_0 export">
                <el-row class="title-flag margin_0">出口</el-row>
                <el-row class="margin_0 ei-line" :gutter="8" v-for="(item3, index3) in item1.feeOptionExportVOs" :key="'key_0_E' + index3">
                  <el-col :span="8" style="padding-left:0">
                    <el-form-item>
                      <el-select size="mini" placeholder="请选择费用名称" clearable  v-model="item3.feeOptionName" :maxlength="20" style="width:100%;" @change="getFeeRate(item3, 'quotationPayableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.feePrice')">
                        <el-option v-for="item in optionsList"
                          :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.feePrice'" :rules="item3.feeOptionName ? valid.feePriceTrue : valid.feePriceFalse">
                      <el-input size="mini" v-model="item3.feePrice" clearable placeholder="单价" :disabled="!item3.feeOptionName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.feeRate'" :rules="(item3.feeOptionName && valid.feeRate) || {}">
                      <el-select size="mini" placeholder="税率" clearable :disabled="item3.rateIsDisabled || editOp || !item3.feeOptionName" v-model="item3.feeRate" style="width:100%;">
                        <el-option key="0" :label="'0%'" :value="0"></el-option>
                        <el-option key="6" :label="'6%'" :value="6"></el-option>
                        <el-option key="9" :label="'9%'" :value="9"></el-option>
                        <el-option key="13" :label="'13%'" :value="13"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.curr'" :rules="(item3.feeOptionName && valid.curr) || {}">
                      <!-- <el-select  v-model="item3.curr" placeholder="币制"
                        filterable clearable remote default-first-option
                        :disabled="!item3.feeOptionName"
                        @focus="tipsFill('currList','SAAS_CURR')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in currList"
                          :key="item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select> -->
                      <el-input v-model="item3.curr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label=" " label-width="10px" :prop="'quotationPayableBodyVOList.' + index1 + '.feeOptionExportVOs.' + index3 + '.unit'" :rules="(item3.feeOptionName && valid.unit) || {}">
                      <el-select  v-model="item3.unit" placeholder="计量单位"
                        filterable clearable remote default-first-option
                        :disabled="!item3.feeOptionName"
                        @focus="tipsFill('unitList','SAAS_SEA_UNIT')"
                        :remote-method="checkParamsList"
                        style="width:100%">
                        <el-option
                          v-for="item in unitList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- 删除图标 -->
                  <span class="delete-icon" @click="delItems(index1,index3,'1',false)">
                    <img src="@/assets/img/delete.png" alt="">
                  </span>
                </el-row>
                <el-row class="margin_0">
                  <el-button class="addMore" @click="addFeeMore(index1,'1',false)">添加更多</el-button>
                </el-row>
              </el-row>
            </el-row>
            <el-row>
              <span class="moreOport" @click="addMorePort(false)">设置更多口岸</span>
            </el-row>
          </div>
        </el-form>
      </el-row>
    </div>
    <div class="submit">
      <el-row style="text-align:center">
        <el-button size="mini" type="primary" @click="submitBtn">提交</el-button>
        <el-button size="mini"  @click="cancelQuotation">取消</el-button>
      </el-row>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      quotationId: '',
      editOp: false, // 编辑页跳转过来
      // 总表单
      submitData: {
        quotationHeadVO: {
          dates: '',
          startDate: '', // 有效期开始
          endDate: '', // 有效期结束
          entrustCompanyId: '',
          entrustCompanyName: '', // 委托企业名称
          itemName: '', // 报价名称
          rateFlag: true, // 报价是否含税true含税，false不含税
          singleFlag: false // 是否项目独立报价1是0不是
        },
        quotationReceivableBodyVOList: [ // 应收
          {
            quotationFeeVO: {
              dclPlcCuscd: '', // 申报地海关代码
              dclPlcCuscdNames: '',
              departureNames: '', // 出发地
              destinationNames: '', // 目的地
              feeFlag: true, // 应收1，应付0
              impexpPortcd: '', // 进出境关别代码
              impexpPortcdNames: '',
              quotationFeeId: '', // 报价应收应付主键
              quotationId: '' // 报价主键
            },
            feeOptionImportVOs: [ // 进口
              {
                curr: 'CNY',
                feeOptionName: '',
                feePrice: '',
                feeRate: '',
                iEFlag: '0', // 0进口1出口2内贸
                quotationFeeId: '',
                quotationFeeOptionId: '',
                quotationId: '',
                unit: ''
              }
            ],
            feeOptionExportVOs: [ // 出口
              {
                curr: 'CNY',
                feeOptionName: '',
                feePrice: '',
                feeRate: '',
                iEFlag: '1',
                quotationFeeId: '',
                quotationFeeOptionId: '',
                quotationId: '',
                unit: ''
              }
            ]
          }
        ],
        quotationPayableBodyVOList: [ // 应付
          {
            quotationFeeVO: {
              dclPlcCuscd: '', // 申报地海关代码
              dclPlcCuscdNames: '',
              departureNames: '', // 出发地
              destinationNames: '', // 目的地
              feeFlag: false, // 应收1，应付0
              impexpPortcd: '', // 进出境关别代码
              impexpPortcdNames: '',
              quotationFeeId: '', // 报价应收应付主键
              quotationId: '' // 报价主键
            },
            feeOptionImportVOs: [ // 进口
              {
                curr: 'CNY',
                feeOptionName: '',
                feePrice: '',
                feeRate: '',
                iEFlag: '0',
                quotationFeeId: '',
                quotationFeeOptionId: '',
                quotationId: '',
                unit: ''
              }
            ],
            feeOptionExportVOs: [ // 出口
              {
                curr: 'CNY',
                feeOptionName: '',
                feePrice: '',
                feeRate: '',
                iEFlag: '1',
                quotationFeeId: '',
                quotationFeeOptionId: '',
                quotationId: '',
                unit: ''
              }
            ]
          }
        ]
      },
      copysubmitData: {}, // 复制整个模板
      // 应收应付模板
      templateFee: {
        quotationFeeVO: {
          dclPlcCuscd: '',
          dclPlcCuscdNames: '',
          departureNames: '',
          destinationNames: '',
          feeFlag: '',
          impexpPortcd: '',
          impexpPortcdNames: '',
          quotationFeeId: '',
          quotationId: ''
        },
        feeOptionImportVOs: [ // 进口
          {
            curr: 'CNY',
            feeOptionName: '',
            feePrice: '',
            feeRate: '',
            iEFlag: '0',
            quotationFeeId: '',
            quotationFeeOptionId: '',
            quotationId: '',
            unit: ''
          }
        ],
        feeOptionExportVOs: [ // 出口
          {
            curr: 'CNY',
            feeOptionName: '',
            feePrice: '',
            feeRate: '',
            iEFlag: '1',
            quotationFeeId: '',
            quotationFeeOptionId: '',
            quotationId: '',
            unit: ''
          }
        ]
      },
      // 应收应付费用模板
      templateOp: {
        curr: 'CNY',
        feeOptionName: '',
        feePrice: '',
        feeRate: '',
        iEFlag: '',
        quotationFeeId: '',
        quotationFeeOptionId: '',
        quotationId: '',
        unit: ''
      },
      // 查询的字典字段
      tableNameList: {
        tableNames: [
          'SAAS_CUSTOMS_REL', // 海关关区
          'SAAS_CURR', // 币制
          'SAAS_SEA_UNIT', // 计量单位
          'SAAS_TJ_PORT'
        ]
      },
      departureList: [], // 出发地/港口
      destinationList: [], // 目的地
      impexpPortList: [], // 进出境关别
      dclPlcCusList: [], // 申报地海关
      currList: [], // 币制
      unitList: [], // 计量单位
      corpList: [], // 企业列表
      selectObj: {
        obj: '',
        params: ''
      },
      optionsList: [],
      ruleForm: { // 总表一层校验规则
        'quotationHeadVO.itemName': [
          {required: true, message: '请输入报价名称', trigger: 'blur'}
        ],
        'quotationHeadVO.entrustCompanyName': [
          {required: true, message: '请输入委托企业', trigger: 'change'}
        ],
        'quotationHeadVO.rateFlag': [
          {required: true, message: '请选择是否含税', trigger: 'change'}
        ],
        'quotationHeadVO.dates': [
          {required: true, message: '请选择有效期', trigger: 'change'}
        ]
      },
      valid: { // 动态表单校验规则
        feePriceTrue: {required: true, pattern: /^\d{1,10}(\.\d{1,3})?$|^$/, message: '小数点前10位以内,后3位以内', trigger: 'blur'},
        feePriceFalse: {required: false, pattern: /^\d{1,10}(\.\d{1,3})?$|^$/, message: '小数点前10位以内,后3位以内', trigger: 'blur'},
        feeRate: {required: true, message: '请选择税率', trigger: 'change'},
        curr: {required: true, message: '请选择币制', trigger: 'change'},
        unit: {required: true, message: '请选择计量单位', trigger: 'change'}
      },
      selectDown: {
        dclPlcCuscdNames: {downList: 'dclPlcCusList', params: 'SAAS_CUSTOMS_REL'},
        impexpPortcdNames: {downList: 'impexpPortList', params: 'SAAS_CUSTOMS_REL'},
        departureNames: {downList: 'departureList', params: 'SAAS_TJ_PORT'},
        destinationNames: {downList: 'destinationList', params: 'SAAS_TJ_PORT'},
        curr: {downList: 'currList', params: 'SAAS_CURR'},
        unit: {downList: 'unitList', params: 'SAAS_SEA_UNIT'}
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    this.copyData() // 深拷贝模板
    this.getOptionList()
    this.getCommonParam(() => {
      let tempId = this.$route.query.quotationId
      if (tempId) {
        this.queryOptionsDetail(tempId)
        this.quotationId = tempId
        this.editOp = true
      }
    })
  },
  methods: {
    // 添加更多按钮
    addFeeMore (index, iEFlag, feeFlag) {
      // 深拷贝
      let temp = {...this.templateOp}
      temp.iEFlag = iEFlag
      let props = iEFlag === '0' ? 'feeOptionImportVOs' : 'feeOptionExportVOs'
      feeFlag ? this.submitData.quotationReceivableBodyVOList[index][props].push(temp) : this.submitData.quotationPayableBodyVOList[index][props].push(temp)
    },
    // 添加更多口岸
    addMorePort (feeFlag) {
      let temp = JSON.parse(JSON.stringify(this.templateFee))
      temp.quotationFeeVO.feeFlag = feeFlag
      feeFlag ? this.submitData.quotationReceivableBodyVOList.push(temp) : this.submitData.quotationPayableBodyVOList.push(temp)
    },
    // 删除行费用项
    delItems (index1, index2, iEFlag, feeFlag) {
      let props = iEFlag === '0' ? 'feeOptionImportVOs' : 'feeOptionExportVOs'
      feeFlag ? this.submitData.quotationReceivableBodyVOList[index1][props].splice(index2, 1) : this.submitData.quotationPayableBodyVOList[index1][props].splice(index2, 1)
    },
    // 删除应收应付模块
    delFeeBody (index, feeFlag) {
      feeFlag ? this.submitData.quotationReceivableBodyVOList.splice(index, 1) : this.submitData.quotationPayableBodyVOList.splice(index, 1)
    },
    // 创建字典参数列表
    tipsFill (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 判断缓存中是否有数据
    getCommonParam (callback) {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map, callback)
      } else {
        callback && callback()
      }
    },
    // 获取公共字典list
    getCommonParams (datas, callback) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
          callback && callback()
        }
      })
    },
    checkParamsList (query) {
      if (query !== '') {
        let keyValue = query.toString().trim()
        let list = JSON.parse(localStorage.getItem(this.selectObj.params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          this[this.selectObj.obj] = list.slice(0, 40)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          this[this.selectObj.obj] = filterList.slice(0, 40)
        }
      } else {
        if (!util.isEmpty(JSON.parse(localStorage.getItem(this.selectObj.params)))) {
          this[this.selectObj.obj] = JSON.parse(localStorage.getItem(this.selectObj.params)).slice(0, 40)
        }
      }
    },
    // 收集所有出发地港货目的地港的下拉参数
    collectPort (arr) {
      let tempArr1 = []
      let tempArr2 = []
      arr.forEach(v => {
        let temp = v.quotationFeeVO
        tempArr1.push(...temp['departure'])
        tempArr2.push(...temp['destination'])
      })
      let obj = {
        dep: [...new Set(tempArr1)],
        des: [...new Set(tempArr2)]
      }
      return obj
    },
    // 专门处理初始化港口的下拉列表
    checkParamsListByArray (arr, flag) {
      let obj = this.collectPort(arr)
      let list = JSON.parse(localStorage.getItem('SAAS_TJ_PORT'))
      if (!list) return
      let newArr = []
      obj[flag].forEach(v => {
        let temp = list.filter(item => item.codeField === v)
        newArr.push(...temp)
      })
      return newArr
    },
    // 日期校验
    validDate (rule, value, callback) {
      if (!value || value.length === 0) {
        callback(new Error('请选择有效期'))
      } else {
        callback()
      }
    },
    // 提交按钮
    submitBtn () {
      let flag1 = true
      this.$refs['submitData'].validate((valid) => {
        if (!valid) flag1 = false
      })
      if (!flag1) return
      let subData = JSON.parse(JSON.stringify(this.submitData))
      let dateArray = JSON.parse(JSON.stringify(this.submitData.quotationHeadVO.dates))
      subData.quotationHeadVO.dates = ''
      subData.quotationHeadVO.startDate = dateArray[0]
      subData.quotationHeadVO.endDate = dateArray[1]
      // impexpPortcdNames dclPlcCuscdNames departure destination数组转换成字符串
      this.arrayAndString(subData.quotationPayableBodyVOList, 'string')
      this.arrayAndString(subData.quotationReceivableBodyVOList, 'string')
      if (this.quotationId) { // 编辑
        subData.quotationHeadVO.quotationId = this.quotationId
        this.editQuotation(subData)
        return
      }
      this.createQuotation(subData)
    },
    // 创建报价
    createQuotation (subData) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/quotation/create',
        data: subData,
        router: this.$router,
        success: ({result}) => {
          this.quotationId = result
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.closeCurrentTab('offerManage-list')
        }
      })
    },
    // 编辑报价
    editQuotation (subData) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/quotation/edit',
        data: subData,
        router: this.$router,
        success: ({result}) => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          let tabId = this.$route.name + this.$route.query.quotationId
          this.closeCurrentTab('offerManage-list', tabId)
        }
      })
    },
    // 查询报价详情
    queryOptionsDetail (id) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/quotation/get',
        data: {
          quotationId: id
        },
        router: this.$router,
        success: ({result}) => {
          if (result) { // 数据处理
            this.setDefaultCurr(result.quotationPayableBodyVOList)
            this.setDefaultCurr(result.quotationReceivableBodyVOList)
            this.arrayAndString(result.quotationPayableBodyVOList, 'array')
            this.arrayAndString(result.quotationReceivableBodyVOList, 'array')
            let tempPay = JSON.parse(JSON.stringify(result.quotationPayableBodyVOList))
            let tempReceive = JSON.parse(JSON.stringify(result.quotationReceivableBodyVOList))
            this.departureList = this.checkParamsListByArray([...tempPay, ...tempReceive], 'dep')
            this.destinationList = this.checkParamsListByArray([...tempPay, ...tempReceive], 'des')
            let {quotationHeadVO: {startDate, endDate}} = result
            result.quotationHeadVO.dates = [startDate, endDate]
            this.submitData = result
            // 初始化其他下拉框数据
            this.initSelected(this.selectDown, 'origin')
          }
        }
      })
    },
    // 取消按钮
    cancelQuotation () {
      this.submitData = JSON.parse(JSON.stringify(this.copysubmitData))
      this.$refs['submitData'].clearValidate()
      // 编辑页跳转过来
      if (this.editOp) {
        this.submitData.quotationHeadVO.quotationId = this.quotationId
      } else {
        this.quotationId = ''
      }
    },
    // 拷贝模板
    copyData () {
      this.copysubmitData = JSON.parse(JSON.stringify(this.submitData))
    },
    // 企业查询
    getcorps (query) {
      if (query.length < 2 || query.length > 30) return
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: query,
          returnProps: ['corpId', 'corpName']
        },
        router: this.$router,
        success: ({result}) => {
          this.corpList = (result && result.splice(0, 20)) || []
        }
      })
    },
    // 同时获取企业名称及id,绑定企业对象信息
    translatecorp () {
      let tempInput = this.submitData.quotationHeadVO
      if (tempInput.entrustCompanyName) { // 防止为null的情况
        if (typeof tempInput.entrustCompanyName === 'object') {
          this.submitData.quotationHeadVO.entrustCompanyId = tempInput.entrustCompanyName.corpId
          this.submitData.quotationHeadVO.entrustCompanyName = tempInput.entrustCompanyName.corpName
        } else { // 自己手动输入
          this.submitData.quotationHeadVO.entrustCompanyId = ''
        }
      } else {
        this.submitData.quotationHeadVO.entrustCompanyId = ''
        this.submitData.quotationHeadVO.entrustCompanyName = ''
      }
    },
    // 将返回的模板中币制为null的话,职位CNY(没有填写报价项就保存了)
    setDefaultCurr (arr, curr = 'CNY') {
      arr.forEach(v => {
        // 出口
        if (v.feeOptionExportVOs && v.feeOptionExportVOs.length === 1) {
          if (!v.feeOptionExportVOs[0]['curr']) {
            v.feeOptionExportVOs[0]['curr'] = 'CNY'
          }
        }
        // 进口
        if (v.feeOptionImportVOs && v.feeOptionImportVOs.length === 1) {
          if (!v.feeOptionImportVOs[0]['curr']) {
            v.feeOptionImportVOs[0]['curr'] = 'CNY'
          }
        }
      })
    },
    // 将数组对象中,每个键值如果是数组,转换成字符串,或反之
    arrayAndString (arr, type) {
      arr.forEach(item => {
        let v = item.quotationFeeVO
        for (let k in v) {
          // 转换成字符串
          if (type === 'string') {
            if (Array.isArray(v[k])) {
              v[k] = v[k].join(';')
            }
          }
          // 转换成数组
          if (type === 'array') {
            if (typeof v[k] === 'string') {
              if (v[k].indexOf(';') > 0) {
                v[k] = v[k].split(';')
              } else { // 为字符串
                v[k].length > 0 && (v[k] = [v[k]])
              }
            }
          }
        }
      })
      return arr
    },
    // 获取费用名称下拉列表
    getOptionList () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/option/getAll',
        data: '',
        router: this.$router,
        success: ({result}) => {
          this.optionsList = result || []
        }
      })
    },
    // 选择费用名称时获取对应的费率
    getFeeRate (item, prop) {
      if (!item.feeOptionName) {
        item.feeRate = ''
        item.feePid = ''
        item.feePrice = ''
        item.curr = 'CNY'
        item.unit = ''
        item.rateIsDisabled = false
        this.$refs['submitData'].clearValidate(prop)
        return
      }
      let obj = this.optionsList.find(v => v.feeOptionName === item.feeOptionName)
      item.feeRate = obj.feeRate
      item.feePid = obj.feePid
      item.rateIsDisabled = true
      // 其余4项做必填项校验
    },
    // 初始化下拉框数据除港口之外
    initSelected (selectData, list) {
      if (list === 'origin') {
        list = {
          dclPlcCuscdNames: ' ',
          impexpPortcdNames: ' ',
          // curr: ' ',
          unit: ' '
        }
      }
      Object.keys(list).forEach(v => {
        if (list[v] && selectData[v]) { // 存在下拉选项
          this.selectObj = {
            obj: selectData[v]['downList'],
            params: selectData[v]['params']
          }
          // this.checkParamsList(list[v])
          if (!util.isEmpty(JSON.parse(localStorage.getItem(this.selectObj.params)))) {
            this[this.selectObj.obj] = JSON.parse(localStorage.getItem(this.selectObj.params)).slice(0, 40)
          }
        }
      })
    },
    // 关闭当前页签并跳转
    closeCurrentTab (name, tabId) {
      this.$store.dispatch('CloseTab', tabId || this.$route.name)
      this.$router.push({
        name: name,
        query: {
          from: 'other'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .baseInfo,
  .acceptOffer {
    background-color: #fff;
    padding: 18px 18px 8px;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      color: #4c4c4c;
      margin-bottom: 18px;
    }
    .el-row {
      margin-left: 0!important;
      margin-right: 0!important;
    }
  }
  .baseInfo {
    .el-row {
      .el-col:nth-child(1) {
        padding-left: 18px!important;
      }
    }
  }
  .acceptOffer {
    .el-row {
      .el-col:nth-child(1) {
        padding-left: 0!important;
      }
    }
  }
  .ei-line {
    padding-right: 16px;
  }
  .delete-icon img,
  .deleteBody img {
    display: block;
  }
  .deleteBody {
    cursor: pointer;
    position: absolute;
    right: -1px;
    top: -1px;
    width: 20px;
    height:20px;
  }
  .export .delete-icon ,
  .import .delete-icon {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 7px;
    width: 16px;
    height:16px;
    transform: translateX(50%)
  }
  .margin_0 {
    margin: 0!important;
    width: 100%;
  }
  .base-line-one {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 8px;
    }
  }
  .originInfo {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 15px;
    }
  }
  .acceptOffer {
    .accept-body {
      &:nth-child(2) .deleteBody{
        display: none;
      }
      border: 1px solid #d8d8d8;
      padding: 18px;
      margin-bottom: 18px;
      .base-line {
        border-bottom: 1px solid #d8d8d8;
        margin: 0!important;
      }
      .padding_0 {
        padding-left:0!important;
      }
      .title-flag {
        margin: 15px 0!important;
        padding-left: 8px;
        border-left: 2px solid #287FCA;
        line-height: 13px;
      }
    }
    // Add_more
    .addMore {
      padding: 6px 10px 6px 28px;
      background: url("../../../../assets/img/Add_more.png") no-repeat;
      background-position: 10px 7px;
      background-color: #F3F6F6;
      color: #4c4c4c;
      &:hover {
        color: #4c4c4c;
        border-color: #DCDFE6;
      }
    }
    .moreOport {
      display: inline-block;
      color: #fff;
      border-radius: 4px;
      padding: 6px 18px;
      background-color: #2780CA;
      margin-bottom: 18px;
      cursor: pointer;
    }
    .import>.ei-line:nth-child(2) .delete-icon,
    .export>.ei-line:nth-child(2) .delete-icon{
      display: none;
    }
    .import,
    .export {
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 16px;
      }
    }
  }
</style>
