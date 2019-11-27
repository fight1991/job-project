<template>
  <section class="sys-main finance">
    <div class="originInfo">
      <!-- 最顶部独立报价标识 -->
      <div class="topFlag flex" v-if="quotationDetail.quotationHeadVO.singleFlag">
        <img src="@/assets/img/Tips.png" alt="">
        <div class="text">项目独立报价</div>
      </div>
      <!-- 基本信息 -->
      <div class="baseInfo">
        <el-row class="title">基本信息</el-row>
        <el-row v-if="quotationDetail.quotationHeadVO.itemName">
          <el-col :span="6">
            <div class="one-row">
              <div class="left">报价名称&nbsp;:</div>
              <div class="right">{{quotationDetail.quotationHeadVO.itemName}}</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="one-row">
              <div class="left">有效期&nbsp;:</div>
              <div class="right">{{quotationDetail.quotationHeadVO.startDate + ' 至 ' + quotationDetail.quotationHeadVO.endDate}}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="one-row">
              <div class="left">报价含税&nbsp;:</div>
              <div class="right">{{quotationDetail.quotationHeadVO.rateFlag ? '含税':'不含税'}}</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="one-row">
              <div class="left">委托企业&nbsp;:</div>
              <div class="right">{{quotationDetail.quotationHeadVO.entrustCompanyName}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row v-else><div class="nodata">暂无数据</div></el-row>
      </div>
      <!-- 应收费用 -->
      <div class="acceptOffer">
        <el-row class="title">应收费用</el-row>
        <el-row class="accept-body" v-if="quotationDetail.quotationReceivableBodyVOList.length>0" v-for="item1 in quotationDetail.quotationReceivableBodyVOList" :key="item1.quotationFeeId">
          <div class="head">
            <el-row>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">进/出境关别&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.impexpPortcdNames || '-'}}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">申报地海关&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.dclPlcCuscdNames || '-'}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">出发地/港&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.departureNames || '-'}}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">目的地/港&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.destinationNames || '-'}}</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="body">
            <el-row>
              <!-- 进口 -->
              <el-col :span="12">
                <div class="eiFlag">进口</div>
                <div class="table">
                  <el-table :data="item1.feeOptionImportVOs" style="width: 100%" :show-header="false">
                    <el-table-column prop="feeOptionName" label="费用名称">
                      <template slot-scope="scope">
                        {{scope.row.feeOptionName || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="feePrice" label="单价" align="right">
                      <template slot-scope="scope">
                        {{scope.row.feePrice || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="feeRate" width="60" label="税率" align="center">
                      <template slot-scope="scope">
                        {{typeof scope.row.feeRate === 'number' ? (scope.row.feeRate + '%') : '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="curr" width="60" label="币制" align="center">
                      <template slot-scope="scope">
                        {{scope.row.curr || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="unit" width="60" label="计费单位">
                      <template slot-scope="scope">
                        {{scope.row.unitValue || '-'}}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
              <!-- 出口 -->
              <el-col :span="12">
                <div class="eiFlag" style="margin-left:18px">出口</div>
                <div class="table noborder">
                  <el-table size="mini" :data="item1.feeOptionExportVOs" style="width: 100%" :show-header="false">
                    <el-table-column prop="feeOptionName" label="费用名称">
                      <template slot-scope="scope">
                        {{scope.row.feeOptionName || '-'}}
                      </template>
                    </el-table-column>
                     <el-table-column prop="feePrice" label="单价" align="right">
                      <template slot-scope="scope">
                        {{scope.row.feePrice || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="feeRate" width="60" label="税率" align="center">
                      <template slot-scope="scope">
                        {{typeof scope.row.feeRate === 'number' ? (scope.row.feeRate + '%') : '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="curr" width="60" label="币制" align="center">
                      <template slot-scope="scope">
                        {{scope.row.curr || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="unit" width="60" label="计费单位">
                      <template slot-scope="scope">
                        {{scope.row.unitValue || '-'}}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row v-else><div class="nodata">暂无数据</div></el-row>
      </div>
      <!-- 应付费用 -->
      <div class="acceptOffer">
        <el-row class="title">应付费用</el-row>
        <el-row class="accept-body" v-if="quotationDetail.quotationPayableBodyVOList.length>0" v-for="item1 in quotationDetail.quotationPayableBodyVOList" :key="item1.quotationFeeId">
          <div class="head">
            <el-row>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">进/出境关别&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.impexpPortcdNames || '-'}}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">申报地海关&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.dclPlcCuscdNames || '-'}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">出发地/港&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.departureNames || '-'}}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="one-row">
                  <div class="left">目的地/港&nbsp;:</div>
                  <div class="right">{{item1.quotationFeeVO.destinationNames || '-'}}</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="body">
            <el-row>
              <!-- 进口 -->
              <el-col :span="12">
                <div class="eiFlag">进口</div>
                <div class="table">
                  <el-table :data="item1.feeOptionImportVOs" style="width: 100%" :show-header="false">
                    <el-table-column prop="feeOptionName" label="费用名称">
                      <template slot-scope="scope">
                        {{scope.row.feeOptionName || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="feePrice" label="单价" align="right">
                      <template slot-scope="scope">
                        {{scope.row.feePrice || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="feeRate" width="60" label="税率" align="center">
                      <template slot-scope="scope">
                        {{typeof scope.row.feeRate === 'number' ? (scope.row.feeRate + '%') : '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="curr" width="60" label="币制" align="center">
                      <template slot-scope="scope">
                        {{scope.row.curr || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="unit" width="60" label="计费单位">
                      <template slot-scope="scope">
                        {{scope.row.unitValue || '-'}}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
              <!-- 出口 -->
              <el-col :span="12">
                <div class="eiFlag" style="margin-left:18px">出口</div>
                <div class="table noborder">
                  <el-table size="mini" :data="item1.feeOptionExportVOs" style="width: 100%" :show-header="false">
                    <el-table-column prop="feeOptionName" label="费用名称">
                      <template slot-scope="scope">
                        {{scope.row.feeOptionName || '-'}}
                      </template>
                    </el-table-column>
                     <el-table-column prop="feePrice" label="单价" align="right">
                      <template slot-scope="scope">
                        {{scope.row.feePrice || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="feeRate" width="60" label="税率" align="center">
                      <template slot-scope="scope">
                        {{typeof scope.row.feeRate === 'number' ? (scope.row.feeRate + '%') : '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="curr" width="60" label="币制" align="center">
                      <template slot-scope="scope">
                        {{scope.row.curr || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="unit" width="60" label="计费单位">
                      <template slot-scope="scope">
                        {{scope.row.unitValue || '-'}}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row v-else><div class="nodata">暂无数据</div></el-row>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      quotationDetail: { // 报价详情
        quotationHeadVO: {},
        quotationPayableBodyVOList: [],
        quotationReceivableBodyVOList: []
      }
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'offerManage-detail' && from) {
        this.getFeesDetail(this.$route.query.quotationId)
      }
    }
  },
  created () {
    this.getFeesDetail(this.$route.query.quotationId)
  },
  methods: {
    // 获取报价详情
    getFeesDetail (id) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/quotation/get',
        data: {
          quotationId: id
        },
        router: this.$router,
        success: ({result}) => {
          if (result && JSON.stringify(result) !== '{}') {
            if (Array.isArray(result.quotationPayableBodyVOList) && result.quotationPayableBodyVOList.length > 0) {
              this.splitCodeNames(result.quotationPayableBodyVOList)
            }
            if (Array.isArray(result.quotationReceivableBodyVOList) && result.quotationReceivableBodyVOList.length > 0) {
              this.splitCodeNames(result.quotationReceivableBodyVOList)
            }
            this.quotationDetail = result
          } else {
            this.quotationDetail = {}
          }
        }
      })
    },
    // 处理应收应付中港数据,只需展示names
    splitCodeNames (arr) {
      // quotationPayableBodyVOList quotationReceivableBodyVOList
      arr.forEach(v => {
        for (let key in v['quotationFeeVO']) {
          if (key === 'departureNames' || key === 'destinationNames') {
            if (v['quotationFeeVO'][key] && v['quotationFeeVO'][key].length > 0) {
              let tempArr = []
              v['quotationFeeVO'][key].split(';').forEach(item => {
                let temp = item.split('~')[item.split('~').length - 1]
                tempArr.push(temp)
              })
              v['quotationFeeVO'][key] = tempArr.join(';')
            }
          }
          // impexpPortcdNames dclPlcCuscdNames
          if (key === 'impexpPortcdNames' || key === 'dclPlcCuscdNames') {
            if (v['quotationFeeVO'][key] && v['quotationFeeVO'][key].length > 0) {
              let temp = v['quotationFeeVO'][key].split(';').map(item => item.split('-')[1])
              v['quotationFeeVO'][key] = temp.join(';')
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-col {
    color: #4c4c4c;
  }
  .nodata {
    color: #4c4c4c;
    text-align:center;
    height:50px;
    line-height:50px;
  }
  .baseInfo {
    .one-row {
      .left {
        width: 65px;
      }
    }
  }
  .one-row {
    width: 100%;
    display: flex;
    align-items: flex-start;
    .left {
      width: 85px;
    }
    .right {
      flex: 1;
    }
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .eiFlag {
    border-left: 2px solid #287FCA;
    margin: 12px 0 8px 0;
    padding-left: 10px;
    line-height: 13px;
  }
  .topFlag {
    padding-left: 18px;
    margin-bottom: 20px;
    height: 48px;
    box-sizing: border-box;
    border: 1px solid #ffc56b;
    background-color: #ffe9c7;
    img {
      display:block;
      margin-right: 8px;
    }
  }
  .baseInfo,
  .acceptOffer {
    background-color: #fff;
    padding: 18px 18px 8px;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      color: #4c4c4c;
      margin-bottom: 18px;
    }
    .el-row {
      margin-left: 0!important;
      margin-right: 0!important;
    }
  }
  .baseInfo {
    padding: 18px;
    .el-row {
      .el-col:nth-child(1) {
        padding-left: 18px!important;
      }
    }
  }
  .acceptOffer {
    .el-row {
      .el-col:nth-child(1) {
        padding-left: 0!important;
      }
    }
  }
  .margin_0 {
    margin: 0!important;
    width: 100%;
  }
  .originInfo {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 15px;
    }
  }
  .acceptOffer {
    .accept-body {
      border: 1px solid #d8d8d8;
      padding: 18px;
      margin-bottom: 18px;
      .table {
        border-right: 1px solid #d8d8d8;
      }
      .noborder {
        border-right: none;
        padding-left: 18px;
      }
      .base-line {
        border-bottom: 1px solid #d8d8d8;
        margin: 0!important;
      }
      .padding_0 {
        padding-left:0!important;
      }
      .head {
        border-bottom: 1px solid #d8d8d8;
        .el-row {
          padding-bottom: 18px;
        }
      }
    }
  }
</style>
