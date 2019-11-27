<template>
  <section class='sys-main'>
     <!-- 主显示框 -->
    <div class='content'>
      <div class='regist-panel'>
        <el-form label-width="0px">
        <el-row class='sys-search' :gutter="20">
          <!-- 查询条件 -->
           <el-col :span="11">
            <el-form-item size="mini">
              <el-select clearable placeholder="境内收发货人"  v-model="QueryForm.tradeCoScc" @change="getGoods" filterable>
                <el-option
                  v-for="(item,index) in corps"
                  :key="item.code +'feeOptions' + index"
                  :label="item.value"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item size="mini">
              <el-select placeholder="商品名称" v-model="QueryForm.hsCodes"  multiple :multiple-limit='5' collapse-tags @change="changeGoods()">
                <el-option
                  v-for="(item,index) in goods"
                  :key="item.code +'feeOptions'+index"
                  :label="item.value"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class='sys-search' :gutter="20">
          <el-col :span="3">
            <el-form-item size="mini">
              <el-select v-model="QueryForm.iEFlag">
                <el-option
                  v-for="(item,index) in ports"
                  :key="item.value +'feeOptions'+index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini">
              <el-date-picker  v-model="dates" style="width:100%;vertical-align:middle;"
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
          <el-col :span="3">
            <el-form-item size="mini">
              <el-select clearable  v-model="QueryForm.graininess">
                <el-option
                  v-for="(item,index) in graininess"
                  :key="item.value +'graininess'+index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item size="mini">
              <el-button size="mini" type="primary" @click="doInit()">统计</el-button>
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
            <el-table class='sys-table-table' :data="tableDate" border highlight-current-row>
              <el-table-column label="序号" width="100">
                <template slot-scope="scope">
                  <div class='sys-td-c'>{{(paginationInit.pageIndex-1)*paginationInit.pageSize+(scope.$index+1)}}</div>
                </template>
              </el-table-column>
              <el-table-column label="申报日期" align="center" prop="date" min-width="100"></el-table-column>
              <el-table-column :label="'金额('+(selectGoodsName[0]?selectGoodsName[0]:'')+')'" min-width="100">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.money1 | money(0)}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="'金额('+selectGoodsName[1]+')'" min-width="100" v-if="selectGoodsName[1]">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.money2 | money(0)}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="'金额('+selectGoodsName[2]+')'" min-width="100" v-if="selectGoodsName[2]">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.money3 | money(0)}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="'金额('+selectGoodsName[3]+')'" min-width="100" v-if="selectGoodsName[3]">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.money4 | money(0)}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="'金额('+selectGoodsName[4]+')'" min-width="100" v-if="selectGoodsName[4]">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.money5 | money(0)}}</div>
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
      selectGoodsName: [],

      QueryForm: {
        dateFlag: 'DAY',
        startDate: '',
        endDate: '',
        hsCodes: [], // 商品编码
        iEFlag: 'ALL',
        graininess: 1
      },
      graininess: [
        {
          label: '按日',
          value: 1
        }, {
          label: '按周',
          value: 0
        }, {
          label: '按月',
          value: 2
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
      corpname: '',
      dateConfig: '30',
      chartType: '1',
      resultChartData: {},
      tableDate: [],
      initFlag: true,
      resetChartData: '',
      resultList: [], // 存放列表数据
      cond: {}
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
    // 商品改变
    changeGoods () {
      this.selectGoodsName = []
      for (let a = 0; a < this.QueryForm.hsCodes.length; a++) {
        for (let b = 0; b < this.goods.length; b++) {
          if (this.QueryForm.hsCodes[a] === this.goods[b].code) {
            this.selectGoodsName.push(this.goods[b].value)
          }
        }
      }
      this.doInit()
    },
    // 获取物料
    getGoods () {
      for (let a = 0; a < this.corps.length; a++) {
        if (this.corps[a].code === this.QueryForm.tradeCoScc) {
          this.corpname = this.corps[a].value
        }
      }
      if (util.isEmpty(this.QueryForm.tradeCoScc)) {
        this.QueryForm.hsCodes = []
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/getGoods',
        data: this.QueryForm.tradeCoScc,
        router: this.$router,
        success: (res) => {
          this.goods = []
          for (let a = 0; a < res.result.length; a++) {
            if (res.result[a]) {
              this.goods.push(res.result[a])
            }
          }
          if (this.goods.length > 0) {
            if (!this.cond) {
              this.QueryForm.hsCodes = []
              this.QueryForm.hsCodes.push(this.goods[0].code)
              this.selectGoodsName = [this.goods[0].value]
            } else {
              for (let x in res.result) {
                for (let y in this.QueryForm.hsCodes) {
                  if (res.result[x].code === this.QueryForm.hsCodes[y]) {
                    this.selectGoodsName.push(res.result[x].value)
                  }
                }
              }
            }
            this.getChartData()
          } else {
            let message = ''
            if (util.isEmpty(this.QueryForm.tradeCoScc)) {
              message = '至少选择一家公司'
            } else {
              message = '暂无商品'
            }
            this.$message({
              message: message,
              type: 'warning'
            })
            this.tableDate = []
          }
        }
      })
    },
    // 获取公司
    getCorp () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/getTradeCos',
        data: '',
        router: this.$router,
        success: (res) => {
          this.corps = res.result
          if (res.result.length > 0) {
            if (!this.QueryForm.tradeCoScc) {
              this.QueryForm.tradeCoScc = res.result[0].code
            } else {
              for (let x in res.result) {
                if (res.result[x].code === this.QueryForm.tradeCoScc) {
                  this.corpname = res.result[x].value
                }
              }
            }
            this.getGoods()
          } else {
            this.$message({
              message: '暂无公司',
              type: 'warning'
            })
          }
        }
      })
    },
    // 初始化 或查询
    doInit () {
      if (this.initFlag) {
        this.initFlag = false
        this.getCorp()
      } else {
        this.getChartData(this.$store.state.pagination)
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
      if (util.isEmpty(this.QueryForm.tradeCoScc) && this.goods.length === 0) {
        this.$message({
          message: '至少选择一家公司',
          type: 'warning'
        })
        return
      }
      if (this.goods.length === 0) {
        this.$message({
          message: '该公司暂无商品',
          type: 'warning'
        })
        return
      }
      if (this.QueryForm.hsCodes.length === 0) {
        this.$message({
          message: '至少选择一个商品',
          type: 'warning'
        })
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/decMoneyCount',
        data: {...this.QueryForm, page: pagination || this.paginationInit},
        router: this.$router,
        isPageList: true,
        success: (res) => {
          let dateList = []
          let corpList = []
          this.resultChartData = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: []
            },
            title: {
              text: '境内收发货人:' + this.corpname,
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
            this.paginationInit = res.page
            for (let a = 0; a < this.selectGoodsName.length; a++) {
              for (let item in res.result.decMoneyCountChartVO) {
                corpList.push(res.result.decMoneyCountChartVO[item]['money' + (a + 1)])
                if (a === 0) {
                  dateList.push(res.result.decMoneyCountChartVO[item].date)
                }
              }
              this.resultChartData.xAxis.data = dateList
              this.resultChartData.series.push({
                name: this.selectGoodsName[a],
                type: 'line',
                data: util.simpleClone(corpList)
              })
              corpList = []
            }
            this.tableDate = res.result.decMoneyCountDateVO
          }
        }
      })
    },
    // 日期切换
    datesChange (value) {
      let days = -(parseInt(value) - 1)
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
      if (this.goods.length === 0) {
        this.$message({
          message: '该公司暂无商品',
          type: 'warning'
        })
        return
      } else {
        let list = util.simpleClone(this.goods)
        let arr = []
        this.QueryForm.hsCodes.map(v => {
          return list.filter(item => {
            if (v === item.code) {
              arr.push(item.value)
            }
          })
        })
        this.QueryForm.hsNames = arr
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/dec/decReport/exportMoneyCount',
        data: {
          ...this.QueryForm,
          page: this.paginationInit
        },
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
  // position: absolute;
  height: calc(100% - 40px);
  // width: 100%;
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
