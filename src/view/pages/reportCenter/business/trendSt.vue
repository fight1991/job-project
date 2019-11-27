<template>
  <section class='sys-main'>
     <!-- 主显示框 -->
    <div class='content'>
      <div class='regist-panel'>
        <el-form label-width="0px">
        <el-row class='sys-search mg-b-30' :gutter="20">
          <!-- 查询条件 -->
          <el-col :span="6">
            <el-form-item size="mini">
              <el-select placeholder="公司名称"  v-model="QueryForm.tradeCoScc" @change="changecompany()" filterable>
                <el-option
                  v-for="(item,cindex) in corps"
                  :key="item.code +'corps'+cindex"
                  :label="item.value"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini">
              <el-select v-model="QueryForm.iEFlag">
                <el-option
                  v-for="(item,index) in ports"
                  :key="item.value +'ports'+index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="3">
            <el-form-item size="mini">
              <el-select clearable  v-model="QueryForm.dateFlag">
                <el-option
                  v-for="item in dateFlag"
                  :key="item.value +'dateFlag'"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item size="mini">
            <el-date-picker  v-model="dates" style="width:100%"
              @change="getChartData()"
              type="daterange"
              :clearable = 'false'
              :editable='false'
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item size="mini">
              <el-button type="primary" @click="getChartData()">统计</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class='sys-search'>
          <el-col :span="24" align="right">
            <el-form-item size="mini">
              <el-radio-group size='small'  v-model="dateConfig"  @change="datesChange">
                <el-radio-button label="7">最近7天</el-radio-button>
                <el-radio-button label="30">最近30天</el-radio-button>
                <el-radio-button label="180">最近180天</el-radio-button>
              </el-radio-group>
            </el-form-item>
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
              <el-table-column label="创建日期" prop="date" min-width="100"></el-table-column>
              <el-table-column label="进口单量" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.iCount }}</div>
                </template>
              </el-table-column>
              <el-table-column label="出口单量" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.eCount }}</div>
                </template>
              </el-table-column>
              <el-table-column label="总单量" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.aCount}}</div>
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
      goods: [],
      corps: [],
      selectcorpName: [],
      QueryForm: {
        dateFlag: 'DAY',
        startDate: '',
        endDate: '',
        iEFlag: 'ALL',
        tradeCoScc: ''
      },
      tableData: [],
      dateFlag: [{
        label: '按日',
        value: 'DAY'
      }, {
        label: '按周',
        value: 'WEEK'
      }, {
        label: '按月',
        value: 'MONTH'
      }],
      ports: [
        {
          label: '全部',
          value: 'ALL'
        }, {
          label: '进口',
          value: 'I'
        }, {
          label: '出口',
          value: 'E'
        }],
      dateConfig: '30',
      chartType: '1',
      initflag: true,
      resultChartData: {},
      resetChartData: '',
      resultList: [], // 存放列表数据
      cond: ''
    }
  },
  created () {
    this.dates = [util.getNdayDate(new Date(), -29), new Date()]
    this.cond = window.localStorage.getItem('queryCond')
    if (this.cond) {
      this.QueryForm = JSON.parse(this.cond)
      this.dates = JSON.parse(this.cond).dates
    }
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
    // 获取公司
    getCorp () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/getTradeCos',
        data: '',
        router: this.$router,
        success: (res) => {
          this.corps = res.result
          if (res.result.length > 0) {
            if (!this.cond) {
              this.QueryForm.tradeCoScc = res.result[0].code
              this.selectcorpName.push(res.result[0].value)
            } else {
              for (let x in res.result) {
                if (res.result[x].code === this.QueryForm.tradeCoScc) {
                  this.selectcorpName.push(res.result[x].value)
                }
              }
            }
            this.getChartData()
          } else {
            this.$message({
              message: '暂无公司',
              type: 'warning'
            })
          }
        }
      })
    },
    doInit () {
      if (this.initflag) {
        this.initflag = false
        this.getCorp()
      } else {
        this.getChartData(this.$store.state.pagination)
      }
    },
    changecompany () {
      for (let a = 0; a < this.corps.length; a++) {
        if (this.corps[a].code === this.QueryForm.tradeCoScc) {
          this.selectcorpName[0] = this.corps[a].value
        }
      }
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
        url: 'API@/saas-report/decReport/decTrendCount',
        data: {...this.QueryForm, page: pagination || this.paginationInit},
        router: this.$router,
        isPageList: true,
        success: (res) => {
          let dateList = []
          let corpList = []
          this.tableData = res.result.decTrendCountDateVO
          this.paginationInit = res.page
          this.resultChartData = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: []
            },
            title: {
              text: '境内收发货人:' + this.selectcorpName[0],
              left: 'center'
            },
            grid: {
              left: '30px',
              right: '40px',
              bottom: '5%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: this.chartType === '2',
              data: []
            },
            yAxis: {
              type: 'value'
            },
            series: [
            ]
          }
          if (!util.isEmpty(res.result)) {
            for (let a = 0; a < this.selectcorpName.length; a++) {
              for (let item in res.result.decTrendCountChartVO) {
                if (this.QueryForm.iEFlag === 'ALL') {
                  corpList.push(res.result.decTrendCountChartVO[item].aCount ? res.result.decTrendCountChartVO[item].aCount : '0')
                } else if (this.QueryForm.iEFlag === 'I') {
                  corpList.push(res.result.decTrendCountChartVO[item].iCount ? res.result.decTrendCountChartVO[item].iCount : '0')
                } else {
                  corpList.push(res.result.decTrendCountChartVO[item].eCount ? res.result.decTrendCountChartVO[item].eCount : '0')
                }
                if (a === 0) {
                  dateList.push(res.result.decTrendCountChartVO[item].date)
                }
              }
              this.resultChartData.xAxis.data = dateList
              this.resultChartData.series.push({
                name: this.selectcorpName[a],
                type: 'line',
                data: util.simpleClone(corpList)
              })
              corpList = []
            }
          } else {
            this.$message({
              message: '暂无数据',
              type: 'warning'
            })
            this.tableData = []
          }
        }
      })
    },
    // 日期切换
    datesChange (value) {
      let days = -(parseInt(value) - 1)
      this.dates = [util.getNdayDate(new Date(), days), new Date()]
      this.getChartData()
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
    // 跳转到用户访问明细页面
    toDetail (date) {
      let json = {
        path: '/statistics/visitDetail',
        query: {
          'actionName': encodeURIComponent('登录'),
          'startTime': date,
          'endTime': date
        }
      }
      this.$store.commit('addTab', {tabName: `用户访问明细-登录(${date})`, tabPath: json})
      this.$router.push(json)
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
        url: 'API@/dec-common/dec/decReport/exportDecTrendCount',
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
</style>
