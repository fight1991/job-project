<template>
  <section class='sys-main'>
     <!-- 主显示框 -->
    <div class='content'>
      <div class='regist-panel'>
        <el-form label-width="0px" size="mini">
          <el-row class='sys-search' :gutter="20">
            <!-- 查询条件 -->
            <el-col :span="8" :xs="24">
              <el-form-item>
                <el-date-picker  v-model="dates" style="width:100%;vertical-align:middle;"
                  type="daterange"
                  :clearable = 'false'
                  :editable='false'
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="16" :xs="24">
              <el-form-item>
                <el-radio-group size='mini'  v-model="dateConfig"  @change="datesChange" style="width: auto;margin-top: -2px;">
                  <el-radio-button label="7">最近7天</el-radio-button>
                  <el-radio-button label="30">最近30天</el-radio-button>
                  <el-radio-button label="180">最近180天</el-radio-button>
                </el-radio-group>
                <el-button size="mini" type="primary" class="mg-l-20" @click="doInit()">统计</el-button>
                <el-button size="mini" type="primary" class="mg-l-20 fr" @click="exportFun()">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 查询条件 end-->
        <el-form size="mini" label-width="110px" class="mg-t-10" :model="statisticForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="进口总申报票数:">
                <div class="blue-txt fontWB fontS-16">{{statisticForm.importTotal | money(0)}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提前申报票数:">
                <div class="blue-txt fontWB fontS-16">{{statisticForm.declareAdvanceCount | money(0)}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提前申报率:">
                <div class="org-txt fontWB fontS-16">{{(statisticForm.advanceRate * 100) | money()}}%</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="申报列表" name="list">
              <el-row class='mg-b-30'>
                <div class='mg-lr-30 sys-main-table'>
                  <el-table class='sys-table-table' :data="statisticForm.declareBodyVOList" border highlight-current-row height="450">
                    <el-table-column label="序号" width="100" align="left">
                      <template slot-scope="scope">
                        <div class="sys-td-l">{{(paginationInit.pageIndex-1)*paginationInit.pageSize+(scope.$index+1)}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="报关单号" prop="date" min-width="120" align="left">
                      <template slot-scope="scope">
                        <div class="sys-td-l">{{scope.row.entryId || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="收发货人" prop="date" min-width="150" align="left">
                      <template slot-scope="scope">
                        <div class="sys-td-l">{{scope.row.tradeName || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="提单号" prop="date" min-width="120" align="left">
                      <template slot-scope="scope">
                        <div class="sys-td-l">{{scope.row.billNo || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="进出境关别" min-width="120" align="left">
                      <template slot-scope="scope">
                        <div class="sys-td-l">{{scope.row.iEPortValue || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="进境日期" min-width="100" align="center">
                      <template slot-scope="scope">
                        <div class="sys-td-c">{{scope.row.iEDate || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="申报日期" min-width="100" align="center">
                      <template slot-scope="scope">
                        <div class="sys-td-c">{{scope.row.dDate || '-'}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--分页-->
                  <el-row class='sys-page-list'>
                    <el-col :span="24" align="right">
                      <page-box @change="getTableData()" :pagination.sync='paginationInit' key="advanceSt"></page-box>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="申报统计" name="chart">
              <el-row class='mg-t-20'>
                <el-col :span="12">
                  <div class="pd-r-20 left-panel">
                    <e-chart :datas='resultChartData' :reset='resetChartData'></e-chart>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="pd-l-20 right-panel">
                    <el-table class='sys-table-table nocolor-table' :data="chartList" border max-height="450">
                      <el-table-column label="企业" prop="date" min-width="150" align="left">
                        <template slot-scope="scope">
                          <div>{{scope.row.company || '-'}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="进口总申报票数" prop="date" min-width="120" align="right">
                        <template slot-scope="scope">
                          <div>{{scope.row.importTotal | money(0)}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="提前申报票数" min-width="120" align="right">
                        <template slot-scope="scope">
                          <div>{{scope.row.declareAdvanceCount | money(0)}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="提前申报率" min-width="120" align="right">
                        <template slot-scope="scope">
                          <div>{{(scope.row.advanceRate * 100 ) | money()}}%</div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
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
      dates: ['', ''],
      QueryForm: {
        startDate: '',
        endDate: ''
      },
      dateConfig: '30',
      resultChartData: {},
      resetChartData: '',
      activeName: 'list',
      statisticForm: {
        declareBodyVOList: []
      },
      chartList: []
    }
  },
  created () {
    this.dates = [util.getNdayDate(new Date(), -29), new Date()]
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        this.resetChartData = Math.random()
      })()
    }
    this.getTableData(this.$store.state.pagination)
  },
  methods: {
    // 初始化 或查询
    doInit () {
      this.getTableData(this.$store.state.pagination)
      if (this.activeName === 'chart') this.getChartData()
    },
    handleClick (tab, event) {
      if (tab.name === 'chart') {
        this.$nextTick(() => {
          this.getChartData()
        })
      }
    },
    // 获取表格数据
    getTableData (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      } else {
        this.QueryForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/dec/decReport/decDeclareLst',
        data: {...this.QueryForm, page: pagination || this.paginationInit},
        isPageList: true,
        router: this.$router,
        success: (res) => {
          this.paginationInit = res.page
          this.statisticForm = util.isEmpty(res.result) ? {} : res.result
        }
      })
    },
    // 获取图表数据
    getChartData () {
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      } else {
        this.QueryForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/dec/decReport/decDeclareStatistics',
        data: this.QueryForm,
        router: this.$router,
        success: (res) => {
          this.chartList = util.isEmpty(res.result) ? [] : res.result
          let legendData = []
          let pieList = []
          this.chartList.forEach(e => {
            legendData.push(e.company)
            pieList.push({name: e.company, value: e.declareAdvanceCount})
          })
          this.resultChartData = {
            tooltip: {
              trigger: 'item',
              formatter: '{a}{b} :  <br/>提前申报数 : {c}  <br/>占比 : {d}%'
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
      let days = -(parseInt(value) - 1)
      this.dates = [util.getNdayDate(new Date(), days), new Date()]
    },
    // 导出
    exportFun () {
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      } else {
        this.QueryForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      let url = this.activeName === 'list' ? 'decDeclareLstExport' : 'decDeclareStatisticsExport'
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/dec/decReport/' + url,
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
.fontWB{
  font-weight: bold;
}
.fontS-16{
  font-size: 16px;
}
.blue-txt{
  color: #49ABD9;
}
.org-txt{
  color: #f08800;
}
.pd-r-20{
  padding-right: 20px;
}
.pd-l-20{
  padding-left: 20px;
}
.right-panel{
  border-left: 1px solid #d8d8d8;
}
</style>
