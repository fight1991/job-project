<template>
  <section class='sys-main flatList'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.four"  :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="30">
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
            <el-form-item label="操作人">
              <el-input size="mini" clearable v-model="QueryForm.createUserName" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="平账时间">
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
          <el-col :md="12" :lg="12">
            <el-form-item label="入账时间">
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
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
      <el-row class="query-btn" style="text-align:center">
        <el-button size="mini" type="primary" @click="getRecordList($store.state.pagination)">查询</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-export" @click="exportFlat"><i></i>导出</el-button>
      </el-row>
      <el-table class='sys-table-table' align="left" size="mini"
        :data="recordTableList" border highlight-current-row height="530px">
        <el-table-column type="index" width="50" label="序号" align="center">
          <template slot-scope="scope">
            {{(scope.$index + 1) + (paginationInit.pageIndex - 1) * 10}}
          </template>
        </el-table-column>
        <el-table-column label="账单企业" min-width="160" prop="settleCompanyName">
        </el-table-column>
        <el-table-column label="接单编号" min-width="140" prop="orderNo">
          <template slot-scope="scope">
            {{scope.row.orderNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="报关单号" min-width="180" prop="decNo">
          <template slot-scope="scope">
            {{scope.row.decNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="提单号" min-width="150" prop="billNo">
          <template slot-scope="scope">
            {{scope.row.billNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="费用项" min-width="100" prop="feeOptionName">
        </el-table-column>
        <el-table-column label="金额" min-width="100" prop="taxPrice" align="right">
          <template slot-scope="scope">
            {{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="委托企业" min-width="100" prop="entrustCompanyName">
          <template slot-scope="scope">
            {{scope.row.entrustCompanyName || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="开航/放行日" min-width="100" prop="sailDay" align="center">
          <template slot-scope="scope">
            {{scope.row.sailDay || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="平账时间" min-width="160" prop="flatDate" align="center">
        </el-table-column>
        <el-table-column label="入账时间" min-width="100" prop="entryDate" align="center">
        </el-table-column>
        <el-table-column label="操作人" min-width="100" prop="flatUserName" align="center">
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='paginationInit' @change="getRecordList"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      dates1: '', // 平账
      dates2: '',
      QueryForm: {
        entryDateStart: '',
        entryDateEnd: '',
        flatDateStart: '',
        flatDateEnd: '',
        createUserName: '', // 操作人
        settleCompanyName: '', // 账单企业
        decNo: '', // 报关单号
        billNo: '' // 提单号
      },
      recordTableList: [],
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
      }
    }
  },
  created () {
    this.getSettleCompanyInfo()
    this.paginationInit = this.$store.state.pagination
    this.getRecordList(this.$store.state.pagination)
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
    // 获取平账对账单列表
    getRecordList (pagination) {
      if (this.dates1 && this.dates1.length > 0) {
        this.QueryForm.flatDateStart = this.dates1[0]
        this.QueryForm.flatDateEnd = this.dates1[1]
      } else {
        this.QueryForm.flatDateStart = ''
        this.QueryForm.flatDateEnd = ''
      }
      if (this.dates2 && this.dates2.length > 0) {
        this.QueryForm.entryDateStart = this.dates2[0]
        this.QueryForm.entryDateEnd = this.dates2[1]
      } else {
        this.QueryForm.entryDateStart = ''
        this.QueryForm.entryDateEnd = ''
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/balance/gets',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          if (res.result && res.result.length > 0) {
            this.recordTableList = res.result
          } else {
            this.recordTableList = []
          }
        }
      })
    },
    resetForm () {
      this.QueryForm = {
        entryDateStart: '',
        entryDateEnd: '',
        flatDateStart: '',
        flatDateEnd: '',
        createUserName: '',
        settleCompanyName: '',
        billNo: '',
        decNo: ''
      }
      this.dates1 = ''
      this.dates2 = ''
    },
    // 导出平账记录
    exportFlat () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/balance/export',
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
</style>
