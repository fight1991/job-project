<template>
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.seven" :model="QueryDecForm" size="mini" label-position="right">
        <div v-if='queryType'>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="报关单类型">
                <el-select placeholder="" v-model="QueryDecForm.declTrnrel"
                  @change="declTrnrelChange"
                  filterable style="width:100%">
                  <el-option
                    v-for="item in declTrnrelList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="进出口标志">
                <el-select placeholder="" v-model="QueryDecForm.iEFlag"  style="width:100%" >
                  <el-option
                    v-for="item in iEList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="报关单号">
                <el-input v-model="QueryDecForm.entryId" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="统一编号">
                <el-autocomplete
                  :maxlength="18"
                  size='mini' clearable
                  v-model="QueryDecForm.seqNo"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  @select="handleSelect">
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="境内收发货人">
                <el-input v-model="QueryDecForm.tradeCode" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="提运单号">
                <el-input v-model="QueryDecForm.billNo" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="申报地海关">
                <el-select placeholder="" v-model="QueryDecForm.customMaster"
                  :disabled="isDisabled" filterable clearable
                  default-first-option
                  style="width:100%">
                  <el-option
                    v-for="item in decParmasList"
                    :key="item.codeField"
                    :label="item.codeField + ' ' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="业务编号">
                <el-input v-model="QueryDecForm.bossId" clearable :disabled="isDisabled" placeholder="系统编号,接单编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="创建人">
                <el-select placeholder="" v-model="QueryDecForm.createUser"
                  filterable clearable style="width:100%" :disabled="isDisabled">
                  <el-option
                    v-for="item in userList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="状态" >
                <el-select placeholder="" v-model="QueryDecForm.status"
                :disabled="isDisabled" filterable clearable style="width:100%">
                  <el-option
                    v-for="item in stautsList"
                    :key="item.codeField"
                    :label="item.codeField + ' ' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="最近操作时间">
                <el-date-picker v-model="dates" style="width:100%"
                  :disabled="isDisabled"
                  type="daterange" clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="智能流水号">
                <el-input v-model="QueryDecForm.ocrNo" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="报关单类型">
                <el-select placeholder="" v-model="QueryDecForm.declTrnrel"
                  @change="declTrnrelChange"
                  filterable style="width:100%" >
                  <el-option
                    v-for="item in declTrnrelList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="企业类别">
                <el-select placeholder="" v-model="QueryDecForm.etpsCategory"  :disabled="isDisabled"  filterable style="width:100%">
                  <el-option
                    v-for="item in etpsCategoryList"
                    :key="item.code"
                    :label="item.code + ' ' + item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="进出口标志">
                <el-select placeholder="" v-model="QueryDecForm.iEFlag"  style="width:100%" >
                  <el-option
                    v-for="item in iEList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="报关单号" >
                <el-input v-model="QueryDecForm.entryId" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="统一编号" >
                <el-autocomplete
                  :maxlength="18"
                  size='mini' clearable
                  v-model="QueryDecForm.seqNo"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  @select="handleSelect">
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="提运单号">
                <el-input v-model="QueryDecForm.billNo" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="申报地海关">
                <el-select placeholder="" v-model="QueryDecForm.customMaster"
                  :disabled="isDisabled" filterable clearable
                  style="width:100%">
                  <el-option
                    v-for="item in decParmasList"
                    :key="item.codeField"
                    :label="item.codeField + ' ' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="客户业务号">
                <el-input v-model="QueryDecForm.corpBusiNo" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="客户端统一编号">
                <el-input v-model="QueryDecForm.clientSeqno" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="状态" >
                <el-select placeholder="" v-model="QueryDecForm.status" clearable
                :disabled="isDisabled"  filterable style="width:100%">
                  <el-option
                    v-for="item in stautsList"
                    :key="item.codeField"
                    :label="item.codeField + ' ' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="最近操作时间">
                <el-date-picker v-model="dates" style="width:100%"
                  :disabled="isDisabled"
                  type="daterange" clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2"
                  >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item label="申报日期">
                <el-date-picker v-model="QueryDecForm.dDate" style="width:100%"
                  :disabled="isDisabled" clearable
                  value-format="yyyyMMdd"
                  format='yyyy-MM-dd'>
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="50">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryDecList" class = 'btn-padding'>查询</el-button>
            <el-button size="mini" @click="resetDecForm" class = 'btn-padding'>重置</el-button>
            <el-button size="mini" @click="queryType = !queryType" class = 'btn-padding'>{{queryType ? '高级查询' : '基本查询'}}</el-button>
            <el-dropdown @command="synchrodata" style='float: right;'>
              <el-button size="mini" class ='btn-padding'>同步</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="syncDecData">单一窗口报关单同步</el-dropdown-item>
                <el-dropdown-item command="syncStarData" v-permissions="'CCBA20205010700'">金关之星报关单同步</el-dropdown-item>
                <el-dropdown-item command="syncRecord">同步记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
       <el-row class="op-btn">
         <el-dropdown @command="printDec">
          <el-button size="mini" class="list-btns list-icon-print"><i></i>打印</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="printDec">打印报关单</el-dropdown-item>
            <el-dropdown-item command="printTotal">打印通知书</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-emailSend" v-permissions="'CCBA20205010100'"  @click="createXml"><i></i>发送</el-button>
        <el-tooltip  effect="dark" content="仅上海地区可用">
          <el-button size="mini" class="list-btns list-icon-declare" title='仅上海地区可用' :disabled="isDisabledDec" @click="directDeclare"><i></i>申报</el-button>
        </el-tooltip>
        <el-dropdown @command="exportDec">
          <el-button size="mini" class="list-btns list-icon-export"><i></i>导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exportList">列表导出</el-dropdown-item>
            <el-dropdown-item command="exportDetail">详情导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-delete" v-permissions="'CCBA20205010300'"  @click="delDec"><i></i>删除</el-button>
        <el-button size="mini" class="list-btns list-icon-import" v-permissions="'CCBA20205010400'"  @click="importCompnentVisible=true"><i></i>导入</el-button>
        <el-tooltip  effect="dark" content="数据被标记后，置顶显示">
          <el-button size="mini" class="list-btns list-icon-sign" @click="markStar"><i></i>标记</el-button>
        </el-tooltip>
         <el-dropdown @command="createBill">
          <el-button size="mini" class="list-btns list-icon-createOrder"><i></i>生成接单</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="createBill">生成接单</el-dropdown-item>
            <el-dropdown-item command="mergeBill">合并接单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-subimtCheck" v-permissions="'CCBA20205010500'" @click="submitAudit"><i></i>提交审核</el-button>
        <el-button size="mini" class="list-btns list-icon-download"  @click="openBillCompent"><i></i>清单下载</el-button>
        <el-button size="mini" class="list-btns list-icon-scan" @click="visibleView"><i></i>可视化预览</el-button>
        <el-dropdown @command="OCRupLoad" v-if="false"> <!--智能制单:CCBA2.17需求移至接单-->
          <el-button size="mini" class="list-btns list-icon-AI"><i></i>智能制单</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="upload">上传文件</el-dropdown-item>
            <el-dropdown-item command="record">识别记录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="airvehicle-list-drop">
          <el-popover popper-class="airvehicle-table-popper">
            <ul>
              <li v-for="(item,index) in fieldList" :key="index">
                <el-checkbox size="mini" v-model="item.value" @change="columnFieldChange">{{item.text}}</el-checkbox>
              </li>
            </ul>
            <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
          </el-popover>
        </div>
        <span class="span-right">已选择<span>{{checkedNum}}</span>项</span>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table'
        ref = 'decTable'
       :data="decResultList"
       :height="tableHeight"
       @sort-change='fieldSort'
       border highlight-current-row size="mini"
       @selection-change="changeFun"
       @row-click='rowClickChange'>
        <el-table-column  type="selection" align='center' width="40"></el-table-column>
        <el-table-column label="标记" align='center'  min-width="50">
          <template slot-scope="scope">
            <span class='el-icon-star-on' title='标记' v-if = "scope.row.isFavour === '1'"></span>
            <span class='list-icon-ocr border-0' title='ocr' v-if = "scope.row.ref5 === 'Y'"><i class='dec-i'></i></span>
          </template>
        </el-table-column>
        <el-table-column label="智能流水号" align='center' prop="ocrNo" min-width="150"  v-if="fieldList.ocrNo.value"></el-table-column>
        <el-table-column label="系统编号" align='left' sortable="custom" prop="decPid" min-width="120"  v-if="fieldList.decPid.value"></el-table-column>
        <el-table-column label="接单编号" align='left' sortable="custom" prop="bossId" min-width="120"  v-if="fieldList.bossId.value"></el-table-column>
        <el-table-column label="客户业务号" align='center' prop="corpBusiNo" min-width="120"  v-if="fieldList.corpBusiNo.value"></el-table-column>
        <el-table-column label="统一编号" align='center' sortable="custom" prop="cusCiqNo" min-width="150"  v-if="fieldList.cusCiqNo.value"></el-table-column>
        <el-table-column label="海关编号" align='center' sortable="custom" prop="entryId" min-width="150"  v-if="fieldList.entryId.value"></el-table-column>
        <el-table-column label="申报状态" align='left' sortable="custom" prop="statusValue" min-width="100" key='statusValue'  v-if="fieldList.statusValue.value">
          <template slot-scope="scope">
            <a href="javascript:void(0)" style='color: #409eff;' @click="lookReturnInfo(scope.row.decPid)">{{scope.row.statusValue}}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作状态" align='left' prop="xmlStatusValue" v-if="fieldList.xmlStatusValue.value" min-width="70"></el-table-column>
        <el-table-column label="系统状态" align='left' sortable="custom" prop="isExamineValue" min-width="120" v-if="fieldList.isExamineValue.value"></el-table-column>
        <el-table-column label="委托客户" align='left' prop="company" min-width="120" v-if="fieldList.company.value"></el-table-column>
        <el-table-column label="境内收发货人" align='left' sortable="custom" prop="tradeName" min-width="200" v-if="fieldList.tradeName.value"></el-table-column>
        <el-table-column label="境内收发货人18位社会信用代码" align='center' v-if="fieldList.tradeCoScc.value" title='境内收发货人18位社会信用代码' prop="tradeCoScc" min-width="150"></el-table-column>
        <el-table-column label="提运单号" align='left' sortable="custom" prop="billNo" v-if="fieldList.billNo.value" min-width="100"></el-table-column>
        <el-table-column label="进出口日期" align='center' sortable="custom" prop="iEDate" v-if="fieldList.iEDate.value" min-width="100"></el-table-column>
        <el-table-column label="申报日期" align='center' prop="dDate" v-if="fieldList.dDate.value" min-width="100"></el-table-column>
        <el-table-column label="监管方式" align='left' sortable="custom" prop="tradeModeValue" v-if="fieldList.tradeModeValue.value" min-width="110"></el-table-column>
        <el-table-column label="启运国/运抵国" align='left' prop="tradeCountryValue" v-if="fieldList.tradeCountryValue.value" min-width="110"></el-table-column>
        <el-table-column label="指运港/经停港" align='left' prop="distinatePortValue" v-if="fieldList.distinatePortValue.value" min-width="110"></el-table-column>
        <el-table-column label="件数" align='right' prop="packNo" v-if="fieldList.packNo.value" min-width="80"></el-table-column>
        <el-table-column label="毛重" align='right' prop="grossWt" v-if="fieldList.grossWt.value" min-width="80"></el-table-column>
        <el-table-column label="合同协议号" align='left' prop="contrNo" v-if="fieldList.contrNo.value" min-width="100"></el-table-column>
        <el-table-column label="商品项数" align='right' prop="decListNum" v-if="fieldList.decListNum.value" min-width="80"></el-table-column>
        <el-table-column label="运输工具名称" align='left' sortable="custom" prop="trafName" v-if="fieldList.trafName.value" min-width="100"></el-table-column>
        <el-table-column label="申报单位名称" align='left' prop="agentName" v-if="fieldList.agentName.value" min-width="150"></el-table-column>
        <el-table-column label="进出口标志" align='center' prop="iEFlagValue" v-if="fieldList.iEFlagValue.value" min-width="90"></el-table-column>
        <el-table-column label="申报地海关" align='left' sortable="custom" prop="customMasterValue" v-if="fieldList.customMasterValue.value" min-width="100"></el-table-column>
        <el-table-column label="入境/离境口岸" align='left' sortable="custom" prop="entyPortCodeValue" v-if="fieldList.entyPortCodeValue.value" min-width="120"></el-table-column>
        <el-table-column label="贸易国" align='left' prop="tradeAreaCodeValue" v-if="fieldList.tradeAreaCodeValue.value" min-width="100"></el-table-column>
        <el-table-column label="客户端统一编号" align='left' prop="clientSeqno" v-if="fieldList.clientSeqno.value" min-width="120"></el-table-column>
        <el-table-column label="更新时间" align='center' prop="updateTime" v-if="fieldList.updateTime.value" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" align='center' min-width="150" >
          <template slot-scope="scope">
            <el-button type="text" class="table-icon list-icon-edit" title="编辑" @click="editDetail(scope.row)"><i></i></el-button>
            <el-button type="text" class="table-icon list-icon-look" title="查看" @click.stop="lookupDetail(scope.row)"><i></i></el-button>
            <el-button type="text" class="table-icon list-icon-tailAfter" title="查看业务跟踪明细" @click.stop="lookTrackeDetail(scope.row)"><i></i></el-button>
            <el-button type="text" class="table-icon list-icon-ledger" title="登账"  @click.stop="skipAccount(scope.row)"><i></i></el-button>
            <el-button type="text" class="table-icon list-icon-sync" title="同步" v-show= 'scope.row.cusCiqNo' @click.stop="checkIfbind(scope.row)"><i></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 回执组件 -->
    <return-receipt :initParams="returnParam"  @colseTemplate="closeReturnCompnent"  v-if="returnCompnentVisible"></return-receipt>
    <el-dialog :modal-append-to-body='false'
      :title="titleName"
      :visible.sync="printCompnentVisible"
      :show-close='false'
      class="sys-dec-class"
      width="640px">
       <decprint-view :initParams="printCompnentParam"  @cancLeData="closePrintCompnent"  v-if="printCompnentVisible"></decprint-view>
    </el-dialog>
    <el-dialog :modal-append-to-body='false'
      title="EXCEL导入"
      :visible.sync="importCompnentVisible"
      class="sys-dec-class"
      width="640px">
       <execl-import @cancLeData="closeImportCompnent"  v-if="importCompnentVisible"></execl-import>
    </el-dialog>
    <el-dialog :modal-append-to-body='false'
      title="IC卡登陆"
      :visible.sync="passwordVisible"
      class='dec-dialog-class'
      width="500px">
      <div>
        <el-form label-width="50px" :model="passwordForm" size="mini" label-position="right" onsubmit="return false;">
          <el-row type="flex" justify="center">
            <el-col :span="18" >
              <el-form-item label="IC密码" >
                <el-input type='password' v-model="passwordForm.password"  @keyup.enter.native="verifyPassed" maxlength="8"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <input type="button"  class ='button-primary' @click="verifyPassed" value='登录'>
      </span>
    </el-dialog>
    <bill-download ref="billDownload" :billDownLoadVisible.sync="billDownLoadVisible" :sccCode="sccCode" :isConBossId="isConBossId" :queryType.sync="queryType" @backQueryForm="backQueryForm" :userInfo="userInfo"></bill-download>
    <el-dialog :modal-append-to-body='false'
      title="关联接单"
      :visible.sync="contactBossIdVisible"
      :close-on-click-modal='false'
      v-loading="$store.state.loading"
      v-dialogDrag
      width="400px">
      <el-form label-width="80px" :model="bossIdForm" ref='bossIdForm' size="mini" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="接单编号">
              <el-autocomplete
                :maxlength="30"
                size='mini'
                v-model="bossIdForm.bossId"
                :fetch-suggestions="queryBossIdSearch"
                :trigger-on-focus="false">
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户业务号">
              <el-autocomplete
                :maxlength="50"
                size='mini'
                @keyup.enter.native="contactBossId"
                v-model="bossIdForm.corpBusiNo"
                :fetch-suggestions="queryBusiNoSearch"
                :trigger-on-focus="false">
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="contactBossId" class = 'btn-padding'>确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 弹出框 业务跟踪明细 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="业务跟踪明细"
      :visible.sync="trackeVisible"
      :close-on-click-modal='false'
      v-dialogDrag
      class="sys-dec-class"
      width="80%">
      <tracke-detail :initParams="trackeParam" @cancLeData="closeTrackeCompnent" @backData="receptionTrackeData"  v-if="trackeVisible"></tracke-detail>
    </el-dialog>
    <!-- 弹出框 业务跟踪明细 结束 -->
    <!-- 弹出框 打印通知书 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="回执通知书打印"
      :visible.sync="printNoticeVisable"
      :close-on-click-modal='false'
      v-dialogDrag
      class="sys-dec-class"
      width="500px">
      <print-notice :initParams="initPrintNoticeParam" @cancLeData="closePrintNoticeCompnent" @backData="receptionPrintNoticeData"  v-if="printNoticeVisable"></print-notice>
    </el-dialog>
    <!-- 弹出框 打印通知书 结束 -->
    <!-- 弹出框 批量同步单一窗口报关单数据 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="同步"
      :visible.sync="batchsyncVisiable"
      :close-on-click-modal='false'
      v-dialogDrag
      v-loading="$store.state.loading"
      width="400px" class="batch-sync-dialog">
      <batch-sync @backData="backBatchsync"  v-if="batchsyncVisiable"></batch-sync>
    </el-dialog>
    <!-- 弹出框 批量同步单一窗口报关单数据  结束 -->
    <!-- 弹出框 批量同步金关之星报关单数据 开始 -->
    <sync-star :syncStarVisiable.sync="syncStarVisiable" @back="backSyncForm"></sync-star>
    <!-- 弹出框 批量同步金关之星报关单数据  结束 -->
    <!-- 弹出框 OCR上传 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="上传文件"
      :visible.sync="ocrVisable"
      :close-on-click-modal='false'
      v-dialogDrag
      v-loading="$store.state.loading"
      class="sys-dec-class"
      width="500px">
      <ocr-upload  @backData="colseOCRCompnent"  v-if="ocrVisable"></ocr-upload>
    </el-dialog>
    <!-- 弹出框 OCR 结束 -->
    <!-- 弹出框 OCR记录 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="识别记录"
      :visible.sync="ocrRcordVisable"
      :close-on-click-modal='false'
      v-dialogDrag
      class="sys-dec-dialog"
      width="800px">
      <ocr-record @cancLeData="closeOCRcordCompnent"  v-if="ocrRcordVisable"></ocr-record>
    </el-dialog>
    <!-- 弹出框 OCR记录 结束 -->
     <!-- 弹出框 OCR记录 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="提示"
      :visible.sync="coverVisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      class="sys-dec-class"
      v-dialogDrag
      width="400px">
      <sync-cover :initParams="initCoverParam"  @cancLeData="closeCoverCompnent" @backData="receptionCoverData" v-if="coverVisable"></sync-cover>
    </el-dialog>
    <!-- 弹出框 OCR记录 结束 -->
    <!-- 弹出框 生成接单 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="生成接单"
      :visible.sync="createBillVisiable"
      :close-on-click-modal='false'
      class="sys-dec-dialog"
      v-dialogDrag
      width="400px">
      <create-bill :initParams='createBillParam' @backData="backCreateBill"  v-if="createBillVisiable"></create-bill>
    </el-dialog>
    <!-- 弹出框 生成接单 结束 -->
    <!-- 弹出框 同步记录 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="同步记录"
      :visible.sync="syncDecRcordVisable"
      :close-on-click-modal='false'
      v-dialogDrag
      v-loading="$store.state.loading"
      class="sys-dec-dialog"
      width="800px">
      <syncdec-record @cancLeData="syncDecRcordCompnent"  v-if="syncDecRcordVisable"></syncdec-record>
    </el-dialog>
    <!-- 弹出框 同步记录 结束 -->
    <el-dialog :modal-append-to-body='false'
    :visible.sync="gotoBind"
    width="25%"
    title='绑定单一窗口账号'
    :close-on-click-modal="false" class="batch-sync-dialog"
    @open="openAccountDialog">
      <el-form :model="bindform" ref='bindform' label-width="120px" class="pd-lr-20" :rules='singlerule'>
        <el-row>
          <el-form-item label="单一窗口用户名" prop="account" size="mini">
            <el-input v-model="bindform.account" ></el-input>
          </el-form-item>
          <el-form-item label="单一窗口密码" prop="password" size="mini">
            <el-input type="password" v-model="bindform.password"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align:center;">
          <el-button size="mini" type="primary" @click="bindSingle">确定</el-button>
          <el-button size="mini" @click="gotoBind = false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
