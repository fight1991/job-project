<template>
  <!-- 转关单 合用界面-->
  <section class='sys-main sys-dec-class dec-section-edit' :style="{ zoom: zoom }">
    <el-header class= 'topDiv'>
      <!-- 操作按钮-->
      <el-row style='margin-right:54px'>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-plus" @click="addDecHead" :disabled="controller.isDisabled">&nbsp;新增</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-save" @click="saveDecHead" :disabled="controller.isDisabled">&nbsp;暂存</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-copy" @click="copyDecHead">&nbsp;复制</el-button>
          <!-- <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-print" @click="printDecHead" >&nbsp;打印</el-button> -->
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-trash-o" @click="delDecHead" :disabled="controller.isDisabled">&nbsp;删除</el-button>
          <!-- <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-paste" :disabled="controller.isDisabled || controller.initTemplateBtn" @click="initTemplateVisible = true">&nbsp;初始值模板</el-button> -->
          <!-- <el-button type="primary" size="mini" icon="fa fa-file-text" :disabled="controller.isDisabled">&nbsp;资质查询</el-button> -->
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-file" :disabled="controller.isDisabled" @click="additionInfoLaVisible=true">&nbsp;附注</el-button>
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-file-pdf-o" @click="openAccDoc" :disabled="controller.accDocDisabled">&nbsp;随附单据</el-button>
          <!-- <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-dollar" v-if="controller.iEFlag=='I'" :disabled="charterDis" @click="charterRight">特许权使用费</el-button> -->
          <!-- <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-upload" @click="sumbitCheck">&nbsp;提交审核</el-button> -->
          <!-- <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-upload" v-show='controller.ocrShow' @click="lookOCR">&nbsp;查看OCR单证</el-button> -->
          <!-- <el-button type="primary" size="mini" icon="fa fa-upload" :disabled="controller.isDisabled">&nbsp;税单查看</el-button> -->
          <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-paper-plane-o" @click="declareData('G')" style='float: right;' :disabled="controller.isDisabled">&nbsp;发送</el-button>
          <!-- <el-button type="primary" title="仅上海地区可用" class='dec-h-24' size="mini" icon="fa fa-paper-plane-o" @click="declareData('C')" style='float: right;margin-right:5px' :disabled="controller.isDisabled || isDisabledDec">&nbsp;申报</el-button> -->
        </el-row>
    </el-header>
    <div class="dec-container-div">
      <el-tabs v-model="activeTab" :before-leave="changeTabs">
        <el-tab-pane :label="tabsLabel" name="first">
          <el-container>
            <el-container>
              <el-main style = 'padding: 0 5px 0 0'>
                <!---表头开始  -->
                <div class='dec-div'>
                  <el-form ref="headRuleForm" :model="decHead"  :rules="headRuleForm" label-width="112px" size="mini" @keyup.enter.native="switchFoucsByEnter">
                      <el-row  >
                        <el-col :span="12">
                          <el-form-item label="申报地海关" :class="{ 'require-color': controller.requireColor }"  prop="customMaster">
                            <el-select placeholder=" " v-model="decHead.customMaster"
                            @focus="tipsFillMessage('customMaster', 'saasCustomsRel1','SAAS_CUSTOMS_REL')"
                            filterable remote clearable
                            default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCustomsRel1')"
                            ref="customMaster" dataRef ='customMaster'
                            :disabled="controller.isDisabled" style="width:100%" >
                              <el-option
                                v-for="item in saasCustomsRel1"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="申报状态">
                            <el-input v-model="decHead.statusValue" readonly  @focus="tipsFillMessage('statusValue')"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="12" v-if = "controller.isSeqNo">
                          <el-form-item label="统一编号">
                            <el-input v-model="decHead.seqNo" readonly @focus="tipsFillMessage('seqNo')"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" v-else>
                          <el-form-item label="统一编号">
                            <el-input v-model="decHead.cusCiqNo" readonly @focus="tipsFillMessage('cusCiqNo')"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="预录入编号">
                            <el-input v-model="decHead.preEntryId" readonly @focus="tipsFillMessage('preEntryId')"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="12">
                          <el-form-item label="海关编号">
                            <el-input v-model="decHead.entryId" readonly @focus="tipsFillMessage('entryId')"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item :label="controller.iEFlag == 'I' ? '进境关别':'出境关别'"
                            :class="{ 'require-color': controller.requireColor }" prop="iEPort">
                            <el-select placeholder=" " v-model="decHead.iEPort"
                            default-first-option remote
                            filterable ref="iEPort" dataRef ='iEPort'
                            @change="iEPortChange"
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCustomsRel2')"
                            @focus="tipsFillMessage('iEPort', 'saasCustomsRel2','SAAS_CUSTOMS_REL')"
                            clearable  :disabled="controller.isDisabled" style="width:100%" >
                              <el-option
                                v-for="item in saasCustomsRel2"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="12">
                          <el-form-item label="备案号" prop="manualNo" ref="manualNo">
                            <el-input v-model="decHead.manualNo" :maxlength="12"
                            @blur='queryBookHead' clearable
                            @input='manualNoChange'
                            @focus="tipsFillMessage('manualNo')" :readonly="controller.isDisabled || controller.cDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="合同协议号" prop="contrNo" ref="contrNo">
                            <el-input clearable v-model="decHead.contrNo"
                              :maxlength="32" @focus="tipsFillMessage('contrNo')" :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="12">
                          <el-form-item :label="controller.iEFlag == 'I' ? '进口日期':'出口日期'" ref="iEDate" prop="iEDate">
                            <el-input  v-model="decHead.iEDate"  :maxlength="8"
                            :class="{ 'require-color': controller.requireColor }"
                            @focus="tipsFillMessage('iEDate')" :readonly="controller.isDisabled || controller.iEFlagDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
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
                      </el-row>
                      <el-row  >
                        <el-col :span="24">
                          <el-form-item label="境内收发货人" >
                            <el-col :span="6">
                              <el-form-item prop="tradeCoScc" ref="tradeCoScc" >
                                <el-input :class="{ 'require-color': controller.requireColor }"
                                  v-model="decHead.tradeCoScc" :maxlength="18" placeholder="18位社会信用代码"
                                  @focus="tipsFillMessage('tradeCoScc')"
                                  dataRef = 'tradeCoScc'
                                  @blur="queryCropInfo('tradeCoScc', $event)"
                                  :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="4">
                              <el-form-item prop="tradeCode" ref="tradeCode">
                                  <el-input   :class="{ 'require-color': controller.requireColor }"
                                    v-model="decHead.tradeCode"  :maxlength="10"  placeholder="10位海关编码"
                                    @focus="tipsFillMessage('tradeCode')"
                                    dataRef = 'tradeCode'
                                    @blur="queryCropInfo('tradeCode', $event)"
                                    :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="4">
                              <el-form-item prop="consigneeCode" ref="consigneeCode">
                                <el-input   v-model="decHead.consigneeCode" placeholder="10位检验检疫编码"
                                  @focus="tipsFillMessage('consigneeCode')"
                                  :maxlength="10"  :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="10">
                              <el-form-item prop="tradeName" ref = 'tradeName'>
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
                                  <i class="el-icon-refresh i-class"
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
                          <el-form-item label="境外收发货人" >
                            <el-col :span="14">
                              <el-form-item  ref="overseasConsignorCode">
                                <el-input  v-model="decHead.overseasConsignorCode" placeholder="境外收货人代码"
                                  @focus="tipsFillMessage('overseasConsignorCode')"
                                :maxlength="50" :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="10">
                              <el-form-item prop="overseasConsignorEname" ref="overseasConsignorEname" >
                                <el-autocomplete
                                  :class="{ 'require-color': controller.requireColor }"
                                  :maxlength="100"
                                  placeholder="企业名称(外文),输入两位字符开始匹配"
                                  size='mini'
                                  @input='checklen("decHead", "overseasConsignorEname", 100)'
                                  @focus="tipsFillMessage('overseasConsignorEname')"
                                  v-model="decHead.overseasConsignorEname"
                                  :fetch-suggestions="querySearch"
                                  :trigger-on-focus="false"
                                  :select-when-unmatched='true'
                                  :highlight-first-item='true'
                                  :readonly="controller.isDisabled"
                                  @select="handleSelect($event, '2', 'I')">
                                </el-autocomplete>
                              </el-form-item>
                            </el-col>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  v-else>
                        <el-col :span="24">
                          <el-form-item label="境外收发货人" >
                            <el-col :span="14">
                              <el-form-item  ref="overseasConsigneeCode">
                                <el-input  v-model="decHead.overseasConsigneeCode" placeholder="境外收货人代码"
                                  @focus="tipsFillMessage('overseasConsigneeCode')"
                                :maxlength="50" :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="10">
                              <el-form-item prop="overseasConsigneeEname" ref="overseasConsigneeEname" >
                                <el-autocomplete
                                  :class="{ 'require-color': controller.requireColor }"
                                  :maxlength="100"
                                  placeholder="企业名称(外文),输入两位字符开始匹配"
                                  size='mini'
                                  @input='checklen("decHead", "overseasConsigneeEname", 100)'
                                  @focus="tipsFillMessage('overseasConsigneeEname')"
                                  v-model="decHead.overseasConsigneeEname"
                                  :fetch-suggestions="querySearch"
                                  :trigger-on-focus="false"
                                  :select-when-unmatched='true'
                                  :highlight-first-item='true'
                                  :readonly="controller.isDisabled"
                                  @select="handleSelect($event, '2', 'E')">
                                </el-autocomplete>
                              </el-form-item>
                            </el-col>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="24" >
                          <el-form-item :label="controller.iEFlag == 'I' ? '消费使用单位':'生产销售单位'" >
                            <el-col :span="6">
                              <el-form-item prop="ownerCodeScc" ref="ownerCodeScc" >
                                <el-input   :class="{ 'require-color': controller.requireColor }" :maxlength="18"
                                  @focus="tipsFillMessage('ownerCodeScc')"
                                  dataRef = 'ownerCodeScc'
                                  @blur="queryCropInfo('ownerCodeScc', $event)"
                                  v-model="decHead.ownerCodeScc" placeholder="18位社会信用代码" :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="4">
                              <el-form-item prop="ownerCode" ref="ownerCode" >
                                <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="10"
                                  @focus="tipsFillMessage('ownerCode')"
                                  dataRef = 'ownerCode'
                                  @blur="queryCropInfo('ownerCode', $event)"
                                  v-model="decHead.ownerCode" placeholder="10位海关编码" :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="4">
                              <el-form-item prop="ownerCiqCode" ref="ownerCiqCode" >
                                <el-input  v-model="decHead.ownerCiqCode" :maxlength="10"
                                  @focus="tipsFillMessage('ownerCiqCode')"
                                  placeholder="10位检验检疫编码" :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="10">
                              <el-form-item prop="ownerName" ref="ownerName" >
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
                                    <i class="el-icon-refresh i-class"
                                      slot="suffix" title = '同步海关数据'
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
                          <el-form-item label="申报单位">
                            <el-col :span="6">
                              <el-form-item prop="agentCodeScc" ref="agentCodeScc" >
                                <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="18"
                                  @focus="tipsFillMessage('agentCodeScc')"
                                  @blur="queryCropInfo('agentCodeScc', $event)"
                                  v-model="decHead.agentCodeScc" placeholder="18位社会信用代码" :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="4">
                              <el-form-item prop="agentCode" ref="agentCode" >
                                <el-input   :class="{ 'require-color': controller.requireColor }" :maxlength="10"
                                @focus="tipsFillMessage('agentCode')"
                                @blur="queryCropInfo('agentCode', $event)"
                                v-model="decHead.agentCode" placeholder="10位海关编码" :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="4">
                              <el-form-item prop="declRegNo" ref="declRegNo" >
                                <el-input  :maxlength="10"  v-model="decHead.declRegNo" placeholder="10位检验检疫编码"
                                  @focus="tipsFillMessage('declRegNo')"
                                  :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="10">
                              <el-form-item prop="agentName" ref="agentName" >
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
                      <el-row  >
                        <el-col :span="6">
                          <el-form-item label="运输方式"  :class="{ 'require-color': controller.requireColor }" prop="trafMode">
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
                      <el-row  >
                        <el-col :span="12">
                          <el-form-item label="提运单号" prop="billNo" ref="billNo">
                            <el-col :span="23">
                              <el-input v-model="decHead.billNo" :maxlength="32"
                                @focus="tipsFillMessage('billNo')"
                                :readonly="controller.isDisabled"></el-input>
                            </el-col>
                            <el-col :span="1">
                              <el-tooltip  effect="dark" content="调用舱单数据" >
                                <el-button type="primary" icon="fa fa-file" @click="queryMftData"></el-button>
                              </el-tooltip>
                            </el-col>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="监管方式"  :class="{ 'require-color': controller.requireColor }"  prop="tradeMode">
                            <el-select placeholder=" " v-model="decHead.tradeMode"
                              @focus="tipsFillMessage('tradeMode', 'saasTrade','SAAS_TRADE')"
                              ref="tradeMode" dataRef ='tradeMode'
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasTrade')"
                              @change = 'tradeModeChange'
                              clearable filterable
                              :disabled="controller.isDisabled || controller.cDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasTrade"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="征免性质">
                            <el-select placeholder=" " v-model="decHead.cutMode"
                              @focus="tipsFillMessage('cutMode', 'saasLevytype','SAAS_LEVYTYPE')"
                              ref="cutMode" dataRef ='cutMode'
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasLevytype')"
                              @change='cutModeChange'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasLevytype"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="6">
                          <el-form-item label="许可证号" prop="licenseNo" ref="licenseNo">
                            <el-input v-model="decHead.licenseNo"  :maxlength="20"
                              @focus="tipsFillMessage('licenseNo')" dataRef ='licenseNo'
                              @keyup.native = "changeLicenseNo"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item :label="controller.iEFlag == 'I' ? '启运国(地区)':'运抵国(地区)'"
                            :class="{ 'require-color': controller.requireColor }"
                            prop="tradeCountry">
                            <el-select placeholder=" " v-model="decHead.tradeCountry"
                              @focus="tipsFillMessage('tradeCountry', 'saasCountry1','SAAS_COUNTRY')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasCountry1')"
                              ref="tradeCountry" dataRef ='tradeCountry'
                              @change = 'tradeCountryChange'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasCountry1"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item :label="controller.iEFlag == 'I' ? '经停港':'指运港'"
                          :class="{ 'require-color': controller.requireColor }"
                            prop="distinatePort">
                            <el-select placeholder=" " v-model="decHead.distinatePort"
                              @focus="tipsFillMessage('distinatePort', 'saasPortLin1','SAAS_PORT_LIN')"
                              ref="distinatePort" dataRef ='distinatePort'
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasPortLin1')"
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasPortLin1"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="成交方式"  :class="{ 'require-color': controller.requireColor }" prop="transMode">
                            <el-select placeholder=" " v-model="decHead.transMode"
                              @focus="tipsFillMessage('transMode', 'saasTransac','SAAS_TRANSAC')"
                              @change="transModeChange"
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasTransac')"
                              ref="transMode" dataRef ='transMode'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasTransac"
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
                          <el-form-item label="运费" label-width="50px">
                            <el-col :span="8">
                              <el-form-item prop="feeMark" >
                                <el-select placeholder=" "
                                v-model="decHead.feeMark"
                                @focus="tipsFillMessage('feeMark', 'feeRate1' ,'FEE_RATE')"
                                remote clearable filterable  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('feeRate1')"
                                :disabled="controller.isDisabled  || controller.feeMarkDisabled"
                                ref="feeMark" dataRef ='feeMark'
                                style="width:100%"
                                @change="feeChange(decHead.feeMark, 1)"
                                :class="{ 'require-color': controller.requireColor }">
                                  <el-option
                                    v-for="item in feeRate1"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField"
                                    :value="item.codeField">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item prop="feeRate" ref="feeRate" >
                                <el-input v-model="decHead.feeRate"
                                  @focus="tipsFillMessage('feeRate')"
                                  :readonly="controller.isDisabled || controller.feeRateDisabled" ></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item >
                                <el-select placeholder=" " v-model="decHead.feeCurr"
                                @focus="tipsFillMessage('feeCurr', 'saasCurr1','SAAS_CURR')"
                                ref="feeCurr" dataRef ='feeCurr'
                                remote clearable filterable  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('saasCurr1')"
                                :disabled="controller.isDisabled || controller.feeCurrDisabled" style="width:100%">
                                  <el-option
                                    v-for="item in saasCurr1"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                    :value="item.codeField">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="保险费"  label-width="50px">
                            <el-col :span="8">
                              <el-form-item >
                                <el-select placeholder=" " v-model="decHead.insurMark"
                                @focus="tipsFillMessage('insurMark', 'feeRate2' ,'FEE_RATE_OHTER')"
                                remote clearable filterable  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('feeRate2')"
                                ref="insurMark" dataRef ='insurMark'
                                :disabled="controller.isDisabled || controller.insurMarkDisabled"
                                style="width:100%"  @change="feeChange(decHead.insurMark, 2)">
                                  <el-option
                                    v-for="item in feeRate2"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField"
                                    :value="item.codeField">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item prop="insurRate" ref="insurRate" >
                                <el-input v-model="decHead.insurRate"
                                  @focus="tipsFillMessage('insurRate')"
                                  :readonly="controller.isDisabled || controller.insurRateDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item >
                                <el-select placeholder=" " v-model="decHead.insurCurr"
                                @focus="tipsFillMessage('insurCurr', 'saasCurr2','SAAS_CURR')"
                                ref="insurCurr" dataRef ='insurCurr'
                                remote clearable filterable  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('saasCurr2')"
                                :disabled="controller.isDisabled || controller.insurCurrDisabled" style="width:100%"  >
                                  <el-option
                                    v-for="item in saasCurr2"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                    :value="item.codeField">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="杂费"  label-width="50px">
                            <el-col :span="8">
                              <el-form-item>
                                <el-select placeholder=" " v-model="decHead.otherMark"
                                  @focus="tipsFillMessage('otherMark', 'feeRate3' ,'FEE_RATE_OHTER')"
                                  remote clearable filterable  default-first-option
                                  :remote-method="checkParamsList"
                                  @clear="clearSelct('feeRate3')"
                                  ref="otherMark" dataRef ='otherMark'
                                  :disabled="controller.isDisabled" style="width:100%"  @change="feeChange(decHead.otherMark, 3)">
                                  <el-option
                                    v-for="item in feeRate3"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField"
                                    :value="item.codeField">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item prop="otherRate" ref="otherRate" >
                                <el-input v-model="decHead.otherRate"
                                  @focus="tipsFillMessage('otherRate')"
                                  :readonly="controller.isDisabled"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item>
                                  <el-select placeholder=" " v-model="decHead.otherCurr"
                                    @focus="tipsFillMessage('otherCurr', 'saasCurr3','SAAS_CURR')"
                                    ref="otherCurr" dataRef ='otherCurr'
                                    remote clearable filterable  default-first-option
                                    :remote-method="checkParamsList"
                                    @clear="clearSelct('saasCurr3')"
                                    :disabled="controller.isDisabled  || controller.otherCurrDisabled" style="width:100%">
                                    <el-option
                                      v-for="item in saasCurr3"
                                      :key="item.codeField"
                                      :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                      :value="item.codeField">
                                    </el-option>
                                  </el-select>
                              </el-form-item>
                            </el-col>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="件数" prop="packNo" ref="packNo">
                            <el-input v-model="decHead.packNo" :maxlength="9"
                              @focus="tipsFillMessage('packNo')"
                              :class="{ 'require-color': controller.requireColor }"   :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="6">
                          <el-form-item label="包装种类"  :class="{ 'require-color': controller.requireColor }"  prop="wrapType">
                            <el-select placeholder=" " v-model="decHead.wrapType"
                              @focus="tipsFillMessage('wrapType', 'saasWrap','SAAS_WRAP')"
                              ref="wrapType" dataRef ='wrapType'
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasWrap')"
                              @change = 'wrapTypeChange'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasWrap"
                                :key="item.codeField"
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
                          <el-form-item label="毛重(KG)" prop="grossWt" ref="grossWt">
                            <el-input v-model="decHead.grossWt" :maxlength="20"
                              :class="{ 'require-color': controller.requireColor }"
                              @focus="tipsFillMessage('grossWt')"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="净重(KG)" prop="netWt" ref="netWt">
                            <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="20"
                              @focus="tipsFillMessage('netWt')"
                              v-model="decHead.netWt"  :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="6">
                          <el-form-item label="贸易国别(地区)"  :class="{ 'require-color': controller.requireColor }"  prop="tradeAreaCode">
                            <el-select placeholder=" " v-model="decHead.tradeAreaCode"
                              @focus="tipsFillMessage('tradeAreaCode', 'saasCountry2','SAAS_COUNTRY')"
                              ref="tradeAreaCode" dataRef ='tradeAreaCode'
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasCountry2')"
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasCountry2"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="集装箱数">
                            <el-input v-model="decHead.contaCount" @focus="tipsFillMessage('contaCount')"  readonly></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="随附单证">
                            <el-input v-model="showFied.attaDocuCdstr" @focus="tipsFillMessage('attaDocuCdstr')"  readonly></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row   v-if="controller.iEFlag == 'I' && controller.funFlag == 'declaration'">
                        <!-- 进口页面显示 -->
                        <el-col :span="6">
                          <el-form-item label="入境口岸"  :class="{ 'require-color': controller.requireColor }"  prop="entyPortCode">
                            <el-select placeholder=" " v-model="decHead.entyPortCode"
                              @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                              ref="entyPortCode" dataRef ='entyPortCode'
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasInlandPort')"
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasInlandPort"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="货物存放地点"  :class="{ 'require-color': controller.requireColor && controller.iEFlag === 'I' }" prop="goodSplace" ref="goodSplace">
                            <el-input v-model="decHead.goodSplace" :maxlength="100"
                              @focus="tipsFillMessage('goodSplace')"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                          <el-form-item label="启运港"  :class="{ 'require-color': controller.requireColor }" prop="despPortCode">
                            <el-select placeholder=" " v-model="decHead.despPortCode"
                              @focus="tipsFillMessage('despPortCode', 'saasPortLin','SAAS_PORT_LIN')"
                              ref="despPortCode" dataRef ='despPortCode'
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasPortLin')"
                              enter = 'no'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasPortLin"
                                :key="item.codeField"
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
                          <el-form-item label="货物存放地点" :maxlength="100" :class="{ 'require-color': controller.requireColor && controller.iEFlag === 'I' }" prop="goodSplace" ref="goodSplace">
                            <el-input v-model="decHead.goodSplace"
                              @focus="tipsFillMessage('goodSplace')"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="离境口岸"  :class="{ 'require-color': controller.requireColor }"  prop="entyPortCode">
                            <el-select placeholder=" " v-model="decHead.entyPortCode"
                              @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                              ref="entyPortCode" dataRef ='entyPortCode'
                              remote   default-first-option
                              enter = 'no'
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasInlandPort')"
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasInlandPort"
                                :key="item.codeField"
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
                          <el-form-item label="入境口岸"  :class="{ 'require-color': controller.requireColor }"  prop="entyPortCode">
                            <el-select placeholder=" " v-model="decHead.entyPortCode"
                              @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                              ref="entyPortCode" dataRef ='entyPortCode'
                              remote   default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasInlandPort')"
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasInlandPort"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="货物存放地点"  :class="{ 'require-color': controller.requireColor && controller.iEFlag === 'I' }" prop="goodSplace" ref="goodSplace">
                            <el-input v-model="decHead.goodSplace" :maxlength="100"
                              @focus="tipsFillMessage('goodSplace')"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                          <el-form-item label="启运港"  :class="{ 'require-color': controller.requireColor }" prop="despPortCode">
                            <el-select placeholder=" " v-model="decHead.despPortCode"
                              @focus="tipsFillMessage('despPortCode', 'saasPortLin','SAAS_PORT_LIN')"
                              ref="despPortCode" dataRef ='despPortCode'
                              remote  default-first-option
                              enter = 'no'
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasPortLin')"
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasPortLin"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="报关单类型"  :class="{ 'require-color': controller.requireColor }"  prop="entryType">
                            <el-select placeholder=" " v-model="decHead.entryType"
                            @focus="tipsFillMessage('entryType', 'decType','DEC_TYPE')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('decType')"
                              ref="entryType" dataRef ='entryType'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%" @change="entryTypeChange">
                              <el-option
                                v-for="item in decType"
                                :key="item.codeField"
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
                          <el-form-item label="货物存放地点" :maxlength="100" :class="{ 'require-color': controller.requireColor && controller.iEFlag === 'I' }" prop="goodSplace" ref="goodSplace">
                            <el-input v-model="decHead.goodSplace"
                              @focus="tipsFillMessage('goodSplace')"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="离境口岸"  :class="{ 'require-color': controller.requireColor }"  prop="entyPortCode">
                            <el-select placeholder=" " v-model="decHead.entyPortCode"
                              @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                              ref="entyPortCode" dataRef ='entyPortCode'
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasInlandPort')"
                              enter = 'no'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasInlandPort"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="报关单类型"  :class="{ 'require-color': controller.requireColor }"  prop="entryType">
                            <el-select placeholder=" " v-model="decHead.entryType"
                              @focus="tipsFillMessage('entryType', 'decType','DEC_TYPE')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('decType')"
                              ref="entryType" dataRef ='entryType'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%" @change="entryTypeChange">
                              <el-option
                                v-for="item in decType"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="6" v-if= "controller.funFlag === 'declaration' ">
                          <el-form-item label="报关单类型"  :class="{ 'require-color': controller.requireColor }"  prop="entryType">
                            <el-select placeholder=" " v-model="decHead.entryType"
                              @focus="tipsFillMessage('entryType', 'decType','DEC_TYPE')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('decType')"
                              ref="entryType" dataRef ='entryType'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%" @change="entryTypeChange">
                              <el-option
                                v-for="item in decType"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if= "controller.funFlag === 'recordList'">
                          <el-form-item label="清单类型"  :class="{ 'require-color': controller.requireColor }"  prop="billtype">
                            <el-select placeholder=" " v-model="decHead.billtype"
                              @focus="tipsFillMessage('billtype', 'billType', 'BILL_TYPE')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('billType')"
                              ref="billtype" dataRef ='billtype'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%" >
                              <el-option
                                v-for="item in billType"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="备注">
                            <el-input v-model="decHead.noteS" :maxlength="255"
                              type="textarea"
                              class='dec-textarea'
                              @keydown.enter.native="prevent"
                              @focus="tipsFillMessage('noteS')"
                              @keyup.native= "computLength('1')"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6" >
                          <div style='display: inline-block;width: 50%;'>
                            <span >{{'(' + showFied.noteLenght + ')字节'}}</span>
                            <el-button class="btn-pop" icon="fa fa-ellipsis-h" @click="openNote('1')"></el-button>
                          </div>
                          <div style='display: inline-block;width: 48%;'>
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
                          <el-form-item label="标记唛码" prop="markNo" ref="markNo">
                            <el-input v-model="decHead.markNo"
                              :class="{ 'require-color': controller.requireColor }"
                              type="textarea"
                              class='dec-textarea'
                              dataRef = 'markNo'
                              :maxlength="400"
                              @keydown.enter.native="prevent"
                              @keyup.native= "computLength('2')"
                              @focus="tipsFillMessage('markNo')"
                              :readonly="controller.isDisabled">
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <div style='display: inline-block;width: 50%;'>
                            <span >{{'(' + showFied.markNoLength + ')字节'}}</span>
                            <el-button class="btn-pop" icon="fa fa-ellipsis-h" @click="openNote('2')"></el-button>
                            <el-button class="btn-pop" icon="fa fa-bullseye" @click="openAccessory"></el-button>
                          </div>
                          <div style='display: inline-block;width: 48%;'>
                            <el-button type="primary" @click="openBussiness" class="w-100">业务事项</el-button>
                          </div>
                        </el-col>
                      </el-row>
                      <div v-show="isShow1">
                        <el-row   >
                          <el-col :span="12">
                            <el-form-item label="检验检疫受理机关"  :class="{ 'require-color': controller.requireColor }"  prop="orgCode">
                              <el-select placeholder=" " v-model="decHead.orgCode"
                                @focus="tipsFillMessage('orgCode', 'saasCiqOrganization1','SAAS_CIQ_ORGANIZATION')"
                                dataRef ='orgCode' ref="orgCode"
                                remote  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('saasCiqOrganization1')"
                                clearable filterable :disabled="controller.isDisabled" style="width:100%">
                                <el-option
                                  v-for="item in saasCiqOrganization1"
                                  :key="item.codeField"
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
                            <el-form-item label="领证机关"  :class="{ 'require-color': controller.requireColor }"  prop="vsaOrgCode">
                              <el-select placeholder=" " v-model="decHead.vsaOrgCode"
                                @focus="tipsFillMessage('vsaOrgCode', 'saasCiqOrganization2','SAAS_CIQ_ORGANIZATION')"
                                ref="vsaOrgCode" dataRef ='vsaOrgCode'
                                remote  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('saasCiqOrganization2')"
                                clearable filterable :disabled="controller.isDisabled" style="width:100%">
                                <el-option
                                  v-for="item in saasCiqOrganization2"
                                  :key="item.codeField"
                                  :label="item.codeField + '-' + item.nameField"
                                  :value="item.codeField">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="controller.iEFlag === 'I' ? 6 : 12">
                            <el-form-item label="口岸检验检疫机关"  :class="{ 'require-color': controller.requireColor }" prop="inspOrgCode">
                              <el-select placeholder=" " v-model="decHead.inspOrgCode"
                                @focus="tipsFillMessage('inspOrgCode', 'saasCiqOrganization3','SAAS_CIQ_ORGANIZATION')"
                                ref="inspOrgCode" dataRef ='inspOrgCode'
                                remote  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('saasCiqOrganization3')"
                                clearable filterable :disabled="controller.isDisabled" style="width:100%">
                                <el-option
                                  v-for="item in saasCiqOrganization3"
                                  :key="item.codeField"
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
                                :disabled="controller.isDisabled"
                                value-format="yyyyMMdd"
                                format='yyyyMMdd'
                                placeholder=" ">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6" v-if="controller.iEFlag === 'I'">
                            <el-form-item label="B/L号">
                              <el-input v-model="decHead.blno" :readonly="controller.isDisabled"
                              :maxlength="50"
                              @focus="tipsFillMessage('blno')"
                              ></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row  >
                          <el-col :span="controller.iEFlag === 'I' ? 6 : 12">
                            <el-form-item label="目的地检验检疫机关"  :class="{ 'require-color': controller.requireColor }"  prop="purpOrgCode">
                              <el-select placeholder=" " v-model="decHead.purpOrgCode"
                                @focus="tipsFillMessage('purpOrgCode', 'saasCiqOrganization4','SAAS_CIQ_ORGANIZATION')"
                                ref="purpOrgCode" dataRef ='purpOrgCode'
                                remote  default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('saasCiqOrganization4')"
                                clearable filterable :disabled="controller.isDisabled" style="width:100%">
                                <el-option
                                  v-for="item in saasCiqOrganization4"
                                  :key="item.codeField"
                                  :label="item.codeField + '-' + item.nameField"
                                  :value="item.codeField">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="关联号码及理由" >
                              <el-col :span="12">
                                <el-input v-model="decHead.correlationaNo" :maxlength="500"
                                  @focus="tipsFillMessage('correlationaNo')"
                                  placeholder="关联号码" :readonly="controller.isDisabled"></el-input>
                              </el-col>
                              <el-col :span="12">
                                <el-select v-model="decHead.correlationReasonFlag"
                                  @focus="tipsFillMessage('correlationReasonFlag', 'saasCorrelationReason','SAAS_CORRELATION_REASON')"
                                  remote default-first-option
                                  :remote-method="checkParamsList"
                                  @clear="clearSelct('saasCorrelationReason')"
                                  ref="correlationReasonFlag" dataRef ='correlationReasonFlag'
                                  clearable filterable :disabled="controller.isDisabled" style="width:100%" placeholder="关联理由">
                                  <el-option
                                    v-for="item in saasCorrelationReason"
                                    :key="item.codeField"
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
                              <el-select placeholder=" " v-model="decHead.origBoxFlag"
                                @focus="tipsFillMessage('origBoxFlag', 'commomPara1','COMMON_PARA')"
                                filterable clearable remote default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('commomPara1')"
                                ref="origBoxFlag" dataRef ='origBoxFlag'
                                :disabled="controller.isDisabled" style="width:100%" >
                                <el-option
                                  v-for="item in commomPara1"
                                  :key="item.codeField"
                                  :label="item.codeField + '-' + item.nameField"
                                  :value="item.codeField">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="controller.iEFlag == 'I' ? 6 : 12">
                            <el-form-item label="特殊业务标识" >
                              <el-col :span="controller.iEFlag == 'I' ? 18 : 20">
                                <el-input v-model="showFied.specDeclFlagValue" @focus="tipsFillMessage('specDeclFlagValue')" readonly></el-input>
                              </el-col>
                              <el-col :span="controller.iEFlag == 'I' ? 6 : 4">
                                <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openSpecialBusiContent"></el-button>
                              </el-col>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="所需单证">
                              <el-input v-model="showFied.appCertName" @focus="tipsFillMessage('appCertName')" readonly></el-input>
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
                </div>
                <!---表头结束  -->
                <!--- table 开始  -->
                <div class = "dec-div" >
                  <el-row>
                    <el-button size="mini" icon="fa fa-sign-in" class="secondButton" :disabled="controller.isDisabled || controller.importIsDisabled || controller.cDisabled" @click="openImport">&nbsp;导入</el-button>
                    <el-button size="mini" icon="fa fa-plus" class="secondButton" :disabled="controller.isDisabled || controller.refreshIsDisabled || controller.cDisabled"  @click="refreshDecList">&nbsp;新增</el-button>
                    <el-button size="mini" icon="fa fa-trash-o" class="secondButton" :disabled="controller.isDisabled"  @click="delDecList" >&nbsp;删除</el-button>
                    <el-button size="mini" icon="fa fa-copy" class="secondButton" :disabled="controller.isDisabled" @click="copyDecList">&nbsp;复制</el-button>
                    <el-button size="mini" icon="fa fa-arrow-up" class="secondButton" :disabled="controller.isDisabled" @click="moveUpDecList">&nbsp;上移</el-button>
                    <el-button size="mini" icon="fa fa-arrow-down" class="secondButton" :disabled="controller.isDisabled" @click="downUpDecList">&nbsp;下移</el-button>
                    <el-button size="mini" icon="fa fa-level-down" class="secondButton" :disabled="controller.isDisabled || controller.insertIsDisabled || controller.cDisabled" @click="insertDecList">&nbsp;插入</el-button>
                    <el-button size="mini" class="secondButton" :disabled="controller.isDisabled || controller.reClassifyIsDisabled || controller.cDisabled" @click="reClassify">重新归类</el-button>
                    <el-button size="mini" class="secondButton"  @click="lookClassify">归类查看</el-button>
                    <el-button size="mini" class="secondButton" :disabled="controller.isDisabled" @click="BulkEditing">批量修改</el-button>
                    <!-- <el-button size="mini" class="secondButton"  @click="openSuppDec">补充申报</el-button> -->
                    <el-button size="mini" class="secondButton" :disabled="controller.isDisabled" @click="openHistoryGoods">使用商品库数据</el-button>
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
                      @keydown.native.prevent='changeBody'
                      @select="decListCheckChange"
                      @selection-change="decListChange"
                      @row-click='rowClickDecList'>
                        <el-table-column min-width="50" label="单选" v-if='!isCheckbox'>
                          <template slot-scope="scope">
                            <el-radio v-model="bodyListRadio" @click.native='checkThisBody(scope.$index)' :label="scope.$index">&nbsp;</el-radio>
                          </template>
                        </el-table-column>
                        <el-table-column type='selection' width="37" v-else></el-table-column>
                        <el-table-column prop="gNo" label="项号" width="55"></el-table-column>
                        <el-table-column prop="contrItem" label="备案序号" min-width="80"></el-table-column>
                        <el-table-column prop="codeTs" label="商品编号" min-width="100"></el-table-column>
                        <el-table-column prop="ciqName" label="检验检疫名称" min-width="180"></el-table-column>
                        <el-table-column prop="gName" label="商品名称" min-width="200"></el-table-column>
                        <el-table-column prop="gModel" label="规格" min-width="200"></el-table-column>
                        <el-table-column prop="gQty" label="成交数量" min-width="100"></el-table-column>
                        <el-table-column prop="gUnitValue" label="成交单位" min-width="80"></el-table-column>
                        <el-table-column prop="declPrice" label="单价" min-width="80"></el-table-column>
                        <el-table-column prop="declTotal" label="总价" min-width="100"></el-table-column>
                        <el-table-column prop="tradeCurrValue" label="币制" min-width="100"></el-table-column>
                        <el-table-column prop="originCountryValue" label="原产国(地区)" min-width="100"></el-table-column>
                        <el-table-column prop="destinationCountryValue" label="最终目的国" min-width="100"></el-table-column>
                        <el-table-column prop="dutyModeValue" label="征免方式" min-width="80"></el-table-column>
                        <el-table-column prop="controlMa" label="监管要求" width="80"></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </div>
                <!--- table 结束  -->
                <div class="dec-div dec-page-bottom">
                  <el-form ref="bodyRuleForm" :rules="bodyRuleForm" @keyup.enter.native="switchFoucsByEnter"  :model="decList"  label-width="100px" size="mini">
                      <el-row  >
                        <el-col :span="6">
                          <el-form-item label="项号">
                            <el-input v-model="decList.gNo" @focus="tipsFillMessage('gNo')" disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="备案序号" ref="contrItem">
                            <el-input v-model="decList.contrItem" @focus="tipsFillMessage('contrItem')"
                              @blur="selectBookBody"
                              :readonly="controller.contrItemDisabled || controller.cDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="商品编号"  prop="codeTs" ref="codeTs">
                            <el-input  :class="{ 'require-color': controller.requireColor }"
                            @focus="tipsFillMessage('codeTs')"
                            v-model="decList.codeTs"
                            :readonly="controller.isDisabled || controller.cDisabled"
                            :maxlength="10"
                            enter = 'no' @input="codeTsChangeF"
                            @blur="openProductList()"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="检验检疫名称" >
                            <el-col :span="21" >
                              <el-input v-model="decList.ciqName" readonly></el-input>
                              <div class='shade-div' @click ="cancelCiqName"></div>
                            </el-col>
                            <el-col :span="3">
                              <el-button class="btn-pop" icon="fa fa-ellipsis-h" @click="openEncodeTableContent"></el-button>
                            </el-col>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="8">
                          <el-form-item label="商品名称" prop="gName" ref="gName">
                            <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="255"
                            @focus="tipsFillMessage('gName')" dataRef='gName'
                            v-model="decList.gName"  :readonly="controller.isDisabled || controller.cDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="规格型号">
                            <el-input v-model="decList.gModel" ref='gModel' @focus="tipsFillMessage('gModel')" readonly></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="监管要求">
                            <el-input v-model="decList.controlMa" disabled></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="5">
                          <el-form-item label="成交数量" prop="gQty" ref="gQty">
                            <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="20"
                              @focus="tipsFillMessage('gQty')"
                              @blur="gQtyBlur"
                              enter='no'
                            v-model="decList.gQty"  :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="成交计量单位"  :class="{ 'require-color': controller.requireColor }">
                            <el-select placeholder=" " v-model="decList.gUnit"
                              @focus="tipsFillMessage('gUnit', 'saasUnit1','SAAS_UNIT')"
                              ref="gUnit" dataRef ='gUnit'
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasUnit1')"
                            clearable filterable
                            :disabled="controller.isDisabled || controller.gUnitReadonly || controller.cDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasUnit1"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="单价"  prop="declPrice" ref="declPrice" label-width="50px"
                          :class="{ 'require-color': controller.requireColor }">
                            <el-input v-model="decList.declPrice" :maxlength="19"
                            @focus="tipsFillMessage('declPrice')"
                            @blur="computTotal('1')"
                            :readonly="controller.isDisabled || controller.cDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="总价" prop="declTotal" ref="declTotal" label-width="50px">
                            <el-input  :class="{ 'require-color': controller.requireColor }"
                            :maxlength="18" v-model="decList.declTotal"
                            @focus="tipsFillMessage('declTotal')"
                            ref = 'declTotal2'
                            @blur="computPrice"
                            :readonly="controller.isDisabled || controller.cDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item label="币制" label-width="50px" :class="{ 'require-color': controller.requireColor }" prop="tradeCurr">
                            <el-select placeholder=" " v-model="decList.tradeCurr"
                              @focus="tipsFillMessage('tradeCurr', 'saasCurr4','SAAS_CURR')"
                              remote clearable filterable   default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasCurr4')"
                              ref="tradeCurr" dataRef ='tradeCurr'
                              :disabled="controller.isDisabled || controller.cDisabled" style="width:100%" >
                              <el-option
                                v-for="item in saasCurr4"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="5">
                          <el-form-item label="法定第一数量"  :class="{ 'require-color': controller.requireColor }" prop="qty1" ref="qty1">
                            <el-input v-model="decList.qty1" :maxlength="20"
                              @focus="tipsFillMessage('qty1')"
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="法定第一计量单位" >
                            <el-select placeholder=" " v-model="decList.unit1"
                              @focus="tipsFillMessage('unit1', 'saasUnit2','SAAS_UNIT')"
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasUnit2')"
                              ref="unit1" dataRef ='unit1'
                              clearable filterable disabled style="width:100%">
                              <el-option
                                v-for="item in saasUnit2"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="加工成品单耗版本号" label-width="120px"  prop="exgVersion" ref="exgVersion">
                            <el-input v-model="decList.exgVersion" :maxlength="8"
                              @focus="tipsFillMessage('exgVersion')"
                              @input='decCheckInt("decList", "exgVersion", 8)'
                              :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item label="货号" label-width="50px">
                            <el-input v-model="decList.exgNo"  :maxlength="30"
                            @focus="tipsFillMessage('exgNo')"
                            :readonly="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="最终目的国(地区)" :class="{ 'require-color': controller.requireColor }"  prop="destinationCountry">
                            <el-select placeholder=" " v-model="decList.destinationCountry"
                              @focus="tipsFillMessage('destinationCountry', 'saasCountry3','SAAS_COUNTRY')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasCountry3')"
                              ref="destinationCountry" dataRef ='destinationCountry'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasCountry3"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row  >
                        <el-col :span="5">
                          <el-form-item label="法定第二数量"  prop="qty2" ref="qty2">
                            <el-input v-model="decList.qty2" :maxlength="20" @focus="tipsFillMessage('qty2')" :readonly="controller.qty2Disabled || controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="法定第二计量单位" >
                            <el-select placeholder=" " v-model="decList.unit2"
                              @focus="tipsFillMessage('unit2', 'saasUnit3','SAAS_UNIT')"
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasUnit3')"
                              ref="unit2" dataRef ='unit2'
                              @change = "unit2Change"
                              disabled
                              clearable filterable style="width:100%">
                              <el-option
                                v-for="item in saasUnit3"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="controller.iEFlag == 'I' ? 7 :14" >
                          <el-form-item label="原产国(地区)"  :class="{ 'require-color': controller.requireColor }" prop="originCountry">
                            <el-select placeholder=" " v-model="decList.originCountry"
                              @focus="tipsFillMessage('originCountry', 'saasCountry4','SAAS_COUNTRY')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasCountry4')"
                              ref="originCountry" dataRef ='originCountry'
                              clearable filterable :disabled="controller.isDisabled || controller.cDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasCountry4"
                                :key="item.codeField"
                                :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                                :value="item.codeField">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="7" v-if="controller.iEFlag == 'I'">
                          <el-form-item label="原产地区">
                            <el-select placeholder=" " v-model="decList.origPlaceCode "
                              @focus="tipsFillMessage('origPlaceCode', 'saasCiqOriginPlace','SAAS_CIQ_ORIGIN_PLACE')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasCiqOriginPlace')"
                              ref="origPlaceCode" dataRef ='origPlaceCode'
                              clearable filterable :disabled="controller.isDisabled" style="width:100%">
                              <el-option
                                v-for="item in saasCiqOriginPlace"
                                :key="item.codeField"
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
                          <el-form-item :label="controller.iEFlag == 'I' ? '境内目的地' :'境内货源地'" >
                            <el-col :span="12">
                              <el-form-item  prop="districtCode">
                                <el-select  :class="{ 'require-color': controller.requireColor }"  v-model="decList.districtCode"
                                  @focus="tipsFillMessage('districtCode', 'saasDistrictRel','SAAS_DISTRICT_REL')"
                                  remote default-first-option
                                  :remote-method="checkParamsList"
                                  @clear="clearSelct('saasDistrictRel')"
                                  ref="districtCode" dataRef ='districtCode'
                                  clearable filterable :placeholder="controller.iEFlag == 'I' ?  '境内目的地代码' : '境内货源地代码'" :disabled="controller.isDisabled" style="width:100%">
                                  <el-option
                                    v-for="item in saasDistrictRel"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField"
                                    :value="item.codeField">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item  prop="destCode">
                                <el-select v-model="decList.destCode" :placeholder="controller.iEFlag == 'I' ?  '目的地代码' : '产地代码'"
                                  @focus="tipsFillMessage('destCode', 'saasCiqCityCn','SAAS_CIQ_CITY_CN')"
                                  :class="{ 'require-color': controller.requireColor && controller.iEFlag == 'I' }"
                                  remote default-first-option
                                  :remote-method="checkParamsList"
                                  @clear="clearSelct('saasCiqCityCn')"
                                  clearable  filterable ref="destCode" dataRef ='destCode'
                                  :disabled="controller.isDisabled" style="width:100%">
                                  <el-option
                                    v-for="item in saasCiqCityCn"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField"
                                    :value="item.codeField">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="征免方式"  :class="{ 'require-color': controller.requireColor }"  prop="dutyMode">
                            <el-select placeholder=" " v-model="decList.dutyMode" enter="no"
                              @focus="tipsFillMessage('dutyMode', 'saasLevymode','SAAS_LEVYMODE')"
                              remote  default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasLevymode')"
                              ref="dutyMode" dataRef ='dutyMode'
                              clearable  filterable :disabled="controller.isDisabled" style="width:100%"
                              @keyup.enter.native="directSaveDecList('1')">
                              <el-option
                                v-for="item in saasLevymode"
                                :key="item.codeField"
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
                                <el-input v-model="showFied.showGoodsSpec" @focus="tipsFillMessage('showGoodsSpec')" readonly></el-input>
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
                                <el-input v-model="showFied.showGoodsAttrValue"  @focus="tipsFillMessage('showGoodsAttrValue')" readonly></el-input>
                              </el-col>
                              <el-col :span="3">
                                <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodAtrrContent"></el-button>
                              </el-col>
                            </el-form-item>
                          </el-col>
                          <el-col :span="9">
                            <el-form-item label="用途"  :class="{ 'require-color': controller.requireColor }"  prop="purpose">
                              <el-select placeholder=" " v-model="decList.purpose"
                                @focus="tipsFillMessage('purpose', 'saasUserTo','SAAS_USER_TO')"
                                remote default-first-option
                                :remote-method="checkParamsList"
                                @clear="clearSelct('saasUserTo')"
                                dataRef ='purpose'  ref="purpose"
                                clearable  filterable :disabled="controller.isDisabled" style="width:100%"
                                @keyup.enter.native="directSaveDecList('2')">
                              <el-option
                                v-for="item in saasUserTo"
                                :key="item.codeField"
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
                </div>
              </el-main>
            </el-container>
            <el-aside style="width: 20%;">
              <!-- 集装箱信息 开始-->
              <div class="dec-div">
                <el-row>
                  <!-- <el-button size="mini" icon="fa fa-sign-in" class="secondButton" :disabled="controller.isDisabled">&nbsp;导入</el-button> -->
                  <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDecConta" :disabled="controller.isDisabled">&nbsp;新增</el-button>
                  <el-button size="mini" icon="fa fa-trash-o" class="secondButton" @click="delDecConta" :disabled="controller.isDisabled">&nbsp;删除</el-button>
                </el-row>
                <el-row >
                    <el-col :span="24">
                      <el-table :data="tableDecContainerlist" :height='200'
                        ref="tableDecContainer"
                        style="width:100%" size="mini"
                        @select="decContaCheckChange"
                        @selection-change="decContaChange"
                        @row-click= 'backDecContaInfo'>
                        <el-table-column type="selection" width="37" ></el-table-column>
                        <el-table-column prop="containerNo" label="集装箱号" min-width="80"></el-table-column>
                        <el-table-column prop="containerSizeValue" label="集装箱规格" min-width="100"></el-table-column>
                        <el-table-column prop="lclFlag" label="拼箱标识" min-width="80">
                          <template slot-scope="scope">
                            <span>{{scope.row.lclFlag === '0' ? '否' : scope.row.lclFlag === '1' ? '是' : ''}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                <div>
                  <el-form ref="containerRuleForm" :rules="containerRuleForm"
                    @keyup.enter.native="switchFoucsByEnter"
                    :model="decContainer"  label-width="100px" size="mini">
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="集装箱号"  :class="{ 'require-color': controller.requireColor }" prop="containerNo" ref="containerNo">
                          <el-input v-model="decContainer.containerNo" :readonly="controller.isDisabled"
                            @focus="tipsFillMessage('containerNo')"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="集装箱规格"  :class="{ 'require-color': controller.requireColor }"  prop="containerSize">
                          <el-select placeholder=" " v-model="decContainer.containerSize"
                            @focus="tipsFillMessage('containerSize', 'saasContainerModel','SAAS_CONTAINER_MODEL')"
                            remote default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasContainerModel')"
                            ref="containerSize" dataRef ='containerSize'
                            clearable  filterable :disabled="controller.isDisabled" style="width:100%">
                            <el-option
                              v-for="item in saasContainerModel"
                              :key="item.codeField"
                              :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                              :value="item.codeField">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="自重(KG)" prop="containerWeight" ref="containerWeight">
                          <el-input v-model="decContainer.containerWeight"
                            @focus="tipsFillMessage('containerWeight')"
                            :readonly="controller.isDisabled"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="拼箱标识">
                          <el-select placeholder=" " v-model="decContainer.lclFlag"
                            @focus="tipsFillMessage('lclFlag', 'commomPara2','COMMON_PARA')"
                            filterable remote default-first-option
                            clearable
                            :remote-method="checkParamsList"
                            @clear="clearSelct('commomPara2')"
                            ref="lclFlag" dataRef ='lclFlag'
                            :disabled="controller.isDisabled" style="width:100%" >
                            <el-option
                              v-for="item in commomPara2"
                              :key="item.codeField"
                              :label="item.codeField + '-' + item.nameField"
                              :value="item.codeField">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="商品项号关系" :class="{ 'require-color': controller.requireColor }" prop="goodsNo" ref="goodsNo">
                          <el-col :span="21">
                            <el-input v-model="decContainer.goodsNo"  :readonly="controller.isDisabled"
                              @focus="tipsFillMessage('goodsNo')"
                              enter = 'no'
                              @keyup.enter.native="saveDecConta" ></el-input>
                          </el-col>
                          <el-col :span="3">
                            <el-button  class="btn-pop" icon="fa fa-ellipsis-h"  @click="openGoodsGNo" ></el-button>
                          </el-col>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
              <!-- 集装箱信息 结束-->
              <!-- 随附单证 开始 -->
              <div class="dec-div">
                <el-row>
                  <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDoc" :disabled="controller.isDisabled">&nbsp;新增</el-button>
                  <el-button size="mini" icon="fa fa-trash-o" class="secondButton" @click="delDoc" :disabled="controller.isDisabled">&nbsp;删除</el-button>
                  <el-button size="mini" class="secondButton" @click="openOriginRel" >原产地</el-button>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-table
                      :data="licenselist"
                      :height='190' style="width: 100%" size="mini"
                      ref="decLicTable"
                      highlight-current-row border
                      @select="decLicCheckChange"
                      @selection-change="decLicChange"
                      @row-click= 'backDecLicInfo' >
                      <el-table-column type="selection" width="37"></el-table-column>
                      <el-table-column prop="docuCode" label="单证代码" min-width="80"></el-table-column>
                      <el-table-column prop="certCode" label="单证编号" min-width="100"></el-table-column>
                  </el-table>
                  </el-col>
                </el-row>
                <div>
                  <el-form ref="docuRuleForm" :rules="docuRuleForm"
                    @keyup.enter.native="switchFoucsByEnter"
                    :model="decLicense" label-width="100px"  size="mini">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="随附单证代码"  :class="{ 'require-color': controller.requireColor }"  prop="docuCode">
                          <el-select placeholder=" " v-model="decLicense.docuCode"
                            @focus="tipsFillMessage('docuCode', 'saasLicensedocu','SAAS_LICENSEDOCU')"
                            remote  default-first-option clearable  filterable
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasLicensedocu')"
                            @change= "docuCodeChanage"
                            ref="docuCode" dataRef ='docuCode'
                            :disabled="controller.isDisabled" style="width:100%">
                            <el-option
                              v-for="item in saasLicensedocu"
                              :key="item.codeField"
                              :label="item.codeField + '-' + item.nameField"
                              :value="item.codeField">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="随附单证编号"  :class="{ 'require-color': controller.requireColor }" ref="certCode">
                          <el-input v-model="decLicense.certCode" :readonly="controller.isDisabled"
                            @focus="tipsFillMessage('certCode')"
                            :maxlength='32'
                            @keyup.enter.native="beforeSaveDecLic"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
              <!-- 随附单证 结束 -->
              <div class="dec-div">
                <el-form ref="datasForm" :rules='datasForm' :model="decHead"  @keyup.enter.native="switchFoucsByEnter"  label-width="100px" size="mini">
                  <el-row >
                      <el-col :span="24">
                        <el-form-item label="关联报关单">
                          <el-input v-model="decHead.relId" @focus="tipsFillMessage('relId')" :readonly="controller.isDisabled" :maxlength="18"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="关联备案" prop='relManno' ref='relManno'>
                          <el-input v-model="decHead.relManno" @focus="tipsFillMessage('relManno')" :readonly="controller.isDisabled" :maxlength="12"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="保税/监管场地">
                          <el-input v-model="decHead.bonNo"  @focus="tipsFillMessage('bonNo')" :readonly="controller.isDisabled" :maxlength="32"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24">
                        <el-form-item label="场地代码">
                          <el-input v-model="decHead.cusFie" @focus="tipsFillMessage('cusFie')" :readonly="controller.isDisabled" :maxlength="255"></el-input>
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
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="转关运输申报单" name="second">
          <bonded-transfer :initTransfer="initTransfer" :goodList="tableList" ref="bondedtrans"></bonded-transfer>
        </el-tab-pane>
        <div class='bottomDiv' v-show="tipsNoteShow"><span>{{tipsNote}}</span></div>
      </el-tabs>
      <!-- 弹出框 其他包装信息 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑其他包装信息"
        :visible.sync="otherPacksVisible"
        :close-on-click-modal='false'
        @open="otherPacksShow"
        v-dialogDrag
        width="700px">
        <div class="border">
          <el-table
            ref="otherPacksTable"
            :data="otherPackList"
            highlight-current-row border size='mini'
            @selection-change="otherPacksChangeFun"
            max-height="300" style="width: 100%">
            <el-table-column  type="selection" min-width="50"></el-table-column>
            <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
            <el-table-column  property="packType" label="包装材料种类代码" min-width="100"></el-table-column>
            <el-table-column  property="packTypeName" label="包装材料种类名称" min-width="200"></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center">
          <el-button class='layer-btn' @click="saveOtherPackageInfo" :disabled="controller.isDisabled">保存</el-button>
        </span>
      </el-dialog>
      <!-- -->
      <el-dialog :modal-append-to-body='false'
        title="其他事项确认"
        :visible.sync="otherPriceFactorVisible"
        :close-on-click-modal='false'
        @opened = 'openOthered'
        v-dialogDrag
        width="500px">
        <div class="border">
          <el-form label-width="240px" size='mini'  @keyup.enter.native="switchFoucsByEnter"
          ref='otherPriceFactorForm'
          label-position="right" :model="otherPriceFactor">
            <el-row>
              <el-col :span="24">
                <el-form-item label="特殊关系确认">
                  <el-select placeholder=" " v-model="otherPriceFactor.promiseItem1"
                    @focus="tipsFillMessage('', 'priceFactor1','PRICE_FACTOR')"
                    filterable remote default-first-option
                    clearable autofocus
                    :remote-method="checkParamsList"
                    @clear="clearSelct('priceFactor1')"
                    ref="promiseItem1" dataRef ='promiseItem1'
                    style="width:100%" @change="promiseItem1Change" >
                    <el-option
                      v-for="item in priceFactor1"
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
                <el-form-item label="价格影响确认" >
                  <el-select placeholder=" " v-model="otherPriceFactor.promiseItem2"
                    ref="promiseItem2" dataRef ='promiseItem2'
                    @focus="tipsFillMessage('', 'priceFactor2','PRICE_FACTOR')"
                    filterable remote default-first-option clearable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('priceFactor2')"
                    style="width:100%" :disabled='promiseItem2Disabed'>
                    <el-option
                      v-for="item in priceFactor2"
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
                <el-form-item label="与货物有关的特许权使用费支付确认" >
                  <el-select placeholder=" " v-model="otherPriceFactor.promiseItem3"
                    ref="promiseItem3" dataRef ='promiseItem3'
                    @focus="tipsFillMessage('', 'priceFactor3','PRICE_FACTOR')"
                    clearable filterable remote default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('priceFactor3')"
                    enter="no"
                    @keyup.enter.native="saveotherPriceFactor"
                    style="width:100%">
                    <el-option
                      v-for="item in priceFactor3"
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
        <span slot="footer" class="dialog-footer">
          <el-button  @click="saveotherPriceFactor" class="layer-btn" :disabled="controller.isDisabled">确定</el-button>
        </span>
      </el-dialog>
      <!--业务事项 弹出框 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="业务事项"
        :visible.sync="businessVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="500px">
        <el-checkbox-group v-model="checkList" class="border-margin">
          <el-checkbox label="税单无纸化" v-show="controller.declTrnrel == '0'"></el-checkbox>
          <el-checkbox label="自主报税" v-show="controller.declTrnrel == '0'"></el-checkbox>
          <el-checkbox label="水运中转" v-show="controller.iEFlag == 'E'"></el-checkbox>
          <el-checkbox label="自报自缴"></el-checkbox>
          <el-checkbox label="担保验放"></el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveBusiness" class="layer-btn" :disabled="controller.isDisabled">确定</el-button>
        </span>
      </el-dialog>
      <!--业务事项 弹出框 结束-->
      <!--使用人 弹出框 开始-->
      <el-dialog :modal-append-to-body='false'
        title="编辑使用人信息"
        :visible.sync="decUserVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="50%">
        <div class="border">
          <el-form label-width="120px" :model="userForm" size="mini" label-position="right">
            <el-row  >
              <el-col :span="12">
                <el-form-item label="使用单位联系人">
                  <el-input v-model="userForm.useOrgpersonCode" :maxlength="20" @input='checklen("userForm", "useOrgpersonCode", 20)'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="使用单位联系电话">
                  <el-input v-model="userForm.useOrgpersonTel" :maxlength="20"  @input='checklen("userForm", "useOrgpersonCode", 20)' @keyup.enter.native='saveDecUser'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-row>
            <el-button icon="fa fa-plus" @click="AddDecUser" class="secondButton" size="mini" :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-sign-in" @click="saveDecUser" class="secondButton" size="mini" :disabled="controller.isDisabled">保存</el-button>
            <el-button icon="fa fa-trash-o" @click="delDecUser" class="secondButton" size="mini" :disabled="controller.isDisabled">删除</el-button>
          </el-row>
        </div>
        <el-table  ref="userTable" :data="decHead.decDecUsers"
          highlight-current-row border size='mini'
          @selection-change="decUserchangeFun"
          @row-click="backDecUserInfo"
          max-height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  type="index" property="gNo" label="序号" min-width="50"></el-table-column>
          <el-table-column  property="useOrgpersonCode" label="使用单位联系人" min-width="100"></el-table-column>
          <el-table-column  property="useOrgpersonTel" label="使用单位联系电话" min-width="100"></el-table-column>
        </el-table>
      </el-dialog>
      <!--使用人 弹出框 结束-->
      <!-- 企业资质 弹出框 开始-->
      <el-dialog :modal-append-to-body='false'
        title="编辑企业资质信息"
        :visible.sync="entQuaVisible"
        :before-close='closeEntQua'
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        v-dialogDrag
        width="50%">
        <div class="border">
          <el-form label-width="120px" :model="copLimitsForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
            <el-row  >
              <el-col :span="12">
                <el-form-item label="企业资质类别">
                  <el-select placeholder=" " v-model="copLimitsForm.entQualiftypeCode"
                    @focus="tipsFillMessage('', 'saasEntQualifType','SAAS_ENT_QUALIF_TYPE')"
                    remote filterable  clearable default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasEntQualifType')"
                    ref="entQualiftypeCode" dataRef ='entQualiftypeCode'
                    style="width:100%" @change ="entQuaChanged" >
                    <el-option
                      v-for="(item,index) in saasEntQualifType"
                      :key="index"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业资质编号">
                  <el-input v-model="copLimitsForm.entQualifNo"  :maxlength='40' @keyup.enter.native="savedEntQua" enter = 'no'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-row class="border-bottom">
            <el-button icon="fa fa-plus" @click="AddEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-sign-in" @click="savedEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">保存</el-button>
            <el-button icon="fa fa-trash-o" @click="deldEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">删除</el-button>
          </el-row>
        </div>
        <el-table  ref="entQuaTable" :data="decHead.decCopLimits"
          highlight-current-row border size='mini'
          @selection-change="copLimitschangeFun"
          @row-click="backCopLimitsInfo"
          max-height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
          <el-table-column  property="entQualiftypeCode" label="企业资质类别代码" min-width="100"></el-table-column>
          <el-table-column  property="entQualiftypeName" label="企业资质类别名称" min-width="100"></el-table-column>
          <el-table-column  property="entQualifNo" label="企业资质编号" min-width="100"></el-table-column>
        </el-table>
        <el-checkbox v-model="copmpanyPromise" @change='cropPromiseClick'><span class="tips">企业承诺：本单位持有海关要求的合格保证、标签标识及其他证明声明材料，知悉相关材料内容，保证符合法律法规要求，并自存留档。</span></el-checkbox>
      </el-dialog>
      <!--使用人 弹出框 结束-->
      <!--特殊业务标识 弹出框 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="特殊业务标识"
        :visible.sync="specialBusiVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="600px">
        <el-checkbox-group v-model="specialBusiList" class ='border-margin'>
          <el-row class="border-bottom">
            <el-col :span="6">
              <el-checkbox label="国际赛事"></el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-checkbox label="特殊进出军工物资"></el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-checkbox label="国际援助物资"></el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-checkbox label="国际会议"></el-checkbox>
            </el-col>
          </el-row>
          <el-row class="m-t-10 border-bottom">
            <el-col :span="6">
              <el-checkbox label="直通放行"></el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-checkbox label="外交礼遇"></el-checkbox>
            </el-col>
            <el-col :span="6" v-if="controller.iEFlag == 'I'" >
              <el-checkbox label="转关"></el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button  @click="sureSpecialBusi" class="layer-btn" :disabled="controller.isDisabled">确定</el-button>
        </span>
      </el-dialog>
      <!--特殊业务标识 弹出框 结束-->
      <!-- 检验检疫申报要素 弹出框 开始-->
      <el-dialog :modal-append-to-body='false'
        title="检验检疫签证申报要素"
        :visible.sync="decElementsVisible"
        :close-on-click-modal='false'
        @open="decElementsShow"
        v-dialogDrag
        width="60%">
        <el-table  ref="decElementsTable" :data="decElementsList"
          highlight-current-row border size='mini'
          @selection-change="decElementsChangeFun"
          max-height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
          <el-table-column  property="appCertCode" label="证书代码" min-width="50"></el-table-column>
          <el-table-column  property="appCertName" label="证书名称" min-width="150"></el-table-column>
          <el-table-column  property="applOri" label="正本数量" min-width="50">
            <template slot-scope="scope">
              <input v-model="scope.row.applOri" maxlength='50'>
            </template>
          </el-table-column>
          <el-table-column  property="applCopyQuan" label="副本数量" min-width="50">
            <template slot-scope="scope">
              <input v-model="scope.row.applCopyQuan" maxlength='50'>
            </template>
          </el-table-column>
        </el-table>
        <div class="border m-t-10">
          <el-form label-width="140px" size="mini" label-position="right" v-if = "controller.iEFlag == 'I'">
          <el-row >
              <el-col :span="24">
                <el-form-item label="境内收发货人名称(外文)" class="sys-d-title">
                  <el-input v-model="decHead.domesticConsigneeEname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="境外收发货人名称(中文)" class="sys-d-title">
                  <el-input v-model="decHead.overseasConsignorCname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="境外发货人地址" class="sys-d-title">
                  <el-input v-model="decHead.overseasConsignorAddr" :maxlength='100'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="卸毕日期">
                  <el-date-picker
                    v-model="decHead.cmplDschrgDt"
                    @change='cmplDschrgDtChange'
                    type="date"
                    value-format="yyyyMMdd"
                    format='yyyyMMdd'
                    style="width:100%"
                    placeholder=" ">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="商品英文名称">
                  <el-col :span="20">
                    <el-input v-model="decHead.gEnName" disabled></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodsEnConent" ></el-button>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form label-width="140px" size="mini" label-position="right" v-else>
          <el-row >
              <el-col :span="24">
                <el-form-item label="境内收发货人名称(外文)" class="sys-d-title">
                  <el-input v-model="decHead.domesticConsigneeEname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="境外收发货人名称(中文)" class="sys-d-title">
                  <el-input v-model="decHead.overseasConsignorCname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="商品英文名称">
                  <el-col :span="20">
                    <el-input v-model="decHead.gEnName" disabled></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodsEnConent" ></el-button>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="layer-btn" @click="savedDcElements" :disabled="controller.isDisabled">保存</el-button>
        </span>
      </el-dialog>
      <!--检验检疫签证申报要素 弹出框 结束-->
      <!-- 弹出框 检验检疫编码列表 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="检验检疫编码列表"
        :visible.sync="encodeTableVisible"
        @opened = 'openencodeListAfter'
        :close-on-click-modal='false'
        v-dialogDrag
        width="640px">
        <el-table  ref="encodeTable" :data="encodeTableList" highlight-current-row border size='mini'  @selection-change="encodeTableChanged" max-height="300" style="width: 100%">
          <el-table-column  min-width="50"  >
            <template slot-scope="scope">
                <el-radio v-model="encodeListRadio" @keyup.enter.native="saveEncodeTableVaue"  :label="scope.$index">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column  property="gNameNote" label="名称" min-width="100"></el-table-column>
          <el-table-column  property="typeName" label="类型" min-width="100"></el-table-column>
          <el-table-column  property="codeTs" label="HS代码" min-width="100"></el-table-column>
          <el-table-column  property="hsGName" label="HS名称" min-width="100"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button  class="dialog-primary-btn"  @click="saveEncodeTableVaue" :disabled="controller.isDisabled">确定</el-button>
          <el-button  class="dialog-btn"  size="mini" @click="closeEncodeTable">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 检验检疫编码列表 结束 -->
      <!-- 弹出框 货物属性 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="货物属性"
        :visible.sync="goodsAttrVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="640px">
        <el-row :gutter="30" style='border: 0px;'>
          <el-checkbox-group v-model="goodsAttrCollection" @change='goodsAttrChange'>
            <el-col :span="6" v-for="(item,index) in saasGoodsAttr" :key="index" class="m-t-10">
              <div style="width:100%;height:100%">
                <el-checkbox-button :label="item.codeField + '-' + item.nameField" border style="width:100%;height:100%"></el-checkbox-button>
              </div>
            </el-col>
          </el-checkbox-group>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button class="dialog-primary-btn" @click="saveGoodsAttr" :disabled="controller.isDisabled">确定</el-button>
          <el-button class="dialog-btn"  size="mini" @click="closeGoodsAttr">取消</el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 货物属性 结束 -->
      <!-- 检验检疫货物规格 弹出框 开始-->
      <el-dialog :modal-append-to-body='false'
        title="编辑检验检疫货物规格"
        :visible.sync="goodsSpecVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="540px">
        <div class="border">
          <el-form label-width="100px"
            @keyup.enter.native="switchFoucsByEnter"
            size="mini" label-position="right" :data="goodsSpecForm">
            <el-row >
              <el-col :span="24">
                <el-form-item label="成分/原料/组分">
                  <el-input v-model="goodsSpecForm.stuffNote" autofocus  @input='checklen("goodsSpecForm", "stuffNote", 400)'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="产品有效期">
                  <el-date-picker
                    v-model="goodsSpecForm.prodValidDt"
                    @change='prodValidDtChange'
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
                  <el-input v-model="goodsSpecForm.prodQgp"  @input='decCheckInt("goodsSpecForm", "prodQgp", 20)' ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="境外生产企业">
                  <el-input v-model="goodsSpecForm.engManentCnm" @input='checklen("goodsSpecForm", "engManentCnm", 100)'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="货物规格">
                  <el-input v-model="goodsSpecForm.goodsSpec" @input='checklen("goodsSpecForm", "goodsSpec", 100)'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="货物型号">
                  <el-input v-model="goodsSpecForm.goodsModel" @input='checklen("goodsSpecForm", "goodsModel", 100)'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="货物品牌">
                  <el-input v-model="goodsSpecForm.goodsBrand" @input='checklen("goodsSpecForm", "goodsBrand", 100)'></el-input>
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
            <div v-if = "controller.iEFlag == 'I'">
              <el-row >
                <el-col :span="24">
                  <el-form-item label="生产批次">
                    <el-input v-model="goodsSpecForm.prodBatchNo"  @input='checklen("goodsSpecForm", "prodBatchNo", 2000)' enter='no' @keyup.enter.native="saveGoodsSpec"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-else>
              <el-row >
                <el-col :span="24">
                  <el-form-item label="生产批次">
                    <el-input v-model="goodsSpecForm.prodBatchNo"  @input='checklen("goodsSpecForm", "prodBatchNo", 2000)'></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="24">
                  <el-form-item label="生产单位代码">
                    <el-input v-model="goodsSpecForm.mnufctrRegno"  @input='checklen("goodsSpecForm", "mnufctrRegno", 20)' enter='no' @keyup.enter.native="saveGoodsSpec"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="layer-btn" size="mini" @click="saveGoodsSpec" :disabled="controller.isDisabled">确定</el-button>
        </span>
      </el-dialog>
      <!--检验检疫货物规格 弹出框 结束-->
      <!-- 弹出框 商品列表 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="商品列表"
        :visible.sync="productListVisible"
        :close-on-click-modal='false'
        @opened = 'openProductListAfter'
        v-dialogDrag
        width="640px">
        <el-table
          ref="productListTable"
          :data="productList"
          highlight-current-row border
          size='mini'
          @keyup.native='updownSelect'
          max-height="300" style="width: 100%">
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
          <el-button class="dialog-primary-btn" @click="saveProductList" :disabled="controller.isDisabled">确定</el-button>
          <el-button class="dialog-btn" @click="saveProductList">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 商品列表 结束 -->
      <!-- 弹出框 产品许可证/审批/备案信息  开始 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑产品许可证/审批/备案信息"
        :visible.sync="filingInfoVisible"
        :before-close="filingInfoClose"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        v-dialogDrag
        width="80%">
        <div class="border">
          <el-form label-width="100px" :model="filingInfoForm" size="mini"
          @keyup.enter.native="switchFoucsByEnter"
          label-position="right" ref="licRuleForm" :rules="licRuleForm">
            <el-row>
              <el-col :span="6">
                <el-form-item label="商品编码">
                  <el-input v-model="decList.codeTs" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品名称">
                  <el-input v-model="decList.gName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="检验检疫名称">
                  <el-input v-model="decList.ciqName" disabled></el-input>
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
                <el-form-item label="许可证类别" :class="{ 'require-color': controller.requireColor }"  prop="licTypeCode"  ref="licTypeCode">
                <el-select placeholder=" " v-model="filingInfoForm.licTypeCode"
                  @focus="tipsFillMessage('', 'saasLicType1','SAAS_LIC_TYPE')"
                  remote filterable clearable  default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasLicType1')"
                  dataRef='licTypeCode'
                  style="width:100%" autofocus>
                    <el-option
                      v-for="(item,index) in saasLicType1"
                      :key="index"
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
                  <el-select placeholder=" " v-model="filingInfoForm.licWrtofQtyUnit"
                    @focus="tipsFillMessage('licWrtofQtyUnit', 'saasUnit4','SAAS_UNIT')"
                    ref="licWrtofQtyUnit" dataRef ='licWrtofQtyUnit'
                    remote  default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasUnit4')"
                    :maxlength="3"
                    enter = 'no'
                    @keyup.enter.native ='savefilingInfo'
                    clearable filterable :disabled="controller.isDisabled"
                    style="width:100%">
                    <el-option
                      v-for="item in saasUnit4"
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
        <div>
          <el-row>
            <el-button icon="fa fa-plus" @click="AddfilingInfo" class='secondButton' :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-sign-in" @click="savefilingInfo" class='secondButton'  :disabled="controller.isDisabled">保存</el-button>
            <el-button icon="fa fa-trash-o" @click="delfilingInfo" class='secondButton'  :disabled="controller.isDisabled">删除</el-button>
            <el-button  @click="openLicVIN" class='secondButton'>许可证VIN信息</el-button>
          </el-row>
        </div>
        <el-table  ref="filingInfoTable" :data="decList.decGoodsLimits"
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
          <el-table-column  property="licWrtofQtyUnitVaue" label="核销数量单位" min-width="80"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 弹出框 产品许可证/审批/备案信息 结束 -->
      <!-- 弹出框 许可证VIN  开始 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑许可证VIN"
        :visible.sync="licVINVisible"
        :before-close="licVINClose"
        :close-on-click-modal='false'
        v-dialogDrag
        width="70%">
        <div class="border">
            <el-form label-width="120px" :model="licVINForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
              <el-row  >
                <el-col :span="6">
                  <el-form-item label="序号">
                    <el-input v-model="licVINForm.gNo" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="许可证类别">
                    <el-select placeholder=" " v-model="licVINForm.licTypeCode" disabled
                      ref="licTypeCode" dataRef='licTypeCode'
                      @focus="tipsFillMessage('', 'saasLicType2','SAAS_LIC_TYPE')"
                      remote  default-first-option
                      :remote-method="checkParamsList"
                      @clear="clearSelct('saasLicType2')"
                      style="width:100%" >
                      <el-option
                        v-for="(item,index) in saasLicType2"
                        :key="index"
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
                    <el-input v-model="licVINForm.vinNo" @input='checklen("licVINForm", "vinNo", 100)' :maxlength="100" autofocus></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="提/运单日期">
                    <el-date-picker
                      v-model="licVINForm.billLaddate"
                      type="date"
                      :editable='false'
                      style="width:100%"
                      value-format="yyyy-MM-dd"
                      placeholder=" ">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="质量保质期">
                    <el-input v-model="licVINForm.qualityQgp" @input='checklen("licVINForm", "qualityQgp", 100)' :maxlength="100"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="车辆识别代码(VIN)" >
                    <el-input v-model="licVINForm.vinCode" @input='checklen("licVINForm", "vinCode", 20)' :maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  >
                <el-col :span="9">
                  <el-form-item label="发动机号或电机号" >
                    <el-input v-model="licVINForm.motorNo" @input='checklen("licVINForm", "motorNo", 100)' :maxlength="100"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="发票号">
                    <el-input v-model="licVINForm.invoiceNo" @input='checklen("licVINForm", "invoiceNo", 30)' :maxlength="30" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="发票所列数量" >
                    <el-input v-model="licVINForm.invoiceNum" @input='checklen("licVINForm", "invoiceNum", 14)' placeholder="只能输入自然数"  :maxlength="14" @blur="invoiceNumValid"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  >
                <el-col :span="12">
                  <el-form-item label="品名(中文名称)" >
                    <el-input v-model="licVINForm.prodCnnm" @input='checklen("licVINForm", "prodCnnm", 500)'  :maxlength="500" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="品名(英文名称)" >
                    <el-input v-model="licVINForm.prodEnnm" @input='checklen("licVINForm", "prodEnnm", 500)'  :maxlength="500" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  >
                <el-col :span="12">
                  <el-form-item label="型号（英文)">
                    <el-input v-model="licVINForm.modelEn" @input='checklen("licVINForm", "modelEn", 500)'  :maxlength="500" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="底盘(车架)号" >
                    <el-input v-model="licVINForm.chassisNo" @input='checklen("licVINForm", "chassisNo", 20)' :maxlength="20" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="单价">
                    <el-input v-model="licVINForm.pricePerunit" @input='checklen("licVINForm", "pricePerunit", 20)'  :maxlength="20" enter = 'no' @keyup.enter.native ='savelicVIN'></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
        </div>
        <div>
          <el-row>
            <el-button icon="fa fa-plus" @click="AddlicVIN" class='secondButton' :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-save" @click="savelicVIN" class='secondButton' :disabled="controller.isDisabled">保存</el-button>
            <el-button icon="fa fa-trash-o" @click="dellicVIN" class='secondButton' :disabled="controller.isDisabled">删除</el-button>
          </el-row>
        </div>
        <el-table  ref="licVINTable" :data="filingInfoForm.decGoodsLimitvins"
          highlight-current-row border size='mini'
          @selection-change="licVINChangeFun"
          @row-click="backLicVINInfo"
          height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="gNo" label="VIN序号" min-width="50"></el-table-column>
          <el-table-column  property="billLaddate" label="提/运单日期" min-width="100"></el-table-column>
          <el-table-column  property="qualityQgp" label="质量保质期" min-width="80"></el-table-column>
          <el-table-column  property="motorNo" label="发动机号或电机号" min-width="100"></el-table-column>
          <el-table-column  property="vinCode" label="车辆识别代码(VIN)" min-width="100"></el-table-column>
          <el-table-column  property="chassisNo" label="底盘(车架)号" min-width="100"></el-table-column>
          <el-table-column  property="invoiceNo" label="发票号" min-width="100"></el-table-column>
          <el-table-column  property="invoiceNum" label="发票所列数量" min-width="80"></el-table-column>
          <el-table-column  property="prodCnnm" label="品名(中文名称)" min-width="120"></el-table-column>
          <el-table-column  property="prodEnnm" label="品名(英文名称)" min-width="120"></el-table-column>
          <el-table-column  property="modelEn" label="型号(英文)" min-width="120"></el-table-column>
          <el-table-column  property="pricePerunit" label="单价" min-width="50"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 弹出框 产品许可证/审批/备案信息 结束 -->
      <!-- 弹出框 危险货物信息 开始  -->
      <el-dialog :modal-append-to-body='false'
        title="编辑危险货物信息"
        :visible.sync="dangerGoodsVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="540px">
        <div class="border">
          <el-form label-width="100px" size="mini" label-position="right" :data="decList" @keyup.enter.native="switchFoucsByEnter">
            <el-row >
              <el-col :span="24">
                <el-form-item label="非危险化学品">
                <el-select placeholder=" " v-model="decList.noDangFlag"
                    @focus="tipsFillMessage('', 'commomPara3','COMMON_PARA')"
                    filterable clearable remote default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('commomPara3')"
                    ref="noDangFlag" dataRef='noDangFlag'
                    style="width:100%" autofocus>
                    <el-option
                      v-for="item in commomPara3"
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
                <el-form-item label="UN编码">
                  <el-input v-model="decList.unCode" @input='checklen("decList", "unCode", 20)' maxlength='20'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="危险货物名称">
                  <el-input v-model="decList.dangName" @input='checklen("decList", "dangName", 80)' maxlength='80'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="危包类别">
                  <el-select placeholder=" " clearable  v-model="decList.dangPackType" style="width:100%"
                    @focus="tipsFillMessage('', 'dangerLevel','DANGER_LEVEL')"
                    filterable remote default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('dangerLevel')"
                    ref="dangPackType" dataRef='dangPackType'>
                    <el-option
                      v-for="item in dangerLevel"
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
                <el-form-item label="危包规格">
                  <el-input v-model="decList.dangPackSpec" @input='checklen("decList", "dangPackSpec", 24)'  maxlength='24' enter = 'no' @keyup.enter.native="sureDangerGoods"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="layer-btn" @click="sureDangerGoods" :disabled="controller.isDisabled">确定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 危险货物信息 结束 -->
      <!-- 弹出框 商品项号关系 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑商品项号关系"
        :visible.sync="goodsGNoVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        @open="GoodsGNoShow"
        width="640px">
        <el-table
          ref="goodsGNoTable"
          :data="tableList"
          highlight-current-row border
          size='mini'
          @selection-change="goodsGNoChange"
          max-height="300" style="width: 100%">
          <el-table-column label="选中" min-width="50" type="selection">
          </el-table-column>
          <el-table-column  property="gNo" label="商品编号" min-width="100"></el-table-column>
          <el-table-column  property="codeTs" label="商品编号" min-width="100"></el-table-column>
          <el-table-column  property="gName" label="商品名称" min-width="100"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button class="layer-btn" @click="saveGoodsGNo" :disabled="controller.isDisabled">确定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 商品项号关系 结束 -->
      <!-- 弹出框 原产地对应关系录入 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="原产地对应关系录入"
        :visible.sync="originRelVisible"
        :before-close= 'colseOriginRel'
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        @opened = 'openOriginReled'
        v-dialogDrag
        width="640px">
        <div class='border'>
          <el-form label-width="150px" ref="originRelRuleForm"
          @keyup.enter.native="switchFoucsByEnter"
          :rules="originRelRuleForm" size="mini" label-position="right" :model="originRelForm">
            <el-row>
              <el-col :span="12">
                <el-form-item label="报关单商品序号" prop="decGno" ref ='decGno'>
                  <el-input v-model="originRelForm.decGno" dataRef ='decGno' :maxlength="2"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="对应随附单证商品项号" prop="ecoGno" ref ='ecoGno'>
                  <el-input v-model="originRelForm.ecoGno"  dataRef ='ecoGno' :maxlength="3" @keyup.enter.native="saveOriginRel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-row>
            <el-button icon="fa fa-plus" @click="addOriginRel" class='secondButton' :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-trash-o" @click="delOriginRel" class='secondButton' :disabled="controller.isDisabled">删除</el-button>
          </el-row>
        </div>
        <el-table
          ref="riginRelTable"
          :data="decLicense.decEcoRealations"
          highlight-current-row border
          size='mini'
          @selection-change="originRelChange"
          max-height="300" style="width: 100%">
          <el-table-column label="选中" min-width="50" type="selection">
          </el-table-column>
          <el-table-column  property="decGno" label="报关单商品序号" min-width="100"></el-table-column>
          <el-table-column  property="ecoGno" label="对应随附单证商品项号" min-width="100"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 弹出框 原产地对应关系录入 结束 -->
      <!-- 弹出框 编辑商品英文名称 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑商品英文名称"
        :visible.sync="goodsEnNameVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        @open="goodsEnNameShow"
        width="640px">
        <el-table
          ref="goodsEnNameTable"
          :data="goodsEnNameList"
          highlight-current-row border
          size='mini'
          @selection-change="goodsEnNameChange"
          max-height="300" style="width: 100%">
          <el-table-column label="选中" min-width="50" type="selection"></el-table-column>
          <el-table-column  property="gNo" label="商品编号" min-width="100"></el-table-column>
          <el-table-column  property="codeTs" label="商品编号" min-width="100"></el-table-column>
          <el-table-column  property="gName" label="商品名称" min-width="100"></el-table-column>
          <el-table-column  property="declGoodsEname" label="商品英文名称" min-width="100">
            <template slot-scope="scope">
              <input v-model="scope.row.declGoodsEname">
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button class="layer-btn" @click="saveGoodsEnName" :disabled="controller.isDisabled">保存</el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 编辑商品英文名称 结束 -->
      <!--修改单价总价 弹出框 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="报关修改单价/总价？"
        :visible.sync="modifyPriceVisible"
        :close-on-click-modal='false'
        :show-close='false'
        v-dialogDrag
        @opened = 'focusBtn'
        width="500px">
        <div class= 'priceDiv'>
          <el-button class="layer-btn2" autofocus ref = 'modifyDeclPrice'
          @keydown.enter.native="prevent"
          @keyup.enter.native="modifyPrice('1')"
          @keyup.native="switchFocus($event, '1')"
          @click="modifyPrice('1')">修改单价</el-button>
          <el-button class="layer-btn2"
          ref = 'modifyTotalPrice'
            @keydown.enter.native="prevent"
            @keyup.enter.native="modifyPrice('2')"
            @keyup.native="switchFocus($event, '2')"
          @click="modifyPrice('2')">修改总价</el-button>
        </div>
      </el-dialog>
      <!--修改单价总价 弹出框 结束-->
      <!-- 弹出框 商品规范申报-商品申报要素 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="商品规范申报-商品申报要素"
        :visible.sync="elementVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="640px">
        <decelement-view :datas="decElementPara" @submitdatas="backDecListSpace" @closedecele="cancleElement" v-if="elementVisible"></decelement-view>
      </el-dialog>
      <!-- 弹出框 商品规范申报-商品申报要素 结束 -->
      <!-- 弹出框 附注信息 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="附注信息"
        :visible.sync="additionInfoLaVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        width="640px">
        <extra-note :additionInfoLa="decHead.remarkInfo"  @backDatas="saveExtraNote" @cancLeData="cancleExtraNote" v-if="additionInfoLaVisible"></extra-note>
      </el-dialog>
      <!-- 弹出框 附注信息 结束 -->
      <!-- 弹出框 批量修改 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="批量修改"
        :visible.sync="BulkEditingVisible"
        :close-on-click-modal='false'
        v-dialogDrag
        :show-close='false'
        width="640px">
        <revise-view :decParams="BulkEditingList"  @backDatas="saveBulkEditing" @cancLeData="cancleBulkEditing" v-if="BulkEditingVisible"></revise-view>
      </el-dialog>
      <!-- 弹出框 批量修改 结束 -->
      <!-- 弹出框 随附单据 开始 -->
      <!-- <el-dialog :modal-append-to-body='false'
        title="随附单据"
        :visible.sync="accDocVisible"
        :show-close='false'
        width="640px">

      </el-dialog> -->
      <accompanying-documents :initParams="accDocData"  @backDatas="receptionAccDocData" @cancLeData="cancleAccDocData" v-if="accDocVisible"></accompanying-documents>
      <!-- 弹出框 随附单据 结束 -->
      <!-- 弹出框 批量修改 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="打印报关单"
        :visible.sync="printCompnentVisible"
        :close-on-click-modal='false'
        :show-close='false'
        v-dialogDrag
        width="640px">
        <decprint-view :initParams="printCompnentParam"  @cancLeData="closePrintCompnent"  v-if="printCompnentVisible"></decprint-view>
      </el-dialog>
      <!-- 弹出框 批量修改 结束 -->
      <!-- 弹出框 初始值模板 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="初始值模板选择"
        :visible.sync="initTemplateVisible"
        :close-on-click-modal='false'
        :show-close='false'
        v-dialogDrag
        width="640px">
        <init-template :initParams="controller.iEFlag"  @backDatas="receptionTemplateData"  @cancLeData="closeTemplateCompnent"  v-if="initTemplateVisible"></init-template>
      </el-dialog>
      <!-- 弹出框 初始值模板 结束 -->
      <!-- 弹出框 报关补充申报 开始 -->
        <supplement-declare :initParams="initSupplDec"  @backDatas="backSupplDec"  @cancLeData="closeSupplDec"  v-if="supplDecVisible"></supplement-declare>
      <!-- 弹出框 报关补充申报 结束 -->
      <!-- 弹出框 历史商品数据 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="历史商品数据"
        :visible.sync="historyGoodsVisible"
        :close-on-click-modal='false'
        :show-close='true'
        v-dialogDrag
        width="900px">
        <history-goods :initParams="initHistory"  @backDatas="historyGoodsData"  @cancLeData="historyGoodsCompnent"  v-if="historyGoodsVisible"></history-goods>
      </el-dialog>
      <!-- 弹出框 历史商品数据 结束 -->
      <!-- 弹出框 舱单数据 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="舱单调取"
        :visible.sync="mftBillVisible"
        :close-on-click-modal='false'
        :show-close='true'
        v-dialogDrag
        width="800px">
        <shipping-bill :initParams="initMftBill"  @backDatas="mftBillData"  @cancLeData="closeMftBill"   v-if="mftBillVisible"></shipping-bill>
      </el-dialog>
      <!-- 弹出框 舱单数据 结束 -->
      <!-- 弹出框 对比模板与现在的区别 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="选择需要引用模板数据"
        :visible.sync="compareVisible"
        :show-close='true'
        :close-on-click-modal='false'
        width="800px">
        <compare-template :initParams="initCompare"  @backDatas="compareData" @cancLeData="cancleCompareData"  v-if="compareVisible"></compare-template>
      </el-dialog>
      <!-- 弹出框 对比模板与现在的区别 结束 -->
      <!-- 弹出框 报关单表体导入 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="商品导入"
        :visible.sync="importCompnentVisible"
        :close-on-click-modal='false'
        class="sys-dec-class"
        width="640px">
        <execl-import :initParams="initImport" @cancLeData="closeImportCompnent" @backData="receptionImportData"  v-if="importCompnentVisible"></execl-import>
      </el-dialog>
      <!-- 弹出框 报关单表体导入 结束 -->
      <!-- 弹出框 标记唛码和备注 开始 -->
      <dec-note :initParams="initNote" @backDatas="receptionNoteData"  v-if="noteCompnentVisible"></dec-note>
      <!-- 弹出框 标记唛码和备注 结束 -->
      <!-- 弹出框 编辑标记及号码附件信息 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑标记及号码附件信息"
        :visible.sync="attachVisabled"
        :close-on-click-modal='false'
        append-to-body
        v-dialogDrag
        class='sys-dec-class'
        width="600px">
        <attachment-upload :initParams="initAttach" @backDatas="receptionAttachData"  v-if="attachVisabled"></attachment-upload>
      </el-dialog>
      <!-- 弹出框 编辑标记及号码附件信息 介素 -->
      <!-- 弹出框 减免税备案清单商品列表 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="减免税备案清单商品列表"
        :visible.sync="ZBookVisabled"
        :close-on-click-modal='false'
        :show-close='false'
        append-to-body
        v-dialogDrag
        class='sys-dec-class'
        width="80%">
        <dec-zbook :initParams="initHBook" @backDatas="receptionZBookData" @cancLeData="closeZBookCompnent"  v-if="ZBookVisabled"></dec-zbook>
      </el-dialog>
      <!-- 弹出框 减免税备案清单商品列表 结束 -->
      <!-- 弹出框 特许权使用费 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="特许权使用费"
        :visible.sync="charterVisabled"
        :close-on-click-modal='false'
        append-to-body
        v-dialogDrag
        class='sys-dec-class'
        width="75%">
        <dec-charter :data="decHead.decRoyaltyFeeVO" :username="controller.userName" :type="$route.params.operationType" @getData="getCharterForm" @closeTemplate="closeCharter" v-if="charterVisabled"></dec-charter>
      </el-dialog>
      <!-- 弹出框 特许权使用费 结束 -->
      <!-- 弹出框 选择海关 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="企业编码选择"
        :visible.sync="customsCodeVisabled"
        :close-on-click-modal='false'
        append-to-body
        v-dialogDrag
        class='sys-dec-class'
        width="400px">
        <customs-code :initParams="initCustomsCode" @backDatas="receptionCustomsCode" @cancLeData="closeCustomsCodeCompnent"  v-if="customsCodeVisabled"></customs-code>
      </el-dialog>
      <!-- 弹出框 企业编码选择 结束 -->
      <!-- 弹出框 联系单备案商品信息列表 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="联系单备案商品信息列表"
        :visible.sync="manualGoodsVisabled"
        :close-on-click-modal='false'
        append-to-body
        v-dialogDrag
        class='sys-dec-dialog'
        width="800px">
        <manual-goods :initParams="initManualGoods" @backDatas="receptionManualGoods" @cancLeData="closeManualGoods"  v-if="manualGoodsVisabled"></manual-goods>
      </el-dialog>
      <!-- 弹出框 联系单备案商品信息列表 结束 -->
    </div>
  </section>
</template>

<script>
import util from '@/common/util.js'
import decelementView from './component/decelement.vue'
import extraNote from './component/extraNote.vue'
import reviseView from './component/revise.vue'
import accompanyingDocuments from './component/accompanyingDocuments.vue'
import decprintView from './component/decPrint.vue'
import initTemplate from './component/initTemplate.vue'
import supplementDeclare from './component/supplementDeclare.vue'
import historyGoods from './component/historyGoods.vue'
import shippingBill from './component/shippingBill.vue'
import compareTemplate from './component/compareTemplate.vue'
import execlImport from './component/execImport.vue'
import decNote from './component/decNote'
import attachmentUpload from './component/attachmentUpload'
import decZbook from './component/bookList.vue'
import decCharter from './component/charteredRight.vue'
import customsCode from './component/customsCode.vue'
import manualGoods from './component/manualGoods.vue'
import bondedTransfer from './component/bondedTransfer.vue'

export default {
  components: {
    decelementView,
    extraNote,
    reviseView,
    accompanyingDocuments,
    decprintView,
    initTemplate,
    supplementDeclare,
    historyGoods,
    shippingBill,
    compareTemplate,
    execlImport,
    decNote,
    attachmentUpload,
    decZbook,
    decCharter,
    customsCode,
    manualGoods,
    bondedTransfer
  },
  data () {
    return {
      zoom: 1,
      asideWidth: 20,
      codeTsChange: false, // 判断 商品编号值是否发生改变
      bodyListRadio: '',
      isCheckbox: false,
      bodyShow: true,
      activeTab: 'first',
      tabsLabel: '进口报关单',
      decHead: {
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
        entryType: '', // 报关单类型
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
        billtype: '', // 备案清单类型
        decRoyaltyFeeVO: null // 特许权使用费
      }, // 报关单表头
      controller: {
        operationType: this.$route.params.operationType, // 记录操作类型  详情 新增  修改
        iEFlag: '', // 记录是进口页面还是出口页面 import export
        funFlag: this.$route.params.funFlag, // 功能页面 declaration 报关单   recordList 备案清单 template 初始值模板
        declTrnrel: '', // 0 报关单   2 备案清单
        pid: this.$route.params.operationType !== 'add' ? this.$route.params.pid : '', // 报关单id
        isDisabled: this.$route.params.operationType === 'look', // 判断 input button 禁用
        requireColor: true, // 显示必填的颜色
        otherCurrDisabled: false, // 杂费用币制
        feeMarkDisabled: false, // 运费币制
        feeRateDisabled: false, // 运费币制
        feeCurrDisabled: false, // 运费币制
        insurMarkDisabled: false, // 保费币制
        insurRateDisabled: false, // 保费币制
        insurCurrDisabled: false, // 保费币制
        accDocDisabled: true, // 控制 随附单据 按钮的字段
        initTemplateBtn: false, // 控制初始值模板按钮
        contrItemDisabled: true, // 控制 备案序号
        qty2Disabled: true, // 第二法定数量
        userName: '', // 当前登陆人姓名
        agentName: '', // 申报企业名称
        isSeqNo: false, // 是否切换为 统一编号 默认为关检关联号
        qty1: '', // 记录数量
        gUnitReadonly: false, // 成交数量是否能够填写
        importIsDisabled: false, // 表体导入按钮控制
        refreshIsDisabled: false, // 表体新增按钮控制
        insertIsDisabled: false, // 表体插入按钮控制
        reClassifyIsDisabled: false, // 重新归类按钮控制
        districtCode: '',
        ocrShow: false, // 如果未ocr识别过来 则为true
        cDisabled: false // 当由c单证时 控制输入项
      },
      tableList: [], // 报关单表体列表
      checkedTableList: [], // 报关单表体列表 被选中的数据
      decList: {
        decListPid: '', // 表体主键
        decPid: '', // 报关单主键
        ciqName: '', // 检验检疫名称
        codeTs: '', // 商品编号
        contrItem: '', // 备案序号
        dangName: '', // 危险货物名称
        dangPackSpec: '', // 危包规格
        dangPackType: '', // 危包类别
        decGoodsLimits: [], // 产品资质
        declPrice: '', // 单价
        declTotal: '', // 总价
        destCode: '', // 目的地代码
        destinationCountry: '', // 最终目的国（地区）
        districtCode: '', // 最终目的国（地区）名称
        dutyMode: '', // 征减免税方式
        engManentCnm: '', // 境外生产企业名称
        exgNo: '', // 货号
        exgVersion: '', // 版本号
        gModel: '', // 规格型号
        controlMa: '', // 监管要求
        gName: '', // 商品名称
        gNo: '', // 项号
        gQty: '', // 成交数量
        gUnit: '', // 成交计量单位
        gUnitValue: '', // 成交计量单位名称
        goodsAttr: '', // 货物属性 code
        goodsBrand: '', // 货物品牌
        goodsModel: '', // 货物型号
        stuffNote: '', // 成分/原料/组分
        goodsSpec: '', // 货物规格
        noDangFlag: '', // 非危险化学品
        origPlaceCode: '', // 原产地区代码
        originCountry: '', // 原产国
        originCountryValue: '', // 原产国名称
        prodBatchNo: '', // 生产批号
        mnufctrRegno: '', // 生产单位代码
        prodQgp: '', // 产品保质期
        prodValidDt: '', // 产品有效期
        produceDate: '', // 生产日期
        purpose: '', // 用途
        qty1: '', // 法定第一数量
        qty2: '', // 法定第二数量
        tradeCurr: '', // 币制
        tradeCurrValue: '', // 币制名称
        unCode: '', // N编码
        unit1Value: '', // 法定第一计量单位名称
        unit1: '', // 法定第一计量单位
        unit2: '', // 法定第二计量单位
        unit2Value: '', // 法定第二计量单位名称
        decSupplements: [], // 补充申报
        declGoodsEname: '', // 申报货物名称（外文）
        ciqCode: '' // CIQ代码
      }, // 报关单表体
      tableDecContainerlist: [], // 集装箱列表
      checkedDecContaList: [], // 被选中的 集装箱数据
      decContainer: {
        pid: '', // 主键
        decPid: '', // 外键
        containerNo: '', // 集装箱号
        containerSize: '', // 集装箱规格
        containerSizeValue: '', // 集装箱规格名称
        containerWeight: '', // 箱货重量
        goodsNo: '', // 商品项号
        lclFlag: '', // 拼箱标识
        gNo: '', // 序号
        note: '' // note
      }, // 集装箱数据
      licenselist: [], // 随附单证列表
      checkedDecLicList: [], // 被选中的 随附单证 集装箱数据
      decLicense: { // 随附单证数据
        pid: '', // 主键
        decPid: '', // 外键
        certCode: '', // 单证编号
        docuCode: '', // 单证代码
        gNo: '', // 序号
        decEcoRealations: [] // 原产地证明
      },
      statisticsData: {
        totalPrice: 0.00, // 总价
        totalGQty: 0, // 成交数量合计
        totalQty1: 0, // 法定第一数量合计
        totalQty2: 0 // 法定第二数量合计
      },
      isShow1: false,
      isShow2: false,
      isShowText1: 'fa fa-angle-double-right',
      isShowText2: 'fa fa-angle-double-right',
      otherPacksVisible: false, // 其他包装信息弹出框
      otherPackList: [], // 其他包装种类 参数列表
      preOtherPacks: [], // 其他包装种类预存
      otherPriceFactorVisible: false, // 其他事项事项
      otherPriceFactor: { // 价格因素
        promiseItem1: '',
        promiseItem2: '',
        promiseItem3: ''
      },
      promiseItem2Disabed: false, // 控制
      checkList: [], // 业务事项
      businessVisible: false, // 业务事项 弹出
      checkedUserList: [], // 被选中的联系人信息
      userForm: {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        useOrgpersonCode: '', // 使用单位联系人
        useOrgpersonTel: '' // 使用单位联系电话
      },
      decUserVisible: false, // 使用人弹出框显示隐藏控制字段
      entQuaVisible: false, // 企业资质 弹出框显示隐藏控制字段
      copLimitsForm: {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      },
      cropLimit: {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      },
      isDisabledDec: true,
      entQuaList: [], // 企业资质
      checkedEntQuaList: [], // 被选中的企业资质
      copmpanyPromise: false, // 企业承诺
      specialBusiList: [], // 特殊业务标识
      specialBusiVisible: false, // 特殊业务标识 显示隐藏控制字段
      decElementsList: [], // 检验检疫签证申报要素 数据源
      decElementsVisible: false, // 检验检疫签证申报要素 显示隐藏控制字段
      checkedDecElementsList: [], // 检验检疫签证申报要素被选中的数据表
      encodeTableVisible: false, // 检验检疫编码列表 显示隐藏控制字段
      isOpenElement: false, // 判断检验检疫列表选择后是否打开申报要素的录入框
      encodeTableList: [], // 检验检疫编码列表 数据源
      checkedEncodeTableList: [], // 检验检疫编码列表 被选中数据
      goodsAttrVisible: false, // 货物属性 显示隐藏控制字段
      goodsAttrCollection: [], // 货物属性被选择的集合
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
      productList: [], // 商品列表 参数表
      productListRadio: 0, // 选中的商品
      encodeListRadio: 0, // 选中的检验检验编码列表
      productListVisible: false, // 商品列表 显示隐藏控制字段
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
      checkedFilingInfoList: [], //  产品资质 许可证备案信息 列表 被选中
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
      checkedLicVINVList: [], // 许可证VIN 列表 被选中
      dangerGoodsVisible: false, // 危险品货物 显示隐藏控制字段
      goodsGNoVisible: false, // 危险品货物 显示隐藏控制字段
      checkedGoodsGNo: [], // 危险品货物 被选择的数据
      originRelVisible: false, // 原产地对应关系 显示隐藏控制字段
      originRelForm: { // 原产地对应关系 form表单
        pid: '',
        decPid: '',
        licenseGno: '', // 随附单证序号
        cusCiqNo: '',
        decGno: '', // 商品序号
        ecoGno: '', // 原产地证书单证项号
        certType: '', // 随附单证代码
        ecoCertno: '' // 随附单证号
      },
      // originRelList: [], // 原产地对应关系 list 表
      checkedOriginRelList: [], // 原产地对应关系 被选中数据表
      showFied: {
        appCertName: '', // 所需单证
        attaDocuCdstr: '', // 随附单证
        entQualifTypeCodeS: '', // 企业资质类别
        entQualifTypeCodeSName: '', // 企业资质编号
        entQualifTypeGNo: '', // 企业资质编号 gNo
        showGoodsSpec: '', // 货物规格
        showGoodsAttrValue: '', // 货物属性
        specDeclFlagValue: '', // 特殊业务标识 显示部分
        noteLenght: 0, // 备注字段的长度
        markNoLength: 0, // 标记唛码的长度
        noteTitle: '备注',
        ownerCorpId: '', // 生产/消费单位公司ID
        tradeCorpId: '', // 境内收发货人公司ID
        agentCorpId: '' // 申报单位公司ID
      },
      goodsEnNameVisible: false, // 商品英文名称
      goodsEnNameList: [], // 商品英文名称List
      checkedGoodsEnNameList: [], // 选中的商品英文名称List
      goodsEnNameForm: {
        gNo: '',
        codeTs: '',
        gName: '',
        declGoodsEname: ''
      },
      checkedgoods: {}, // 记录 当即选择的商品 以便编辑申报要
      decElementPara: {
        checkedgoods: '', // 加载数据
        opeType: '', // 操作类型
        gModel: '', // 规格型号
        iEFlag: '', // 进出口标志
        backRule: '' // 反填规则
      },
      elementVisible: false, // 编辑申报要素 显示控制
      modifyPriceVisible: false, // 修改单价或者总价
      additionInfoLaVisible: false, // 附注信息
      BulkEditingVisible: false, // 批量修改 弹出框
      BulkEditingList: {}, // 批量修改 传入数据
      accDocVisible: false, // 随附单据 弹出框 显示控制字段
      accDocData: {}, // 传递给 随附单据组件的数据
      printCompnentParam: {}, // 打印组件 的传递参数
      printCompnentVisible: false, // 打印组件 显示 隐藏
      initTemplateVisible: false, // 初始化模板 显示隐藏控制
      supplDecVisible: false, // 补充申报 显示隐藏控制
      initSupplDec: {}, // 初始花补充申报组件 所需的数据
      tipsNote: '', // 提示 正确的输入
      tipsNoteShow: false, // 输入提示栏是否显示
      saasTransac: [],
      saasTrade: [],
      saasWrap: [],
      saasLevytype: [],
      saasPortLin1: [],
      saasPortLin: [],
      saasCurr1: [],
      saasCurr2: [],
      saasCurr3: [],
      saasCurr4: [],
      saasCountry1: [],
      saasCountry2: [],
      saasCountry3: [],
      saasCountry4: [],
      saasCustomsRel1: [],
      saasCustomsRel2: [],
      saasTransportType: [],
      saasInlandPort: [],
      saasUnit1: [],
      saasUnit2: [],
      saasUnit3: [],
      saasUnit4: [],
      saasCiqOriginPlace: [],
      saasDistrictRel: [],
      saasCiqCityCn: [],
      saasLevymode: [],
      saasContainerModel: [],
      saasLicensedocu: [],
      saasUserTo: [],
      saasEntQualifType: [],
      saasLicType1: [],
      saasLicType2: [],
      saasElementBrand: [],
      saasCorrelationReason: [],
      saasGoodsAttr: [],
      saasCiqOrganization1: [],
      saasCiqOrganization2: [],
      saasCiqOrganization3: [],
      saasCiqOrganization4: [],
      saasCiqCertElement: [],
      saasEdocCode: [],
      feeRate1: [],
      feeRate2: [],
      feeRate3: [],
      decType: [],
      billType: [],
      commomPara1: [],
      commomPara2: [],
      commomPara3: [],
      dangerLevel: [],
      priceFactor1: [],
      priceFactor2: [],
      priceFactor3: [],
      ruleRegx: {
        'customMaster': '^\\d{4}$', // 申报地海关
        'iEPort': '^\\d{4}$|^$', // 进境关别
        'manualNo': '^[^\\u4e00-\\u9fa5]{12}$|^$', // 备案号
        'iEDate': '^20[0-9]{2}[0-1][0-9][0-3][0-9]$|^$', // 进出口日期
        'licenseNo': '^[0-9a-zA-Z]{2}-[0-9a-zA-Z]{2}-[0-9a-zA-Z]{1,14}$|^$', // 许可证号
        'tradeCoScc': '^[0-9a-zA-Z]{18}$|^NO$|^$', // 境内收发货人 18位社会信用代码
        'tradeCode': '^[0-9a-zA-Z]{10}$|^$', // 境内收发货人 10位海关编码
        // 'consigneeCode': '^[0-9a-zA-Z]{10}$|^$', // 境内收发货人 10位检验检疫编码
        'tradeName': '^.{1,70}$|^$', // 境内收发货人 企业名称(中文)
        'overseasConsignorEname': '^.{1,100}$|^$', // 企业名称(外文)
        'ownerCodeScc': '^[0-9a-zA-Z]{18}$|^NO$|^$', // 消费生产使用/生产销售单位 18位社会信用代码
        'ownerCode': '^[0-9a-zA-Z]{9,10}$|^NO$|^$', // 消费生产使用/生产销售单位 10位海关编码
        // 'ownerCiqCode': '^[0-9a-zA-Z]{10}$|(NO)|^$', // 消费生产使用/生产销售单位 10位检验检疫编码
        'ownerName': '^.{1,70}$|^$', // 消费生产使用/生产销售单位 企业名称
        'agentCodeScc': '^[0-9a-zA-Z]{18}$|^$', // 申报单位 18位社会信用代码
        'agentCode': '^[0-9a-zA-Z]{10}$|^$', // 申报单位 10位海关编码
        // 'declRegNo': '^[0-9a-zA-Z]{10}$|^$', // 申报单位 10位检验检疫编码
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
        'grossWt': '^[1-9]{1}\\d{0,13}(\\.\\d{1,5})?$|^$', // 毛重(KG)
        'netWt': '^[1-9]{1}\\d{0,13}(\\.\\d{1,5})?$|^$', // 净重(KG)
        'tradeAreaCode': '^[0-9a-zA-Z]{3}$|^$', // 贸易国别(地区)
        'entyPortCode': '^[0-9a-zA-Z]{6}$|^$', // 入境口岸
        'goodSplace': '^.{1,100}$|^$', // 货物存放地点
        'despPortCode': '^[0-9a-zA-Z]{6}$|^$', // 启运港/离境口岸代码
        'entryType': '^[0-9a-zA-Z]{1}$|^$', // 报关单类型
        'markNo': '^[\\s\\S]{1,400}$|^$', // 标记唛码
        // 'orgCode': '^[0-9a-zA-Z]{6}$|^$', // 检验检疫受理机关
        // 'vsaOrgCode': '^[0-9a-zA-Z]{6}$|^$', // 领证机关
        // 'inspOrgCode': '^[0-9a-zA-Z]{6}$|^$', // 口岸检验检疫机关
        'despDate': '^\\d{8}$|^$', // 启运日期
        // 'purpOrgCode': '^[0-9a-zA-Z]{6}$|^$', // 目的地检验检疫机关
        // 表体
        'codeTs': '^.{1,10}$', //  商品编号
        'gName': '^.{1,256}$', //  商品名称
        'gQty': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  成交数量
        'declPrice': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  单价
        'declTotal': '^\\d{1,15}(\\.\\d{1,2})?$|^$', //  总价
        'qty1': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  法定第一数量
        'qty2': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  法定第二数量
        'exgVersion': '^\\d{0,8}$', //  加工成品单耗版本号
        'origPlaceCode': '^[0-9a-zA-Z]{1,6}$|^$', // 原产地区
        'districtCode': '^[0-9a-zA-Z]{1,6}$|^$', // 境内目的地/货源地五位代码
        'destCode': '^[0-9a-zA-Z]{1,6}$|^$', // 目的地/产地代码（6位）或名称
        'dutyMode': '^[0-9a-zA-Z]{1,3}$|^$', // 征免方式
        'purpose': '^[0-9a-zA-Z]{1,3}$|^$', // 用途
        // 集装箱
        'containerNo': '^[a-zA-Z]{4}\\d{7}$', // 集装箱号
        'containerSize': '^[0-9a-zA-Z]{1,3}$', // 集装规格
        'containerWeight': '^[1-9]{1}[0-9]{0,12}(\\.\\d{1,4})?$|^$', // 自重
        'goodsNo': '^.{1,255}$', // 商品项号关系
        // 随附单证
        'docuCode': '^[0-9a-zA-Z]{1,6}$', // 随附单证代码
        // 'certCode': '^.{1,32}$', // 随附单证编号
        // 产品资质
        'licTypeCode': '^[0-9a-zA-Z]{1,6}$', // 许可证类别
        'licenceNo': '^.{1,40}$', // 许可证编号
        'relManno': '[0-9a-zA-Z]{12}$|^$', // 关联备案号
        'licWrtofQty': '^\\d{1,14}(\\.\\d{1,5})?$|^$', // 核销数量
        // 原产地证
        'decGno': '^\\d{1,2}$', // 报关单商品序号
        'ecoGno': '^.{1,3}$' // 对应随附单证商品项号
      },
      originRelRuleForm: {
        decGno: [ // 报关单商品序号
          {validator: this.checkValid, message: '请输入正确报关单商品序号', trigger: 'blur'}
        ],
        ecoGno: [ // 对应随附单证商品项号
          {validator: this.checkValid, message: '请输入对应随附单证商品项号', trigger: 'blur'}
        ]
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
          {validator: this.checkHeadValid, message: '输入12位非中文', trigger: 'blur'}
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
        // consigneeCode: [ // 境内收发货人 10位检验检疫编码
        //   {validator: this.checkHeadValid, message: '输入10位检验检疫编码', trigger: 'blur'}
        // ],
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
        // ownerCiqCode: [ // 消费生产使用/生产销售单位 10位检验检疫编码
        //   {validator: this.checkHeadValid, message: '输入10位检验检疫编码', trigger: 'blur'}
        // ],
        ownerName: [ // 消费生产使用/生产销售单位 企业名称
          {validator: this.checkHeadValid, message: '输入企业名称', trigger: 'blur'}
        ],
        agentCodeScc: [ // 申报单位 18位社会信用代码
          {validator: this.checkHeadValid, message: '输入18位社会信用代码', trigger: 'blur'}
        ],
        agentCode: [ // 申报单位 10位海关编码
          {validator: this.checkHeadValid, message: '输入10位海关编码', trigger: 'blur'}
        ],
        // declRegNo: [ // 申报单位 10位检验检疫编码
        //   {validator: this.checkHeadValid, message: '输入10位检验检疫编码', trigger: 'blur'}
        // ],
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
          {validator: this.checkHeadValid, message: '输入整数不超过14位小数不超过5位且不小于1的数', trigger: 'blur'}
        ],
        netWt: [ // 净重(KG)
          {validator: this.checkHeadValid, message: '输入整数不超过14位小数不超过5位且不小于1的数', trigger: 'blur'}
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
        // vsaOrgCode: [ // 领证机关
        //  vsaOrgCode {validator: this.checkValid, message: '输入领证机关', trigger: 'blur'}
        // ],
        // inspOrgCode: [ // 口岸检验检疫机关
        //   {validator: this.checkValid, message: '输入口岸检验检疫机关', trigger: 'blur'}
        // ],
        despDate: [ // 启运日期
          {validator: this.checkHeadValid, message: '输入启运日期', trigger: 'blur'}
        ]
        // purpOrgCode: [ // 目的地检验检疫机关
        //   {validator: this.checkValid, message: '输入目的地检验检疫机关', trigger: 'blur'}
        // ]
      },
      datasForm: {
        relManno: [ //  关联备案号
          {validator: this.checkDatasValid, message: '关联备案号只能12位', trigger: 'blur'}
        ]
      },
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
          {validator: this.checkListValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
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
      containerRuleForm: {
        containerNo: [ // 集装箱号
          {validator: this.checkValid, message: '集装箱号前4位位字母，后7位为数字', trigger: 'blur'}
        ],
        containerSize: [ // 集装箱规格
          {validator: this.checkValid, message: '集装箱规格不能为空', trigger: 'blur'}
        ],
        containerWeight: [ // 自重
          {validator: this.checkValid, message: '输入整数最大13位，小数最大4位的非负数', trigger: 'blur'}
        ],
        goodsNo: [ // 商品项号关系
          {validator: this.checkValid, message: '商品项号关系不能为空', trigger: 'blur'}
        ]
      },
      docuRuleForm: {
        docuCode: [ // 申报地海关
          {validator: this.checkValid, message: '输入随附单证代码', trigger: 'blur'}
        ]
        // ,
        // certCode: [ // 进境关别
        //   {validator: this.checkValid, message: '输入随附单证编号', trigger: 'blur'}
        // ]
      },
      licRuleForm: {
        licTypeCode: [ // 许可证类别
          {validator: this.checkValid, message: '输入许可证类别', trigger: 'blur'}
        ],
        licenceNo: [ // 许可证编号
          {validator: this.checkValid, message: '输入许可证编号', trigger: 'blur'}
        ],
        licWrtofQty: [ // 核销数量
          {validator: this.checkValid, message: '输入整数最多14位，小数最多5的非负数', trigger: 'blur'}
        ]
      },
      tipsMessage: {
        'customMaster': '申报地海关：输入4位代码或名称（如‘北京海关’应输入‘0100’或‘北京海关’）',
        'iEPort': '进/出境关别：输入4位代码或名称（如‘北京海关’应输入‘0100’或‘北京海关’）',
        'manualNo': '备案号：请输入12位备案号',
        'contrNo': '合同协议号：请输入合同的全部字头和号码',
        'iEDate': '进（出）口日期：输入进（出）口日期，格式为‘年月日’，如：‘20180712’',
        'dDate': '申报日期：输入申报日期，格式为‘年月日’，如：‘20180712’',
        'tradeCoScc': '境内收发货人统一社会信用代码：请输入统一社会信用代码',
        'tradeCode': '境内收发货人海关编码：境内收发货人在海关备案的10位代码',
        'tradeName': '境内收发货人名称：输入30个字以内海关注册单位名称',
        'overseasConsignorCode': '境外收发货人：对于AEO互认国家（地区）企业的，编码填报AEO编码，特殊情况下无境外收发货人的，填报‘NO’',
        'overseasConsignorEname': '境外收发货人名称（外文）：名称一般填报英文名称，检验检疫要求填报其他外文名称的，在英文名称后填报，以半角括号分隔，特殊情况下无境外收发货人的，填报‘NO’',
        'ownerCodeScc': '消费使用单位统一社会信用代码：请输入统一社会信用代码',
        'ownerCode': '消费使用单位海关编码：消费使用单位在海关备案的10位代码或者NO',
        'ownerName': '消费使用单位名称：输入30个字以内海关注册单位名称',
        'agentCodeScc': '申报单位统一社会信用代码：请输入统一社会信用代码',
        'agentCode': '申报单位海关编码：申报单位在海关备案的10位代码',
        'agentName': '申报单位名称：输入30个字以内海关注册单位名称',
        'trafMode': '运输方式：输入运输代码（1位）或名称',
        'trafName': '运输工具名称：请输入运输工具名称，转关运输的格式为：@+载货清单号',
        'voyageNo': '航次号：根据业务类型填写运输工具的航次编号，无实际进出境的货物不填',
        'billNo': '提运单号：填报进出口货物提单或运单的编号',
        'tradeMode': '监管方式：输入贸易代码（4位，不够请在前面补0）或名称（如，‘一般贸易’应输入‘0110’或‘一般贸易’）',
        'cutMode': '征免性质：输入征免性质代码（3位）或名称，可以为空',
        'licenseNo': '许可证号：输入许可证号（许可证号格式：年-XX-顺序号，例经贸部发：00-AA-000001）',
        'tradeCountry': '启运国/运抵国(地区）：输入启运国/运抵国代码（3位）或名称',
        'distinatePort': '经停港/指运港：输入经停港/指运港代码（6位）或名称',
        'transMode': '成交方式：输入成交方式代码（成交方式代码：1-CIF,2-C&F,3-FOB,4-C&I,5-市场价,6-垫仓,7-EXW）',
        'feeMark': '运费标志：输入运费标志：1-运费率；2-运费单价；3-运费总价',
        'feeRate': '运费：输入运费/率',
        'feeCurr': '运费币制：输入运费币制',
        'insurMark': '保费标志：输入保费标志：1-保费率；3-保费总价',
        'insurRate': '保费：输入保费/率',
        'insurCurr': '保费币制：输入保费币制',
        'otherMark': '杂费标志：输入杂费标志：1-杂费率；3-杂费总价',
        'otherRate': '杂费：输入杂费/率',
        'otherCurr': '杂费币制：输入杂费币制',
        'packNo': '件数：输入件数，不得填报0，散装货物填报1',
        'wrapType': '包装种类：输入包装种类（2位）或名称',
        'grossWt': '毛重：进出口货物实际毛重，计算单位为千克，不足一千克的填报为‘1’',
        'netWt': '净重：进出口货物实际净重，计算单位为千克，不足一千克的填报为‘1’',
        'tradeAreaCode': '贸易国别(地区)：输入贸易国别（地区）代码（3位）或名称',
        'entyPortCode': '入境口岸：输入入境口岸代码（6位）或名称',
        'goodSplace': '货物存放地点：填报货物进境后存放的场所或地点，包括海关监管作业场所、分拨仓库、定点加工厂、隔离检疫场、企业自有仓库等',
        'despPortCode': '启运港/离境口岸：输入启运港/离境口岸代码（6位）或名称',
        'entryType': '报关单类型：请输入报关单类型',
        'noteS': '备注：请输入报关单的备注信息',
        'markNo': '标记唛码：填报标记唛码中除图形以外的文字、数字，无标记唛码的填报“N/M”',
        'orgCode': '检验检疫受理机关：填报提交报关单和随附单据的检验检疫机关，输入代码（6位）或名称',
        'vsaOrgCode': '领证机关：填报领取证单的检验检疫机关，输入代码（6位）或名称',
        'inspOrgCode': '口岸检验检疫机关：填报对入境货物实施检验检疫的检验检疫机关，输入代码（6位）或名称',
        'despDate': '启运日期：填报装载入境货物的运输工具离开启运口岸的日期',
        'blno': 'B/L号：填报入境货物的提货单或出库单号码。当运输方式为“航空运输”时无需填写',
        'purpOrgCode': '目的地检验检疫机关：需要在目的地检验检疫机关实施检验检疫的，在本栏填写对应的检验检疫机关，输入代码（6位）或名称',
        'correlationaNo': '关联号码：录入关联号码',
        'correlationReasonFlag': '关联理由：在下拉菜单中选择关联报关单的关联理由',
        'origBoxFlag': '原箱运输：申报使用集装箱运输的货物, 根据是否原集装箱原箱运输，勾选‘是’或‘否’',
        'billtype': '清单类型：请输入清单类型',

        'relId': '关联报关单号：输入关联报关单编号',
        'relManno': '关联的备案号：输入关联的备案号',
        'bonNo': '保税/监管场地：输入保税或监管仓号',
        'cusFie': '场地代码：输入场地代码或名称',

        'gNo': '序号：商品表体的序号，为连续的流水号，系统自动生成',
        'contrItem': '备案序号：输入备案表中的商品序号，不允许修改',
        'codeTs': '商品编号：该项货物对应的商品编号',
        'gName': '商品名称：输入商品名称',
        'gModel': '规格型号：输入商品的规格型号',
        'gQty': '成交数量：该项商品的成交数量，与成交单位相对应，即申报数量',
        'gUnit': '成交计量单位：该项商品的成交时的实际计量单位',
        'declPrice': '单价：该项商品的成交时的商品单位价格，即申报单价',
        'declTotal': '总价：总价=单价*成交数量',

        'tradeCurr': '币制：请输入币制的代码（3位）或名称',
        'qty1': '法定第一数量：该项商品的法定成交数量，与法定单位对应',
        'unit1': '法定第一计量单位：该项商品的商品编号对应的海关统计第一单位，由海关决定',
        'exgVersion': '加工成品单耗版本号：所加工成品对应的版本号',
        'exgNo': '货号：加工料件/成品货号，即企业内部的货物编号',
        'destinationCountry': '最终目的国(地区)：输入最终目的国(地区)代码（3位）或名称',
        'qty2': '法定第二数量：与第二单位对应的第二成交数量',
        'unit2': '法定第二计量单位：该项商品的商品编号对应的海关统计第二单位，由海关决定',
        'originCountry': '原产国(地区)：输入原产国(地区)代码（3位）或名称',
        'origPlaceCode': '原产地区：输入原产地区（3位/6位）或名称',
        'districtCode': '境内目的地/货源地：输入境内目的地/货源地五位代码',
        'destCode': '目的地/产地代码：输入目的地/产地代码（6位）或名称',
        'dutyMode': '征免方式：输入征免规定，如下：1-照章；2-折半；3-全免；4-特案；5-征免性质；6-保金；7-保函；9-出口全额退税',
        'purpose': '用途：输入用途代码（2位）或名称',

        'containerNo': '集装箱号：输入集装箱号',
        'containerSize': '集装箱规格：输入集装箱规格代码（2位）或名称',
        'lclFlag': '拼箱标识：进出口货物装运集装箱为拼箱时，在本栏下拉菜单中选择‘是’或‘否’',
        'goodsNo': '商品项号关系：集装箱商品项号关系信息填报单个集装箱对应的商品项号，半角逗号分隔',
        'containerWeight': '集装箱货重：集装箱货重录入集装箱箱体自重（千克）+装载货物重量（千克）',

        'docuCode': '随附单证代码：输入随附单证代码',
        'certCode': '随附单证编号：输入随附单证编号'
      },
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
      containerSelect: { // 集装箱
        'containerSize': {obj: 'saasContainerModel', params: 'SAAS_CONTAINER_MODEL'}, // 集装箱规格
        'lclFlag': {obj: 'commomPara2', params: 'COMMON_PARA'} // 拼箱标识
      },
      docuSelect: { // 随附单证
        'docuCode': {obj: 'saasLicensedocu', params: 'SAAS_LICENSEDOCU'} // 随附单证代码
      },
      priceFactorSelect: {
        'promiseItem1': {obj: 'priceFactor1', params: 'PRICE_FACTOR'}, // 特殊关系确认
        'promiseItem2': {obj: 'priceFactor2', params: 'PRICE_FACTOR'}, // 价格影响确认
        'promiseItem3': {obj: 'priceFactor3', params: 'PRICE_FACTOR'} // 与货物有关的特许权使用费支付确认
      },
      entQualifSelect: { // 企业资质信息
        'entQualiftypeCode': {obj: 'saasEntQualifType', params: 'SAAS_ENT_QUALIF_TYPE'} // 企业资质类别
      },
      filingInfoSelect: { // 产品许可证/审批/备案信息
        'licTypeCode': {obj: 'saasLicType1', params: 'SAAS_LIC_TYPE'}, // 许可证类别
        'licWrtofQtyUnit': {obj: 'saasUnit4', params: 'SAAS_UNIT'} // 核销数量
      },
      licVINSelect: { // 许可证VIN
        'licTypeCode': {obj: 'saasLicType2', params: 'SAAS_LIC_TYPE'} // 许可证类别
      },
      dangerSelect: { // 危险货物信息
        'noDangFlag': {obj: 'commomPara3', params: 'COMMON_PARA'}, // 非危险化学品
        'dangPackType': {obj: 'dangerLevel', params: 'DANGER_LEVEL'} // 非危险化学品
      },
      selectObj: {
        obj: '',
        parmas: ''
      },
      historyGoodsVisible: false, // 历史商品数据弹出框控制
      initHistory: {}, // 历史商品数据初始化
      supplementFlag: false, // 判断是否从补充申报查询界面过来的
      mftBillVisible: false, // 舱单信息
      initMftBill: [], // 初始化舱单信息
      compareVisible: false, // 比较模板 控制
      initCompare: {}, // 比较模板初始化数据
      initImport: {}, // 存放导入初始化参数数据
      importCompnentVisible: false, // 表体导入弹出框显示设置
      noteCompnentVisible: false, // 备注
      attachVisabled: false, // 附加信息
      ZBookVisabled: false, // Z账册
      customsCodeVisabled: false, // 选择海关编码
      manualGoodsVisabled: false, // 联系单备案商品信息列表
      initManualGoods: {}, // 联系单备案商品信息列表
      initCustomsCode: {}, // 选择海关编码
      initHBook: {}, // Z账册初始化数据
      initAttach: {}, // 附加信息初始化
      initNote: {}, // 备注的初始化参数
      // companyListOptions: [], // 存放企业列表
      isManualNoChange: false, // 监听备案号的值是否发生变化
      tabId: '', // tab的id
      swtichCheck: 'Y', // 审核开关
      isDirectDec: 'N', // 是否直接申报
      switch: {}, // 所有的开关 主要用于逻辑检控
      charterVisabled: false, // 特许权弹窗
      charterDis: true, // 特许权按钮是否禁用
      initTransfer: {
        iEFlag: this.$route.params.iEFlag, // I E
        operationType: this.$route.params.operationType, // look  edit
        pid: '', // 主键
        funFlag: this.$route.params.funFlag, // 报关单 declaration  备案清单 recordList   二次转关 secondDec
        isDisabled: false, // 是否是详情
        customMaster: '', // 报关单申报地海关
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
  created () {
    let width = screen.availWidth
    if (width > 1280) {
      this.zoom = 1
      this.asideWidth = 20
    } else if (width > 1024) {
      this.zoom = 0.8
      this.asideWidth = 20
    } else if (width > 800) {
      this.zoom = 0.8
      this.asideWidth = 20
    } else {
      this.zoom = 0.7
      this.asideWidth = 20
    }
    let operation = this.$route.params.operationType
    if (operation === 'look') {
      this.controller.requireColor = false
    }
    // 判断是否从 补充申报查询界面过来
    let isSuppDec = window.sessionStorage.getItem('isSuppDec')
    if (!util.isEmpty(isSuppDec)) {
      this.supplementFlag = true
      window.sessionStorage.removeItem('isSuppDec')
    }
    window.localStorage.setItem('FEE_RATE', JSON.stringify([{codeField: '1', nameField: '率'}, {codeField: '2', nameField: '单价'}, {codeField: '3', nameField: '总价'}]))
    window.localStorage.setItem('FEE_RATE_OHTER', JSON.stringify([{codeField: '1', nameField: '率'}, {codeField: '3', nameField: '总价'}]))
    window.localStorage.setItem('DEC_TYPE', JSON.stringify([{nameField: '有纸报关', codeField: '0'}, {nameField: '无纸带清单报关', codeField: 'D'}, {nameField: '有纸带清单报关', codeField: 'L'}, {nameField: '通关无纸化', codeField: 'M'}, {nameField: '无纸报关', codeField: 'W'}]))
    window.localStorage.setItem('BILL_TYPE', JSON.stringify([{nameField: '一般备案清单', codeField: '1'}, {nameField: '先进区、后报关', codeField: '2'}, {nameField: '3-集报备案清单', codeField: '3'}, {nameField: '两单一审备案清单', codeField: '4'}]))
    window.localStorage.setItem('COMMON_PARA', JSON.stringify([{codeField: '0', nameField: '否'}, {codeField: '1', nameField: '是'}]))
    window.localStorage.setItem('DANGER_LEVEL', JSON.stringify([{codeField: '1', nameField: '一类'}, {codeField: '2', nameField: '二类'}, {codeField: '3', nameField: '三类'}]))
    window.localStorage.setItem('PRICE_FACTOR', JSON.stringify([{codeField: '0', nameField: '否'}, {codeField: '1', nameField: '是'}, {codeField: '9', nameField: '空'}]))
    // 获取初始数据
    this.$all([
      this.getCommonParams(['SAAS_CUSTOMS_REL', 'SAAS_TRANSPORT_TYPE', 'SAAS_ENT_QUALIF_TYPE', 'SAAS_LIC_TYPE', 'SAAS_TRADE']),
      this.getCommonParams(['SAAS_TRANSAC', 'SAAS_WRAP', 'SAAS_LEVYTYPE', 'SAAS_PORT_LIN', 'SAAS_CURR']),
      this.getCommonParams(['SAAS_COUNTRY', 'SAAS_INLAND_PORT', 'SAAS_UNIT', 'SAAS_CIQ_ORIGIN_PLACE', 'SAAS_DISTRICT_REL']),
      this.getCommonParams(['SAAS_CIQ_CITY_CN', 'SAAS_LEVYMODE', 'SAAS_CONTAINER_MODEL', 'SAAS_LICENSEDOCU', 'SAAS_USER_TO']),
      this.getCommonParams1(),
      // 获取检验检验申报要素 和 其他包装类型
      this.getspecialParams()
    ]).then(() => {
      this.specialInit()
    })
    // 获取tabId  为了CCBA
    this.tabId = this.getQueryString('tabId')
    // 查询所有的开关
    this.getSwitchCheck()
  },
  watch: {
    licenselist: 'resetlic',
    tableList: 'computedSum',
    tableDecContainerlist: 'computedConta',
    'decHead.ownerCode': 'backFillDistrictCode'
  },
  mounted () {
    let type = this.$route.query.type // 取路径的参数
    let operation = this.$route.params.operationType
    this.controller.iEFlag = (this.$route.params.iEFlag === 'import' ? 'I' : 'E')
    if (this.controller.iEFlag === 'I') {
      this.controller.iEFlagDisabled = false
    } else {
      this.controller.iEFlagDisabled = true
    }
    // 备案清单、报关单标识
    if (this.$route.params.funFlag === 'declaration') {
      this.decHead.declTrnrel = '1'
      this.controller.declTrnrel = '1'
      if (this.$route.params.iEFlag === 'import') {
        this.tabsLabel = '进口报关单'
      } else {
        this.tabsLabel = '出口报关单'
      }
    } else if (this.$route.params.funFlag === 'recordList') {
      this.decHead.declTrnrel = '3'
      this.controller.declTrnrel = '3'
      if (this.$route.params.iEFlag === 'import') {
        this.tabsLabel = '进境备案清单'
      } else {
        this.tabsLabel = '出境备案清单'
      }
    } else if (this.$route.params.funFlag === 'secondDec') {
      this.decHead.declTrnrel = '4'
      this.controller.declTrnrel = '4'
      if (this.$route.params.iEFlag === 'export') {
        this.tabsLabel = '出口报关单'
      }
    }
    if (operation === 'look' || operation === 'edit' || (operation === 'add' && !util.isEmpty(type))) {
      // this.controller.initTemplateBtn = true
      // 这里的初始化不需要反填信息
      this.initHeadData()
    } else if (operation === 'add') {
      this.decHead.iEFlag = (this.$route.params.iEFlag === 'import' ? 'I' : 'E')
      this.decList.gNo = this.tableList.length + 1
      if (this.controller.funFlag === 'recordList') {
        this.decHead.billtype = '1'
        this.selectObj = {
          obj: 'billType',
          params: 'BILL_TYPE'
        }
        this.checkParamsList('1', 'init')
      }
      if (this.controller.iEFlag === 'I') {
        this.decHead.iEDate = this.getTodayDate()
      }
      this.decHead.markNo = 'N/M'
      this.computLength('2')
      this.initHeadData('1')
      // 初始化默认模板
      this.initDefaultTemplate()
      // 聚焦点
      this.$nextTick(_ => {
        this.$refs['customMaster'].focus()
      })
    }
    // this.$refs['customMaster'].focus()
  },
  methods: {
    // 校验
    checkValid (rule, value, callback) {
      let name = rule.field
      if (util.isEmpty(value)) {
        value = ''
      }
      let reg = new RegExp(this.ruleRegx[name])
      let obj = this.$refs[name]
      if (!reg.test(value)) {
        setTimeout(function () {
          obj.clearValidate()
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 校验
    checkFateValid (rule, value, callback) {
      let name = rule.field
      if (util.isEmpty(value)) {
        value = ''
      }
      let reg = new RegExp(this.ruleRegx[name])
      let flag = reg.test(value)
      if (Math.abs(parseFloat(value)) > 99) {
        flag = false
      }
      let obj = this.$refs[name]
      if (!flag) {
        setTimeout(function () {
          obj.clearValidate()
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
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
      // 设置为选中的太装
      if (value === 'declTotal') {
        this.$nextTick(_ => {
          this.$refs['declTotal2'].focus()
          this.$refs['declTotal2'].select()
        })
      }
      // 如果时下拉框 则设置当前下拉框的默认参数
      this.selectObj = {
        obj: obj,
        params: params
      }
      // 如果是规格型号 则选择
      if (value === 'gModel') {
        this.$refs['gModel'].select()
      }
    },
    /**
     * 获取报关单详情
     */
    getDecDetail (pid) {
      this.$post({
        url: 'API@/dec-common/dec/common/getDec',
        data: {
          seqNo: pid
        },
        success: (res) => {
          if (res.result != null) {
            this.decHead = res.result.decHeadVO // 表头
            this.decHead.netWt = this.removeZero(this.decHead.netWt)
            this.decHead.grossWt = this.removeZero(this.decHead.grossWt)
            this.decHead.feeRate = this.removeZero(this.decHead.feeRate)
            this.decHead.insurRate = this.removeZero(this.decHead.insurRate)
            this.decHead.otherRate = this.removeZero(this.decHead.otherRate)
            // 判断 这条数据是否从OCR过来
            if (this.decHead.ref5 === 'Y') {
              this.controller.ocrShow = true
            }
            if (!util.isEmpty(this.decHead.transMode)) {
              this.transModeChange(this.decHead.transMode, 'init')
            }
            this.feeChange(this.decHead.feeMark, 1)
            this.feeChange(this.decHead.insurMark, 2)
            this.feeChange(this.decHead.otherMark, 3)
            // 计算 备注和唛码标记的长度
            this.computLength('1')
            this.computLength('2')
            for (let item in this.decHead.decCopLimits) {
              if (['101040', '102053'].includes(this.decHead.decCopLimits[item].entQualiftypeCode)) {
                this.copmpanyPromise = true
                break
              }
            }
            // 当 关检关联号为空 并且 统一编号不为空时 显示统一编号 其他情况显示 关检关联号
            if (!util.isEmpty(this.decHead.seqNo) && util.isEmpty(this.decHead.cusCiqNo)) {
              this.controller.isSeqNo = true
            } else {
              this.controller.isSeqNo = false
            }
            this.tableList = res.result.decListVO // 表体
            for (let x in this.tableList) {
              this.tableList[x].declPrice = this.removeZero(this.tableList[x].declPrice)
              this.tableList[x].gQty = this.removeZero(this.tableList[x].gQty)
              this.tableList[x].qty1 = this.removeZero(this.tableList[x].qty1)
              this.tableList[x].qty2 = this.removeZero(this.tableList[x].qty2)
              this.tableList[x].declTotal = this.removeZero(this.tableList[x].declTotal)
            }
            this.tableDecContainerlist = res.result.decContainersVO // 集装箱
            this.licenselist = res.result.decLicensesVO // 随附单证
            this.decList.gNo = this.tableList.length + 1
            // 防止 用户申报后刷新 引起可编辑的bug
            if (util.isExistInArray(this.decHead.status, ['002', '005', '2', '4', '5', '7', '8', '9', '10', '11'])) {
              this.controller.isDisabled = true
              this.controller.initTemplateBtn = true
            }
            if (util.isExistInArray(this.decHead.isExamine, ['3', 'R', '6'])) {
              this.controller.isDisabled = true
              this.controller.initTemplateBtn = true
            }
            // 企业资质信息 需要删除 处理
            if (this.decHead.decCopLimits.length > 0) {
              for (let x in this.decHead.decCopLimits) {
                if (['101040', '102053'].includes(this.decHead.decCopLimits[x].entQualiftypeCode)) {
                  this.cropLimit = {
                    pid: '', // 主键
                    decPid: this.decHead.decPid, // 报关单主键
                    gNo: '1', // 序号
                    entQualifNo: '', // 企业资质编号
                    entQualiftypeCode: this.decHead.decCopLimits[x].entQualiftypeCode, // 企业资质类别代码
                    entQualiftypeName: '合格保证' // 企业资质类别名称
                  }
                  this.decHead.decCopLimits.splice(x, 1)
                  this.copmpanyPromise = true
                  break
                }
              }
            }
            // 企业资质信息设置
            this.setGoodsLimit()
            // 重新设置商品对应关系列表
            this.resetGoodsEnNameList()
            // 初始化 所需单证 字段
            let nameList = []
            for (let n in this.decHead.decRequestCerts) {
              nameList.push(this.decHead.decRequestCerts[n].appCertName)
            }
            this.showFied.appCertName = nameList.join(',')
            // 控制 随附单据 按钮
            if (this.decHead.entryType === 'M') {
              this.controller.accDocDisabled = false
            }
            // 如果存在 备案号 则需要放开备案序号
            if (!util.isEmpty(this.decHead.manualNo)) {
              this.controller.contrItemDisabled = false
            }
            // 显示 特殊业务标识
            this.specialBusiChangeCodeName()
            // 给表头select 框 初始化赋值
            this.initSelect(this.headSelect, this.decHead)
            // 初始化征免方式
            this.initdutyMode()
            if (this.supplementFlag) {
              this.openSuppDec()
            }
            if (this.controller.iEFlag === 'I') {
              if (!util.isEmpty(this.decHead.tradeMode) && this.decHead.tradeMode === '9500') { // 进口报关单，监管方式9500，特许权按钮可用
                this.charterDis = false
              } else {
                this.charterDis = true
              }
            }
            this.decHead.decRoyaltyFeeVO = util.isEmpty(this.decHead.decRoyaltyFeeVO) ? null : this.decHead.decRoyaltyFeeVO // 特许权使用费
            this.$nextTick(_ => {
              this.$refs['customMaster'].focus()
            })

            // 转关单赋值
            if (!util.isEmpty(res.result.decTrnVO)) {
              this.initTransfer.statusForm = util.isEmpty(res.result.decTrnVO.decTrnStatusVO) ? {} : res.result.decTrnVO.decTrnStatusVO
              this.initTransfer.transDcForm = util.isEmpty(res.result.decTrnVO.decTrnHeadVO) ? {} : res.result.decTrnVO.decTrnHeadVO
              this.initTransfer.billInfoForm = util.isEmpty(res.result.decTrnVO.decTrnListVO) ? {} : res.result.decTrnVO.decTrnListVO
              this.initTransfer.contaInfoList = util.isEmpty(res.result.decTrnVO.decTrnContainers) ? [] : res.result.decTrnVO.decTrnContainers
              this.initTransfer.contaGoodsList = util.isEmpty(res.result.decTrnVO.decTrnContaGoods) ? [] : res.result.decTrnVO.decTrnContaGoods
            }
          }
        }
      })
    },
    // 处理复制过来的数据
    /**
     * @param 'copyDec' 处理复制过来的数据 'decHistory' 查看备份数据
     */
    initLocalStorageData (param) {
      let decVo = JSON.parse(window.localStorage.getItem(param))
      this.decHead = decVo.decHeadVO // 表头
      this.decHead.netWt = this.removeZero(this.decHead.netWt)
      this.decHead.grossWt = this.removeZero(this.decHead.grossWt)
      this.decHead.feeRate = this.removeZero(this.decHead.feeRate)
      this.decHead.insurRate = this.removeZero(this.decHead.insurRate)
      this.decHead.otherRate = this.removeZero(this.decHead.otherRate)
      // 计算 备注和唛码标记的长度
      this.computLength('1')
      this.computLength('2')
      for (let item in this.decHead.decCopLimits) {
        if (['101040', '102053'].includes(this.decHead.decCopLimits[item].entQualiftypeCode)) {
          this.copmpanyPromise = true
          break
        }
      }
      this.tableList = decVo.decListVO // 表体
      for (let x in this.tableList) {
        this.tableList[x].declPrice = this.removeZero(this.tableList[x].declPrice)
        this.tableList[x].gQty = this.removeZero(this.tableList[x].gQty)
        this.tableList[x].qty1 = this.removeZero(this.tableList[x].qty1)
        this.tableList[x].qty2 = this.removeZero(this.tableList[x].qty2)
        this.tableList[x].declTotal = this.removeZero(this.tableList[x].declTotal)
      }
      this.tableDecContainerlist = decVo.decContainersVO // 集装箱
      this.licenselist = decVo.decLicensesVO // 随附单证
      this.decList.gNo = this.tableList.length + 1
      // 企业资质信息 需要删除 处理
      if (this.decHead.decCopLimits.length > 0) {
        for (let x in this.decHead.decCopLimits) {
          if (['101040', '102053'].includes(this.decHead.decCopLimits[x].entQualiftypeCode)) {
            this.cropLimit = {
              pid: '', // 主键
              decPid: this.decHead.decPid, // 报关单主键
              gNo: '1', // 序号
              entQualifNo: '', // 企业资质编号
              entQualiftypeCode: this.decHead.decCopLimits[x].entQualiftypeCode, // 企业资质类别代码
              entQualiftypeName: '合格保证' // 企业资质类别名称
            }
            this.decHead.decCopLimits.splice(x, 1)
            this.copmpanyPromise = true
            break
          }
        }
      }
      // 企业资质信息设置
      this.setGoodsLimit()
      // 重新设置商品对应关系列表
      this.resetGoodsEnNameList()
      // 初始化 所需单证 字段
      let nameList = []
      for (let n in this.decHead.decRequestCerts) {
        nameList.push(this.decHead.decRequestCerts[n].appCertName)
      }
      if (!util.isEmpty(this.decHead.transMode)) {
        this.transModeChange(this.decHead.transMode, 'init')
      }
      this.showFied.appCertName = nameList.join(',')
      // 控制 随附单据 按钮
      if (this.decHead.entryType === 'M') {
        this.controller.accDocDisabled = false
      }
      // 如果存在 备案号 则需要放开备案序号
      if (!util.isEmpty(this.decHead.manualNo)) {
        this.controller.contrItemDisabled = false
      }
      // 显示 特殊业务标识
      this.specialBusiChangeCodeName()
      // 给表头select 框 初始化赋值
      this.initSelect(this.headSelect, this.decHead)
      // 初始化征免方式
      this.initdutyMode()
      // 转关单赋值
      if (!util.isEmpty(decVo.decTrnVO)) {
        this.initTransfer.statusForm = util.isEmpty(decVo.decTrnVO.decTrnStatusVO) ? {} : decVo.decTrnVO.decTrnStatusVO
        this.initTransfer.transDcForm = util.isEmpty(decVo.decTrnVO.decTrnHeadVO) ? {} : decVo.decTrnVO.decTrnHeadVO
        this.initTransfer.billInfoForm = util.isEmpty(decVo.decTrnVO.decTrnListVO) ? {} : decVo.decTrnVO.decTrnListVO
        this.initTransfer.contaInfoList = util.isEmpty(decVo.decTrnVO.decTrnContainers) ? [] : decVo.decTrnVO.decTrnContainers
        this.initTransfer.contaGoodsList = util.isEmpty(decVo.decTrnVO.decTrnContaGoods) ? [] : decVo.decTrnVO.decTrnContaGoods
        this.TransitSelect()
      }
    },
    // 新增的时候 需要初始化申报单位的数据
    initHeadData (value) {
      let logInfo = this.$store.state.userLoginInfo
      if (value === '1') {
        this.decHead.agentCode = logInfo.tradeCode
        this.decHead.agentCodeScc = logInfo.sccCode
        this.decHead.agentName = logInfo.cusCorpName
        this.decHead.declRegNo = logInfo.ciqCode
      } else {
        this.controller.userName = logInfo.userName
        this.controller.agentName = logInfo.cusCorpName
      }
    },
    // 初始默认模板值
    initDefaultTemplate () {
      this.$post({
        url: 'API@/dec-common/dec/initSetting/queryDefultTemplate',
        data: {iEFlag: this.decHead.iEFlag},
        success: (res) => {
          if (res.code === '0000' && (!util.isEmpty(res.result))) {
            this.backInitTemplate(res.result)
            this.initSelect(this.headSelect, this.decHead)
            this.initSelect(this.bodySelect, this.decList)
            this.initSelect(this.containerSelect, this.decContainer)
            this.initSelect(this.docuSelect, this.decLicense)
            this.$nextTick(_ => {
              this.$refs['customMaster'].focus()
            })
          }
        }
      })
    },
    // 计算总数
    computedSum () {
      let list = util.simpleClone(this.tableList)
      let sum1 = 0
      let sum2 = 0
      let sum3 = 0
      let sum4 = 0
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
        sum1 = this.Add(sum1, list[i].declTotal)
        sum2 = this.Add(sum2, list[i].gQty)
        sum3 = this.Add(sum3, list[i].qty1)
        sum4 = this.Add(sum4, list[i].qty2)
      }
      this.statisticsData = {
        totalPrice: sum1, // 总价
        totalGQty: sum2, // 成交数量合计
        totalQty1: sum3, // 法定第一数量合计
        totalQty2: sum4 // 法定第二数量合计
      }
    },
    // 计算 集装箱数
    computedConta () {
      let list = this.tableDecContainerlist
      let num = 0
      for (let i in list) {
        if (list[i].containerSizeValue.indexOf('L') > 0) {
          num += 2
        } else if (list[i].containerSizeValue.indexOf('S') > 0) {
          num++
        }
      }
      if (num > 0) {
        this.decHead.contaCount = num
      } else {
        this.decHead.contaCount = ''
      }
    },
    // 清空 报关单
    addDecHead () {
      this.activeTab = 'first'
      this.decHead = { // 报关单表头
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
        decShowCopLimits: [], // 显示企业资质
        decDecUsers: [], // 使用人
        decEdocRealations: [], // 随附单据
        decMarkLobs: [], // 标记号码
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
        entryType: '', // 报关单类型
        entyPortCode: '', // 入境/离境口岸代码
        entyPortCodeValue: '', // 入境/离境口岸名称
        feeCurr: '', // 运费币制
        feeMark: '', // 运费类型
        feeRate: '', // 运费
        goodSplace: '', // 存放地点
        grossWt: '', // 毛重
        iEDate: '', // 进出口日期
        iEFlag: this.controller.iEFlag, // 进出口标识
        iEPort: '', // 进出境关别
        iEPortValue: '', // 进出境关别名称
        inspOrgCode: '', // 口岸检验检疫机关
        insurCurr: '', // 保费币制
        insurMark: '', // 保费类型
        insurRate: '', // 保费
        licenseNo: '', // 许可证号
        manualNo: '', // 备案号
        markNo: 'N/M', // 标记唛码
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
        declTrnrel: this.controller.declTrnrel, // 报关/转关关系标志
        billtype: '', // 备案清单类型
        decRoyaltyFeeVO: null // 特许权使用费
      }
      this.computLength('2')
      this.decList = {
        decListPid: '', // 表体主键
        decPid: '', // 报关单主键
        ciqName: '', // 检验检疫名称
        codeTs: '', // 商品编号
        contrItem: '', // 备案序号
        dangName: '', // 危险货物名称
        dangPackSpec: '', // 危包规格
        dangPackType: '', // 危包类别
        decGoodsLimits: [], // 产品资质
        declPrice: '', // 单价
        declTotal: '', // 总价
        destCode: '', // 目的地代码
        destinationCountry: '', // 最终目的国（地区）
        districtCode: '', // 最终目的国（地区）名称
        dutyMode: '', // 征减免税方式
        engManentCnm: '', // 境外生产企业名称
        exgNo: '', // 货号
        exgVersion: '', // 版本号
        gModel: '', // 规格型号
        controlMa: '', // 监管要求
        gName: '', // 商品名称
        gNo: '1', // 项号
        gQty: '', // 成交数量
        gUnit: '', // 成交计量单位
        gUnitValue: '', // 成交计量单位名称
        goodsAttr: '', // 货物属性 code
        goodsBrand: '', // 货物品牌
        goodsModel: '', // 货物型号
        stuffNote: '', // 成分/原料/组分
        goodsSpec: '', // 货物规格
        noDangFlag: '', // 非危险化学品
        origPlaceCode: '', // 原产地区代码
        originCountry: '', // 原产国
        originCountryValue: '', // 原产国名称
        prodBatchNo: '', // 生产批号
        mnufctrRegno: '', // 生产单位代码
        prodQgp: '', // 产品保质期
        prodValidDt: '', // 产品有效期
        produceDate: '', // 生产日期
        purpose: '', // 用途
        qty1: '', // 法定第一数量
        qty2: '', // 法定第二数量
        tradeCurr: '', // 币制
        tradeCurrValue: '', // 币制名称
        unCode: '', // N编码
        unit1Value: '', // 法定第一计量单位名称
        unit1: '', // 法定第一计量单位
        unit2: '', // 法定第二计量单位
        unit2Value: '', // 法定第二计量单位名称
        decSupplements: [], // 补充申报
        declGoodsEname: '', // 申报货物名称（外文）
        ciqCode: '' // CIQ代码
      } // 报关单表体
      this.tableList = []
      this.decContainer = {
        pid: '', // 主键
        decPid: '', // 外键
        containerNo: '', // 集装箱号
        containerSize: '', // 集装箱规格
        containerSizeValue: '', // 集装箱规格名称
        containerWeight: '', // 箱货重量
        goodsNo: '', // 商品项号
        lclFlag: '', // 拼箱标识
        gNo: '', // 序号
        note: '' // note
      } // 集装箱数据
      this.tableDecContainerlist = []
      this.licenselist = []
      this.decLicense = { // 随附单证数据
        pid: '', // 主键
        decPid: '', // 外键
        certCode: '', // 单证编号
        docuCode: '', // 单证代码
        gNo: '', // 序号
        decEcoRealations: [] // 原产地证明
      }
      this.controller.pid = ''
      this.controller.initTemplateBtn = false // 初始值模板 按钮可用
      this.initHeadData('1')
      if (this.controller.funFlag === 'recordList') {
        this.decHead.billtype = '1'
        this.selectObj = {
          obj: 'billType',
          params: 'BILL_TYPE'
        }
        this.checkParamsList('1', 'init')
      }
      this.saasTransac = []
      this.saasTrade = []
      this.saasWrap = []
      this.saasLevytype = []
      this.saasPortLin1 = []
      this.saasPortLin = []
      this.saasCurr1 = []
      this.saasCurr2 = []
      this.saasCurr3 = []
      this.saasCurr4 = []
      this.saasCountry1 = []
      this.saasCountry2 = []
      this.saasCountry3 = []
      this.saasCountry4 = []
      this.saasCustomsRel1 = []
      this.saasCustomsRel2 = []
      this.saasTransportType = []
      this.saasInlandPort = []
      this.saasUnit1 = []
      this.saasUnit2 = []
      this.saasUnit3 = []
      this.saasUnit4 = []
      this.saasCiqOriginPlace = []
      this.saasDistrictRel = []
      this.saasCiqCityCn = []
      this.saasLevymode = []
      this.saasContainerModel = []
      this.saasLicensedocu = []
      this.saasUserTo = []
      this.saasEntQualifType = []
      this.saasLicType1 = []
      this.saasLicType2 = []
      this.saasElementBrand = []
      this.saasCorrelationReason = []
      this.saasCiqOrganization1 = []
      this.saasCiqOrganization2 = []
      this.saasCiqOrganization3 = []
      this.saasCiqOrganization4 = []
      this.saasCiqCertElement = []
      this.saasEdocCode = []
      this.feeRate1 = []
      this.feeRate2 = []
      this.feeRate3 = []
      this.decType = []
      this.billType = []
      this.commomPara1 = []
      this.commomPara2 = []
      this.commomPara3 = []
      this.dangerLevel = []
      this.priceFactor1 = []
      this.priceFactor2 = []
      this.priceFactor3 = []
      if (this.controller.iEFlag === 'I') { // 进口
        this.decHead.iEDate = this.getTodayDate()
        //  设置表体 最终目的国(地区)默认值为中国
        this.decList.destinationCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry3',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
      } else {
        //  设置表体 原产国(地区)默认值为中国
        this.decList.originCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry4',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
      }
      this.charterDis = true
      // 聚焦点
      this.$nextTick(_ => {
        this.$refs['customMaster'].focus()
      })
      // 清空转关单
      this.initTransfer = {
        iEFlag: this.$route.params.iEFlag, // I E
        operationType: this.$route.params.operationType, // look  edit
        pid: '', // 主键
        funFlag: this.$route.params.funFlag, // 报关单 declaration  备案清单 recordList   二次转关 secondDec
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
      this.$nextTick(() => {
        this.$refs.bondedtrans.initSelect()
      })
    },
    // 复制 报关单
    copyDecHead () {
      // 做法 就是去掉所有的主键和状态
      if (util.isEmpty(this.decHead.decPid)) {
        this.messageTips('没有可复制的数据', 'error')
        return false
      }
      let decHeadVo = util.simpleClone(this.decHead)
      if (!util.isEmpty(this.cropLimit.entQualiftypeCode)) {
        decHeadVo.decCopLimits.push(this.cropLimit)
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
      // 清除 申报日期
      if (this.controller.iEFlag === 'E') {
        decHeadVo.iEDate = ''
      }
      let tableListC = util.simpleClone(this.tableList)
      for (let i in tableListC) {
        tableListC[i].decListPid = ''
        tableListC[i].decPid = ''
      }
      let licenselistC = util.simpleClone(this.licenselist)
      for (let n in licenselistC) {
        licenselistC[n].pid = ''
        licenselistC[n].decPid = ''
      }
      let ContainerlistC = util.simpleClone(this.tableDecContainerlist)
      for (let n in ContainerlistC) {
        ContainerlistC[n].pid = ''
        ContainerlistC[n].decPid = ''
      }
      // 转关单
      let statusForm = util.simpleClone(this.initTransfer.statusForm)
      statusForm.trnStatus = ''
      statusForm.transDecNo = ''
      let transDcForm = util.simpleClone(this.initTransfer.transDcForm)
      transDcForm.decPid = ''
      transDcForm.transApplCode = ''
      transDcForm.transApplName = ''
      transDcForm.transApplScc = ''
      transDcForm.updateTime = ''
      transDcForm.updateUser = ''
      transDcForm.transDecNo = ''
      let billInfoForm = util.simpleClone(this.initTransfer.billInfoForm)
      billInfoForm.updateTime = ''
      billInfoForm.updateUser = ''
      billInfoForm.transDecNo = ''
      let contaGoodsList = util.simpleClone(this.initTransfer.contaGoodsList)
      for (let i in contaGoodsList) {
        contaGoodsList[i].transDecNo = ''
        contaGoodsList[i].updateTime = ''
        contaGoodsList[i].updateUser = ''
        contaGoodsList[i].relId = parseInt(i) + 1
      }
      let contaInfoList = util.simpleClone(this.initTransfer.contaInfoList)
      for (let i in contaInfoList) {
        contaInfoList[i].transDecNo = ''
        contaInfoList[i].updateTime = ''
        contaInfoList[i].updateUser = ''
      }
      let decTrn = {
        decTrnContaGoods: contaGoodsList,
        decTrnContainers: contaInfoList,
        decTrnHeadVO: transDcForm,
        decTrnListVO: billInfoForm,
        decTrnStatusVO: statusForm
      }
      let decVo = {
        decContainersVO: ContainerlistC,
        decHeadVO: decHeadVo,
        decLicensesVO: licenselistC,
        decListVO: tableListC,
        decTrnVO: decTrn
      }
      // 缓存数据
      window.localStorage.setItem('copyDec', JSON.stringify(decVo))
      // 重开页签
      let routeName
      if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '0') { // 进口报关单
        routeName = 'importDecAdd'
      } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '0') {
        routeName = 'exportDecAdd'
      } else if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '2') {
        routeName = 'importRecordAdd'
      } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '2') {
        routeName = 'exportRecordAdd'
      } else if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '1') {
        routeName = 'importTransitDecAdd'
      } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '1') {
        routeName = 'exportTransitDecAdd'
      } else if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '3') {
        routeName = 'importTransitRecordListAdd'
      } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '3') {
        routeName = 'exportTransitRecordListAdd'
      } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '4') {
        routeName = 'exportTransitSecondDecAdd'
      }
      if (routeName) {
        this.$router.push({
          name: routeName,
          query: {
            'type': 'copy'
          }
        })
      }
    },
    // 打印 报关单
    printDecHead () {
      if (util.isEmpty(this.decHead.decPid)) {
        this.messageTips('没有可打印的数据', 'error')
        return false
      }
      this.printCompnentParam = {
        'type': this.controller.declTrnrel,
        'pidList': [this.decHead.decPid]
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
        if (util.isEmpty(this.decHead.decPid)) {
          // 如果是没有保存的数据 直接替换
          this.backInitTemplate(initTemplateData)
        } else {
          // 如果已经保存过后的数据 打开比较模板 TODO
          let list = this.compareDecHead(initTemplateData.decHeadVO)
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
    // 反填 初始化模板值
    backInitTemplate (initTemplateData) {
      let headVo = initTemplateData.decHeadVO
      if (!util.isEmpty(headVo)) {
        delete headVo.effective
        delete headVo.isdefault
        headVo.decPid = ''
        headVo.status = ''
        headVo.statusValue = ''
        this.decHead = headVo
      }
      // 计算 备注和唛码标记的长度
      this.computLength('1')
      this.computLength('2')
      this.decHead.declTrnrel = this.controller.declTrnrel
      // 如果存在 备案号 则需要放开备案序号
      if (!util.isEmpty(this.decHead.manualNo)) {
        this.controller.contrItemDisabled = false
      }
      // 报关单表体
      let licFlag = false // 判断是否需要赋值 产品资质
      let vinFlag = false // 判断是否需要赋值 许可证vin
      let decListVo = initTemplateData.decListVO
      if (decListVo.length === 1) {
        decListVo[0].gNo = '1'
        this.decList = decListVo[0]
        licFlag = true
      }
      // 表体下的 产品资质
      if (licFlag && this.decList.decGoodsLimits.length === 1) {
        this.filingInfoForm = util.simpleClone(this.decList.decGoodsLimits[0])
        this.decList.decGoodsLimits = []
        vinFlag = true
      }
      // 标题下 的产品资质 的 许可证vin
      if (vinFlag && this.filingInfoForm.decGoodsLimitvins.length === 1) {
        this.licVINForm = util.simpleClone(this.filingInfoForm.decGoodsLimitvins[0])
        this.filingInfoForm.decGoodsLimitvins = []
      }
      // 随附单证
      let decLicList = initTemplateData.decLicensesVO
      if (decLicList.length === 1) {
        this.decLicense = decLicList[0]
      }
      // 集装箱
      let contaList = initTemplateData.decContainersVO
      if (contaList.length === 1) {
        this.decContainer = contaList[0]
      }
      this.specialBusiChangeCodeName()
      // 设置 显示字段
      this.formatDecList()
      this.initSelect(this.headSelect, this.decHead)
      this.initTemplateVisible = false
    },
    // 删除 报关单
    delDecHead () {
      this.$confirm('确定删除选中数据？', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        if (util.isEmpty(this.decHead.decPid)) {
          this.messageTips('没有可删除的数据', 'error')
          return false
        } else {
          this.$post({
            url: 'API@/dec-common/dec/common/delDec',
            data: {
              'seqNos': [this.decHead.decPid]
            },
            success: (res) => {
              this.messageTips(res.message, 'success')
              // 刷新报关单
              this.addDecHead()
            }
          })
        }
      }).catch(() => {
      })
    },
    // 保存报关单
    saveDecHead () {
      // 校验
      this.$refs['datasForm'].validate((valid) => {
        if (valid === false) {
          return false
        }
        this.$refs['headRuleForm'].validate((valid) => {
          if (valid === false) {
            this.isShowText1 = 'fa fa-angle-double-down'
            this.isShow1 = true
            return false
          } else {
            let messageTips = this.verifyDecBeforeSave()
            if (messageTips.length > 0) {
              let tips = messageTips.join('<br>')
              this.$confirm(tips, '提示', {
                modalAppendToBody: true,
                domMount: this.$el.parentNode,
                dangerouslyUseHTMLString: true,
                confirmButtonText: '继续暂存',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.singleSaveDecHead()
              }).catch(() => {
              })
            } else {
              this.singleSaveDecHead()
            }
          }
        })
      })
    },
    // 报关单暂存表头校验
    verifyDecBeforeSave () {
      let messageTips = []
      let mesLen
      let _tradeMode = this.decHead.tradeMode // 监管方式
      let _cutMode = this.decHead.cutMode // 征免性质
      let _manualNo = this.decHead.manualNo // 备案号
      let net = parseFloat(this.decHead.netWt)
      let gross = parseFloat(this.decHead.grossWt)
      if (!util.isEmpty(net) && (!util.isEmpty(gross)) && (net > gross)) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '净重需要小于或等于毛重')
      }
      // 校验 包装种类为散装或裸装，则件数栏一定填写1
      let arr = ['00', '01']
      if (util.isExistInArray(this.decHead.wrapType, arr) && this.decHead.packNo !== '1') {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '包装种类为散装或裸装，则件数栏一定填写1')
      }
      // 出口报关单监管方式为来料加工时提示备注栏需要填写加工费
      if (this.controller.iEFlag === 'E' && this.decHead.tradeMode === '0214' && util.isEmpty(this.decHead.noteS)) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '备注需要填写加工费')
      }
      // 保险费率不是0.3时进行提示
      if (this.decHead.insurMark === '1' && this.removeZero(this.decHead.insurRate) !== 0.3) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '当为保险费为费率时,费率一般为0.3')
      }
      // 运输方式为2的时候，船名航次提单号如没有输，提示
      if (this.decHead.trafMode === '2') {
        if (util.isEmpty(this.decHead.trafName) || util.isEmpty(this.decHead.voyageNo) || util.isEmpty(this.decHead.billNo)) {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '运输方式为水运时,需要输入:运输工具名称、航次号、提运单号')
        }
      }
      // 备案号为空时，监管方式为“0110 一般贸易”，征免性质非“101 一般征税”时，提示：监管方式为一般贸易时，征免性质应为一般征税
      if (util.isEmpty(_manualNo) && _tradeMode === '0110' && _cutMode !== '101') {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '监管方式为一般贸易时，征免性质应为一般征税')
      }
      // 备案号为空时，监管方式为“3339 其他进出口免费”，征免性质非“101 一般征税”时，提示：监管方式为其他进出口免费时，征免性质应为一般征税
      if (util.isEmpty(_manualNo) && _tradeMode === '3339' && _cutMode !== '101') {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '监管方式为其他进出口免费时，征免性质应为一般征税')
      }
      // 备案号为空时，监管方式为“1300 修理物品”，征免性质非“299 其他法定”时，提示：监管方式为修理物品时，征免性质应为其他法定
      if (util.isEmpty(_manualNo) && _tradeMode === '1300' && _cutMode !== '299') {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '监管方式为修理物品时，征免性质应为其他法定')
      }
      // 备案号为空时，监管方式为“4561 退运货物”，征免性质非“299 其他法定”时，提示：监管方式为退运货物时，征免性质应为其他法定
      if (util.isEmpty(_manualNo) && _tradeMode === '4561' && _cutMode !== '299') {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '监管方式为退运货物时，征免性质应为其他法定')
      }
      // 备案号为空时，监管方式为“1427 出料加工”，征免性质非“299 其他法定”时，提示：监管方式为出料加工时，征免性质应为其他法定
      if (util.isEmpty(_manualNo) && _tradeMode === '1427' && _cutMode !== '299') {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '监管方式为出料加工时，征免性质应为其他法定')
      }
      if (this.controller.funFlag === 'recordList' && this.decHead.billtype === '4' && util.isEmpty(this.decHead.relId)) {
        mesLen = messageTips.length + 1
        messageTips.push(mesLen + '.' + '两单一审备案清单需要填写关联报关单')
      }
      // 表头表体重量检控
      if (!util.isEmpty(this.decHead.netWt)) {
        let listTotalNet = 0
        this.tableList.forEach((v, i) => {
          let middle = ''
          if (v.gUnit === '036' && !util.isEmpty(v.gQty)) { // 克
            listTotalNet = this.Add(listTotalNet, v.gQty)
          } else if (v.gUnit === '035' && !util.isEmpty(v.gQty)) {
            middle = this.Mul(v.gQty, 1000)
            listTotalNet = this.Add(listTotalNet, middle)
          } else if (v.unit1 === '036' && !util.isEmpty(v.qty1)) {
            listTotalNet = this.Add(listTotalNet, v.qty1)
          } else if (v.unit1 === '035' && !util.isEmpty(v.qty1)) {
            middle = this.Mul(v.qty1, 1000)
            listTotalNet = this.Add(listTotalNet, v.middle)
          } else if (v.unit2 === '036' && !util.isEmpty(v.qty2)) {
            listTotalNet = this.Add(listTotalNet, v.qty2)
          } else if (v.unit2 === '035' && !util.isEmpty(v.qty2)) {
            middle = this.Mul(v.qty2, 1000)
            listTotalNet = this.Add(listTotalNet, v.middle)
          }
        })
        let netWtg = this.Mul(this.decHead.netWt, 1000)
        if (netWtg < listTotalNet) {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '表体商品重量需要小于或等于表头总净重')
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
      let transModeFlag = false
      let transModeTips = ''
      if (this.controller.iEFlag === 'I') {
        if (this.decHead.transMode === 'FOB') {
          if (util.isEmpty(this.decHead.feeMark) || util.isEmpty(this.decHead.insurMark)) { // 运费 保费
            transModeFlag = true
            transModeTips = '进口FOB，需要填写运、保费'
          } else {
            if ((this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) || (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate))) {
              transModeFlag = true
              transModeTips = '进口FOB，需要填写运、保费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeRate))) {
              transModeFlag = true
              transModeTips = '进口FOB，需要填写运、保费'
            }
            if (this.decHead.insurMark !== '1' && (util.isEmpty(this.decHead.insurRate) || util.isEmpty(this.decHead.insurCurr))) {
              transModeFlag = true
              transModeTips = '进口FOB，需要填写运、保费'
            }
          }
        } else if (this.decHead.transMode === 'C&F') {
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
        } else if (this.decHead.transMode === 'C&I') {
          if (util.isEmpty(this.decHead.feeMark)) { // 运费
            transModeFlag = true
            transModeTips = '进口C&I，需要填写运费'
          } else {
            if (this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) {
              transModeFlag = true
              transModeTips = '进口C&I，需要填写运费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeRate))) {
              transModeFlag = true
              transModeTips = '进口C&I，需要填写运费'
            }
          }
        } else if (this.decHead.transMode === 'EXW') {
          if (util.isEmpty(this.decHead.feeMark) || util.isEmpty(this.decHead.insurMark)) { // 运费 保费
            transModeFlag = true
            transModeTips = '进口EXW，需要填写运、保费'
          } else {
            if ((this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) || (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate))) {
              transModeFlag = true
              transModeTips = '进口EXW，需要填写运、保费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeRate))) {
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
        if (this.decHead.transMode === 'CIF') {
          if (util.isEmpty(this.decHead.feeMark) || util.isEmpty(this.decHead.insurMark)) { // 运费 保费
            transModeFlag = true
            transModeTips = '出口CIF，需要填写运、保费'
          } else {
            if ((this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) || (this.decHead.insurMark === '1' && util.isEmpty(this.decHead.insurRate))) {
              transModeFlag = true
              transModeTips = '出口CIF，需要填写运、保费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeRate))) {
              transModeFlag = true
              transModeTips = '出口CIF，需要填写运、保费'
            }
            if (this.decHead.insurMark !== '1' && (util.isEmpty(this.decHead.insurRate) || util.isEmpty(this.decHead.insurCurr))) {
              transModeFlag = true
              transModeTips = '出口CIF，需要填写运、保费'
            }
          }
        } else if (this.decHead.transMode === 'C&F') {
          if (util.isEmpty(this.decHead.feeMark)) { // 运费
            transModeFlag = true
            transModeTips = '出口C&F，需要填写运费'
          } else {
            if (this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) {
              transModeFlag = true
              transModeTips = '出口C&F，需要填写运费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeRate))) {
              transModeFlag = true
              transModeTips = '出口C&F，需要填写运费'
            }
          }
        } else if (this.decHead.transMode === 'C&I') {
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
        } else if (this.decHead.transMode === 'EXW') {
          if (util.isEmpty(this.decHead.feeMark)) { // 运费
            transModeFlag = true
            transModeTips = '出口EXW，需要填写运费'
          } else {
            if (this.decHead.feeMark === '1' && util.isEmpty(this.decHead.feeRate)) {
              transModeFlag = true
              transModeTips = '出口EXW，需要填写运费'
            }
            if (this.decHead.feeMark !== '1' && (util.isEmpty(this.decHead.feeRate) || util.isEmpty(this.decHead.feeRate))) {
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
      // 随附单证代码为“Y”时，需要上传随附单据“00000001 合同”以及“00000003 提/运单”，未上传时提示
      let licenseIndex = this.licenselist.findIndex((v, i) => {
        return v.docuCode === 'Y'
      })
      if (licenseIndex > -1) {
        if (this.decHead.decEdocRealations.length > 0) {
          let index1 = this.decHead.decEdocRealations.findIndex((v, i) => {
            return v.edocCode === '00000001'
          })
          let index2 = this.decHead.decEdocRealations.findIndex((v, i) => {
            return v.edocCode === '00000003'
          })
          if (index2 === -1) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000003-提/运单')
          }
          if (index1 === -1) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000001-合同')
          }
        } else {
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000003-提/运单')
          mesLen = messageTips.length + 1
          messageTips.push(mesLen + '.' + '随附单证代码为Y时，需要上传随附单据00000001-合同')
        }
      }
      // 提示 需要添加的随附单证
      let needArr = []
      // 先算出本票报关单需要的所有单证
      for (let n in this.tableList) {
        if (!util.isEmpty(this.tableList[n].controlMa)) {
          needArr = this.mergeAndDistinctArr(needArr, this.tableList[n].controlMa.split(','))
        }
      }
      // 判单 一些特殊单证
      // 1.当进口时
      if (this.controller.iEFlag === 'I') {
        // 6旧机电产品禁止进口提示：项号X、X、X为旧机电产品时，禁止进口
        let arrIndex1 = -1
        arrIndex1 = needArr.findIndex((v, i) => {
          return v === '6'
        })
        // 9禁止进口商品提示：项号X、X、X为禁止进口商品
        let arrIndex2 = -1
        arrIndex2 = needArr.findIndex((v, i) => {
          return v === '9'
        })
        // A检验检疫商品表头以及表体涉检必填项未填时，提示：项号X、X、X涉检，请完善检验检疫信息
        // D出/入境货物通关单（毛坯钻石用）
        let arrIndex3 = -1
        arrIndex3 = needArr.findIndex((v, i) => {
          return v === 'A' || v === 'D'
        })
        let tipsArr1 = []
        let tipsArr2 = []
        let tipsArr3 = []
        this.tableList.forEach((item) => {
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
          checkFeildArr.push(this.decHead.orgCode) // 检验检疫受理机关
          checkFeildArr.push(this.decHead.vsaOrgCode) // 领证机关
          checkFeildArr.push(this.decHead.inspOrgCode) // 口岸检验检疫机关
          checkFeildArr.push(this.decHead.despDate) // 启运日期
          let index = -1
          index = checkFeildArr.findIndex((v, i) => {
            return util.isEmpty(v)
          })
          if (index !== -1) {
            flag = true
          }
          // 表体
          for (let xy in this.tableList) {
            if (util.isEmpty(this.tableList[xy].purpose) || this.tableList[xy].goodsAttr.length === 0) {
              flag = true
              break
            }
          }
          if (flag) {
            // needArr.splice(arrIndex3, 1)
            // mesLen = messageTips.length + 1
            // messageTips.push(mesLen + '.' + '项号' + tipsArr3.join('、') + '涉检，请完善检验检疫信息')
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '涉检，请完善检验检疫信息')
          }
        }
        // 监管方式为“0110”且商品编码涉A时，
        // 商品表体的“检验检疫货物规格”的“货物品牌”、“货物规格”字段未填时提示：项号X需要补充货物品牌、货物规格信息；
        // “生产日期”、“生产批次”两个字段均为填写时提示：项号X需要补充生产日期或生产批次信息。
        if (this.decHead.tradeMode === '0110') {
          for (let c in this.tableList) {
            let bodyVo = this.tableList[c]
            if (bodyVo.controlMa.indexOf('A') > -1) {
              if (util.isEmpty(bodyVo.goodsBrand) || util.isEmpty(bodyVo.goodsSpec)) {
                mesLen = messageTips.length + 1
                messageTips.push(mesLen + '.项号' + bodyVo.gNo + '需要补充货物品牌、货物规格信息')
              }
              if (util.isEmpty(bodyVo.produceDate) || util.isEmpty(bodyVo.prodBatchNo)) {
                mesLen = messageTips.length + 1
                messageTips.push(mesLen + '.项号' + bodyVo.gNo + '需要补充生产日期或生产批次信息')
              }
            }
          }
        }
      } else { // 出口
        // 8禁止出口商品提示：项号X、X、X为禁止出口商品
        let arrIndex4 = -1
        arrIndex4 = needArr.findIndex((v, i) => {
          return v === '8'
        })
        let tipsArr4 = []
        this.tableList.forEach((item) => {
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
        for (let mn in this.licenselist) {
          if (this.licenselist[mn].docuCode === 'c') {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口随附单证代码不可为c')
          }
        }
      }
      // 监管方式为“0255 来料深加工”、“0654 进料深加工”，且未添加添加随附单证时提示
      if (['0255', '0654'].includes(this.decHead.tradeMode)) {
        needArr.push('K')
      }
      // 进口时启运国为“CHN 中国”，且征免方式为“1 照章征税”，未添加添加随附单证时提示
      if (this.decHead.tradeCountry === 'CHN' && this.controller.iEFlag === 'I') {
        for (let m in this.tableList) {
          if (this.tableList[m].dutyMode === '1') {
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
        for (let x in this.licenselist) {
          for (let y in needArr) {
            if (this.licenselist[x].docuCode === needArr[y]) {
              needArr.splice(y, 1)
              break
            }
          }
        }
      }
      // 1、备案号格式为H****W******、T****W******，或随附单证中添加了a证，不提示需要添加内销征税联系单
      for (let n in needArr) {
        if (needArr[n] === 'c') {
          let _manualNo = this.decHead.manualNo
          let index = this.licenselist.findIndex((v, i) => {
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
          if (this.switch['CR000001'] === 'Y' && _tradeMode === '0110' && _cutMode === '401' && (!['Z'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为一般贸易，征免性质为科教用品时,备案号首字母为Z')
          }
          if (this.switch['CR000002'] === 'Y' && _tradeMode === '0110' && _cutMode === '789' && (!['Z'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为一般贸易，征免性质为鼓励项目时,备案号首字母为Z')
          }
          if (this.switch['CR000003'] === 'Y' && _tradeMode === '0110' && _cutMode === '799' && (!['Z'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为一般贸易，征免性质为自有资金时,备案号首字母为Z')
          }
          if (this.switch['CR000004'] === 'Y' && _tradeMode === '2025' && _cutMode === '789' && (!['Z'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为合资合作设备，征免性质为鼓励项目时,备案号首字母为Z')
          }
          if (this.switch['CR000005'] === 'Y' && _tradeMode === '2225' && _cutMode === '789' && (!['Z'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为外资设备物品，征免性质为鼓励项目时,备案号首字母为Z')
          }
          if (this.switch['CR000006'] === 'Y' && _tradeMode === '2025' && _cutMode === '799' && (!['Z'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为合资合作设备，征免性质为自有资金时,备案号首字母为Z')
          }
          if (this.switch['CR000007'] === 'Y' && _tradeMode === '2225' && _cutMode === '799' && (!['Z'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为合资合作设备，征免性质为自有资金时,备案号首字母为Z')
          }
          if (this.switch['CR000008'] === 'Y' && _tradeMode === '0214' && _cutMode === '502' && (!['B', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为来料加工，征免性质为来料加工时,备案号首字母为B、E')
          }
          if (this.switch['CR000009'] === 'Y' && _tradeMode === '0255' && (!['B', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为来料深加工时,备案号首字母为B、E')
          }
          if (this.switch['CR000010'] === 'Y' && _tradeMode === '0258' && (!['B', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为来料余料结转时,备案号首字母为B、E')
          }
          if (this.switch['CR000011'] === 'Y' && _tradeMode === '0300' && (!['B', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为来料料件退换时,备案号首字母为B、E、H')
          }
          if (this.switch['CR000012'] === 'Y' && _tradeMode === '4400' && (!['B', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为来料成品退换时,备案号首字母为B、E、H')
          }
          if (this.switch['CR000013'] === 'Y' && _tradeMode === '0265' && _cutMode === '299' && (!['B', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为来料料件复出，征免性质为其他法定时,备案号首字母为B、E')
          }
          if (this.switch['CR000014'] === 'Y' && _tradeMode === '0865' && _cutMode === '299' && (!['B', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为来料边角料复出，征免性质为其他法定时,备案号首字母为B、E')
          }
          if (this.switch['CR000015'] === 'Y' && _tradeMode === '0615' && _cutMode === '503' && (!['C', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料对口，征免性质为进料加工时,备案号首字母为C、E')
          }
          if (this.switch['CR000016'] === 'Y' && _tradeMode === '0715' && _cutMode === '503' && (!['C', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料非对口，征免性质为进料加工时,备案号首字母为C、E')
          }
          if (this.switch['CR000017'] === 'Y' && _tradeMode === '0654' && (!['C', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料深加工时,备案号首字母为C、E')
          }
          if (this.switch['CR000018'] === 'Y' && _tradeMode === '0657' && (!['C', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料余料结转时,备案号首字母为C、E')
          }
          if (this.switch['CR000019'] === 'Y' && _tradeMode === '0700' && (!['C', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料料件退换时,备案号首字母为C、E、H')
          }
          if (this.switch['CR000020'] === 'Y' && _tradeMode === '4600' && (!['C', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料成品退换时,备案号首字母为C、E,、H')
          }
          if (this.switch['CR000021'] === 'Y' && _tradeMode === '0664' && _cutMode === '299' && (!['C', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料料件复出，征免性质为其他法定时,备案号首字母为C、E')
          }
          if (this.switch['CR000022'] === 'Y' && _tradeMode === '0864' && _cutMode === '299' && (!['C', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为进料边角料复出，征免性质为其他法定时,备案号首字母为C、E')
          }
          if (this.switch['CR000023'] === 'Y' && _tradeMode === '5014' && _cutMode === '502' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为区内来料加工，征免性质为来料加工时,备案号首字母为H')
          }
          if (this.switch['CR000024'] === 'Y' && _tradeMode === '5015' && _cutMode === '503' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为区内进料加工货物，征免性质为进料加工时,备案号首字母为H')
          }
          if (this.switch['CR000025'] === 'Y' && _tradeMode === '5034' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为区内物流货物时,备案号首字母为H')
          }
          if (this.switch['CR000026'] === 'Y' && _tradeMode === '5000' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为料件进出区时,备案号首字母为H')
          }
          if (this.switch['CR000027'] === 'Y' && _tradeMode === '5100' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为成品进出区时,备案号首字母为H')
          }
          // 2.4版本删除
          // if (this.switch['CR000028'] === 'Y' && _tradeMode === '4600' && (!['H', 'C'].includes(_manualNo.charAt(0).toUpperCase()))) {
          //   mesLen = messageTips.length + 1
          //   messageTips.push(mesLen + '.' + '进口,监管方式为进料成品退换时,备案号首字母为H、C')
          // }
          // if (this.switch['CR000029'] === 'Y' && _tradeMode === '0700' && (!['H', 'C'].includes(_manualNo.charAt(0).toUpperCase()))) {
          //   mesLen = messageTips.length + 1
          //   messageTips.push(mesLen + '.' + '进口,监管方式为进料料件退换时,备案号首字母为H、C')
          // }
          // if (this.switch['CR000030'] === 'Y' && _tradeMode === '0300' && (!['H', 'B'].includes(_manualNo.charAt(0).toUpperCase()))) {
          //   mesLen = messageTips.length + 1
          //   messageTips.push(mesLen + '.' + '进口,监管方式为进料料件退换时,备案号首字母为H、B')
          // }
          // if (this.switch['CR000031'] === 'Y' && _tradeMode === '4400' && (!['H', 'B'].includes(_manualNo.charAt(0).toUpperCase()))) {
          //   mesLen = messageTips.length + 1
          //   messageTips.push(mesLen + '.' + '进口,监管方式为来料成品退换时,备案号首字母为H、B')
          // }
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
          if (this.switch['CR000034'] === 'Y' && _tradeMode === '9700' && _cutMode === '101' && (!['B', 'C', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '进口,监管方式为后续补税，征免性质为一般征税时,备案号首字母为B、C、E、H')
          }
        }
        if (this.controller.iEFlag === 'E') {
          if (this.switch['CR000035'] === 'Y' && _tradeMode === '0214' && (!['B', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为来料加工时,备案号首字母为B、E')
          }
          if (this.switch['CR000036'] === 'Y' && _tradeMode === '0615' && (!['C', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为进料对口时,备案号首字母为C、E')
          }
          if (this.switch['CR000037'] === 'Y' && _tradeMode === '5014' && _cutMode === '502' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为区内来料加工，征免性质为来料加工时,备案号首字母为H')
          }
          if (this.switch['CR000038'] === 'Y' && _tradeMode === '5015' && _cutMode === '503' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为区内来料加工，征免性质为进料加工时,备案号首字母为H')
          }
          if (this.switch['CR000039'] === 'Y' && _tradeMode === '5034' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为区内物流货物时,备案号首字母为H')
          }
          if (this.switch['CR000040'] === 'Y' && _tradeMode === '5000' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为料件进出区时,备案号首字母为H')
          }
          if (this.switch['CR000041'] === 'Y' && _tradeMode === '5100' && (!['H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为成品进出区时,备案号首字母为H')
          }
          if (this.switch['CR000042'] === 'Y' && _tradeMode === '4600' && (!['C', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为进料成品退换时,备案号首字母为C、E、H')
          }
          if (this.switch['CR000043'] === 'Y' && _tradeMode === '0664' && (!['H', 'C'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为进料料件复出时,备案号首字母为H、C')
          }
          if (this.switch['CR000044'] === 'Y' && _tradeMode === '0700' && (!['C', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为进料料件退换时,备案号首字母为C、E、H')
          }
          if (this.switch['CR000045'] === 'Y' && _tradeMode === '0265' && (!['H', 'B'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为来料料件复出时,备案号首字母为H,B')
          }
          if (this.switch['CR000046'] === 'Y' && _tradeMode === '0300' && (!['B', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为来料料件退换时,备案号首字母为B、E、H')
          }
          if (this.switch['CR000047'] === 'Y' && _tradeMode === '4400' && (!['B', 'E', 'H'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为来料成品退换时,备案号首字母为B、E、H')
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
          if (this.switch['CR000050'] === 'Y' && _tradeMode === '9700' && _cutMode === '101' && (!['H', 'C', 'B', 'E'].includes(_manualNo.charAt(0).toUpperCase()))) {
            mesLen = messageTips.length + 1
            messageTips.push(mesLen + '.' + '出口,监管方式为后续补税，征免性质为一般征税时,备案号首字母为B、C、E、H')
          }
        }
      }
      return messageTips
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
      if (this.decHead.noteS.indexOf('金关二期') === -1) {
        noteCondition1 = true
      }
      let noteCondition2 = true
      let index = this.licenselist.findIndex((v, i) => {
        return v.docuCode === 'c'
      })
      if (index > -1 && ['0844', '0845'].includes(this.decHead.tradeMode)) {
        noteCondition2 = false
      }
      let rule1 = ['成套设备', '废', '旧', '成新']
      if (!util.isEmpty(this.decHead.noteS) && noteCondition1 && noteCondition2) {
        for (let i in rule1) {
          if (this.decHead.noteS.indexOf(rule1[i]) > -1) {
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
              return element.epidemicAreaCountryCode === bodyVo.originCountry
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
          if (!util.isEmpty(this.decHead.tradeMode) && (!util.isEmpty(this.decHead.tradeAreaCode) && (!util.isEmpty(bodyVo.controlMa)))) {
            let districtType = ''
            if (this.decHead.tradeAreaCode === 'CHN') {
              districtType = '1'
            }
            // 处理去掉监管要求中的逗号
            let controlMa = bodyVo.controlMa.split(',').join('')
            let tradeCondition = JSON.parse(window.localStorage.getItem('CUS_TRADE_MODE'))
            let index2 = tradeCondition.findIndex((element, i) => {
              if (element.tradeMode === this.decHead.tradeMode && (districtType === element.districtType)) {
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
      let otherPacks = this.decHead.otherPacks
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
      // 4.“启运国”在疫区国家参数表： MAPPING_EPIDEMIC_AREA_CODE
      if (!flag && !util.isEmpty(this.decHead.tradeCountry)) {
        for (let x in country) {
          if (country[x] === this.decHead.tradeCountry) {
            flag = true
            break
          }
        }
      }
      return flag
    },
    // 没有校验  单纯保存报关单
    singleSaveDecHead () {
      for (let i in this.tableDecContainerlist) {
        this.tableDecContainerlist[i].decPid = ''
      }
      let decHeadVo = util.simpleClone(this.decHead)
      if (!util.isEmpty(this.cropLimit.entQualiftypeCode)) {
        decHeadVo.decCopLimits.push(this.cropLimit)
      }
      // 后端要求清除的
      delete decHeadVo.createTime
      delete decHeadVo.createUser
      delete decHeadVo.inputName
      delete decHeadVo.inputerName
      let decTrn = {
        decTrnContaGoods: this.initTransfer.contaGoodsList,
        decTrnContainers: this.initTransfer.contaInfoList,
        decTrnHeadVO: this.initTransfer.transDcForm,
        decTrnListVO: this.initTransfer.billInfoForm,
        decTrnStatusVO: this.initTransfer.statusForm
      }
      let param = {
        decContainersVO: this.tableDecContainerlist,
        decHeadVO: decHeadVo,
        decLicensesVO: this.licenselist,
        decListVO: this.tableList,
        decTrnVO: decTrn
      }
      this.$post({
        url: 'API@/dec-common/dec/common/saveCommonDec',
        data: param,
        success: (res) => {
          this.messageTips(res.message, 'success')
          if (!this.decHead.decPid) {
            this.decHead.decPid = res.result[0].decPid
            this.controller.pid = res.result[0].decPid
            this.decHead.status = res.result[0].status
            this.decHead.statusValue = res.result[0].statusValue
            this.initTransfer.statusForm.trnStatusValue = res.result[0].trnStatusValue // 转关单状态赋值
            this.initTransfer.billInfoForm.billSeqNo = res.result[0].billSeqNo // 转关单提运单序号
            this.initTransfer.transDcForm.transDecNo = res.result[0].transDecNo // 转关单编号
            let routeName
            let tabName
            if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '0') { // 进口报关单
              tabName = '进口报关单'
              routeName = 'importDecEdit'
            } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '0') {
              tabName = '出口报关单'
              routeName = 'exportDecEdit'
            } else if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '2') {
              tabName = '进境备案清单'
              routeName = 'importRecordEdit'
            } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '2') {
              tabName = '出境备案清单'
              routeName = 'exportRecordEdit'
            } else if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '1') {
              tabName = '进口转关提前报关'
              routeName = 'importTransitDecEdit'
            } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '1') {
              tabName = '出口转关提前报关'
              routeName = 'exportTransitDecEdit'
            } else if (this.controller.iEFlag === 'I' && this.decHead.declTrnrel === '3') {
              tabName = '进境转关提前备案清单'
              routeName = 'importTransitRecordListEdit'
            } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '3') {
              tabName = '出境转关提前备案清单'
              routeName = 'exportTransitRecordListEdit'
            } else if (this.controller.iEFlag === 'E' && this.decHead.declTrnrel === '4') {
              tabName = '出口二次转关'
              routeName = 'exportTransitSecondDecEdit'
            }
            // 先关闭当前页签
            this.$store.dispatch('CloseTab', this.$store.state.TabsStore.currentTab.tabId)
            // 再跳转到编辑页面
            this.$router.push({
              name: routeName,
              params: {
                'pid': this.decHead.decPid,
                'operationType': 'edit',
                'setTitle': tabName + '-' + this.decHead.decPid,
                'setId': routeName + 'edit' + this.decHead.decPid
              }
            })
          }
        }
      })
    },
    // 合并并去重数组
    mergeAndDistinctArr (arr1, arr2) {
      let _arr = []
      for (let i in arr1) {
        _arr.push(arr1[i])
      }
      for (let n in arr2) {
        let flag = true
        for (let m in arr1) {
          if (arr2[n] === arr1[m]) {
            flag = false
            break
          }
        }
        if (flag) {
          _arr.push(arr2[n])
        }
      }
      return _arr
    },
    // 获取检验检验申报要素 和 其他包装种类 参数
    getspecialParams () {
      return {
        url: 'API@/saas-dictionary/dictionary/getCerts',
        data: {},
        success: (res) => {
          this.decElementsList = res.result.CertElements
          this.otherPackList = res.result.Wraps
        }
      }
    },
    // 打开随附单据 弹出框
    openAccDoc () {
      if (util.isEmpty(this.decHead.customMaster)) {
        this.messageTips('没有可打印的数据', 'error')
        return false
      }
      this.accDocVisible = true
      this.accDocData = {
        'SAAS_EDOC_CODE': this.saasEdocCode,
        'decPid': this.decHead.decPid,
        'edocOwnerCode': this.decHead.customMaster, // 所属单位海关编号
        'cusCiqNo': this.decHead.cusCiqNo, // 关检关联号
        'edocOwnerName': this.decHead.ownerName, // 所属单位名称
        'accDocList': this.decHead.decEdocRealations, // 随附单据list
        'decMarkLobs': this.decHead.decMarkLobs, // 标记唛码附件
        'accDocVisible': this.accDocVisible,
        'iEFlag': this.controller.iEFlag,
        'seqNo': this.decHead.seqNo,
        'decHead': this.decHead,
        'decList': this.tableList
      }
    },
    // 查看报关单是否需要审核
    getSwitchCheck () {
      if (this.$route.params.operationType === 'look') {
        return
      }
      this.$post({
        url: 'API@/dec-common/ccba/review/isReview',
        data: [],
        loading: true,
        success: (res) => {
          this.swtichCheck = res.result['customs_declaration_manual_audit'].value
          this.isDirectDec = res.result['customs_declaration_direct'].value
          if (this.isDirectDec === 'Y') {
            this.isDisabledDec = false
          } else {
            this.isDisabledDec = true
          }
          for (let item in res.result) {
            this.switch[item] = res.result[item].value
          }
        }
      })
    },
    /**
     * operType G 为发送到单一窗口暂存  C 为发送到单一窗口申报
     */
    declareData (operType) {
      let tips = ''
      if (operType === 'G') {
        tips = '是否确认发送？'
      } else {
        tips = '是否确认申报？'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        // TODO 先调用暂存
        // 校验
        this.$refs['headRuleForm'].validate((valid) => {
          if (valid === false) { // 自动打开 以防折叠部分有错误提示
            this.isShowText1 = 'fa fa-angle-double-down'
            this.isShow1 = true
            return false
          } else {
            let decTrn = {
              decTrnContaGoods: this.initTransfer.contaGoodsList,
              decTrnContainers: this.initTransfer.contaInfoList,
              decTrnHeadVO: this.initTransfer.transDcForm,
              decTrnListVO: this.initTransfer.billInfoForm,
              decTrnStatusVO: this.initTransfer.statusForm
            }
            let param = {
              decContainersVO: this.tableDecContainerlist,
              decHeadVO: this.decHead,
              decLicensesVO: this.licenselist,
              decListVO: this.tableList,
              operType: operType,
              decTrnVO: decTrn
            }
            if (operType === 'G') {
              param['sendFlag'] = true
            }
            this.$post({
              url: 'API@/dec-common/dec/common/saveCommonDec',
              data: param,
              success: (res) => {
                if (this.decHead.decPid === '') {
                  this.decHead.decPid = res.result[0].decPid
                  this.controller.pid = res.result[0].decPid
                  this.decHead.status = res.result[0].status
                  this.decHead.statusValue = res.result[0].statusValue
                  this.initTransfer.statusForm.trnStatusValue = res.result[0].trnStatusValue // 转关单状态赋值
                  this.initTransfer.billInfoForm.billSeqNo = res.result[0].billSeqNo // 转关单提运单序号
                  this.initTransfer.transDcForm.transDecNo = res.result[0].transDecNo // 转关单编号
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
          }
        })
      }).catch(() => {
      })
    },
    // 提交审核
    sumbitCheck () {
      let pidList = []
      if (util.isEmpty(this.decHead.status)) {
        this.messageTips('请先暂存数据')
        return
      }
      // 3 带审核   R 带复核 6 审核通过
      if (['3', 'R', '6'].includes(this.decHead.isExamine)) {
        this.messageTips('当前数据已是在审核状态')
        return
      }
      pidList.push(this.decHead.decPid)
      // 发送请求
      this.$post({
        url: 'API@/dec-common/dec/common/submitVerity',
        data: {
          'list': pidList
        },
        success: (res) => {
          this.messageTips(res.result, 'success')
        }
      })
    },
    // 查看OCR单证
    lookOCR () {
      // TODO
      this.$post({
        url: 'API@/dec-common/dec/orc/queryDecOCRPic',
        data: {seqNo: this.decHead.decPid},
        success: (res) => {
          window.open(res.result, '_blank')
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
      let par = ['SAAS_ELEMENT_BRAND', 'SAAS_CORRELATION_REASON', 'SAAS_GOODS_ATTR', 'SAAS_CIQ_ORGANIZATION', 'SAAS_CIQ_CERT_ELEMENT', 'SAAS_EDOC_CODE']
      return {
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          this.saasGoodsAttr = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
        },
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {
          this.saasGoodsAttr = JSON.parse(window.localStorage.getItem('SAAS_GOODS_ATTR'))
        }
      }
    },
    specialInit () {
      // 初始化 默认下拉框值
      if (this.controller.iEFlag === 'I') { // 进口
        this.decHead.iEDate = this.getTodayDate()
        //  设置表体 最终目的国(地区)默认值为中国
        this.decList.destinationCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry3',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
      } else {
        //  设置表体 原产国(地区)默认值为中国
        this.decList.originCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry4',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
      }
      let operation = this.$route.params.operationType
      let type = this.$route.query.type // 取路径的参数
      if ((operation === 'look' && util.isEmpty(this.$route.query.type)) || operation === 'edit') {
        this.getDecDetail(this.$route.params.pid)
      } else if (operation === 'add' && !util.isEmpty(type)) {
        this.initLocalStorageData('copyDec')
      } else if (operation === 'look' && (this.$route.query.type === 'lookHistory')) {
        this.initLocalStorageData('decHistory')
      }
      // 当 新增页面的时候 光标默认在 申报地海关 所以这里设置 默认的参数和表
      this.selectObj = {
        obj: 'saasCustomsRel1',
        params: 'SAAS_CUSTOMS_REL'
      }
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
    // 卸毕日期的change事件 如果 卸毕日期为null 则 赋值为空
    cmplDschrgDtChange () {
      if (util.isEmpty(this.decHead.cmplDschrgDt)) {
        this.decHead.cmplDschrgDt = ''
      }
    },
    // 生产日期的change事件 如果 生产日期为null 则 赋值为空
    produceDateChange () {
      if (util.isEmpty(this.goodsSpecForm.produceDate) || this.goodsSpecForm.length === 0) {
        this.goodsSpecForm.produceDate = ''
      }
    },
    // 产品有效期的change事件 如果 产品有效期为null 则 赋值为空
    prodValidDtChange () {
      if (util.isEmpty(this.goodsSpecForm.prodValidDt)) {
        this.goodsSpecForm.prodValidDt = ''
      }
    },
    // 包装种类为散装或裸装，则件数栏一定填写1
    wrapTypeChange () {
      let arr = ['00', '01']
      if (util.isExistInArray(this.decHead.wrapType, arr)) {
        this.decHead.packNo = '1'
      }
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
    changeIsShow2 () {
      if (this.isShow2 === true) {
        this.isShowText2 = 'fa fa-angle-double-right'
        this.isShow2 = false
      } else {
        this.isShowText2 = 'fa fa-angle-double-down'
        this.isShow2 = true
      }
    },
    // 其他包装种类 获取选中值
    otherPacksChangeFun (val) {
      this.preOtherPacks = util.simpleClone(val)
    },
    // 其他包装种类 弹出框的打开
    otherPacksDiv () {
      this.otherPacksVisible = true
    },
    // 其他包装种类 设置初始化值
    otherPacksShow () {
      // 初始化选中的值
      let list = this.decHead.otherPacks
      this.$nextTick(_ => {
        if (list.length > 0) {
          list.forEach(item => {
            this.$refs.otherPacksTable.toggleRowSelection(this.otherPackList.find(d => d.packType === item.packType), true)
          })
        } else {
          this.$refs.otherPacksTable.clearSelection()
        }
      })
    },
    // 其他包装种类  保存
    saveOtherPackageInfo () {
      this.decHead.otherPacks = util.simpleClone(this.preOtherPacks)
      this.otherPacksVisible = false
    },
    // 其他其他事项确认打开后操作
    openOthered () {
      this.$nextTick(_ => {
        this.$refs['promiseItem1'].focus()
      })
    },
    // 原产地对应关系 打开后操作
    openOriginReled () {
      this.$nextTick(_ => {
        this.$refs['decGno'].$children[1].focus()
      })
    },
    // 其他确认事项 保存
    saveotherPriceFactor () {
      if (this.otherPriceFactor.promiseItem1 === '') {
        this.otherPriceFactor.promiseItem1 = '9'
      }
      if (this.otherPriceFactor.promiseItem2 === '') {
        this.otherPriceFactor.promiseItem2 = '9'
      }
      if (this.otherPriceFactor.promiseItem3 === '') {
        this.otherPriceFactor.promiseItem3 = '9'
      }
      this.decHead.promiseItmes = this.otherPriceFactor.promiseItem1 + this.otherPriceFactor.promiseItem2 + this.otherPriceFactor.promiseItem3
      this.otherPriceFactor = { // 价格因素
        promiseItem1: '',
        promiseItem2: '',
        promiseItem3: ''
      }
      // 清空参数列表
      this.priceFactor1 = []
      this.priceFactor2 = []
      this.priceFactor3 = []
      this.otherPriceFactorVisible = false
      this.$refs['containerNo'].$children[1].focus()
    },
    // 其他确认1选择变化
    promiseItem1Change (value) {
      if (value === '0') {
        this.priceFactor2 = JSON.parse(window.localStorage.getItem('PRICE_FACTOR'))
        this.otherPriceFactor.promiseItem2 = '0'
        this.initSelect(this.priceFactorSelect, this.otherPriceFactor)
        this.promiseItem2Disabed = true
      } else {
        this.promiseItem2Disabed = false
      }
    },
    // 打开备注输入框
    openNote (value) {
      if (value === '1') { // 备注
        this.initNote = {
          noteValue: this.decHead.noteS,
          type: 'note',
          noteTitle: '备注',
          visible: true
        }
        this.noteCompnentVisible = true
      }
      if (value === '2') { // 标记唛码
        this.initNote = {
          noteValue: this.decHead.markNo,
          type: 'markNo',
          noteTitle: '标记唛码',
          visible: true
        }
        this.noteCompnentVisible = true
      }
    },
    // 计算备注 和标记唛码的长度
    computLength (value) {
      if (value === '1') { // 备注
        this.decHead.noteS = util.getFixlenOfString(this.decHead.noteS, 255)
        this.showFied.noteLenght = util.decGetlen(this.decHead.noteS)
      }
      if (value === '2') { // 标记唛码
        this.decHead.markNo = util.getFixlenOfString(this.decHead.markNo, 400)
        this.showFied.markNoLength = util.decGetlen(this.decHead.markNo)
      }
    },
    // 打开附件上传
    openAccessory () {
      this.initAttach = {
        decMarkLobs: this.decHead.decMarkLobs
      }
      this.attachVisabled = true
    },
    // 打开其他确认事项 弹出框
    openOtherPriceFactor () {
      if (this.decHead.promiseItmes === '') {
        this.otherPriceFactor = { // 价格因素
          promiseItem1: '',
          promiseItem2: '',
          promiseItem3: ''
        }
      } else {
        let list = this.decHead.promiseItmes.split('')
        this.otherPriceFactor = { // 价格因素
          promiseItem1: list[0],
          promiseItem2: list[1],
          promiseItem3: list[2]
        }
        if (this.otherPriceFactor.promiseItem1 === '0') {
          this.promiseItem2Disabed = true
        } else {
          this.promiseItem2Disabed = false
        }
      }
      this.initSelect(this.priceFactorSelect, this.otherPriceFactor)
      this.otherPriceFactorVisible = true
    },
    // 确认 业务事项
    saveBusiness () {
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
    // 打开 业务事项 弹出框
    openBussiness () {
      this.checkList = []
      if (this.decHead.chkTax === '1') {
        this.checkList.push('税单无纸化')
      }
      if (this.decHead.chkBond === '1') {
        this.checkList.push('自主报税')
      }
      if (this.decHead.chkPayment === '1') {
        this.checkList.push('自报自缴')
      }
      if (this.decHead.chkSurety === '1') {
        this.checkList.push('担保验放')
      }
      if (this.decHead.chkOther === '1') {
        this.checkList.push('水运中转')
      }
      this.businessVisible = true
    },
    // 新增使用人
    AddDecUser () {
      this.userForm = {
        pid: '', // 主键
        decPid: this.controller.pid, // 报关单主键
        gNo: '', // 序号
        useOrgpersonCode: '', // 使用单位联系人
        useOrgpersonTel: '' // 使用单位联系电话
      }
    },
    // 保存使用人
    saveDecUser () {
      if (util.isEmpty(this.userForm.gNo)) {
        // 新增
        this.userForm.gNo = this.decHead.decDecUsers.length + 1
        this.decHead.decDecUsers.push(util.simpleClone(this.userForm))
      } else {
        // 修改
        let index = parseInt(this.userForm.gNo) - 1
        this.decHead.decDecUsers[index] = util.simpleClone(this.userForm)
        this.decHead.decDecUsers.push({})
        this.decHead.decDecUsers.pop()
      }
      this.AddDecUser()
    },
    // 删除 使用人
    delDecUser () {
      let delData = this.checkedUserList
      if (delData.length === 0) {
        this.messageTips('至少选择一条数据')
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
            for (let item in this.decHead.decDecUsers) {
              if (delData[index].gNo === this.decHead.decDecUsers[item].gNo) {
                this.decHead.decDecUsers.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedUserList = []
          // 重新排序
          for (let i in this.decHead.decDecUsers) {
            this.decHead.decDecUsers.gNo = parseInt(i) + 1
          }
          // 重新 初始化表单
          this.AddDecUser()
        }).catch(() => {
        })
      }
    },
    // 打开 使用人 弹出框
    openDecUserContent () {
      this.decUserVisible = true
    },
    // 反填联系人信息
    backDecUserInfo (row) {
      this.userForm = util.simpleClone(row)
    },
    // 获取选中数据  使用人
    decUserchangeFun (value) {
      this.checkedUserList = value
    },
    // 打开企业资质弹出框
    openEntQuaConent () {
      this.entQuaVisible = true
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
    // 企业资质类别值变化时的操作
    entQuaChanged (value) {
      let list = this.saasEntQualifType
      for (let index in list) {
        if (list[index].codeField === value) {
          this.copLimitsForm.entQualiftypeName = list[index].nameField
          break
        }
      }
    },
    // 新增 企业资质
    AddEntQua () {
      this.copLimitsForm = {
        pid: '', // 主键
        decPid: this.controller.pid, // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      }
      this.saasEntQualifType = []
      this.$refs['entQualiftypeCode'].focus()
    },
    // 企业资质对话框手动关闭的处理逻辑
    closeEntQua () {
      this.copLimitsForm = {
        pid: '', // 主键
        decPid: this.controller.pid, // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      }
      this.saasEntQualifType = []
      this.entQuaVisible = false
    },
    // 重新赋值
    setGoodsLimit () {
      // 1.确定给 显示 数组赋值
      this.decShowCopLimits = util.simpleClone(this.decHead.decCopLimits)
      if (!util.isEmpty(this.cropLimit.entQualiftypeCode)) {
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
    // 保存 企业资质
    savedEntQua () {
      if (util.isEmpty(this.copLimitsForm.gNo)) {
        // 新增
        this.copLimitsForm.gNo = this.decHead.decCopLimits.length + 1
        this.decHead.decCopLimits.push(util.simpleClone(this.copLimitsForm))
      } else {
        // 修改
        let index = parseInt(this.copLimitsForm.gNo) - 1
        this.decHead.decCopLimits[index] = util.simpleClone(this.copLimitsForm)
        this.decHead.decCopLimits.push({})
        this.decHead.decCopLimits.pop()
      }
      // 清除 input 框
      this.AddEntQua()
      // 重新赋值
      this.setGoodsLimit()
    },
    // 删除 企业资质信息
    deldEntQua () {
      let delData = this.checkedEntQuaList
      if (delData.length === 0) {
        this.messageTips('至少选择一条数据')
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
            for (let item in this.decHead.decCopLimits) {
              if (delData[index].gNo === this.decHead.decCopLimits[item].gNo) {
                this.decHead.decCopLimits.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedEntQuaList = []
          // 重新排序
          for (let i in this.decHead.decCopLimits) {
            this.decHead.decCopLimits[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化表单
          this.AddEntQua()
          // 重新赋值
          this.setGoodsLimit()
        }).catch(() => {
        })
      }
    },
    // 获取 选中的企业资质
    copLimitschangeFun (value) {
      this.checkedEntQuaList = value
    },
    // 反填企业资质信息
    backCopLimitsInfo (row) {
      this.copLimitsForm = util.simpleClone(row)
    },
    // 企业
    cropPromiseClick () {
      if (this.copmpanyPromise) {
        this.cropLimit = {
          pid: '', // 主键
          decPid: this.decHead.decPid, // 报关单主键
          gNo: '1', // 序号
          entQualifNo: '', // 企业资质编号
          entQualiftypeCode: this.controller.iEFlag === 'I' ? '101040' : '102053', // 企业资质类别代码
          entQualiftypeName: '合格保证' // 企业资质类别名称
        }
      } else { // 删除
        this.cropLimit = {
          pid: '', // 主键
          decPid: this.decHead.decPid, // 报关单主键
          gNo: '1', // 序号
          entQualifNo: '', // 企业资质编号
          entQualiftypeCode: '', // 企业资质类别代码
          entQualiftypeName: '' // 企业资质类别名称
        }
      }
      this.setGoodsLimit()
    },
    // 特殊业务标识 打开弹出框
    openSpecialBusiContent () {
      this.specialBusiVisible = true
      this.specialBusiChangeCodeName()
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
      this.showFied.specDeclFlagValue = showList.join(',')
    },
    // 特殊业务标识 确认
    sureSpecialBusi () {
      let arr = ['0', '0', '0', '0']
      let arr2 = ['0', '0', '0', '0']
      this.specialBusiVisible = false
      if (this.specialBusiList.length === 0) {
        this.decHead.specDeclFlag = ''
      } else {
        for (let i in this.specialBusiList) {
          let name = this.specialBusiList[i]
          switch (name) {
            case '国际赛事':
              arr[0] = '1'
              break
            case '特殊进出军工物资':
              arr[1] = '1'
              break
            case '国际援助物资':
              arr[2] = '1'
              break
            case '国际会议':
              arr[3] = '1'
              break
            case '直通放行':
              arr2[0] = '1'
              break
            case '外交礼遇':
              arr2[2] = '1'
              break
            case '转关':
              arr2[3] = '1'
              break
          }
        }
        this.decHead.specDeclFlag = arr.join('')
        this.decHead.specDeclFlag2 = arr2.join('')
        this.showFied.specDeclFlagValue = this.specialBusiList.join(',')
      }
      this.specialBusiList = []
    },
    // 检验检疫申报要素 给选中的数据赋值
    decElementsChangeFun (value) {
      this.checkedDecElementsList = util.simpleClone(value)
    },
    // 检验检疫申报要素  保存
    savedDcElements () {
      this.decHead.decRequestCerts = util.simpleClone(this.checkedDecElementsList)
      // 重新设置一下 手动填写的参数，以防止 先勾选数据后填写表格时出现的没有赋值上的问题
      for (let i in this.decHead.decRequestCerts) {
        for (let n in this.decElementsList) {
          if (this.decHead.decRequestCerts[i].gNo === this.decElementsList[n].gNo) {
            this.decHead.decRequestCerts[i].applCopyQuan = this.decElementsList[n].applCopyQuan
            this.decHead.decRequestCerts[i].applOri = this.decElementsList[n].applOri
            break
          }
        }
      }
      let nameList = []
      for (let i in this.decHead.decRequestCerts) {
        nameList.push(this.decHead.decRequestCerts[i].appCertName)
      }
      this.showFied.appCertName = nameList.join(',')
      this.checkedDecElementsList = []
      this.decElementsVisible = false
    },
    // 打开检验检验签证申报要素 弹出框
    openDecElementsContent () {
      this.decElementsVisible = true
    },
    // 设置默认值
    decElementsShow () {
      // 初始化选中的值
      let list = this.decHead.decRequestCerts
      this.$nextTick(_ => {
        if (list.length > 0) {
          list.forEach(item => {
            this.$refs.decElementsTable.toggleRowSelection(this.decElementsList.find(d => d.appCertCode === item.appCertCode), true)
          })
        } else {
          this.$refs.decElementsTable.clearSelection()
        }
      })
      // 设置默认选择项
      this.checkedDecElementsList = []
      for (let n in this.decHead.decRequestCerts) {
        this.checkedDecElementsList.push({
          appCertCode: this.decHead.decRequestCerts[n].appCertCode,
          appCertName: this.decHead.decRequestCerts[n].appCertName,
          applCopyQuan: this.decHead.decRequestCerts[n].applCopyQuan,
          applOri: this.decHead.decRequestCerts[n].applOri,
          gNo: this.decHead.decRequestCerts[n].gNo
        })
      }
      for (let i in this.decHead.decRequestCerts) {
        for (let n in this.decElementsList) {
          if (this.decHead.decRequestCerts[i].gNo === this.decElementsList[n].gNo) {
            this.decElementsList[n].applCopyQuan = this.decHead.decRequestCerts[i].applCopyQuan
            this.decElementsList[n].applOri = this.decHead.decRequestCerts[i].applOri
            break
          }
        }
      }
    },
    // 检验检疫编码表 获取选中的值
    encodeTableChanged (value) {
      this.encodeTableList = util.simpleClone(value)
    },
    // 保存 并反填检验检疫编码表
    saveEncodeTableVaue () {
      let ciqData = util.simpleClone(this.encodeTableList[this.encodeListRadio])
      this.decList.ciqName = ciqData.gNameNote
      this.decList.ciqCode = ciqData.ciqCo
      this.encodeTableVisible = false
      if (this.isOpenElement) {
        this.elementVisible = true
        this.isOpenElement = false
      } else {
        this.$refs['gQty'].$children[1].focus()
        this.$refs['gQty'].$children[1].select()
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
          if (this.encodeTableList === null || this.encodeTableList === undefined || this.encodeTableList.length === 0) {
            this.messageTips('无此商品编号', 'error')
            this.encodeTableList = []
          } else {
            this.encodeTableVisible = true
          }
        }
      })
    },
    // 关闭检验检疫编码表
    closeEncodeTable () {
      this.encodeTableVisible = false
      this.$refs['gQty'].$children[1].focus()
      this.$refs['gQty'].$children[1].select()
    },
    // 打开货物属性弹出框
    openGoodAtrrContent () {
      this.goodsAttrCollection = [] // 先清空以前的数据
      if (this.decList.goodsAttr.length > 0) {
        let goodsAttrList = this.decList.goodsAttr.split(',')
        let goodsAttrValueList = this.showFied.showGoodsAttrValue.split(',')
        for (let index in goodsAttrList) {
          this.goodsAttrCollection.push(goodsAttrList[index] + '-' + goodsAttrValueList[index])
        }
      }
      this.goodsAttrVisible = true
    },
    // 保存 货物属性的值
    saveGoodsAttr () {
      let goodsAttrList = []
      let goodsAttrValueList = []
      for (let index in this.goodsAttrCollection) {
        goodsAttrList.push(this.goodsAttrCollection[index].split('-')[0])
        goodsAttrValueList.push(this.goodsAttrCollection[index].split('-')[1])
      }
      this.decList.goodsAttr = goodsAttrList.join(',')
      this.showFied.showGoodsAttrValue = goodsAttrValueList.join(',')
      this.goodsAttrVisible = false
      // 焦点到 用途
      this.$refs['purpose'].focus()
    },
    // 取消 货物属性
    closeGoodsAttr () {
      this.goodsAttrVisible = false
    },
    // 控制 货物属性 的选择不超过7条
    goodsAttrChange () {
      let goodsAttrLen = this.goodsAttrCollection.length
      if (goodsAttrLen > 7) {
        this.goodsAttrCollection.pop()
        this.messageTips('不能超过7条数据')
      }
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
    saveGoodsSpec () {
      let param = []
      for (let index in this.goodsSpecForm) {
        if (util.isEmpty(this.goodsSpecForm[index]) === false) {
          param.push(this.goodsSpecForm[index])
        }
      }
      this.showFied.showGoodsSpec = param.join(',')
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
      this.goodsSpecVisible = false
      // 打开货物属性弹框
      this.openGoodAtrrContent()
    },
    // 商品编号值改变事件
    codeTsChangeF () {
      this.codeTsChange = true
    },
    // 打开 商品编号 弹出框
    openProductList () {
      if (this.controller.cDisabled) { // 如果是置灰的话
        return
      }
      if (!this.codeTsChange) { // 如果值没有发生变化
        this.$refs['gQty'].$children[1].focus()
        this.$refs['gQty'].$children[1].select()
        return false
      }
      if (this.decList.codeTs.length === 0) {
        return false
      }
      if (this.decList.codeTs.length < 4) {
        this.messageTips('至少输入四位商品编号')
        this.$refs['codeTs'].$children[1].select()
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
          } else {
            this.productListVisible = true
          }
        }
      })
    },
    // 计算总价
    computTotal (value = '') {
      let price = this.decList.declPrice
      let num = this.decList.gQty
      if (util.isEmpty(price) || util.isEmpty(num)) { // 判断 数量和单价有没有填
        return false
      } else if (isNaN(price) || isNaN(num)) { // 判断 数量和单价是否填的是 数字
        return false
      } else {
        this.decList.declTotal = this.Mul(price, num, 2).toString()
        if (value === '1') {
          this.$nextTick(_ => {
            this.$refs['declTotal2'].focus()
            this.$refs['declTotal2'].select()
          })
        }
      }
    },
    // 计算单价
    computPrice () {
      let declTotal = this.decList.declTotal
      let num = this.decList.gQty
      if (util.isEmpty(declTotal) || util.isEmpty(num)) { // 判断 数量和单价有没有填
        return false
      } else if (isNaN(declTotal) || isNaN(num)) { // 判断 数量和单价是否填的是 数字
        return false
      } else {
        this.decList.declPrice = this.Div(declTotal, num, 4).toString()
      }
    },
    // 商品列表
    openProductListAfter () {
      this.$nextTick(_ => {
        this.$refs['productListTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[0].focus()
      })
    },
    // 检验检疫列表
    openencodeListAfter () {
      this.$nextTick(_ => {
        this.$refs['encodeTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[0].focus()
      })
    },
    // 下拉键切换选择
    updownSelect (e) {
      let browerType = this.myBrowser()
      if (browerType === 'Chrome') {
        return
      }
      let len = this.productList.length
      if (len === 0) {
        return
      } else {
        len--
      }
      if (e && e.keyCode === 38) { // 上
        if (this.productListRadio === 0) {
          this.productListRadio = len
        } else {
          this.productListRadio--
        }
      }
      if (e && e.keyCode === 40) { // 下
        if (this.productListRadio === len) {
          this.productListRadio = 0
        } else {
          this.productListRadio++
        }
      }
    },
    // 上下键 显示下拉框
    upDownDropDown (e) {
      if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
        if (e && (e.keyCode === 38 || e.keyCode === 40)) { // 上
          if (this[this.selectObj.obj].length === 0) {
            this.checkParamsList('')
          }
        }
      }
    },
    // 获取浏览器类型
    myBrowser () {
      let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      let isOpera = (userAgent.indexOf('Opera') > -1)
      if (userAgent.indexOf('Opera') > -1) {
        return 'Opera'
      } // 判断是否Opera浏览器
      if (userAgent.indexOf('Firefox') > -1) {
        return 'FF'
      } // 判断是否Firefox浏览器
      if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome'
      }
      if (userAgent.indexOf('Safari') > -1) {
        return 'Safari'
      } // 判断是否Safari浏览器
      if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
        return 'IE'
      } // 判断是否IE浏览器
    },
    // 确定所选的商品
    saveProductList () {
      this.checkedgoods = util.simpleClone(this.productList[this.productListRadio])
      this.decElementPara = {
        checkedgoods: this.checkedgoods, // 加载数据
        opeType: 'add', // 操作类型 add 新增  edit 编辑  look 查看
        gModel: '', // 规格型号
        iEFlag: this.decHead.iEFlag // 进出口标志
      }
      this.decList.codeTs = this.checkedgoods.codeTs
      if (this.checkedgoods.controlMa === '无') {
        this.decList.controlMa = ''
      } else {
        let maArr = []
        if (this.controller.iEFlag === 'I') { // 如果是进口
          // 出口的许可证
          let exportArr = ['3', '4', '5', '8', 'B', 'E', 'G', 'H', 'x', 'y']
          let controlMa = this.checkedgoods.controlMa.split('')
          for (let i in controlMa) {
            // 里面如果有出口的许可证 则去除
            if (!exportArr.includes(controlMa[i])) {
              maArr.push(controlMa[i])
            }
          }
        } else { // 出口
        // 进口特有的许可证
          let importArr = ['1', '2', '6', '7', '9', 'A', 'F', 'M', 'O', 'P', 'Q', 'R', 'Y', 'c', 'e', 'q', 't', 'v']
          let controlMa = this.checkedgoods.controlMa.split('')
          for (let i in controlMa) {
            // 里面如果有进口的许可证 则去除
            if (!importArr.includes(controlMa[i])) {
              maArr.push(controlMa[i])
            }
          }
        }
        this.decList.controlMa = maArr.join(',')
      }
      if (util.isEmpty(this.decList.gName)) {
        this.decList.gName = this.checkedgoods.gName
      }
      if (util.isEmpty(this.checkedgoods.gUnit)) {
        this.decList.gUnit = this.checkedgoods.unit1
      } else {
        this.decList.gUnit = this.checkedgoods.gUnit
      }
      this.decList.unit1 = this.checkedgoods.unit1
      this.decList.unit2 = this.checkedgoods.unit2
      this.unit2Change(this.checkedgoods.unit2)
      // 初始化下拉框 TODO
      this.initSelect(this.bodySelect, this.decList)
      // 设置 法定第一数量
      if (!util.isEmpty(this.decList.gUnit) && (this.decList.unit1 === this.decList.gUnit)) {
        this.decList.qty1 = this.decList.gQty
      }
      this.productListRadio = 0
      this.productListVisible = false
      // 判断是否为涉检报关单 如果是涉检 则需要弹出检验检疫商品列表弹出框
      let flag = this.CIQCheck()
      // 处理没有一开始还没有商品的情况
      if (!flag && this.tableList.length === 0) {
        if (!util.isEmpty(this.decHead.tradeMode) && (!util.isEmpty(this.decHead.tradeAreaCode) && (!util.isEmpty(this.checkedgoods.controlMa)))) {
          let districtType = ''
          if (this.decHead.tradeAreaCode === 'CHN') {
            districtType = '1'
          }
          // 处理去掉监管要求中的逗号
          let controlMa = this.checkedgoods.controlMa
          let tradeCondition = JSON.parse(window.localStorage.getItem('CUS_TRADE_MODE'))
          let index2 = tradeCondition.findIndex((element, i) => {
            if (element.tradeMode === this.decHead.tradeMode && (districtType === element.districtType.trim())) {
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
            if (this.encodeTableList === null || this.encodeTableList === undefined || this.encodeTableList.length === 0) {
              this.encodeTableList = []
            } else if (this.encodeTableList.length === 1) {
              this.decList.ciqName = this.encodeTableList[0].gNameNote
              this.decList.ciqCode = this.encodeTableList[0].ciqCo
              this.elementVisible = true
              this.encodeTableList = []
            } else {
              this.isOpenElement = true
              this.encodeTableVisible = true
            }
          }
        })
      } else {
        this.elementVisible = true
      }
    },
    // 取消选择 商品
    closeProductList () {
      this.productListRadio = 0
      this.productListVisible = false
      this.decList.codeTs = ''
    },
    // 打开 产品资质  备案信息 弹出框
    openfilingInfoContent () {
      // 判断 是否能打开弹出框
      this.$refs['bodyRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          // 显示弹出框
          this.filingInfoVisible = true
        }
      })
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
          let list = this.saasLicType1
          for (let i in list) {
            if (list[i].codeField === this.filingInfoForm.licTypeCode) {
              this.filingInfoForm.licTypeCodeValue = list[i].nameField
            }
          }
          // 核销数量单位code 转name
          let list2 = this.saasUnit4
          for (let i in list2) {
            if (list2[i].codeField === this.filingInfoForm.licWrtofQtyUnit) {
              this.filingInfoForm.licWrtofQtyUnitVaue = list2[i].nameField
            }
          }
          if (util.isEmpty(this.filingInfoForm.gNo)) {
            // 新增
            this.filingInfoForm.gNo = this.decList.decGoodsLimits.length + 1
            this.decList.decGoodsLimits.push(util.simpleClone(this.filingInfoForm))
          } else {
            // 修改
            let index = parseInt(this.filingInfoForm.gNo) - 1
            this.decList.decGoodsLimits[index] = util.simpleClone(this.filingInfoForm)
            this.decList.decGoodsLimits.push({})
            this.decList.decGoodsLimits.pop()
          }
          // 刷新 tableList
          this.saveDecListNoRefresh()
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
            for (let item in this.decList.decGoodsLimits) {
              if (delData[index].gNo === this.decList.decGoodsLimits[item].gNo) {
                this.decList.decGoodsLimits.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedFilingInfoList = []
          // 重新排序
          for (let i in this.decList.decGoodsLimits) {
            this.decList.decGoodsLimits[i].gNo = parseInt(i) + 1
          }
          // 刷新 tableList
          this.saveDecListNoRefresh()
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
      // 初始化下拉框
      this.initSelect(this.filingInfoSelect, this.filingInfoForm)
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
          this.initSelect(this.licVINSelect, this.licVINForm)
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
    // 单独校验 发票所列数量
    invoiceNumValid () {
      if (!(/^\d{1,14}$|^$/.test(this.licVINForm.invoiceNum))) {
        this.licVINForm.invoiceNum = ''
      }
    },
    // 关闭许可证VIN 弹窗
    licVINClose () {
      // 清除input 数据
      this.AddlicVIN()
      this.licVINVisible = false
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
      this.initSelect(this.licVINSelect, this.licVINForm)
    },
    // 打开 危险货物 弹出框
    openDangerGoods () {
      this.dangerGoodsVisible = true
      this.initSelect(this.dangerSelect, this.decList)
    },
    // 危险品货物 确定按钮
    sureDangerGoods () {
      this.dangerGoodsVisible = false
    },
    // 打开 商品项号关系 弹出框
    openGoodsGNo () {
      this.goodsGNoVisible = true
    },
    // 商品项号关系 初始化值
    GoodsGNoShow () {
      let goodsNoArr = []
      if (util.isEmpty(this.decContainer.goodsNo) === false) {
        goodsNoArr = this.decContainer.goodsNo.split(',')
      }
      // 设置选中值
      this.$nextTick(_ => {
        if (goodsNoArr.length > 0) {
          goodsNoArr.forEach(item => {
            this.$refs.goodsGNoTable.toggleRowSelection(this.tableList.find(d => parseInt(d.gNo) === parseInt(item)), true)
          })
        } else {
          this.$refs.goodsGNoTable.clearSelection()
        }
      })
    },
    // 商品项号关系 被选中的值
    goodsGNoChange (value) {
      this.checkedGoodsGNo = value
    },
    // 确定 商品项号 选中的值
    saveGoodsGNo () {
      let list = []
      if (this.checkedGoodsGNo.length > 0) {
        for (let index in this.checkedGoodsGNo) {
          list.push(this.checkedGoodsGNo[index].gNo)
        }
        this.decContainer.goodsNo = list.join(',')
      } else {
        this.decContainer.goodsNo = ''
      }
      this.goodsGNoVisible = false
    },
    // 原产地对应关系 清空数据
    addOriginRel () {
      this.originRelForm = {
        pid: '',
        decPid: '',
        licenseGno: '', // 随附单证序号
        cusCiqNo: '',
        decGno: '', // 商品序号
        ecoGno: '', // 原产地证书单证项号
        certType: '', // 随附单证代码
        ecoCertno: '' // 随附单证号
      }
    },
    // 原产地对应关系 保存数据
    saveOriginRel () {
      this.$refs['originRelRuleForm'].validate((valid) => {
        if (valid === true) {
          if (parseInt(this.originRelForm.decGno) > this.tableList.length) {
            this.messageTips('输入的商品序号不在范围内', 'error')
            return false
          }
          for (let i in this.decLicense.decEcoRealations) {
            if (this.decLicense.decEcoRealations[i].decGno === this.originRelForm.decGno) {
              this.messageTips('报关单商品序列号不能重复', 'error')
              return false
            }
          }
          if (util.isEmpty(this.originRelForm.licenseGno)) {
            // 新增
            this.originRelForm.licenseGno = this.decLicense.decEcoRealations.length + 1
            // 处理针对有<19>C010190015276这种情况
            let no = this.decLicense.certCode.split('>')
            if (no.length === 2) {
              this.originRelForm.certType = this.decLicense.docuCode + no[0].replace('<', '')
              this.originRelForm.ecoCertno = no[1]
            } else {
              this.originRelForm.certType = this.decLicense.docuCode
              this.originRelForm.ecoCertno = this.decLicense.certCode
            }
            this.decLicense.decEcoRealations.push(util.simpleClone(this.originRelForm))
          } else {
            // 修改
            let index = parseInt(this.originRelForm.licenseGno) - 1
            // 处理针对有<19>C010190015276这种情况
            let no = this.decLicense.certCode.split('>')
            if (no.length === 2) {
              this.originRelForm.certType = this.decLicense.docuCode + no[0].replace('<', '')
              this.originRelForm.ecoCertno = no[1]
            } else {
              this.originRelForm.certType = this.decLicense.docuCode
              this.originRelForm.ecoCertno = this.decLicense.certCode
            }
            this.decLicense.decEcoRealations[index] = util.simpleClone(this.originRelForm)
            // 为了刷新列表的 操作
            this.decLicense.decEcoRealations.push({})
            this.decLicense.decEcoRealations.pop()
          }
          this.addOriginRel()
          this.$refs['decGno'].$children[1].focus()
        }
      })
    },
    // 关闭原产地对应关系时 的回调函数
    colseOriginRel () {
      this.saveDecLic()
      this.originRelVisible = false
    },
    // 原产地对应关系 删除数据
    delOriginRel () {
      let delData = this.checkedOriginRelList
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
            for (let item in this.decLicense.decEcoRealations) {
              if (delData[index].licenseGno === this.decLicense.decEcoRealations[item].licenseGno) {
                this.decLicense.decEcoRealations.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedOriginRelList = []
          // 重新排序
          for (let i in this.decLicense.decEcoRealations) {
            this.decLicense.decEcoRealations[i].licenseGno = parseInt(i) + 1
          }
          // 重新 初始化 form表单
          this.addOriginRel()
        }).catch(() => {
        })
      }
    },
    // 原产地对应关系 获取被选择的数据
    originRelChange (value) {
      this.checkedOriginRelList = value
    },
    // 打开 原产地对应关系 弹出框
    openOriginRel () {
      let str = this.decLicense.docuCode
      let isFlag = false
      let arr = ['Y', 'E', 'R', 'F', 'J']
      for (let i in arr) {
        if (str === arr[i]) {
          isFlag = true
        }
      }
      if (isFlag) {
        this.originRelVisible = true
      } else {
        this.messageTips('单证代码不是Y/E/R/F/J!')
      }
    },
    // 重置 报关单表体 填制数据
    refreshDecList () {
      // 取消选择项
      if (this.isCheckbox) {
        this.$refs.decListTable.clearSelection()
      } else {
        this.bodyListRadio = ''
        this.checkedTableList = []
      }
      let decLen = this.tableList.length + 1
      this.decList = {
        decListPid: '', // 表体主键
        decPid: this.controller.pid, // 报关单主键
        ciqName: '', // 检验检疫名称
        codeTs: '', // 商品编号
        contrItem: '', // 备案序号
        dangName: '', // 危险货物名称
        dangPackSpec: '', // 危包规格
        dangPackType: '', // 危包类别
        decGoodsLimits: [], // 产品资质
        declPrice: '', // 单价
        declTotal: '', // 总价
        destCode: '', // 目的地代码
        destinationCountry: '', // 最终目的国（地区）
        districtCode: '', // 最终目的国（地区）名称
        dutyMode: '', // 征减免税方式
        engManentCnm: '', // 境外生产企业名称
        exgNo: '', // 货号
        exgVersion: '', // 版本号
        gModel: '', // 规格型号
        controlMa: '', // 监管要求
        gName: '', // 商品名称
        gNo: decLen, // 项号
        gQty: '', // 成交数量
        gUnit: '', // 成交计量单位
        gUnitValue: '', // 成交计量单位名称
        goodsAttr: '', // 货物属性
        goodsBrand: '', // 货物品牌
        goodsModel: '', // 货物型号
        stuffNote: '', // 成分/原料/组分
        goodsSpec: '', // 检验检疫货物规格
        noDangFlag: '', // 非危险化学品
        origPlaceCode: '', // 原产地区代码
        originCountry: '', // 原产国
        originCountryValue: '', // 原产国名称
        prodBatchNo: '', // 生产批号
        mnufctrRegno: '', // 生产单位代码
        prodQgp: '', // 产品保质期
        prodValidDt: '', // 产品有效期
        produceDate: '', // 生产日期
        purpose: '', // 用途
        qty1: '', // 法定第一数量
        qty2: '', // 法定第二数量
        tradeCurr: '', // 币制
        tradeCurrValue: '', // 币制名称
        unCode: '', // N编码
        unit1Value: '', // 法定第一计量单位名称
        unit1: '', // 法定第一计量单位
        unit2: '', // 法定第二计量单位
        unit2Value: '', // 法定第二计量单位名称
        decSupplements: [], // 补充申报
        declGoodsEname: '', // 申报货物名称（外文）
        ciqCode: '' // CIQ代码
      }
      this.showFied.showGoodsAttrValue = ''
      this.showFied.showGoodsSpec = ''
      this.controller.qty2Disabled = true
      this.resetDodySelect()
      this.backFillDistrictCode()
      if (this.controller.iEFlag === 'I') { // 进口
        // this.decHead.iEDate = this.getTodayDate()
        //  设置表体 最终目的国(地区)默认值为中国
        this.decList.destinationCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry3',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
      } else { // 出口
        //  设置表体 原产国(地区)默认值为中国
        this.decList.originCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry4',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
        this.decList.destinationCountry = this.decHead.tradeCountry
        if (!util.isEmpty(this.decList.destinationCountry)) {
          this.selectObj = {
            obj: 'saasCountry3',
            params: 'SAAS_COUNTRY'
          }
          this.checkParamsList(this.decList.destinationCountry, 'init')
        }
        // 初始化 征免方式
        this.initdutyMode()
        // 获得焦点
        this.focusDecList()
      }
    },
    // 重置 表体的下拉框
    resetDodySelect () {
      this.saasUnit1 = []
      this.saasCurr4 = []
      this.saasUnit2 = []
      this.saasCountry3 = []
      this.saasUnit3 = []
      this.saasCountry4 = []
      this.saasCiqOriginPlace = []
      this.saasDistrictRel = []
      this.saasCiqCityCn = []
      this.saasLevymode = []
      this.saasUserTo = []
    },
    // 点击报关单表体table 单行事件
    rowClickDecList (row, event, column) {
      if (this.isCheckbox) { // 多选执行 多选不执行
        let flag = false
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
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.decList = util.simpleClone(this.checkedTableList[0])
        this.formatDecList()
      }
    },
    // 反填 报关单表体信息
    backDeccListInfo (row) {
      this.$refs.decListTable.toggleRowSelection(row, true)
      this.decList = util.simpleClone(row)
      this.formatDecList()
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
      this.showFied.showGoodsSpec = param.join(',')
      // 货物属性 转化为name
      let goodsAttrValue = []
      let list = this.decList.goodsAttr.split(',')
      let comList = this.saasGoodsAttr
      for (let n in list) {
        for (let i in comList) {
          if (list[n] === comList[i].codeField) {
            goodsAttrValue.push(comList[i].nameField)
          }
        }
      }
      this.showFied.showGoodsAttrValue = goodsAttrValue.join(',')
      // 初始化表体下拉框
      this.initSelect(this.bodySelect, this.decList)
      // 如果法定第二计量单位有值则 法定第二数据 可输入
      this.unit2Change(this.decList.unit2)
    },
    // 获取选中的报关单 表体 信息
    decListChange (value) {
      this.checkedTableList = util.simpleClone(value)
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
        this.$refs.decListTable.toggleRowSelection(row, false)
        this.refreshDecList()
      }
    },
    checkboxChange (value) {
      this.bodyListRadio = ''
      this.checkedTableList = []
      this.bodyShow = false
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
        this.$nextTick(_ => {
          if (list.length > 0) {
            list.forEach(item => {
              this.$refs.decListTable.toggleRowSelection(this.tableList.find(d => d.gNo === item.gNo), true)
            })
          } else {
            this.$refs.decListTable.clearSelection()
          }
        })
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
    // 单选选择表体
    checkThisBody (index) {
      this.checkedTableList[0] = util.simpleClone(this.tableList[index])
      this.decList = util.simpleClone(this.checkedTableList[0])
      this.formatDecList()
    },
    // 直接保存报关单表体,需要添加报关单表体的校验逻辑
    directSaveDecList (value) {
      if ((value === '1' && this.isShow2 === false) || value === '2') {
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
            // 向后端发送请求
            let flag = true // 判断是否需要发送请求查询价格浮动区间
            let priceTipsForm = {
              type: this.controller.iEFlag, // 业务类型 I E
              codeTs: this.decList.codeTs, // 商品编号
              tradeName: this.decHead.tradeName, // 境内收发货人
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
            if (flag) {
              // 发送请求 校验价格波动区间是否正常
              this.$post({
                url: 'API@/dec-common/decParam/common/getPriceList',
                data: priceTipsForm,
                success: (res) => {
                  // 逻辑校验
                  let messgeTips = this.validDecList()
                  if (res.code === '0000') {
                    if (res.result.list.length > 0) {
                      let data = res.result.list[0]
                      let declPrice = this.Mul(parseInt(this.decList.declPrice), 100) // 现值
                      let lowBand = this.Mul(parseInt(data.declPrice), this.Sub(100, parseInt(data.bandArea))) // 参考值最低值
                      let upperBand = this.Mul(parseInt(data.bandArea) + 100, parseInt(data.declPrice)) // 参考值最高值
                      if (declPrice < lowBand || declPrice > upperBand) {
                        let mesLen = messgeTips.length + 1
                        messgeTips.push(mesLen + '.' + '成交价格,不在维护的浮动价格区间之内，请核对')
                      }
                    }
                    if (!util.isEmpty(res.result.maxPrice)) { // 历史数据的价格区间校验
                      let declPrice = parseInt(this.decList.declPrice) // 现值
                      let maxPrice = parseInt(res.result.maxPrice)
                      let minPirce = parseInt(res.result.minPirce)
                      if (declPrice < minPirce || declPrice > maxPrice) {
                        let mesLen = messgeTips.length + 1
                        messgeTips.push(mesLen + '.' + '成交价格,不在历史申报数据的价格(' + minPirce + '~' + maxPrice + ')波动范围内，请核对')
                      }
                    }
                  }
                  // 提示
                  if (messgeTips.length !== 0) {
                    let tips = messgeTips.join('<br><br>')
                    this.messageTips(tips)
                  }
                  this.saveDecListNoRefresh()
                  this.saveRefreshDecList(util.simpleClone(this.decList))
                  // this.refreshDecList()
                }
              })
            } else {
              // 逻辑校验
              let messgeTips = this.validDecList()
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
      }
    },
    // 保存报关单表体时 需要清除数据
    saveRefreshDecList (listVo) {
      let decLen = this.tableList.length + 1
      this.decList = {
        decListPid: '', // 表体主键
        decPid: this.controller.pid, // 报关单主键
        ciqName: '', // 检验检疫名称
        codeTs: '', // 商品编号
        contrItem: '', // 备案序号
        dangName: '', // 危险货物名称
        dangPackSpec: '', // 危包规格
        dangPackType: '', // 危包类别
        decGoodsLimits: [], // 产品资质
        declPrice: '', // 单价
        declTotal: '', // 总价
        destCode: listVo.destCode, // 目的地代码
        destinationCountry: listVo.destinationCountry, // 最终目的国（地区）
        districtCode: listVo.districtCode, // 境内目的地
        dutyMode: listVo.dutyMode, // 征免方式
        engManentCnm: '', // 境外生产企业名称
        exgNo: '', // 货号
        exgVersion: '', // 版本号
        gModel: '', // 规格型号
        controlMa: '', // 监管要求
        gName: '', // 商品名称
        gNo: decLen, // 项号
        gQty: '', // 成交数量
        gUnit: '', // 成交计量单位
        gUnitValue: '', // 成交计量单位名称
        goodsAttr: '', // 货物属性
        goodsBrand: '', // 货物品牌
        goodsModel: '', // 货物型号
        stuffNote: '', // 成分/原料/组分
        goodsSpec: '', // 检验检疫货物规格
        noDangFlag: '', // 非危险化学品
        origPlaceCode: '', // 原产地区代码
        originCountry: listVo.originCountry, // 原产国
        originCountryValue: '', // 原产国名称
        prodBatchNo: '', // 生产批号
        mnufctrRegno: '', // 生产单位代码
        prodQgp: '', // 产品保质期
        prodValidDt: '', // 产品有效期
        produceDate: '', // 生产日期
        purpose: '', // 用途
        qty1: '', // 法定第一数量
        qty2: '', // 法定第二数量
        tradeCurr: listVo.tradeCurr, // 币制
        tradeCurrValue: '', // 币制名称
        unCode: '', // N编码
        unit1Value: '', // 法定第一计量单位名称
        unit1: '', // 法定第一计量单位
        unit2: '', // 法定第二计量单位
        unit2Value: '', // 法定第二计量单位名称
        decSupplements: [], // 补充申报
        declGoodsEname: '', // 申报货物名称（外文）
        ciqCode: '' // CIQ代码
      }
      this.showFied.showGoodsAttrValue = ''
      this.showFied.showGoodsSpec = ''
      this.controller.qty2Disabled = true
      this.initSelect(this.bodySelect, this.decList)
      this.focusDecList()
    },
    // 表体字段的初始化聚焦
    focusDecList () {
      if (this.controller.contrItemDisabled === true) {
        this.$refs['gName'].$children[1].focus()
        this.$refs['gName'].$children[1].select()
      } else {
        this.$refs['contrItem'].$children[1].focus()
        this.$refs['contrItem'].$children[1].select()
      }
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
          // this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
          this.bodyListRadio = ''
        }
        // 重新设置商品对应关系列表
        this.resetGoodsEnNameList()
        return true
      }
      // 一个变量 记录 是否为新增新
      let isModify = true
      for (let i in this.tableList) {
        if (this.tableList[i].gNo === gNo) { // 存在相同的gNo 走修改
          this.tableList[i] = util.simpleClone(this.decList)
          // 为了刷新列表
          this.tableList.push({})
          this.tableList.pop()
          // 重新设置商品对应关系列表
          this.resetGoodsEnNameList()
          isModify = false
          break
        }
      }
      if (isModify) { // 走新增
        this.tableList.push(util.simpleClone(this.decList))
        // 重新设置商品对应关系列表
        this.resetGoodsEnNameList()
      }
    },
    // 保存报关单表体所需要做的逻辑校验
    validDecList () {
      // 校验特殊格式
      let messgeTips = []
      let mesLen
      for (let i in this.tableList) {
        // 如果 是修改的话 本条数据就不用与自身比较
        if (this.tableList[i].gNo === this.decList.gNo) {
          continue
        }
        let no = parseInt(this.tableList[i].gNo)
        // 1.单价
        if (this.tableList[i].codeTs === this.decList.codeTs && (this.tableList[i].gName === this.decList.gName)) {
          if (this.tableList[i].declPrice !== this.decList.declPrice) {
            let message = '该商品单价与项号【' + no + '】的[单价]不一致'
            mesLen = messgeTips.length + 1
            messgeTips.push(mesLen + '.' + message)
          }
        }
        // 2. 币制
        if (this.tableList[i].tradeCurr !== this.decList.tradeCurr) {
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
        if (['0255', '0654'].includes(this.decHead.tradeMode)) {
          arr.push('K')
        }
        // 进口时启运国为“CHN 中国”，且征免方式为“1 照章征税”，未添加添加随附单证时提示
        if (this.decHead.tradeCountry === 'CHN' && this.controller.iEFlag === 'I' && this.decList.dutyMode === '1') {
          arr.push('c')
        }
        for (let g in arr) {
          if (arr[g] === 'A') {
            arr.splice(g, 1)
            break
          }
        }
        for (let x in this.licenselist) {
          for (let y in arr) {
            if (this.licenselist[x].docuCode === arr[y]) {
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
      // 校验 备案号涉及E和H打头的在加工成品单耗版本号进行提示
      if (!util.isEmpty(this.decHead.manualNo) && ['H', 'E'].includes(this.decHead.manualNo.trim().charAt(0).toUpperCase()) && util.isEmpty(this.decList.exgVersion)) {
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
            let gQty = this.Mul(parseFloat(this.decList.gQty), compareMap[this.decList.gUnit].rate)
            let qty1 = parseFloat(this.decList.qty1)
            if (gQty !== qty1) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '成交单位为' + compareMap[this.decList.gUnit].origName + ',法定第一单位为' + compareMap[this.decList.gUnit].compName + ',相对应数量倍率为:' + compareMap[this.decList.gUnit].rate)
            }
          }
        }
        if (!util.isEmpty(this.decList.unit2) && (this.decList.gUnit !== this.decList.unit2) && (this.decList.unit2 === compareMap[this.decList.gUnit].unit)) {
          if (this.decList.gQty && this.decList.qty2) {
            let gQty = this.Mul(parseFloat(this.decList.gQty), compareMap[this.decList.gUnit].rate)
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
            let qty1 = this.Mul(parseFloat(this.decList.qty1), compareMap[this.decList.unit1].rate)
            if (gQty !== qty1) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '法定第一单位为' + compareMap[this.decList.unit1].origName + ',成交单位为' + compareMap[this.decList.unit1].compName + ',相对应数量倍率为:' + compareMap[this.decList.unit1].rate)
            }
          }
        }
        if (!util.isEmpty(this.decList.unit2) && (this.decList.unit1 !== this.decList.unit2) && (this.decList.unit2 === compareMap[this.decList.unit1].unit)) {
          if (this.decList.qty1 && this.decList.qty2) {
            let qty1 = this.Mul(parseFloat(this.decList.qty1), compareMap[this.decList.gUnit].rate)
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
            let qty2 = this.Mul(parseFloat(this.decList.qty2), compareMap[this.decList.unit2].rate)
            if (gQty !== qty2) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '法定第二单位为' + compareMap[this.decList.unit2].origName + ',成交单位为' + compareMap[this.decList.unit2].compName + ',相对应数量倍率为:' + compareMap[this.decList.unit2].rate)
            }
          }
        }
        if ((this.decList.unit1 !== this.decList.unit2) && (this.decList.unit1 === compareMap[this.decList.unit2].unit)) {
          if (this.decList.qty1 && this.decList.qty2) {
            let qty1 = parseFloat(this.decList.qty1)
            let qty2 = this.Mul(parseFloat(this.decList.qty2), compareMap[this.decList.unit2].rate)
            if (qty1 !== qty2) {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '法定第二单位为' + compareMap[this.decList.unit2].origName + ',法定第二单位为' + compareMap[this.decList.unit2].compName + ',应满足倍率为:' + compareMap[this.decList.unit2].rate)
            }
          }
        }
      }
      let _tradeMode = this.decHead.tradeMode
      // 校验 出口表头运抵国和表体目的国一致性
      if (this.controller.iEFlag === 'E' && this.switch['logic_prosecution_part'] === 'Y') {
        if (this.switch['CA000001'] === 'Y' && this.decList.destinationCountry !== this.decHead.tradeCountry) {
          mesLen = messgeTips.length + 1
          messgeTips.push(mesLen + '.' + '出口表头【运抵国】和表体【最终目的国】需要一致')
        }
        if (this.switch['CA000002'] === 'Y' && !util.isEmpty(this.decHead.distinatePort)) {
          if (/[0-9]/.test(this.decHead.distinatePort.charAt(0))) {
            if (this.decList.destinationCountry !== 'CHN') {
              mesLen = messgeTips.length + 1
              messgeTips.push(mesLen + '.' + '出口,【指运港】代码第1位为数字，【最终目的国(地区)】为中国')
            }
          } else {
            if (this.decHead.distinatePort.substr(0, 3) !== this.decList.destinationCountry) {
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
      let _cutMode = this.decHead.cutMode // 征免性质
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
    // 删除 报关单表体 信息
    delDecList () {
      let delData = this.checkedTableList
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
          this.resetGoodsEnNameList()
          // 重新 初始化 form表单
          this.refreshDecList()
        }).catch(() => {
        })
      }
    },
    // 复制 报关单 一条表体数据
    copyDecList () {
      if (this.tableList.length === 50) {
        this.messageTips('表体数据不能超过50条')
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
          this.initSelect(this.bodySelect, this.decList)
          // 重新设置商品对应关系列表
          this.resetGoodsEnNameList()
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
            // 重新设置商品对应关系列表
            this.resetGoodsEnNameList()
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
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.decList = util.simpleClone(this.checkedTableList[0])
        this.tableList[checkGNo - 1] = checkedData
        this.tableList[checkGNo] = changeData
        this.tableList.push({})
        this.tableList.pop()
        this.formatDecList()
        // 重新设置商品对应关系列表
        this.resetGoodsEnNameList()
      }
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
            // 重新设置商品对应关系列表
            this.resetGoodsEnNameList()
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
        // 重新设置商品对应关系列表
        this.resetGoodsEnNameList()
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
      if (data.length === 1 || this.bodyListRadio !== '') {
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
            if (!productList === undefined || productList.length === 0) {
              this.messageTips('本数据商品编号不正确，请先重新设置', 'error')
            } else {
              this.decElementPara = {
                checkedgoods: productList[0], // 加载数据
                opeType: 'edit', // 操作类型 add 新增  edit 编辑  look 查看
                gModel: this.checkedTableList[0].gModel, // 规格型号
                iEFlag: this.decHead.iEFlag // 进出口标志
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
            } else {
              this.decElementPara = {
                checkedgoods: productList[0], // 加载数据
                opeType: 'add', // 操作类型 add 新增  edit 编辑  look 查看
                gModel: this.decList.gModel, // 规格型号
                iEFlag: this.controller.iEFlag // 进出口标志
              }
              this.elementVisible = true
            }
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
            this.decElementPara = {
              checkedgoods: productList[0], // 加载数据
              opeType: 'look', // 操作类型 add 新增  edit 编辑  look 查看
              gModel: this.checkedTableList[0].gModel, // 规格型号
              iEFlag: this.decHead.iEFlag // 进出口标志
            }
            this.elementVisible = true
          }
        }
      })
    },
    // 批量修改 初始化数据和打开弹出框
    BulkEditing () {
      if (this.isCheckbox) { // 多选
        let len = this.checkedTableList.length
        if (len === 0) {
          this.messageTips('至少选择一条数据')
        }
        return
      } else {
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条的商品')
          return
        }
      }
      // 1.初始化数据
      this.BulkEditingList = {
        'iEFlag': this.controller.iEFlag
      }
      // 2.打开弹出框
      this.BulkEditingVisible = true
    },
    // 批量修改 接受数据
    saveBulkEditing (value) {
      if (this.isCheckbox) {
        for (let i in this.checkedTableList) {
          let index = parseInt(this.checkedTableList[i].gNo) - 1
          this.tableList[index].tradeCurr = value.tradeCurr
          this.tableList[index].tradeCurrValue = value.tradeCurrValue
          if (this.controller.iEFlag === 'I') {
            this.tableList[index].originCountry = value.originCountry
            this.tableList[index].originCountryValue = value.originCountryValue
          } else {
            this.tableList[index].destinationCountry = value.destinationCountry
            this.tableList[index].destinationCountryValue = value.destinationCountryValue
          }
          this.tableList[index].districtCode = value.districtCode
          this.tableList[index].dutyMode = value.dutyMode
          this.tableList[index].dutyModeValue = value.dutyModeValue
        }
      } else {
        let gNo = this.bodyListRadio
        this.tableList[gNo].tradeCurr = value.tradeCurr
        this.decList.tradeCurr = value.tradeCurr
        this.tableList[gNo].tradeCurrValue = value.tradeCurrValue
        if (this.controller.iEFlag === 'I') {
          this.tableList[gNo].originCountry = value.originCountry
          this.tableList[gNo].originCountryValue = value.originCountryValue
          this.decList.originCountry = value.originCountry
        } else {
          this.tableList[gNo].destinationCountry = value.destinationCountry
          this.tableList[gNo].destinationCountryValue = value.destinationCountryValue
          this.decList.destinationCountry = value.destinationCountry
        }
        this.tableList[gNo].districtCode = value.districtCode
        this.decList.districtCode = value.districtCode
        this.tableList[gNo].dutyMode = value.dutyMode
        this.tableList[gNo].dutyModeValue = value.dutyModeValue
        this.decList.dutyMode = value.dutyMode
        // 初始化下拉框
        this.initSelect(this.bodySelect, this.decList)
      }
      // 强制刷新
      this.tableList.push({})
      this.tableList.pop()
      this.BulkEditingVisible = false
    },
    // 批量修改 取消批量修改
    cancleBulkEditing () {
      this.BulkEditingVisible = false
    },
    // 接受 随附单据 组件 传回的数据
    receptionAccDocData (param) {
      let data = util.simpleClone(param)
      this.decHead.decEdocRealations = data.accDocList
      this.decHead.decMarkLobs = data.decMarkLobs
      this.accDocVisible = false
    },
    // 随附单据组件  取消传输数据的操作
    cancleAccDocData (param) {
      this.accDocVisible = false
    },
    // 清除 随附单证 新增数据
    refreshDoc () {
      this.decLicense = { // 随附单证数据
        pid: '', // 主键
        decPid: this.controller.pid, // 外键
        certCode: '', // 单证编号
        docuCode: '', // 单证代码
        gNo: '', // 序号
        decEcoRealations: [] // 原产地证明
      }
      this.saasLicensedocu = []
    },
    // 删除随附单证
    delDoc () {
      let delData = this.checkedDecLicList
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
            for (let item in this.licenselist) {
              if (delData[index].docuCode === this.licenselist[item].docuCode) {
                if (delData[index].docuCode === 'c') {
                  this.tableList = []
                  this.resetGoodsEnNameList()
                  this.controller.cDisabled = false
                  this.refreshDecList()
                }
                this.licenselist.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedDecLicList = []
          // 重新 初始化 form表单
          this.refreshDoc()
        }).catch(() => {
        })
      }
    },
    resetlic () {
      let arr = []
      if (this.licenselist.length > 0) {
        for (let i in this.licenselist) {
          arr.push(this.licenselist[i].docuCode)
        }
        this.showFied.attaDocuCdstr = arr.join(',')
      } else {
        this.showFied.attaDocuCdstr = ''
      }
    },
    // 获取 随附单证 被选中的值
    decLicChange (value) {
      this.checkedDecLicList = value
    },
    // 点击多选框时候的操作
    decLicCheckChange (selection, row) {
      let flag = false
      for (let i in selection) {
        if (selection[i].gNo === row.gNo) {
          flag = true
          break
        }
      }
      if (flag) {
        this.backDecLicInfo(row)
      } else {
        this.$refs.decLicTable.toggleRowSelection(row, false)
        this.refreshDoc()
      }
    },
    // 随附单证 判断重复的方法
    docuCodeChanage (value) {
      let index = -1
      index = this.licenselist.findIndex((item, i) => {
        return item.docuCode === value
      })
      if (index > -1) {
        this.decLicense.docuCode = ''
        this.saasLicensedocu = []
        this.$refs['docuCode'].focus()
        this.messageTips('随附单证代码不能重复')
      }
    },
    beforeSaveDecLic () {
      // 校验
      this.$refs['docuRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          if (this.decLicense.docuCode === 'U') {
            if (!/^[0-9A-Za-z]{12}:[0-9]{1,2}$/.test(this.decLicense.certCode)) {
              this.messageTips('随附单证代码U时，随附单证编号录入规则为12位通关证明编码:商品项号')
              return
            }
          }
          if (this.decLicense.docuCode === 'A') {
            if (!/^[0-9A-Za-z]{15}|[0-9A-Za-z]{18}$/.test(this.decLicense.certCode)) {
              this.messageTips('随附单证代码A时，随附单证编号录入规则固定为15位或18位字符')
              return
            }
          }
          if (['Y', 'E', 'R', 'F', 'J'].includes(this.decLicense.docuCode)) {
            // 原产地证
            this.openOriginRel()
          } else if (this.decLicense.docuCode === 'c' && this.controller.iEFlag === 'I' && this.controller.cDisabled === false) {
            // 打开联系单备案商品信息列表
            if (util.isEmpty(this.decHead.manualNo)) {
              this.messageTips('随附单证代码c时，备案号不可为空')
              return
            }
            if (!['0245', '0444', '0445', '0446', '0544', '0545', '0644', '0844', '0845'].includes(this.decHead.tradeMode)) {
              this.messageTips('随附单证代码c时,监管方式必须为0245、0444、0445、0446、0544、0545、0644、0844、0845')
              return
            }
            this.queryManualGoods()
          } else {
            this.saveDecLic()
          }
        }
      })
    },
    // 查询联系单备案商品信息
    queryManualGoods () {
      this.$post({
        url: 'API@/dec-common/dec/common/queryManualList',
        data: {
          'certCode': this.decLicense.certCode,
          'docuCode': this.decLicense.docuCode,
          'iEFlag': this.controller.iEFlag,
          'manualNo': this.decHead.manualNo,
          'tradeMode': this.decHead.tradeMode
        },
        success: (res) => {
          if (!res.result && res.result.length > 0) {
            this.initManualGoods = util.simpleClone(res.result)
            this.openManualGoods()
          } else {
            this.messageTips('查无联系单备案商品信息！')
          }
        }
      })
    },
    // 保存 随附单证
    saveDecLic () {
      // 确报以前需要原产地对应信息，xiu改后又不需要原产地对应信息
      let arr = ['Y', 'E', 'R', 'F', 'J']
      if (!arr.includes(this.decLicense.docuCode)) {
        this.decLicense.decEcoRealations = []
      } else { // 如果是原产地, 防止单证编号修改而 对应关系里的单证编号没有被修改
        for (let n in this.decLicense.decEcoRealations) {
          let no = this.decLicense.certCode.split('>')
          if (no.length === 2) {
            this.decLicense.decEcoRealations[n].certType = this.decLicense.docuCode + no[0].replace('<', '')
            this.decLicense.decEcoRealations[n].ecoCertno = no[1]
          } else {
            this.decLicense.decEcoRealations[n].certType = this.decLicense.docuCode
            this.decLicense.decEcoRealations[n].ecoCertno = this.decLicense.certCode
          }
        }
      }
      if (this.decLicense.docuCode !== 'c' && util.isEmpty(this.decLicense.certCode)) {
        this.decLicense.certCode = 'NA'
      }
      let gNo = this.decLicense.gNo
      if (util.isEmpty(gNo)) { // 如果gNo 无值  走新增路线
        this.decLicense.gNo = this.licenselist.length + 1
        this.licenselist.push(util.simpleClone(this.decLicense))
      } else { // 如果gNo 有值  走修改路线
        for (let i in this.licenselist) {
          if (this.licenselist[i].gNo === gNo) {
            // 如果 修改是从c改变的。则需要清除表体数据
            if (this.licenselist[i].docuCode === 'c' && this.decLicense.docuCode !== 'c' && this.controller.iEFlag === 'I') {
              this.tableList = []
              this.resetGoodsEnNameList()
              this.controller.cDisabled = false
              this.refreshDecList()
            }
            this.licenselist[i] = this.decLicense
            // 为了刷新列表的 操作
            this.licenselist.push({})
            this.licenselist.pop()
            break
          }
        }
      }
      this.refreshDoc()
    },
    // 单击 随附单证 反填 数据
    backDecLicInfo (row) {
      this.$refs.decLicTable.toggleRowSelection(row, true)
      this.decLicense = util.simpleClone(row)
      this.initSelect(this.docuSelect, this.decLicense)
    },
    // 保存 集装箱
    saveDecConta () {
      let e = arguments
      this.$refs['containerRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          if (!this.verifyContainerNo()) {
            this.messageTips('集装箱格式不符合ISO6346（1995）标准，请确认')
          }
          let gNo = this.decContainer.gNo
          let list = this.saasContainerModel
          // 获取 规格型号名称并赋值
          for (let i in list) {
            if (list[i].codeField === this.decContainer.containerSize) {
              this.decContainer.containerSizeValue = list[i].nameField
            }
          }
          if (util.isEmpty(gNo)) { // 如果gNo 无值  走新增路线
            // 校验 集装箱号是否重复
            for (let n in this.tableDecContainerlist) {
              if (this.tableDecContainerlist[n].containerNo === this.decContainer.containerNo) {
                this.messageTips('集装箱号已存在', 'error')
                return false
              }
            }
            this.decContainer.gNo = this.tableDecContainerlist.length + 1
            this.tableDecContainerlist.push(util.simpleClone(this.decContainer))
          } else { // 如果gNo 有值  走修改路线
            // 1. 确定修改后的数据会不会存在 集装箱号相同
            for (let n in this.tableDecContainerlist) {
              // 不需要跟自身比较
              if (this.tableDecContainerlist[n].gNo === gNo) {
                continue
              }
              if (this.tableDecContainerlist[n].containerNo === this.decContainer.containerNo) {
                this.messageTips('集装箱号已存在', 'error')
                return false
              }
            }
            for (let i in this.tableDecContainerlist) {
              if (this.tableDecContainerlist[i].gNo === gNo) {
                this.tableDecContainerlist[i] = util.simpleClone(this.decContainer)
                // 为了刷新列表的 操作
                this.tableDecContainerlist.push({})
                this.tableDecContainerlist.pop()
                break
              }
            }
          }
          e[0].target.blur()
          e[0].target.form.querySelectorAll('input')[0].focus()
          this.refreshDecConta()
        }
      })
    },
    // 检验集装箱号
    verifyContainerNo () {
      let value = this.decContainer.containerNo.split('')
      let getNumber = new Map()
      let num = 10
      // 生成字母与数字对照表
      for (let i = 0; i < 26; i++) {
        let word = String.fromCharCode((65 + i))
        // 对应码取消了11的倍数，比如11，22，33，所以我们要排除掉
        if (num === 11 || num === 22 || num === 33) {
          num += 1
        }
        getNumber.set(word, num)
        num += 1
      }
      let sum = 0
      // 取四个字母对应的数字，并进行计算
      for (let m = 0; m < 4; m++) {
        sum += getNumber.get(value[m]) * Math.pow(2, m)
      }
      // 对前6个数字进行计算
      for (let n = 4; n < 10; n++) {
        sum += value[n] * Math.pow(2, n)
      }
      // 再对10取余是防止出现校验码为10的情况，假如校验码为10，则取0
      let checkDigit = sum % 11 % 10
      // 判断校验码是否与最后一位数字相等
      if (checkDigit === Number(value[10])) {
        return true
      } else {
        return false
      }
    },
    // 删除 集装箱
    delDecConta () {
      let delData = this.checkedDecContaList
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
            for (let item in this.tableDecContainerlist) {
              if (delData[index].gNo === this.tableDecContainerlist[item].gNo) {
                this.tableDecContainerlist.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedDecContaList = []
          // 重新排序
          for (let i in this.tableDecContainerlist) {
            this.tableDecContainerlist[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化 form表单
          this.refreshDecConta()
        }).catch(() => {
        })
      }
    },
    // 选中反填集装箱信息
    backDecContaInfo (row) {
      this.$refs.tableDecContainer.toggleRowSelection(row, true)
      this.decContainer = util.simpleClone(row)
      this.initSelect(this.containerSelect, this.decContainer)
    },
    // 清除 集装箱 Form
    refreshDecConta () {
      this.decContainer = {
        pid: '', // 主键
        decPid: this.controller.pid, // 外键
        containerNo: '', // 集装箱号
        containerSize: '', // 集装箱规格
        containerSizeValue: '', // 集装箱规格名称
        containerWeight: '', // 箱货重量
        goodsNo: '', // 商品项号
        lclFlag: '', // 拼箱标识
        gNo: '', // 序号
        note: '' // note
      }
      this.saasContainerModel = []
      this.commomPara2 = []
    },
    // 获取 集装箱 被选中的值
    decContaChange (value) {
      this.checkedDecContaList = value
    },
    // 勾选多选框时的操作
    decContaCheckChange (selection, row) {
      let flag = false
      for (let i in selection) {
        if (selection[i].gNo === row.gNo) {
          flag = true
          break
        }
      }
      if (flag) {
        this.backDecContaInfo(row)
      } else {
        this.$refs.tableDecContainer.toggleRowSelection(row, false)
        this.refreshDecConta()
      }
    },
    // 编辑商品英文名称的弹出框
    openGoodsEnConent () {
      this.goodsEnNameVisible = true
    },
    // 商品英文名称 设置默认选中
    goodsEnNameShow () {
      if (util.isEmpty(this.decHead.gEnName)) {
        return false
      }
      // let comList = this.decHead.gEnName.split(',')
      // // 赋值英文 名称
      // for (let index in comList) {
      //   for (let n in this.goodsEnNameList) {
      //     if (comList[index].split('-')[0] === this.goodsEnNameList[n].gNo) {
      //       this.goodsEnNameList[n].declGoodsEname = comList[index].split('-')[1]
      //     }
      //   }
      // }
      // // 设置默认选择
      // this.$nextTick(_ => {
      //   if (comList.length > 0) {
      //     comList.forEach(item => {
      //       this.$refs.goodsEnNameTable.toggleRowSelection(this.goodsEnNameList.find(d => d.gNo === item.split('-')[0]), true)
      //     })
      //   } else {
      //     this.$refs.goodsEnNameTable.clearSelection()
      //   }
      // })
    },
    // 商品英文名称 获取选中的值
    goodsEnNameChange (value) {
      this.checkedGoodsEnNameList = value
    },
    // 商品英文名称 保存选中的值
    saveGoodsEnName () {
      for (let i in this.checkedGoodsEnNameList) {
        // 选中的值点击保存 是需要修改对应商品列表的英文名称
        for (let n in this.tableList) {
          if (this.checkedGoodsEnNameList[i].gNo === this.tableList[n].gNo) {
            this.tableList[n].declGoodsEname = this.checkedGoodsEnNameList[i].declGoodsEname
          }
        }
      }
      // 重置表头商品英文关系
      this.resetGoodsEnName()
      this.checkedGoodsEnNameList = []
      this.$refs.goodsEnNameTable.clearSelection()
      this.goodsEnNameVisible = false
    },
    // 重新计算商品英文对应关系
    resetGoodsEnName () {
      let list = []
      for (let i in this.tableList) {
        if (!util.isEmpty(this.tableList[i].declGoodsEname)) { // 如果存在英文名称
          list.push(this.tableList[i].gNo + '-' + this.tableList[i].declGoodsEname)
        }
      }
      this.decHead.gEnName = list.join(',')
    },
    // 重置商品对应关系列表
    resetGoodsEnNameList () {
      this.goodsEnNameList = []
      for (let i in this.tableList) {
        this.goodsEnNameList.push({
          gNo: this.tableList[i].gNo,
          codeTs: this.tableList[i].codeTs,
          gName: this.tableList[i].gName,
          declGoodsEname: this.tableList[i].declGoodsEname
        })
      }
      // 重置表头商品英文关系
      this.resetGoodsEnName()
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
      // 重设下拉框
      // this.initSelect(this.bodySelect, this.decList)
      this.tableList.push({})
      this.tableList.pop()
      this.elementVisible = false
      this.$refs['gQty'].$children[1].focus()
      this.$refs['gQty'].$children[1].select()
    },
    // 取消 表体的规格型号 反填
    cancleElement () {
      this.elementVisible = false
      this.$refs['gQty'].$children[1].focus()
      this.$refs['gQty'].$children[1].select()
    },
    // 附注信息
    saveExtraNote (value) {
      this.decHead.remarkInfo = value.extraNote
      this.additionInfoLaVisible = false
    },
    // 取消编辑 附注信息
    cancleExtraNote () {
      this.additionInfoLaVisible = false
    },
    // 保费、运费、杂费的控制逻辑
    feeChange (value, index) {
      if (index === 1) {
        if (value === '1') {
          this.decHead.feeCurr = ''
          this.controller.feeCurrDisabled = true
          this.ruleRegx['feeRate'] = '^\\d{1,2}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.feeRate = [ // 运费 费率、单价、总价
            {validator: this.checkFateValid, message: '输入0.0001~99的数字', trigger: 'blur'}
          ]
        } else if (value === '2') {
          this.controller.feeCurrDisabled = false
          this.ruleRegx['feeRate'] = '^\\d{1,10}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.feeRate = [ // 运费 费率、单价、总价
            {validator: this.checkValid, message: '输入整数部分不超过10位，小数不超过4位的数字', trigger: 'blur'}
          ]
        } else {
          this.controller.feeCurrDisabled = false
          this.ruleRegx['feeRate'] = '^\\d{1,12}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.feeRate = [ // 运费 费率、单价、总价
            {validator: this.checkValid, message: '输入整数部分不超过12位，小数不超过4位的数字', trigger: 'blur'}
          ]
        }
      }
      if (index === 2) {
        if (value === '1') {
          this.decHead.insurCurr = ''
          this.controller.insurCurrDisabled = true
          this.ruleRegx['insurRate'] = '^\\d{1,2}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.insurRate = [ // 运费 费率、单价、总价
            {validator: this.checkFateValid, message: '输入0.0001~99的数字', trigger: 'blur'}
          ]
          if (util.isEmpty(this.decHead.insurRate)) {
            this.decHead.insurRate = '0.3'
          }
        } else {
          this.controller.insurCurrDisabled = false
          this.ruleRegx['insurRate'] = '^\\d{1,12}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.insurRate = [ // 运费 费率、单价、总价
            {validator: this.checkValid, message: '输入整数部分不超过12位，小数不超过4位的数字', trigger: 'blur'}
          ]
        }
      }
      if (index === 3) {
        if (value === '1') {
          this.decHead.otherCurr = ''
          this.controller.otherCurrDisabled = true
          this.ruleRegx['otherRate'] = '^(-){0,1}\\d{1,2}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.otherRate = [ // 运费 费率、单价、总价
            {validator: this.checkFateValid, message: '输入0.0001到99”或“-99到-0.0001', trigger: 'blur'}
          ]
        } else {
          this.controller.otherCurrDisabled = false
          this.ruleRegx['otherRate'] = '^(-){0,1}\\d{1,12}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.otherRate = [ // 运费 费率、单价、总价
            {validator: this.checkValid, message: '输入整数部分不超过12位，小数不超过4位的数字', trigger: 'blur'}
          ]
        }
      }
    },
    // 成交方式的变化事件
    transModeChange (value, initParam = 'none') {
      if (this.controller.iEFlag === 'I') { // 进口
        if (value === '1') {
          this.controller.feeMarkDisabled = true
          this.controller.feeRateDisabled = true
          this.controller.feeCurrDisabled = true
          this.controller.insurMarkDisabled = true
          this.controller.insurRateDisabled = true
          this.controller.insurCurrDisabled = true
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
          this.controller.feeMarkDisabled = true
          this.controller.feeRateDisabled = true
          this.controller.feeCurrDisabled = true
          this.controller.insurMarkDisabled = false
          this.controller.insurRateDisabled = false
          if (this.decHead.insurMark !== '1') {
            this.controller.insurCurrDisabled = false
          }
          if (initParam === 'init') {
            return
          }
          this.decHead.feeMark = ''
          this.decHead.feeRate = ''
          this.decHead.feeCurr = ''
        } else if (value === '4') {
          this.controller.feeMarkDisabled = false
          this.controller.feeRateDisabled = false
          if (this.decHead.feeMark !== '1') {
            this.controller.feeCurrDisabled = false
          }
          this.controller.insurMarkDisabled = true
          this.controller.insurRateDisabled = true
          this.controller.insurCurrDisabled = true
          if (initParam === 'init') {
            return
          }
          this.decHead.insurMark = ''
          this.decHead.insurRate = ''
          this.decHead.insurCurr = ''
        } else {
          this.controller.feeMarkDisabled = false
          this.controller.feeRateDisabled = false
          if (this.decHead.feeMark !== '1') {
            this.controller.feeCurrDisabled = false
          }
          this.controller.insurMarkDisabled = false
          this.controller.insurRateDisabled = false
          if (this.decHead.insurMark !== '1') {
            this.controller.insurCurrDisabled = false
          }
        }
      } else { // 出口
        if (value === '2') {
          this.controller.feeMarkDisabled = false
          this.controller.feeRateDisabled = false
          if (this.decHead.feeMark !== '1') {
            this.controller.feeCurrDisabled = false
          }
          this.controller.insurMarkDisabled = true
          this.controller.insurRateDisabled = true
          this.controller.insurCurrDisabled = true
          if (initParam === 'init') {
            return
          }
          this.decHead.insurMark = ''
          this.decHead.insurRate = ''
          this.decHead.insurCurr = ''
        } else if (value === '3') {
          this.controller.feeMarkDisabled = true
          this.controller.feeRateDisabled = true
          this.controller.feeCurrDisabled = true
          this.controller.insurMarkDisabled = true
          this.controller.insurRateDisabled = true
          this.controller.insurCurrDisabled = true
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
          this.controller.feeMarkDisabled = true
          this.controller.feeRateDisabled = true
          this.controller.feeCurrDisabled = true
          this.controller.insurMarkDisabled = false
          this.controller.insurRateDisabled = false
          if (this.decHead.insurMark !== '1') {
            this.controller.insurCurrDisabled = false
          }
          if (initParam === 'init') {
            return
          }
          this.decHead.feeMark = ''
          this.decHead.feeRate = ''
          this.decHead.feeCurr = ''
        } else {
          this.controller.feeMarkDisabled = false
          this.controller.feeRateDisabled = false
          if (this.decHead.feeMark !== '1') {
            this.controller.feeCurrDisabled = false
          }
          this.controller.insurMarkDisabled = false
          this.controller.insurRateDisabled = false
          if (this.decHead.insurMark !== '1') {
            this.controller.insurCurrDisabled = false
          }
          this.controller.insurCurrDisabled = false
        }
      }
    },
    // 表头运抵国和表体最终目的国(地区)一致性
    tradeCountryChange (value) {
      if (this.controller.iEFlag === 'E') {
        this.decList.destinationCountry = value
        if (!util.isEmpty(this.decList.destinationCountry)) {
          this.decList.destinationCountry = this.decHead.tradeCountry
          this.selectObj = {
            obj: 'saasCountry3',
            params: 'SAAS_COUNTRY'
          }
          this.checkParamsList(this.decList.destinationCountry, 'init')
        }
      }
    },
    // 出口报关单监管方式为0654-进料深加工、1427-出料加工 、0657-进料余料结转时，最终目的国和运抵国为中国。
    tradeModeChange (value) {
      let arr = ['0654', '1427', '0657']
      if (util.isExistInArray(value, arr)) {
        // 最终目的国
        this.decList.destinationCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry3',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
        // 运抵国
        this.decHead.tradeCountry = 'CHN'
        this.selectObj = {
          obj: 'saasCountry1',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList('CHN', 'init')
      }
      let _cutMode = this.decHead.cutMode
      let _tradeMode = this.decHead.tradeMode
      if (this.controller.iEFlag === 'I') {
        if (_tradeMode === '0110' && _cutMode === '101') { // 一般贸易
          this.decList.dutyMode = '1'
        }
        if (_tradeMode === '0110' && ['401', '789', '799'].includes(_cutMode)) {
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '0214') { // 来料加工
          this.decHead.cutMode = '502'
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '0615') { // 进料对口
          this.decHead.cutMode = '503'
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '2025' || _tradeMode === '2225') { // 合资合作设备 外资设备物品
          this.decHead.cutMode = '789'
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '0320') { // 不作价设备
          this.decHead.cutMode = '501'
          this.decList.dutyMode = '3'
        }
      }
      if (this.controller.iEFlag === 'E') {
        if (_tradeMode === '0110' && ['101', '601', '602', '603'].includes(_cutMode)) { // 一般贸易
          this.decList.dutyMode = '1'
        }
        if (_tradeMode === '0214') { // 来料加工
          this.decHead.cutMode = '502'
          this.decList.dutyMode = '3'
          this.$message({
            message: '备注栏需要填写加工费'
          })
        }
        if (_tradeMode === '0615') { // 进料对口
          this.decHead.cutMode = '503'
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '3100') { // 无代价抵偿
          this.decHead.cutMode = '299'
          this.decList.dutyMode = '3'
        }
      }
      this.selectObj = {
        obj: 'saasLevytype',
        params: 'SAAS_LEVYTYPE'
      }
      this.checkParamsList(this.decHead.cutMode, 'init')
      this.selectObj = {
        obj: 'saasLevymode',
        params: 'SAAS_LEVYMODE'
      }
      this.checkParamsList(this.decList.dutyMode, 'init')
      if (this.controller.iEFlag === 'I') {
        if (value === '9500') { // 进口报关单，监管方式9500，特许权按钮可用
          this.charterDis = false
        } else {
          this.charterDis = true
          this.decHead.decRoyaltyFeeVO = null
        }
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
          if (res.code === '0000' && res.result.length > 0) {
            this.decHead.entyPortCode = res.result[0].entyPortCode
            this.decHead.trafMode = res.result[0].trafMode // 运输方式
            this.selectObj = {
              obj: 'saasInlandPort',
              params: 'SAAS_INLAND_PORT'
            }
            this.checkParamsList(this.decHead.entyPortCode, 'init')
            this.selectObj = {
              obj: 'saasTransportType',
              params: 'SAAS_TRANSPORT_TYPE'
            }
            this.checkParamsList(this.decHead.trafMode, 'init')
          }
        }
      })
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
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      e.target.blur()
      // 获取当前焦点所在的 form表单
      let form = e.target.form
      // 获取form表单下的所有 input  并把为数组转化为真数组
      let focusable = Array.from(form.querySelectorAll('input,textarea'))
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
      let secondNext = newFocusable[parseInt(index) + 2]
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
      } else if (e.ctrlKey && e.target.localName === 'textarea') { // Ctrl+enter 在textaera中换行
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
            } else if (ref === 'gName') {
              this.$refs['codeTs'].$children[1].focus()
              this.$refs['codeTs'].$children[1].select()
            } else if (ref === 'despPortCode' && this.controller.iEFlag === 'I') { // 进口启运港
              this.openOtherPriceFactor()
            } else if (ref === 'entyPortCode' && this.controller.iEFlag === 'E') {
              this.openOtherPriceFactor()
            } else if (ref === 'markNo' && this.isShow1 === false) { // 标记唛码
              this.focusDecList()
            } else if (ref === 'orgCode') {
              this.$refs['vsaOrgCode'].focus()
              this.$refs['vsaOrgCode'].$children[1].select()
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
          } else if (ref === 'correlationReasonFlag' && this.controller.iEFlag === 'E') {
            this.openSpecialBusiContent()
          }
        }
      }
    },
    // 备案号的输入事件
    manualNoChange () {
      this.isManualNoChange = true
    },
    // 查询H账册的数据
    queryBookHead () {
      // 当值没有发生变化时
      if (!this.isManualNoChange) {
        return false
      }
      /**
       * 清除表体数据
       * 如果 备案号的值发生了改变 表体table 表的数据需要全部清除掉
       * 如果 表体显示数据 的gNor如果为1 则不刷新 如果不为1则刷新
       */
      this.tableList = []
      if (this.decList.gNo !== '1') {
        this.refreshDecList()
      }
      this.isManualNoChange = false
      if (util.isEmpty(this.decHead.manualNo) || !(/^[^\u4e00-\u9fa5]{12}$/.test(this.decHead.manualNo))) {
        return false
      }
      let char = this.decHead.manualNo.charAt(0).toUpperCase()
      if (!util.isExistInArray(char, ['B', 'C', 'D', 'E', 'H', 'Z'])) {
        this.messageTips('备案号:' + this.decHead.manualNo + '不存在', 'error')
        this.controller.importIsDisabled = false
        this.controller.refreshIsDisabled = false
        this.controller.insertIsDisabled = false
        this.controller.reClassifyIsDisabled = false
        this.controller.contrItemDisabled = false
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
            if (res.code === '0000' && !(util.isEmpty(res.result.head))) { // 查询成功口
              // 反填表头信息到报关单表头
              let head = res.result.head
              let body = res.result.body
              this.decHead.tradeCode = head.tradeCode
              this.decHead.tradeName = head.tradeName
              this.decHead.tradeCoScc = head.tradeCodeScc
              this.decHead.ownerCode = head.ownerCode
              this.decHead.ownerCodeScc = head.ownerCodeScc // 生产/消费使用单位18位信用代码
              this.decHead.ownerName = head.ownerName
              this.decHead.contrNo = head.contrNo // 合同号
              this.controller.districtCode = head.districtCode
              if (!util.isEmpty(head.cutMode)) { // 征免性质
                this.decHead.cutMode = head.cutMode
                this.selectObj = {
                  obj: 'saasLevytype',
                  params: 'SAAS_LEVYTYPE'
                }
                this.checkParamsList(this.decHead.cutMode, 'init')
              }
              // 设置免表列表的参数 并打开免表弹窗
              this.controller.importIsDisabled = true
              this.controller.refreshIsDisabled = true
              this.controller.insertIsDisabled = true
              this.controller.reClassifyIsDisabled = true
              if (body.length > 0) {
                // 导入 新增 插入 重新归类不能操作
                this.initHBook = {
                  list: body,
                  iEFlag: this.controller.iEFlag,
                  districtCode: this.controller.districtCode
                }
                this.ZBookVisabled = true
              }
            } else {
              this.messageTips('备案号:' + this.decHead.manualNo + '不存在')
              // 放开 商品列表里的备案序号
              this.controller.contrItemDisabled = false
            }
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
            if (res.code === '0000') { // 查询成功口
              // 反填表头信息到报关单表头
              let head = res.result
              this.decHead.tradeCode = head.tradeCode
              this.decHead.tradeName = head.tradeName
              this.decHead.tradeCoScc = head.tradeCodeScc
              this.decHead.ownerCode = head.ownerCode
              this.decHead.ownerCodeScc = head.ownerCodeScc
              this.decHead.ownerName = head.ownerName
              if (['B', 'C', 'D', 'H'].includes(char)) {
                if (!util.isEmpty(head.tradeMode)) { // 监管方式
                  this.decHead.tradeMode = head.tradeMode
                  this.selectObj = {
                    obj: 'saasTrade',
                    params: 'SAAS_TRADE'
                  }
                  this.checkParamsList(this.decHead.tradeMode, 'init')
                }
                if (!util.isEmpty(head.cutMode)) { // 征免性质
                  this.decHead.cutMode = head.cutMode
                  this.selectObj = {
                    obj: 'saasLevytype',
                    params: 'SAAS_LEVYTYPE'
                  }
                  this.checkParamsList(this.decHead.cutMode, 'init')
                }
              } else if (char === 'E') {
                this.controller.districtCode = head.districtCode // 境内目的地或者境内货源地
              }
            } else {
              this.messageTips('备案号:' + this.decHead.manualNo + '不存在')
            }
            // 导入 新增 插入 重新归类不能操作
            this.controller.importIsDisabled = false
            this.controller.refreshIsDisabled = false
            this.controller.insertIsDisabled = false
            this.controller.reClassifyIsDisabled = false
            this.controller.gUnitReadonly = false
            // 放开 商品列表里的备案序号
            this.controller.contrItemDisabled = false
          },
          other: (res) => {
            this.messageTips('备案号:' + this.decHead.manualNo + '不存在')
            // 导入 新增 插入 重新归类不能操作
            this.controller.importIsDisabled = false
            this.controller.refreshIsDisabled = false
            this.controller.insertIsDisabled = false
            this.controller.reClassifyIsDisabled = false
            this.controller.gUnitReadonly = false
            // 放开 商品列表里的备案序号
            this.controller.contrItemDisabled = false
          }
        })
      }
    },
    // 自动根据生产/消费使用单位的十位海关编码 反填境内目的地的目的地代码/货源地的货源地代码
    backFillDistrictCode () {
      if (this.decHead.ownerCode.length === 10) {
        let str = this.decHead.ownerCode.toString().substring(0, 5)
        this.decList.districtCode = str
        this.selectObj = {
          obj: 'saasDistrictRel',
          params: 'SAAS_DISTRICT_REL'
        }
        this.checkParamsList(this.decList.districtCode, 'init')
      }
    },
    // 通过 备案序号、进出口标识、监管方式、备案号查询手册数据
    selectBookBody () {
      if (util.isEmpty(this.decList.contrItem)) {
        return false
      }
      if (util.isEmpty(this.decHead.tradeMode)) {
        this.messageTips('监管/贸易方式不能为空')
        return false
      }
      if (util.isEmpty(this.decHead.manualNo)) {
        return false
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getRelatedCurEmsBody',
        data: {
          emsNo: this.decHead.manualNo, // 备案号
          tradeMode: this.decHead.tradeMode, // 监管方式
          iEFlag: this.controller.iEFlag, // 进出口标志
          contrItem: this.decList.contrItem // 备案序号
        },
        success: (res) => {
          if (res.code === '0000') {
            if (res.result.body !== null) {
              let manualData = res.result.body
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
            if (this.decHead.manualNo.charAt(0).toUpperCase() === 'E') {
              this.decList.districtCode = this.controller.districtCode // 货源地
            }
            // 初始化下拉框
            this.initSelect(this.bodySelect, this.decList)
            // 如果法定第二计量单位有值则 法定第二数据 可输入
            this.unit2Change(this.decList.unit2)
          }
        }
      })
    },
    // 打开补充申报框
    openSuppDec () {
      this.supplDecVisible = true
      this.initSupplDec = {
        supplDecVisible: this.supplDecVisible, // 控制补充申报显示隐藏
        iEFlag: this.controller.iEFlag, // 进出口标识
        goodList: this.tableList, // 商品表
        contrNo: this.decHead.contrNo, // 合同协议号
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
    /**
     * @function 加法函数，用来得到精确的加法结果
     * @description  javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
     * @param arg1 第一个加数
     * @param arg2 第二个加数
     * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
       @returns 两数相加的结果
     */
    Add (arg1, arg2) {
      let arg1Arr = arg1.toString().split('.')
      let arg2Arr = arg2.toString().split('.')
      let d1 = arg1Arr.length === 2 ? arg1Arr[1] : ''
      let d2 = arg2Arr.length === 2 ? arg2Arr[1] : ''
      let maxLen = Math.max(d1.length, d2.length)
      let m = Math.pow(10, maxLen)
      let result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen))
      let d = arguments[2] // arguments 为获取所有传入的参数 取第三个参数
      return typeof d === 'number' ? Number((result).toFixed(d)) : result
    },
    /**
     * @function 减法函数，用来得到精确的减法结果
     * @description 函数返回较为精确的减法结果
     * @param arg1 第一个加数
     * @param arg2 第二个加数
     * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
       @returns 两数相减的结果
     */
    Sub (arg1, arg2) {
      return this.Add(arg1, -Number(arg2), arguments[2])
    },
    /**
     * @function 精确的乘法运算
     * @description  函数返回较为精确的乘法结果
     * @param arg1 第一个乘数
     * @param arg2 第二个乘数
     * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
       @returns 两数相乘的结果
     */
    Mul (arg1, arg2) {
      let r1 = arg1.toString()
      let r2 = arg2.toString()
      let m
      let resultVal
      let d = arguments[2] // arguments 为获取所有传入的参数 取第三个参数
      m = (r1.split('.')[1] ? r1.split('.')[1].length : 0) + (r2.split('.')[1] ? r2.split('.')[1].length : 0)
      resultVal = Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, m)
      return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
    },
    /**
     * @function 精确的除法运算
     * @description  函数返回较为精确的除法结果
     * @param arg1 除数
     * @param arg2 被除数
     * @param d 要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
       @returns arg1除于arg2的结果
     */
    Div (arg1, arg2) {
      let r1 = arg1.toString()
      let r2 = arg2.toString()
      let m
      let resultVal
      let d = arguments[2]
      m = (r2.split('.')[1] ? r2.split('.')[1].length : 0) - (r1.split('.')[1] ? r1.split('.')[1].length : 0)
      resultVal = Number(r1.replace('.', '')) / Number(r2.replace('.', '')) * Math.pow(10, m)
      return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      if (this.selectObj.params === 'SAAS_LIC_TYPE' || this.selectObj.params === 'SAAS_ENT_QUALIF_TYPE') { // 许可证类别
        list = list.filter(item => {
          return item.otherField.toUpperCase().indexOf(this.controller.iEFlag) > -1
        })
      }
      let fitlerParmaTable = ['SAAS_CURR', 'SAAS_WRAP', 'SAAS_TRADE', 'SAAS_CONTAINER_MODEL', 'SAAS_COUNTRY', 'SAAS_PORT_LIN']
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          this[this.selectObj.obj] = list.slice(0, 10)
        })
      } else {
        let filterList = []
        let filterList1 = [] //
        let filterList2 = [] //
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().startsWith(keyValue.toLowerCase())
        })
        filterList2 = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        // 去重
        filterList.push(...filterList2)
        filterList = this.unique(filterList)
        if (util.isExistInArray(this.selectObj.params, fitlerParmaTable)) {
          filterList1 = list.filter(item => {
            let str = item.otherField + ' ' + item.extendField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          filterList.push(...filterList1)
          filterList = this.unique(filterList)
        }
        if (type === 'init') {
          this[this.selectObj.obj] = filterList.slice(0, 10)
        } else if (type === 'select') {
          this.$nextTick(() => {
            this[this.selectObj.obj] = filterList.slice(0, 10)
          })
        }
      }
    },
    // 去重
    unique (arr) {
      let x = new Set(arr)
      return [...x]
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      this[selecType] = []
    },
    // 初始化 下拉框
    /**
     * @param arr 定义的每个模块的数据
     * @param form 表单
     */
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
    // 法定第二单位change事件
    unit2Change (value) {
      if (util.isEmpty(value)) {
        this.controller.qty2Disabled = true
        this.decList.qty2 = ''
      } else {
        this.controller.qty2Disabled = false
      }
    },
    // 获取今天的日期
    getTodayDate () {
      let date = new Date()
      let year = date.getFullYear()
      let mon = date.getMonth() + 1
      if (mon.toString().length === 1) {
        mon = '0' + mon
      }
      let day = date.getDate()
      if (day.toString().length === 1) {
        day = '0' + day
      }
      return year + '' + mon + '' + day
    },
    // 格式化数据  去掉小数点后面多余的0
    removeZero (value) {
      if (util.isEmpty(value)) {
        return ''
      } else {
        return parseFloat(value) === 0 ? '' : parseFloat(value)
      }
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
      // 如果 成交数量为空 则直接跳过
      if (util.isEmpty(this.decList.gQty)) {
        this.$refs['gUnit'].focus()
        return
      }
      if (!util.isEmpty(this.decList.declPrice) && !util.isEmpty(this.decList.declTotal)) {
        if (this.Mul(this.decList.gQty, this.decList.declPrice, 2) !== +this.decList.declTotal) {
          this.modifyPriceVisible = true
          return
        }
      }
      this.$refs['gUnit'].focus()
    },
    // 修改价格
    modifyPrice (value) {
      if (value === '1') {
        // 修改 单价
        this.computPrice()
        this.modifyPriceVisible = false
        this.$refs['gUnit'].focus()
      }
      if (value === '2') {
        // 修改 总价
        this.computTotal()
        this.modifyPriceVisible = false
        this.$refs['gUnit'].focus()
      }
    },
    // 阻止默认的keydown 触发按钮事件
    prevent (e) {
      e.preventDefault()
      e.stopPropagation()
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
      if (util.isEmpty(_cutMode) || util.isEmpty(_tradeMode)) {
        return
      }
      if (this.controller.iEFlag === 'I') {
        if (_tradeMode === '0110' && _cutMode === '101') { // 一般贸易
          this.decList.dutyMode = '1'
        }
        if (_tradeMode === '0110' && ['401', '789', '799'].includes(_cutMode)) {
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '0214' && _cutMode === '502') { // 来料加工
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '0615' && _cutMode === '503') { // 进料对口
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '2025' && _cutMode === '789') { // 合资合作设备
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '2225' && _cutMode === '789') { // 外资设备物品
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '0320' && _cutMode === '501') { // 不作价设备
          this.decList.dutyMode = '3'
        }
      }
      if (this.controller.iEFlag === 'E') {
        if (_tradeMode === '0110' && ['101', '601', '602', '603'].includes(_cutMode)) { // 一般贸易
          this.decList.dutyMode = '1'
        }
        if (_tradeMode === '0214' && _cutMode === '502') { // 来料加工
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '0615' && _cutMode === '503') { // 进料对口
          this.decList.dutyMode = '3'
        }
        if (_tradeMode === '3100' && _cutMode === '299') { // 无代价抵偿
          this.decList.dutyMode = '3'
        }
      }
      this.selectObj = {
        obj: 'saasLevymode',
        params: 'SAAS_LEVYMODE'
      }
      this.checkParamsList(this.decList.dutyMode, 'init')
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
          if (util.isEmpty(res.result)) {
            this.$message({
              message: '未查到相关舱单信息',
              type: 'info'
            })
          } else {
            let data = JSON.parse(res.result)
            let list = []
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
            this.initMftBill = {
              list: list,
              trafName: this.decHead.trafName, // 运输工具名称
              voyageNo: this.decHead.voyageNo, // 航班\航次
              billNo: this.decHead.billNo, // 提运单号
              packNo: this.decHead.packNo, // 件数
              wt: this.decHead.grossWt, // 毛重
              customMaster: this.decHead.iEPort // 关区代码
            }
            this.mftBillVisible = true
          }
        }
      })
    },
    // 打开历史商品数据组件
    openHistoryGoods () {
      this.initHistory = {
        iEFlag: this.controller.iEFlag,
        tradeName: this.decHead.tradeName
      }
      this.historyGoodsVisible = true
    },
    // 接收 历史商品的数据
    historyGoodsData (param) {
      let gNo = this.decList.gNo
      this.decList = util.simpleClone(param.goodsInfo)
      // 根据反填数据的设置 反填数据
      if (this.controller.iEFlag === 'I') {
        if (this.switch['import_setting_contrItem'] === 'Y') { // 备案序号
          this.decList.contrItem = param.goodsInfo.contrItem
        }
        if (this.switch['import_setting_codeTs'] === 'Y') { // 商品编号
          this.decList.codeTs = param.goodsInfo.codeTs
        }
        if (this.switch['import_setting_ciqName'] === 'Y') { // 检验检疫名称
          this.decList.ciqName = param.goodsInfo.ciqName
        }
        if (this.switch['import_setting_gName'] === 'Y') { // 商品名称
          this.decList.gName = param.goodsInfo.gName
        }
        if (this.switch['import_setting_gModel'] === 'Y') { // 规格型号
          this.decList.gModel = param.goodsInfo.gModel
        }
        if (this.switch['import_setting_gQty'] === 'Y') { // 成交数量
          this.decList.gQty = param.goodsInfo.gQty
        }
        if (this.switch['import_setting_gUnit'] === 'Y') { // 成交计量单位
          this.decList.gUnit = param.goodsInfo.gUnit
        }
        if (this.switch['import_setting_declPrice'] === 'Y') { // 单价
          this.decList.declPrice = param.goodsInfo.declPrice
        }
        if (this.switch['import_setting_declTotal'] === 'Y') { // 总价
          this.decList.declTotal = param.goodsInfo.declTotal
        }
        if (this.switch['import_setting_tradeCurr'] === 'Y') { // 币制
          this.decList.tradeCurr = param.goodsInfo.tradeCurr
        }
        if (this.switch['import_setting_qty1'] === 'Y') { // 法定第一数量
          this.decList.qty1 = param.goodsInfo.qty1
        }
        // 法定第一计量单位
        this.decList.unit1 = param.goodsInfo.unit1
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
        // 法定第二计量单位
        this.decList.unit2 = param.goodsInfo.unit2
        if (this.switch['import_setting_originCountry'] === 'Y') { // 原产国(地区)
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
        if (this.switch['import_setting_goodsAttr'] === 'Y') { // 货物属性
          this.decList.goodsAttr = param.goodsInfo.goodsAttr
        }
        if (this.switch['import_setting_decGoodsLimits'] === 'Y') { // 产品资质
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
        if (this.switch['export_setting_codeTs'] === 'Y') { // 商品编号
          this.decList.codeTs = param.goodsInfo.codeTs
        }
        if (this.switch['export_setting_ciqName'] === 'Y') { // 检验检疫名称
          this.decList.ciqName = param.goodsInfo.ciqName
        }
        if (this.switch['export_setting_gName'] === 'Y') { // 商品名称
          this.decList.gName = param.goodsInfo.gName
        }
        if (this.switch['export_setting_gModel'] === 'Y') { // 规格型号
          this.decList.gModel = param.goodsInfo.gModel
        }
        if (this.switch['export_setting_gQty'] === 'Y') { // 成交数量
          this.decList.gQty = param.goodsInfo.gQty
        }
        if (this.switch['export_setting_gUnit'] === 'Y') { // 成交计量单位
          this.decList.gUnit = param.goodsInfo.gUnit
        }
        if (this.switch['export_setting_declPrice'] === 'Y') { // 单价
          this.decList.declPrice = param.goodsInfo.declPrice
        }
        if (this.switch['export_setting_declTotal'] === 'Y') { // 总价
          this.decList.declTotal = param.goodsInfo.declTotal
        }
        if (this.switch['export_setting_tradeCurr'] === 'Y') { // 币制
          this.decList.tradeCurr = param.goodsInfo.tradeCurr
        }
        if (this.switch['export_setting_qty1'] === 'Y') { // 法定第一数量
          this.decList.qty1 = param.goodsInfo.qty1
        }
        // 法定第一计量单位
        this.decList.unit1 = param.goodsInfo.unit1
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
        // 法定第二计量单位
        this.decList.unit2 = param.goodsInfo.unit2
        if (this.switch['export_setting_originCountry'] === 'Y') { // 原产国(地区)
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
        if (this.switch['export_setting_goodsAttr'] === 'Y') { // 货物属性
          this.decList.goodsAttr = param.goodsInfo.goodsAttr
        }
        if (this.switch['export_setting_decGoodsLimits'] === 'Y') { // 产品资质
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
      // 格式化数据
      this.decList.declPrice = this.removeZero(this.decList.declPrice)
      this.decList.gQty = this.removeZero(this.decList.gQty)
      this.decList.qty1 = this.removeZero(this.decList.qty1)
      this.decList.qty2 = this.removeZero(this.decList.qty2)
      this.decList.declTotal = this.removeZero(this.decList.declTotal)
      this.decList.gNo = gNo
      // 如果没有备案号存在  以防历史数据中存在备案序号 所以这里清除备案序号
      if (this.controller.contrItemDisabled) {
        this.decList.contrItem = ''
      }
      if (this.decList.decGoodsLimits === null) {
        this.decList.decGoodsLimits = []
      }
      // 格式化表体数据
      this.formatDecList()
      this.historyGoodsVisible = false
    },
    // 取消选择历史商品数据
    historyGoodsCompnent () {
      this.historyGoodsVisible = false
    },
    // 获取舱单弹窗传递过来的数据
    mftBillData (param) {
      let mftData = util.simpleClone(param)
      this.decHead.packNo = mftData.packNo
      this.decHead.trafName = mftData.trafName
      this.decHead.billNo = mftData.billNo
      this.decHead.grossWt = mftData.wt
      this.decHead.voyageNo = mftData.voyageNo
      if (!util.isEmpty(mftData.containerInfo)) {
        // 反填集装箱信息
        for (let i in mftData.containerInfo) {
          this.tableDecContainerlist.push({
            pid: '', // 主键
            decPid: '', // 外键
            containerNo: mftData.containerInfo[i].no, // 集装箱号
            containerSize: '', // 集装箱规格
            containerSizeValue: '', // 集装箱规格名称
            containerWeight: '', // 箱货重量
            goodsNo: '', // 商品项号
            lclFlag: '', // 拼箱标识
            gNo: this.tableDecContainerlist.length + 1, // 序号
            note: '' // note
          })
        }
      }
      this.mftBillVisible = false
    },
    // 关闭 舱单信息弹窗
    closeMftBill () {
      this.mftBillVisible = false
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
                // !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.consigneeCode = res.result.regCiqCode)
                this.decHead.consigneeCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
              }
              this.tradeCorpId = res.result.corpId
              if (util.isEmpty(this.decHead.ownerCodeScc)) {
                if (util.isEmpty(res.result.tradeCodeExt)) {
                  this.decHead.ownerCode = res.result.regCusCode
                }
                if (util.isEmpty(res.result.ciqCodeExt)) {
                  // !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.ownerCiqCode = res.result.regCiqCode)
                  this.decHead.ownerCiqCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                }
                // 自动带出一样的
                this.decHead.ownerCodeScc = res.result.sccCode
                this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.ownerCorpId = res.result.corpId
                this.showFied.ownerCorpId = res.result.corpId
                this.backFillDistrictCode()
              }
            } else if (value === 'agentCodeScc' || value === 'agentCode' || value === 'agentName') {
              this.decHead.agentCodeScc = res.result.sccCode
              this.decHead.agentName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              if (util.isEmpty(res.result.tradeCodeExt)) {
                this.decHead.agentCode = res.result.regCusCode
              }
              if (util.isEmpty(res.result.ciqCodeExt)) {
                // !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.declRegNo = res.result.regCiqCode)
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
                // !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.ownerCiqCode = res.result.regCiqCode)
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
    // 确定选择的模板数据
    compareData (param) {
      for (let i in param.replaceData) {
        this.decHead[param.replaceData[i].field] = param.replaceData[i].templateValue
      }
      this.specialBusiChangeCodeName()
      let decListVo = param.decBody
      if (param.isBodyData) { // 给表体赋值
        // 报关单表体
        let licFlag = false // 判断是否需要赋值 产品资质
        let vinFlag = false // 判断是否需要赋值 许可证vin
        if (decListVo.length === 1) {
          decListVo[0].gNo = '1'
          this.decList = decListVo[0]
          licFlag = true
        }
        // 表体下的产品资质
        if (licFlag && this.decList.decGoodsLimits.length === 1) {
          this.filingInfoForm = util.simpleClone(this.decList.decGoodsLimits[0])
          this.decList.decGoodsLimits = []
          vinFlag = true
        }
        // 标题下 的产品资质 的 许可证vin
        if (vinFlag && this.filingInfoForm.decGoodsLimitvins.length === 1) {
          this.licVINForm = util.simpleClone(this.filingInfoForm.decGoodsLimitvins[0])
          this.filingInfoForm.decGoodsLimitvins = []
        }
        // 格式化表体数据
        this.formatDecList()
      }
      this.initSelect(this.headSelect, this.decHead)
      this.initTemplateVisible = false
      this.compareVisible = false
    },
    // 取消选择的模板数据
    cancleCompareData () {
      this.initTemplateVisible = false
      this.compareVisible = false
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
          if (res.success) {
            let json = JSON.stringify(res.result)
            json = json.replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          }
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
        // if (para === '1') { // 境内收发货人
        //   param.cusCorpName = this.decHead.tradeName
        // } else if (para === '2') { // 境外收发货人
        // } else if (para === '3') { // 生产消费单位
        //   param.cusCorpName = this.decHead.ownerName
        // } else if (para === '4') {
        //   param.cusCorpName = this.decHead.agentName
        // }
        this.$post({
          url: 'API@/dec-common/dec/common/getCorpInf',
          data: param,
          success: (res) => {
            if (res.code === '0000' && !util.isEmpty(res.result.sccCode)) {
              if (para === '1') { // 境内收发货人
                this.decHead.tradeCoScc = res.result.sccCode
                this.decHead.tradeCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.tradeName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.decHead.consigneeCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                this.showFied.tradeCorpId = res.result.corpId
              } else if (para === '4') { // 申报单位
                this.decHead.agentCodeScc = res.result.sccCode
                this.decHead.agentCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.agentName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.decHead.declRegNo = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                this.showFied.agentCorpId = res.result.corpId
              } else if (para === '3') { // 生产消费使用单位
                this.decHead.ownerCodeScc = res.result.sccCode
                this.decHead.ownerCode = res.result.regCusCode === null ? '' : res.result.regCusCode
                this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.decHead.ownerCiqCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                this.showFied.ownerCorpId = res.result.corpId
                this.backFillDistrictCode()
              }
            }
          }
        })
      } else { // 如果企业海关编码或十八位社会信用代码或十位海关干编码存在
        if (para === '1') { // 境内收发货人
          this.decHead.tradeCoScc = item.sccCode // 社会信用代码
          this.decHead.tradeCode = item.tradeCode // 海关十位编码
          this.decHead.tradeName = item.cusCorpName // 赋值 企业海关名称
          this.showFied.tradeCorpId = item.corpId
          // if (!util.isEmpty(item.ciqCode)) { // 检验检疫十位编码
          this.decHead.consigneeCode = item.ciqCode
          // }
          if (util.isEmpty(this.decHead.ownerCodeScc)) {
            // 自动带出一样的
            this.decHead.ownerCodeScc = this.decHead.tradeCoScc
            this.decHead.ownerCode = this.decHead.tradeCode
            this.decHead.ownerName = this.decHead.tradeName
            this.showFied.ownerCorpId = item.corpId
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
          this.showFied.ownerCorpId = item.corpId
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
          this.showFied.agentCorpId = item.corpId
          // if (!util.isEmpty(item.ciqCode)) {
          this.decHead.declRegNo = item.ciqCode // 检验检疫代码
          // }
        }
      }
    },
    // 通过公司社会信用代码或者海关编码查询再海关的备案信息
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
          param.corpId = this.showFied.tradeCorpId
        } else {
          if (!util.isEmpty(this.decHead.tradeCode)) {
            param.tradeCode = this.decHead.tradeCode
            param.corpId = this.showFied.tradeCorpId
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
          param.corpId = this.showFied.ownerCorpId
        } else {
          if (!util.isEmpty(this.decHead.ownerCode)) {
            param.tradeCode = this.decHead.ownerCode
            param.corpId = this.showFied.ownerCorpId
          } else {
            return
          }
        }
      } else if (type === '4') { // 申报单位
        if (!util.isEmpty(this.decHead.agentCodeScc)) {
          param.sccCode = this.decHead.agentCodeScc
          param.corpId = this.showFied.agentCorpId
        } else {
          if (!util.isEmpty(this.decHead.agentCode)) {
            param.tradeCode = this.decHead.agentCode
            param.corpId = this.showFied.agentCorpId
          } else {
            return
          }
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getCusCorpInf',
        data: param,
        success: (res) => {
          if (type === '1') { // 境内收发货人
            this.decHead.tradeCoScc = res.result.sccCode
            this.decHead.tradeCode = res.result.regCusCode
            this.decHead.tradeName = res.result.cusNameSaic
            if (!util.isEmpty(res.result.regCiqCode)) {
              this.decHead.consigneeCode = res.result.regCiqCode
            }
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
            if (!util.isEmpty(res.result.regCiqCode)) {
              this.decHead.ownerCiqCode = res.result.regCiqCode
            }
            return
          }
          if (type === '4') { // 申报单位
            this.decHead.agentCodeScc = res.result.sccCode
            this.decHead.agentCode = res.result.regCusCode
            this.decHead.agentName = res.result.cusNameSaic
            if (!util.isEmpty(res.result.regCiqCode)) {
              this.decHead.declRegNo = res.result.regCiqCode
            }
          }
        }
      })
    },
    // 打开表体导入窗口
    openImport () {
      let gNList = []
      for (let i in this.tableList) {
        gNList.push(this.tableList[i].gNo)
      }
      // 设置初始参数
      this.initImport = {
        iEFlag: this.controller.iEFlag,
        gNoList: gNList,
        manualNo: this.decHead.manualNo,
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
      let totalLen = this.Add(len, importLen)
      if (totalLen > 50) {
        this.messageTips('导入商品数量超过本单商品不能超过50条限制', 'error')
        return
      }
      if (data.res.result && data.res.result.length > 0) {
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
    // 接收备注数据
    receptionNoteData (param) {
      if (param.type === 'note') {
        this.decHead.noteS = param.note
        this.showFied.noteLenght = util.decGetlen(this.decHead.noteS)
        this.noteCompnentVisible = false
      } else if (param.type === 'markNo') {
        this.decHead.markNo = param.note
        this.showFied.markNoLength = util.decGetlen(this.decHead.markNo)
        this.noteCompnentVisible = false
        this.focusDecList()
      }
    },
    // 附加信息 回参
    receptionAttachData (param) {
      this.decHead.decMarkLobs = param.decMarkLobs
    },
    // 接收账册数据
    receptionZBookData (param) {
      this.controller.gUnitReadonly = true
      let goods = util.simpleClone(param.list)
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
      this.ZBookVisabled = false
    },
    // 关闭账册组件
    closeZBookCompnent () {
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
    closeCustomsCodeCompnent () {
      this.customsCodeVisabled = false
    },
    // 打开 联系单备案商品信息列表
    openManualGoods () {
      this.manualGoodsVisabled = true
    },
    // 联系单备案商品信息列表选择确定
    receptionManualGoods (pramas) {
      this.tableList = []
      this.refreshDecList()
      // 遍历并赋值 tableList
      let goods = pramas.list
      let flag = pramas.flag
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
        this.tableList.push(this.decList)
        this.refreshDecList()
      }
      this.resetGoodsEnNameList()
      this.controller.cDisabled = true
      this.manualGoodsVisabled = false
      this.saveDecLic()
    },
    // 取消联系单备案商品信息的选择
    closeManualGoods () {
      this.manualGoodsVisabled = false
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
    /**
   * 控制输入中英文字符长度，一个中文当做2个长度来控制
   * @param inpt
   * @param maxlen
   */
    checklen (type, ipnut, maxlen) {
      let str
      switch (type) {
        case 'goodsSpecForm':
          str = this.goodsSpecForm[ipnut]
          break
        case 'userForm':
          str = this.userForm[ipnut]
          break
        case 'decList':
          str = this.decList[ipnut]
          break
        case 'licVINForm':
          str = this.licVINForm[ipnut]
          break
        case 'decHead':
          str = this.decHead[ipnut]
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
            case 'goodsSpecForm':
              this.goodsSpecForm[ipnut] = str.substr(0, i)
              break
            case 'userForm':
              this.userForm[ipnut] = str.substr(0, i)
              break
            case 'decList':
              this.decList[ipnut] = str.substr(0, i)
              break
            case 'licVINForm':
              this.licVINForm[ipnut] = str.substr(0, i)
              break
            case 'decHead':
              this.decHead[ipnut] = str.substr(0, i)
              break
            default:
              str = ''
          }
          return
        }
      }
    },
    /**
   * 只允许输入正整数
   * @param obj
   */
    decCheckInt (type, ipnut, maxlen) {
      let value
      switch (type) {
        case 'goodsSpecForm':
          value = this.goodsSpecForm[ipnut]
          break
        case 'decList':
          value = this.decList[ipnut]
          break
        default:
          value = ''
      }
      let t = value.replace(/[^(()\d&|)]/g, '')
      if (t.length > maxlen) {
        switch (type) {
          case 'goodsSpecForm':
            value = this.goodsSpecForm[ipnut] = value.substr(0, maxlen - 1)
            break
          case 'decList':
            value = this.decList[ipnut] = value.substr(0, maxlen - 1)
            break
          default:
            value = ''
        }
      } else {
        switch (type) {
          case 'goodsSpecForm':
            this.goodsSpecForm[ipnut] = t
            break
          case 'decList':
            this.decList[ipnut] = t
            break
          default:
            this.decList[ipnut] = ''
        }
      }
    },
    // 弹窗开启
    charterRight () {
      this.charterVisabled = true
    },
    // 弹窗关闭
    closeCharter () {
      this.charterVisabled = false
    },
    // 获取特许权的传值
    getCharterForm (data) {
      this.decHead.decRoyaltyFeeVO = data
    },
    // 转关单下拉框赋值
    TransitSelect () {
      let handSelect = {
        'transFlag': {obj: 'transType', params: 'TRANS_TYPE'}, // 转关类型
        'inbordTrafMode': {obj: 'inbordTrafModeList', params: 'SAAS_TRANSPORT_TYPE'}, // 境内运输方式
        'transType': {obj: 'transTypeList', params: 'TRANS_TYPE_LIST'}, // 转关单申报类型
        'esealFlag': {obj: 'esealFlagList', params: 'ESEAL_FLAG'}, // 是否启用电子关锁
        'containerMdCode': {obj: 'saasContainerModel', params: 'SAAS_CONTAINER_MODEL'} // 集装箱规格代码
      }
      this.$refs.bondedtrans.detailSelect(handSelect, this.initTransfer.transDcForm)
    },
    // 页签切换
    changeTabs (activeName, oldActiveName) {
      if (activeName === 'second' && util.isEmpty(this.decHead.customMaster)) {
        this.messageTips('请选择申报地海关')
        return false
      } else if (activeName === 'second') {
        if (this.controller.operationType !== 'add') {
          this.TransitSelect()
          this.initTransfer.contaGoodsList.forEach((e, i) => {
            e['relId'] = i + 1
          })
        }
        this.initTransfer.customMaster = this.decHead.customMaster
        this.initTransfer.isDisabled = this.controller.isDisabled
      }
    }
  }
}
</script>

<style scoped lang="less">

.sys-main{
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: auto;
    margin-left:5px;
}
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
}
.m-t-10{
  margin-top: 10px;
}
.tips{
  font-size: 10px;
  color: @font-color-btn;
}

  .el-dialog__header {
      padding: 5px 10px 9px;
      background: #0969C8 !important;
      color:#fff;
  }
  .el-dialog__body {
    color: #606266;
    font-size: 14px;
    padding-top: 2px;
  }
  .layer-btn {
    height: 32px;
    line-height: 32px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #4898d5;
    border-radius: 2px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    background-color: #2e8ded;
    color: #fff;
  }
  .layer-btn2 {
    height: 32px;
    line-height: 32px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #4898d5;
    border-radius: 2px;
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;
    text-decoration: none;
    background: #fff;
    color: #64A7EB;
  }
  .layer-btn2:focus,.layer-btn2:hover{
    background:#64A7EB;
    color: #fff;
  }
  .el-dialog__footer {
    padding: 10px 20px 10px;
    box-sizing: border-box;
  }
 .w-100 {
   width: 100%;
 }
 .border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
 }
 .border-bottom {
   border-bottom: 0;
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
  .shade-div {
    position: absolute;
    width: 86%;
    height: 18px;
    top: 0;
  }
  input[type="file"]:focus, input[type="checkbox"]:focus, input[type="radio"]:focus {
    outline-offset: -2px;
    outline: -webkit-focus-ring-color auto 5px;
  }
 .priceDiv{
    text-align: center;
    padding: 10px 0;
  }
  .i-class {
    cursor: pointer;
    background-color: #096AC6;
    color: #fff;
  }
  @import './decPage/common/decCss';
</style>
