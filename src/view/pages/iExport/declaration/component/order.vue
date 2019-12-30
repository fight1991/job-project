<template>
  <section class="sys-main">
    <el-row class="mg-b-15">
      <span class="padR">接单类型</span>
      <el-radio-group v-model="orderType" @change="orderChange" :disabled="isSave">
        <el-radio label="dec">报关单</el-radio>
        <el-radio v-if="iEFlag === 'import'" label="decTs">两步申报</el-radio>
        <el-radio label="invt">核注清单</el-radio>
        <el-radio label="log">物流作业</el-radio>
      </el-radio-group>
    </el-row>
    <div class='sys-jiner-class'>
    <el-tabs v-model="activeNameHead">
      <el-tab-pane label="基本信息" name="baseInfo">
        <el-container>
          <el-main style="padding:0px 0px 20px 0px;">
          <!---表头开始  -->
            <div class='dec-div' v-if="orderType=='dec'" style="margin-top:0px;">
              <el-form ref="baseInfo" :model="baseInfo" :rules="baseRule" class="order-label" label-width="89px" size="mini" @keyup.enter.native="switchFoucsByEnter">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="接单编号" :class="{ 'require-color': controller.requireColor }">
                      <el-input v-model="baseInfo.innerNo" readOnly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="客户业务号">
                      <el-input v-model="baseInfo.ref1" maxlength="20" :readOnly="isStatus" ref="ref1"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="接单日期">
                      <el-date-picker v-model="baseInfo.rcvDate" size="mini" :clearable="false" type="date" placeholder="选择日期" style="width:100%;padding:0 0px;" :disabled="isView"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="申报截止日期">
                      <el-date-picker v-model="baseInfo.demandDate" size="mini" :clearable="false" type="date" placeholder="选择日期"  style="width:100%" :disabled="isView"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="委托客户">
                      <el-autocomplete ref="company"
                        :maxlength="70"
                        size='mini'
                        v-model="baseInfo.company"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelectCorp($event, '4')"
                        @input="companyChange"
                        :readOnly="isStatus">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="合同协议号">
                      <el-input v-model="baseInfo.contrNo" :readOnly="isView" maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="境内收发货人" :class="{ 'require-color': controller.requireColor }" key="decTradeScc">
                      <el-input v-model="baseInfo.tradeCoScc" @blur="queryCropInfo('tradeCoScc')" maxlength="18"  placeholder="18位社会信用代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="decTradeCode">
                      <el-input v-model="baseInfo.tradeCode" @blur="queryCropInfo('tradeCode')" maxlength="10"  placeholder="10位海关编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="consigneeCode">
                      <el-input v-model="baseInfo.consigneeCode" maxlength="10" placeholder="10位检验检疫编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0" key="decTradeName">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.tradeName"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '1')"
                        :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="境外收发货人">
                      <el-input v-model="baseInfo.overseasConsignorCode" maxlength="20" placeholder="境外收发货人代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label-width="0">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.overseasConsignorCname"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '3')"
                          :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item :label="iEFlag=='import'?'消费使用单位':'生产销售单位'" :class="{ 'require-color': controller.requireColor }" key="decOwnScc">
                      <el-input v-model="baseInfo.ownerCodeScc" @blur="queryCropInfo('ownerCodeScc')" maxlength="18" placeholder="18位社会信用代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="decOwnCode">
                      <el-input v-model="baseInfo.ownerCode" @blur="queryCropInfo('ownerCode')" maxlength="10"  placeholder="10位海关编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="ownerCiqCode">
                      <el-input v-model="baseInfo.ownerCiqCode" maxlength="10" placeholder="10位检验检疫编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0" key="decOwnName">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.ownerName"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '2')"
                          :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="运输方式" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.trafMode" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('transportList','SAAS_TRANSPORT_TYPE')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('transportList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in transportList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="提运单号">
                      <el-input v-model="baseInfo.billNo" :readOnly="isView" maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="件数" :class="{ 'require-color': controller.requireColor }"  prop="packNo">
                      <el-input v-model="baseInfo.packNo" :readOnly="isView" maxlength="9"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="包装种类">
                      <el-select size="mini" filterable v-model="baseInfo.wrapType"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('saasWrapList','SAAS_WRAP')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasWrapList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in saasWrapList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField+' '+item.otherField+' '+item.extendField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2"  style="border-right:1px solid #B7B7B7">
                    <el-form-item label-width="0">
                      <el-button style="width:100%;background-color:#287fca;color: #fff" @click="openWrap">其他包装</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="毛重" prop="grossWt">
                      <el-input v-model="baseInfo.grossWt" :readOnly="isView" maxlength="19"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="净重" prop="netWt">
                      <el-input v-model="baseInfo.netWt" :readOnly="isView" maxlength="19"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="是否危险品" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.ref0"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('statusList','IS_SATATUS')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('statusList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in statusList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否拼票">
                      <el-select size="mini" filterable v-model="baseInfo.splitFlag"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('statusListA','IS_SATATUS')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('statusListA')"
                        style="width:100%">
                        <el-option
                          v-for="item in statusListA"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="付款周期" prop="billingCycle">
                      <el-input v-model="baseInfo.billingCycle" :readOnly="isView" maxlength="3"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="报关单类型">
                      <el-select size="mini" filterable v-model="baseInfo.declTrnrel"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('decTrnrelList','DEC_TRNREL')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('decTrnrelList')"
                        style="width:100%">
                        <el-option
                          v-for="item in decTrnrelList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      <el-input v-model="baseInfo.note" :readOnly="isStatus" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class='dec-div' v-else-if="orderType=='decTs'" style="margin-top:0px;">
              <el-form ref="baseInfo" :model="baseInfo" :rules="baseRule" class="order-label" label-width="89px" size="mini" @keyup.enter.native="switchFoucsByEnter">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="接单编号" :class="{ 'require-color': controller.requireColor }">
                      <el-input v-model="baseInfo.innerNo" readOnly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="客户业务号">
                      <el-input v-model="baseInfo.ref1" maxlength="20" :readOnly="isStatus" ref="ref1"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="接单日期">
                      <el-date-picker v-model="baseInfo.rcvDate" size="mini" type="date" placeholder="选择日期" style="width:100%;padding:0 0px;" :disabled="isView"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="申报截止日期">
                      <el-date-picker v-model="baseInfo.demandDate" size="mini" type="date" placeholder="选择日期"  style="width:100%" :disabled="isView"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="委托客户">
                      <el-autocomplete ref="company"
                        :maxlength="70"
                        size='mini'
                        v-model="baseInfo.company"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelectCorp($event, '4')"
                        @input="companyChange"
                        :readOnly="isStatus">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="两步申报模式">
                      <el-checkbox-group size="mini" style="line-height: 8px;margin-left: 10px;padding-top: 3px;"  :class="{ 'require-color': controller.requireColor }" @change="changeCon()" v-model="twocontrNo" :readOnly="isView">
                        <el-checkbox label="1" :disabled="isView" >涉证</el-checkbox>
                        <el-checkbox label="2" :disabled="isView" >涉检</el-checkbox>
                        <el-checkbox label="3" :disabled="isView" >涉税</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="境内收发货人" :class="{ 'require-color': controller.requireColor }" key="decTradeScc">
                      <el-input v-model="baseInfo.tradeCoScc" @blur="queryCropInfo('tradeCoScc')" maxlength="18"  placeholder="18位社会信用代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="decTradeCode">
                      <el-input v-model="baseInfo.tradeCode" @blur="queryCropInfo('tradeCode')" maxlength="10"  placeholder="10位海关编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="consigneeCode">
                      <el-input v-model="baseInfo.consigneeCode" maxlength="10" placeholder="10位检验检疫编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0" key="decTradeName">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.tradeName"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '1')"
                        :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="境外收发货人">
                      <el-input v-model="baseInfo.overseasConsignorCode" maxlength="20" placeholder="境外收发货人代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label-width="0">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.overseasConsignorCname"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '3')"
                          :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item :label="iEFlag=='import'?'消费使用单位':'生产销售单位'" :class="{ 'require-color': controller.requireColor }" key="decOwnScc">
                      <el-input v-model="baseInfo.ownerCodeScc" @blur="queryCropInfo('ownerCodeScc')" maxlength="18" placeholder="18位社会信用代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="decOwnCode">
                      <el-input v-model="baseInfo.ownerCode" @blur="queryCropInfo('ownerCode')" maxlength="10"  placeholder="10位海关编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label-width="0" key="ownerCiqCode">
                      <el-input v-model="baseInfo.ownerCiqCode" maxlength="10" placeholder="10位检验检疫编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0" key="decOwnName">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.ownerName"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '2')"
                          :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="运输方式" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.trafMode" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('transportList','SAAS_TRANSPORT_TYPE')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('transportList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in transportList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="提运单号">
                      <el-input v-model="baseInfo.billNo" :readOnly="isView" maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="毛重" prop="grossWt">
                      <el-input v-model="baseInfo.grossWt" :readOnly="isView" maxlength="19"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="是否危险品" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.ref0"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('statusList','IS_SATATUS')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('statusList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in statusList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否拼票">
                      <el-select size="mini" filterable v-model="baseInfo.splitFlag"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('statusListA','IS_SATATUS')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('statusListA')"
                        style="width:100%">
                        <el-option
                          v-for="item in statusListA"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="付款周期" prop="billingCycle">
                      <el-input v-model="baseInfo.billingCycle" :readOnly="isView" maxlength="3"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="报关单类型">
                      <el-select size="mini" filterable v-model="baseInfo.declTrnrel"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('decTrnrelList','TOW_DEC_TRNREL')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('decTrnrelList')"
                        style="width:100%">
                        <el-option
                          v-for="item in decTrnrelList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      <el-input v-model="baseInfo.note" :readOnly="isStatus" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class='dec-div' v-else-if="orderType=='invt'" style="margin-top:0px;">
              <el-form ref="baseInfo" :model="baseInfo" :rules="baseRule" class="order-label" label-width="95px" size="mini" @keyup.enter.native="switchFoucsByEnter">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="接单编号" :class="{ 'require-color': controller.requireColor }">
                      <el-input v-model="baseInfo.innerNo" readOnly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="客户业务号">
                      <el-input v-model="baseInfo.ref1" maxlength="20" :readOnly="isStatus" ref="ref1"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="接单日期">
                      <el-date-picker v-model="baseInfo.rcvDate" size="mini" :clearable="false" type="date" placeholder="选择日期" style="width:100%;padding:0 0px;" :disabled="isView"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="申报截止日期">
                      <el-date-picker v-model="baseInfo.demandDate" size="mini" :clearable="false" type="date" placeholder="选择日期"  style="width:100%" :disabled="isView"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="委托客户">
                      <el-autocomplete ref="company"
                        :maxlength="70"
                        size='mini'
                        v-model="baseInfo.company"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelectCorp($event, '4')"
                        @input="companyChange"
                        :readOnly="isStatus">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="所属模块" prop="ref7" key="ref7">
                      <el-select size="mini" filterable v-model="baseInfo.ref7" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('emsTypeFlagList','DEC_EMSTYPEFLAG')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('emsTypeFlagList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in emsTypeFlagList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="手(账)册编号" prop="manualNo" key="manualNo">
                      <el-autocomplete ref="manualNo"
                        :maxlength="12"
                        size='mini'
                        v-model="baseInfo.manualNo"
                        :fetch-suggestions="queryManualSearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelectManual"
                        :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="9">
                    <el-form-item label="经营单位" :class="{ 'require-color': controller.requireColor }" key="invtTradeScc">
                      <el-input v-model="baseInfo.tradeCoScc" @blur="queryCropInfo('tradeCoScc')" maxlength="18"  placeholder="18位社会信用代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0" key="invtTradeCode">
                      <el-input v-model="baseInfo.tradeCode" @blur="queryCropInfo('tradeCode')" maxlength="10"  placeholder="10位海关编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label-width="0" key="invtTradeName">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.tradeName"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '1')"
                        :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="9">
                    <el-form-item label="加工单位" :class="{ 'require-color': controller.requireColor }" key="invtOwnScc">
                      <el-input v-model="baseInfo.ownerCodeScc" @blur="queryCropInfo('ownerCodeScc')" maxlength="18" placeholder="18位社会信用代码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0" key="invtOwnCode">
                      <el-input v-model="baseInfo.ownerCode" @blur="queryCropInfo('ownerCode')" maxlength="10"  placeholder="10位海关编码" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label-width="0" key="invtOwnName">
                      <el-autocomplete
                        :maxlength="70"
                        placeholder="企业名称"
                        size='mini'
                        v-model="baseInfo.ownerName"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelect($event, '2')"
                        :readOnly="isView">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="企业内部编号" :class="{ 'require-color': controller.requireColor }">
                      <el-input v-model="baseInfo.corpInterNo" maxlength="100" :readOnly="isView"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="料件/成品标志" prop="mtpckEndprdTypecd" key="mtpckEndprdTypecd" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.mtpckEndprdTypecd" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('mtpckEndprdList','EMS_MTPCKEND')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('mtpckEndprdList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in mtpckEndprdList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="监管方式" :class="{ 'require-color': controller.requireColor }" prop="tradeMode">
                      <el-select size="mini" filterable v-model="baseInfo.tradeMode" class="select-Color" :disabled="isView" ref="tradeMode"
                        @focus="tipsFillMessage('saasTradeList','SAAS_TRADE')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasTradeList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in saasTradeList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="运输方式" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.trafMode" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('transportList',orderType === 'invt' ? 'SAAS_TWO_TRANSF' : 'SAAS_TRANSPORT_TYPE')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('transportList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in transportList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="清单类型" prop="billtype" key="billtype" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.billtype" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('billList','BILL_TYPE_TAX')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('billList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in billList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="报关标志" prop="ediId" key="ediId" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.ediId" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('ediIdList','DEC_EDID')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('ediIdList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in ediIdList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="报关类型" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.dclcusTypecd" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('cusTypeList','DEC_CUSTYPE')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('cusTypeList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in cusTypeList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="报关单类型" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.decType" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('emsDecTypeList','SAAS_EMS_DEC_TYPE')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('emsDecTypeList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in emsDecTypeList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="合同协议号">
                      <el-input v-model="baseInfo.contrNo" :readOnly="isView" maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="提运单号">
                      <el-input v-model="baseInfo.billNo" :readOnly="isView" maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="件数" :class="{ 'require-color': controller.requireColor }"  prop="packNo">
                      <el-input v-model="baseInfo.packNo" :readOnly="isView" maxlength="9"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="包装种类">
                      <el-select size="mini" filterable v-model="baseInfo.wrapType"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('saasWrapList','SAAS_WRAP')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasWrapList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in saasWrapList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField+' '+item.otherField+' '+item.extendField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="border-right:1px solid #B7B7B7">
                      <el-form-item label-width="0">
                        <el-button style="width:100%;background-color:#287fca;color: #fff" @click="openWrap">其他包装</el-button>
                      </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="毛重" prop="grossWt">
                      <el-input v-model="baseInfo.grossWt" :readOnly="isView" maxlength="19"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="净重" prop="netWt">
                      <el-input v-model="baseInfo.netWt" :readOnly="isView" maxlength="19"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否危险品" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.ref0"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('statusList','IS_SATATUS')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('statusList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in statusList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="付款周期" prop="billingCycle">
                      <el-input v-model="baseInfo.billingCycle" :readOnly="isView" maxlength="3"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      <el-input v-model="baseInfo.note" :readOnly="isStatus" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class='dec-div' v-else style="margin-top:0px;">
              <el-form ref="baseInfo" :model="baseInfo" :rules="baseRule" class="order-label" label-width="80px" size="mini" @keyup.enter.native="switchFoucsByEnter">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="接单编号" :class="{ 'require-color': controller.requireColor }">
                      <el-input v-model="baseInfo.innerNo" readOnly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="客户业务号">
                      <el-input v-model="baseInfo.ref1" maxlength="20" :readOnly="isStatus" ref="ref1"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="接单日期">
                      <el-date-picker v-model="baseInfo.rcvDate" size="mini" :clearable="false" type="date" placeholder="选择日期" style="width:100%;padding:0 0px;" :disabled="isView"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="委托客户">
                      <el-autocomplete ref="company"
                        :maxlength="70"
                        size='mini'
                        v-model="baseInfo.company"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        @select="handleSelectCorp($event, '4')"
                        @input="companyChange"
                        :readOnly="isStatus">
                      </el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="合同协议号">
                      <el-input v-model="baseInfo.contrNo" :readOnly="isView" maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="运输方式" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.trafMode" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('transportList','SAAS_TRANSPORT_TYPE')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('transportList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in transportList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="贸易条款">
                      <el-select size="mini" filterable v-model="baseInfo.tradeTerms" class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('tradeList','SAAS_TRADE_MODEL')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('tradeList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in tradeList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="提运单号">
                      <el-input v-model="baseInfo.billNo" :readOnly="isView" maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="货物概述">
                      <el-input v-model="baseInfo.goodsOutline" :readOnly="isView" maxlength="400"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="件数" :class="{ 'require-color': controller.requireColor }"  prop="packNo">
                      <el-input v-model="baseInfo.packNo" :readOnly="isView" maxlength="9"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="包装种类">
                      <el-select size="mini" filterable v-model="baseInfo.wrapType"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('saasWrapList','SAAS_WRAP')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasWrapList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in saasWrapList"
                          :key="item.codeField"
                          :label="item.codeField+'-'+item.nameField+' '+item.otherField+' '+item.extendField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2"  style="border-right:1px solid #B7B7B7">
                    <el-form-item label-width="0">
                      <el-button style="width:100%;background-color:#287fca;color: #fff" @click="openWrap">其他包装</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="毛重" prop="grossWt">
                      <el-input v-model="baseInfo.grossWt" :readOnly="isView" maxlength="19"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="净重" prop="netWt">
                      <el-input v-model="baseInfo.netWt" :readOnly="isView" maxlength="19"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否危险品" :class="{ 'require-color': controller.requireColor }">
                      <el-select size="mini" filterable v-model="baseInfo.ref0"  class="select-Color" :disabled="isView"
                        @focus="tipsFillMessage('statusList','IS_SATATUS')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('statusList')"
                        clearable style="width:100%">
                        <el-option
                          v-for="item in statusList"
                          :key="item.codeField"
                          :label="item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="付款周期" prop="billingCycle">
                      <el-input v-model="baseInfo.billingCycle" :readOnly="isView" maxlength="3"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      <el-input v-model="baseInfo.note" :readOnly="isStatus" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="随附单据" name="order">
        <!-- 主显示框 -->
        <div class='dec-query-table' style="padding:0px 0px 20px 0px;">
          <!-- 按钮 -->
          <el-row class="op-btn mg-b-15 border-0">
            <el-button size="mini" class="list-btns list-icon-upload" @click="openExport" :disabled="isLicense"><i></i>上传</el-button>
            <el-button size="mini" class="list-btns list-icon-delete" :disabled="isLicense" @click="deleteDocFun"><i></i>删除</el-button>
            <el-button size="mini" class="list-btns list-icon-download" @click="downloadFun"><i></i>下载</el-button>
            <el-button size="mini" class="list-btns list-icon-upload" :disabled="isUpSingle" @click="loadWindow"><i></i>上传单一窗口</el-button>
          </el-row>
          <!-- 列表table开始 -->
          <el-table class='sys-table-table dec-table' border highlight-current-row size="mini" :data="fileorderList" @selection-change="docSelect">
            <el-table-column  type="selection" width="36" align="center"></el-table-column>
            <el-table-column label="文件名称" min-width="130" align="left">
              <template slot-scope="scope">
                {{scope.row.fileName || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="随附单据格式" min-width="100" align="left">
              <template slot-scope="scope">
                {{formatMed(scope.row.acmpFormFmt) || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="随附单据类型" min-width="100" align="left">
              <template slot-scope="scope">
                {{formatType(scope.row.docType) || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="随附单据编号" min-width="100" align="left">
              <template slot-scope="scope">
                {{scope.row.remarks || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="上传至单一窗口" min-width="100" align="center">
              <template slot-scope="scope">
                {{scope.row.isUpload || '-'}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="提送货信息" name="carInfo">
        <div style="padding:0px 0px 20px 0px;">
          <div class='dec-div' style="margin-top: 0px;">
            <el-form ref="sendInfo" :model="sendInfo" class="order-label" label-width="92px" size="mini" @keyup.enter.native="switchFoucsByEnter">
              <el-row>
                <el-col :span="5">
                  <el-form-item  label="提货地">
                    <el-select  filterable size="mini" v-model="sendInfo.pickUpGCountry" default-first-option @change="getCountry(sendInfo.pickUpGCountry,'1','thd')" class="select-Color" :disabled="isLicense" clearable placeholder="请选择国家">
                      <el-option
                        v-for="item in countryList"
                        :key="item.code +'country'"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="0px">
                    <el-select filterable size="mini" placeholder="请选择省/州" clearable v-model="sendInfo.pickUpGProvince" default-first-option class="select-Color" :disabled="isLicense" @change="getCountry(sendInfo.pickUpGProvince,'2','thd')">
                      <el-option
                        v-for="item in provinceList"
                        :key="item.code +'province'"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="0px">
                    <el-select filterable size="mini" clearable placeholder="请选择城市" default-first-option class="select-Color" :disabled="isLicense" v-model="sendInfo.pickUpGCity">
                      <el-option
                        v-for="item in cityList"
                        :key="item.code +'city'"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label-width="0px">
                    <el-input v-model="sendInfo.deliveryAddrS" maxlength="400" :readonly="isLicense" placeholder="请输入详细地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="13">
                  <el-form-item label="提货地联系人">
                    <el-input v-model="sendInfo.ref1" maxlength="20" :readonly="isLicense"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="提货地联系方式">
                    <el-input v-model="sendInfo.ref2" maxlength="20" :readonly="isLicense"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item  label="送货地">
                    <el-select  filterable size="mini" v-model="sendInfo.deliverGCountry" default-first-option @change="getCountry(sendInfo.deliverGCountry,'1','shd')" :disabled="isLicense" class="select-Color" clearable placeholder="请选择国家">
                      <el-option
                        v-for="item in countryListA"
                        :key="item.code +'country'"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="0px">
                    <el-select filterable size="mini" placeholder="请选择省/州" default-first-option clearable v-model="sendInfo.deliverGProvince" class="select-Color" :disabled="isLicense" @change="getCountry(sendInfo.deliverGProvince,'2','shd')">
                      <el-option
                        v-for="item in provinceListA"
                        :key="item.code +'province'"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="0px">
                    <el-select filterable size="mini" clearable placeholder="请选择城市" default-first-option class="select-Color" :disabled="isLicense" v-model="sendInfo.deliverGCity">
                      <el-option
                        v-for="item in cityListA"
                        :key="item.code +'city'"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label-width="0px">
                    <el-input v-model="sendInfo.deliveryAddrR" maxlength="400" :readonly="isLicense" placeholder="请输入详细地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="13">
                  <el-form-item label="送货地联系人">
                    <el-input v-model="sendInfo.ref3" maxlength="20" :readonly="isLicense"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="送货地联系方式">
                    <el-input v-model="sendInfo.ref4" maxlength="20" :readonly="isLicense"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    </div>
    <div slot="footer"  class="sys-dialog-footer query-btn" style="margin: 0;font-size: 0;">
      <el-button type="primary" v-if="iEFlag == 'import'" size="mini" style="float:left;height: 30px;" @click="addFun('submit')" v-permissions="'CCBA20202010100'" :disabled="isView || status === '2' || ocrNoDis">{{orderType == 'dec'? '生成报关单' :'提交'}}</el-button>
      <el-button type="primary" v-if="iEFlag == 'export'"  size="mini" style="float:left;height: 30px;" @click="addFun('submit')" v-permissions="'CCBA20202020100'" :disabled="isView || status === '2' || ocrNoDis">{{orderType == 'dec'? '生成报关单' :'提交'}}</el-button>
      <el-button type="primary" v-if="orderType == 'dec'" :disabled="isView || status === '2' || ocrNoDis" style="float:left;height: 30px;" @click="submitAi">生成AI制单</el-button>
      <el-button type="primary" v-if="changeExportReceiptView" style="float:left;height: 30px;padding: 6px 20px;" size="mini" @click="changeExportReceipt()">转为出口接单</el-button>
      <el-button type="primary" class='dec-h-30' size="mini" @click="addFun('add')" :disabled="isStatus">暂存</el-button>
      <el-button class='dec-h-30' size="mini" @click="closeOrder">关闭</el-button>
    </div>
    <el-dialog :modal-append-to-body='false'
    title="随附单据-上传"
    :visible.sync="exportVisible"
    width="40%" :modal="false"
    class="decDialog"
    style="margin-top: 8vh;"
    :close-on-click-modal="false">
      <div class="order-query-main" style="width:100%">
        <div class="query-condition" style="padding: 0;">
          <el-form label-width="107px" :model="exportForm" ref="exportForm" :rules="exportRules" size="mini">
            <el-row>
              <el-col :span="20" :offset="2">
                <el-row>
                  <el-col :span="24" v-if="orderType === 'invt'">
                    <el-form-item label="随附单据格式">
                      <el-select size="mini" filterable v-model="exportForm.acmpFormFmt" class="select-Color" @change="fmtChange" clearable>
                        <el-option label="1-结构化" value="1"></el-option>
                        <el-option label="2-非结构化" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="随附单据类型">
                      <el-select size="mini" filterable v-model="exportForm.docType" @focus="tipsFillMessage('docLists','SAAS_EDOC_CODE')" class="select-Color" @change="uploadChange" clearable remote :remote-method="checkParamsList">
                        <el-option v-for="(item,index) in docLists" :key="item.codeField+index" :value="item.codeField" :label="item.codeField+'-'+item.nameField"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="随附单据编号" prop="remarks" :required="orderType=='invt'&&exportForm.acmpFormFmt=='1'">
                      <el-input v-model="exportForm.remarks" :disabled="isEdit"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="选择文件" class="form-item-mg">
                      <el-upload
                        class="upload-demo"
                        action="http://127.0.0.1"
                        :before-upload="logoUrlUpload"
                        :file-list="fileList"
                        :disabled="fileDis()"
                        :on-remove="removeFile">
                        <el-button size="small" type="primary" style="margin-right: 156px;" :disabled="fileDis()">点击上传</el-button>
                      </el-upload>
                      <p class="upload-tips" style="margin-top: 5px;">请选择文件进行上传，文件大小不超过4M</p>
                      <p class="upload-tips" style="color: #ff4c4c;font-weight: bold;">可上传其他格式文件，自动转换成pdf格式</p>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="">
                      <el-checkbox v-model="exportForm.isUpload" :disabled="isLoad || isUpSingle" class="order-checkbox"></el-checkbox><span class="padL">上传单一窗口</span>
                    </el-form-item>
                  </el-col>
                  </el-row>
              </el-col>
            </el-row>
            <!-- 查询条件 end-->
          </el-form>
        </div>
      </div>
      <div slot="footer"  class="sys-dialog-footer" style="text-align:center;margin-top:-20px" >
        <el-button type="primary" size="mini" @click="uploadFun">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :modal-append-to-body='false'
    title="编辑其他包装信息"
    :visible.sync="wrapVisible"
    width="35%" :modal="false"
    class="order-dialog"
    :close-on-click-modal="false">
     <div class='dec-query-table'>
          <!-- 列表table开始 -->
          <el-table class='sys-table-table dec-table' ref="otherWrapList" border highlight-current-row size="mini" height="300px" :data="wrapList['Wraps']" @selection-change="selectVal">
            <el-table-column  type="selection" min-width="50" align="center"></el-table-column>
            <el-table-column  type="index" label="序号" min-width="60" align="left"></el-table-column>
            <el-table-column label="包装材料种类代码" min-width="80">
              <template slot-scope="scope">
                {{scope.row.wrapType || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="包装材料种类，名称" min-width="100">
              <template slot-scope="scope">
                {{scope.row.wrapName || '-'}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      <div slot="footer"  class="sys-dialog-footer" style="text-align:center;margin:0;" v-if="!isView">
        <el-button type="primary" class='dec-h-30' size="mini" @click="wrapSave">确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
import storageHandle from '@/common/storageHandle'
export default {
  name: 'return-receipt',
  props: {
    typeValue: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    iEFlag: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    decStatus: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseRule: {
        'packNo': [{validator: this.num, message: '请输入数字', trigger: 'blur'}],
        'grossWt': [{validator: this.num1F2, message: '', trigger: 'blur'}],
        'netWt': [{validator: this.num1F3, message: '', trigger: 'blur'}],
        'billingCycle': [{validator: this.num, message: '请输入数字', trigger: 'blur'}],
        'manualNo': [{required: true, validator: this.enNum, message: '', trigger: 'blur'}],
        'ref7': [{required: true, validator: this.requireVal, message: '请选择所属模块', trigger: 'change'}],
        'mtpckEndprdTypecd': [{required: true, validator: this.requireVal, message: '请选择料件/成品标志', trigger: 'change'}],
        'billtype': [{required: true, validator: this.requireVal, message: '请选择清单类型', trigger: 'change'}],
        'ediId': [{required: true, validator: this.requireVal, message: '请选择报关标志', trigger: 'change'}],
        'tradeMode': [{validator: this.checkTrade, message: '', trigger: 'change'}]
      },
      isView: false,
      isLicense: false, // 控制随附单据编辑
      isUpSingle: false, // 控制上传单一窗口按钮
      isStatus: false,
      innerNo: '', // 接单编号
      labelPosition: 'right',
      controller: {
        requiredColor: true
      },
      twocontrNo: [], // 两步申报模式
      dataForm: {}, // 图片信息
      carVisible: false,
      wrapVisible: false,
      activeNameHead: 'baseInfo',
      total: '', // 数据总条数
      receiptList: [], // 回执信息
      checkedReceiptList: [], // 被选中的回执信息
      baseInfo: {
        innerNo: '',
        ref1: '',
        rcvDate: util.dateFormat(new Date(), 'yyyy-MM-dd'),
        demandDate: util.dateFormat(new Date(), 'yyyy-MM-dd'),
        company: '',
        companyId: '',
        contrNo: '',
        tradeCoScc: '',
        tradeCode: '',
        tradeName: '',
        overseasConsignorCode: '',
        overseasConsignorCname: '',
        ownerCodeScc: '',
        ownerCode: '',
        ownerName: '',
        trafMode: '',
        billNo: '',
        packNo: '',
        wrapType: '',
        grossWt: '',
        netWt: '',
        ref0: '',
        type: 'dec',
        splitFlag: '',
        billingCycle: '',
        declTrnrel: '0',
        consigneeCode: '',
        ownerCiqCode: '',
        manualNo: '',
        corpInterNo: '',
        mtpckEndprdTypecd: '',
        tradeMode: '',
        billtype: '',
        ediId: '',
        dclcusTypecd: '',
        decType: '',
        tradeTerms: '',
        goodsOutline: '',
        note: '',
        sysDocVOs: [],
        ref7: ''
      },
      isEdit: true,
      fileList: [],
      carFileList: [],
      companyListOptions: [],
      fileorderList: [],
      carList: [],
      carForm: {}, // 派车信息
      sendInfo: {
        pickUpGCountry: '',
        pickUpGProvince: '',
        pickUpGCity: '',
        deliveryAddrS: '',
        ref1: '',
        ref2: '',
        deliverGCountry: '',
        deliverGProvince: '',
        deliverGCity: '',
        deliveryAddrR: '',
        ref3: '',
        ref4: ''
      }, // 提送货信息
      wrapList: {}, // 其他包装
      exportForm: {
        acmpFormFmt: '',
        remarks: '',
        docType: '',
        isUpload: '',
        fileName: '',
        fileSize: '',
        fullName: '',
        billNo: '',
        seqNo: '',
        fileType: ''
      }, // 上传信息
      exportRules: {
        remarks: [{validator: this.remarkVal, message: '请输入随附单据编号', trigger: 'blur'}]
      },
      exportVisible: false, // 上传信息
      paramsOptions: {}, // 字典表
      selectList: [], // 包装种类勾选数据
      docList: [],
      idList: [],
      carSelectList: [],
      idSelectList: [],
      carFlag: false, // 派车新增中字段置灰标志
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
      typeList: [{
        value: 'dec',
        label: '报关单'
      }, {
        value: 'invt',
        label: '核注清单'
      }, {
        value: 'log',
        label: '物流作业'
      }], // 接单类型
      orderType: 'dec',
      docLists: [],
      decDocList: [],
      invtDocList: [{
        codeField: 'FILE',
        nameField: '文件'
      }, {
        codeField: 'R',
        nameField: '减免税证明'
      }],
      selectObj: {
        obj: '',
        parmas: ''
      },
      tableNameList: {
        tableNames: [
          'SAAS_TRANSPORT_TYPE', // 运输方式
          'SAAS_TWO_TRANSF', // 运输方式（核注清单）
          'SAAS_WRAP', // 包装种类
          'SAAS_EMS_DEC_TYPE', // 报关单类型
          'SAAS_TRADE', // 监管方式
          'SAAS_TRADE_MODEL', // 贸易条款
          'SAAS_EDOC_CODE' // 随附单据
        ]
      }, // 字典标明
      selectDicList: {
        'trafMode': {obj: 'transportList', params: this.orderType === 'invt' ? 'SAAS_TWO_TRANSF' : 'SAAS_TRANSPORT_TYPE'},
        'wrapType': {obj: 'saasWrapList', params: 'SAAS_WRAP'},
        'decType': {obj: 'emsDecTypeList', params: 'SAAS_EMS_DEC_TYPE'},
        'tradeMode': {obj: 'saasTradeList', params: 'SAAS_TRADE'},
        'tradeTerms': {obj: 'tradeList', params: 'SAAS_TRADE_MODEL'},
        'ref0': {obj: 'statusList', params: 'IS_SATATUS'},
        'splitFlag': {obj: 'statusListA', params: 'IS_SATATUS'},
        'declTrnrel': {obj: 'decTrnrelList', params: 'DEC_TRNREL'},
        'mtpckEndprdTypecd': {obj: 'mtpckEndprdList', params: 'EMS_MTPCKEND'},
        'billtype': {obj: 'billList', params: 'BILL_TYPE_TAX'},
        'ediId': {obj: 'ediIdList', params: 'DEC_EDID'},
        'dclcusTypecd': {obj: 'cusTypeList', params: 'DEC_CUSTYPE'},
        'ref7': {obj: 'emsTypeFlagList', params: 'DEC_EMSTYPEFLAG'}
      },
      transportList: [], // 运输方式
      saasWrapList: [], // 包装种类
      emsDecTypeList: [], // 报关单类型
      tradeList: [], // 贸易条款
      statusList: [], // 是否
      statusListA: [], // 是否
      decTrnrelList: [], // 报关单类型
      mtpckEndprdList: [], // 料件/成品
      saasTradeList: [], // 监管方式
      billList: [], // 清单类型
      ediIdList: [], // 报关标志
      cusTypeList: [], // 报关类型
      emsTypeFlagList: [], // 所属模块
      isSave: false, // 是否已暂存
      isLoad: true, // 是否上传
      countryList: [], // 国家
      provinceList: [], // 省
      cityList: [], // 市
      countryListA: [], // 国家
      provinceListA: [], // 省
      cityListA: [], // 市
      saveOrderType: '', // 存放接单类型
      changeExportReceiptView: false, // 是否显示转为出口接单
      ocrNoDis: false // 是否有流水号
    }
  },
  created () {
    localStorage.setItem('IS_SATATUS', JSON.stringify([{codeField: 'N', nameField: '否'}, {codeField: 'Y', nameField: '是'}]))
    localStorage.setItem('EMS_MTPCKEND', JSON.stringify([{codeField: 'E', nameField: '成品'}, {codeField: 'I', nameField: '料件'}]))
    let billTypeList = []
    let decTrnList = []
    let towdecTrnList = []
    if (this.iEFlag === 'import') {
      billTypeList = [{nameField: '普通清单', codeField: '0'}, {nameField: '先入区后报关', codeField: '3'}, {nameField: '简单加工', codeField: '4'}, {nameField: '保税展示交易', codeField: '5'}, {nameField: '区内流转', codeField: '6'}, {nameField: '区港联动', codeField: '7'}, {nameField: '保税电商', codeField: '8'}, {nameField: '一纳成品内销', codeField: '9'}]
      decTrnList = [{codeField: '0', nameField: '报关单'}, {codeField: '1', nameField: '转关提前报关单'}, {codeField: '2', nameField: '备案清单'}, {codeField: '3', nameField: '转关提前备案清单'}]
      towdecTrnList = [{codeField: '0', nameField: '报关单'}, {codeField: '2', nameField: '备案清单'}]
    } else {
      billTypeList = [{nameField: '普通清单', codeField: '0'}, {nameField: '先入区后报关', codeField: '3'}, {nameField: '简单加工', codeField: '4'}, {nameField: '保税展示交易', codeField: '5'}, {nameField: '区内流转', codeField: '6'}, {nameField: '区港联动', codeField: '7'}, {nameField: '保税电商', codeField: '8'}]
      decTrnList = [{codeField: '0', nameField: '报关单'}, {codeField: '1', nameField: '转关提前报关单'}, {codeField: '2', nameField: '备案清单'}, {codeField: '3', nameField: '转关提前备案清单'}, {codeField: '4', nameField: '出口二次转关'}]
    }
    localStorage.setItem('BILL_TYPE_TAX', JSON.stringify(billTypeList))
    localStorage.setItem('DEC_TRNREL', JSON.stringify(decTrnList))
    localStorage.setItem('TOW_DEC_TRNREL', JSON.stringify(towdecTrnList))
    localStorage.setItem('DEC_EDID', JSON.stringify([{codeField: '1', nameField: '报关'}, {codeField: '2', nameField: '非报关'}]))
    localStorage.setItem('DEC_CUSTYPE', JSON.stringify([{codeField: '1', nameField: '关联报关'}, {codeField: '2', nameField: '对应报关'}]))
    localStorage.setItem('DEC_EMSTYPEFLAG', JSON.stringify([{codeField: 'nems', nameField: '加工贸易账册'}, {codeField: 'npts', nameField: '加工贸易手册'}, {codeField: 'sas', nameField: '海关特殊监管区域'}, {codeField: 'bws', nameField: '保税物流管理'}]))
    this.getCountry('', '0', 'thd')
    this.getCountry('', '0', 'shd')
    this.getCommonParam()
    if (!util.isEmpty(localStorage.getItem('orderType' + this.userId))) {
      this.orderType = localStorage.getItem('orderType' + this.userId)
    }
    if (this.orderType === 'invt') {
      this.mtpckEndprdList = [{codeField: 'E', nameField: '成品'}, {codeField: 'I', nameField: '料件'}]
      this.baseInfo.mtpckEndprdTypecd = this.iEFlag === 'import' ? 'I' : 'E'
    }
    if (this.typeValue === 'add') {
      this.isView = false
      this.isLicense = false
      this.isStatus = false
      // 聚焦第一个输入框
      this.$nextTick(_ => {
        this.$refs['ref1'].focus()
      })
    } else if (this.typeValue === 'view') { // 查看
      this.isView = true
      this.isStatus = true
      this.isSave = true
      this.isLicense = true
      this.innerNo = this.id
    } else { // 编辑
      if (this.status === '0') {
        this.isStatus = false
        this.isUpSingle = true
        this.isView = false
      } else {
        this.isStatus = false
        this.isUpSingle = false
        this.isView = true
      }
      this.isLicense = false
      this.isSave = true
      this.innerNo = this.id
    }
  },
  mounted () {
    this.getCerts()
    this.baseInfo.ref0 = 'N'
    this.selectObj = {
      obj: 'statusList',
      params: 'IS_SATATUS'
    }
    this.checkParamsList('N', 'init')
    this.baseInfo.splitFlag = 'N'
    this.selectObj = {
      obj: 'statusListA',
      params: 'IS_SATATUS'
    }
    this.checkParamsList('N', 'init')
    this.baseInfo.declTrnrel = '0'
    this.selectObj = {
      obj: 'decTrnrelList',
      params: 'DEC_TRNREL'
    }
    this.checkParamsList('0', 'init')
    this.saveInfo = util.simpleClone(this.baseInfo)
  },
  watch: {
    'orderType' (newVal, oldVal) {
      this.saveOrderType = util.simpleClone(oldVal)
    }
  },
  methods: {
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      e.srcElement.blur()
      // 获取当前焦点所在的 form表单
      let form = e.srcElement.form
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
      // 下下一个元素
      let secondNext = newFocusable[parseInt(index) + 2]
      // 上一个元素
      let prev = newFocusable[parseInt(index) - 1]
      if (e.shiftKey) { // shift+enter 光标向上个元素移动
        if (prev) {
          if (e.srcElement.attributes.shiftEnter && e.srcElement.attributes.shiftEnter.nodeValue === 'no') {
            return false
          } else {
            if (e.srcElement.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.srcElement.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            }
            prev.focus()
          }
        }
      } else if (e.ctrlKey && this.localName === 'textarea') { // Ctrl+enter 在textaera中换行
        let myValue = '\n'
        let t = e.srcElement
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
        if (e.srcElement.localName === 'textarea') { // enter 光标向下个元素移动
          e.preventDefault()
          e.stopPropagation()
        }
        // 下个元素存在
        if (next) {
          if (e.srcElement.attributes.enter && e.srcElement.attributes.enter.nodeValue === 'no') {
            return false
          } else {
            let ref
            if (e.srcElement.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              ref = e.srcElement.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            } else {
              if (!util.isEmpty(e.srcElement.attributes.dataRef)) {
                ref = e.srcElement.attributes.dataRef.nodeValue
              }
            }
            if (ref === 'tradeCoScc' || ref === 'ownerCodeScc') {
              // 如果是十八位信用代码
              secondNext.focus()
              secondNext.select()
            } else if (ref === 'gName') {
              this.$refs['codeTs'].$children[0].focus()
              this.$refs['codeTs'].$children[0].select()
            } else if (ref === 'despPortCode' && this.controller.iEFlag === 'I') { // 进口启运港
              this.openOtherPriceFactor()
            } else if (ref === 'entyPortCode' && this.controller.iEFlag === 'E') {
              this.openOtherPriceFactor()
            } else {
              next.focus()
              next.select()
            }
          }
        }
      }
    },
    // 切换接单类型
    orderChange () {
      if (JSON.stringify(this.saveInfo) !== JSON.stringify(this.baseInfo)) {
        this.$confirm('更改接单类型将清空已填写的基本信息，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          this.baseInfo = {
            innerNo: '',
            ref1: '',
            rcvDate: util.dateFormat(new Date(), 'yyyy-MM-dd'),
            demandDate: util.dateFormat(new Date(), 'yyyy-MM-dd'),
            company: '',
            companyId: '',
            contrNo: this.orderType === 'decTs' ? '000' : '',
            tradeCoScc: '',
            tradeCode: '',
            tradeName: '',
            overseasConsignorCode: '',
            overseasConsignorCname: '',
            ownerCodeScc: '',
            ownerCode: '',
            ownerName: '',
            trafMode: '',
            billNo: '',
            packNo: '',
            wrapType: '',
            grossWt: '',
            netWt: '',
            ref0: '',
            splitFlag: '',
            billingCycle: '',
            declTrnrel: '0',
            consigneeCode: '',
            ownerCiqCode: '',
            manualNo: '',
            corpInterNo: '',
            mtpckEndprdTypecd: '',
            tradeMode: '',
            billtype: '',
            ediId: '',
            dclcusTypecd: '',
            decType: '',
            tradeTerms: '',
            goodsOutline: '',
            note: '',
            sysDocVOs: [],
            ref7: ''
          }
          this.baseInfo.ref0 = 'N'
          this.selectObj = {
            obj: 'statusList',
            params: 'IS_SATATUS'
          }
          this.checkParamsList('N', 'init')
          this.baseInfo.splitFlag = 'N'
          this.selectObj = {
            obj: 'statusListA',
            params: 'IS_SATATUS'
          }
          this.checkParamsList('N', 'init')
          this.baseInfo.declTrnrel = '0'
          this.selectObj = {
            obj: 'decTrnrelList',
            params: 'DEC_TRNREL'
          }
          this.checkParamsList('0', 'init')
          this.innerNo = ''
          this.fileorderList = []
          this.carList = []
          this.docLists = this.decDocList
          this.sendInfo = {
            pickUpGCountry: '',
            pickUpGProvince: '',
            pickUpGCity: '',
            deliveryAddrS: '',
            ref1: '',
            ref2: '',
            deliverGCountry: '',
            deliverGProvince: '',
            deliverGCity: '',
            deliveryAddrR: '',
            ref3: '',
            ref4: ''
          }
          if (this.orderType === 'invt') {
            this.mtpckEndprdList = [{codeField: 'E', nameField: '成品'}, {codeField: 'I', nameField: '料件'}]
            this.baseInfo.mtpckEndprdTypecd = this.iEFlag === 'import' ? 'I' : 'E'
          }
        }).catch(() => {
          this.orderType = this.saveOrderType
        })
      }
      if (this.orderType === 'invt') {
        this.mtpckEndprdList = [{codeField: 'E', nameField: '成品'}, {codeField: 'I', nameField: '料件'}]
        this.baseInfo.mtpckEndprdTypecd = this.iEFlag === 'import' ? 'I' : 'E'
      }
      this.transportList = []
    },
    // 查询企业信息
    queryCropInfo (value) {
      if (this.isView) return
      let param = {
        cusCorpName: '',
        sccCode: '',
        tradeCode: ''
      }
      if (value === 'tradeCoScc') {
        if (!util.isEmpty(this.baseInfo.tradeCoScc) && this.baseInfo.tradeCoScc.length === 18) {
          param.sccCode = this.baseInfo.tradeCoScc
        } else {
          return false
        }
      } else if (value === 'tradeCode') {
        if (!util.isEmpty(this.baseInfo.tradeCode) && this.baseInfo.tradeCode.length === 10) {
          param.tradeCode = this.baseInfo.tradeCode
        } else {
          return false
        }
      } else if (value === 'ownerCodeScc') {
        if (!util.isEmpty(this.baseInfo.ownerCodeScc) && this.baseInfo.ownerCodeScc.length === 18) {
          param.sccCode = this.baseInfo.ownerCodeScc
        } else {
          return false
        }
      } else if (value === 'ownerCode') {
        if (!util.isEmpty(this.baseInfo.ownerCode) && this.baseInfo.ownerCode.length === 10) {
          param.tradeCode = this.baseInfo.ownerCode
        } else {
          return false
        }
      } else if (value === 'tradeName') {
        if (!util.isEmpty(this.baseInfo.tradeName)) {
          param.cusCorpName = this.baseInfo.tradeName
        } else {
          return false
        }
      } else if (value === 'ownerName') {
        if (!util.isEmpty(this.baseInfo.ownerName)) {
          param.cusCorpName = this.baseInfo.ownerName
        } else {
          return false
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getCorpInf',
        data: param,
        success: (res) => {
          if (res.code === '0000' && !util.isEmpty(res.result.sccCode)) {
            if (value === 'tradeCoScc' || value === 'tradeCode' || value === 'tradeName') {
              this.baseInfo.tradeCoScc = res.result.sccCode
              this.baseInfo.tradeCode = res.result.regCusCode
              this.baseInfo.tradeName = res.result.cusNameSaic
              this.baseInfo.consigneeCode = res.result.regCiqCode
            } else {
              this.baseInfo.ownerCodeScc = res.result.sccCode
              this.baseInfo.ownerCode = res.result.regCusCode
              this.baseInfo.ownerName = res.result.cusNameSaic
              this.baseInfo.ownerCiqCode = res.result.regCiqCode
            }
          }
        }
      })
    },
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
          if (res.success) {
            let json = JSON.stringify(res.result)
            json = json.replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          }
        }
      })
    },
    // 回车注册企业
    getCorp (type, value, flag) {
      this.baseInfo.companyId = ''
      if (!util.isEmpty(this.baseInfo.company) && util.isEmpty(this.baseInfo.companyId) && !this.isStatus) {
        this.$post({
          url: 'API@/dec-common/ccba/common/getCorpDetail',
          data: this.baseInfo.company,
          success: (res) => {
            if (!util.isEmpty(res.result)) {
              this.baseInfo.companyId = res.result
              if (!util.isEmpty(flag)) {
                if (this.orderType === 'invt') {
                  this.handleSelectManual(this.baseInfo.manualNo, type, value, 'check')
                } else {
                  this.orderReq(type, value)
                }
              }
            } else {
              this.baseInfo.companyId = ''
              this.baseInfo.company = ''
              this.$refs.company.focus()
            }
          },
          other: (res) => {
            this.messageTips(res.result, 'error')
            this.baseInfo.companyId = ''
            this.baseInfo.company = ''
            this.$refs.company.focus()
          }
        })
      }
    },
    // 手账册编号返填
    queryManualSearch (queryString, cb) {
      this.$post({
        url: 'API@/saas-ems/emsCommon/getNos',
        data: queryString,
        success: (res) => {
          let json = util.isEmpty(res.result) ? [] : res.result
          let result = []
          if (json.length !== 0) {
            for (let i in json) {
              result.push({value: json[i]})
            }
          }
          cb(result)
        }
      })
    },
    handleSelectManual (item, type, value, flag) {
      this.$nextTick(() => {
        this.$refs['baseInfo'].clearValidate(['manualNo'])
      })
      let data = {
        emsNo: util.isEmpty(flag) ? item.value : item,
        emsTypeFlag: ' '
      }
      this.$post({
        url: 'API@/saas-ems/nemsinvt/getEtpsInfo',
        data: data,
        success: (res) => {
          if (!util.isEmpty(res.result)) {
            if (flag === 'check') {
              this.orderReq(type, value)
            } else {
              this.baseInfo.tradeCoScc = res.result.bizopEtpsSccd
              this.baseInfo.tradeCode = res.result.bizopEtpsno
              this.baseInfo.tradeName = res.result.bizopEtpsNm
              this.baseInfo.ownerCodeScc = res.result.rvsngdEtpsSccd
              this.baseInfo.ownerCode = res.result.rcvgdEtpsno
              this.baseInfo.ownerName = res.result.rcvgdEtpsNm
            }
          } else {
            this.messageTips('您输入的手(账)册编号不存在，请输入正确的手(账)册编号。', 'error')
          }
        },
        other: res => {
          if (res.code === '0001') {
            this.baseInfo.tradeCoScc = ''
            this.baseInfo.tradeCode = ''
            this.baseInfo.tradeName = ''
            this.baseInfo.ownerCodeScc = ''
            this.baseInfo.ownerCode = ''
            this.baseInfo.ownerName = ''
            this.messageTips(res.message, 'error')
          }
        }
      })
    },
    // 接单详情
    orderDetail () {
      let url = ''
      if (this.iEFlag === 'import') {
        url = 'API@/dec-common/ccba/iOrderTake/iOrderDetail'
      } else {
        url = 'API@/dec-common/ccba/eOrderTake/eOrderDetail'
      }
      this.$post({
        url: url,
        data: this.innerNo,
        success: (res) => {
          let sendData = {
            pickUpGCountry: '',
            pickUpGProvince: '',
            pickUpGCity: '',
            deliveryAddrS: '',
            ref1: '',
            ref2: '',
            deliverGCountry: '',
            deliverGProvince: '',
            deliverGCity: '',
            deliveryAddrR: '',
            ref3: '',
            ref4: ''
          }
          let data = util.isEmpty(res.result.agentSendCarWithBLOBsVO) ? {} : res.result.agentSendCarWithBLOBsVO
          this.getCountry(data.pickUpGCountry, '1', 'thd')
          this.getCountry(data.deliverGCountry, '1', 'shd')
          this.getCountry(data.pickUpGProvince, '2', 'thd')
          this.getCountry(data.deliverGProvince, '2', 'shd')
          if (res.result.type === 'decTs') {
            let x = []
            if (res.result.contrNo.split('')[0] === '1') {
              x.push('1')
            }
            if (res.result.contrNo.split('')[1] === '1') {
              x.push('2')
            }
            if (res.result.contrNo.split('')[2] === '1') {
              x.push('3')
            }
            this.twocontrNo = x
          }

          this.baseInfo = res.result
          this.sendInfo = util.isEmpty(this.baseInfo.agentSendCarWithBLOBsVO) ? sendData : this.baseInfo.agentSendCarWithBLOBsVO
          this.initSelect(this.selectDicList, this.baseInfo)
          if (!util.isEmpty(this.$route.query.innerNo)) {
            this.baseInfo.type = 'dec'
          }
          this.orderType = this.baseInfo.type
          this.changeExportReceiptShow(this.orderType) // 是否显示转为出口接单按钮
          this.docLists = this.decDocList
          if (this.orderType === 'invt') {
            this.isEdit = false
          }
          this.fileorderList = []
          this.fileorderList = util.isEmpty(this.baseInfo.sysDocVOs) ? [] : this.baseInfo.sysDocVOs
          this.fileorderList.forEach((e, i) => {
            e['gNo'] = i + 1
          })
          this.ocrNoDis = !util.isEmpty(this.baseInfo.ocrNo)
        }
      })
    },
    changeCon () {
      let x = []
      x.push(this.twocontrNo.indexOf('1') >= 0 ? '1' : '0')
      x.push(this.twocontrNo.indexOf('2') >= 0 ? '1' : '0')
      x.push(this.twocontrNo.indexOf('3') >= 0 ? '1' : '0')
      this.baseInfo.contrNo = x.join('')
    },
    handleSelect (item, para, iEFlag) {
      if (item.corpId === undefined) {
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
            if (res.code === '0000' && !util.isEmpty(res.result.sccCode)) {
              if (para === '1') { // 境内收发货人
                this.baseInfo.tradeCoScc = res.result.sccCode
                this.baseInfo.tradeCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.baseInfo.consigneeCode = res.result.regCiqCode
              } else if (para === '2') { // 生产销售单位
                this.baseInfo.ownerCodeScc = res.result.sccCode
                this.baseInfo.ownerCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.baseInfo.ownerCiqCode = res.result.regCiqCode
              } else if (para === '3') {
                this.baseInfo.overseasConsignorCode = res.result.sccCode
              } else {
                this.baseInfo.companyId = res.result.corpId
              }
            } else {
              if (para === '4') {
                this.messageTips(res.message, 'error')
                this.baseInfo.companyId = ''
                this.baseInfo.company = ''
                this.$refs.company.focus()
              }
            }
          },
          other: (res) => {
            if (para === '4') {
              this.messageTips(res.message, 'error')
              this.baseInfo.companyId = ''
              this.baseInfo.company = ''
              this.$refs.company.focus()
            }
          }
        })
      } else {
        if (para === '1') { // 境内收发货人
          this.baseInfo.tradeCoScc = item.sccCode
          this.baseInfo.tradeCode = item.tradeCode
          this.baseInfo.consigneeCode = item.ciqCode
        } else if (para === '2') { // 生产销售单位
          this.baseInfo.ownerCodeScc = item.sccCode
          this.baseInfo.ownerCode = item.tradeCode
          this.baseInfo.ownerCiqCode = item.ciqCode
        } else if (para === '3') {
          this.baseInfo.overseasConsignorCode = item.sccCode
        } else {
          this.baseInfo.companyId = item.corpId
        }
      }
    },
    handleSelectCorp (item, para) {
      if (item.corpId === undefined) {
        if (util.isEmpty(item.value)) {
          return
        }
        this.getCorp('', item.value, '')
      } else {
        this.baseInfo.companyId = item.corpId
      }
    },
    companyChange (val) {
      if (util.isEmpty(val)) {
        this.baseInfo.companyId = ''
      }
    },
    gotoOrderDetail () {
      if (this.typeValue !== 'add') {
        this.innerNo = this.id
        this.$nextTick(() => {
          this.orderDetail()
        })
      }
    },
    // 获取公共字典list
    getCommonParam () {
      let par = this.tableNameList.tableNames
      this.$post({
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          this.gotoOrderDetail()
        },
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {
          this.gotoOrderDetail()
        }
      })
    },
    // 获取公共字典list
    getCerts () {
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getCerts',
        data: {},
        success: (res) => {
          this.wrapList = res.result
        }
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      // 如果是下拉框 则设置当前下拉框的默认参数
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = JSON.parse(localStorage.getItem(this.selectObj.params))
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          if (this.selectObj.params === 'SAAS_EDOC_CODE') {
            this[this.selectObj.obj] = storageHandle.getEdocCodesByRelatedBusiness(list, 'order').slice(0, 10)
          } else {
            this[this.selectObj.obj] = list
          }
        })
      } else {
        let filterList = []
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        if (type === 'init') {
          if (this.selectObj.params === 'SAAS_EDOC_CODE') {
            this[this.selectObj.obj] = storageHandle.getEdocCodesByRelatedBusiness(filterList, 'order').slice(0, 10)
          } else {
            this[this.selectObj.obj] = filterList
          }
        } else if (type === 'select') {
          this.$nextTick(() => {
            if (this.selectObj.params === 'SAAS_EDOC_CODE') {
              this[this.selectObj.obj] = storageHandle.getEdocCodesByRelatedBusiness(filterList, 'order').slice(0, 10)
            } else {
              this[this.selectObj.obj] = filterList
            }
          })
        }
      }
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      this[selecType] = []
    },
    initSelect (arr, form) {
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
    // 文件类别
    uploadChange (row) {
      if (util.isEmpty(row)) {
        this.exportForm.isUpload = false
        this.isLoad = true
      } else {
        this.isLoad = false
      }
      if (this.orderType === 'dec' || this.orderType === 'log') {
        if (row === '10000001' || row === '10000002' || row === '10000003') {
          this.isEdit = false
        } else {
          this.exportForm.remarks = ''
          this.isEdit = true
        }
      } else {
        this.isEdit = false
      }
    },
    // 格式变化
    fmtChange (val) {
      this.exportForm.docType = ''
      this.$refs['exportForm'].clearValidate()
      if (util.isEmpty(val)) {
        this.docLists = this.decDocList
      } else {
        this.docLists = this.invtDocList
      }
      if (this.orderType === 'invt') {
        if (!util.isEmpty(val)) {
          this.exportForm.isUpload = true
          this.isLoad = false
        } else {
          this.exportForm.isUpload = false
          this.isLoad = true
        }
      }
    },
    // 上传
    logoUrlUpload (file) {
      let fileType = ''
      fileType = util.getFileTypeByName(file.name)
      if (!(Math.ceil(file.size / 1024) <= 4096)) {
        this.messageTips('上传文件大小不能超过4MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        if (util.isEmpty(fileType)) {
          this.messageTips('该类型文件不允许转换')
          this.$emit('closeEditUpload')
          return false
        }
        if (fileType === 'application/pdf') {
          let param = new FormData()
          param.append('multiFile', file, file.name)
          param.append('filePath', '/longshine/dec/' + this.$store.state.userLoginInfo.sccCode + '/doc/' + (util.dateFormat(new Date(), 'yyyyMMdd')))
          this.$upload({
            url: 'FILE@/saas-upload/upload/uploadFile',
            data: param,
            success: (res) => {
              this.fileList = []
              this.fileList.push(res.result)
            }
          })
        } else {
          let param = new FormData()
          param.append('file', file, file.name)
          this.$upload({
            url: 'API@saas-upload/upload/pdfConverter',
            data: param,
            success: (res) => {
              this.fileList = []
              if (res.result && res.result.length === 1) {
                let arr = file.name.split('.')
                res.result[0].name = arr[0] + '.pdf'
                this.fileList = res.result
              } else {
                this.messageTips(res.message, 'error')
              }
            }
          })
        }
      }
      return false
    },
    removeFile (file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.name === this.fileList[i].name) {
          this.fileList.splice(i, 1)
          this.exportForm.fileType = ''
          this.exportForm.fileName = ''
          this.exportForm.fileSize = ''
          this.exportForm.fullName = ''
        }
      }
    },
    // 格式化随附单据格式
    formatMed (val) {
      let value = ''
      if (val === '1') {
        value = '结构化'
      } else if (val === '2') {
        value = '非结构化'
      } else {
        value = ''
      }
      return value
    },
    // 选择包装种类下拉参数
    openWrap () {
      this.wrapVisible = true
      if (this.typeValue !== 'add') {
        let lists = util.isEmpty(this.baseInfo.ref2) ? [] : JSON.parse(this.baseInfo.ref2)
        this.$nextTick(() => {
          lists.forEach(row => {
            this.$refs.otherWrapList.toggleRowSelection(this.wrapList['Wraps'].find(d => d.packType === row.packType), true)
          })
        })
      }
    },
    // 包装种类勾选数据
    selectVal (row) {
      this.selectList = row
    },
    // 包装种类确认
    wrapSave () {
      this.baseInfo.ref2 = JSON.stringify(this.selectList)
      this.wrapVisible = false
    },
    // 数组去重
    unique1 (arr) {
      let hash = []
      for (let i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) === -1) {
          hash.push(arr[i])
        }
      }
      return hash
    },
    // 打开上传弹窗
    openExport () {
      this.exportForm = {
        acmpFormFmt: '',
        remarks: '',
        docType: '',
        isUpload: '',
        fileName: '',
        fileSize: '',
        fullName: '',
        billNo: '',
        seqNo: ''
      }
      this.fileList = []
      this.exportVisible = true
      this.isLoad = true
      if (this.orderType === 'invt') {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
      this.$nextTick(() => {
        this.$refs['exportForm'].clearValidate()
      })
    },
    // 关闭
    closedecele () {
      this.$emit('closedecele')
    },
    // 接单暂存
    addFun (type) {
      this.$refs['baseInfo'].validate((valId) => {
        if (!valId) {
          return false
        }
        if ((this.orderType === 'invt' && this.baseInfo.billtype === '4') || (this.orderType === 'invt' && this.baseInfo.billtype === '9')) {
          this.messageTips('暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单', 'error')
          return false
        }
        if (type === 'submit') {
          if (this.baseInfo.splitFlag === 'Y') {
            this.$prompt('请输入生成报关单数量', '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^[1-9]\d*$/,
              inputErrorMessage: '请输入正整数'
            }).then(({ value }) => {
              this.addOrderFun(type, value)
            }).catch(() => {
            })
          } else {
            let message = ''
            if (this.orderType === 'dec') {
              message = '您确认要生成报关单吗？'
            } else if (this.orderType === 'invt') {
              message = '您确认要生成核注清单吗？'
            } else if (this.orderType === 'decTs') {
              message = '您确认要生成两步申报吗？'
            } else {
              message = '您确认要生成物流作业吗？'
            }
            this.$confirm(message, '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.addOrderFun(type)
            }).catch(() => {
            })
          }
        } else {
          this.addOrderFun(type)
        }
      })
    },
    // 接单暂存
    addOrderFun (type, value) {
      this.baseInfo.rcvDate = util.dateFormat(this.baseInfo.rcvDate, 'yyyy-MM-dd')
      this.baseInfo.demandDate = util.dateFormat(this.baseInfo.demandDate, 'yyyy-MM-dd')
      this.baseInfo.type = this.orderType
      if (util.isEmpty(this.baseInfo.companyId) && !util.isEmpty(this.baseInfo.company)) {
        this.getCorp(type, value, 'check')
      } else {
        if (this.orderType === 'invt') {
          this.handleSelectManual(this.baseInfo.manualNo, type, value, 'check')
        } else {
          this.orderReq(type, value)
        }
      }
    },
    orderReq (type, value) {
      let url = ''
      if (this.iEFlag === 'import') {
        url = 'API@/dec-common/ccba/iOrderTake/addIOrder'
      } else {
        url = 'API@/dec-common/ccba/eOrderTake/addEOrder'
      }
      if (type !== 'tabadd') {
        this.baseInfo.agentSendCarWithBLOBsVO = util.simpleClone(this.sendInfo)
      } else {
        this.baseInfo.agentSendCarWithBLOBsVO = null
      }
      let arr = this.fileorderList.filter(e => {
        return delete e.gNo
      })
      this.baseInfo.sysDocVOs = util.simpleClone(arr)
      this.$post({
        url: url,
        data: [this.baseInfo],
        success: (res) => {
          this.baseInfo.innerNo = res.result
          this.innerNo = res.result
          if (type === 'submit') {
            this.orderTakenToDec(res.result, value)
          } else {
            this.messageTips('暂存成功', 'success')
            this.isSave = true
            if (type !== 'tabadd') {
              this.$emit('closedecele')
            }
            this.docLists = this.decDocList
            if (this.orderType === 'invt') {
              this.isEdit = false
            }
          }
          localStorage.setItem('orderType' + this.userId, this.baseInfo.type)
        }
      })
    },
    // 生成报关单
    orderTakenToDec (innerNo, splitDecNo) {
      let url = ''
      if (this.orderType === 'dec') {
        if (this.iEFlag === 'import') {
          url = 'API@/dec-common/ccba/iOrderTake/orderTakenToDec'
        } else {
          url = 'API@/dec-common/ccba/eOrderTake/orderTakenToDec'
        }
      } else if (this.orderType === 'invt') {
        url = 'API@/dec-common/ccba/common/orderTakenToInvt'
      } else if (this.orderType === 'decTs') {
        url = 'API@/dec-common/ccba/common/orderTakenToDecTs'
      } else {
        url = 'API@/dec-common/ccba/common/orderTakenToLog'
      }
      let row = {}
      if (this.orderType !== 'dec') {
        row = {
          innerNo: innerNo,
          iEFlag: this.iEFlag === 'import' ? 'I' : 'E'
        }
        if (this.orderType === 'decTs') {
          if (!util.isEmpty(splitDecNo)) {
            row['splitDecNo'] = splitDecNo
          }
        }
      } else {
        row.innerNo = innerNo
        if (!util.isEmpty(splitDecNo)) {
          row.splitDecNo = splitDecNo
        }
      }
      this.$post({
        url: url,
        data: row,
        success: (res) => {
          this.messageTips('生成成功', 'success')
          this.$emit('closedecele')
        }
      })
    },
    // 关闭接单弹窗
    closeOrder () {
      this.$emit('closedecele')
    },
    // 随附单据确认上传
    uploadFun () {
      // let url = 'API@/dec-common/ccba/common/addDoc'
      this.exportForm.billNo = this.innerNo
      if (this.orderType === 'invt' && this.exportForm.acmpFormFmt === '1') {
      } else if (this.exportForm.docType === '10000001' || this.exportForm.docType === '10000002' || this.exportForm.docType === '10000003') {
      } else {
        if (this.fileList.length === 0) {
          this.messageTips('请选择文件上传', 'error')
          return false
        }
        let uploadData = this.fileList[0]
        let splitName = uploadData.name.split('.')
        this.exportForm.fileType = splitName[1].toLowerCase()
        this.exportForm.fileName = uploadData.name
        // 如果文件有重名 则 在后传入的文件名上拼接文件类型
        let index = this.fileorderList.findIndex((v, i) => {
          if (v.fileName === uploadData.name) {
            return true
          }
        })
        if (index > -1) {
          this.exportForm.fileName = splitName[0] + '-' + this.formatType(this.exportForm.docType) + '.' + splitName[1]
        } else {
          this.exportForm.fileName = uploadData.name
        }
        this.exportForm.fileSize = uploadData.size
        this.exportForm.fullName = uploadData.url
      }
      let data = util.simpleClone(this.exportForm)
      if (util.isEmpty(data.isUpload) || !data.isUpload) {
        data.isUpload = '否'
      } else {
        data.isUpload = '是'
      }
      data.gNo = this.fileorderList.length + 1
      this.$refs['exportForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        // this.exportForm.gNo = this.fileorderList.length + 1
        this.fileorderList.push(data)
        this.exportVisible = false
      })
    },
    // 随附单据列表勾选
    docSelect (row) {
      this.docList = []
      this.idList = []
      this.docList = row
      for (let i in row) {
        this.idList.push(row[i].gNo)
      }
    },
    // 随附单据删除
    deleteDocFun () {
      if (this.idList.length === 0) {
        this.messageTips('请选择需要删除的数据', 'error')
      } else {
        this.$confirm('确认删除吗？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.idList.forEach(e => {
            this.fileorderList.forEach((item, i) => {
              if (e === item.gNo) {
                this.fileorderList.splice(i, 1)
              }
            })
          })
          this.idList = []
          for (let i in this.fileorderList) {
            this.fileorderList[i].gNo = parseInt(i) + 1
          }
        }).catch(() => {
        })
      }
    },
    // 上传单一窗口
    loadWindow () {
      if (this.docList.length === 0) {
        this.messageTips('请选择需要上传单一窗口的数据', 'error')
      } else {
        for (let i of this.docList) {
          if (i.isUpload === '是') {
            this.messageTips('请选择未上传至单一窗口的数据')
            return false
          } else if (util.isEmpty(i.docType)) {
            this.messageTips('类型为空的随附单据不可点击上传单一窗口')
            return false
          } else {
            this.fileorderList.forEach(e => {
              this.docList.forEach(v => {
                if (e.gNo === v.gNo) {
                  e.isUpload = '是'
                }
              })
            })
          }
        }
      }
    },
    // 判断显示是否禁用上传文件
    fileDis () {
      let flag = false
      if (this.orderType === 'invt' && this.exportForm.acmpFormFmt === '1') {
        flag = true
      } else if (this.exportForm.docType === '10000001' || this.exportForm.docType === '10000002' || this.exportForm.docType === '10000003') {
        flag = true
      } else {
        flag = false
      }
      return flag
    },
    // 下载
    downloadFun () {
      if (this.docList.length !== 1) {
        this.messageTips('请选择1条需要下载的数据', 'error')
      } else {
        for (let i in this.docList) {
          window.open(this.docList[i].fullName, '_blank')
        }
      }
    },
    // 文件类别转换
    formatType (val) {
      let label = ''
      if (val === '00000001') {
        label = '发票'
      } else if (val === '00000002') {
        label = '装箱单'
      } else if (val === '00000003') {
        label = '提运单'
      } else if (val === '00000004') {
        label = '合同'
      } else if (val === '00000008') {
        label = '代理报关委托协议（纸质）'
      } else if (val === '00000009') {
        label = '原产地证据文件'
      } else if (val === '00000010') {
        label = '载货清单（舱单）'
      } else if (val === '10000001') {
        label = '代理委托协议（电子）'
      } else if (val === '10000002') {
        label = '减免税货物税款担保证明'
      } else if (val === '10000003') {
        label = '减免税货物税款担保延期证明'
      } else if (val === 'FILE') {
        label = '文件'
      } else if (val === 'R') {
        label = '减免税证明'
      } else {
        label = val
      }
      return label
    },
    // 校验核注清单-监管方式
    checkTrade (rule, value, callback) {
      let isTax = ['0110', '0130', '0513', '1300', '1500', '1523', '1616', '1741', '1831', '2025', '2210', '2225', '2439', '2600', '2700', '2939', '3010', '3100', '3339', '3410', '3422', '3511', '3611', '3612', '3910', '4019', '4039', '4139', '4200', '4239', '4500', '4539', '4561', '9600', '9639', '9739', '9800', '9839', '9900']
      if (this.orderType === 'invt') {
        if (!util.isEmpty(this.baseInfo.tradeMode)) {
          if (isTax.indexOf(this.baseInfo.tradeMode) !== -1) {
            callback(new Error('当前监管方式并不属于加工贸易业务，请重新选择'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 数字校验
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
    // 毛重校验
    num1F2 (rule, value, callback) {
      const num1F2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,5})?$/
      if (util.isEmpty(value)) {
        callback()
      } else {
        if (parseFloat(value) < 1) {
          callback(new Error('毛重不足1，按1填报'))
        } else if (!num1F2.test(value)) {
          callback(new Error('小数点后最多支持录入5位'))
        } else {
          callback()
        }
      }
    },
    // 净重校验
    num1F3 (rule, value, callback) {
      const num1F3 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,5})?$/
      if (util.isEmpty(value)) {
        callback()
      } else {
        if (parseFloat(value) <= parseFloat(this.baseInfo.grossWt)) {
          if (parseFloat(value) < 1) {
            callback(new Error('净重不足1，按1填报'))
          } else if (!num1F3.test(value)) {
            callback(new Error('小数点后最多支持录入5位'))
          } else {
            callback()
          }
        } else {
          callback(new Error('净重不能大于毛重'))
        }
      }
    },
    enNum (rule, value, callback) {
      const enNum = /^[A-Za-z0-9]{12}$/
      if (util.isEmpty(value)) {
        callback(new Error('请输入手(账)册编号'))
      } else {
        if (!enNum.test(value)) {
          callback(new Error('请输入正确的手(账)册编号'))
        } else {
          callback()
        }
      }
    },
    // 核注清单必填校验
    requireVal (rule, value, callback) {
      if (util.isEmpty(value)) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 核注清单-随附单据格式为结构化时 必填
    remarkVal (rule, value, callback) {
      if (this.orderType === 'invt' && this.exportForm.acmpFormFmt === '1') {
        if (util.isEmpty(value)) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 获取全球所有国家
    getCountry (code, type, lx) {
      if (type === '1') {
        if (lx === 'thd') {
          this.sendInfo.pickUpGProvince = ''
          this.provinceList = []
          this.sendInfo.pickUpGCity = ''
          this.cityList = []
        } else {
          this.sendInfo.deliverGProvince = ''
          this.provinceListA = []
          this.sendInfo.deliverGCity = ''
          this.cityListA = []
        }
        if (util.isEmpty(code)) {
          return
        }
      }
      if (type === '2') {
        if (lx === 'thd') {
          this.sendInfo.pickUpGCity = ''
          this.cityList = []
        } else {
          this.sendInfo.deliverGCity = ''
          this.cityListA = []
        }
        if (util.isEmpty(code)) {
          return
        }
      }
      this.$post({
        url: 'API@/saas-dictionary/dictionary/cascadeGetArea',
        data: {code: code, type: type},
        isLoad: false,
        success: (res) => {
          if (type === '0') {
            if (lx === 'thd') {
              this.countryList = util.isEmpty(res.result) ? [] : res.result
            } else {
              this.countryListA = util.isEmpty(res.result) ? [] : res.result
            }
          } else if (type === '1') {
            if (lx === 'thd') {
              this.provinceList = util.isEmpty(res.result) ? [] : res.result
            } else {
              this.provinceListA = util.isEmpty(res.result) ? [] : res.result
            }
          } else {
            if (lx === 'thd') {
              this.cityList = util.isEmpty(res.result) ? [] : res.result
            } else {
              this.cityListA = util.isEmpty(res.result) ? [] : res.result
            }
          }
        }
      })
    },
    // 转为出口接单
    changeExportReceipt () {
      let arr = this.fileorderList.filter(e => {
        return delete e.gNo
      })
      this.baseInfo.sysDocVOs = util.simpleClone(arr)
      this.$post({
        url: 'API@/dec-common/ccba/common/changeOrderIE',
        data: [this.baseInfo],
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.closeOrder()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    changeExportReceiptShow (type) {
      if (!this.isView && this.iEFlag === 'import' && type === 'dec' && this.status === '0') {
        this.$post({
          url: 'API@/dec-common/ccba/review/isReview',
          data: ['import_export_transform'],
          success: ({result}) => {
            if (result['import_export_transform']) {
              this.changeExportReceiptView = result['import_export_transform'].value === 'Y'
            }
          }
        })
      }
    },
    // 生成AI
    submitAi () {
      this.baseInfo.rcvDate = util.dateFormat(this.baseInfo.rcvDate, 'yyyy-MM-dd')
      this.baseInfo.demandDate = util.dateFormat(this.baseInfo.demandDate, 'yyyy-MM-dd')
      this.baseInfo.type = this.orderType
      this.baseInfo.agentSendCarWithBLOBsVO = util.simpleClone(this.sendInfo)
      let arr = this.fileorderList.filter(e => {
        return delete e.gNo
      })
      this.baseInfo.sysDocVOs = util.simpleClone(arr)
      this.baseInfo.iEFlag = this.iEFlag === 'import' ? 'I' : 'E'
      if (this.baseInfo.splitFlag === 'Y') {
        this.messageTips('AI制单不支持拼票', 'error')
        return false
      }
      this.$confirm('您确认要生成AI制单吗？', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: 'API@/dec-common/ccba/common/addOcr',
          data: this.baseInfo,
          success: (res) => {
            this.messageTips('生成成功', 'success')
            this.$emit('closedecele')
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="less">
  .query-condition {
    background-color: #fff;
    padding: 20px;
  }
  .dec-div{
    margin-top:5px;
    border: 1px solid @line-color-input;
    border-bottom: 0;
    background-color: #fff;
    line-height: 22px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .op-btn {
    margin-bottom: 4px;
  }
  .query-main {
    background-color: #e5f2ff;
    padding: 20px;
    font-size:12px;
    font-family: Arial,Microsoft YaHei,SimSun;
    height: 100%;
    overflow: auto;
    min-width: 1040px;
  }
  .border-0 {
    border: 0 !important;
    margin-right: 5px;
  }
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  .icon-btn {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: sub;
    margin-right: 5px;
  }
  .sys-dialog-footer{
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: right;
    // position:absolute;
    .el-button {
      height: 30px;
      padding: 7px 20px;
      font-size: 14px;
      border-radius: 4px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }
  }
.dec-h-30{
  height: 30px !important;
}
.padL{
  padding-left: 8px;
}
.padR{
  padding-right: 10px;
}
.padB{
  padding-bottom: 8px;
}
.mg-b-15{
  margin-bottom: 10px;
}
.upload-tips{
  font-size: 12px;
  color: @font-color-main;
  line-height: 20px;
}
.border-0{
  border: none;
}
</style>
