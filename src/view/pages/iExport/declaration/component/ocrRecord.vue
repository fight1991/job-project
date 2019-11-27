<template>
  <!-- ocr上传的组件 -->
  <section>
    <div>
      <el-table class='sys-table-table dec-table'
        ref = 'ocRecordTable'
       :data="ocRecordList"
       :height="200"
       border highlight-current-row size="mini">
        <el-table-column align='center' label="识别时间" prop="ocrTime" min-width="130"></el-table-column>
        <el-table-column align='center' label="识别序号" prop="ocrId" min-width="100"></el-table-column>
        <el-table-column align='center' label="系统编号" prop="sysCode" min-width="100">
          <template slot-scope="scope">
            <a href="javascript:void(0)" style='color: #409eff;' @click="lookdecInfo(scope.row)">{{scope.row.sysCode}}</a>
          </template>
        </el-table-column>
        <el-table-column align='left' label="文件名称" prop="fileName" min-width="120"></el-table-column>
        <el-table-column align='left' label="识别状态" prop="statusValue" min-width="120"></el-table-column>
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
      <!--分页-->
      <div>
        <span style='color:red'>tips:只显示最近10天内的记录</span>
      </div>
    </div>
  </section>
</template>
<script>
// import util from '@/common/util'
export default {
  name: 'ocr-record',
  data () {
    return {
      ocRecordList: [],
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
    pageList (param) {
      this.$post({
        url: 'API@/dec-common/dec/orc/queryDecOcrRecord',
        data: {page: this.page},
        success: (res) => {
          this.ocRecordList = res.result
          this.total = res.page.total
        }
      })
    },
    lookdecInfo (row) {
      this.$post({ // 获取报关单状态
        url: 'API@/dec-common/dec/common/getDecExamStatus',
        data: {seqNo: row.sysCode},
        success: (res) => {
          if (!res.result) {
            this.messageTips('该数据已被删除，不可查看', 'error')
          } else {
            let pageType
            if (row.declTrnrel === '0') {
              pageType = 'declaration'
            } else if (row.declTrnrel === '2') {
              pageType = 'recordList'
            } else {
              pageType = 'declaration'
            }
            let status = res.result.status
            let isExamine = res.result.isExamine
            if (['002', '005', '2', '4', '5', '7', '8', '9', '10', '11'].includes(status) || ['3', 'R', '6'].includes(isExamine)) {
              this.gotoDecPage(pageType, row.iEFlag === 'I' ? 'import' : 'export', 'look', row.sysCode.toString())
            } else {
              this.gotoDecPage(pageType, row.iEFlag === 'I' ? 'import' : 'export', 'edit', row.sysCode.toString())
            }
          }
        }
      })
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 报关单   recordList 备案清单 decTemplate 初始值模板
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoDecPage (funFlag, flag, operationType, pid = 'new') {
      let routeName
      let tabName
      if (funFlag === 'declaration') {
        if (flag === 'import') {
          tabName = '进口报关单'
          if (operationType === 'look') {
            routeName = 'importDecLook'
          } else if (operationType === 'edit') {
            routeName = 'importDecEdit'
          }
        } else if (flag === 'export') {
          tabName = '出口报关单'
          if (operationType === 'look') {
            routeName = 'exportDecLook'
          } else if (operationType === 'edit') {
            routeName = 'exportDecEdit'
          }
        }
      }
      if (funFlag === 'recordList') {
        if (flag === 'import') {
          tabName = '进境备案清单'
          if (operationType === 'look') {
            routeName = 'importRecordLook'
          } else if (operationType === 'edit') {
            routeName = 'importRecordEdit'
          }
        } else if (flag === 'export') {
          tabName = '出境备案清单'
          if (operationType === 'look') {
            routeName = 'exportRecordLook'
          } else if (operationType === 'edit') {
            routeName = 'exportRecordEdit'
          }
        }
      }
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + operationType + pid
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
