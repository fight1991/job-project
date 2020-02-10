<template>
  <section class='sys-main'>
    <!-- 头部 -->
    <el-row class='sys-header'>
    <!-- 查询条件 -->
         <!-- 按钮组 -->
        <el-row class='mg-b-15'>
          <el-col :span="18">
            <!-- <el-button v-permissions="'SAASOM0501010000'" size="mini" type="primary" @click="creatContract('add','new')">新建合同</el-button> -->
            <el-button size="mini" type="primary" @click="creatContract('add','new', '新建')">新建合同</el-button>
          </el-col>
        </el-row>
        <!-- 按钮组 end-->
    </el-row>
    <el-row class='query-condition data-center'>
      <el-form :model="QueryForm" size="mini" label-position="right" :label-width="labelFormWidth.six">
        <!-- 查询条件-->
        <el-row :gutter="30">
          <el-col :lg="6" :md="12">
            <el-form-item  label="合同号" >
              <el-input size="mini" clearable v-model="QueryForm.contractNo" placeholder="请输入合同号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item  label="状态" >
              <el-select size="mini" clearable v-model="QueryForm.statuss" placeholder="状态"  style="width:100%;">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12">
            <el-form-item  label="企业" >
              <el-select size="mini"
              filterable remote clearable
              :remote-method="queryCompanyList"
              :loading=' loading ' reserve-keyword loading-text="加载中"
              v-model="QueryForm.entrustCompanyId  " placeholder='企业'  style="width:100%;">
                <el-option
                  v-for="item in companyList"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12">
            <el-form-item label="合同有效期" >
              <el-date-picker size="mini"  v-model="dates"
                type="daterange"
                :editable='false'
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
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
        </el-row>
        <el-row style="text-align:center;">
            <el-button size="mini" type="primary" @click="search()">查询</el-button>
            <el-button size="mini" @click="resetQueryform">重置</el-button>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </el-row>
    <!-- 头部 end-->
    <!-- 主显示框 -->
    <div class='query-table'>
      <!-- 列表 list -->
      <el-table class='sys-table-table' :data="resultList" border highlight-current-row height="530px">
        <el-table-column label="序号" type="index" width="50" align="center">
        </el-table-column>
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
        <el-table-column label="操作" fixed="right" min-width="150" v-if="permColumn[0]">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                <!-- <el-button v-permissions="'SAASOM0501040000'" type="text" @click="gotoDetail(scope.row,'view')" title="查看" class="table-icon list-icon-look"><i></i></!
                <el-button v-permissions="'SAASOM0501030000'" type="text" @click="creatContract('edit',scope.row.pkSeqNo)" title="续签" class="table-icon list-icon-mergeOrder"><i></i></el-button>
                <el-button v-if="scope.row.createUserId ===$store.state.userLoginInfo.userId" v-permissions="'SAASOM0501050000'" type="text" @click="creatContract('conedit',scope.row.pkSeqNo)" title="编辑" class="table-icon list-icon-edit"><i></i></el-button>
                <el-button v-if="scope.row.status=='1' && scope.row.createUserId == $store.state.userLoginInfo.userId" v-permissions="'SAASOM0501020000'" type="text" @click="deleteContract(scope.row)" title="删除" class="table-icon list-icon-delete"><i></i></el-button> -->
                <el-button type="text" @click="gotoDetail(scope.row,'view')" title="查看" class="table-icon list-icon-look"><i></i></el-button>
                <el-button v-if="scope.row.createUserId == $store.state.userLoginInfo.userId && (scope.row.status == '1' || scope.row.status == '3')" type="text" @click="creatContract('edit',scope.row.pkSeqNo, '续签')" title="续签" class="table-icon list-icon-declare"><i></i></el-button>
                 <el-button v-if="scope.row.createUserId == $store.state.userLoginInfo.userId && (scope.row.status == '1' || scope.row.status == '2')" type="text" @click="creatContract('conedit',scope.row.pkSeqNo, '编辑')" title="编辑" class="table-icon list-icon-edit"><i></i></el-button>
                <el-button v-if="scope.row.createUserId == $store.state.userLoginInfo.userId && (scope.row.status == '1' || scope.row.status == '2')" type="text" @click="deleteContract(scope.row)" title="删除" class="table-icon list-icon-delete"><i></i></el-button>
              </div>
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
      menuCodes: [['SAASOM0501040000', 'SAASOM0501030000', 'SAASOM0501050000', 'SAASOM0501020000']], // 权限编码
      permColumn: [true], // 表格操作栏列显示
      resultList: [], // 列表数据
      QueryForm: {}, // 查询条件
      dates: ['', ''], // 日期
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
      companyList: [] // 公司数据
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
      if (to.path === '/contract/list') {
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
      this.QueryForm.contractBeginDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
      this.QueryForm.contractEndDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      this.QueryForm.status = parseInt(this.QueryForm.statuss)
      this.paginationInit = pagination
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
    // 删除
    deleteContract (row) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/delete',
        data: {pkSeqNo: row.pkSeqNo},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.search()
        }
      })
    },
    // 创建合同
    creatContract (type, value, title) {
      this.$router.push({
        name: 'contract-add',
        params: {
          flag: type,
          pkSeqNo: value,
          setTitle: title + '合同-' + value,
          setId: 'contract-add' + type + value
        }
      })
    },
    // 重置
    resetQueryform () {
      this.QueryForm = {}
      this.dates = ['', '']
      this.search()
    },
    // 详情
    gotoDetail (data) {
      this.$router.push({
        name: 'contract-detail',
        params: {
          pkSeqNo: data.pkSeqNo
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
.el-date-editor{
  width :100%;
}
</style>
