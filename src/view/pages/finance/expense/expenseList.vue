<template>
  <section class='sys-main'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.five" :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="接单编号">
              <el-input v-model="QueryForm.orderNo" size="mini" clearable :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单号">
              <el-input size="mini" clearable v-model="QueryForm.decNo" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提单号">
              <el-input size="mini" clearable v-model="QueryForm.billNo" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="业务类型">
              <el-select v-model="QueryForm.businessType" size="mini" clearable  style="width:100%;">
                <el-option key="1" :label="'报关'" :value="1"></el-option>
                <el-option key="2" :label="'货代'" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托企业">
              <el-autocomplete style="width:100%;"
                class="inline-input" :maxlength="30" clearable
                v-model="QueryForm.entrustCompanyName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                placeholder="请选择">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="进出口">
              <el-select v-model="QueryForm.iEFlag" size="mini" clearable style="width:100%;">
                <el-option key="0" :label="'进口'" :value="0"></el-option>
                <el-option key="1" :label="'出口'" :value="1"></el-option>
                <el-option key="2" :label="'内贸'" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="开航日">
               <el-date-picker
                style="width:100%"
                v-model="dates1"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="申报地海关">
              <el-select v-model="QueryForm.dclPlcCuscd"
                filterable clearable remote default-first-option
                @focus="tipsFill('dclPlcCusList','SAAS_CUSTOMS_REL')"
                :remote-method="checkParamsList"
                style="width:100%">
                <el-option
                  v-for="item in dclPlcCusList"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="状态">
              <el-select v-model="QueryForm.status" size="mini" clearable style="width:100%;">
                <el-option key="0" :label="'台账已创建'" :value="0"></el-option>
                <el-option key="1" :label="'台账已提交'" :value="1"></el-option>
                <el-option key="2" :label="'台账待审核'" :value="2"></el-option>
                <el-option key="3" :label="'台账已审核'" :value="3"></el-option>
                <el-option key="4" :label="'台账已退回'" :value="4"></el-option>
                <el-option key="5" :label="'账单已生成'" :value="5"></el-option>
                <el-option key="6" :label="'账单审核退回'" :value="6"></el-option>
                <el-option key="7" :label="'账单对账退回'" :value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="放行时间">
               <el-date-picker
                style="width:100%"
                v-model="dates2"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
      <el-row class="query-btn" style="text-align:center">
        <el-button size="mini" type="primary" @click="getsExpenseList($store.state.pagination)">查询</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" :disabled="isCreateBill" class="list-btns list-icon-create" @click="createAccount"><i></i>生成对账单</el-button>
        <el-button size="mini" class="list-btns list-icon-add" @click="goToDeital('add')"><i></i>台账新增</el-button>
        <el-button size="mini" :disabled="multiRegistBtn" class="list-btns list-icon-add" @click="goToRegistPage"><i></i>批量费用登记</el-button>
        <el-button size="mini" class="list-btns list-icon-check" :disabled="billVerifyVOs.length === 0" @click="expenseCheck(true)"><i></i>批量通过</el-button>
        <el-button size="mini" class="list-btns list-icon-reject" :disabled="billVerifyVOs.length === 0" @click="expenseCheck(false)"><i></i>批量驳回</el-button>
        <div class="airvehicle-list-drop">
          <el-row class="expense-count">
            <span>当前已选择台账&nbsp;{{selectCount}}&nbsp;条</span>
          </el-row>
          <el-popover popper-class="airvehicle-table-popper">
            <ul>
              <li v-for="(value, key) in fieldList" :key="key">
                <el-checkbox v-if="key !== 'createUserId'" size="mini" v-model="fieldList[key]" @change="columnFieldChange">{{headFieldList[key] && headFieldList[key].label || '未知表头名'}}</el-checkbox>
              </li>
            </ul>
            <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
          </el-popover>
        </div>
      </el-row>
      <el-table class='sys-table-table' :data="lazyTableList" border
        row-key="expenseBillId"
        highlight-current-row height="530px" ref="expenseTable" size="mini"
        @select="chooseSelectBox"
        @row-click="chooseSelectRow"
        @select-all="chooseSelectBoxAll">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column label="接单编号" min-width="120" align="center" prop="orderNo" v-if="fieldList.orderNo">
          <template slot-scope="scope">
            {{scope.row.orderNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="报关单号" min-width="120" align="center" prop="decNo" v-if="fieldList.decNo">
          <template slot-scope="scope">
            {{scope.row.decNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="提单号" min-width="120" align="center" prop="billNo" v-if="fieldList.billNo">
          <template slot-scope="scope">
            {{scope.row.billNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="业务类型" min-width="80" align="center" prop="businessType" v-if="fieldList.businessType">
          <template slot-scope="scope">
            {{scope.row.businessType === 1 ? '报关':'货代'}}
          </template>
        </el-table-column>
        <el-table-column label="委托企业" min-width="160" align="left" prop="entrustCompanyName" v-if="fieldList.entrustCompanyName">
          <template slot-scope="scope">
            {{scope.row.entrustCompanyName || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="进出口" min-width="80" align="center" prop="iEFlag" v-if="fieldList.iEFlag">
          <template slot-scope="scope">
            {{scope.row.iEFlag === 0 ? '进口': scope.row.iEFlag === 1 ? '出口' : '内贸'}}
          </template>
        </el-table-column>
        <el-table-column label="申报地海关" min-width="120" align="left" prop="dclPlcCuscdValue" v-if="fieldList.dclPlcCuscd">
          <template slot-scope="scope">
            {{scope.row.dclPlcCuscdValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="开航日" min-width="100" align="center" prop="sailDay" v-if="fieldList.sailDay">
          <template slot-scope="scope">
            {{scope.row.sailDay || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="放行时间" min-width="100" align="center" prop="releaseDay" v-if="fieldList.releaseDay">
          <template slot-scope="scope">
            {{scope.row.releaseDay || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100" align="center" prop="statusValue" v-if="fieldList.status">
        </el-table-column>
        <el-table-column label="应收总额" min-width="100" align="center" prop="receives" v-if="fieldList.receives">
          <template slot-scope="scope">
            {{scope.row.receives.toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column label="应付总额" min-width="100" align="center" prop="pays" v-if="fieldList.pays">
          <template slot-scope="scope">
            {{scope.row.pays.toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div class="sys-td-c">
              <el-button title="编辑" v-if="editIsShow(scope.row)" type="text" class="table-icon list-icon-edit" @click.stop="goToDeital('edit', scope.row.businessType, scope.row.iEFlag, scope.row.expenseBillId, scope.row.status)"><i></i></el-button>
              <el-button title="查看" type="text" class="table-icon list-icon-look" @click.stop="goToDeital('look', scope.row.businessType, scope.row.iEFlag, scope.row.expenseBillId, scope.row.status, scope.row.businessType)"><i></i></el-button>
              <el-button title="单条导出" type="text" class="table-icon list-icon-export" @click.stop="exportBill(scope.row.expenseBillId)"><i></i></el-button>
              <el-button type="text" title="台账审核" class="table-icon list-icon-subimtCheck" v-if="scope.row.status === 2" v-permissions="'CCBA21603010000'" @click.stop="goToDeital('check', scope.row.businessType, scope.row.iEFlag, scope.row.expenseBillId, scope.row.status, scope.row.businessType)"><i></i></el-button>
              <el-button title="电子票据上传" type="text" class="table-icon list-icon-upload" @click.stop="goToDeital('upload', scope.row.businessType, scope.row.iEFlag, scope.row.expenseBillId, scope.row.status, scope.row.businessType)"><i></i></el-button>
              <el-button title="台账删除" v-if="deleteIsShow(scope.row)" type="text" class="table-icon list-icon-delete" @click.stop="deleteExpense(scope.row.expenseBillId)"><i></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pageSizes="[10, 20, 50, 100, 200, 500]" :pagination='paginationInit' @change="getsExpenseList"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import finStore from '../finStore'
import commonParam from '@/common/commonParam'
import {mapState} from 'vuex'
import tableHead from './tableHeadList'
export default {
  mixins: [tableHead],
  data () {
    return {
      dates1: [],
      dates2: [],
      corpList: [],
      isVerify: false, // 是否是批量审核,否则为驳回
      expenseBillIds: [], // 存储报价id数组
      selectedRow: [],
      allFlag: false, // 是否勾了全选
      expenseTableList: [], // 截取数据源,每次截取50个
      lazyTableList: [], // 列表显示的数据
      selectAll: [], // 存储全部数据
      QueryForm: {
        billNo: '', // 提单号
        businessType: '', // 业务类型 1报关，2货代
        status: '', // 1台账已提交2台账待审核3台账已审核4台账已退回5账单已生成6账单审核退回7账单对账退回
        decNo: '', // 报关单号
        entrustCompanyName: '', // 委托企业名称
        expenseBillId: '',
        iEFlag: '', // 进出口0进口1出口2内贸
        orderNo: '', // 接单编号
        releaseDayStart: '', // 放行日
        releaseDayEnd: '',
        sailDayStart: '', // 开航日
        sailDayEnd: '',
        dclPlcCuscd: '' // 申报地海关
      },
      paginationInit: '',
      dclPlcCusList: [], // 申报地海关
      selectObj: {
        obj: '',
        params: ''
      },
      // 查询的字典字段
      tableNameList: {
        tableNames: [
          'SAAS_CUSTOMS_REL' // 海关关区
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')])
          }
        }]
      }
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'expense-list' && to.query.from === 'other' && (from.name === 'expense-detail' || from.name === 'expense-multiExpenseRegister')) {
        this.getsExpenseList(this.$store.state.pagination)
        this.expenseBillIds = []
        this.selectedRow = []
        this.resetForm('other')
      }
    }
  },
  computed: {
    ...mapState({
      currentUser (state) {
        return state.userLoginInfo.userId
      },
      currentCorp (state) {
        return state.userLoginInfo.companyCode
      }
    }),
    isCreateBill () { // 控制生成账单按钮
      if (this.selectedRow.length === 0) return true
      return !this.selectedRow.every(v => v.status === 1 || v.status === 3)
    },
    multiRegistBtn () { // 批量登记按钮
      if (this.selectedRow.length === 0) return true
      return !this.selectedRow.every(v => v.status === 0 || v.status === 1)
    },
    billIds () {
      if (!this.multiRegistBtn) {
        return this.selectedRow.map(v => v.expenseBillId)
      } else {
        return []
      }
    },
    selectCount () { // 计算选中的条数
      return this.selectedRow.length
    },
    billVerifyVOs () { // 台账待审核状态下2的 台账批量审核和驳回
      let isCheck = this.selectedRow.length > 0 ? this.selectedRow.every(v => v.status === 2) : false
      if (isCheck) {
        this.selectedRow.map(v => {
          return {
            expenseBillId: v.expenseBillId,
            verify: this.isVerify,
            verifyMsg: ''
          }
        })
      } else {
        return []
      }
    }
  },
  mounted () {
    // 将table数据默认显示50条
    let tableScreen = this.$refs['expenseTable'].$el.childNodes[2]
    let that = this
    tableScreen.addEventListener('scroll', function (e) {
      // if (this.expenseTableList.length <= 50) return
      let pageH = this.scrollHeight
      if (pageH - this.scrollTop - 476 < 100) { // 说明还差100滚动到底了,继续追加数据
        if (that.expenseTableList.length === 0) return
        let temp = that.expenseTableList.splice(0, 50)
        that.lazyTableList.push(...temp)
        that.$nextTick(() => {
          if (that.allFlag) {
            that.$refs['expenseTable'].clearSelection()
            that.$refs['expenseTable'].toggleAllSelection()
          }
          that.allFlag = false
        })
      }
    }, {passive: true})
  },
  created () {
    this.$store.registerModule('finance-module', finStore)
    this.paginationInit = this.$store.state.pagination
    this.getsExpenseList(this.$store.state.pagination)
    this.getcorps()
    this.getCommonParam()
  },
  beforeDestroy () {
    this.$store.unregisterModule('finance-module')
  },
  methods: {
    // 获取台账列表
    getsExpenseList (pagination) {
      if (this.dates2 && this.dates2.length > 0) {
        this.QueryForm.releaseDayStart = this.dates2[0]
        this.QueryForm.releaseDayEnd = this.dates2[1]
      } else {
        this.QueryForm.releaseDayStart = ''
        this.QueryForm.releaseDayEnd = ''
      }
      if (this.dates1 && this.dates1.length > 0) {
        this.QueryForm.sailDayStart = this.dates1[0]
        this.QueryForm.sailDayEnd = this.dates1[1]
      } else {
        this.QueryForm.sailDayStart = ''
        this.QueryForm.sailDayEnd = ''
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/bill/gets',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          this.expenseTableList = res.result.respVOs || []
          this.fieldList = res.result.billCustomLine
          this.selectAll = [...this.expenseTableList]
          this.lazyTableList = this.expenseTableList.splice(0, 50)
          this.expenseBillIds = []
          this.$nextTick(() => {
            let newScreen = this.$refs['expenseTable'].$el.childNodes[2]
            newScreen.scrollTop = 0
          })
        }
      })
    },
    // 委托企业查询
    getcorps () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/getEntrustCompanyNames',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.corpList = result || []
        }
      })
    },
    querySearch (queryString, cb) {
      let results = []
      if (this.corpList.length === 0) return cb(results)
      let restaurants = this.corpList
      if (queryString.trim().length > 1) {
        results = restaurants.filter(v => {
          return v && v.indexOf(queryString) >= 0
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
          this[this.selectObj.obj] = list.slice(0, 40)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          this[this.selectObj.obj] = filterList.slice(0, 40)
        }
      } else {
        if (!util.isEmpty(JSON.parse(localStorage.getItem(this.selectObj.params)))) {
          this[this.selectObj.obj] = JSON.parse(localStorage.getItem(this.selectObj.params)).slice(0, 40)
        }
      }
    },
    // 创建字典参数列表
    tipsFill (obj, params) {
      this.selectObj = {
        obj,
        params
      }
    },
    // 重置查询条件
    resetForm (type) {
      this.QueryForm = {
        billNo: '',
        businessType: '',
        status: '',
        decNo: '',
        entrustCompanyName: '',
        expenseBillId: '',
        iEFlag: '',
        orderNo: '',
        releaseDayStart: '',
        releaseDayEnd: '',
        sailDayStart: '',
        sailDayEnd: ''
      }
      this.dates1 = []
      // 从暂存页面跳转回来,放行时间不清空
      !type && (this.dates2 = [])
    },
    // 跳转到编辑或详情页
    goToDeital (type, businessType, iEFlag = '', id = '', status = '') {
      let title = ''
      switch (type) {
        case 'edit':
          title = '台账编辑'
          break
        case 'add':
          title = '台账新增'
          break
        case 'look':
          title = '台账详情'
          break
        case 'upload':
          title = '票据上传'
          break
      }
      this.$router.push({
        name: 'expense-detail',
        query: {
          type,
          businessType,
          iEFlag,
          expenseBillId: id,
          status,
          setTitle: title,
          setId: 'expense-detail' + type + id
        }
      })
    },
    // 跳转到批量费用登记按钮
    goToRegistPage () {
      this.$store.commit('finance-module/setBillIds', [...new Set(this.billIds)])
      this.$router.push({
        name: 'expense-multiExpenseRegister'
      })
    },
    // 台账删除
    async deleteExpense (id) {
      let res = await this.$confirm('确定删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => true)
        .catch(() => false)
      if (!res) return
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/bill/deleteBill',
        data: {expenseBillId: id},
        router: this.$router,
        success: () => {
          this.getsExpenseList(this.$store.state.pagination)
        }
      })
    },
    // 单条导出台账信息
    exportBill (id) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/bill/export',
        data: {expenseBillId: id},
        router: this.$router,
        success: ({result}) => {
          result && window.open(result, '_blank')
        }
      })
    },
    // 判断开关是否开启
    justyIsOpen (callback) {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/ccba/review/isReview',
        data: ['bill_corp_audit'],
        router: this.$router,
        success: ({result}) => {
          let swtichCheck = result['bill_corp_audit'].value
          callback && callback(swtichCheck)
        }
      })
    },
    // 生成对账单
    createAccount () {
      if (this.expenseBillIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择一条或多条台账'
        })
        return
      }
      // 没开审核开关的时候，提示内容不需要提示需要内部审核
      this.justyIsOpen(async (flag) => {
        let content = '是否确认生成对账单 ?'
        if (flag === 'Y') {
          content = '是否确认生成对账单 ? 请注意,当前情况下,生成的对账单需要先进行内容审核确认'
        }
        let res = await this.$confirm(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => true).catch(() => false)
        if (!res) return
        this.$store.dispatch('ajax', {
          url: 'API@saas-finance/account/create',
          data: {expenseBillIds: this.expenseBillIds},
          router: this.$router,
          success: () => {
            this.$message({
              type: 'success',
              message: '生成对账单成功'
            })
            this.getsExpenseList(this.$store.state.pagination)
            this.selectedRow = []
          }
        })
      })
    },
    // 批量审核驳回
    expenseCheck (type) {
      this.isVerify = type
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/ccba/review/isReview',
        data: {billVerifyVOs: this.billVerifyVOs},
        router: this.$router,
        success: () => {
          let message = type ? '通过成功!' : '驳回成功!'
          this.$message.success(message)
          this.getsExpenseList(this.$store.state.pagination)
        }
      })
    },
    // 勾选选择框
    chooseSelectBox (selection, row) {
      this.expenseBillIds = selection.map(v => {
        return v.expenseBillId
      })
      this.selectedRow = [...selection]
    },
    // 勾选选择框全选
    chooseSelectBoxAll (selection) {
      let selectBox = []
      if (selection.length > 0) {
        this.allFlag = true
        selectBox = [...this.selectAll]
      } else {
        this.allFlag = false
        selectBox = []
      }
      this.expenseBillIds = selectBox.map(v => {
        return v.expenseBillId
      })
      this.selectedRow = [...selectBox]
    },
    // 点击表格行
    chooseSelectRow (row, column, event) {
      let index = this.selectedRow.indexOf(row)
      if (index > -1) { // 当前的行已经被选中了
        this.$refs['expenseTable'].toggleRowSelection(row, false)
        this.expenseBillIds.splice(index, 1)
        this.selectedRow.splice(index, 1)
      } else {
        this.$refs['expenseTable'].toggleRowSelection(row, true)
        this.expenseBillIds.push(row.expenseBillId)
        this.selectedRow.push({...row})
      }
    },
    // 编辑按钮是否显示
    editIsShow (row) {
      if ([0, 1, 6, 7].includes(row.status)) {
        return true
      }
      if (row.status === 4) {
        if (row.createUserId) { // 存在创建人id
          return this.currentUser === row.createUserId
        } else { // 不存在比较企业id
          return this.currentCorp === +row.createCompanyId
        }
      }
      return false
    },
    // 删除按钮是否显示
    deleteIsShow (row) {
      if (row.status === 0 || row.status === 1) {
        return true
      } else {
        return false
      }
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
.expense-count {
  margin-right: 20px;
  display: inline-block;
  font-size: 12px;
  color: #287FCA;
}
.airvehicle-table-popper{
  min-width: auto;
  ul{
    max-height: 300px;
    overflow:auto;
    li {
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
</style>
