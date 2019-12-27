<template>
  <div class="board">
    <div class="title">跟踪看板</div>
    <div class="refreshDec list-icon-oper_refresh" @click="refreshData">
      <i></i>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="申报跟踪" name="first">
        <el-form class="dateSearch">
          <el-form-item label="操作日期查询">
            <el-date-picker
              v-model="dates"
              size="mini"
              type="daterange"
              @change="getDecList('date')"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-row>
          <div class="default" v-if="tableData.length === 0"><img src="https://www.5itrade.cn/files/CCBA/board.png" alt=""></div>
          <div class="ccba-table" v-else>
            <el-table
              :data="tableData"
              @cell-click="goToDecInfo"
              :cell-class-name = 'cursor'
              style="width:100%">
              <el-table-column
                prop="statusVal"
                label="内容"
                >
              </el-table-column>
              <el-table-column
                prop="iCount"
                label="进口报关单"
                width="110"
                align="right"
                >
              </el-table-column>
              <el-table-column
                prop="eCount"
                width="110"
                label="出口报关单"
                align="right"
                >
              </el-table-column>
            </el-table>
          </div>
        </el-row>
      </el-tab-pane>
      <!-- <el-tab-pane label="物流跟踪" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="费用跟踪" name="third">角色管理</el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import util from '@/common/util'
// import pathList from '../../../config/pathList'
import eventBus from './eventBus'
export default {
  data () {
    return {
      timerId: 0,
      dates: '',
      activeName: 'first',
      isLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableData: []
    }
  },
  created () {
    this.getWeek()
    this.getDecList()
    eventBus.$on('getDecList', this.getDecList)
  },
  beforeDestroy () {
    clearTimeout(this.timerId)
    this.timerId = 0
  },
  methods: {
    // 获取报关单统计详情
    getDecList (flag) {
      if (!this.dates) {
        this.tableData = []
        return
      }
      if (flag === 'date') {
        if (this.timerId > 0) { // 存在定时器
          clearTimeout(this.timerId)
          this.timerId = 0
        }
      }
      this.dates = [util.dateFormat(this.dates[0], 'yyyy-MM-dd'), util.dateFormat(this.dates[1], 'yyyy-MM-dd')]
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/decListHomePage',
        data: {
          'iEFlag': 'All',
          'endDate': this.dates[1],
          'startDate': this.dates[0],
          'refreshFlag': flag === 'refresh' ? 'Y' : 'N'
        },
        showErrorMessage: false,
        isLoad: false,
        router: this.$router,
        success: (res) => {
          this.tableData = res.result.decListHomePageVOs
        }
      })
    },
    refreshData () {
      if (this.timerId > 0 || !this.dates) {
        return
      }
      // 更换刷新图片
      this.timerId = setTimeout(() => {
        this.timerId = 0
      }, 60000)
      this.getDecList('refresh')
    },
    // 获取当前一周
    getWeek () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 点击进口或出口单元格,跳转
    goToDecInfo (row, column, cell) {
      if (column.property === 'statusVal') return
      let flag = column.property === 'iCount' ? 'I' : 'E'
      let [ iEFlag, status, startTime, endTime ] = [flag, row.status, this.dates[0], this.dates[1]]
      let query = {
        iEFlag: iEFlag,
        status: status,
        startTime: startTime,
        endTime: endTime
      }
      // 如果状态为0 跳转到进口接单或出口接单,否则跳转到报关单查询
      if (status === '0') {
        let routeName
        if (iEFlag === 'I') {
          routeName = 'iOrderReceiving'
        } else {
          routeName = 'eOrderReceiving'
        }
        this.$router.push({
          name: routeName,
          query: query
        })
      } else {
        this.$router.push({
          name: 'decInfo',
          query: query
        })
      }
    },
    // 行点击样式
    cursor ({row, column, rowIndex, columnIndex}) {
      if (columnIndex > 0) {
        return 'cursor'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.board {
  position: relative;
  padding: 10px 20px;
  .refreshDec {
    padding: 10px;
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
    z-index: 66;
    img {
      width: 16px;
      height: 16px;
      transition: all 0.6s
    }
    &:hover {
      img {
        transform: rotateZ(180deg)
      }
    }
  }
  .title {
    position:absolute;
    left: 20px;
    top: 5px;
    line-height: 40px;
    color: @font-color-main;
    font-weight: bold;
  }

  .el-form-item__label {
    font-size: 12px;
  }
  .default {
    img {
      display: block;
      margin: 35px auto 0 auto
    }
  }
}
</style>
