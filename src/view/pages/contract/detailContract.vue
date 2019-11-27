<template>
  <section class='sys-main'>
    <el-row class='sys-header'>
      <!-- 返回按钮 end-->
      <el-col :span="18">
        <span @click="back" class="sys-back-btn"><i class="back-btn"></i>返回</span>
      </el-col>
      <!-- 返回按钮 end-->
      </el-row>
      <el-row class= "query-table">
      <div style="margin:0px 20px;">
        <el-form :model="resultForm" label-width="100px">
          <el-row :gutter="10">
            <el-col :span="8" :xs="12" >
              <el-form-item label="本企业:">
                <span>{{$store.state.userLoginInfo.companyName}}</span>
                <el-tag :type="$store.state.userLoginInfo.companyCode === resultForm.companyId ?'success':'warn'" size='mini'>合作{{$store.state.userLoginInfo.companyCode === resultForm.companyId?'甲':'乙'}}方</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="合作企业:">
                <span>{{$store.state.userLoginInfo.companyCode === resultForm.companyId?resultForm.entrustCompanyName:resultForm.companyName}}</span>
                <el-tag :type="$store.state.userLoginInfo.companyCode === resultForm.companyId ?'warn':'success'" size='mini'>合作{{$store.state.userLoginInfo.companyCode === resultForm.companyId?'乙':'甲'}}方</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="合同号:">
                <span v-text="resultForm.contractNo"></span>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="合同有效期:">
                <span v-text="resultForm.contractBeginDate +'~'+ resultForm.contractEndDate"></span>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="结算日:">
                <span>{{formatSettlemen(resultForm)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="结算周期:">
                <span v-text="resultForm.settlementPeriod==0?'上月整月':'上季整季'"></span>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="付款周期:">
                <span v-text="resultForm.paymentPeriod"></span>天
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="创建时间:">
                <span v-text="resultForm.createDate"></span>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="12">
              <el-form-item label="创建人:">
                <span v-text="resultForm.createUserName"></span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件:">
                <span style="color:rgb(55, 134, 199);cursor:pointer" @click="enclosureFun">{{resultForm.enclosureName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="审核意见:" v-if="resultForm.verifyMsg">
                <span v-text="resultForm.verifyMsg"></span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table class='sys-table-table' :data="resultForm.infos" border highlight-current-row height="530px">
          <el-table-column label="创建时间" min-width="160" >
            <template slot-scope="scope">
              {{dateFormat(new Date(scope.row.createDate))|| '-'}}
            </template>
          </el-table-column>
          <el-table-column label="报价编号" min-width="130">
            <template slot-scope="scope">
              {{scope.row.quotationNo || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="邀请编号" min-width="120">
            <template slot-scope="scope">
              {{scope.row.invitationNo || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="进出口" min-width="80">
            <template slot-scope="scope">
              {{scope.row.iEFlag==0?'进口':'出口' || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="报价项" min-width="180">
            <template slot-scope="scope">
              {{scope.row.optionsName || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="报价有效期" min-width="180">
            <template slot-scope="scope">
              {{(scope.row.beginDate )  || '-'}}~{{(scope.row.endDate ) || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="创建人" min-width="80">
            <template slot-scope="scope">
              {{scope.row.createUserName || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="80">
            <template slot-scope="scope">
              {{scope.row.statusValue || '-'}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <el-button type="text" v-if="!(scope.row.status=='5' && $store.state.userLoginInfo.companyCode === resultForm.companyId )" @click="gotoPriceDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </el-row>
  </section>
</template>
<script>
import util from '@/common/util'
// import validator from '@/common/validator'
export default {
  data () {
    return {
      pkSeqNo: '',
      resultForm: {},
      resultList: []
    }
  },
  created () {
    this.pkSeqNo = this.$route.params.pkSeqNo
    this.queryDetail()
  },
  mounted () {},
  watch: {
    '$route': function (to, from) {
      if (to.path.indexOf('detailContract') === -1) {
        return
      }
      this.resultForm = {}
      this.resultList = []
      this.pkSeqNo = this.$route.params.pkSeqNo
      this.queryDetail()
    }
  },
  methods: {
    // 返回按钮
    back () {
      this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        name: 'contract-list'
      })
    },
    queryDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/getInfo',
        data: {pkSeqNo: this.pkSeqNo},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.resultForm = res.result
        }
      })
    },
    formatSettlemen (row) {
      if (util.isEmpty(row.settlementMonth)) {
        return (row.settlementType === 0 ? '每月' : '每季') + ' ' + row.settlementDay + '号'
      } else {
        return (row.settlementType === 0 ? '每月' : '每季') + ' 第' + row.settlementMonth + '个月 ' + row.settlementDay + '号'
      }
    },
    enclosureFun () {
      util.fileView(this.resultForm.enclosureUrl)
    },
    dateFormat (val) {
      return util.dateFormat(val)
    }
    // gotoPriceDetail (row) {
    //   this.$router.push({
    //     name: 'priceDetail',
    //     params: {
    //       'type': 'view',
    //       'mNumber': row.quotationNo
    //     }
    //   })
    // }
  }
}
</script>
<style scoped lang="less">
.price-detail-celltitle{
  font-size: 14px;
  margin:10px 0px;
  color: @aid-color-light;
}
.el-form-item {
    margin-bottom: 2px;
}
.sys-back-btn{
    display: inline-block;
    font-size: 13px;
    color: @font-color-main;
    vertical-align: middle;
    cursor: pointer;
    .back-btn{
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 5px;
        background: url('../../../assets/img/icon/back.png') no-repeat center center;
        background-size: 100%;
        vertical-align: middle;
    }
}
.query-table {
    background-color: #fff;
    margin-top: 20px;
  }
</style>
