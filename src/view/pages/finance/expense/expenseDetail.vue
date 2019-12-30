<template>
  <section class='sys-main expenseDetail' ref="container">
    <div class="topFlag list-icon-Tips flex" v-if="optionsType === 'look' && decCommon.verifyMsg">
      <i></i>
      <div class="one-row">
        <div class="left">审核意见&nbsp;:</div>
        <div class="right">{{decCommon.verifyMsg}}</div>
      </div>
    </div>
    <div class="decDetail area">
      <div class="title">报关单/订单详情</div>
      <!-- 台账查看时报关单详情区域 -->
      <div class="content" v-if="optionsType === 'look' || optionsType === 'check' || optionsType === 'edit'">
        <el-row class="line up">
          <el-col :span="6">
            <div class="one-row">
              <div class="left">接单编号&nbsp;:</div>
              <div class="right">{{decCommon.innerNo || '-'}}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="one-row">
              <div class="left">报关单号&nbsp;:</div>
              <div class="right">{{decCommon.cusCiqNo || '-'}}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="one-row">
              <div class="left">提单号&nbsp;:</div>
              <div class="right">{{decCommon.billNo || '-'}}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="one-row">
              <div class="left">客户业务号&nbsp;:</div>
              <div class="right">{{decCommon.corpBusiNo || '-'}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="down" v-if="JSON.stringify(decDetail) !== '{}'">
          <el-col :span="6" class="flex" v-for="(value, key) in decDetail" :key="key">
            <div class="left">{{value.keyName || '-'}}&nbsp;:&nbsp;</div>
            <div class="right">{{value.keyValue || '-'}}</div>
          </el-col>
        </el-row>
        <!-- 申报异常 -->
        <el-row v-if="decCommon.msg">
          <div class="one-row normal">
            <div class="left">申报异常&nbsp;:</div>
            <div class="right red">{{decCommon.msg}}</div>
          </div>
        </el-row>
      </div>
      <!-- 台账新增时表单录入 -->
      <el-row class='query-condition addForm' v-if="optionsType === 'add'">
        <el-form label-width="75px" :rules="ruleForm" :model="addForm" ref="addForm" size="mini" label-position="left" @keyup.enter.native="nextInputFocus">
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="接单编号">
                <el-input v-model="addForm.orderNo" size="mini" clearable :maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="报关单号">
                <el-input size="mini" clearable v-model="addForm.decNo" :maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="提单号">
                <el-input size="mini" clearable v-model="addForm.billNo" :maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="业务类型">
                <el-select v-model="addForm.businessType" size="mini" @change="updateDom" filterable default-first-option style="width:100%;">
                  <el-option key="1" :label="'报关'" :value="1"></el-option>
                  <el-option key="2" :label="'货代'" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="开航日" class="formDatePicker">
                <el-date-picker
                  :disabled="addForm.businessType === 1 || !addForm.businessType"
                  @blur="switchInput('dates1')"
                  style="width:100%"
                  v-model="dates1"
                  default-value
                  type="date"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <div class="hidden-input" style="width:100%">
                  <el-input
                    :disabled="addForm.businessType === 1 || !addForm.businessType" placeholder=""
                    @clear="removeDate('dates1')"
                    prefix-icon="el-icon-date" ref="dates1"
                    v-model="dates1" clearable>
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="放行时间" class="formDatePicker">
                <el-date-picker
                  :disabled="addForm.businessType === 2 || !addForm.businessType"
                  @blur="switchInput('dates2')"
                  style="width:100%"
                  v-model="dates2"
                  type="date"
                  default-value
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <div class="hidden-input" style="width:100%">
                  <el-input
                    :disabled="addForm.businessType === 2 || !addForm.businessType" placeholder=""
                    @clear="removeDate('dates2')"
                    prefix-icon="el-icon-date" ref="dates2"
                    v-model="dates2" clearable>
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="委托企业" prop="entrustCompanyName">
                <!-- <el-select v-model="addForm.entrustCompanyName" style="width:100%"
                  filterable remote clearable
                  :remote-method="getcorps"
                  allow-create
                  default-first-option >
                  <el-option
                    v-for="item in corpList"
                    :key="item.corpId"
                    :label="item.corpName"
                    :value="item.corpName">
                  </el-option>
                </el-select> -->
                <el-autocomplete style="width:100%;"
                  class="inline-input" :maxlength="30" clearable
                  v-model="addForm.entrustCompanyName"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  placeholder="请选择">
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="进出口">
                <el-select v-model="addForm.iEFlag" size="mini" filterable default-first-option style="width:100%;" @change="addIEflag">
                  <el-option key="0" :label="'进口'" :value="0"></el-option>
                  <el-option key="1" :label="'出口'" :value="1"></el-option>
                  <el-option v-show="addForm.businessType === 2 || !addForm.businessType" key="2" :label="'内贸'" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 查询条件 end-->
        </el-form>
      </el-row>
    </div>
    <!-- 应收费用区域 -->
    <div class="receive area">
      <div class="title">应收费用</div>
      <el-row class="table-btn" v-if="optionsType === 'edit' || optionsType === 'add'">
        <el-button size="mini" class="list-btns list-icon-add" @click="quotationAdd(true)"><i></i>新增</el-button>
        <!-- 使用报价选项 -->
        <el-dropdown trigger="click" @command="getOfferReceive" placement="bottom-start">
          <el-button size="mini" class="list-btns list-icon-useOffer">
            <i></i>使用报价
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <div class="item-scroll">
              <div class="scroll-hidden">
                <el-dropdown-item v-for="item in billReceivableBodyVO.billQuotationRespVOs" :command="item" :key="item.quotationId">{{item.itemName+'-'+item.entrustCompanyName}}</el-dropdown-item>
              </div>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
      <div class='query-table-finance'>
        <el-form ref="receiveTableForm" :model="billReceivableBodyVO" :show-message="false" @keyup.enter.native="nextInputFocus">
          <el-table size="mini" :class="{'sys-table-table': true, 'borderRightDeep': optionsType==='edit' || optionsType==='add'}" row-key="expenseBillOptionId" :cell-class-name="((optionsType==='edit' || optionsType==='add') && getCellStyle) || ''" align="left" :data="billReceivableBodyVO.billReceivableBodyVOList" border>
            <el-table-column type="index" label="序号" width="50" align="center">
            </el-table-column>
            <el-table-column prop="feeOptionName" label="费用名称" width="130px">
              <template slot-scope="scope">
                <div class="table-select" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item
                    :prop="'billReceivableBodyVOList.'+ scope.$index + '.feeOptionName'"
                    :rules="valid.feeOptionName">
                    <el-select size="mini" placeholder="请选择费用名称" clearable filterable default-first-option v-model="scope.row.feeOptionName" style="width:100%;" @change="getRate(scope.row)">
                      <el-option v-for="item in optionsList"
                        :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.feeOptionName || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="feePrice" label="计费单价" align="right" min-width="140">
              <template slot-scope="scope">
                <div class="table-select align-r" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item
                    :prop="'billReceivableBodyVOList.'+ scope.$index + '.feePrice'"
                    :rules="valid.price">
                    <el-input clearable v-model="scope.row.feePrice" @change="computeTaxPrice(scope.row)"></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.feePrice || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unit" width="100" label="计量单位" align="center">
              <template slot-scope="scope">
                <div class="table-select align-c" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item :prop="'billReceivableBodyVOList.'+ scope.$index + '.unit'" :rules="valid.unit">
                    <el-select  v-model="scope.row.unit" placeholder="计量单位"
                      filterable remote default-first-option clearable
                      @focus="tipsFill('unitList','SAAS_SEA_UNIT', 'unitR'+ scope.$index)"
                      :remote-method="checkParamsList"
                      style="width:100%">
                      <el-option
                        v-for="item in unitList['unitR'+ scope.$index]"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.unitValue || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="curr" width="120" label="币制" align="center">
              <template slot-scope="scope">
                <div class="table-select align-c" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <!-- <el-select  v-model="scope.row.curr" placeholder="币制"
                    filterable remote default-first-option clearable
                    @focus="tipsFill('currList', 'SAAS_CURR', 'currR' + scope.$index)"
                    :remote-method="checkParamsList"
                    style="width:100%">
                    <el-option
                      v-for="item in currList['currR' + scope.$index]"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select> -->
                  <el-form-item>
                    <el-input  v-model="scope.row.curr" disabled></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.curr || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="num" width="100" label="数量" align="right">
              <template slot-scope="scope">
                <div class="table-select align-r" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item
                    :prop="'billReceivableBodyVOList.'+ scope.$index + '.num'"
                    :rules="valid.num">
                    <el-input v-model="scope.row.num" @change="computeTaxPrice(scope.row)"></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.num || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="rate" width="80" label="税率" align="right">
              <template slot-scope="scope">
                <div class="table-select align-c" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-select size="mini" placeholder="税率" style="width:100%;" filterable default-first-option v-model="scope.row.rate" @change="computeTaxPrice(scope.row)">
                    <el-option key="0" :label="'0%'" :value="0"></el-option>
                    <el-option key="6" :label="'6%'" :value="6"></el-option>
                    <el-option key="9" :label="'9%'" :value="9"></el-option>
                    <el-option key="13" :label="'13%'" :value="13"></el-option>
                  </el-select>
                </div>
                <div class="cell-div" v-else>{{typeof scope.row.rate === 'number' ? (scope.row.rate + '%') : '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="taxPrice" width="100" label="含税总价" align="right">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="settleCompanyName" min-width="160" label="结算企业" align="left">
              <template slot-scope="scope">
                <div class="table-select" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item :prop="'billReceivableBodyVOList.'+ scope.$index + '.settleCompanyName'" :rules="valid.settleCompanyName">
                    <el-input v-model="scope.row.settleCompanyName"></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.settleCompanyName || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="billType" width="100" label="类型" align="center">
              <template slot-scope="scope">
                <div class="cell-div">
                  {{scope.row.billType === 0 ? '自动登账' : scope.row.billType === 1 ? '手动登账' : '-'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="itemName" min-width="120" label="使用报价" align="center">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.itemName || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" width="100" label="操作人" align="center">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.createUserName || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="60" align="center" v-if="optionsType === 'edit' || optionsType === 'add'">
              <template slot-scope="scope">
                <div class="sys-td-c">
                  <el-button title="删除" type="text" @click="delItems(scope.row, true)" class="table-icon list-icon-delete"><i></i></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <!-- 应付费用区域 -->
    <div class="pay area">
      <div class="title">应付费用</div>
      <el-row class="table-btn" v-if="optionsType === 'edit' || optionsType === 'add'">
        <el-button size="mini" class="list-btns list-icon-add" @click="quotationAdd(false)"><i></i>新增</el-button>
        <!-- 使用报价选项 -->
        <!-- <el-dropdown trigger="click" @command="getOfferPay" placement="bottom-start">
          <el-button size="mini" class="list-btns list-icon-useOffer">
            <i class="other"></i>使用报价<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in billPayableBodyVO.billQuotationRespVOs" :command="item" :key="item.quotationId">{{item.itemName+'-'+item.entrustCompanyName}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </el-row>
      <div class='query-table-finance'>
        <el-form ref="payTableForm" :model="billPayableBodyVO" :show-message="false" @keyup.enter.native="nextInputFocus">
          <el-table size="mini" :class="{'sys-table-table': true, 'borderRightDeep': optionsType==='edit' || optionsType==='add'}" row-key="expenseBillOptionId" :cell-class-name="((optionsType==='edit' || optionsType==='add') && getCellStyle) || ''" :row-class-name="getRowStyle" align="left" :data="billPayableBodyVO.billPayableBodyVOList" border>
            <el-table-column type="index" label="序号" width="50" align="center">
            </el-table-column>
            <el-table-column prop="feeOptionName" label="费用名称" width="130">
              <template slot-scope="scope">
                <div class="table-select" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item
                    :prop="'billPayableBodyVOList.'+ scope.$index + '.feeOptionName'"
                    :rules="valid.feeOptionName">
                    <el-select size="mini" placeholder="请选择费用名称" clearable filterable default-first-option v-model="scope.row.feeOptionName" style="width:100%;" @change="getRate(scope.row)" :disabled="disabledCell(scope.row)">
                      <el-option v-for="item in optionsList"
                        :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.feeOptionName || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="feePrice" label="计费单价" align="right" min-width="140">
              <template slot-scope="scope">
                <div class="table-select align-r" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item
                    :prop="'billPayableBodyVOList.'+ scope.$index + '.feePrice'"
                    :rules="valid.price">
                    <el-input clearable v-model="scope.row.feePrice" @change="computeTaxPrice(scope.row)" :disabled="disabledCell(scope.row)"></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.feePrice || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unit" width="100" label="计量单位" align="center">
              <template slot-scope="scope">
                <div class="table-select align-c" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item :prop="'billPayableBodyVOList.'+ scope.$index + '.unit'" :rules="valid.unit">
                    <el-select  v-model="scope.row.unit" placeholder="计量单位" :disabled="disabledCell(scope.row)"
                      filterable remote default-first-option clearable
                      @focus="tipsFill('unitList','SAAS_SEA_UNIT', 'unitP' + scope.$index)"
                      :remote-method="checkParamsList"
                      style="width:100%">
                      <el-option
                        v-for="item in unitList['unitP' + scope.$index]"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.unitValue || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="curr" width="120" label="币制" align="center">
              <template slot-scope="scope">
                <div class="table-select align-c" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <!-- <el-select  v-model="scope.row.curr" placeholder="币制" :disabled="disabledCell(scope.row)"
                    filterable remote default-first-option clearable
                    @focus="tipsFill('currList','SAAS_CURR', 'currP' + scope.$index)"
                    :remote-method="checkParamsList"
                    style="width:100%">
                    <el-option
                      v-for="item in currList['currP' + scope.$index]"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select> -->
                  <el-form-item>
                    <el-input  v-model="scope.row.curr" disabled></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.curr || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="num" width="100" label="数量" align="right">
              <template slot-scope="scope">
                <div class="table-select align-r" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-form-item
                    :prop="'billPayableBodyVOList.'+ scope.$index + '.num'"
                    :rules="valid.num">
                    <el-input v-model="scope.row.num" @change="computeTaxPrice(scope.row)" :disabled="disabledCell(scope.row)"></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.num || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="rate" width="80" label="税率" align="right">
              <template slot-scope="scope">
                <div class="table-select align-c" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <el-select size="mini" placeholder="税率" style="width:100%;" filterable default-first-option v-model="scope.row.rate" @change="computeTaxPrice(scope.row)" :disabled="disabledCell(scope.row)">
                    <el-option key="0" :label="'0%'" :value="0"></el-option>
                    <el-option key="6" :label="'6%'" :value="6"></el-option>
                    <el-option key="9" :label="'9%'" :value="9"></el-option>
                    <el-option key="13" :label="'13%'" :value="13"></el-option>
                  </el-select>
                </div>
                <div class="cell-div" v-else>{{typeof scope.row.rate === 'number' ? (scope.row.rate + '%') : '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="taxPrice" width="100" label="含税总价" align="right">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="settleCompanyName" min-width="160" label="结算企业" align="left">
              <template slot-scope="scope">
                <div class="table-select" v-if="optionsType === 'edit' || optionsType === 'add'">
                  <!-- <el-input v-model="scope.row.settleCompanyName"></el-input> -->
                  <el-form-item :prop="'billPayableBodyVOList.'+ scope.$index + '.settleCompanyName'" :rules="valid.settleCompanyName">
                    <el-select size="mini" v-model="scope.row.settleCompanyName" style="width:100%;" filterable default-first-option @change="getSetComId(scope.row)" :disabled="disabledCell(scope.row)">
                      <el-option v-for="item in contractCorpList" :key="item.settleCompanyId" :value="item.settleCompanyName" :label="item.settleCompanyName"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.settleCompanyName || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="billType" width="100" label="类型" align="center">
              <template slot-scope="scope">
                <div class="cell-div">
                  {{scope.row.billType === 0 ? '自动登账' : scope.row.billType === 1 ? '手动登账' : '-'}}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="itemName" min-width="120" label="使用报价" align="center">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.itemName || '-'}}</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="statusValue" min-width="100" label="请款状态" align="center">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.statusValue || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" width="100" label="操作人" align="center">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.createUserName || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="60" align="center" v-if="optionsType === 'edit' || optionsType === 'add'">
              <template slot-scope="scope">
                <div class="sys-td-c">
                  <el-button title="提前请款" type="text" v-if="![0, 1].includes(scope.row.status) && optionsType === 'edit'" @click="advanceFun(scope.row, scope.$index)" class="table-icon list-icon-approval"><i></i></el-button>
                  <el-button title="删除" type="text" v-if="![0, 1].includes(scope.row.status)" @click="delItems(scope.row, false)" class="table-icon list-icon-delete"><i></i></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <!-- 电子票据上传区域 -->
    <div class="area bill-upload">
      <div class="title">电子票据</div>
      <el-upload
        :multiple="true"
        class="upload-demo"
        action="http://127.0.0.1"
        :show-file-list="false"
        :http-request="beforeUpload">
        <el-button :disabled="!isAllowUp" size="mini" v-if="!(optionsType==='look' || optionsType==='check')" class="list-btns list-icon-upload"><i></i>点击上传</el-button>
        <div slot="tip" v-if="!(optionsType==='look' || optionsType==='check')" class="el-upload__tip"><div class="upload-f">注:只能上传jpeg/jpg/png文件, 且不超过4M/张, 最多上传8张</div></div>
      </el-upload>
      <transition-group name="list-complete" tag="div" class="img-box">
        <div class="img-item list-complete-item" v-for="item in fileList" :key="item.elecUrl">
          <img :src="item.elecUrl" :alt="item.elecName">
          <div class="img-modal">
            <i class="op-icon el-icon-search" @click="handlePictureCardPreview(item.elecUrl)"></i>
            <i class="op-icon el-icon-delete" v-if="!(optionsType==='look' || optionsType==='check')" @click="handleRemove(item)"></i>
          </div>
        </div>
      </transition-group>
      <el-dialog :modal-append-to-body="false" :visible.sync="dialogImgVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
    <!-- 汇总区域 -->
    <div class="all area">
      <div class="title">汇总</div>
      <el-row class="companyItems" v-for="(item, index) in summarysSum" :key="'index' + index">
        <el-col class="company" :span="8">{{item.companyName || '-'}}</el-col>
        <el-col :span="item.pay.length>0?8:16" class="pull-right" v-if="item.receive.length>0">
          <div class="right">
            <!-- <span>应收&nbsp;:&nbsp;</span> -->
            <span class="receive" v-for="(item2, index2) in item.receive" :key="'item'+index2">{{(item2.currName || '-') +' '+ item2.sum}}</span>
          </div>
          <div class="left">应收&nbsp;:&nbsp;</div>
        </el-col>
        <el-col :span="item.receive.length>0?8:16" class="pull-right" v-if="item.pay.length>0">
          <div class="right">
            <!-- <span>应付&nbsp;:&nbsp;</span> -->
            <span class="pay" v-for="(item3, index3) in item.pay" :key="'evy'+index3">{{(item3.currName || '-') +' '+ item3.sum}}</span>
          </div>
          <div class="left">应付&nbsp;:&nbsp;</div>
        </el-col>
      </el-row>
    </div>
    <!-- 备注 -->
    <div class="area">
      <div class="title">备注</div>
      <div class="remark-content" v-if="decCommon.remark">{{decCommon.remark}}</div>
    </div>
    <div class="area" v-if="optionsType === 'check'">
      <div class="title">审核意见</div>
      <el-row>
        <el-input type="textarea" :rows="4" v-model="verifys" :maxlength="200" show-word-limit></el-input>
      </el-row>
    </div>
    <div class="submit" v-if="optionsType === 'check'">
      <el-row style="text-align:center">
        <el-button size="mini"  @click="expenseCheck('rejects')">审核驳回</el-button>
        <el-button size="mini" type="primary" class="longButton"  @click="expenseCheck('verifys')">审核通过</el-button>
      </el-row>
    </div>
    <div class="submit" v-if="optionsType === 'edit'">
      <el-row style="text-align:center">
        <el-button size="mini" type="primary" @click="submitBtn('1')">暂存</el-button>
        <el-button size="mini" type="primary" @click="submitBtn('1')">提交</el-button>
        <el-button size="mini"  @click="cancelEdit">取消</el-button>
        <el-button size="mini" type="primary" v-if="status === 4 || status === 7 || status === 6 || (status === 1 && isNeed) || status === 0"  @click="submitBtn('2')">发送审核</el-button>
      </el-row>
    </div>
    <div class="submit" v-if="optionsType === 'add'">
      <el-row style="text-align:center">
        <el-button size="mini" type="primary" @click="sandCheck('1')">提交</el-button>
        <el-button size="mini"  @click="cancelEdit">取消</el-button>
        <!-- <el-button size="mini" type="primary" v-if="swtichCheck === 'Y'" @click="sandCheck('2')">发送审核</el-button> -->
      </el-row>
    </div>
    <el-dialog :modal-append-to-body="false" title="提前请款" :visible.sync="advanceFundsShow" :close-on-click-modal='false' width="550px">
      <el-form :label-width="labelFormWidth.five" size="mini" :model="advanceForm" ref="advanceForm" :rules="addvanceRule">
        <el-form-item label="请款金额">
          <div>{{advanceForm.curr}}&nbsp;{{advanceForm.fundAmount.toLocaleString()}}</div>
        </el-form-item>
        <el-form-item label="请款原因" prop="rmk">
          <el-input type="textarea" rows="4" v-model="advanceForm.rmk"></el-input>
        </el-form-item>
      </el-form>
      <el-row class="query-btn dialog-btn" style="text-align:center;font-size: 0px;">
        <el-button size="mini" type="primary" @click="confirmFun">确定</el-button>
        <el-button size="mini" @click="advanceFundsShow=false">取消</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
import uploadBill from './uploadBill'
export default {
  mixins: [uploadBill],
  data () {
    return {
      iEFlag: '',
      isNeed: false,
      isValid: false,
      optionsType: 'look', // 记录当前操作类型
      payablefeeOptions: {},
      businessType: '', // 类型
      verifys: '', // 审核意见
      swtichCheck: '', // 台账后台开关是否开启
      status: '', // 审核退回的台账
      receivablefeeOptions: {},
      billPayableBodyVO: { // 应付
        billQuotationRespVOs: [],
        billPayableBodyVOList: [] // 下拉列表
      },
      billReceivableBodyVO: { // 应收
        billQuotationRespVOs: [], // 下拉列表
        billReceivableBodyVOList: [] // 表格数据
      },
      expenseBillElecId: '',
      addForm: {
        billNo: '', // 提单号
        businessType: 1, // 业务类型 1报关，2货代
        decNo: '', // 报关单号
        entrustCompanyName: '', // 委托企业名称
        expenseBillId: '',
        iEFlag: 0, // 进出口0进口1出口2内贸
        orderNo: '', // 接单编号
        releaseDay: '', // 放行日
        sailDay: '' // 开航日
      },
      dates1: '', // 开航日
      dates2: '', // 放行日
      corpList: [], // 存储委托企业列表
      decDetail: {}, // 报关单详情
      decCommon: {}, // 报关单详情固定字段
      summarys: [], // 费用汇总
      optionsList: [], // 费用项列表
      currList: {
        curr0: []
      }, // 币制
      unitList: { // 计量单位
        unit0: []
      },
      // 查询的字典字段
      tableNameList: {
        tableNames: [
          'SAAS_CURR', // 币制
          'SAAS_SEA_UNIT' // 计量单位
        ]
      },
      selectObj: {
        obj: '',
        params: ''
      },
      copyData: {
        billOptionPayVOs: [],
        billOptionReceiveVOs: []
      },
      template: {
        serialNo: '',
        feeOptionName: '',
        feePrice: '',
        unit: '',
        curr: 'CNY',
        num: '',
        rate: 0,
        taxPrice: '',
        settleCompanyName: '',
        billType: 1,
        itemName: '',
        createUserName: '',
        status: ''
      },
      // {pattern: /^\d{1,9}(\.\d{1,3})?$|^$/,validator: priceValid,message:'小数点支持前9位,后3位',trigger:'blur'}
      valid: {
        price: {validator: this.priceValid, message: '小数点支持前9位,后3位', trigger: 'blur'},
        num: {validator: this.numValid, message: '小数点支持前9位,后3位', trigger: 'blur'},
        feeOptionName: {validator: this.feeOptionValid, message: '费用名称不能为空', trigger: 'change'},
        unit: {validator: this.feeOptionValid, message: '计量单位不能为空', trigger: 'change'},
        settleCompanyName: {validator: this.feeOptionValid, message: '结算企业不能为空', trigger: 'change'}
      },
      ruleForm: { // 新建台账表格校验
        entrustCompanyName: [{required: true, message: '请输入委托企业', trigger: 'change'}]
      },
      selectDown: {
        curr: {downList: 'currList', params: 'SAAS_CURR'},
        unit: {downList: 'unitList', params: 'SAAS_SEA_UNIT'}
      },
      expenseBillId: '', // 接单查看详情返回的
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      allInput: [],
      fixInput: [],
      advanceFundsShow: false, // 提前请款弹窗
      advanceForm: {
        curr: '',
        expenseBillId: '',
        expenseBillOptionId: '',
        feeFlag: false,
        feeOptionName: '',
        feePid: '',
        feePrice: '',
        fundAmount: '',
        itemName: '',
        num: '',
        rate: '',
        rmk: '',
        settleCompanyId: '',
        settleCompanyName: '',
        taxPrice: '',
        unit: ''
      }, // 提前请款
      addvanceRule: {
        rmk: [{required: true, message: '请输入请款原因', trigger: 'blur'}]
      }, // 提前请款校验
      contractCorpList: [], // 应付结算企业
      currIndex: null,
      currentRowIndex: null // 当前所在行
    }
  },
  mounted () {
    let tempInput = null
    if (this.optionsType === 'add') {
      tempInput = this.$refs.container.querySelectorAll('.addForm input:not([disabled=disabled])')
    }
    if (this.optionsType === 'edit') {
      tempInput = this.$refs.container.querySelectorAll('td:not(.is-hidden) input:not([disabled=disabled])')
    }
    if (tempInput) {
      this.fixInput = Array.from(tempInput)
      this.allInput = [...this.fixInput]
    }
    this.optionsType === 'add' && this.allInput[0].focus()
  },
  created () {
    let {type, iEFlag, expenseBillId, innerNo, status, businessType} = this.$route.query
    this.iEFlag = iEFlag
    this.businessType = +businessType || 2
    if (type === 'edit') {
      this.getCommonParam(() => {
        expenseBillId ? this.getBillDetail(expenseBillId) : this.getBillDetail('', innerNo)
      })
      this.status = +status
      this.justyIsOpen()
    }
    if (type === 'add') {
      this.getCommonParam()
      this.getQuotationsByAdd()
      this.justyIsOpen()
      this.iEFlag = this.addForm.iEFlag
    }
    if (type === 'look' || type === 'check' || type === 'upload') {
      this.getCommonParam(() => {
        this.getBillDetail(expenseBillId)
      })
    }
    this.optionsType = type
    this.getOptionList()
    this.getContractCorps()
  },
  watch: {
    '$route.query.type': function () {
      this.optionsType = this.$route.query.type
    },
    'billPayableBodyVO.billPayableBodyVOList.length': function () { // 更新dom节点
      this.$nextTick(() => {
        let payInput = this.$refs.container.querySelectorAll('td:not(.is-hidden) input:not([disabled=disabled])')
        this.allInput = [...this.fixInput, ...Array.from(payInput)]
      })
    },
    'billReceivableBodyVO.billReceivableBodyVOList.length': function () { // 更新dom节点
      this.$nextTick(() => {
        let reInput = this.$refs.container.querySelectorAll('td:not(.is-hidden) input:not([disabled=disabled])')
        this.allInput = [...this.fixInput, ...Array.from(reInput)]
      })
    },
    '$route': function (to) { // 当前页签隐藏时,存储的input地址发生改变需重新获取
      if (to.name === 'expense-detail') {
        this.$nextTick(() => {
          if (this.optionsType === 'add') {
            let addFormInput = this.$refs.container.querySelectorAll('.addForm input:not([disabled=disabled])')
            this.fixInput = Array.from(addFormInput)
          } else {
            this.fixInput = []
          }
          this.allInput = [...this.fixInput]
          if (this.billPayableBodyVO.billPayableBodyVOList.length > 0) {
            let payInput = this.$refs.container.querySelectorAll('td:not(.is-hidden) input:not([disabled=disabled])')
            this.allInput = [...this.fixInput, ...Array.from(payInput)]
          }
          if (this.billReceivableBodyVO.billReceivableBodyVOList.length > 0) {
            let reInput = this.$refs.container.querySelectorAll('td:not(.is-hidden) input:not([disabled=disabled])')
            this.allInput = [...this.fixInput, ...Array.from(reInput)]
          }
          this.optionsType === 'add' && this.allInput[0].focus()
        })
      }
    }
  },
  computed: {
    summarysSum: function () {
      // 根据企业分类汇总
      let arrAll = [...this.billPayableBodyVO.billPayableBodyVOList, ...this.billReceivableBodyVO.billReceivableBodyVOList]
      let allCompany = arrAll.map(v => v.settleCompanyName)
      let uniqueCompany = [...new Set(allCompany)] // 企业去重
      let newArr = []
      // 根据公司名称分类
      uniqueCompany.forEach(v => {
        let temp1 = arrAll.filter(item => (item.settleCompanyName === v && item.feeFlag)) // 应收
        let temp2 = arrAll.filter(item => (item.settleCompanyName === v && !item.feeFlag)) // 应付
        // 根据币制分类汇总
        let currReceiveAll = [...new Set(temp1.map(v => v.curr))]
        let currPayAll = [...new Set(temp2.map(v => v.curr))]
        let tempArr1 = this.getCategory(currReceiveAll, temp1)
        let tempArr2 = this.getCategory(currPayAll, temp2)
        let obj = {
          companyName: v,
          receive: tempArr1,
          pay: tempArr2
        }
        newArr.push(obj)
      })
      return newArr
    }
  },
  methods: {
    // 台账新增时,绑定进出口
    addIEflag () {
      this.iEFlag = this.addForm.iEFlag
    },
    // 清空按钮时,清除真正的picker的数据
    removeDate (date) {
      this[date] = ''
    },
    // picker有值时切换下一个input
    switchInput (date) {
      if (this[date]) {
        this.$refs[date].focus()
        this.$refs[date].select()
      }
    },
    // 更具业务类型重新选择没有disable的input
    updateDom () {
      this.businessType === 1 ? this.dates1 = '' : this.dates2 = ''
      this.$nextTick(() => {
        let addFormInput = this.$refs.container.querySelectorAll('.addForm input:not([disabled=disabled])')
        this.fixInput = Array.from(addFormInput)
        this.allInput.splice(0, this.fixInput.length)
        this.allInput.unshift(...this.fixInput)
      })
    },
    // 下一个input聚焦
    nextInputFocus (e) {
      let temp = e.target
      let index = this.allInput.indexOf(temp)
      if (index > -1 && index < this.allInput.length - 1) {
        this.allInput[index + 1].focus()
        this.allInput[index + 1].select()
      }
    },
    // 获取台账明细
    getBillDetail (id, No) {
      let params = {}
      let url = ''
      if (id) { // 台账列表跳转
        params.expenseBillId = id
        params.businessType = this.businessType
        url = 'bill/get'
      }
      if (No) { // 货代跳转
        params.billNo = No
        url = 'bill/getByDec'
      }
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/' + url,
        data: params,
        router: this.$router,
        success: (res) => {
          if (res.result && JSON.stringify(res.result) !== '{}') {
            let {billPayableBodyVO, billReceivableBodyVO, result, elecVOs, summarys, billNo, isNeed, cusCiqNo, innerNo, corpBusiNo, remark, msg, verifyMsg} = res.result
            this.billPayableBodyVO.billPayableBodyVOList = billPayableBodyVO.billPayableBodyVOList || []
            this.billPayableBodyVO.billQuotationRespVOs = billPayableBodyVO.billQuotationRespVOs || []
            this.billReceivableBodyVO.billReceivableBodyVOList = billReceivableBodyVO.billReceivableBodyVOList || []
            this.billReceivableBodyVO.billQuotationRespVOs = billReceivableBodyVO.billQuotationRespVOs || []
            this.isNeed = isNeed
            this.fileList = elecVOs || []
            if (Array.isArray(result) && result.length > 0) {
              this.businessType === 1 && (this.decDetail = result[0])
              if (this.businessType === 2) { // 解构
                let tempObj = {}
                result.forEach(v => {
                  for (let k in v) {
                    if (v[k]) {
                      tempObj[k] = v[k]
                    }
                  }
                })
                this.decDetail = tempObj
              }
            } else {
              this.decDetail = {}
            }
            this.decCommon = {billNo, cusCiqNo, innerNo, msg, verifyMsg, remark, corpBusiNo}
            this.summarys = summarys || []
            // 翻译
            this.initSelected(this.billPayableBodyVO.billPayableBodyVOList, 'P', 0)
            this.initSelected(this.billReceivableBodyVO.billReceivableBodyVOList, 'R', 0)
            // 复制数据
            this.copyData.billOptionPayVOs = JSON.parse(JSON.stringify(this.billPayableBodyVO.billPayableBodyVOList))
            this.copyData.billOptionReceiveVOs = JSON.parse(JSON.stringify(this.billReceivableBodyVO.billReceivableBodyVOList))
            // 根据接单编号查询的详情
            res.result.expenseBillId && (this.expenseBillId = res.result.expenseBillId)
          }
        }
      })
    },
    // 获取费用名称下拉列表
    getOptionList () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/option/getAll',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.optionsList = result || []
        }
      })
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
      let {obj, params, index} = this.selectObj
      let temp = []
      if (query !== '') {
        let keyValue = query.toString().trim()
        let list = JSON.parse(localStorage.getItem(params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          temp = list.slice(0, 40)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          temp = filterList.slice(0, 40)
        }
      } else {
        if (!util.isEmpty(JSON.parse(localStorage.getItem(params)))) {
          temp = JSON.parse(localStorage.getItem(params)).slice(0, 40)
        }
      }
      // 添加响应式
      if (index) {
        this[obj][index] = temp
        this.$delete(this[obj], index)
        this.$set(this[obj], index, temp)
      } else {
        this[obj] = temp
      }
    },
    // 创建字典参数列表
    tipsFill (obj, params, index) {
      this.selectObj = {
        obj,
        params,
        index
      }
    },
    // 获取单元格样式
    getCellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 4 || columnIndex === 7 || (columnIndex >= 9 && columnIndex < 12)) {
        return 'cell-disable'
      }
    },
    getRowStyle ({row, rowIndex}) {
      if ((row.status === 0 || row.status === 1) && this.optionsType !== 'look') {
        return 'row-disable'
      }
    },
    disabledCell (data) {
      return data.status === 0 || data.status === 1
    },
    // 获取应收基础报价
    getOfferReceive (item) {
      // 查询报价应收/应付
      this.receivablefeeOptions = item
      this.getQuotationDetail(true, this.iEFlag, item.quotationId)
    },
    // 获取应付基础报价
    getOfferPay (item) {
      // 查询报价应收/应付
      this.payablefeeOptions = item
      this.getQuotationDetail(false, this.iEFlag, item.quotationId)
    },
    getQuotationDetail (feeFlag, iEFlag, quotationId) {
      let fee = feeFlag ? 'receivablefeeOptions' : 'payablefeeOptions'
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/getQuotationDetail',
        data: {
          feeFlag, // 应收true，应付false
          iEFlag,
          quotationId
        },
        router: this.$router,
        success: ({result}) => {
          if (result && result[fee] && result[fee].length > 0) {
            result[fee].forEach(v => {
              v.settleCompanyName = this[fee].entrustCompanyName
              v.billType = 1
              v.itemName = this[fee].itemName
              // 单位为票/次 数量默认为1
              ;(v.unit === '35' || v.unit === '38') ? v.num = 1 : v.num = ''
              // 单位为页
              if (v.unit === '36' && this.decDetail.goodNum) {
                let val = this.decDetail.goodNum.keyValue || ''
                if (val < 6) { // 0 或小数
                  v.num = 1
                } else if (val % 6 === 0) { // 整除
                  v.num = parseInt(val / 6)
                } else { // 向上取整
                  v.num = Math.ceil(val / 6)
                }
              }
              // 计算总价
              this.computeTaxPrice(v)
              v.feeFlag = feeFlag
            })
            // 计算追加后数组的长度,处理下拉列表属性值能够有序的增加 eg: curr0,curr1 ...
            let preLength = feeFlag ? this.billReceivableBodyVO.billReceivableBodyVOList.length : this.billPayableBodyVO.billPayableBodyVOList.length
            this.initSelected(result[fee], fee.substring(0, 1).toUpperCase(), preLength)
            feeFlag ? this.billReceivableBodyVO.billReceivableBodyVOList.push(...result[fee]) : this.billPayableBodyVO.billPayableBodyVOList.push(...result[fee])
          }
        }
      })
    },
    // 新增单条
    quotationAdd (feeFlag) {
      let obj = {...this.template}
      obj.feeFlag = feeFlag
      feeFlag ? this.billReceivableBodyVO.billReceivableBodyVOList.push(obj) : this.billPayableBodyVO.billPayableBodyVOList.push(obj)
    },
    // 提交编辑
    submitBtn (flag) {
      // 表单验证
      let pass1 = false
      let pass2 = false
      this.$refs['receiveTableForm'].validate(valid => {
        if (!valid) pass1 = true
      })
      this.$refs['payTableForm'].validate(valid => {
        if (!valid) pass2 = true
      })
      if (pass1 || pass2) return
      let url = flag === '1' ? 'bill/edit' : 'bill/send'
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/' + url,
        data: {
          expenseBillId: this.$route.query.expenseBillId,
          billOptionPayVOs: [...this.billPayableBodyVO.billPayableBodyVOList],
          billOptionReceiveVOs: [...this.billReceivableBodyVO.billReceivableBodyVOList],
          elecCreateVOs: [...this.fileList]
        },
        router: this.$router,
        success: res => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          // this.getBillDetail(this.$route.query.expenseBillId)
          this.$store.dispatch('CloseTab', this.$route.query.setId)
          this.$router.push({
            name: 'expense-list',
            query: {
              from: 'other'
            }
          })
        }
      })
    },
    // 取消编辑
    cancelEdit () {
      this.$refs['receiveTableForm'].clearValidate()
      this.$refs['payTableForm'].clearValidate()
      if (this.optionsType === 'edit') {
        this.billReceivableBodyVO.billReceivableBodyVOList = JSON.parse(JSON.stringify(this.copyData.billOptionReceiveVOs))
        this.billPayableBodyVO.billPayableBodyVOList = JSON.parse(JSON.stringify(this.copyData.billOptionPayVOs))
      } else {
        this.billReceivableBodyVO.billReceivableBodyVOList = []
        this.billPayableBodyVO.billPayableBodyVOList = []
        this.addForm = {
          billNo: '',
          businessType: 1,
          decNo: '',
          entrustCompanyName: '',
          expenseBillId: '',
          iEFlag: 0,
          orderNo: '',
          releaseDay: '',
          sailDay: ''
        }
      }
    },
    // 千分符转换成数字
    dealMullimeter (num) {
      if (typeof num === 'string') {
        if (num.indexOf(',') > -1) {
          return +(num.replace(/,/g, ''))
        } else {
          return +num || 0
        }
      } else if (typeof num === 'number') {
        return num
      } else {
        return 0
      }
    },
    // 处理toFixed 4舍5不入的问题 eg: 5.22556 => 5.226
    changeFixed (temp) {
      let reg = /\d+(\.\d{3}5){1}/
      if (reg.test(temp)) { // 小数点第四位为5的话自动+1
        let arr = temp.toString().split('.')
        let tempLeft = arr[0]
        let tempRight = +arr[1].substring(0, 4) + 1
        temp = tempLeft + '.' + tempRight
      }
      return +temp || 0
    },
    computeTaxPrice (row) {
      let priceReg = !row.feeFlag ? /^-\d{1,10}(\.\d{1,3})?$|^\d{1,10}(\.\d{1,3})?$/ : /^\d{1,10}(\.\d{1,3})?$|^$/ // 小数点前10后3
      let numFeg = /^\d{1,9}(\.\d{1,3})?$|^$/ // 小数点前9后3
      if (!priceReg.test(+row.feePrice) || !numFeg.test(+row.num)) return // 避免为NaN的情况
      let temp = row.num * row.feePrice * (1 + (+row.rate) / 100)
      row.taxPrice = temp
    },
    delItems (row, feeFlag) {
      let fee = feeFlag ? 'billReceivableBodyVO' : 'billPayableBodyVO'
      let index = this[fee][fee + 'List'].findIndex(item => row === item)
      this[fee][fee + 'List'].splice(index, 1)
      // 动态创建的属性值发生变化,重新翻译
      feeFlag ? this.initSelected(this[fee][fee + 'List'], 'R', 0) : this.initSelected(this[fee][fee + 'List'], 'P', 0)
    },
    getRate (row) {
      if (row.feeOptionName) {
        let temp = this.optionsList.find(item => item.feeOptionName === row.feeOptionName)
        row.rate = temp.feeRate
        // 新增一条时,添加feePid
        !row.feePid && (row.feePid = temp.feePid)
        // 总价发生变化
        this.computeTaxPrice(row)
      }
    },
    // 数组求和
    getSum (arr) {
      if (arr.length === 0) {
        return '0'
      }
      if (arr.length === 1) {
        return this.dealMullimeter(arr[0]).toLocaleString()
      }
      return arr.reduce((prev, curr, idx, arr) => {
        return (this.dealMullimeter(prev) + this.dealMullimeter(curr)).toLocaleString()
      })
    },
    // 以货币分类汇总
    getCategory (uniqueArr, allArr) {
      let tempArr1 = []
      uniqueArr.forEach(i => {
        let temp3 = allArr.filter(q => q.curr === i && typeof (q.taxPrice === 'number' || typeof q.taxPrice === 'string'))
        let obj1 = {
          currName: i,
          sum: this.getSum(temp3.map(s => s.taxPrice))
        }
        tempArr1.push(obj1)
      })
      return tempArr1
    },
    // 单价校验
    priceValid (rule, value, callback) {
      let name = rule.field.split('.')[0]
      let reg = name === 'billPayableBodyVOList' ? /^-\d{1,10}(\.\d{1,3})?$|^\d{1,10}(\.\d{1,3})?$/ : /^\d{1,10}(\.\d{1,3})?$/
      if (!reg.test(value)) {
        callback(new Error('数量为空或格式输入有误,支持小数点后3位,前10位'))
        if (this.isValid) return
        this.$message({
          type: 'error',
          message: '单价为空或格式输入有误,支持小数点后3位,前10位',
          onClose: () => {
            this.isValid = false
          }
        })
        this.isValid = true
      } else {
        callback()
      }
    },
    // 数量校验
    numValid (rule, value, callback) {
      let reg = /^\d{1,9}(\.\d{1,3})?$/
      if (!reg.test(value)) {
        callback(new Error('数量为空或格式输入有误,支持小数点后3位,前9位'))
        if (this.isValid) return
        this.$message({
          type: 'error',
          message: '数量为空或格式输入有误,支持小数点后3位,前9位',
          onClose: () => {
            this.isValid = false
          }
        })
        this.isValid = true
      } else {
        callback()
      }
    },
    // 校验费用项
    feeOptionValid (rule, value, callback) {
      if (!value) {
        callback(new Error(rule.message))
        if (this.isValid) return
        this.$message({
          type: 'error',
          message: rule.message,
          onClose: () => {
            this.isValid = false
          }
        })
        this.isValid = true
      } else {
        callback()
      }
    },
    // 数据返填时,翻译计量单位和币制
    initSelected (arr, type, length) {
      if (!Array.isArray(arr)) return
      if (arr.length === 0) return
      arr.forEach((v, i) => {
        if (v.unit) {
          this.selectObj = {
            obj: this.selectDown['unit']['downList'],
            params: this.selectDown['unit']['params'],
            index: 'unit' + type + (i + length)
          }
          this.checkParamsList(v.unit)
        }
        // if (v.curr) { 币制翻译取消
        //   this.selectObj = {
        //     obj: this.selectDown['curr']['downList'],
        //     params: this.selectDown['curr']['params'],
        //     index: 'curr' + type + (i + length)
        //   }
        //   this.checkParamsList(v.curr)
        // }
      })
    },
    // 搜索委托企业
    querySearch (queryString, cb) {
      let temp = []
      if (queryString.trim().length < 2) {
        cb(temp)
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: queryString,
          returnProps: ['corpId', 'corpName']
        },
        router: this.$router,
        success: ({result}) => {
          let corpList = (result && result.splice(0, 20)) || []
          if (corpList.length > 0) {
            let tempArr = corpList.map(item => ({value: item.corpName}))
            cb(tempArr)
          } else {
            cb(temp)
          }
        }
      })
    },
    // 台账审核驳回/确认
    expenseCheck (type) {
      let {expenseBillId, setId} = this.$route.query
      this.$store.dispatch('ajax', {
        url: `API@saas-finance/bill/verify`,
        data: {
          expenseBillId: expenseBillId,
          verify: type === 'verifys',
          verifyMsg: this.verifys || ''
        },
        router: this.$router,
        success: res => {
          this.$message({
            type: 'success',
            message: type === 'rejects' ? '驳回成功' : '审核成功'
          })
          this.$store.dispatch('CloseTab', setId)
          this.$router.push({
            name: 'expense-list',
            query: {
              from: 'other'
            }
          })
        }
      })
    },
    // 台账手动新增时,获取本企业报价列表
    getQuotationsByAdd () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/getQuotations',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.billPayableBodyVO.billQuotationRespVOs = result || []
          this.billReceivableBodyVO.billQuotationRespVOs = result || []
        }
      })
    },
    // 判断台账审核按钮是否开启,开启显示发送审核按钮
    justyIsOpen (callback) {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/ccba/review/isReview',
        data: ['account_manual_audit'],
        router: this.$router,
        success: ({result}) => {
          let swtichCheck = result['account_manual_audit'].value
          this.swtichCheck = swtichCheck
          callback && callback(swtichCheck)
        }
      })
    },
    // 发送审核
    sandCheck (type) {
      // 表单验证
      let pass1 = false
      let pass2 = false
      let pass3 = false
      this.$refs['addForm'].validate(valid => {
        if (!valid) pass3 = true
      })
      this.$refs['receiveTableForm'].validate(valid => {
        if (!valid) pass1 = true
      })
      this.$refs['payTableForm'].validate(valid => {
        if (!valid) pass2 = true
      })
      if (pass1 || pass2 || pass3) return
      this.addForm.releaseDay = this.dates2 || ''
      this.addForm.sailDay = this.dates1 || ''
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/handCreate',
        data: {
          ...this.addForm,
          status: type,
          elecCreateVOs: [...this.fileList],
          billOptionPayVOs: [...this.billPayableBodyVO.billPayableBodyVOList],
          billOptionReceiveVOs: [...this.billReceivableBodyVO.billReceivableBodyVOList]
        },
        router: this.$router,
        success: res => {
          this.$message({
            type: 'success',
            message: type === '1' ? '提交成功' : '发送成功'
          })
          this.$store.dispatch('CloseTab', this.$route.query.setId)
          this.$router.push({
            name: 'expense-list',
            query: {
              from: 'other'
            }
          })
        }
      })
    },
    // 结算企业查询
    getContractCorps () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/getCompanyNames',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.contractCorpList = result || []
        }
      })
    },
    querySearchContract (queryString, cb) {
      let results = []
      if (this.contractCorpList.length === 0) return cb(results)
      let restaurants = this.contractCorpList
      if (queryString.trim().length > 1) {
        results = restaurants.filter(v => {
          return v && v.indexOf(queryString) >= 0
        })
      }
      if (results.length === 0) return cb(results)
      let tempArr = results.map(item => ({value: item}))
      cb(tempArr)
    },
    // 结算企业变化获取id
    getSetComId (row) {
      if (row.settleCompanyName) {
        let temp = this.contractCorpList.find(item => item.settleCompanyName === row.settleCompanyName)
        row.settleCompanyId = temp.settleCompanyId
      }
    },
    // 提前请款
    advanceFun (data, index) {
      let checkFlag = false
      let advanceData = {
        curr: data.curr,
        feeOptionName: data.feeOptionName,
        feePrice: data.feePrice,
        num: data.num,
        settleCompanyName: data.settleCompanyName,
        taxPrice: data.taxPrice,
        unit: data.unit
      }
      for (let key in advanceData) {
        if (!advanceData[key]) {
          checkFlag = true
        }
      }
      if (checkFlag) {
        this.$message({
          type: 'error',
          message: '请输入当前费用信息'
        })
        return false
      }
      this.advanceFundsShow = true
      this.advanceForm = data
      this.$set(this.advanceForm, 'rmk', '')
      this.advanceForm['fundAmount'] = data.taxPrice
      this.advanceForm['expenseBillId'] = this.$route.query.expenseBillId
      this.advanceForm['expenseBillOptionId'] = data.expenseBillOptionId ? data.expenseBillOptionId : ''
    },
    // 确认提前请款
    confirmFun () {
      this.$refs['advanceForm'].validate((valid) => {
        if (!valid) return false
        this.$store.dispatch('ajax', {
          url: 'API@saas-finance/bill/fund',
          data: this.advanceForm,
          router: this.$router,
          success: (res) => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.advanceFundsShow = false
            this.getBillDetail(this.advanceForm.expenseBillId)
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .item-scroll {
    width: 100%;
    overflow-x: hidden;
  }
  .scroll-hidden {
    width: calc(100% + 17px);
    max-height: 300px;
    overflow-y: auto;
  }
  .formDatePicker {
    position: relative;
    .el-input {
      z-index: 10;
    }
    .hidden-input {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
    }
  }
  .content {
    color: #4c4c4c;
    padding: 0 18px;
    .down {
      padding-top: 18px;
    }
  }
  .flex {
    display: flex;
    padding-bottom: 18px;
  }
  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .block {
    width: 25%;
    padding-bottom: 18px;
    .left {
      width: 100px;
    }
    .right {
      padding-right: 20px;
      flex: 1;
      word-break:break-all;
    }
    &:nth-child(4n) .right {
      padding-right: 0;
    }
  }
  .companyItems {
    padding: 5px 18px;
    background-color: #F4F8FC;
    margin-bottom: 8px;
    .pull-right {
      text-align: right;
      // display: flex;
      justify-content: flex-end;
      .right {
        float: right;
        // flex:1;
        word-break:break-all;
        max-width: calc(~"(100% - 60px)")
      }
      .left {
        float: right;
        width: 60px;
        line-height: 38px;
      }
    }
    .el-col {
      height: 100%;
      line-height: 36px;
    }
    .company {
      color: #4c4c4c;
      font-weight: bold;
    }
    .receive,.pay {
      font-weight: bold;
      font-size: 20px;
      &:after {
        content:'+';
      }
    }
    .receive {
      color: #53B246;
      &:last-child:after{
        content:'';
      }
    }
    .pay {
      color:#FE4400;
      &:last-child:after{
        content:'';
      }
    }
  }
  .area {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 18px;
  }
  .decDetail {
    padding-bottom: 0;
  }
  .title {
    padding-bottom: 18px;
    font-size: 16px;
  }
  .line {
    padding-bottom: 18px;
    border-bottom: 1px solid #eee;
  }
  .one-row {
    width: 100%;
    display: flex;
    align-items: flex-start;
    color: #4c4c4c;
    .left {
      width: 85px;
    }
    .right {
      flex: 1;
    }
  }
  .normal {
    padding-bottom: 18px;
    padding-top: 18px;
    border-top: 1px solid #eee;
    .left {
      width: 100px;
    }
    .red {
      color:#FE4400;
      font-size: 14px;
    }
  }
  .table-btn {
    padding-bottom: 12px;
  }
  .cell-div {
    padding: 5px 12px;
    line-height: 18px;
  }
  .cell-div.last-column {
    position: relative;
    .del-icon {
      cursor: pointer;
      img {
        display: block;
        margin: 0 auto;
      }
    }
  }
  .table-btn,.query-table-finance {
    padding-left: 4px;
  }
  .topFlag {
    padding-left: 18px;
    margin-bottom: 20px;
    height: 40px;
    box-sizing: border-box;
    border: 1px solid #ffc56b;
    background-color: #ffe9c7;
    border-radius: 2px;
    i {
      margin-right: 8px;
      padding-left: 1px;
    }
  }
  .flex {
    display: flex;
    align-items: center;
    .left {
      width: 85px;
    }
  }
  .upload-f {
    font-weight: bold;
    margin: 15px 0;
  }
  .img-box {
    display: flex;
    justify-content: flex-start;
    .img-item {
      // box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      position: relative;
      width: 148px;
      height: 148px;
      margin-right: 5px;
      border-radius: 5px;
      border: 1px solid #eeeeee;
      img {
        width: 100%;
        height: 100%;
      }
      .img-modal {
        transition: all .5s;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        transform-origin: center;
        width: 0px;
        height: 0px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .op-icon {
          cursor: pointer;
          font-size: 18px;
          color: #666;
        }
      }
      &:hover {
        .img-modal {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .list-complete-item {
    transition: all 1s;
  }
  .list-complete-enter, .list-complete-leave-to
  /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(30px);
  }
  .list-complete-leave-active {
    position: absolute;
  }
</style>
