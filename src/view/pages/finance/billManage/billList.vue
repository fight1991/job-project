<template>
  <section class='sys-main billList'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.four"  :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="开票企业">
              <el-input v-model="QueryForm.settleCompanyNames" size="mini" clearable :maxlength="30"></el-input>
              <!-- <el-autocomplete style="width:100%;"
                class="inline-input" :maxlength="30" clearable
                v-model="QueryForm.settleCompanyNames"
                :fetch-suggestions="querySearchA"
                :trigger-on-focus="false"
                placeholder="请选择">
              </el-autocomplete> -->
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托企业">
              <el-input v-model="QueryForm.entrustCompanyNames" size="mini" clearable :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="发票类型">
              <el-select v-model="QueryForm.invoiceType" size="mini" clearable style="width:100%;">
                <el-option key="1" :label="'增值税普通发票'" :value="1"></el-option>
                <el-option key="2" :label="'增值税专用发票'" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="操作人">
              <el-input v-model="QueryForm.createUserName" size="mini" clearable :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="开票日期">
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
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
      <el-row class="query-btn" style="text-align:center">
        <el-button size="mini" type="primary" @click="getInvoiceList($store.state.pagination)">查询</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-rollback" :disabled="invoiceIds.length === 0" @click="cancelBill"><i></i>撤销开票</el-button>
        <el-button size="mini" class="list-btns list-icon-export" @click="exportAllBill"><i></i>导出发票</el-button>
        <el-button size="mini" class="list-btns list-icon-look" @click="getDialogType(1)"><i></i>查看导出记录</el-button>
        <el-button size="mini" class="list-btns list-icon-case" :disabled="caseIds.length === 0" @click="confirmBtnCase"><i></i>结案</el-button>
        <el-button size="mini" class="list-btns list-icon-look" @click="getDialogType(2)"><i></i>查看结案记录</el-button>
      </el-row>
      <el-table class='sys-table-table' align="left" size="mini"
        :data="invoiceTableList" border highlight-current-row height="530px"  ref="invoiceTable"
        :cell-class-name="breakWordStyle"
        @select="chooseSelectBox"
        @row-click="chooseSelectRow"
        @select-all="chooseSelectBoxAll">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column label="发票号" width="210" prop="invoiceNumVO" align="left">
          <template slot-scope="scope">
            <div class="invoiceNumVO">
              <span class="invoiceNumAgency" v-for="(item, index) in scope.row.invoiceNumVO.invoiceNumAgency" :key="'item'+index">{{item}}</span>
              <span class="invoiceNumTransport" v-for="(v, index) in scope.row.invoiceNumVO.invoiceNumTransport" :key="'v'+index">{{v}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发票企业" show-overflow-tooltip min-width="100" prop="settleCompanyNames" align="left">
          <template slot-scope="scope">
            {{scope.row.settleCompanyNames || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="委托企业" show-overflow-tooltip min-width="100" prop="entrustCompanyNames" align="left">
          <template slot-scope="scope">
            {{scope.row.entrustCompanyNames || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="发票类别" min-width="120" prop="invoiceTypeValue" align="center">
          <template slot-scope="scope">
            {{scope.row.invoiceTypeValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="币制" min-width="80" prop="curr" align="center">
        </el-table-column>
        <el-table-column label="发票金额" min-width="100" prop="amount" align="center">
          <template slot-scope="scope">
            {{scope.row.amount.toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="100" prop="createUserName" align="center">
          <template slot-scope="scope">
            {{scope.row.createUserName || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="开票日期" min-width="140" prop="createDate" align="center">
        </el-table-column>
        <el-table-column label="发票状态" min-width="140" prop="invoiceStatusValue" align="center">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80" align="center">
          <template slot-scope="scope">
            <div class="sys-td-c">
              <el-button type="text" title="查看" class="table-icon list-icon-look" @click.stop="goToInvoiceDetail('look', scope.row.invoiceId)"><i></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination.sync='paginationInit1' @change="getInvoiceList"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 导出记录dialog列表 -->
    <dialog-table
      :pagination="paginationInit2"
      :visible.sync="exportRecordShow"
      :title="'导出记录'"
      :tableList="exportTableList"
      :tableHead="exportTableHead"
      @change="getRecordList"
      :dialogWidth="'600px'">
    </dialog-table>
    <!-- 结案记录dialog列表 -->
    <dialog-table
      :pagination="paginationInit3"
      :visible.sync="caseRecordShow"
      :title="'结案记录'"
      :tableList="caseTableList"
      :tableHead="caseTableHead"
      @change="getRecordList"
      :dialogWidth="'600px'">
    </dialog-table>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import util from '@/common/util'
import commonParam from '@/common/commonParam'
import dialogTable from '../component/dialogTableList'
export default {
  components: {
    dialogTable
  },
  data () {
    return {
      exportRecordShow: false,
      caseIsShow: false,
      caseRecordShow: false,
      dates: '',
      exportTableList: [],
      caseTableList: [],
      dialogType: 1,
      exportTableHead: [
        {
          label: '导出时间',
          prop: 'createDate'
        },
        {
          label: '操作人',
          prop: 'createUserName'
        },
        {
          label: '内容数量',
          prop: 'num'
        }
      ],
      caseTableHead: [
        {
          label: '发票号',
          prop: 'invoiceNum'
        },
        {
          label: '结案时间',
          prop: 'createDate'
        },
        {
          label: '操作人',
          prop: 'createUserName'
        }
      ],
      QueryForm: {
        createStartDate: '', // 开票日期
        createEndDate: '',
        createUserName: '', // 操作人
        entrustCompanyNames: '', // 委托企业
        invoiceType: '', // 发票类型
        settleCompanyNames: '' // 开票企业
      },
      selections: [],
      invoiceTableList: [],
      settleCompanyList: [], // 开票企业列表
      corpList: [], // 委托企业列表
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
      paginationInit1: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      paginationInit2: { // 导出记录分页
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      paginationInit3: { // 结案记录分页
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
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
      }
    }
  },
  computed: {
    ...mapState({ // 查看vuex中当前登录的userId
      currentUser (state) {
        return state.userLoginInfo.userId
      }
    }),
    invoiceIds () { // 发票id
      return this.selections.map(v => v.invoiceId)
    },
    caseIds () { // 已开票的发票id
      let flag = this.selections.every(v => v.invoiceId && v.invoiceStatus === 1)
      if (flag) {
        return this.selections.map(v => v.invoiceId)
      } else {
        return []
      }
    }
  },
  created () {
    this.getCommonParam()
    this.getSettleCompanyInfo()
    this.getInvoiceList(this.$store.state.pagination)
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
    querySearchA (queryString, cb) {
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
    querySearchE (queryString, cb) {
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
    // 获取发票列表
    getInvoiceList (pagination) {
      if (this.dates && this.dates.length > 0) {
        this.QueryForm.createStartDate = this.dates[0]
        this.QueryForm.createEndDate = this.dates[1]
      } else {
        this.QueryForm.createStartDate = ''
        this.QueryForm.createEndDate = ''
      }
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/invoice/gets',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit1 = res.page
          this.invoiceTableList = res.result || []
        }
      })
    },
    // 重置查询条件
    resetForm () {
      this.QueryForm = {
        createStartDate: '',
        createEndDate: '',
        createUserName: '',
        entrustCompanyNames: '',
        invoiceType: '',
        settleCompanyNames: ''
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
    // 勾选选择框
    chooseSelectBox (selection, row) {
      this.selections = selection
    },
    // 勾选全选框
    chooseSelectBoxAll (selection) {
      this.selections = selection
    },
    // 点击表格行
    chooseSelectRow (row, column, event) {
      if (this.selections.indexOf(row) > -1) {
        let index = this.selections.indexOf(row)
        this.selections.splice(index, 1)
        this.$refs['invoiceTable'].toggleRowSelection(row, false)
      } else {
        this.selections.push(row)
        this.$refs['invoiceTable'].toggleRowSelection(row, true)
      }
    },
    // 导出所有发票
    exportAllBill () {
      this.$store.dispatch('ajax', {
        url: `API@saas-finance/invoice/export`,
        data: {
          ...this.QueryForm,
          page: {
            pageSize: 10,
            pageIndex: 1,
            total: 0
          }
        },
        router: this.$router,
        success: ({result}) => {
          if (result && result.url) {
            window.open(result.url, '_blank')
          }
        }
      })
    },
    // 撤销开票
    cancelBill () {
      this.$confirm('若撤销此发票,发票将从发票列表消失,账单中对应数据状态将发生改变,是否确认要撤销开票?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: `API@saas-finance/invoice/revoke`,
          data: {
            invoiceIds: this.invoiceIds
          },
          router: this.$router,
          success: () => {
            this.$message({
              type: 'success',
              message: '撤销成功'
            })
            this.getInvoiceList(this.$store.state.pagination)
            this.selections = []
          }
        })
      }).catch(() => {})
    },
    // 查看详情
    goToInvoiceDetail (type, id) {
      this.$router.push({
        name: 'billManage-invoiceDetail',
        query: {
          type,
          invoiceId: id,
          setId: 'billManage-invoiceDetail' + id
        }
      })
    },
    breakWordStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1) {
        return 'noBreakWord'
      }
    },
    // 获取dialog类型
    getDialogType (type) {
      this.dialogType = type
      type === 1 ? this.exportRecordShow = true : this.caseRecordShow = true
      this.getRecordList(this.$store.state.pagination)
    },
    // 获取记录列表
    getRecordList (pagination) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/invoice/getRecords',
        data: {
          type: this.dialogType,
          page: pagination
        },
        router: this.$router,
        success: res => {
          if (this.dialogType === 1) {
            this.paginationInit2 = res.page
            this.exportTableList = res.result || []
          } else {
            this.paginationInit3 = res.page
            this.caseTableList = res.result || []
          }
        }
      })
    },
    // 结案按钮
    confirmBtnCase () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/invoice/close',
        data: {
          invoiceIds: this.caseIds
        },
        router: this.$router,
        success: () => {
          this.$message({
            type: 'success',
            message: '结案成功'
          })
          this.getInvoiceList(this.$store.state.pagination)
          this.selections = []
        }
      })
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
.invoiceNumVO {
  width: 100%;
  font-weight: bold;
  .invoiceNumAgency {
    float: left;
    color: #54b047;
    margin: 0 3px;
  }
  .invoiceNumTransport {
    float: left;
    color: #f8a227;
    margin: 0 3px;
  }
}
.dialog-btn {
  padding-top: 20px;
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
