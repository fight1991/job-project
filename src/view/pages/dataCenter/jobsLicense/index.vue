<template>
  <section class='sys-main'>
     <!-- 头部 -->
      <el-row class = "query-condition data-center">
        <el-form :label-width="labelFormWidth.seven" :model="queryForm" size="mini" label-position="right">
      <!-- 查询条件 -->
          <el-row>
            <el-col :md="12" :lg="12">
              <el-form-item class="form-item-mg0" label="委托企业">
                <el-autocomplete
                  size='mini' style="width:100%"
                  :maxlength="20" clearable
                  v-model="queryForm.tradeName"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false">
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item :label-width="labelFormWidth.seven" label="创建日期" class="form-item-mg0">
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
            </el-row>
            <el-row>
            <el-col :md="12" :lg="6">
              <el-form-item class="form-item-mg0" label="报关单系统编号">
                <el-input v-model="queryForm.decPid" clearable :maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item class="form-item-mg0" label="接单编号">
                <el-input v-model="queryForm.bossId" clearable :maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item class="form-item-mg0" label="统一编号">
                <el-input v-model="queryForm.seqNo" clearable :maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item class="form-item-mg0" label="报关单号">
                <el-input v-model="queryForm.entryId" clearable :maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :lg="6">
                <el-form-item class="form-item-mg0" label="提单号">
                  <el-input v-model="queryForm.billNo" clearable :maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="6">
                <el-form-item label="系统状态" class="form-item-mg0">
                  <el-select v-model="queryForm.status" style="display: unset"  clearable>
                    <el-option
                      v-for="item in sysstatus"
                      :key="item.codeField"
                      :label="item.nameField"
                      :value="item.codeField"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="text-align:center;" >
              <el-button size="mini" type="primary" @click="search()">查询</el-button>
              <el-button size="mini" @click="reset">重置</el-button>
            </el-row>
       <!-- 查询条件 end-->
        </el-form>
      </el-row>
      <!-- 头部 end-->
      <!-- 主显示框 -->
      <div class='query-table'>
        <!-- 列表 list -->
        <el-table class='sys-table-table' height="400px"
          border highlight-current-row size="mini"
          :data="resultList">
          <el-table-column label="委托企业" min-width="150">
            <template slot-scope="scope">
              <div class='sys-td-l'>
                {{scope.row.tradeName || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="报关单系统编号" min-width="80">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                {{scope.row.decPid || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="接单编号" min-width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                {{scope.row.bossId || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="统一编号" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                {{scope.row.seqNo || '-'}}
                </div>
            </template>
          </el-table-column>
          <el-table-column label="报关单号" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                {{scope.row.entryId || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="提单号" min-width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                {{scope.row.billNo || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="系统状态" min-width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                {{scope.row.statusValue || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" min-width="140">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                {{scope.row.createTime || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="上传单据数" min-width="60">
            <template slot-scope="scope">
              <div class='sys-td-r'>
                {{scope.row.edocCount+'' || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                <el-button type="text" class="table-icon list-icon-look" @click="toDetail(scope.row.decPid,scope.row.tradeCoScc)" title="查看"><i></i></el-button>
                <el-button type="text" class="table-icon list-icon-edit" @click="toEdit(scope.row.decPid,scope.row.tradeCoScc)" title="编辑"><i></i></el-button>
                <el-button type="text" class="table-icon list-icon-upload" @click="upload(scope.row.decPid,scope.row.tradeCoScc)" title="上传文件"><i></i></el-button>
                <el-button type="text" class="table-icon list-icon-download" v-if="scope.row.edocCount >0" @click="exportdec(scope.row.decPid)" title="下载文件"><i></i></el-button></div>
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
      <batch-upload :decPid = 'decPid' :openPath='openPath' :batchUploadVisabled.sync='batchUploadVisabled' :pageType="'license'"></batch-upload>
  </section>
</template>

<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
import batchUpload from '../../component/batchUpload'
export default {
  components: {
    batchUpload
  },
  data () {
    return {
      queryForm: {
        tradeName: '',
        updateTimeStart: '',
        updateTimeEnd: ''
      },
      sysstatus: [{nameField: '报关单预录入', codeField: '2'}, {nameField: '待审核', codeField: '3'}, {nameField: '待复核', codeField: 'R'}, {nameField: '审核通过', codeField: '6'}, {nameField: '审核驳回', codeField: '4'}],
      corpListOptions: [], // 委托企业
      dates: ['', ''],
      resultList: [],
      batchUploadVisabled: false,
      decPid: '',
      openPath: 'dataCenter'
    }
  },
  created () {
    this.reset()
    this.paginationInit = this.$store.state.pagination
    this.corpList()
    this.search()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path === '/dataCenter/jobsLicense') {
        this.corpList()
        this.search()
      }
    }
  },
  methods: {
    // 查询
    search () {
      this.queryList(this.$store.state.pagination)
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
      this.decPid = decPid
      this.batchUploadVisabled = true
      // this.$router.push({
      //   path: '/dataCenter/jobsLicense/importLicense',
      //   query: {
      //     ownerCodeScc: ownerCodeScc,
      //     decPid: decPid
      //   }
      // })
    },
    // 列表
    queryList (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
      } else {
        this.queryForm.startTime = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryForm.endTime = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/business/getDecInfos',
        data: {
          ...this.queryForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.resultList = util.isEmpty(res.result) ? [] : res.result
          this.paginationInit = res.page
        }
      })
    },
    // 导出
    exportdec (val) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/business/exportDocZip',
        data: {decPid: val},
        router: this.$router,
        success: (res) => {
          if (res.success === 'false') {
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
    // 获取公共字典list
    getCommonParams () {
      let par = ['SAAS_DATA_STATUS_CODE']
      let tableNames = commonParam.isRequire(par)
      if (tableNames.length > 0) {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-dictionary/dictionary/getParam',
          data: {
            'tableNames': tableNames
          },
          router: this.$router,
          success: (res) => {
            commonParam.saveParams(res.result)
            this.sysstatus = JSON.parse(window.localStorage.getItem('SAAS_DATA_STATUS_CODE'))
          }
        })
      } else {
        this.sysstatus = JSON.parse(window.localStorage.getItem('SAAS_DATA_STATUS_CODE'))
      }
    },
    // 重置
    reset () {
      this.dates = ['', '']
      this.queryForm = {
        tradeName: '',
        updateTimeStart: '',
        updateTimeEnd: ''
      }
      this.search()
    },
    // 委托企业
    corpList (val) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/dccommon/queryCorps',
        data: val,
        router: this.$router,
        success: (res) => {
          if (res.success) {
            let json = JSON.stringify(res.result)
            json = json.replace(/ownerName/g, 'value')
            this.corpListOptions = JSON.parse(json)
          }
        }
      })
    },
    // 输入2个字后搜索
    querySearch (queryString, cb) {
      if (this.queryForm.tradeName.length < 2) {
        return
      }
      let restaurants = this.corpListOptions
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        if (util.isEmpty(restaurant.value)) {
          return false
        } else {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      }
    },
    // 跳转到详情页面
    toChild (row) {
      this.$router.push({
        path: '/dataCenter/jobsLicense/jobDetailList',
        query: {
          ownerCodeScc: row.ownerCodeScc
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .query-condition {
    background-color: #fff;
  }
  .query-table {
    background-color: #fff;
    padding:12px 18px;
    margin-top: 20px;
  }
  .m-r-10{
    margin-right: 10px;
  }
  .span-right{
    float: right;
    margin-right: 2%;
    color: #0b93f3;
    margin-top: 6px;
  }
  .airvehicle-table-popper{
    min-width: auto;
    ul{
        li{
            line-height: 20px;
            .el-checkbox__label{
                font-size: 12px;
            }
        }
    }
  }
  .airvehicle-list-drop {
    float: right;
  }
  .layer-btn-primary {
    height: 32px;
    line-height: 32px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #4898d5;
    border-radius: 2px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    background-color: #2e8ded;
    color: #fff;
  }
   .layer-btn {
    height: 32px;
    line-height: 32px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    color: #333333;
  }
  .query-condition label{
    padding-right: 2px;
    text-align: right;
  }
  .sys-main .form-item-mg0.el-form-item--mini.el-form-item {
    margin-bottom: 18px;
  }
</style>
