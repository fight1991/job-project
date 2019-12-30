<template>
  <!-- ocr上传的组件 -->
  <section>
    <div class="dec-query-table">
      <el-table class='sys-table-table dec-table'
        ref='syncDecRcordTable'
       :data="syncDecRcordList"
       :height="200"
       border highlight-current-row size="mini">
        <el-table-column v-if='initParams=="dec"' align='center' label="最近操作时间" prop="operateDate" min-width="130"></el-table-column>
        <el-table-column v-else align='center' label="申报时间" prop="operateDate" min-width="150">
          <template slot-scope="scope">
            <span>{{scope.row.declBeginDate + '-' + scope.row.declEndDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' label="同步数量" prop="totalNum" min-width="100">
          <template slot-scope="scope">
            <span v-if='scope.row.totalNum == -1'>计算中...</span>
            <span v-else>{{scope.row.downloadNum + '/' + scope.row.totalNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="提交时间" prop="createTime" min-width="130"></el-table-column>
        <el-table-column align='center' label="完成时间" prop="completeTime" min-width="130"></el-table-column>
        <el-table-column align='center' label="状态" prop="status" min-width="120"></el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
// import util from '@/common/util'
export default {
  name: 'syncdec-record',
  props: {
    initParams: {
      type: String,
      default: 'dec'
    }
  },
  data () {
    return {
      syncDecRcordList: [],
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created () {
    this.initData()
  },
  mounted () {
  },
  methods: {
    initData () {
      this.pageList()
    },
    handleCurrentChange (page) {
      this.page.pageIndex = page
      this.pageList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.pageList()
    },
    // 查询数据
    pageList () {
      let param = {
        page: this.page
      }
      let url = 'API@/saas-sync/dec/sync/getDecSyncDetail'
      if (this.initParams === 'goods') {
        url = 'API@/dec-common/dec/decListHis/getListSyncDetail'
        param['modelName'] = '0'
      } else if (this.initParams === 'bond') {
        url = 'API@/dec-common/dec/decListHis/getListSyncDetail'
        param['modelName'] = '1'
      }
      this.$post({
        url: url,
        data: param,
        success: (res) => {
          this.syncDecRcordList = res.result
          this.total = res.page.total
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
  .text-center {
    text-align: center;
  }
  .el-upload__tip{
    color: red;
  }
</style>
