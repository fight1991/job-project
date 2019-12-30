<template>
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.six" :model="querySumDecForm" size="mini" label-position="right">
        <el-row  :gutter='20'>
          <el-col :md="12" :lg="6">
            <el-form-item label="企业类别">
              <el-select placeholder="" v-model="querySumDecForm.etpsCategory" clearable filterable style="width:100%">
                <el-option
                  v-for="item in etpsCategoryList"
                  :key="item.code"
                  :label="item.code + ' ' + item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单号" >
              <el-input v-model="querySumDecForm.entryId" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="统一编号" >
              <el-input v-model="querySumDecForm.seqNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="境内收发货人">
              <el-input v-model="querySumDecForm.tradeCode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  :gutter='20'>
          <el-col :md="12" :lg="6">
            <el-form-item label="提运单号" >
              <el-input v-model="querySumDecForm.billNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="申报地海关">
              <el-select placeholder="" v-model="querySumDecForm.customMaster"
                clearable filterable
                style="width:100%">
              <!-- <el-select placeholder="" v-model="querySumDecForm.customMaster"
                clearable filterable remote
                default-first-option
                :remote-method="checkParamsList"
                @focus="tipsFillMessage('customsList','SAAS_CUSTOMS_REL')"
                style="width:100%"> -->
                <el-option
                  v-for="item in decParmasList['SAAS_CUSTOMS_REL']"
                  :key="item.codeField"
                  :label="item.codeField + ' ' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="业务编号">
              <el-input v-model="querySumDecForm.bossId" clearable placeholder="系统编号,接单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="创建人">
              <el-select placeholder="" v-model="querySumDecForm.createUser"
                filterable clearable style="width:100%">
                <el-option
                  v-for="item in userList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  :gutter='20'>
          <el-col :md="24" :lg="12">
            <el-form-item label="最近操作时间">
              <el-date-picker v-model="dates" style="width:100%"
                type="daterange" clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="状态" >
              <el-select placeholder="" v-model="querySumDecForm.status"
                filterable clearable style="width:100%">
                <el-option
                  v-for="item in stautsList"
                  :key="item.codeField"
                  :label="item.codeField + ' ' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  :gutter='20'>
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="querySummaryDecList" style="padding: 8px 20px;">查询</el-button>
            <el-button size="mini" @click="resetDecForm" style="padding: 8px 20px;">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class="query-table dec-query-table">
      <!-- 操作 -->
       <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-print" @click="downLoadPdf"><i></i>打印</el-button>
        <el-button size="mini" class="list-btns list-icon-emailSend" @click="createXml"><i></i>发送</el-button>
        <el-button size="mini" class="list-btns list-icon-delete" @click="delDec" :disabled="isDeletable"><i></i>删除</el-button>
        <el-button size="mini" class="list-btns list-icon-subimtCheck" @click="submitAudit"><i></i>提交审核</el-button>
        <div class="airvehicle-list-drop">
          <el-popover popper-class="airvehicle-table-popper">
            <ul>
              <li v-for="(item,index) in fieldList" :key="index">
                <el-checkbox size="mini" v-model="item.value" @change="columnFieldChange">{{item.text}}</el-checkbox>
              </li>
            </ul>
            <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
          </el-popover>
        </div>
        <span class="span-right">已选择<span>{{checkedNum}}</span>项</span>
      </el-row>
      <!-- 列表 list -->
      <el-table class="sys-table-table dec-table"
        ref="decTable"
        :data="decResultList"
        :height="tableHeight"
        border highlight-current-row size="mini"
        @selection-change="changeFun"
        @row-click="rowClickChange">
        <el-table-column  type="selection" align='center' width="40"></el-table-column>
        <el-table-column label="系统编号" align='left' prop="pid" min-width="120" v-if="fieldList[0].value"></el-table-column>
        <el-table-column label="报关单编号" align='left' prop="decPid" min-width="120" v-if="fieldList[1].value"></el-table-column>
        <el-table-column label="接单编号" align='left' prop="bossId" min-width="160" v-if="fieldList[2].value"></el-table-column>
        <el-table-column label="统一编号" align='center' prop="seqNo" min-width="160" v-if="fieldList[3].value"></el-table-column>
        <el-table-column label="海关编号" align='center' prop="entryId" min-width="150" v-if="fieldList[4].value"></el-table-column>
        <el-table-column label="申报状态" align='left' prop="statusValue" min-width="100" v-if="fieldList[5].value"></el-table-column>
        <el-table-column label="操作状态" align='left' prop="xmlStatusValue" v-if="fieldList[6].value" min-width="70"></el-table-column>
        <el-table-column label="系统状态" align='left' prop="isExamineValue" min-width="120" v-if="fieldList[7].value"></el-table-column>
        <el-table-column label="境内收发货人" align='left' prop="tradeName" min-width="200" v-if="fieldList[8].value"></el-table-column>
        <el-table-column label="境内收发货人18位社会信用代码" align='center' v-if="fieldList[9].value" title='境内收发货人18位社会信用代码' prop="tradeCoScc" min-width="150"></el-table-column>
        <el-table-column label="提运单号" align='left' prop="billNo" v-if="fieldList[10].value" min-width="100"></el-table-column>
        <el-table-column label="申报日期" align='center' prop="dDate" v-if="fieldList[11].value" min-width="100"></el-table-column>
        <el-table-column label="监管方式" align='left' prop="tradeModeValue" v-if="fieldList[12].value" min-width="110"></el-table-column>
        <el-table-column label="毛重" align='right' prop="grossWt" v-if="fieldList[13].value" min-width="80"></el-table-column>
        <el-table-column label="商品项数" align='right' prop="decListNum" v-if="fieldList[14].value" min-width="80"></el-table-column>
        <el-table-column label="运输工具名称" align='left' prop="trafName" v-if="fieldList[15].value" min-width="100"></el-table-column>
        <el-table-column label="申报单位名称" align='left' prop="agentName" v-if="fieldList[16].value" min-width="150"></el-table-column>
        <el-table-column label="进出口标志" align='center' prop="iEFlagValue" v-if="fieldList[17].value" min-width="90"></el-table-column>
        <el-table-column label="申报地海关" align='left' prop="customMasterValue" v-if="fieldList[18].value" min-width="100"></el-table-column>
        <el-table-column label="更新时间" align='center' prop="updateTime" v-if="fieldList[19].value" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" align='center' min-width="140" >
          <template slot-scope="scope">
            <a href="javascript:void(0)" class="list-icon-edit border-0" title="编辑" @click="editDetail(scope.row)"><i class='dec-i'></i></a>
            <a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click.stop="lookupDetail(scope.row)"><i class='dec-i'></i></a>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <el-dialog :modal-append-to-body='false'
      :title="titleName"
      :visible.sync="printCompnentVisible"
      :show-close='false'
      class="sys-dec-class"
      width="640px">
       <decprint-view :initParams="printCompnentParam"  @cancLeData="closePrintCompnent"  v-if="printCompnentVisible"></decprint-view>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
