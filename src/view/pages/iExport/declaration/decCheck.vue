<template>
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.six" :model="queryCondition" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="接单编号">
              <el-input v-model="queryCondition.bossId" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提运单号" >
              <el-input v-model="queryCondition.billNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="进出口标志">
              <el-select placeholder="" v-model="queryCondition.iEFlag"  style="width:100%" >
                <el-option
                  v-for="item in iEList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="审核状态">
              <el-select placeholder="" v-model="queryCondition.isExamine"  filterable clearable style="width:100%">
                <el-option
                  v-for="item in supTypeList"
                  :key="item.codeField"
                  :label="item.codeField + ' ' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="申报地海关">
              <el-select placeholder="" v-model="queryCondition.customMaster"
                clearable filterable remote
                default-first-option
                :remote-method="checkParamsList"
                @focus="tipsFillMessage('customsList','SAAS_CUSTOMS_REL')"
                style="width:100%">
                <el-option
                  v-for="item in customsList"
                  :key="item.codeField"
                  :label="item.codeField + ' ' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="境内收发货人" >
              <el-input v-model="queryCondition.trader" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="最近操作时间">
              <el-date-picker  v-model="dates" style="width:100%"
                type="daterange" clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="制单人" >
              <el-select placeholder="" v-model="queryCondition.inputerName"
                  filterable clearable style="width:100%">
                  <el-option
                    v-for="item in userList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.nameField">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="申报模式">
              <el-select placeholder="" v-model="queryCondition.type"  style="width:100%" >
                <el-option
                  v-for="item in decModelList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryDeCheckList" style="padding: 8px 20px;">查询</el-button>
            <el-button size="mini" @click="resetDeCheckForm" style="padding: 8px 20px;">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
       <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-viewEdit" @click="visiblEdit"><i></i>可视化审核</el-button>
        <el-button size="mini" class="list-btns list-icon-scan" @click="visibleView"><i></i>可视化预览</el-button>
        <el-button size="mini" class="list-btns list-icon-check"  v-permissions="'CCBA20204010100'" @click="batchCheck"><i></i>批量审核</el-button>
        <el-button size="mini" class="list-btns list-icon-reject" @click="batchReject"><i></i>批量驳回</el-button>
        <el-button size="mini" class="list-btns list-icon-rollback" @click="rollbackStatus"><i></i>状态回退</el-button>
        <el-button size="mini" class="list-btns list-icon-look" @click="lookDecDetail"><i></i>查看详情</el-button>
        <el-button size="mini" class="list-btns list-icon-print" @click="downLoadPdf"><i></i>打印</el-button>
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
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table' :data="deCheckList"
         border highlight-current-row size="mini"  height="400"
         ref = 'decAutiTable'
         @selection-change="changeFun"
         @row-click='rowClickChange'>
        <el-table-column  type="selection"  align='center' min-width="50"></el-table-column>
        <el-table-column label="进出口标志"  align='center' v-if="fieldList[0].value" fixed prop="iEFlag" min-width="80">
          <template slot-scope="scope">
            <span>{{scope.row.iEFlag == 'I' ? '进口' : '出口'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="系统编号"  align='left' v-if="fieldList[1].value" fixed prop="decPid" min-width="100"></el-table-column>
        <el-table-column label="接单编号"  align='left' v-if="fieldList[2].value" fixed prop="bossId" min-width="120"></el-table-column>
        <el-table-column label="系统状态" align='left' v-if="fieldList[3].value" fixed prop="isExamineValue" min-width="110"></el-table-column>
        <el-table-column label="申报地海关" align='left' v-if="fieldList[4].value" prop="customMasterValue" min-width="100"></el-table-column>
        <el-table-column label="境内收发货人" align='left' v-if="fieldList[5].value" prop="tradeName" min-width="200"></el-table-column>
        <el-table-column label="提运单号" align='left' v-if="fieldList[6].value" prop="billNo" min-width="100"></el-table-column>
        <el-table-column label="制单时间" align='center' v-if="fieldList[7].value" prop="createTime" min-width="100"></el-table-column>
        <el-table-column label="制单人" align='left' v-if="fieldList[8].value" prop="inputerName" min-width="100"></el-table-column>
        <el-table-column label="初审通过时间" align='left' v-if="fieldList[9].value" prop="firstTrialDate" min-width="100"></el-table-column>
        <el-table-column label="初审人" align='left' v-if="fieldList[10].value" prop="firstTrial" min-width="100"></el-table-column>
        <el-table-column label="复核通过时间" align='left' v-if="fieldList[11].value" prop="reCheckDate" min-width="100"></el-table-column>
        <el-table-column label="复核人" align='left' v-if="fieldList[12].value" prop="reCheck" min-width="100"></el-table-column>
      </el-table>
      <el-dialog :modal-append-to-body='false'
        :title="titleName"
        :visible.sync="printCompnentVisible"
        :show-close='false'
        v-loading="$store.state.loading"
        class="sys-dec-class"
        width="640px">
        <decprint-view :initParams="printCompnentParam"  @cancLeData="closePrintCompnent"  v-if="printCompnentVisible"></decprint-view>
      </el-dialog>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import decprintView from '../declaration/decPage/components/decPrint'
import pickerOptions from '@/common/mixin/pickerOptions'
import decUtil from './decPage/common/decUtil'

export default {
  name: 'dec-check',
  components: {
    decprintView
  },
  mixins: [pickerOptions],
  data () {
    return {
      queryCondition: {
        bossId: '', // 接单编号
        billNo: '', // 提运单号
        isExamine: '', // 审核状态
        startDate: '', // 进出口日期（开始）
        endDate: '', // 进出口日期（结束）
        inputerName: '', // 制单人
        customMaster: '', // 申报地海关
        trader: '', // 境内收发货人
        type: 'dec', // dec报关单 decTs 两步概要申报
        iEFlag: '' // 进出口标志 I 进口 E 出口
      },
      dates: '', // 日期
      tableHeight: 400, // 默认高度
      deCheckList: [], // 报关单存放列表数据
      checkedData: [], // 被选中的数据
      checkedNum: '', // 选中的数量
      checkReview: 'N', // 复核开关
      customsList: [], // 申报地海关
      printCompnentParam: {}, // 打印组件 的传递参数
      printCompnentVisible: false, // 打印组件 显示 隐藏
      userList: [],
      titleName: '批量打印报关单',
      selectObj: {
        obj: '',
        params: ''
      },
      userId: '', // 当前登陆用户的id
      supTypeList: [
        {
          codeField: '3',
          nameField: '待审核'
        }, {
          codeField: '6',
          nameField: '审核通过'
        }, {
          codeField: '4',
          nameField: '审核驳回'
        }, {
          codeField: 'R',
          nameField: '待复核'
        }],
      iEList: [
        {
          code: '',
          name: '全部'
        }, {
          code: 'E',
          name: '出口'
        }, {
          code: 'I',
          name: '进口'
        }],
      decModelList: [
        {
          code: 'dec',
          name: '普通申报'
        }, {
          code: 'decTs',
          name: '两步申报'
        }],
      fieldList: [{
        value: true,
        text: '进出口标志'
      }, {
        value: true,
        text: '系统编号'
      }, {
        value: true,
        text: '接单编号'
      }, {
        value: true,
        text: '业务状态'
      }, {
        value: true,
        text: '申报地海关'
      }, {
        value: true,
        text: '境内收发货人'
      }, {
        value: true,
        text: '提运单号'
      }, {
        value: true,
        text: '制单时间'
      }, {
        value: true,
        text: '制单人'
      }, {
        value: true,
        text: '初审通过时间'
      }, {
        value: true,
        text: '初审人'
      }, {
        value: true,
        text: '复核通过时间'
      }, {
        value: true,
        text: '复核人'
      }]
    }
  },
  created () {
    // 获取登陆用户信息
    this.getUserInfo()
    // 获取基础参数
    this.getParam()
    // 获取开关
    this.getSwitchCheck()
    // 初始化查询日期
    this.setDefualtDate()
    // 查询列表
    this.queryDeCheckList()
    // 企业本企业下的人员
    this.getUserUnderCrop()
  },
  mounted () {
  },
  methods: {
    // 企业本企业下的人员
    getUserUnderCrop () {
      this.$post({
        url: 'API@/login/corp/getCorpUsers',
        data: {},
        success: (res) => {
          if (res.code === '0000') {
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
    // 获取下拉框参数
    getParam () {
      let par = ['SAAS_CUSTOMS_REL']
      this.$post({
        useStorage: true,
        storageKey: par,
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {

        }
      })
    },
    // 获取是否开启复核开关
    getSwitchCheck () {
      this.$post({
        url: 'API@/dec-common/ccba/review/isReview',
        data: ['customs_declaration_review'],
        loading: true,
        success: (res) => {
          if (!util.isEmpty(res.result['customs_declaration_review'].value)) {
            this.checkReview = res.result['customs_declaration_review'].value
            if (this.checkReview === 'Y') {
              this.fieldList[11].value = true
              this.fieldList[12].value = true
            } else {
              this.fieldList[11].value = false
              this.fieldList[12].value = false
            }
          }
        }
      })
    },
    // 重置查询表单
    resetDeCheckForm  () {
      this.queryCondition = {
        bossId: '', // 接单编号
        billNo: '', // 提运单号
        isExamine: '', // 审核状态
        startDate: '', // 进出口日期（开始）
        endDate: '', // 进出口日期（结束）
        inputerName: '', // 制单人
        customMaster: '', // 申报地海关
        trader: '', // 境内收发货人
        type: 'dec', // dec报关单 decTs 两步概要申报
        iEFlag: '' // 进出口标志 I 进口 E 出口
      }
      this.dates = []
    },
    // 报关单列表查询
    queryDeCheckList () {
      if (this.dates === '' || this.dates === null) {
        this.queryCondition.startDate = ''
        this.queryCondition.endDate = ''
      } else {
        this.queryCondition.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryCondition.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.pageList(this.$store.state.pagination)
    },
    // 设置默认的查询日期
    setDefualtDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 分页列表
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/ccba/review/getReviewList',
        data: {
          ...this.queryCondition,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.deCheckList = res.result
        }
      })
    },
    // 选择列表数据
    changeFun (val) {
      this.checkedData = val
      this.checkedNum = val.length
    },
    // 点击行 选中时,前面的多选框同时需要选择
    rowClickChange (row, event, column) {
      let flag = false
      for (let i in this.checkedData) {
        if (this.checkedData[i].decPid === row.decPid) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$refs.decAutiTable.toggleRowSelection(row, false)
      } else {
        this.$refs.decAutiTable.toggleRowSelection(row, true)
      }
    },
    // 可视化编辑
    visiblEdit () {
      if (this.checkedData.length === 0) {
        this.messageTips('请选择一条需要编辑的数据')
        return false
      }
      if (this.checkedData.length > 1) {
        this.messageTips('只能选择一条数据编辑')
        return false
      }
      // 去后端查询是否为不可审批的状态
      this.$post({
        url: 'API@/dec-common/dec/common/getStatus',
        data: {
          'pid': this.checkedData[0].decPid,
          'categoryType': this.checkedData[0].type // dec报关单 decTs 两步概要申报
        },
        success: (res) => {
          if (!['3', 'R'].includes(res.result)) {
            this.messageTips('当前状态不能编辑')
          } else {
            let pid = this.checkedData[0].decPid
            let tabName = '报关单可视化审核编辑'
            let routeName = 'decReviewedEdit'
            if (this.checkedData[0].type === 'dec') {
              tabName = '报关单可视化审核编辑'
            } else {
              tabName = '概要申报可视化审核编辑'
              routeName = 'summaryDecReviewedEdit'
            }
            // 这里名称没有区分概要审核和报关单
            this.$router.push({
              name: routeName,
              params: {
                'pid': pid,
                'setTitle': tabName + '-' + pid,
                'setId': routeName + 'edit' + pid
              },
              query: {
                decType: this.checkedData[0].type
              }
            })
          }
        }
      })
    },
    // 可视化预览
    visibleView () {
      if (this.checkedData.length === 0) {
        this.messageTips('请选择一条需要预览的数据')
        return false
      }
      if (this.checkedData.length > 1) {
        this.messageTips('只能选择一条数据编辑')
        return false
      }
      let pid = this.checkedData[0].decPid
      let tabName = '报关单可视化审核预览'
      let routeName = 'decReviewedLook'
      if (this.checkedData[0].type === 'dec') {
        tabName = '报关单可视化审核预览'
      } else {
        tabName = '概要申报可视化审核预览'
        routeName = 'summaryDecReviewedLook'
      }
      // 这里名称没有区分概要审核和报关单
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + 'edit' + pid
        },
        query: {
          decType: this.checkedData[0].type
        }
      })
    },
    // 批量审核
    batchCheck () {
      let param = []
      if (this.checkedData.length === 0) {
        this.messageTips('请选择需要审核的数据')
        return false
      }
      let messageTips = []
      for (let i in this.checkedData) {
        // 逻辑 只有状态在待审核和待复核的状态才能 提交审核
        if (this.checkedData[i].isExamine === '3' || this.checkedData[i].isExamine === 'R') {
          param.push({
            'decPid': this.checkedData[i].decPid,
            'bossId': this.checkedData[i].bossId,
            'iEFlag': this.checkedData[i].iEFlag,
            'isExamine': this.checkedData[i].isExamine,
            'type': this.checkedData[i].type
          })
        } else {
          messageTips.push(this.checkedData[i].bossId + ':的状态不能进行审核')
        }
      }
      if (messageTips.length > 0) {
        this.messageTips(messageTips.join('<br>'))
        return
      }
      if (this.checkReview === 'N') {
        this.batchCheckFunction(param, 'API@/dec-common/ccba/review/batchAudit')
        return
      }
      let index = param.findIndex((v, i) => {
        return v.isExamine === '3'
      })
      if (index === -1) { // 全是复核状态 R
        this.$confirm('是否需要复核？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '是',
          cancelButtonText: '否',
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          this.batchCheckFunction(param, 'API@/dec-common/ccba/review/batchReview')
        }).catch(() => {
          this.batchCheckFunction(param, 'API@/dec-common/ccba/review/batchAudit')
        })
        return
      }
      let index1 = param.findIndex((v, i) => {
        return v.isExamine === 'R'
      })
      if (index1 === -1) { // 全为待审核状态 复核开关为开
        this.batchCheckFunction(param, 'API@/dec-common/ccba/review/batchReview')
        return
      }
      // 复核开的时候 既有待审状态 又有复核状态
      this.$confirm('是否需要复核？', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '是',
        cancelButtonText: '否',
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.batchCheckFunction(param, 'API@/dec-common/ccba/review/batchReview')
      }).catch(() => {
        this.batchCheckFunction(param, 'API@/dec-common/ccba/review/batchAuditOpen')
      })
    },
    // 批量审批
    batchCheckFunction (param, url) {
      this.$post({
        url: url,
        data: param,
        success: (res) => {
          if (res.code === '0000') {
            this.messageTips(res.message, 'success')
            this.pageList()
          } else {
            this.messageTips(res.message, 'error')
          }
        }
      })
    },
    // 批量驳回
    batchReject () {
      let param = []
      if (this.checkedData.length === 0) {
        this.messageTips('请选择需要审核的数据')
        return false
      }
      let messageTips = []
      for (let i in this.checkedData) {
        // 逻辑 只有状态在待审核和待复核的状态才能 提交审核
        if (this.checkedData[i].isExamine === '3' || this.checkedData[i].isExamine === 'R') {
          param.push({
            'decPid': this.checkedData[i].decPid,
            'bossId': this.checkedData[i].bossId,
            'iEFlag': this.checkedData[i].iEFlag,
            'isExamine': this.checkedData[i].isExamine,
            'type': this.checkedData[i].type
          })
        } else {
          messageTips.push(this.checkedData[i].bossId + ':的状态不能进行驳回')
        }
      }
      if (messageTips.length > 0) {
        this.messageTips(messageTips.join('<br>'))
        return
      }
      this.$post({
        url: 'API@/dec-common/ccba/review/batchReject',
        data: param,
        success: (res) => {
          if (res.code === '0000') {
            this.messageTips(res.message, 'success')
            this.pageList()
          } else {
            this.messageTips(res.message, 'error')
          }
        }
      })
    },
    // 状态回退
    rollbackStatus () {
      let param = []
      if (this.checkedData.length === 0) {
        this.messageTips('请选择需要审核的数据')
        return false
      }
      for (let i in this.checkedData) {
        param.push({
          decPid: this.checkedData[i].decPid,
          bossId: this.checkedData[i].bossId,
          'iEFlag': this.checkedData[i].iEFlag,
          isExamine: this.checkedData[i].isExamine,
          'type': this.checkedData[i].type
        })
      }
      this.$post({
        url: 'API@/dec-common/ccba/review/statusBack',
        data: param,
        success: (res) => {
          if (res.code === '0000') {
            this.messageTips(res.message, 'success')
            this.pageList()
          } else {
            this.messageTips(res.message, 'error')
          }
        }
      })
    },
    // 打开pdf打印组件
    downLoadPdf () {
      let len = this.checkedData.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else if (len > 5) {
        this.messageTips('一次不能超过5条数据')
      } else {
        if (this.checkedData[0].type === 'dec') { // 报关单打印
          if (len > 1) {
            this.titleName = '批量打印报关单'
          } else {
            this.titleName = '打印报关单'
          }
        } else {
          if (len > 1) {
            this.titleName = '批量打印概要申报'
          } else {
            this.titleName = '打印概要申报'
          }
        }
        let pidLit = []
        for (let i in this.checkedData) {
          pidLit.push(this.checkedData[i].decPid)
        }
        if (this.checkedData[0].type === 'dec') { // 报关单打印
          this.printCompnentParam = {
            'type': '0,2',
            'pidList': pidLit
          }
        } else {
          this.printCompnentParam = {
            'type': '0,2',
            'pidList': pidLit,
            'pageType': 'summaryDec'
          }
        }
        this.printCompnentVisible = true
      }
    },
    // 关闭打印组件
    closePrintCompnent () {
      this.printCompnentVisible = false
    },
    // 查看报关单详情
    lookDecDetail () {
      if (this.checkedData.length === 0) {
        this.messageTips('请选择一条需要查看的数据')
        return false
      }
      if (this.checkedData.length > 1) {
        this.messageTips('只能选择一条数据查看')
        return false
      }
      let row = this.checkedData[0]
      let pageType
      if (row.type === 'dec') { // 报关单
        if (row.declTrnrel === '0') {
          pageType = 'declaration'
        } else if (row.declTrnrel === '2') {
          pageType = 'recordList'
        } else {
          pageType = 'declaration'
        }
        decUtil.gotoDecPage(pageType, row.iEFlag === 'I' ? 'import' : 'export', 'look', row.decPid.toString(), 'dec', {}, this)
      } else { // 两步申报
        if (row.declTrnrel === '0') {
          pageType = 'declaration'
        } else if (row.declTrnrel === '2') {
          pageType = 'recordList'
        } else {
          pageType = 'declaration'
        }
        this.togoSummaryDec(row.decPid.toString(), pageType)
      }
    },
    togoSummaryDec (pid, funFlag) {
      let routeName
      let tabName
      if (funFlag === 'declaration') {
        tabName = '进口报关单(概要申报)'
        routeName = 'importSummaryDeclook'
      } else {
        tabName = '进境备案清单(概要申报)'
        routeName = 'importSummaryRecordLook'
      }
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + 'look' + pid
        }
      })
    },
    // 远程搜素
    checkParamsList (query) {
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      let filterList = []
      if (util.isEmpty(keyValue)) {
        this[this.selectObj.obj] = list.slice(0, 10)
      } else {
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        this[this.selectObj.obj] = filterList.slice(0, 10)
      }
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      this.userId = this.$store.state.userLoginInfo.userId
      if (!util.isEmpty(this.userId)) {
        let fieldList = window.localStorage.getItem('CTH' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.fieldList, list)) {
            this.fieldList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem('CTH' + this.userId, JSON.stringify(this.fieldList))
          }
        }
      }
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
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      // key值 为DEC tableHead CTH加当前用户的id
      window.localStorage.setItem('CTH' + this.userId, JSON.stringify(this.fieldList))
    }
  }
}
</script>

<style scoped lang="less">
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
    margin-bottom: 14px;
  }
  .query-btn {
    text-align: center;
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
</style>
