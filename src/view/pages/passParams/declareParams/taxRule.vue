<template>
  <section class='sys-main'>
    <!-- 查询条件 -->
    <div class="query-header">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input size="mini" v-model="taxRuleForm.keywords" placeholder="商品编码/商品名称" maxlength="50" clearable @keyup.enter.native="search"></el-input>
        </el-col>
        <el-col :span="10">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <!-- <el-button size="mini">重置</el-button> -->
        </el-col>
      </el-row>
    </div>
    <!-- 查询条件 end -->
    <!-- 主显示框 -->
    <div class='query-body'>
      <el-table class='sys-table-table' :data="taxRuleList" border highlight-current-row size="mini">
        <el-table-column label="序号" width="130">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{(pages.pageIndex-1)*pages.pageSize+(scope.$index+1)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品编码" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.codeTs}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.gName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="申报要素、退税" min-width="100">
          <template slot-scope="scope">
            <div class='sys-td-c'><a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click="toDetail(scope.row.pkSeq)"><i class='dec-i'></i></a></div>
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
  name: 'taxRule',
  data () {
    return {
      taxRuleForm: {
        keywords: ''
      },
      taxRuleList: [],
      pages: {}
    }
  },
  created () {
    if (!util.isEmpty(this.$route.query.keywords)) {
      this.taxRuleForm.keywords = this.$route.query.keywords
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
        url: 'API@/saas-dictionary/decParam/getComplexList',
        data: {...this.taxRuleForm, page: pagination},
        isPageList: true,
        router: this.$router,
        success: (res) => {
          this.taxRuleList = util.isEmpty(res.result) ? [] : res.result
          this.paginationInit = res.page
          this.pages = {
            pageIndex: res.page.pageIndex,
            pageSize: res.page.pageSize
          }
        }
      })
    },
    // 跳转详情
    toDetail (codeTs) {
      this.$router.push({
        path: '/passParams/taxRule/detail',
        query: {
          'id': codeTs
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.param-td-c{
  text-align: center;
}
.list-icon-look{
  i{
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 6px;
    vertical-align: middle;
    margin-top: -2px;
    background: url('../../../../assets/img/icon/icon-look.png') no-repeat;
  }
  &:hover i,&:focus i{
    background: url('../../../../assets/img/icon/icon-lookH.png') no-repeat;
  }
}
</style>
