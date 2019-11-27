<template>
  <section class="sys-main">
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.six" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="账单企业" :label-width="labelFormWidth.four">
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
            <el-form-item label="收付类型" :label-width="labelFormWidth.four">
              <el-select v-model="QueryForm.feeFlag" size="mini" clearable  style="width:100%;">
                <el-option key="0" :label="'应收'" :value="true"></el-option>
                <el-option key="1" :label="'应付'" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="收付明细日期">
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
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="resetQuery">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-export" @click="exportPay"><i></i>导出</el-button>
      </el-row>
      <el-table class='sys-table-table manyHead' align="left" size="mini"
        :data="payTableList" border highlight-current-row height="530px">
        <el-table-column type="index" width="50" label="序号" align="center">
        </el-table-column>
        <el-table-column label="账单企业" min-width="150" prop="settleCompanyName">
        </el-table-column>
        <el-table-column label="收付类型" min-width="80" prop="feeFlagValue" align="center">
        </el-table-column>
        <el-table-column label="本位币" align="center">
          <el-table-column label="CNY" min-width="80" prop="cny" align="center">
            <template slot-scope="scope">{{(scope.row.cny && scope.row.cny.toLocaleString()) || '-'}}</template>
          </el-table-column>
        </el-table-column>
        <!-- 多级表头 -->
        <el-table-column label="外币" align="center" v-if="JSON.stringify(foreignCurr) !== '{}'">
          <el-table-column v-for="(value, key) in foreignCurr" align="center" min-width="80"
            :key="key"
            :label="key"
            :prop="key">
            <template slot-scope="scope">{{(scope.row[key] && scope.row[key].toLocaleString()) || '-'}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" min-width="60" align="center">
          <template slot-scope="scope">
            <div class="sys-td-c">
              <el-button title="查看" type="text" class="table-icon list-icon-look" @click="goToDetail('look',scope.row.feeFlag, scope.row.settleCompanyName, scope.$index)"><i></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='paginationInit' @change="getPayList"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      QueryForm: {
        settleCompanyName: '', // 账单企业
        feeFlag: '',
        startDate: '',
        endDate: ''
      },
      dates: '',
      payTableList: [],
      settleCompanyList: [],
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
      searchDate: {
        startDate: '',
        endDate: ''
      }
    }
  },
  created () {
    this.getSettleCompanyInfo()
    this.getPayList(this.$store.state.pagination)
  },
  computed: {
    foreignCurr () { // 外币种类
      if (this.payTableList.length > 0) {
        return this.payTableList[0].foreignCurr
      } else {
        return {}
      }
    }
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
    search () {
      // 存储查询的时间
      if (this.dates) {
        this.searchDate.startDate = this.dates[0] || ''
        this.searchDate.endDate = this.dates[1] || ''
      } else {
        this.searchDate.startDate = ''
        this.searchDate.endDate = ''
      }
      this.getPayList(this.$store.state.pagination)
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
    // 获取收付列表
    getPayList (pagination) {
      if (this.dates && this.dates.length > 0) {
        this.QueryForm.startDate = this.dates[0]
        this.QueryForm.endDate = this.dates[1]
      } else {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      }
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/receiptsAndPayments',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          if (res.result && res.result.length > 0) {
            // 币制值展开
            res.result.forEach(v => {
              if (JSON.stringify(v.foreignCurr) !== '{}') {
                Object.assign(v, v.foreignCurr)
              }
            })
          }
          this.payTableList = res.result || []
        }
      })
    },
    // 重置查询条件
    resetQuery () {
      this.QueryForm = {
        settleCompanyName: '',
        feeFlag: '',
        startDate: '',
        endDate: ''
      }
      this.dates = ''
    },
    // 导出
    exportPay () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/receiptsAndPayExport',
        data: {
          ...this.QueryForm,
          page: this.$store.state.pagination
        },
        router: this.$router,
        success: ({result}) => {
          result && window.open(result, '_blank')
        }
      })
    },
    goToDetail (type, feeFlag, settleCompanyName, index) {
      this.$router.push({
        name: 'summary-detail',
        query: {
          type,
          feeFlag,
          settleCompanyName,
          date: encodeURIComponent(JSON.stringify(this.searchDate)),
          setId: 'summary-detail' + index
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