import pickerOptions from '@/common/mixin/pickerOptions'
// import Vue from 'vue'
import '@/common/other/client'
import rightsUtil from '@/common/rightsUtil'
import config from '@/config/config'
// import pdfBase64 from '@/common/pdfBase64'
// import base64 from '@/common/base64'
import {decStatus, declTrnrelList, etpsCategoryList, iEFlagList} from './utils/decJson'
import {decTableHeadFieldList} from './utils/decTableHeadFields'
import decprintView from '../decPage/components/decPrint'
import execlImport from '../component/execImport.vue'
import returnReceipt from '../component/returnReceipt.vue'
import trackeDetail from '../component/trackeDetail.vue'
import printNotice from '../component/printNotice.vue'
import batchSync from '../component/batchSync.vue'
import ocrUpload from '../component/ocrUpload.vue'
import ocrRecord from '../component/ocrRecord.vue'
import syncCover from '../component/syncCover.vue'
import createBill from '../component/createBill.vue'
import syncdecRecord from '../component/syncDecRcord.vue'
import billDownload from './components/billDownLoad.vue'
import syncStar from '../component/syncStar.vue'
import decUtil from '../decPage/common/decUtil'

export default {
  components: {
    decprintView,
    execlImport,
    returnReceipt,
    trackeDetail,
    printNotice,
    batchSync,
    ocrUpload,
    ocrRecord,
    syncCover,
    createBill,
    syncdecRecord,
    billDownload,
    syncStar
  },
  mixins: [pickerOptions],
  name: 'decQueryTable',
  data () {
    return {
      QueryDecForm: this.initQueryForm(),
      singlerule: {
        account: [{required: true, message: '请输入单一窗口账号', trigger: 'blur'}],
        password: [{required: true, message: '请输入单一窗口账号密码', trigger: 'blur'}]
      },
      bindform: {
        account: '',
        password: ''
      }, // 单一窗口账号绑定
      queryType: true, // true 基本查询 false 高级查询
      dates: '', // 日期
      isDisabled: false,
      tableHeight: 400, // 默认高度
      decResultList: [], // 报关单存放列表数据
      seqNoListOptions: [], // 缓存统一编号数据
      userList: [], // 创建人列表
      tableValue: [],
      isCover: false,
      field: '', // 字段
      order: '', // 排序方式
      createBillVisiable: false,
      createBillParam: [],
      fieldList: decTableHeadFieldList,
      checkedNum: 0, // 被选中的数量
      printCompnentParam: {}, // 打印组件 的传递参数
      printCompnentVisible: false, // 打印组件 显示 隐藏
      titleName: '批量打印报关单',
      importCompnentVisible: false, // 导入组件的显示与否
      returnCompnentVisible: false, // 查看回执组件 加载与否
      returnParam: '', // 需要给回执组件传递的参数
      trackeVisible: false, // 业务跟踪明细 显示控制
      trackeParam: {}, // 业务跟踪 初始化参数
      batchsyncVisiable: false, // 批量同步单一窗口
      syncStarVisiable: false, // 批量同步金关之星
      syncDecRcordVisable: false, // 同步记录
      listNo: '', // 清单号
      iEList: iEFlagList,
      declTrnrelList: declTrnrelList,
      etpsCategoryList: etpsCategoryList,
      // upLoadVisible: false,
      iEFlag: '',
      decParmasList: [],
      stautsList: decStatus,
      billDownLoadVisible: false, // 清单下载
      passwordVisible: false, // 密码输入
      passwordForm: {
        password: '' // 密码
      },
      bossIdForm: {
        bossId: '', // 接单编号
        corpBusiNo: '' // 客户业务号
      },
      userId: '', // 当前用户的id,
      sccCode: '', // 当前登陆用户的社会信用代码
      userInfo: [], // IC卡中卡信息
      contactBossIdVisible: false, // 统一编号下载时关联接单组件
      swtichCheck: 'Y', // 报关单是否需要审核
      isDirectDec: 'N', // 是否直接申报
      isConBossId: 'N', // 是否关联接单
      isDisabledDec: true, // 是否能够直接申报
      printNoticeVisable: false, // 打印通知书
      initPrintNoticeParam: {},
      bossIdList: [], // 接单编号数组
      corpBusiNoList: [], // 客户业务号数组
      ocrRcordVisable: false, // ORC记录查看
      ocrVisable: false, // ORC 上传
      coverVisable: false, // 覆盖
      initCoverParam: '', //
      gotoBind: false,
      downLoadType: ''
    }
  },
  created () {
    // 获取企业信息列表  获取登陆用户信息  下载参数表  企业本企业下的人员
    this.getUserInfo()
    this.$all([this.seqNoListFun(), this.getCommonParams(), this.getUserUnderCrop()])
    // 获取 当前用户是否开启了人工审核
    this.getSwitchCheck()
    // 获取接单编号
    this.getBossIdList()
    // 获取客户业务号
    this.getCorpBusiNoList()
  },
  mounted () {
    if (!util.isEmpty(this.$route.query.status)) {
      // 从工作台过来
      this.queryByConditon()
    }
  },
  methods: {
    initQueryForm () {
      return {
        declTrnrel: '0,2', // 报关单类型
        etpsCategory: 'D', // 企业类别
        entryId: '', // 报关单号
        seqNo: '', // 统一编号
        bossId: '', // 接单编号
        tradeCode: '', // 境内收发货人
        billNo: '', // 提运单号
        customMaster: '', // 申报地海关
        status: '', // 是否结关
        clientSeqno: '', // 客户业务号
        corpBusiNo: '', //  客户端统一编号
        createUser: '', // 创建人
        updateTimeStart: '', // 最近开始操作时间
        updateTimeEnd: '', // 最近终止操作时间
        iEFlag: '', // 进出口标志
        ocrNo: '', // 智能流水号
        dDate: '' // 申报日期
      }
    },
    resetDecForm  () {
      this.QueryDecForm = this.initQueryForm()
      this.isDisabled = false
      this.dates = []
      this.queryDecList()
    },
    // 批量同步单一窗口报关单数据
    synchrodata (value) {
      if (value === 'syncDecData') {
        rightsUtil.checkRights(() => {
          this.$post({
            url: 'API@/login/tenantConf/swAccountBound',
            data: {}, // 状态类别(E报关单,D随附单据,C报检,M修撤单,T转关单)
            isLoad: false,
            success: (res) => {
              if (res.result) {
                this.batchsyncVisiable = true
              } else {
                this.downLoadType = 'B'
                this.gotoBind = true
              }
            }
          })
        })
      } else if (value === 'syncStarData') {
        this.syncStarVisiable = true
      } else {
        this.syncDecRcordVisable = true
      }
    },
    getCommonParam () {
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getStatus',
        data: {statusType: 'E'}, // 状态类别(E报关单,D随附单据,C报检,M修撤单,T转关单)
        success: (res) => {
          this.decStatusList = res.result
        }
      })
    },
    // 企业本企业下的人员
    getUserUnderCrop () {
      return {
        url: 'API@/login/corp/getCorpUsers',
        data: {},
        success: (res) => {
          if (res.code === '0000') {
            this.userList = []
            for (let i in res.result) {
              // 过滤数据
              if (util.isEmpty(res.result[i].userId) || util.isEmpty(res.result[i].userName)) {
                continue
              }
              this.userList.push({
                codeField: res.result[i].userId,
                nameField: res.result[i].userName
              })
            }
          }
        }
      }
    },
    // 从平台过来的查询
    queryByConditon () {
      let startTime = this.$route.query.startTime
      let endTime = this.$route.query.endTime
      this.dates = [startTime, endTime]
      this.QueryDecForm.updateTimeStart = this.$route.query.startTime
      this.QueryDecForm.updateTimeEnd = this.$route.query.endTime
      this.QueryDecForm.status = this.$route.query.status
      this.QueryDecForm.iEFlag = this.$route.query.iEFlag
      this.QueryDecForm.createUser = ''
      this.pageList()
    },
    // 设置默认的查询日期
    setDefaultDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 查看报关单是否需要审核 和 是否为直接申报
    getSwitchCheck () {
      this.$post({
        url: 'API@/dec-common/ccba/review/isReview',
        data: ['customs_declaration_manual_audit', 'customs_declaration_direct', 'customs_declaration_associate_order'],
        isLoad: false,
        success: (res) => {
          this.swtichCheck = res.result['customs_declaration_manual_audit'].value
          this.isDirectDec = res.result['customs_declaration_direct'].value
          // this.isConBossId = res.result['customs_declaration_associate_order'].value // 是否关联接单
          this.isConBossId = 'N'
          if (this.isDirectDec === 'Y') {
            this.isDisabledDec = false
          } else {
            this.isDisabledDec = true
          }
        }
      })
    },
    // 绑定单一窗口账户
    bindSingle () {
      this.$refs['bindform'].validate((valid) => {
        if (valid) {
          this.$post({
            url: 'API@/login/tenantConf/saveSWAccountInfo',
            data: this.bindform,
            success: (res) => {
              this.messageTips('绑定成功', 'success')
              this.gotoBind = false
              if (this.downLoadType === 'A') {
                this.queryDecList()
              } else if (this.downLoadType === 'B') {
                this.batchsyncVisiable = true
              } else {
                this.syncSingleData(this.downLoadType)
              }
            }
          })
        }
      })
    },
    // 报关单列表查询
    queryDecList () {
      // 关闭回执信息
      this.returnCompnentVisible = false
      this.tableHeight = 400
      // 校验查询数据
      if (this.QueryDecForm.declTrnrel === '9') {
        if (!/^[0-9A-Za-z]{18}$/.test(this.QueryDecForm.seqNo)) {
          this.messageTips('请输入18位统一编号！', 'error')
          return false
        }
        if (util.isEmpty(this.QueryDecForm.iEFlag) && this.QueryDecForm.seqNo.indexOf('I') !== 0 && this.QueryDecForm.seqNo.indexOf('E') !== 0) {
          this.messageTips('需要选择进出口标识！', 'error')
          return false
        }
        rightsUtil.checkRights(() => {
          if (util.isEmpty(this.QueryDecForm.iEFlag)) {
            if (this.QueryDecForm.seqNo.indexOf('I') === 0) {
              this.QueryDecForm.iEFlag = 'I'
            }
            if (this.QueryDecForm.seqNo.indexOf('E') === 0) {
              this.QueryDecForm.iEFlag = 'E'
            }
          }
          if (this.QueryDecForm.declTrnrel === '9') {
            this.$post({
              url: 'API@/login/tenantConf/swAccountBound',
              data: {}, // 状态类别(E报关单,D随附单据,C报检,M修撤单,T转关单)
              isLoad: false,
              success: (res) => {
                if (res.result) {
                  if (this.isConBossId === 'Y') { // 如果关联接单编号开关打开
                    // 查询是当前统一编号是否已经关联接单编号
                    this.isRelevanceBossId(this.QueryDecForm.seqNo, '1', false)
                  } else { // 如果关联接单编号开关没有打开
                    this.downLoadSeqNo()
                  }
                } else {
                  this.downLoadType = 'A'
                  this.gotoBind = true
                }
              }
            })
          } else {
            if (this.isConBossId === 'Y') { // 如果关联接单编号开关打开
            // 查询是当前统一编号是否已经关联接单编号
              this.isRelevanceBossId(this.QueryDecForm.seqNo, '1', false)
            } else { // 如果关联接单编号开关没有打开
              this.downLoadSeqNo()
            }
          }
        })
      } else {
        if (this.dates === '' || this.dates === null) {
          this.QueryDecForm.updateTimeStart = ''
          this.QueryDecForm.updateTimeEnd = ''
        } else {
          this.QueryDecForm.updateTimeStart = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
          this.QueryDecForm.updateTimeEnd = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
        }
        this.pageList(this.$store.state.pagination)
      }
    },
    // 获取接单编号
    getBossIdList () {
      this.$post({
        url: 'API@/dec-common/ccba/common/getSuitBossIds',
        data: '',
        isLoad: false,
        success: (res) => {
          if (res.code === '0000' && res.result.length > 0) {
            for (let i in res.result) {
              this.bossIdList.push({
                value: res.result[i].innerNo
              })
            }
          }
        }
      })
    },
    // 获取客户业务号
    getCorpBusiNoList () {
      this.$post({
        url: 'API@/dec-common/ccba/common/getCopBusiNos',
        data: this.QueryDecForm.iEFlag,
        isLoad: false,
        success: (res) => {
          if (res.code === '0000' && res.result.length > 0) {
            for (let i in res.result) {
              this.corpBusiNoList.push({
                value: res.result[i]
              })
            }
          }
        }
      })
    },
    // 分页列表
    pageList (pagination) {
      let queryParam = {}
      if (this.queryType) { // 如果是基本查询传基本参数的参数
        queryParam = {
          declTrnrel: this.QueryDecForm.declTrnrel, // 报关单类型
          entryId: this.QueryDecForm.entryId, // 报关单号
          seqNo: this.QueryDecForm.seqNo, // 统一编号
          bossId: this.QueryDecForm.bossId, // 接单编号
          tradeCode: this.QueryDecForm.tradeCode, // 境内收发货人
          billNo: this.QueryDecForm.billNo, // 提运单号
          status: this.QueryDecForm.status, // 报关单状态
          customMaster: this.QueryDecForm.customMaster, // 申报地海关
          updateTimeStart: this.QueryDecForm.updateTimeStart, // 最近开始操作时间
          updateTimeEnd: this.QueryDecForm.updateTimeEnd, // 最近终止操作时间
          iEFlag: this.QueryDecForm.iEFlag, // 进出口标志
          createUser: this.QueryDecForm.createUser, // 创建人id
          ocrNo: this.QueryDecForm.ocrNo // 智能流水号
        }
      } else { // 高级查询
        queryParam = {
          declTrnrel: this.QueryDecForm.declTrnrel, // 报关单类型
          etpsCategory: this.QueryDecForm.etpsCategory, // 企业类别
          entryId: this.QueryDecForm.entryId, // 报关单号
          seqNo: this.QueryDecForm.seqNo, // 统一编号
          billNo: this.QueryDecForm.billNo, // 提运单号
          customMaster: this.QueryDecForm.customMaster, // 申报地海关
          status: this.QueryDecForm.status, // 报关单状态
          clientSeqno: this.QueryDecForm.clientSeqno, // 客户业务号
          corpBusiNo: this.QueryDecForm.corpBusiNo, //  客户端统一编号
          updateTimeStart: this.QueryDecForm.updateTimeStart, // 最近开始操作时间
          updateTimeEnd: this.QueryDecForm.updateTimeEnd, // 最近终止操作时间
          iEFlag: this.QueryDecForm.iEFlag, // 进出口标志
          dDate: this.QueryDecForm.dDate // 申报日期
        }
      }
      if (!util.isEmpty(this.field)) {
        queryParam['field'] = this.field
        queryParam['order'] = this.order // 方法的方式 为 ascending, descending
      }
      this.$post({
        url: 'API@/dec-common/dec/common/queryList',
        data: {
          ...queryParam,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.decResultList = res.result
        }
      })
    },
    // 获取公共字典list
    getCommonParams () {
      let par = ['SAAS_CUSTOMS_REL']
      return {
        url: 'API@/saas-dictionary/dictionary/getParam',
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          this.decParmasList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL'))
        },
        data: {
          'tableNames': par
        },
        success: (res) => {
          this.decParmasList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL'))
        }
      }
    },
    // 跳转 查看界面
    lookupDetail (row) {
      let pageType
      let flag = row.iEFlag === 'I' ? 'import' : 'export'
      if (row.declTrnrel === '0') {
        pageType = 'declaration'
        this.skipDecPage(pageType, flag, 'look', row.decPid.toString(), row.tsPid, row.bossId, row)
      } else if (row.declTrnrel === '2') {
        pageType = 'recordList'
        this.skipDecPage(pageType, flag, 'look', row.decPid.toString(), row.tsPid, row.bossId, row)
      } else if (row.declTrnrel === '1') {
        pageType = 'declaration'
        this.gotoTransPage(pageType, flag, 'look', row.decPid.toString())
      } else if (row.declTrnrel === '3') {
        pageType = 'recordList'
        this.gotoTransPage(pageType, flag, 'look', row.decPid.toString())
      } else if (row.declTrnrel === '4') {
        pageType = 'secondDec'
        this.gotoTransPage(pageType, flag, 'look', row.decPid.toString())
      }
    },
    // 跳转编辑页面
    editDetail (row) {
      if (util.isExistInArray(row.status, ['002', '005', '2', '4', '5', '7', '8', '9', '10', '11'])) {
        this.messageTips('当前数据状态不能编辑')
        return false
      }
      if (util.isExistInArray(row.isExamine, ['3', 'R', '6'])) {
        this.messageTips('当前数据状态不能编辑')
        return false
      }
      let pageType
      let flag = row.iEFlag === 'I' ? 'import' : 'export'
      if (row.declTrnrel === '0') {
        pageType = 'declaration'
        this.skipDecPage(pageType, flag, 'edit', row.decPid.toString(), row.tsPid, row.bossId, row)
      } else if (row.declTrnrel === '2') {
        pageType = 'recordList'
        this.skipDecPage(pageType, flag, 'edit', row.decPid.toString(), row.tsPid, row.bossId, row)
      } else if (row.declTrnrel === '1') {
        pageType = 'declaration'
        this.gotoTransPage(pageType, flag, 'edit', row.decPid.toString())
      } else if (row.declTrnrel === '3') {
        pageType = 'recordList'
        this.gotoTransPage(pageType, flag, 'edit', row.decPid.toString())
      } else if (row.declTrnrel === '4') {
        pageType = 'secondDec'
        this.gotoTransPage(pageType, flag, 'edit', row.decPid.toString())
      }
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 报关单   recordList 备案清单
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    skipDecPage (funFlag, flag, operationType, pid = 'new', tsPid, bossId, row) {
      let queryParam = {}
      if (row.ocrNo) {
        queryParam['priceInnerNo'] = bossId
        queryParam['aiType'] = 'Intelligent'
        queryParam['taskId'] = row.ocrNo
      } else {
        queryParam['priceInnerNo'] = bossId
      }
      let pageType = 'dec'
      if (tsPid) {
        pageType = 'whole'
      }
      decUtil.gotoDecPage(funFlag, flag, operationType, pid, pageType, queryParam, this)
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 转关提前报关   recordList 转关提前备案清单 secondDec 出口二次转关
     * @param flag  进出口标识 import export
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoTransPage (funFlag, flag, operationType, pid = 'new') {
      let routeParam = {
        'declaration@import@look': {tabName: '进口转关提前报关', routeName: 'importTransitDecLook'},
        'declaration@import@edit': {tabName: '进口转关提前报关', routeName: 'importTransitDecEdit'},
        'declaration@export@look': {tabName: '出口转关提前报关', routeName: 'exportTransitDecLook'},
        'declaration@export@edit': {tabName: '出口转关提前报关', routeName: 'exportTransitDecEdit'},
        'recordList@import@look': {tabName: '进境转关提前备案清单', routeName: 'importTransitRecordListLook'},
        'recordList@import@edit': {tabName: '进境转关提前备案清单', routeName: 'importTransitRecordListEdit'},
        'recordList@export@look': {tabName: '出境转关提前备案清单', routeName: 'exportTransitRecordListLook'},
        'recordList@export@edit': {tabName: '出境转关提前备案清单', routeName: 'exportTransitRecordListEdit'},
        'secondDec@export@look': {tabName: '出口转关提前报关', routeName: 'exportTransitSecondDecLook'},
        'secondDec@export@edit': {tabName: '出口转关提前报关', routeName: 'exportTransitRecordListEdit'}
      }
      let para = `${funFlag}@${flag}@${operationType}`
      let routeName = routeParam[para].routeName
      let tabName = routeParam[para].tabName
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + operationType + pid
        }
      })
    },
    // 删除报关单
    /**
     * @description 报关单删除时，仅判断业务状态是否为报关单预录入或者审核驳回，
     *               如果是，则可以直接删除报关单，如果不是报关单预录入或者审核驳回，则不允许删除报关单数据。
     */
    delDec () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择需要删除的数据！')
        return
      }
      // 删除
      let pidLit = []
      for (let i in this.tableValue) {
        pidLit.push(this.tableValue[i].decPid)
      }
      this.$confirm('确定删除选中数据？', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.$post({
          url: 'API@/dec-common/dec/common/delDec',
          data: {
            'seqNos': pidLit
          },
          success: (res) => {
            this.messageTips(res.message, 'success')
            if (res.code === '0000') {
              if (this.QueryDecForm.declTrnrel === '9') {
                this.QueryDecForm.declTrnrel = '0,2'
              }
              this.isDisabled = false
              this.pageList()
            }
          },
          other: (res) => {
            this.messageTips(res.message, 'error')
          }
        })
      }).catch(() => {
      })
    },
    // 标记数据
    markStar () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择需要标记得数据')
        return
      }
      let FavourList = [] // 存放被标记过的数据
      let inFavourList = [] // 存放没有被标记过的数据
      let AllList = [] // 存放所有的数据
      for (let i in this.tableValue) {
        if (this.tableValue[i].isFavour === '1') {
          FavourList.push({
            'operType': this.tableValue[i].isFavour,
            'decPid': this.tableValue[i].decPid
          })
        } else {
          inFavourList.push({
            'operType': this.tableValue[i].isFavour,
            'decPid': this.tableValue[i].decPid
          })
        }
        AllList.push({
          'operType': this.tableValue[i].isFavour,
          'decPid': this.tableValue[i].decPid
        })
      }
      if (FavourList.length > 0) { // 需要取消标记
        this.$confirm('存在已标记的数据，是否取消标记？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '是',
          cancelButtonText: '否',
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              this.sendFavour(AllList)
            } else if (action === 'cancel') {
              this.sendFavour(inFavourList)
            }
            done()
          }
        })
      } else {
        this.sendFavour(AllList)
      }
    },
    // 往后端请求标星
    sendFavour (param) {
      this.$post({
        url: 'API@/dec-common/dec/common/favourDecList',
        data: param,
        success: (res) => {
          this.messageTips(res.message, 'success')
          if (this.QueryDecForm.declTrnrel === '9') {
            this.QueryDecForm.declTrnrel = '0,2'
          }
          this.isDisabled = false
          this.pageList()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 生成接单
    createBill (type) {
      if (type === 'createBill') {
        this.createBossId()
      } else {
        this.mergeDec()
      }
    },
    // 生成接单编号
    createBossId () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else if (len > 50) {
        this.messageTips('最多支持操作50条数据')
      } else {
        let AllPidLit = []
        let noExistPid = []
        let existbossId = []
        for (let i in this.tableValue) {
          if (!util.isEmpty(this.tableValue[i].bossId)) {
            if (this.tableValue[i].bossId.indexOf('-') > -1) {
              this.messageTips(this.tableValue[i].bossId + ':为拼票数据,不能重新生成接单')
              return false
            }
            existbossId.push(this.tableValue[i].decPid)
          } else {
            noExistPid.push(this.tableValue[i].decPid)
          }
          AllPidLit.push(this.tableValue[i].decPid)
        }
        this.createBillParam = AllPidLit
        this.createBillVisiable = true
      }
    },
    backCreateBill (item) {
      let param = {
        coverFlag: item.checked ? 1 : 0, // 覆盖位1 不覆盖为0
        companyId: item.companyId,
        company: item.company,
        flag: 0,
        list: item.list

      }
      this.sendCreateBossId(param)
      this.createBillVisiable = false
    },
    // 合并接单
    mergeDec () {
      let len = this.tableValue.length
      if (len < 2) {
        this.messageTips('至少选择两条数据')
        return false
      }
      let pidLit = []
      for (let i in this.tableValue) {
        if (!util.isEmpty(this.tableValue[i].bossId)) {
          this.messageTips('存在已生成接单的数据，请重新选择')
          return false
        }
        pidLit.push(this.tableValue[i].decPid)
      }
      if (pidLit.length > 0) {
        this.$post({
          url: 'API@/dec-common/dec/common/generateBossId',
          data: {
            'list': pidLit,
            'flag': '1'
          },
          success: (res) => {
            this.messageTips(res.message, 'success')
            if (this.QueryDecForm.declTrnrel === '9') {
              this.QueryDecForm.declTrnrel = '0,2'
            }
            this.isDisabled = false
            this.queryDecList()
          }
        })
      }
    },
    // 发出生成接单编号的数据
    sendCreateBossId (param) {
      this.$post({
        url: 'API@/dec-common/dec/common/generateBossId',
        data: param,
        success: (res) => {
          this.messageTips(res.message, 'success')
          if (this.QueryDecForm.declTrnrel === '9') {
            this.QueryDecForm.declTrnrel = '0,2'
          }
          this.isDisabled = false
          this.queryDecList()
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
    },
    // 导出
    exportDec (type) {
      rightsUtil.checkRights(() => {
        if (type === 'exportList') {
          this.listExport()
        } else {
          this.detailExport()
        }
      })
    },
    // 列表导出
    listExport () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择需要导出的数据！')
      } else {
        // 导出
        let pidLit = []
        for (let i in this.tableValue) {
          pidLit.push(this.tableValue[i].decPid)
        }
        this.$post({
          url: 'API@/dec-common/dec/common/exportDecList',
          data: {
            'list': pidLit
          },
          success: (res) => {
            window.open(res.result, '_blank')
          }
        })
      }
    },
    // 详情导出
    detailExport () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择需要导出的数据！')
      } else {
        // 导出
        let pidLit = []
        for (let i in this.tableValue) {
          pidLit.push(this.tableValue[i].decPid)
        }
        this.$post({
          url: 'API@/dec-common/dec/common/exportDecDetail',
          data: {
            'list': pidLit
          },
          success: (res) => {
            window.open(res.result, '_blank')
          }
        })
      }
    },
    // 打印通知书
    printNotice () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择一条需要打印通知书的数据')
      } else {
        // 查询勾选数据的回执数据
        let pidList = [] // 记录报关单编号
        let noEntryId = [] // 记录没有报关单编号的数据
        for (let i in this.tableValue) {
          // 排除没有统一编号的情况
          if (util.isEmpty(this.tableValue[i].entryId)) {
            noEntryId.push(this.tableValue[i].decPid)
          } else {
            pidList.push(this.tableValue[i].entryId)
          }
        }
        if (noEntryId.length > 0) {
          this.messageTips('系统编码为:' + noEntryId.join('、') + '没有统一编号，无法打印通知书')
          return
        }
        this.queryDecReceipt(pidList)
      }
    },
    // 智能制单
    OCRupLoad (type) {
      if (type === 'upload') {
        this.ocrVisable = true
      } else if (type === 'record') {
        this.ocrRcordVisable = true
      }
    },
    // 关闭 ocr 上传弹出框
    colseOCRCompnent () {
      this.ocrVisable = false
    },
    // 关闭 ocr 记录弹出框
    closeOCRcordCompnent () {
      this.ocrRcordVisable = false
    },
    // 关闭 同步记录 弹出框
    syncDecRcordCompnent () {
      this.syncDecRcordVisable = false
    },
    closeCoverCompnent () {
      this.coverVisable = false
    },
    receptionCoverData (res) {
      if (res.check) {
        window.localStorage.setItem('cover' + this.userId, '1')
      }
      let param = {
        isNeedUpdate: '1',
        seqNo: res.seqNo,
        iEFlag: res.iEFlag
      }
      this.coverLocalDec(param, 'update')
      this.coverVisable = false
    },
    // 查询报关单的回执情况 支持多票数据查询
    queryDecReceipt (pidList) {
      this.$post({
        url: 'API@/dec-common/dec/print/getNotice',
        data: {
          'entryIds': pidList
        },
        success: (res) => {
          if (res.code === '0000') {
            this.initPrintNoticeParam = {
              list: res.result
            }
            this.printNoticeVisable = true
          } else {
            this.messageTips(res.message)
          }
        }
      })
    },
    // 生成报文 发送到单一窗口进行暂存
    createXml () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else {
        let pidLit = []
        for (let i in this.tableValue) {
          pidLit.push(this.tableValue[i].decPid)
        }
        this.$post({
          url: 'API@/dec-common/dec/common/buildMessage',
          data: {
            'seqNos': pidLit,
            'operType': 'G'
          },
          success: (res) => {
            this.$alert(res.result, '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              dangerouslyUseHTMLString: true,
              confirmButtonText: '我知道了',
              type: 'warning',
              customClass: 'alert-tips-warning',
              callback: action => {
              }
            })
            if (res.code === '0000') {
              this.queryDecList()
            }
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
    },
    // 直接在单一窗口申报
    directDeclare () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else {
        let pidLit = []
        for (let i in this.tableValue) {
          pidLit.push(this.tableValue[i].decPid)
        }
        this.$post({
          url: 'API@/dec-common/dec/common/buildMessage',
          data: {
            'seqNos': pidLit,
            'operType': 'C'
          },
          success: (res) => {
            this.messageTips(res.result, 'success')
            this.queryDecList()
          }
        })
      }
    },
    changeFun (val) {
      this.tableValue = val
      this.checkedNum = val.length
    },
    // 列表排序
    fieldSort (param) {
      if (this.QueryDecForm.declTrnrel === '9') { // 报关单类型为其他时，不能调用排序
        return false
      }
      this.field = param.prop.replace('Value', '')
      this.order = param.order // 方法的方式 为 ascending, descending
      this.pageList()
    },
    // 点击行 选中时,前面的多选框同时需要选择
    rowClickChange (row, event, column) {
      let flag = false
      for (let i in this.tableValue) {
        if (this.tableValue[i].decPid === row.decPid) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$refs.decTable.toggleRowSelection(row, false)
      } else {
        this.$refs.decTable.toggleRowSelection(row, true)
      }
    },
    printDec (type) {
      if (type === 'printDec') {
        this.downLoadPdf()
      } else {
        this.printNotice()
      }
    },
    // 打开pdf打印组件
    downLoadPdf () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else if (len > 5) {
        this.messageTips('一次不能超过5条数据')
      } else {
        if (len > 1) {
          this.titleName = '批量打印报关单'
        } else {
          this.titleName = '打印报关单'
        }
        let pidLit = []
        for (let i in this.tableValue) {
          pidLit.push(this.tableValue[i].decPid)
        }
        this.printCompnentParam = {
          'type': this.QueryDecForm.declTrnrel,
          'pidList': pidLit,
          'userId': this.userId
        }
        this.printCompnentVisible = true
      }
    },
    // 关闭打印组件
    closePrintCompnent () {
      this.printCompnentVisible = false
    },
    // 关闭导入组件
    closeImportCompnent (value) {
      let isQuery = value.isQuery
      if (!util.isEmpty(isQuery) && isQuery === true) {
        this.pageList()
      }
      this.importCompnentVisible = false
    },
    // 查询回执信息
    lookReturnInfo (decPid) {
      this.returnParam = decPid.toString()
      this.tableHeight = 250
      this.returnCompnentVisible = true
    },
    // 关闭回执组件
    closeReturnCompnent () {
      this.returnCompnentVisible = false
      this.tableHeight = 400
      this.returnParam = ''
    },
    // 报关单类型change事件
    declTrnrelChange () {
      if (this.QueryDecForm.declTrnrel === '9') {
        this.isDisabled = true
        this.QueryDecForm = this.initQueryForm()
        this.QueryDecForm.declTrnrel = '9'
        this.QueryDecForm.seqNo = this.QueryDecForm.seqNo
        this.QueryDecForm.iEFlag = this.QueryDecForm.iEFlag
        this.dates = []
        // 切换到有统一编号的高级查询
        this.queryType = false
      } else {
        this.QueryDecForm.etpsCategory = 'D'
        this.isDisabled = false
      }
    },
    // 提交审核
    submitAudit () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
        return
      }
      if (len > 10) {
        this.messageTips('最多支持操作10条数据')
        return
      }
      let pidList = []
      let otherPidList = []
      // 判断 是否有不能提交审核的数据
      for (let i in this.tableValue) {
        if (['3', 'R', '6'].includes(this.tableValue[i].isExamine)) {
          otherPidList.push(this.tableValue[i].decPid)
        } else {
          pidList.push(this.tableValue[i].decPid)
        }
      }
      if (otherPidList.length > 0) {
        this.messageTips('系统编号:' + otherPidList.join('、') + '不能提交审核的数据，请重新选择')
        return
      }
      // 发送请求
      this.$post({
        url: 'API@/dec-common/dec/common/submitVerity',
        data: {
          'list': pidList
        },
        success: (res) => {
          // this.messageTips(res.message, 'success')
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
          if (res.code === '0000') {
            if (this.QueryDecForm.declTrnrel === '9') {
              this.QueryDecForm.declTrnrel = '0,2'
            }
            this.isDisabled = false
            this.queryDecList()
          }
        },
        other: (err) => {
          this.$alert(err.message, '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            dangerouslyUseHTMLString: true,
            confirmButtonText: '我知道了',
            type: 'warning',
            customClass: 'alert-tips-warning',
            callback: action => {
            }
          })
        }
      })
    },
    // 下载清单 打开 密码框或者清单编号框
    openBillCompent () {
      // 获取存在缓存在本地的密码
      let password = window.localStorage.getItem(this.userId)
      if (!util.isEmpty(password)) {
        try {
          window.EportClient.getGetCardUserInfoAll(password, (msg) => {
            // 存在缓存密码 并正确 则
            if (msg.Result) {
              this.userInfo = msg.Data[0].split('||')
              // 校验正确，则缓存到本地
              if (!util.isEmpty(this.userId)) {
                window.localStorage.setItem(this.userId, password)
              }
              this.billDownLoadVisible = true
            } else {
              this.passwordVisible = true
              // this.billDownLoadVisible = true
            }
          })
        } catch (e) {
          this.messageTips('读卡失败,请检查卡介质', 'error')
        }
      } else {
        this.passwordVisible = true
        // this.billDownLoadVisible = true
      }
    },
    // 可视化预览
    visibleView () {
      if (this.tableValue.length === 0) {
        this.messageTips('请选择一条需要预览的数据')
        return false
      }
      if (this.tableValue.length > 1) {
        this.messageTips('只能选择一条数据预览')
        return false
      }
      this.$router.push({
        name: 'decReviewedLook',
        params: {
          'pid': this.tableValue[0].decPid,
          'setTitle': '报关单审核预览' + '-' + this.tableValue[0].decPid,
          'setId': 'decReviewedLook' + 'look' + this.tableValue[0].decPid
        }
      })
    },
    // IC卡登陆
    verifyPassed () {
      if (util.isEmpty(this.passwordForm.password) || this.passwordForm.password.length !== 8) {
        this.messageTips('请填写8位IC卡密码')
        return
      }
      try {
        window.EportClient.getGetCardUserInfoAll(this.passwordForm.password, (msg) => {
          if (msg.Result) {
            this.userInfo = msg.Data[0].split('||')
            // 校验正确，则缓存到本地
            if (!util.isEmpty(this.userId)) {
              window.localStorage.setItem(this.userId, this.passwordForm.password)
            }
            // 关闭密码框
            this.passwordVisible = false
            this.billDownLoadVisible = true
          } else {
            this.messageTips(msg.Error[0], 'error')
          }
        })
      } catch (e) {
        this.messageTips('读卡失败,请检查卡介质', 'error')
      }
    },
    // 关联接单编号没有开启时,下载统一编号的方法
    downLoadSeqNo () {
      this.$post({
        url: 'API@/dec-common/dec/common/checkSeqNo',
        data: {
          ...this.QueryDecForm,
          page: this.paginationInit
        },
        success: (res) => {
          // 判断是否需要 覆盖
          if (res.result.code === '1') { // 1.代表我们数据库有这条数据
            this.$confirm('此数据在本系统存在，是否覆盖？', '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning'
            }).then(() => {
              // 覆盖操作
              let param = util.simpleClone(this.QueryDecForm)
              param['isNeedUpdate'] = '1'
              param['bossNo'] = res.result.bossNo
              this.coverLocalDec(param)
            }).catch(() => {
            })
          } else if (res.result.code === '-1') {
            this.messageTips(res.message, 'error')
          } else if (res.result.code === '3') { // 报关单数据与接单数据不一致
            this.$confirm(res.result.message + '<br>是否确认关联?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              type: 'warning'
            }).then(() => {
              this.configRelevance(res.result.decVO)
            }).catch(() => {
            })
          } else { // 直接入库 给了数据
            this.paginationInit = res.page
            this.decResultList = res.result.decList
          }
        }
      })
    },
    // 报关单一下点击覆盖本地数据时的操作
    coverLocalDec (param, type = 'down') {
      this.$post({
        url: 'API@/dec-common/dec/common/checkSeqNo',
        data: {
          ...param,
          page: this.paginationInit
        },
        success: (res) => {
          if (res.result.code === '-1') {
            this.messageTips(res.message, 'error')
          } else { // 直接入库 给了数据
            if (type === 'down') {
              if (this.contactBossIdVisible) { // 如果录入接单编号弹出 则关闭
                this.contactBossIdVisible = false // 关闭弹出框
                this.bossIdForm.bossId = ''
                this.bossIdForm.corpBusiNo = ''
              }
              this.paginationInit = res.page
              this.decResultList = res.result.decList
            } else if (type === 'update') {
              this.pageList()
            }
          }
        }
      })
    },
    // 关联接单编号开启时,下载统一编号的方法
    contactBossId () {
      if (util.isEmpty(this.bossIdForm.bossId) && util.isEmpty(this.bossIdForm.corpBusiNo)) {
        this.messageTips('接单编号和客户业务号必填其一')
        return
      }
      let param = {
        declTrnrel: '9', // 类型
        bossNo: this.bossIdForm.bossId, // 接单编号
        seqNo: this.QueryDecForm.seqNo, // 统一编号
        corpBusiNo: this.bossIdForm.corpBusiNo, // 客户业务号
        iEFlag: this.QueryDecForm.iEFlag // 进出口标识
      }
      this.$post({
        url: 'API@/dec-common/dec/common/checkSeqNo',
        data: {
          ...param,
          page: this.paginationInit
        },
        success: (res) => {
          // 判断是否需要 覆盖
          if (res.result.code === '1') { // 1.代表我们数据库有这条数据
            this.$confirm('此数据在本系统存在，是否覆盖？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning'
            }).then(() => {
              let para = util.simpleClone(this.QueryDecForm)
              para['bossNo'] = res.result.bossNo
              para['isNeedUpdate'] = '1'
              this.coverLocalDec(para)
            }).catch(() => {
            })
          } else if (res.result.code === '-1') {
            this.messageTips(res.message, 'error')
          } else if (res.result.code === '3') { // 报关单数据与接单数据不一致
            this.$confirm(res.result.message + '<br>是否确认关联?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              type: 'warning'
            }).then(() => {
              this.configRelevance(res.result.decVO)
            }).catch(() => {
            })
          } else { // res.result.code === '0' 或者 2 都为成功 成功
            this.messageTips(res.message, 'success')
            this.decResultList = res.result.decList
            this.paginationInit = res.page
            this.contactBossIdVisible = false // 关闭弹出框
            this.bossIdForm.bossId = ''
            this.bossIdForm.corpBusiNo = ''
          }
        }
      })
    },
    // 报关单与接单字段不一致时，确认关联
    configRelevance (decVo) {
      this.$post({
        url: 'API@/dec-common/dec/common/getAndSaveDec',
        data: decVo,
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.decResultList = res.result.decList
          this.paginationInit = res.page
          this.contactBossIdVisible = false // 关闭弹出框
          this.bossIdForm.bossId = ''
          this.bossIdForm.corpBusiNo = ''
        }
      })
    },
    querySearch (queryString, cb) {
      if (queryString.length < 2) {
        return
      }
      let restaurants = this.seqNoListOptions
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results.slice(0, 10))
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      this.QueryDecForm.seqNo = item.value
    },
    // 获取当前企业报关单的海关编码
    seqNoListFun () {
      return {
        url: 'API@/dec-common/dec/common/getHisSeqNo',
        data: {},
        success: (res) => {
          if (res.code === '0000' && res.result.length > 0) {
            for (let i in res.result) {
              this.seqNoListOptions.push({
                value: res.result[i]
              })
            }
          }
        }
      }
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      this.sccCode = this.$store.state.userLoginInfo.sccCode
      this.userId = this.$store.state.userLoginInfo.userId
      if (!util.isEmpty(this.userId)) {
        this.QueryDecForm.createUser = this.userId
        this.userList.push({
          codeField: this.userId,
          nameField: this.$store.state.userLoginInfo.userName
        })
        let fieldList = window.localStorage.getItem('DTH' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.fieldList, list)) {
            this.fieldList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem('DTH' + this.userId, JSON.stringify(this.fieldList))
          }
        }
      }
      // 初始化查询列表，因为要默认当前操作人 所以放到这里来
      if (util.isEmpty(this.$route.query.status)) {
        // 初始化查询日期
        this.setDefaultDate()
        // 进页面默认加载数据
        this.queryDecList()
      }
    },
    // 对比两个对象的KEY值是否一样
    compareFieldList (orig, compare) {
      let origKeys = Object.keys(orig)
      let compareKeys = Object.keys(compare)
      if (origKeys.length === compareKeys.length) {
        for (let i in origKeys) {
          if (origKeys[i] !== compareKeys[i]) {
            return false
          }
        }
        return true
      } else {
        return false
      }
    },
    // 查看 业务跟踪明细 打开业务跟踪明细弹出框
    lookTrackeDetail (row) {
      this.trackeParam = {
        'bossId': row.bossId,
        'decPid': row.decPid
      }
      this.trackeVisible = true
    },
    // 跳转到登账
    skipAccount (row) {
      this.$post({
        url: 'API@/dec-common/dec/finace/syncFinace',
        data: row.decPid,
        success: (res) => {
          if (res.result) {
            let iEFlag = (row.iEFlag === 'I' ? '0' : '1') // 0 进口 1 出口
            let param = `/finance/expense/detail?type=edit&iEFlag=${iEFlag}&expenseBillId=${res.result}&setTitle=台账编辑&setId=expense-detail${res.result}&businessType=1`
            let url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].FINCE + param
            window.open(url, '_blank')
          }
        }
      })
    },
    checkIfbind (row) {
      this.$post({
        url: 'API@/login/tenantConf/swAccountBound',
        data: {}, // 状态类别(E报关单,D随附单据,C报检,M修撤单,T转关单)
        isLoad: false,
        success: (res) => {
          if (res.result) {
            this.syncSingleData(row)
          } else {
            this.downLoadType = util.simpleClone(row)
            this.gotoBind = true
          }
        }
      })
    },
    // 同步单一窗口数据
    syncSingleData (row) {
      let isCover = window.localStorage.getItem('cover' + this.userId)
      let param = {
        isNeedUpdate: '1',
        seqNo: row.cusCiqNo,
        iEFlag: row.iEFlag
      }
      if (!util.isEmpty(isCover) && isCover === '1') {
        this.coverLocalDec(param, 'update')
      } else {
        this.initCoverParam = {
          seqNo: row.cusCiqNo,
          iEFlag: row.iEFlag
        }
        this.coverVisable = true
      }
    },
    // 业务跟踪明细 取消回参
    closeTrackeCompnent () {
      this.trackeVisible = false
    },
    // 业务跟踪明细 确定回参
    receptionTrackeData () {
      this.trackeVisible = false
    },
    // 打印通知书 返回数据
    receptionPrintNoticeData () {
      this.printNoticeVisable = false
    },
    // 打印通知书 取消打印
    closePrintNoticeCompnent () {
      this.printNoticeVisable = false
    },
    backBatchsync () {
      this.batchsyncVisiable = false
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      // key值 为DEC tableHead DTH加当前用户的id
      window.localStorage.setItem('DTH' + this.userId, JSON.stringify(this.fieldList))
    },
    // 可搜索框的远程搜索 客户业务好
    queryBusiNoSearch (queryString, cb) {
      let restaurants = this.corpBusiNoList
      let results = queryString ? restaurants.filter(this.createBossIdFilter(queryString)) : restaurants
      cb(results.slice(0, 10))
    },
    // 可搜索框的远程搜索 接单编号
    queryBossIdSearch (queryString, cb) {
      let restaurants = this.bossIdList
      let results = queryString ? restaurants.filter(this.createBossIdFilter(queryString)) : restaurants
      cb(results.slice(0, 10))
    },
    // 过滤值
    createBossIdFilter (queryString) {
      return (restaurant) => {
        // 过滤不合法的 接单编号
        if (util.isEmpty(restaurant.value.length !== 14)) {
          return false
        } else {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      }
    },
    openAccountDialog () {
      this.bindform = {
        account: '',
        password: ''
      }
      this.$nextTick(() => {
        this.$refs['bindform'].clearValidate()
      })
    },
    // 接收清单下载回参
    backQueryForm (param) {
      this.QueryDecForm = param.QueryDecForm
      this.isDisabled = param.isDisabled
    },
    // 接收清单下载回参
    backSyncForm () {
      this.pageList()
    }
  }
}
</script>

