<template>
  <section class='sys-main accountDetail'>
    <div class="area" v-for="(item, index) in tableData.accountBillOptionVOs" :key="'index'+index">
      <el-row class="line up">
        <el-col :span="8">
          <div class="one-row">
            <div class="left">接单编号&nbsp;:</div>
            <div class="right">{{item.orderNo || '-'}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="one-row">
            <div class="left">报关单号&nbsp;:</div>
            <div class="right">{{item.decNo || '-'}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="one-row">
            <div class="left">提单号&nbsp;:</div>
            <div class="right">{{item.billNo || '-'}}</div>
          </div>
        </el-col>
      </el-row>
      <!-- 列表表格开始 -->
      <div class='query-table-inside'>
        <el-table class='sys-table-table' align="left" size="mini" :max-height="300"
          :data="item.billOptionsVOs" border ref="accountTable">
          <el-table-column label="序号" type="index" width="50" align="center">
          </el-table-column>
          <el-table-column prop="feeOptionName" label="费用名称" min-width="120">
          </el-table-column>
          <el-table-column prop="feePrice" label="计费单价" align="right" min-width="140">
          </el-table-column>
          <el-table-column prop="unitValue" width="80" label="计量单位" align="center">
            <template slot-scope="scope">
              {{scope.row.unitValue || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="curr" width="80" label="币制" align="center">
          </el-table-column>
          <el-table-column prop="num" width="100" label="数量" align="right">
            <template slot-scope="scope">
              {{typeof scope.row.num === 'number' ? scope.row.num : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="rate" width="80" label="税率" align="right">
            <template slot-scope="scope">
              {{typeof scope.row.rate === 'number' ? (scope.row.rate + '%') : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="taxPrice" width="100" label="含税总价" align="right">
            <template slot-scope="scope">
              {{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="billType" width="100" label="类型" align="center">
            <template slot-scope="scope">
              {{scope.row.billType === 1 ? '手动登账' : '自动登账'}}
            </template>
          </el-table-column>
          <el-table-column prop="itemName" min-width="120" label="使用报价" align="left">
            <template slot-scope="scope">
              {{scope.row.itemName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="invoiceStatusValue" min-width="80" label="开票状态" align="center" fixed="right">
          </el-table-column>
          <el-table-column prop="flatStatusValue" min-width="80" label="平账状态" align="center" fixed="right">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="area">
      <div class="look" v-if="type === 'look'">
        <div class="one-row all">
          <div class="left">含税总金额&nbsp;:</div>
          <div class="right" v-if="tableData.amountVOs.length>0"><span class="money" v-for="(item2, index2) in tableData.amountVOs" :key="'item_2'+index2">{{(item2.curr || '-') +' '+ item2.price.toLocaleString()}}</span></div>
          <div class="right" v-if="tableData.amountVOs.length===0">{{'-'}}</div>
        </div>
        <div class="one-row all">
          <div class="left">已平账金额&nbsp;:</div>
          <div class="right" v-if="tableData.flatVOs.length>0"><span class="money" v-for="(item3, index3) in tableData.flatVOs" :key="'item_3'+index3">{{(item3.curr || '-') +' '+ item3.price.toLocaleString()}}</span></div>
          <div class="right" v-if="tableData.flatVOs.length===0">{{'-'}}</div>
        </div>
        <div class="one-row all">
          <div class="left">已开票金额&nbsp;:</div>
          <div class="right" v-if="tableData.invoiceVos.length>0"><span class="money" v-for="(item4, index4) in tableData.invoiceVos" :key="'item_4'+index4">{{(item4.curr || '-') +' '+ item4.price.toLocaleString()}}</span></div>
          <div class="right" v-if="tableData.invoiceVos.length===0">{{'-'}}</div>
        </div>
      </div>
      <div class="check" v-else>
        <div class="one-row check">
          <div class="left">含税总金额&nbsp;:</div>
          <div class="taxPrice" v-if="tableData.amountVOs.length>0"><span class="money" v-for="(item2, index2) in tableData.amountVOs" :key="'item_2'+index2">{{(item2.curr || '-') +' '+ item2.price.toLocaleString()}}</span></div>
          <div class="taxPrice" v-if="tableData.amountVOs.length===0">{{'-'}}</div>
        </div>
      </div>
    </div>
    <div class="area" v-if="type === 'check' || type === 'pass'">
      <div class="title">{{type === 'check' ? '审核意见' : '驳回意见'}}</div>
      <el-row>
        <el-input type="textarea" :rows="4" v-model="verifys" :maxlength="200" show-word-limit></el-input>
      </el-row>
    </div>
    <div class="submit" v-if="type === 'check' || type === 'pass'">
      <el-row style="text-align:center">
        <el-button size="mini"  @click="accountCheck('rejects')">{{type === 'check' ? '审核驳回' :'账单驳回'}}</el-button>
        <el-button size="mini" type="primary" class="longButton" @click="accountCheck('verifys')">{{type === 'check' ? '审核通过' :'账单无误'}}</el-button>
      </el-row>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      tableData: {
        accountBillOptionVOs: [],
        amountVOs: [],
        flatVOs: [],
        invoiceVos: []
      },
      verifys: '', // 意见
      type: '' // 记录操作类型
    }
  },
  created () {
    let {type, accountBillId} = this.$route.query
    this.type = type
    this.getAccountDetail(accountBillId)
  },
  watch: {
    '$route.query': function () {
      this.type = this.$route.query.type
    }
  },
  methods: {
    // 获取账单详情
    getAccountDetail (accountBillId) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/get',
        data: {
          accountBillId
        },
        router: this.$router,
        success: ({result}) => {
          this.tableData = result || {}
        }
      })
    },
    // 批量审核驳回/确认
    accountCheck (type) {
      let url = ''
      if (this.type === 'check') { // 待审核
        url = type === 'rejects' ? 'account/rejects' : 'account/verifys'
      }
      if (this.type === 'pass') { // 待对账
        url = type === 'rejects' ? 'account/reviewReject' : 'account/reviewPass'
      }
      this.$store.dispatch('ajax', {
        url: `API@saas-finance/${url}`,
        data: {
          accountBillIds: [this.$route.query.accountBillId],
          verifyMsg: this.verifys || ''
        },
        router: this.$router,
        success: res => {
          this.$message({
            type: 'success',
            message: type === 'rejects' ? '驳回成功' : '通过成功'
          })
          this.$store.dispatch('CloseTab', this.$route.query.setId)
          this.$router.push({
            name: 'accountManage-list',
            query: {
              from: 'other'
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.query-table-inside {
  background-color: #fff;
  // padding: 20px;
  // margin-top: 20px;
}
  .area {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 18px;
  }
  .title {
    padding-bottom: 18px;
    color: #4c4c4c;
  }
  .line {
    margin-bottom: 18px;
  }
  .one-row {
    width: 100%;
    display: flex;
    align-items: flex-end;
    color: #4c4c4c;
    &.check {
      justify-content: flex-end;
    }
    .left {
      width: 85px;
    }
    .right {
      flex: 1;
    }
    .taxPrice {
      max-width: calc(~"(100% - 85px)");
      span {
        color: #FF4300;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
  .one-row.all {
    padding-bottom: 10px;
  }
  .money {
    &:after {
      content:'+';
    }
    &:last-child:after{
      content:'';
    }
  }
</style>
