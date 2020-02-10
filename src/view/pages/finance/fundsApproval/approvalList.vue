<template>
  <section class='sys-main'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.five" :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="接单编号">
              <el-input v-model="QueryForm.orderNo" clearable maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单号">
              <el-input v-model="QueryForm.decNo" clearable maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提单号">
              <el-input v-model="QueryForm.billNo" clearable maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="业务类型">
              <el-select v-model="QueryForm.businessType" clearable style="width:100%;">
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
              <el-select v-model="QueryForm.iEFlag" clearable style="width:100%;">
                <el-option key="0" :label="'进口'" :value="0"></el-option>
                <el-option key="1" :label="'出口'" :value="1"></el-option>
              </el-select>
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
              <el-select v-model="QueryForm.status" clearable style="width:100%;">
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="query-btn">
        <el-col :span="24" align="center">
          <el-button size="mini" type="primary" @click="getsApprovalList($store.state.pagination)">查询</el-button>
          <el-button size="mini" @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-row>
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-check" :disabled="fundIdsStatus.length === 0" @click="batchCheck('check')"><i></i>审核通过</el-button>
        <el-button size="mini" class="list-btns list-icon-reject" :disabled="fundIdsStatus.length === 0" @click="batchCheck('reject')"><i></i>审核驳回</el-button>
      </el-row>
      <el-table class='sys-table-table' :data="approvalTableList" border highlight-current-row height="530px" ref="fundTable" @select="chooseSelectBox" @row-click="chooseSelectRow" @select-all="chooseSelectBoxAll">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="接单编号" min-width="110" align="center" prop="orderNo">
          <template slot-scope="scope">
            {{scope.row.orderNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="报关单号" min-width="130" align="center" prop="decNo">
          <template slot-scope="scope">
            {{scope.row.decNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="提单号" min-width="100" align="left" prop="billNo">
          <template slot-scope="scope">
            {{scope.row.billNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="业务类型" min-width="90" align="center" prop="businessTypeValue">
          <template slot-scope="scope">
            {{scope.row.businessTypeValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="委托企业" min-width="150" align="left" prop="entrustCompanyName">
          <template slot-scope="scope">
            {{scope.row.entrustCompanyName || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="进出口" min-width="80" align="center" prop="iEFlagValue">
          <template slot-scope="scope">
            {{scope.row.iEFlagValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="申报地海关" min-width="100" align="center" prop="dclPlcCuscdValue">
          <template slot-scope="scope">
            {{scope.row.dclPlcCuscdValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="船名" min-width="90" align="left" prop="vesselen">
          <template slot-scope="scope">
            {{scope.row.vesselen || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="航次" min-width="90" align="left" prop="voyage">
          <template slot-scope="scope">
            {{scope.row.voyage || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="请款金额" min-width="90" align="right" prop="fundAmount">
          <template slot-scope="scope">
            {{scope.row.fundAmount && scope.row.fundAmount.toLocaleString() || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="请款原因" min-width="180" align="left" prop="rmk">
          <template slot-scope="scope">
            {{scope.row.rmk || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="请款状态" min-width="90" align="center" prop="statusValue">
          <template slot-scope="scope">
            {{scope.row.statusValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="90" align="center" prop="payStatusValue">
          <template slot-scope="scope">
            {{scope.row.payStatusValue || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="80" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button title="详情" type="text" class="table-icon list-icon-look" @click.stop="getDetail(scope.row.fundId,scope.row.status)"><i></i></el-button>
            <el-button title="备注" type="text" class="table-icon list-icon-remark" @click.stop="openRemarkDialog(scope.row.fundId)"><i></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='paginationInit' @change="getsApprovalList"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 审核弹窗 -->
    <el-dialog
      title="请款详情"
      :visible.sync="approvalDetailShow"
      :close-on-click-modal='false'
      :modal-append-to-body="false"
      class="approval-dialog" width="500px">
      <div class="pd-lr-20">
        <div class="one-row mg-b-15">
          <div class="left">请款金额</div>
          <div class="right">{{fundDetailData.curr}}&nbsp;{{fundDetailData.fundAmount}}</div>
        </div>
        <div class="one-row">
          <div class="left">请款原因</div>
          <div class="right word-break">{{fundDetailData.rmk}}</div>
        </div>
      </div>
      <el-row class="mg-t-20" style="text-align:center;" v-if="fundDetailData.status === 0">
        <el-button size="mini" @click="checkFun('reject')">审核驳回</el-button>
        <el-button size="mini" type="primary" @click="checkFun('check')">审核通过</el-button>
      </el-row>
    </el-dialog>
    <!-- 备注弹框 -->
    <el-dialog
      title="添加备注"
      :visible.sync="remarkVisible"
      :close-on-click-modal='false'
      :modal-append-to-body="false"
      width="70%">
      <el-form :model="remarkForm" label-width="70px" label-position="left">
        <el-row>
          <el-col>
            <el-form-item label="备注">
              <el-input
                v-model="remarkForm.payRmk"
                :rows="3"
                type="textarea"
                :maxlength="200"
                show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="支付状态">
              <el-select v-model="remarkForm.payStatus" clearable>
                <el-option label="已收" :value="0" key="0"></el-option>
                <el-option label="未收" :value="1" key="1"></el-option>
                <el-option label="预付" :value="2" key="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="mg-t-20" style="text-align:center;">
        <el-button size="mini" @click="remarkVisible=false">取消</el-button>
        <el-button size="mini" type="primary" @click="addRemarkInfo">确定</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      remarkVisible: false,
      remarkForm: {},
      QueryForm: {
        orderNo: '',
        decNo: '',
        billNo: '',
        businessType: '',
        entrustCompanyId: '',
        entrustCompanyName: '',
        iEFlag: '',
        dclPlcCuscd: ''
      },
      corpList: [], // 委托企业
      statusList: [{
        value: '0',
        label: '待审核'
      }, {
        value: '1',
        label: '审核通过'
      }, {
        value: '2',
        label: '审核驳回'
      }], // 状态
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
      approvalTableList: [],
      approvalDetailShow: false, // 请款详情弹窗
      fundDetailData: {}, // 详情数据
      fundIdsList: [], // 存储id数组
      selectedRow: [] // 勾选数组
    }
  },
  created () {
    this.getcorps()
    this.getCommonParam()
    this.paginationInit = this.$store.state.pagination
    this.getsApprovalList(this.$store.state.pagination)
  },
  computed: {
    fundIdsStatus () { // 待审核状态下批量审核驳回
      let flag = this.selectedRow.every(v => v.status === 0)
      if (flag) {
        return this.fundIdsList.map(v => v.fundId)
      }
      return []
    }
  },
  methods: {
    // 查询
    getsApprovalList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/bill/funds',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          this.approvalTableList = res.result || []
        }
      })
    },
    // 重置
    resetForm () {
      this.QueryForm = {
        orderNo: '',
        decNo: '',
        billNo: '',
        businessType: '',
        entrustCompanyId: '',
        entrustCompanyName: '',
        iEFlag: '',
        dclPlcCuscd: ''
      }
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
    // 创建字典参数列表
    tipsFill (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 判断缓存中是否有数据
    getCommonParam (callback) {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map, callback)
      } else {
        callback && callback()
      }
    },
    // 获取公共字典list
    getCommonParams (datas, callback) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
          callback && callback()
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
    // 勾选选择框
    chooseSelectBox (selection, row) {
      this.fundIdsList = selection.map(v => {
        return v.fundId
      })
      this.selectedRow = [...selection]
    },
    // 勾选选择框
    chooseSelectBoxAll (selection) {
      this.fundIdsList = selection.map(v => {
        return v.fundId
      })
      this.selectedRow = [...selection]
    },
    // 点击表格行
    chooseSelectRow (row, column, event) {
      let index = this.fundIdsList.indexOf(row.fundId)
      if (index >= 0) { // 当前的行已经被选中了
        this.$refs['fundTable'].toggleRowSelection(row, false)
        this.fundIdsList.splice(index, 1)
        this.selectedRow.splice(index, 1)
      } else {
        this.$refs['fundTable'].toggleRowSelection(row, true)
        this.fundIdsList.push(row.fundId)
        this.selectedRow.push({...row})
      }
    },
    getDetail (fundId, status) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/fundDetail',
        data: {fundId: fundId},
        router: this.$router,
        success: (res) => {
          this.fundDetailData = res.result ? res.result : {}
          this.approvalDetailShow = true
          this.fundDetailData['status'] = status
          this.fundDetailData['fundId'] = fundId
        }
      })
    },
    // 批量审核
    batchCheck (type) {
      if (this.fundIdsList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择一条或多条待审核的请款记录'
        })
        return
      }
      let url = type === 'reject' ? 'API@/saas-finance/bill/fundReject' : 'API@/saas-finance/bill/fundPass'
      this.$store.dispatch('ajax', {
        url: url,
        data: {fundIds: this.fundIdsList},
        router: this.$router,
        success: (res) => {
          this.$message({
            type: 'success',
            message: type === 'reject' ? '驳回成功' : '审核成功'
          })
          this.selectedRow = []
          this.fundIdsList = []
          this.getsApprovalList(this.$store.state.pagination)
        }
      })
    },
    // 审核驳回/审核通过
    checkFun (type) {
      let url = type === 'reject' ? 'API@/saas-finance/bill/fundReject' : 'API@/saas-finance/bill/fundPass'
      this.$store.dispatch('ajax', {
        url: url,
        data: {fundIds: [this.fundDetailData.fundId]},
        router: this.$router,
        success: (res) => {
          this.$message({
            type: 'success',
            message: type === 'reject' ? '驳回成功' : '审核成功'
          })
          this.approvalDetailShow = false
          this.getsApprovalList(this.$store.state.pagination)
        }
      })
    },
    // 备注弹框显示
    openRemarkDialog (id) {
      this.remarkVisible = true
      this.getRemarkDetail(id)
    },
    // 获取备注详情
    getRemarkDetail (fundId) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/payRmkDetail',
        data: {fundId},
        router: this.$router,
        success: (res) => {
          this.remarkForm = res.result || {}
        }
      })
    },
    addRemarkInfo () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/payRmkEdit',
        data: this.remarkForm,
        router: this.$router,
        success: (res) => {
          this.$message.success('添加成功!')
          this.remarkVisible = false
          this.getsApprovalList(this.$store.state.pagination)
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
.pd-lr-20{
  padding: 0 20px;
}
.one-row {
  width: 100%;
  display: flex;
  align-items: flex-start;
  color: #4c4c4c;
  .left {
    width: 65px;
  }
  .right {
    flex: 1;
  }
}
.list-icon-remark {
  background-image: url('../../../../assets/img/standard/icon-remark.png') no-repeat;
}
</style>
