<template>
  <section class='sys-main'>
     <!-- 头部 -->
    <el-row class='sys-header'>
      <!-- 返回按钮 -->
      <el-row>
        <el-col :span='18' :xs='24'>
          <span @click="back" class="sys-back-btn"><i class="back-btn"></i>返回</span>
        </el-col>
      </el-row>
      <!-- 返回按钮 end-->
      <el-row class = "query-table">
        <el-row>
          <el-col :span="8">
            委托企业：<span class="top-text">{{ownerName}}</span>
          </el-col>
          <el-col :span="8">
            累计业务票数：<span class="top-text">{{decCount + ''}}</span>
          </el-col>
          <el-col :span="8">
            累计上传单据：<span class="top-text">{{edocCount + ''}}</span>
          </el-col>
        </el-row>
      </el-row>
        <el-row class = "query-table">
          <el-form label-width="0px" :model="jobDetailForm" size="mini" label-position="right">
        <!-- 查询条件 -->
            <el-row :gutter="50" style="">
              <el-col :span="6" :xs="12">
                <el-form-item class="form-item-mg0">
                  <el-input size="mini" clearable v-model="jobDetailForm.keywords" placeholder="接单编号、系统编号、报关单号"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8" :xs="12">
                  <el-form-item :label-width="labelFormWidth.four" label="创建日期" class="form-item-mg0">
                  <el-date-picker size="mini"  style="width:100%;"
                    v-model="dates"
                    type="daterange"
                    :editable='false'
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="8">
                <el-form-item class="form-item-mg0" label="提单号" label-width="50px">
                  <el-input size="mini" clearable v-model="jobDetailForm.billNo"></el-input>
                </el-form-item>
                </el-col>
              <el-col :span="4" :xs="12">
                <el-button size="mini" type="primary" @click="search()">查询</el-button>
                <el-button size="mini" @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
          <!-- 查询条件 end-->
          </el-form>
        </el-row>
      </el-row>
    <!-- 头部 end-->
    <!-- 主显示框 -->
    <div class='query-table'>
      <!-- 列表 list -->
      <el-table class='sys-table-table' height="422px"
        border highlight-current-row size="mini"
        :data="resultJobList">
        <el-table-column label="报关单系统编号" min-width="120">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.decPid || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="接单编号" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.bossId || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="统一编号" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.seqNo || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="报关单号" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.entryId || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="提单号" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.billNo || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="业务状态" min-width="100">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.isExamineValue || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" min-width="100">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.createTime || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="上传单据数" min-width="80">
          <template slot-scope="scope">
            <div class='sys-td-r'>{{scope.row.count+'' || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>
              <el-button type="text" class="table-icon list-icon-look" @click="toDetail(scope.row.decPid,jobDetailForm.ownerCodeScc)" title="查看"><i></i></el-button>
              <el-button type="text" class="table-icon list-icon-edit" @click="toEdit(scope.row.decPid,jobDetailForm.ownerCodeScc)" title="编辑"><i></i></el-button>
              <el-button type="text" class="table-icon list-icon-import" @click="upload(scope.row.decPid,jobDetailForm.ownerCodeScc)" title="导入"><i></i></el-button>
              <el-button type="text" class="table-icon list-icon-export" v-if="scope.row.count >0" @click="exportdec(scope.row.decPid)" title="导出"><i></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
          <el-col :span="24" align="right">
              <page-box :pagination='paginationInit' @change="queryList"></page-box>
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
      jobDetailForm: {
        ownerCodeScc: '',
        keywords: '',
        billNo: '',
        updateTimeStart: '',
        updateTimeEnd: ''
      },
      dates: ['', ''],
      resultJobList: [], // 表格数据
      ownerName: '',
      decCount: '',
      edocCount: ''
    }
  },
  created () {
    this.reset()
    this.paginationInit = this.$store.state.pagination
    this.jobDetailForm.ownerCodeScc = this.$route.query.ownerCodeScc
    this.search()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('jobDetailList') === -1) {
        return
      }
      this.reset()
      this.paginationInit = this.$store.state.pagination
      this.jobDetailForm.ownerCodeScc = to.query.ownerCodeScc
      this.search()
    }
  },
  methods: {
    // 返回按钮
    back () {
      this.$router.push({
        name: 'jobsLicense'
      })
    },
    // 查询
    search () {
      this.queryList(this.$store.state.pagination)
    },
    // 重置查询条件
    resetQuery () {
      this.dates = ['', '']
      this.jobDetailForm = {
        ownerCodeScc: this.$route.query.ownerCodeScc,
        keywords: '',
        billNo: '',
        updateTimeStart: '',
        updateTimeEnd: ''
      }
      this.search()
    },
    // 列表
    queryList (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.jobDetailForm.updateTimeStart = ''
        this.jobDetailForm.updateTimeEnd = ''
      } else {
        this.jobDetailForm.updateTimeStart = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.jobDetailForm.updateTimeEnd = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/business/queryDecList',
        data: {
          ...this.jobDetailForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          if (!util.isEmpty(res.result)) {
            this.resultJobList = util.isEmpty(res.result.decs) ? [] : res.result.decs
            this.paginationInit = res.page
            this.ownerName = res.result.ownerName
            this.decCount = res.result.decCount
            this.edocCount = res.result.edocCount
          } else {
            this.resultJobList = []
          }
        }
      })
    },
    // 重置
    reset () {
      this.dates = ['', '']
      this.jobDetailForm = {
        ownerCodeScc: '',
        keywords: '',
        billNo: '',
        updateTimeStart: '',
        updateTimeEnd: ''
      }
      this.ownerName = ''
      this.decCount = ''
      this.edocCount = ''
    },
    // 导出
    exportdec (val) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/business/exportDocZip',
        data: {decPid: val},
        router: this.$router,
        success: (res) => {
          if (res.result === 'false') {
            this.$message({
              message: '没有可导出的数据',
              type: 'warning'
            })
          } else {
            window.open(res.result)
          }
        }
      })
    },
    // 跳转到详情页面
    toDetail (decPid, ownerCodeScc) {
      this.$router.push({
        path: '/dataCenter/jobsLicense/detailJobs',
        query: {
          decPid: decPid,
          ownerCodeScc: ownerCodeScc
        }
      })
    },
    // 跳转到编辑页面
    toEdit (decPid, ownerCodeScc) {
      this.$router.push({
        path: '/dataCenter/jobsLicense/editJobs',
        query: {
          decPid: decPid,
          ownerCodeScc: ownerCodeScc
        }
      })
    },
    // 导入
    upload (decPid, ownerCodeScc) {
      this.$router.push({
        path: '/dataCenter/jobsLicense/importLicense',
        query: {
          ownerCodeScc: ownerCodeScc,
          decPid: decPid
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
  .top-text{
    padding-left: 10px;
    color: @font-color-main;
    font-size: 14px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
    font-size: 14px;
    color: @font-color-main;
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
        background: url('../../../../assets/img/icon/back.png') no-repeat center center;
        background-size: 100%;
        vertical-align: middle;
    }
}
  .sys-fr{
    float: right;
  }
  .sys-table-detail-expand{
    padding:0 15px;
    .detail-infos{
        margin:0 20px;
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        .detail-info{
        padding: 5px 0;
        }
        .detail-info-title{
        background-color: #eef1f6;
        }
        .detail-img,.no-pic{
        display: inline-block;
        margin-right: 20px;
        height:100px;
        cursor: pointer;
        }
    }
    .detail-infos:last-child{
        border-bottom: 1px solid #dfe6ec;
    }
}
</style>
