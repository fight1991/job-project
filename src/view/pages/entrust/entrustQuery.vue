<template>
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <el-form :label-width="labelFormWidth.four" :model="QueryForm" size="mini" ref="QueryForm" :rules="rules">
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="委托编号">
              <el-input v-model="QueryForm.entrustCode" maxlength="20" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提运单号">
              <el-input v-model="QueryForm.billNo" maxlength="32" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="受托企业">
              <el-select size="mini" filterable v-model="QueryForm.beEntrustCompanyName" clearable>
                <el-option
                  v-for="item in corpList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="件数" prop="packNo">
              <el-input v-model="QueryForm.packNo" maxlength="9" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="运输方式">
              <el-select size="mini" filterable v-model="QueryForm.trafMode" clearable>
                <el-option
                  v-for="item in paramsOptions['SAAS_TRANSPORT_TYPE']"
                  :key="item.codeField"
                  :label="item.codeField+'-'+item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="委托日期" style="height:28px;">
              <el-date-picker v-model="dates" style="width:100%;vertical-align:middle;"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托状态">
              <el-select size="mini" filterable v-model="QueryForm.entrustStatus" clearable>
                <el-option
                  v-for="item in statusList"
                  :key="item.value+'entrustStatus'"
                  :label="item.value+'-'+item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="创建人">
              <el-select size="mini" filterable v-model="QueryForm.createUser" clearable>
                <el-option
                  v-for="item in postPersonList"
                  :key="item.codeField+'person'"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托业务">
              <el-select size="mini" filterable v-model="QueryForm.entrustBusiness" clearable>
                <el-option
                  v-for="item in businessList"
                  :key="item.value+'entrustBusiness'"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="query-btn" :gutter="50">
          <el-col :span="24" align="center">
            <el-button size="mini" type="primary" style="padding: 7px 20px;" @click="search">查询</el-button>
            <el-button size="mini" style="padding: 7px 20px;" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-add" style="margin-right: 10px!important;" @click="goToPage('new', 'add')"><i></i>新增</el-button>
        <el-button size="mini" class="list-btns list-icon-declare" style="margin-right: 10px!important;" @click="submitEntrust" :disabled="isSubmit"><i></i>提交</el-button>
        <el-button size="mini" class="list-btns list-icon-look" @click="openCdDetail"><i></i>查看相关数据</el-button>
        <div class="airvehicle-list-drop" style="float: right;">
          <el-popover popper-class="airvehicle-table-popper">
            <ul>
              <li v-for="(item,index) in thList" :key="index">
                <el-checkbox size="mini" v-model="item.value" @change="columnFieldChange">{{item.label}}</el-checkbox>
              </li>
            </ul>
            <el-button size="mini" class="list-btns list-btn-drop" icon="list-icon-dropdown" slot="reference"></el-button>
          </el-popover>
        </div>
      </el-row>
      <el-table class='sys-table-table dec-table order-table' :data="resultList" border highlight-current-row size="mini" @selection-change="selectFun" height="408px">
        <el-table-column type="selection" width="37" align="center"></el-table-column>
        <el-table-column label="委托编号" min-width="150" align="left" v-if="thList[0].value">
          <template slot-scope="scope">
            {{scope.row.entrustCode}}
          </template>
        </el-table-column>
        <el-table-column label="委托状态" min-width="100" align="left" v-if="thList[1].value">
          <template slot-scope="scope">
            {{scope.row.entrustStatusValue}}
          </template>
        </el-table-column>
        <el-table-column label="受托企业" min-width="230" align="left" v-if="thList[2].value">
          <template slot-scope="scope">
            {{scope.row.beEntrustCompanyName}}
          </template>
        </el-table-column>
        <el-table-column label="委托业务" min-width="150" align="left" v-if="thList[3].value">
          <template slot-scope="scope">
            {{scope.row.entrustBusinessValue}}
          </template>
        </el-table-column>
        <el-table-column label="手(账)册编号" min-width="150" align="left" v-if="thList[4].value">
          <template slot-scope="scope">
            {{scope.row.manualNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="提运单号" min-width="150" align="left" v-if="thList[5].value">
          <template slot-scope="scope">
            {{scope.row.billNo}}
          </template>
        </el-table-column>
        <el-table-column label="件数" min-width="100" align="right" v-if="thList[6].value">
          <template slot-scope="scope">
            {{scope.row.packNo}}
          </template>
        </el-table-column>
        <el-table-column label="毛重" min-width="100" align="right" v-if="thList[7].value">
          <template slot-scope="scope">
            {{scope.row.grossWt}}
          </template>
        </el-table-column>
        <el-table-column label="运输方式" min-width="150" align="left" v-if="thList[8].value">
          <template slot-scope="scope">
            {{scope.row.trafModeValue}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template slot-scope="scope">
            <div class="order-list-btns">
              <a href="javascript:void(0)" class="list-icon-edit border-0" title="编辑" v-if="scope.row.entrustStatus == '1'" @click="goToPage(scope.row, 'edit')"><i class='dec-i'></i></a>
              <a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click="goToPage(scope.row, 'view')"><i class='dec-i'></i></a>
              <a href="javascript:void(0)" class="list-icon-statusH border-0" title="状态跟踪" v-if="scope.row.entrustStatus !== '1'" @click="statusQuery(scope.row)"><i class='dec-i'></i></a>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
          <page-box @change="getTableData()"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 查看相关数据弹窗 -->
    <el-dialog :modal-append-to-body='false' title="查看相关数据" :visible.sync="detailVisible" class="entrust-dialog" width="45%" :close-on-click-modal="false" v-loading="$store.state.loading">
      <entrust-detail :data="formData" v-if="detailVisible"></entrust-detail>
    </el-dialog>
    <!-- 查看相关数据弹窗 end -->
  </section>
</template>
<script>
import util from '@/common/util'
import entrustDetail from './component/detail.vue'
export default {
  components: { entrustDetail },
  data () {
    return {
      dates: ['', ''],
      QueryForm: {
        entrustCode: '',
        billNo: '',
        beEntrustCompanyName: '',
        packNo: '',
        trafMode: '',
        startDate: '',
        endDate: '',
        entrustStatus: '',
        entrustBusiness: '',
        iEFlag: ''
      },
      iEFlag: 'import', // 进出口标识
      rules: {
        packNo: [{validator: this.checkVal, message: '请输入不超过9位的数字', trigger: 'blur'}]
      },
      ruleRegx: {
        'packNo': '^\\d{1,9}$|^$' // 件数
      },
      paramsOptions: [],
      statusList: [{
        value: '1',
        label: '暂存'
      }, {
        value: '2',
        label: '待接单'
      }, {
        value: '3',
        label: '已接单'
      }], // 状态数据
      postPersonList: [], // 创建人数据
      businessList: [{
        value: 'dec',
        label: '报关单'
      }, {
        value: 'invt',
        label: '核注清单'
      }, {
        value: 'log',
        label: '物流作业'
      }], // 委托业务数据
      resultList: [], // 表格数据
      thList: [{
        value: true,
        label: '委托编号'
      }, {
        value: true,
        label: '委托状态'
      }, {
        value: true,
        label: '受托企业'
      }, {
        value: true,
        label: '委托业务'
      }, {
        value: true,
        label: '手(账)册编号'
      }, {
        value: true,
        label: '提运单号'
      }, {
        value: true,
        label: '件数'
      }, {
        value: true,
        label: '毛重'
      }, {
        value: true,
        label: '运输方式'
      }], // 表头
      pickerOptions2: {
        shortcuts: [{
          text: '当天',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            let week = start.getDay()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * week)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            let monthDay = start.getDate() - 1
            start.setTime(start.getTime() - 3600 * 1000 * 24 * monthDay)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      detailVisible: false,
      isSubmit: false, // 是否可以提交
      selectData: [],
      formData: {
        entrustHeadPid: '',
        iEFlag: '',
        packNo: '',
        grossWt: ''
      },
      corpList: [],
      userId: ''
    }
  },
  created () {
    this.dates = [util.getNdayDate(new Date(), -7), new Date()]
    this.iEFlag = (this.$route.meta.iEFlag === 'import' ? 'I' : 'E')
    this.getCommonParams()
    this.getUserUnderCrop()
    this.getCorp()
    this.getUserInfo()
  },
  mounted () {
    this.search()
  },
  methods: {
    // 获取公共字典list
    getCommonParams () {
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': [
            'SAAS_TRANSPORT_TYPE' // 运输方式
          ]
        },
        success: (res) => {
          this.paramsOptions = res.result
        }
      })
    },
    // 获取本企业下的人员
    getUserUnderCrop () {
      this.$post({
        url: 'API@/login/corp/getCorpUsers',
        data: {},
        success: (res) => {
          if (res.code === '0000') {
            for (let i in res.result) {
              this.postPersonList.push({
                codeField: res.result[i].userId,
                nameField: res.result[i].userName
              })
            }
          }
        }
      })
    },
    // 获取企业
    getCorp () {
      this.$post({
        url: 'API@/dec-common/ccba/entrust/beEntrustListQuery',
        data: {},
        success: (res) => {
          this.corpList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 校验
    checkVal (rule, value, callback) {
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 查询
    search () {
      this.$store.commit('pageInit')
      this.getTableData()
    },
    // 重置
    reset () {
      this.dates = ['', '']
      this.QueryForm = {
        entrustCode: '',
        billNo: '',
        beEntrustCompanyName: '',
        packNo: '',
        trafMode: '',
        startDate: '',
        endDate: '',
        entrustStatus: '',
        entrustBusiness: '',
        iEFlag: ''
      }
      this.search()
    },
    // 获取表格数据
    getTableData () {
      this.QueryForm.iEFlag = this.iEFlag
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      } else {
        this.QueryForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$post({
        url: 'API@/dec-common/ccba/entrust/entrustListQuery',
        data: this.QueryForm,
        isPageList: true,
        success: (res) => {
          this.resultList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 选择框
    selectFun (val) {
      this.selectData = val
      let flag = false
      for (let i in this.selectData) {
        if (this.selectData[i].entrustStatus !== '1') {
          flag = true
        }
      }
      if (flag) {
        this.isSubmit = true
      } else {
        this.isSubmit = false
      }
    },
    // 页面跳转
    goToPage (data, type) {
      let pid = (type === 'add' ? 'new' : data.entrustHeadPid)
      let title = ''
      if (type === 'view') {
        title = (this.$route.meta.iEFlag === 'import' ? '进口委托' : '出口委托') + '-' + pid
      } else if (type === 'edit') {
        title = (this.$route.meta.iEFlag === 'import' ? '进口委托' : '出口委托') + '-' + pid
      } else {
        title = this.$route.meta.iEFlag === 'import' ? '新增进口委托' : '新增出口委托'
      }
      this.$router.push({
        name: this.$route.meta.iEFlag === 'import' ? 'importEntrustInfo' : 'exportEntrustInfo',
        params: {
          'iEFlag': this.$route.meta.iEFlag,
          'type': type,
          'id': pid,
          'setTitle': title,
          'setId': this.$route.name + type + pid
        }
      })
    },
    // 状态跟踪
    statusQuery (data) {
      this.$router.push({
        name: 'entrustStateTracking',
        params: {
          'iEFlag': this.$route.meta.iEFlag,
          'code': data.entrustCode,
          'setTitle': '状态跟踪-' + data.entrustCode,
          'setId': this.$route.name + data.entrustCode
        }
      })
    },
    // 提交
    submitEntrust () {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请至少选择一条数据',
          type: 'warning'
        })
      } else {
        let data = util.simpleClone(this.selectData)
        for (let i of data) {
          i.entrustType = '1'
        }
        this.$post({
          url: 'API@/dec-common/ccba/entrust/saveEntrust',
          data: data,
          success: (res) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.getTableData()
          }
        })
      }
    },
    // 查看相关数据
    openCdDetail () {
      if (this.selectData.length !== 1) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        })
        return false
      }
      this.formData.entrustHeadPid = this.selectData[0].entrustHeadPid
      this.formData.iEFlag = this.selectData[0].iEFlag
      this.formData.packNo = this.selectData[0].packNo
      this.formData.grossWt = this.selectData[0].grossWt
      this.detailVisible = true
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      this.userId = this.$store.state.userLoginInfo.userId
      if (!util.isEmpty(this.userId)) {
        let fieldList = window.localStorage.getItem('ENTRUST' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          this.thList = JSON.parse(fieldList)
        }
      }
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      window.localStorage.setItem('ENTRUST' + this.userId, JSON.stringify(this.thList))
    }
  }
}
</script>
<style lang="less" scoped>
@import(less) '@/assets/style/common';
.query-main {
  padding: 20px;
  font-size:12px;
  font-family: Arial,Microsoft YaHei,SimSun;
  height: calc(100% - 40px);
  overflow: auto;
}
.query-condition {
  background-color: #fff;
  padding: 20px;
}
.query-table {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}
.op-btn {
  margin-bottom: 12px;
  font-size: 0;
}
.dec-i{
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.border-0 {
  border: 0;
  margin-right: 5px;
}
</style>