<style scoped lang="less">
  .query-main {
    // background-color: #f5f5f5;
    padding: 20px;
    font-size:12px;
    font-family: Arial,Microsoft YaHei,SimSun;
    height: calc(100% - 40px);
    overflow: auto;
  }
  .query-condition {
    background-color: #fff;
    padding: 20px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .op-btn {
    margin-bottom: 14px;
  }
  .query-btn {
    text-align: center;
  }
  .m-r-10{
    margin-right: 10px;
  }
  .span-right{
    float: right;
    margin-right: 5%;
    margin-top: 6px;
    color: @font-color-main;
    font-size: 14px;
    span{
      color: @sys-color-btn;
    }
  }
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
  }
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle
    }
    .border-0 {
      border: 0;
      margin-right: 5px;
    }
   .list-icon-look:hover i,.list-icon-look:focus i{
    background-color: #fff
    }
    .list-icon-edit:hover i,.list-icon-edit:focus i{
    background-color: #fff
    }
  .airvehicle-table-popper{
    min-width: auto;
    ul{
      height: 400px;
      overflow:auto;
        li{
            line-height: 20px;
            .el-checkbox__label{
                font-size: 12px;
            }
        }
    }
  }
  .airvehicle-list-drop {
    float: right;
  }
  .btn-padding {
    padding: 8px 20px !important;
    margin-left: 10px;
  }
</style>
