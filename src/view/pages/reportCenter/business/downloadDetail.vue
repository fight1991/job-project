<template>
  <section>
    <el-row class="downTable">
      <el-table class='sys-table-table' :data="loadList" border highlight-current-row size="mini">
        <el-table-column label="序号" width="80" align="left">
          <template slot-scope="scope">
            <div>{{(pages.pageIndex-1)*pages.pageSize+(scope.$index+1)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="150" align="center" prop="createTime"></el-table-column>
        <el-table-column label="操作人" min-width="120" align="center" prop="createUserName"></el-table-column>
        <el-table-column label="内容数量" min-width="120" align="right" prop="dataCount"></el-table-column>
        <el-table-column label="操作" width="90" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="table-icon table-disabled-download" :class="{'table-disabled-downloadH': scope.row.docUrl}" :disabled="!scope.row.docUrl" :title="scope.row.docUrl ? '下载' : '文件生成中，请稍候...'" @click="downLoad(scope.row.docUrl)"><i></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页-->
    <el-row class='sys-page-list'>
      <el-col :span="24" align="right">
        <!-- <page-box @change="getTableDataA()" key="download"></page-box> -->
        <el-pagination
          v-if='pagination.total != 0'
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          :current-page="pagination.currentPage"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 分页 end -->
    <el-row><div class="download-tip">tips: 只显示最近7天内的记录</div></el-row>
  </section>
</template>
<script>
import util from '../../../../common/util'
import rightsUtil from '../../../../common/rightsUtil'
export default {
  data () {
    return {
      loadList: [],
      pages: {},
      // 分页的数据
      pagination: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页数据条数
        total: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 200]
      }
    }
  },
  props: ['iEFlag'],
  created () {
    this.getTableDataA()
  },
  methods: {
    // 获取表格数据
    getTableDataA () {
      let page = {
        pageSize: this.pagination.pageSize,
        pageIndex: this.pagination.currentPage
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/exportExcelList',
        data: {iEFlag: this.iEFlag, page: page},
        // isPageList: true,
        router: this.$router,
        success: (res) => {
          this.loadList = util.isEmpty(res.result) ? [] : res.result
          this.pages = {
            pageIndex: res.page.pageIndex,
            pageSize: res.page.pageSize
          }
          this.pagination.pageSize = res.page.pageSize
          this.pagination.total = res.page.total
          this.pagination.currentPage = res.page.pageIndex
        }
      })
    },
    // 下载
    downLoad (url) {
      rightsUtil.checkRights(() => {
        window.open(url, '_blank')
      })
    },
    // 分页:当前页变化
    pageChange (value) {
      this.pagination.currentPage = value
    },
    // 分页:每页显示的数据条数变化
    pageSizeChange (value) {
      this.pagination.pageSize = value
    },
    // 分页:每页显示的数据总数变化
    pageTotalChange (value) {
      this.pagination.total = value
    },
    currentChange (page) {
      this.pageChange(page)
      this.getTableDataA()
    },
    sizeChange (size) {
      this.pageSizeChange(size)
      this.pageChange(1)
      this.getTableDataA()
    }
  }
}
</script>
<style lang="less" scoped>
.downTable {
  max-height: 397px;
  overflow: auto;
}
.download-tip{
  margin-top: 10px;
  color: #ff4c4c;
}
</style>
