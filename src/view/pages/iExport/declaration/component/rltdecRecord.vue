<template>
  <section>
    <div>
      <el-table class='sys-table-table dec-table'
        ref='rltDecRcordTable'
       :data="rltDecRcordList"
       :height="200"
       border highlight-current-row size="mini">
        <el-table-column align='center' label="序号" min-width="50">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{(page.pageIndex-1)*page.pageSize+(scope.$index+1)}}</div>
          </template>
        </el-table-column>
        <el-table-column align='center' label="系统编号" prop="decPid" min-width="150"></el-table-column>
        <el-table-column align='center' label="接单编号" prop="bossId" min-width="150"></el-table-column>
        <el-table-column align='center' label="统一编号" prop="cusCiqNo" min-width="150"></el-table-column>
        <el-table-column align='center' label="海关编号" prop="entryId" min-width="150"></el-table-column>
        <el-table-column align='center' label="操作" min-width="75" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click="gotoDetail(scope.row)"><i class='dec-i'></i></a>
          </template>
        </el-table-column>
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
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import decUtil from '../decPage/common/decUtil'
export default {
  props: {
    selectedRow: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  name: 'rltdec-record',
  data () {
    return {
      rltDecRcordList: [],
      queryData: {
        iEFlag: '',
        tradeName: '',
        ownerName: '',
        gName: '',
        codeTs: '',
        ciqCode: '',
        gModel: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.queryData.iEFlag = this.selectedRow.iEFlag
      this.queryData.tradeName = this.selectedRow.tradeName
      this.queryData.ownerName = this.selectedRow.ownerName
      this.queryData.gName = this.selectedRow.gName
      this.queryData.codeTs = this.selectedRow.codeTs
      this.queryData.ciqCode = this.selectedRow.ciqCode
      this.queryData.gModel = this.selectedRow.gModel
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
      this.queryData.page = this.page
      this.$post({
        url: 'API@/dec-common/dec/decListHis/getRelatedDecs',
        data: this.queryData,
        success: (res) => {
          this.rltDecRcordList = res.result
          this.page = res.page
        }
      })
    },
    // 报关单详情
    gotoDetail (row) {
      let funFlag = row.declTrnrel === '2' ? 'recordList' : 'declaration'
      let flag = this.selectedRow.iEFlag === 'I' ? 'import' : 'export'
      decUtil.gotoDecPage(funFlag, flag, 'look', row.decPid.toString(), 'dec', {}, this)
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
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
</style>
