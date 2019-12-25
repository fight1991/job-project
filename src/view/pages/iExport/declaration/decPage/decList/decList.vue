<template>
<!-- 其表体组件 -->
  <section>
    <!--- table 开始  -->
    <div class = "dec-div" >
      <el-row>
        <el-button size="mini" icon="fa fa-sign-in" class="secondButton" :disabled="controller.isDisabled || bodyController.importIsDisabled || controller.cDisabled || controller.isWholeDec" @click="openImport">&nbsp;导入</el-button>
        <el-button size="mini" icon="fa fa-plus" class="secondButton" :disabled="controller.isDisabled || bodyController.refreshIsDisabled || controller.cDisabled || controller.isWholeDec"  @click="refreshDecList">&nbsp;新增</el-button>
        <el-button size="mini" icon="fa fa-trash-o" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec"  @click="delDecList" >&nbsp;删除</el-button>
        <el-button size="mini" icon="fa fa-copy" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec" @click="copyDecList">&nbsp;复制</el-button>
        <el-button size="mini" icon="fa fa-arrow-up" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec" @click="moveUpDecList">&nbsp;上移</el-button>
        <el-button size="mini" icon="fa fa-arrow-down" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec" @click="downUpDecList">&nbsp;下移</el-button>
        <el-button size="mini" icon="fa fa-level-down" class="secondButton" :disabled="controller.isDisabled || bodyController.insertIsDisabled || controller.cDisabled || controller.isWholeDec" @click="insertDecList">&nbsp;插入</el-button>
        <el-button size="mini" class="secondButton" :disabled="controller.isDisabled || bodyController.reClassifyIsDisabled || controller.cDisabled" @click="reClassify">重新归类</el-button>
        <el-button size="mini" class="secondButton"  @click="lookClassify">归类查看</el-button>
        <el-button size="mini" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec" @click="BulkEditing">批量修改</el-button>
        <!-- <el-button size="mini" class="secondButton"  @click="openSuppDec">补充申报</el-button> -->
        <el-button size="mini" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec" @click="openHistoryGoods">使用商品库数据</el-button>
        <el-button size="mini" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec" v-show='bodyController.isJinEr' @click="modifyGModel">智能补录</el-button>
        <el-button size="mini" class="secondButton" :disabled="controller.isDisabled || controller.isWholeDec"  @click="checkPrice">价格检查</el-button>
        <el-checkbox v-model="isCheckbox" @change='checkboxChange'></el-checkbox>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-table
          v-if='bodyShow'
          ref="decListTable"
          :data="tableList"
          highlight-current-row
          :height='230'
          style="width: 100%"
          size="mini" border
          :header-cell-style = 'getHeadstyle'
          :tooltip-effect="'light'"
          :row-class-name="tableRowClassName"
          @keydown.native='changeBody'
          @select="decListCheckChange"
          @selection-change="decListChange"
          @row-click='rowClickDecList'
          @header-click='headerClick'
          class="table-checkbox">
            <el-table-column min-width="50" label="单选" v-if='!isCheckbox'>
              <template slot-scope="scope">
                <el-radio v-model="bodyListRadio" @click.native.prevent.stop='checkThisBody(scope.$index)' :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column type='selection' width="37" align="center" v-else></el-table-column>
            <el-table-column prop="gNo" label="项号" width="55"></el-table-column>
            <el-table-column prop="contrItem" label="备案序号" min-width="80"></el-table-column>
            <el-table-column prop="codeTs" label="商品编号" min-width="100">
              <template slot="header">
                <el-tooltip class="item" effect="dark" content="单击表头支持批量粘贴" placement="top-end">
                <span>商品编号</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.codeTs" class="decListInner" v-if="currentOpProperty === 'codeTs'" :ref="'codeTs_' + scope.$index" @paste.native.capture.prevent="pasted" @blur="currentOpProperty =''"></el-input>
                <template v-else>
                  {{scope.row.codeTs}}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="ciqName" label="检验检疫名称" min-width="180"></el-table-column>
            <el-table-column prop="gName" label="商品名称" min-width="200">
              <template slot="header">
                <el-tooltip class="item" effect="dark" content="单击表头支持批量粘贴" placement="top-end">
                <span>商品名称</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.gName" class="decListInner" v-if="currentOpProperty === 'gName'" :ref="'gName_' + scope.$index" @paste.native.capture.prevent="pasted" @blur="currentOpProperty =''"></el-input>
                <template v-else>
                  {{scope.row.gName}}
                </template>
              </template></el-table-column>
            <el-table-column prop="gModel" label="规格" min-width="200"></el-table-column>
            <el-table-column prop="gQty" label="成交数量" min-width="100">
              <template slot="header">
                <el-tooltip class="item" effect="dark" content="单击表头支持批量粘贴" placement="top-end">
                <span>成交数量</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.gQty" class="decListInner" v-if="currentOpProperty === 'gQty'" :ref="'gQty_' + scope.$index" @paste.native.capture.prevent="pasted" @blur="currentOpProperty =''"></el-input>
                <template v-else>
                  {{scope.row.gQty}}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="gUnitValue" label="成交单位" min-width="80"></el-table-column>
            <el-table-column prop="declPrice" label="单价" min-width="80"></el-table-column>
            <el-table-column prop="declTotal" label="总价" min-width="100">
              <template slot="header">
                <el-tooltip class="item" effect="dark" content="单击表头支持批量粘贴" placement="top-end">
                <span>总价</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.declTotal" class="decListInner" v-if="currentOpProperty === 'declTotal'" :ref="'declTotal_' + scope.$index" @paste.native.capture.prevent="pasted" @blur="currentOpProperty =''"></el-input>
                <template v-else>
                  {{scope.row.declTotal}}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="tradeCurrValue" label="币制" min-width="100"></el-table-column>
            <el-table-column prop="originCountryValue" label="原产国(地区)" min-width="100"></el-table-column>
            <el-table-column prop="destinationCountryValue" label="最终目的国" min-width="100"></el-table-column>
            <el-table-column prop="dutyModeValue" label="征免方式" min-width="80"></el-table-column>
            <el-table-column prop="conMaView" label="监管要求" width="80"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!--- table 结束  -->
    <div class="dec-div" :style="'padding-bottom:'+(controller && controller.fromPage === 'reviewed'? '62px' : '24px')">
      <el-form ref="bodyRuleForm" :rules="bodyRuleForm" @keyup.enter.native="switchFoucsByEnter"  :model="decList"  label-width="100px" size="mini">
          <el-row  >
            <el-col :span="6">
              <el-form-item label="项号" :class='aiColors[bodyAiColor.gNo]'>
                <el-input v-inputMax v-model="decList.gNo"
                    ref="gNo" dataRef ='gNo'
                    :class="{'error-color': errorColor.gNo }"
                    readonly
                    @focus="tipsFillMessage('gNo')" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备案序号" :class='aiColors[bodyAiColor.contrItem]'>
                <el-input v-inputMax v-model="decList.contrItem"
                    dataRef ='contrItem' ref="contrItem"
                    :class="{'error-color': errorColor.contrItem }"
                    :readonly="bodyController.contrItemDisabled || controller.cDisabled"
                    @focus="tipsFillMessage('contrItem')"
                    @blur="selectBookBody($event)" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品编号"  prop="codeTs" :class='aiColors[bodyAiColor.codeTs]'>
                <el-input v-inputMax v-model="decList.codeTs" :maxlength="10"
                    dataRef='codeTs' ref="codeTs"
                    :class="{ 'require-color': controller.requireColor, 'error-color': errorColor.codeTs }"
                    :readonly="controller.isDisabled || controller.cDisabled  || controller.codeTsDisabled"
                    @focus="tipsFillMessage('codeTs')"
                    @input="codeTsChangeF"
                    enter = 'no' >
                    <i class="el-icon-search i-class" v-show='!controller.isWholeDec'
                      slot="suffix" title = '归类检查'
                      @click="intelligentCheck">
                    </i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检验检疫名称">
                <el-col :span="21" >
                  <el-input v-inputMax v-model="decList.ciqName"
                    dataRef ='ciqName'
                    :class="{'error-color': errorColor.ciqName }"
                    readonly
                    @keydown.native ="cancelCiqName">
                  </el-input>
                  <div class='shade-div' @click ="cancelCiqName"></div>
                </el-col>
                <el-col :span="3">
                  <el-button class="btn-pop" icon="fa fa-ellipsis-h" :disabled='controller.isWholeDec' @click="openEncodeTableContent"></el-button>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="8">
              <el-form-item label="商品名称" prop="gName" :class='aiColors[bodyAiColor.gName]'>
                <el-input  v-inputMax v-model="decList.gName" :maxlength="255"
                    dataRef='gName' ref="gName"
                    :class="{ 'require-color': controller.requireColor, 'error-color': errorColor.gName }"
                    :readonly="controller.isDisabled || controller.cDisabled || controller.isWholeDec"
                    @focus="tipsFillMessage('gName')">
                    <i class="el-icon-set-up i-class" v-show='!controller.isWholeDec'
                      slot="suffix" title = '智能归类'
                      @click="intelligentGoods($event)">
                    </i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格型号" :class='aiColors[bodyAiColor.gModel]'>
                <el-input v-inputMax v-model="decList.gModel"
                    :class="{'error-color': errorColor.gModel }"
                    :readonly='gModelController'
                    ref='gModel' dataRef ='gModel'
                    @focus="tipsFillMessage('gModel')">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="监管要求">
                <el-input v-inputMax v-model="decList.controlMa" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="5">
              <el-form-item label="成交数量" prop="gQty" :class='aiColors[bodyAiColor.gQty]'>
                <el-input v-inputMax  v-model="decList.gQty" :maxlength="20"
                    ref="gQty" dataRef ='gQty'
                    :class="{ 'require-color': controller.requireColor, 'error-color': errorColor.gQty }"
                    :readonly="controller.isDisabled || controller.isWholeDec"
                    @focus="tipsFillMessage('gQty')"
                    @input="gQtyChangeF"
                    @blur="gQtyBlur"
                    enter='no'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="成交计量单位"
              :class='[aiColors[bodyAiColor.gUnit], errorColor.gUnit ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
              >
                <el-select v-inputMax placeholder=" " v-model="decList.gUnit"
                    @focus="tipsFillMessage('gUnit', 'saasUnit1','SAAS_UNIT')"
                    @clear="clearSelct('saasUnit1')"
                    :remote-method="checkParamsList"
                    ref="gUnit" dataRef ='gUnit'
                    remote default-first-option clearable filterable
                    :disabled="controller.isDisabled || controller.gUnitReadonly || controller.cDisabled || controller.isWholeDec"
                    style="width:100%">
                    <el-option
                      v-for="item in saasUnit1"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="单价"  prop="declPrice" :class='aiColors[bodyAiColor.declPrice]' label-width="50px">
                <el-input v-inputMax
                    v-model="decList.declPrice" :maxlength="19"
                    :class="{ 'require-color': controller.requireColor, 'error-color': errorColor.declPrice }"
                    @focus="tipsFillMessage('declPrice')"
                    ref="declPrice" dataRef ='declPrice'
                    @input="decPriceChangeF"
                    @blur="computTotal('1')"
                    :readonly="controller.isDisabled || controller.cDisabled">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="总价" prop="declTotal" :class='aiColors[bodyAiColor.declTotal]' label-width="50px">
                <el-input v-inputMax
                    :class="{ 'require-color': controller.requireColor, 'error-color': errorColor.declTotal }"
                    :maxlength="18" v-model="decList.declTotal"
                    @focus="tipsFillMessage('declTotal')"
                    ref="declTotal" dataRef ='declTotal'
                    @input="totalChangeF"
                    @blur="computPrice"
                    :readonly="controller.isDisabled || controller.cDisabled">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="币制" label-width="50px" prop="tradeCurr"
              :class='[aiColors[bodyAiColor.tradeCurr], errorColor.tradeCurr ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
               >
                <el-select v-inputMax placeholder=" " v-model="decList.tradeCurr"
                    @focus="tipsFillMessage('tradeCurr', 'saasCurr4','SAAS_CURR')"
                    @clear="clearSelct('saasCurr4')"
                    remote clearable filterable default-first-option
                    :remote-method="checkParamsList"
                    ref="tradeCurr" dataRef ='tradeCurr'
                    :disabled="controller.isDisabled || controller.cDisabled || controller.isWholeDec"
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
          <el-row  >
            <el-col :span="5">
              <el-form-item label="法定第一数量" prop="qty1" :class='aiColors[bodyAiColor.qty1]'>
                <el-input v-inputMax v-model="decList.qty1" :maxlength="20"
                    :class="{ 'require-color': controller.requireColor, 'error-color': errorColor.qty1 }"
                     ref="qty1" dataRef ='qty1'
                    @focus="tipsFillMessage('qty1')"
                    :readonly="controller.isDisabled">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="法定第一计量单位"
              :class='[aiColors[bodyAiColor.unit1], errorColor.unit1 ? "error-color" : ""]'>
                <el-select v-inputMax placeholder=" " v-model="decList.unit1"
                    @focus="tipsFillMessage('unit1', 'saasUnit2','SAAS_UNIT')"
                    remote  default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasUnit2')"
                    ref="unit1" dataRef ='unit1'
                    disabled style="width:100%">
                    <el-option
                      v-for="item in saasUnit2"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="加工成品单耗版本号" :class='aiColors[bodyAiColor.exgVersion]' label-width="120px"  prop="exgVersion" >
                <el-input v-inputMax v-model="decList.exgVersion" :maxlength="8"
                    :class="{ 'error-color': errorColor.exgVersion }"
                    @focus="tipsFillMessage('exgVersion')"
                    ref="exgVersion" dataRef ='exgVersion'
                    @input='decCheckInt("exgVersion", 8)'
                    :readonly="controller.isDisabled">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="货号" :class='aiColors[bodyAiColor.exgNo]' label-width="50px">
                <el-input v-inputMax v-model="decList.exgNo"  :maxlength="30"
                    :class="{ 'error-color': errorColor.exgNo }"
                     ref="exgNo" dataRef ='exgNo'
                    @focus="tipsFillMessage('exgNo')"
                    :readonly="controller.isDisabled">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="最终目的国(地区)" prop="destinationCountry"
              :class='[aiColors[bodyAiColor.destinationCountry], errorColor.destinationCountry ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
              >
                <el-select v-inputMax placeholder=" " v-model="decList.destinationCountry"
                    @focus="tipsFillMessage('destinationCountry', 'saasCountry3','SAAS_COUNTRY')"
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasCountry3')"
                    ref="destinationCountry" dataRef ='destinationCountry'
                    :disabled="controller.isDisabled" style="width:100%">
                    <el-option
                      v-for="item in saasCountry3"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="5">
              <el-form-item label="法定第二数量" :class='aiColors[bodyAiColor.qty2]'  prop="qty2">
                <el-input v-inputMax v-model="decList.qty2" :maxlength="20"
                    :class="{ 'error-color': errorColor.qty2 }"
                     ref="qty2" dataRef ='qty2'
                    @focus="tipsFillMessage('qty2')"
                    :readonly="bodyController.qty2Disabled || controller.isDisabled">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="法定第二计量单位"
                :class='[aiColors[bodyAiColor.unit2], errorColor.unit2 ? "error-color" : ""]'>
                <el-select v-inputMax placeholder=" " v-model="decList.unit2"
                    @focus="tipsFillMessage('unit2', 'saasUnit3','SAAS_UNIT')"
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasUnit3')"
                    ref="unit2" dataRef ='unit2'
                    @change="unit2Change"
                    disabled
                    style="width:100%">
                    <el-option
                      v-for="item in saasUnit3"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="controller.iEFlag == 'I' ? 7 :14" >
              <el-form-item label="原产国(地区)"
              :class='[aiColors[bodyAiColor.originCountry], errorColor.originCountry ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
               prop="originCountry">
                <el-select v-inputMax placeholder=" " v-model="decList.originCountry"
                    @focus="tipsFillMessage('originCountry', 'saasCountry4','SAAS_COUNTRY')"
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasCountry4')"
                    ref="originCountry" dataRef ='originCountry'
                    :disabled="controller.isDisabled || controller.cDisabled || controller.isWholeDec" style="width:100%">
                    <el-option
                      v-for="item in saasCountry4"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-if="controller.iEFlag == 'I'">
              <el-form-item label="原产地区" :class='aiColors[bodyAiColor.origPlaceCode]'>
                  <el-select v-inputMax placeholder=" " v-model="decList.origPlaceCode "
                  @focus="tipsFillMessage('origPlaceCode', 'saasCiqOriginPlace','SAAS_CIQ_ORIGIN_PLACE')"
                  remote default-first-option clearable filterable
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCiqOriginPlace')"
                  ref="origPlaceCode" dataRef ='origPlaceCode'
                  :disabled="controller.isDisabled" style="width:100%">
                  <el-option
                    v-for="item in saasCiqOriginPlace"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="3">
              <el-button class="btn-pop"  :icon="isShowText2" size='mini' @click="changeIsShow2"></el-button>
            </el-col>
            <el-col :span="3">
              <el-form-item >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="controller.iEFlag == 'I' ? '境内目的地' :'境内货源地'"
                :class='[bodyAiColor.districtCode === 0 ? aiColors[bodyAiColor.districtCode] : aiColors[bodyAiColor.destCode] ]'>
                <el-col :span="12">
                  <el-form-item  prop="districtCode"
                  :class='[aiColors[bodyAiColor.districtCode], errorColor.districtCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
                  >
                    <el-select  v-inputMax  v-model="decList.districtCode"
                        class='spical-class'
                        @focus="tipsFillMessage('districtCode', 'saasDistrictRel','SAAS_DISTRICT_REL')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasDistrictRel')"
                        ref="districtCode" dataRef ='districtCode'
                        clearable filterable :placeholder="controller.iEFlag == 'I' ?  '境内目的地代码' : '境内货源地代码'" :disabled="controller.isDisabled" style="width:100%">
                        <el-option
                          v-for="item in saasDistrictRel"
                          :key="item.codeField"
                          :showLabel="showCustomsCode? '' : item.nameField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="destCode"
                    :class='[aiColors[bodyAiColor.destCode], errorColor.destCode ? "error-color" : ""]'>
                    <el-select v-inputMax v-model="decList.destCode" :placeholder="controller.iEFlag == 'I' ?  '目的地代码' : '产地代码'"
                        class='spical-class'
                        @focus="tipsFillMessage('destCode', 'saasCiqCityCn','SAAS_CIQ_CITY_CN')"
                        :class="{ 'require-color': controller.requireColor && controller.iEFlag == 'I' }"
                        remote default-first-option clearable  filterable
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasCiqCityCn')"
                        ref="destCode" dataRef ='destCode'
                        :disabled="controller.isDisabled" style="width:100%">
                        <el-option
                          v-for="item in saasCiqCityCn"
                          :key="item.codeField"
                          :showLabel="showCustomsCode? '' : item.nameField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="征免方式"
              :class='[aiColors[bodyAiColor.dutyMode], errorColor.dutyMode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
              prop="dutyMode">
                <el-select v-inputMax placeholder=" " v-model="decList.dutyMode" enter="no"
                    @focus="tipsFillMessage('dutyMode', 'saasLevymode','SAAS_LEVYMODE')"
                    remote  default-first-option clearable  filterable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasLevymode')"
                    ref="dutyMode" dataRef ='dutyMode'
                    :disabled="controller.isDisabled" style="width:100%">
                    <el-option
                      v-for="item in saasLevymode"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-show="isShow2" >
            <el-row  >
              <el-col :span="18">
                <el-form-item label="检验检疫货物规格" >
                  <el-col :span="23">
                    <el-input v-inputMax v-model="showGoodsSpec" @focus="tipsFillMessage('showGoodsSpec')" readonly></el-input>
                  </el-col>
                  <el-col :span="1">
                    <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodsSpecContent"></el-button>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item >
                  <el-button type="primary" class="w-100" @click="openfilingInfoContent">产品资质</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="9">
                <el-form-item label="货物属性">
                  <el-col :span="21">
                    <el-input v-inputMax v-model="showGoodsAttrValue"  @focus="tipsFillMessage('showGoodsAttrValue')" readonly></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodAtrrContent"></el-button>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="用途"  :class="{ 'require-color': controller.requireColor }"  prop="purpose">
                  <el-select v-inputMax placeholder=" " v-model="decList.purpose"
                    @focus="tipsFillMessage('purpose', 'saasUserTo','SAAS_USER_TO')"
                    remote default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasUserTo')"
                    dataRef ='purpose'  ref="purpose"
                    clearable  filterable :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)" style="width:100%"
                    >
                  <el-option
                    v-for="item in saasUserTo"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item >
                  <el-button type="primary" class="w-100" @click="openDangerGoods">危险货物信息</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
      </el-form>
      <div class='dec-ai-table' v-if='$route.query.aiType'>
        <table style='width: 100%;'>
          <tr>
            <th colspan="2" >
              净重
            </th>
            <th colspan="3">
              总价
            </th>
          </tr>
          <tr>
            <td width='25%'>报关单净重</td>
            <td width='25%'>Packing list</td>
            <td width='20%'>币制</td>
            <td width='15%'>报关单金额</td>
            <td width='15%'>Inovice</td>
          </tr>
          <tr>
            <td width='25%'>{{decNet}}</td>
            <td width='25%'>{{PLNet}}</td>
            <td width='20%'>{{computSum.curr}}</td>
            <td width='15%'>{{computSum.totalPrice}}</td>
            <td width='15%'>{{inoviceTotalPrice}}</td>
          </tr>
        </table>
      </div>
    </div>
    <el-popover v-if="popoverVisible" v-model="popoverVisible"  trigger="auto" width="300" placement="right-start" :reference="reference">
        <error-tips :approvalOpinions="bodyCheckTips[currentShowField + 'Note']" :headClomn ="currentShowField + 'Note'"  @close:errorTips='closeErrorTips'></error-tips>
    </el-popover>

    <!-- 弹出框 报关单表体导入 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="商品导入"
      :visible.sync="importCompnentVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      class="sys-dec-class"
      width="640px">
       <execl-import :initParams="initImport" @cancLeData="closeImportCompnent" @backData="receptionImportData"  v-if="importCompnentVisible"></execl-import>
    </el-dialog>
    <!-- 弹出框 报关单表体导入 结束 -->
    <!-- 弹出框 商品规范申报-商品申报要素 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="商品规范申报-商品申报要素"
      :visible.sync="elementVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-loading="$store.state.loading"
      v-dialogDrag
      width="640px">
      <decelement-view :datas="decElementPara" @submitdatas="backDecListSpace" @closedecele="cancleElement" v-if="elementVisible"></decelement-view>
    </el-dialog>
    <!-- 弹出框 商品规范申报-商品申报要素 结束 -->
    <!-- 弹出框 批量修改 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="批量修改"
      :visible.sync="BulkEditingVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-dialogDrag
      :show-close='false'
      width="640px">
       <revise-view :decParams="BulkEditingList"  @close:reviseView="backReviseView" v-if="BulkEditingVisible"></revise-view>
    </el-dialog>
    <!-- 弹出框 批量修改 结束 -->
    <!-- 弹出框 历史商品数据 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="历史商品数据"
      :visible.sync="historyGoodsVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='true'
      v-dialogDrag
      width="900px">
       <history-goods :initParams="initHistory"  @backDatas="historyGoodsData"  @cancLeData="historyGoodsCompnent"  v-if="historyGoodsVisible"></history-goods>
    </el-dialog>
    <!-- 修改单价总价 -->
    <modify-price :modifyPriceVisible.sync='modifyPriceVisible'  @close:modifyPrice="backModifyPrice"></modify-price>
    <!-- 商品列表 -->
    <goods-info :productListVisible='productListVisible' :isDisabled='controller.isDisabled' :productList="productList"  @close:goodsInfo="saveGoodsInfo"></goods-info>
    <!-- 检验检疫商品列表 -->
    <ciq-goods :encodeTableVisible.sync='encodeTableVisible' :isDisabled='controller.isDisabled' :encodeTableList="encodeTableList"  @close:ciqGoods="saveCiqGoods"></ciq-goods>
    <!-- 货物属性 -->
    <goods-attribute :goodsAttrVisible='goodsAttrVisible' :goodsAttrCollection="goodsAttrCollection" :saasGoodsAttr="saasGoodsAttr" :isDisabled='controller.isDisabled' :isWholeDec='controller.isWholeDec' :isCIQ = 'controller.isCIQ' @close:goodsAttribute="backGoodsAttr"></goods-attribute>
    <!-- 检验检疫货物规格 -->
    <goods-specifications :goodsSpecVisible.sync='goodsSpecVisible' :iEFlag='controller.iEFlag' :goodsSpecInfo="goodsSpecForm" :isDisabled='controller.isDisabled'  @close:goodsSpecifications="saveGoodsSpec"></goods-specifications>
     <!-- 危险货物信息 -->
    <danger-goods :dangerGoodsVisible.sync='dangerGoodsVisible' :dangerInfo="dangerForm" :isDisabled='controller.isDisabled'  @close:dangerGoods="backDangerGoods" :showCustomsCode="showCustomsCode" :moduleName="moduleName"></danger-goods>
     <!-- 产品许可证/审批/备案信息 -->
    <product-license  :filingInfoVisible='filingInfoVisible' :decList="decList" :controller='controller'  @close:productLicense="backProductLicense" :moduleName="moduleName"></product-license>
    <!-- 智能归类 -->
    <classify-Goods :classifyGoodsVisible.sync='classifyGoodsVisible' :iEFlag='controller.iEFlag' :gName='decList.gName'  @close:classifyGoods="backClassifyGoods"></classify-Goods>
  </section>
