<template>
  <section class='sys-main'>
    <!-- 查询条件 -->
    <div class="query-header">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input size="mini" v-model="CIQCodeForm.keywords" placeholder="商品编码/商品名称" maxlength="50" clearable @keyup.enter.native="search"></el-input>
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
      <el-table class='sys-table-table' :data="CIQCodeList" border highlight-current-row size="mini">
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
            <div class='sys-td-l'>{{scope.row.hsGName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="CIQ信息" min-width="130">
          <template slot-scope="scope">
            <div class='sys-td-c'><a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click="toDetail(scope.row.codeTs)"><i class='dec-i'></i></a></div>
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
    <!-- 注释弹窗 -->
    <el-dialog title="CIQ信息" :close-on-click-modal="false" :append-to-body="true" :visible.sync="CIQVisable" width="35%">
      <el-row class="param-scroll">
        <el-row class="ciq-border-panel">
          <el-row>
            <div class="ciq-row">
              <div class="ciq-left ciq-borderR">HS商品编码</div>
              <div class="ciq-right">{{detailData.codeTs}}</div>
            </div>
          </el-row>
          <el-row>
            <div class="ciq-row">
              <div class="ciq-left ciq-borderR">HS商品名称</div>
              <div class="ciq-right">{{detailData.hsGName}}</div>
            </div>
          </el-row>
          <el-row>
            <div class="ciq-row ciq-tab">
              <div class="ciq-left ciq-borderR">CIQ附加码</div>
              <div class="ciq-right txt-right">CIQ名称</div>
            </div>
          </el-row>
          <el-row v-for="(item,index) in detailData.ciqInfVO" :key="index+'1'">
            <div class="ciq-row">
              <div class="ciq-left ciq-borderR">{{item.ciqCo}}</div>
              <div class="ciq-right txt-right">{{item.gNameNote}}</div>
            </div>
          </el-row>
        </el-row>
      </el-row>
    </el-dialog>
    <!-- 注释弹窗 end -->
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  name: 'CIQCode',
  data () {
    return {
      CIQCodeForm: {
        keywords: ''
      },
      CIQCodeList: [],
      pages: {},
      CIQVisable: false,
      detailData: {}
    }
  },
  created () {
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
        url: 'API@/saas-dictionary/decParam/getCiqcodeList',
        data: {...this.CIQCodeForm, page: pagination},
        isPageList: true,
        router: this.$router,
        success: (res) => {
          this.CIQCodeList = util.isEmpty(res.result) ? [] : res.result
          this.paginationInit = res.page
          this.pages = {
            pageIndex: res.page.pageIndex,
            pageSize: res.page.pageSize
          }
        }
      })
    },
    // ciq信息
    toDetail (code) {
      this.detailData = {}
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/decParam/getCiqCodeDetail',
        data: {code: code},
        router: this.$router,
        success: (res) => {
          this.detailData = util.isEmpty(res.result) ? {} : res.result
          this.CIQVisable = true
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
.param-scroll{
  max-height: 400px;
  overflow: auto;
}
.ciq-border-panel{
  border: 1px solid #b7b7b7;
  border-bottom: none;
  .el-row{
    border-bottom: 1px solid #B7B7B7;
  }
  .ciq-row{
    display: table;
    width: 100%;
    >div{
      display: table-cell;
    }
    .ciq-left{
      width: 134px;
      padding: 8px;
      text-align: center;
    }
    .ciq-right{
      padding: 8px;
      word-break: break-all;
    }
    .ciq-borderR{
      border-right: 1px solid #B7B7B7;
    }
  }
  .ciq-tab{
    background-color: #f5f5f5;
  }
  .txt-right{
    text-align: center;
  }
}
</style>
