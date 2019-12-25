
<template>
<!-- 报关单表头主键 -->
  <section>
    <div class='dec-div'>
      <el-form ref="headRuleForm" :model="decHead"  :rules="headRuleForm" label-width="112px" size="mini" @keydown.enter.native="switchFoucsByEnter">
          <el-row>
            <el-col :span="12">
              <el-form-item label="申报地海关" prop="customMaster"
                :class='[aiColors[headAiColor.customMaster], controller.requireColor ? "require-color" : "" ]'
               >
                <el-select v-inputMax v-model="decHead.customMaster"
                  style="width:100%"
                  ref="customMaster" dataRef ='customMaster'
                  :disabled="controller.isDisabled || controller.isWholeDec"
                  placeholder=" "
                  filterable remote clearable default-first-option
                  @focus="tipsFillMessage('customMaster', 'saasCustomsRel1','SAAS_CUSTOMS_REL')"
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCustomsRel1')">
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
            <el-col :span="12">
              <el-form-item label="申报状态">
                <el-input v-inputMax v-model="decHead.statusValue" readonly  @focus="tipsFillMessage('statusValue')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="12" v-if="headController.isSeqNo">
              <el-form-item label="统一编号">
                <el-input v-inputMax v-model="decHead.seqNo" readonly @focus="tipsFillMessage('seqNo')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-else>
              <el-form-item label="统一编号">
                <el-input v-inputMax v-model="decHead.cusCiqNo" readonly @focus="tipsFillMessage('cusCiqNo')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预录入编号">
                <el-input v-inputMax v-model="decHead.preEntryId" readonly @focus="tipsFillMessage('preEntryId')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="12">
              <el-form-item label="海关编号">
                <el-input v-inputMax v-model="decHead.entryId" readonly @focus="tipsFillMessage('entryId')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="controller.iEFlag == 'I' ? '进境关别':'出境关别'" prop="iEPort"
                :class='[aiColors[headAiColor.customMaster], controller.requireColor ? "require-color" : "", errorColor.iEPort ? "error-color" : "" ]'>
                <el-select v-inputMax v-model="decHead.iEPort"
                  ref="iEPort" dataRef ='iEPort'
                  default-first-option remote clearable filterable
                  :disabled="controller.isDisabled || controller.isWholeDec"
                  style="width:100%"
                  placeholder=" "
                  @change="iEPortChange"
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasCustomsRel2')"
                  @blur="watchValueChange('iEPort')"
                  @focus="tipsFillMessage('iEPort', 'saasCustomsRel2','SAAS_CUSTOMS_REL')" >
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
            <el-col :span="12">
              <el-form-item label="备案号" prop="manualNo">
                <el-input v-inputMax v-model="decHead.manualNo" :maxlength="12"
                  dataRef = 'manualNo' ref="manualNo"
                  :class='[aiColors[headAiColor.manualNo], errorColor.manualNo ? "error-color" : "" ]'
                  :readonly="controller.isDisabled || controller.cDisabled"
                  clearable
                  @blur='queryBookHead'
                  @input='manualNoChange'
                  @focus="tipsFillMessage('manualNo')" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同协议号" prop="contrNo">
                <el-input v-inputMax clearable v-model="decHead.contrNo" :maxlength="32"
                    ref="contrNo" dataRef = 'contrNo'
                    :class='[aiColors[headAiColor.contrNo], errorColor.contrNo ? "error-color" : "" ]'
                    :readonly="controller.isDisabled"
                     @focus="tipsFillMessage('contrNo')" >
                  </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="12">
              <el-form-item :label="controller.iEFlag == 'I' ? '进口日期':'出口日期'"  prop="iEDate">
                <el-input v-inputMax v-model="decHead.iEDate"  :maxlength="8"
                  ref="iEDate" dataRef = 'iEDate'
                  :class='[aiColors[headAiColor.iEDate], errorColor.iEDate ? "error-color" : "", controller.requireColor ? "require-color" : "" ]'
                  :readonly="controller.isDisabled || controller.iEFlagDisabled"
                  @focus="tipsFillMessage('iEDate')">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申报日期" >
                <el-input v-inputMax v-model="decHead.dDate"  :maxlength="8"
                  ref="dDate" dataRef = 'dDate'
                  :class='[aiColors[headAiColor.dDate]]'
                  readonly
                  @focus="tipsFillMessage('dDate')">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="24">
              <el-form-item label="境内收发货人" v-labelColor>
                <el-col :span="6">
                  <el-form-item prop="tradeCoScc">
                    <el-input v-inputMax v-model="decHead.tradeCoScc" :maxlength="18"
                      dataRef = 'tradeCoScc' ref="tradeCoScc"
                      :class='[aiColors[headAiColor.tradeCoScc], errorColor.tradeCoScc ? "error-color" : "", controller.requireColor ? "require-color" : "" ]'
                      :readonly="controller.isDisabled || controller.isWholeDec"
                      placeholder="18位社会信用代码"
                      @focus="tipsFillMessage('tradeCoScc')"
                      @blur="queryCropInfo('tradeCoScc', $event)">
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item prop="tradeCode">
                      <el-input v-inputMax v-model="decHead.tradeCode" :maxlength="10"
                        ref="tradeCode" dataRef = 'tradeCode'
                        :class='[aiColors[headAiColor.tradeCode], controller.requireColor ? "require-color" : "" ]'
                        :readonly="controller.isDisabled || controller.isWholeDec"
                        placeholder="10位海关编码"
                        @focus="tipsFillMessage('tradeCode')"
                        @blur="queryCropInfo('tradeCode', $event)">
                      </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="consigneeCode">
                    <el-input v-inputMax v-model="decHead.consigneeCode" :maxlength="10"
                      ref="consigneeCode" dataRef = 'consigneeCode'
                      :readonly="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)"
                      placeholder="10位检验检疫编码"
                      @focus="tipsFillMessage('consigneeCode')">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="tradeName">
                    <el-autocomplete v-inputMax v-model="decHead.tradeName" :maxlength="70" size='mini'
                      ref='tradeName' dataRef = 'tradeName'
                      :class='[aiColors[headAiColor.tradeName], controller.requireColor ? "require-color" : "" ]'
                      :readonly="controller.isDisabled || controller.isWholeDec"
                      :popper-append-to-body='false'
                      placeholder="企业名称(中文),输入两位字符开始匹配"
                      @input='checklen("decHead", "tradeName", 70)'
                      @focus="tipsFillMessage('tradeName')"
                      :fetch-suggestions="querySearch"
                      :trigger-on-focus="false"
                      :select-when-unmatched='true'
                      :highlight-first-item='true'
                      @select="handleSelect($event, '1')">
                      <i class="el-icon-refresh i-class"
                        v-show='!controller.isWholeDec'
                        slot="suffix" title = '同步海关数据'
                        @click="refrshQueryInfo('1')">
                      </i>
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="controller.iEFlag == 'I'">
            <el-col :span="24">
              <el-form-item label="境外收发货人"  v-labelColor>
                <el-col :span="14">
                  <el-form-item>
                    <el-input v-inputMax v-model="decHead.overseasConsignorCode" :maxlength="50"
                      ref="overseasConsignorCode" dataRef = 'overseasConsignorCode'
                      placeholder="境外收货人代码"
                      :class='[aiColors[headAiColor.overseasConsignorCode], errorColor.overseasConsignorCode ? "error-color" : "" ]'
                      :readonly="controller.isDisabled"
                      @focus="tipsFillMessage('overseasConsignorCode')" >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="overseasConsignorEname" ref="overseasConsignorEname" >
                    <el-autocomplete v-inputMax v-model="decHead.overseasConsignorEname" :maxlength="100" size='mini'
                      dataRef = 'overseasConsignorEname'
                      :class='[aiColors[headAiColor.overseasConsignorEname], controller.requireColor ? "require-color" : "" ]'
                      :readonly="controller.isDisabled"
                      placeholder="企业名称(外文),输入两位字符开始匹配"
                      @input='checklen("decHead", "overseasConsignorEname", 100)'
                      @focus="tipsFillMessage('overseasConsignorEname')"
                      :fetch-suggestions="queryOverseas"
                      :trigger-on-focus="false"
                      :select-when-unmatched='true'
                      :highlight-first-item='true' >
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  v-else>
            <el-col :span="24">
              <el-form-item label="境外收发货人"  v-labelColor>
                <el-col :span="14">
                  <el-form-item>
                    <el-input v-inputMax v-model="decHead.overseasConsigneeCode" :maxlength="50"
                      ref="overseasConsigneeCode" dataRef = 'overseasConsigneeCode'
                      :class='[aiColors[headAiColor.overseasConsigneeCode], errorColor.overseasConsigneeCode ? "error-color" : "" ]'
                      :readonly="controller.isDisabled"
                      placeholder="境外收货人代码"
                      @focus="tipsFillMessage('overseasConsigneeCode')" >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item  prop="overseasConsigneeEname" ref="overseasConsigneeEname" >
                    <el-autocomplete v-inputMax v-model="decHead.overseasConsigneeEname" :maxlength="100" size='mini'
                      dataRef = 'overseasConsigneeEname'
                      :class='[aiColors[headAiColor.overseasConsigneeEname], controller.requireColor ? "require-color" : "" ]'
                      :readonly="controller.isDisabled"
                      placeholder="企业名称(外文),输入两位字符开始匹配"
                      @input='checklen("decHead", "overseasConsigneeEname", 100)'
                      @focus="tipsFillMessage('overseasConsigneeEname')"
                      :fetch-suggestions="queryOverseas"
                      :trigger-on-focus="false"
                      :select-when-unmatched='true'
                      :highlight-first-item='true'>
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="24" >
              <el-form-item :label="controller.iEFlag == 'I' ? '消费使用单位':'生产销售单位'"  v-labelColor>
                <el-col :span="6">
                  <el-form-item prop="ownerCodeScc">
                    <el-input v-inputMax v-model="decHead.ownerCodeScc"  :maxlength="18"
                      ref="ownerCodeScc" dataRef = 'ownerCodeScc'
                      :class='[aiColors[headAiColor.ownerCodeScc], controller.requireColor ? "require-color" : "", errorColor.ownerCodeScc ? "error-color" : "" ]'
                      :readonly="controller.isDisabled || (controller.isWholeDec && controller.isDocument)"
                      placeholder="18位社会信用代码"
                      @focus="tipsFillMessage('ownerCodeScc')"
                      @blur="queryCropInfo('ownerCodeScc', $event)">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="ownerCode" ref="ownerCode" >
                    <el-input  v-inputMax v-model="decHead.ownerCode" :maxlength="10"
                      dataRef = 'ownerCode'
                      :class='[aiColors[headAiColor.ownerCode], controller.requireColor ? "require-color" : ""]'
                      :readonly="controller.isDisabled || (controller.isWholeDec && controller.isDocument)"
                      placeholder="10位海关编码"
                      @focus="tipsFillMessage('ownerCode')"
                      @blur="queryCropInfo('ownerCode', $event)">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="ownerCiqCode">
                    <el-input  v-inputMax v-model="decHead.ownerCiqCode" :maxlength="10"
                      dataRef = 'ownerCiqCode'
                      :readonly="controller.isDisabled || (controller.isWholeDec && controller.isCIQ && controller.isDocument)"
                      placeholder="10位检验检疫编码"
                      @focus="tipsFillMessage('ownerCiqCode')" >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="ownerName" ref="ownerName" >
                      <el-autocomplete v-inputMax v-model="decHead.ownerName" :maxlength="70" size='mini'
                        dataRef = 'ownerName'
                        :class='[aiColors[headAiColor.ownerName], controller.requireColor ? "require-color" : ""]'
                        :readonly="controller.isDisabled || (controller.isWholeDec && controller.isDocument)"
                        placeholder="企业名称,输入两位字符开始匹配"
                        @input='checklen("decHead", "ownerName", 100)'
                        @focus="tipsFillMessage('ownerName')"
                        @select="handleSelect($event, '3')"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :select-when-unmatched='true'
                        :highlight-first-item='true'
                        :popper-append-to-body='false' >
                        <i class="el-icon-refresh i-class"
                          slot="suffix" title = '同步海关数据'
                          v-show='!controller.isWholeDec'
                          @click="refrshQueryInfo('3')">
                        </i>
                      </el-autocomplete>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="24">
              <el-form-item label="申报单位" v-labelColor>
                <el-col :span="6">
                  <el-form-item prop="agentCodeScc" ref="agentCodeScc">
                    <el-input  v-inputMax v-model="decHead.agentCodeScc" :maxlength="18"
                      dataRef = 'agentCodeScc'
                      :class='[aiColors[headAiColor.agentCodeScc], controller.requireColor ? "require-color" : ""]'
                      :readonly="controller.isDisabled || controller.isWholeDec"
                      placeholder="18位社会信用代码"
                      @focus="tipsFillMessage('agentCodeScc')"
                      @blur="queryCropInfo('agentCodeScc', $event)" >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="agentCode" ref="agentCode" >
                    <el-input  v-inputMax v-model="decHead.agentCode" :maxlength="10"
                    dataRef = 'agentCode'
                    :class='[aiColors[headAiColor.agentCode], controller.requireColor ? "require-color" : ""]'
                    :readonly="controller.isDisabled || controller.isWholeDec"
                    placeholder="10位海关编码"
                    @focus="tipsFillMessage('agentCode')"
                    @blur="queryCropInfo('agentCode', $event)" >
                  </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="declRegNo" ref="declRegNo" >
                    <el-input  v-inputMax v-model="decHead.declRegNo" :maxlength="10"
                      dataRef = 'agentCode'
                      :readonly="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)"
                      placeholder="10位检验检疫编码"
                      @focus="tipsFillMessage('declRegNo')" >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="agentName" ref="agentName" >
                    <el-autocomplete v-inputMax  v-model="decHead.agentName" :maxlength="70" size='mini'
                      dataRef = 'agentName'
                      :class='[aiColors[headAiColor.agentName], controller.requireColor ? "require-color" : ""]'
                      :readonly="controller.isDisabled || controller.isWholeDec"
                      placeholder="企业名称,输入两位字符开始匹配"
                      :popper-append-to-body='false'
                      :trigger-on-focus="false"
                      :select-when-unmatched='true'
                      :highlight-first-item='true'
                      :fetch-suggestions="querySearch"
                      @focus="tipsFillMessage('agentName')"
                      @select="handleSelect($event, '4')">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="运输方式"
                :class='[aiColors[headAiColor.trafMode], controller.requireColor ? "require-color" : "", errorColor.trafMode ? "error-color" : ""]'
                prop="trafMode">
                <el-select v-inputMax  v-model="decHead.trafMode"
                    ref="trafMode" dataRef ='trafMode'
                    style="width:100%"
                    :disabled="controller.isDisabled || controller.isWholeDec"
                    placeholder=" "
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('trafMode', 'saasTransportType','SAAS_TRANSPORT_TYPE')"
                    @clear="clearSelct('saasTransportType')">
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
              <el-form-item label="运输工具名称"  :class='aiColors[headAiColor.trafName]'>
              <el-input v-inputMax v-model="decHead.trafName" :maxlength="50"
                  ref="trafName" dataRef ='trafName'
                  :class='{"error-color" : errorColor.trafName}'
                  :readonly="controller.isDisabled || controller.isWholeDec"
                  @focus="tipsFillMessage('trafName')" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="航次号" :class='aiColors[headAiColor.voyageNo]'>
                <el-input v-inputMax v-model="decHead.voyageNo" :maxlength="32"
                  ref="voyageNo" dataRef ='voyageNo'
                  :readonly="controller.isDisabled || controller.isWholeDec"
                  @focus="tipsFillMessage('voyageNo')" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="12">
              <el-form-item label="提运单号" prop="billNo" :class='aiColors[headAiColor.billNo]'>
                <el-col :span="23">
                  <el-input v-inputMax v-model="decHead.billNo" :maxlength="32"
                      ref="billNo" dataRef ='billNo'
                      :class='{"error-color": errorColor.billNo}'
                      :readonly="controller.isDisabled || controller.isWholeDec"
                      @focus="tipsFillMessage('billNo')" >
                  </el-input>
                </el-col>
                <el-col :span="1">
                  <el-tooltip  effect="dark" content="调用舱单数据" >
                    <el-button type="primary" icon="fa fa-file" :disabled="controller.isWholeDec" @click="queryMftData"></el-button>
                  </el-tooltip>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="监管方式"
                :class='[aiColors[headAiColor.tradeMode], errorColor.tradeMode ? "error-color" : "",  controller.requireColor ? "require-color" : ""]'
                prop="tradeMode">
                <el-select v-inputMax placeholder=" " v-model="decHead.tradeMode"
                      ref="tradeMode" dataRef ='tradeMode'
                      :disabled="controller.isDisabled || controller.cDisabled || controller.isWholeDec"
                      style="width:100%"
                      remote default-first-option clearable filterable
                      :remote-method="checkParamsList"
                      @clear="clearSelct('saasTrade')"
                      @change = 'tradeModeChange'
                      @focus="tipsFillMessage('tradeMode', 'saasTrade','SAAS_TRADE')" >
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
              <el-form-item label="征免性质"
                :class='[aiColors[headAiColor.cutMode], errorColor.cutMode ? "error-color" : ""]'>
                <el-select v-inputMax  v-model="decHead.cutMode"
                    ref="cutMode" dataRef ='cutMode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('cutMode', 'saasLevytype','SAAS_LEVYTYPE')"
                    @clear="clearSelct('saasLevytype')"
                    @change='cutModeChange' >
                    <el-option
                      v-for="item in saasLevytype"
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
            <el-col :span="6">
              <el-form-item label="许可证号" prop="licenseNo" :class='aiColors[headAiColor.licenseNo]'>
                <el-input v-inputMax v-model="decHead.licenseNo"  :maxlength="20"
                    ref="licenseNo" dataRef ='licenseNo'
                    :class='{"error-color": errorColor.licenseNo}'
                    :readonly="controller.isDisabled || (controller.isWholeDec && controller.isDocument)"
                    @focus="tipsFillMessage('licenseNo')"
                    @keyup.native = "changeLicenseNo">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="controller.iEFlag == 'I' ? '启运国(地区)':'运抵国(地区)'"
                :class='[aiColors[headAiColor.tradeCountry], errorColor.tradeCountry ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
                 prop="tradeCountry">
                <el-select v-inputMax placeholder=" " v-model="decHead.tradeCountry"
                    ref="tradeCountry" dataRef ='tradeCountry'
                    :disabled="controller.isDisabled" style="width:100%"
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('tradeCountry', 'saasCountry1','SAAS_COUNTRY')"
                    @clear="clearSelct('saasCountry1')"
                    @change = 'tradeCountryChange' >
                    <el-option
                      v-for="item in saasCountry1"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="controller.iEFlag == 'I' ? '经停港':'指运港'"
                :class='[aiColors[headAiColor.distinatePort], errorColor.distinatePort ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
                prop="distinatePort">
                <el-select v-inputMax placeholder=" " v-model="decHead.distinatePort"
                    ref="distinatePort" dataRef ='distinatePort'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('distinatePort', 'saasPortLin1','SAAS_PORT_LIN')"
                    @clear="clearSelct('saasPortLin1')">
                    <el-option
                      v-for="item in saasPortLin1"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="成交方式"
              :class='[aiColors[headAiColor.transMode], errorColor.transMode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
              prop="transMode">
                <el-select v-inputMax v-model="decHead.transMode"
                    ref="transMode" dataRef ='transMode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @change="transModeChange"
                    @focus="tipsFillMessage('transMode', 'saasTransac','SAAS_TRANSAC')"
                    @clear="clearSelct('saasTransac')">
                    <el-option
                      v-for="item in saasTransac"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="6">
              <el-form-item label="运费" label-width="50px"  v-labelColor>
                <el-col :span="8">
                  <el-form-item prop="feeMark">
                    <el-select v-inputMax v-model="decHead.feeMark"
                     ref="feeMark" dataRef ='feeMark'
                    :class='[aiColors[headAiColor.feeMark], controller.requireColor ? "require-color" : ""]'
                    :disabled="controller.isDisabled  || headController.feeMarkDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote clearable filterable  default-first-option
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('feeMark', 'feeRate1' ,'FEE_RATE')"
                    @clear="clearSelct('feeRate1')"
                    @change="feeChange(decHead.feeMark, 'fee')" >
                      <el-option
                        v-for="item in feeRate1"
                        :key="item.codeField"
                        :showLabel="showCustomsCode? '' : item.nameField"
                        :label="item.codeField + '-' + item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="feeRate">
                    <el-input v-inputMax v-model="decHead.feeRate"
                        ref="feeRate" dataRef ='feeRate'
                        :class='[aiColors[headAiColor.feeRate], errorColor.feeRate ? "error-color" : ""]'
                        :readonly="controller.isDisabled || headController.feeRateDisabled"
                        @focus="tipsFillMessage('feeRate')" >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item >
                    <el-select v-inputMax v-model="decHead.feeCurr"
                    ref="feeCurr" dataRef ='feeCurr'
                    :class='aiColors[headAiColor.feeCurr]'
                    :disabled="controller.isDisabled || headController.feeCurrDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote clearable filterable  default-first-option
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('feeCurr', 'saasCurr1','SAAS_CURR')"
                    @clear="clearSelct('saasCurr1')">
                      <el-option
                        v-for="item in saasCurr1"
                        :key="item.codeField"
                        :showLabel="showCustomsCode? '' : item.nameField"
                        :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="保险费"  label-width="50px"  v-labelColor>
                <el-col :span="8">
                  <el-form-item >
                    <el-select v-inputMax v-model="decHead.insurMark"
                      ref="insurMark" dataRef ='insurMark'
                      :class='aiColors[headAiColor.insurMark]'
                      :disabled="controller.isDisabled || headController.insurMarkDisabled"
                      style="width:100%"
                      placeholder=" "
                      remote clearable filterable  default-first-option
                      :remote-method="checkParamsList"
                      @focus="tipsFillMessage('insurMark', 'feeRate2' ,'FEE_RATE_OHTER')"
                      @change="feeChange(decHead.insurMark, 'insur')"
                      @clear="clearSelct('feeRate2')" >
                      <el-option
                        v-for="item in feeRate2"
                        :key="item.codeField"
                        :showLabel="showCustomsCode? '' : item.nameField"
                        :label="item.codeField + '-' + item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="insurRate" ref="insurRate" >
                    <el-input v-inputMax v-model="decHead.insurRate"
                        dataRef ='insurRate'
                        :class='[aiColors[headAiColor.insurRate], errorColor.insurRate ? "error-color" : ""]'
                        :readonly="controller.isDisabled || headController.insurRateDisabled"
                        @focus="tipsFillMessage('insurRate')">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item >
                    <el-select v-inputMax  v-model="decHead.insurCurr"
                      ref="insurCurr" dataRef ='insurCurr'
                      :class='aiColors[headAiColor.insurCurr]'
                      :disabled="controller.isDisabled || headController.insurCurrDisabled"
                      style="width:100%"
                      placeholder=" "
                      remote clearable filterable  default-first-option
                      :remote-method="checkParamsList"
                      @focus="tipsFillMessage('insurCurr', 'saasCurr2','SAAS_CURR')"
                      @clear="clearSelct('saasCurr2')">
                      <el-option
                        v-for="item in saasCurr2"
                        :key="item.codeField"
                        :showLabel="showCustomsCode? '' : item.nameField"
                        :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="杂费"  label-width="50px"  v-labelColor>
                <el-col :span="8">
                  <el-form-item>
                    <el-select v-inputMax  v-model="decHead.otherMark"
                      ref="otherMark" dataRef ='otherMark'
                      :class='aiColors[headAiColor.otherMark]'
                      :disabled="controller.isDisabled"
                      style="width:100%"
                      placeholder=" "
                      remote clearable filterable  default-first-option
                      :remote-method="checkParamsList"
                      @focus="tipsFillMessage('otherMark', 'feeRate3' ,'FEE_RATE_OHTER')"
                      @clear="clearSelct('feeRate3')"
                      @change="feeChange(decHead.otherMark, 'other')">
                      <el-option
                        v-for="item in feeRate3"
                        :key="item.codeField"
                        :showLabel="showCustomsCode? '' : item.nameField"
                        :label="item.codeField + '-' + item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="otherRate">
                    <el-input v-inputMax v-model="decHead.otherRate"
                        ref="otherRate"  dataRef ='otherRate'
                        :class='[aiColors[headAiColor.otherRate], errorColor.otherRate ? "error-color" : ""]'
                        :readonly="controller.isDisabled"
                        @focus="tipsFillMessage('otherRate')">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                      <el-select v-inputMax  v-model="decHead.otherCurr"
                        ref="otherCurr" dataRef ='otherCurr'
                        :class='aiColors[headAiColor.otherCurr]'
                        :disabled="controller.isDisabled  || headController.otherCurrDisabled"
                        style="width:100%"
                        placeholder=" "
                        remote clearable filterable  default-first-option
                        :remote-method="checkParamsList"
                        @focus="tipsFillMessage('otherCurr', 'saasCurr3','SAAS_CURR')"
                        @clear="clearSelct('saasCurr3')" >
                        <el-option
                          v-for="item in saasCurr3"
                          :key="item.codeField"
                          :showLabel="showCustomsCode? '' : item.nameField"
                          :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="件数" prop="packNo" :class='aiColors[headAiColor.packNo]'>
                <el-input v-inputMax v-model="decHead.packNo" :maxlength="9"
                    ref="packNo" dataRef ='packNo'
                    :class='{"error-color" :  errorColor.packNo,  "require-color" : controller.requireColor}'
                    :readonly="controller.isDisabled"
                    @focus="tipsFillMessage('packNo')" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="包装种类"
              :class='[aiColors[headAiColor.wrapType], errorColor.wrapType ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
              prop="wrapType">
                <el-select  v-inputMax placeholder=" " v-model="decHead.wrapType"
                    ref="wrapType" dataRef ='wrapType'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('wrapType', 'saasWrap','SAAS_WRAP')"
                    @clear="clearSelct('saasWrap')"
                    @change = 'wrapTypeChange' >
                    <el-option
                      v-for="item in saasWrap"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item >
                <el-button type="primary" @click="otherPacksDiv()" class="w-100">其他包装</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毛重(KG)" prop="grossWt" :class='aiColors[headAiColor.grossWt]'>
                <el-input v-inputMax v-model="decHead.grossWt" :maxlength="20"
                    ref="grossWt" dataRef ='grossWt'
                    :class="{'error-color': errorColor.grossWt, 'require-color': controller.requireColor}"
                    :readonly="controller.isDisabled || controller.isWholeDec"
                    @focus="tipsFillMessage('grossWt')" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="净重(KG)" prop="netWt" :class='aiColors[headAiColor.netWt]'>
                <el-input v-inputMax v-model="decHead.netWt" :maxlength="20"
                    ref="netWt" dataRef ='netWt'
                    :class='{"error-color" : errorColor.netWt, "require-color" : controller.requireColor}'
                    :readonly="controller.isDisabled"
                    @focus="tipsFillMessage('netWt')">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="贸易国别(地区)"
                :class='[aiColors[headAiColor.tradeAreaCode], errorColor.tradeAreaCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
                prop="tradeAreaCode">
                <el-select v-inputMax v-model="decHead.tradeAreaCode"
                      ref="tradeAreaCode" dataRef ='tradeAreaCode'
                      :disabled="controller.isDisabled"
                      style="width:100%"
                      placeholder=" "
                      remote default-first-option clearable filterable
                      :remote-method="checkParamsList"
                      @focus="tipsFillMessage('tradeAreaCode', 'saasCountry2','SAAS_COUNTRY')"
                      @clear="clearSelct('saasCountry2')" >
                      <el-option
                        v-for="item in saasCountry2"
                        :key="item.codeField"
                        :showLabel="showCustomsCode? '' : item.nameField"
                        :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                        :value="item.codeField">
                      </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="集装箱数">
                <el-input  v-model="showFied.contaCount" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="随附单证">
                <el-input v-model="showFied.attaDocuCdstr" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="controller.iEFlag == 'I' && controller.funFlag == 'declaration'">
            <!-- 进口页面显示 -->
            <el-col :span="6">
              <el-form-item label="入境口岸"
                :class='[aiColors[headAiColor.entyPortCode], errorColor.entyPortCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
                prop="entyPortCode">
                <el-select v-inputMax placeholder=" " v-model="decHead.entyPortCode"
                    ref="entyPortCode" dataRef ='entyPortCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    remote  default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                    @clear="clearSelct('saasInlandPort')" >
                    <el-option
                      v-for="item in saasInlandPort"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物存放地点" prop="goodSplace" :class='aiColors[headAiColor.goodSplace]'>
                <el-autocomplete v-inputMax v-model="decHead.goodSplace" :maxlength="100" size='mini'
                      ref="goodSplace" dataRef ='goodSplace'
                      :class='{"error-color" : errorColor.goodSplace, "require-color" : controller.requireColor}'
                      :readonly="controller.isDisabled"
                      placeholder=""
                      :popper-append-to-body='false'
                      :trigger-on-focus="false"
                      :select-when-unmatched='true'
                      :highlight-first-item='true'
                      :fetch-suggestions="goodSplaceSearch"
                      @input='checklen("decHead", "goodSplace", 100)'
                      @focus="tipsFillMessage('goodSplace')" >
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6" >
              <el-form-item label="启运港"
                :class='[aiColors[headAiColor.despPortCode], errorColor.despPortCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
                prop="despPortCode">
                <el-select v-inputMax  v-model="decHead.despPortCode"
                    ref="despPortCode" dataRef ='despPortCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote default-first-option clearable filterable
                    enter = 'no'
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('despPortCode', 'saasPortLin','SAAS_PORT_LIN')"
                    @clear="clearSelct('saasPortLin')" >
                    <el-option
                      v-for="item in saasPortLin"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row   v-else-if = "controller.iEFlag == 'E' && controller.funFlag == 'declaration'">
            <!-- 出口页面显示 -->
            <el-col :span="12">
              <el-form-item label="货物存放地点" :maxlength="100" prop="goodSplace" :class='aiColors[headAiColor.goodSplace]'>
                <el-autocomplete v-inputMax v-model="decHead.goodSplace" :maxlength="100" size='mini'
                    ref="goodSplace" dataRef ='goodSplace'
                    :class='{"error-color" : errorColor.goodSplace}'
                    :readonly="controller.isDisabled"
                    placeholder=""
                    :popper-append-to-body='false'
                    :trigger-on-focus="false"
                    :select-when-unmatched='true'
                    :highlight-first-item='true'
                    :fetch-suggestions="goodSplaceSearch"
                    @input='checklen("decHead", "goodSplace", 100)'
                    @focus="tipsFillMessage('goodSplace')" >
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="离境口岸"
              :class='[aiColors[headAiColor.entyPortCode], errorColor.entyPortCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
               prop="entyPortCode">
                <el-select v-inputMax v-model="decHead.entyPortCode"
                    ref="entyPortCode" dataRef ='entyPortCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" " clearable filterable
                    remote  default-first-option
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                    @clear="clearSelct('saasInlandPort')" >
                    <el-option
                      v-for="item in saasInlandPort"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row   v-else-if="controller.iEFlag == 'I' && controller.funFlag == 'recordList'">
            <!-- 进口页面显示 -->
            <el-col :span="6">
              <el-form-item label="入境口岸"
              :class='[aiColors[headAiColor.entyPortCode], errorColor.entyPortCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
               prop="entyPortCode">
                <el-select v-inputMax v-model="decHead.entyPortCode"
                    ref="entyPortCode" dataRef ='entyPortCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                    @clear="clearSelct('saasInlandPort')" >
                    <el-option
                      v-for="item in saasInlandPort"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="货物存放地点"
              :class='aiColors[headAiColor.goodSplace]'
              prop="goodSplace">
                <el-autocomplete v-inputMax v-model="decHead.goodSplace" :maxlength="100" size='mini'
                    ref="goodSplace" dataRef ='goodSplace'
                    :class="{'error-color': errorColor.goodSplace, 'require-color': controller.requireColor}"
                    :readonly="controller.isDisabled"
                    placeholder=""
                    :popper-append-to-body='false'
                    :trigger-on-focus="false"
                    :select-when-unmatched='true'
                    :highlight-first-item='true'
                    :fetch-suggestions="goodSplaceSearch"
                    @input='checklen("decHead", "goodSplace", 100)'
                    @focus="tipsFillMessage('goodSplace')" >
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6" >
              <el-form-item label="启运港" prop="despPortCode"
              :class='[aiColors[headAiColor.despPortCode], errorColor.despPortCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
              >
                <el-select v-inputMax v-model="decHead.despPortCode"
                    ref="despPortCode" dataRef ='despPortCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote default-first-option clearable filterable
                    enter = 'no'
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('despPortCode', 'saasPortLin','SAAS_PORT_LIN')"
                    @clear="clearSelct('saasPortLin')" >
                    <el-option
                      v-for="item in saasPortLin"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报关单类型"
              :class='[aiColors[headAiColor.entryType], controller.requireColor ? "require-color" : ""]'
              prop="entryType">
                <el-select v-inputMax  v-model="decHead.entryType"
                  ref="entryType" dataRef ='entryType'
                  :disabled="controller.isDisabled || controller.isSummary || controller.isWholeDec"
                  style="width:100%"
                  placeholder=" "
                  remote default-first-option clearable filterable
                  :remote-method="checkParamsList"
                  @focus="tipsFillMessage('entryType', 'decType','DEC_TYPE')"
                  @clear="clearSelct('decType')"
                  @change="entryTypeChange" >
                  <el-option
                    v-for="item in decType"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row   v-else>
            <!-- 出口页面显示 -->
            <el-col :span="12">
              <el-form-item label="货物存放地点" :maxlength="100"
              :class='[aiColors[headAiColor.goodSplace], errorColor.goodSplace ? "error-color" : ""]'
              prop="goodSplace">
                <el-autocomplete v-inputMax v-model="decHead.goodSplace" :maxlength="100" size='mini'
                  ref="goodSplace" dataRef ='goodSplace'
                  :readonly="controller.isDisabled"
                  placeholder=""
                  :popper-append-to-body='false'
                  :trigger-on-focus="false"
                  :select-when-unmatched='true'
                  :highlight-first-item='true'
                  :fetch-suggestions="goodSplaceSearch"
                  @input='checklen("decHead", "goodSplace", 100)'
                  @focus="tipsFillMessage('goodSplace')" >
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="离境口岸"
              :class='[aiColors[headAiColor.entyPortCode], errorColor.entyPortCode ? "error-color" : "", controller.requireColor ? "require-color" : ""]'
              prop="entyPortCode">
                <el-select v-inputMax placeholder=" " v-model="decHead.entyPortCode"
                    ref="entyPortCode" dataRef ='entyPortCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    remote  default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                    @clear="clearSelct('saasInlandPort')" >
                    <el-option
                      v-for="item in saasInlandPort"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报关单类型"
              :class='[aiColors[headAiColor.entryType],  controller.requireColor ? "require-color" : ""]'
              prop="entryType">
                <el-select v-inputMax  v-model="decHead.entryType"
                  ref="entryType" dataRef ='entryType'
                  :disabled="controller.isDisabled || controller.isSummary || controller.isWholeDec"
                  style="width:100%"
                  placeholder=" "
                  remote default-first-option clearable filterable
                  :remote-method="checkParamsList"
                  @focus="tipsFillMessage('entryType', 'decType','DEC_TYPE')"
                  @clear="clearSelct('decType')"
                  @change="entryTypeChange" >
                  <el-option
                    v-for="item in decType"
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
            <el-col :span="6" v-if= "controller.funFlag === 'declaration' ">
              <el-form-item label="报关单类型"
                :class='[aiColors[headAiColor.entryType],  controller.requireColor ? "require-color" : ""]'
                prop="entryType">
                <el-select v-inputMax  v-model="decHead.entryType"
                  ref="entryType" dataRef ='entryType'
                  :disabled="controller.isDisabled || controller.isSummary || controller.isWholeDec"
                  style="width:100%"
                  placeholder=" "
                  remote default-first-option clearable filterable
                  :remote-method="checkParamsList"
                  @focus="tipsFillMessage('entryType', 'decType','DEC_TYPE')"
                  @clear="clearSelct('decType')"
                  @change="entryTypeChange">
                  <el-option
                    v-for="item in decType"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if= "controller.funFlag === 'recordList'">
              <el-form-item label="清单类型"
                :class='[aiColors[headAiColor.billtype],  controller.requireColor ? "require-color" : ""]'
                prop="billtype">
                <el-select v-inputMax  v-model="decHead.billtype"
                  ref="billtype" dataRef ='billtype'
                  :disabled="controller.isDisabled || controller.isSummary || controller.isWholeDec"
                  style="width:100%"
                  placeholder=" "
                  remote default-first-option clearable filterable
                  :remote-method="checkParamsList"
                  @focus="tipsFillMessage('billtype', 'billType', 'BILL_TYPE')"
                  @clear="clearSelct('billType')" >
                  <el-option
                    v-for="item in billType"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" :class='aiColors[headAiColor.noteS]'>
                <el-input v-inputMax type="textarea" v-model="decHead.noteS" :maxlength="255"
                      ref="noteS" dataRef ='noteS'
                      class='dec-textarea'
                      :class='{"error-color" : errorColor.noteS}'
                      :readonly="controller.isDisabled"
                      @focus="tipsFillMessage('noteS')"
                      @keyup.native= "computLength('1')" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" >
              <div style='display: inline-block;width: 50%;'>
                <span >{{'(' + noteLenght + ')字节'}}</span>
                <el-button onfocus="this.blur()" class="btn-pop" icon="fa fa-ellipsis-h" @click="openNote('1')"></el-button>
              </div>
              <div style='display: inline-block;width: 45%;'>
                <el-button type="primary" @click="openOtherPriceFactor" class="w-100">其他事项确认</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="3">
              <el-button class="btn-pop" :icon="isShowText1" size='mini' @click="changeIsShow1"></el-button>
            </el-col>
            <el-col :span="3">
              <el-form-item >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标记唛码" :class='aiColors[headAiColor.markNo]'  prop="markNo" ref="markNo">
                <el-input v-inputMax type="textarea" v-model="decHead.markNo" :maxlength="400"
                  dataRef = 'markNo'
                  class='dec-textarea'
                  :class='{"require-color" : controller.requireColor}'
                  :readonly="controller.isDisabled"
                  @keyup.native= "computLength('2')"
                  @focus="tipsFillMessage('markNo')" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <div style='display: inline-block;width: 50%;'>
                <span >{{'(' + markNoLength + ')字节'}}</span>
                <el-button class="btn-pop" onfocus="this.blur()" icon="fa fa-ellipsis-h" @click="openNote('2')"></el-button>
                <el-button class="btn-pop" icon="fa fa-bullseye" @click="openAccessory"></el-button>
              </div>
              <div style='display: inline-block;width: 45%;'>
                <el-button type="primary" @click="openBussiness" class="w-100">业务事项</el-button>
              </div>
            </el-col>
          </el-row>
          <div v-show="isShow1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="检验检疫受理机关" prop="orgCode"
                  :class="{ 'require-color': controller.requireColor }">
                  <el-select v-inputMax v-model="decHead.orgCode"
                    dataRef ='orgCode' ref="orgCode"
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote  default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('orgCode', 'saasCiqOrganization1','SAAS_CIQ_ORGANIZATION')"
                    @clear="clearSelct('saasCiqOrganization1')" >
                    <el-option
                      v-for="item in saasCiqOrganization1"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业资质">
                  <el-col :span="8">
                    <el-input v-model="showFied.entQualifTypeCodeS" @focus="tipsFillMessage('entQualifTypeCodeS')" placeholder="企业资质类别" readonly></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="showFied.entQualifTypeCodeSName" @focus="tipsFillMessage('entQualifTypeCodeSName')" placeholder="企业资质编号"  readonly></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button  class="btn-pop" icon="fa fa-angle-left" @click="lastStep"></el-button>
                    <el-button  class="btn-pop" icon="fa fa-angle-right" @click="nextStep"></el-button>
                    <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openEntQuaConent" ></el-button>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="controller.iEFlag === 'I' ? 6 : 12">
                <el-form-item label="领证机关" prop="vsaOrgCode"
                  :class="{ 'require-color': controller.requireColor }">
                  <el-select v-inputMax placeholder=" " v-model="decHead.vsaOrgCode"
                    ref="vsaOrgCode" dataRef ='vsaOrgCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('vsaOrgCode', 'saasCiqOrganization2','SAAS_CIQ_ORGANIZATION')"
                    @clear="clearSelct('saasCiqOrganization2')">
                    <el-option
                      v-for="item in saasCiqOrganization2"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="controller.iEFlag === 'I' ? 6 : 12">
                <el-form-item label="口岸检验检疫机关"  :class="{ 'require-color': controller.requireColor }" prop="inspOrgCode">
                  <el-select v-inputMax v-model="decHead.inspOrgCode"
                    ref="inspOrgCode" dataRef ='inspOrgCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('inspOrgCode', 'saasCiqOrganization3','SAAS_CIQ_ORGANIZATION')"
                    @clear="clearSelct('saasCiqOrganization3')" >
                    <el-option
                      v-for="item in saasCiqOrganization3"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="controller.iEFlag === 'I'">
                <el-form-item label="启运日期"  :class="{ 'require-color': controller.requireColor }"  prop="despDate" ref="despDate">
                  <el-date-picker
                    v-model="decHead.despDate"
                    type="date"
                    @focus="tipsFillMessage('despDate')"
                    @change='despDateChange'
                    @blur='despDateBlur'
                    :disabled="controller.isDisabled"
                    value-format="yyyyMMdd"
                    format='yyyyMMdd'
                    placeholder=" ">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="controller.iEFlag === 'I'">
                <el-form-item label="B/L号">
                  <el-input v-inputMax v-model="decHead.blno" :maxlength="50"
                    ref="blno"
                    :readonly="controller.isDisabled"
                    @focus="tipsFillMessage('blno')">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="controller.iEFlag === 'I' ? 6 : 12">
                <el-form-item label="目的地检验检疫机关"  :class="{ 'require-color': controller.requireColor }"  prop="purpOrgCode">
                  <el-select v-inputMax  v-model="decHead.purpOrgCode"
                    ref="purpOrgCode" dataRef ='purpOrgCode'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    remote  default-first-option clearable filterable
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('purpOrgCode', 'saasCiqOrganization4','SAAS_CIQ_ORGANIZATION')"
                    @clear="clearSelct('saasCiqOrganization4')" >
                    <el-option
                      v-for="item in saasCiqOrganization4"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联号码及理由" >
                  <el-col :span="12">
                    <el-input v-inputMax v-model="decHead.correlationaNo" :maxlength="500"
                      :readonly="controller.isDisabled"
                       placeholder="关联号码"
                      @focus="tipsFillMessage('correlationaNo')" >
                    </el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-select v-inputMax v-model="decHead.correlationReasonFlag"
                      ref="correlationReasonFlag" dataRef ='correlationReasonFlag'
                      :disabled="controller.isDisabled"
                      style="width:100%"
                      placeholder="关联理由"
                      remote default-first-option clearable filterable
                      :remote-method="checkParamsList"
                      @focus="tipsFillMessage('correlationReasonFlag', 'saasCorrelationReason','SAAS_CORRELATION_REASON')"
                      @clear="clearSelct('saasCorrelationReason')">
                      <el-option
                        v-for="item in saasCorrelationReason"
                        :key="item.codeField"
                        :showLabel="showCustomsCode? '' : item.nameField"
                        :label="item.codeField + '-' + item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="controller.iEFlag === 'I'">
                <el-form-item >
                  <el-button type="primary" class="w-100" @click="openDecUserContent">使用人</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="6" v-if="controller.iEFlag == 'I'">
                <el-form-item label="原箱运输">
                  <el-select v-inputMax  v-model="decHead.origBoxFlag"
                    ref="origBoxFlag" dataRef ='origBoxFlag'
                    :disabled="controller.isDisabled"
                    style="width:100%"
                    placeholder=" "
                    filterable clearable remote default-first-option
                    :remote-method="checkParamsList"
                    @focus="tipsFillMessage('origBoxFlag', 'commomPara1','COMMON_PARA')"
                    @clear="clearSelct('commomPara1')" >
                    <el-option
                      v-for="item in commomPara1"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="controller.iEFlag == 'I' ? 6 : 12">
                <el-form-item label="特殊业务标识" >
                  <el-col :span="controller.iEFlag == 'I' ? 18 : 20">
                    <el-input v-inputMax v-model="specDeclFlagValue" @focus="tipsFillMessage('specDeclFlagValue')" readonly></el-input>
                  </el-col>
                  <el-col :span="controller.iEFlag == 'I' ? 6 : 4">
                    <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openSpecialBusiContent"></el-button>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所需单证">
                  <el-input v-inputMax v-model="appCertName" @focus="tipsFillMessage('appCertName')" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item >
                  <el-button type="primary" class="w-100" @click="openDecElementsContent">检验检疫签证申报要素</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
      </el-form>
      <el-popover v-if="popoverVisible" v-model="popoverVisible"  trigger="auto" width="300" placement="right-start" @show="getTypeToHead(currentShowField + 'Note', currentShowField)" :reference="reference">
        <error-tips :approvalOpinions="decCheckRec[currentShowField + 'Note']" :headClomn ="currentShowField + 'Note'"  @close:errorTips='closeErrorTips'></error-tips>
      </el-popover>
      <!-- 业务事项  -->
      <business-matters :businessVisible.sync="businessVisible" :checkList="checkList"  :controller="controller" @close:businessMatters="saveBusiness"></business-matters>
      <!-- 检验检疫申报要素 -->
      <ciq-elements :decElementsVisible.sync="decElementsVisible" :isDisabled='controller.isDisabled' :iEFlag='controller.iEFlag' :initCiqElements='initCiqElements'  @close:ciqElements="backCiqElements" :goodsEnNameList="goodsEnNameList"></ciq-elements>
      <!-- 标记唛码和备注 -->
      <dec-note :noteTitle="noteTitle" :decNotevisible='decNotevisible' :type='noteType' :note='noteValue' @close:decNote="receptionNoteData"></dec-note>
      <!-- 使用人 -->
      <dec-user :isDisabled='controller.isDisabled' :userListArr='userList' :decUserVisible='decUserVisible'  @close:decUser="saveDecUser"></dec-user>
      <!-- 企业资质 -->

      <enterprise-qualification :selectObj="enterpriseSelectObj" :entQuaVisible='entQuaVisible' :decCopLimits='decCopLimits' :copmpanyPromise='copmpanyPromise' :controller='controller' @close:entQua="receptionEntQuaData" :saasEntQualifType="saasEntQualifType" :moduleName="moduleName"></enterprise-qualification>
      <!-- 价格因素 -->
      <other-factor :otherPriceFactorVisible.sync='otherPriceFactorVisible' :promiseItmes='promiseItmes' :checkData='otherPromiseCheckData' @close:otherFactor="backOtherFactor" :showCustomsCode="showCustomsCode" :moduleName="moduleName"></other-factor>
      <!-- 其他包装 -->
      <other-packs :otherPacksVisible.sync='otherPacksVisible' :isDisabled='controller.isDisabled' :otherPacks='decHead.otherPacks' @close:otherPacks="backOtherPacks"></other-packs>
      <!-- 特殊业务标识 -->
      <special-bussiness :specialBusiVisible.sync='specialBusiVisible' :isDisabled='controller.isDisabled' :iEFlag='controller.iEFlag' :specialBusiList='specialBusiList' @close:specialBussiness="backspecialBussiness"></special-bussiness>
      <!-- 编辑标记及号码附件信息 -->
      <attachment-upload :attachVisabled.sync='attachVisabled' :decMarkLobsData='decMarkLobsVo' @close:attachmentUpload="receptionAttachData"></attachment-upload>
      <!-- z账册 -->
      <dec-zbook :ZBookVisabled.sync='ZBookVisabled' :HBookList='zBookList' :iEFlag='controller.iEFlag' :districtCode='controller.districtCode' @close:bookList="receptionZBookData"></dec-zbook>
      <!-- 选择海关编码和检验检疫编码 -->
      <customs-code :customsCodeVisabled='customsCodeVisabled' :initParams="initCustomsCode"  @close:customsCode="receptionCustomsCode"></customs-code>
      <!-- 舱单信息 -->
      <shipping-bill :mftBillVisible.sync='mftBillVisible' :initParams="initMftBill" :shippingList='shippingList' @close:shippingBill="mftBillData"></shipping-bill>
      <!-- 舱单数据明细 -->
      <shipping-detail :mftBillDetailVisible.sync='mftBillDetailVisible' :initParams="initMftBill" :shippingList='shippingList' :mftContainerList='mftContainerList' @close:shippingBillDetail="mftBillDetailData"></shipping-detail>
      <!-- 报价提醒 -->
      <price-remind :prcVisible.sync='prcVisible' :priceList="priceList" :operType="operType" @close:priceRemind="prcRemindData"></price-remind>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../common/decUtil'
