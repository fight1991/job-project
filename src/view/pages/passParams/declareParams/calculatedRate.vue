<template>
  <section class="sys-main">
    <!-- 查询条件 -->
    <div class="query-header">
      <el-row :gutter="20">
        <el-col :span="8">
          <span class="input-label">适用月份</span>
          <el-date-picker
            style="width:calc(100% - 80px);"
            size="mini"
            v-model="queryForm.date"
            type="month"
            placeholder="请选择适用月份"
            format="yyyy-MM"
            value-format="yyyyMM"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <span class="input-label">币制</span>
          <el-select v-model="queryForm.curr" placeholder="请选择币制" size="mini" filterable clearable style="width:calc(100% - 52px);">
            <el-option
              v-for="item in paramsOptions['SAAS_CURR']"
              :key="item.codeField"
              :label="item.codeField + ' ' + item.nameField"
              :value="item.codeField">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 查询条件 end -->
    <!-- 主显示框 -->
    <div class="query-body">
      <el-table class="sys-table-table" :data="calculatedRateList" border highlight-current-row size="mini">
        <el-table-column label="适用月份" min-width="150">
          <template slot-scope="scope">
            <div class="sys-td-c">{{scope.row.date}}</div>
          </template>
        </el-table-column>
        <el-table-column label="币制" min-width="150">
          <template slot-scope="scope">
            <div class="sys-td-c">{{scope.row.curr}}</div>
          </template>
        </el-table-column>
        <el-table-column label="汇率" min-width="150">
          <template slot-scope="scope">
            <div class="sys-td-c">{{scope.row.rate}}</div>
          </template>
        </el-table-column>
        <el-table-column label="发布日期" min-width="150">
          <template slot-scope="scope">
            <div class="sys-td-c">{{scope.row.noticeDate}}</div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
          <page-box :pagination="paginationInit" @change="pageList"></page-box>
        </el-col>
      </el-row>
      <!-- 分页 end -->
    </div>
    <!-- 主显示框 end -->
  </section>
</template>
<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  name: 'calculatedRate',
  data () {
    return {
      queryForm: {
        date: '',
        curr: ''
      },
      calculatedRateList: [],
      pages: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      paramsOptions: {
        'SAAS_CURR': [] // 币制
      },
      tableNameList: {
        tableNames: [
          'SAAS_CURR' // 币制
        ]
      }
    }
  },
  created () {
    this.getCommonParam()
    this.paginationInit = this.$store.state.pagination
    this.search()
  },
  mounted () {

  },
  methods: {
    // 判断缓存中是否有数据
    getCommonParam () {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map)
      } else {
        this.paramsOptions['SAAS_CURR'] = util.simpleClone(JSON.parse(window.localStorage.getItem('SAAS_CURR')))
      }
    },
    // 获取公共字典list
    getCommonParams (datas) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
          this.paramsOptions['SAAS_CURR'] = util.simpleClone(JSON.parse(window.localStorage.getItem('SAAS_CURR')))
        }
      })
    },
    // 查询
    search () {
      this.pageList(this.$store.state.pagination)
    },
    // 获取表格
    pageList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/decParam/getCalculatedRate',
        data: {...this.queryForm, page: pagination},
        isPageList: true,
        router: this.$router,
        success: (res) => {
          this.calculatedRateList = util.isEmpty(res.result) ? [] : res.result
          this.paginationInit = res.page
          this.pages = {
            pageIndex: res.page.pageIndex,
            pageSize: res.page.pageSize
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.input-label{
  margin-right: 20px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
</style>
