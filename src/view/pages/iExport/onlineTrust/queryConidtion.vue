<template>
<!-- 在线委托 查询界面组件-->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.six" :model="queryForm" size="mini" label-position="right">
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="流水号">
              <el-input v-model="queryForm.businessNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提运单号">
              <el-input v-model="queryForm.billNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单号">
              <el-input v-model="queryForm.entryId" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托客户">
              <el-select v-model="queryForm.entrustCompanyName" style="width:100%"
                filterable remote clearable
                :remote-method="getCorp"
                default-first-option>
                <el-option v-for="item in corpList" :key="item.corpId" :label="item.corpName" :value="item.corpName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="收发货人">
              <el-input v-model="queryForm.tradeName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="拼箱">
               <el-select placeholder="" v-model="queryForm.lclFlag" clearable filterable style="width:100%">
                  <el-option
                  v-for="item in lclFlagList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单状态">
               <el-select placeholder="" v-model="queryForm.status" clearable filterable style="width:100%">
                  <el-option
                  v-for="item in decStatus"
                  :key="item.codeField + '-' + item.nameField"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托状态">
               <el-select placeholder="" v-model="queryForm.entrustStatus" clearable filterable style="width:100%">
                <el-option
                v-for="item in entrustStatusTypeList"
                :key="item.codeField + '-' + item.nameField"
                :label="item.nameField"
                :value="item.codeField">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12">
          <el-form-item label="委托时间">
            <el-date-picker v-model="entrustTime" style="width:100%"
              type="datetimerange" clearable
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format= 'yyyy-MM-dd HH:mm'
              value-format= 'yyyy-MM-dd HH:mm'
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12">
          <el-form-item label="申报截至时间">
            <el-date-picker v-model="decTime" style="width:100%"
              type="datetimerange" clearable
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format= 'yyyy-MM-dd HH:mm'
              value-format= 'yyyy-MM-dd HH:mm'
              >
            </el-date-picker>
          </el-form-item>
        </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryList" class= 'btn-padding' >查询</el-button>
            <el-button size="mini" @click="resetForm" class= 'btn-padding'>重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
      <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-upload" @click="docUpload('add', {})"><i></i>单证上传</el-button>
        <el-button size="mini" class="list-btns list-icon-delete"  @click="deleteOnline"><i></i>删除</el-button>
        <el-button size="mini" class="list-btns list-icon-emailSend"  @click="openSendEntrust"><i></i>发送委托</el-button>
        <el-button size="mini" class="list-btns list-icon-refresh" @click="pageList($store.state.pagination)"><i></i>刷新</el-button>
        <el-button size="mini" class="list-btns list-icon-rollback" @click="returnEntrust"><i></i>撤回</el-button>
        <el-dropdown @command="freezeOrUnfreeze">
          <el-button size="mini" class="list-btns list-icon-forbidden"><i></i>冻结/解冻</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="freeze">冻结</el-dropdown-item>
            <el-dropdown-item command="unfreeze">解冻</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-download" @click="downLoad"><i></i>批量下载</el-button>
        <el-button size="mini" class="list-btns list-icon-abnormal" @click="abnormityStatus"><i></i>异常状态单</el-button>
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
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table'
        :data="resultList" border highlight-current-row size="mini"
        @selection-change="changeFun" height="408px">
        <el-table-column  type="selection" align='center' min-width="40"></el-table-column>
        <el-table-column label="流水号" align='center' prop="businessNo" min-width="120" v-if="fieldList.businessNo.value">
          <template slot-scope="scope">
            <div>{{scope.row.businessNo || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="委托状态" align='center' prop="entrustStatusValue" min-width="90" v-if="fieldList.entrustStatusValue.value">
          <template slot-scope="scope">
            <div>{{scope.row.entrustStatusValue || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="报关单状态" align='center' prop="statusValue" min-width="90" v-if="fieldList.statusValue.value">
          <template slot-scope="scope">
            <div>{{scope.row.statusValue || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="提单号" align='center' prop="billNo" min-width="90" v-if="fieldList.billNo.value">
          <template slot-scope="scope">
            <div>{{scope.row.billNo || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="报关单号" align='center' prop="entryId" min-width="90" v-if="fieldList.entryId.value">
          <template slot-scope="scope">
            <div>{{scope.row.entryId || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="委托客户" align='left' prop="entrustCompanyName" min-width="150" v-if="fieldList.entrustCompanyName.value">
          <template slot-scope="scope">
            <div>{{scope.row.entrustCompanyName || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="收发货人" align='left' prop="tradeName" min-width="150" v-if="fieldList.tradeName.value">
          <template slot-scope="scope">
            <div>{{scope.row.tradeName || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="拼箱" align='center' prop="lclFlag" min-width="50" v-if="fieldList.lclFlag.value">
          <template slot-scope="scope">
            <div>{{scope.row.lclFlag ? (scope.row.lclFlag == '0' ? '整箱' : '拼箱') : '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="截至申报时间" align='center' prop="demandDate" min-width="150" v-if="fieldList.decTime.value">
          <template slot-scope="scope">
            <div>{{scope.row.demandDate || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="委托时间" align='center' prop="entrustTime" min-width="150" v-if="fieldList.entrustTime.value">
          <template slot-scope="scope">
            <div>{{scope.row.entrustTime || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align='center' min-width="100" >
          <template slot-scope="scope">
            <el-button title="详情" type="text" class="table-icon list-icon-look" @click="docUpload('view', scope.row)"><i></i></el-button>
            <el-button title="回执" type="text" class="table-icon list-icon-scan" v-show='scope.row.entrustStatus !== "0" && scope.row.entrustStatus !== "1"' @click="receipt(scope.row)"><i></i></el-button>
            <el-button title="下载" type="text" class="table-icon list-icon-download" v-show='scope.row.status === "9"'  @click="downLoad(scope.row)"><i></i></el-button>
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
    <!-- 单证上传弹窗 -->
    <document-upload :uploadVisible.sync="uploadVisible" :operationType="operationType" :entrustInfo="entrustInfo"></document-upload>
    <!-- 发送委托 -->
    <send-entrust :sendEntrustVisable.sync="sendEntrustVisable" @close:sendEntrust='sendEntrust'></send-entrust>
    <!-- 冻结原因 -->
    <frozen-reason :frozenReasonVisable.sync="frozenReasonVisable" @close:frozenReason='backFrozenReason'></frozen-reason>
    <!-- 回执 -->
    <return-receipt :receiptVisable.sync="receiptVisable" :businessNo = 'businessNo' v-if='receiptVisable'></return-receipt>
  </section>
</template>
<script>
import util from '@/common/util'
import {tableHeadFieldList} from './utils/tableHeadFields'
import {lclFlagList, taskTypeList, entrustStatusTypeList, decStatus} from './utils/status'
import documentUpload from './components/documentUpload.vue'
import sendEntrust from './components/sendEntrust.vue'
import frozenReason from './components/frozenReason.vue'
import returnReceipt from './components/returnReceipt'
export default {
  components: {
    documentUpload,
    sendEntrust,
    frozenReason,
    returnReceipt
  },
  data () {
    return {
      queryForm: this.initForm(),
      decStatus: decStatus,
      lclFlagList: lclFlagList,
      taskTypeList: taskTypeList,
      entrustStatusTypeList: entrustStatusTypeList,
      fieldList: tableHeadFieldList,
      decTime: [],
      entrustTime: [],
      userId: '', // 当前用户的id,
      resultList: [],
      selectData: [],
      corpList: [],
      uploadVisible: false, // 单证上传弹窗
      operationType: '',
      entrustInfo: {},
      sendEntrustVisable: false,
      frozenReasonVisable: false,
      receiptVisable: false,
      businessNo: ''
    }
  },
  created () {
    // this.pageList(this.$store.state.pagination)
  },
  mounted () {
  },
  methods: {
    initForm () {
      return {
        billNo: '', // '提运单号'
        businessNo: '', // '流水ID'
        demandDateEnd: '', // '申报截止时间结束'
        demandDateStart: '', // '申报截止时间开始'
        entrustCompanyName: '', // '委托用户'
        entrustStatus: '', // '委托状态'
        entrustTimeEnd: '', // '委托时间结束'
        entrustTimeStart: '', // '委托时间开始'
        entryId: '', // '报关单号'
        lclFlag: '', // '拼箱标识'
        simpleQuery: true, // true 普通查询 false 异常状态单查询 默认为普通查询
        status: '', // '申报状态'
        tradeName: '' // '境内收发货人名称'
      }
    },
    // 重置
    resetForm  () {
      this.queryForm = this.initForm()
      this.entrustTime = []
      this.decTime = []
      this.pageList(this.$store.state.pagination)
    },
    queryList () {
      this.queryForm['simpleQuery'] = true
      this.pageList(this.$store.state.pagination)
    },
    // 列表查询
    pageList (pagination) {
      if (this.entrustTime === [] || this.entrustTime === null) {
        this.queryForm.entrustTimeStart = ''
        this.queryForm.entrustTimeEnd = ''
      } else {
        this.queryForm.entrustTimeStart = this.entrustTime[0]
        this.queryForm.entrustTimeEnd = this.entrustTime[1]
      }
      if (this.decTime === [] || this.decTime === null) {
        this.queryForm.demandDateStart = ''
        this.queryForm.demandDateEnd = ''
      } else {
        this.queryForm.demandDateStart = this.decTime[0]
        this.queryForm.demandDateEnd = this.decTime[1]
      }
      this.$post({
        url: 'API@/dec-common/entrust/getEntrustList',
        data: {
          ...this.queryForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.resultList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    changeFun (val) {
      this.selectData = val
    },
    // 获取委托客户
    getCorp (query) {
      if (query.length < 2) {
        this.corpList = []
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: query,
          returnProps: ['sccCode', 'tradeCode', 'ciqCode', 'corpId', 'corpName']
        },
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.corpList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      if (!util.isEmpty(this.userId)) {
        let fieldList = window.localStorage.getItem('onlineTrustQuery' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.fieldList, list)) {
            this.fieldList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem('onlineTrustQuery' + this.userId, JSON.stringify(this.fieldList))
          }
        }
      }
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      // key值 为DEC tableHead DTH加当前用户的id
      window.localStorage.setItem('onlineTrustQuery' + this.userId, JSON.stringify(this.fieldList))
    },
    // 对比两个数组里的值是否一样
    compareFieldList (orig, compare) {
      if (orig.length === compare.length) {
        for (let i in orig) {
          if (orig[i].text !== compare[i].text) {
            return false
          }
        }
        return true
      } else {
        return false
      }
    },
    // 跳转编辑页面
    editDetail (row) {
      let flag = row.bizInfo.split('|')
      let pageType = (flag[1] === '0' ? 'declaration' : 'recordList')
      let iEFlag = (flag[0] === 'I' ? 'import' : 'export')
      // let pageType = row.declTrnrel === '0' ? 'declaration' : 'recordList'
      // let iEFlag = row.iEFlag === 'I' ? 'import' : 'export'
      // this.gotoDecPage(pageType, iEFlag, 'edit', row.taskId)
      this.gotoDecPage(pageType, iEFlag, 'edit', row.businessNo)
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 报关单   recordList 备案清单
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoDecPage (funFlag, flag, operationType, pid = 'new') {
      let routeParam = {
        'declaration@import@look': {setTitle: '进口报关单(智能录入)', setId: 'importInDecIntelligentLook'},
        'declaration@import@edit': {setTitle: '进口报关单(智能录入)', setId: 'importDecIntelligentEdit'},
        'declaration@export@edit': {setTitle: '出口报关单(智能录入)', setId: 'exportDecIntelligentEdit'},
        'declaration@export@look': {setTitle: '出口报关单(智能录入)', setId: 'exportDecIntelligentLook'},
        'recordList@import@look': {setTitle: '进境备案清单(智能录入)', setId: 'importRecordIntelligentLook'},
        'recordList@import@edit': {setTitle: '进境备案清单(智能录入)', setId: 'importRecordIntelligentEdit'},
        'recordList@export@look': {setTitle: '出境备案清单(智能录入)', setId: 'exportRecordIntelligentLook'},
        'recordList@export@edit': {setTitle: '出境备案清单(智能录入)', setId: 'exportRecordIntelligentEdit'}
      }
      let para = `${funFlag}@${flag}@${operationType}`
      this.$router.push({
        name: 'intelligentVouching',
        params: {
          'pid': pid,
          'funFlag': funFlag,
          'iEFlag': flag,
          'operationType': operationType,
          'setTitle': routeParam[para].setTitle + '-' + pid,
          'setId': routeParam[para].setId + pid
        },
        query: {
          aiType: 'Intelligent',
          operation: 'add'
        }
      })
    },
    // 单证上传弹窗
    docUpload (type, data) {
      if (type === 'add') {
        this.entrustInfo = data
        this.operationType = type
        this.uploadVisible = true
        return
      }
      this.$post({
        url: 'API@/dec-common/entrust/getEntrustDetail',
        data: data.businessNo,
        success: (res) => {
          if (res.result) {
            this.entrustInfo = res.result
            this.operationType = type
            this.uploadVisible = true
          }
        }
      })
    },
    // 查看回执
    receipt (data) {
      this.businessNo = data.businessNo
      this.receiptVisable = true
    },
    // 删除 在线委托
    deleteOnline () {
      if (this.selectData.length === 0) {
        this.messageTips('请选择至少一条数据', 'error')
        return false
      }
      let list = []
      this.selectData.forEach(e => {
        list.push(e.businessNo)
      })
      this.$confirm('确定要删除此数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$post({
          url: 'API@/dec-common/entrust/deleteEntrust',
          data: list,
          success: (res) => {
            this.messageTips(res.message, 'success')
            // 重新查询
            this.pageList(this.$store.state.pagination)
          }
        })
      }).catch(() => {
      })
    },
    openSendEntrust () {
      // 弹出 输入委托行
      if (this.selectData.length === 0) {
        this.messageTips('请选择至少一条数据', 'error')
        return false
      }
      this.sendEntrustVisable = true
    },
    // 发送委托
    sendEntrust (param) {
      this.sendEntrustVisable = false
      let list = []
      this.selectData.forEach(item => {
        list.push(item.businessNo)
      })
      this.$post({
        url: 'API@/dec-common/entrust/sendEntrust',
        data: {
          businessNos: list,
          sccCode: param.sccCode
        },
        success: (res) => {
          this.messageTips(res.message, 'success')
          // 重新查询
          this.pageList(this.$store.state.pagination)
        },
        other: (err) => {
          this.messageTips(err.message, 'error')
        }
      })
    },
    // 退单
    returnEntrust () {
      // 委托方在【等待处理、委托成功】状态下，并报关单未操作【发送】单一的动作前，都可操作。
      let list = []
      this.selectData.forEach(item => {
        list.push(item.businessNo)
      })
      this.$post({
        url: 'API@/dec-common/entrust/cancelEntrust',
        data: {
          nos: list
        },
        success: (res) => {
          this.messageTips(res.message, 'success')
          // 重新查询
          this.pageList(this.$store.state.pagination)
        },
        other: (err) => {
          this.messageTips(err.message, 'error')
        }
      })
    },
    freezeOrUnfreeze (type) {
      // 委托方在【等待处理、委托成功】状态下，并报关单未操作【发送】单一的动作前，都可操作。
      // 冻结时要填写冻结原因，解冻后，报关行可继续对此单继续操作。状态仍旧是冻结前状态。
      if (this.selectData.length === 0) {
        let tips = type === 'freeze' ? '请选择需要冻结的数据！' : '请选择需要解冻的数据！'
        this.messageTips(tips, 'warning')
        return
      }
      if (type === 'freeze') {
        this.frozenReasonVisable = true
      } else if (type === 'unfreeze') {
        // 判断是否未冻结转台
        let url = 'API@/dec-common/entrust/unfrozenEntrust'
        this.sendFrozenReason(url)
      }
    },
    backFrozenReason (param) {
      let url = 'API@/dec-common/entrust/frozenEntrust'
      this.sendFrozenReason(url, param.frozenReason)
      this.frozenReasonVisable = false
    },
    sendFrozenReason (url, frozenReason) {
      let list = []
      this.selectData.forEach(item => {
        list.push(item.businessNo)
      })
      this.$post({
        url: url,
        data: {
          nos: list,
          frozenReason: frozenReason
        },
        success: (res) => {
          this.pageList(this.$store.state.pagination)
        },
        other: (err) => {
          this.messageTips(err.message, 'error')
        }
      })
    },
    // 批量下载
    downLoad (row) {
      // 当报关单状态为【放行】时，可进行单票下载或批量下载。
      let list = []
      if (row && row.businessNo) {
        list.push(row.businessNo)
      } else {
        if (this.selectData.length === 0) {
          this.messageTips('请选择需要下载的数据')
          return false
        }
        this.selectData.forEach(item => {
          list.push(item.businessNo)
        })
      }
      this.$post({
        url: 'API@/dec-common/entrust/downDecPdf',
        data: list,
        success: (res) => {
          this.messageTips(res.message, 'success')
          let list = res.result
          for (let item in list) {
            window.open(list[item], '_blank')
          }
        }
      })
    },
    // 异常状态
    abnormityStatus () {
      // 当点击此按钮时，自动筛选所有异常状态单证，默认1个月内，如用户需要改时间段，可通过上方委托时间来更改。
      // 异常状态单：海关回执异常状态的报关单，包括：退回、删单、改单、查验。
      this.queryForm.simpleQuery = false
      // 如果委托时间没有填写 默认未一个月
      if (!this.entrustTime || this.entrustTime.length === 0) {
        let end = new Date()
        let start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        let startMonth = start.getMonth() + 1
        let startDate = start.getFullYear() + '-' + startMonth + '-' + start.getDate() + ' 00:00'
        let endMonth = end.getMonth() + 1
        let endDate = end.getFullYear() + '-' + endMonth + '-' + end.getDate() + ' 23:59'
        this.entrustTime = [startDate, endDate]
      }
      this.pageList(this.$store.state.pagination)
    }
  }
}
</script>

<style scoped lang="less">
  .query-main {
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
    font-size: 0;
  }
  .mg-r-10{
    margin-right: 10px;
  }
  .query-btn {
    text-align: center;
  }
  .icon-btn {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: sub;
    margin-right: 5px;
  }
  .btn-padding {
    padding: 8px 20px !important;
  }
  .airvehicle-table-popper{
    min-width: auto;
    ul{
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
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle
    }
  .upload-demo {
    display: inline-block;
  }
</style>
