<template>
  <!-- 进出口报关单 新增 详情 修改 合用界面-->
  <section class='sys-main sys-dec-class dec-section-edit' :style="{ zoom: zoom }">
    <el-header class= 'topDiv'>
        <!-- 操作按钮-->
        <el-row style='margin-right:54px'>
            <el-button type="primary" size="mini" class='dec-h-24' icon="fa fa-plus" @click="addDecHead" :disabled="controller.isDisabled">&nbsp;新增</el-button>
            <el-button type="primary" size="mini" class='dec-h-24' icon="fa fa-save" @click="saveDecHead" :disabled="controller.isDisabled">&nbsp;暂存</el-button>
          </el-row>
      </el-header>
    <div class="dec-container-div">
      <el-container>
        <el-container>
          <el-main style="padding:3px 5px 20px 0px;">
            <!---表头开始  -->
            <div class='dec-div'>
              <el-form ref="headRuleForm" :model="decHead"  :rules="headRuleForm" label-width="105px" size="mini" @keyup.enter.native="switchFoucsByEnter">
                <el-row  >
                  <el-col :span="12">
                    <el-form-item label="模板名称" :class="{ 'require-color': controller.requireColor }"  prop="settingsName">
                      <el-input v-model="decHead.settingsName" @focus="tipsFillMessage('settingsName')" ref="settingsName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="生效标志">
                      <el-radio-group v-model="decHead.effective">
                        <el-radio :label="'1'">使用单位</el-radio>
                        <el-radio :label="'2'">创建人</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                  <el-row  >
                    <el-col :span="12">
                      <el-form-item label="申报地海关" :class="{ 'require-color': controller.requireColor }"  prop="customMaster">
                        <el-select placeholder="" v-model="decHead.customMaster"
                        @focus="tipsFillMessage('customMaster', 'saasCustomsRel1','SAAS_CUSTOMS_REL')"
                        remote clearable filterable  default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasCustomsRel1')"
                        ref="customMaster" dataRef ='customMaster'
                        :disabled="controller.isDisabled" style="width:100%" >
                          <el-option
                            v-for="item in saasCustomsRel1"
                            :key="item.codeField"
                            :label="item.codeField + '-' +item.nameField"
                            :value="item.codeField">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="controller.iEFlag == 'I' ? '进境关别':'出境关别'"
                        :class="{ 'require-color': controller.requireColor }" prop="iEPort">
                        <el-select placeholder="" v-model="decHead.iEPort"
                        ref="iEPort" dataRef ='iEPort'
                        remote default-first-option clearable filterable
                        :remote-method="checkParamsList"
                        @change="iEPortChange"
                        @clear="clearSelct('saasCustomsRel2')"
                        @focus="tipsFillMessage('iEPort', 'saasCustomsRel2','SAAS_CUSTOMS_REL')"
                        :disabled="controller.isDisabled" style="width:100%" >
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
                        @focus="tipsFillMessage('manualNo')" :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="合同协议号" prop="contrNo" ref="contrNo">
                        <el-input v-model="decHead.contrNo"  :maxlength="32" @focus="tipsFillMessage('contrNo')" :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  v-if ="controller.iEFlag == 'I'">
                    <el-col :span="12">
                      <el-form-item label="进口日期">
                        <el-input  v-model="decHead.iEDate"  :maxlength="8"
                        :class="{ 'require-color': controller.requireColor }"
                        @focus="tipsFillMessage('iEDate')" :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="24">
                      <el-form-item label="境内收发货人" >
                        <el-col :span="4">
                          <el-form-item prop="tradeCoScc" ref="tradeCoScc" >
                            <el-input :class="{ 'require-color': controller.requireColor }"
                              v-model="decHead.tradeCoScc" :maxlength="18" placeholder="18位社会信用代码"
                              dataRef = 'tradeCoScc'
                              @focus="tipsFillMessage('tradeCoScc')"
                              @blur="queryCropInfo('tradeCoScc')"
                              :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item prop="tradeCode" ref="tradeCode">
                              <el-input   :class="{ 'require-color': controller.requireColor }"
                                v-model="decHead.tradeCode"  :maxlength="10"  placeholder="10位海关编码"
                                dataRef = 'tradeCode'
                                @focus="tipsFillMessage('tradeCode')"
                                @blur="queryCropInfo('tradeCode')"
                                :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item prop="consigneeCode" ref="consigneeCode">
                            <el-input   v-model="decHead.consigneeCode" placeholder="10位检验检疫编码"
                              @focus="tipsFillMessage('consigneeCode')"
                              :maxlength="10"  :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="tradeName" ref="tradeName">
                              <el-autocomplete
                                :class="{ 'require-color': controller.requireColor }"
                                :maxlength="70"
                                placeholder="企业名称(中文),输入两位字符开始匹配"
                                size='mini'
                                @focus="tipsFillMessage('tradeName')"
                                v-model="decHead.tradeName"
                                :fetch-suggestions="querySearch"
                                :trigger-on-focus="false"
                                :select-when-unmatched='true'
                                :highlight-first-item='true'
                                :disabled="controller.isDisabled"
                                @select="handleSelect($event, '1')">
                              </el-autocomplete>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="domesticConsigneeEname" ref="domesticConsigneeEname">
                            <el-input  :class="{ 'require-color': controller.requireColor }"
                              :maxlength="70"  v-model="decHead.domesticConsigneeEname" placeholder="企业名称(外文)"
                              @focus="tipsFillMessage('domesticConsigneeEname')"
                              :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  v-if="controller.iEFlag == 'I'">
                    <el-col :span="24">
                      <el-form-item label="境外收发货人" >
                        <el-col :span="6">
                          <el-form-item >
                            <el-input  v-model="decHead.overseasConsignorCode" placeholder="境外收货人代码"
                              @focus="tipsFillMessage('overseasConsignorCode')"
                            :maxlength="50" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="overseasConsignorEname" ref="overseasConsignorEname" >
                            <el-input  :maxlength="100"
                              @focus="tipsFillMessage('overseasConsignorEname')"
                              v-model="decHead.overseasConsignorEname" placeholder="企业名称(外文)" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="overseasConsignorCname" ref="overseasConsignorCname" >
                            <el-input :maxlength="100"
                              @focus="tipsFillMessage('overseasConsignorCname')"
                              v-model="decHead.overseasConsignorCname" placeholder="企业名称(中文)" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="overseasConsignorAddr" ref="overseasConsignorAddr" >
                            <el-input  :maxlength="100"
                              @focus="tipsFillMessage('overseasConsignorAddr')"
                              v-model="decHead.overseasConsignorAddr" placeholder="发货人地址" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  v-else>
                    <el-col :span="24">
                      <el-form-item label="境外收发货人" >
                        <el-col :span="6">
                          <el-form-item >
                            <el-input  v-model="decHead.overseasConsigneeCode" placeholder="境外收货人代码"
                              @focus="tipsFillMessage('overseasConsigneeCode')"
                            :maxlength="50" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="overseasConsigneeEname" ref="overseasConsigneeEname" >
                            <el-input  :maxlength="100"
                              @focus="tipsFillMessage('overseasConsigneeEname')"
                              v-model="decHead.overseasConsigneeEname" placeholder="企业名称(外文)" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="overseasConsignorCname" ref="overseasConsignorCname" >
                            <el-input :maxlength="100"
                              @focus="tipsFillMessage('overseasConsignorCname')"
                              v-model="decHead.overseasConsignorCname" placeholder="企业名称(中文)" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item prop="overseasConsignorAddr" ref="overseasConsignorAddr" >
                            <el-input  :maxlength="100"
                              @focus="tipsFillMessage('overseasConsignorAddr')"
                              v-model="decHead.overseasConsignorAddr" placeholder="发货人地址" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="24" >
                      <el-form-item :label="controller.iEFlag == 'I' ? '消费使用单位':'生产销售单位'" >
                        <el-col :span="4">
                          <el-form-item prop="ownerCodeScc" ref="ownerCodeScc" >
                            <el-input   :class="{ 'require-color': controller.requireColor }" :maxlength="18"
                              @focus="tipsFillMessage('ownerCodeScc')"
                              @blur="queryCropInfo('ownerCodeScc')"
                              v-model="decHead.ownerCodeScc" placeholder="18位社会信用代码" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item prop="ownerCode" ref="ownerCode" >
                            <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="10"
                              dataRef = 'ownerCode'
                              @focus="tipsFillMessage('ownerCode')"
                              @blur="queryCropInfo('ownerCode')"
                              v-model="decHead.ownerCode" placeholder="10位海关编码" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item prop="ownerCiqCode" ref="ownerCiqCode" >
                            <el-input  v-model="decHead.ownerCiqCode" :maxlength="10"
                              @focus="tipsFillMessage('ownerCiqCode')"
                              placeholder="10位检验检疫编码" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item prop="ownerName" ref="ownerName" >
                            <el-autocomplete
                                :class="{ 'require-color': controller.requireColor }"
                                :maxlength="70"
                                placeholder="企业名称,输入两位字符开始匹配"
                                size='mini'
                                @focus="tipsFillMessage('ownerName')"
                                v-model="decHead.ownerName"
                                :fetch-suggestions="querySearch"
                                :trigger-on-focus="false"
                                :select-when-unmatched='true'
                                :highlight-first-item='true'
                                :disabled="controller.isDisabled"
                                @select="handleSelect($event, '3')">
                              </el-autocomplete>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="24">
                      <el-form-item label="申报单位">
                        <el-col :span="4">
                          <el-form-item prop="agentCodeScc" ref="agentCodeScc" >
                            <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="18"
                              @focus="tipsFillMessage('agentCodeScc')"
                              v-model="decHead.agentCodeScc" placeholder="18位社会信用代码" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item prop="agentCode" ref="agentCode" >
                            <el-input   :class="{ 'require-color': controller.requireColor }" :maxlength="10"
                            @focus="tipsFillMessage('agentCode')"
                            v-model="decHead.agentCode" placeholder="10位海关编码" :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item prop="declRegNo" ref="declRegNo" >
                            <el-input  :maxlength="10"  v-model="decHead.declRegNo" placeholder="10位检验检疫编码"
                              @focus="tipsFillMessage('declRegNo')"
                              :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
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
                              :disabled="controller.isDisabled"
                              @select="handleSelect($event, '4')">
                            </el-autocomplete>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="6">
                      <el-form-item label="运输方式" prop="trafMode">
                        <el-select placeholder="" v-model="decHead.trafMode"
                          remote default-first-option  clearable filterable
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasTransportType')"
                          @focus="tipsFillMessage('trafMode', 'saasTransportType','SAAS_TRANSPORT_TYPE')"
                          ref="trafMode" dataRef ='trafMode'
                          :disabled="controller.isDisabled" style="width:100%">
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
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="航次号">
                        <el-input v-model="decHead.voyageNo" :maxlength="32"
                          @focus="tipsFillMessage('voyageNo')"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="12">
                      <el-form-item label="提运单号">
                        <el-input v-model="decHead.billNo" :maxlength="32"
                          @focus="tipsFillMessage('billNo')"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="监管方式"  :class="{ 'require-color': controller.requireColor }"  prop="tradeMode">
                        <el-select placeholder="" v-model="decHead.tradeMode"
                          @focus="tipsFillMessage('tradeMode', 'saasTrade','SAAS_TRADE')"
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasTrade')"
                          @change = 'tradeModeChange'
                          ref="tradeMode" dataRef ='tradeMode'
                          remote default-first-option clearable filterable
                          :disabled="controller.isDisabled" style="width:100%">
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
                        <el-select placeholder="" v-model="decHead.cutMode"
                          @focus="tipsFillMessage('cutMode', 'saasLevytype','SAAS_LEVYTYPE')"
                          remote clearable filterable default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasLevytype')"
                          @change='cutModeChange'
                          ref="cutMode" dataRef ='cutMode'
                          :disabled="controller.isDisabled" style="width:100%">
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
                      <el-form-item label="许可证号">
                        <el-input v-model="decHead.licenseNo"  :maxlength="20"
                          @focus="tipsFillMessage('licenseNo')"
                          @keyup.native = "changeLicenseNo"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item :label="controller.iEFlag == 'I' ? '启运国(地区)':'运抵国(地区)'"
                        :class="{ 'require-color': controller.requireColor }"
                        prop="tradeCountry">
                        <el-select placeholder="" v-model="decHead.tradeCountry"
                          @focus="tipsFillMessage('tradeCountry', 'saasCountry1','SAAS_COUNTRY')"
                          remote clearable filterable default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasCountry1')"
                          @change = 'tradeCountryChange'
                          ref="tradeCountry" dataRef ='tradeCountry'
                          :disabled="controller.isDisabled" style="width:100%">
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
                        <el-select placeholder="" v-model="decHead.distinatePort"
                          @focus="tipsFillMessage('distinatePort', 'saasPortLin1','SAAS_PORT_LIN')"
                          remote clearable filterable default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasPortLin1')"
                          ref="distinatePort" dataRef ='distinatePort'
                          :disabled="controller.isDisabled" style="width:100%">
                          <el-option
                            v-for="item in saasPortLin1"
                            :key="item.codeField"
                            :label="item.codeField + '-' + item.nameField"
                            :value="item.codeField">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="成交方式"  :class="{ 'require-color': controller.requireColor }" prop="transMode">
                        <el-select placeholder="" v-model="decHead.transMode"
                          @focus="tipsFillMessage('transMode', 'saasTransac','SAAS_TRANSAC')"
                          remote clearable filterable default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasTransac')"
                          @change="transModeChange"
                          ref="transMode" dataRef ='transMode'
                          :disabled="controller.isDisabled" style="width:100%">
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
                          <el-form-item prop="feeMark">
                            <el-select placeholder=""
                            v-model="decHead.feeMark"
                            @focus="tipsFillMessage('feeMark', 'feeRate1' ,'FEE_RATE')"
                            remote clearable filterable  default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('feeRate1')"
                            :disabled="controller.isDisabled || controller.feeMarkDisabled"
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
                              :disabled="controller.isDisabled || controller.feeRateDisabled" ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item >
                            <el-select placeholder="" v-model="decHead.feeCurr"
                            @focus="tipsFillMessage('feeCurr', 'saasCurr1','SAAS_CURR')"
                            remote filterable clearable  default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCurr1')"
                            ref="feeCurr" dataRef ='feeCurr'
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
                      <el-form-item label="保费" label-width="50px">
                        <el-col :span="8">
                          <el-form-item >
                            <el-select placeholder="" v-model="decHead.insurMark"
                            @focus="tipsFillMessage('insurMark', 'feeRate2' ,'FEE_RATE_OHTER')"
                            remote clearable filterable  default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('feeRate2')"
                            ref="insurMark" dataRef ='insurMark'
                            :disabled="controller.isDisabled || controller.insurMarkDisabled" style="width:100%"  @change="feeChange(decHead.insurMark, 2)">
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
                              :disabled="controller.isDisabled || controller.insurRateDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item >
                            <el-select placeholder="" v-model="decHead.insurCurr"
                            @focus="tipsFillMessage('insurCurr', 'saasCurr2','SAAS_CURR')"
                            remote clearable filterable  default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCurr2')"
                            ref="insurCurr" dataRef ='insurCurr'
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
                      <el-form-item label="杂费" label-width="50px">
                        <el-col :span="8">
                          <el-form-item>
                            <el-select placeholder="" v-model="decHead.otherMark"
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
                              :disabled="controller.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item>
                              <el-select placeholder="" v-model="decHead.otherCurr"
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
                          :class="{ 'require-color': controller.requireColor }"   :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="6">
                      <el-form-item label="包装种类"  :class="{ 'require-color': controller.requireColor }"  prop="wrapType">
                        <el-select placeholder="" v-model="decHead.wrapType"
                          @focus="tipsFillMessage('wrapType', 'saasWrap','SAAS_WRAP')"
                          remote clearable filterable  default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasWrap')"
                          ref="wrapType" dataRef ='wrapType'
                          :disabled="controller.isDisabled" style="width:100%">
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
                          @focus="tipsFillMessage('grossWt')"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="净重(KG)" prop="netWt" ref="netWt">
                        <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="20"
                          @focus="tipsFillMessage('netWt')"
                          v-model="decHead.netWt"  :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="6">
                      <el-form-item label="贸易国别(地区)"  :class="{ 'require-color': controller.requireColor }"  prop="tradeAreaCode">
                        <el-select placeholder="" v-model="decHead.tradeAreaCode"
                          @focus="tipsFillMessage('tradeAreaCode', 'saasCountry2','SAAS_COUNTRY')"
                          remote clearable filterable  default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasCountry2')"
                          ref="tradeAreaCode" dataRef ='tradeAreaCode'
                          :disabled="controller.isDisabled" style="width:100%">
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
                        <el-input v-model="decHead.contaCount" @focus="tipsFillMessage('contaCount')"  disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="随附单证">
                        <el-input v-model="showFied.attaDocuCdstr" @focus="tipsFillMessage('attaDocuCdstr')"  disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row   v-if="controller.iEFlag == 'I'">
                    <!-- 进口页面显示 -->
                    <el-col :span="6">
                      <el-form-item label="入境口岸"  :class="{ 'require-color': controller.requireColor }"  prop="entyPortCode">
                        <el-select placeholder="" v-model="decHead.entyPortCode"
                          @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                          remote  default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasInlandPort')"
                          ref="entyPortCode" dataRef ='entyPortCode'
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
                      <el-form-item label="货物存放地点"  :class="{ 'require-color': controller.requireColor }" prop="goodSplace" ref="goodSplace">
                        <el-input v-model="decHead.goodSplace" :maxlength="100"
                          @focus="tipsFillMessage('goodSplace')"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" >
                      <el-form-item label="启运港"  :class="{ 'require-color': controller.requireColor }" prop="despPortCode">
                        <el-select placeholder="" v-model="decHead.despPortCode"
                          @focus="tipsFillMessage('despPortCode', 'saasPortLin','SAAS_PORT_LIN')"
                          remote  default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasPortLin')"
                          enter = 'no'
                          ref="despPortCode" dataRef ='despPortCode'
                          clearable filterable :disabled="controller.isDisabled" style="width:100%">
                          <el-option
                            v-for="item in saasPortLin"
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
                      <el-form-item label="货物存放地点" :maxlength="100" :class="{ 'require-color': controller.requireColor }" prop="goodSplace" ref="goodSplace">
                        <el-input v-model="decHead.goodSplace"
                          @focus="tipsFillMessage('goodSplace')"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="离境口岸"  :class="{ 'require-color': controller.requireColor }"  prop="entyPortCode">
                        <el-select placeholder="" v-model="decHead.entyPortCode"
                          @focus="tipsFillMessage('entyPortCode', 'saasInlandPort','SAAS_INLAND_PORT')"
                          remote  default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasInlandPort')"
                          enter = 'no'
                          ref="entyPortCode" dataRef ='entyPortCode'
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
                  <el-row  >
                    <el-col :span="6" >
                      <el-form-item label="报关单类型"  :class="{ 'require-color': controller.requireColor }"  prop="entryType">
                        <el-select placeholder="" v-model="decHead.entryType"
                        @focus="tipsFillMessage('entryType', 'decType','DEC_TYPE')"
                          remote default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('decType')"
                          ref="entryType" dataRef ='entryType'
                          clearable filterable :disabled="controller.isDisabled" style="width:100%" >
                          <el-option
                            v-for="item in decType"
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
                          :disabled="controller.isDisabled"></el-input>
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
                      <el-form-item label="标记唛码" :maxlength="400" :class="{ 'require-color': controller.requireColor }"  prop="markNo" ref="markNo">
                        <el-input v-model="decHead.markNo"
                          dataRef = 'markNo'
                          type="textarea"
                          class='dec-textarea'
                          @keydown.enter.native="prevent"
                          @keyup.native= "computLength('2')"
                          @focus="tipsFillMessage('markNo')"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <div style='display: inline-block;width: 50%;'>
                        <span >{{'(' + showFied.markNoLength + ')字节'}}</span>
                        <el-button class="btn-pop" icon="fa fa-ellipsis-h" @click="openNote('2')"></el-button>
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
                          <el-select placeholder="" v-model="decHead.orgCode"
                            @focus="tipsFillMessage('orgCode', 'saasCiqOrganization1','SAAS_CIQ_ORGANIZATION')"
                            remote clearable filterable default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCiqOrganization1')"
                            ref="orgCode" dataRef ='orgCode'
                            :disabled="controller.isDisabled" style="width:100%">
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
                            <el-input v-model="showFied.entQualifTypeCodeS" @focus="tipsFillMessage('entQualifTypeCodeS')" placeholder="企业资质类别" disabled></el-input>
                          </el-col>
                          <el-col :span="10">
                            <el-input v-model="showFied.entQualifTypeCodeSName" @focus="tipsFillMessage('entQualifTypeCodeSName')" placeholder="企业资质编号"  disabled></el-input>
                          </el-col>
                          <el-col :span="6">
                            <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openEntQuaConent" ></el-button>
                          </el-col>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row  >
                      <el-col :span="controller.iEFlag === 'I' ? 6 : 12">
                        <el-form-item label="领证机关"  :class="{ 'require-color': controller.requireColor }"  prop="vsaOrgCode">
                          <el-select placeholder="" v-model="decHead.vsaOrgCode"
                            @focus="tipsFillMessage('vsaOrgCode', 'saasCiqOrganization2','SAAS_CIQ_ORGANIZATION')"
                            remote default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCiqOrganization2')"
                            ref="vsaOrgCode" dataRef ='vsaOrgCode'
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
                          <el-select placeholder="" v-model="decHead.inspOrgCode"
                            @focus="tipsFillMessage('inspOrgCode', 'saasCiqOrganization3','SAAS_CIQ_ORGANIZATION')"
                            remote  default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCiqOrganization3')"
                            ref="inspOrgCode" dataRef ='inspOrgCode'
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
                            :disabled="controller.isDisabled"
                            value-format="yyyyMMdd"
                            format='yyyyMMdd'
                            placeholder="">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" v-if="controller.iEFlag === 'I'">
                        <el-form-item label="B/L号">
                          <el-input v-model="decHead.blno" :disabled="controller.isDisabled"
                          @focus="tipsFillMessage('blno')"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row  >
                      <el-col :span="controller.iEFlag === 'I' ? 6 : 12">
                        <el-form-item label="目的地检验检疫机关"  :class="{ 'require-color': controller.requireColor }"  prop="purpOrgCode">
                          <el-select placeholder="" v-model="decHead.purpOrgCode"
                            @focus="tipsFillMessage('purpOrgCode', 'saasCiqOrganization4','SAAS_CIQ_ORGANIZATION')"
                            remote  default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasCiqOrganization4')"
                            ref="purpOrgCode" dataRef ='purpOrgCode'
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
                              placeholder="关联号码" :disabled="controller.isDisabled"></el-input>
                          </el-col>
                          <el-col :span="12">
                            <el-select v-model="decHead.correlationReasonFlag"
                              @focus="tipsFillMessage('correlationReasonFlag', 'saasCorrelationReason','SAAS_CORRELATION_REASON')"
                              remote   default-first-option
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
                          <el-select placeholder="" v-model="decHead.origBoxFlag"
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
                            <el-input v-model="showFied.specDeclFlagValue" @focus="tipsFillMessage('specDeclFlagValue')" disabled></el-input>
                          </el-col>
                          <el-col :span="controller.iEFlag == 'I' ? 6 : 4">
                            <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openSpecialBusiContent"></el-button>
                          </el-col>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="卸毕日期">
                          <el-date-picker
                            v-model="decHead.cmplDschrgDt"
                            type="date"
                            value-format="yyyyMMdd"
                            format='yyyyMMdd'
                            style="width:100%"
                            placeholder="">
                          </el-date-picker>
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
                <el-button size="mini" icon="fa fa-plus" class="secondButton" :disabled="controller.isDisabled"  @click="refreshDecList">&nbsp;新增</el-button>
                <el-button size="mini" icon="fa fa-floppy-o" class="secondButton" @click="saveDecList" :disabled="controller.isDisabled" >&nbsp;保存</el-button>
              </el-row>
              <el-row >
                <el-col :span="24">
                  <el-table
                  ref="decListTable"
                  :data="tableList"
                  highlight-current-row
                  :height='230'
                  style="width: 100%"
                  size="mini" border
                  @select="decListSelect"
                  @selection-change="decListChange"
                  @row-click='backDeccListInfo'>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="contrItem" label="备案序号" min-width="80"></el-table-column>
                    <el-table-column prop="codeTs" label="商品编号" min-width="100"></el-table-column>
                    <el-table-column prop="ciqName" label="检验检疫名称" min-width="180"></el-table-column>
                    <el-table-column prop="gName" label="商品名称" min-width="100"></el-table-column>
                    <el-table-column prop="gModel" label="规格" min-width="200"></el-table-column>
                    <el-table-column prop="gQty" label="成交数量" min-width="100"></el-table-column>
                    <el-table-column prop="gUnitValue" label="成交单位" min-width="80"></el-table-column>
                    <el-table-column prop="declPrice" label="单价" min-width="80"></el-table-column>
                    <el-table-column prop="declTotal" label="总价" min-width="100"></el-table-column>
                    <el-table-column prop="tradeCurrValue" label="币制" min-width="100"></el-table-column>
                    <el-table-column prop="originCountryValue" label="原产国(地区)" min-width="100"></el-table-column>
                    <el-table-column prop="destinationCountryValue" label="最终目的国" min-width="100"></el-table-column>
                    <el-table-column prop="dutyModeValue" label="征免方式" min-width="80"></el-table-column>
                    <!-- <el-table-column prop="date" label="监管要求" width="80"></el-table-column> -->
                  </el-table>
                </el-col>
              </el-row>
            </div>
            <!--- table 结束  -->
            <div class="dec-div dec-page-bottom">
              <el-form ref="bodyRuleForm" :rules="bodyRuleForm" @keyup.enter.native="switchFoucsByEnter"  :model="decList"  label-width="100px" size="mini">
                  <el-row  >
                    <el-col :span="6">
                      <el-form-item label="备案序号" ref="contrItem">
                        <el-input v-model="decList.contrItem"
                        @blur="selectBookBody"
                        :disabled="controller.contrItemDisabled"
                        @focus="tipsFillMessage('contrItem')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label="商品编号"  prop="codeTs" ref="codeTs">
                        <el-input  :class="{ 'require-color': controller.requireColor }"
                        @focus="tipsFillMessage('codeTs')"
                        v-model="decList.codeTs"
                        :disabled="controller.isDisabled"
                        enter = 'no'
                        @change="codeTsChangeF"
                        @keyup.enter.native="openProductList()"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label="检验检疫名称" >
                        <el-col :span="21">
                          <el-input v-model="decList.ciqName" @focus="tipsFillMessage('ciqName')"  disabled></el-input>
                        </el-col>
                        <el-col :span="3">
                          <el-button class="btn-pop" icon="fa fa-ellipsis-h" @click="openEncodeTableContent"></el-button>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="12">
                      <el-form-item label="商品名称" prop="gName" ref="gName">
                        <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="255"
                          @focus="tipsFillMessage('gName')"
                          v-model="decList.gName" dataRef='gName'
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="规格型号">
                        <el-input v-model="decList.gModel" @focus="tipsFillMessage('gModel')" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  >
                    <el-col :span="5">
                      <el-form-item label="成交数量" prop="gQty" ref="gQty">
                        <el-input  :class="{ 'require-color': controller.requireColor }" :maxlength="20"
                          @focus="tipsFillMessage('gQty')"
                          @blur="gQtyBlur"
                        v-model="decList.gQty"  :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="成交计量单位"  :class="{ 'require-color': controller.requireColor }">
                        <el-select placeholder="" v-model="decList.gUnit"
                          @focus="tipsFillMessage('gUnit', 'saasUnit1','SAAS_UNIT')"
                          ref="gUnit" dataRef ='gUnit'
                          remote  default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasUnit1')"
                        clearable filterable :disabled="controller.isDisabled" style="width:100%">
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
                      <el-form-item label="单价" label-width="50px" prop="declPrice" ref="declPrice" :class="{ 'require-color': controller.requireColor }">
                        <el-input v-model="decList.declPrice" :maxlength="19"
                        @focus="tipsFillMessage('declPrice')"
                        @blur="computTotal"
                        :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="总价" prop="declTotal" ref="declTotal" label-width="50px">
                        <el-input  :class="{ 'require-color': controller.requireColor }"
                        :maxlength="18" v-model="decList.declTotal"
                        @focus="tipsFillMessage('declTotal')"
                        @blur="computPrice"
                        :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="币制" label-width="50px"  :class="{ 'require-color': controller.requireColor }" prop="tradeCurr">
                        <el-select placeholder="" v-model="decList.tradeCurr"
                          @focus="tipsFillMessage('tradeCurr', 'saasCurr4','SAAS_CURR')"
                          remote   default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasCurr4')"
                          ref="tradeCurr" dataRef ='tradeCurr'
                        clearable filterable :disabled="controller.isDisabled" style="width:100%">
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
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="法定第一计量单位" >
                        <el-select placeholder="" v-model="decList.unit1"
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
                      <el-form-item label="加工成品单耗版本号" label-width="120px">
                        <el-input v-model="decList.exgVersion" :maxlength="8"
                          @focus="tipsFillMessage('exgVersion')"
                          :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="货号" label-width="50px">
                        <el-input v-model="decList.exgNo"  :maxlength="30"
                        @focus="tipsFillMessage('exgNo')"
                        :disabled="controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="最终目的国(地区)"  :class="{ 'require-color': controller.requireColor }"  prop="destinationCountry">
                        <el-select placeholder="" v-model="decList.destinationCountry"
                          @focus="tipsFillMessage('destinationCountry', 'saasCountry3','SAAS_COUNTRY')"
                          remote  default-first-option
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
                      <el-form-item label="法定第二数量" >
                        <el-input v-model="decList.qty2"  @focus="tipsFillMessage('qty2')" :disabled="controller.qty2Disabled || controller.isDisabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="法定第二计量单位" >
                        <el-select placeholder="" v-model="decList.unit2"
                          @focus="tipsFillMessage('unit2', 'saasUnit3','SAAS_UNIT')"
                          remote  default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasUnit3')"
                          ref="unit2" dataRef ='unit2'
                          @change = "unit2Change"
                          clearable filterable disabled style="width:100%">
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
                        <el-select placeholder="" v-model="decList.originCountry"
                          @focus="tipsFillMessage('originCountry', 'saasCountry4','SAAS_COUNTRY')"
                          remote default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasCountry4')"
                          ref="originCountry" dataRef ='originCountry'
                          clearable filterable :disabled="controller.isDisabled" style="width:100%">
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
                        <el-select placeholder="" v-model="decList.origPlaceCode "
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
                              class='spical-class'
                              @focus="tipsFillMessage('districtCode', 'saasDistrictRel','SAAS_DISTRICT_REL')"
                              remote default-first-option
                              :remote-method="checkParamsList"
                              @clear="clearSelct('saasDistrictRel')"
                              ref="districtCode" dataRef ='districtCode'
                              clearable filterable :placeholder="controller.iEFlag == 'I' ?  '境内目的地代码' : '产地代码'" :disabled="controller.isDisabled" style="width:100%">
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
                            <el-select v-model="decList.destCode" :placeholder="controller.iEFlag == 'I' ?  '目的地代码' : '境内货源地代码'"
                              class='spical-class'
                              @focus="tipsFillMessage('destCode', 'saasCiqCityCn','SAAS_CIQ_CITY_CN')"
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
                        <el-select placeholder="" v-model="decList.dutyMode" enter="no"
                          @focus="tipsFillMessage('dutyMode', 'saasLevymode','SAAS_LEVYMODE')"
                          remote default-first-option
                          :remote-method="checkParamsList"
                          @clear="clearSelct('saasLevymode')"
                          ref="dutyMode" dataRef ='dutyMode'
                          clearable  filterable :disabled="controller.isDisabled" style="width:100%"
                          @keyup.enter.native="saveDecList('1')">
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
                            <el-input v-model="showFied.showGoodsSpec" @focus="tipsFillMessage('showGoodsSpec')" disabled></el-input>
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
                            <el-input v-model="showFied.showGoodsAttrValue"  @focus="tipsFillMessage('showGoodsAttrValue')" disabled></el-input>
                          </el-col>
                          <el-col :span="3">
                            <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodAtrrContent"></el-button>
                          </el-col>
                        </el-form-item>
                      </el-col>
                      <el-col :span="9">
                        <el-form-item label="用途"  :class="{ 'require-color': controller.requireColor }"  prop="purpose">
                          <el-select placeholder="" v-model="decList.purpose"
                            @focus="tipsFillMessage('purpose', 'saasUserTo','SAAS_USER_TO')"
                            remote default-first-option
                            :remote-method="checkParamsList"
                            @clear="clearSelct('saasUserTo')"
                            ref="purpose" dataRef ='purpose'
                            clearable  filterable :disabled="controller.isDisabled" style="width:100%"
                            @keyup.enter.native="saveDecList('2')">
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
        <el-aside style="width: 20%; padding-top: 3px;">
          <!-- 集装箱信息 开始-->
          <div class="dec-div">
            <el-row>
              <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDecConta" :disabled="controller.isDisabled">&nbsp;新增</el-button>
              <el-button size="mini" icon="fa fa-save" class="secondButton" @click="saveDecConta" :disabled="controller.isDisabled">&nbsp;保存</el-button>
            </el-row>
            <el-row >
                <el-col :span="24">
                  <el-table :data="tableDecContainerlist" :height='200'
                    style="width:100%" size="mini"
                    @selection-change="decContaChange"
                    @row-click= 'backDecContaInfo'>
                    <el-table-column type="selection" width="55" ></el-table-column>
                    <el-table-column prop="containerNo" label="集装箱号" min-width="80"></el-table-column>
                    <el-table-column prop="containerSizeValue" label="集装箱规格" min-width="100"></el-table-column>
                    <el-table-column prop="lclFlag" label="拼箱标识" min-width="80">
                      <template slot-scope="scope">
                        <span>{{scope.row.lclFlag === '0' ? '否' : '是'}}</span>
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
                    <el-form-item label="集装箱号"  :class="{ 'require-color': controller.requireColor }" prop="containerNo" ref="containerNo" >
                      <el-input v-model="decContainer.containerNo" :disabled="controller.isDisabled"
                        @focus="tipsFillMessage('containerNo')"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="集装箱规格"  :class="{ 'require-color': controller.requireColor }"  prop="containerSize">
                      <el-select placeholder="" v-model="decContainer.containerSize"
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
                        :disabled="controller.isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="拼箱标识">
                      <el-select placeholder="" v-model="decContainer.lclFlag"
                        @focus="tipsFillMessage('lclFlag', 'commomPara2','COMMON_PARA')"
                        filterable remote default-first-option
                        clearable
                        :remote-method="checkParamsList"
                        @clear="clearSelct('commomPara2')"
                        ref="lclFlag" dataRef ='lclFlag'
                        @keyup.enter.native="saveDecConta"
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
              </el-form>
            </div>
          </div>
          <!-- 集装箱信息 结束-->
          <!-- 随附单证 开始 -->
          <div class="dec-div">
            <el-row>
              <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDoc" :disabled="controller.isDisabled">&nbsp;新增</el-button>
              <el-button size="mini" icon="fa fa-save" class="secondButton" @click="saveDecLic" :disabled="controller.isDisabled">&nbsp;保存</el-button>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-table
                  :data="licenselist"
                  :height='190' style="width: 100%" size="mini"
                  ref="decLicTable"
                  highlight-current-row border
                  @selection-change="decLicChange"
                  @row-click= 'backDecLicInfo' >
                  <el-table-column type="selection" width="55"></el-table-column>
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
                      <el-select placeholder="" v-model="decLicense.docuCode"
                        @focus="tipsFillMessage('docuCode', 'saasLicensedocu','SAAS_LICENSEDOCU')"
                        remote default-first-option
                        :remote-method="checkParamsList"
                        @clear="clearSelct('saasLicensedocu')"
                        ref="docuCode" dataRef ='docuCode'
                      clearable  filterable :disabled="controller.isDisabled" style="width:100%">
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
                    <el-form-item label="随附单证编号"  :class="{ 'require-color': controller.requireColor }"  prop="certCode" ref="certCode">
                      <el-input v-model="decLicense.certCode" :disabled="controller.isDisabled"
                        @focus="tipsFillMessage('certCode')"
                        @keyup.enter.native="saveDecLic"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 随附单证 结束 -->
          <div class="dec-div">
            <el-form ref="datas" :model="decHead"  label-width="100px" size="mini">
              <el-row >
                  <el-col :span="24">
                    <el-form-item label="关联报关单">
                      <el-input v-model="decHead.relId" @focus="tipsFillMessage('relId')" :disabled="controller.isDisabled" :maxlength="18"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="关联备案">
                      <el-input v-model="decHead.relManno" @focus="tipsFillMessage('relManno')" :disabled="controller.isDisabled" :maxlength="12"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="保税/监管场地">
                      <el-input v-model="decHead.bonNo"  @focus="tipsFillMessage('bonNo')" :disabled="controller.isDisabled" :maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="场地代码">
                      <el-input v-model="decHead.cusFie" @focus="tipsFillMessage('cusFie')" :disabled="controller.isDisabled" :maxlength="255"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-form>
          </div>
        </el-aside>
        <div class='bottomDiv' v-show="tipsNoteShow"><span>{{tipsNote}}</span></div>
      </el-container>
      <!-- 弹出框 其他包装信息 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑其他包装信息"
        :visible.sync="otherPacksVisible"
        @open="otherPacksShow"
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
      <!-- -->
      <el-dialog :modal-append-to-body='false'
        title="其他事项确认"
        :visible.sync="otherPriceFactorVisible"
        width="500px">
        <div class="border">
          <el-form label-width="240px" size='mini' label-position="right" :model="otherPriceFactor">
            <el-row>
              <el-col :span="24">
                <el-form-item label="特殊关系确认">
                  <el-select placeholder="" v-model="otherPriceFactor.promiseItem1"
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
                  <el-select placeholder="" v-model="otherPriceFactor.promiseItem2"
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
                  <el-select placeholder="" v-model="otherPriceFactor.promiseItem3"
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
        width="500px">
        <el-checkbox-group v-model="checkList" class="border-margin">
          <el-checkbox label="税单无纸化"></el-checkbox>
          <el-checkbox label="自主报税"></el-checkbox>
          <el-checkbox label="自报自缴"></el-checkbox>
          <el-checkbox label="担保验放"></el-checkbox>
          <el-checkbox label="水运中转" v-show="controller.iEFlag == 'E'"></el-checkbox>
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
        width="50%">
        <div class="border">
          <el-form label-width="120px" :model="userForm" size="mini" label-position="right">
            <el-row  >
              <el-col :span="12">
                <el-form-item label="使用单位联系人">
                  <el-input v-model="userForm.useOrgpersonCode" :maxlength="12"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="使用单位联系电话">
                  <el-input v-model="userForm.useOrgpersonTel" :maxlength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-row>
            <el-button icon="fa fa-plus" @click="AddDecUser" class="secondButton" size="mini" :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-sign-in" @click="saveDecUser" class="secondButton" size="mini" :disabled="controller.isDisabled">保存</el-button>
          </el-row>
        </div>
        <el-table  ref="userTable" :data="decHead.decDecUsers"
          highlight-current-row border size='mini'
          @selection-change="decUserchangeFun"
          @row-click="backDecUserInfo"
          max-height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="useOrgpersonCode" label="使用单位联系人" min-width="100"></el-table-column>
          <el-table-column  property="useOrgpersonTel" label="使用单位联系电话" min-width="100"></el-table-column>
        </el-table>
      </el-dialog>
      <!--使用人 弹出框 结束-->
      <!-- 企业资质 弹出框 开始-->
      <el-dialog :modal-append-to-body='false'
        title="编辑企业资质信息"
        :visible.sync="entQuaVisible"
        width="50%">
        <div class="border">
          <el-form label-width="120px" :model="copLimitsForm" size="mini" label-position="right">
            <el-row  >
              <el-col :span="12">
                <el-form-item label="企业资质类别">
                  <el-select placeholder="" v-model="copLimitsForm.entQualiftypeCode"
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
                  <el-input v-model="copLimitsForm.entQualifNo" @keyup.enter.native="savedEntQua"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-row class="border-bottom">
            <el-button icon="fa fa-plus" @click="AddEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-sign-in" @click="savedEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">保存</el-button>
          </el-row>
        </div>
        <el-table  ref="entQuaTable" :data="decHead.decCopLimits"
          highlight-current-row border size='mini'
          @selection-change="copLimitschangeFun"
          @row-click="backCopLimitsInfo"
          max-height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="entQualiftypeCode" label="企业资质类别代码" min-width="100"></el-table-column>
          <el-table-column  property="entQualiftypeName" label="企业资质类别名称" min-width="100"></el-table-column>
          <el-table-column  property="entQualifNo" label="企业资质编号" min-width="100"></el-table-column>
        </el-table>
      </el-dialog>
      <!--使用人 弹出框 结束-->
      <!--业务事项 弹出框 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="特殊业务标识"
        :visible.sync="specialBusiVisible"
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
      <!--业务事项 弹出框 结束-->
      <!-- 弹出框 检验检疫编码列表 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="检验检疫编码列表"
        :visible.sync="encodeTableVisible"
        @opened = 'openencodeListAfter'
        width="640px">
        <el-table  ref="encodeTable" :data="encodeTableList"
        highlight-current-row border size='mini'
          @selection-change="encodeTableChanged"
          @keyup.native='updownEncodeTableSelect'
            max-height="300" style="width: 100%">
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
        width="540px">
        <div class="border">
          <el-form label-width="100px"
            @keyup.enter.native="switchFoucsByEnter"
            size="mini" label-position="right" :data="goodsSpecForm">
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
                    placeholder="">
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
                    placeholder="">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if = "controller.iEFlag == 'I'">
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
                    <el-input v-model="goodsSpecForm.mnufctrRegno" enter='no' @keyup.enter.native="saveGoodsSpec"></el-input>
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
        ref = 'productListRef'
        @opened = 'openProductListAfter'
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
                <el-radio v-model="productListRadio"  @keyup.enter.native="saveProductList"  :label="scope.$index">&nbsp;</el-radio>
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
        width="80%">
        <div class="border">
          <el-form label-width="100px" :model="filingInfoForm"
          @keyup.enter.native="switchFoucsByEnter"
          size="mini" label-position="right" ref="licRuleForm" :rules="licRuleForm">
            <el-row >
              <el-col :span="12">
                <el-form-item label="许可证类别" :class="{ 'require-color': controller.requireColor }"  prop="licTypeCode"  ref="licTypeCode">
                <el-select placeholder="" v-model="filingInfoForm.licTypeCode"
                  @focus="tipsFillMessage('', 'saasLicType1','SAAS_LIC_TYPE')"
                  remote  default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasLicType1')"
                  filterable clearable
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
              <el-col :span="12">
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
                  <el-input v-model="filingInfoForm.licWrtofQty" :maxlength="20" enter = 'no' @keyup.enter.native ='savefilingInfo'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="核销数量单位"  prop="licWrtofQtyUnit" ref="licWrtofQtyUnit">
                  <el-select placeholder="" v-model="filingInfoForm.licWrtofQtyUnit"
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
        <div >
          <el-row>
            <el-button icon="fa fa-plus" @click="AddfilingInfo" class='secondButton' :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-sign-in" @click="savefilingInfo" class='secondButton'  :disabled="controller.isDisabled">保存</el-button>
            <el-button  @click="openLicVIN" class='secondButton'>许可证VIN信息</el-button>
          </el-row>
        </div>
        <el-table  ref="filingInfoTable" :data="decList.decGoodsLimits"
          highlight-current-row border size='mini'
          @selection-change="filingInfoChangeFun"
          @row-click="backFilingInfo"
          height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column  property="licTypeCode" label="许可证类别代码" min-width="100"></el-table-column>
          <el-table-column  property="licTypeCodeValue" label="许可证类别名称" min-width="100"></el-table-column>
          <el-table-column  property="licenceNo" label="许可证编号" min-width="100"></el-table-column>
          <el-table-column  property="licWrtofDetailno" label="核销货物序号" min-width="100"></el-table-column>
          <el-table-column  property="licWrtofQty" label="核销数量" min-width="100"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 弹出框 产品许可证/审批/备案信息 结束 -->
      <!-- 弹出框 许可证VIN  开始 -->
      <el-dialog :modal-append-to-body='false'
        title="编辑许可证VIN"
        :visible.sync="licVINVisible"
        :before-close="licVINClose"
        width="70%">
        <div class="border">
            <el-form label-width="120px" :model="licVINForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="许可证类别" disabled>
                    <el-select placeholder="" v-model="licVINForm.licTypeCode"  disabled
                      @focus="tipsFillMessage('', 'saasLicType2','SAAS_LIC_TYPE')"
                      remote  default-first-option
                      :remote-method="checkParamsList"
                      @clear="clearSelct('saasLicType2')"
                      ref="licTypeCode" dataRef='licTypeCode'
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
                <el-col :span="12">
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
                  <el-form-item label="提/运单日期">
                    <el-date-picker
                      v-model="licVINForm.billLaddate"
                      type="date"
                      :editable='false'
                      style="width:100%"
                      value-format="yyyy-MM-dd"
                      placeholder="">
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
                <el-col :span="12">
                  <el-form-item label="发动机号或电机号" >
                    <el-input v-model="licVINForm.motorNo" :maxlength="100"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
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
        <div>
          <el-row>
            <el-button icon="fa fa-plus" @click="AddlicVIN" class='secondButton' :disabled="controller.isDisabled">新增</el-button>
            <el-button icon="fa fa-save" @click="savelicVIN" class='secondButton' :disabled="controller.isDisabled">保存</el-button>
          </el-row>
        </div>
        <el-table  ref="licVINTable" :data="filingInfoForm.decGoodsLimitvins"
          highlight-current-row border size='mini'
          @selection-change="licVINChangeFun"
          @row-click="backLicVINInfo"
          height="300" style="width: 100%">
          <el-table-column  type="selection" min-width="50"></el-table-column>
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
        width="540px">
        <div class="border">
          <el-form label-width="100px" size="mini" label-position="right" :data="decList" @keyup.enter.native="switchFoucsByEnter">
            <el-row >
              <el-col :span="24">
                <el-form-item label="非危险化学品">
                <el-select placeholder="" v-model="decList.noDangFlag"
                  @focus="tipsFillMessage('', 'commomPara3','COMMON_PARA')"
                    filterable clearable remote default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('commomPara3')"
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
                  <el-input v-model="decList.unCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="危险货物名称">
                  <el-input v-model="decList.dangName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="危包类别">
                  <el-select placeholder="" clearable   v-model="decList.dangPackType" style="width:100%"
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
                  <el-input v-model="decList.dangPackSpec" enter = 'no'  @keyup.enter.native="sureDangerGoods"></el-input>
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
      <!--修改单价总价 弹出框 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="报关修改单价/总价？"
        :visible.sync="modifyPriceVisible"
        width="500px">
        <div class= 'priceDiv'>
          <el-button class="layer-btn" @click="modifyPrice('1')">修改单价</el-button>
          <el-button class="layer-btn" @click="modifyPrice('2')">修改总价</el-button>
        </div>
      </el-dialog>
      <!--修改单价总价 弹出框 结束-->
      <!-- 弹出框 商品规范申报-商品申报要素 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="商品规范申报-商品申报要素"
        :visible.sync="elementVisible"
        width="640px">
        <decelement-view :datas="decElementPara" @submitdatas="backDecListSpace" @closedecele="cancleElement" v-if="elementVisible"></decelement-view>
      </el-dialog>
      <!-- 弹出框 商品规范申报-商品申报要素 结束 -->
      <!-- 弹出框 备注信息 开始 -->
      <dec-note :initParams="initNote" @backDatas="receptionNoteData"  v-if="noteCompnentVisible"></dec-note>
      <!-- 弹出框 备注信息 结束 -->
    </div>
  </section>
