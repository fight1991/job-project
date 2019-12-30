<template>
  <section class="sys-main">
    <!-- 表格开始 -->
    <div class='query-table-financeOther'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-export" @click="exportDetail"><i></i>导出明细</el-button>
      </el-row>
      <div class="one-row all">
        <div class="left">利润合计&nbsp;:</div>
        <div class="right" v-if="JSON.stringify(totalProfit) !== '{}'" v-for="(value, key) in totalProfit" :key="key">{{key +' '+ (value && value.toLocaleString())}}</div>
        <div class="right" v-else>{{'-'}}</div>
      </div>
      <el-table class='sys-table-table manyHead' border align="left" size="mini" height="530px" :data="tableData">
        <el-table-column type="expand" width="50" label="展开">
          <!-- 展开项 -->
          <template slot-scope="scope">
            <el-table class='sys-table-table' size="mini"
              v-if="scope.row.options && scope.row.options.length > 0" align="left"
              :data="scope.row.options" border>
              <el-table-column type="index" width="50" label="序号" align="center">
              </el-table-column>
              <el-table-column label="收付类型" min-width="80" prop="feeFlagValue" align="center">
              </el-table-column>
              <el-table-column label="接单编号" min-width="140" prop="innerNo">
                <template slot-scope="scope">
                  {{scope.row.innerNo || '-'}}
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
              <el-table-column label="开票状态" min-width="80" prop="invoiceStatusValue" align="center">
                <template slot-scope="scope">
                  {{scope.row.invoiceStatusValue || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="发票号" min-width="80" prop="invoiceNum" align="center">
                <template slot-scope="scope">
                  {{scope.row.invoiceNum || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="平账状态" min-width="80" prop="flatStatusValue" align="center">
                <template slot-scope="scope">
                  {{scope.row.flatStatusValue || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="平账时间" width="140" prop="flatDate" align="center">
                <template slot-scope="scope">
                  {{scope.row.flatDate || '-'}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="接单编号" min-width="140" prop="innerNo">
          <template slot-scope="scope">
            {{scope.row.innerNo || '-'}}
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
        <el-table-column label="业务类型" min-width="100" prop="businessTypeValue">
          <template slot-scope="scope">
            {{scope.row.businessTypeValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="开航日" min-width="100" align="center" prop="sailDay">
          <template slot-scope="scope">
            {{scope.row.sailDay || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="放行时间" min-width="100" align="center" prop="releaseDay">
          <template slot-scope="scope">
            {{scope.row.releaseDay || '-' }}
          </template>
        </el-table-column>
        <!-- 多级表头开始 -->
        <el-table-column v-for="(item, index) in manyTableHead" :key="'index' + index" :label="item.label" min-width="100">
          <el-table-column v-for="(value, key) in item.data" :label="key" min-width="100" :prop="item.prop + key" :key="key">
            <template slot-scope="scope">{{(scope.row[item.prop + key] && scope.row[item.prop + key].toLocaleString()) || '-' }}</template>
          </el-table-column>
        </el-table-column>
        <!-- 多级表头结束 -->
        <el-table-column label="利润" min-width="100" align="center" prop="profits" fixed="right">
          <template slot-scope="scope">
            {{(scope.row.profits && scope.row.profits.toLocaleString()) || '-' }}
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='paginationInit' @change="getSettleCompanyInfo"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      totalProfit: {},
      tableData: [],
      feeFlag: '',
      type: '', // 操作类型
      settleCompanyName: '', // 账单企业名
      searchDate: '' // 时间区间
    }
  },
  created () {
    let {type, feeFlag, settleCompanyName, date} = this.$route.query
    this.type = type
    this.feeFlag = feeFlag
    this.settleCompanyName = settleCompanyName
    this.searchDate = JSON.parse(decodeURIComponent(date))
    this.getSettleCompanyInfo(this.$store.state.pagination)
  },
  computed: {
    manyTableHead () {
      let tableHead = []
      if (this.tableData && this.tableData.length > 0) {
        let temp = this.tableData[0].cashVO
        Object.keys(temp).forEach((key, index) => {
          if (temp[key]['curr'] && temp[key]['curr'].toString() === '[object Object]') {
            tableHead.push({
              label: temp[key]['lable'],
              data: temp[key]['curr'],
              prop: key
            })
          }
        })
      }
      return tableHead
    }
  },
  methods: {
    // 获取收付明细列表
    getSettleCompanyInfo (pagination) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/receiptsAndPaymentDetail',
        data: {
          settleCompanyName: this.settleCompanyName,
          feeFlag: this.feeFlag,
          ...this.searchDate,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          let {list, totalProfit} = res.result
          if (list && list.length > 0) {
            list.forEach(v => {
              let obj = this.flatDoubleObj(v.cashVO)
              Object.assign(v, obj)
            })
          }
          this.tableData = list || []
          this.totalProfit = totalProfit || {}
        }
      })
    },
    // 处理二维对象
    flatDoubleObj (obj) {
      let temp = {}
      Object.keys(obj).forEach((key, index) => {
        for (let k in obj[key]['curr']) {
          temp[key + k] = obj[key]['curr'][k]
        }
      })
      return temp
    },
    // 导出明细
    exportDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/receiptsAndPaymentExport',
        data: {
          settleCompanyName: this.settleCompanyName,
          ...this.searchDate,
          feeFlag: this.feeFlag,
          page: this.paginationInit
        },
        router: this.$router,
        success: ({result}) => {
          result && result[0] && window.open(result[0], '_blank')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.query-table-financeOther {
  background-color: #fff;
  padding: 20px;
  .table-btn {
    padding-bottom: 12px;
  }
}
.one-row {
  width: 100%;
  display: flex;
  align-items: flex-end;
  color: #4c4c4c;
  .left {
    width: 65px;
  }
  .right {
    flex: 1;
  }
  .taxPrice {
    max-width: calc(~"(100% - 85px)");
    span {
      color: #4c4c4c;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
.one-row.all {
  padding: 15px 10px;
  margin-bottom: 15px;
  background-color: #F4F8FC;
  box-sizing: border-box;
}
.right {
  line-height: 18px;
  font-weight: bold;
  font-size: 20px;
  color: #53B246;
  &:after {
    content:'+';
  }
  &:last-child:after{
    content:'';
  }
}
</style>
