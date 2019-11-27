<template>
<!-- 表体——智能归类组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="识别记录"
      :visible.sync="orcRecordVisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-loading="$store.state.loading"
      @closed ="closeOrcRecord()"
      v-dialogDrag
      width="900px">
      <el-table
        ref="recordTable"
        :data="descernRecords"
        highlight-current-row border size='mini'
        height="200"
        max-height="300">
        <el-table-column min-width="200" label="识别时间"  align="center" property="ocrTime">
        </el-table-column>
        <el-table-column  property="docType" label="文件类型" min-width="100" ></el-table-column>
        <el-table-column  property="fileName" label="文件名称" min-width="200">
        </el-table-column>
        <el-table-column  property="statusValue" label="识别状态" min-width="100">
        </el-table-column>
         <el-table-column label="操作" min-width="100">
           <template slot-scope="scope">
             <el-button size="mini" v-if="scope.row.status === '1'"  @click="backOrcdata(scope.row.taskId,scope.row.docType)" style='border:unset;background-color:unset;padding:7px 0px' title='数据回填' class="list-btns list-icon-syncH"><i></i></el-button>
             <el-button size="mini" v-if="scope.row.status === '1'" @click="showResult(scope.row.taskId,scope.row.docType,scope.row.docUrl)" style='border:unset;background-color:unset;padding:7px 0px' title='识别结果' class="list-btns list-icon-lookH"><i></i></el-button>
           </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list' style='border:0'>
        <el-col :span="24" align="right">
           <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
      </el-dialog>
      <dexcern-res :descernResultVisable.sync="descernResultVisable" @close:descernResultClose="descernResultClose" @getTradeSelects = "getselect" :total='total' :taskId='taskId' v-if="descernResultVisable"></dexcern-res>
    <!-- 智能归类 -->
  </section>
</template>
<script>
import util from '@/common/util.js'
// import decUtil from '../../common/decUtil'
const dexcernRes = () => import(/* webpackChunkName: "dec-page-main" */'./descernRes')
export default {
  name: 'classify-Goods',
  props: {
    orcRecordVisable: {
      type: Boolean,
      default: false
    },
    total: {
      type: Object,
      default: null
    }
  },
  components: {
    dexcernRes
  },
  data () {
    return {
      fileList: [],
      taskId: '',
      taxDetailVisible: false,
      descernRecords: [],
      descernResultVisable: false,
      codeTsFilters: [],
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      taxForm: {}
    }
  },
  created () {
    this.getOrcrecord()
  },
  methods: {
    filterHandler (value) {
      this.queryHs = this.hsCode[0]
      this.getOrcrecord()
    },
    getselect () {
      this.$emit('getTradeSelects')
    },
    getOrcrecord () {
      this.$post({
        url: 'API@/dec-common/dec/orc/queryDecOcrRecord',
        data: {page: this.page, source: 'single', decPid: this.total.decHeadVO.decPid},
        success: (res) => {
          this.descernRecords = res.result
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    showResult (id, type, url) {
      if (type === '报关单') {
        this.$post({
          url: 'API@/dec-common/dec/orc/getOcrBillList',
          data: {page: this.page, taskId: id},
          success: (res) => {
            util.fileView(res.result[0].docUrl)
          },
          other: (res) => {
            this.messageTips(res.message, 'error')
          }
        })
      } else {
        this.taskId = id
        this.descernResultVisable = true
      }
    },
    backOrcdata (id, type) {
      this.$post({
        url: 'API@/dec-common/dec/orc/getOcrBillList',
        data: {page: this.page, taskId: id},
        success: (res) => {
          if (type === '报关单') {
            for (let x in res.result[0].decVO.decListVO) {
              res.result[0].decVO.decListVO[x].decPid = this.total.decListVO.decPid
              if (!this.total.decListVO[x]) {
                this.total.decListVO.push(res.result[0].decVO.decListVO[x])
              } else {
                for (let y in res.result[0].decVO.decListVO[x]) {
                  this.total.decListVO[x][y] = res.result[0].decVO.decListVO[x][y]
                }
              }
            }
            res.result[0].decVO.decHeadVO.status = this.total.decHeadVO.status
            res.result[0].decVO.decHeadVO.decPid = this.total.decHeadVO.decPid
            res.result[0].decVO.decHeadVO.isExamine = this.total.decHeadVO.isExamine
            res.result[0].decVO.decHeadVO.statusValue = this.total.decHeadVO.statusValue
            res.result[0].decVO.decHeadVO.isExamineValue = this.total.decHeadVO.isExamineValue
            res.result[0].decVO.decHeadVO.customMaster = this.total.decHeadVO.customMaster
            for (let x in res.result[0].decVO.decHeadVO) {
              this.total.decHeadVO[x] = res.result[0].decVO.decHeadVO[x]
            }
          } else {
            if (this.total.decListVO.length > 0) {
              this.total.decListVO[0].gQty = res.result[0].gQty
              this.total.decListVO[0].declTotal = res.result[0].declTotal
              this.total.decListVO[0].tradeCurr = res.result[0].tradeCurr
              this.total.decListVO[0].tradeCurrValue = res.result[0].tradeCurrValue
            }
            this.total.decHeadVO.trafMode = res.result[0].trafMode || this.total.decHeadVO.trafMode
            this.total.decHeadVO.billNo = res.result[0].billNo || this.total.decHeadVO.billNo
            if (this.total.decHeadVO.iEFlag === 'I') {
              this.total.decHeadVO.overseasConsignorEname = res.result[0].overseasConsignorEname || this.total.decHeadVO.overseasConsigneeEname
            } else {
              this.total.decHeadVO.overseasConsigneeEname = res.result[0].overseasConsigneeEname || this.total.decHeadVO.overseasConsigneeEname
            }
            this.total.decHeadVO.packNo = res.result[0].packNo || this.total.decHeadVO.grossWt
            this.total.decHeadVO.grossWt = res.result[0].grossWt || this.total.decHeadVO.grossWt
            this.total.decHeadVO.netWt = res.result[0].netWt || this.total.decHeadVO.netWt
            this.orcRecordVisable = false
          }
          this.getselect()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    closeOrcRecord () {
      this.$emit('close:orcRecordClose')
      this.orcRecordVisable = false
    },
    descernResultClose () {
      this.descernResultVisable = false
    },
    handleCurrentChange (page) {
      this.page.pageIndex = page
      this.getOrcrecord()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getOrcrecord()
    },
    useData (row) {
      this.$emit('close:classifyGoods', {
        codeTs: row.hsCode
      })
    }
  }
}
</script>
<style lang="less" scoped>
.dec-i{
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  background-color: #fff
}
.border-0 {
  border: 0;
  margin-right: 5px;
}
.el-table__column-filter-trigger i {
    color: blue;
    font-size: 14px;
}
.el-table th>.cell.highlight {
    color: #fff;
}
</style>
