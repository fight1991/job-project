<template>
  <section class='entrust-main'>
    <el-row class="mg-b-15" v-if="isDetail">
      <el-col :span="12">
        <div class="entrust-detail-tit"><span>委托编号：</span>{{entrustForm.entrustCode}}</div>
        <div class="entrust-detail-tit"><span>委托时间：</span>{{entrustForm.createTime}}</div>
      </el-col>
      <el-col :span="12" align="right">
        <el-button size="mini" @click="openDetail">查看相关数据</el-button>
        <el-button size="mini" type="primary" @click="toStatusPage" v-if="entrustForm.entrustStatus !== '1'">状态跟踪</el-button>
      </el-col>
    </el-row>
    <el-form size="mini" :model="entrustForm" @keyup.enter.native="switchFoucsByEnter" ref="entrustForm" :rules="rules" :hide-required-asterisk="isDetail">
      <div class="entrust-panel">
        <el-row class="entrust-title">委托信息</el-row>
        <el-row class="entrust-info-panel" v-for="(item,index) in entrustForm.beEntrustInfoVOs" :key="index">
          <span class="list-icon-delete_all"><i class="panel-close" v-show="index!==0 && !isDetail" @click="delCorp(index, item)"></i></span>
          <i class="status-icon" v-if="isDetail" :class="{'status-icon-already':item.beEntrustStatus == '3','status-icon-pend':item.beEntrustStatus == '2'}"></i>
          <el-row :gutter="30">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'受托企业:' : '受托企业'" :label-width="isDetail?'88px':'80px'" :prop="'beEntrustInfoVOs.'+index+'.beEntrustCompanyName'" :rules="rules.beEntrustCompanyName">
                <el-select v-model="item.beEntrustCompanyName" placeholder="输入两位字符后开始匹配" class="select-Color"
                  remote default-first-option filterable clearable
                  :remote-method="querySearchCorp"
                  @focus="corpList=[]"
                  @clear="clearSelct('corpList')"
                  @change="handleSelectCorp(item.beEntrustCompanyName, index)"
                  v-if="!isDetail">
                  <el-option
                    v-for="item in corpList"
                    :key="item.corpId"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div class="info-txts" v-else>{{item.beEntrustCompanyName}}<a href="javascript:void(0)" v-if="item.beEntrustStatus=='2'" class="list-icon-editH border-0" style="margin-left: 15px;color: #287fca;" @click="editCorp(item,index)"><i class='dec-i'></i>修改</a></div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'委托业务:' : '委托业务'" :label-width="isDetail?'88px':'80px'" :prop="'beEntrustInfoVOs.'+index+'.entrustBusiness'" :rules="rules.entrustBusiness">
                <el-select size="mini" filterable v-model="item.entrustBusiness" v-if="!isDetail" class="select-Color"
                  @focus="tipsFillMessage('businessList-'+index,'ENTRUST_TYPE')"
                  @change="businessChange(true)"
                  remote default-first-option
                  :remote-method="checkParamsList">
                  <el-option
                    v-for="item in businessList[index]"
                    :key="item.codeField+'entrustBusiness'"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                <div class="info-txts" v-else>{{item.entrustBusinessValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'客户业务号:':'客户业务号'" :label-width="isDetail?'88px':'80px'">
                <el-input v-model="item.customerBusinessNo" maxlength="70" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{item.customerBusinessNo}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'接单编号:':'接单编号'" :label-width="isDetail?'88px':'80px'">
                <el-input v-model="item.innerNo" readonly v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{item.innerNo}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item :label="isDetail?'备注:':'备注'" :label-width="isDetail?'88px':'80px'">
                <el-input v-model="item.note" maxlength="255" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{item.note}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <el-row v-if="!isDetail" class="mg-b-20"><el-button type="primary" size="mini" @click="addCorp">新增受托企业</el-button></el-row>
      </div>
      <div class="entrust-panel">
        <el-row class="entrust-title">货物信息</el-row>
        <el-row style="padding: 0 20px;">
          <el-row :gutter="30" v-if="paramShow.log">
            <el-col :span="24">
              <el-form-item :label="isDetail?'货物概要:':'货物概要'" :label-width="isDetail?'71px':'67px'">
                <el-input v-model="entrustForm.goodsOutline" maxlength="400" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.goodsOutline}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'件数:':'件数'" :label-width="isDetail?'71px':'67px'" prop="packNo">
                <el-input v-model="entrustForm.packNo" maxlength="9" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.packNo}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'毛重(KG):':'毛重(KG)'" :label-width="isDetail?'71px':'67px'" prop="grossWt">
                <el-input v-model="entrustForm.grossWt" maxlength="20" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.grossWt}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'净重(KG):':'净重(KG)'" :label-width="isDetail?'71px':'67px'" prop="netWt">
                <el-input v-model="entrustForm.netWt" maxlength="20" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.netWt}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'包装种类:':'包装种类'" :label-width="isDetail?'71px':'67px'">
                <el-select v-model="entrustForm.wrapType" class="select-Color" v-if="!isDetail"
                  @focus="tipsFillMessage('saasWrap','SAAS_WRAP')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasWrap')"
                  clearable filterable style="width:100%">
                  <el-option
                    v-for="item in saasWrap"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                <div class="info-txts" v-else>{{entrustForm.wrapTypeValue}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <div class="entrust-panel">
        <el-row class="entrust-title">运输信息</el-row>
        <el-row style="padding: 0 20px;">
          <el-row :gutter="30">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'运输方式:':'运输方式'" :label-width="isDetail?'84px':'80px'">
                <el-select v-model="entrustForm.trafMode"
                  @focus="tipsFillMessage('saasTransportType','SAAS_TRANSPORT_TYPE')" class="select-Color" v-if="!isDetail"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasTransportType')"
                  clearable filterable style="width:100%">
                  <el-option
                    v-for="item in saasTransportType"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                <div class="info-txts" v-else>{{entrustForm.trafModeValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'提运单号:':'提运单号'" :label-width="isDetail?'84px':'80px'">
                <el-input v-model="entrustForm.billNo" maxlength="32" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.billNo}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.log">
              <el-form-item :label="isDetail?'贸易条款:':'贸易条款'" :label-width="isDetail?'84px':'80px'">
                <el-select size="mini" filterable v-model="entrustForm.tradeTerms" class="select-Color" v-if="!isDetail"
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
                <div class="info-txts" v-else>{{entrustForm.tradeTermsValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.invt">
              <el-form-item :label="isDetail?'监管方式:':'监管方式'" :label-width="isDetail?'84px':'80px'">
                <el-select size="mini" filterable v-model="entrustForm.tradeMode" class="select-Color" v-if="!isDetail"
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
                <div class="info-txts" v-else>{{entrustForm.tradeModeValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'是否危险品:':'是否危险品'" :label-width="isDetail?'84px':'80px'">
                <el-select size="mini" filterable v-model="entrustForm.isDangerous" class="select-Color" v-if="!isDetail"
                  @focus="tipsFillMessage('statusIsList','IS_SATATUS')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('statusIsList')"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in statusIsList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                <div class="info-txts" v-else>{{entrustForm.isDangerousValue}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="splitLine" v-if="paramShow.log"></el-row>
          <el-row :gutter="10" v-if="!isDetail && paramShow.log">
            <el-col :span="6">
              <el-form-item :label="isDetail?'提货地:':'提货地'" :label-width="isDetail?'84px':'80px'">
                <el-select size="mini" filterable v-model="entrustForm.pickUpGCountry" class="select-Color"
                  @focus="tipsFillMessage('countryPList','COUNTRY_PICK')" placeholder="请选择国别"
                  remote default-first-option
                  :remote-method="checkCountryList"
                  @clear="clearSelct('countryPList')"
                  @change="getProvinceList(entrustForm.pickUpGCountry,'1','pick')"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in countryPList"
                    :key="item.code +'countryP'"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="0">
                <el-select size="mini" filterable v-model="entrustForm.pickUpGProvince" class="select-Color"
                  @focus="tipsFillMessage('provincePList','PROVINCE_PICK')" placeholder="请选择省/州"
                  remote default-first-option
                  :remote-method="checkCountryList"
                  @change="getProvinceList(entrustForm.pickUpGProvince,'2','pick')"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in provincePList"
                    :key="item.code +'provinceP'"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="0">
                <el-select size="mini" filterable v-model="entrustForm.pickUpGCity" class="select-Color"
                  @focus="tipsFillMessage('cityPList','CITY_PICK')" placeholder="请选择市/县"
                  remote default-first-option
                  :remote-method="checkCountryList"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in cityPList"
                    :key="item.code +'cityP'"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="0">
                <el-input v-model="entrustForm.pickUpGAddress" maxlength="400" placeholder="详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isDetail && paramShow.log">
            <el-col :span="24">
              <el-form-item label="提货地:" :label-width="isDetail?'84px':'80px'">
                <div class="info-txts">{{entrustForm.pickUpGCountryValue}}&nbsp;&nbsp;{{entrustForm.pickUpGProvinceValue}}&nbsp;&nbsp;{{entrustForm.pickUpGCityValue}}&nbsp;&nbsp;{{entrustForm.pickUpGAddress}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30" v-if="paramShow.log">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'联系人:':'联系人'" :label-width="isDetail?'84px':'80px'">
                <el-input v-model="entrustForm.pickUpGContacts" maxlength="20" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.pickUpGContacts}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'联系方式:':'联系方式'" :label-width="isDetail?'84px':'80px'">
                <el-input v-model="entrustForm.pickUpGPhone" maxlength="20" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.pickUpGPhone}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="splitLine" v-if="paramShow.log"></el-row>
          <el-row :gutter="10" v-if="!isDetail && paramShow.log">
            <el-col :span="6">
              <el-form-item :label="isDetail?'送货地:':'送货地'" :label-width="isDetail?'84px':'80px'">
                <el-select size="mini" filterable v-model="entrustForm.deliverGCountry" class="select-Color"
                  @focus="tipsFillMessage('countryDList','COUNTRY_PICK')" placeholder="请选择国别"
                  remote default-first-option
                  :remote-method="checkCountryList"
                  @clear="clearSelct('countryDList')"
                  @change="getProvinceList(entrustForm.deliverGCountry,'1','deliver')"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in countryDList"
                    :key="item.code +'countryD'"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="0">
                <el-select size="mini" filterable v-model="entrustForm.deliverGProvince" class="select-Color"
                  @focus="tipsFillMessage('provinceDList','PROVINCE_PICK')" placeholder="请选择省/州"
                  remote default-first-option
                  :remote-method="checkCountryList"
                  @change="getProvinceList(entrustForm.deliverGProvince,'2','deliver')"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in provinceDList"
                    :key="item.code +'provinceD'"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="0">
                <el-select size="mini" filterable v-model="entrustForm.deliverGCity" class="select-Color"
                  @focus="tipsFillMessage('cityDList','CITY_PICK')" placeholder="请选择市/县"
                  remote default-first-option
                  :remote-method="checkCountryList"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in cityDList"
                    :key="item.code +'cityD'"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="0">
                <el-input v-model="entrustForm.deliverGAddress" maxlength="400" placeholder="详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  v-if="isDetail && paramShow.log">
            <el-col :span="24">
              <el-form-item  label="送货地:" :label-width="isDetail?'84px':'80px'">
                <div class="info-txts">{{entrustForm.deliverGCountryValue}}&nbsp;&nbsp;{{entrustForm.deliverGProvinceValue}}&nbsp;&nbsp;{{entrustForm.deliverGCityValue}}&nbsp;&nbsp;{{entrustForm.deliverGAddress}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30" v-if="paramShow.log">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'联系人:':'联系人'" :label-width="isDetail?'84px':'80px'">
                <el-input v-model="entrustForm.deliverGContacts" maxlength="20" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.deliverGContacts}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'联系方式:':'联系方式'" :label-width="isDetail?'84px':'80px'">
                <el-input v-model="entrustForm.deliverGPhone" maxlength="20" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.deliverGPhone}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <div class="entrust-panel" v-if="paramShow.dec || paramShow.invt">
        <el-row class="entrust-title">申报信息</el-row>
        <el-row style="padding: 0 20px;">
          <el-row :gutter="30">
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'申报截止日期:':'申报截止日期'" :label-width="isDetail?'101px':'108px'">
                <el-date-picker v-model="entrustForm.demandDate" size="mini" type="date" placeholder="选择日期" style="width:100%;padding:0 0px;" v-if="!isDetail"></el-date-picker>
                <div class="info-txts" v-else>{{entrustForm.demandDate}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.dec">
              <el-form-item :label="isDetail?'是否拼票:':'是否拼票'" :label-width="isDetail?'101px':'108px'">
                <el-select size="mini" filterable v-model="entrustForm.splitFlag" class="select-Color" v-if="!isDetail"
                  @focus="tipsFillMessage('statusListA','IS_SATATUS')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('statusListA')"
                  clearable style="width:100%">
                  <el-option
                    v-for="item in statusListA"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                <div class="info-txts" v-else>{{entrustForm.splitFlagValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.invt">
              <el-form-item :label="isDetail?'手(账)册编号:':'手(账)册编号'" :label-width="isDetail?'101px':'108px'" prop="manualNo" key="manualNo">
                <el-input v-model="entrustForm.manualNo" maxlength="12" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.manualNo}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.invt">
              <el-form-item :label="isDetail?'料件/成品标志:':'料件/成品标志'" :label-width="isDetail?'101px':'108px'" prop="mtpckEndprdTypecd" key="mtpckEndprdTypecd">
                <el-select size="mini" filterable v-model="entrustForm.mtpckEndprdTypecd" class="select-Color" v-if="!isDetail"
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
                <div class="info-txts" v-else>{{entrustForm.mtpckEndprdTypecdValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.invt">
              <el-form-item :label="isDetail?'清单类型:':'清单类型'" :label-width="isDetail?'101px':'108px'" prop="billtype" key="billtype">
                <el-select size="mini" filterable v-model="entrustForm.billtype" class="select-Color" v-if="!isDetail"
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
                <div class="info-txts" v-else>{{entrustForm.billtypeValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.invt">
              <el-form-item :label="isDetail?'报关标志:':'报关标志'" :label-width="isDetail?'101px':'108px'" prop="ediId" key="ediId">
                <el-select size="mini" filterable v-model="entrustForm.ediId" class="select-Color" v-if="!isDetail"
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
                <div class="info-txts" v-else>{{entrustForm.ediIdValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.invt">
              <el-form-item :label="isDetail?'报关类型:':'报关类型'" :label-width="isDetail?'101px':'108px'">
                <el-select size="mini" filterable v-model="entrustForm.dclcusTypecd" class="select-Color" v-if="!isDetail"
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
                <div class="info-txts" v-else>{{entrustForm.dclcusTypecdValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'报关单类型:':'报关单类型'" :label-width="isDetail?'101px':'108px'" prop="decType" key="decType">
                <el-select size="mini" filterable v-model="entrustForm.decType" class="select-Color" v-if="!isDetail"
                  @focus="tipsFillMessage('emsDecTypeList','SAAS_EMS_DEC_TYPE')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  style="width:100%">
                  <el-option
                    v-for="item in emsDecTypeList"
                    :key="item.codeField"
                    :label="item.codeField+'-'+item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
                <div class="info-txts" v-else>{{entrustForm.decTypeValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6" v-if="paramShow.invt">
              <el-form-item :label="isDetail?'企业内部编号:':'企业内部编号'" :label-width="isDetail?'101px':'108px'">
                <el-input v-model="entrustForm.corpInterNo" maxlength="70" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.corpInterNo}}</div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item :label="isDetail?'合同协议号:':'合同协议号'" :label-width="isDetail?'101px':'108px'">
                <el-input v-model="entrustForm.contrNo" maxlength="32" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.contrNo}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="paramShow.dec">
            <el-col :span="8">
              <el-form-item :label="isDetail?'境内收发货人:':'境内收发货人'" :label-width="isDetail?'101px':'108px'">
                <el-input v-model="entrustForm.tradeCoScc" @blur="queryCropInfo('tradeCoScc')" maxlength="18" placeholder="18位社会信用代码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.tradeCoScc}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-input v-model="entrustForm.tradeCode" @blur="queryCropInfo('tradeCode')" maxlength="10" placeholder="10位海关编码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.tradeCode}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="0">
                <el-autocomplete v-if="!isDetail"
                  :maxlength="70"
                  placeholder="企业名称"
                  v-model="entrustForm.tradeName"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  :select-when-unmatched='true'
                  :highlight-first-item='true'
                  @select="handleSelect($event, '1')">
                </el-autocomplete>
                <div class="info-txts" v-else>{{entrustForm.tradeName}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="paramShow.dec">
            <el-col :span="12">
              <el-form-item :label="isDetail?'境外收发货人:':'境外收发货人'" :label-width="isDetail?'101px':'108px'">
                <el-input v-model="entrustForm.overseasConsignorCode" maxlength="50" placeholder="境外收发货人代码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.overseasConsignorCode}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="0">
                <el-autocomplete v-if="!isDetail"
                  :maxlength="100"
                  placeholder="企业名称"
                  v-model="entrustForm.overseasConsignorCname"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  :select-when-unmatched='true'
                  :highlight-first-item='true'
                  @select="handleSelect($event, '2')">
                </el-autocomplete>
                <div class="info-txts" v-else>{{entrustForm.overseasConsignorCname}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="paramShow.dec">
            <el-col :span="8">
              <el-form-item :label="$route.params.iEFlag=='import'?(isDetail?'消费使用单位:':'消费使用单位'):(isDetail?'生产销售单位:':'生产销售单位')" :label-width="isDetail?'101px':'108px'">
                <el-input v-model="entrustForm.ownerCodeScc" @blur="queryCropInfo('ownerCodeScc')" maxlength="18" placeholder="18位社会信用代码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.ownerCodeScc}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-input v-model="entrustForm.ownerCode" @blur="queryCropInfo('ownerCode')" maxlength="10" placeholder="10位海关编码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.ownerCode}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="0">
                <el-autocomplete v-if="!isDetail"
                  :maxlength="70"
                  placeholder="企业名称"
                  v-model="entrustForm.ownerName"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  :select-when-unmatched='true'
                  :highlight-first-item='true'
                  @select="handleSelect($event, '3')">
                </el-autocomplete>
                <div class="info-txts" v-else>{{entrustForm.ownerName}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="paramShow.invt">
            <el-col :span="8">
              <el-form-item :label="isDetail?'经营单位:':'经营单位'" :label-width="isDetail?'101px':'108px'">
                <el-input v-model="entrustForm.operateScc" @blur="queryCropInfo('operateScc')" maxlength="18" placeholder="18位社会信用代码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.operateScc}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-input v-model="entrustForm.operateCode" @blur="queryCropInfo('operateCode')" maxlength="10" placeholder="10位海关编码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.operateCode}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="0">
                <el-autocomplete v-if="!isDetail"
                  :maxlength="70"
                  placeholder="企业名称"
                  v-model="entrustForm.operateName"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  :select-when-unmatched='true'
                  :highlight-first-item='true'
                  @select="handleSelect($event, '4')">
                </el-autocomplete>
                <div class="info-txts" v-else>{{entrustForm.operateName}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="paramShow.invt">
            <el-col :span="8">
              <el-form-item :label="isDetail?'加工单位:':'加工单位'" :label-width="isDetail?'101px':'108px'">
                <el-input v-model="entrustForm.processScc" @blur="queryCropInfo('processScc')" maxlength="18" placeholder="18位社会信用代码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.processScc}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-input v-model="entrustForm.processCode" @blur="queryCropInfo('processCode')" maxlength="10" placeholder="10位海关编码" v-if="!isDetail"></el-input>
                <div class="info-txts" v-else>{{entrustForm.processCode}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="0">
                <el-autocomplete v-if="!isDetail"
                  :maxlength="70"
                  placeholder="企业名称"
                  v-model="entrustForm.processName"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  :select-when-unmatched='true'
                  :highlight-first-item='true'
                  @select="handleSelect($event, '5')">
                </el-autocomplete>
                <div class="info-txts" v-else>{{entrustForm.processName}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <div class="entrust-panel query-table dec-query-table">
        <el-row class="entrust-title">随附单据</el-row>
        <el-row class="op-btn mg-b-15 border-0">
          <el-button size="mini" class="list-btns list-icon-upload" @click="uoloadDoc('add','new')"><i></i>上传</el-button>
          <el-button size="mini" class="list-btns list-icon-delete" @click="deleteDoc('mutiple')"><i></i>删除</el-button>
          <el-button size="mini" class="list-btns list-icon-download" @click="downloadDoc"><i></i>下载</el-button>
        </el-row>
        <el-table class='sys-table-table dec-table mg-b-18' border highlight-current-row size="mini" :data="entrustForm.sysDocVOs" @selection-change="docSelect">
          <el-table-column  type="selection" width="36" align="center"></el-table-column>
          <el-table-column label="文件名称" min-width="130" align="left">
            <template slot-scope="scope">
              {{scope.row.fileName || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="文件类型" min-width="100" align="left">
            <template slot-scope="scope">
              {{scope.row.docTypeValue || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="大小" min-width="100" align="right">
            <template slot-scope="scope">
              {{scope.row.fileSize || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="上传用户" min-width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.createUserName || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="上传时间" min-width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.upTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div class="order-list-btns">
                <a href="javascript:void(0)" class="list-icon-edit border-0" title="设置文件类型" @click="uoloadDoc('edit',scope.row)"><i class='dec-i'></i></a>
                <a href="javascript:void(0)" class="list-icon-delete border-0" title="删除" @click="deleteDoc(scope.row)"><i class='dec-i'></i></a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-row v-if="!isDetail" class="mg-b-15">
      <el-col :span="24" align="center">
        <el-button size="mini" @click="submitData('0')">暂存</el-button>
        <el-button size="mini" type="primary" @click="submitData('1')">提交委托</el-button>
      </el-col>
    </el-row>
    <!-- 随附单据弹窗 -->
    <el-dialog :modal-append-to-body='false' :title="docFileFlag=='add'?'随附单据-上传':'设置文件类型'" :visible.sync="docUploadVisible" width="35%" :close-on-click-modal="false" v-loading="$store.state.loading">
      <doc-upload v-if="docUploadVisible" :paramShow="paramShow" :flag="docFileFlag" :loadForm="docForm" @getData="getDocData" @close="closeDocDialog"></doc-upload>
    </el-dialog>
    <!-- 随附单据弹窗 end -->
    <!-- 更改受托企业弹窗 -->
    <el-dialog :modal-append-to-body='false' title="修改受托方" :visible.sync="editVisible" width="600px" class="entrust-dialog" :close-on-click-modal="false" v-loading="$store.state.loading">
      <el-row>
        <el-col :span="19" :offset="2">
          <el-form :model="corpForm" ref="corpForm" :rules="corpRules" label-width="75px" size="mini">
            <el-form-item label="企业名称" prop="beEntrustCompanyName">
              <el-select v-model="corpForm.beEntrustCompanyName" placeholder="输入两位字符后开始匹配" class="select-Color"
                remote default-first-option filterable clearable
                :remote-method="querySearchCorp"
                @clear="clearSelct('corpList')"
                @change="handleSelectCorp(corpForm.beEntrustCompanyName)">
                <el-option
                  v-for="item in corpList"
                  :key="item.corpId"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-row><el-col :span="24" align="center"><el-button size="mini" type="primary" class="dialog-btn" @click="changeCorp">确定</el-button></el-col></el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 更改受托企业弹窗 end -->
    <!-- 查看相关数据弹窗 -->
    <el-dialog :modal-append-to-body='false' title="查看相关数据" :visible.sync="detailVisible" width="45%" class="entrust-dialog" :close-on-click-modal="false" v-loading="$store.state.loading">
      <entrust-detail :data="entrustForm" v-if="detailVisible"></entrust-detail>
    </el-dialog>
    <!-- 查看相关数据弹窗 end -->
  </section>
</template>
<script>
import util from '@/common/util'
import docUpload from './docUpload.vue'
import entrustDetail from './detail.vue'
export default {
  components: { docUpload, entrustDetail },
  data () {
    return {
      isDetail: false, // 是否是详情页面
      iEFlag: 'import',
      entrustForm: {
        entrustHeadPid: '', // 主键
        beEntrustInfoVOs: [{
          beEntrustCompanyName: '',
          beEntrustCompanyScc: '',
          beEntrustInfoPid: '',
          entrustBusiness: 'dec',
          customerBusinessNo: '',
          innerNo: '',
          note: ''
        }],
        iEFlag: '', // 进出口标识
        entrustType: '', // 状态类型
        goodsOutline: '', // 货物概要
        packNo: '', // 件数
        grossWt: '', // 毛重
        netWt: '', // 净重
        wrapType: '', // 包装种类
        trafMode: '', // 运输方式
        billNo: '', // 提运单号
        tradeMode: '', // 监管方式
        isDangerous: '', // 是否危险品
        tradeTerms: '', // 贸易条款
        demandDate: '', // 截止日期
        splitFlag: '', // 是否拼票
        manualNo: '', // 手(账)册编号
        mtpckEndprdTypecd: '', // 料件/成品标志
        contrNo: '', // 合同协议号
        decType: '', // 报关单类型
        billtype: '', // 清单类型
        ediId: '', // 报关标志
        dclcusTypecd: '', // 报关类型
        corpInterNo: '', // 企业内部编号
        tradeCoScc: '', // 境内收发货人统一社会信用代码
        tradeCode: '', // 境内收发货人海关十位
        tradeName: '', // 境内收发货人企业名称
        overseasConsignorCode: '', // 境外收发货人代码
        overseasConsignorCname: '', // 境外收发货人名称
        ownerCodeScc: '', // 消费使用单位/生产销售单位统一社会信用代码
        ownerCode: '', // 消费使用单位/生产销售单位海关十位
        ownerName: '', // 消费使用单位/生产销售单位企业名称
        operateScc: '', // 经营单位统一社会信用代码
        operateCode: '', // 经营单位海关十位
        operateName: '', // 经营单位企业名称
        processScc: '', // 加工单位统一社会信用代码
        processCode: '', // 加工单位海关十位
        processName: '', // 加工单位企业名称
        pickUpGCountry: '', // 提货地国家
        pickUpGProvince: '', // 提货地省
        pickUpGCity: '', // 提货地市
        pickUpGAddress: '', // 提货地地址
        pickUpGContacts: '', // 提货地联系人
        pickUpGPhone: '', // 提货地联系方式
        deliverGCountry: '', // 送货地国家
        deliverGProvince: '', // 送货地省
        deliverGCity: '', // 送货地市
        deliverGAddress: '', // 送货地地址
        deliverGContacts: '', // 送货地联系人
        deliverGPhone: '', // 送货地联系方式
        sysDocVOs: [] // 随附单据
      },
      rules: {
        beEntrustCompanyName: [{required: true, message: '请选择受托企业', trigger: 'blur'}],
        entrustBusiness: [{required: true, message: '请选择委托业务', trigger: 'change'}],
        packNo: [{validator: this.checkVal, message: '请输入不超过9位的数字', trigger: 'blur'}],
        grossWt: [{validator: this.checkVal, message: '输入整数不超过14位小数不超过5位且不小于1的数', trigger: 'blur'}],
        netWt: [{validator: this.checkVal, message: '输入整数不超过14位小数不超过5位且不小于1的数', trigger: 'blur'}],
        manualNo: [{required: true, validator: this.checkVal, message: '', trigger: 'blur'}],
        mtpckEndprdTypecd: [{required: true, message: '请选择料件/成品标志', trigger: 'change'}],
        billtype: [{required: true, message: '请选择清单类型', trigger: 'change'}],
        ediId: [{required: true, message: '请选择报关标志', trigger: 'change'}],
        decType: [{required: true, message: '请选择报关单类型', trigger: 'change'}]
      },
      ruleRegx: {
        'packNo': '^\\d{1,9}$|^$', // 件数
        'grossWt': '^[1-9]{1}\\d{0,13}(\\.\\d{1,5})?$|^$', // 毛重(KG)
        'netWt': '^[1-9]{1}\\d{0,13}(\\.\\d{1,5})?$|^$', // 净重(KG)
        'manualNo': '^(B|C|D|E|H|W|T|L)[A-Za-z0-9]{11}$' // 手(账)册编号
      },
      businessList: [],
      businessLists: [{
        codeField: 'dec',
        nameField: '报关单'
      }, {
        codeField: 'invt',
        nameField: '核注清单'
      }, {
        codeField: 'log',
        nameField: '物流作业'
      }], // 委托业务数据
      corpList: [], // 受托企业下拉
      entrustCorpList: [],
      saasWrap: [], // 包装种类数据
      saasTransportType: [], // 运输方式数据
      saasTradeList: [], // 监管方式数据
      statusIsList: [], // 是否危险品数据
      statusListA: [], // 是否拼票数据
      tradeList: [], // 贸易条款数据
      emsDecTypeList: [], // 报关单类型（核注清单）数据
      mtpckEndprdList: [], // 料件/成品标志数据
      billList: [], // 清单类型数据
      ediIdList: [], // 报关标志数据
      cusTypeList: [], // 报关类型数据
      countryList: [], // 国家
      countryPList: [],
      countryDList: [],
      provinceList: [], // 省
      provincePList: [],
      provinceDList: [],
      cityList: [], // 市
      cityPList: [],
      cityDList: [],
      selectObj: {
        obj: '',
        parmas: ''
      },
      tableNameList: {
        tableNames: [
          'SAAS_TRANSPORT_TYPE', // 运输方式
          'SAAS_TRADE_MODEL', // 贸易条款
          'SAAS_WRAP', // 包装种类
          'SAAS_TRADE', // 监管方式
          'SAAS_EMS_DEC_TYPE' // 报关单类型（核注清单）
        ]
      }, // 字典标明
      selectDicList: {
        // 'entrustBusiness': {obj: 'businessList', params: 'ENTRUST_TYPE'}, // 委托业务
        'wrapType': {obj: 'saasWrap', params: 'SAAS_WRAP'}, // 包装种类
        'trafMode': {obj: 'saasTransportType', params: 'SAAS_TRANSPORT_TYPE'}, // 运输方式
        'tradeTerms': {obj: 'tradeList', params: 'SAAS_TRADE_MODEL'}, // 贸易条款
        'tradeMode': {obj: 'saasTradeList', params: 'SAAS_TRADE'}, // 监管方式
        'isDangerous': {obj: 'statusIsList', params: 'IS_SATATUS'}, // 是否危险品
        'splitFlag': {obj: 'statusListA', params: 'IS_SATATUS'}, // 是否拼票
        'mtpckEndprdTypecd': {obj: 'mtpckEndprdList', params: 'EMS_MTPCKEND'}, // 料件/成品标志
        'billtype': {obj: 'billList', params: 'BILL_TYPE_TAX'}, // 清单类型
        'ediId': {obj: 'ediIdList', params: 'DEC_EDID'}, // 报关标志
        'dclcusTypecd': {obj: 'cusTypeList', params: 'DEC_CUSTYPE'}, // 报关类型
        'decType': {obj: 'emsDecTypeList', params: ''}, // 报关单类型
        'pickUpGCountry': {obj: 'countryPList', params: 'COUNTRY_PICK'}, // 提货地国家
        'pickUpGProvince': {obj: 'provincePList', params: 'PROVINCE_PICK'}, // 提货地省州
        'pickUpGCity': {obj: 'cityPList', params: 'CITY_PICK'}, // 提货地市
        'deliverGCountry': {obj: 'countryDList', params: 'COUNTRY_PICK'}, // 送货地国家
        'deliverGProvince': {obj: 'provinceDList', params: 'PROVINCE_PICK'}, // 送货地省州
        'deliverGCity': {obj: 'cityDList', params: 'CITY_PICK'} // 送货地市
      },
      paramShow: {
        dec: true,
        invt: false,
        log: false
      }, // 字段显示
      docList: [], // 随附单据选择
      docUploadVisible: false, // 随附单据弹窗
      docForm: {},
      docFileFlag: 'add', // 弹窗类型
      editVisible: false, // 修改受托方弹窗
      corpIndex: null,
      corpForm: {
        beEntrustCompanyName: '',
        beEntrustCompanyScc: ''
      },
      corpRules: {
        beEntrustCompanyName: [{required: true, message: '请选择受托企业', trigger: 'blur'}]
      },
      formData: {
        entrustHeadPid: '',
        iEFlag: ''
      },
      detailVisible: false
    }
  },
  created () {
    // this.querySearchCorp()
    this.getCommonParam()
    this.getProvinceList('', '0', 'pick')
    this.getProvinceList('', '0', 'deliver')
    let decTrnList = []
    if (this.$route.meta.iEFlag === 'import') {
      this.iEFlag = 'import'
      decTrnList = [{codeField: '0', nameField: '报关单'}, {codeField: '1', nameField: '转关提前报关单'}, {codeField: '2', nameField: '备案清单'}, {codeField: '3', nameField: '转关提前备案清单'}]
    } else {
      this.iEFlag = 'export'
      decTrnList = [{codeField: '0', nameField: '报关单'}, {codeField: '1', nameField: '转关提前报关单'}, {codeField: '2', nameField: '备案清单'}, {codeField: '3', nameField: '转关提前备案清单'}, {codeField: '4', nameField: '出口二次转关'}]
    }
    window.localStorage.setItem('DEC_TRNREL', JSON.stringify(decTrnList))
    window.localStorage.setItem('IS_SATATUS', JSON.stringify([{codeField: 'N', nameField: '否'}, {codeField: 'Y', nameField: '是'}]))
    window.localStorage.setItem('EMS_MTPCKEND', JSON.stringify([{codeField: 'E', nameField: '成品'}, {codeField: 'I', nameField: '料件'}]))
    window.localStorage.setItem('BILL_TYPE_TAX', JSON.stringify([{nameField: '普通清单', codeField: '0'}, {nameField: '先入区后报关', codeField: '3'}, {nameField: '简单加工', codeField: '4'}, {nameField: '保税展示交易', codeField: '5'}, {nameField: '区内流转', codeField: '6'}, {nameField: '区港联动', codeField: '7'}, {nameField: '保税电商', codeField: '8'}, {nameField: '一纳成品内销', codeField: '9'}]))
    window.localStorage.setItem('DEC_EDID', JSON.stringify([{codeField: '1', nameField: '报关'}, {codeField: '2', nameField: '非报关'}]))
    window.localStorage.setItem('DEC_CUSTYPE', JSON.stringify([{codeField: '1', nameField: '关联报关'}, {codeField: '2', nameField: '对应报关'}]))
  },
  mounted () {
    this.initData()
    if (this.$route.params.type === 'edit') {
      this.entrustForm.entrustHeadPid = this.$route.params.id
      this.getDetail(true)
    } else if (this.$route.params.type === 'view') {
      this.entrustForm.entrustHeadPid = this.$route.params.id
      this.getDetail(true)
      this.isDetail = true
    }
  },
  methods: {
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
            next.focus()
            next.select()
          }
        }
      }
    },
    // 获取公共字典list
    getCommonParam () {
      let par = this.tableNameList.tableNames
      this.$post({
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {},
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {}
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      if (obj === 'emsDecTypeList') {
        this[obj] = []
        if (this.paramShow.dec && !this.paramShow.invt) {
          this.selectObj = {
            obj: obj,
            params: 'DEC_TRNREL'
          }
        } else {
          this.selectObj = {
            obj: obj,
            params: 'SAAS_EMS_DEC_TYPE'
          }
        }
      } else {
        // 如果是下拉框 则设置当前下拉框的默认参数
        this.selectObj = {
          obj: obj,
          params: params
        }
      }
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      if (this.selectObj.params === 'ENTRUST_TYPE') {
        this[this.selectObj.obj.split('-')[0]][this.selectObj.obj.split('-')[1]] = []
      } else {
        this[this.selectObj.obj] = []
      }
      let keyValue = query.toString().trim()
      let list = []
      if (this.selectObj.params === 'ENTRUST_CORP') {
        list = this.entrustCorpList
      } else if (this.selectObj.params === 'ENTRUST_TYPE') {
        list = this.businessLists
      } else {
        list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      }
      if (util.isEmpty(keyValue)) {
        if (this.selectObj.params === 'ENTRUST_TYPE') {
          // this.$nextTick(() => {
          this[this.selectObj.obj.split('-')[0]][this.selectObj.obj.split('-')[1]] = list.slice(0, 10)
          // })
        } else {
          this.$nextTick(() => {
            this[this.selectObj.obj] = list.slice(0, 10)
          })
        }
      } else {
        let filterList = []
        filterList = list.filter(item => {
          let str = this.selectObj.params === 'ENTRUST_CORP' ? item : item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        if (this.selectObj.params === 'ENTRUST_TYPE') {
          if (type === 'init') {
            this[this.selectObj.obj.split('-')[0]][this.selectObj.obj.split('-')[1]] = filterList.slice(0, 10)
          } else if (type === 'select') {
            this.$nextTick(() => {
              this[this.selectObj.obj.split('-')[0]][this.selectObj.obj.split('-')[1]] = filterList.slice(0, 10)
            })
          }
        } else {
          if (type === 'init') {
            this[this.selectObj.obj] = filterList.slice(0, 10)
          } else if (type === 'select') {
            this.$nextTick(() => {
              this[this.selectObj.obj] = filterList.slice(0, 10)
            })
          }
        }
      }
      this.$forceUpdate()
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      this[selecType] = []
    },
    // 查询企业
    querySearchCorp (queryString) {
      if (queryString.length < 2) {
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
            if (!util.isEmpty(res.result)) {
              let json = JSON.stringify(res.result)
              json = json.replace(/corpName/g, 'value')
              this.corpList = JSON.parse(json).slice(0, 10)
            } else {
              this.corpList = []
            }
          }
        }
      })
    },
    handleSelectCorp (val, index) {
      if (!util.isEmpty(index)) {
        this.entrustForm.beEntrustInfoVOs[index].beEntrustCompanyScc = ''
      }
      if (this.corpList.length !== 0) {
        this.corpList.forEach(e => {
          if (val === e.value) {
            if (!util.isEmpty(index)) {
              this.entrustForm.beEntrustInfoVOs[index].beEntrustCompanyName = e.value
              this.entrustForm.beEntrustInfoVOs[index].beEntrustCompanyScc = e.sccCode
            } else {
              this.corpForm.beEntrustCompanyName = e.value
              this.corpForm.beEntrustCompanyScc = e.sccCode
            }
          }
        })
      }
    },
    // 修改受托企业
    editCorp (data, index) {
      this.corpIndex = index
      this.editVisible = true
      this.corpForm = {
        beEntrustCompanyName: '',
        beEntrustCompanyScc: ''
      }
      this.$nextTick(() => {
        this.$refs['corpForm'].clearValidate()
      })
    },
    changeCorp () {
      this.$refs['corpForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        let data = util.simpleClone(this.entrustForm.beEntrustInfoVOs[this.corpIndex])
        data.beEntrustCompanyName = this.corpForm.beEntrustCompanyName
        data.beEntrustCompanyScc = this.corpForm.beEntrustCompanyScc
        this.$post({
          url: 'API@/dec-common/ccba/entrust/replaceBeEntrust',
          data: data,
          success: (res) => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.editVisible = false
            this.getDetail(false)
          },
          other: (res) => {
            if (res.code !== '0000') {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        })
      })
    },
    // 查询企业信息
    queryCropInfo (value) {
      let param = {
        cusCorpName: '',
        sccCode: '',
        tradeCode: ''
      }
      if (value === 'tradeCoScc') {
        if (!util.isEmpty(this.entrustForm.tradeCoScc) && this.entrustForm.tradeCoScc.length === 18) {
          param.sccCode = this.entrustForm.tradeCoScc
        } else {
          return false
        }
      } else if (value === 'tradeCode') {
        if (!util.isEmpty(this.entrustForm.tradeCode) && this.entrustForm.tradeCode.length === 10) {
          param.tradeCode = this.entrustForm.tradeCode
        } else {
          return false
        }
      } else if (value === 'tradeName') {
        if (!util.isEmpty(this.entrustForm.tradeName)) {
          param.cusCorpName = this.entrustForm.tradeName
        } else {
          return false
        }
      } else if (value === 'ownerCodeScc') {
        if (!util.isEmpty(this.entrustForm.ownerCodeScc) && this.entrustForm.ownerCodeScc.length === 18) {
          param.sccCode = this.entrustForm.ownerCodeScc
        } else {
          return false
        }
      } else if (value === 'ownerCode') {
        if (!util.isEmpty(this.entrustForm.ownerCode) && this.entrustForm.ownerCode.length === 10) {
          param.tradeCode = this.entrustForm.ownerCode
        } else {
          return false
        }
      } else if (value === 'ownerName') {
        if (!util.isEmpty(this.entrustForm.ownerName)) {
          param.cusCorpName = this.entrustForm.ownerName
        } else {
          return false
        }
      } else if (value === 'operateScc') {
        if (!util.isEmpty(this.entrustForm.operateScc) && this.entrustForm.operateScc.length === 18) {
          param.sccCode = this.entrustForm.operateScc
        } else {
          return false
        }
      } else if (value === 'operateCode') {
        if (!util.isEmpty(this.entrustForm.operateCode) && this.entrustForm.operateCode.length === 10) {
          param.tradeCode = this.entrustForm.operateCode
        } else {
          return false
        }
      } else if (value === 'operateName') {
        if (!util.isEmpty(this.entrustForm.operateName)) {
          param.cusCorpName = this.entrustForm.operateName
        } else {
          return false
        }
      } else if (value === 'processScc') {
        if (!util.isEmpty(this.entrustForm.processScc) && this.entrustForm.processScc.length === 18) {
          param.sccCode = this.entrustForm.processScc
        } else {
          return false
        }
      } else if (value === 'processCode') {
        if (!util.isEmpty(this.entrustForm.processCode) && this.entrustForm.processCode.length === 10) {
          param.tradeCode = this.entrustForm.processCode
        } else {
          return false
        }
      } else if (value === 'processName') {
        if (!util.isEmpty(this.entrustForm.processName)) {
          param.cusCorpName = this.entrustForm.processName
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
              this.entrustForm.tradeCoScc = res.result.sccCode
              this.entrustForm.tradeCode = res.result.regCusCode
              this.entrustForm.tradeName = res.result.cusNameSaic
            } else if (value === 'ownerCodeScc' || value === 'ownerCode' || value === 'ownerName') {
              this.entrustForm.ownerCodeScc = res.result.sccCode
              this.entrustForm.ownerCode = res.result.regCusCode
              this.entrustForm.ownerName = res.result.cusNameSaic
            } else if (value === 'operateScc' || value === 'operateCode' || value === 'operateName') {
              this.entrustForm.operateScc = res.result.sccCode
              this.entrustForm.operateCode = res.result.regCusCode
              this.entrustForm.operateName = res.result.cusNameSaic
            } else if (value === 'processScc' || value === 'processCode' || value === 'processName') {
              this.entrustForm.processScc = res.result.sccCode
              this.entrustForm.processCode = res.result.regCusCode
              this.entrustForm.processName = res.result.cusNameSaic
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
    handleSelect (item, para) {
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
                this.entrustForm.tradeCoScc = res.result.sccCode
                this.entrustForm.tradeCode = res.result.regCusCode
                this.entrustForm.tradeName = res.result.cusNameSaic
              } else if (para === '2') { // 境外收发货人
                this.entrustForm.overseasConsignorCode = res.result.sccCode
              } else if (para === '3') { // 消费使用单位
                this.entrustForm.ownerCodeScc = res.result.sccCode
                this.entrustForm.ownerCode = res.result.regCusCode
                this.entrustForm.ownerName = res.result.cusNameSaic
              } else if (para === '4') { // 经营单位
                this.entrustForm.operateScc = res.result.sccCode
                this.entrustForm.operateCode = res.result.regCusCode
                this.entrustForm.operateName = res.result.cusNameSaic
              } else if (para === '5') { // 加工单位
                this.entrustForm.processScc = res.result.sccCode
                this.entrustForm.processCode = res.result.regCusCode
                this.entrustForm.processName = res.result.cusNameSaic
              }
            }
          }
        })
      } else {
        if (para === '1') { // 境内收发货人
          this.entrustForm.tradeCoScc = item.sccCode
          this.entrustForm.tradeCode = item.tradeCode
        } else if (para === '2') { // 境外收发货人
          this.entrustForm.overseasConsignorCode = item.sccCode
        } else if (para === '3') { // 消费使用单位
          this.entrustForm.ownerCodeScc = item.sccCode
          this.entrustForm.ownerCode = item.tradeCode
        } else if (para === '4') { // 经营单位
          this.entrustForm.operateScc = item.sccCode
          this.entrustForm.operateCode = item.tradeCode
        } else if (para === '5') { // 加工单位
          this.entrustForm.processScc = item.sccCode
          this.entrustForm.processCode = item.tradeCode
        }
      }
    },
    getProvinceList (code, type, lx) {
      if (type === '1') {
        if (lx === 'pick') {
          this.entrustForm.pickUpGProvince = ''
          this.entrustForm.pickUpGCity = ''
          this.provincePList = []
          this.cityPList = []
        } else {
          this.entrustForm.deliverGProvince = ''
          this.entrustForm.deliverGCity = ''
          this.provinceDList = []
          this.cityDList = []
        }
        this.provinceList = []
        this.cityList = []
        if (util.isEmpty(code)) return
      } else if (type === '2') {
        if (lx === 'pick') {
          this.entrustForm.pickUpGCity = ''
          this.cityPList = []
        } else {
          this.entrustForm.deliverGCity = ''
          this.cityDList = []
        }
        this.cityList = []
        if (util.isEmpty(code)) return
      }
      this.$post({
        url: 'API@/saas-dictionary/dictionary/cascadeGetArea',
        data: {code: code, type: type},
        isLoad: false,
        success: (res) => {
          if (type === '0') {
            this.countryList = util.isEmpty(res.result) ? [] : res.result
          } else if (type === '1') {
            if (lx === 'pick') {
              this.provincePList = util.isEmpty(res.result) ? [] : res.result
            } else {
              this.provinceDList = util.isEmpty(res.result) ? [] : res.result
            }
          } else {
            if (lx === 'pick') {
              this.cityPList = util.isEmpty(res.result) ? [] : res.result
            } else {
              this.cityDList = util.isEmpty(res.result) ? [] : res.result
            }
          }
        }
      })
    },
    checkCountryList (query, type = 'select') {
      // this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = []
      if (this.selectObj.obj === 'countryPList') {
        list = this.countryList
      } else if (this.selectObj.obj === 'countryDList') {
        list = this.countryList
      } else if (this.selectObj.obj === 'provincePList') {
        list = this.provincePList
      } else if (this.selectObj.obj === 'provinceDList') {
        list = this.provinceDList
      } else if (this.selectObj.obj === 'cityPList') {
        list = this.cityPList
      } else if (this.selectObj.obj === 'cityDList') {
        list = this.cityDList
      }
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          this[this.selectObj.obj] = list
        })
      } else {
        let filterList = []
        filterList = list.filter(item => {
          let str = item.code + '-' + item.name
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        if (type === 'init') {
          this[this.selectObj.obj] = filterList
        } else if (type === 'select') {
          this.$nextTick(() => {
            this[this.selectObj.obj] = filterList
          })
        }
      }
    },
    // 校验
    checkVal (rule, value, callback) {
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (name === 'manualNo') {
        if (util.isEmpty(value)) {
          callback(new Error('请输入手(账)册编号'))
        } else {
          if (!reg.test(value)) {
            callback(new Error('手(账)册编号格式不正确'))
          } else {
            callback()
          }
        }
      } else {
        if (!util.isEmpty(value)) {
          if (!reg.test(value)) {
            callback(new Error(rule.message))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    // 初始化默认值
    initData () {
      this.entrustForm.beEntrustInfoVOs[0].entrustBusiness = 'dec' // 委托业务
      this.selectObj = {
        obj: 'businessList-0',
        params: 'ENTRUST_TYPE'
      }
      this.checkParamsList('dec', 'init')
      this.entrustForm.isDangerous = 'N' // 是否危险品
      this.selectObj = {
        obj: 'statusIsList',
        params: 'IS_SATATUS'
      }
      this.checkParamsList('N', 'init')
      this.entrustForm.splitFlag = 'N' // 是否拼票
      this.selectObj = {
        obj: 'statusListA',
        params: 'IS_SATATUS'
      }
      this.checkParamsList('N', 'init')
      this.entrustForm.mtpckEndprdTypecd = 'I' // 料件/成品标志
      this.selectObj = {
        obj: 'mtpckEndprdList',
        params: 'EMS_MTPCKEND'
      }
      this.checkParamsList('I', 'init')
      this.entrustForm.ediId = '1' // 报关标志
      this.selectObj = {
        obj: 'ediIdList',
        params: 'DEC_EDID'
      }
      this.checkParamsList('1', 'init')
      // this.entrustForm.decType = '0' // 报关单类型
      // this.selectObj = {
      //   obj: 'emsDecTypeList',
      //   params: 'DEC_TRNREL'
      // }
      // this.checkParamsList('0', 'init')
    },
    // 获取详情
    getDetail (flag) {
      this.$post({
        url: 'API@/dec-common/ccba/entrust/getEntrustDetail',
        data: {entrustHeadPid: this.entrustForm.entrustHeadPid},
        success: (res) => {
          if (flag) {
            let data = util.isEmpty(res.result) ? {} : res.result
            this.getProvinceList(data.pickUpGCountry, '1', 'pick')
            this.getProvinceList(data.pickUpGProvince, '2', 'pick')
            this.getProvinceList(data.deliverGCountry, '1', 'deliver')
            this.getProvinceList(data.deliverGProvince, '2', 'deliver')
            let selectData = {
              wrapType: data.wrapType,
              trafMode: data.trafMode,
              tradeTerms: data.tradeTerms,
              tradeMode: data.tradeMode,
              isDangerous: data.isDangerous,
              splitFlag: data.splitFlag,
              mtpckEndprdTypecd: data.mtpckEndprdTypecd,
              billtype: data.billtype,
              ediId: data.ediId,
              decType: data.decType,
              dclcusTypecd: data.dclcusTypecd,
              pickUpGCountry: data.pickUpGCountry,
              pickUpGProvince: data.pickUpGProvince,
              pickUpGCity: data.pickUpGCity,
              deliverGCountry: data.deliverGCountry,
              deliverGProvince: data.deliverGProvince,
              deliverGCity: data.deliverGCity
            }
            this.$nextTick(() => {
              this.selectDicList.decType.params = this.paramShow.invt ? 'SAAS_EMS_DEC_TYPE' : 'DEC_TRNREL'
              this.detailSelect(this.selectDicList, selectData)
            })
            data.beEntrustInfoVOs.forEach((e, i) => {
              this.businessList.push([])
              this.selectObj = {
                obj: 'businessList-' + i,
                params: 'ENTRUST_TYPE'
              }
              this.checkParamsList(e.entrustBusiness, 'init')
            })
          }
          this.entrustForm = util.isEmpty(res.result) ? {} : res.result
          this.entrustForm.sysDocVOs = util.isEmpty(res.result.sysDocVOs) ? [] : res.result.sysDocVOs
          this.businessChange(false)
          this.entrustForm.sysDocVOs.forEach((e, i) => {
            e['gNo'] = i + 1
          })
        }
      })
    },
    // 获取详情 下拉赋值
    detailSelect (arr, form) {
      for (let key in arr) {
        let selectValue = form[key]
        this.selectObj = arr[key]
        if (util.isEmpty(selectValue)) {
          continue
        } else {
          if (this.selectObj.params === 'COUNTRY_PICK' || this.selectObj.params === 'PROVINCE_PICK' || this.selectObj.params === 'CITY_PICK') {
            this.checkCountryList(selectValue, 'init')
          } else if (this.selectObj.obj === 'emsDecTypeList') {
            this[this.selectObj.obj] = []
            if (this.paramShow.dec && !this.paramShow.invt) {
              this.selectObj.params = 'DEC_TRNREL'
            } else {
              this.selectObj.params = 'SAAS_EMS_DEC_TYPE'
            }
            this.checkParamsList(selectValue, 'init')
          } else {
            this.checkParamsList(selectValue, 'init')
          }
        }
      }
    },
    // 新增受托企业
    addCorp () {
      this.entrustForm.beEntrustInfoVOs.push({
        beEntrustCompanyName: '',
        beEntrustCompanyScc: '',
        beEntrustInfoPid: '',
        entrustBusiness: 'dec',
        customerBusinessNo: '',
        innerNo: '',
        note: ''
      })
      let len = this.entrustForm.beEntrustInfoVOs.length - 1
      this.selectObj = {
        obj: 'businessList-' + len,
        params: 'ENTRUST_TYPE'
      }
      this.checkParamsList('dec', 'init')
      this.paramShow.dec = true
    },
    // 删除受托企业
    delCorp (i, item) {
      if (util.isEmpty(item.entrustHeadPid)) item.entrustHeadPid = this.entrustForm.entrustHeadPid
      if (!util.isEmpty(item.beEntrustInfoPid)) {
        this.$post({
          url: 'API@/dec-common/ccba/entrust/deleteBeEntrust',
          data: item,
          success: (res) => {
            this.entrustForm.beEntrustInfoVOs.splice(i, 1)
            // this.getDetail(false)
            this.entrustForm.beEntrustInfoVOs.forEach((e, i) => {
              this.selectObj = {
                obj: 'businessList-' + i,
                params: 'ENTRUST_TYPE'
              }
              this.checkParamsList(e.entrustBusiness, 'init')
            })
            this.businessChange(true)
          }
        })
      } else {
        this.entrustForm.beEntrustInfoVOs.splice(i, 1)
        this.entrustForm.beEntrustInfoVOs.forEach((e, i) => {
          this.selectObj = {
            obj: 'businessList-' + i,
            params: 'ENTRUST_TYPE'
          }
          this.checkParamsList(e.entrustBusiness, 'init')
        })
        this.businessChange(true)
      }
    },
    // 委托业务更改 相应字段显示
    businessChange (flag) {
      this.paramShow = {
        dec: false,
        invt: false,
        log: false
      }
      let list = util.simpleClone(this.entrustForm.beEntrustInfoVOs)
      list.forEach(e => {
        if (e.entrustBusiness === 'dec') {
          this.paramShow.dec = true
        } else if (e.entrustBusiness === 'invt') {
          this.paramShow.invt = true
        } else if (e.entrustBusiness === 'log') {
          this.paramShow.log = true
        }
      })
      if (flag) {
        this.entrustForm.decType = ''
        // if (this.paramShow.dec && !this.paramShow.invt) {
        //   this.entrustForm.decType = '0' // 报关单类型
        //   this.selectObj = {
        //     obj: 'emsDecTypeList',
        //     params: 'DEC_TRNREL'
        //   }
        //   this.checkParamsList('0', 'init')
        // } else {
        //   this.entrustForm.decType = '1'
        //   this.selectObj = {
        //     obj: 'emsDecTypeList',
        //     params: 'SAAS_EMS_DEC_TYPE'
        //   }
        //   this.checkParamsList('1', 'init')
        // }
      } else {
        // if (!this.paramShow.invt) {
        //   this.entrustForm.decType = '0' // 报关单类型
        //   this.selectObj = {
        //     obj: 'emsDecTypeList',
        //     params: 'DEC_TRNREL'
        //   }
        //   this.checkParamsList('0', 'init')
        // }
      }
    },
    // 随附单据列表勾选
    docSelect (row) {
      this.docList = row
    },
    // 上传随附单据
    uoloadDoc (flag, data) {
      this.docFileFlag = flag
      this.docForm = util.simpleClone(data)
      this.docUploadVisible = true
    },
    // 删除随附单据
    deleteDoc (data) {
      if (data !== 'mutiple') {
        this.$confirm('确定删除选中数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          if (!util.isEmpty(data.seqNo)) {
            this.delRequest([{seqNo: data.seqNo}])
          } else {
            for (let item in this.entrustForm.sysDocVOs) {
              if (data.gNo === this.entrustForm.sysDocVOs[item].gNo) {
                this.entrustForm.sysDocVOs.splice(item, 1)
                break
              }
            }
          }
          for (let i in this.entrustForm.sysDocVOs) {
            this.entrustForm.sysDocVOs[i].gNo = parseInt(i) + 1
          }
        }).catch(() => {
        })
      } else {
        if (this.docList.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择需要删除的数据'
          })
        } else {
          this.$confirm('确定删除选中数据？', '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let seqNoList = []
            let gNoList = []
            for (let i in this.docList) {
              if (!util.isEmpty(this.docList[i].seqNo)) {
                seqNoList.push({seqNo: this.docList[i].seqNo})
              } else {
                gNoList.push(this.docList[i])
              }
            }
            if (gNoList.length !== 0) {
              gNoList.forEach((e, i) => {
                this.entrustForm.sysDocVOs.forEach((v, j) => {
                  if (e.gNo === v.gNo) {
                    this.entrustForm.sysDocVOs.splice(j, 1)
                  }
                })
              })
            }
            if (seqNoList.length !== 0) {
              this.delRequest(seqNoList)
            }
            for (let i in this.entrustForm.sysDocVOs) {
              this.entrustForm.sysDocVOs[i].gNo = parseInt(i) + 1
            }
          }).catch(() => {
          })
        }
      }
    },
    delRequest (seqNo) {
      this.$post({
        url: 'API@/dec-common/ccba/entrust/acmpDelete',
        data: seqNo,
        success: (res) => {
          this.getDetail(false)
        }
      })
    },
    // 下载随附单据
    downloadDoc () {
      if (this.docList.length !== 1) {
        this.$message({
          message: '请选择1条需要下载的数据',
          type: 'error'
        })
      } else {
        for (let i in this.docList) {
          window.open(this.docList[i].fullName, '_blank')
        }
      }
    },
    // 获取随附单据
    getDocData (data) {
      if (util.isEmpty(data.gNo)) {
        data.gNo = this.entrustForm.sysDocVOs.length + 1
        this.entrustForm.sysDocVOs.push(data)
      } else {
        this.entrustForm.sysDocVOs.forEach((v, i) => {
          if (data.gNo === v.gNo) {
            this.entrustForm.sysDocVOs.splice(i, 1, data)
          }
        })
      }
      if (this.$route.params.type === 'view') {
        let data = util.simpleClone(this.entrustForm)
        data.entrustType = '0'
        data.iEFlag = (this.iEFlag === 'import' ? 'I' : 'E')
        data.sysDocVOs.filter(e => {
          return delete e.gNo
        })
        this.$post({
          url: 'API@/dec-common/ccba/entrust/saveEntrust',
          data: [data],
          success: (res) => {
            this.getDetail(false)
          }
        })
      }
    },
    // 关闭随附单据弹窗
    closeDocDialog () {
      this.docUploadVisible = false
    },
    // 暂存
    submitData (type) {
      this.$refs['entrustForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        let data = util.simpleClone(this.entrustForm)
        data.entrustType = type
        data.iEFlag = (this.iEFlag === 'import' ? 'I' : 'E')
        data.sysDocVOs.filter(e => {
          return delete e.gNo
        })
        let corpScc = []
        let corps = []
        let newArr = []
        let newCorp = []
        data.beEntrustInfoVOs.forEach(e => {
          corpScc.push(e.entrustBusiness)
          corps.push(e.beEntrustCompanyScc)
        })
        let flag = ''
        corpScc.forEach(v => {
          if (newArr.indexOf(v) === -1) {
            newArr.push(v)
          } else {
            flag = '0'
          }
        })
        corps.forEach(v => {
          if (newCorp.indexOf(v) === -1) {
            newCorp.push(v)
          }
        })
        if (newCorp.length > 3) flag = '1'
        if (flag === '0' || flag === '1') {
          this.$message({
            type: 'error',
            message: '已存在重复类型的企业'
          })
          return false
        }
        if (corpScc.indexOf('invt') === -1) {
          data.manualNo = ''
        }
        if (this.paramShow.invt) {
          if (this.entrustForm.billtype === '4' || this.entrustForm.billtype === '9') {
            this.$message({
              type: 'error',
              message: '暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单'
            })
            return false
          }
        }
        this.$post({
          url: 'API@/dec-common/ccba/entrust/saveEntrust',
          data: [data],
          success: (res) => {
            this.entrustForm.entrustHeadPid = res.result.entrustHeadPid
            this.entrustForm.entrustCode = res.result.entrustCode
            this.entrustForm.beEntrustInfoVOs = res.result.beEntrustInfoVOs
            this.entrustForm.sysDocVOs = res.result.sysdocs
            this.entrustForm.sysDocVOs.forEach((e, i) => {
              e['gNo'] = i + 1
            })
            let message = type === '0' ? '暂存成功' : '提交成功'
            this.$message({
              type: 'success',
              message: message
            })
            let title = ''
            if (this.iEFlag === 'import') {
              title = '进口委托-' + this.entrustForm.entrustHeadPid
            } else if (this.iEFlag === 'export') {
              title = '出口委托-' + this.entrustForm.entrustHeadPid
            }
            if (type === '1') { // 提交成功 关闭编辑界面 打开详情界面
              // 关闭编辑界面
              this.$store.dispatch('CloseTab', this.$route.params.setId)
              // 打开详情界面
              this.$router.push({
                name: this.iEFlag === 'import' ? 'importEntrustInfo' : 'exportEntrustInfo',
                params: {
                  'iEFlag': this.iEFlag,
                  'type': 'view',
                  'id': this.entrustForm.entrustHeadPid,
                  'setTitle': title,
                  'setId': this.$route.name + 'view' + this.entrustForm.entrustHeadPid
                }
              })
            } else {
              // 如果是新增暂存 需要改变title
              if (this.$route.params.type === 'add') {
                // 关闭新增界面
                this.$store.dispatch('CloseTab', this.$route.params.setId)
                // 打开编辑界面
                this.$router.push({
                  name: this.iEFlag === 'import' ? 'importEntrustInfo' : 'exportEntrustInfo',
                  params: {
                    'iEFlag': this.iEFlag,
                    'type': 'edit',
                    'id': this.entrustForm.entrustHeadPid,
                    'setTitle': title,
                    'setId': this.$route.name + 'edit' + this.entrustForm.entrustHeadPid
                  }
                })
              }
            }
          }
        })
      })
    },
    // 查看相关数据
    openDetail () {
      this.formData.entrustHeadPid = this.entrustForm.entrustHeadPid
      this.formData.iEFlag = this.entrustForm.iEFlag
      this.detailVisible = true
    },
    // 状态跟踪
    toStatusPage () {
      let innerNos = []
      this.entrustForm.beEntrustInfoVOs.forEach(e => {
        innerNos.push(e.innerNo)
      })
      this.$router.push({
        name: 'entrustStateTracking',
        params: {
          'iEFlag': this.iEFlag,
          'code': this.entrustForm.entrustCode,
          'setTitle': '状态跟踪-' + this.entrustForm.entrustCode,
          'setId': this.$route.name + this.entrustForm.entrustCode
        },
        query: {
          'innerNos': innerNos.join(',')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/common';
.entrust-main {
  padding: 20px;
  font-size:12px;
  font-family: Arial,Microsoft YaHei,SimSun;
  height: calc(100% - 40px);
  overflow: auto;
}
.entrust-panel{
  background-color: #fff;
  padding: 20px 20px 2px;
  margin-bottom: 20px;
}
.entrust-title{
  font-size: 16px;
  margin-bottom: 15px;
}
.entrust-info-panel{
  border: 1px solid #d8d8d8;
  padding: 20px 20px 0;
  margin-bottom: 20px;
  position: relative;
}
.info-txts{
  word-break: break-all;
  color: #4c4c4c;
}
.panel-close{
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
}
.status-icon{
  display: inline-block;
  width: 61px;
  height: 61px;
  position: absolute;
  right: -10px;
  top: -10px;
}
.status-icon-pend{
  background: url('https://www.5itrade.cn/files/CCBA/pendOrder.png') no-repeat;
}
.status-icon-already{
  background: url('https://www.5itrade.cn/files/CCBA/alreadyOrder.png') no-repeat;
}
.splitLine{
  height: 1px;
  background-color: #d8d8d8;
  margin-bottom: 18px;
}
.mg-b-15{
  margin-bottom: 15px;
}
.mg-b-18{
  margin-bottom: 18px;
}
.mg-b-20{
  margin-bottom: 20px;
}
.dec-i{
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-right: 5px;
}
.list-btns{
  margin-left: 0;
}
.entrust-detail-tit{
  display: inline-block;
  line-height: 30px;
  color: #4c4c4c;
  font-size: 14px;
  padding-left: 18px;
}
</style>
