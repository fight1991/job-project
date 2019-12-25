<template>
  <section class='sys-main flatList'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.six"  :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="账单企业">
              <el-autocomplete style="width:100%;"
                class="inline-input" :maxlength="30" clearable
                v-model="QueryForm.settleCompanyName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                placeholder="请选择">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="收付类型">
              <el-select v-model="QueryForm.feeFlag" size="mini" clearable  style="width:100%;">
                <el-option key="0" :label="'应收'" :value="true"></el-option>
                <el-option key="1" :label="'应付'" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="币制">
              <!-- <el-select  v-model="QueryForm.curr" placeholder="币制"
                filterable clearable remote default-first-option
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
              <el-input v-model="QueryForm.curr" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="对账状态">
              <el-select v-model="QueryForm.reconStatus" size="mini" clearable style="width:100%;">
                <el-option key="0" :label="'待审核'" :value="1"></el-option>
                <el-option key="6" :label="'审核退回'" :value="2"></el-option>
                <el-option key="9" :label="'待对账'" :value="3"></el-option>
                <el-option key="13" :label="'对账驳回'" :value="4"></el-option>
                <el-option key="14" :label="'对账确认'" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="开票状态">
              <el-select v-model="QueryForm.invoiceStatus" size="mini" clearable style="width:100%;">
                <el-option key="0" :label="'未开票'" :value="'0'"></el-option>
                <el-option key="1" :label="'已开票'" :value="'1'"></el-option>
                <el-option key="2" :label="'已结案'" :value="'3'"></el-option>
                <el-option key="3" :label="'开票中'" :value="'4'"></el-option>
                <!-- 0未开票1已开票 3已结案 4 开票中 -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="平账状态">
              <el-select v-model="QueryForm.flatStatus" size="mini" clearable style="width:100%;">
                <el-option key="0" :label="'未平账'" :value="'0'"></el-option>
                <el-option key="6" :label="'已平账'" :value="'1'"></el-option>
                <el-option key="9" :label="'部分平账'" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="操作人">
              <el-input v-model="QueryForm.createUserId" size="mini" clearable :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单号">
              <el-input v-model="QueryForm.decNo" size="mini" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="接单编号">
              <el-input v-model="QueryForm.orderNo" size="mini" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提单号">
              <el-input v-model="QueryForm.billNo" size="mini" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="账单生成日期">
              <el-date-picker
                style="width:100%"
                v-model="dates"
                type="daterange"
                align="right"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                 end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="入账日期">
              <el-date-picker
                style="width:100%"
                v-model="QueryForm.entryDate"
                align="right"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
      <el-row class="query-btn" style="text-align:center">
        <el-button size="mini" type="primary" @click="getAccountList($store.state.pagination)">查询</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-check" v-permissions="'CCBA21604010000'" :disabled="accountBillIdsStatus.length === 0" @click="accountCheck('verifys')"><i></i>批量审核确认</el-button>
        <el-button size="mini" class="list-btns list-icon-reject" v-permissions="'CCBA21604020000'" :disabled="accountBillIdsStatus.length === 0" @click="accountCheck('rejects')"><i></i>批量审核驳回</el-button>
        <el-button size="mini" class="list-btns list-icon-accountPass" v-permissions="'CCBA21604040000'" :disabled="reconStatusId.length === 0" @click="accountCheck('ensure')"><i></i>批量对账确认</el-button>
        <!-- 对账单导出选项 -->
        <el-dropdown trigger="click" @command="getAccountItem" placement="bottom-start">
          <el-button size="mini" :disabled="accountBillIds.length === 0" class="list-btns list-icon-export">
            <i></i>对账单导出
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1" :key="'1'">普通Excel样式导出</el-dropdown-item>
            <el-dropdown-item :command="2" :key="'2'">金蝶样式导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 开票选项 -->
        <el-dropdown trigger="click" @command="getInvoiceItem" placement="bottom-start">
          <el-button size="mini" class="list-btns list-icon-invoice" :disabled="optionIds.data.length === 0 || !optionIds.isHas">
            <i></i>开票
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1" :key="'1'">增值税普通发票</el-dropdown-item>
            <el-dropdown-item :command="2" :key="'2'">增值税专用发票</el-dropdown-item>
            <!-- <el-dropdown-item :command="3" :key="'3'">形式发票</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
      <el-table class='sys-table-table' align="left" size="mini"
        row-key="accountBillId"
        :data="accountTableList" border highlight-current-row height="530px" ref="accountTable"
        @select="selectParentRow"
        @select-all="selectParentRowAll"
        @selection-change="getParentSelect"
        @expand-change="expandChange">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column type="expand" width="50" label="展开">
          <!-- 展开项 -->
          <template slot-scope="scope">
            <el-table class='sys-table-table' size="mini"
              row-key="accountBillOptionId"
              :ref="'childrenTable' + scope.row.accountBillId"
              v-if="scope.row.accountBillOptionPageVOs && scope.row.accountBillOptionPageVOs.length > 0" align="left"
              :data="scope.row.accountBillOptionPageVOs" border
              @select="((select, row) => {selectChildrenRow(select, row, scope.row)})"
              @select-all="((select) => {selectChildrenRowAll(select, scope.row)})">
              <el-table-column type="selection" width="40">
              </el-table-column>
              <el-table-column label="接单编号" min-width="140" prop="orderNo">
                <template slot-scope="scope">
                  {{scope.row.orderNo || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="报关单号" min-width="140" prop="decNo">
                <template slot-scope="scope">
                  {{scope.row.decNo || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="提单号" min-width="140" prop="billNo">
                <template slot-scope="scope">
                  {{scope.row.billNo || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="费用项" min-width="100" prop="feeOptionName">
              </el-table-column>
              <el-table-column label="币制" min-width="100" prop="curr" align="center">
              </el-table-column>
              <el-table-column label="金额" min-width="100" prop="taxPrice" align="right">
                <template slot-scope="scope">
                  {{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="委托企业" min-width="160" prop="entrustCompanyName">
                <template slot-scope="scope">
                  {{scope.row.entrustCompanyName || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="开航/放行日" min-width="100" prop="sailDay" align="center">
                <template slot-scope="scope">
                  {{scope.row.sailDay || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="开票状态" min-width="80" prop="invoiceStatusValue" align="center">
                <template slot-scope="scope">
                  {{scope.row.invoiceStatusValue || '-'}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="账单企业" min-width="160" prop="settleCompanyName">
        </el-table-column>
        <el-table-column label="收付类型" min-width="100" prop="feeFlagValue" align="center">
        </el-table-column>
        <el-table-column label="含税总额" min-width="100" prop="feeRateAmount" align="left">
          <template slot-scope="scope">
            {{jsonToString(scope.row.feeRateAmount)}}
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="80" prop="createUserName" align="center">
        </el-table-column>
        <el-table-column label="账单生成时间" min-width="160" prop="createDate" align="center">
        </el-table-column>
        <el-table-column label="对账状态" min-width="100" prop="reconStatusValue" align="center">
        </el-table-column>
        <el-table-column label="开票状态" min-width="100" prop="invoiceStatusValue" align="center">
        </el-table-column>
        <el-table-column label="平账状态" min-width="100" prop="flatStatusValue" align="center">
        </el-table-column>
        <el-table-column label="导出状态" min-width="100" prop="jdFlagValue" align="center">
        </el-table-column>
        <el-table-column label="操作" width="130" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="sys-td-c">
              <el-button type="text" title="账单查看" class="table-icon list-icon-look" @click.stop="goToAccountDetail('look', scope.row.accountBillId)"><i></i></el-button>
              <el-button type="text" title="账单审核" class="table-icon list-icon-subimtCheck" v-if="scope.row.reconStatus === 1" v-permissions="'CCBA21604030000'" @click.stop="goToAccountDetail('check', scope.row.accountBillId)"><i></i></el-button>
              <el-button type="text" title="驳回编辑" class="table-icon list-icon-edit" v-if="scope.row.reconStatus === 4" @click.stop="goToAccountCheck(scope.row.accountBillId, scope.row.feeFlag)"><i></i></el-button>
              <el-button type="text" title="开票" class="table-icon list-icon-invoice" v-if="scope.row.reconStatus === 5 && scope.row.invoiceStatus === 0" @click.stop="showDialog(scope.row.accountBillOptionPageVOs)"><i></i></el-button>
              <el-button type="text" title="对账" class="table-icon list-icon-accountPass" v-if="scope.row.reconStatus === 3" @click.stop="goToAccountDetail('pass', scope.row.accountBillId)"><i></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pageSizes="[10, 20, 50, 100, 200, 500]" :pagination='paginationInit' @change="getAccountList"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 发票选择 -->
    <el-dialog title="请选择开票类型" :modal-append-to-body="false" @close="resetDialog" :visible.sync="ticketIsShow" :close-on-click-modal='false' width="360px">
      <div  class="dec-div">
        <el-form size="mini" :label-width="labelFormWidth.four">
          <el-row class="selectTicket">
           <el-radio-group v-model="ticketValue">
             <el-row class="selectTicket-p"><el-radio :label="1">增值税普通发票</el-radio></el-row>
             <el-row class="selectTicket-p"><el-radio :label="2">增值税专用发票</el-radio></el-row>
             <!-- <el-row class="selectTicket-p"><el-radio :label="3">形式发票</el-radio></el-row> -->
            </el-radio-group>
          </el-row>
        </el-form>
        <el-row class="query-btn dialog-btn" style="text-align:center">
          <el-button size="mini" type="primary" @click="confirmDialog">确认</el-button>
          <el-button size="mini" @click="resetDialog">取消</el-button>
        </el-row>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import util from '@/common/util'
import commonParam from '@/common/commonParam'
import finStore from '../finStore'
export default {
  data () {
    return {
      dates: '',
      ticketIsShow: false,
      ticketValue: '',
      ticketIds: [],
      accountBillOptionIds: {},
      accountBillIdSelect: [],
      settleCompanyList: [],
      QueryForm: {
        createStartDate: '', // 生成时间
        createEndDate: '',
        createUserId: '', // 输入姓名
        curr: 'CNY', // 币制传英文缩写如CNY、USD
        feeFlag: '',
        flatStatus: '', // 平账状态0未平账1已平账2部分平账
        invoiceStatus: '', // 对账状态1待审核，2审核退回，3待对账，4对账驳回，5对账确认
        settleCompanyName: '', // 账单企业
        entryDate: '',
        orderNo: '',
        decNo: '',
        billNo: ''
      },
      accountTableList: [],
      // 查询的字典字段
      tableNameList: {
        tableNames: [
          'SAAS_CURR' // 币制
        ]
      },
      currList: [],
      selectObj: {
        obj: '',
        params: ''
      },
      paginationInit: '',
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
      },
      pickerOptions2: {
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
      }
    }
  },
  computed: {
    ...mapState({ // 查看vuex中当前登录的userId
      currentUser (state) {
        return state.userLoginInfo.userId
      }
    }),
    optionIds () { // 必须是对账确认状态,且全部是未开票状态
      let tempArr = {
        isHas: true,
        data: []
      }
      if (this.accountBillOptionIds && JSON.stringify(this.accountBillOptionIds !== '{}')) {
        for (let k in this.accountBillOptionIds) {
          this.accountBillOptionIds[k].forEach(v => {
            if (v.reconStatus === 5 && v.invoiceStatus === 0) {
              tempArr.data.push(v.accountBillOptionId)
            } else { // 保证每一票数据全部是开票状态
              tempArr.isHas = false
            }
          })
          if (!tempArr.isHas) break
        }
      }
      return tempArr
    },
    accountBillIds () { // 导出对账单
      return this.accountBillIdSelect.map(v => v.accountBillId)
    },
    accountBillIdsStatus () { // 待审核状态下批量审核驳回
      let flag = this.accountBillIdSelect.every(v => v.reconStatus === 1)
      if (flag) {
        return this.accountBillIdSelect.map(v => v.accountBillId)
      }
      return []
    },
    reconStatusId () { // 待对账状态下批量对账
      let flag = this.accountBillIdSelect.every(v => v.reconStatus === 3)
      if (flag) {
        return this.accountBillIdSelect.map(v => v.accountBillId)
      }
      return []
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'accountManage-list' && to.query.from === 'other' && (from.name === 'billManage-invoiceDetail' || from.name === 'accountManage-detail' || from.name === 'accountManage-check')) {
        this.getAccountList(this.$store.state.pagination)
      }
    }
  },
  created () {
    this.$store.registerModule('finance-module', finStore)
    this.getCommonParam()
    this.getSettleCompanyInfo()
    this.paginationInit = this.$store.state.pagination
    this.getAccountList(this.$store.state.pagination)
  },
  beforeDestroy () {
    this.$store.unregisterModule('finance-module')
  },
  methods: {
    // 获取账单企业列表
    getSettleCompanyInfo () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/getSettleCompanyInfo',
        data: '',
        router: this.$router,
        success: ({result}) => {
          this.settleCompanyList = result || []
        }
      })
    },
    querySearch (queryString, cb) {
      let results = []
      if (this.settleCompanyList.length === 0) return cb(results)
      let restaurants = this.settleCompanyList
      if (queryString.trim().length > 1) {
        results = restaurants.filter(v => {
          return (v && v.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
        })
      }
      if (results.length === 0) return cb(results)
      let tempArr = results.map(item => ({value: item}))
      cb(tempArr)
    },
    // 判断缓存中是否有数据
    getCommonParam () {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map)
      }
    },
    // 获取公共字典list
    getCommonParams (datas) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
        }
      })
    },
    checkParamsList (query) {
      if (query !== '') {
        let keyValue = query.toString().trim()
        let list = JSON.parse(localStorage.getItem(this.selectObj.params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          this[this.selectObj.obj] = list.slice(0, 30)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          this[this.selectObj.obj] = filterList.slice(0, 30)
        }
      } else {
        if (!util.isEmpty(JSON.parse(localStorage.getItem(this.selectObj.params)))) {
          this[this.selectObj.obj] = JSON.parse(localStorage.getItem(this.selectObj.params)).slice(0, 30)
        }
      }
    },
    // 创建字典参数列表
    tipsFill (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 获取账单列表
    getAccountList (pagination) {
      if (this.dates && this.dates.length > 0) {
        this.QueryForm.createStartDate = this.dates[0]
        this.QueryForm.createEndDate = this.dates[1]
      } else {
        this.QueryForm.createStartDate = ''
        this.QueryForm.createEndDate = ''
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/gets',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          if (res.result && res.result.length > 0) {
            res.result.forEach(v => {
              if (v.accountBillOptionPageVOs && v.accountBillOptionPageVOs.length > 0) {
                v.accountBillOptionPageVOs.forEach(item => {
                  item.reconStatus = v.reconStatus
                })
              }
            })
            this.accountTableList = res.result
          } else {
            this.accountTableList = []
          }
          this.accountBillOptionIds = {}
          this.accountBillIdSelect = []
        }
      })
    },
    // 重置查询条件
    resetForm () {
      this.QueryForm = {
        createStartDate: '',
        createEndDate: '',
        createUserId: '',
        curr: 'CNY',
        feeFlag: '',
        flatStatus: '',
        invoiceStatus: '',
        settleCompanyName: '',
        entryDate: '',
        orderNo: '',
        decNo: '',
        billNo: ''
      }
      this.dates = ''
    },
    // 将json字符串转换成字符串
    jsonToString (json) {
      let obj = JSON.parse(json)
      let arr = []
      for (let k in obj) {
        arr.push(k + ':' + obj[k].toLocaleString())
      }
      return arr.join(' + ')
    },
    // 批量审核驳回/确认
    accountCheck (type, verifyMsg = '') {
      let url = 'account/' + type
      this.$store.dispatch('ajax', {
        url: `API@saas-finance/${url}`,
        data: {
          accountBillIds: type === 'ensure' ? this.reconStatusId : this.accountBillIdsStatus,
          verifyMsg
        },
        router: this.$router,
        success: res => {
          this.$message({
            type: 'success',
            message: type === 'rejects' ? '批量驳回成功' : '批量确认成功'
          })
          this.accountBillIdSelect = []
          this.getAccountList(this.$store.state.pagination)
        }
      })
    },
    // 导出
    getAccountItem (type) {
      let url = type === 1 ? 'account/exportExcel' : 'account/exportJin'
      this.$store.dispatch('ajax', {
        url: `API@saas-finance/${url}`,
        data: {
          accountBillIds: this.accountBillIds
        },
        router: this.$router,
        success: ({result}) => {
          this.accountBillIdSelect = []
          result && window.open(result, '_blank')
          if (type === 2) this.getAccountList(this.$store.state.pagination)
        }
      })
    },
    // 开票
    getInvoiceItem (select) {
      let opId = select === 'dialog' ? this.ticketIds : this.optionIds.data
      this.$store.commit('finance-module/setTicketIds', opId)
      this.$router.push({
        name: 'billManage-invoiceDetail',
        query: {
          type: 'edit',
          invoiceType: select === 'dialog' ? this.ticketValue : select,
          // optionId: opId,
          setId: 'billManage-invoiceDetail' + opId,
          setTitle: '创建发票'
        }
      })
    },
    // 跳转详情/审核
    goToAccountDetail (type, id) {
      this.$router.push({
        name: 'accountManage-detail',
        query: {
          accountBillId: id,
          type,
          setTitle: type === 'look' ? '对账单详情' : type === 'check' ? '对账单审核' : '对账',
          setId: 'accountManage-detail' + id
        }
      })
    },
    // 跳转到驳回编辑
    goToAccountCheck (id, flag) {
      this.$router.push({
        name: 'accountManage-check',
        query: {
          accountBillId: id,
          feeFlag: flag
        }
      })
    },
    // 关闭弹框
    resetDialog () {
      this.ticketIsShow = false
      this.ticketValue = ''
    },
    showDialog (item) {
      this.ticketIsShow = true
      this.ticketIds = item.map(v => v.accountBillOptionId)
    },
    // 弹框确认按钮
    confirmDialog () {
      if (!this.ticketValue) {
        this.$message({
          type: 'warning',
          message: '请选择发票类型'
        })
        return
      }
      this.ticketIsShow = false
      this.getInvoiceItem('dialog')
    },
    // 通过子表改变或自身选择改变
    getParentSelect (selection) {
      this.accountBillIdSelect = selection
    },
    // 勾选父表格 单行
    selectParentRow (parent, row) {
      if (parent && parent.length === 0) {
        this.accountBillOptionIds = {}
        // this.$refs['childrenTable' + row.accountBillId] && this.$refs['childrenTable' + row.accountBillId].clearSelection()
        return
      }
      // this.$refs['childrenTable' + row.accountBillId] && this.$refs['childrenTable' + row.accountBillId].clearSelection()
      let tempObj = {}
      // 如果有 是通过子类表格选择的 则保留不置为{}
      for (let k in this.accountBillOptionIds) {
        if (!k) break
        if (this.accountBillOptionIds[k][0] && this.accountBillOptionIds[k][0].mySon) {
          tempObj[k] = this.accountBillOptionIds[k]
        }
      }
      this.accountBillOptionIds = tempObj
      parent.forEach(item => {
        // 存储费用项id数据
        this.accountBillOptionIds[item.accountBillId] = item.accountBillOptionPageVOs
        // this.$refs['childrenTable' + item.accountBillId] && this.$refs['childrenTable' + item.accountBillId].clearSelection()
        // item.accountBillOptionPageVOs.forEach(v => {
        //   this.$refs['childrenTable' + item.accountBillId] && this.$refs['childrenTable' + item.accountBillId].toggleRowSelection(v, true)
        // })
      })
    },
    // 勾选父表格 全选
    selectParentRowAll (parentAll) {
      this.accountBillOptionIds = {}
      if (parentAll && parentAll.length === 0) {
        // 子表格清空选中状态
        // this.accountTableList.forEach(v => {
        //   this.$refs['childrenTable' + v.accountBillId] && this.$refs['childrenTable' + v.accountBillId].clearSelection()
        // })
        return
      }
      parentAll.forEach(item => {
        this.accountBillOptionIds[item.accountBillId] = item.accountBillOptionPageVOs
        // item.accountBillOptionPageVOs.forEach(v => {
        //   this.$refs['childrenTable' + item.accountBillId] && this.$refs['childrenTable' + item.accountBillId].toggleRowSelection(v, true)
        // })
      })
    },
    // 勾选子表单 单行
    selectChildrenRow (child, row, parent) {
      // 如果child的长度===父accountBillOptionPageVOs的长度 说明全选了
      if (child.length === parent.accountBillOptionPageVOs.length) {
        this.$refs['accountTable'].toggleRowSelection(parent, true)
      } else {
        this.$refs['accountTable'].toggleRowSelection(parent, false)
        // 添加子类标识
        if (child.length > 0) {
          child[0]['mySon'] = true
        }
      }
      this.accountBillOptionIds[row.accountBillId] = child
      this.$delete(this.accountBillOptionIds, row.accountBillId)
      this.$set(this.accountBillOptionIds, row.accountBillId, child)
    },
    // 勾选子表单 全选
    selectChildrenRowAll (children, parent) {
      if (children.length > 0) { // 全选 找到父行
        this.accountBillOptionIds[parent.accountBillId] = children
        this.$refs['accountTable'].toggleRowSelection(parent, true)
      } else { // 取消全选 找到父行?
        this.$refs['accountTable'].toggleRowSelection(parent, false)
        this.accountBillOptionIds[parent.accountBillId] = []
      }
      this.$delete(this.accountBillOptionIds, parent.accountBillId)
      this.$set(this.accountBillOptionIds, parent.accountBillId, children)
    },
    // 展开行发生变化
    expandChange (row) {
      // 先点击展开项, 字表不全选, 关闭展开按钮再打开
      // if (this.accountBillOptionIds[row.accountBillId] && this.accountBillOptionIds[row.accountBillId].length > 0) {
      //   if (this.accountBillOptionIds[row.accountBillId][0].mySon) {
      //     this.accountBillOptionIds[row.accountBillId].forEach(v => {
      //       this.$nextTick(() => {
      //         this.$refs['childrenTable' + row.accountBillId] && this.$refs['childrenTable' + row.accountBillId].toggleRowSelection(v, true)
      //       })
      //     })
      //   } else { // 如果父行已经勾选了,则子表全选,不存在mySon
      //     row.accountBillOptionPageVOs.forEach(v => {
      //       this.$nextTick(() => {
      //         this.$refs['childrenTable' + row.accountBillId] && this.$refs['childrenTable' + row.accountBillId].toggleRowSelection(v, true)
      //       })
      //     })
      //   }
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.query-condition {
  background-color: #fff;
  padding: 20px;
}
.table-btn {
  padding-bottom: 12px;
}
.selectTicket {
  padding-bottom: 18px;
  .selectTicket-p {
    padding-bottom: 12px;
  }
}
.flex {
  display: flex;
  align-items: flex-start;
}
.topFlag {
  padding-left: 18px;
  margin-bottom: 20px;
  box-sizing: border-box;
  img {
    display:block;
    margin-right: 8px;
  }
}
</style>
