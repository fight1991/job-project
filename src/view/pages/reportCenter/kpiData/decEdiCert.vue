<template>
  <section class='sys-main'>
     <!-- 主显示框 -->
    <div class='content'>
      <div class='regist-panel' :model="QueryForm">
        <el-form label-width="100px">
        <el-row class='sys-search mg-b-30' :gutter="5">
          <!-- 查询条件 -->
          <el-col :span="4">
            <el-form-item size="mini" label="客户名称">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="统计口径">
              <el-select  v-model="QueryForm.tjkj">
                <el-option
                  v-for="item in graininess"
                  :key="item.value +'feeOptions'"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="mini" label="统计区间">
            <el-date-picker  v-model="dates" style="width:100%"
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
          <el-col :span="4">
              <el-form-item size="mini" label-width="10px">
              <el-radio-group size='small'  v-model="dateConfig"  @change="datesChange">
                <el-radio-button label="7">最近7天</el-radio-button>
                <el-radio-button label="30">最近30天</el-radio-button>
                <el-radio-button label="180">最近180天</el-radio-button>
              </el-radio-group>
              </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="mini" label="进出口标志">
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
        </el-row>
        <el-row >
            <el-col :span="2" :offset="8" >
            <el-form-item size="mini" label-width="0px">
            <el-button label="180"  type="primary" @click="doInit">查询</el-button>
            </el-form-item>
            </el-col>
            <el-col :span="2" >
            <el-form-item size="mini" label-width="0px">
            <el-button label="180" @click="doInit">重置</el-button>
            </el-form-item>
            </el-col>
            <el-col :span="2" >
            <el-form-item size="mini" label-width="0px">
            <el-button label="180" @click="doInit">导出</el-button>
            </el-form-item>
            </el-col>
        </el-row>
        </el-form>
        <!-- 查询条件 end-->
        <!-- 列表 list -->
        <el-row class='mg-b-30'>
          <div class='mg-lr-30 sys-main-table' style="margin-bottom:100px">
            <el-table class='sys-table-table' :data="tableData" border highlight-current-row>
              <el-table-column label="序号" width="100">
                <template slot-scope="scope">
                  <div class='sys-td-c'>{{(pages.pageIndex-1)*pages.pageSize+(scope.$index+1)}}</div>
                </template>
              </el-table-column>
              <el-table-column label="客户" min-width="100">
                <template slot-scope="scope">
                    <div class='sys-td-l'>{{scope.row.tradeCoName}}</div>
                </template>
              </el-table-column>
              <el-table-column label="时间" min-width="100">
                <template slot-scope="scope">
                    <div class='sys-td-r'>{{scope.row.iCount}}</div>
                </template>
              </el-table-column>
              <el-table-column label="报关单数" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.eCount}}</div>
                </template>
              </el-table-column>
              <el-table-column label="改单数" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.totalCount}}</div>
                </template>
              </el-table-column>
              <el-table-column label="改单比例（%）" width="150">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.percent*100 | money(2)}}%</div>
                </template>
              </el-table-column>
              <el-table-column label="删改单" width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.percent*100 | money(2)}}%</div>
                </template>
              </el-table-column>
              <el-table-column label="删单比例（%）" width="150" >
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.percent*100 | money(2)}}%</div>
                </template>
              </el-table-column>
               <el-table-column label="删改比例（%）" width="150" >
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.percent*100 | money(2)}}%</div>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <el-row class='sys-page-list'>
              <el-col :span="24" align="right">
                  <page-box @change="getChartData()"></page-box>
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
import util from '@/common/util'
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
      resultList: [], // 存放列表数据
      pages: {} // 存放后台返回的页码
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
    this.doInit()
  },
  methods: {
    // 加载缓存数据
    loadData () {
      this.$store.commit('pageCacheInit', this.pagination)
    },
    // 缓存数据
    cacheData () {
      this.pagination = {
        currentPage: this.$store.state.pagination.currentPage, // 当前页
        pageSize: this.$store.state.pagination.pageSize, // 每页数据条数
        total: this.$store.state.pagination.total // 总条数
      }
    },
    doInit () {
      this.$store.commit('pageInit') // 初始化当前页
      this.getChartData()
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
        url: 'API@/saas-report/decReport/decCount',
        data: this.QueryForm,
        router: this.$router,
        isPageList: true,
        success: (res) => {
          let pieList = []
          let legendData = []
          if (!util.isEmpty(res.result.decCountPieVO) && res.result.decCountPieVO.length > 0) {
            this.pages = res.page
            let leftcount = res.result.decCountPieVO[0].totalCount
            for (let item in res.result.decCountPieVO) {
              leftcount = leftcount - res.result.decCountPieVO[item].count
              pieList.push({name: res.result.decCountPieVO[item].tradeCoName,
                value: res.result.decCountPieVO[item].count})
              legendData.push(res.result.decCountPieVO[item].tradeCoName)
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
              right: 300,
              top: 10,
              bottom: 20,
              data: legendData
            },
            series: [
              {
                name: '单量统计',
                type: 'pie',
                radius: '90%',
                label: {
                  show: false
                },
                center: ['50%', '50%'],
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
    }
  }
}
</script>
<style scoped lang="less">
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
</style>
