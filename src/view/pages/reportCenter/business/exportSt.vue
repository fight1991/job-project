<template>
  <section class='sys-main'>
     <!-- 主显示框 -->
    <div class='content'>
      <div class='regist-panel mg-b-18'>
        <el-form :label-width="labelFormWidth.six">
          <el-row class='sys-search' :gutter="50">
            <!-- 查询条件 -->
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="报关单类型">
                <el-select v-model="QueryForm.declTrnrel" filterable>
                  <el-option key="0+'declTrnrel'" label="报关单" value="0"></el-option>
                  <el-option key="2+'declTrnrel'" label="备案清单" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="委托客户">
                <el-select v-model="QueryForm.ref3" filterable>
                  <el-option
                    v-for="(item,cindex) in entrusters"
                    :key="item.value +'corps' + cindex"
                    :label="item.value"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="境内收发货人">
                <el-select v-model="QueryForm.tradeCoScc" filterable clearable @change="getGoods()">
                  <el-option
                    v-for="(item,cindex) in corps"
                    :key="item.value +'corps' + cindex"
                    :label="item.value"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="商品名称">
                <el-select clearable v-model="QueryForm.hsCodes" collapse-tags filterable multiple :multiple-limit='5'>
                  <el-option
                    v-for="(item,index) in goods"
                    :key="item.code +'goods' + index"
                    :label="item.code+'-'+item.value"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='sys-search' :gutter="50">
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="申报地海关">
                <el-select v-model="QueryForm.customMaster" filterable clearable>
                  <el-option
                    v-for="item in cusCustomsCodeList"
                    :key="item.codeField"
                    :label="item.codeField+'-'+item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="运输方式">
                <el-select filterable clearable v-model="QueryForm.trafMode">
                  <el-option
                    v-for="item in trans"
                    :key="item.codeField +'trans'"
                    :label="item.codeField+'-'+item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="监管方式">
                <el-select filterable clearable v-model="QueryForm.tradeMode">
                  <el-option
                    v-for="item in vies"
                    :key="item.codeField +'vies'"
                    :label="item.codeField+'-'+item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item size="mini" label="状态">
                <el-select v-model="QueryForm.status" filterable>
                  <el-option key="1+'status'" label="已申报" value="1"></el-option>
                  <el-option key="10+'status'" label="结关" value="10"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='sys-search' :gutter="50">
            <el-col :md="12" :lg="12">
              <el-form-item size="mini" label="申报日期">
                <el-date-picker  v-model="dates" style="width:100%;"
                  @change="search()"
                  type="daterange"
                  :clearable='false'
                  :editable='false'
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="6">
              <el-form-item label="商品编号" >
                <el-autocomplete
                  :maxlength="10"
                  size='mini' clearable
                  v-model="QueryForm.hsCode"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  @select="handleSelect">
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="text-align:center;">
            <el-button size="mini" type="primary" @click="search()">统计</el-button>
          </el-row>
        </el-form>
      </div>
      <!-- 查询条件 end-->
      <!-- 列表 list -->
      <div class='regist-panel mg-b-18'>
        <el-row class='mg-b-18'>
          <el-dropdown>
            <el-button size="mini">导出Excel</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><div @click.stop="getexcel">生成文件</div></el-dropdown-item>
              <el-dropdown-item><div @click.stop="download">下载文件</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="airvehicle-list-drop" style="float:right;">
            <el-popover popper-class="airvehicle-table-popper">
              <ul style="max-height: 400px;overflow: auto;width:150px;">
                <li v-for="(item,index) in thList" :key="index">
                  <el-checkbox size="mini" v-model="item.value" @change="columnFieldChange">{{item.fieldName}}</el-checkbox>
                </li>
              </ul>
              <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
            </el-popover>
          </div>
        </el-row>
        <el-row class='mg-b-18'>
          <div class='mg-lr-30 dec-query-table'>
            <el-table class='sys-table-table dec-table' :data="resultList" border highlight-current-row size="mini" height="413px">
              <el-table-column label="接单编号" min-width="130" prop="bossId" align="center" v-if="thList.bossId.value"></el-table-column>
              <el-table-column label="委托客户" min-width="210" prop="company" align="left" v-if="thList.company.value"></el-table-column>
              <el-table-column label="客户业务号" min-width="120" prop="ref1" align="left" v-if="thList.ref1.value"></el-table-column>
              <el-table-column label="海关编号" min-width="160" prop="entryId" align="center" v-if="thList.entryId.value"></el-table-column>
              <el-table-column label="境内收发货人" min-width="210" prop="tradeName" align="left" v-if="thList.tradeName.value"></el-table-column>
              <el-table-column label="境外收发货人" min-width="210" prop="overseasConsigneeEname" align="left" v-if="thList.overseasConsigneeEname.value"></el-table-column>
              <el-table-column label="生产销售单位" min-width="210" prop="ownerName" align="left" v-if="thList.ownerName.value"></el-table-column>
              <el-table-column label="申报单位" min-width="210" prop="agentName" align="left" v-if="thList.agentName.value"></el-table-column>
              <el-table-column label="申报地海关" min-width="100" prop="customMasterValue" align="center" v-if="thList.customMasterValue.value"></el-table-column>
              <el-table-column label="申报日期" min-width="100" prop="dDate" align="center" v-if="thList.dDate.value"></el-table-column>
              <el-table-column label="出境关别" min-width="160" prop="iEPortValue" align="center" v-if="thList.iEPortValue.value"></el-table-column>
              <el-table-column label="备案号" min-width="130" prop="manualNo" align="left" v-if="thList.manualNo.value"></el-table-column>
              <el-table-column label="商品项数" min-width="90" prop="goodsNum" align="right" v-if="thList.goodsNum.value"></el-table-column>
              <el-table-column label="总提运单号" min-width="205" prop="billNo" align="center" v-if="thList.billNo.value"></el-table-column>
              <el-table-column label="分提运单号" min-width="120" prop="spliBillNo" align="center" v-if="thList.spliBillNo.value"></el-table-column>
              <el-table-column label="运输方式" min-width="120" prop="trafModeValue" align="center" v-if="thList.trafModeValue.value"></el-table-column>
              <el-table-column label="运输工具名称" min-width="120" prop="trafName" align="left" v-if="thList.trafName.value"></el-table-column>
              <el-table-column label="航次号" min-width="120" prop="voyageNo" align="center" v-if="thList.voyageNo.value"></el-table-column>
              <el-table-column label="监管方式" min-width="100" prop='tradeModeValue' align="center" v-if="thList.tradeModeValue.value"></el-table-column>
              <el-table-column label="运费标志" min-width="100" prop='feeMarkValue' align="center" v-if="thList.feeMarkValue.value"></el-table-column>
              <el-table-column label="运费" min-width="100" prop='feeRate' align="right" v-if="thList.feeRate.value"></el-table-column>
              <el-table-column label="运费币制" min-width="100" prop='feeCurrValue' align="center" v-if="thList.feeCurrValue.value"></el-table-column>
              <el-table-column label="保费标志" min-width="100" prop='insurMarkValue' align="center" v-if="thList.insurMarkValue.value"></el-table-column>
              <el-table-column label="保费" min-width="100" prop='insurRate' align="right" v-if="thList.insurRate.value"></el-table-column>
              <el-table-column label="保费币制" min-width="100" prop='insurCurrValue' align="center" v-if="thList.insurCurrValue.value"></el-table-column>
              <el-table-column label="杂费标志" min-width="100" prop='otherMarkValue' align="center" v-if="thList.otherMarkValue.value"></el-table-column>
              <el-table-column label="杂费" min-width="100" prop='otherRate' align="right" v-if="thList.otherRate.value"></el-table-column>
              <el-table-column label="杂费币制" min-width="100" prop='otherCurrValue' align="center" v-if="thList.otherCurrValue.value"></el-table-column>
              <el-table-column label="成交方式" min-width="100" prop="transModeValue" align="center" v-if="thList.transModeValue.value"></el-table-column>
              <el-table-column label="件数" min-width="90" prop="packNo" v-if="thList.packNo.value" align="right"></el-table-column>
              <el-table-column label="毛重(KG)" min-width="100" prop="grossWt" v-if="thList.grossWt.value" align="right"></el-table-column>
              <el-table-column label="净重(KG)" min-width="100" prop="netWt" align="right" v-if="thList.netWt.value"></el-table-column>
              <el-table-column label="备注" min-width="200" prop="noteS" align="right" v-if="thList.noteS.value">
                <template slot-scope="scope">
                  <div class="text-over-hid" :title="scope.row.noteS">
                    {{scope.row.noteS}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单价" min-width="100" v-if="thList.declPrice.value">
                <template slot-scope="scope">
                  <div class='sys-td-r'>{{scope.row.declPrice && scope.row.declPrice.toLocaleString()}}</div>
                </template>
              </el-table-column>
              <el-table-column label="备案序号" min-width="130" align="left" prop="contrItem" v-if="thList.contrItem.value"></el-table-column>
              <el-table-column label="商品编号" min-width="100" align="center" prop="codeTs" v-if="thList.codeTs.value"></el-table-column>
              <el-table-column label="商品名称" min-width="150" prop="gName" align="left" v-if="thList.gName.value"></el-table-column>
              <el-table-column label="成交数量" min-width="100" prop="gQty" align="right" v-if="thList.gQty.value"></el-table-column>
              <el-table-column label="成交计量单位" min-width="100" prop="gUnitValue" align="center" v-if="thList.gUnitValue.value"></el-table-column>
              <el-table-column label="价值" min-width="100" prop="declTotal" align="right" v-if="thList.declTotal.value"></el-table-column>
              <el-table-column label="币制" min-width="100" prop="tradeCurrValue" align="center" v-if="thList.tradeCurrValue.value"></el-table-column>
              <el-table-column label="美元价值" min-width="100" prop="usDeclTotal" align="right" v-if="thList.usDeclTotal.value"></el-table-column>
            </el-table>
            <!--分页-->
            <el-row class='sys-page-list'>
              <el-col :span="24" align="right">
                <page-box @change="getTableData()" :pagination.sync='paginationInit' key="exportSt"></page-box>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
    </div>
    <!-- 主显示框 end-->
    <!-- 下载弹窗 -->
    <el-dialog :modal-append-to-body='false' title="下载报表" :close-on-click-modal="false" :append-to-body="true" class="set-dialog" :visible.sync="downloadVisable" width="40%" :before-close="handleClose">
      <download-detail iEFlag="E" v-if="downloadVisable"></download-detail>
    </el-dialog>
    <!-- 下载弹窗 end -->
  </section>
</template>
<script>
import util from '../../../../common/util'
import downloadDetail from './downloadDetail.vue'
import {tableHeadFieldList} from './utils/tableHeadFields'
export default {
  components: {
    downloadDetail
  },
  data () {
    return {
      // 存放查询检索表单数据
      dates: ['', ''],
      goods: [], // 物料
      corps: [], // 公司
      trans: [], // 运输方式
      vies: [], // 监管方式
      selectGoodsName: [],
      QueryForm: {
        declTrnrel: '0',
        dateFlag: 'DAY',
        startDate: '',
        endDate: '',
        hsCodes: [], // 商品编码
        iEFlag: 'E',
        graininess: 1,
        tradeCoScc: '',
        trafMode: '', // 运输方式
        tradeMode: '', // 监管方式
        customMaster: '', // 申报地海关
        status: '1',
        hsCode: '' // 商品编号
      },
      entrusters: [], // 委托客户
      graininess: [
        {
          label: '月',
          value: 2
        },
        {
          label: '日',
          value: 1
        }, {
          label: '周',
          value: 0
        }],
      dateConfig: '30',
      chartType: '1',
      resultChartData: {},
      resetChartData: '',
      resultList: [], // 存放列表数据
      tableNameList: {
        tableNames: [
          'SAAS_CUSTOMS_REL' // 海关关区
        ]
      }, // 字典标明
      cusCustomsCodeList: [],
      thList: {}, // 表头字段
      userId: '', // 用户id
      downloadVisable: false // 下载进度弹窗
    }
  },
  created () {
    this.handleTableHeadFields()
    this.dates = [util.getNdayDate(new Date(), -29), new Date()]
    this.getCommonParam()
    this.queryUserInfo()
    this.getEntrus()
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
    handleTableHeadFields () {
      let list = util.simpleClone(tableHeadFieldList)
      list['iEPortValue'].fieldName = '出境关别'
      list['ownerName'].fieldName = '生产销售单位'
      delete list['overseasConsignorEname']
      this.thList = list
    },
    getDataFromStorage () {
      this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL'))
    },
    getEntrus () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/dec/decReport/getEntrusters',
        data: 'E',
        isPageList: false,
        router: this.$router,
        success: (res) => {
          this.entrusters = res.result
        }
      })
    },
    // 判断缓存中是否有数据
    getCommonParam () {
      let par = this.tableNameList.tableNames
      this.$store.dispatch('ajax', {
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          this.getDataFromStorage()
        },
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        router: this.$router,
        success: (res) => {
          this.getDataFromStorage()
        }
      })
    },
    // 导出excel
    getexcel () {
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      } else {
        this.QueryForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      let thList = []
      let list = util.simpleClone(this.thList)
      let theadList = Object.values(list)
      theadList.forEach(e => {
        if (e.value) {
          delete e.value
          thList.push(e)
        }
      })
      // if (this.QueryForm.hsCodes.length === 0) {
      //   this.$message({
      //     message: '请至少选择一个物料',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/exportDecIntegratedCount',
        data: {decIntegratedCountConditionVO: {...this.QueryForm, page: this.paginationInit}, exportFieldVOs: thList},
        isPageList: false,
        router: this.$router,
        success: (res) => {
          // if (util.isEmpty(res.result)) {
          //   this.$message({
          //     message: '该查询条件下没有可导出',
          //     type: 'warning'
          //   })
          // } else {
          //   window.open(res.result, '_blank')
          this.$confirm('报表文件生成中，请点击下载报表按钮查看进度。', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            type: 'warning'
          }).then(() => {
          }).catch(() => {
          })
          // }
        }
      })
    },
    // 获取公共字典list
    getTrade () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {tableNames: [
          'SAAS_TRANSPORT_TYPE', // 运输方式
          'SAAS_TRADE' // 监管方式
        ]},
        router: this.$router,
        success: (res) => {
          this.vies = res.result.SAAS_TRADE
          this.trans = res.result.SAAS_TRANSPORT_TYPE
        }
      })
    },
    // 获取物料
    getGoods () {
      this.goods = []
      this.QueryForm.hsCodes = []
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/getGoods',
        data: this.QueryForm.tradeCoScc,
        router: this.$router,
        success: (res) => {
          for (let a = 0; a < res.result.length; a++) {
            if (res.result[a]) {
              this.goods.push(res.result[a])
            }
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
          // if (res.result.length > 0) {
          //   this.QueryForm.tradeCoScc = res.result[0].code
          // } else {
          //   this.$message({
          //     message: '暂无公司',
          //     type: 'warning'
          //   })
          // }
          // this.getGoods()
        }
      })
    },
    doInit () {
      this.getCorp()
      this.getTrade()
    },
    search () {
      this.getTableData(this.$store.state.pagination)
    },
    querySearch (queryString, cb) {
      // 大于4位数才开始查询
      if (queryString.length < 4) {
        let back = []
        cb(back)
        return
      }
      let param = {
        'hsCode': queryString
      }
      this.$post({
        url: 'API@/dec-common/dec/common/getHsCode',
        data: param,
        success: (res) => {
          let back = []
          let codeList = []
          if (res.result && res.result.length > 0) {
            for (let i in res.result) {
              codeList.push({
                value: res.result[i]
              })
            }
            cb(codeList.slice(0, 10))
          } else {
            cb(back)
          }
        }
      })
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      this.QueryForm.hsCode = item.value
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
      // if (this.QueryForm.hsCodes.length === 0) {
      //   this.$message({
      //     message: '请至少选择一个物料',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/decIntegratedCount',
        data: {...this.QueryForm, page: pagination || this.paginationInit},
        isPageList: true,
        router: this.$router,
        success: (res) => {
          this.paginationInit = res.page
          if (!util.isEmpty(res.result)) {
            this.exportExcel = true
          }
          this.resultList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 日期切换
    datesChange (value) {
      let days = -(parseInt(value) - 1)
      this.dates = [util.getNdayDate(new Date(), days), new Date()]
    },
    // 查询当前登录人信息
    queryUserInfo () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/login/getLoginUserInfo',
        data: {},
        router: this.$router,
        success: (res) => {
          this.userId = res.result.userId
          if (!util.isEmpty(this.userId)) {
            let fieldList = window.localStorage.getItem('EXPORT_ST' + this.userId)
            if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
              let list = JSON.parse(fieldList)
              if (this.compareFieldList(this.thList, list)) {
                this.thList = JSON.parse(fieldList)
              } else {
                window.localStorage.setItem('EXPORT_ST' + this.userId, JSON.stringify(this.thList))
              }
            }
          }
        }
      })
    },
    // 对比两个数组里的值是否一样
    compareFieldList (orig, compare) {
      if (orig.length === compare.length) {
        for (let i in orig) {
          if (orig[i].fieldName !== compare[i].fieldName) {
            return false
          }
        }
        return true
      } else {
        return false
      }
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      window.localStorage.setItem('EXPORT_ST' + this.userId, JSON.stringify(this.thList))
    },
    // 下载文件
    download () {
      this.downloadVisable = true
    },
    // 关闭弹窗
    handleClose () {
      this.downloadVisable = false
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
.mg-b-18{
  margin-bottom: 18px;
}
.dec-query-table .el-table--mini {
  font-size: 14px;
}
.sys-main /deep/.el-form-item__label {
  text-align: left !important;
}
@media only screen and (max-device-width: 767px) and (-webkit-min-device-pixel-ratio: 2) {
  .sys-fr{
    float: none;
  }
}
</style>
