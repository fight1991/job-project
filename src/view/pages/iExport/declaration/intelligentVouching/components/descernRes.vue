<template>
<!-- 表体——智能归类组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="识别结果"
      :visible.sync="descernResultVisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @closed ="closedesRes()"
      width="900px">
      <el-table
        ref="recordTable"
        :data="descernRecords"
        highlight-current-row border size='mini'
        height="50">
        <el-table-column v-if="orctype == '提单'" min-width="100" label="运输方式"  align="center" >
            <template slot-scope="scope">
                <div>
                    <span :style='"color:"+(total.decHeadVO.trafMode===scope.row.trafMode?"":"red")'>{{scope.row.trafModeValue}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column v-if="orctype == '提单'"  label="提单号" min-width="150">
            <template slot-scope="scope">
                <div>
                    <span :style='"color:"+(total.decHeadVO.billNo===scope.row.billNo?"":"red")'>{{scope.row.billNo}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column v-if="orctype == '提单'" label="境外收发货人名称外文" min-width="200">
            <template slot-scope="scope" v-if="orctype == '提单'">
                <div v-if="total.decHeadVO.iEFlag === 'I'">
                    <span :style='"color:"+(total.decHeadVO.overseasConsignorEname===scope.row.overseasConsignorEname?"":"red")'>{{scope.row.overseasConsignorEname}}</span>
                </div>
                <div else="total.decHeadVO.iEFlag === 'I'">
                    <span :style='"color:"+(total.decHeadVO.overseasConsigneeEname===scope.row.overseasConsigneeEname?"":"red")'>{{scope.row.overseasConsigneeEname}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column   label="件数" min-width="100">
            <template slot-scope="scope">
                <div>
                    <span :style='"color:"+(total.decHeadVO.packNo===scope.row.packNo?"":"red")'>{{scope.row.packNo}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column   label="毛重" min-width="100">
            <template slot-scope="scope">
                <div>
                    <span :style='"color:"+(total.decHeadVO.grossWt===scope.row.grossWt?"":"red")'>{{scope.row.grossWt}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column v-if="orctype !== '装箱单'"  label="总价" min-width="80">
            <template slot-scope="scope" v-if="orctype !== '装箱单'">
                <div>
                    <span :style='"color:"+(total.decListVO.length>0&&total.decListVO[0].declTotal===scope.row.declTotal?"":"red")'>{{scope.row.declTotal}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column v-if="orctype !== '装箱单'"  label="币制" min-width="80">
            <template slot-scope="scope" v-if="orctype !== '装箱单'">
                <div>
                    <span :style='"color:"+(total.decListVO.length>0&&total.decListVO[0].tradeCurr===scope.row.tradeCurr?"":"red")'>{{scope.row.tradeCurrValue}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column v-if="orctype !== '提单'"  label="净重" min-width="80">
            <template slot-scope="scope" v-if="orctype !== '提单'" >
                <div>
                    <span :style='"color:"+(total.decHeadVO.netWt===scope.row.netWt?"":"red")'>{{scope.row.netWt}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column v-if="orctype !== '提单'"  label="数量" min-width="80">
            <template slot-scope="scope"  v-if="orctype !== '提单'" >
                <div>
                    <span :style='"color:"+(total.decListVO.length>0&&total.decListVO[0].gQty===scope.row.gQty?"":"red")'>{{scope.row.gQty}}</span>
                </div>
            </template>
        </el-table-column>
      </el-table>
        <el-row  style='border:unset;margin:40px 0 20px 0;'>
            <span style='color:red'>{{'tips:识别'+ orctype + (descernRecords.length ===1?descernRecords[0].num:'0') +'份'}}</span>
        </el-row>
        <el-row style='border:unset;margin-bottom:20px;text-align:center'>
            <el-col :span="6" :offset="6">
            <el-button class='dialog-primary-btn'  size="mini" @click="backdata()">
              回填识别结果
            </el-button>
            </el-col>
            <el-col :span="6">
            <el-button class='dialog-btn' size="mini" @click="closedesRes()">
              关闭
            </el-button>
            </el-col>
        </el-row>
      </el-dialog>
    <!-- 智能归类 -->
  </section>
</template>
<script>
// import util from '@/common/util.js'
// import decUtil from '../../common/decUtil'
export default {
  name: 'classify-Goods',
  props: {
    descernResultVisable: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: ''
    },
    total: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      fileList: [],
      taxDetailVisible: false,
      descernRecords: [],
      codeTsFilters: [],
      orctype: '提单',
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      taxForm: {}
    }
  },
  created () {
    this.getOrcrecord()
  },
  methods: {
    getOrcrecord () {
      this.$post({
        url: 'API@/dec-common/dec/orc/getOcrBillList',
        data: {page: this.page, taskId: this.taskId},
        success: (res) => {
          if (res.result && res.result.length === 1) {
            this.orctype = res.result[0].docType
            this.$forceUpdate()
            this.$nextTick(() => {
              this.descernRecords = res.result
            })
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 数据翻填
    backdata () {
      if (this.total.decListVO.length > 0) {
        this.total.decListVO[0].gQty = this.descernRecords[0].gQty ? this.descernRecords[0].gQty : ''
        this.total.decListVO[0].declTotal = this.descernRecords[0].declTotal ? this.descernRecords[0].declTotal : ''
        this.total.decListVO[0].tradeCurr = this.descernRecords[0].tradeCurr ? this.descernRecords[0].tradeCurr : ''
        this.total.decListVO[0].tradeCurrValue = this.descernRecords[0].tradeCurrValue ? this.descernRecords[0].tradeCurrValue : ''
      }
      this.total.decHeadVO.trafMode = this.descernRecords[0].trafMode || this.total.decHeadVO.trafMode
      this.total.decHeadVO.billNo = this.descernRecords[0].billNo || this.total.decHeadVO.billNo
      if (this.total.decHeadVO.iEFlag === 'I') {
        this.total.decHeadVO.overseasConsignorEname = this.descernRecords[0].overseasConsignorEname || this.total.decHeadVO.overseasConsignorEname
      } else {
        this.total.decHeadVO.overseasConsigneeEname = this.descernRecords[0].overseasConsigneeEname || this.total.decHeadVO.overseasConsigneeEname
      }
      this.total.decHeadVO.packNo = this.descernRecords[0].packNo || this.total.decHeadVO.packNo
      this.total.decHeadVO.grossWt = this.descernRecords[0].grossWt || this.total.decHeadVO.grossWt
      this.total.decHeadVO.netWt = this.descernRecords[0].netWt || this.total.decHeadVO.netWt
      this.$emit('getTradeSelects')
    },
    closedesRes () {
      this.$emit('close:descernResultClose')
      this.descernResultVisable = false
    }
  }
}
</script>
<style lang="less" scoped>
.dec-i{
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  background-color: #fff
}
.border-0 {
  border: 0;
  margin-right: 5px;
}
.el-table__column-filter-trigger i {
    color: blue;
    font-size: 14px;
}
.el-table th>.cell.highlight {
    color: #fff;
}
</style>