</template>
<script>
import util from '@/common/util.js'
import decUtil from '../common/decUtil'
import decBus from '../common/bus.js'
import businessUtil from '../common/businessUtil'
import ciqGoods from './components/ciqGoods'
import goodsAttribute from './components/goodsAttribute'
import goodsSpecifications from './components/goodsSpecifications'
import goodsInfo from './components/goodsInfo'
import productLicense from './components/productLicense'
import dangerGoods from './components/dangerGoods'
import decelementView from './components/decelement'
import modifyPrice from './components/modifyPrice'
import reviseView from './components/revise'
import historyGoods from './components/historyGoods'
import execlImport from '../../../declaration/component/execImport.vue'
import classifyGoods from './components/classifyGoods'
import errorTips from '../components/errorTips'

export default {
  name: 'dec-list',
  components: {
    ciqGoods,
    goodsAttribute,
    goodsSpecifications,
    goodsInfo,
    productLicense,
    dangerGoods,
    decelementView,
    modifyPrice,
    reviseView,
    historyGoods,
    classifyGoods,
    execlImport,
    errorTips
  },
  props: {
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      supportEditProperty: ['declTotal', 'gQty', 'gName', 'codeTs'],
      currentOpProperty: '',
      popoverVisible: false,
      currentShowField: '',
      currentShowNoteField: '',
      reference: '',
      decList: businessUtil.generateDecBody(),
      tableList: [], // 报关单表体列表
      checkedTableList: [], // 报关单表体列表 被选中的数据
      bodyListRadio: '',
      isCheckbox: false,
      codeTsChange: false, // 判断 商品编号值是否发生改变
      gModelController: true,
      initImport: {}, // 存放导入初始化参数数据
      importCompnentVisible: false, // 表体导入弹出框显示设置
      bodyShow: true,
      classifyGoodsVisible: false,
      checkedgoods: {}, // 记录 当即选择的商品 以便编辑申报要
      decElementPara: {
        checkedgoods: '', // 商品数据
        opeType: '', // 操作类型 add 新增  edit 编辑  look 查看
        gModel: '', // 规格型号
        iEFlag: '', // 进出口标志 I 进口 E 出口
        gName: '',
        gtin: '' // gtin码
      },
      bodyController: {
        importIsDisabled: false,
        refreshIsDisabled: false,
        insertIsDisabled: false,
        reClassifyIsDisabled: false,
        gUnitReadonly: false,
        contrItemDisabled: true,
        isJinEr: false,
        qty2Disabled: true // 第二法定数量
      },
      showGoodsSpec: '', // 货物规格
      showGoodsAttrValue: '', // 货物属性
      supplementFlag: false, // 判断是否从补充申报查询界面过来的
      elementVisible: false, // 编辑申报要素 显示控制
      BulkEditingVisible: false, // 批量修改 弹出框
      BulkEditingList: {}, // 批量修改 传入数据
      modifyPriceVisible: false, // 修改单价或者总价
      historyGoodsVisible: false, // 历史商品数据弹出框控制
      initHistory: {}, // 历史商品数据初始化
      productListVisible: false,
      productList: [],
      isShow2: false,
      isShowText2: 'fa fa-angle-double-right',
      goodsAttrCollection: [],
      goodsAttrVisible: false,
      goodsSpecVisible: false,
      goodsSpecForm: {
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
      dangerForm: {
        noDangFlag: '', // 非危险化学品/组分
        unCode: '', // UN编码
        dangName: '', // 危险货物名称
        dangPackType: '', // 危包类别
        dangPackSpec: '' // 危包规格
      },
      encodeTableVisible: false, // 检验检疫商品列表
      encodeTableList: [], // 检验检疫商品列表
      dangerGoodsVisible: false,
      filingInfoVisible: false, // 产品许可证/审批/备案信息
      isOpenElement: false, // 判断检验检疫列表选择后是否打开申报要素的录入框
      bodyRuleForm: {
        codeTs: [ //  商品编号
          {validator: this.checkListValid, message: '商品编号不能为空', trigger: 'blur'}
        ],
        gName: [ //  商品名称
          {validator: this.checkListValid, message: '商品名称不能为空', trigger: 'blur'}
        ],
        gQty: [ //  成交数量
          {validator: this.checkListValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
        ],
        declPrice: [ //  单价
          {validator: this.checkListValid, message: '输入整数最多14位，小数最多4位的非负数', trigger: 'blur'}
        ],
        declTotal: [ //  总价
          {validator: this.checkListValid, message: '输入整数最多15位，小数最多2位的非负数', trigger: 'blur'}
        ],
        qty1: [ //  法定第一数量
          {validator: this.checkListValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
        ],
        qty2: [ //  法定第二数量
          {validator: this.checkListValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
        ],
        exgVersion: [ //  加工成品单耗版本号
          {validator: this.checkListValid, message: '输入最多8位的正整数', trigger: 'blur'}
        ],
        origPlaceCode: [ //  原产地区
          {validator: this.checkListValid, message: '原产地区不能为空', trigger: 'blur'}
        ],
        districtCode: [ // 境内目的地/货源地
          {validator: this.checkListValid, message: '输入境内目的地/货源地', trigger: 'blur'}
        ],
        destCode: [ // 目的地/产地
          {validator: this.checkListValid, message: '输入目的地/产地', trigger: 'blur'}
        ],
        dutyMode: [ //  征免方式
          {validator: this.checkListValid, message: '输入征免方式', trigger: 'blur'}
        ],
        purpose: [ //  用途
          {validator: this.checkListValid, message: '输入用途', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        // 表体
        'codeTs': '^.{1,10}$', //  商品编号
        'gName': '^.{1,256}$', //  商品名称
        'gQty': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  成交数量
        'declPrice': '^\\d{1,14}(\\.\\d{1,4})?$|^$', //  单价
        'declTotal': '^\\d{1,15}(\\.\\d{1,2})?$|^$', //  总价
        'qty1': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  法定第一数量
        'qty2': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  法定第二数量
        'exgVersion': '^\\d{0,8}$', //  加工成品单耗版本号
        'origPlaceCode': '^[0-9a-zA-Z]{1,6}$|^$', // 原产地区
        'districtCode': '^[0-9a-zA-Z]{1,6}$|^$', // 境内目的地/货源地五位代码
        'destCode': '^[0-9a-zA-Z]{1,6}$|^$', // 目的地/产地代码（6位）或名称
        'dutyMode': '^[0-9a-zA-Z]{1,3}$|^$', // 征免方式
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
        'destinationCountry': {obj: 'saasCountry3', params: 'SAAS_COUNTRY'}, // 最终目的国(地区)
        'unit2': {obj: 'saasUnit3', params: 'SAAS_UNIT'}, // 法定第二计量单位
        'originCountry': {obj: 'saasCountry4', params: 'SAAS_COUNTRY'}, // 原产国(地区)
        'origPlaceCode': {obj: 'saasCiqOriginPlace', params: 'SAAS_CIQ_ORIGIN_PLACE'}, // 原产地区
        'districtCode': {obj: 'saasDistrictRel', params: 'SAAS_DISTRICT_REL'}, // '境内目的地' :'境内货源地'
        'destCode': {obj: 'saasCiqCityCn', params: 'SAAS_CIQ_CITY_CN'}, // '目的地代码' : '境内货源地代码'
        'dutyMode': {obj: 'saasLevymode', params: 'SAAS_LEVYMODE'}, // 征免方式
        'purpose': {obj: 'saasUserTo', params: 'SAAS_USER_TO'} // 用途
      },
      saasUnit1: [], // 成交计量单位
      saasCurr4: [], // 币制
      saasUnit2: [], // 法定第一计量单位
      saasCountry3: [], // 最终目的国(地区)
      saasUnit3: [], // 法定第二计量单位
      saasCountry4: [], // 原产国(地区)
      saasCiqOriginPlace: [], // 原产地区
      saasDistrictRel: [], // '境内目的地' :'境内货源地'
      saasCiqCityCn: [], // '目的地代码' : '境内货源地代码'
      saasLevymode: [], // 征免方式
      saasUserTo: [], // 用途
      saasGoodsAttr: [],
      gQtyChange: false,
      totalChange: false,
      decPriceChange: false,
      bodyCheckList: [], // 存放表体审核结果List
      bodyCheck: this.initBodyCheck(), // 存放表头审核结果 单挑商品信息
      bodyCheckTipsList: [], // 存放表体 审核的审批意见 List
      bodyCheckTips: {}, // 存放表体审核意见单条商品
      bodyVisible: {},
      tableListOther: {},
      errorColor: this.initErrorColor(),
      colorAndCheck: {
        gNo: {check: 'gNoColor', color: 'gNo'}, //
        contrItem: {check: 'contrItemColor', color: 'contrItem'}, //
        codeTs: {check: 'codeTsColor', color: 'codeTs'}, //
        ciqName: {check: 'ciqNameColor', color: 'ciqName'}, //
        gName: {check: 'gNameColor', color: 'gName'}, //
        gModel: {check: 'gModelColor', color: 'gModel'}, //
        gQty: {check: 'gQtyColor', color: 'gQty'}, //
        gUnit: {check: 'gUnitColor', color: 'gUnit'}, //
        declPrice: {check: 'declPriceColor', color: 'declPrice'}, //
        declTotal: {check: 'declTotalColor', color: 'declTotal'}, //
        tradeCurr: {check: 'tradeCurrColor', color: 'tradeCurr'}, //
        qty1: {check: 'qty1Color', color: 'qty1'}, //
        unit1: {check: 'unit1Color', color: 'unit1'}, //
        exgVersion: {check: 'exgVersionColor', color: 'exgVersion'}, //
        exgNo: {check: 'exgNoColor', color: 'exgNo'}, //
        destinationCountry: {check: 'destinationCountryColor', color: 'destinationCountry'}, //
        qty2: {check: 'qty2Color', color: 'qty2'}, //
        unit2: {check: 'unit2Color', color: 'unit2'}, //
        originCountry: {check: 'originCountryColor', color: 'originCountry'}, //
        districtCode: {check: 'districtCodeColor', color: 'districtCode'}, //
        destCode: {check: 'destCodeColor', color: 'destCode'}, //
        dutyMode: {check: 'dutyModeColor', color: 'dutyMode'} //
      },
      bodyAiColor: {},
      bodyAiColorList: [],
      aiColors: ['dec-color-red', 'dec-color-yellow', 'dec-color-black'],
      computSum: {
        decNet: 0, // 报关单的净重
        PLNet: 0, // 装箱单的净重
        curr: '-', // 报关单商品的币制
        totalPrice: 0, // 报关单商品的总价
        inoviceTotalPrice: 0 // 发票的总价
      }
    }
  },
  created () {
    decBus.getBus(this.moduleName).$on('reresetOpenElement', this.reresetOpenElement)
    decBus.getBus(this.moduleName).$on('resetGoodsEnNameList', this.resetGoodsEnNameList)
    decBus.getBus(this.moduleName).$on('focusDecList', this.focusDecList)
    decBus.getBus(this.moduleName).$on('setManualGoods', this.setManualGoods)
    decBus.getBus(this.moduleName).$on('modifyManualGoods', this.modifyManualGoods)
    decBus.getBus(this.moduleName).$on('resetBodyForOther', this.resetBodyForOther)
    decBus.getBus(this.moduleName).$on('refreshDecList', this.refreshDecList)
    decBus.getBus(this.moduleName).$on('modifyDeclGoodsEname', this.modifyDeclGoodsEname)
    decBus.getBus(this.moduleName).$on('initBodySingleSeLect', this.initBodySingleSeLect)
    decBus.getBus(this.moduleName).$on('backZbookList', this.backZbookList)
    decBus.getBus(this.moduleName).$on('HBookClearBody', this.HBookClearBody)
    decBus.getBus(this.moduleName).$on('emsDataBack', this.emsDataBack)
    decBus.getBus(this.moduleName).$on('emsDataBackAll', this.emsDataBackAll)
    decBus.getBus(this.moduleName).$on('setTableListToSate', this.setTableListToSate)
    decBus.getBus(this.moduleName).$on('setBodyControllerFieldValue', this.setBodyControllerFieldValue)
    decBus.getBus(this.moduleName).$on('delelteManualNo', this.delelteManualNo)
    decBus.getBus(this.moduleName).$on('setBodyAiColor', this.setBodyAiColor)
  },
  watch: {
    tableList: 'computedSum',
    decList: {
      handler (newName, oldName) {
        if (this.controller.showCheckTips) {
          this.initErrorInfo()
        }
      },
      deep: true
    }
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
    switch () {
      return this.$store.state[this.moduleName].switch
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    },
    inoviceTotalPrice () {
      return this.$store.state[this.moduleName].inoviceTotalPrice
    }, // 发票的金额
    PLNet () {
      return this.$store.state[this.moduleName].PLNet
    }, // 装箱单的净重
    decNet () {
      return this.$store.state[this.moduleName].decNet
    } // 报关单的净重
  },
  methods: {
    // 粘贴
    pasted (event) {
      // 获取粘贴板的值
      let data = event.clipboardData.getData('Text')
      let datas = data.split(/\n/)
      let reg = new RegExp(this.ruleRegx[this.currentOpProperty])
      this.tableList.forEach((item, index) => {
        if (reg.test(datas[index].trim())) {
          item[this.currentOpProperty] = datas[index].trim()
          // 重置单价
          if (['gQty', 'declTotal'].includes(this.currentOpProperty) && item['gQty'] && item['declTotal']) {
            item['declPrice'] = decUtil.Div(item['declTotal'], item['gQty'], 4).toString()
          }
        }
      })
      if (this.currentOpProperty === 'gName') {
        this.getGnos(datas)
      }
      this.currentOpProperty = ''
    },
    headerClick (column, event) {
      if (column.property && this.supportEditProperty.indexOf(column.property) > -1) {
        this.currentOpProperty = column.property
        this.$nextTick(() => {
          this.$refs[this.currentOpProperty + '_0'] && this.$refs[this.currentOpProperty + '_0'].focus()
          this.$refs[this.currentOpProperty + '_0'] && this.$refs[this.currentOpProperty + '_0'].select()
        })
      }
    },
    // 设置row 得颜色
    tableRowClassName ({row, rowIndex}) {
      if (this.$route.query.aiType && this.$route.query.aiType === 'Intelligent') {
        let gNo = +row.gNo
        if (gNo > this.bodyAiColorList.length) {
          return ''
        }
        let bodyColor = this.bodyAiColorList[gNo - 1]
        let red = false
        let yellow = false
        for (let key in bodyColor) {
          if (bodyColor[key] === 0) {
            red = true
          }
          if (bodyColor[key] === 1) {
            yellow = true
          }
        }
        if (red) {
          return 'ai-row-red'
        }
        if (yellow) {
          return 'ai-row-yellow'
        }
      }
    },
    getGnos (names) {
      let param = []
      for (let a in names) {
        param.push({gName: names[a].trim()})
      }
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getCodeTs',
        data: param,
        success: (res) => {
          for (let x in this.tableList) {
            for (let y in res.result) {
              if (this.tableList[x].gName === res.result[y].gName) {
                this.tableList[x].codeTs = res.result[y].codeTs
              }
            }
          }
        }
      })
    },
    initBodyCheck () {
      return {
        gNoColor: '0',
        codeTsColor: '0',
        ciqCodeColor: '0',
        gNameColor: '0',
        destinationCountryColor: '0',
        districtCodeColor: '0',
        dutyModeColor: '0',
        originCountryColor: '0',
        declPriceColor: '0',
        declTotalColor: '0',
        tradeCurrColor: '0',
        exgVersionColor: '0',
        contrItemColor: '0', // 备案序号
        ciqNameColor: '0', // 检验检疫名称
        gModelColor: '0', // 规格型号
        gQtyColor: '0', // 成交数量
        gUnitColor: '0', // 成交计量单位
        qty1Color: '0', // 法定第一数量
        unit1Color: '0', // 法定第一计量单位
        exgNoColor: '0', // 货号
        qty2Color: '0', // 法定第二数量
        unit2Color: '0', // 法定第二计量单位
        destCodeColor: '0' // 境内目的地区
      }
    },
    initErrorColor () {
      return { 'gNo': false,
        'contrItem': false,
        'codeTs': false,
        'ciqName': false,
        'gName': false,
        'gModel': false,
        'gQty': false,
        'gUnit': false,
        'declPrice': false,
        'declTotal': false,
        'tradeCurr': false,
        'qty1': false,
        'unit1': false,
        'exgVersion': false,
        'exgNo': false,
        'destinationCountry': false,
        'qty2': false,
        'unit2': false,
        'originCountry': false,
        'districtCode': false,
        'destCode': false,
        'dutyMode': false
      }
    },
    // 计算总数
    computedSum () {
      let list = util.simpleClone(this.tableList)
      let sum1 = 0
      let sum2 = 0
      let sum3 = 0
      let sum4 = 0
      let currMap = {}
      for (let i in list) {
        if (util.isEmpty(list[i].declTotal)) {
          list[i].declTotal = 0
        }
        if (util.isEmpty(list[i].gQty)) {
          list[i].gQty = 0
        }
        if (util.isEmpty(list[i].qty1)) {
          list[i].qty1 = 0
        }
        if (util.isEmpty(list[i].qty2)) {
          list[i].qty2 = 0
        }
        sum1 = decUtil.Add(sum1, list[i].declTotal)
        sum2 = decUtil.Add(sum2, list[i].gQty)
        sum3 = decUtil.Add(sum3, list[i].qty1)
        sum4 = decUtil.Add(sum4, list[i].qty2)
        if (list[i].tradeCurrValue) {
          currMap[list[i].tradeCurrValue] = list[i].tradeCurrValue
        }
      }
      this.$emit('backStatisticsData', {
        totalPrice: sum1, // 总价
        totalGQty: sum2, // 成交数量合计
        totalQty1: sum3, // 法定第一数量合计
        totalQty2: sum4 // 法定第二数量合计
      })
      this.computSum.totalPrice = sum1
      if (Object.keys(currMap).length === 1) {
        this.computSum.curr = Object.keys(currMap)[0]
      } else {
        this.computSum.curr = '-'
      }
      this.resetGoodsEnNameList()
    },
    checkListValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['bodyRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 打开表体导入窗口
    openImport () {
      let gNList = []
      for (let i in this.tableList) {
        gNList.push(this.tableList[i].gNo)
      }
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'manualNo')
      let manualNo = this.$store.state[this.moduleName].manualNo
      // 设置初始参数
      this.initImport = {
        iEFlag: this.controller.iEFlag,
        gNoList: gNList,
        manualNo: manualNo,
        limitSeqNoList: [],
        type: 'DL'
      }
      // 打开导入窗口
      this.importCompnentVisible = true
    },
    // 关闭表体导入窗口
    closeImportCompnent () {
      this.importCompnentVisible = false
    },
    // 接收数据并关闭表体导入窗口
    receptionImportData (res) {
      let data = util.simpleClone(res)
      let len = this.tableList.length
      let importLen = data.res.result.length
      let totalLen = decUtil.Add(len, importLen)
      if (totalLen > 50) {
        this.messageTips('导入商品数量超过本单商品不能超过50条限制,导入失败！', 'error')
        return
      }
      if (data.res.code === '0000' && data.res.result.length > 0) {
        let list = data.res.result
        for (let i in list) {
          this.tableList.push(list[i])
        }
        this.messageTips(data.res.message, 'success')
      } else {
        this.messageTips(data.res.message)
      }
      this.importCompnentVisible = false
    },
    // 重置 报关单表体 填制数据
    refreshDecList () {
      this.resetBodyForOther()
      // 取消选择项
      if (this.isCheckbox) {
        // this.$refs.decListTable.clearSelection()
      } else {
        this.bodyListRadio = ''
        this.checkedTableList = []
      }
      this.resetDodySelect()
      this.backFillDistrictCode()
      if (this.controller.iEFlag === 'I') { // 进口
        //  设置表体 最终目的国(地区)默认值为中国
        this.initBodySingleSeLect('destinationCountry', 'CHN', {
          obj: 'saasCountry3',
          params: 'SAAS_COUNTRY'
        })
      } else { // 出口
        //  设置表体 原产国(地区)默认值为中国
        this.initBodySingleSeLect('originCountry', 'CHN', {
          obj: 'saasCountry4',
          params: 'SAAS_COUNTRY'
        })
        decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeCountry')
        this.decList.destinationCountry = this.$store.state[this.moduleName].tradeCountry
        if (!util.isEmpty(this.decList.destinationCountry)) {
          this.initBodySingleSeLect('destinationCountry', this.decList.destinationCountry, {
            obj: 'saasCountry3',
            params: 'SAAS_COUNTRY'
          })
        }
        // 初始化 征免方式
        decBus.getBus(this.moduleName).$emit('initdutyMode', null)
        // 获得焦点
        this.focusDecList()
      }
      this.gModelController = true
    },
    resetBodyForOther () {
      let decLen = this.tableList.length + 1
      let resetDecList = businessUtil.generateDecBody()
      resetDecList.decPid = this.controller.pid
      resetDecList.gNo = decLen // 项号
      this.decList = resetDecList
      this.showGoodsAttrValue = ''
      this.showGoodsSpec = ''
      this.bodyController.qty2Disabled = true
      // 重置AI 颜色
      this.bodyAiColor = businessUtil.generateDecAiBodyColor()
      for (let key in this.bodyAiColor) {
        this.bodyAiColor[key] = 2
      }
    },
    // 重置 表体的下拉框
    resetDodySelect () {
      this.saasUnit1 = [] // 成交计量单位
      this.saasCurr4 = [] // 币制
      this.saasUnit2 = [] // 法定第一计量单位
      this.saasCountry3 = [] // 最终目的国(地区)
      this.saasUnit3 = [] // 法定第二计量单位
      this.saasCountry4 = [] // 原产国(地区)
      this.saasCiqOriginPlace = [] // 原产地区
      this.saasDistrictRel = [] // '境内目的地' :'境内货源地'
      this.saasCiqCityCn = [] // '目的地代码' : '境内货源地代码'
      this.saasLevymode = [] // 征免方式
      this.saasUserTo = [] // 用途
    },
    // 自动根据生产/消费使用单位的十位海关编码 反填境内目的地的目的地代码/货源地的货源地代码
    backFillDistrictCode () {
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'ownerCode')
      let ownerCode = this.$store.state[this.moduleName].ownerCode
      if (ownerCode.length === 10) {
        let str = ownerCode.toString().substring(0, 5)
        this.initBodySingleSeLect('districtCode', str, {
          obj: 'saasDistrictRel',
          params: 'SAAS_DISTRICT_REL'
        })
      }
    },
    // 表体字段的初始化聚焦
    focusDecList () {
      if (this.bodyController.contrItemDisabled === true) {
        this.$refs['gName'].focus()
        this.$refs['gName'].select()
      } else {
        this.$refs['contrItem'].focus()
        this.$refs['contrItem'].select()
      }
    },
    // 删除 报关单表体 信息
    delDecList () {
      let delData = this.checkedTableList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$confirm('请确认是否删除选中的商品数据?', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.tableList) {
              if (delData[index].gNo === this.tableList[item].gNo) {
                this.tableList.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedTableList = []
          this.bodyListRadio = ''
          // 重新排序
          for (let i in this.tableList) {
            this.tableList[i].gNo = parseInt(i) + 1
          }
          // 重新设置商品对应关系列表
          // this.resetGoodsEnNameList()
          // 重新 初始化 form表单
          this.refreshDecList()
        }).catch(() => {
        })
      }
    },
    // 重置商品对应关系列表
    resetGoodsEnNameList () {
      let list = []
      for (let i in this.tableList) {
        list.push({
          gNo: this.tableList[i].gNo,
          codeTs: this.tableList[i].codeTs,
          gName: this.tableList[i].gName,
          declGoodsEname: this.tableList[i].declGoodsEname ? this.tableList[i].declGoodsEname : ''
        })
      }
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'goodsEnNameList', value: list})
      // 重置表头商品英文关系
      this.resetGoodsEnName()
    },
    // 重新计算商品英文对应关系
    resetGoodsEnName () {
      let list = []
      for (let i in this.tableList) {
        if (!util.isEmpty(this.tableList[i].declGoodsEname)) { // 如果存在英文名称
          list.push(this.tableList[i].gNo + '-' + this.tableList[i].declGoodsEname)
        }
      }
      decBus.getBus(this.moduleName).$emit('setHeadFieldValue', {gEnName: list.join(',')})
    },
    // 复制 报关单 一条表体数据
    copyDecList () {
      if (this.tableList.length === 50) {
        this.messageTips('表体数据不能超过50条')
        return
      }
      if (this.isCheckbox) {
        let copyData = this.checkedTableList
        if (copyData.length !== 1) {
          this.messageTips('请选择一条需要复制的数据')
        } else {
          this.checkedTableList[0].decListPid = ''
          this.checkedTableList[0].gNo = parseInt(this.tableList.length) + 1
          this.tableList.push(util.simpleClone(this.checkedTableList[0]))
          // 需要 移动选项到新复制的数据上
          this.$refs.decListTable.clearSelection()

          this.checkedTableList.push(util.simpleClone(this.tableList[this.tableList.length - 1]))
          this.checkedTableList.forEach(item => {
            this.$refs.decListTable.toggleRowSelection(this.tableList.find(d => d.gNo === item.gNo), true)
          })
          this.decList = util.simpleClone(this.checkedTableList[0])
          // 初始化下拉框
          this.initBodySelect()
          this.messageTips('数据复制成功', 'success')
        }
      } else {
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条需要复制的数据')
          return
        }
        this.checkedTableList[0].decListPid = ''
        this.checkedTableList[0].gNo = +this.tableList.length + 1
        this.tableList.push(util.simpleClone(this.checkedTableList[0]))
        this.bodyListRadio = +this.tableList.length - 1
        this.decList = util.simpleClone(this.checkedTableList[0])
      }
    },
    // 上移 报关单 一条表体数据
    moveUpDecList () {
      if (this.isCheckbox) {
        let moveData = this.checkedTableList
        if (moveData.length !== 1) {
          this.messageTips('请选择一条需要移动的数据')
        } else {
          let index = parseInt(this.checkedTableList[0].gNo)
          if (index === 1) {
            this.messageTips('已是第一条商品表体，无法执行上移操作。')
          } else {
            let checkedData = util.simpleClone(moveData[0])
            let checkGNo = parseInt(checkedData.gNo) - 1
            let changeData = util.simpleClone(this.tableList[checkGNo - 1])
            checkedData.gNo = parseInt(checkedData.gNo) - 1
            changeData.gNo = parseInt(changeData.gNo) + 1
            this.tableList[checkGNo - 1] = checkedData
            this.tableList[checkGNo] = changeData
            this.tableList.push({})
            this.tableList.pop()
            this.$refs.decListTable.toggleRowSelection(this.tableList[checkGNo - 1])
            this.decList = util.simpleClone(this.tableList[checkGNo - 1])
            this.formatDecList()
          }
        }
      } else { // 单选
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条需要移动的数据')
          return
        }
        if (this.bodyListRadio === 0) {
          this.messageTips('已是第一条商品表体，无法执行上移操作。')
          return
        }
        let checkedData = util.simpleClone(this.tableList[this.bodyListRadio])
        let checkGNo = parseInt(checkedData.gNo) - 1
        let changeData = util.simpleClone(this.tableList[checkGNo - 1])
        checkedData.gNo = parseInt(checkedData.gNo) - 1
        changeData.gNo = parseInt(changeData.gNo) + 1
        this.bodyListRadio--
        this.tableList[checkGNo - 1] = checkedData
        this.tableList[checkGNo] = changeData
        this.tableList.push({})
        this.tableList.pop()
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.decList = util.simpleClone(this.checkedTableList[0])
        this.formatDecList()
      }
    },
    // 格式话反填表体时的数据
    formatDecList () {
      // 赋值到decList
      this.goodsSpecForm.stuffNote = this.decList.stuffNote
      this.goodsSpecForm.prodValidDt = this.decList.prodValidDt
      this.goodsSpecForm.prodQgp = this.decList.prodQgp
      this.goodsSpecForm.engManentCnm = this.decList.engManentCnm
      this.goodsSpecForm.goodsSpec = this.decList.goodsSpec
      this.goodsSpecForm.goodsModel = this.decList.goodsModel
      this.goodsSpecForm.goodsBrand = this.decList.goodsBrand
      if (!util.isEmpty(this.decList.produceDate)) {
        this.goodsSpecForm.produceDate = this.decList.produceDate.split(';')
      } else {
        this.goodsSpecForm.produceDate = ''
      }
      this.goodsSpecForm.prodBatchNo = this.decList.prodBatchNo
      this.goodsSpecForm.mnufctrRegno = this.decList.mnufctrRegno
      // 规格型号
      let param = []
      for (let index in this.goodsSpecForm) {
        if (util.isEmpty(this.goodsSpecForm[index]) === false) {
          param.push(this.goodsSpecForm[index])
        }
      }
      this.showGoodsSpec = param.join(',')
      // 货物属性 转化为name
      let goodsAttrValue = []
      let list = util.isEmpty(this.decList.goodsAttr) ? [] : this.decList.goodsAttr.split(',')
      let comList = this.saasGoodsAttr
      for (let n in list) {
        for (let i in comList) {
          if (list[n] === comList[i].codeField) {
            goodsAttrValue.push(comList[i].nameField)
          }
        }
      }
      this.showGoodsAttrValue = goodsAttrValue.join(',')
      // 初始化表体下拉框
      this.initBodySelect()
      // 如果法定第二计量单位有值则 法定第二数据 可输入
      this.unit2Change(this.decList.unit2)
    },
    // 下移 报关单 一条表体数据
    downUpDecList () {
      if (this.isCheckbox) {
        let moveData = this.checkedTableList
        if (moveData.length !== 1) {
          this.messageTips('请选择一条需要移动的数据')
        } else {
          let index = parseInt(this.checkedTableList[0].gNo)
          if (index === this.tableList.length) {
            this.messageTips('已是最后一条数据，无法执行下移操作。')
          } else {
            let checkedData = util.simpleClone(moveData[0]) // 需要移动的数据
            let checkGNo = parseInt(checkedData.gNo) - 1 // 需要移动的数据的位置
            let changeData = util.simpleClone(this.tableList[checkGNo + 1]) // 被交换位置的数据
            checkedData.gNo = parseInt(checkedData.gNo) + 1 // 重新设置 需要移动数据的 项号
            changeData.gNo = parseInt(changeData.gNo) - 1 // 重新设置 被移动数据的项号
            this.tableList[checkGNo] = changeData // 被移动的数据 重新设置位置
            this.tableList[checkGNo + 1] = checkedData // 移动数据 重新设置位置
            this.tableList.push({})
            this.tableList.pop()
            this.$refs.decListTable.toggleRowSelection(this.tableList[checkGNo + 1])
            this.decList = util.simpleClone(this.tableList[checkGNo + 1])
            this.formatDecList()
          }
        }
      } else { // 单选
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条需要移动的数据')
          return
        }
        if (this.bodyListRadio === (+this.tableList.length - 1)) {
          this.messageTips('已是最后一条数据，无法执行下移操作。')
          return
        }
        let checkedData = util.simpleClone(this.tableList[this.bodyListRadio]) // 需要移动的数据
        let checkGNo = parseInt(checkedData.gNo) - 1 // 需要移动的数据的位置
        let changeData = util.simpleClone(this.tableList[checkGNo + 1]) // 被交换位置的数据
        checkedData.gNo = parseInt(checkedData.gNo) + 1 // 重新设置 需要移动数据的 项号
        changeData.gNo = parseInt(changeData.gNo) - 1 // 重新设置 被移动数据的项号
        this.tableList[checkGNo] = changeData // 被移动的数据 重新设置位置
        this.tableList[checkGNo + 1] = checkedData // 移动数据 重新设置位置
        this.bodyListRadio++
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.decList = util.simpleClone(this.checkedTableList[0])
        this.tableList.push({})
        this.tableList.pop()
        this.formatDecList()
      }
    },
    // 插入 报关单 一条表体数据
    insertDecList () {
      if (this.isCheckbox) { // 多选
        let moveData = this.checkedTableList
        if (moveData.length !== 1) {
          this.messageTips('请选择需要插入的位置')
        } else {
          let gNo = this.checkedTableList[0].gNo
          this.refreshDecList()
          this.decList.gNo = gNo
          this.decList['isInsert'] = true
        }
      } else {
        if (this.bodyListRadio === '') {
          this.messageTips('请选择需要插入的位置')
        } else {
          let no = this.bodyListRadio
          let gNo = this.tableList[this.bodyListRadio].gNo
          this.refreshDecList()
          this.decList.gNo = gNo
          this.bodyListRadio = no
          this.checkedTableList.push(util.simpleClone(this.tableList[this.bodyListRadio]))
          this.decList['isInsert'] = true
        }
      }
    },
    // 重新归类
    reClassify () {
      let data = this.checkedTableList
      if (this.isCheckbox) { // 多选
        if (data.length > 1) {
          this.messageTips('只能选择一条商品重新归类')
          return
        }
      }
      if ((data.length === 1 || this.bodyListRadio !== '') && this.decList.isInsert !== true) {
        // 取被选中的值的 codeTs
        let codeTs = this.checkedTableList[0].codeTs
        if (util.isEmpty(codeTs)) {
          this.messageTips('本条数据没有商品编号，请先完善数据信息')
          return false
        }
        // 查询 需要加载的申报要素参数
        this.$post({
          url: 'API@/saas-dictionary/dictionary/getGoods',
          data: {
            'codeTs': codeTs,
            'iEFlag': this.controller.iEFlag
          },
          success: (res) => {
            let productList = res.result
            if (!productList || productList.length === 0) {
              this.messageTips('本数据商品编号不正确，请先重新设置', 'error')
            } else {
              if (!productList[0].gModel) {
                this.messageTips('该商品没有规范要素！')
                return
              }
              this.decElementPara = {
                checkedgoods: productList[0], // 加载数据
                opeType: 'edit', // 操作类型 add 新增  edit 编辑  look 查看
                gModel: this.checkedTableList[0].gModel, // 规格型号
                iEFlag: this.controller.iEFlag, // 进出口标志
                gName: this.checkedTableList[0].gName,
                gtin: this.checkedTableList[0].ref1 // 存放Gtin的地方
              }
              this.elementVisible = true
            }
          }
        })
      } else {
        let codeTs = this.decList.codeTs
        if (util.isEmpty(codeTs)) {
          this.messageTips('请先填写商品编号')
          return false
        }
        // 查询 需要加载的申报要素参数
        this.$post({
          url: 'API@/saas-dictionary/dictionary/getGoods',
          data: {
            'codeTs': codeTs,
            'iEFlag': this.controller.iEFlag
          },
          success: (res) => {
            let productList = res.result
            if (!productList || productList.length === 0) {
              this.messageTips('本数据商品编号不正确，请先重新设置', 'error')
              return
            }
            if (!productList[0].gModel) {
              this.messageTips('该商品没有规范要素！')
              return
            }
            this.decElementPara = {
              checkedgoods: productList[0], // 加载数据
              opeType: 'add', // 操作类型 add 新增  edit 编辑  look 查看
              gModel: this.decList.gModel, // 规格型号
              iEFlag: this.controller.iEFlag, // 进出口标志
              gName: this.decList.gName,
              gtin: this.decList.ref1 // 存放Gtin的地方
            }
            this.elementVisible = true
          }
        })
      }
    },
    // 归类查看
    lookClassify () {
      if (this.isCheckbox) { // 多选
        let data = this.checkedTableList
        if (data.length !== 1) {
          this.messageTips('请选择一条商品重新归类')
          return
        }
      } else {
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条需要重新归类的商品')
          return
        }
      }
      // 取被选中的值的 codeTs
      let codeTs = this.checkedTableList[0].codeTs
      if (util.isEmpty(codeTs)) {
        this.messageTips('本条数据没有商品编号，请先完善数据信息')
        return false
      }
      // 查询 需要加载的申报要素参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          'codeTs': codeTs,
          'iEFlag': this.controller.iEFlag
        },
        success: (res) => {
          let productList = res.result
          if (!productList || productList.length === 0) {
            this.messageTips('本数据商品编号不正确，请先重新设置', 'error')
          } else {
            if (!productList[0].gModel) {
              this.messageTips('该商品没有规范要素！')
              return
            }
            this.decElementPara = {
              checkedgoods: productList[0], // 加载数据
              opeType: 'look', // 操作类型 add 新增  edit 编辑  look 查看
              gModel: this.checkedTableList[0].gModel, // 规格型号
              iEFlag: this.controller.iEFlag, // 进出口标志
              gtin: this.checkedTableList[0].ref1 // 存放Gtin的地方
            }
            this.elementVisible = true
          }
        }
      })
    },
    // 表体的 规格型号 反填
    backDecListSpace (value) {
      if (this.decElementPara.opeType === 'add') {
        this.decList.gModel = value.specModel
      } else if (this.decElementPara.opeType === 'edit') {
        let index = parseInt(this.checkedTableList[0].gNo) - 1
        this.tableList[index].gModel = value.specModel
        this.decList.gModel = value.specModel
        this.checkedTableList[0].gModel = value.specModel
      }
      if (value.gtin !== null) {
        this.decList.ref1 = value.gtin
      }
      this.tableList.push({})
      this.tableList.pop()
      this.elementVisible = false
      this.gQtyFocus()
    },
    // 取消 表体的规格型号 反填
    cancleElement () {
      this.elementVisible = false
      this.gQtyFocus()
    },
    gQtyFocus () {
      this.$refs['gQty'].focus()
      this.$refs['gQty'].select()
    },
    gModelFocus () {
      this.$refs['gModel'].focus()
      this.$refs['gModel'].select()
    },
    // 批量修改 初始化数据和打开弹出框
    BulkEditing () {
      if (this.isCheckbox) { // 多选
        let len = this.checkedTableList.length
        if (len === 0) {
          this.messageTips('请选择一条的商品')
          return
        }
      } else {
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条的商品')
          return
        }
      }
      let checkFormList = this.tableList.filter(e => { // 更新表体最新数据到已选中数据
        return e.gNo === this.checkedTableList[0].gNo
      })
      // 1.初始化数据
      this.BulkEditingList = {
        'iEFlag': this.controller.iEFlag,
        'checkForm': checkFormList[0]
      }
      // 2.打开弹出框
      this.BulkEditingVisible = true
    },
    // 批量修改 回参
    backReviseView (value) {
      if (value !== null) {
        if (this.isCheckbox) {
          for (let i in this.checkedTableList) {
            let index = parseInt(this.checkedTableList[i].gNo) - 1
            this.tableList[index].tradeCurr = value.checkList.tradeCurr ? value.tradeCurr : this.checkedTableList[i].tradeCurr
            this.tableList[index].tradeCurrValue = value.checkList.tradeCurr ? value.tradeCurrValue : this.checkedTableList[i].tradeCurrValue
            this.tableList[index].originCountry = value.checkList.originCountry ? value.originCountry : this.checkedTableList[i].originCountry
            this.tableList[index].originCountryValue = value.checkList.originCountry ? value.originCountryValue : this.checkedTableList[i].originCountryValue
            this.tableList[index].destinationCountry = value.checkList.destinationCountry ? value.destinationCountry : this.checkedTableList[i].destinationCountry
            this.tableList[index].destinationCountryValue = value.checkList.destinationCountry ? value.destinationCountryValue : this.checkedTableList[i].destinationCountryValue
            this.tableList[index].destCode = value.checkList.destCode ? value.destCode : this.checkedTableList[i].destCode
            this.tableList[index].districtCode = value.checkList.districtCode ? value.districtCode : this.checkedTableList[i].districtCode
            this.tableList[index].dutyMode = value.checkList.dutyMode ? value.dutyMode : this.checkedTableList[i].dutyMode
            this.tableList[index].dutyModeValue = value.checkList.dutyMode ? value.dutyModeValue : this.checkedTableList[i].dutyModeValue
          }
        } else {
          let gNo = this.bodyListRadio
          this.tableList[gNo].tradeCurr = value.checkList.tradeCurr ? value.tradeCurr : this.checkedTableList[0].tradeCurr
          this.decList.tradeCurr = value.checkList.tradeCurr ? value.tradeCurr : this.checkedTableList[0].tradeCurr
          this.tableList[gNo].tradeCurrValue = value.checkList.tradeCurr ? value.tradeCurrValue : this.checkedTableList[0].tradeCurrValue
          this.tableList[gNo].originCountry = value.checkList.originCountry ? value.originCountry : this.checkedTableList[0].originCountry
          this.tableList[gNo].originCountryValue = value.checkList.originCountry ? value.originCountryValue : this.checkedTableList[0].originCountryValue
          this.decList.originCountry = value.checkList.originCountry ? value.originCountry : this.checkedTableList[0].originCountry
          this.tableList[gNo].destinationCountry = value.checkList.destinationCountry ? value.destinationCountry : this.checkedTableList[0].destinationCountry
          this.tableList[gNo].destinationCountryValue = value.checkList.destinationCountry ? value.destinationCountryValue : this.checkedTableList[0].destinationCountryValue
          this.decList.destinationCountry = value.checkList.destinationCountry ? value.destinationCountry : this.checkedTableList[0].destinationCountry
          this.tableList[gNo].districtCode = value.checkList.districtCode ? value.districtCode : this.checkedTableList[0].districtCode
          this.decList.districtCode = value.checkList.districtCode ? value.districtCode : this.checkedTableList[0].districtCode
          this.tableList[gNo].destCode = value.checkList.destCode ? value.destCode : this.checkedTableList[0].destCode
          this.decList.destCode = value.checkList.destCode ? value.destCode : this.checkedTableList[0].destCode
          this.tableList[gNo].dutyMode = value.checkList.dutyMode ? value.dutyMode : this.checkedTableList[0].dutyMode
          this.tableList[gNo].dutyModeValue = value.checkList.dutyMode ? value.dutyModeValue : this.checkedTableList[0].dutyModeValue
          this.decList.dutyMode = value.checkList.dutyMode ? value.dutyMode : this.checkedTableList[0].dutyMode
          // 初始化下拉框
          this.initBodySelect()
        }
        // 强制刷新
        this.tableList.push({})
        this.tableList.pop()
      }
      this.BulkEditingVisible = false
    },
    // 打开历史商品数据组件
    openHistoryGoods () {
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeName')
      let tradeName = this.$store.state[this.moduleName].tradeName
      this.initHistory = {
        iEFlag: this.controller.iEFlag,
        tradeName: tradeName
      }
      this.historyGoodsVisible = true
    },
    // 接收 历史商品的数据
    historyGoodsData (param) {
      let gNo = this.decList.gNo
      // 根据反填数据的设置 反填数据
      if (this.controller.iEFlag === 'I') {
        if (this.switch['import_setting_contrItem'] === 'Y' && !this.controller.isWholeDec) { // 备案序号
          this.decList.contrItem = param.goodsInfo.contrItem
        }
        if (this.switch['import_setting_codeTs'] === 'Y' && !this.controller.isWholeDec) { // 商品编号
          this.decList.codeTs = param.goodsInfo.codeTs
        }
        if (this.switch['import_setting_ciqName'] === 'Y' && !this.controller.isWholeDec) { // 检验检疫名称
          this.decList.ciqName = param.goodsInfo.ciqName
          this.decList.ciqCode = param.goodsInfo.ciqCode
        }
        if (this.switch['import_setting_gName'] === 'Y' && !this.controller.isWholeDec) { // 商品名称
          this.decList.gName = param.goodsInfo.gName
        }
        if (this.switch['import_setting_gModel'] === 'Y' && !this.controller.isWholeDec) { // 规格型号
          this.decList.gModel = param.goodsInfo.gModel
        }
        if (this.switch['import_setting_gQty'] === 'Y' && !this.controller.isWholeDec) { // 成交数量
          this.decList.gQty = param.goodsInfo.gQty
        }
        if (this.switch['import_setting_gUnit'] === 'Y' && !this.controller.isWholeDec) { // 成交计量单位
          this.decList.gUnit = param.goodsInfo.gUnit
        }
        if (this.switch['import_setting_declPrice'] === 'Y') { // 单价
          this.decList.declPrice = param.goodsInfo.declPrice
        }
        if (this.switch['import_setting_declTotal'] === 'Y' && !this.controller.isWholeDec) { // 总价
          this.decList.declTotal = param.goodsInfo.declTotal
        }
        if (this.switch['import_setting_tradeCurr'] === 'Y' && !this.controller.isWholeDec) { // 币制
          this.decList.tradeCurr = param.goodsInfo.tradeCurr
        }
        if (this.switch['import_setting_qty1'] === 'Y') { // 法定第一数量
          this.decList.qty1 = param.goodsInfo.qty1
        }

        if (this.switch['import_setting_exgVersion'] === 'Y') { // 加工成品单耗版本号
          this.decList.exgVersion = param.goodsInfo.exgVersion
        }
        if (this.switch['import_setting_exgNo'] === 'Y') { // 货号
          this.decList.exgNo = param.goodsInfo.exgNo
        }
        if (this.switch['import_setting_destinationCountry'] === 'Y') { // 最终目的国(地区)
          this.decList.destinationCountry = param.goodsInfo.destinationCountry
        }
        if (this.switch['import_setting_qty2'] === 'Y') { // 法定第二数量
          this.decList.qty2 = param.goodsInfo.qty2
        }
        if (this.switch['import_setting_originCountry'] === 'Y' && !this.controller.isWholeDec) { // 原产国(地区)
          this.decList.originCountry = param.goodsInfo.originCountry
        }
        if (this.switch['import_setting_origPlaceCode'] === 'Y') { // 原产地区
          this.decList.originCountry = param.goodsInfo.originCountry
        }
        if (this.switch['import_setting_districtCode'] === 'Y') { // 境内目的地/境内货源地
          this.decList.districtCode = param.goodsInfo.districtCode
          this.decList.destCode = param.goodsInfo.destCode
        }
        if (this.switch['import_setting_dutyMode'] === 'Y') { // 征免方式
          this.decList.dutyMode = param.goodsInfo.dutyMode
        }
        if (this.switch['import_setting_goodsSpec'] === 'Y') { // 检验检疫货物规格
          this.decList.stuffNote = param.goodsInfo.stuffNote
          this.decList.prodValidDt = param.goodsInfo.prodValidDt
          this.decList.prodQgp = param.goodsInfo.prodQgp
          this.decList.engManentCnm = param.goodsInfo.engManentCnm
          this.decList.goodsSpec = param.goodsInfo.goodsSpec
          this.decList.goodsModel = param.goodsInfo.goodsModel
          this.decList.goodsBrand = param.goodsInfo.goodsBrand
          this.decList.produceDate = param.goodsInfo.produceDate
          this.decList.prodBatchNo = param.goodsInfo.prodBatchNo
          this.decList.mnufctrRegno = param.goodsInfo.mnufctrRegno
        }
        if (this.switch['import_setting_goodsAttr'] === 'Y' && !this.controller.isWholeDec) { // 货物属性
          this.decList.goodsAttr = param.goodsInfo.goodsAttr
        }
        if (this.switch['import_setting_decGoodsLimits'] === 'Y' && !this.controller.isWholeDec) { // 产品资质
          this.decList.decGoodsLimits = util.simpleClone(param.goodsInfo.decGoodsLimits)
          if (this.decList.decGoodsLimits === null) {
            this.decList.decGoodsLimits = []
          }
        }
        if (this.switch['import_setting_dangGoodsInfo'] === 'Y') { // 危险货物信息
          this.decList.noDangFlag = param.goodsInfo.noDangFlag // 非危险化学品
          this.decList.unCode = param.goodsInfo.unCode // UN编码
          this.decList.dangName = param.goodsInfo.dangName // 危险货物名称
          this.decList.dangPackType = param.goodsInfo.dangPackType // 危包类别
          this.decList.dangPackSpec = param.goodsInfo.dangPackSpec // 危包规格
        }
      } else {
        if (this.switch['export_setting_contrItem'] === 'Y') { // 备案序号
          this.decList.contrItem = param.goodsInfo.contrItem
        }
        if (this.switch['export_setting_codeTs'] === 'Y' && !this.controller.isWholeDec) { // 商品编号
          this.decList.codeTs = param.goodsInfo.codeTs
        }
        if (this.switch['export_setting_ciqName'] === 'Y' && !this.controller.isWholeDec) { // 检验检疫名称
          this.decList.ciqName = param.goodsInfo.ciqName
          this.decList.ciqCode = param.goodsInfo.ciqCode
        }
        if (this.switch['export_setting_gName'] === 'Y' && !this.controller.isWholeDec) { // 商品名称
          this.decList.gName = param.goodsInfo.gName
        }
        if (this.switch['export_setting_gModel'] === 'Y' && !this.controller.isWholeDec) { // 规格型号
          this.decList.gModel = param.goodsInfo.gModel
        }
        if (this.switch['export_setting_gQty'] === 'Y' && !this.controller.isWholeDec) { // 成交数量
          this.decList.gQty = param.goodsInfo.gQty
        }
        if (this.switch['export_setting_gUnit'] === 'Y' && !this.controller.isWholeDec) { // 成交计量单位
          this.decList.gUnit = param.goodsInfo.gUnit
        }
        if (this.switch['export_setting_declPrice'] === 'Y') { // 单价
          this.decList.declPrice = param.goodsInfo.declPrice
        }
        if (this.switch['export_setting_declTotal'] === 'Y' && !this.controller.isWholeDec) { // 总价
          this.decList.declTotal = param.goodsInfo.declTotal
        }
        if (this.switch['export_setting_tradeCurr'] === 'Y' && !this.controller.isWholeDec) { // 币制
          this.decList.tradeCurr = param.goodsInfo.tradeCurr
        }
        if (this.switch['export_setting_qty1'] === 'Y') { // 法定第一数量
          this.decList.qty1 = param.goodsInfo.qty1
        }
        if (this.switch['export_setting_exgVersion'] === 'Y') { // 加工成品单耗版本号
          this.decList.exgVersion = param.goodsInfo.exgVersion
        }
        if (this.switch['export_setting_exgNo'] === 'Y') { // 货号
          this.decList.exgNo = param.goodsInfo.exgNo
        }
        if (this.switch['export_setting_destinationCountry'] === 'Y') { // 最终目的国(地区)
          this.decList.destinationCountry = param.goodsInfo.destinationCountry
        }
        if (this.switch['export_setting_qty2'] === 'Y') { // 法定第二数量
          this.decList.qty2 = param.goodsInfo.qty2
        }

        if (this.switch['export_setting_originCountry'] === 'Y' && !this.controller.isWholeDec) { // 原产国(地区)
          this.decList.originCountry = param.goodsInfo.originCountry
        }
        // if (this.switch['export_setting_origPlaceCode'] === 'Y') { // 原产地区
        //   this.decList.originCountry = param.goodsInfo.originCountry
        // }
        if (this.switch['export_setting_districtCode'] === 'Y') { // 境内目的地/境内货源地
          this.decList.districtCode = param.goodsInfo.districtCode
          this.decList.destCode = param.goodsInfo.destCode
        }
        if (this.switch['export_setting_dutyMode'] === 'Y') { // 征免方式
          this.decList.dutyMode = param.goodsInfo.dutyMode
        }
        if (this.switch['export_setting_goodsSpec'] === 'Y') { // 检验检疫货物规格
          this.decList.stuffNote = param.goodsInfo.stuffNote
          this.decList.prodValidDt = param.goodsInfo.prodValidDt
          this.decList.prodQgp = param.goodsInfo.prodQgp
          this.decList.engManentCnm = param.goodsInfo.engManentCnm
          this.decList.goodsSpec = param.goodsInfo.goodsSpec
          this.decList.goodsModel = param.goodsInfo.goodsModel
          this.decList.goodsBrand = param.goodsInfo.goodsBrand
          this.decList.produceDate = param.goodsInfo.produceDate
          this.decList.prodBatchNo = param.goodsInfo.prodBatchNo
          this.decList.mnufctrRegno = param.goodsInfo.mnufctrRegno
        }
        if (this.switch['export_setting_goodsAttr'] === 'Y' && !this.controller.isWholeDec) { // 货物属性
          this.decList.goodsAttr = param.goodsInfo.goodsAttr
        }
        if (this.switch['export_setting_decGoodsLimits'] === 'Y' && !this.controller.isWholeDec) { // 产品资质
          this.decList.decGoodsLimits = util.simpleClone(param.goodsInfo.decGoodsLimits)
          if (this.decList.decGoodsLimits === null) {
            this.decList.decGoodsLimits = []
          }
        }
        if (this.switch['export_setting_dangGoodsInfo'] === 'Y') { // 危险货物信息
          this.decList.noDangFlag = param.goodsInfo.noDangFlag // 非危险化学品
          this.decList.unCode = param.goodsInfo.unCode // UN编码
          this.decList.dangName = param.goodsInfo.dangName // 危险货物名称
          this.decList.dangPackType = param.goodsInfo.dangPackType // 危包类别
          this.decList.dangPackSpec = param.goodsInfo.dangPackSpec // 危包规格
        }
      }
      // 法定第一计量单位
      !this.controller.isWholeDec && (this.decList.unit1 = param.goodsInfo.unit1)
      // 法定第二计量单位
      !this.controller.isWholeDec && (this.decList.unit2 = param.goodsInfo.unit2)
      !this.controller.isWholeDec && (this.decList.purpose = param.goodsInfo.purpose)
      // 格式化数据
      this.decList.declPrice = decUtil.removeZero(this.decList.declPrice)
      this.decList.gQty = decUtil.removeZero(this.decList.gQty)
      this.decList.qty1 = decUtil.removeZero(this.decList.qty1)
      this.decList.qty2 = decUtil.removeZero(this.decList.qty2)
      this.decList.declTotal = decUtil.removeZero(this.decList.declTotal)
      this.decList.gNo = gNo
      // 如果没有备案号存在  以防历史数据中存在备案序号 所以这里清除备案序号
      if (this.bodyController.contrItemDisabled) {
        this.decList.contrItem = ''
      }
      if (this.decList.decGoodsLimits === null) {
        this.decList.decGoodsLimits = []
      }
      // gtin 存值
      this.decList.ref1 = param.goodsInfo.ref1
      // this.decList.ref1 = '6928760110354'
      // 格式化表体数据
      this.formatDecList()
      this.historyGoodsVisible = false
    },
    // 取消选择历史商品数据
    historyGoodsCompnent () {
      this.historyGoodsVisible = false
    },
    // 智能制单
    modifyGModel () {
      // 用报关单表头的【备案号】、【进出口标志】、【监管方式】及表体的【备案序号】,
      // 到保税商品库中，找到对应的数据，取数据中的【规格型号】内容，反填至报关单对应数据的【规格型号】中去
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'manualNo')
      let manualNo = this.$store.state[this.moduleName].manualNo
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeMode')
      let tradeMode = this.$store.state[this.moduleName].tradeMode
      if (util.isEmpty(manualNo)) {
        this.messageTips('备案号不能为空！')
        return
      }
      if (util.isEmpty(tradeMode)) {
        this.messageTips('监管方式不能为空！')
        return
      }
      let contrItemList = []
      for (let i in this.tableList) {
        if (!util.isEmpty(this.tableList[i].emsContrItem)) {
          contrItemList.push({
            manualNo: manualNo,
            tradeMode: tradeMode,
            contrItem: this.tableList[i].emsContrItem, // 这个字段为核注清单那边的备案序号
            iEFlag: this.controller.iEFlag
          })
        }
      }
      if (contrItemList.length === 0) {
        this.messageTips('没有可补录的数据')
        return
      }
      this.$post({
        url: 'API@/dec-common/decParam/common/invtQueryBondedInfo',
        data: contrItemList,
        success: (res) => {
          if (res.result && res.result.length !== 0) {
            for (let i in this.tableList) {
              if (!util.isEmpty(this.tableList[i].emsContrItem)) {
                if (!util.isEmpty(res.result[this.tableList[i].emsContrItem])) {
                  this.tableList[i].gModel = res.result[this.tableList[i].emsContrItem].gModel
                }
              }
            }
            this.tableList.push({})
            this.tableList.pop()
          } else {
            this.messageTips(res.message, 'error')
          }
        }
      })
    },
    checkPrice () {
      let param = []
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeName')
      let tradeName = this.$store.state[this.moduleName].tradeName
      if (!tradeName) {
        this.messageTips('境内收发货人名称不能为空！')
        return false
      }
      if (this.checkedTableList.length === 0) {
        this.messageTips('请选择需要检查的数据！')
        return false
      }
      for (let i in this.checkedTableList) {
        param.push({
          tradeName: tradeName,
          gNo: this.checkedTableList[i].gNo,
          codeTs: this.checkedTableList[i].codeTs,
          gName: this.checkedTableList[i].gName,
          tradeCurr: this.checkedTableList[i].tradeCurr,
          type: this.controller.iEFlag,
          originCountry: this.controller.iEFlag === 'I' ? this.checkedTableList[i].originCountry : this.checkedTableList[i].destinationCountry,
          gModel: this.checkedTableList[i].gModel,
          declPrice: this.checkedTableList[i].declPrice
        })
      }
      this.$post({
        url: 'API@/dec-common/decParam/common/checkPriceInfoList',
        data: param,
        success: (res) => {
          this.messageTips('检查通过')
        },
        other: (res) => {
          this.messageTips(res.message)
        }
      })
    },
    checkboxChange (value) {
      this.bodyListRadio = ''
      this.checkedTableList = []
      this.bodyShow = false
      // 切换时清空选项
      // this.$refs.decListTable.clearSelection()
      this.refreshDecList()
      setTimeout(() => {
        this.bodyShow = true
      }, 100) // 延迟1秒
    },
    // 上下键切换
    changeBody (e) {
      if (!(e && (e.keyCode === 38 || e.keyCode === 40))) {
        return
      }
      if (this.isCheckbox) { // 如果是多选
        if (this.checkedTableList.length === 0) {
          return
        }
        if (this.checkedTableList.length > 1) {
          this.messageTips('只能选择一条数据')
          return
        }
        if (this.tableList.length === 1) {
          return
        }
        let no = +this.checkedTableList[0].gNo
        let len = this.tableList.length
        if (e.keyCode === 38) {
          if (no === 1) {
            this.checkedTableList[0] = this.tableList[len - 1]
          } else {
            this.checkedTableList[0] = this.tableList[no - 2]
          }
        } else if (e.keyCode === 40) {
          if (no === len) {
            this.checkedTableList[0] = this.tableList[0]
          } else {
            this.checkedTableList[0] = this.tableList[no]
          }
        }
        this.decList = util.simpleClone(this.checkedTableList[0])
        let list = this.checkedTableList
        this.$refs.decListTable.clearSelection()
        if (list.length > 0) {
          list.forEach(item => {
            this.$refs.decListTable.toggleRowSelection(this.tableList.find(d => {
              if (d.gNo.toString() === item.gNo.toString()) {
                return true
              }
            }), true)
          })
        }
      } else { // 如果是单选
        let len = this.tableList.length
        if (e && e.keyCode === 38) { // 上
          if (this.bodyListRadio === 0) {
            this.bodyListRadio = len - 1
          } else {
            this.bodyListRadio--
          }
        }
        if (e && e.keyCode === 40) { // 下
          if (this.bodyListRadio === (len - 1)) {
            this.bodyListRadio = 0
          } else {
            this.bodyListRadio++
          }
        }
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.decList = util.simpleClone(this.checkedTableList[0])
      }
    },
    // 点击当前行的情况
    decListCheckChange (selection, row) {
      let flag = false
      for (let i in selection) {
        if (selection[i].gNo === row.gNo) {
          flag = true
          break
        }
      }
      if (flag) {
        this.backDeccListInfo(row)
      } else {
        // this.$refs.decListTable.toggleRowSelection(row, false)
        this.refreshDecList()
      }
    },
    // 反填 报关单表体信息
    backDeccListInfo (row) {
      this.setAITableColor(+row.gNo)
      this.$refs.decListTable.toggleRowSelection(row, true)
      this.decList = util.simpleClone(row)
      this.formatDecList()
    },
    setAITableColor (gNo) {
      let aiType = this.$route.query.aiType
      if (aiType && aiType === 'Intelligent') {
        // 更改颜色
        // 1. 判断gNo 是否超过了智能识别过来的情况
        if (gNo <= this.bodyAiColorList.length) {
          this.bodyAiColor = util.simpleClone(this.bodyAiColorList[gNo - 1])
        }
      }
    },
    // 获取选中的报关单 表体 信息
    decListChange (value) {
      this.checkedTableList = util.simpleClone(value)
    },
    // 点击报关单表体table 单行事件
    rowClickDecList (row, event, column) {
      if (this.currentOpProperty) {
        return
      }
      if (this.isCheckbox) { // 多选执行 多选不执行
        let flag = false // 判断是否已经选中
        for (let i in this.checkedTableList) {
          if (this.checkedTableList[i].gNo === row.gNo) {
            flag = true
            break
          }
        }
        if (flag) {
          this.$refs.decListTable.toggleRowSelection(row, false)
          this.refreshDecList()
        } else {
          this.backDeccListInfo(row)
        }
      } else {
        this.bodyListRadio = +row.gNo - 1
        // 设置聚焦在radio 上
        this.$refs['decListTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[this.bodyListRadio].focus()
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.decList = util.simpleClone(this.checkedTableList[0])
        // 如果是AI
        this.setAITableColor(+this.checkedTableList[0].gNo)
        this.formatDecList()
      }
    },
    // 单选选择表体
    checkThisBody (index) {
      this.bodyListRadio = index
      this.checkedTableList[0] = util.simpleClone(this.tableList[index])
      this.setAITableColor(+this.checkedTableList[0].gNo)
      this.decList = util.simpleClone(this.checkedTableList[0])
      this.formatDecList()
    },
    // 通过 备案序号、进出口标识、监管方式、备案号查询手册数据
    selectBookBody (e) {
      if (util.isEmpty(this.decList.contrItem) || e.target.readOnly) {
        return false
      }
      // 如果是完整申报 并且是不涉证 暂未做不涉证
      // if (this.controller.isWholeDec) {
      //   return false
      // }
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'manualNo')
      let manualNo = this.$store.state[this.moduleName].manualNo
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeMode')
      let tradeMode = this.$store.state[this.moduleName].tradeMode
      if (util.isEmpty(tradeMode)) {
        this.messageTips('监管/贸易方式不能为空')
        return false
      }
      if (util.isEmpty(manualNo)) {
        return false
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getRelatedCurEmsBody',
        data: {
          emsNo: manualNo, // 备案号
          tradeMode: tradeMode, // 监管方式
          iEFlag: this.controller.iEFlag, // 进出口标志
          contrItem: this.decList.contrItem // 备案序号
        },
        success: (res) => {
          if (res.code === '0000') {
            if (res.result.body !== null) {
              let manualData = res.result.body
              // 如果是完整申报并且涉证
              if (this.controller.isWholeDec) {
                // this.decList.codeTs = manualData.codeTs // 商品编号
                if (!util.isEmpty(manualData.gmodel)) {
                  this.decList.gModel = manualData.gmodel // 规格型号
                }
                this.decList.qty1 = manualData.qty1 // 法定第一计数量
                this.decList.qty2 = manualData.qty2 // 法定第二计数量
                this.decList.unit1 = manualData.unit1 // 法定第一计量单位
                this.decList.unit2 = manualData.unit2 // 法定第二计量单位
                this.decList.dutyMode = manualData.dutyMode // 征免方式
                this.decList.exgVersion = manualData.exgVersion // 加工成品单耗版本号
                this.decList.exgNo = manualData.exgNo // 货号
                if (!util.isEmpty(res.result.goodsModel)) { // 这个是商品资料库里维护的规格型号
                  this.decList.gModel = res.result.goodsModel // 规格型号
                }
              } else {
                this.decList.codeTs = manualData.codeTs // 商品编号
                this.decList.gName = manualData.gname // 商品名称
                if (!util.isEmpty(manualData.gmodel)) {
                  this.decList.gModel = manualData.gmodel // 规格型号
                }
                this.decList.gUnit = manualData.gUnit // 成交计量单位
                this.decList.unit1 = manualData.unit1 // 法定第一计量单位
                this.decList.unit2 = manualData.unit2 // 法定第二计量单位
                this.decList.gQty = manualData.gQty // 成交数量
                this.decList.qty1 = manualData.qty1 // 法定第一计数量
                this.decList.qty2 = manualData.qty2 // 法定第二计数量
                if (this.controller.iEFlag === 'I') {
                  this.decList.originCountry = manualData.originCountry // 原产国(地区)
                }
                if (this.controller.iEFlag === 'E') {
                  this.decList.destinationCountry = manualData.originCountry // 最终目的国
                }
                this.decList.tradeCurr = manualData.curr // 币制
                this.decList.declPrice = manualData.decPrice // 单价
                this.decList.declTotal = manualData.declTotal // 总价
                this.decList.dutyMode = manualData.dutyMode // 征免方式
                this.decList.exgVersion = manualData.exgVersion // 加工成品单耗版本号
                this.decList.exgNo = manualData.exgNo // 货号
              }
              if (!util.isEmpty(res.result.goodsModel)) { // 这个是商品资料库里维护的规格型号
                this.decList.gModel = res.result.goodsModel // 规格型号
              }
              decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'manualNo')
              let manualNo = this.$store.state[this.moduleName].manualNo
              if (manualNo.charAt(0).toUpperCase() === 'E') {
                this.decList.districtCode = this.controller.districtCode // 货源地
              }
            }
            // 初始化下拉框
            this.initBodySelect()
            // 如果法定第二计量单位有值则 法定第二数据 可输入
            this.unit2Change(this.decList.unit2)
          }
        }
      })
    },
    getHeadstyle (row) {
      if ([3, 5, 7, 10].indexOf(row.columnIndex) >= 0) {
        return 'color:#0d4880'
      }
    },
    // 法定第二单位change事件
    unit2Change (value) {
      if (util.isEmpty(value)) {
        this.bodyController.qty2Disabled = true
        this.decList.qty2 = ''
      } else {
        this.bodyController.qty2Disabled = false
      }
    },
    // 商品编号值改变事件
    codeTsChangeF () {
      this.codeTsChange = true
      // 清除商品历史数据传过来的gtin
      this.decList.ref1 = ''
    },
    // 打开 商品编号 弹出框
    openProductList (flag) {
      // 自动预警
      if (flag && this.switch['classify_auto_check'] === 'Y' && this.decList.codeTs.length === 10) {
        this.intelligentCheck()
        return
      }
      if (this.controller.cDisabled) { // 如果是置灰的话
        return
      }
      if (!this.codeTsChange && flag === true) {
        this.gQtyFocus()
        return false
      }
      if (this.decList.codeTs.length === 0) {
        return false
      }
      if (this.decList.codeTs.length < 4) {
        this.messageTips('至少输入四位商品编号')
        this.$refs['codeTs'].select()
        return false
      }
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          'codeTs': this.decList.codeTs,
          'iEFlag': this.controller.iEFlag
        },
        success: (res) => {
          this.codeTsChange = false
          this.productList = res.result
          if (this.productList === null || this.productList === undefined || this.productList.length === 0) {
            this.messageTips('无此商品编号', 'error')
            this.decList.codeTs = ''
            this.productList = []
            this.$refs['codeTs'].select()
          } else {
            this.productListVisible = true
          }
        }
      })
    },
    intelligentRight () {
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          'codeTs': this.decList.codeTs,
          'iEFlag': this.controller.iEFlag
        },
        success: (res) => {
          if (res.result && res.result[0]) {
            let goodsInfo = res.result[0]
            this.saveGoodsInfo({
              checkedgoods: goodsInfo,
              type: '1' // 标注为智能归类的功能
            })
          }
        }
      })
    },
    // 商品列表 回参
    saveGoodsInfo (param) {
      let checkedgoods = param.checkedgoods
      // 如果是涉证的完整申报 需要判断所选的商品编号的前是否与概要申报的6位商品编码一致
      if (!this.controller.isCIQ && this.controller.isWholeDec) {
        if (+this.tableList.length >= +this.decList.gNo) {
          let gNoSixO = this.tableList[+this.decList.gNo - 1].codeTs.substr(0, 6)
          let gNoSixN = checkedgoods.codeTs.substr(0, 6)
          if (gNoSixO !== gNoSixN) {
            this.messageTips('与第一步申报的商品编码前6位不一致！')
            this.productListVisible = false
            this.decList.codeTs = this.tableList[+this.decList.gNo - 1].codeTs
            this.$refs['codeTs'].focus()
            this.$refs['codeTs'].select()
            return
          }
        }
      }
      this.decElementPara = {
        checkedgoods: checkedgoods, // 加载数据
        opeType: 'add', // 操作类型 add 新增  edit 编辑  look 查看
        gModel: (param.type ? this.decList.gModel : ''), // 规格型号
        iEFlag: this.controller.iEFlag, // 进出口标志
        gtin: this.decList.ref1 // 存放Gtin的地方
      }
      this.decList.codeTs = checkedgoods.codeTs
      // 监管条件的过滤。根据进出口类型
      if (checkedgoods.controlMa === '无') {
        this.decList.controlMa = ''
      } else {
        let maArr = []
        if (this.controller.iEFlag === 'I') { // 如果是进口
          // 出口的许可证
          let exportArr = ['3', '4', '5', '8', 'B', 'E', 'G', 'H', 'x', 'y']
          let controlMa = checkedgoods.controlMa.split('')
          for (let i in controlMa) {
            // 里面如果有出口的许可证 则去除
            if (!exportArr.includes(controlMa[i])) {
              maArr.push(controlMa[i])
            }
          }
        } else { // 出口
        // 进口特有的许可证
          let importArr = ['1', '2', '6', '7', '9', 'A', 'F', 'M', 'O', 'P', 'Q', 'R', 'Y', 'c', 'e', 'q', 't', 'v']
          let controlMa = checkedgoods.controlMa.split('')
          for (let i in controlMa) {
            // 里面如果有进口的许可证 则去除
            if (!importArr.includes(controlMa[i])) {
              maArr.push(controlMa[i])
            }
          }
        }
        this.decList.controlMa = maArr.join(',')
        if (checkedgoods.ciqMa) {
          this.decList.ciqMa = checkedgoods.ciqMa
          this.decList.conMaView = this.decList.controlMa + '|' + checkedgoods.ciqMa
        } else {
          this.decList.conMaView = this.decList.controlMa
        }
      }
      if (util.isEmpty(this.decList.gName)) {
        this.decList.gName = checkedgoods.gName
      }
      if (util.isEmpty(checkedgoods.gUnit)) {
        this.decList.gUnit = checkedgoods.unit1
      } else {
        this.decList.gUnit = checkedgoods.gUnit
      }
      this.decList.unit1 = checkedgoods.unit1
      this.decList.unit2 = checkedgoods.unit2
      this.unit2Change(checkedgoods.unit2)
      // 初始化下拉框 TODO
      this.initBodySelect()
      // 设置 法定第一数量
      if (!util.isEmpty(this.decList.gUnit) && (this.decList.unit1 === this.decList.gUnit)) {
        this.decList.qty1 = this.decList.gQty
      }
      this.productListVisible = false
      // 如果是概要申报 申报前的完整申报 完整申报录入时，如果是不涉检时候 商品编码智能填写前六位
      if (this.controller.isSummary && !this.controller.isCIQ) {
        this.decList.codeTs = checkedgoods.codeTs.substr(0, 6)
        return
      }
      // 判断是否为涉检报关单 如果是涉检 则需要弹出检验检疫商品列表弹出框
      let flag = false
      if (this.controller.iEFlag === 'I') {
        flag = this.CIQCheck()
        // 处理没有一开始还没有商品的情况
        if (!flag && this.tableList.length === 0) {
          if (checkedgoods.controlMa.indexOf('A') > -1) {
            flag = true
          } else {
            decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeMode')
            let tradeMode = this.$store.state[this.moduleName].tradeMode
            decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeAreaCode')
            let tradeAreaCode = this.$store.state[this.moduleName].tradeAreaCode
            if (!util.isEmpty(tradeMode) && (!util.isEmpty(tradeAreaCode) && (!util.isEmpty(checkedgoods.controlMa)))) {
              let districtType = ''
              if (tradeAreaCode === 'CHN') {
                districtType = '1'
              }
              // 处理去掉监管要求中的逗号
              let controlMa = checkedgoods.controlMa
              let tradeCondition = JSON.parse(window.localStorage.getItem('CUS_TRADE_MODE'))
              decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeMode')
              let tradeMode = this.$store.state[this.moduleName].tradeMode
              let index2 = tradeCondition.findIndex((element, i) => {
                if (element.tradeMode === tradeMode && (districtType === element.districtType.trim())) {
                  let newStr = controlMa + element.imControl
                  let preLen = newStr.length
                  let afterLen = ([...new Set(newStr.split(''))]).length
                  if (preLen !== afterLen) {
                    return true
                  }
                }
              })
              if (index2 > -1) {
                flag = true
              }
            }
          }
        }
      }
      if (flag) {
        // 查询商品列表参数
        this.$post({
          url: 'API@/saas-dictionary/dictionary/getHSDetail',
          data: {
            'codeTs': this.decList.codeTs,
            'iEFlag': this.controller.iEFlag
          },
          success: (res) => {
            this.encodeTableList = res.result
            if (!this.encodeTableList || this.encodeTableList.length === 0) {
              this.encodeTableList = []
            } else if (this.encodeTableList.length === 1) {
              this.decList.ciqName = this.encodeTableList[0].gNameNote
              this.decList.ciqCode = this.encodeTableList[0].ciqCo
              this.encodeTableList = []
              if (!this.decElementPara.checkedgoods.gModel) {
                this.gModelController = false
                this.gModelFocus()
                return
              }
              this.elementVisible = true
            } else {
              this.isOpenElement = true
              this.encodeTableVisible = true
            }
          }
        })
      } else {
        if (!this.decElementPara.checkedgoods.gModel) {
          this.gModelController = false
          this.gModelFocus()
          return
        }
        this.elementVisible = true
      }
    },
    // 检验检疫校验 只针对进口
    CIQCheck () {
      let flag = false // 是否涉检
      /**
       * 1.表头“备注”中含有“成套设备”、“废”、“旧”、“成新”
          2.“商品名称”、“规格型号”含有“废”、“旧”、“成新”
          3.“其它包装”含有“23/33/93”
          4.“启运国”在疫区国家参数表： MAPPING_EPIDEMIC_AREA_CODE
          5.“原产国”在疫区国家参数表
          6.商品监管条件涉A（已做，调整提示语，原本为第X、XX、XXX项涉检，请完善检验检疫信息，现不需要体现项号）
          7.监管方式、贸易国别、进出口标识、商品监管条件满足条件（监管方式与监管要求关联表 表名：CUS_TRADE_MODE）
       */
      // 1.表头“备注”中含有“成套设备”、“废”、“旧”、“成新”
      let noteCondition1 = false
      // 备注中 不包含金关二期为true
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'noteS')
      let noteS = this.$store.state[this.moduleName].noteS
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeMode')
      let tradeMode = this.$store.state[this.moduleName].tradeMode
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeAreaCode')
      let tradeAreaCode = this.$store.state[this.moduleName].tradeAreaCode
      if (noteS.indexOf('金关二期') === -1) {
        noteCondition1 = true
      }
      let noteCondition2 = true
      decBus.getBus(this.moduleName).$emit('setDocFieldToSate', 'licenselist')
      let licenselist = this.$store.state[this.moduleName].licenselist
      let index = licenselist.findIndex((v, i) => {
        return v.docuCode === 'c'
      })
      if (index > -1 && ['0844', '0845'].includes(tradeMode)) {
        noteCondition2 = false
      }
      let rule1 = ['成套设备', '废', '旧', '成新']
      if (!util.isEmpty(noteS) && noteCondition1 && noteCondition2) {
        for (let i in rule1) {
          if (noteS.indexOf(rule1[i]) > -1) {
            flag = true
            break
          }
        }
      }
      // 2.“商品名称”、“规格型号”含有“废”、“旧”、“成新”
      // let rule2 = ['废', '旧', '成新'] 不想写双for循环 不用这个中间变量了
      let country = JSON.parse(window.localStorage.getItem('MAPPING_EPIDEMIC_AREA_CODE'))
      if (!flag && (!util.isEmpty(this.tableList)) && noteCondition2) {
        for (let n in this.tableList) {
          let bodyVo = this.tableList[n]
          if (bodyVo.gModel.indexOf('废') > -1 || bodyVo.gModel.indexOf('旧') > -1 || bodyVo.gModel.indexOf('成新') > -1) {
            flag = true
            break
          }
          if (bodyVo.gName.indexOf('废') > -1 || bodyVo.gName.indexOf('旧') > -1 || bodyVo.gName.indexOf('成新') > -1) {
            flag = true
            break
          }
          // 5.“原产国”在疫区国家参数表
          if (!util.isEmpty(bodyVo.originCountry)) {
            let index = country.findIndex((element, i) => {
              return element === bodyVo.originCountry
            })
            if (index > -1) {
              flag = true
              break
            }
          }
          // 6.商品监管条件涉A
          if (bodyVo.controlMa.indexOf('A') > -1) {
            flag = true
            break
          }
          // 7.监管方式、贸易国别、进出口标识、商品监管条件满足条件（监管方式与监管要求关联表 表名：CUS_TRADE_MODE）
          if (!util.isEmpty(tradeMode) && (!util.isEmpty(tradeAreaCode) && (!util.isEmpty(bodyVo.controlMa)))) {
            let districtType = ''
            if (tradeAreaCode === 'CHN') {
              districtType = '1'
            }
            // 处理去掉监管要求中的逗号
            let controlMa = bodyVo.controlMa.split(',').join('')
            let tradeCondition = JSON.parse(window.localStorage.getItem('CUS_TRADE_MODE'))
            let index2 = tradeCondition.findIndex((element, i) => {
              if (element.tradeMode === tradeMode && (districtType === element.districtType)) {
                let newStr = controlMa + element.imControl
                let preLen = newStr.length
                let afterLen = ([...new Set(newStr.split(''))]).length
                if (preLen !== afterLen) {
                  return true
                }
              }
            })
            if (index2 > -1) {
              flag = true
              break
            }
          }
        }
      }
      // 3.“其它包装”含有“23/33/93”
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'otherPacks')
      let otherPacks = this.$store.state[this.moduleName].otherPacks
      let rule3 = ['23', '33', '93']
      if (!flag && !util.isEmpty(otherPacks)) {
        for (let n in otherPacks) {
          let packType = otherPacks[n].packType
          if (rule3.includes(packType)) {
            flag = true
            break
          }
        }
      }
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeCountry')
      let tradeCountry = this.$store.state[this.moduleName].tradeCountry
      // 4.“启运国”在疫区国家参数表： MAPPING_EPIDEMIC_AREA_CODE
      if (!flag && !util.isEmpty(tradeCountry)) {
        for (let x in country) {
          if (country[x] === tradeCountry) {
            flag = true
            break
          }
        }
      }
      return flag
    },
    saveCiqGoods (param) {
      if (param.ciqData) {
        this.decList.ciqName = param.ciqData.gNameNote
        this.decList.ciqCode = param.ciqData.ciqCo
      }
      this.encodeTableVisible = false
      if (this.isOpenElement) {
        if (!this.decElementPara.checkedgoods.gModel) {
          this.gModelController = false
          this.gModelFocus()
        } else {
          this.elementVisible = true
          this.isOpenElement = false
        }
      } else {
        this.gQtyFocus()
      }
    },
    // 是否清空检验检疫名称?
    cancelCiqName () {
      if (!util.isEmpty(this.decList.ciqName)) {
        this.$confirm('是否清空检验检疫名称?', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          this.decList.ciqName = ''
          this.decList.ciqCode = ''
        }).catch(() => {
        })
      }
    },
    // 打开检验检疫编码表
    openEncodeTableContent () {
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getHSDetail',
        data: {
          'codeTs': this.decList.codeTs,
          'iEFlag': this.controller.iEFlag
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
    gQtyChangeF () {
      this.gQtyChange = true
    },
    /**
     * 当成交计量单位和法定第一计量单位相同时输入成交数量带出法定第一数量且与成交数量相同
     */
    gQtyBlur () {
      // 如果 成交单位和法定第一成交单位一样 则 成交数量 默认等于 法定第一成交数量
      // 如果成交单位和法定第二成交单位一样 则成交数量默认等于法定第二成交数量
      if (!util.isEmpty(this.decList.gUnit) && (this.decList.unit1 === this.decList.gUnit)) {
        this.decList.qty1 = this.decList.gQty
      }
      if (!util.isEmpty(this.decList.gUnit) && (this.decList.unit2 === this.decList.gUnit)) {
        this.decList.qty2 = this.decList.gQty
      }
      if (this.decList.gQty && this.decList.gUnit && util.isEmpty(this.decList.declTotal) && this.decList.declPrice) {
        this.computTotal('modify')
        this.$refs['declPrice'].focus()
        this.$refs['declPrice'].select()
        return
      }
      if (!util.isEmpty(this.decList.declPrice) && !util.isEmpty(this.decList.declTotal)) {
        // let decTotal = this.decToDecimal(this.decList.gQty, this.decList.declPrice, '2', '2', '6').toString()
        let decTotal = decUtil.Mul(this.decList.gQty, this.decList.declPrice, 2)
        if (decTotal !== this.decList.declTotal.toString() && this.gQtyChange) {
          this.gQtyChange = false
          this.modifyPriceVisible = true
          return
        }
      }
      this.$refs['gUnit'].focus()
      this.$refs['gUnit'].$children[0].select()
    },
    totalChangeF () {
      this.totalChange = true
    },
    // 修改价格
    backModifyPrice (param) {
      let value = param.value
      if (value === '1') {
        // 修改 单价
        this.computPrice('modify')
      }
      if (value === '2') {
        // 修改 总价
        this.computTotal('modify')
      }
      this.modifyPriceVisible = false
      this.$refs['gUnit'].focus()
      this.$refs['gUnit'].$children[0].select()
    },
    // 切换左右健实现光标移动
    switchFocus (e, value) {
      if (e.keyCode === 39 || e.keyCode === 37) {
        if (value === '1') {
          e.target.blur()
          this.$refs['modifyTotalPrice'].$el.focus()
        } else {
          e.target.blur()
          this.$refs['modifyDeclPrice'].$el.focus()
        }
      }
    },
    // 价格修改 弹出框加载的时候自动聚焦
    focusBtn () {
      this.$nextTick(_ => {
        this.$refs['modifyDeclPrice'].$el.focus()
      })
    },
    decPriceChangeF () {
      this.decPriceChange = true
    },
    // 计算总价
    computTotal (value = '') {
      if (!this.decPriceChange && value && value !== 'modify') {
        return false
      }
      let price = this.decList.declPrice
      let gQty = this.decList.gQty
      if (util.isEmpty(price) || util.isEmpty(gQty)) { // 判断 数量和单价有没有填
        return false
      } else if (isNaN(price) || isNaN(gQty)) { // 判断 数量和单价是否填的是 数字
        return false
      } else {
        // this.decList.declTotal = this.decToDecimal(gQty, price, '2', '2', '6').toString()
        this.decList.declTotal = decUtil.Mul(price, gQty, 2).toString()
        this.decPriceChange = false
        this.gQtyChange = false
        if (value === '1') {
          this.$nextTick(_ => {
            this.$refs['declTotal'].focus()
            this.$refs['declTotal'].select()
          })
        }
      }
    },
    // 计算单价
    computPrice (value) {
      if (!this.totalChange && value && value !== 'modify') {
        return false
      }
      let declTotal = this.decList.declTotal
      let gQty = this.decList.gQty
      if (util.isEmpty(declTotal) || util.isEmpty(gQty)) { // 判断 数量和单价有没有填
        return false
      } else if (isNaN(declTotal) || isNaN(gQty)) { // 判断 数量和单价是否填的是 数字
        return false
      } else {
        // this.decList.declPrice = this.decToDecimal(declTotal, gQty, '4', '3', '6')
        this.decList.declPrice = decUtil.Div(declTotal, gQty, 4).toString()
        this.totalChange = false
        this.gQtyChange = false
      }
    },
    // 控制输入长度 针对正整数
    decCheckInt (ipnut, maxlen) {
      let value = this.decList[ipnut]
      let t = value.replace(/[^(()\d&|)]/g, '')
      if (t.length > maxlen) {
        value = this.decList[ipnut] = value.substr(0, maxlen - 1)
      } else {
        this.decList[ipnut] = t
      }
    },
    changeIsShow2 () {
      if (this.isShow2 === true) {
        this.isShowText2 = 'fa fa-angle-double-right'
        this.isShow2 = false
      } else {
        this.isShowText2 = 'fa fa-angle-double-down'
        this.isShow2 = true
      }
    },
    // 直接保存报关单表体,需要添加报关单表体的校验逻辑
    directSaveDecList (value) {
      // 如果是完整申报 不允许新增表体
      if (this.controller.isWholeDec) {
        if (+this.tableList.length < +this.decList.gNo) {
          this.messageTips('两步申报模式,不允许新增数据！')
          return
        }
      }
      if ((value === '1' && this.isShow2 === false) || value === '2' || (value === '1' && this.controller.isWholeDec && this.controller.isCIQ)) {
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
            decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeName')
            let tradeName = this.$store.state[this.moduleName].tradeName
            // 向后端发送请求
            let flag = true // 判断是否需要发送请求查询价格浮动区间
            let priceTipsForm = {
              type: this.controller.iEFlag, // 业务类型 I E
              codeTs: this.decList.codeTs, // 商品编号
              tradeName: tradeName, // 境内收发货人
              gName: this.decList.gName, // 商品名称
              gModel: this.decList.gModel, // 规格型号
              declPrice: this.decList.declPrice, // 单价
              tradeCurr: this.decList.tradeCurr, // 币制
              originCountry: this.decList.originCountry // 原产国
            }
            if (this.controller.iEFlag === 'E') { // 出口的时候不需要查询原产地国
              delete priceTipsForm.originCountry
            }
            for (let i in priceTipsForm) {
              if (util.isEmpty(priceTipsForm[i])) {
                flag = false
                break
              }
            }
            let currFlag = true // 判断是否需要发送请求比对币制
            let currForm = {
              codeTs: this.decList.codeTs, // 商品编码
              gName: this.decList.gName, // 商品名称
              gModel: this.decList.gModel, // 规格型号
              tradeName: tradeName, // 境内收发货人
              tradeCurr: this.decList.tradeCurr // 币制
            }
            if (this.controller.iEFlag === 'I') {
              currForm['originCountry'] = this.decList.originCountry // 原产国
            } else {
              currForm['destinationCountry'] = this.decList.destinationCountry // 最终目的国
            }
            for (let i in currForm) {
              if (util.isEmpty(currForm[i])) {
                currFlag = false
                break
              }
            }
            if (flag) {
              // 发送请求 校验价格波动区间是否正常
              this.$post({
                url: 'API@/dec-common/decParam/common/getPriceList',
                data: priceTipsForm,
                success: (res) => {
                  // 逻辑校验
                  let messgeTips = this.validDecList()
                  if (res.result && res.result.list.length > 0) {
                    let data = res.result.list[0]
                    let declPrice = parseFloat(this.decList.declPrice) // 现值
                    let lowBand = parseFloat(data.declPrice) // 参考值最低值
                    let upperBand = parseFloat(data.minPirce)// 参考值最高值
                    if (declPrice < lowBand || declPrice > upperBand) {
                      let mesLen = messgeTips.length + 1
                      messgeTips.push(mesLen + '.' + '成交价格,不在历史浮动价格区间之内，请核对')
                    }
                  }
                  if (currFlag) {
                    this.checkCurrHis(currForm, messgeTips)
                  } else {
                    // 提示
                    if (messgeTips.length !== 0 && !(util.isEmpty(value))) {
                      let tips = messgeTips.join('<br><br>')
                      this.messageTips(tips)
                    }
                    this.saveDecListNoRefresh()
                    // 传 decList是因为需要有些字段不需要清空
                    this.saveRefreshDecList(util.simpleClone(this.decList))
                    // this.refreshDecList()
                  }
                }
              })
            } else {
              // 逻辑校验
              let messgeTips = this.validDecList()
              if (currFlag) {
                this.checkCurrHis(currForm, messgeTips)
              } else {
                // 提示
                if (messgeTips.length !== 0 && !(util.isEmpty(value))) {
                  let tips = messgeTips.join('<br><br>')
                  this.messageTips(tips)
                }
                this.saveDecListNoRefresh()
                // 传 decList是因为需要有些字段不需要清空
                this.saveRefreshDecList(util.simpleClone(this.decList))
              }
            }
          }
        })
      }
    },
    // 比对币制
    checkCurrHis (currForm, messgeTips) {
      this.$post({
        url: 'API@/dec-common/dec/decListHis/getCurrHis',
        data: currForm,
        success: (res) => {
          if (!util.isEmpty(res.result)) {
            if (res.result === '0') {
              let mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.商品币制与历史数据不一致')
            }
            // 提示
            if (messgeTips.length !== 0) {
              let tips = messgeTips.join('<br><br>')
              this.messageTips(tips)
            }
            this.saveDecListNoRefresh()
            this.saveRefreshDecList(util.simpleClone(this.decList))
          }
        }
      })
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
      this.dutyModeChangeName(this.decList.dutyMode)
      this.destinationCountryChangeName(this.decList.destinationCountry)
      let gNo = this.decList.gNo
      // 判断是否为插入
      if (!util.isEmpty(this.decList.isInsert)) { // 走插入
        let i = parseInt(gNo) - 1
        let insertData = util.simpleClone(this.decList)
        delete insertData.isInsert
        // 插入
        this.tableList.splice(i, 0, insertData)
        // 重新排序
        for (let n in this.tableList) {
          this.tableList[n].gNo = parseInt(n) + 1
        }
        if (this.isCheckbox) {
          // 默认选中 刚插入的数据
          this.$refs.decListTable.clearSelection()
          this.$refs.decListTable.toggleRowSelection(insertData, true)
        } else {
          this.bodyListRadio = ''
        }
        return true
      }
      // 一个变量 记录 是否为新增新
      let isModify = true
      for (let i in this.tableList) {
        if (this.tableList[i].gNo === gNo) { // 存在相同的gNo 走修改
          this.tableList[i] = util.simpleClone(this.decList)
          // 如果是AI制单
          if (this.$route.query.aiType && this.$route.query.aiType === 'Intelligent') {
            // 更改颜色
            this.bodyAiColorList[i] = util.simpleClone(this.bodyAiColor)
          }
          // 为了刷新列表
          this.tableList.push({})
          this.tableList.pop()
          isModify = false
          break
        }
      }
      if (isModify) { // 走新增
        this.tableList.push(util.simpleClone(this.decList))
      }
    },
    // 保存报关单表体时 需要清除数据
    saveRefreshDecList (listVo) {
      let decLen = this.tableList.length + 1
      let resetDecList = businessUtil.generateDecBody()
      resetDecList.decPid = this.controller.pid // 报关单主键
      resetDecList.destCode = listVo.destCode // 目的地代码
      resetDecList.destinationCountry = listVo.destinationCountry // 最终目的国（地区）
      resetDecList.districtCode = listVo.districtCode // 境内目的地
      resetDecList.dutyMode = listVo.dutyMode // 征免方式
      resetDecList.originCountry = listVo.originCountry // 原产国
      resetDecList.tradeCurr = listVo.tradeCurr // 币制
      resetDecList.gNo = decLen // 项号
      this.decList = resetDecList
      // 清除AI颜色
      this.bodyAiColor = businessUtil.generateDecAiBodyColor()
      for (let key in this.bodyAiColor) {
        this.bodyAiColor[key] = 2
      }
      this.showGoodsAttrValue = ''
      this.showGoodsSpec = ''
      this.bodyController.qty2Disabled = true
      this.initBodySelect()
      this.focusDecList()
      this.gModelController = true
      // 如果时单选 清空单选
      if (!this.isCheckbox) {
        this.bodyListRadio = ''
        this.checkedTableList[0] = []
      }
    },
    // 保存报关单表体所需要做的逻辑校验
    validDecList () {
      // 校验特殊格式
      let messgeTips = []
      let mesLen
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeMode')
      let tradeMode = this.$store.state[this.moduleName].tradeMode
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'tradeCountry')
      let tradeCountry = this.$store.state[this.moduleName].tradeCountry
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'manualNo')
      let manualNo = this.$store.state[this.moduleName].manualNo
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'cutMode')
      let cutMode = this.$store.state[this.moduleName].cutMode
      decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'distinatePort')
      let distinatePort = this.$store.state[this.moduleName].distinatePort
      for (let i in this.tableList) {
        // 如果 是修改的话 本条数据就不用与自身比较
        if (this.tableList[i].gNo === this.decList.gNo) {
          continue
        }
        let no = parseInt(this.tableList[i].gNo)
        // 1.单价 对比 商品编码 商品名称 和规格型号相同时SSKF-504改 如果规格型号不填不做校验
        if (this.tableList[i].codeTs === this.decList.codeTs && (this.tableList[i].gName === this.decList.gName) && this.decList.gModel && (this.tableList[i].gModel === this.decList.gModel)) {
          if (this.tableList[i].declPrice !== this.decList.declPrice) {
            let message = '该商品单价与项号【' + no + '】的[单价]不一致'
            mesLen = messgeTips.length + 1
            messgeTips.push(mesLen + '.' + message)
          }
        }
        // 2. 币制 加入规格型号相等2.13修改
        if ((this.tableList[i].tradeCurr !== this.decList.tradeCurr) && (this.tableList[i].gModel === this.decList.gModel)) {
          let message = '该商品币制与项号【' + no + '】的[币制]不一致'
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + message)
        }
        // 3.征免方式
        if (this.tableList[i].dutyMode !== this.decList.dutyMode) {
          let message = '该商品征免方式与项号【' + no + '】的[征免方式]不一致'
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + message)
        }
      }
      // 提示 随附单证需要添加哪些单证
      if (!util.isEmpty(this.decList.controlMa)) {
        let arr = this.decList.controlMa.split(',')
        // 1.当进口时
        if (this.controller.iEFlag === 'I') {
          // 6旧机电产品禁止进口提示：项号X、X、X为旧机电产品时，禁止进口
          let arrIndex1 = -1
          arrIndex1 = arr.findIndex((v, i) => {
            return v === '6'
          })
          // 9禁止进口商品提示：项号X、X、X为禁止进口商品
          let arrIndex2 = -1
          arrIndex2 = arr.findIndex((v, i) => {
            return v === '9'
          })
          // A检验检疫商品表头以及表体涉检必填项未填时，提示：项号X、X、X涉检，请完善检验检疫信息
          // D出/入境货物通关单（毛坯钻石用）
          let arrIndex3 = -1
          arrIndex3 = arr.findIndex((v, i) => {
            return v === 'A' || v === 'D'
          })
          if (arrIndex1 > -1) {
            arr.splice(arrIndex1, 1)
            mesLen = messgeTips.length + 1
            messgeTips.push(mesLen + '.' + '为旧机电产品时，禁止进口')
          }
          if (arrIndex2 > -1) {
            arr.splice(arrIndex2, 1)
            mesLen = messgeTips.length + 1
            messgeTips.push(mesLen + '.' + '为禁止进口商品')
          }
          if (arrIndex3 > -1) {
            let flag = false
            if (util.isEmpty(this.decList.purpose) || this.decList.goodsAttr.length === 0) {
              flag = true
            }
            if (flag) {
              arr.splice(arrIndex3, 1)
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '涉检，请完善检验检疫信息')
            }
          }
        } else { // 出口
          // 8禁止出口商品提示：项号X、X、X为禁止出口商品
          let arrIndex4 = -1
          arrIndex4 = arr.findIndex((v, i) => {
            return v === '8'
          })
          if (arrIndex4 > -1) {
            arr.splice(arrIndex4, 1)
            mesLen = messgeTips.length + 1
            messgeTips.push(mesLen + '.' + '为禁止出口商品')
          }
        }
        // 监管方式为“0255 来料深加工”、“0654 进料深加工”，且未添加添加随附单证时提示
        if (['0255', '0654'].includes(tradeMode)) {
          arr.push('K')
        }
        // 进口时启运国为“CHN 中国”，且征免方式为“1 照章征税”，未添加添加随附单证时提示
        if (tradeCountry === 'CHN' && this.controller.iEFlag === 'I' && this.decList.dutyMode === '1') {
          arr.push('c')
        }
        for (let g in arr) {
          if (arr[g] === 'A') {
            arr.splice(g, 1)
            break
          }
        }
        decBus.getBus(this.moduleName).$emit('setDocFieldToSate', 'licenselist')
        let licenselist = this.$store.state[this.moduleName].licenselist
        for (let x in licenselist) {
          for (let y in arr) {
            if (licenselist[x].docuCode === arr[y]) {
              arr.splice(y, 1)
              break
            }
          }
        }
        if (arr.length > 0) {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '可能需要添加代码为:' + arr.join(',') + ' 的随附单证')
        }
      }
      // 出口的时候。校验 备案号涉及E和H打头的在加工成品单耗版本号进行提示
      if (this.controller.iEFlag === 'E' && !util.isEmpty(manualNo) && ['H', 'E'].includes(manualNo.trim().charAt(0).toUpperCase()) && util.isEmpty(this.decList.exgVersion)) {
        mesLen = messgeTips.length + 1
        messgeTips.push(mesLen + '.' + 'E账册或H账册需要填写加工成品单耗版本号')
      }
      // 成交单位和法定单位为个，只，台，套时，数量不能有小数点
      if (util.isExistInArray(this.decList.gUnit, ['001', '006', '007', '008'])) { // 成交单位
        if (!/^[1-9]\d{0,19}$|^$/.test(this.decList.gQty)) {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '成交计量单位为个，只，台，套时.成交数量为整数')
        }
      }
      if (util.isExistInArray(this.decList.unit1, ['001', '006', '007', '008'])) { // 法定第一计量单位
        if (!/^[1-9]\d{0,19}$|^$/.test(this.decList.qty1)) {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '法定第一计量单位为个，只，台，套时.法定第一数量为整数')
        }
      }
      if (util.isExistInArray(this.decList.unit2, ['001', '006', '007', '008'])) { // 法定第二计量单位
        if (!/^[1-9]\d{0,19}$|^$/.test(this.decList.qty2)) {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '法定第二计量单位为个，只，台，套时.法定第二数量为整数')
        }
      }
      // 校验 成交单位 和数量之间的对应关系
      // 当法定第一计量单位，法定第二计量单位或成交计量单位其中一个为千个时对应的法定第一计量单位,
      // 法定第二计量单位或成交计量单位为个的遵从对应的数量比为1:1000，如果对应的逻辑不对的，提示错误
      // 035 千克  054 千个 147-千米 050-千只 051-千块 052-千盒 053-千枝 058-千张 040-百副 041-百支 042-百把 043-百个 044-百片 049-百枝
      let arr = ['035', '054', '147', '050', '051', '052', '053', '058', '040', '041', '042', '043', '044', '049']
      // 036-克 007-个 030-米 008-只 017-块 140-盒 013-枝 010-张 019-副 012-支 016-把 007-个 020-片 013-枝
      // let arr2 = ['036', '007', '030', '008', '017', '140', '013', '010', '019', '012', '016', '007', '020', '013']
      let compareMap = {
        '035': {'unit': '036', 'rate': 1000, 'origName': '千克', 'compName': '克'},
        '054': {'unit': '007', 'rate': 1000, 'origName': '千个', 'compName': '个'},
        '147': {'unit': '030', 'rate': 1000, 'origName': '千米', 'compName': '米'},
        '050': {'unit': '008', 'rate': 1000, 'origName': '千只', 'compName': '只'},
        '051': {'unit': '017', 'rate': 1000, 'origName': '千块', 'compName': '块'},
        '052': {'unit': '140', 'rate': 1000, 'origName': '千盒', 'compName': '盒'},
        '053': {'unit': '013', 'rate': 1000, 'origName': '千枝', 'compName': '枝'},
        '058': {'unit': '010', 'rate': 1000, 'origName': '千张', 'compName': '张'},
        '040': {'unit': '019', 'rate': 100, 'origName': '百副', 'compName': '副'},
        '041': {'unit': '012', 'rate': 100, 'origName': '百支', 'compName': '支'},
        '042': {'unit': '016', 'rate': 100, 'origName': '百把', 'compName': '把'},
        '043': {'unit': '007', 'rate': 100, 'origName': '百个', 'compName': '个'},
        '044': {'unit': '020', 'rate': 100, 'origName': '百片', 'compName': '片'},
        '049': {'unit': '013', 'rate': 100, 'origName': '百枝', 'compName': '枝'}
      }
      /**
       * 1.如果成交单位 为千克 百这种大单位时,如果法定第一单位与当叫单位不一致并 为对应的 克等最小单位时候 并且 法定
       * 第一单位与 成交单位都有值的情况下，需要满足 数量上的倍率关系
       */
      if (arr.includes(this.decList.gUnit)) {
        if (this.decList.gUnit !== this.decList.unit1 && this.decList.unit1 === compareMap[this.decList.gUnit].unit) {
          if (this.decList.gQty && this.decList.qty1) {
            let gQty = decUtil.Mul(parseFloat(this.decList.gQty), compareMap[this.decList.gUnit].rate)
            let qty1 = parseFloat(this.decList.qty1)
            if (gQty !== qty1) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '成交单位为' + compareMap[this.decList.gUnit].origName + ',法定第一单位为' + compareMap[this.decList.gUnit].compName + ',相对应数量倍率为:' + compareMap[this.decList.gUnit].rate)
            }
          }
        }
        if (!util.isEmpty(this.decList.unit2) && (this.decList.gUnit !== this.decList.unit2) && (this.decList.unit2 === compareMap[this.decList.gUnit].unit)) {
          if (this.decList.gQty && this.decList.qty2) {
            let gQty = decUtil.Mul(parseFloat(this.decList.gQty), compareMap[this.decList.gUnit].rate)
            let qty2 = parseFloat(this.decList.qty2)
            if (gQty !== qty2) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '成交单位为' + compareMap[this.decList.gUnit].origName + ',法定第二单位为' + compareMap[this.decList.gUnit].compName + ',相对应数量倍率为:' + compareMap[this.decList.gUnit].rate)
            }
          }
        }
      }
      if (arr.includes(this.decList.unit1)) {
        if (this.decList.unit1 !== this.decList.gUnit && (this.decList.gUnit === compareMap[this.decList.unit1].unit)) {
          if (this.decList.qty1 && this.decList.gQty) {
            let gQty = parseFloat(this.decList.gQty)
            let qty1 = decUtil.Mul(parseFloat(this.decList.qty1), compareMap[this.decList.unit1].rate)
            if (gQty !== qty1) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '法定第一单位为' + compareMap[this.decList.unit1].origName + ',成交单位为' + compareMap[this.decList.unit1].compName + ',相对应数量倍率为:' + compareMap[this.decList.unit1].rate)
            }
          }
        }
        if (!util.isEmpty(this.decList.unit2) && (this.decList.unit1 !== this.decList.unit2) && (this.decList.unit2 === compareMap[this.decList.unit1].unit)) {
          if (this.decList.qty1 && this.decList.qty2) {
            let qty1 = decUtil.Mul(parseFloat(this.decList.qty1), compareMap[this.decList.gUnit].rate)
            let qty2 = parseFloat(this.decList.qty2)
            if (qty1 !== qty2) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '法定第一单位为' + compareMap[this.decList.unit1].origName + ',法定第二单位为' + compareMap[this.decList.unit1].compName + ',应满足倍率为:' + compareMap[this.decList.unit1].rate)
            }
          }
        }
      }
      if (arr.includes(this.decList.unit2)) {
        if (this.decList.unit2 !== this.decList.gUnit && (this.decList.gUnit === compareMap[this.decList.unit2].unit)) {
          if (this.decList.qty2 && this.decList.gQty) {
            let gQty = parseFloat(this.decList.gQty)
            let qty2 = decUtil.Mul(parseFloat(this.decList.qty2), compareMap[this.decList.unit2].rate)
            if (gQty !== qty2) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '法定第二单位为' + compareMap[this.decList.unit2].origName + ',成交单位为' + compareMap[this.decList.unit2].compName + ',相对应数量倍率为:' + compareMap[this.decList.unit2].rate)
            }
          }
        }
        if ((this.decList.unit1 !== this.decList.unit2) && (this.decList.unit1 === compareMap[this.decList.unit2].unit)) {
          if (this.decList.qty1 && this.decList.qty2) {
            let qty1 = parseFloat(this.decList.qty1)
            let qty2 = decUtil.Mul(parseFloat(this.decList.qty2), compareMap[this.decList.unit2].rate)
            if (qty1 !== qty2) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '法定第二单位为' + compareMap[this.decList.unit2].origName + ',法定第二单位为' + compareMap[this.decList.unit2].compName + ',应满足倍率为:' + compareMap[this.decList.unit2].rate)
            }
          }
        }
      }
      let _tradeMode = tradeMode
      // 校验 出口表头运抵国和表体目的国一致性
      if (this.controller.iEFlag === 'E' && this.switch['logic_prosecution_part'] === 'Y') {
        if (this.switch['CA000001'] === 'Y' && this.decList.destinationCountry !== tradeCountry) {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口表头【运抵国】和表体【最终目的国】需要一致')
        }
        if (this.switch['CA000002'] === 'Y' && !util.isEmpty(distinatePort)) {
          if (/[0-9]/.test(distinatePort.charAt(0))) {
            if (this.decList.destinationCountry !== 'CHN') {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '出口,【指运港】代码第1位为数字，【最终目的国(地区)】为中国')
            }
          } else {
            if (distinatePort.substr(0, 3) !== this.decList.destinationCountry) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '出口,【指运港]】代码第1位为英文，【最终目的国(地区)】代码与【指运港】代码前3位一致')
            }
          }
        }
        if (this.switch['CA000006'] === 'Y' && _tradeMode === '0654' && this.decList.destinationCountry !== 'CHN') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为进料深加工时,最终目的国（地区）为中国')
        }
        if (this.switch['CA000007'] === 'Y' && _tradeMode === '1427' && this.decList.destinationCountry !== 'CHN') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为出料加工时,最终目的国（地区）为中国')
        }
        if (this.switch['CA000008'] === 'Y' && _tradeMode === '0657' && this.decList.destinationCountry !== 'CHN') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为进料余料结转时,最终目的国（地区）为中国')
        }
      }
      // 校验监管方式 征免性质、征免方式之间的关系
      let _cutMode = cutMode // 征免性质
      if (this.controller.iEFlag === 'I' && this.switch['logic_prosecution_duty_mode'] === 'Y') {
        if (this.switch['EM000001'] === 'Y' && _tradeMode === '0110' && _cutMode === '101' && this.decList.dutyMode !== '1') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为一般贸易，征免性质为一般征税时,征免方式应为照章征税')
        }
        if (this.switch['EM000002'] === 'Y' && _tradeMode === '0110' && _cutMode === '401' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为一般贸易，征免性质为科教用品时,征免方式应为全免')
        }
        if (this.switch['EM000003'] === 'Y' && _tradeMode === '0110' && _cutMode === '789' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为一般贸易，征免性质为鼓励项目时,征免方式应为全免')
        }
        if (this.switch['EM000004'] === 'Y' && _tradeMode === '0110' && _cutMode === '799' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为一般贸易，征免性质为自有资金时,征免方式应为全免')
        }
        if (this.switch['EM000005'] === 'Y' && _tradeMode === '0214' && _cutMode === '502' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为来料加工，征免性质为来料加工时,征免方式应为全免')
        }
        if (this.switch['EM000006'] === 'Y' && _tradeMode === '0615' && _cutMode === '503' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为进料对口，征免性质为进料加工时,征免方式应为全免')
        }
        if (this.switch['EM000007'] === 'Y' && _tradeMode === '2025' && _cutMode === '789' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为合资合作设备，征免性质为鼓励项目时,征免方式应为全免')
        }
        if (this.switch['EM000008'] === 'Y' && _tradeMode === '2225' && _cutMode === '789' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为外资设备物品，征免性质为鼓励项目时,征免方式应为全免')
        }
        if (this.switch['EM000009'] === 'Y' && _tradeMode === '0320' && _cutMode === '501' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '进口,监管方式为不作价设备，征免性质为加工设备时,征免方式应为全免')
        }
      }
      if (this.controller.iEFlag === 'E' && this.switch['logic_prosecution_duty_mode'] === 'Y') {
        if (this.switch['EM000010'] === 'Y' && _tradeMode === '0110' && _cutMode === '101' && this.decList.dutyMode !== '1') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为一般贸易，征免性质为一般征税时,征免方式应为照章征税')
        }
        if (this.switch['EM000011'] === 'Y' && _tradeMode === '0110' && _cutMode === '601' && this.decList.dutyMode !== '1') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为一般贸易，征免性质为中外合资时,征免方式应为照章征税')
        }
        if (this.switch['EM000012'] === 'Y' && _tradeMode === '0110' && _cutMode === '602' && this.decList.dutyMode !== '1') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为一般贸易，征免性质为中外合作时,征免方式应为照章征税')
        }
        if (this.switch['EM000013'] === 'Y' && _tradeMode === '0110' && _cutMode === '603' && this.decList.dutyMode !== '1') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为一般贸易，征免性质为外资企业时,征免方式应为照章征税')
        }
        if (this.switch['EM000014'] === 'Y' && _tradeMode === '0214' && _cutMode === '502' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为来料加工，征免性质为来料加工时,征免方式应为全免')
        }
        if (this.switch['EM000015'] === 'Y' && _tradeMode === '0615' && _cutMode === '503' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为进料对口，征免性质为来料加工时,征免方式应为全免')
        }
        if (this.switch['EM000015'] === 'Y' && _tradeMode === '0615' && _cutMode === '503' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为进料对口，征免性质为来料加工时,征免方式应为全免')
        }
        if (this.switch['EM000016'] === 'Y' && _tradeMode === '3100' && _cutMode === '299' && this.decList.dutyMode !== '3') {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口,监管方式为无代价抵偿，征免性质为其他法定时,征免方式应为全免')
        }
      }
      return messgeTips
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
    // 征免方式 code 转 name
    dutyModeChangeName (value) {
      for (let i in this.saasLevymode) {
        if (this.saasLevymode[i].codeField === value) {
          this.decList.dutyModeValue = this.saasLevymode[i].nameField
          break
        }
      }
    },
    // 最终目的国 code 转 name
    destinationCountryChangeName (value) {
      for (let i in this.saasCountry3) {
        if (this.saasCountry3[i].codeField === value) {
          this.decList.destinationCountryValue = this.saasCountry3[i].nameField
          break
        }
      }
    },
    // 打开货物属性弹出框
    openGoodAtrrContent () {
      this.saasGoodsAttr = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
      this.goodsAttrCollection = [] // 先清空以前的数据
      if (this.decList.goodsAttr.length > 0) {
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
    // 打开检验检疫货物规格 弹出框
    openGoodsSpecContent () {
      // 赋值到decList
      this.goodsSpecForm.stuffNote = this.decList.stuffNote
      this.goodsSpecForm.prodValidDt = this.decList.prodValidDt
      this.goodsSpecForm.prodQgp = this.decList.prodQgp
      this.goodsSpecForm.engManentCnm = this.decList.engManentCnm
      this.goodsSpecForm.goodsSpec = this.decList.goodsSpec
      this.goodsSpecForm.goodsModel = this.decList.goodsModel
      this.goodsSpecForm.goodsBrand = this.decList.goodsBrand
      if (!util.isEmpty(this.decList.produceDate)) {
        this.goodsSpecForm.produceDate = this.decList.produceDate.split(';')
      } else {
        this.goodsSpecForm.produceDate = ''
      }
      this.goodsSpecForm.prodBatchNo = this.decList.prodBatchNo
      this.goodsSpecForm.mnufctrRegno = this.decList.mnufctrRegno
      this.goodsSpecVisible = true
    },
    // 保存 检验检疫货物规格
    saveGoodsSpec (data) {
      if (data) {
        this.goodsSpecForm = util.simpleClone(data.goodsSpecForm)
        let param = []
        for (let index in this.goodsSpecForm) {
          if (util.isEmpty(this.goodsSpecForm[index]) === false) {
            param.push(this.goodsSpecForm[index])
          }
        }
        this.showGoodsSpec = param.join(',')
        // 赋值到decList
        this.decList.stuffNote = this.goodsSpecForm.stuffNote
        this.decList.prodValidDt = this.goodsSpecForm.prodValidDt
        this.decList.prodQgp = this.goodsSpecForm.prodQgp
        this.decList.engManentCnm = this.goodsSpecForm.engManentCnm
        this.decList.goodsSpec = this.goodsSpecForm.goodsSpec
        this.decList.goodsModel = this.goodsSpecForm.goodsModel
        this.decList.goodsBrand = this.goodsSpecForm.goodsBrand
        if (!util.isEmpty(this.goodsSpecForm.produceDate)) {
          this.decList.produceDate = this.goodsSpecForm.produceDate.join(';')
        } else {
          this.decList.produceDate = ''
        }
        this.decList.prodBatchNo = this.goodsSpecForm.prodBatchNo
        this.decList.mnufctrRegno = this.goodsSpecForm.mnufctrRegno
      }
      this.goodsSpecVisible = false
      // 打开货物属性弹框
      this.openGoodAtrrContent()
    },
    // 打开 危险货物 弹出框
    openDangerGoods () {
      this.dangerForm = {
        noDangFlag: this.decList.noDangFlag, // 非危险化学品/组分
        unCode: this.decList.unCode, // UN编码
        dangName: this.decList.dangName, // 危险货物名称
        dangPackType: this.decList.dangPackType, // 危包类别
        dangPackSpec: this.decList.dangPackSpec // 危包规格
      }
      this.dangerGoodsVisible = true
    },
    // 危险品货物 确定按钮
    backDangerGoods (param) {
      if (param) {
        this.dangerForm = util.simpleClone(param.dangerForm)
        this.decList.noDangFlag = this.dangerForm.noDangFlag // 非危险化学品/组分
        this.decList.unCode = this.dangerForm.unCode // UN编码
        this.decList.dangName = this.dangerForm.dangName // 危险货物名称
        this.decList.dangPackType = this.dangerForm.dangPackType // 危包类别
        this.decList.dangPackSpec = this.dangerForm.dangPackSpec // 危包规格
      }
      this.dangerGoodsVisible = false
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
    popDataSet (value) {
      this.getTypeToBody(this.currentShowNoteField, this.currentShowField + 'Color')
      if (this.bodyVisible[this.currentShowNoteField]) {
        this.popoverVisible = true
        this.reference = this.$refs[value].$vnode.elm
      }
    },
    popHandle (value) {
      this.currentShowField = value
      this.currentShowNoteField = value + 'Note'
      if (this.popoverVisible) {
        this.popoverVisible = false
        this.$nextTick(() => {
          this.popDataSet(value)
        })
      } else {
        this.popDataSet(value)
      }
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      if (this.bodyCheck[value + 'Note']) {
        this.popHandle(value)
      } else {
        this.popoverVisible = false
      }
      if (this.$route.query.aiType) {
        this.$emit('drawBoyArea', {value: value, gNo: this.decList.gNo})
      }
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
      let ref
      let enter
      if (e.target.parentElement.offsetParent.attributes.class.nodeValue.indexOf('el-select') > -1) {
        ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
        enter = e.target.parentElement.offsetParent.attributes.enter
        // this.$refs[ref].blur()
      } else {
        if (!util.isEmpty(e.target.attributes.dataRef)) {
          ref = e.target.attributes.dataRef.nodeValue
          enter = e.target.attributes.enter
        }
      }
      if (next) {
        if (enter && enter.nodeValue === 'no') {
          // 回车后改变颜色改变字体颜色
          if (!util.isEmpty(this.bodyAiColor[ref])) {
            this.bodyAiColor[ref] = 2
          }
          if (ref === 'codeTs') {
            this.openProductList(true)
          }
          if (ref === 'dutyMode') {
            this.directSaveDecList('1')
          } else if (ref === 'purpose') {
            this.directSaveDecList('2')
          }
        } else {
          // 回车后改变颜色改变字体颜色
          if (!util.isEmpty(this.bodyAiColor[ref])) {
            this.bodyAiColor[ref] = 2
          }
          if (ref === 'gName') {
            this.$refs['codeTs'].focus()
            this.$refs['codeTs'].select()
          } else if (ref === 'dutyMode') {
            if (this.isShow2 === true) {
              this.openGoodsSpecContent()
            }
          } else {
            next.focus()
            next.select()
          }
        }
      } else {
        if (ref === 'dutyMode') {
          this.directSaveDecList('1')
        } else if (ref === 'purpose') {
          this.directSaveDecList('2')
        }
      }
    },
    // 设置从 联系单备案商品信息过来的商品
    setManualGoods ({params}) {
      this.tableList = []
      this.refreshDecList()
      // 遍历并赋值 tableList
      let goods = params.list
      let flag = params.flag
      for (let i in goods) {
        this.decList.gNo = +this.tableList.length + 1
        this.decList.contrItem = goods[i].contrItem
        this.decList.gName = goods[i].gname
        this.decList.codeTs = goods[i].codeTs
        if (!util.isEmpty(goods[i].gmodel)) {
          this.decList.gModel = goods[i].gmodel // 规格型号
        }
        this.decList.gQty = goods[i].gQty
        this.decList.gUnit = goods[i].gUnit
        this.decList.gUnitValue = goods[i].gUnitName
        this.decList.qty1 = goods[i].qty1
        this.decList.unit1 = goods[i].unit1
        this.decList.unit1Value = goods[i].unit1Name
        this.decList.qty2 = goods[i].qty2
        this.decList.unit2 = goods[i].unit2
        this.decList.unit2Value = goods[i].unit2Name
        this.decList.tradeCurr = goods[i].curr
        this.decList.tradeCurrvalue = goods[i].currName
        this.decList.originCountry = goods[i].originCountry // 原产国(地区)
        this.decList.originCountryValue = goods[i].originCountryName // 原产国(地区)
        if (flag === 'Y') {
          this.decList.destinationCountry = 'CHN' // 最终目的国
          this.decList.originCountryValue = '中国' // 最终目的国
          this.decList.dutyMode = '1'
          this.decList.dutyModeValue = '照章征税'
        } else {
          this.decList.destinationCountry = goods[i].destinationCountry // 最终目的国
          this.decList.originCountryValue = goods[i].destinationCountryName // 最终目的国
          this.decList.dutyMode = goods[i].dutyMode
          this.decList.dutyModeValue = goods[i].dutyModeName
        }
        this.decList.declPrice = goods[i].decPrice // 单价
        this.decList.declTotal = goods[i].declTotal // 总价
        this.decList.exgVersion = goods[i].exgVersion // 加工成品单耗版本号
        this.decList.exgNo = goods[i].exgNo // 货号
        // this.decList.districtCode = goods[i].districtCode // 货源地
        this.tableList.push(util.simpleClone(this.decList))
        this.refreshDecList()
      }
      this.controller.cDisabled = true
    },
    // 修改是从c改变的。则需要清除表体数据
    modifyManualGoods () {
      this.tableList = []
      this.controller.cDisabled = false
      this.refreshDecList()
    },
    // 阻止默认的keydown 触发按钮事件
    prevent (e) {
      decUtil.prevent(e)
    },
    // 提供给外面调用
    initSelect (arr, form) {
      decUtil.initSelect(this, arr, form)
    },
    initBodySelect () {
      decUtil.initSelect(this, this.bodySelect, this.decList)
    },
    // 提供给商品英文关系的外部接口 变更表体的商品英文名称
    modifyDeclGoodsEname (vo) {
      for (let n in this.tableList) {
        if (vo.gNo === this.tableList[n].gNo) {
          this.tableList[n].declGoodsEname = vo.declGoodsEname
        }
      }
    },
    getBodyDetail (bodyList) {
      this.tableList = util.simpleClone(bodyList)
      this.tableList.forEach(item => {
        item.declPrice = decUtil.removeZero(item.declPrice)
        item.gQty = decUtil.removeZero(item.gQty)
        item.qty1 = decUtil.removeZero(item.qty1)
        item.qty2 = decUtil.removeZero(item.qty2)
        item.declTotal = decUtil.removeZero(item.declTotal)
        if (item.controlMa) {
          if (item.ciqMa) {
            item.conMaView = item.controlMa + '|' + item.ciqMa
          } else {
            item.conMaView = item.controlMa
          }
        }
      })
      this.decList.gNo = this.tableList.length + 1
      // 初始化征免方式 调用子组件的方法
      decBus.getBus(this.moduleName).$emit('initdutyMode', null)
    },
    initBodyData () {
      this.decList = businessUtil.generateDecBody()
      this.decList.gNo = '1' // 项号
      this.tableList = []
      this.checkedTableList = []
      this.resetDodySelect()
      this.initBodyCountry()
    },
    initBodyCountry () {
      if (this.controller.iEFlag === 'I') { // 进口
        //  设置表体 最终目的国(地区)默认值为中国
        this.initBodySingleSeLect('destinationCountry', 'CHN', {
          obj: 'saasCountry3',
          params: 'SAAS_COUNTRY'
        })
      } else {
        //  设置表体 原产国(地区)默认值为中国
        this.initBodySingleSeLect('originCountry', 'CHN', {
          obj: 'saasCountry4',
          params: 'SAAS_COUNTRY'
        })
      }
    },
    clearBodyData () {
      for (let i in this.tableList) {
        this.tableList[i].decListPid = ''
        this.tableList[i].decPid = ''
      }
      this.decList.decListPid = ''
      this.decList.decPid = ''
    },
    initBodySingleSeLect (field, value, selectObjec) {
      this.decList[field] = value
      this.selectObj = selectObjec
      this.checkParamsList(value, 'init')
    },
    backZbookList (goods) {
      // 遍历并赋值 tableList
      for (let i in goods) {
        this.decList.gNo = +this.tableList.length + 1
        this.decList.contrItem = goods[i].contrItem
        this.decList.gName = goods[i].gname
        this.decList.codeTs = goods[i].codeTs
        if (!util.isEmpty(goods[i].gmodel)) {
          this.decList.gModel = goods[i].gmodel // 规格型号
        }
        this.decList.gQty = goods[i].gQty
        this.decList.gUnit = goods[i].gUnit
        this.decList.gUnitValue = goods[i].gUnitName
        this.decList.qty1 = goods[i].qty1
        this.decList.unit1 = goods[i].unit1
        this.decList.unit1Value = goods[i].unit1Name
        this.decList.qty2 = goods[i].qty2
        this.decList.unit2 = goods[i].unit2
        this.decList.unit2Value = goods[i].unit2Name
        this.decList.tradeCurr = goods[i].curr
        this.decList.tradeCurrvalue = goods[i].currName
        this.decList.originCountry = goods[i].originCountry // 原产国(地区)
        this.decList.originCountryValue = goods[i].originCountryName // 原产国(地区)
        this.decList.destinationCountry = goods[i].destinationCountry // 最终目的国
        this.decList.originCountryValue = goods[i].destinationCountryName // 最终目的国
        this.decList.dutyMode = goods[i].dutyMode
        this.decList.dutyModeValue = goods[i].dutyModeName
        this.decList.declPrice = goods[i].decPrice // 单价
        this.decList.declTotal = goods[i].declTotal // 总价
        this.decList.exgVersion = goods[i].exgVersion // 加工成品单耗版本号
        this.decList.exgNo = goods[i].exgNo // 货号
        // this.decList.districtCode = goods[i].districtCode // 货源地
        this.tableList.push(this.decList)
        this.refreshDecList()
      }
    },
    HBookClearBody () {
      /**
       * 清除表体数据
       * 如果 备案号的值发生了改变 表体table 表的数据需要全部清除掉
       * 如果 表体显示数据 的gNo如果为1 则不刷新 如果不为1则刷新
       */
      this.tableList = []
      this.checkedTableList = []
      if (this.decList.gNo !== '1') {
        this.refreshDecList()
      }
    },
    // 删除备案号的操作逻辑
    delelteManualNo () {
      if (this.controller.isWholeDec) { // 完整申报
        // 1.完整申报需要清除表体数据的备案序号
        for (let i in this.tableList) {
          this.tableList[i].contrItem = ''
        }
        this.bodyController.contrItemDisabled = true
      } else {
        // 1 如果不是完整申报 则需要 清除表体的数据
        this.bodyController.contrItemDisabled = true
        this.tableList = []
        this.checkedTableList = []
        if (this.decList.gNo.toString() !== '1') {
          this.refreshDecList()
        } else {
          this.decList.contrItem = ''
        }
      }
    },
    setBodyAiColor (bodyAiColorList) {
      this.bodyAiColorList = util.simpleClone(bodyAiColorList)
    },
    // 核注清单数据反填
    emsDataBack (bodyVo, body) {
      this.tableList = []
      let tabeList = []
      for (let n in bodyVo) {
        let decLen = tabeList.length + 1
        let resetDecList = businessUtil.generateDecBody()
        resetDecList.decPid = this.controller.pid
        resetDecList.gNo = decLen // 项号
        for (let key1 in body) {
          if (bodyVo[n][body[key1].filed]) {
            resetDecList[key1] = bodyVo[n][body[key1].filed].toString()
          }
        }
        if (bodyVo[n].dclCurrcdValue) {
          resetDecList.tradeCurrValue = bodyVo[n].dclCurrcdValue // 币制翻译
        }
        if (bodyVo[n].destinationNatcdValue) {
          resetDecList.destinationCountryValue = bodyVo[n].destinationNatcdValue // 最终目的国
        }
        if (bodyVo[n].natcdValue) {
          resetDecList.originCountryValue = bodyVo[n].natcdValue // 原产国名称
        }
        if (bodyVo[n].dclUnitcdValue) {
          resetDecList.gUnitValue = bodyVo[n].dclUnitcdValue // 成交计量单位
        }
        if (bodyVo[n].lvyrlfModecdValue) {
          resetDecList.dutyModeValue = bodyVo[n].lvyrlfModecdValue // 原产国名称
        }
        let ownerCode = this.$store.state[this.moduleName].ownerCode
        if (ownerCode) {
          resetDecList.districtCode = ownerCode.toString().substring(0, 5)
        }
        tabeList.push(util.simpleClone(resetDecList))
      }
      this.tableList = tabeList
      // 重置 decList
      this.resetBodyForOther()
    },
    emsDataBackAll (body, coverFlag) {
      if (body.length !== 0) {
        decBus.getBus(this.moduleName).$emit('setHeadFieldToSate', 'ownerCode')
        let ownerCode = this.$store.state[this.moduleName].ownerCode
        for (let m in body) {
          if (body[m]['children'] === undefined) {
            let index = +body[m].gNo - 1
            if (body[m].decName === 'gModel' && coverFlag === false) {
            } else {
              this.tableList[index][body[m].decName] = body[m].billValue
            }
          } else {
            if (body[m].decName === 'gModel' && coverFlag === false) {
            } else {
              let index = +body[m].gNo - 1
              this.tableList[index][body[m].decName] = body[m].billValue
            }
            let children = body[m]['children']
            for (let mn in children) {
              let index = +children[mn].gNo - 1
              if (children[mn].decName === 'gModel' && coverFlag === false) {
              } else {
                this.tableList[index][children[mn].decName] = children[mn].billValue
              }
            }
          }
          // 通过消费使用/生产销售单位的前五位补充表体商品的境内目的地/货源地代码
          if (ownerCode) {
            let index = +body[m].gNo - 1
            this.tableList[index].districtCode = ownerCode.toString().substring(0, 5)
          }
        }
        // 强制刷新DOM
        this.tableList.push({})
        this.tableList.pop()
      }
    },
    setTableListToSate () {
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'tableList', value: this.tableList})
    },
    setBodyControllerFieldValue (param) {
      for (let key in param) {
        this.bodyController[key] = param[key]
      }
    },
    // 智能归类
    intelligentGoods () {
      if (!this.decList.gName) {
        this.messageTips('请输入商品名称')
        return false
      }
      this.classifyGoodsVisible = true
    },
    // 归类检查
    intelligentCheck () {
      if (!this.decList.gName || !this.decList.codeTs) {
        this.messageTips('请输入商品名称及商品编码!')
        return false
      }
      if (!/^\d{10}$/.test(this.decList.codeTs)) {
        this.messageTips('请正确输入10位商品编码!')
        return false
      }
      // 检查
      this.$post({
        url: 'API@/saas-document-center/category/queryCategoryResult',
        data: {hs: this.decList.codeTs, querykey: this.decList.gName},
        success: (res) => {
          let flag = res.result
          if (!flag) {
            this.$confirm('归类结果可能存在偏差,是否继续制单？', '归类预警', {
              confirmButtonText: '智能归类',
              cancelButtonText: '继续制单',
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              type: 'warning'
            }).then(() => {
              this.classifyGoodsVisible = true
            }).catch(() => {
              // 这里不弹出商品列表直接 弹出检验检疫列表或者申报要素
              this.intelligentRight()
            })
          } else {
            this.messageTips('归类正常', 'success')
            setTimeout(() => {
              this.intelligentRight()
            }, 2000)
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 重新归类回参
    backClassifyGoods (param) {
      this.decList.codeTs = param.codeTs
      this.classifyGoodsVisible = false
      this.intelligentRight()
    },
    formatBodyCheckData (decVerifyListVOs, listMap) {
      decVerifyListVOs && (this.bodyCheckList = decVerifyListVOs) // 表体标记颜色
      listMap && (this.bodyCheckTipsList = listMap) // 表体的表的审批意见
      this.tableListOther = util.simpleClone(this.tableList) // 当时的表体数据
    },
    initErrorInfo () {
      // bodyCheckList: [], // 存放表体审核结果List
      // bodyCheck: {}, // 存放表头审核结果 单挑商品信息
      // bodyCheckTipsList: [], // 存放表体 审核的审批意见 List
      // bodyCheckTips: {} // 存放表体审核意见单条商品
      this.bodyCheck = this.initBodyCheck()
      this.errorColor = this.initErrorColor()
      if (+this.decList.gNo - 1 < this.tableListOther.length && this.bodyCheckTipsList[+this.decList.gNo - 1] && this.bodyCheckList[+this.decList.gNo - 1]) {
        this.bodyCheckTips = util.simpleClone(this.bodyCheckTipsList[+this.decList.gNo - 1])
        this.bodyCheck = util.simpleClone(this.bodyCheckList[+this.decList.gNo - 1])
        for (let key in this.colorAndCheck) {
          if (this.bodyCheck[this.colorAndCheck[key].check] === '1') {
            let decListOther = this.tableListOther[+this.decList.gNo - 1]
            if (decListOther[key].toString() === this.decList[key].toString()) {
              this.errorColor[this.colorAndCheck[key].color] = true
            }
          }
        }
      }
    },
    closeErrorTips (param) {
      this.popoverVisible = false
      this.bodyVisible[param.colum] = false
    },
    getTypeToBody (clomn, colorField) {
      // 如果要显示审核记录 需要满足条件 1.审核状态必须为4审核驳回状态2.当前字段必须标记为错误 '1'
      if (this.controller.showCheckTips && this.bodyCheck[colorField].toString() === '1') {
        // 如果没有值 则赋值为空
        if (!this.bodyCheckTips[clomn]) {
          this.bodyCheckTips[clomn] = []
        }
        this.bodyVisible[clomn] = true
      } else {
        this.bodyVisible[clomn] = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../common/decCss';
  .priceDiv{
    text-align: center;
    padding: 10px 0;
  }
  .dec-ai-table {
    table,table tr th, table tr td { border:1px solid #e4eaec; }
  table { width: 100%; min-height: 25px; line-height: 25px; text-align: center; border-collapse: collapse;}
  table th {
    padding: 0px;
    font-size: 12px;
    color: white;
    background-color: #64A7EB;
    border-right-color: #e4eaec;
    height: 20px;
    vertical-align: middle;
  }
  }
</style>
