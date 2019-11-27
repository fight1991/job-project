<template>
  <section class='sys-main'>
     <!-- 主显示框 -->
    <div class='content'>
      <div class='regist-panel'>
        <el-form label-width="0px">
        <el-row class='sys-search mg-b-30' :gutter="20">
          <!-- 查询条件 -->
          <el-col :span="3">
            <el-form-item size="mini">
              <el-select  v-model="QueryForm.iEFlag">
                <el-option
                  v-for="item in ports"
                  :key="item.value +'feeOptions'"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini">
              <el-date-picker  v-model="dates" style="width:100%;vertical-align:middle;"
                @change="doInit()"
                type="daterange"
                :clearable = 'false'
                :editable='false'
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <div class='sys-fr'>
              <el-radio-group size='mini' v-model="dateConfig"  @change="datesChange">
                <el-radio-button label="7">最近7天</el-radio-button>
                <el-radio-button label="30">最近30天</el-radio-button>
                <el-radio-button label="180">最近180天</el-radio-button>
              </el-radio-group>
              <el-button size="mini" type="primary" style="vertical-align:middle;margin-left: 20px;" @click="doInit">统计</el-button>
            </div>
          </el-col>
        </el-row>
        </el-form>
        <!-- 查询条件 end-->
        <!-- 报表 -->
        <div class='mg-b-30'>
          <e-chart :datas='resultChartData' :reset='resetChartData'></e-chart>
        </div>
        <!-- 列表 list -->
        <el-row class='mg-b-30'>
          <el-row class='mg-b-20'>
            <el-button size="mini" label="180" @click="getexcel()">导出Excel</el-button>
          </el-row>
          <div class='mg-lr-30 sys-main-table'>
            <el-table class='sys-table-table' :data="tableData" border highlight-current-row>
              <el-table-column label="序号" width="100">
                <template slot-scope="scope">
                  <div class='sys-td-l'>{{(paginationInit.pageIndex-1)*paginationInit.pageSize+(scope.$index+1)}}</div>
                </template>
              </el-table-column>
              <el-table-column label="境内收发货人" min-width="150">
                <template slot-scope="scope">
                    <div class='sys-td-l'>{{scope.row.tradeCoName}}</div>
                </template>
              </el-table-column>
              <el-table-column label="进口单量" min-width="100">
                <template slot-scope="scope">
                    <div class='sys-td-r'>{{scope.row.iCount}}</div>
                </template>
              </el-table-column>
              <el-table-column label="出口单量" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.eCount}}</div>
                </template>
              </el-table-column>
              <el-table-column label="总单量" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.totalCount}}</div>
                </template>
              </el-table-column>
              <el-table-column label="占比" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.percent*100 | money(2)}}%</div>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <el-row class='sys-page-list'>
              <el-col :span="24" align="right">
                  <page-box @change="getChartData()" :pagination.sync='paginationInit'></page-box>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
    </div>
    <!-- 主显示框 end-->
  </section>
</template>
<script>
import util from '../../../../common/util'
export default {
  data () {
    return {
      // 存放查询检索表单数据
      dates: ['', ''],
      QueryForm: {
        iEFlag: 'ALL',
        startDate: '',
        endDate: ''
      },
      tableData: [],
      graininess: [
        {
          label: '日',
          value: 1
        },
        {
          label: '月',
          value: 2
        },
        {
          label: '周',
          value: 0
        }],
      ports: [{
        label: '进口',
        value: 'I'
      }, {
        label: '出口',
        value: 'E'
      }, {
        label: '全部',
        value: 'ALL'
      }],
      dateConfig: '30',
      chartType: '1',
      resultChartData: {},
      resetChartData: '',
      resultList: [] // 存放列表数据
    }
  },
  created () {
    this.dates = [util.getNdayDate(new Date(), -30), new Date()]
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        this.resetChartData = Math.random()
      })()
    }
    this.doInit()
  },
  methods: {
    doInit () {
      this.$store.commit('pageInit') // 初始化当前页
      this.getChartData(this.$store.state.pagination)
    },
    // 获取图表数据
    getChartData (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      } else {
        this.QueryForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/decCount',
        data: {...this.QueryForm, page: pagination || this.paginationInit},
        router: this.$router,
        isPageList: true,
        success: (res) => {
          let pieList = []
          let legendData = []
          if (!util.isEmpty(res.result.decCountPieVO) && res.result.decCountPieVO.length > 0) {
            this.paginationInit = res.page
            let leftcount = res.result.decCountPieVO[0].totalCount
            for (let item in res.result.decCountPieVO) {
              leftcount = leftcount - res.result.decCountPieVO[item].count
              pieList.push({name: util.isEmpty(res.result.decCountPieVO[item].tradeCoName) ? '' : res.result.decCountPieVO[item].tradeCoName,
                value: res.result.decCountPieVO[item].count})
              legendData.push(util.isEmpty(res.result.decCountPieVO[item].tradeCoName) ? '' : res.result.decCountPieVO[item].tradeCoName)
            }
            if (res.result.decCountPieVO.length >= 9) {
              pieList.push({name: '其他企业',
                value: leftcount})
              legendData.push('其他企业')
            }
            this.tableData = res.result.decCountTableVO
          } else {
            this.$message({
              message: '暂无数据',
              type: 'warning'
            })
            this.tableData = []
          }
          this.resultChartData = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}({d})%'
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: '64%',
              y: 'center',
              align: 'left', // 调整文字和样式的位置
              data: legendData
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: '80%',
                label: {
                  show: false
                },
                center: ['35%', '50%'],
                data: pieList
              }
            ]
          }
        }
      })
    },
    // 日期切换
    datesChange (value) {
      let days = -(parseInt(value))
      this.dates = [util.getNdayDate(new Date(), days), new Date()]
      this.doInit()
    },
    // 图表类型切换
    restTypeChartData () {
      let type = ''
      if (this.chartType === '1') {
        type = 'line'
        this.resultChartData.xAxis.boundaryGap = false
      } else {
        type = 'bar'
        this.resultChartData.xAxis.boundaryGap = true
      }
      for (let x in this.resultChartData.series) {
        this.resultChartData.series[x].type = type
      }
      this.resetChartData = Math.random()
    },
    // 导出
    getexcel () {
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      } else {
        this.QueryForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/dec/decReport/exportDecCount',
        data: {...this.QueryForm, page: this.paginationInit},
        router: this.$router,
        success: (res) => {
          if (util.isEmpty(res.result)) {
            this.$message({
              message: '该查询条件下没有可导出的数据',
              type: 'warning'
            })
          } else {
            window.open(res.result, '_blank')
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.sys-main{
  height: calc(100% - 40px);
  overflow: auto;
  padding: 20px;
}
.regist-panel{
  padding: 20px;
  background-color: #fff;
}
.temperature-div-s {
  float: right;
}
@media only screen and (max-device-width: 767px) and (-webkit-min-device-pixel-ratio: 2) {
  .sys-fr{
    float: none;
  }
}
.mg-b-20{
  margin-bottom: 20px;
}
.sys-class .el-radio-group{
  width: auto;
}
</style>
