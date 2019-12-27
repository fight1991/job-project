<template>
    <section class='query-main sys-main' style="margin:-20px">
        <div class = "query-condition query-mini" style = 'padding:20px 20px 0px 20px'>
        <el-form :label-width="labelFormWidth.seven" size="mini" >
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="客户代码：">
                {{customerdetail.customCode}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称："  >
                {{customerdetail.customName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="社会信用代码：">
                {{customerdetail.sccCode}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="海关编码：">
                {{customerdetail.tradeCode}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验检疫编码：">
                {{customerdetail.ciqCode}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="联系人：">
                {{customerdetail.contactUser}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式："  >
                {{customerdetail.contactWay}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司地址：">
                {{customerdetail.address}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="所属国：">
                {{customerdetail.customCountryValue}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码："  >
                {{customerdetail.postCode}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="E-MAIL：">
                {{customerdetail.email}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="备注：">
                {{customerdetail.remark}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin:20px;background-color:white;padding:20px;">
        <el-tabs v-model="activeName">
            <el-tab-pane label="代理企业" name="first">
            <el-row>
                <el-button type="primary" class="longButton" style="margin-bottom:5px;" @click="newCorpView = true" size="mini">新增企业</el-button>
            </el-row>
                <el-table class='sys-table-table' border highlight-current-row :header-cell-style="{'text-align':'center'}" size="mini" :data="proxtList" ref="proxtList" style="margin-top:10px">
                <el-table-column label="企业名称" min-width="100">
                <template slot-scope="scope">
                    <div class="text-over-hid" :title="scope.row.proxyCorpName">
                    {{scope.row.proxyCorpName || '-'}}
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="社会信用代码" min-width="100">
                <template slot-scope="scope">
                    <div class="text-over-hid customer-table-c" :title="scope.row.sccCode">
                    {{scope.row.sccCode || '-'}}
                    </div>
                    </template>
                </el-table-column>
                <el-table-column label="海关编码" min-width="130">
                <template slot-scope="scope">
                    <div class="text-over-hid customer-table-c" :title="scope.row.tradeCode">
                    {{scope.row.tradeCode || '-'}}
                    </div>
                </template></el-table-column>
                <el-table-column label="检验检疫编码" min-width="100">
                <template slot-scope="scope">
                    <div class="text-over-hid customer-table-c" :title="scope.row.ciqCode">
                    {{scope.row.ciqCode || '-'}}
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="操作" min-width="40">
                <template slot-scope="scope">
                  <div class='customer-table-c'>
                    <el-button type="text" icon="fa fa-trash-o fa-lg" @click="delectCustomer(scope.row)" title="删除"></el-button>
                  </div>
                </template>
                </el-table-column>
            </el-table>
            <el-row class='sys-page-list mg-b-30'>
                <el-col :span="24" align="right">
                <page-box :pagination='propxpage' @change="queryProxyList()"></page-box>
                </el-col>
            </el-row>
            </el-tab-pane>
            <el-tab-pane label="相关联系人" name="second">
              <el-table class='sys-table-table' border highlight-current-row :header-cell-style="{'text-align':'center'}" size="mini" :data="connectQueryResult" ref="reference"  >
                <el-table-column label="序号" min-width="130" >
                <template slot-scope="scope">
                  <div class='customer-table-c'>
                    {{scope.$index + 1}}
                  </div>
                </template>
                </el-table-column>
                <el-table-column label="姓名" min-width="100">
                <template slot-scope="scope">
                    <div class="text-over-hid customer-table-c" :title="scope.row.userName">
                    {{scope.row.userName || '-'}}
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="手机号" min-width="100">
                <template slot-scope="scope">
                    <div class="text-over-hid customer-table-c" :title="scope.row.mobile">
                    {{scope.row.mobile || '-'}}
                    </div>
                    </template>
                </el-table-column>
                <el-table-column label="邮箱" min-width="130">
                <template slot-scope="scope">
                    <div class="text-over-hid" :title="scope.row.email">
                    {{scope.row.email || '-'}}
                    </div>
                </template></el-table-column>
                <el-table-column label="添加时间" min-width="100">
                <template slot-scope="scope">
                    <div class="text-over-hid customer-table-c" :title="scope.row.addTime">
                    {{formateDate(scope.row.addTime) || '-'}}
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="操作" min-width="40">
                    <template  slot-scope="scope">
                      <div class="customer-table-c">
                        <el-button type="text"  title="详情" icon="fa fa-file-text-o fa-lg" @click="showLinkMan(scope.row)"></el-button>
                      </div>
                    </template>
                </el-table-column>
              </el-table>
              <el-row class='sys-page-list mg-b-30'>
                <el-col :span="24" align="right">
                <page-box :pagination='contpage' @change="getConnectUser()"></page-box>
                </el-col>
            </el-row>
            </el-tab-pane>
            <el-tab-pane label="单量趋势" name="third">
                <div>
                   <el-form label-width="0px">
                    <el-row class='sys-search mg-b-30' :gutter="20">
                    <el-col :span="5">
                        <el-form-item size="mini">
                        <el-select placeholder="公司名称" style="width:100%"  v-model="certTQueryForm.tradeCoScc" @change="changecompany()">
                            <el-option
                            v-for="(item,cindex) in certACorps"
                            :key="item.sccCode +'certACorps'+cindex"
                            :label="item.proxyCorpName"
                            :value="item.sccCode" >
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item size="mini">
                        <el-select v-model="certTQueryForm.iEFlag">
                            <el-option
                            v-for="(item,index) in ports"
                            :key="item.value +'ports'+index"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item size="mini">
                        <el-select clearable  v-model="certTQueryForm.dateFlag">
                            <el-option
                            v-for="item in dateFlag"
                            :key="item.value +'dateFlag'"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item size="mini">
                        <el-date-picker  v-model="certTQueryForm.dates" style="width:100%"
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
                    <el-col :span="6">
                        <el-form-item size="mini">
                        <el-button label="180" type="primary" @click="doCertTquery()">统计</el-button>
                        <el-button label="180" @click="gotoCert()">查看更多</el-button>
                        </el-form-item>
                    </el-col>
                    </el-row>
                    </el-form>
                </div>
                <div class='mg-b-30'>
                    <e-chart :datas='resultChartData' ></e-chart>
                </div>
            </el-tab-pane>
            <el-tab-pane label="商品金额" name="fourth">
                <el-form label-width="0px">
                    <el-row class='sys-search mg-b-30' :gutter="20">
                    <!-- 查询条件 -->
                    <el-col :span="5">
                        <el-form-item size="mini">
                        <el-select clearable placeholder="境内收发货人" style="width:100%" v-model="amountQueryForm.tradeCoScc" @change="getGoods()">
                            <el-option
                            v-for="(item,index) in certACorps"
                            :key="item.sccCode +'feeOptions' + index"
                            :label="item.proxyCorpName"
                            :value="item.sccCode"
                            >
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item size="mini">
                        <el-select placeholder="商品名称" v-model="amountQueryForm.hsCodes"  multiple :multiple-limit='4' style="width:100%" collapse-tags @change="changeGoods()">
                            <el-option
                            v-for="item in goods"
                            :key="item.code +'feeOptions'"
                            :label="item.value"
                            :value="item.code">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item size="mini">
                        <el-select v-model="amountQueryForm.iEFlag">
                            <el-option
                            v-for="item in ports"
                            :key="item.value +'feeOptions'"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item size="mini">
                        <el-date-picker  v-model="amountQueryForm.dates" style="width:100%"
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
                    <el-col :span="2">
                        <el-form-item size="mini">
                        <el-select clearable  v-model="amountQueryForm.graininess">
                            <el-option
                            v-for="item in graininess"
                            :key="item.value +'graininess'"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item size="mini">
                        <el-button label="180" type="primary" @click="certAmountList()">统计</el-button>
                        <el-button label="180" @click="gotoAmount()">查看更多</el-button>
                        </el-form-item>
                    </el-col>
                    </el-row>
                </el-form>
                <div class='mg-b-30'>
                    <e-chart :datas='resultAChartData' ></e-chart>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <el-dialog :modal-append-to-body='false' title="新增企业"
      :visible.sync="newCorpView" @closed='newcorpclosed'>
        <el-form :label-width="labelFormWidth.seven" size="mini" :model="newCorp" ref='newcorpform' :rules='corpRule'>
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="企业名称" prop="proxyCorpName">
               <el-select v-model="newCorp.proxyCorpName" maxlength="70" style="width:100%"
                filterable remote clearable placeholder=" " @change="translatecorp()"
                :remote-method="getcorps"
                allow-create
                @closed='newCorpClosed'
                default-first-option >
                <el-option
                  v-for="item in corps"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="社会信用代码" prop="sccCode">
               <el-input v-model="newCorp.sccCode" :disabled="!!newCorp.proxyCorpId" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="海关编码">
                <el-input v-model="newCorp.tradeCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验检疫编码">
                <el-input v-model="newCorp.ciqCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align:center">
          <el-button type="primary" size="mini" @click="saveProxy">确定</el-button>
          <el-button  size="mini" @click="newCorpView = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :modal-append-to-body='false' title="联系人详情" :visible.sync="linkmanVisible" :close-on-click-modal="false" :append-to-body="true" width="60%">
        <el-form :model="detailForm">
            <el-row class="info-content link-dialog-content">
                <el-col :span="4" class="link-person-name">
                    <el-form-item>
                        <img src="https://www.5itrade.cn/files/CCBA/defaultPic.png" v-if="detailForm.headPhoto === null || detailForm.headPhoto === ''" />
                        <img :src="detailForm.headPhoto" v-else>
                        <span class="fs-18">{{detailForm.userName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="link-dialog-head">
                    <el-form-item label="手机号:" label-width="70px">
                        {{detailForm.mobile}}
                    </el-form-item>
                </el-col>
                <el-col :span="7" class="link-dialog-head">
                    <el-form-item label="邮箱:" label-width="55px">
                        {{detailForm.email}}
                    </el-form-item>
                </el-col>
                <el-col :span="7" class="link-dialog-head">
                    <el-form-item label="添加时间:" label-width="80px">
                        {{detailForm.addTime | date()}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row class="link-detail-content" v-show="Object.keys(corpData).length!==0">
            <el-row>
                <el-col :span="10">企业名称：{{corpData.corpName=== null||corpData.corpName=== '' ? '':corpData.corpName}}</el-col>
                <el-col :span="8">企业类型：{{formatType(corpData.corpType)}}</el-col>
            </el-row>
            <el-row class="link-detail-txt" v-if="corpData.contactWay && corpData.contactWay.length !== 0">
                <el-col :span="20" v-if="!isExpend">
                    <el-row class="mg-t-15 text-ellipsis"><div>收发货地址1: {{corpData.contactWay[0].countryValue+corpData.contactWay[0].provinceValue+corpData.contactWay[0].cityValue+corpData.contactWay[0].address}}</div></el-row>
                </el-col>
                <el-col :span="20" v-else>
                    <el-row class="mg-t-15 text-ellipsis" v-for="(item,index) in corpData.contactWay" :key="index"><div>收发货地址{{index+1}}: {{item.countryValue+item.provinceValue+item.cityValue+item.address}}</div></el-row>
                </el-col>
                <el-col :span="3" v-show="corpData.contactWay.length>1"><div class="link-expend-btn"><el-button size="mini" type="text" @click="expendList">{{expendTxt}}</el-button></div></el-col>
            </el-row>
        </el-row>
    </el-dialog>
    </section>
</template>
<script>
import util from '@/common/util'
import config from '../../../../config/config'
export default {
  name: 'index',
  data () {
    return {
      customerdetail: {},
      selectcorpName: [], // 已选择公司
      corpname: [], // 金额统计 已选公司
      amountQueryForm: {
        dates: [],
        iEFlag: 'ALL',
        graininess: 1,
        hsCodes: []
      }, // 金额统计查询条件
      propxpage: {
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数据条数
        total: 0 // 总条数
      },
      contpage: {
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数据条数
        total: 0 // 总条数
      },
      resultAChartData: {}, // 金额统计数据
      corpData: {},
      activeName: 'first',
      certACorps: [],
      linkmanVisible: false, // 联系人详情显示标识
      newCorpView: false,
      detailForm: {}, // 联系人详情
      expendTxt: '展开',
      connectQueryResult: [], // 相关联系人
      corps: [],
      proxtList: [],
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
      resultChartData: {},
      goods: [], // 商品
      selectGoodsName: [], // 金额统计选择企业
      corpTypeDescList: [
        {
          value: '1',
          text: '生产企业'
        }, {
          value: '3',
          text: '货代'
        }, {
          value: '4',
          text: '报关行'
        }, {
          value: '5',
          text: '贸易企业'
        }, {
          value: '6',
          text: '运输公司'
        }, {
          value: '7',
          text: '仓储'
        }, {
          value: '8',
          text: '报关协会'
        },
        {
          value: '0',
          text: '新外贸运营'
        }
      ],
      corpRule: {
        sccCode: [{required: true, message: '请输入社会信用代码', trigger: 'bulr'}],
        proxyCorpName: [{required: true, message: '请选择企业', trigger: 'bulr'}]
      },
      certTQueryForm: {
        dates: [],
        dateFlag: 'DAY',
        startDate: '',
        endDate: '',
        iEFlag: 'ALL',
        tradeCoScc: ''
      }, // 单量趋势统计
      resultCertTData: [], // 单量趋势统计结果
      resultamountChartData: [], // 金额趋势统计结果
      newCorp: {
        'customId': '',
        'proxyCorpId': '',
        'proxyCorpName': '',
        'sccCode': ''
      }
    }
  },
  created () {
    this.newCorp.customId = parseInt(this.$route.query.customId)
    this.getdetail()
    this.queryProxyList()
    this.amountQueryForm.dates = [util.getNdayDate(new Date(), -29), util.getNdayDate(new Date(), 0)]
    this.certTQueryForm.dates = [util.getNdayDate(new Date(), -29), util.getNdayDate(new Date(), 0)]
  },
  methods: {
    translatecorp () {
      if (typeof this.newCorp.proxyCorpName !== 'string') {
        this.newCorp.sccCode = this.newCorp.proxyCorpName.sccCode
        this.newCorp.tradeCode = this.newCorp.proxyCorpName.tradeCode
        this.newCorp.ciqCode = this.newCorp.proxyCorpName.ciqCode
        this.newCorp.proxyCorpId = this.newCorp.proxyCorpName.corpId
        this.newCorp.proxyCorpName = this.newCorp.proxyCorpName.corpName
      } else {
        this.newCorp.proxyCorpId = ''
      }
    },
    newCorpClosed () {
      this.corps = []
    },
    delectProxy () {
    },
    // 格式化企业类型
    formatType (val) {
      let label = ''
      for (let x in this.corpTypeDescList) {
        if (val === this.corpTypeDescList[x].value) {
          label = this.corpTypeDescList[x].text
          break
        }
      }
      return label
    },
    changecompany () {
      for (let a = 0; a < this.certACorps.length; a++) {
        if (this.certACorps[a].sccCode === this.certTQueryForm.tradeCoScc) {
          this.selectcorpName[0] = this.certACorps[a].proxyCorpName
        }
      }
    },
    // 日期格式化
    formateDate (date) {
      return util.dateFormat(date)
    },
    // 展开
    expendList () {
      this.isExpend = !this.isExpend
      if (this.isExpend) {
        this.expendTxt = '收起'
      } else {
        this.expendTxt = '展开'
      }
    },

    // 金额统计
    certAmountList () {
      if (this.dates === '' || this.dates === null) {
        this.amountQueryForm.startDate = ''
        this.amountQueryForm.endDate = ''
      } else {
        this.amountQueryForm.startDate = util.dateFormat(this.amountQueryForm.dates[0], 'yyyy-MM-dd')
        this.amountQueryForm.endDate = util.dateFormat(this.amountQueryForm.dates[1], 'yyyy-MM-dd')
      }
      if (this.amountQueryForm.hsCodes.length === 0) {
        this.$message({
          message: '至少选择一个商品',
          type: 'warning'
        })
        return
      }
      if (!this.amountQueryForm.tradeCoScc) {
        this.$message({
          message: '查无数据',
          type: 'warning'
        })
        return
      }
      if (this.goods.length === 0) {
        this.$message({
          message: '该公司没有物料',
          type: 'warning'
        })
        return
      }
      this.amountQueryForm.page = {
        pageSize: this.$store.state.pagination.pageSize,
        pageIndex: this.$store.state.pagination.pageIndex
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/decMoneyCount',
        data: this.amountQueryForm,
        router: this.$router,
        isPageList: true,
        success: (res) => {
          let dateList = []
          let corpList = []
          this.resultAChartData = {
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
              data: []
            },
            yAxis: {
              type: 'value'
            },
            series: [
            ]
          }
          if (!util.isEmpty(res.result)) {
            this.pages = res.page
            for (let a = 0; a < this.selectGoodsName.length; a++) {
              for (let item in res.result.decMoneyCountChartVO) {
                corpList.push(res.result.decMoneyCountChartVO[item]['money' + (a + 1)])
                if (a === 0) {
                  dateList.push(res.result.decMoneyCountChartVO[item].date)
                }
              }
              this.resultAChartData.xAxis.data = dateList
              this.resultAChartData.series.push({
                name: this.selectGoodsName[a],
                type: 'line',
                data: util.simpleClone(corpList)
              })
              corpList = []
            }
          }
        }
      })
    },
    gotoAmount () {
      window.localStorage.setItem('queryCond', JSON.stringify(this.amountQueryForm))
      window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].HOST + '/reportCenter/business/amountSt')
    },
    gotoCert () {
      window.localStorage.setItem('queryCond', JSON.stringify(this.certTQueryForm))
      window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].HOST + '/reportCenter/business/trendSt')
    },
    getConnectUser () {
      if (!this.customerdetail.customCorpId) {
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/user/getUserContactsPage',
        data: {corpId: this.customerdetail.customCorpId, page: this.contpage},
        router: this.$router,
        success: (res) => {
          this.connectQueryResult = res.result
          this.contpage = res.page
        }
      })
    },
    // 获取物料
    getGoods () {
      for (let a = 0; a < this.certACorps.length; a++) {
        if (this.certACorps[a].sccCode === this.amountQueryForm.tradeCoScc) {
          this.corpname = this.certACorps[a].proxyCorpName
        }
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/getGoods',
        data: this.amountQueryForm.tradeCoScc,
        router: this.$router,
        success: (res) => {
          this.goods = []
          this.amountQueryForm.hsCodes = []
          for (let a = 0; a < res.result.length; a++) {
            if (res.result[a]) {
              this.goods.push(res.result[a])
            }
          }
          if (this.goods.length > 0) {
            this.amountQueryForm.hsCodes.push(this.goods[0].code)
            this.selectGoodsName = [this.goods[0].value]
          }
        }
      })
    },
    getcorps (query) {
      if (query.length < 2) {
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: query,
          returnProps: ['sccCode', 'tradeCode', 'ciqCode', 'corpId', 'corpName']
        },
        router: this.$router,
        success: (res) => {
          this.corps = res.result
        }
      })
    },
    // 删除代理企业
    delectCustomer (row) {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/deleteProxyCorp',
        data: {
          'customId': row.customId,
          'proxyCorpId': row.proxyCorpId
        },
        router: this.$router,
        success: (res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.queryProxyList()
        }
      })
    },
    showLinkMan (data) {
      this.detailForm = data
      this.$store.dispatch('ajax', {
        url: 'API@/login/user/getUserDetail',
        data: {userId: data.userId},
        router: this.$router,
        success: (res) => {
          this.linkmanVisible = true
          this.corpData = {}
          if (!util.isEmpty(res.result)) {
            if (res.result.length !== 0) {
              if (res.result[0].corps.length !== 0) {
                for (let i of res.result[0].corps) {
                  if (i.defaultCorp === 'true') {
                    this.corpData = i
                  }
                }
              }
            }
          }
        }
      })
    },
    doCertTquery () {
      if (!this.certTQueryForm.tradeCoScc) {
        this.$message({
          message: '查无数据',
          type: 'warning'
        })
        return
      }
      this.certTQueryForm.page = {
        pageSize: this.$store.state.pagination.pageSize,
        pageIndex: this.$store.state.pagination.pageIndex
      }
      if (this.certTQueryForm.dates === '' || this.certTQueryForm.dates === null) {
        this.certTQueryForm.startDate = ''
        this.certTQueryForm.endDate = ''
      } else {
        this.certTQueryForm.startDate = util.dateFormat(this.certTQueryForm.dates[0], 'yyyy-MM-dd')
        this.certTQueryForm.endDate = util.dateFormat(this.certTQueryForm.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-report/decReport/decTrendCount',
        data: this.certTQueryForm,
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
              boundaryGap: true,
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
                if (this.certTQueryForm.iEFlag === 'ALL') {
                  corpList.push(res.result.decTrendCountChartVO[item].aCount ? res.result.decTrendCountChartVO[item].aCount : '0')
                } else if (this.certTQueryForm.iEFlag === 'I') {
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
          }
        }
      })
    },
    // 商品改变
    changeGoods () {
      this.selectGoodsName = []
      for (let a = 0; a < this.amountQueryForm.hsCodes.length; a++) {
        for (let b = 0; b < this.goods.length; b++) {
          if (this.amountQueryForm.hsCodes[a] === this.goods[b].code) {
            this.selectGoodsName.push(this.goods[b].value)
          }
        }
      }
      this.doInit()
    },
    // 保存代理企业
    saveProxy () {
      this.$refs['newcorpform'].validate(valid => {
        if (valid) {
          this.$store.dispatch('ajax', {
            url: 'API@/login/custom-manage/saveCustomProxyCorp',
            data: this.newCorp,
            router: this.$router,
            success: (res) => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.newCorpView = false
              this.queryProxyList()
            }
          })
        }
      })
    },
    queryProxyList () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getProxyCorpList',
        data: {customId: this.newCorp.customId, page: this.propxpage},
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.proxtList = res.result
          if (this.certACorps.length > 0) {
            this.certACorps = [...[this.certACorps[0]], ...this.proxtList]
          } else {
            this.certACorps = [...this.certACorps, ...this.proxtList]
          }
          this.propxpage = res.page
        }
      })
    },
    newcorpclosed () {
      this.corps = []
      this.newCorp = {
        'customId': parseInt(this.$route.query.customId),
        'proxyCorpId': '',
        'proxyCorpName': '',
        'sccCode': ''
      }
    },
    getdetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getCustom',
        data: {
          customId: parseInt(this.$route.query.customId)
        },
        router: this.$router,
        success: (res) => {
          this.customerdetail = res.result
          this.certACorps.push({
            sccCode: res.result.sccCode,
            proxyCorpName: res.result.customName})
          this.amountQueryForm.tradeCoScc = res.result.sccCode
          this.certTQueryForm.tradeCoScc = res.result.sccCode
          this.changecompany()
          this.getGoods()
          this.getConnectUser()
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.index{
  width: 100%;
  height:100%;
}
.customer-table-c{
  text-align: center
}
.query-condition {
    margin:20px 20px;
    background-color: #fff;
    padding: 20px;
  }
  .link-dialog-content{
    .link-dialog-head{
        >div{
            margin: 9px 0;
        }
    }
}
.link-person-name{
    img{
        width: 60px;
        height: 60px;
        margin-right: 10px;
    }
}
.link-detail-txt{
    position: relative;
}
.text-ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.link-detail-content{
    border: 1px solid #d8d8d8;
    padding: 20px;
    max-height: 300px;
    overflow: auto;
}
</style>
