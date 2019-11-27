<template>
  <section class="sys-main">
    <!-- 查询条件 -->
    <div class="query-header">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input size="mini" v-model="queryForm.name" placeholder="国家代码/英文简称/中文名称" maxlength="50" clearable @keyup.enter.native="search"></el-input>
        </el-col>
        <el-col :span="18">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 查询条件 end -->
    <!-- 主显示框 -->
    <div class='query-body'>
      <el-table class='sys-table-table' :data="favoredCountryList" border highlight-current-row size="mini">
        <el-table-column label="国家代码" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.countryCodeCn}}</div>
          </template>
        </el-table-column>
        <el-table-column label="英文简称" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.countryCodeEn}}</div>
          </template>
        </el-table-column>
        <el-table-column label="中文名称" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.countryNameCn}}</div>
          </template>
        </el-table-column>
        <el-table-column label="英文名称" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.countryNameEn}}</div>
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
export default {
  name: 'favoredCountry',
  data () {
    return {
      queryForm: {
        name: ''
      },
      favoredCountryList: [],
      pages: {}
    }
  },
  created () {
    if (!util.isEmpty(this.$route.query.name)) {
      this.queryForm.name = this.$route.query.name
    }
    this.paginationInit = this.$store.state.pagination
    this.search()
  },
  mounted () {

  },
  methods: {
    // 查询
    search () {
      this.pageList(this.$store.state.pagination)
    },
    // 获取表格
    pageList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/decParam/getFavoredCountry',
        data: {...this.queryForm, page: pagination},
        isPageList: true,
        router: this.$router,
        success: (res) => {
          this.favoredCountryList = util.isEmpty(res.result) ? [] : res.result
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
</style>