</template>

<script>
import util from '@/common/util.js'
import decUtil from './decPage/common/decUtil'
import decNote from './component/decNote'
import decelementView from './component/decelement.vue'
export default {
  components: {
    decNote,
    decelementView
  },
  data () {
    return {
      zoom: 1,
      asideWidth: 20,
      codeTsChange: false,
      decHead: {
        preEntryId: '', // 预录入编号
        bossId: '', // 关联编号(台账编号)
        clientSeqno: '', // 客户端报关单编号
        seqNo: '', // 统一编号
        entryId: '', // 海关编号
        agentCode: '', // 申报单位海关代码
        agentCodeScc: '', // 申报单位信用代码
        agentName: '', // 申报单位名称
        billNo: '', // 提单号
        blno: '', // B/L号提货单号
        bonNo: '', // 保税/监管场地
        chkBond: '', // 自主报税
        chkPayment: '', // 自报自缴
        chkSurety: '', // 担保验放
        chkTax: '', // 税单无纸化
        chkOther: '', // 水运中转
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
        effective: '2', //
        isdefault: 'N'
      }, // 报关单表头
      controller: {
        operationType: this.$route.meta.operationType, // 记录操作类型  详情 新增  修改
        iEFlag: '', // 记录是进口页面还是出口页面 import export
        pid: this.$route.meta.operationType !== 'add' ? this.$route.params.pid : '', // 报关单id
        isDisabled: this.$route.meta.operationType === 'look', // 判断 input button 禁用
        requireColor: true, // 显示必填的颜色
        otherCurrDisabled: false, // 杂费用币制
        feeMarkDisabled: false, // 运费币制
        feeRateDisabled: false, // 运费币制
        feeCurrDisabled: false, // 运费币制
        insurMarkDisabled: false, // 保费币制
        insurRateDisabled: false, // 保费币制
        insurCurrDisabled: false, // 保费币制
        qty2Disabled: true, // 第二法定数量
        contrItemDisabled: true, // 控制 备案序号
        accDocDisabled: true // 控制 随附单据 按钮的字段
      },
      tableList: [], // 报关单表体列表
      checkedTableList: [], // 报关单表体列表 被选中的数据
      decList: {
        decListPid: '', // 表体主键
        decPid: '', // 报关单主键
        ciqName: '', // 检验检疫名称
        codeTs: '', // 商品编码
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
      entQuaList: [], // 企业资质
      checkedEntQuaList: [], // 被选中的企业资质
      specialBusiList: [], // 特殊业务标识
      specialBusiVisible: false, // 特殊业务标识 显示隐藏控制字段
      encodeTableVisible: false, // 检验检疫编码列表 显示隐藏控制字段
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
      licVINVisible: false, // 许可证VIN 显示隐藏控制字段
      checkedLicVINVList: [], // 许可证VIN 列表 被选中
      dangerGoodsVisible: false, // 危险品货物 显示隐藏控制字段
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
      tipsNote: '',
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
        'settingsName': '^.{1,100}$|^$', // 申报地海关
        'customMaster': '^\\d{4}$|^$', // 申报地海关
        'iEPort': '^\\d{4}$|^$', // 进境关别
        'manualNo': '^[0-9A-Za-z]{12}$|^$', // 备案号
        'iEDate': '^20[0-9]{2}[0-1][0-9][0-3][0-9]$|^$', // 进出口日期
        'licenseNo': '^[0-9a-zA-Z]{2}-[0-9a-zA-Z]{2}-[0-9a-zA-Z]{1,14}$|^$', // 许可证号
        'tradeCoScc': '^[0-9a-zA-Z]{18}$|^$', // 境内收发货人 18位社会信用代码
        'tradeCode': '^[0-9a-zA-Z]{10}$|^$', // 境内收发货人 10位海关编码
        // 'consigneeCode': '^[0-9a-zA-Z]{10}$|^$', // 境内收发货人 10位检验检疫编码
        'tradeName': '^.{1,70}$|^$', // 境内收发货人 企业名称(中文)
        'overseasConsignorEname': '^.{1,100}$|^$', // 企业名称(外文)
        'ownerCodeScc': '^[0-9a-zA-Z]{18}$|(NO)|^$', // 消费生产使用/生产销售单位 18位社会信用代码
        'ownerCode': '^[0-9a-zA-Z]{9,10}$|(NO)|^$', // 消费生产使用/生产销售单位 10位海关编码
        // 'ownerCiqCode': '^[0-9a-zA-Z]{10}$|(NO)|^$', // 消费生产使用/生产销售单位 10位检验检疫编码
        'ownerName': '^.{1,70}$|^$', // 消费生产使用/生产销售单位 企业名称
        'agentCodeScc': '^[0-9a-zA-Z]{18}$|^$', // 申报单位 18位社会信用代码
        'agentCode': '^[0-9a-zA-Z]{10}$|^$', // 申报单位 10位海关编码
        // 'declRegNo': '^[0-9a-zA-Z]{10}$|^$', // 申报单位 10位检验检疫编码
        'agentName': '^.{1,70}$|^$', // 申报单位 企业名称
        'trafMode': '^[0-9a-zA-Z]{1}$|^$', // 运输方式
        'tradeMode': '^[0-9a-zA-Z]{4}$|^$', // 监管方式
        'tradeCountry': '^[0-9a-zA-Z]{3}$|^$', // 启运国(地区)
        'distinatePort': '^[0-9a-zA-Z]{6}$|^$', // 经停港/指运港代码
        'transMode': '^.{1,2}$|^$', // 成交方式
        'feeRate': '^\\d{1,12}(\\.\\d{1,5})?$|^$', // 运费 费率、单价、总价
        'insurRate': '^\\d{1,12}(\\.\\d{1,5})?$|^$', // 保费 费率、单价、总价
        'otherRate': '^\\d{1,12}(\\.\\d{1,5})?$|^$', // 杂费 费率、单价、总价
        'packNo': '^\\d{1,9}$|^$', // 件数
        'wrapType': '^\\d{1,2}$|^$', // 包装种类
        'grossWt': '^[1-9]{1}\\d{0,13}(\\.\\d{1,4})?$|^$', // 毛重(KG)
        'netWt': '^[1-9]{1}\\d{0,13}(\\.\\d{1,4})?$|^$', // 净重(KG)
        'tradeAreaCode': '^[0-9a-zA-Z]{3}$|^$', // 贸易国别(地区)
        'entyPortCode': '^[0-9a-zA-Z]{6}$|^$', // 入境口岸
        'goodSplace': '^.{1,100}$|^$', // 货物存放地点
        'despPortCode': '^[0-9a-zA-Z]{6}$|^$', // 启运港/离境口岸代码
        'entryType': '^[0-9a-zA-Z]{1}$|^$', // 报关单类型
        'markNo': '^.{1,400}$|^$', // 标记唛码
        'orgCode': '^[0-9a-zA-Z]{6}$|^$', // 检验检疫受理机关
        'vsaOrgCode': '^[0-9a-zA-Z]{6}$|^$', // 领证机关
        'inspOrgCode': '^[0-9a-zA-Z]{6}$|^$', // 口岸检验检疫机关
        'despDate': '^\\d{8}$|^$', // 启运日期
        'purpOrgCode': '^[0-9a-zA-Z]{6}$|^$', // 目的地检验检疫机关
        // 表体
        'codeTs': '^.{1,10}$|^$', //  商品编码
        'gName': '^.{1,256}$|^$', //  商品名称
        'gQty': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  成交数量
        'declPrice': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  单价
        'declTotal': '^\\d{1,15}(\\.\\d{1,2})?$|^$', //  总价
        'qty1': '^\\d{1,14}(\\.\\d{1,5})?$|^$', //  法定第一数量
        'exgVersion': '^[1-9]{1}\\d{1,7}$|^$', //  加工成品单耗版本号
        'origPlaceCode': '^[0-9a-zA-Z]{1,6}$|^$', // 原产地区
        'districtCode': '^[0-9a-zA-Z]{1,6}$|^$', // 境内目的地/货源地五位代码
        'destCode': '^[0-9a-zA-Z]{1,6}$|^$', // 目的地/产地代码（6位）或名称
        'dutyMode': '^[0-9a-zA-Z]{1,3}$|^$', // 征免方式
        'purpose': '^[0-9a-zA-Z]{1,3}$|^$', // 用途
        // 集装箱
        'containerNo': '^[0-9a-zA-Z]{1,11}$|^$', // 集装箱号
        'containerSize': '^[0-9a-zA-Z]{1,3}$|^$', // 集装规格
        'containerWeight': '^[1-9]{1,13}(.\\d{1,4})?$|^$', // 自重
        'goodsNo': '^.{1,255}$', // 商品项号关系
        // 随附单证
        'docuCode': '^[0-9a-zA-Z]{1,6}$|^$', // 随附单证代码
        'certCode': '^.{1,32}$', // 随附单证编号
        // 产品资质
        'licTypeCode': '^[0-9a-zA-Z]{1,6}$|^$', // 许可证类别
        'licenceNo': '^.{1,40}$', // 许可证编号
        'licWrtofQty': '^\\d{1,14}(\\.\\d{1,5})?$|^$' // 核销数量
      },
      headRuleForm: {
        settingsName: [ // 模板名称
          {validator: this.checkValid, message: '输入模板名称', trigger: 'blur'}
        ],
        licenseNo: [ // 许可证号
          {validator: this.checkValid, message: '请输入正确格式的许可证号', trigger: 'blur'}
        ],
        customMaster: [ // 申报地海关
          {validator: this.checkValid, message: '输入4位代码或名称', trigger: 'blur'}
        ],
        iEPort: [ // 进境关别
          {validator: this.checkValid, message: '输入4位代码或名称', trigger: 'blur'}
        ],
        manualNo: [ // 备案号
          {validator: this.checkValid, message: '请输入12位数字或字母', trigger: 'blur'}
        ],
        iEDate: [ // 进境关别
          {validator: this.checkValid, message: '输入正确的日期', trigger: 'blur'}
        ],
        tradeCoScc: [ // 境内收发货人 18位社会信用代码
          {validator: this.checkValid, message: '输入18位信用代码', trigger: 'blur'}
        ],
        tradeCode: [ // 境内收发货人 10位海关编码
          {validator: this.checkValid, message: '输入10位海关编码', trigger: 'blur'}
        ],
        consigneeCode: [ // 境内收发货人 10位检验检疫编码
          {validator: this.checkValid, message: '输入10位检验检疫编码', trigger: 'blur'}
        ],
        tradeName: [ // 境内收发货人 企业名称(中文)
          {validator: this.checkValid, message: '输入30个字以内海关注册单位名称（中文）', trigger: 'blur'}
        ],
        overseasConsignorEname: [ // 企业名称(外文)
          {validator: this.checkValid, message: '请输入企业名称', trigger: 'blur'}
        ],
        ownerCodeScc: [ // 消费生产使用/生产销售单位 18位社会信用代码
          {validator: this.checkValid, message: '输入18位信用代码', trigger: 'blur'}
        ],
        ownerCode: [ // 消费生产使用/生产销售单位 10位海关编码
          {validator: this.checkValid, message: '输入10位海关编码', trigger: 'blur'}
        ],
        ownerCiqCode: [ // 消费生产使用/生产销售单位 10位检验检疫编码
          {validator: this.checkValid, message: '输入10位检验检疫编码', trigger: 'blur'}
        ],
        ownerName: [ // 消费生产使用/生产销售单位 企业名称
          {validator: this.checkValid, message: '输入企业名称', trigger: 'blur'}
        ],
        agentCodeScc: [ // 申报单位 18位社会信用代码
          {validator: this.checkValid, message: '输入18位社会信用代码', trigger: 'blur'}
        ],
        agentCode: [ // 申报单位 10位海关编码
          {validator: this.checkValid, message: '输入10位海关编码', trigger: 'blur'}
        ],
        declRegNo: [ // 申报单位 10位检验检疫编码
          {validator: this.checkValid, message: '输入10位检验检疫编码', trigger: 'blur'}
        ],
        agentName: [ // 申报单位 企业名称
          {validator: this.checkValid, message: '输入企业名称', trigger: 'blur'}
        ],
        trafMode: [ // 运输方式
          {validator: this.checkValid, message: '输入运输代码（1位）或名称', trigger: 'blur'}
        ],
        tradeMode: [ // 监管方式
          {validator: this.checkValid, message: '输入贸易代码4位', trigger: 'blur'}
        ],
        tradeCountry: [ // 输入启运国/运抵国
          {validator: this.checkValid, message: '输入启运国/运抵国代码', trigger: 'blur'}
        ],
        distinatePort: [ // 经停港/指运港代码
          {validator: this.checkValid, message: '输入经停港/指运港代码', trigger: 'blur'}
        ],
        transMode: [ // 成交方式
          {validator: this.checkValid, message: '输入成交方式代码', trigger: 'blur'}
        ],
        feeRate: [ // 运费 费率、单价、总价
          {validator: this.checkValid, message: '输入正确的格式', trigger: 'blur'}
        ],
        insurRate: [ // 保费 费率、单价、总价
          {validator: this.checkValid, message: '输入正确的格式', trigger: 'blur'}
        ],
        otherRate: [ // 杂费 费率、单价、总价
          {validator: this.checkValid, message: '输入正确的格式', trigger: 'blur'}
        ],
        packNo: [ // 件数
          {validator: this.checkValid, message: '输入不过超9位的正整数', trigger: 'blur'}
        ],
        wrapType: [ // 包装种类
          {validator: this.checkValid, message: '输入包装种类', trigger: 'blur'}
        ],
        grossWt: [ // 毛重(KG)
          {validator: this.checkValid, message: '输入整数不超过14位小数不超过4位且不小于1的数', trigger: 'blur'}
        ],
        netWt: [ // 净重(KG)
          {validator: this.checkValid, message: '输入整数不超过14位小数不超过4位且不小于1的数', trigger: 'blur'}
        ],
        tradeAreaCode: [ // 贸易国别(地区)
          {validator: this.checkValid, message: '输入贸易国别（地区）', trigger: 'blur'}
        ],
        entyPortCode: [ // 入境口岸
          {validator: this.checkValid, message: '输入入境口岸代码', trigger: 'blur'}
        ],
        goodSplace: [ // 货物存放地点
          {validator: this.checkValid, message: '输入货物存放地点', trigger: 'blur'}
        ],
        despPortCode: [ // 启运港/离境口岸代码
          {validator: this.checkValid, message: '输入启运港/离境口岸代码', trigger: 'blur'}
        ],
        entryType: [ // 报关单类型
          {validator: this.checkValid, message: '输入报关单类型', trigger: 'blur'}
        ],
        markNo: [ // 标记唛码
          {validator: this.checkValid, message: '输入标记唛码', trigger: 'blur'}
        ],
        orgCode: [ // 检验检疫受理机关
          {validator: this.checkValid, message: '输入检验检疫受理机关', trigger: 'blur'}
        ],
        vsaOrgCode: [ // 领证机关
          {validator: this.checkValid, message: '输入领证机关', trigger: 'blur'}
        ],
        inspOrgCode: [ // 口岸检验检疫机关
          {validator: this.checkValid, message: '输入口岸检验检疫机关', trigger: 'blur'}
        ],
        despDate: [ // 启运日期
          {validator: this.checkValid, message: '输入启运日期', trigger: 'blur'}
        ],
        purpOrgCode: [ // 目的地检验检疫机关
          {validator: this.checkValid, message: '输入目的地检验检疫机关', trigger: 'blur'}
        ]
      },
      bodyRuleForm: {
        codeTs: [ //  商品编码
          {validator: this.checkValid, message: '商品编号不能为空', trigger: 'blur'}
        ],
        gName: [ //  商品名称
          {validator: this.checkValid, message: '商品名称不能为空', trigger: 'blur'}
        ],
        gQty: [ //  成交数量
          {validator: this.checkValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
        ],
        declPrice: [ //  单价
          {validator: this.checkValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
        ],
        declTotal: [ //  总价
          {validator: this.checkValid, message: '输入整数最多15位，小数最多2位的非负数', trigger: 'blur'}
        ],
        qty1: [ //  法定第一数量
          {validator: this.checkValid, message: '输入整数最多14位，小数最多5位的非负数', trigger: 'blur'}
        ],
        exgVersion: [ //  加工成品单耗版本号
          {validator: this.checkValid, message: '输入最多8位的正整数', trigger: 'blur'}
        ],
        origPlaceCode: [ //  原产地区
          {validator: this.checkValid, message: '原产地区不能为空', trigger: 'blur'}
        ],
        districtCode: [ // 境内目的地/货源地
          {validator: this.checkValid, message: '输入境内目的地/货源地', trigger: 'blur'}
        ],
        destCode: [ // 目的地/产地
          {validator: this.checkValid, message: '输入目的地/产地', trigger: 'blur'}
        ],
        dutyMode: [ //  征免方式
          {validator: this.checkValid, message: '输入征免方式', trigger: 'blur'}
        ],
        purpose: [ //  用途
          {validator: this.checkValid, message: '输入用途', trigger: 'blur'}
        ]
      },
      containerRuleForm: {
        containerNo: [ // 集装箱号
          {validator: this.checkValid, message: '必填且最大长度为11位', trigger: 'blur'}
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
        ],
        certCode: [ // 进境关别
          {validator: this.checkValid, message: '输入随附单证编号', trigger: 'blur'}
        ]
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
        'ownerCode': '消费使用单位海关编码：消费使用单位在海关备案的10位代码',
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
        'codeTs': '商品编号：该项货物对应的商品编码',
        'gName': '商品名称：输入商品名称',
        'gModel': '规格型号：输入商品的规格型号',
        'gQty': '成交数量：该项商品的成交数量，与成交单位相对应，即申报数量',
        'gUnit': '成交计量单位：该项商品的成交时的实际计量单位',
        'declPrice': '单价：该项商品的成交时的商品单位价格，即申报单价',
        'declTotal': '总价：总价=单价*成交数量',

        'tradeCurr': '币制：请输入币制的代码（3位）或名称',
        'qty1': '法定第一数量：该项商品的法定成交数量，与法定单位对应',
        'unit1': '法定第一计量单位：该项商品的商品编码对应的海关统计第一单位，由海关决定',
        'exgVersion': '加工成品单耗版本号：所加工成品对应的版本号',
        'exgNo': '货号：加工料件/成品货号，即企业内部的货物编号',
        'destinationCountry': '最终目的国(地区)：输入最终目的国(地区)代码（3位）或名称',
        'qty2': '法定第二数量：与第二单位对应的第二成交数量',
        'unit2': '法定第二计量单位：该项商品的商品编码对应的海关统计第二单位，由海关决定',
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
        params: ''
      },
      noteCompnentVisible: false, // 备注
      initNote: {} // 备注的初始化参数
    }
  },
  created () {
    let width = screen.availWidth
    if (width > 1280) {
      this.zoom = 1
    } else if (width > 1024) {
      this.zoom = 0.95
    } else if (width > 800) {
      this.zoom = 0.8
    } else {
      this.zoom = 0.7
    }
    let operation = this.$route.meta.operationType
    if (operation === 'look') {
      this.controller.requireColor = false
    }
    window.localStorage.setItem('FEE_RATE', JSON.stringify([{codeField: '1', nameField: '率'}, {codeField: '2', nameField: '单价'}, {codeField: '3', nameField: '总价'}]))
    window.localStorage.setItem('FEE_RATE_OHTER', JSON.stringify([{codeField: '1', nameField: '率'}, {codeField: '3', nameField: '总价'}]))
    window.localStorage.setItem('DEC_TYPE', JSON.stringify([{nameField: '有纸报关', codeField: '0'}, {nameField: '无纸带清单报关', codeField: 'D'}, {nameField: '有纸带清单报关', codeField: 'L'}, {nameField: '通关无纸化', codeField: 'M'}, {nameField: '无纸报关', codeField: 'W'}]))
    window.localStorage.setItem('BILL_TYPE', JSON.stringify([{nameField: '一般备案清单', codeField: '1'}, {nameField: '先进区、后报关', codeField: '2'}, {nameField: '3-集报备案清单', codeField: '3'}, {nameField: '两单一审备案清单', codeField: '4'}]))
    window.localStorage.setItem('COMMON_PARA', JSON.stringify([{codeField: '0', nameField: '否'}, {codeField: '1', nameField: '是'}]))
    window.localStorage.setItem('DANGER_LEVEL', JSON.stringify([{codeField: '1', nameField: '一类'}, {codeField: '2', nameField: '二类'}, {codeField: '3', nameField: '三类'}]))
    window.localStorage.setItem('PRICE_FACTOR', JSON.stringify([{codeField: '0', nameField: '否'}, {codeField: '1', nameField: '是'}, {codeField: '9', nameField: '空'}]))
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
  },
  watch: {
    licenselist: 'resetlic', // 计算随附单证
    tableDecContainerlist: 'computedConta', // 计算集装箱
    'decHead.ownerCode': 'backFillDistrictCode'
  },
  mounted () {
    let operation = this.$route.meta.operationType
    this.controller.iEFlag = (this.$route.meta.iEFlag === 'import' ? 'I' : 'E')
    if (operation === 'add') {
      this.decHead.iEFlag = this.controller.iEFlag
      if (this.controller.iEFlag === 'I') {
        this.decHead.iEDate = this.getTodayDate()
      }
      // 获取当前登陆信息
      this.initHeadData()
      this.$nextTick(_ => {
        this.$refs['settingsName'].focus()
      })
    } else if (operation === 'edit') {
      this.getDecDetail(this.$route.params.pid)
    }
  },
  methods: {
    // 校验
    checkValid (rule, value, callback) {
      let name = rule.field
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
    // 新增的时候 需要初始化申报单位的数据
    initHeadData () {
      let logInfo = this.$store.state.userLoginInfo
      this.decHead.agentCode = logInfo.tradeCode
      this.decHead.agentCodeScc = logInfo.sccCode
      this.decHead.agentName = logInfo.cusCorpName
      this.decHead.declRegNo = logInfo.ciqCode
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
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
      this.selectObj = {
        obj: obj,
        params: params
      }
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
    // 获取公共字典list
    getDecDetail (pid) {
      this.$post({
        url: 'API@/dec-common/dec/initSetting/getDecInitDetail',
        data: {
          initHeadId: pid
        },
        success: (res) => {
          if (res.result != null) {
            this.decHead = res.result.decHeadVO // 表头
            this.decHead.netWt = this.removeZero(this.decHead.netWt)
            this.decHead.grossWt = this.removeZero(this.decHead.grossWt)
            this.decHead.feeRate = this.removeZero(this.decHead.feeRate)
            this.decHead.insurRate = this.removeZero(this.decHead.insurRate)
            this.decHead.otherRate = this.removeZero(this.decHead.otherRate)
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
            // 计算 备注和唛码标记的长度
            this.computLength('1')
            this.computLength('2')
            // 企业资质信息设置
            let list = this.decHead.decCopLimits
            if (list.length > 0) {
              this.showFied.entQualifTypeCodeS = this.decHead.decCopLimits[0].entQualiftypeCode
              this.showFied.entQualifTypeCodeSName = this.decHead.decCopLimits[0].entQualiftypeName
              this.showFied.entQualifTypeGNo = this.decHead.decCopLimits[0].gNo
            }
            // 显示 特殊业务标识
            this.specialBusiChangeCodeName()
            // 给表头select 框 初始化赋值
            this.initSelect(this.headSelect, this.decHead)
          }
        }
      })
    },
    // 格式化数据  去掉小数点后面多余的0
    removeZero (value) {
      if (util.isEmpty(value)) {
        return ''
      } else {
        return parseFloat(value) === 0 ? '' : parseFloat(value)
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
      this.decHead = { // 报关单表头
        preEntryId: '', // 预录入编号
        bossId: '', // 关联编号(台账编号)
        clientSeqno: '', // 客户端报关单编号
        seqNo: '', // 统一编号
        entryId: '', // 海关编号
        agentCode: '', // 申报单位海关代码
        agentCodeScc: '', // 申报单位信用代码
        agentName: '', // 申报单位名称
        billNo: '', // 提单号
        blno: '', // B/L号提货单号
        bonNo: '', // 保税/监管场地
        chkBond: '', // 自主报税
        chkPayment: '', // 自报自缴
        chkSurety: '', // 担保验放
        chkTax: '', // 税单无纸化
        chkOther: '', // 水运中转
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
        decMarkLobs: [], // 标记号码
        decRequestCerts: [], // 所需单证
        decSign: {}, // 标签签名
        declRegNo: '', // 申报单位10位检验检疫编码
        despDate: '', // 启运日期
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
        effective: '2',
        isdefault: 'N'
      }
      this.decList = {
        decListPid: '', // 表体主键
        decPid: '', // 报关单主键
        ciqName: '', // 检验检疫名称
        codeTs: '', // 商品编码
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
        gNo: '' // 序号
      }
      this.controller.pid = ''
      if (this.controller.iEFlag === 'I') {
        this.decHead.iEDate = this.getTodayDate()
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
      this.initHeadData()
    },
    // 保存报关单
    saveDecHead () {
      // 校验
      this.$refs['headRuleForm'].validate((valid) => {
        if (valid === false) {
          this.isShowText1 = 'fa fa-angle-double-down'
          this.isShow1 = true
          return false
        } else {
          let param = {
            decContainersVO: this.tableDecContainerlist,
            decHeadVO: this.decHead,
            decLicensesVO: this.licenselist,
            decListVO: this.tableList
          }
          this.$post({
            url: 'API@/dec-common/dec/initSetting/saveDecInit',
            data: param,
            success: (res) => {
              this.messageTips(res.message, 'success')
              if (!this.decHead.decPid) {
                this.decHead.decPid = res.result.decPid
                this.controller.pid = res.result.decPid
                let routeName
                let tabName
                if (this.controller.iEFlag === 'I') {
                  routeName = 'iDecTemplateEdit'
                  tabName = '进口报关单模板'
                } else {
                  routeName = 'eDecTemplateEdit'
                  tabName = '出口报关单模板'
                }
                // 关闭新增界面
                this.$store.dispatch('CloseTab', this.$store.state.TabsStore.currentTab.tabId)
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
            }
          })
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
      let operation = this.$route.meta.operationType
      if (operation === 'look' || operation === 'edit') {
        this.getDecDetail(this.$route.params.pid)
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
      this.otherPriceFactorVisible = false
    },
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
      }
    },
    computLength (value) {
      if (value === '1') { // 备注
        this.showFied.noteLenght = util.decGetlen(this.decHead.noteS)
      }
      if (value === '2') { // 标记唛码
        this.showFied.markNoLength = util.decGetlen(this.decHead.markNo)
      }
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
      this.decHead.decDecUsers = []
      this.userForm.gNo = '1'
      this.decHead.decDecUsers.push(util.simpleClone(this.userForm))
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
    },
    // 重新赋值
    setGoodsLimit () {
      if (this.decHead.decCopLimits.length > 0) {
        this.showFied.entQualifTypeCodeS = this.decHead.decCopLimits[0].entQualiftypeCode
        this.showFied.entQualifTypeCodeSName = this.decHead.decCopLimits[0].entQualiftypeName
        this.showFied.entQualifTypeGNo = this.decHead.decCopLimits[0].gNo
      } else {
        this.showFied.entQualifTypeCodeS = ''
        this.showFied.entQualifTypeCodeSName = ''
        this.showFied.entQualifTypeGNo = ''
      }
    },
    // 保存 企业资质
    savedEntQua () {
      this.decHead.decCopLimits = []
      this.copLimitsForm.gNo = '1'
      this.decHead.decCopLimits.push(util.simpleClone(this.copLimitsForm))
      // 重新赋值
      this.setGoodsLimit()
    },
    // 获取 选中的企业资质
    copLimitschangeFun (value) {
      this.checkedEntQuaList = value
    },
    // 反填企业资质信息
    backCopLimitsInfo (row) {
      this.copLimitsForm = util.simpleClone(row)
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
      this.encodeListRadio = 0
    },
    // 打开检验检疫编码表
    openEncodeTableContent () {
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getHSDetail',
        data: {
          'codeTs': this.decList.codeTs
        },
        success: (res) => {
          this.encodeTableList = res.result
          if (!this.encodeTableList || this.encodeTableList.length === 0) {
            this.messageTips('无此商品编码', 'error')
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
      this.encodeListRadio = 0
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
      }
      this.decList.prodBatchNo = this.goodsSpecForm.prodBatchNo
      this.decList.mnufctrRegno = this.goodsSpecForm.mnufctrRegno
      this.goodsSpecVisible = false
    },
    // 商品编码值改变事件
    codeTsChangeF () {
      this.codeTsChange = true
    },
    // 打开 商品编码 弹出框
    openProductList () {
      if (!this.codeTsChange) { // 如果值没有发生变化
        this.$refs['gQty'].$children[1].focus()
        this.$refs['gQty'].$children[1].select()
        return false
      }
      if (this.decList.codeTs.length === 0) {
        return false
      }
      if (this.decList.codeTs.length < 4) {
        this.messageTips('至少输入四位商品编码')
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
          if (!this.productList || this.productList.length === 0) {
            this.messageTips('无此商品编码', 'error')
            this.decList.codeTs = ''
            this.productList = []
          } else {
            this.productListVisible = true
          }
        }
      })
    },
    // 计算总价
    computTotal () {
      let price = this.decList.declPrice
      let num = this.decList.gQty
      if (util.isEmpty(price) || util.isEmpty(num)) { // 判断 数量和单价有没有填
        return false
      } else if (isNaN(price) || isNaN(num)) { // 判断 数量和单价是否填的是 数字
        return false
      } else {
        this.decList.declTotal = this.Mul(price, num, 2)
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
        this.decList.declPrice = this.Div(declTotal, num, 4)
      }
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
        this.decList.controlMa = this.checkedgoods.controlMa.split('').join(',')
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
      if (util.isEmpty(this.checkedgoods.unit2)) {
        this.controller.qty2Disabled = true
      } else {
        this.controller.qty2Disabled = false
      }
      // 初始化下拉框 TODO
      this.initSelect(this.bodySelect, this.decList)
      // 设置 法定第一数量
      if (!util.isEmpty(this.decList.gUnit) && (this.decList.unit1 === this.decList.gUnit)) {
        this.decList.qty1 = this.decList.gQty
      }
      this.productListVisible = false
      this.productListRadio = 0
      this.elementVisible = true
    },
    // 取消选择 商品
    closeProductList () {
      this.productListVisible = false
      this.productListRadio = 0
      this.decList.codeTs = ''
    },
    unit2Change (value) {
      if (util.isEmpty(value)) {
        this.controller.qty2Disabled = true
      } else {
        this.controller.qty2Disabled = false
      }
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
    // 关闭 产品资质  备案信息 弹出框
    filingInfoClose () {
      // 清除input数据
      this.AddfilingInfo()
      this.filingInfoVisible = false
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
    },
    // 保存 产品资质 备案信息
    savefilingInfo () {
      this.savefilingInfoNoRefresh()
    },
    // 保存 产品资质 备案信息 不清除 表单数据
    savefilingInfoNoRefresh () {
      this.$refs['licRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          // 许可证类型 code 转name
          let list = this.saasLicType
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
          this.decList.decGoodsLimits = []
          this.decList.decGoodsLimits.push(util.simpleClone(this.filingInfoForm))
          // 刷新 tableList
          this.saveDecListNoRefresh()
        }
      })
    },
    // 产品资质 备案信息 获取被选中的值
    filingInfoChangeFun (value) {
      this.checkedFilingInfoList = value
    },
    // 反填数据 产品资质 备案信息
    backFilingInfo (row) {
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
    // 关闭许可证VIN 弹窗
    licVINClose () {
      // 清除input 数据
      this.AddlicVIN()
      this.licVINVisible = false
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
    // 保存、修改 许可证VIN
    savelicVIN () {
      this.filingInfoForm.decGoodsLimitvins = []
      this.filingInfoForm.decGoodsLimitvins.push(util.simpleClone(this.licVINForm))
      // 以防 备案信息还没有保存 这里保存一边
      this.savefilingInfoNoRefresh()
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
      this.initSelect(this.dangerSelect, this.decList)
      this.dangerGoodsVisible = true
    },
    // 危险品货物 确定按钮
    sureDangerGoods () {
      this.dangerGoodsVisible = false
    },
    // 重置 报关单表体 填制数据
    refreshDecList () {
      this.decList = {
        decListPid: '', // 表体主键
        decPid: this.controller.pid, // 报关单主键
        ciqName: '', // 检验检疫名称
        codeTs: '', // 商品编码
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
        gName: '', // 商品名称
        gNo: '', // 项号
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
        declGoodsEname: '', // 申报货物名称（外文）
        ciqCode: '' // CIQ代码
      }
      this.showFied.showGoodsAttrValue = ''
      this.showFied.showGoodsSpec = ''
      this.resetDodySelect()
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
    // 反填 报关单表体信息
    backDeccListInfo (row, event, column) {
      this.$refs.decListTable.toggleRowSelection(row, true)
      this.decList = util.simpleClone(row)
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
      // 初始化下拉框
      this.initSelect(this.bodySelect, this.decList)
    },
    // 获取选中的报关单 表体 信息
    decListChange (value) {
      this.checkedTableList = util.simpleClone(value)
    },
    // 点击选择框
    decListSelect (selection, row) {
    },
    // 保存 报关单表体信息
    saveDecList (value) {
      if ((value === '1' && this.isShow2 === false) || value === '2' || util.isEmpty(value)) {
        this.saveDecListNoRefresh()
      }
    },
    // 保存 报关单表体信息 不清空数据
    saveDecListNoRefresh () {
      let flag = false
      this.$refs['bodyRuleForm'].validate((valid) => {
        if (valid === false) {
          flag = false
        } else {
          this.tableList = []
          this.gUnitChangeName(this.decList.gUnit)
          this.tradeCurrChangeName(this.decList.tradeCurr)
          this.originCountryChangeName(this.decList.originCountry)
          this.dutyModeChangeName(this.decList.dutyMode)
          this.destinationCountryChangeName(this.decList.destinationCountry)
          this.tableList.push(util.simpleClone(this.decList))
          flag = true
        }
      })
      return flag
    },
    // 清除 随附单证 新增数据
    refreshDoc () {
      this.decLicense = { // 随附单证数据
        pid: '', // 主键
        decPid: this.controller.pid, // 外键
        certCode: '', // 单证编号
        docuCode: '', // 单证代码
        gNo: '' // 序号
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
    // 保存 随附单证
    saveDecLic () {
      // 校验
      this.$refs['docuRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          this.licenselist = []
          this.licenselist.push(util.simpleClone(this.decLicense))
        }
      })
    },
    // 单击 随附单证 反填 数据
    backDecLicInfo (row) {
      this.decLicense = util.simpleClone(row)
      this.initSelect(this.docuSelect, this.decLicense)
    },
    // 保存 集装箱
    saveDecConta () {
      this.$refs['containerRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          let list = this.saasContainerModel
          // 获取 规格型号名称并赋值
          for (let i in list) {
            if (list[i].codeField === this.decContainer.containerSize) {
              this.decContainer.containerSizeValue = list[i].nameField
            }
          }
          this.tableDecContainerlist = []
          this.tableDecContainerlist.push(util.simpleClone(this.decContainer))
        }
      })
    },
    // 选中反填集装箱信息
    backDecContaInfo (row) {
      this.decContainer = util.simpleClone(row)
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
    // 表体的 规格型号 反填
    backDecListSpace (value) {
      if (this.decElementPara.opeType === 'add') {
        this.decList.gModel = value.specModel
      } else if (this.decElementPara.opeType === 'edit') {
        let index = parseInt(this.checkedTableList.gNo) - 1
        this.tableList[index].gModel = value.specModel
      }
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
    // 保费、运费、杂费的控制逻辑
    feeChange (value, index) {
      if (index === 1) {
        if (value === '1') {
          this.decHead.feeCurr = ''
          this.controller.feeCurrDisabled = true
          this.ruleRegx['feeRate'] = '^\\d{1,2}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.feeRate = [ // 运费 费率、单价、总价
            {validator: this.checkValid, message: '输入0.0001~99的数字', trigger: 'blur'}
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
            {validator: this.checkValid, message: '输入0.0001~99的数字', trigger: 'blur'}
          ]
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
          this.ruleRegx['otherRate'] = '^\\d{1,2}(\\.\\d{1,4})?$|^$'
          this.headRuleForm.otherRate = [ // 运费 费率、单价、总价
            {validator: this.checkValid, message: '输入0.0001~99的数字', trigger: 'blur'}
          ]
        } else {
          this.controller.otherCurrDisabled = false
          this.ruleRegx['otherRate'] = '^\\d{1,12}(\\.\\d{1,4})?$|^$'
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
            this.decHead.trafMode = res.result[0].trafMode
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
        return !v.disabled
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
              this.$refs[ref].blur()
            } else {
              if (!util.isEmpty(e.target.attributes.dataRef)) {
                ref = e.target.attributes.dataRef.nodeValue
              }
            }
            if (ref === 'tradeCoScc' || ref === 'ownerCodeScc') {
              // 如果是十八位信用代码
              secondNext.focus()
              secondNext.select()
            } else if (ref === 'gName') {
              this.$refs['codeTs'].$children[1].focus()
              this.$refs['codeTs'].$children[1].select()
            } else if (ref === 'despPortCode' && this.controller.iEFlag === 'I') { // 进口启运港
              this.openOtherPriceFactor()
            } else if (ref === 'entyPortCode' && this.controller.iEFlag === 'E') {
              this.openOtherPriceFactor()
            } else if (ref === 'markNo' && this.isShow1 === false) { // 标记唛码
              if (this.controller.contrItemDisabled === true) {
                this.$refs['gName'].$children[1].focus()
                this.$refs['gName'].$children[1].select()
              } else {
                this.$refs['contrItem'].$children[1].focus()
                this.$refs['contrItem'].$children[1].select()
              }
            } else {
              next.focus()
              next.select()
            }
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
        this.controller.contrItemDisabled = false
        return false
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getRelatedCurEms',
        data: {
          emsNo: this.decHead.manualNo,
          iEFlag: this.controller.iEFlag
        },
        success: (res) => {
          // 反填表头信息到报关单表头
          let head = res.result
          this.decHead.tradeCode = head.tradeCode
          this.decHead.tradeName = head.tradeName
          this.decHead.tradeCoScc = head.tradeCodeScc
          this.decHead.ownerCode = head.ownerCode
          this.decHead.ownerCodeScc = head.ownerCodeScc
          this.decHead.ownerName = head.ownerName
          if (['B', 'C', 'D', 'H', 'Z'].includes(char)) {
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
          }
          // 放开 商品列表里的备案序号
          this.controller.contrItemDisabled = false
        },
        other: (res) => {
          this.messageTips('备案号:' + this.decHead.manualNo + '不存在', 'error')
          // 放开 商品列表里的备案序号
          this.controller.contrItemDisabled = false
        }
      })
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
          // 初始化下拉框
          this.initSelect(this.bodySelect, this.decList)
          // 如果法定第二计量单位有值则 法定第二数据 可输入
          this.unit2Change(this.decList.unit2)
        }
      })
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
    checkParamsList (query, type = 'select') {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      if (this.selectObj.params === 'SAAS_LIC_TYPE' || this.selectObj.params === 'SAAS_ENT_QUALIF_TYPE') { // 许可证类别
        list = list.filter(item => {
          return item.otherField.toUpperCase().indexOf(this.controller.iEFlag) > -1
        })
      }
      let filterList = []
      let filterList1 = []
      let fitlerParmaTable = ['SAAS_CURR', 'SAAS_WRAP', 'SAAS_TRADE', 'SAAS_CONTAINER_MODEL', 'SAAS_COUNTRY', 'SAAS_PORT_LIN']
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          this[this.selectObj.obj] = list.slice(0, 20)
        })
      } else {
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        if (util.isExistInArray(this.selectObj.params, fitlerParmaTable)) {
          filterList1 = list.filter(item => {
            let str = item.otherField + ' ' + item.extendField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          filterList.push(...filterList1)
          filterList = this.unique(filterList)
        }
        if (type === 'init') {
          this[this.selectObj.obj] = filterList.slice(0, 20)
        } else if (type === 'select') {
          this.$nextTick(() => {
            this[this.selectObj.obj] = filterList.slice(0, 20)
          })
        }
      }
    },
    // 去重
    unique (arr) {
      let x = new Set(arr)
      return [...x]
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
        if (decUtil.Mul(this.decList.gQty, this.decList.declPrice, 2) !== +this.decList.declTotal) {
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
      }
      if (value === '2') {
        // 修改 总价
        this.computTotal()
        this.modifyPriceVisible = false
      }
    },
    // 阻止默认的keydown 触发按钮事件
    prevent (e) {
      e.preventDefault()
      e.stopPropagation()
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
    clearSelct (selecType) {
      this[selecType] = []
    },
    // 查询企业信息
    queryCropInfo (value) {
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
        if (this.decHead.ownerCode.length === 10) {
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
          if (res.code === '0000' && !util.isEmpty(res.result.sccCode)) {
            if (value === 'tradeCoScc' || value === 'tradeName') {
              this.decHead.tradeCoScc = res.result.sccCode
              this.decHead.tradeCode = res.result.regCusCode
              this.decHead.tradeName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              this.showFied.tradeCorpId = res.result.corpId
              // !(util.isEmpty(res.result.regCiqCode)) && (this.decHead.consigneeCode = res.result.regCiqCode)
              this.decHead.consigneeCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
              if (util.isEmpty(this.decHead.ownerCodeScc)) {
                // 自动带出一样的
                this.decHead.ownerCodeScc = res.result.sccCode
                this.decHead.ownerCode = res.result.regCusCode
                this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
                this.decHead.ownerCiqCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
                this.showFied.ownerCorpId = res.result.corpId
                this.backFillDistrictCode()
              }
            } else if (value === 'agentCodeScc' || value === 'agentCode' || value === 'agentName') {
              this.decHead.agentCodeScc = res.result.sccCode
              this.decHead.agentCode = res.result.regCusCode
              this.decHead.agentName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              this.decHead.declRegNo = res.result.regCiqCode === null ? '' : res.result.regCiqCode
              this.showFied.agentCorpId = res.result.corpId
            } else {
              this.decHead.ownerCodeScc = res.result.sccCode
              this.decHead.ownerCode = res.result.regCusCode
              this.decHead.ownerName = (res.result.cusNameSaic ? res.result.cusNameSaic : res.result.corpName)
              this.decHead.ownerCiqCode = res.result.regCiqCode === null ? '' : res.result.regCiqCode
              this.showFied.ownerCorpId = res.result.corpId
              this.backFillDistrictCode()
            }
          }
        }
      })
    },
    handleSelect (item, para, iEFlag) {
      // 如果海关名称存在 则 直接复制  如果企业海关名称不存在则发往海关查询
      if (util.isEmpty(item.cusCorpName) || util.isEmpty(item.sccCode) || util.isEmpty(item.tradeCode)) { // 如果企业海关编码或十八位社会信用代码或十位海关干编码不存在，则去查找
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
        //   // 暂不做处理
        // } else if (para === '3') { // 生产消费单位
        //   param.cusCorpName = this.decHead.ownerName
        // } else if (para === '4') {
        //   param.cusCorpName = this.decHead.agentName
        // }
        this.$post({
          url: 'API@/dec-common/dec/common/getCorpInf',
          data: param,
          success: (res) => {
            if (res.code === '0000' && res.result.sccCode) {
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
          // if (!util.isEmpty(item.ciqCode)) { // 检验检疫十位编码 需求说不要判断非空
          this.decHead.consigneeCode = item.ciqCode
          // }
          if (util.isEmpty(this.decHead.ownerCodeScc)) {
            // 自动带出一样的
            this.decHead.ownerCodeScc = this.decHead.tradeCoScc
            this.decHead.ownerCode = this.decHead.tradeCode
            this.decHead.ownerName = this.decHead.tradeName
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
          this.decHead.ownerName = item.cusCorpName
          // if (!util.isEmpty(item.ciqCode)) {
          this.decHead.declRegNo = item.ciqCode // 检验检疫代码
          // }
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
    // 生产日期的change事件 如果 生产日期为null 则 赋值为空
    produceDateChange () {
      if (util.isEmpty(this.goodsSpecForm.produceDate) || this.goodsSpecForm.length === 0) {
        this.goodsSpecForm.produceDate = ''
      }
    },
    // 商品列表
    openProductListAfter () {
      this.$nextTick(_ => {
        this.$refs['productListTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[0].focus()
      })
    },
    // 下拉键切换选择
    updownSelect (e) {
      let browerType = decUtil.myBrowser()
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
    // 检验检疫列表
    openencodeListAfter () {
      this.$nextTick(_ => {
        this.$refs['encodeTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[0].focus()
      })
    },
    updownEncodeTableSelect (e) {
      let browerType = decUtil.myBrowser()
      if (browerType === 'Chrome') {
        return
      }
      let len = this.encodeTableList.length
      if (len === 0) {
        return
      } else {
        len--
      }
      if (e && e.keyCode === 38) { // 上
        if (this.encodeListRadio === 0) {
          this.encodeListRadio = len
        } else {
          this.encodeListRadio--
        }
      }
      if (e && e.keyCode === 40) { // 下
        if (this.encodeListRadio === len) {
          this.encodeListRadio = 0
        } else {
          this.encodeListRadio++
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@import './decPage/common/decCss';
</style>
