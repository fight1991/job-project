<template>
  <section class='sys-main'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.six" :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="报价名称">
              <el-input v-model="QueryForm.itemName" size="mini" clearable ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托企业">
              <el-autocomplete
                style="width:100%;"
                class="inline-input" :maxlength="30" clearable
                v-model="QueryForm.entrustCompanyName"
                :fetch-suggestions="querySearch"
                placeholder="请选择"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报价含税">
              <el-select v-model="QueryForm.rateFlag" size="mini" clearable  style="width:100%;">
                <el-option key="1" :label="'含税'" :value="true"></el-option>
                <el-option key="0" :label="'不含税'" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="项目独立报价">
              <el-select v-model="QueryForm.singleFlag" size="mini" clearable  style="width:100%;">
                <el-option key="1" :label="'是'" :value="true"></el-option>
                <el-option key="0" :label="'否'" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="创建人">
              <el-input v-model="QueryForm.createUserName" size="mini" clearable :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="创建日期">
               <el-date-picker
                style="width:100%"
                v-model="dates"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
      <el-row class="query-btn" style="text-align:center">
        <el-button size="mini" type="primary" @click="getsOfferList($store.state.pagination)">查询</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-add" @click="newQuotation"><i></i>新增</el-button>
        <el-button size="mini" class="list-btns list-icon-export" @click="exportQuotation"><i></i>导出</el-button>
      </el-row>
      <el-table class='sys-table-table' align="left" size="mini"
        :data="offerTableList" border ref="offerTable"
        highlight-current-row
        @select="chooseSelectBox"
        @row-click="chooseSelectRow"
        @select-all="chooseSelectBoxAll"
        height="530px">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column label="报价名称" min-width="160" prop="itemName">
        </el-table-column>
        <el-table-column label="委托企业" min-width="220" prop="entrustCompanyName">
        </el-table-column>
        <el-table-column label="有效期" width="180" prop="dates" align="center">
        </el-table-column>
        <el-table-column label="项目独立报价" width="110" prop="singleFlagValue" align="center">
        </el-table-column>
        <el-table-column label="报价含税" width="80" prop="rateFlagValue" align="center">
        </el-table-column>
        <el-table-column label="创建人" width="80" prop="createUserName" align="center">
        </el-table-column>
        <el-table-column label="创建时间" width="140" prop="createDate" align="center">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <el-button title="编辑" type="text" v-if="scope.row.createUserId === currentUser" @click.stop="editQuotation(scope.row.quotationId)" class="table-icon list-icon-edit"><i></i></el-button>
            <el-button title="查看" type="text" @click.stop="lookQuotation(scope.row.quotationId)" class="table-icon list-icon-look"><i></i></el-button>
            <el-button title="删除" type="text" v-if="scope.row.createUserId === currentUser" @click.stop="delQuotation(scope.row.quotationId)" class="table-icon list-icon-delete"><i></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='paginationInit' @change="getsOfferList"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      windowWidth: '',
      dates: [],
      quotationIds: [], // 存储报价id数组
      QueryForm: {
        singleFlag: '',
        rateFlag: '',
        itemName: '',
        impexpPortcdNames: '',
        impexpPortcd: '',
        entrustCompanyName: '',
        entrustCompanyId: '',
        dclPlcCuscdNames: '',
        dclPlcCuscd: '',
        createUserName: '',
        createStartDate: '',
        createEndDate: ''
      },
      // 查询的字典字段
      tableNameList: {
        tableNames: [
          'SAAS_CUSTOMS_REL', // 海关关区
          'SAAS_CURR', // 币制
          'SAAS_SEA_UNIT' // 计量单位
        ]
      },
      selectObj: {
        obj: '',
        params: ''
      },
      offerTableList: [],
      impexpPortList: [], // 进出境关别
      dclPlcCusList: [], // 申报地海关
      corpList: [], // 企业列表
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
      }
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'offerManage-list' && to.query.from === 'other') {
        this.getsOfferList(this.$store.state.pagination)
      }
    }
  },
  computed: {
    ...mapState({ // 查看vuex中当前登录的userId
      currentUser (state) {
        return state.userLoginInfo.userId
      }
    }),
    spanNum () {
      return this.windowWidth > 1440 ? 6 : 12
    }
  },
  mounted () {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
  },
  created () {
    this.getcorps()
    this.getCommonParam()
    this.paginationInit = this.$store.state.pagination
    this.getsOfferList(this.$store.state.pagination)
  },
  methods: {
    // 报价列表查询
    getsOfferList (pagination) {
      if (this.dates && this.dates.length > 0) {
        this.QueryForm.createStartDate = this.dates[0]
        this.QueryForm.createEndDate = this.dates[1]
      } else {
        this.QueryForm.createStartDate = ''
        this.QueryForm.createEndDate = ''
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/quotation/gets',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          if (res.result && res.result.length > 0) {
            res.result.forEach(v => {
              v.dates = v.startTime + '~' + v.endTime
            })
            this.offerTableList = res.result
          } else {
            this.offerTableList = []
          }
        }
      })
    },
    // 重置查询条件
    resetForm () {
      this.QueryForm = {
        singleFlag: '',
        rateFlag: '',
        itemName: '',
        impexpPortcdNames: '',
        impexpPortcd: '',
        entrustCompanyName: '',
        entrustCompanyId: '',
        dclPlcCuscdNames: '',
        dclPlcCuscd: '',
        createUserName: '',
        createStartDate: '',
        createEndDate: ''
      }
      this.dates = []
    },
    // 新增报价
    newQuotation () {
      this.$router.push({
        name: 'offerManage-offerAdd'
      })
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
    // 企业查询
    getcorps () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/quotation/getEntrusts',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.corpList = result || []
        }
      })
    },
    querySearch (queryString, cb) {
      let results = []
      if (this.corpList.length === 0) return cb(results)
      let restaurants = this.corpList
      if (queryString.trim().length > 1) {
        results = restaurants.filter(v => {
          return v.entrustCompanyName && v.entrustCompanyName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        })
      }
      if (results.length === 0) return cb(results)
      let tempArr = results.map(item => {
        return {value: item.entrustCompanyName}
      })
      cb(tempArr)
    },
    // 删除报价
    delQuotation (id) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/quotation/delete',
        data: {quotationId: id},
        router: this.$router,
        success: () => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getsOfferList(this.$store.state.pagination)
        }
      })
    },
    // 编辑报价 跳转到创建报价页
    editQuotation (id) {
      this.$router.push({
        name: 'offerManage-offerAdd',
        query: {
          quotationId: id,
          setTitle: '编辑报价',
          setId: 'offerManage-offerAdd' + id // 自定义tabId, 默认为route.name
        }
      })
    },
    // 查看
    lookQuotation (id) {
      this.$router.push({
        name: 'offerManage-detail',
        query: {
          quotationId: id
        }
      })
    },
    // 导出报价
    exportQuotation () {
      if (this.quotationIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择一条或多条报价'
        })
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/quotation/export',
        data: {quotationIds: this.quotationIds},
        router: this.$router,
        success: ({result}) => {
          result[0] && window.open(result[0], '_blank')
        }
      })
    },
    // 勾选选择框
    chooseSelectBox (selection, row) {
      this.quotationIds = selection.map(v => {
        return v.quotationId
      })
    },
    // 勾选选择框
    chooseSelectBoxAll (selection) {
      this.quotationIds = selection.map(v => {
        return v.quotationId
      })
    },
    // 点击表格行
    chooseSelectRow (row, column, event) {
      let index = this.quotationIds.indexOf(row.quotationId)
      if (index >= 0) { // 当前的行已经被选中了
        this.$refs['offerTable'].toggleRowSelection(row, false)
        this.quotationIds.splice(index, 1)
      } else {
        this.$refs['offerTable'].toggleRowSelection(row, true)
        this.quotationIds.push(row.quotationId)
      }
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
</style>
