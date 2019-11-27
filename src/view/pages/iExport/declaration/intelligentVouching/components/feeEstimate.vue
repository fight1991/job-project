<template>
  <section>
    <el-table
      ref="estimateTable"
      :data="feeEstimateList"
      highlight-current-row
      border
      size="mini"
      height="300"
      max-height="500"
      style="width: 100%"
    >
      <el-table-column property="gNo" label="项号" min-width="30">
        <template slot-scope="scope">
          <span>{{scope.row.gNo || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="gName" label="品名" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.gName || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="declTotal" label="总价" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.declTotal || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="tradeCurr" label="币制" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.tradeCurr || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="preTax" label="计征汇率" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.preTax || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="cnyMoney" label="人民币价值" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.cnyMoney || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="fullTotal" label="完税金额" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.fullTotal || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="cusTax" label="关税税率" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.cusTax || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="iMoney" label="进口关税（¥）" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.iMoney || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="taxRate" label="增值税税率" min-width="60">
        <template slot-scope="scope">
          <span>{{scope.row.taxRate || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column property="taxMoney" label="进口增值税（¥）" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.taxMoney || '-'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-row class="sys-page-list page-no-border">
      <el-col :span="10" align="left">
        <span>合计</span>
        <span style="color:red">{{moneyTotal}}</span>
        <span>元&nbsp;&nbsp;进口关税</span>
        <span style="color:red">{{iMoneyTotal}}</span>
        <span>元&nbsp;&nbsp;进口增值税</span>
        <span style="color:red">{{taxMoneyTotal}}</span>
        <span>元</span>
      </el-col>
      <el-col :span="14" align="right">
        <el-pagination
          background
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
  </section>
</template>
<script>

export default {
  props: {
    feeEstimateData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      feeEstimateList: [], // 表格数据
      iMoneyTotal: 0,
      taxMoneyTotal: 0,
      moneyTotal: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      }, // 存放后台返回的页码
      total: 0
    }
  },
  methods: {
    getTableData () {
      this.feeEstimateData.page = this.page
      this.$post({
        url: 'API@/saas-dictionary/decParam/getPreTaxList',
        data: this.feeEstimateData,
        success: (res) => {
          [this.total, this.feeEstimateList, this.moneyTotal, this.iMoneyTotal, this.taxMoneyTotal] = [res.page.total, res.result.taxList, res.result.total, res.result.iMoneyTotal, res.result.taxMoneyTotal]
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    sizeChangeHandle (pageSize) {
      this.page.pageSize = pageSize
      this.getTableData()
    },
    currentChangeHandle (pageIndex) {
      this.page.pageIndex = pageIndex
      this.getTableData()
    }
  },
  created () {
    this.getTableData()
  }
}
</script>
<style scoped lang="less">
.page-no-border {
  border: 0px !important;
}
</style>
