<template>
<!-- shipping 查询界面组件-->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.seven" :model="queryForm" size="mini" label-position="right">
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="流水号">
              <el-input v-model="queryForm.ocrNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="申报截止时间">
              <el-date-picker v-model="queryForm.demandDate" style="width:100%" value-format="yyyy-MM-dd" type="date" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托客户">
              <el-select v-model="queryForm.entrustCompanyName" style="width:100%"
                filterable remote clearable
                :remote-method="getCorp"
                default-first-option>
                <el-option v-for="item in corpList" :key="item.corpId" :label="item.corpName" :value="item.corpName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="上传/委托时间">
              <el-date-picker v-model="queryForm.taskTime" style="width:100%" type="date" value-format="yyyy-MM-dd" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="制单状态">
               <el-select placeholder="" v-model="queryForm.taskStatus" clearable filterable style="width:100%">
                  <el-option
                  v-for="item in taskStatusList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="制单类型">
               <el-select placeholder="" v-model="queryForm.taskType" clearable filterable style="width:100%">
                  <el-option
                  v-for="item in taskTypeList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托状态">
               <el-select placeholder="" v-model="queryForm.entrustType" clearable filterable style="width:100%">
                  <el-option
                  v-for="item in entrustTypeList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="pageList($store.state.pagination)" class= 'btn-padding' >查询</el-button>
            <el-button size="mini" @click="resetForm" class= 'btn-padding'>重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
      <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-upload mg-r-10" @click="docUpload('add', {})"><i></i>单证上传</el-button>
        <el-button size="mini" class="list-btns list-icon-rollback mg-r-10" @click="retreatBill('data', 'multiple')"><i></i>退回</el-button>
        <el-button size="mini" class="list-btns list-icon-autodeclare mg-r-10" @click="submitOcr('data', 'multiple')"><i></i>提交识别</el-button>
        <el-button size="mini" class="list-btns list-icon-delete mg-r-10" @click="deleteOcr"><i></i>删除</el-button>
        <el-button size="mini" class="list-btns list-icon-refresh mg-r-10" @click="pageList($store.state.pagination)"><i></i>刷新</el-button>
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
      <el-table class='sys-table-table dec-table'
        :data="resultList" border highlight-current-row size="mini"
        @selection-change="changeFun" height="408px">
        <el-table-column  type="selection" align='center' min-width="40"></el-table-column>
        <el-table-column label="流水号" align='center' prop="ocrNo" min-width="120" v-if="fieldList.ocrNo.value">
          <template slot-scope="scope">
            <span style='color:#409EFF;cursor: pointer;' @click="editDetail(scope.row)" v-if='scope.row.taskStatus == "3" && !["2","3"].includes(scope.row.entrustType)'>{{scope.row.ocrNo}}</span>
            <span v-else>{{scope.row.ocrNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="制单状态" align='center' prop="taskStatusValue" min-width="90" v-if="fieldList.taskStatusValue.value">
          <template slot-scope="scope">
            <div>{{scope.row.taskStatusValue || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="制单类型" align='center' prop="taskTypeValue" min-width="90" v-if="fieldList.taskTypeValue.value">
          <template slot-scope="scope">
            <div>{{scope.row.taskTypeValue || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="委托状态" align='center' prop="entrustTypeValue" min-width="90" v-if="fieldList.entrustTypeValue.value">
          <template slot-scope="scope">
            <div>{{scope.row.entrustTypeValue || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="委托客户" align='left' prop="entrustCompanyName" min-width="150" v-if="fieldList.entrustCompanyName.value">
          <template slot-scope="scope">
            <div>{{scope.row.entrustCompanyName || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="申报截止时间" align='center' prop="demandDate" min-width="150" v-if="fieldList.demandDate.value">
          <template slot-scope="scope">
            <div>{{scope.row.demandDate || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="上传/委托时间" align='center' prop="taskTime" min-width="150" v-if="fieldList.taskTime.value">
          <template slot-scope="scope">
            <div>{{scope.row.taskTime || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align='center' min-width="100" >
          <template slot-scope="scope">
            <el-button title="退回" type="text" class="table-icon list-icon-rollback" v-if="(scope.row.taskStatus === '0' && scope.row.entrustType === '0') || (scope.row.taskStatus === '2' && scope.row.entrustType === '4')" @click="retreatBill(scope.row, 'single')"><i></i></el-button>
            <el-button title="提交识别" type="text" v-if="scope.row.taskStatus == '0' && !['1','2','3'].includes(scope.row.entrustType)" class="table-icon list-icon-autodeclare" @click="submitOcr(scope.row, 'single')"><i></i></el-button>
            <el-button title="详情" type="text" class="table-icon list-icon-look" @click="docUpload('view', scope.row)"><i></i></el-button>
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
    <!-- 单证上传弹窗 -->
    <document-upload :uploadVisible.sync="uploadVisible" :operationType="operationType" :ocrInfo="ocrInfo"></document-upload>
    <!-- 委托退回弹窗 -->
    <el-dialog :modal-append-to-body='false'
      title="委托退回原因"
      :visible.sync="retreatVisible"
      :close-on-click-modal='false'
      v-loading="$store.state.loading"
      class="batch-sync-dialog"
      width="450px">
      <el-form :model="retreatForm" ref="retreatForm" :rules="rules" size="mini">
        <el-form-item prop="backReason">
          <el-input type="textarea" v-model="retreatForm.backReason" rows="6" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24" align="center">
          <el-button size="mini" type="primary" @click="confirmForm">确定</el-button>
          <el-button size="mini" @click="closeForm">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import {tableHeadFieldList} from './utils/tableHeadFields'
import {taskStatusList, taskTypeList, entrustTypeList} from './utils/status'
import documentUpload from './components/documentUpload.vue'
export default {
  components: {
    documentUpload
  },
  data () {
    return {
      queryForm: this.initForm(),
      taskStatusList: taskStatusList,
      taskTypeList: taskTypeList,
      entrustTypeList: entrustTypeList,
      fieldList: tableHeadFieldList,
      userId: '', // 当前用户的id,
      resultList: [],
      selectData: [],
      corpList: [],
      uploadVisible: false, // 单证上传弹窗
      operationType: '',
      ocrInfo: {},
      retreatVisible: false,
      rules: {
        backReason: [{required: true, message: '请输入原因', trigger: 'blur'}]
      },
      nos: [],
      retreatForm: {
        backReason: '',
        nos: []
      }
    }
  },
  created () {
    this.pageList(this.$store.state.pagination)
  },
  mounted () {
  },
  methods: {
    initForm () {
      return {
        ocrNo: '', // 流水号
        demandDate: '', // 申报截止时间
        entrustCompanyName: '', // 委托客户
        taskTime: '', // 上传/委托时间
        taskStatus: '', // 制单状态
        taskType: '', // 制单类型
        entrustType: '' // 委托状态
      }
    },
    // 重置
    resetForm  () {
      this.queryForm = this.initForm()
      this.pageList(this.$store.state.pagination)
    },
    // 列表查询
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/dec/orc/getDecDocument',
        data: {
          ...this.queryForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.resultList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    changeFun (val) {
      this.selectData = val
    },
    // 获取委托客户
    getCorp (query) {
      if (query.length < 2) {
        this.corpList = []
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: query,
          returnProps: ['sccCode', 'tradeCode', 'ciqCode', 'corpId', 'corpName']
        },
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.corpList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      if (!util.isEmpty(this.userId)) {
        let fieldList = window.localStorage.getItem('INTEL' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.fieldList, list)) {
            this.fieldList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem('INTEL' + this.userId, JSON.stringify(this.fieldList))
          }
        }
      }
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      // key值 为DEC tableHead DTH加当前用户的id
      window.localStorage.setItem('INTEL' + this.userId, JSON.stringify(this.fieldList))
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
    // 跳转编辑页面
    editDetail (row) {
      let flag = row.bizInfo.split('|')
      let pageType = (flag[1] === '0' ? 'declaration' : 'recordList')
      let iEFlag = (flag[0] === 'I' ? 'import' : 'export')
      // let pageType = row.declTrnrel === '0' ? 'declaration' : 'recordList'
      // let iEFlag = row.iEFlag === 'I' ? 'import' : 'export'
      // this.gotoDecPage(pageType, iEFlag, 'edit', row.taskId)
      this.gotoDecPage(pageType, iEFlag, 'edit', row.ocrNo)
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 报关单   recordList 备案清单
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoDecPage (funFlag, flag, operationType, pid = 'new') {
      let routeParam = {
        'declaration@import@look': {setTitle: '进口报关单(智能录入)', setId: 'importInDecIntelligentLook'},
        'declaration@import@edit': {setTitle: '进口报关单(智能录入)', setId: 'importDecIntelligentEdit'},
        'declaration@export@edit': {setTitle: '出口报关单(智能录入)', setId: 'exportDecIntelligentEdit'},
        'declaration@export@look': {setTitle: '出口报关单(智能录入)', setId: 'exportDecIntelligentLook'},
        'recordList@import@look': {setTitle: '进境备案清单(智能录入)', setId: 'importRecordIntelligentLook'},
        'recordList@import@edit': {setTitle: '进境备案清单(智能录入)', setId: 'importRecordIntelligentEdit'},
        'recordList@export@look': {setTitle: '出境备案清单(智能录入)', setId: 'exportRecordIntelligentLook'},
        'recordList@export@edit': {setTitle: '出境备案清单(智能录入)', setId: 'exportRecordIntelligentEdit'}
      }
      let para = `${funFlag}@${flag}@${operationType}`
      this.$router.push({
        name: 'intelligentVouching',
        params: {
          'pid': pid,
          'funFlag': funFlag,
          'iEFlag': flag,
          'operationType': operationType,
          'setTitle': routeParam[para].setTitle + '-' + pid,
          'setId': routeParam[para].setId + pid
        },
        query: {
          aiType: 'Intelligent',
          operation: 'add'
        }
      })
    },
    // 单证上传弹窗
    docUpload (type, data) {
      this.operationType = type
      if (type === 'view') {
        this.$post({
          url: 'API@/dec-common/entrust/getEntrustDetail',
          data: data.ocrNo,
          success: (res) => {
            if (res.result) {
              this.ocrInfo = data
              this.ocrInfo['backReason'] = res.result.backReason
              this.ocrInfo['frozenReason'] = res.result.frozenReason
              console.log(this.ocrInfo)
              this.uploadVisible = true
            }
          }
        })
      } else {
        this.uploadVisible = true
        this.ocrInfo = data
      }
    },
    // 弹窗提示
    messageConfirm (message) {
      this.$alert(message, '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        dangerouslyUseHTMLString: true,
        confirmButtonText: '我知道了',
        type: 'warning',
        customClass: 'alert-tips-warning',
        callback: action => {
        }
      })
    },
    // 提交识别
    submitOcr (data, type) {
      let selectedList = []
      if (type === 'multiple') {
        if (this.selectData.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择至少一条数据'
          })
          return false
        }
        let disList = []
        this.selectData.forEach(e => {
          if (e.taskStatus === '0' && !['1', '2', '3'].includes(e.entrustType)) {
            selectedList.push(e.ocrNo)
          } else {
            disList.push(e.ocrNo)
          }
        })
        if (disList.length !== 0) {
          let message = ''
          disList.forEach(e => { message += `流水号 ${e} 的数据不能提交识别;<br>` })
          this.messageConfirm(message)
          return false
        }
        this.submitOcrReq(selectedList)
      } else {
        this.submitOcrReq([data.ocrNo])
      }
    },
    submitOcrReq (data) {
      this.$post({
        url: 'API@/dec-common/dec/orc/submitOcrDocument',
        data: data,
        success: (res) => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.pageList(this.$store.state.pagination)
        }
      })
    },
    // 删除
    deleteOcr () {
      if (this.selectData.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择至少一条数据'
        })
        return false
      }
      let [list, disList] = [[], []]
      this.selectData.forEach(e => {
        if (['0', '2'].includes(e.taskType) && e.taskStatus !== '4') {
          list.push(e.ocrNo)
        } else {
          disList.push(e.ocrNo)
        }
      })
      if (disList.length !== 0) {
        let message = ''
        disList.forEach(e => { message += `流水号 ${e} 的数据不能删除;<br>` })
        this.messageConfirm(message)
        return false
      }
      this.$confirm('确定要删除此数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$post({
          url: 'API@/dec-common/dec/orc/deleteDecDocument',
          data: list,
          success: (res) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.pageList(this.$store.state.pagination)
          }
        })
      }).catch(() => {
      })
    },
    // 退回
    retreatBill (data, type) {
      if (this.selectData.length === 0 && type === 'multiple') {
        this.$message({
          type: 'error',
          message: '请选择至少一条数据'
        })
        return false
      }
      let [list, disList] = [[], []]
      if (type === 'multiple') {
        this.selectData.forEach(e => {
          if ((e.taskStatus === '0' && e.entrustType === '0') || (e.taskStatus === '2' && e.entrustType === '4')) { // 制单状态，委托状态 已上传+自动接单 识别失败+处理中
            list.push(e.ocrNo)
          } else {
            disList.push(e.ocrNo)
          }
        })
      } else {
        list.push(data.ocrNo)
      }
      this.nos = list
      if (disList.length !== 0) {
        let message = ''
        disList.forEach(e => { message += `流水号 ${e} 的数据不能退回;<br>` })
        this.messageConfirm(message)
        return false
      }
      this.$confirm('确定要退回此数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.retreatVisible = true
      }).catch(() => {
      })
    },
    closeForm () {
      this.retreatVisible = false
      this.retreatForm = {
        backReason: '',
        nos: []
      }
      this.$nextTick(() => {
        this.$refs['retreatForm'].clearValidate()
      })
    },
    confirmForm () {
      this.$refs['retreatForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let data = this.retreatForm
        data.nos = this.nos
        this.$post({
          url: 'API@/dec-common/dec/orc/backEntrust',
          data: data,
          success: (res) => {
            this.$message({
              type: 'success',
              message: '退回成功'
            })
            this.pageList(this.$store.state.pagination)
            this.closeForm()
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
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
    margin-bottom: 14px;
    font-size: 0;
  }
  .mg-r-10{
    margin-right: 10px;
  }
  .query-btn {
    text-align: center;
  }
  .icon-btn {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: sub;
    margin-right: 5px;
  }
  .btn-padding {
    padding: 8px 20px !important;
  }
  .airvehicle-table-popper{
    min-width: auto;
    ul{
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
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle
    }
  .upload-demo {
    display: inline-block;
  }
</style>
