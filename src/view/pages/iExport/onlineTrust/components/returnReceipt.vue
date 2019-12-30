<template>
  <!-- 查看回执 组件 -->
  <section class="dec-common-dialog">
    <el-dialog
      title="报关单回执/状态记录"
      :visible.sync="receiptVisable"
      :close-on-click-modal='false'
      :modal-append-to-body='false'
      :before-close="closeTemplate"
      width="1050px">
      <div class="dec-query-table" style='margin: 0 20px 20px;'>
        <el-row style="margin-bottom: 14px;">
          <el-button size="mini" class="list-btns list-icon-refresh" @click="refresh"><i></i>刷新</el-button>
        </el-row>
        <el-table  ref="returnReceiptTable" :data="receiptList"
          class='sys-table-table dec-table'
          :cell-class-name='wordBreakKeep'
          highlight-current-row border size='mini'
          height="250" style="width: 100%">
          <el-table-column  type="index" align='left' label="序号" min-width="50"></el-table-column>
          <el-table-column  property="date" align='center' label="回执/状态时间" min-width="150">
             <!-- <template slot-scope="scope">
              <span>{{scope.row.noticeDate | timeFormat}}</span>
            </template> -->
          </el-table-column>
          <el-table-column  property="entryId" align='center' label="报关单编号" min-width="155"></el-table-column>
          <el-table-column  property="retId" align='left' label="回执号" min-width="100"></el-table-column>
          <el-table-column  property="statusValue" align='left' label="回执/系统状态" min-width="100"></el-table-column>
          <el-table-column  property="note" align='left' label="回执/状态详细信息" min-width="200">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'look-receipt',
  props: {
    businessNo: {
      type: String,
      default: ''
    },
    receiptVisable: {
      type: Boolean,
      default: false
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
  filters: {
    timeFormat (value) {
      return value.replace(/T/g, ' ')
    }
  },
  methods: {
    // 关闭回执组件
    closeTemplate () {
      this.$emit('update:receiptVisable', false)
    },
    // 刷新回执
    refresh () {
      this.queryReceiptList()
    },
    // 查询回执数据
    queryReceiptList () {
      this.$post({
        url: 'API@/dec-common/entrust/getDecRet',
        data: this.businessNo,
        success: (res) => {
          this.receiptList = res.result
        }
      })
    },
    wordBreakKeep ({row, column, rowIndex, columnIndex}) {
      // if (columnIndex === 5) {
      //   return 'word-break-Keep'
      // }
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