import decBus from '../common/bus.js'
import businessUtil from '../common/businessUtil'
import businessMatters from './components/businessMatters'
import ciqElements from './components/ciqElements'
import decUser from './components/decUser'
import enterpriseQualification from './components/enterpriseQualification'
import otherFactor from './components/otherFactor'
import otherPacks from './components/otherPacks'
import specialBussiness from './components/specialBussiness'
import decNote from './components/decNote'
import attachmentUpload from './components/attachmentUpload'
import decZbook from './components/bookList'
import shippingBill from './components/shippingBill'
import priceRemind from './components/priceRemind'
import customsCode from './components/customsCode'
import errorTips from '../components/errorTips'
import shippingDetail from './components/shippingBillDetail'

export default {
  name: 'dec-head',
  components: {
    businessMatters,
    ciqElements,
    decUser,
    enterpriseQualification,
    otherFactor,
    otherPacks,
    specialBussiness,
    decNote,
    attachmentUpload,
    decZbook,
    customsCode,
    shippingBill,
    priceRemind,
    errorTips,
    shippingDetail
  },
  directives: {
    labelColor: {
      componentUpdated: (el, binding) => {
        // 'dec-color-red', 'dec-color-yellow', 'dec-color-black'
        let $label = el.querySelector('label')
        let red = el.querySelectorAll('.dec-color-red')
        // let yellow = el.querySelectorAll('.dec-color-yellow')
        if (red.length > 0) {
          $label.style.color = '#fe0101'
        } else {
          $label.style.color = '#080808'
        }
      }
    }
  },
  props: {
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      popoverVisible: false,
      currentShowField: '',
      currentShowNoteField: '',
      reference: '',
      decHead: businessUtil.generateDecHead(),
      businessVisible: false,
      isShow1: false,
      isShowText1: 'fa fa-angle-double-right',
      decElementsVisible: false,
      initCiqElements: {},
      decNotevisible: false,
      noteType: '',
      noteValue: '',
      decUserVisible: false, // 使用人
      userList: [], // 使用人
      decCopLimits: [], // 企业资质
      entQuaVisible: false, // 企业资质
      copmpanyPromise: false,
      otherPriceFactorVisible: false, // 其他价格因素
      otherPromiseCheckData: {},
      promiseItmes: '', // 其他价格因素
      specialBusiVisible: false, // 特殊业务标识
      specialBusiList: [], // 特殊业务标识
      attachVisabled: false, // 编辑标记及号码附件信息
      decMarkLobsVo: {}, // 编辑标记及号码附件信息
      zBookList: [], // 减免税备案清单商品列表
      ZBookVisabled: false, // 减免税备案清单商品列表
      customsCodeVisabled: false, // 选择海关编码和检验检疫编码
      initCustomsCode: {}, // 选择海关编码和检验检疫编码
      mftBillVisible: false, // 舱单信息
      shippingList: [], // 舱单信息
      otherPacksVisible: false,
      prcVisible: false, // 报价提醒
      priceList: [], // 报价数据
      operType: '',
      initMftBill: {},
      mftBillDetailVisible: false, // 舱单数据明细
      mftContainerList: [], // 舱单集装箱列表
      checkList: [], // 业务事项
      cropLimit: { // 记录特殊的一个企业资质
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      },
      selectObj: {
        obj: '',
        params: ''
      },
      headController: {
        otherCurrDisabled: false, // 杂费用币制
        feeMarkDisabled: false, // 运费币制
        feeRateDisabled: false, // 运费币制
        feeCurrDisabled: false, // 运费币制
        insurMarkDisabled: false, // 保费币制
        insurRateDisabled: false, // 保费币制
        insurCurrDisabled: false, // 保费币制
        isSeqNo: false // 是否切换为 统一编号 默认为关检关联号
      },
      appCertName: '', // 所需单证
      specDeclFlagValue: '', // 特殊业务标识 显示部分
      ownerCorpId: '', // 生产/消费单位公司ID
      tradeCorpId: '', // 境内收发货人公司ID
      agentCorpId: '', // 申报单位公司ID
      noteLenght: 0, // 备注字段的长度
      markNoLength: 0, // 标记唛码的长度
      noteTitle: '备注',
      saasCustomsRel1: [],
      saasCustomsRel2: [],
      saasTransportType: [], // 运输方式
      saasTrade: [], // 监管方式
      saasLevytype: [], // 征免性质
      saasCountry1: [], // 启运国(地区)':'运抵国(地区)
      distinatePort: [], // 经停港':'指运港
      saasTransac: [], // 成交方式
      feeRate1: [], // 运费
      saasCurr1: [], // 运费
      feeRate2: [], // 保费
      saasCurr2: [], // 保费
      feeRate3: [], // 杂费
      saasCurr3: [], //
      saasWrap: [], // 包装种类
      saasCountry2: [], // 贸易国别(地区)
      saasInlandPort: [], // 入境口岸
      saasPortLin: [], // 启运港
      saasPortLin1: [], // saasPortLin1
      decType: [], // 报关单类型
      billType: [], // 清单类型
      saasCiqOrganization1: [], // 检验检疫受理机关
      saasCiqOrganization2: [], // 领证机关
      saasCiqOrganization3: [], // 口岸检验检疫机关
      saasCiqOrganization4: [], // 目的地检验检疫机关
      commomPara1: [], // 原箱运输
      saasCorrelationReason: [], // 关联理由
      headSelect: {
        'customMaster': {obj: 'saasCustomsRel1', params: 'SAAS_CUSTOMS_REL'},
        'iEPort': {obj: 'saasCustomsRel2', params: 'SAAS_CUSTOMS_REL'},
        'trafMode': {obj: 'saasTransportType', params: 'SAAS_TRANSPORT_TYPE'}, // 运输方式
        'tradeMode': {obj: 'saasTrade', params: 'SAAS_TRADE'}, // 监管方式
        'cutMode': {obj: 'saasLevytype', params: 'SAAS_LEVYTYPE'}, // 征免性质
        'tradeCountry': {obj: 'saasCountry1', params: 'SAAS_COUNTRY'}, // 启运国(地区)':'运抵国(地区)
        'distinatePort': {obj: 'saasPortLin1', params: 'SAAS_PORT_LIN'}, // 经停港':'指运港
        'transMode': {obj: 'saasTransac', params: 'SAAS_TRANSAC'}, // 成交方式
        'feeMark': {obj: 'feeRate1', params: 'FEE_RATE'}, // 运费
        'feeCurr': {obj: 'saasCurr1', params: 'SAAS_CURR'}, // 运费
        'insurMark': {obj: 'feeRate2', params: 'FEE_RATE_OHTER'}, // 保费
        'insurCurr': {obj: 'saasCurr2', params: 'SAAS_CURR'}, // 保费
        'otherMark': {obj: 'feeRate3', params: 'FEE_RATE_OHTER'}, // 杂费
        'otherCurr': {obj: 'saasCurr3', params: 'SAAS_CURR'}, //
        'wrapType': {obj: 'saasWrap', params: 'SAAS_WRAP'}, // 包装种类
        'tradeAreaCode': {obj: 'saasCountry2', params: 'SAAS_COUNTRY'}, // 贸易国别(地区)
        'entyPortCode': {obj: 'saasInlandPort', params: 'SAAS_INLAND_PORT'}, // 入境口岸
        'despPortCode': {obj: 'saasPortLin', params: 'SAAS_PORT_LIN'}, // 启运港
        'entryType': {obj: 'decType', params: 'DEC_TYPE'}, // 报关单类型
        'billtype': {obj: 'billType', params: 'BILL_TYPE'}, // 清单类型
        'orgCode': {obj: 'saasCiqOrganization1', params: 'SAAS_CIQ_ORGANIZATION'}, // 检验检疫受理机关
        'vsaOrgCode': {obj: 'saasCiqOrganization2', params: 'SAAS_CIQ_ORGANIZATION'}, // 领证机关
        'inspOrgCode': {obj: 'saasCiqOrganization3', params: 'SAAS_CIQ_ORGANIZATION'}, // 口岸检验检疫机关
        'purpOrgCode': {obj: 'saasCiqOrganization4', params: 'SAAS_CIQ_ORGANIZATION'}, // 目的地检验检疫机关
        'origBoxFlag': {obj: 'commomPara1', params: 'COMMON_PARA'}, // 原箱运输
        'correlationReasonFlag': {obj: 'saasCorrelationReason', params: 'SAAS_CORRELATION_REASON'} // 关联理由
      },
      headRuleForm: {
        customMaster: [ // 申报地海关
          {validator: this.checkHeadValid, message: '输入4位代码或名称', trigger: 'blur'}
        ],
        licenseNo: [ // 许可证号
          {validator: this.checkHeadValid, message: '请输入正确格式的许可证号', trigger: 'blur'}
        ],
        iEPort: [ // 进境关别
          {validator: this.checkHeadValid, message: '输入4位代码或名称', trigger: 'blur'}
        ],
        manualNo: [ // 备案号
          {validator: this.checkHeadValid, message: '请输入12位数字或字母', trigger: 'blur'}
        ],
        iEDate: [ // 进境关别
          {validator: this.checkHeadValid, message: '请输入yyyyMMdd格式的日期', trigger: 'blur'}
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
        overseasConsignorEname: [ // 企业名称(外文)
          {validator: this.checkHeadValid, message: '请输入企业名称', trigger: 'blur'}
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
        tradeCountry: [ // 输入启运国/运抵国
          {validator: this.checkHeadValid, message: '输入启运国/运抵国代码', trigger: 'blur'}
        ],
        distinatePort: [ // 经停港/指运港代码
          {validator: this.checkHeadValid, message: '输入经停港/指运港代码', trigger: 'blur'}
        ],
        transMode: [ // 成交方式
          {validator: this.checkHeadValid, message: '输入成交方式代码', trigger: 'blur'}
        ],
        feeRate: [ // 运费 费率、单价、总价
          {validator: this.checkHeadValid, message: '输入正确的格式', trigger: 'blur'}
        ],
        insurRate: [ // 保费 费率、单价、总价
          {validator: this.checkHeadValid, message: '输入正确的格式', trigger: 'blur'}
        ],
        otherRate: [ // 杂费 费率、单价、总价
          {validator: this.checkHeadValid, message: '输入正确的格式', trigger: 'blur'}
        ],
        packNo: [ // 件数
          {validator: this.checkHeadValid, message: '输入不过超9位的自然数', trigger: 'blur'}
        ],
        wrapType: [ // 包装种类
          {validator: this.checkHeadValid, message: '输入包装种类', trigger: 'blur'}
        ],
        grossWt: [ // 毛重(KG)
          {validator: this.checkHeadValid, message: '输入整数不超过14位小数不超过5位的数', trigger: 'blur'},
          {validator: this.checkWeightValid, message: '毛重不足1时，按1填报', trigger: 'blur'}
        ],
        netWt: [ // 净重(KG)
          {validator: this.checkHeadValid, message: '输入整数不超过14位小数不超过5位的数', trigger: 'blur'},
          {validator: this.checkWeightValid, message: '净重不足1时，按1填报', trigger: 'blur'}
        ],
        tradeAreaCode: [ // 贸易国别(地区)
          {validator: this.checkHeadValid, message: '输入贸易国别（地区）', trigger: 'blur'}
        ],
        entyPortCode: [ // 入境口岸
          {validator: this.checkHeadValid, message: '输入入境口岸代码', trigger: 'blur'}
        ],
        goodSplace: [ // 货物存放地点
          {validator: this.checkHeadValid, message: '输入货物存放地点', trigger: 'blur'}
        ],
        despPortCode: [ // 启运港/离境口岸代码
          {validator: this.checkHeadValid, message: '输入启运港/离境口岸代码', trigger: 'blur'}
        ],
        entryType: [ // 报关单类型
          {validator: this.checkHeadValid, message: '输入报关单类型', trigger: 'blur'}
        ],
        markNo: [ // 标记唛码
          {validator: this.checkHeadValid, message: '输入标记唛码', trigger: 'blur'}
        ],
        orgCode: [ // 检验检疫受理机关
          {validator: this.checkHeadValid, message: '输入检验检疫受理机关', trigger: 'blur'}
        ],
        despDate: [ // 启运日期
          {validator: this.checkHeadValid, message: '输入启运日期', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        'customMaster': '^\\d{4}$', // 申报地海关
        'iEPort': '^\\d{4}$|^$', // 进境关别
        'manualNo': '^[0-9A-Za-z]{12}$|^$', // 备案号
        'iEDate': '^20[0-9]{2}[0-1][0-9][0-3][0-9]$|^$', // 进出口日期
        'licenseNo': '^[0-9a-zA-Z]{2}-[0-9a-zA-Z]{2}-[0-9a-zA-Z]{1,14}$|^$', // 许可证号
        'tradeCoScc': '^[0-9a-zA-Z]{18}$|^NO$|^$', // 境内收发货人 18位社会信用代码
        'tradeCode': '^[0-9a-zA-Z]{10}$|^$', // 境内收发货人 10位海关编码
        'tradeName': '^.{1,70}$|^$', // 境内收发货人 企业名称(中文)
        'overseasConsignorEname': '^.{1,100}$|^$', // 企业名称(外文)
        'ownerCodeScc': '^[0-9a-zA-Z]{18}$|^NO$|^$', // 消费生产使用/生产销售单位 18位社会信用代码
        'ownerCode': '^[0-9a-zA-Z]{9,10}$|^NO$|^$', // 消费生产使用/生产销售单位 10位海关编码
        'ownerName': '^.{1,70}$|^$', // 消费生产使用/生产销售单位 企业名称
        'agentCodeScc': '^[0-9a-zA-Z]{18}$|^$', // 申报单位 18位社会信用代码
        'agentCode': '^[0-9a-zA-Z]{10}$|^$', // 申报单位 10位海关编码
        'agentName': '^.{1,70}$|^$', // 申报单位 企业名称
        'trafMode': '^[0-9a-zA-Z]{1}$|^$', // 运输方式
        'tradeMode': '^[0-9a-zA-Z]{4}$|^$', // 监管方式
        'billNo': '^.{0,32}$', // 提运单号
        'tradeCountry': '^[0-9a-zA-Z]{3}$|^$', // 启运国(地区)
        'distinatePort': '^[0-9a-zA-Z]{6}$|^$', // 经停港/指运港代码
        'transMode': '^.{1,2}$|^$', // 成交方式
        'feeRate': '^\\d{1,12}(\\.\\d{1,5})?$|^$', // 运费 费率、单价、总价
        'insurRate': '^\\d{1,12}(\\.\\d{1,5})?$|^$', // 保费 费率、单价、总价
        'otherRate': '^\\d{1,12}(\\.\\d{1,5})?$|^$', // 杂费 费率、单价、总价
        'packNo': '^\\d{1,9}$|^$', // 件数
        'wrapType': '^\\d{1,2}$|^$', // 包装种类
        'grossWt': '^\\d{1,14}(\\.\\d{1,5})?$|^$', // 毛重(KG)
        'netWt': '^\\d{1,14}(\\.\\d{1,5})?$|^$', // 净重(KG)
        'tradeAreaCode': '^[0-9a-zA-Z]{3}$|^$', // 贸易国别(地区)
        'entyPortCode': '^[0-9a-zA-Z]{6}$|^$', // 入境口岸
        'goodSplace': '^.{1,100}$|^$', // 货物存放地点
        'despPortCode': '^[0-9a-zA-Z]{6}$|^$', // 启运港/离境口岸代码
        'entryType': '^[0-9a-zA-Z]{1}$|^$', // 报关单类型
        'markNo': '^[\\s\\S]{1,400}$|^$', // 标记唛码
        'despDate': '^\\d{8}$|^$' // 启运日期
      },
      feeSetting: {
        'fee': {
          '1': {
            currDisabled: true,
            ruleRegx: '^\\d{1,2}(\\.\\d{1,4})?$|^$',
            validateRule: [ // 运费 费率、单价、总价
              {validator: this.checkFateValid, message: '输入0.0001~99的数字', trigger: 'blur'}
            ]
          },
          '2': {
            currDisabled: false,
            ruleRegx: '^\\d{1,10}(\\.\\d{1,4})?$|^$',
            validateRule: [ // 运费 费率、单价、总价
              {validator: this.checkHeadValid, message: '输入整数部分不超过10位，小数不超过4位的数字', trigger: 'blur'}
            ]
          },
          'default': {
            currDisabled: false,
            ruleRegx: '^\\d{1,12}(\\.\\d{1,4})?$|^$',
            validateRule: [ // 运费 费率、单价、总价
              {validator: this.checkHeadValid, message: '输入整数部分不超过12位，小数不超过4位的数字', trigger: 'blur'}
            ]
          }
        },
        'insur': {
          '1': {
            currDisabled: true,
            ruleRegx: '^\\d{1,2}(\\.\\d{1,4})?$|^$',
            validateRule: [ // 运费 费率、单价、总价
              {validator: this.checkFateValid, message: '输入0.0001~99的数字', trigger: 'blur'}
            ]
          },
          'default': {
            currDisabled: false,
            ruleRegx: '^\\d{1,12}(\\.\\d{1,4})?$|^$',
            validateRule: [ // 运费 费率、单价、总价
              {validator: this.checkHeadValid, message: '输入整数部分不超过12位，小数不超过4位的数字', trigger: 'blur'}
            ]
          }
        },
        'other': {
          '1': {
            currDisabled: true,
            ruleRegx: '^(-){0,1}\\d{1,2}(\\.\\d{1,4})?$|^$',
            validateRule: [ // 运费 费率、单价、总价
              {validator: this.checkFateValid, message: '输入0.0001到99”或“-99到-0.0001', trigger: 'blur'}
            ]
          },
          'default': {
            currDisabled: false,
            ruleRegx: '^(-){0,1}\\d{1,12}(\\.\\d{1,4})?$|^$',
            validateRule: [ // 运费 费率、单价、总价
              {validator: this.checkHeadValid, message: '输入0.0001~99的数字', trigger: 'blur'}
            ]
          }
        }
      },
      importRules: {
        'CR000001_0110_401_Z': '进口,监管方式为一般贸易，征免性质为科教用品时,备案号首字母为Z',
        'CR000002_0110_789_Z': '进口,监管方式为一般贸易，征免性质为鼓励项目时,备案号首字母为Z',
        'CR000003_0110_799_Z': '进口,监管方式为一般贸易，征免性质为自有资金时,备案号首字母为Z',
        'CR000004_2025_789_Z': '进口,监管方式为合资合作设备，征免性质为鼓励项目时,备案号首字母为Z',
        'CR000005_2225_789_Z': '进口,监管方式为外资设备物品，征免性质为鼓励项目时,备案号首字母为Z',
        'CR000006_2025_799_Z': '进口,监管方式为合资合作设备，征免性质为自有资金时,备案号首字母为Z',
        'CR000007_2225_799_Z': '进口,监管方式为合资合作设备，征免性质为自有资金时,备案号首字母为Z',
        'CR000008_0214_502_B$E': '进口,监管方式为来料加工，征免性质为来料加工时,备案号首字母为B、E',
        'CR000009_0255_0_B$E': '进口,监管方式为来料深加工时,备案号首字母为B、E',
        'CR000010_0258_0_B$E': '进口,监管方式为来料余料结转时,备案号首字母为B、E',
        'CR000011_0300_0_B$E$H': '进口,监管方式为来料料件退换时,备案号首字母为B、E、H',
        'CR000012_4400_0_B$E$H': '进口,监管方式为来料成品退换时,备案号首字母为B、E、H',
        'CR000013_0265_299_B$E': '进口,监管方式为来料料件复出，征免性质为其他法定时,备案号首字母为B、E',
        'CR000014_0865_299_B$E': '进口,监管方式为来料边角料复出，征免性质为其他法定时,备案号首字母为B、E',
        'CR000015_0615_503_C$E': '进口,监管方式为进料对口，征免性质为进料加工时,备案号首字母为C、E',
        'CR000016_0715_503_C$E': '进口,监管方式为进料非对口，征免性质为进料加工时,备案号首字母为C、E',
        'CR000017_0654_0_C$E': '进口,监管方式为进料深加工时,备案号首字母为C、E',
        'CR000018_0657_0_C$E': '进口,监管方式为进料余料结转时,备案号首字母为C、E',
        'CR000019_0700_0_C$E$H': '进口,监管方式为进料料件退换时,备案号首字母为C、E、H',
        'CR000020_4600_0_C$E$H': '进口,监管方式为进料成品退换时,备案号首字母为C、E、H',
        'CR000021_0664_299_C$E': '进口,监管方式为进料料件复出，征免性质为其他法定时,备案号首字母为C、E',
        'CR000022_0864_299_C$E': '进口,监管方式为进料边角料复出，征免性质为其他法定时,备案号首字母为C、E',
        'CR000023_5014_502_H': '进口,监管方式为区内来料加工，征免性质为来料加工时,备案号首字母为H',
        'CR000024_5015_503_H': '进口,监管方式为区内进料加工货物，征免性质为进料加工时,备案号首字母为H',
        'CR000025_5034_0_H$T': '进口,监管方式为区内物流货物时,备案号首字母为H、T',
        'CR000026_5000_0_H$T': '进口,监管方式为料件进出区时,备案号首字母为H、T',
        'CR000027_5100_0_H': '进口,监管方式为成品进出区时,备案号首字母为H',
        'CR000034_9700_101_B$C$E$H': '进口,监管方式为后续补税，征免性质为一般征税时,备案号首字母为B、C、E、H'
      },
      exportRules: {
        'CR000035_0214_0_B$E': '出口,监管方式为来料加工时,备案号首字母为B、E',
        'CR000036_0615_0_C$E': '出口,监管方式为进料对口时,备案号首字母为C、E',
        'CR000037_5014_502_H': '出口,监管方式为区内来料加工，征免性质为来料加工时,备案号首字母为H',
        'CR000038_5015_503_H': '出口,监管方式为区内来料加工，征免性质为进料加工时,备案号首字母为H',
        'CR000039_5034_0_H$T': '出口,监管方式为区内物流货物时,备案号首字母为H、T',
        'CR000040_5000_0_H$T': '出口,监管方式为料件进出区时,备案号首字母为H、T',
        'CR000041_5100_0_H': '出口,监管方式为成品进出区时,备案号首字母为H',
        'CR000042_4600_0_C$E$H': '出口,监管方式为进料成品退换时,备案号首字母为C、E、H',
        'CR000043_0664_0_H$C$E': '出口,监管方式为进料料件复出时,备案号首字母为H、C、E',
        'CR000044_0700_0_C$E$H': '出口,监管方式为进料料件退换时,备案号首字母为C、E、H',
        'CR000045_0265_0_H$B$E': '出口,监管方式为来料料件复出时,备案号首字母为H、B、E',
        'CR000046_0300_0_B$E$H': '出口,监管方式为来料料件退换时,备案号首字母为B、E、H',
        'CR000047_4400_0_B$E$H': '出口,监管方式为来料成品退换时,备案号首字母为B、E、H',
        'CR000050_9700_101_H$C$B$E': '出口,监管方式为后续补税，征免性质为一般征税时,备案号首字母为B、C、E、H'
      },
      // 征免性质逻辑监控
      custImportRules: {
        'DP000001_0110_101': '进口,监管方式为一般贸易时,征免性质应为一般征税',
        'DP000002_3339_101': '进口,监管方式为其他进出口免费时,征免性质应为一般征税',
        'DP000003_1300_299': '进口,监管方式为修理物品时,征免性质应为其他法定',
        'DP000004_4561_299': '进口,监管方式为退运货物时,征免性质应为其他法定',
        'DP000005_1427_299': '进口,监管方式为出料加工时,征免性质应为其他法定'
      },
      custExportRules: {
        'DP000006_0110_101': '出口,监管方式为一般贸易时,征免性质应为一般征税',
        'DP000011_3339_101': '出口,监管方式为其他进出口免费时,征免性质应为一般征税',
        'DP000012_1300_299': '出口,监管方式为修理物品时,征免性质应为其他法定',
        'DP000013_4561_299': '出口,监管方式为退运货物时,征免性质应为其他法定',
        'DP000013_1427_299': '出口,监管方式为出料加工时,征免性质应为其他法定'
      },
      // 根据 进出口标识、监管方式、征免性质 确定表体的征免方式的值
      dutyModeParam: { // '进出口标识' + '_' + '监管方式' + '_' + '征免性质' + ':' + '征免方式'
        'I_0110_101': '1',
        'I_0110_401': '3',
        'I_0110_789': '3',
        'I_0110_799': '3',
        'I_0214_502': '3',
        'I_0615_503': '3',
        'I_2025_789': '3',
        'I_2225_789': '3',
        'I_0320_501': '3',
        'E_0110_101': '1',
        'E_0110_601': '1',
        'E_0110_602': '1',
        'E_0110_603': '1',
        'E_0214_502': '3',
        'E_0615_503': '3',
        'E_3100_299': '3'
      },
      // 根据 进出口标识、监管方式 确定征免性质的值
      cutModeParam: {
        'I_0214': '502',
        'I_0615': '503',
        'I_2025': '789',
        'I_2225': '789',
        'I_0320': '501',
        'E_0214': '502',
        'E_0615': '503',
        'E_3100': '299'
      },
      headColor: {
        decPid: '',
        tradeCoScc: 1,
        iEPort: 1,
        iEDate: 1,
        dDate: 0,
        manualNo: 0,
        overseasConsignorCode: 0,
        trafMode: 0,
        trafName: 0,
        billNo: 0,
        goodSplace: 0,
        ownerCodeScc: 0,
        tradeMode: 0,
        cutMode: 0,
        licenseNo: 0,
        despPortCode: 0,
        contrNo: 0,
        tradeAreaCode: 0,
        tradeCountry: 0,
        distinatePort: 0,
        entyPortCode: 0,
        wrapType: 0,
        packNo: 0,
        grossWt: 0,
        netWt: 0,
        transMode: 0,
        feeRate: 0,
        insurRate: 0,
        otherRate: 0,
        noteS: 0,
        orgCode: 0,
        vsaOrgCode: 0,
        inspOrgCode: 0,
        despDate: 0,
        blno: 0,
        purpOrgCode: 0,
        correlationaNo: 0,
        origBoxFlag: 0,
        specialFlag: 0,
        companyCer: 0,
        userInfo: 0,
        inspDecElem: 0,
        domesticConsigneeEname: 0,
        overseasConsignorCname: 0,
        overseasConsignorAddr: 0,
        cmplDschrgDt: 0,
        promiseItem1: 0,
        promiseItem2: 0,
        promiseItem3: 0,
        chkPayment: 0,
        goodsNote: 0, // 商品备注
        purpose: 0, // 用途
        originRelation: 0, // 原产地对应关系
        // nameVo: 0, // 运输工具名称及航次号
        approveNo: 0, // 许可证/审批号
        voyageNo: 0,
        auditOpinion: '', // 审批意见
        docuAndcertCode: 0 // 随附单证及编号
      },
      declistCheckRec: [],
      headVisible: {},
      decHeadOhter: {
      },
      decCheckRec: {
      },
      errorColor: {
        'docuAndcertCode': false,
        'iEPort': false,
        'manualNo': false,
        'contrNo': false,
        'iEDate': false,
        'tradeCoScc': false,
        'overseasConsignorCode': false,
        'overseasConsigneeCode': false,
        'ownerCodeScc': false,
        'trafMode': false,
        'trafName': false,
        'billNo': false,
        'tradeMode': false,
        'cutMode': false,
        'licenseNo': false,
        'tradeCountry': false,
        'distinatePort': false,
        'transMode': false,
        'feeRate': false,
        'insurRate': false,
        'otherRate': false,
        'packNo': false,
        'wrapType': false,
        'grossWt': false,
        'netWt': false,
        'tradeAreaCode': false,
        'entyPortCode': false,
        'goodSplace': false,
        'despPortCode': false,
        'noteS': false

      }, // 检查时红色背景
      colorAndCheck: {
        // A: {check: 'B', color: 'C'}  A 表示 报关单的字段名  B 表示 审核的结果对应的字段 如iEPort = 1 C 表示报关单字段需要显示的颜色
        billNo: {check: 'billNo', color: 'billNo'}, // 提单号
        tradeCoScc: {check: 'tradeCoScc', color: 'tradeCoScc'}, // 境内收发货人统一社会代码
        tradeName: {check: 'tradeCoScc', color: 'tradeCoScc'}, // 境内收发货人名称
        iEPort: {check: 'iEPort', color: 'iEPort'}, // 进出境关别
        iEDate: {check: 'iEDate', color: 'iEDate'}, // 进出口日期
        dDate: {check: 'dDate', color: 'dDate'}, // 申报日期
        manualNo: {check: 'manualNo', color: 'manualNo'}, // 备案号
        contrNo: {check: 'contrNo', color: 'contrNo'}, // 合同协议号
        cutMode: {check: 'cutMode', color: 'cutMode'}, // 征免性质
        despPortCode: {check: 'despPortCode', color: 'despPortCode'}, // 启运港代码
        distinatePort: {check: 'distinatePort', color: 'distinatePort'}, // 经停港/指运港
        entyPortCode: {check: 'entyPortCode', color: 'entyPortCode'}, // 入境/离境口岸代码
        feeCurr: {check: 'feeRate', color: 'feeRate'}, // 运费币制
        feeMark: {check: 'feeRate', color: 'feeRate'}, // 运费类型
        feeRate: {check: 'feeRate', color: 'feeRate'}, // 运费
        goodSplace: {check: 'goodSplace', color: 'goodSplace'}, // 存放地点
        grossWt: {check: 'grossWt', color: 'grossWt'}, // 毛重
        insurCurr: {check: 'insurRate', color: 'insurRate'}, // 保费币制
        insurMark: {check: 'insurRate', color: 'insurRate'}, // 保费类型
        insurRate: {check: 'insurRate', color: 'insurRate'}, // 保费
        licenseNo: {check: 'licenseNo', color: 'licenseNo'}, // 许可证号
        markNo: {check: 'noteS', color: 'noteS'}, // 标记唛码
        netWt: {check: 'netWt', color: 'netWt'}, // 净重
        noteS: {check: 'noteS', color: 'noteS'}, // 备注
        otherCurr: {check: 'otherRate', color: 'otherRate'}, // 杂费币制
        otherMark: {check: 'otherRate', color: 'otherRate'}, // 杂费类型
        otherRate: {check: 'otherRate', color: 'otherRate'}, // 杂费
        // overseasConsigneeCname: {check: '', color: ''}, // 境外收货人名称(中文)
        overseasConsigneeEname: {check: 'overseasConsigneeCode', color: 'overseasConsigneeCode'},
        overseasConsignorCode: {check: 'overseasConsignorCode', color: 'overseasConsignorCode'}, // 境外发货人代码
        overseasConsignorEname: {check: 'overseasConsignorCode', color: 'overseasConsignorCode'}, // 境外发货人名称（外文）
        ownerCodeScc: {check: 'ownerCodeScc', color: 'ownerCodeScc'}, // 消费生产使用单位信用代码
        ownerName: {check: 'ownerCodeScc', color: 'ownerCodeScc'}, // 消费使用单位名称
        packNo: {check: 'packNo', color: 'packNo'}, // 件数
        // promiseItmes: {check: '', color: ''}, // 其他事项确认
        tradeAreaCode: {check: 'tradeAreaCode', color: 'tradeAreaCode'}, // 贸易国(地区)
        tradeCountry: {check: 'tradeCountry', color: 'tradeCountry'}, // 启运国（地区）/运抵国（地区）
        tradeMode: {check: 'tradeMode', color: 'tradeMode'}, // 监管方式
        trafMode: {check: 'trafMode', color: 'trafMode'}, // 运输方式代码
        trafName: {check: 'trafName', color: 'trafName'}, // 运输工具代码名称
        voyageNo: {check: 'trafName', color: 'trafName'}, // 航次号
        transMode: {check: 'transMode', color: 'transMode'}, // 成交方式
        wrapType: {check: 'wrapType', color: 'wrapType'} // 包装种类
      },
      decParam: {}, // 接收父组件的数据
      aiColors: ['dec-color-red', 'dec-color-yellow', 'dec-color-black'],
      headAiColor: {}
    }
  },
  created () {
    window.localStorage.setItem('FEE_RATE', JSON.stringify([{codeField: '1', nameField: '率'}, {codeField: '2', nameField: '单价'}, {codeField: '3', nameField: '总价'}]))
    window.localStorage.setItem('FEE_RATE_OHTER', JSON.stringify([{codeField: '1', nameField: '率'}, {codeField: '3', nameField: '总价'}]))
    window.localStorage.setItem('DEC_TYPE', JSON.stringify([{nameField: '有纸报关', codeField: '0'}, {nameField: '无纸带清单报关', codeField: 'D'}, {nameField: '有纸带清单报关', codeField: 'L'}, {nameField: '通关无纸化', codeField: 'M'}, {nameField: '无纸报关', codeField: 'W'}]))
    window.localStorage.setItem('BILL_TYPE', JSON.stringify([{nameField: '一般备案清单', codeField: '1'}, {nameField: '先进区、后报关', codeField: '2'}, {nameField: '3-集报备案清单', codeField: '3'}, {nameField: '两单一审备案清单', codeField: '4'}]))
    decBus.getBus(this.moduleName).$on('getHeadCompany', this.getHeadCompany)
    decBus.getBus(this.moduleName).$on('resetHeadData', this.resetHeadData)
    decBus.getBus(this.moduleName).$on('emsDataHeadBack', this.emsDataHeadBack)
    decBus.getBus(this.moduleName).$on('initdutyMode', this.initdutyMode)
    decBus.getBus(this.moduleName).$on('initHeadSelect', this.initHeadSelect)
    decBus.getBus(this.moduleName).$on('setHeadFieldToSate', this.setHeadFieldToSate)
    decBus.getBus(this.moduleName).$on('setHeadAiColor', this.setHeadAiColor)
    // this.headAiColor = businessUtil.generateDecAiHeadColor()
  },
  computed: {
    controller () {
      return this.$store.state[this.moduleName].controller
    },
    showFied () {
      return this.$store.state[this.moduleName].showFied
    },
    switch () {
      return this.$store.state[this.moduleName].switch
    },
    tipsNoteShow () {
      return this.$store.state[this.moduleName].tipsNoteShow
    },
    tipsNote () {
      return this.$store.state[this.moduleName].tipsNote
    },
    swtichCheck () {
      return this.$store.state[this.moduleName].swtichCheck
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    },
    goodsEnNameList () {
      return this.$store.state[this.moduleName].goodsEnNameList
    },
    enterpriseSelectObj () {
      return this.$store.state[this.moduleName].enterpriseSelectObj
    },
    saasEntQualifType () {
      return this.$store.state[this.moduleName].saasEntQualifType
    }
  },
  watch: {
    'decHead.ownerCode': 'backFillDistrictCode',
    'decHead': {
      handler (newName, oldName) {
        this.$store.commit(this.moduleName + '/changeDecPage', {key: 'decNet', value: this.decHead.netWt})
        if (this.controller.showCheckTips) { // 是否要显示审核结果
          for (let key in this.colorAndCheck) {
            let now = ''
            let orign = ''
            let field = ''
            let checkField = ''
            if (['tradeName', 'tradeCoScc'].includes(key)) {
              now = this.decHead.tradeName + '-' + this.decHead.tradeCoScc
              orign = this.decHeadOhter.tradeName + '-' + this.decHeadOhter.tradeCoScc
              field = this.colorAndCheck[key].color
              checkField = this.colorAndCheck[key].check
              if (now !== orign) {
                this.errorColor[field] = false
              } else if (this.headColor[checkField].toString() === '1') {
                this.errorColor[field] = true
              }
            } else if (['feeCurr', 'feeMark', 'feeRate'].includes(key)) {
              now = this.decHead.feeCurr + '-' + this.decHead.feeMark + '-' + this.decHead.feeRate
              orign = this.decHeadOhter.feeCurr + '-' + this.decHeadOhter.feeMark + '-' + this.decHeadOhter.feeRate
              field = this.colorAndCheck[key].color
              checkField = this.colorAndCheck[key].check
              if (now !== orign) {
                this.errorColor[field] = false
              } else if (this.headColor[checkField].toString() === '1') {
                this.errorColor[field] = true
              }
            } else if (['insurCurr', 'insurMark', 'insurRate'].includes(key)) {
              now = this.decHead.insurCurr + '-' + this.decHead.insurMark + '-' + this.decHead.insurRate
              orign = this.decHeadOhter.insurCurr + '-' + this.decHeadOhter.insurMark + '-' + this.decHeadOhter.insurRate
              field = this.colorAndCheck[key].color
              checkField = this.colorAndCheck[key].check
              if (now !== orign) {
                this.errorColor[field] = false
              } else if (this.headColor[checkField].toString() === '1') {
                this.errorColor[field] = true
              }
            } else if (['ownerCodeScc', 'ownerName'].includes(key)) {
              now = this.decHead.ownerCodeScc + '-' + this.decHead.ownerName
              orign = this.decHeadOhter.ownerCodeScc + '-' + this.decHeadOhter.ownerName
              field = this.colorAndCheck[key].color
              checkField = this.colorAndCheck[key].check
              if (now !== orign) {
                this.errorColor[field] = false
              } else if (this.headColor[checkField].toString() === '1') {
                this.errorColor[field] = true
              }
            } else if (['trafName', 'voyageNo'].includes(key)) {
              now = this.decHead.trafName + '-' + this.decHead.voyageNo
              orign = this.decHeadOhter.trafName + '-' + this.decHeadOhter.voyageNo
              field = this.colorAndCheck[key].color
              checkField = this.colorAndCheck[key].check
              if (now !== orign) {
                this.errorColor[field] = false
              } else if (this.headColor[checkField].toString() === '1') {
                this.errorColor[field] = true
              }
            } else if (this.decHead[key] !== this.decHeadOhter[key]) {
              let field = this.colorAndCheck[key].color
              this.errorColor[field] = false
            } else {
              checkField = this.colorAndCheck[key].check
              if (this.headColor[checkField].toString() === '1') {
                let fields = this.colorAndCheck[key].color
                this.errorColor[fields] = true
              }
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    focusCustomMaster () {
      this.$nextTick(_ => {
        this.$refs['customMaster'].focus()
      })
    },
    initbilltype () {
      this.initHeadSingleSeLect('billtype', '1', {
        obj: 'billType',
        params: 'BILL_TYPE'
      })
    },
    // 打开检验检验签证申报要素 弹出框
    openDecElementsContent () {
      // 初始化数据
      this.initCiqElements = {
        decRequestCerts: this.decHead.decRequestCerts,
        cmplDschrgDt: this.decHead.cmplDschrgDt, // 卸毕日期
        domesticConsigneeEname: this.decHead.domesticConsigneeEname, // 境内收发货人名称(外文)
        overseasConsignorCname: this.decHead.overseasConsignorCname, // 境外收发货人名称(中文)
        overseasConsignorAddr: this.decHead.overseasConsignorAddr, // 境外发货人地址
        gEnName: this.decHead.gEnName // 商品英文名称
      }
      this.decElementsVisible = true
    },
    // 接收回参
    backCiqElements (param) {
      if (param) {
        this.appCertName = param.appCertName
        if (param.decRequestCerts) {
          this.decHead.decRequestCerts = util.simpleClone(param.decRequestCerts)
        }
        if (param.headVo) {
          this.decHead.cmplDschrgDt = param.headVo.cmplDschrgDt // 卸毕日期
          this.decHead.domesticConsigneeEname = param.headVo.domesticConsigneeEname // 境内收发货人名称(外文)
          this.decHead.overseasConsignorCname = param.headVo.overseasConsignorCname // 境外收发货人名称(中文)
          this.decHead.overseasConsignorAddr = param.headVo.overseasConsignorAddr // 境外发货人地址
          this.decHead.gEnName = param.headVo.gEnName
        }
      }
      this.decElementsVisible = false
      decBus.getBus(this.moduleName).$emit('focusDecList', null)
    },
    checkHeadValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      if (rule.field === 'packNo') {
        let _value = +value
        let name = rule.field
        let reg = new RegExp(this.ruleRegx[name])
        if (!reg.test(value) || (value !== '' && _value.toString() !== value)) {
          setTimeout(() => {
            this.$refs['headRuleForm'].clearValidate([name])
          }, 2000)
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else if (['feeRate', 'insur'].includes(rule.field)) {
        let _value = +value
        let name = rule.field
        let reg = new RegExp(this.ruleRegx[name])
        if (!reg.test(value)) {
          if (_value >= 0.0001 && _value <= 99) {
            callback()
          } else {
            setTimeout(() => {
              this.$refs['headRuleForm'].clearValidate([name])
            }, 2000)
            callback(new Error(rule.message))
          }
        } else {
          callback()
        }
      } else if (rule.field === 'other') {
        let _value = +value
        let name = rule.field
        let reg = new RegExp(this.ruleRegx[name])
        if (!reg.test(value)) {
          if ((_value >= 0.0001 && _value <= 99) || (_value >= -99 && _value <= -0.0001)) {
            callback()
          } else {
            setTimeout(() => {
              this.$refs['headRuleForm'].clearValidate([name])
            }, 2000)
            callback(new Error(rule.message))
          }
        } else {
          callback()
        }
      } else {
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
    // 校验
    checkFateValid (rule, value, callback) {
      let name = rule.field
      if (util.isEmpty(value)) {
        value = ''
      }
      let reg = new RegExp(this.ruleRegx[name])
      // let flag = reg.test(value)
      // if (Math.abs(parseFloat(value)) > 99) {
      //   flag = false
      // }
      // let obj = this.$refs[name]
      // if (!flag) {
      //   setTimeout(function () {
      //     obj.clearValidate()
      //   }, 2000)
      //   callback(new Error(rule.message))
      // } else {
      //   callback()
      // }
      let _value = ''
      if (['feeRate', 'insurRate'].includes(rule.field)) {
        if (reg.test(value)) {
          _value = parseFloat(value)
          if ((_value >= 0.0001 && _value <= 99) || value === '') {
            callback()
          } else {
            setTimeout(() => {
              this.$refs['headRuleForm'].clearValidate([name])
            }, 2000)
            callback(new Error(rule.message))
          }
        } else {
          setTimeout(() => {
            this.$refs['headRuleForm'].clearValidate([name])
          }, 2000)
          callback(new Error(rule.message))
        }
      } else if (rule.field === 'otherRate') {
        if (reg.test(value)) {
          _value = parseFloat(value)
          if ((_value >= 0.0001 && _value <= 99) || (_value >= -99 && _value <= -0.0001) || value === '') {
            callback()
          } else {
            setTimeout(() => {
              this.$refs['headRuleForm'].clearValidate([name])
            }, 2000)
            callback(new Error(rule.message))
          }
        } else {
          setTimeout(() => {
            this.$refs['headRuleForm'].clearValidate([name])
          }, 2000)
          callback(new Error(rule.message))
        }
      }
    },
    // 保存报关单
    saveDecHeadFieldVerify () {
      let result = true
      // 校验
      this.$refs['headRuleForm'].validate((valid) => {
        if (valid === false) {
          this.isShowText1 = 'fa fa-angle-double-down'
          this.isShow1 = true
          result = false
        }
      })
      return result
    },
    // 报关单暂存表头校验
    verifyDecHeadBeforeSave () {
      let messageTips = []
      let mesLen
      let _tradeMode = this.decHead.tradeMode // 监管方式
      let _cutMode = this.decHead.cutMode // 征免性质
      let _manualNo = this.decHead.manualNo // 备案号
      let net = +this.decHead.netWt
      let gross = +this.decHead.grossWt
      if (net && gross && (net > gross)) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '净重需要小于或等于毛重')
      }
      // 校验 包装种类为散装或裸装，则件数栏一定填写1
      if (['00', '01'].includes(this.decHead.wrapType) && this.decHead.packNo !== '1') {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '包装种类为散装或裸装，则件数栏一定填写1')
      }
      // 出口报关单监管方式为来料加工时提示备注栏需要填写加工费
      if (this.controller.iEFlag === 'E' && _tradeMode === '0214' && util.isEmpty(this.decHead.noteS)) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '备注需要填写加工费')
      }
      // 保险费率不是0.3时进行提示
      if (this.decHead.insurMark === '1' && decUtil.removeZero(this.decHead.insurRate) !== 0.3) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '当保险费为费率时,费率一般为0.3')
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
      if (this.controller.funFlag === 'recordList' && this.decHead.billtype === '4' && util.isEmpty(this.decHead.relId)) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '两单一审备案清单需要填写关联报关单')
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
      let transModeFlag = false
      let transModeTips = ''
      if (this.controller.iEFlag === 'I') {
        if (this.decHead.transMode === '3') {
          if (util.isEmpty(this.decHead.feeMark) || util.isEmpty(this.decHead.insurMark)) { // 运费 保费
            transModeFlag = true
            transModeTips = '进口FOB，需要填写运、保费'
          } else {
            if ((this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) || (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate))) {
              transModeFlag = true
              transModeTips = '进口FOB，需要填写运、保费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeCurr))) {
              transModeFlag = true
              transModeTips = '进口FOB，需要填写运、保费'
            }
            if (this.decHead.insurMark !== '1' && (util.isEmpty(this.decHead.insurRate) || util.isEmpty(this.decHead.insurCurr))) {
              transModeFlag = true
              transModeTips = '进口FOB，需要填写运、保费'
            }
          }
        } else if (this.decHead.transMode === '2') {
          if (util.isEmpty(this.decHead.insurMark)) { // 保费
            transModeFlag = true
            transModeTips = '进口C&F，需要填写保险费'
          } else {
            if (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate)) {
              transModeFlag = true
              transModeTips = '进口C&F，需要填写保险费'
            }
            if (this.decHead.insurMark !== '1' && (util.isEmpty(this.decHead.insurRate) || util.isEmpty(this.decHead.insurCurr))) {
              transModeFlag = true
              transModeTips = '进口C&F，需要填写保险费'
            }
          }
        } else if (this.decHead.transMode === '4') {
          if (util.isEmpty(this.decHead.feeMark)) { // 运费
            transModeFlag = true
            transModeTips = '进口C&I，需要填写运费'
          } else {
            if (this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) {
              transModeFlag = true
              transModeTips = '进口C&I，需要填写运费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeCurr))) {
              transModeFlag = true
              transModeTips = '进口C&I，需要填写运费'
            }
          }
        } else if (this.decHead.transMode === '7') {
          if (util.isEmpty(this.decHead.feeMark) || util.isEmpty(this.decHead.insurMark)) { // 运费 保费
            transModeFlag = true
            transModeTips = '进口EXW，需要填写运、保费'
          } else {
            if ((this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) || (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate))) {
              transModeFlag = true
              transModeTips = '进口EXW，需要填写运、保费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeCurr))) {
              transModeFlag = true
              transModeTips = '进口EXW，需要填写运、保费'
            }
            if (this.decHead.insurMark !== '1' && (util.isEmpty(this.decHead.insurRate) || util.isEmpty(this.decHead.insurCurr))) {
              transModeFlag = true
              transModeTips = '进口EXW，需要填写运、保费'
            }
          }
        }
      } else {
        if (this.decHead.transMode === '1') {
          if (util.isEmpty(this.decHead.feeMark) || util.isEmpty(this.decHead.insurMark)) { // 运费 保费
            transModeFlag = true
            transModeTips = '出口CIF，需要填写运、保费'
          } else {
            if ((this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) || (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate))) {
              transModeFlag = true
              transModeTips = '出口CIF，需要填写运、保费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeCurr))) {
              transModeFlag = true
              transModeTips = '出口CIF，需要填写运、保费'
            }
            if (this.decHead.insurMark !== '1' && (util.isEmpty(this.decHead.insurRate) || util.isEmpty(this.decHead.insurCurr))) {
              transModeFlag = true
              transModeTips = '出口CIF，需要填写运、保费'
            }
          }
        } else if (this.decHead.transMode === '2') {
          if (util.isEmpty(this.decHead.feeMark)) { // 运费
            transModeFlag = true
            transModeTips = '出口C&F，需要填写运费'
          } else {
            if (this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) {
              transModeFlag = true
              transModeTips = '出口C&F，需要填写运费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeCurr))) {
              transModeFlag = true
              transModeTips = '出口C&F，需要填写运费'
            }
          }
        } else if (this.decHead.transMode === '4') {
          if (util.isEmpty(this.decHead.insurMark)) { // 保费
            transModeFlag = true
            transModeTips = '出口C&I，需要填写保险费'
          } else {
            if (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate)) {
              transModeFlag = true
              transModeTips = '出口C&I，需要填写保险费'
            }
            if (this.decHead.insurMark !== '1' && (util.isEmpty(this.decHead.insurRate) || util.isEmpty(this.decHead.insurCurr))) {
              transModeFlag = true
              transModeTips = '出口C&I，需要填写保险费'
            }
          }
        } else if (this.decHead.transMode === '7') {
          if (util.isEmpty(this.decHead.feeMark)) { // 运费
            transModeFlag = true
            transModeTips = '出口EXW，需要填写运费'
          } else {
            if (this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) {
              transModeFlag = true
              transModeTips = '出口EXW，需要填写运费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeCurr))) {
              transModeFlag = true
              transModeTips = '出口EXW，需要填写运费'
            }
          }
        }
      }
      if (transModeFlag) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + transModeTips)
      }
      // 出口报关单监管方式为0654-进料深加工、1427-出料加工 、0657-进料余料结转时，最终目的国和运抵国为中国。
      if (this.controller.iEFlag === 'E' && this.switch['logic_prosecution_part'] === 'Y' && ['0654', '1427', '0657'].includes(this.decHead.tradeMode)) {
        if (this.switch['CA000003'] === 'Y' && this.decHead.tradeMode === '0654' && this.decHead.tradeCountry !== 'CHN') {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '出口监管方式为进料深加工,运抵国应为中国')
        }
        if (this.switch['CA000004'] === 'Y' && this.decHead.tradeMode === '1427' && this.decHead.tradeCountry !== 'CHN') {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '出口监管方式为出料加工,运抵国应为中国')
        }
        if (this.switch['CA000005'] === 'Y' && this.decHead.tradeMode === '0657' && this.decHead.tradeCountry !== 'CHN') {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '出口监管方式为进料余料结转,运抵国应为中国')
        }
      }
      // 校验 备案号
      if (!util.isEmpty(_tradeMode) && !util.isEmpty(_manualNo) && this.switch['logic_prosecution_cert'] === 'Y') {
        if (this.controller.iEFlag === 'I') {
          for (let key in this.importRules) {
            let codes = key.split('_')
            let code = codes[0]
            let currentTradeMode = codes[1].toString()
            let currentCutMode = codes[2].toString()
            let indexes = codes[3].split('$')
            if (this.switch[code] === 'Y') {
              if (_tradeMode === currentTradeMode) {
                if ((currentCutMode === '0') || (currentCutMode !== '0' && _cutMode === currentCutMode)) {
                  if (!indexes.includes(_manualNo.charAt(0).toUpperCase())) {
                    mesLen = messageTips.length + 1
                    messageTips.push(mesLen + '.' + this.importRules[key])
                  }
                }
              }
            }
          }
          if (this.switch['CR000032'] === 'Y' && _tradeMode === '5300') {
            if (_manualNo.charAt(0).toUpperCase() !== 'H' || _manualNo.charAt(5).toUpperCase() !== 'D') {
              mesLen = messageTips.length + 1
              messageTips.push(mesLen + '.' + '进口,监管方式为设备进出区时,备案号首字母为H，第六位为D')
            }
          }
          if (this.switch['CR000033'] === 'Y' && _tradeMode === '5335') {
            if (_manualNo.charAt(0).toUpperCase() !== 'H' || _manualNo.charAt(5).toUpperCase() !== 'D') {
              mesLen = messageTips.length + 1
              messageTips.push(mesLen + '.' + '进口,监管方式为境外设备进区时,备案号首字母为H，第六位为D')
            }
          }
        }
        if (this.controller.iEFlag === 'E') {
          for (let key in this.exportRules) {
            let codes = key.split('_')
            let code = codes[0]
            let currentTradeMode = codes[1].toString()
            let currentCutMode = codes[2].toString()
            let indexes = codes[3].split('$')
            if (this.switch[code] === 'Y') {
              if (_tradeMode === currentTradeMode) {
                if ((currentCutMode === '0') || (currentCutMode !== '0' && _cutMode === currentCutMode)) {
                  if (!indexes.includes(_manualNo.charAt(0).toUpperCase())) {
                    mesLen = messageTips.length + 1
                    messageTips.push(mesLen + '.' + this.exportRules[key])
                  }
                }
              }
            }
          }
          if (this.switch['CR000048'] === 'Y' && _tradeMode === '5300') {
            if (_manualNo.charAt(0).toUpperCase() !== 'H' || _manualNo.charAt(5).toUpperCase() !== 'D') {
              mesLen = messageTips.length + 1
              messageTips.push(mesLen + '.' + '出口,监管方式为设备进出区时,备案号首字母为H，第六位为D')
            }
          }
          if (this.switch['CR000049'] === 'Y' && _tradeMode === '5361') {
            if (_manualNo.charAt(0).toUpperCase() !== 'H' || _manualNo.charAt(5).toUpperCase() !== 'D') {
              mesLen = messageTips.length + 1
              messageTips.push(mesLen + '.' + '出口,监管方式为区内设备退运时,备案号首字母为H，第六位为D')
            }
          }
        }
      }
      // 校验征免性质
      if (!util.isEmpty(_tradeMode) && util.isEmpty(_manualNo) && !util.isEmpty(_cutMode) && this.switch['logic_prosecution_duty_prop'] === 'Y') {
        let rules = this.controller.iEFlag === 'I' ? this.custImportRules : this.custExportRules
        for (let key in rules) {
          let codes = key.split('_')
          let code = codes[0]
          let currentTradeMode = codes[1].toString()
          let currentCutMode = codes[2].toString()
          if (this.switch[code] === 'Y') {
            if (_tradeMode === currentTradeMode) {
              if (_cutMode !== currentCutMode) {
                mesLen = messageTips.length + 1
                messageTips.push(mesLen + '.' + rules[key])
              }
            }
          }
        }
        let _tradeCode = this.decHead.tradeCode
        if (this.controller.iEFlag === 'E' && !util.isEmpty(_tradeCode) && _tradeMode === '0110') {
          if (this.switch['DP000007'] === 'Y' && ['1', '5', '6'].includes(_tradeCode.charAt(5)) && _cutMode !== '101') {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为一般贸易,境内收发货人10位海关编码第6位为1,5,6时,征免性质应为一般征税')
          }
          if (this.switch['DP000008'] === 'Y' && ['2'].includes(_tradeCode.charAt(5)) && _cutMode !== '602') {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为一般贸易,境内收发货人10位海关编码第6位为2时,征免性质应为中外合作')
          }
          if (this.switch['DP000009'] === 'Y' && ['3'].includes(_tradeCode.charAt(5)) && _cutMode !== '601') {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为一般贸易,境内收发货人10位海关编码第6位为3时,征免性质应为中外合资')
          }
          if (this.switch['DP000010'] === 'Y' && ['4'].includes(_tradeCode.charAt(5)) && _cutMode !== '603') {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为一般贸易,境内收发货人10位海关编码第6位为4时,征免性质应为外资企业')
          }
        }
      }
      return messageTips
    },
    sendDecReq (operType, param) {
      this.$post({
        url: 'API@/dec-common/dec/common/saveCommonDec',
        data: param,
        success: (res) => {
          if (this.decHead.decPid === '') {
            this.decHead.decPid = res.result[0].decPid
            this.controller.pid = res.result[0].decPid
            this.decHead.status = res.result[0].status
            this.decHead.statusValue = res.result[0].statusValue
          }
          if (!util.isEmpty(this.decHead.bossId)) {
            if (this.swtichCheck === 'Y' && this.decHead.isExamine !== '6') { // 需要审核
              let message = ''
              if (operType === 'G') {
                message = '数据没有通过审核,不能发送'
              } else {
                message = '数据没有通过审核,不能申报'
              }
              this.messageTips(message)
              return false
            }
          }
          // 暂存成功后 申报 先校验能不能申报
          this.$post({
            url: 'API@/dec-common/dec/common/declareDec',
            data: {
              'seqNos': [this.decHead.decPid],
              'operType': operType
            },
            success: (res) => {
              this.messageTips(res.message, 'success')
              this.decHead.status = res.result.status
              this.decHead.statusValue = res.result.statusValue
              this.controller.isDisabled = true
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
        }
      })
    },
    sendDec (operType, param) {
      param['decHeadVO'] = this.decHead
      if (operType === 'G') {
        param['sendFlag'] = true
      }
      this.decParam = param
      // 获取报价并进行对照
      let priceData = {
        dclPlcCuscd: this.decHead.customMaster,
        impexpPortcd: this.decHead.iEPort,
        // tradeCode: this.decHead.tradeCode,
        tradeCoScc: this.decHead.tradeCoScc,
        innerNo: this.$route.query.priceInnerNo || '',
        iEFlag: this.decHead.iEFlag
      }
      if (this.controller.isSummary || this.controller.isWholeDec) { // 概要申报，完整申报
        this.sendDecReq(operType, param)
      } else {
        if (!util.isEmpty(this.decHead.customMaster) && !util.isEmpty(this.decHead.iEPort) && !util.isEmpty(this.decHead.tradeCoScc)) {
          this.priceRemind(priceData, operType, param)
        } else {
          this.sendDecReq(operType, param)
        }
      }
    },
    // 报价提醒
    priceRemind (data, operType, param) {
      this.$post({
        url: 'API@/saas-finance/quotation/decQuotationRemind',
        data: data,
        success: (res) => {
          this.operType = operType
          if (!util.isEmpty(res.result)) {
            if (res.result.length > 1) {
              this.priceList = res.result
              this.prcVisible = true
            } else if (res.result.length === 1) {
              param.decHeadVO['expenseId'] = res.result[0].quotationId
              this.sendDecReq(operType, param)
            } else {
              this.sendDecReq(operType, param)
            }
          }
        }
      })
    },
    prcRemindData (param) {
      let prcData = util.simpleClone(param)
      this.decHead['expenseId'] = prcData.radioCheck
      this.sendDecReq(prcData.operType, this.decParam)
    },
    // 备案号的输入事件
    manualNoChange (val) {
      this.isManualNoChange = true
      if (!val) decBus.getBus(this.moduleName).$emit('delelteManualNo', null) // 备案号为空 表体备案序号置灰
    },
    // 报关单类型 值改变事件
    entryTypeChange (value) {
      if (value === 'M') {
        this.controller.accDocDisabled = false
      } else {
        this.controller.accDocDisabled = true
      }
    },
    // 启运日期的change事件 如果 启运日期为null 则 赋值为空
    despDateChange () {
      if (util.isEmpty(this.decHead.despDate)) {
        this.decHead.despDate = ''
      }
    },
    despDateBlur () {
      this.$nextTick(() => {
        this.$refs['blno'].focus()
      })
    },
    // 查询H账册的数据
    queryBookHead () {
      // 当值没有发生变化时
      if (!this.isManualNoChange) {
        return false
      }
      if (!this.controller.isWholeDec) {
        decBus.getBus(this.moduleName).$emit('HBookClearBody', null)
      }
      this.isManualNoChange = false
      if (util.isEmpty(this.decHead.manualNo)) {
        // 如果变化后 备案号为空，则需要清除表体数据
        decBus.getBus(this.moduleName).$emit('delelteManualNo', null)
        return false
      }
      if (!(/^[^\u4e00-\u9fa5]{12}$/.test(this.decHead.manualNo))) {
        return false
      }
      let char = this.decHead.manualNo.charAt(0).toUpperCase()
      if (!['B', 'C', 'D', 'E', 'F', 'L', 'H', 'Z', 'T'].includes(char)) {
        this.messageTips('备案号:' + this.decHead.manualNo + '不存在', 'error')
        decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
          'importIsDisabled': false,
          'refreshIsDisabled': false,
          'insertIsDisabled': false,
          'reClassifyIsDisabled': false,
          'contrItemDisabled': false
        })
        return false
      }
      if (char === 'Z') { // 免表操作
        this.$post({
          url: 'API@/dec-common//dec/common/getZEmsInfo',
          data: {
            emsNo: this.decHead.manualNo,
            iEFlag: this.controller.iEFlag
          },
          success: (res) => {
            if (res.result && res.result.head) { // 查询成功口
              // 反填表头信息到报关单表头
              let head = res.result.head
              let body = res.result.body
              if (!this.controller.isWholeDec) {
                this.decHead.tradeCode = head.tradeCode
                this.decHead.tradeName = head.tradeName
                this.decHead.tradeCoScc = head.tradeCodeScc
              }
              if (!(this.controller.isWholeDec && this.controller.isDocument)) {
                this.decHead.ownerCode = head.ownerCode
                this.decHead.ownerCodeScc = head.ownerCodeScc // 生产/消费使用单位18位信用代码
                this.decHead.ownerName = head.ownerName
              }
              this.decHead.contrNo = head.contrNo // 合同号
              this.controller.districtCode = head.districtCode
              if (!util.isEmpty(head.cutMode)) { // 征免性质
                this.initHeadSingleSeLect('cutMode', head.cutMode, {
                  obj: 'saasLevytype',
                  params: 'SAAS_LEVYTYPE'
                })
              }
              // 设置免表列表的参数 并打开免表弹窗
              decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
                'importIsDisabled': true,
                'refreshIsDisabled': true,
                'insertIsDisabled': true,
                'reClassifyIsDisabled': true
              })
              if (body.length > 0) {
                // 导入 新增 插入 重新归类不能操作
                this.zBookList = body
                this.ZBookVisabled = true
              }
            } else {
              this.messageTips('备案号:' + this.decHead.manualNo + '不存在')
              // 放开 商品列表里的备案序号
              decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
                'contrItemDisabled': false
              })
            }
          },
          other: (eror) => {
            this.messageTips('备案号:' + this.decHead.manualNo + '不存在')
            // 放开 商品列表里的备案序号
            decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
              'contrItemDisabled': false
            })
          }
        })
      } else {
        this.$post({
          url: 'API@/dec-common/dec/common/getRelatedCurEms',
          data: {
            emsNo: this.decHead.manualNo,
            iEFlag: this.controller.iEFlag
          },
          success: (res) => {
            if (res.result) { // 查询成功口
              // 反填表头信息到报关单表头
              let head = res.result
              if (!this.controller.isWholeDec) {
                this.decHead.tradeCode = head.tradeCode
                this.decHead.tradeName = head.tradeName
                this.decHead.tradeCoScc = head.tradeCodeScc
              }
              if (!(this.controller.isWholeDec && this.controller.isDocument)) {
                this.decHead.ownerCode = head.ownerCode
                this.decHead.ownerCodeScc = head.ownerCodeScc // 生产/消费使用单位18位信用代码
                this.decHead.ownerName = head.ownerName
              }
              if (['B', 'C', 'D', 'H'].includes(char)) {
                if (!this.controller.isWholeDec) {
                  if (!util.isEmpty(head.tradeMode)) { // 监管方式
                    this.initHeadSingleSeLect('tradeMode', head.tradeMode, {
                      obj: 'saasTrade',
                      params: 'SAAS_TRADE'
                    })
                  }
                }
                if (!util.isEmpty(head.cutMode)) { // 征免性质
                  this.initHeadSingleSeLect('cutMode', head.cutMode, {
                    obj: 'saasLevytype',
                    params: 'SAAS_LEVYTYPE'
                  })
                }
              } else if (char === 'E') {
                this.controller.districtCode = head.districtCode // 境内目的地或者境内货源地
              }
            } else {
              this.messageTips('备案号:' + this.decHead.manualNo + '不存在')
            }
            // 导入 新增 插入 重新归类不能操作
            decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
              'importIsDisabled': false,
              'refreshIsDisabled': false,
              'insertIsDisabled': false,
              'reClassifyIsDisabled': false,
              'contrItemDisabled': false,
              'gUnitReadonly': false
            })
          },
          other: (res) => {
            this.messageTips(res.message)
            // 导入 新增 插入 重新归类不能操作
            decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
              'importIsDisabled': false,
              'refreshIsDisabled': false,
              'insertIsDisabled': false,
              'reClassifyIsDisabled': false,
              'contrItemDisabled': false,
              'gUnitReadonly': false
            })
          }
        })
      }
    },
    // 进出境关别 变化
    iEPortChange (value) {
      if (util.isEmpty(value)) {
        return
      }
      this.$post({
        url: 'API@/dec-common/decParam/common/getDecTrafList',
        data: {'iEPort': value},
        success: (res) => {
          // 完整申报不能修改运输方式
          if (res.result && res.result.length > 0 && !this.controller.isWholeDec) {
            this.decHead.trafMode = res.result[0].trafMode // 运输方式
            this.initHeadSingleSeLect('entyPortCode', res.result[0].entyPortCode, {
              obj: 'saasInlandPort',
              params: 'SAAS_INLAND_PORT'
            })
            this.initHeadSingleSeLect('trafMode', res.result[0].trafMode, {
              obj: 'saasTransportType',
              params: 'SAAS_TRANSPORT_TYPE'
            })
          }
        }
      })
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
        isLoad: false,
        success: (res) => {
          if (res.result && res.result.sccCode) {
            if (value === 'tradeCoScc' || value === 'tradeName' || value === 'tradeCode') {
              this.decHead.tradeCoScc = res.result.sccCode
              this.decHead.tradeName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              if (util.isEmpty(res.result.tradeCodeExt)) {
                this.decHead.tradeCode = res.result.regCusCode
              }
              if (util.isEmpty(res.result.ciqCodeExt)) {
                this.decHead.consigneeCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
              }
              this.tradeCorpId = res.result.corpId
              if (util.isEmpty(this.decHead.ownerCodeScc)) {
                if (util.isEmpty(res.result.tradeCodeExt)) {
                  this.decHead.ownerCode = res.result.regCusCode
                }
                if (util.isEmpty(res.result.ciqCodeExt)) {
                  this.decHead.ownerCiqCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                }
                // 自动带出一样的
                this.decHead.ownerCodeScc = res.result.sccCode
                this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.ownerCorpId = res.result.corpId
                this.backFillDistrictCode()
              }
            } else if (value === 'agentCodeScc' || value === 'agentCode' || value === 'agentName') {
              this.decHead.agentCodeScc = res.result.sccCode
              this.decHead.agentName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              if (util.isEmpty(res.result.tradeCodeExt)) {
                this.decHead.agentCode = res.result.regCusCode
              }
              if (util.isEmpty(res.result.ciqCodeExt)) {
                this.decHead.declRegNo = res.result.regCiqCode === null ? '' : res.result.regCiqCode
              }
              this.agentCorpId = res.result.corpId
            } else {
              this.decHead.ownerCodeScc = res.result.sccCode
              this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              if (util.isEmpty(res.result.tradeCodeExt)) {
                this.decHead.ownerCode = res.result.regCusCode
              }
              if (util.isEmpty(res.result.ciqCodeExt)) {
                this.decHead.ownerCiqCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
              }
              this.ownerCorpId = res.result.corpId
              this.backFillDistrictCode()
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
    /**
     * 控制输入中英文字符长度，一个中文当做2个长度来控制
     * @param type form
     * @param inpt input 字段名
     * @param maxlen 最大长度
    */
    checklen (type, ipnut, maxlen) {
      decUtil.checklen(this, type, ipnut, maxlen)
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
          let back = []
          if (res.result && res.result.length > 0) {
            let json = JSON.stringify(res.result).replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          } else {
            cb(back)
          }
        }
      })
    },
    // 境外收发货人代码
    queryOverseas (queryString, cb) {
      if (queryString.length < 2) {
        let back = []
        cb(back)
        return
      }
      this.$post({
        url: 'API@/dec-common/fieldMemory/getOverseasConsignorCnameLst',
        data: {'value': queryString},
        success: (res) => {
          let back = []
          if (res.result && res.result.length > 0) {
            res.result.forEach((o) => {
              back.push({'label': o, 'value': o})
            })
          }
          cb(back)
        }
      })
    },
    goodSplaceSearch (queryString, cb) {
      if (queryString.length < 2) {
        let back = []
        cb(back)
        return
      }
      this.$post({
        url: 'API@/dec-common/fieldMemory/getGoodSpace',
        data: {'value': queryString},
        success: (res) => {
          let back = []
          if (res.result && res.result.length > 0) {
            res.result.forEach((o) => {
              back.push({'label': o, 'value': o})
            })
          }
          cb(back)
        }
      })
    },
    // 通过公司名称编码名称查询公司信息
    handleSelect (item, para, iEFlag) {
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
                this.decHead.consigneeCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                this.tradeCorpId = res.result.corpId
              } else if (para === '4') { // 申报单位
                this.decHead.agentCodeScc = res.result.sccCode
                this.decHead.agentCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.agentName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.decHead.declRegNo = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                this.agentCorpId = res.result.corpId
              } else if (para === '3') { // 生产消费使用单位
                this.decHead.ownerCodeScc = res.result.sccCode
                this.decHead.ownerCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.decHead.ownerCiqCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                this.ownerCorpId = res.result.corpId
                this.backFillDistrictCode()
              } else if (para === '2') {
                if (iEFlag === 'I') {
                  this.decHead.overseasConsignorCode = res.result.sccCode
                } else {
                  this.decHead.overseasConsigneeCode = res.result.sccCode
                }
              }
            }
          }
        })
      } else { // 如果企业海关编码或十八位社会信用代码或十位海关干编码存在
        if (para === '1') { // 境内收发货人
          this.decHead.tradeCoScc = item.sccCode // 社会信用代码
          this.decHead.tradeCode = item.tradeCode // 海关十位编码
          this.decHead.tradeName = item.cusCorpName // 赋值 企业海关名称
          this.tradeCorpId = item.corpId
          // if (!util.isEmpty(item.ciqCode)) { // 检验检疫十位编码
          this.decHead.consigneeCode = item.ciqCode
          // }
          if (util.isEmpty(this.decHead.ownerCodeScc)) {
            // 自动带出一样的
            this.decHead.ownerCodeScc = this.decHead.tradeCoScc
            this.decHead.ownerCode = this.decHead.tradeCode
            this.decHead.ownerName = this.decHead.tradeName
            this.ownerCorpId = item.corpId
            this.decHead.ownerCiqCode = this.decHead.consigneeCode
            this.backFillDistrictCode()
          }
          return
        }
        if (para === '2') { // 境外收发货人
          if (iEFlag === 'I') {
            this.decHead.overseasConsignorCode = item.sccCode
          } else {
            this.decHead.overseasConsigneeCode = item.sccCode
          }
          return
        }
        if (para === '3') { // 生产销售单位/消费使用单位
          this.decHead.ownerCodeScc = item.sccCode
          this.decHead.ownerCode = item.tradeCode
          this.decHead.ownerName = item.cusCorpName
          this.ownerCorpId = item.corpId
          // if (!util.isEmpty(item.ciqCode)) {
          this.decHead.ownerCiqCode = item.ciqCode
          // }
          // 根据生产消费使用单位 设置默认境内目的地代码或境内货源地代码
          this.backFillDistrictCode()
          return
        }
        if (para === '4') { // 申报单位
          this.decHead.agentCodeScc = item.sccCode // 社会信用代码
          this.decHead.agentCode = item.tradeCode // 十位海关编码
          this.decHead.agentName = item.cusCorpName
          this.agentCorpId = item.corpId
          // if (!util.isEmpty(item.ciqCode)) {
          this.decHead.declRegNo = item.ciqCode // 检验检疫代码
          // }
        }
      }
    },
    // 自动根据生产/消费使用单位的十位海关编码 反填境内目的地的目的地代码/货源地的货源地代码
    backFillDistrictCode () {
      if (this.decHead.ownerCode && this.decHead.ownerCode.length === 10) {
        let str = this.decHead.ownerCode.toString().substring(0, 5)
        decBus.getBus(this.moduleName).$emit('initBodySingleSeLect', 'districtCode', str, {obj: 'saasDistrictRel', params: 'SAAS_DISTRICT_REL'})
      }
    },
    // 通过公司社会信用代码或者海关编码查询公司在海关的备案信息
    refrshQueryInfo (type, iEFlag) {
      let param = {
        corpName: '',
        sccCode: '',
        tradeCode: '',
        corpId: ''
      }
      if (type === '1') { // 境内收发货人
        if (!util.isEmpty(this.decHead.tradeCoScc)) {
          param.sccCode = this.decHead.tradeCoScc
          param.corpId = this.tradeCorpId
        } else {
          if (!util.isEmpty(this.decHead.tradeCode)) {
            param.tradeCode = this.decHead.tradeCode
            param.corpId = this.tradeCorpId
          } else {
            return
          }
        }
      } else if (type === '2') { // 境外收发货人
        if (!util.isEmpty(this.decHead.overseasConsignorCode) && iEFlag === 'I') {
          param.sccCode = this.decHead.overseasConsignorCode
        } else if (!util.isEmpty(this.decHead.overseasConsigneeCode) && iEFlag === 'E') {
          param.sccCode = this.decHead.overseasConsigneeCode
        } else {
          return
        }
      } else if (type === '3') { // 生产销售单位
        if (!util.isEmpty(this.decHead.ownerCodeScc)) {
          param.sccCode = this.decHead.ownerCodeScc
          param.corpId = this.ownerCorpId
        } else {
          if (!util.isEmpty(this.decHead.ownerCode)) {
            param.tradeCode = this.decHead.ownerCode
            param.corpId = this.ownerCorpId
          } else {
            return
          }
        }
      } else if (type === '4') { // 申报单位
        if (!util.isEmpty(this.decHead.agentCodeScc)) {
          param.sccCode = this.decHead.agentCodeScc
          param.corpId = this.agentCorpId
        } else {
          if (!util.isEmpty(this.decHead.agentCode)) {
            param.tradeCode = this.decHead.agentCode
            param.corpId = this.agentCorpId
          } else {
            return
          }
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getCusCorpInf',
        data: param,
        success: (res) => {
          if (res.result) {
            if (type === '1') { // 境内收发货人
              this.decHead.tradeCoScc = res.result.sccCode
              this.decHead.tradeCode = res.result.regCusCode
              this.decHead.tradeName = res.result.cusNameSaic
              // if (!util.isEmpty(res.result.regCiqCode)) {
              this.decHead.consigneeCode = res.result.regCiqCode
              // }
              return
            }
            if (type === '2') { // 境外收发货人
              if (iEFlag === 'I') {
                this.decHead.overseasConsignorCode = res.result.sccCode
                this.decHead.overseasConsignorEname = res.result.cusNameSaic
              } else {
                this.decHead.overseasConsigneeCode = res.result.sccCode
                this.decHead.overseasConsigneeEname = res.result.cusNameSaic
              }
              return
            }
            if (type === '3') { // 生产销售单位
              this.decHead.ownerCodeScc = res.result.sccCode
              this.decHead.ownerCode = res.result.regCusCode
              this.decHead.ownerName = res.result.cusNameSaic
              // if (!util.isEmpty(res.result.regCiqCode)) {
              this.decHead.ownerCiqCode = res.result.regCiqCode
              // }
              return
            }
            if (type === '4') { // 申报单位
              this.decHead.agentCodeScc = res.result.sccCode
              this.decHead.agentCode = res.result.regCusCode
              this.decHead.agentName = res.result.cusNameSaic
              // if (!util.isEmpty(res.result.regCiqCode)) {
              this.decHead.declRegNo = res.result.regCiqCode
              // }
            }
          } else {
            this.messageTips(res.result)
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 出口报关单监管方式为0654-进料深加工、1427-出料加工 、0657-进料余料结转时，最终目的国和运抵国为中国。
    tradeModeChange (value) {
      if (['0654', '1427', '0657'].includes(value)) {
        // 最终目的国
        decBus.getBus(this.moduleName).$emit('initBodySingleSeLect', 'destinationCountry', 'CHN', {obj: 'saasCountry3', params: 'SAAS_COUNTRY'})
        // 运抵国
        this.initHeadSingleSeLect('tradeCountry', 'CHN', {
          obj: 'saasCountry1',
          params: 'SAAS_COUNTRY'
        })
      }
      let _cutMode = this.decHead.cutMode
      let _tradeMode = this.decHead.tradeMode
      let compareStr = this.controller.iEFlag + '_' + _tradeMode
      if (compareStr === 'E_0214') {
        this.$message({
          message: '备注栏需要填写加工费'
        })
      }
      if (this.cutModeParam[compareStr]) {
        this.initHeadSingleSeLect('cutMode', this.cutModeParam[compareStr], {obj: 'saasLevytype', params: 'SAAS_LEVYTYPE'})
      }
      _cutMode = this.decHead.cutMode
      let compareStr2 = this.controller.iEFlag + '_' + _tradeMode + '_' + _cutMode
      if (this.dutyModeParam[compareStr2]) {
        decBus.getBus(this.moduleName).$emit('initBodySingleSeLect', 'dutyMode', this.dutyModeParam[compareStr2], {obj: 'saasLevymode', params: 'SAAS_LEVYMODE'})
      }
      this.setCharterDis(value)
    },
    setCharterDis (value) {
      if (this.controller.iEFlag === 'I') {
        if (value === '9500') { // 进口报关单，监管方式9500，特许权按钮可用
          this.$store.commit(this.moduleName + '/changeDecPage', {key: 'charterDis', value: false})
        } else {
          this.$store.commit(this.moduleName + '/changeDecPage', {key: 'charterDis', value: true})
          this.decHead.decRoyaltyFeeVO = null
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
    // 征免性质 变化所带来的变化
    cutModeChange (value) {
      this.initdutyMode()
    },
    // 初始化征免方式
    initdutyMode () {
      let _cutMode = this.decHead.cutMode
      let _tradeMode = this.decHead.tradeMode
      if (_cutMode && _tradeMode) {
        let compareStr = this.controller.iEFlag + '_' + _tradeMode + '_' + _cutMode
        if (this.dutyModeParam[compareStr]) {
          decBus.getBus(this.moduleName).$emit('initBodySingleSeLect', 'dutyMode', this.dutyModeParam[compareStr], {obj: 'saasLevymode', params: 'SAAS_LEVYMODE'})
        }
      }
    },
    // 保费、运费、杂费的控制逻辑
    feeChange (value, key) {
      if (!this.feeSetting[key][value]) {
        value = 'default'
      }
      this.headController[key + 'CurrDisabled'] = this.feeSetting[key][value].currDisabled
      this.ruleRegx[key + 'Rate'] = this.feeSetting[key][value].ruleRegx
      this.headRuleForm[key + 'Rate'] = this.feeSetting[key][value].validateRule
      if (value === '1') {
        this.decHead[key + 'Curr'] = ''
        if (key === 'insur') {
          if (util.isEmpty(this.decHead.insurRate)) {
            this.decHead.insurRate = '0.3'
          }
        }
      }
    },
    // 成交方式的变化事件
    transModeChange (value, initParam = 'none') {
      if (this.controller.iEFlag === 'I') { // 进口
        if (value === '1') {
          this.headController.feeMarkDisabled = true
          this.headController.feeRateDisabled = true
          this.headController.feeCurrDisabled = true
          this.headController.insurMarkDisabled = true
          this.headController.insurRateDisabled = true
          this.headController.insurCurrDisabled = true
          if (initParam === 'init') {
            return
          }
          this.decHead.feeMark = ''
          this.decHead.feeRate = ''
          this.decHead.feeCurr = ''
          this.decHead.insurMark = ''
          this.decHead.insurRate = ''
          this.decHead.insurCurr = ''
        } else if (value === '2') {
          this.headController.feeMarkDisabled = true
          this.headController.feeRateDisabled = true
          this.headController.feeCurrDisabled = true
          this.headController.insurMarkDisabled = false
          this.headController.insurRateDisabled = false
          this.headController.insurCurrDisabled = false
          if (this.decHead.insurMark === '1') {
            this.headController.insurCurrDisabled = true
          }
          if (initParam === 'init') {
            return
          }
          this.decHead.feeMark = ''
          this.decHead.feeRate = ''
          this.decHead.feeCurr = ''
        } else if (value === '4') {
          this.headController.feeMarkDisabled = false
          this.headController.feeRateDisabled = false
          this.headController.feeCurrDisabled = false
          if (this.decHead.feeMark === '1') {
            this.headController.feeCurrDisabled = true
          }
          this.headController.insurMarkDisabled = true
          this.headController.insurRateDisabled = true
          this.headController.insurCurrDisabled = true
          if (initParam === 'init') {
            return
          }
          this.decHead.insurMark = ''
          this.decHead.insurRate = ''
          this.decHead.insurCurr = ''
        } else {
          this.headController.feeMarkDisabled = false
          this.headController.feeRateDisabled = false
          this.headController.feeCurrDisabled = false
          if (this.decHead.feeMark === '1') {
            this.headController.feeCurrDisabled = true
          }
          this.headController.insurMarkDisabled = false
          this.headController.insurRateDisabled = false
          this.headController.insurCurrDisabled = false
          if (this.decHead.insurMark === '1') {
            this.headController.insurCurrDisabled = true
          }
        }
      } else { // 出口
        if (value === '2') {
          this.headController.feeMarkDisabled = false
          this.headController.feeRateDisabled = false
          this.headController.feeCurrDisabled = false
          if (this.decHead.feeMark === '1') {
            this.headController.feeCurrDisabled = true
          }
          this.headController.insurMarkDisabled = true
          this.headController.insurRateDisabled = true
          this.headController.insurCurrDisabled = true
          if (initParam === 'init') {
            return
          }
          this.decHead.insurMark = ''
          this.decHead.insurRate = ''
          this.decHead.insurCurr = ''
        } else if (value === '3') {
          this.headController.feeMarkDisabled = true
          this.headController.feeRateDisabled = true
          this.headController.feeCurrDisabled = true
          this.headController.insurMarkDisabled = true
          this.headController.insurRateDisabled = true
          this.headController.insurCurrDisabled = true
          if (initParam === 'init') {
            return
          }
          this.decHead.feeMark = ''
          this.decHead.feeRate = ''
          this.decHead.feeCurr = ''
          this.decHead.insurMark = ''
          this.decHead.insurRate = ''
          this.decHead.insurCurr = ''
        } else if (value === '4') {
          this.headController.feeMarkDisabled = true
          this.headController.feeRateDisabled = true
          this.headController.feeCurrDisabled = true
          this.headController.insurMarkDisabled = false
          this.headController.insurRateDisabled = false
          this.headController.insurCurrDisabled = false
          if (this.decHead.insurMark === '1') {
            this.headController.insurCurrDisabled = true
          }
          if (initParam === 'init') {
            return
          }
          this.decHead.feeMark = ''
          this.decHead.feeRate = ''
          this.decHead.feeCurr = ''
        } else {
          this.headController.feeMarkDisabled = false
          this.headController.feeRateDisabled = false
          this.headController.feeCurrDisabled = false
          if (this.decHead.feeMark === '1') {
            this.headController.feeCurrDisabled = true
          }
          this.headController.insurMarkDisabled = false
          this.headController.insurRateDisabled = false
          this.headController.insurCurrDisabled = false
          if (this.decHead.insurMark === '1') {
            this.headController.insurCurrDisabled = true
          }
        }
      }
    },
    // 调用舱单数据
    queryMftData () {
      if (util.isEmpty(this.decHead.iEPort)) {
        if (this.controller.iEFlag === 'I') {
          this.messageTips('进境关别不能为空')
        } else {
          this.messageTips('出境关别不能为空')
        }
        return false
      }
      if (util.isEmpty(this.decHead.trafMode)) {
        this.messageTips('运输方式不能为空')
        return false
      }
      if (util.isEmpty(this.decHead.billNo)) {
        this.messageTips('提运单号不能为空')
        return false
      }
      let param
      if (this.decHead.trafMode === '2' || this.decHead.trafMode === '5') {
        param = {
          token: encodeURIComponent(window.localStorage.getItem('token')), // token
          'trafMode': this.decHead.trafMode, // 运输方式（请填写空运）
          'customMaster': this.decHead.iEPort, // 关区代码
          'iEFlag': this.controller.iEFlag, // 进出口标志 （I/E）
          'trafName': '', // 运输工具
          'voyageNo': '', // 航次号
          'billNos': '', // 总提运单号
          'billNo': this.decHead.billNo // 提运单号
        }
      } else {
        this.messageTips('暂支持水运和航空运输')
        return false
      }
      // 查数据
      this.$post({
        url: 'API@/dec-common/dec/common/searchShipBill',
        data: param,
        success: (res) => {
          let list = []
          if (!res.result && res.result.length === 0) {
            this.messageTips('未查到相关舱单信息')
          } else {
            let data = JSON.parse(res.result)
            for (let i in data) {
              list.push({
                'trafMode': data[i]['TRAF_MODE'], // 运输方式（请填写空运）
                'customMaster': data[i]['CUSTOM_MASTER'], // 关区代码
                'iEFlag': data[i]['I_E_FLAG'], // 进出口标志 （I/E）
                'trafName': data[i]['TRAF_NAME'], // 运输工具
                'voyageNo': data[i]['VOYAGE_NO'], // 航次号
                'billNos': data[i]['BILL_NOS'], // 总提运单号
                'billNo': data[i]['BILL_NO'], // 提运单号,
                'iEDate': data[i]['I_E_DATE'], // 提运单号,
                'packNo': data[i]['PACK_NO'], // 件数,
                'wt': data[i]['WT'], // 重量,
                'iFlag': data[i]['IFLAG'], //
                'status': data[i]['STATUS'], // 理货状态
                'eFlag': data[i]['EFLAG'] //
              })
            }
          }
          this.initMftBill = {
            trafName: this.decHead.trafName, // 运输工具名称
            voyageNo: this.decHead.voyageNo, // 航班\航次
            billNo: this.decHead.billNo, // 提运单号
            packNo: this.decHead.packNo, // 件数
            wt: this.decHead.grossWt, // 毛重
            customMaster: this.decHead.iEPort, // 关区代码
            iEFlag: this.controller.iEFlag
          }
          this.shippingList = list
          if (this.shippingList.length === 1) {
            this.openContainerInfo(this.shippingList, this.initMftBill)
          } else if (this.shippingList.length > 1) {
            this.mftBillVisible = true
          }
        },
        other: (res) => {
          this.messageTips(res.message)
        }
      })
    },
    changeIsShow1 () {
      if (this.isShow1 === true) {
        this.isShowText1 = 'fa fa-angle-double-right'
        this.isShow1 = false
      } else {
        this.isShowText1 = 'fa fa-angle-double-down'
        this.isShow1 = true
      }
    },
    // 计算备注 和标记唛码的长度
    computLength (value) {
      if (value === '1') { // 备注
        this.decHead.noteS = util.getFixlenOfString(this.decHead.noteS, 255)
        this.noteLenght = util.decGetlen(this.decHead.noteS)
      }
      if (value === '2') { // 标记唛码
        this.decHead.markNo = util.getFixlenOfString(this.decHead.markNo, 400)
        this.markNoLength = util.decGetlen(this.decHead.markNo)
      }
    },
    // 查看上一个企业资质
    lastStep () {
      // 1.确定给 显示 数组赋值
      this.decShowCopLimits = util.simpleClone(this.decHead.decCopLimits)
      if (!util.isEmpty(this.cropLimit.entQualiftypeCode)) {
        this.decShowCopLimits.push(this.cropLimit)
      }
      // 判断 数组是否有值
      if (this.decShowCopLimits.length === 0) {
        this.messageTips('没有可查看的数据')
        return
      }
      // 2.确定现在显示值的位置
      let index = this.decShowCopLimits.findIndex((v, i) => {
        return v.entQualiftypeCode === this.showFied.entQualifTypeCodeS
      })
      // 3.判断是否有上一步
      if (index === 0) {
        this.messageTips('已经是第一条数据')
        return
      }
      index--
      this.showFied.entQualifTypeCodeS = this.decShowCopLimits[index].entQualiftypeCode
      this.showFied.entQualifTypeCodeSName = this.decShowCopLimits[index].entQualiftypeName
    },
    // 查看下一个企业资质
    nextStep () {
      // 1.确定给 显示 数组赋值
      this.decShowCopLimits = util.simpleClone(this.decHead.decCopLimits)
      if (!util.isEmpty(this.cropLimit.entQualiftypeCode)) {
        this.decShowCopLimits.push(this.cropLimit)
      }
      // 判断 数组是否有值
      if (this.decShowCopLimits.length === 0) {
        this.messageTips('没有可查看的数据')
        return
      }
      // 2.确定现在显示值的位置
      let index = this.decShowCopLimits.findIndex((v, i) => {
        return v.entQualiftypeCode === this.showFied.entQualifTypeCodeS
      })
      // 3.判断是否有下一步
      let maxIndex = +this.decShowCopLimits.length - 1
      if (index === maxIndex) {
        this.messageTips('已经是最后一条数据')
        return
      }
      index++
      this.showFied.entQualifTypeCodeS = this.decShowCopLimits[index].entQualiftypeCode
      this.showFied.entQualifTypeCodeSName = this.decShowCopLimits[index].entQualiftypeName
    },
    // 阻止默认的keydown 触发按钮事件
    prevent (e) {
      decUtil.prevent(e)
    },
    /**
     * 初始化 下拉框
     * @param arr 定义的每个模块的数据
     * @param form 表单
     */
    initSelect (arr, form) {
      decUtil.initSelect(this, arr, form)
    },
    /**
     * 初始化 下拉框
     * @param arr 定义的每个模块的数据
     * @param form 表单
     */
    initHeadSelect () {
      decUtil.initSelect(this, this.headSelect, this.decHead)
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
    },
    popDataSet (value) {
      this.getTypeToHead(this.currentShowNoteField, this.currentShowField)
      if (this.headVisible[this.currentShowNoteField]) {
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
      if (this.headColor[value]) {
        this.popHandle(value)
      } else {
        this.popoverVisible = false
      }
      if (this.$route.query.aiType) {
        this.$emit('drawArea', {value: value})
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
          if (!util.isEmpty(this.headAiColor[ref])) {
            this.headAiColor[ref] = 2
          }
          return false
        } else {
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
          } else if (ref === 'markNo' && this.isShow1 === false) { // 标记唛码
            decBus.getBus(this.moduleName).$emit('focusDecList', null)
          } else if (ref === 'orgCode') {
            this.$refs['vsaOrgCode'].focus()
            this.$refs['vsaOrgCode'].$children[0].select()
          } else {
            next.focus()
            next.select()
          }
          // 回车后改变颜色改变字体颜色
          // 回车后改变颜色改变字体颜色
          if (!util.isEmpty(this.headAiColor[ref])) {
            this.headAiColor[ref] = 2
          }
        }
      } else {
        if (ref === 'origBoxFlag') { // 原箱运输
          this.openSpecialBusiContent()
        } else if (ref === 'correlationReasonFlag' && this.controller.iEFlag === 'E') {
          this.openSpecialBusiContent()
        }
      }
    },
    // 打开 业务事项 弹出框
    openBussiness () {
      let checkedList = []
      if (this.decHead.chkTax === '1') {
        checkedList.push('税单无纸化')
      }
      if (this.decHead.chkBond === '1') {
        checkedList.push('自主报税')
      }
      if (this.decHead.chkPayment === '1') {
        checkedList.push('自报自缴')
      }
      if (this.decHead.chkSurety === '1') {
        checkedList.push('担保验放')
      }
      if (this.decHead.chkOther === '1') {
        checkedList.push('水运中转')
      }
      this.checkList = checkedList
      this.businessVisible = true
    },
    // 业务事项回参
    saveBusiness (param) {
      param && (this.checkList = param.checkList)
      // 重置数据
      this.decHead.chkTax = '0'
      this.decHead.chkBond = '0'
      this.decHead.chkPayment = '0'
      this.decHead.chkSurety = '0'
      this.decHead.chkOther = '0'
      for (let i in this.checkList) {
        if (this.checkList[i] === '税单无纸化') {
          this.decHead.chkTax = '1'
        } else if (this.checkList[i] === '自主报税') {
          this.decHead.chkBond = '1'
        } else if (this.checkList[i] === '自报自缴') {
          this.decHead.chkPayment = '1'
        } else if (this.checkList[i] === '担保验放') {
          this.decHead.chkSurety = '1'
        } else if (this.checkList[i] === '水运中转') {
          this.decHead.chkOther = '1'
        }
      }
      this.businessVisible = false
    },
    // 打开备注输入框
    openNote (value) {
      if (value === '1') { // 备注
        this.noteValue = this.decHead.noteS
        this.noteType = 'note'
        this.noteTitle = '备注'
        this.decNotevisible = true
      }
      if (value === '2') { // 标记唛码
        this.noteValue = this.decHead.markNo
        this.noteType = 'markNo'
        this.noteTitle = '标记唛码'
        this.decNotevisible = true
      }
    },
    // 接收备注数据
    receptionNoteData (param) {
      if (param === null) {
        this.decNotevisible = false
        return
      }
      if (param.type === 'note') {
        this.decHead.noteS = param.note
        this.noteLenght = util.decGetlen(this.decHead.noteS)
        this.decNotevisible = false
      } else if (param.type === 'markNo') {
        this.decHead.markNo = param.note
        this.markNoLength = util.decGetlen(this.decHead.markNo)
        this.decNotevisible = false
        decBus.getBus(this.moduleName).$emit('focusDecList', null)
      }
    },
    // 打开 使用人 弹出框
    openDecUserContent () {
      this.userList = util.simpleClone(this.decHead.decDecUsers)
      this.decUserVisible = true
    },
    // 接收 使用人组件的数据
    saveDecUser (param) {
      this.decHead.decDecUsers = util.simpleClone(param.userList)
      this.decUserVisible = false
    },
    // 打开企业资质弹出框
    openEntQuaConent () {
      this.decCopLimits = util.simpleClone(this.decHead.decCopLimits)
      if (!util.isEmpty(this.cropLimit.entQualiftypeCode)) {
        this.copmpanyPromise = true
      } else {
        this.copmpanyPromise = false
      }
      this.entQuaVisible = true
    },
    receptionEntQuaData (param) {
      this.decHead.decCopLimits = util.simpleClone(param.decCopLimits)
      this.cropLimit = util.simpleClone(param.cropLimit)
      this.entQuaVisible = false
      this.setGoodsLimit()
    },
    // 重新赋值
    setGoodsLimit () {
      // 1.确定给 显示 数组赋值
      this.decShowCopLimits = util.simpleClone(this.decHead.decCopLimits)
      if (this.cropLimit.entQualiftypeCode) {
        this.decShowCopLimits.push(this.cropLimit)
      }
      // 判断 数组是否有值
      if (this.decShowCopLimits.length === 0) {
        this.showFied.entQualifTypeCodeS = ''
        this.showFied.entQualifTypeCodeSName = ''
        return
      }
      if (this.decShowCopLimits.length > 0) {
        this.showFied.entQualifTypeCodeS = this.decShowCopLimits[0].entQualiftypeCode
        this.showFied.entQualifTypeCodeSName = this.decShowCopLimits[0].entQualiftypeName
      }
    },
    // 打开其他确认事项 弹出框
    openOtherPriceFactor () {
      this.popoverVisible = false
      this.promiseItmes = this.decHead.promiseItmes
      if (this.controller.showCheckTips) {
        let promiseCheck = {
          promiseItem1: this.headColor.promiseItem1,
          promiseItem2: this.headColor.promiseItem2,
          promiseItem3: this.headColor.promiseItem3
        }
        let promiseTips = {
          promiseItem1Note: this.decCheckRec.promiseItem1Note ? this.decCheckRec.promiseItem1Note : [],
          promiseItem2Note: this.decCheckRec.promiseItem2Note ? this.decCheckRec.promiseItem2Note : [],
          promiseItem3Note: this.decCheckRec.promiseItem3Note ? this.decCheckRec.promiseItem3Note : []
        }
        this.otherPromiseCheckData = {
          promiseItmesOther: this.decHeadOhter.promiseItmes,
          promiseCheck: promiseCheck,
          showCheckTips: this.controller.showCheckTips,
          promiseTips: promiseTips
        }
      }
      this.otherPriceFactorVisible = true
    },
    // 其他确认事项 回参
    backOtherFactor (param) {
      if (param) {
        this.decHead.promiseItmes = util.simpleClone(param.promiseItmes)
      }
      this.otherPriceFactorVisible = false
      decBus.getBus(this.moduleName).$emit('focusContainerNo', null)
    },
    // 包装种类为散装或裸装，则件数栏一定填写1
    wrapTypeChange () {
      if (['00', '01'].includes(this.decHead.wrapType)) {
        this.decHead.packNo = '1'
      }
    },
    // 其他包装种类 弹出框的打开
    otherPacksDiv () {
      this.otherPacks = util.simpleClone(this.decHead.otherPacks)
      this.otherPacksVisible = true
    },
    // 其他包装种类 回参
    backOtherPacks (param) {
      if (param !== null) {
        this.decHead.otherPacks = util.simpleClone(param.otherPacks)
      }
      this.otherPacksVisible = false
    },
    // 特殊业务标识 打开弹出框
    openSpecialBusiContent () {
      this.specialBusiChangeCodeName()
      this.specialBusiVisible = true
    },
    // 特殊业务标识 把 code 转化为name
    specialBusiChangeCodeName () {
      let nameList = ['国际赛事', '特殊进出军工物资', '国际援助物资', '国际会议']
      let nameList2 = ['直通放行', '直通放行', '外交礼遇', '转关']
      let showList = []
      if (this.decHead.specDeclFlag !== '') {
        let arr = this.decHead.specDeclFlag.split('')
        for (let i in arr) {
          if (arr[i] === '1') {
            showList.push(nameList[i])
          }
        }
      }
      if (this.decHead.specDeclFlag2 !== '') {
        let arr2 = this.decHead.specDeclFlag2.split('')
        for (let n in arr2) {
          if (arr2[n] === '1') {
            showList.push(nameList2[n])
          }
        }
      }
      this.specialBusiList = showList
      this.specDeclFlagValue = showList.join(',')
    },
    // 特殊业务标识 回参
    backspecialBussiness (param) {
      if (param) {
        this.decHead.specDeclFlag = util.simpleClone(param.specDeclFlag)
        this.decHead.specDeclFlag2 = util.simpleClone(param.specDeclFlag2)
        this.specDeclFlagValue = util.simpleClone(param.specDeclFlagValue)
      }
      this.specialBusiVisible = false
      decBus.getBus(this.moduleName).$emit('focusDecList', null)
    },
    // 打开附件上传
    openAccessory () {
      if (this.decHead.decMarkLobs.length > 0) {
        this.decMarkLobsVo = this.decHead.decMarkLobs[0]
      } else {
        this.decMarkLobsVo = {
          pid: '', // 主键
          decPid: '', // 报关单表头PID
          cusCiqNo: '', // 关检关联号
          gNo: '', // 序号
          attachName: '', // 附件名称
          attachType: '', // 附件类型
          attachMent: '', // 附件（计算机无法录入的标记及号码的图案或内容，不超过1MB）
          attachUrl: '' // 附件路径
        }
      }
      this.attachVisabled = true
    },
    // 标记及号码附件信息
    receptionAttachData (param) {
      if (param !== null) {
        this.decHead.decMarkLobs = param.decMarkLobs[0].attachUrl ? util.simpleClone(param.decMarkLobs) : []
      }
      this.attachVisabled = false
    },
    // 接收账册数据
    receptionZBookData (param) {
      decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
        'gUnitReadonly': true
      })
      let goods = util.simpleClone(param.list)
      decBus.getBus(this.moduleName).$emit('backZbookList', goods)
      this.ZBookVisabled = false
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
        // 重新聚焦
        this.backFillDistrictCode()
      }
    },
    // 获取舱单弹窗传递过来的数据
    mftBillData (param) {
      let mftData = util.simpleClone(param)
      if (mftData.isShip) {
        this.decHead.packNo = mftData.packNo
        this.decHead.trafName = mftData.trafName
        this.decHead.billNo = mftData.billNo
        this.decHead.grossWt = mftData.wt
        this.decHead.voyageNo = mftData.voyageNo
      }
      if (!util.isEmpty(mftData.containerInfo)) {
        // 反填集装箱信息
        decBus.getBus(this.moduleName).$emit('backContainerList', mftData.containerInfo)
      }
      this.mftBillVisible = false
    },
    // 关闭 舱单信息弹窗
    closeMftBill () {
      this.mftBillVisible = false
    },
    // 表头运抵国和表体最终目的国(地区)一致性
    tradeCountryChange (value) {
      if (this.controller.iEFlag === 'E' && value) {
        decBus.getBus(this.moduleName).$emit('initBodySingleSeLect', 'destinationCountry', value, {obj: 'saasCountry3', params: 'SAAS_COUNTRY'})
      }
    },
    // 境内收发货人、消费使用/生产销售单位则选择企业编号
    getHeadCompany () {
      let company = []
      if (this.decHead.tradeCode !== '' && this.decHead.tradeName !== '') {
        company.push({
          name: this.decHead.tradeName,
          code: this.decHead.tradeCode
        })
      }
      if (this.decHead.ownerName !== '' && this.decHead.ownerCode !== '') {
        company.push({
          name: this.decHead.ownerName,
          code: this.decHead.ownerCode
        })
      }
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'companyList', value: company})
    },
    // 只清空表头 保留保存的特有数据
    resetHeadData (headVo, head) {
      let preEntryId = this.decHead.preEntryId // 预录入编号
      let bossId = this.decHead.bossId // 关联编号(台账编号)
      let clientSeqno = this.decHead.clientSeqno // 客户端报关单编号
      let seqNo = this.decHead.seqNo // 统一编号
      let cusCiqNo = this.decHead.cusCiqNo // 关检关联号
      let entryId = this.decHead.entryId // 海关编号
      let status = this.decHead.status // 报关单状态
      let statusValue = this.decHead.statusValue // 报关单状态名称
      let decPid = this.decHead.decPid // 报关单状态名称
      let decHead = businessUtil.generateDecHead()
      decHead.preEntryId = preEntryId // 预录入编号
      decHead.bossId = bossId // 关联编号(台账编号)
      decHead.clientSeqno = clientSeqno // 客户端报关单编号
      decHead.seqNo = seqNo // 统一编号
      decHead.cusCiqNo = cusCiqNo // 关检关联号
      decHead.entryId = entryId // 海关编号
      decHead.iEFlag = this.controller.iEFlag // 进出口标识
      decHead.status = status // 报关单状态
      decHead.decPid = decPid // 报关单主键
      decHead.statusValue = statusValue // 报关单状态名称
      decHead.declTrnrel = this.controller.declTrnrel // 报关/转关关系标志
      this.decHead = decHead
      for (let key in head) {
        if (headVo[head[key].filed]) {
          this.decHead[key] = headVo[head[key].filed].toString()
        }
      }
      this.initHeadSelect()
    },
    emsDataHeadBack (head) {
      for (let n in head) {
        this.decHead[head[n].decName] = head[n].billValue
      }
      this.initHeadSelect()
    },
    changeHeadData (compareHead) {
      for (let value in compareHead) {
        this.decHead[value.decName] = value.billValue
      }
    },
    setCropLimit (vo) {
      this.cropLimit = vo
    },
    // 获取报关表头信息并赋值
    getHeadDetail (HeadVo, param) {
      this.decHead = util.simpleClone(HeadVo)
      this.decHead.netWt = decUtil.removeZero(this.decHead.netWt)
      this.decHead.grossWt = decUtil.removeZero(this.decHead.grossWt)
      this.decHead.feeRate = decUtil.removeZero(this.decHead.feeRate)
      this.decHead.insurRate = decUtil.removeZero(this.decHead.insurRate)
      this.decHead.otherRate = decUtil.removeZero(this.decHead.otherRate)
      // 判断 这条数据是否从OCR过来
      if (this.decHead.ref5 === 'Y') {
        this.controller.ocrShow = true
      }
      if (this.controller.funFlag === 'declaration') {
        this.decHead.declTrnrel = '0'
      } else if (this.controller.funFlag === 'recordList') {
        this.decHead.declTrnrel = '2'
      }
      if (!util.isEmpty(this.decHead.transMode)) {
        this.transModeChange(this.decHead.transMode, 'init')
      } else {
        this.feeChange(this.decHead.feeMark, 'fee')
        this.feeChange(this.decHead.insurMark, 'insur')
        this.feeChange(this.decHead.otherMark, 'other')
      }
      // 计算 备注和唛码标记的长度
      this.computLength('1')
      this.computLength('2')
      // 当 关检关联号为空 并且 统一编号不为空时 显示统一编号 其他情况显示 关检关联号
      if (!util.isEmpty(this.decHead.seqNo) && util.isEmpty(this.decHead.cusCiqNo)) {
        this.headController.isSeqNo = true
      } else {
        this.headController.isSeqNo = false
      }
      // 防止 用户申报后刷新 引起可编辑的bug
      // 不允许编辑的状态 报关单状态 和操作状态
      let forbiddenStatus = ['002', '005', '2', '4', '5', '7', '8', '9', '10', '11'] // 报关单状态
      // 提交审核，审核驳回，审核通过
      let forbiddenIsExamine = ['3', 'R', '6'] // 操作状态
      if (forbiddenStatus.includes(this.decHead.status) || forbiddenIsExamine.includes(this.decHead.isExamine)) {
        this.controller.isDisabled = true
        this.controller.initTemplateBtn = true
      }
      if (this.controller.fromPage === 'reviewed') {
        this.controller.isDisabled = false
      }
      // 企业资质信息 需要删除 处理
      let decCopLimits = util.isEmpty(this.decHead.decCopLimits) ? [] : this.decHead.decCopLimits
      if (decCopLimits.length > 0) {
        for (let x in decCopLimits) {
          if (['101040', '102053'].includes(decCopLimits[x].entQualiftypeCode)) {
            this.setCropLimit({
              pid: '', // 主键
              decPid: this.decHead.decPid, // 报关单主键
              gNo: '1', // 序号
              entQualifNo: '', // 企业资质编号
              entQualiftypeCode: this.decHead.decCopLimits[x].entQualiftypeCode, // 企业资质类别代码
              entQualiftypeName: '合格保证' // 企业资质类别名称
            })
            this.decHead.decCopLimits.splice(x, 1)
            break
          }
        }
      }
      // 企业资质信息设置
      if (!param) {
        this.setGoodsLimit()
      }
      // 初始化 所需单证 字段
      let nameList = []
      for (let n in this.decHead.decRequestCerts) {
        nameList.push(this.decHead.decRequestCerts[n].appCertName)
      }
      this.appCertName = nameList.join(',')
      // 控制 随附单据 按钮
      if (this.decHead.entryType === 'M') {
        this.controller.accDocDisabled = false
      }
      // 如果存在 备案号 则需要放开备案序号
      if (!util.isEmpty(this.decHead.manualNo)) {
        decBus.getBus(this.moduleName).$emit('setBodyControllerFieldValue', {
          'contrItemDisabled': false
        })
      }
      // 显示 特殊业务标识
      if (!param) {
        this.specialBusiChangeCodeName()
      }
      // 给表头select 框 初始化赋值
      this.initHeadSelect()
      this.setCharterDis(this.decHead.tradeMode)
      this.decHead.decRoyaltyFeeVO = util.isEmpty(this.decHead.decRoyaltyFeeVO) ? null : this.decHead.decRoyaltyFeeVO // 特许权使用费
    },
    // 新增的时候 需要初始化申报单位的数据
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
    initHeadData (param) {
      this.decHead = businessUtil.generateDecHead()
      this.saasCustomsRel1 = []
      this.saasCustomsRel2 = []
      this.saasTransportType = [] // 运输方式
      this.saasTrade = [] // 监管方式
      this.saasLevytype = [] // 征免性质
      this.saasCountry1 = [] // 启运国(地区)':'运抵国(地区)
      this.distinatePort = [] // 经停港':'指运港
      this.saasTransac = [] // 成交方式
      this.feeRate1 = [] // 运费
      this.saasCurr1 = [] // 运费
      this.feeRate2 = [] // 保费
      this.saasCurr2 = [] // 保费
      this.feeRate3 = [] // 杂费
      this.saasCurr3 = [] //
      this.saasWrap = [] // 包装种类
      this.saasCountry2 = [] // 贸易国别(地区)
      this.saasInlandPort = [] // 入境口岸
      this.saasPortLin = [] // 启运港
      this.decType = [] // 报关单类型
      this.saasPortLin1 = [] // 停经港
      this.billType = [] // 清单类型
      this.saasCiqOrganization1 = [] // 检验检疫受理机关
      this.saasCiqOrganization2 = [] // 领证机关
      this.saasCiqOrganization3 = [] // 口岸检验检疫机关
      this.saasCiqOrganization4 = [] // 目的地检验检疫机关
      this.commomPara1 = [] // 原箱运输
      this.saasCorrelationReason = [] // 关联理由
      this.decHead.iEFlag = this.controller.iEFlag
      this.decHead.declTrnrel = this.controller.declTrnrel
      this.computLength('2')
      if (!param) {
        this.initDefautHeadData('1')
      }
      if (this.controller.funFlag === 'recordList') {
        this.initbilltype()
      }
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
      this.decHead.isExamine = ''
      this.decHead.status = ''
      this.decHead.statusValue = ''
      delete this.decHead.dataSource
      delete this.decHead.sysSource
      delete this.decHead.feePid
      delete this.decHead.expenseId
      delete this.decHead.emailAddress
      delete this.decHead.xmlStatus
      delete this.decHead.xmlUrl
      delete this.decHead.ref5
      delete this.decHead.twoStepFlag
    },
    // 比较模板与填写数据的区别
    compareDecHead (headVo) {
      let compareResult = []
      let fields = {
        customMaster: '申报地海关',
        iEPort: this.controller.iEFlag === 'I' ? '进境关别' : '出境关别',
        manualNo: '备案号',
        contrNo: '合同协议号',
        iEDate: this.controller.iEFlag === 'I' ? '进口日期' : '出口日期',
        tradeCoScc: '境内收发货人18位社会信用代码',
        tradeCode: '境内收发货人10位海关编码',
        consigneeCode: '境内收发货人10位检验检疫编码',
        tradeName: '内收发货人企业名称(中文)',
        domesticConsigneeEname: '内收发货人企业名称(外文)',
        overseasConsignorCode: '境外收发货人代码',
        overseasConsigneeCode: '境外收发货人代码',
        overseasConsignorEname: '境外收发货人企业名称(外文)',
        overseasConsigneeEname: '境外收发货人企业名称(外文)',
        overseasConsignorCname: '境外收发货人企业名称(中文)',
        overseasConsignorAddr: '发货人地址',
        // (this.controller.iEFlag == 'I' ? 'overseasConsignorCode': 'overseasConsigneeCode'): '境外收发货人代码',
        // (this.controller.iEFlag == 'I' ? 'overseasConsignorEname': 'overseasConsigneeEname'): '境外收发货人企业名称(外文)',
        // (this.controller.iEFlag == 'I' ? 'overseasConsignorCname': 'overseasConsignorCname'): '境外收发货人企业名称(中文)',
        // (this.controller.iEFlag == 'I' ? 'overseasConsignorAddr': 'overseasConsignorAddr'): '发货人地址',
        ownerCodeScc: this.controller.iEFlag === 'I' ? '消费生产使用单位18位社会信用代码' : '生产销售单位18位社会信用代码',
        ownerCode: this.controller.iEFlag === 'I' ? '消费生产使用单位10位海关编码' : '生产销售单位10位海关编码',
        ownerCiqCode: this.controller.iEFlag === 'I' ? '消费生产使用单位10位检验检疫编码' : '生产销售单位10位检验检疫编码',
        ownerName: this.controller.iEFlag === 'I' ? '消费生产使用单位企业名称' : '生产销售单位企业名称',
        agentCodeScc: '申报单位18位社会信用代码',
        agentCode: '申报单位10位海关编码',
        declRegNo: '申报单位10位检验检疫编码',
        agentName: '申报单位企业名称',
        cutMode: '征免性质',
        trafMode: '运输方式',
        trafName: '运输工具名称',
        voyageNo: '航次号',
        billNo: '提运单号',
        tradeMode: '监管方式',
        licenseNo: '许可证号',
        tradeCountry: this.controller.iEFlag === 'I' ? '启运国(地区)' : '运抵国(地区)',
        distinatePort: this.controller.iEFlag === 'I' ? '经停港' : '指运港',
        transMode: '成交方式',
        feeMark: '运费类型',
        feeRate: '运费',
        feeCurr: '运费币制',
        insurMark: '保费类型',
        insurRate: '保费',
        insurCurr: '保费币制',
        otherMark: '杂费类型',
        otherRate: '杂费',
        otherCurr: '杂费币制',
        packNo: '件数',
        wrapType: '包装种类',
        grossWt: '毛重(KG)',
        netWt: '净重(KG)',
        tradeAreaCode: '贸易国别(地区)',
        entyPortCode: this.controller.iEFlag === 'I' ? '入境口岸' : '离境口岸',
        goodSplace: '货物存放地点',
        despPortCode: '启运港',
        entryType: '报关单类型',
        noteS: '备注',
        markNo: '标记唛码',
        orgCode: '检验检疫受理机关',
        vsaOrgCode: '领证机关',
        inspOrgCode: '口岸检验检疫机关',
        despDate: '启运日期',
        blno: 'B/L号',
        purpOrgCode: '目的地检验检疫机关',
        correlationaNo: '关联号码',
        correlationReasonFlag: '关联理由',
        origBoxFlag: '原箱运输',
        cmplDschrgDt: '卸毕日期',
        relId: '关联报关单',
        relManno: '关联备案',
        bonNo: '保税/监管场地',
        cusFie: '场地代码',
        chkBond: '自主报税',
        chkPayment: '自报自缴',
        chkSurety: '担保验放',
        chkTax: '税单无纸化',
        chkOther: '水运中转',
        specDeclFlag: '特种业务标识',
        specDeclFlag2: '特种业务标识(直通放行、外交礼遇、转关)'
      }
      for (let key in fields) {
        if (headVo[key] !== this.decHead[key]) {
          if (util.isEmpty(headVo[key]) && util.isEmpty(this.decHead[key])) {
            continue
          }
          compareResult.push({
            field: key,
            fieldName: fields[key],
            templateValue: headVo[key],
            value: this.decHead[key]
          })
        }
      }
      return compareResult
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
     * 获取表头属性
     */
    getHeadFieldValue (field) {
      return this.decHead[field]
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
    setHeadFieldToSate (field) {
      this.$store.commit(this.moduleName + '/changeDecPage', {key: field, value: this.decHead[field]})
    },
    // 设置字体颜色
    setHeadAiColor (headAiColor) {
      this.headAiColor = util.simpleClone(headAiColor)
    },
    formatHeadCheckData (decVerifyHeadVO, headMap) {
      decVerifyHeadVO.feeRate = decVerifyHeadVO.feeMark
      delete decVerifyHeadVO.feeMark
      decVerifyHeadVO.insurRate = decVerifyHeadVO.insurMark
      delete decVerifyHeadVO.insurMark
      decVerifyHeadVO.otherRate = decVerifyHeadVO.otherMark
      delete decVerifyHeadVO.otherMark
      decVerifyHeadVO.noteS = decVerifyHeadVO.note
      delete decVerifyHeadVO.note
      decVerifyHeadVO.trafName = decVerifyHeadVO.nameVo
      delete decVerifyHeadVO.nameVo
      // 商检单涉及字段去除
      delete decVerifyHeadVO.orgCode
      delete decVerifyHeadVO.vsaOrgCode
      delete decVerifyHeadVO.inspOrgCode
      delete decVerifyHeadVO.despDate
      delete decVerifyHeadVO.blno
      delete decVerifyHeadVO.purpOrgCode
      delete decVerifyHeadVO.correlationaNo
      delete decVerifyHeadVO.origBoxFlag
      delete decVerifyHeadVO.specialFlag
      delete decVerifyHeadVO.companyCer
      delete decVerifyHeadVO.userInfo

      decVerifyHeadVO && (this.headColor = decVerifyHeadVO) // 表头标记颜色
      headMap && (this.decCheckRec = headMap) // 表头的审批意见

      if (this.decCheckRec['nameVoNote']) {
        this.decCheckRec['trafNameNote'] = this.decCheckRec['nameVoNote']
      }
      if (this.decCheckRec['noteNote']) {
        this.decCheckRec['noteSNote'] = this.decCheckRec['noteNote']
      }
      if (this.decCheckRec['feeMarkNote']) {
        this.decCheckRec['feeRateNote'] = this.decCheckRec['feeMarkNote']
      }
      if (this.decCheckRec['insurMarkNote']) {
        this.decCheckRec['insurRateNote'] = this.decCheckRec['insurMarkNote']
      }
      if (this.decCheckRec['otherMarkNote']) {
        this.decCheckRec['otherRateNote'] = this.decCheckRec['otherMarkNote']
      }
      this.decHeadOhter = util.simpleClone(this.decHead) // 当时的表头数据
      for (let key in this.errorColor) {
        if (this.headColor[key] === '1') {
          if (key === 'docuAndcertCode') {
            let tips = (this.decCheckRec['docuAndcertCodeNote'] ? this.decCheckRec['docuAndcertCodeNote'] : [])
            decBus.getBus(this.moduleName).$emit('initDocCheck', true, tips)
          } else {
            this.errorColor[key] = true
          }
        }
      }
    },
    closeErrorTips (param) {
      this.headVisible[param.colum] = false
      this.popoverVisible = false
    },
    // 根据类型显示
    getTypeToHead (clomn, colorField) {
      // 如果要显示审核记录 需要满足条件 1.审核状态必须为4审核驳回状态2.当前字段必须标记为错误 '1'
      if (this.controller.showCheckTips && this.headColor[colorField].toString() === '1') {
        // 如果没有值 则赋值为空
        if (!this.decCheckRec[clomn]) {
          this.decCheckRec[clomn] = []
        }
        this.headVisible[clomn] = true
      } else {
        this.headVisible[clomn] = false
      }
    },
    watchValueChange (field) {
      // if (this.decHead[field] !== this.decHeadOther[field]) {

      // }
    },
    // 查询舱单调取的集装箱
    openContainerInfo (shippingList, initParams) {
      let param
      if (shippingList.length > 0) {
        param = {
          billNo: shippingList[0].billNo,
          customMaster: initParams.customMaster,
          iEFlag: initParams.iEFlag
        }
      } else {
        param = {
          billNo: initParams.billNo,
          customMaster: initParams.customMaster,
          iEFlag: initParams.iEFlag
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/queryCusContainer',
        data: param,
        loading: true,
        success: (res) => {
          if (res.code === '0000') {
            this.mftContainerList = util.isEmpty(res.result) ? [] : res.result
            this.mftBillDetailVisible = true
          } else {
            this.messageTips(res.message, 'error')
          }
        }
      })
    },
    mftBillDetailData (param) {
      let mftData = util.simpleClone(param)
      if (mftData.isShip) {
        this.decHead.packNo = mftData.packNo
        this.decHead.trafName = mftData.trafName
        this.decHead.billNo = mftData.billNo
        this.decHead.grossWt = mftData.wt
        this.decHead.voyageNo = mftData.voyageNo
      }
      if (!util.isEmpty(mftData.containerInfo)) {
        // 反填集装箱信息
        decBus.getBus(this.moduleName).$emit('backContainerList', mftData.containerInfo)
      }
      this.mftBillDetailVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
@import '../common/decCss';
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
  }
  .img-tip{
    background: linear-gradient(45deg,transparent 7px,red 0) left;
    float: right;
    width: 10px;
    height: 10px;
  }
</style>
