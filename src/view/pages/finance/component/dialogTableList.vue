<template>
  <section class='sys-main flatList'>
    <!-- 弹框 -->
    <el-dialog :title="title" :modal-append-to-body="false" @close="resetDialog" :visible.sync="isShow" :close-on-click-modal='false' :width="dialogWidth">
      <div class="dec-div">
        <el-table class='sys-table-table' align="center" size="mini"
        :data="tableList" border highlight-current-row height="300px">
        <el-table-column type="index" width="50" label="序号" align="center">
        </el-table-column>
        <el-table-column v-for="(item, index) in tableHead" :key="'item' + index"
          :label="item.label"
          :min-width="item.width"
          :prop="item.prop"
          :align="item.align || 'left'">
         </el-table-column>
        </el-table>
      </div>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <el-pagination
            v-if='pagination.total != 0'
            background
            :pager-count= "5"
            @current-change="currentChange"
            @size-change="sizeChange"
            :current-page.sync="pagination.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  data () {
    return {
      isShow: false,
      pickerOptions2: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  watch: {
    'visible': function (newData, oldData) {
      if (newData) {
        this.isShow = newData
      }
    }
  },
  props: {
    pagination: {
      type: Object,
      default: () => {
        return {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    tableHead: {
      default: () => [],
      type: Array
    },
    tableList: {
      default: () => [],
      type: Array
    },
    visible: {
      default: false,
      type: Boolean
    },
    dialogWidth: {
      default: '460px'
    },
    title: {
      default: '提示',
      type: String
    }
  },
  created () {},
  methods: {
    resetDialog () {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    currentChange (page) {
      this.pagination.pageIndex = page
      this.$emit('change', this.pagination)
      this.$emit('update:pagination', this.pagination)
    },
    sizeChange (size) {
      this.pagination.pageSize = size
      if ((this.pagination.pageIndex - 1) * size > this.pagination.total) {
        this.pagination.pageIndex = 1
      }
      this.$emit('change', this.pagination)
      this.$emit('update:pagination', this.pagination)
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-btn {
  padding-top: 20px;
}
.flex {
  display: flex;
  align-items: flex-start;
}
.topFlag {
  padding-left: 18px;
  margin-bottom: 20px;
  box-sizing: border-box;
  img {
    display:block;
    margin-right: 8px;
  }
}
</style>