import '@/common/other/client'
import pickerOptions from '@/common/mixin/pickerOptions'
import decprintView from './decPage/components/decPrint'
export default {
  components: {
    decprintView
  },
  mixins: [pickerOptions],
  name: 'summaryDecQueryTable',
  data () {
    return {
      querySumDecForm: {
        declTrnrel: '0,2', // 报关单类型
        etpsCategory: 'D', // 企业类别
        entryId: '', // 报关单号
        seqNo: '', // 统一编号
        tradeCode: '', // 境内收发货人
        billNo: '', // 提运单号
        customMaster: '', // 申报地海关
        bossId: '', // 业务编号
        createUser: '', // 创建人
        status: '', // 状态包括报关单状态和审核状态
        updateTimeStart: '', // 最近开始操作时间
        updateTimeEnd: '' // 最近终止操作时间
      },
      dates: '', // 日期
      isDeletable: true,
      decResultList: [], // 报关单存放列表数据
      tableHeight: 400, // 默认高度
      decParmasList: [],
      fieldList: [{
        value: true,
        text: '系统编号'
      }, {
        value: true,
        text: '报关单编号'
      }, {
        value: true,
        text: '接单编号'
      }, {
        value: true,
        text: '统一编号'
      }, {
        value: true,
        text: '海关编号'
      }, {
        value: true,
        text: '申报状态'
      }, {
        value: true,
        text: '操作状态'
      }, {
        value: true,
        text: '系统状态'
      }, {
        value: true,
        text: '境内收发货人'
      }, {
        value: true,
        text: '境内收发货人18位社会信用代码'
      }, {
        value: true,
        text: '提运单号'
      }, {
        value: true,
        text: '申报日期'
      }, {
        value: true,
        text: '监管方式'
      }, {
        value: true,
        text: '毛重'
      }, {
        value: true,
        text: '商品项数'
      }, {
        value: true,
        text: '运输工具名称'
      }, {
        value: true,
        text: '申报单位名称'
      }, {
        value: true,
        text: '进出口标志'
      }, {
        value: true,
        text: '申报地海关'
      }, {
        value: true,
        text: '更新时间'
      }],
      checkedNum: 0, // 被选中的数量
      etpsCategoryList: [{
        code: 'A',
        name: '报关申报单位'
      }, {
        code: 'B',
        name: '消费使用/生产销售单位'
      }, {
        code: 'C',
        name: '报关收发货人'
      }, {
        code: 'D',
        name: '报关录入单位'
      }], // 企业类别
      customsList: [], // 申报地海关
      userList: [], // 创建人列表
      userId: '', // 当前用户的id
      tableValue: [],
      stautsList: [{
        codeField: '0',
        nameField: '接单生成'
      }, {
        codeField: '2',
        nameField: '报关单预录入'
      }, {
        codeField: '3',
        nameField: '待审核'
      }, {
        codeField: '4',
        nameField: '审核驳回'
      }, {
        codeField: '6',
        nameField: '审核通过'
      }, {
        codeField: 'R',
        nameField: '待复核'
      }, {
        codeField: '1',
        nameField: '单一窗口暂存'
      }, {
        codeField: '21',
        nameField: '单一窗口申报中'
      }, {
        codeField: '9',
        nameField: '放行'
      }, {
        codeField: '10',
        nameField: '结关'
      }], // 状态列表
      selectObj: {
        obj: '',
        parmas: ''
      },
      printCompnentParam: {}, // 打印组件 的传递参数
      printCompnentVisible: false, // 打印组件 显示 隐藏
      titleName: '批量打印报关单'
    }
  },
  created () {
    // 获取登陆用户信息
    this.getUserInfo()
    // 企业本企业下的人员
    this.getUserUnderCrop()
  },
  mounted () {
    this.getCommonParams()
    // 初始化查询日期
    this.setDefualtDate()
  },
  methods: {
    // 重置查询条件
    resetDecForm  () {
      this.querySumDecForm = {
        declTrnrel: '0,2', // 报关单类型
        etpsCategory: 'D', // 企业类别
        entryId: '', // 报关单号
        seqNo: '', // 统一编号
        tradeCode: '', // 境内收发货人
        billNo: '', // 提运单号
        customMaster: '', // 申报地海关
        bossId: '', // 业务编号
        createUser: '', // 创建人
        status: '', // 状态包括报关单状态和审核状态
        updateTimeStart: '', // 最近开始操作时间
        updateTimeEnd: '' // 最近终止操作时间
      }
      this.dates = []
    },
    // 分页列表
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/dec/ts/queryList',
        data: {
          ...this.querySumDecForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.decResultList = res.result
        }
      })
    },
    getCommonParams () {
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': [
            'SAAS_CUSTOMS_REL' // 报关单状态
          ]
        },
        success: (res) => {
          this.decParmasList = res.result
        }
      })
    },
    // 设置默认的查询日期
    setDefualtDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      // 如果时下拉框 则设置当前下拉框的默认参数
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      if (util.isEmpty(keyValue)) {
        this[this.selectObj.obj] = list.slice(0, 10)
      } else {
        let filterList = []
        let filterList1 = []
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().startsWith(keyValue.toLowerCase())
        })
        filterList1 = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        filterList.push(...filterList1)
        filterList = this.unique(filterList)
        if (type === 'init') {
          this[this.selectObj.obj] = filterList.slice(0, 10)
        } else if (type === 'select') {
          this.$nextTick(() => {
            this[this.selectObj.obj] = filterList.slice(0, 10)
          })
        }
      }
    },
    // 数组去重
    unique (array) {
      return Array.from(new Set(array))
    },
    // 企业本企业下的人员
    getUserUnderCrop () {
      this.$post({
        url: 'API@/login/corp/getCorpUsers',
        data: {},
        success: (res) => {
          if (res.code === '0000') {
            this.userList = []
            for (let i in res.result) {
              // 过滤数据
              if (util.isEmpty(res.result[i].userId) || util.isEmpty(res.result[i].userName)) {
                continue
              }
              this.userList.push({
                codeField: res.result[i].userId,
                nameField: res.result[i].userName
              })
            }
          }
        }
      })
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      this.userId = this.$store.state.userLoginInfo.userId
      if (!util.isEmpty(this.userId)) {
        this.querySumDecForm.createUser = this.userId
        this.userList.push({
          codeField: this.userId,
          nameField: this.$store.state.userLoginInfo.userName
        })
        let fieldList = window.localStorage.getItem('summaryDecInfo' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.fieldList, list)) {
            this.fieldList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem('summaryDecInfo' + this.userId, JSON.stringify(this.fieldList))
          }
        }
      }
      this.querySummaryDecList()
    },
    // 概要申报数据列表查询
    querySummaryDecList () {
      this.tableHeight = 400
      if (this.dates === '' || this.dates === null) {
        this.querySumDecForm.updateTimeStart = ''
        this.querySumDecForm.updateTimeEnd = ''
      } else {
        this.querySumDecForm.updateTimeStart = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.querySumDecForm.updateTimeEnd = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.pageList(this.$store.state.pagination)
    },
    // 打开pdf打印组件
    downLoadPdf () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else if (len > 5) {
        this.messageTips('一次不能超过5条数据')
      } else {
        if (len > 1) {
          this.titleName = '批量打印概要申報'
        } else {
          this.titleName = '打印概要申報'
        }
        let pidList = []
        for (let i in this.tableValue) {
          pidList.push(this.tableValue[i].pid)
        }
        this.printCompnentParam = {
          'type': '0,2',
          'pidList': pidList,
          'userId': this.userId,
          'pageType': 'summaryDec'
        }
        this.printCompnentVisible = true
      }
    },
    // 发送到单一窗口进行暂存
    createXml () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else {
        let pidList = []
        for (let i in this.tableValue) {
          pidList.push(this.tableValue[i].pid)
        }
        this.$post({
          url: 'API@/dec-common/dec/ts/batchDeclareTs',
          data: {
            'seqNos': pidList,
            'operType': 'G'
          },
          success: (res) => {
            this.$alert(res.result, '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              dangerouslyUseHTMLString: true,
              confirmButtonText: '我知道了',
              type: 'warning',
              customClass: 'confirm-tips-warning',
              callback: action => {
              }
            })
            if (res.code === '0000') {
              this.querySummaryDecList()
            }
          },
          other: (res) => {
            this.$alert(res.result, '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              dangerouslyUseHTMLString: true,
              confirmButtonText: '我知道了',
              type: 'warning',
              customClass: 'confirm-tips-warning',
              callback: action => {
              }
            })
          }
        })
      }
    },
    // 删除两步申报
    delDec () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择需要删除的数据！')
        return
      }
      // 删除
      let pidList = []
      for (let i in this.tableValue) {
        pidList.push(this.tableValue[i].pid)
      }
      this.$confirm('确定删除选中数据？', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.$post({
          url: 'API@/dec-common/dec/ts/delTs',
          data: {
            'ids': pidList
          },
          success: (res) => {
            this.messageTips(res.message, 'success')
            this.querySummaryDecList()
          }
        })
      }).catch(() => {
      })
    },
    // 关闭打印组件
    closePrintCompnent () {
      this.printCompnentVisible = false
    },
    // 多选框选中或取消时
    changeFun (val) {
      this.tableValue = val
      this.checkedNum = val.length
      if (this.checkedNum === 0) {
        this.isDeletable = true
      } else {
        for (let i = 0; i < this.checkedNum; i++) {
          if (this.tableValue[i].isExamineValue !== '报关单预录入' || !util.isEmpty(this.tableValue[i].xmlStatusValue)) {
            this.isDeletable = true
            break
          } else {
            this.isDeletable = false
          }
        }
      }
    },
    // 点击行 选中时,前面的多选框同时需要选择
    rowClickChange (row, event, column) {
      let flag = false
      for (let i in this.tableValue) {
        if (this.tableValue[i].decPid === row.decPid) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$refs.decTable.toggleRowSelection(row, false)
      } else {
        this.$refs.decTable.toggleRowSelection(row, true)
      }
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      // key值 为DEC tableHead DTH加当前用户的id
      window.localStorage.setItem('summaryDecInfo' + this.userId, JSON.stringify(this.fieldList))
    },
    // 对比两个数组里的值是否一样
    compareFieldList (orig, compare) {
      if (orig.length === compare.length) {
        for (let i in orig) {
          if (orig[i].text !== compare[i].text) {
            return false
          }
        }
        return true
      } else {
        return false
      }
    },
    // 跳转 查看界面
    lookupDetail (row) {
      let pageType
      if (row.declTrnrel === '0') {
        pageType = 'declaration'
        this.gotoDecPage(pageType, 'look', row.pid.toString())
      } else if (row.declTrnrel === '2') {
        pageType = 'recordList'
        this.gotoDecPage(pageType, 'look', row.pid.toString())
      }
    },
    // 跳转编辑页面
    editDetail (row) {
      if (util.isExistInArray(row.status, ['002', '005', '1', '2', '4', '5', '7', '8', '9', '10', '11', '12'])) {
        this.messageTips('当前数据状态不能编辑')
        return false
      }
      if (util.isExistInArray(row.isExamine, ['3', 'R', '6'])) {
        this.messageTips('当前数据状态不能编辑')
        return false
      }
      let pageType
      if (row.declTrnrel === '0') {
        pageType = 'declaration'
        this.gotoDecPage(pageType, 'edit', row.pid.toString())
      } else if (row.declTrnrel === '2') {
        pageType = 'recordList'
        this.gotoDecPage(pageType, 'edit', row.pid.toString())
      }
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 报关单   recordList 备案清单 decTemplate 初始值模板
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoDecPage (funFlag, operationType, pid = 'new') {
      let routeName
      let tabName
      if (funFlag === 'declaration') {
        if (operationType === 'look') {
          tabName = '进口报关单(概要申报)'
          routeName = 'importSummaryDeclook'
        } else if (operationType === 'edit') {
          tabName = '进口报关单(概要申报)'
          routeName = 'importSummaryDecEdit'
        }
      }
      if (funFlag === 'recordList') {
        if (operationType === 'look') {
          tabName = '进境备案清单(概要申报)'
          routeName = 'importSummaryRecordLook'
        } else if (operationType === 'edit') {
          tabName = '进境备案清单(概要申报)'
          routeName = 'importSummaryRecordEdit'
        }
      }
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + operationType + pid
        }
      })
    },
    // 提交审核
    submitAudit () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
        return
      }
      if (len > 10) {
        this.messageTips('最多支持操作10条数据')
        return
      }
      let pidList = []
      let otherPidList = []
      // 判断 是否有不能提交审核的数据
      for (let i in this.tableValue) {
        if (['3', 'R', '6'].includes(this.tableValue[i].isExamine)) {
          otherPidList.push(this.tableValue[i].pid)
        } else {
          pidList.push(this.tableValue[i].pid)
        }
      }
      if (otherPidList.length > 0) {
        this.messageTips('系统编号:' + otherPidList.join('、') + '不能提交审核的数据，请重新选择')
        return
      }
      // 发送请求
      this.$post({
        url: 'API@/dec-common/dec/ts/submitVerity',
        data: {
          'list': pidList
        },
        success: (res) => {
          this.$alert(res.message, '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            dangerouslyUseHTMLString: true,
            confirmButtonText: '我知道了',
            type: 'warning',
            customClass: 'confirm-tips-warning',
            callback: action => {
            }
          })
          if (res.code === '0000') {
            this.querySummaryDecList()
          }
        },
        other: (err) => {
          this.$alert(err.message, '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            dangerouslyUseHTMLString: true,
            confirmButtonText: '我知道了',
            type: 'warning',
            customClass: 'alert-tips-warning',
            callback: action => {
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .query-main {
    // background-color: #f5f5f5;
    padding: 20px;
    font-size:12px;
    font-family: Arial,Microsoft YaHei,SimSun;
    height: 100%;
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
  }
  .query-btn {
    text-align: center;
  }
  .span-right{
    float: right;
    margin-right: 5%;
    margin-top: 6px;
    color: @font-color-main;
    font-size: 14px;
    span{
      color: @sys-color-btn;
    }
  }
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
  }
  .button-primary{
    margin-left: 24px;
    line-height: 24px;
    font-size: 14px;
    height: 28px;
    border-radius: 4px;
    background-color: #287fca;
    border: 0;
    color: #fff;
    padding: 0 12px;
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
  .airvehicle-table-popper{
    min-width: auto;
    ul{
      height: 400px;
      overflow:auto;
        li{
            line-height: 20px;
            .el-checkbox__label{
                font-size: 12px;
            }
        }
    }
  }
  .airvehicle-list-drop {
    float: right;
  }
  .btn-padding {
    padding: 8px 20px !important;
    margin-left: 10px;
  }
</style>
