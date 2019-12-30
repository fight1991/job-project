<template>
  <!-- 查看回执 组件 -->
  <section>
    <div class="query-table  dec-query-table">
      <el-row style="margin-bottom: 14px;">
        <el-button size="mini" class="list-btns list-icon-refresh" @click="refresh"><i></i>刷新</el-button>
        <el-button size="mini" class="list-btns list-icon-print" @click="print"><i></i>打印</el-button>
        <el-button size="mini" class="list-btns list-icon-close" @click="closeTemplate"><i></i>关闭</el-button>
        <span style="float: right; padding-right: 50%;font-weight:bold;font-size: 14px;">报关单回执</span>
      </el-row>
      <el-table  ref="returnReceiptTable" :data="receiptList"
        class='sys-table-table dec-table'
        :cell-class-name='wordBreakKeep'
        highlight-current-row border size='mini'
        @selection-change="returnReceiptChangeFun"
        height="250" style="width: 100%">
        <el-table-column  type="selection" align='center' min-width="50"></el-table-column>
        <el-table-column  type="index" align='left' label="序号" min-width="50"></el-table-column>
        <el-table-column  property="entryId" align='center' label="海关编号/统一编号" min-width="155"></el-table-column>
        <el-table-column  property="pid" align='left' label="回执号" min-width="155"></el-table-column>
        <el-table-column  property="channelValue" align='left' label="回执状态" min-width="150"></el-table-column>
        <el-table-column  property="note" align='left' label="回执详细信息" min-width="500"></el-table-column>
        <el-table-column  property="noticeDate" align='center' label="回执时间" min-width="150">
          <template slot-scope="scope">
            <span>{{scope.row.noticeDate | timeFormat}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span v-show = 'total !== ""'>总共{{total}}条记录</span>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'return-receipt',
  props: {
    initParams: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      total: 0, // 数据总条数
      receiptList: [], // 回执信息
      checkedReceiptList: [] // 被选中的回执信息
    }
  },
  mounted () {
    this.queryReceiptList()
  },
  watch: {
    initParams: 'queryReceiptList'
  },
  filters: {
    timeFormat (value) {
      return value.replace(/T/g, ' ')
    }
  },
  methods: {
    // 关闭回执组件
    closeTemplate () {
      this.$emit('colseTemplate')
    },
    // 刷新回执
    refresh () {
      this.queryReceiptList()
    },
    // 打印通知书
    print () {
      let len = this.checkedReceiptList.length
      if (len === 0) {
        this.messageTips('请选择一条需要打印通知书的数据')
      } else {
        // 查询勾选数据的回执数据
        let pidList = []
        for (let i in this.checkedReceiptList) {
          pidList.push({
            id: this.checkedReceiptList[i].pid,
            isDec: this.checkedReceiptList[i].isDec
          })
        }
        this.$post({
          url: 'API@/dec-common/dec/print/printNoticeList',
          data: pidList,
          success: (res) => {
            if (res.result && res.result.data.length > 0) {
              res.result.data.forEach((item) => {
                window.open(item, '_blank')
              })
            }
            if (!util.isEmpty(res.result.error)) {
              this.$alert(res.result.error, '信息', {
                modalAppendToBody: true,
                domMount: this.$el.parentNode,
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            }
          }
        })
      }
    },
    returnReceiptChangeFun (value) {
      this.checkedReceiptList = value
    },
    // 查询回执数据
    queryReceiptList () {
      this.$post({
        url: 'API@/dec-common/dec/common/queryRetData',
        data: {decPid: this.initParams},
        success: (res) => {
          this.receiptList = res.result
          this.total = this.receiptList.length
        }
      })
    },
    wordBreakKeep ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 5) {
        return 'word-break-Keep'
      }
    }
  }
}
</script>

<style scoped lang="less">
.icon-btn {
    display: inline-block;
    vertical-align: sub;
    margin-right: 5px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
}
</style>
