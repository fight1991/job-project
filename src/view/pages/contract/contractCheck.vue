<template>
  <section class='sys-main'>
    <!-- 头部 -->
    <el-row class='query-condition data-center'>
      <el-form  :label-width="labelFormWidth.four" :model="QueryForm" size="mini" label-position="right">
        <!-- 查询条件-->
        <el-row>
          <el-col :lg="6" :md="12">
            <el-form-item label="合同企业">
              <el-select size="mini" filterable remote :remote-method="queryCompanyList" :loading=' loading ' reserve-keyword loading-text="加载中" clearable v-model="QueryForm.entrustCompanyId  " placeholder='企业'  style="width:100%;">
                <el-option
                  v-for="item in companyList"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="合同号">
              <el-input size="mini" clearable v-model="QueryForm.contractNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="创建时间">
              <el-date-picker size="mini"  v-model="date"  style="width:100%;"
                type="date"
                :editable='false'>
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="创建人">
              <el-select size="mini" filterable remote :remote-method="getCreateUsers" :loading=' loading ' reserve-keyword loading-text="加载中" clearable v-model="QueryForm.createUserId  " placeholder=''  style="width:100%;">
                <el-option
                  v-for="item in userList"
                  :key="item.createUserId"
                  :label="item.createUserName"
                  :value="item.createUserId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item  label="合同类型">
              <el-select size="mini" clearable v-model="QueryForm.type" style="width:100%;">
                <el-option label="企业合同" :value="0" key="0"></el-option>
                <el-option label="个人合同" :value="1" key="1"></el-option>
                <el-option label="海关合同" :value="2" key="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center">
            <el-button size="mini" type="primary" @click="search()">查询</el-button>
            <el-button size="mini" @click="resetQueryform">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </el-row>
    <!-- 头部 end-->
    <!-- 主显示框 -->
    <div class='query-table'>
      <el-row class="mg-b-12">
          <el-button size="mini" class="list-btns list-icon-subimtCheck" @click="creatContract('check')" v-permissions="'CCBA21402010000'"><i></i>合同审核</el-button>
          <el-button size="mini" class="list-btns list-icon-checkP" @click="verifyAll" v-permissions="'CCBA21402010000'"><i></i>批量审核</el-button>
          <el-button size="mini" class="list-btns list-icon-check" @click="rejectAll" v-permissions="'CCBA21402010000'"><i></i>批量驳回</el-button>
          <el-button size="mini" class="list-btns list-icon-look" @click="gotoDetail('view')"><i></i>查看详情</el-button>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table' :data="resultList" border highlight-current-row height="530px" @selection-change="selectVal">
        <el-table-column type="selection" width="36" align="center"></el-table-column>
        <el-table-column label="合同类型" width="100" prop="typeValue" align="center">
        </el-table-column>
        <el-table-column label="合同甲方" min-width="180" >
          <template slot-scope="scope">
            <!-- 企业合同 -->
            <div v-if="scope.row.type===0" class="text-over-hid" :title="scope.row.companyName">
              {{scope.row.companyName || '-'}}
            </div>
            <!-- 个人合同 -->
            <div v-else-if="scope.row.type===1" class="text-over-hid" :title="propInfo(scope.row, scope.row.companyName, 1)">
              {{propInfo(scope.row, scope.row.companyName, 1) || '-'}}
            </div>
            <!-- 海关合同 -->
            <div v-else class="text-over-hid" :title="propInfo(scope.row, scope.row.companyName, 2)">
              {{propInfo(scope.row, scope.row.companyName, 2) || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合同乙方" min-width="180">
          <template slot-scope="scope">
            <!-- 企业合同 -->
            <div v-if="scope.row.type===0" class="text-over-hid" :title="scope.row.entrustCompanyName">
              {{scope.row.entrustCompanyName || '-'}}
            </div>
            <!-- 个人合同 -->
            <div v-else-if="scope.row.type===1" class="text-over-hid" :title="propInfo(scope.row, scope.row.entrustCompanyName, 1)">
              {{propInfo(scope.row, scope.row.entrustCompanyName, 1) || '-'}}
            </div>
            <!-- 海关合同 -->
            <div v-else class="text-over-hid" :title="propInfo(scope.row, scope.row.entrustCompanyName, 2)">
              {{propInfo(scope.row, scope.row.entrustCompanyName, 2) || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合同号" width="180">
          <template slot-scope="scope">
            {{scope.row.contractNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="合同有效期" min-width="180" align="center">
          <template slot-scope="scope">
            {{scope.row.contractBeginDate   || '-'}}~{{scope.row.contractEndDate || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="结算日" min-width="80" align="center">
          <template slot-scope="scope">
            {{scope.row.settlementDay || '-'}}号
          </template>
        </el-table-column>
        <el-table-column label="结算周期" min-width="80" align="center">
          <template slot-scope="scope">
            {{scope.row.settlementPeriod==0?'上月整月':'上季整季' || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="付款周期" min-width="80" align="right">
          <template slot-scope="scope">
            {{scope.row.paymentPeriod || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180" align="center">
          <template slot-scope="scope">
            {{scope.row.createDate || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="80">
          <template slot-scope="scope">
            {{scope.row.createUserName || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="80">
          <template slot-scope="scope">
            {{formatStatus(scope.row.status) || '-'}}
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list mg-b-50'>
        <el-col :span="24" align="right">
            <page-box :pagination='paginationInit' @change="queryTablelist"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  data () {
    return {
      menuCodes: [['CCBA21402010000']], // 权限编码
      permColumn: [true], // 表格操作栏列显示
      resultList: [], // 列表数据
      checkedData: [], // 选中得数据
      QueryForm: {}, // 查询条件
      date: '', // 日期
      loading: false,
      statusList: [
        {
          label: '待审核',
          value: '0'
        }, {
          label: '审核通过',
          value: '1'
        }, {
          label: '审核驳回',
          value: '2'
        }, {
          label: '已失效',
          value: '3'
        }
      ], // 状态
      companyList: [], // 公司数据
      userList: [] // 创建人数据
    }
  },
  created () {
    this.paginationInit = this.$store.state.pagination
    this.resetQueryform()
  },
  mounted () {
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path === '/contract/check') {
        this.search()
      }
    }
  },
  methods: {
    // 查询
    search () {
      this.queryTablelist(this.$store.state.pagination)
    },
    // 处理个人或海关字段显示
    propInfo (row, hasValue, type) {
      if (hasValue) return hasValue
      if (type === 1) { // 个人
        if (!row.payName || !row.payCard) return ''
        let beforeTxt = row.payCard.substr(0, 6)
        let endTxt = row.payCard.substr(-4, 4)
        return row.payName + beforeTxt + '********' + endTxt
      }
      if (type === 2) { // 海关
        return row.plcCuscd + '-' + row.plcCuscdValue
      }
    },
    // 查询列表
    queryTablelist (pagination) {
      this.paginationInit = pagination
      this.QueryForm.createDate = util.dateFormat(this.date, 'yyyy-MM-dd')
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/gets',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.resultList = res.result
          this.paginationInit = res.page
        }
      })
    },
    selectVal (val) {
      this.checkedData = val
    },
    // 查询创建人
    getCreateUsers (query) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/getCreateUsers',
        data: { corpId: this.$store.state.companyCode },
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.loading = false
          this.userList = res.result
        }
      })
    },
    // 查询合作公司信息
    queryCompanyList (query) {
      if (query.length > 1) {
        this.loading = true
        this.$store.dispatch('ajax', {
          url: 'API@/saas-finance-expense/contract/getCooperationCompanys',
          data: { companyName: query },
          router: this.$router,
          isLoad: false,
          success: (res) => {
            this.loading = false
            this.companyList = res.result
          }
        })
      }
    },
    // 创建合同
    creatContract (type) {
      if (this.checkedData.length === 0) {
        this.$message({
          message: '选择一条数据',
          type: 'error'
        })
        return false
      } else {
        if (this.checkedData.length > 1) {
          this.$message({
            message: '只能选择一条要审核的数据',
            type: 'error'
          })
          return false
        } else {
          if (this.checkedData[0].status !== 0) {
            this.$message({
              message: '只有待审核状态才能进行审核操作',
              type: 'warning'
            })
          } else {
            this.$router.push({
              name: 'contract-add',
              params: {
                flag: type,
                pkSeqNo: this.checkedData[0].pkSeqNo,
                setTitle: '合同审核-' + this.checkedData[0].pkSeqNo,
                setId: this.checkedData[0].pkSeqNo + 'check'
              }
            })
          }
        }
      }
    },
    // 重置
    resetQueryform () {
      this.QueryForm = {}
      this.date = ''
      this.search()
    },
    // 审核通过
    verifyAll () {
      let pkSeqNo = []
      for (let i of this.checkedData) {
        pkSeqNo.push(i.pkSeqNo)
        if (i.status !== 0) {
          this.$message({
            message: '只有待审核状态才能进行审核操作',
            type: 'warning'
          })
          return
        } else {
          this.$confirm('是否确认审核通过所选全部合同', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            type: 'warning'
          }).then(() => {
            let data = {
              'pkSeqNos': pkSeqNo,
              'verifyMsg': ''
            }
            this.$store.dispatch('ajax', {
              url: 'API@/saas-finance-expense/contract/verify',
              data: data,
              router: this.$router,
              isLoad: false,
              success: (res) => {
                if (res.code === '0000') {
                  this.$message({
                    message: '审核通过',
                    type: 'success'
                  })
                }
                this.search()
              }
            })
          })
        }
      }
    },
    // 审核驳回
    rejectAll () {
      let pkSeqNo = []
      for (let i of this.checkedData) {
        pkSeqNo.push(i.pkSeqNo)
        if (i.status !== 0) {
          this.$message({
            message: '只有待审核状态才能进行审核操作',
            type: 'warning'
          })
          return
        } else {
          this.$confirm('是否确认审核驳回所选全部合同？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            type: 'warning'
          }).then(() => {
            let data = {
              'pkSeqNos': pkSeqNo,
              'verifyMsg': ''
            }
            this.$store.dispatch('ajax', {
              url: 'API@/saas-finance-expense/contract/reject',
              data: data,
              router: this.$router,
              isLoad: false,
              success: (res) => {
                if (res.code === '0000') {
                  this.$message({
                    message: '审核驳回',
                    type: 'success'
                  })
                }
                this.search()
              }
            })
          })
        }
      }
    },
    // 详情
    gotoDetail (data) {
      if (this.checkedData.length === 0) {
        this.$message({
          message: '选择一条数据',
          type: 'error'
        })
        return false
      }
      if (this.checkedData.length > 1) {
        this.$message({
          message: '只能选择一条要查看的数据',
          type: 'error'
        })
        return false
      }
      this.$router.push({
        name: 'contract-detail',
        params: {
          pkSeqNo: this.checkedData[0].pkSeqNo
        }
      })
    },
    // 格式化状态
    formatStatus (val) {
      let val2 = val + ''
      let value = ''
      for (let i = 0; i < this.statusList.length; i++) {
        if (this.statusList[i].value === val2) {
          value = this.statusList[i].label
          break
        }
      }
      return value
    }
  }
}
</script>
<style scoped lang="less">
.query-condition {
    background-color: #fff;
  }
.query-table {
  background-color: #fff;
  padding: 12px 18px;
  margin-top: 20px;
}
.mg-b-12{
  margin-bottom: 12px;
}
.sys-main .list-btns{
  margin: 0 10px 0 0;
}
</style>
