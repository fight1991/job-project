<template>
  <section class='sys-main flatList'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.six"  :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="账单企业">
              <el-autocomplete style="width:100%;"
                class="inline-input" :maxlength="30" clearable
                v-model="QueryForm.settleCompanyName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                placeholder="请选择">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="收付类型">
              <el-select v-model="QueryForm.feeFlag" size="mini" clearable  style="width:100%;">
                <el-option key="0" :label="'应收'" :value="true"></el-option>
                <el-option key="1" :label="'应付'" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="币制">
              <!-- <el-select  v-model="QueryForm.curr" placeholder="币制"
                filterable clearable remote default-first-option
                @focus="tipsFill('currList','SAAS_CURR')"
                :remote-method="checkParamsList"
                style="width:100%">
                <el-option
                  v-for="item in currList"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select> -->
              <el-input v-model="QueryForm.curr" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="平账状态">
              <el-select v-model="QueryForm.flatStatus" size="mini" clearable style="width:100%;">
                <el-option key="0" :label="'未平账'" :value="0"></el-option>
                <el-option key="1" :label="'已平账'" :value="1"></el-option>
                <el-option key="2" :label="'部分平账'" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="平账编号">
              <el-select  v-model="QueryForm.flatNo" placeholder="请选择"
                filterable clearable remote default-first-option
                :remote-method="getFlatNoByLocal"
                style="width:100%">
                <el-option
                  v-for="(item, index) in flatNoList"
                  :key="'item' + index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="账单生成日期">
              <el-date-picker
                style="width:100%"
                v-model="dates"
                type="daterange"
                align="right"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                 end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单号">
              <el-input size="mini" clearable v-model="QueryForm.decNo" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提单号">
              <el-input size="mini" clearable v-model="QueryForm.billNo" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
      <el-row class="query-btn" style="text-align:center">
        <el-button size="mini" type="primary" @click="getBillList($store.state.pagination)">查询</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" :disabled="unflatOptionIds.data.length === 0 || !unflatOptionIds.isHas" class="list-btns list-icon-pa" @click="entryDateIsShow = true"><i></i>平账</el-button>
        <el-button size="mini" class="list-btns list-icon-paR" @click="goToRecord"><i></i>平账记录</el-button>
        <el-button size="mini" :disabled="flatOptionIds.data.length === 0 || !flatOptionIds.isHas" class="list-btns list-icon-rollback" @click="cancelFlatAcccount"><i></i>撤销平账</el-button>
      </el-row>
      <el-table class='sys-table-table' align="left" size="mini"
        :data="billTableList" border highlight-current-row height="530px" ref="billTable"
        @select="selectParentRow"
        @select-all="selectParentRowAll"
        @expand-change="expandChange">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column type="expand" width="50" label="展开">
          <!-- 展开项 -->
          <template slot-scope="scope">
            <el-table class='sys-table-table' size="mini"
              :ref="'childrenTable' + scope.row.unique"
              v-if="scope.row.options && scope.row.options.length > 0" align="left"
              :data="scope.row.options" border
              @select="((select, row) => {selectChildrenRow(select, row, scope.row)})"
              @select-all="((select) => {selectChildrenRowAll(select, scope.row)})">
              <el-table-column type="selection" width="45">
              </el-table-column>
              <el-table-column label="平账编号" min-width="140" prop="flatNo">
                <template slot-scope="scope">
                  {{scope.row.flatNo || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="接单编号" min-width="140" prop="orderNo">
                <template slot-scope="scope">
                  {{scope.row.orderNo || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="报关单号" min-width="140" prop="decNo">
                <template slot-scope="scope">
                  {{scope.row.decNo || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="提单号" min-width="140" prop="billNo">
                <template slot-scope="scope">
                  {{scope.row.billNo || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="费用项" min-width="100" prop="feeOptionName">
              </el-table-column>
              <el-table-column label="金额" min-width="100" prop="taxPrice" align="right">
              </el-table-column>
              <el-table-column label="委托企业" min-width="100" prop="entrustCompanyName">
                <template slot-scope="scope">
                  {{scope.row.entrustCompanyName || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="开航/放行日" min-width="100" prop="sailDay" align="center">
                <template slot-scope="scope">
                  {{scope.row.sailDay || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="平账状态" min-width="80" prop="flatStatusValue" align="right">
              </el-table-column>
              <el-table-column label="平账时间" min-width="160" prop="flatDate" align="center">
                <template slot-scope="scope">
                  {{scope.row.flatDate || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="入账时间" min-width="100" prop="entryDate" align="center">
                <template slot-scope="scope">
                  {{scope.row.entryDate || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="操作人" min-width="100" prop="flatUserName" align="center">
                <template slot-scope="scope">
                  {{scope.row.flatUserName || '-'}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="账单企业" min-width="150" prop="settleCompanyName">
        </el-table-column>
        <el-table-column label="收付类型" min-width="80" prop="feeFlagValue" align="center">
        </el-table-column>
        <el-table-column label="币制" min-width="80" prop="curr" align="center">
        </el-table-column>
        <el-table-column label="含税总额" min-width="80" prop="taxPrice" align="right">
          <template slot-scope="scope">
            {{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="已平账金额" min-width="100" prop="isTaxPrice" align="right">
          <template slot-scope="scope">
            {{scope.row.isTaxPrice && scope.row.isTaxPrice.toLocaleString() || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="待平账金额" min-width="100" prop="waitTaxPrice" align="right">
          <template slot-scope="scope">
            {{scope.row.waitTaxPrice && scope.row.waitTaxPrice.toLocaleString() || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="账单生成时间" min-width="160" prop="createDate" align="center">
        </el-table-column>
        <el-table-column label="平账状态" min-width="100" prop="flatStatusValue" align="center">
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='paginationInit' @change="getBillList"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 日期弹框 -->
    <el-dialog
      title="平账"
      @close="resetDialog"
      @open="openDialog"
      :visible.sync="entryDateIsShow"
      :modal-append-to-body="false"
      :close-on-click-modal='false' width="460px">
      <div  class="dec-div">
        <!-- <div class="topFlag flex">
          <img src="@/assets/img/warning.png" alt="">
          <div class="text">请填写对应的入账日期</div>
        </div> -->
        <el-form size="mini" :label-width="labelFormWidth.five" ref="dialogForm" :model="submitForm">
          <el-row class="accountDate">
            <el-col :span="24">
              <el-form-item label="入账日期" prop='entryDate' :rules="{required: true, message: '请选择入账日期', trigger: 'change'}">
                <el-date-picker
                  style="100%"
                  v-model="submitForm.entryDate"
                  align="center"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder=""
                  :picker-options="pickerOptions2">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="flatNo">
            <el-col :span="24">
              <el-form-item label="平账编号">
                <el-select  v-model="submitForm.flatNo" placeholder="请选择平账编号,否则系统自动生成"
                  filterable clearable remote default-first-option
                  :remote-method="getFlatNoByLocal">
                  <el-option
                    v-for="(item, index) in flatNoList"
                    :key="'item' + index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="query-btn dialog-btn" style="text-align:center">
          <el-button size="mini" type="primary" @click="createBanlance">确认</el-button>
          <el-button size="mini" @click="cancelBtn">取消</el-button>
        </el-row>
      </div>
    </el-dialog>
  </section>
</template>

<script>
// import { mapState } from 'vuex'
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      dates: '',
      flatNoList: [],
      flatNo: '',
      QueryForm: {
        startDate: '', // 平账开始时间
        endDate: '',
        flatUserName: '', // 平账人
        flatStatus: '', // 0未平账1已平账2部分平账
        feeFlag: '', // 应收true，应付false
        curr: 'CNY', // 币制
        settleCompanyName: '', // 账单企业
        flatNo: '',
        decNo: '', // 报关单号
        billNo: '' // 提单号
      },
      entryDateIsShow: false,
      submitForm: {
        entryDate: '',
        flatNo: ''
      },
      billTableList: [],
      accountBillOptionIds: {}, // 费用项id 实现不同table之间联动
      // 查询的字典字段
      tableNameList: {
        tableNames: [
          'SAAS_CURR' // 币制
        ]
      },
      currList: [],
      selectObj: {
        obj: '',
        params: ''
      },
      flatIsDisabled: true,
      paginationInit: '',
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
  computed: {
    unflatOptionIds () { // 未平账
      return this.filterData(0)
    },
    flatOptionIds () { // 已平账
      return this.filterData(1)
    }
  },
  created () {
    this.getCommonParam()
    this.getSettleCompanyInfo()
    this.getFlatNoList()
    this.getBillList(this.$store.state.pagination)
  },
  methods: {
    // 过滤指定平账状态的accountBillOptionId
    filterData (status) {
      let tempArr = {
        isHas: true,
        data: []
      }
      if (this.accountBillOptionIds && JSON.stringify(this.accountBillOptionIds !== '{}')) {
        for (let k in this.accountBillOptionIds) {
          this.accountBillOptionIds[k].forEach(v => {
            if (v.flatStatus === status) {
              tempArr.data.push(v.accountBillOptionId)
            } else {
              tempArr.isHas = false
            }
          })
          if (!tempArr.isHas) break
        }
      }
      return tempArr
    },
    // 获取账单企业列表
    getSettleCompanyInfo () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/getSettleCompanyInfo',
        data: '',
        router: this.$router,
        success: ({result}) => {
          this.settleCompanyList = result || []
        }
      })
    },
    querySearch (queryString, cb) {
      let results = []
      if (this.settleCompanyList.length === 0) return cb(results)
      let restaurants = this.settleCompanyList
      if (queryString.trim().length > 1) {
        results = restaurants.filter(v => {
          return (v && v.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
        })
      }
      if (results.length === 0) return cb(results)
      let tempArr = results.map(item => ({value: item}))
      cb(tempArr)
    },
    // 判断缓存中是否有数据
    getCommonParam () {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map)
      }
    },
    // 获取公共字典list
    getCommonParams (datas) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
        }
      })
    },
    checkParamsList (query) {
      if (query !== '') {
        let keyValue = query.toString().trim()
        let list = JSON.parse(localStorage.getItem(this.selectObj.params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          this[this.selectObj.obj] = list.slice(0, 30)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          this[this.selectObj.obj] = filterList.slice(0, 30)
        }
      } else {
        if (!util.isEmpty(JSON.parse(localStorage.getItem(this.selectObj.params)))) {
          this[this.selectObj.obj] = JSON.parse(localStorage.getItem(this.selectObj.params)).slice(0, 30)
        }
      }
    },
    // 创建字典参数列表
    tipsFill (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 获取平账对账单列表
    getBillList (pagination) {
      if (this.dates && this.dates.length > 0) {
        this.QueryForm.startDate = this.dates[0]
        this.QueryForm.endDate = this.dates[1]
      } else {
        this.QueryForm.startDate = ''
        this.QueryForm.endDate = ''
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/balance/getAccountBills',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          if (res.result && res.result.length > 0) {
            res.result.forEach(v => {
              v.unique = v.curr + v.accountBillId
              v.options.forEach(item => {
                item.unique = v.curr + v.accountBillId
              })
            })
            this.billTableList = res.result
          } else {
            this.billTableList = []
          }
          this.accountBillOptionIds = {}
        }
      })
    },
    // 重置查询条件
    resetForm () {
      this.QueryForm = {
        startDate: '',
        endDate: '',
        flatUserName: '',
        flatStatus: '',
        feeFlag: '',
        curr: 'CNY',
        settleCompanyName: '',
        flatNo: '',
        decNo: '',
        billNo: ''
      }
      this.dates = ''
    },
    // 将json字符串转换成字符串
    jsonToString (json) {
      let obj = JSON.parse(json)
      let arr = []
      for (let k in obj) {
        arr.push(k + ':' + obj[k].toLocaleString())
      }
      return arr.join(' + ')
    },
    // 勾选父表格 单行
    selectParentRow (parent, row) {
      if (parent && parent.length === 0) {
        this.accountBillOptionIds = {}
        this.$refs['childrenTable' + row.unique] && this.$refs['childrenTable' + row.unique].clearSelection()
        return
      }
      this.$refs['childrenTable' + row.unique] && this.$refs['childrenTable' + row.unique].clearSelection()
      let tempObj = {}
      // 如果有 是通过子类表格选择的 则保留不置为{}
      for (let k in this.accountBillOptionIds) {
        if (!k) break
        if (this.accountBillOptionIds[k][0] && this.accountBillOptionIds[k][0].mySon) {
          tempObj[k] = this.accountBillOptionIds[k]
        }
      }
      this.accountBillOptionIds = tempObj
      parent.forEach(item => {
        // 存储费用项id数据
        this.accountBillOptionIds[item.unique] = item.options
        this.$refs['childrenTable' + item.unique] && this.$refs['childrenTable' + item.unique].clearSelection()
        item.options.forEach(v => {
          this.$refs['childrenTable' + item.unique] && this.$refs['childrenTable' + item.unique].toggleRowSelection(v, true)
        })
      })
    },
    // 勾选父表格 全选
    selectParentRowAll (parentAll) {
      this.accountBillOptionIds = {}
      if (parentAll && parentAll.length === 0) {
        // 子表格清空选中状态
        this.billTableList.forEach(v => {
          this.$refs['childrenTable' + v.unique] && this.$refs['childrenTable' + v.unique].clearSelection()
        })
        return
      }
      parentAll.forEach(item => {
        this.accountBillOptionIds[item.unique] = item.options
        item.options.forEach(v => {
          this.$refs['childrenTable' + v.unique] && this.$refs['childrenTable' + v.unique].toggleRowSelection(v, true)
        })
      })
    },
    // 勾选子表单 单行
    selectChildrenRow (child, row, parent) {
      // 如果child的长度===父options的长度 说明全选了
      if (child.length === parent.options.length) {
        this.$refs['billTable'].toggleRowSelection(parent, true)
      } else {
        this.$refs['billTable'].toggleRowSelection(parent, false)
        // 添加子类标识
        if (child.length > 0) {
          child[0]['mySon'] = true
        }
      }
      this.accountBillOptionIds[row.unique] = child
      this.$delete(this.accountBillOptionIds, row.unique)
      this.$set(this.accountBillOptionIds, row.unique, child)
    },
    // 勾选子表单 全选
    selectChildrenRowAll (children, parent) {
      if (children.length > 0) { // 全选 找到父行
        this.accountBillOptionIds[parent.unique] = children
        this.$refs['billTable'].toggleRowSelection(parent, true)
      } else { // 取消全选 找到父行?
        this.$refs['billTable'].toggleRowSelection(parent, false)
        this.accountBillOptionIds[parent.unique] = []
      }
      this.$delete(this.accountBillOptionIds, parent.unique)
      this.$set(this.accountBillOptionIds, parent.unique, children)
    },
    // 展开行发生变化
    expandChange (row) {
      // 先点击展开项, 字表不全选, 关闭展开按钮再打开
      if (this.accountBillOptionIds[row.unique] && this.accountBillOptionIds[row.unique].length > 0) {
        if (this.accountBillOptionIds[row.unique][0].mySon) {
          this.accountBillOptionIds[row.unique].forEach(v => {
            this.$nextTick(() => {
              this.$refs['childrenTable' + row.unique] && this.$refs['childrenTable' + row.unique].toggleRowSelection(v, true)
            })
          })
        } else { // 如果父行已经勾选了,则子表全选,不存在mySon
          row.options.forEach(v => {
            this.$nextTick(() => {
              this.$refs['childrenTable' + row.unique] && this.$refs['childrenTable' + row.unique].toggleRowSelection(v, true)
            })
          })
        }
      }
    },
    // 生成平账
    createBanlance () {
      let flag = true
      this.$refs['dialogForm'].validate(valid => {
        if (!valid) {
          flag = false
        }
      })
      if (!flag) return
      this.entryDateIsShow = false
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/balance/create',
        data: {
          accountBillOptionIds: this.unflatOptionIds.data,
          ...this.submitForm
        },
        router: this.$router,
        success: () => {
          this.$message({
            type: 'success',
            message: '平账成功'
          })
          if (!this.submitForm.flatNo) {
            this.getFlatNoList()
          }
          this.flatNoList = []
          this.getBillList(this.$store.state.pagination)
          this.accountBillOptionIds = {}
        }
      })
    },
    openDialog () {
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    resetDialog () {
      this.submitForm = {
        entryDate: '',
        flatNo: ''
      }
    },
    cancelBtn () {
      this.submitForm = {
        entryDate: '',
        flatNo: ''
      }
      this.entryDateIsShow = false
    },
    // 路由到平账记录
    goToRecord () {
      this.$router.push({
        name: 'flatManage-recordList'
      })
    },
    getFlatNoByLocal (query) {
      if (!query) return
      if (localStorage.getItem('flagNo')) {
        let tempArr = JSON.parse(localStorage.getItem('flagNo'))
        if (tempArr.length === 0) return
        if (query === ' ') {
          this.flatNoList = tempArr.slice(0, 20)
        } else {
          let temp = tempArr.filter(v => v.includes(query))
          this.flatNoList = temp.slice(0, 20)
        }
      }
    },
    // 获取平账编号列表
    getFlatNoList () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/balance/getflatNo',
        data: '',
        router: this.$router,
        success: ({result}) => {
          if (Array.isArray(result)) {
            localStorage.setItem('flagNo', JSON.stringify(result))
          }
        }
      })
    },
    // 撤销平账
    cancelFlatAcccount () {
      this.$confirm('请确认是否要撤销平账?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: 'API@saas-finance/balance/revoke',
          data: {
            accountBillOptionIds: this.flatOptionIds.data
          },
          router: this.$router,
          success: res => {
            this.$message({
              type: 'success',
              message: '撤销成功'
            })
            this.getFlatNoList()
            this.flatNoList = []
            this.accountBillOptionIds = {}
            this.getBillList(this.$store.state.pagination)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.query-condition {
  background-color: #fff;
  padding: 20px;
}
.table-btn {
  padding-bottom: 12px;
}
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
.accountDate {
  padding: 0 30px 0 20px;
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.flatNo {
  padding: 0 30px 0 20px;
  .el-select {
    width: 100%;
  }
}
</style>
