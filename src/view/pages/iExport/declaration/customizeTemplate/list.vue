<template>
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.six" :model="queryForm" size="mini" label-position="right">
        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="模版名称" >
              <el-input v-model="queryForm.templateName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="境内收发货人">
              <el-input v-model="queryForm.tradeCusCode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最近操作时间">
              <el-date-picker v-model="dates" style="width:100%"
                type="daterange" clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryList" style="padding: 8px 20px;">查询</el-button>
            <el-button size="mini" @click="reset" style="padding: 8px 20px;">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class="query-table dec-query-table">
      <!-- 操作 -->
     <el-row class="op-btn">
      <el-button size="mini" class="list-btns list-icon-add" @click="changeUploadVisible(true)"><i></i>新增</el-button>
      <el-button size="mini" class="list-btns list-icon-edit" @click="edit"><i></i>编辑</el-button>
      <el-button size="mini" class="list-btns list-icon-delete" @click="deleteData"><i></i>删除</el-button>
      </el-row>
      <!-- 列表 list -->
      <el-table class="sys-table-table dec-table"
        ref="resultTable"
        :data="resultList"
        :height="tableHeight"
        border highlight-current-row size="mini"
        @selection-change="changeFun"
        @row-click="rowClickChange">
        <el-table-column  type="selection" align='center' width="37"></el-table-column>
        <el-table-column label="模版名称" align='left' prop="templateName" min-width="120"></el-table-column>
        <el-table-column label="境内收发货人名称" align='left' prop="tradeCusName" min-width="120"></el-table-column>
        <el-table-column label="境内收发货人代码" align='left' prop="tradeCusCode" min-width="160"></el-table-column>
        <el-table-column label="最近操作时间" align='center' prop="updateTime" min-width="160"></el-table-column>
        <el-table-column label="创建人" align='center' prop="createUserName" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" align='center' min-width="140" >
          <template slot-scope="scope">
            <a href="javascript:void(0)" class="list-icon-editH border-0" title="编辑" @click="editDetail(scope.row)"><i class='dec-i'></i></a>
            <a href="javascript:void(0)" class="list-icon-lookH border-0" title="查看" @click.stop="lookupDetail(scope.row)"><i class='dec-i'></i></a>
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
      title="新增模版"
      :visible.sync="uploadVisible"
      :show-close='true'
      class="sys-dec-class"
      width="640px">
      <span class="label_ft14">选择模板文件：</span>
       <el-upload
          action="http://127.0.0.1"
          class="avatar-uploader"
          :before-upload="beforeUpload"
          :show-file-list="true"
          :file-list="fileList"
          :limit="1">
          <el-button type="primary"  class="dialog-primary-btn">点击上传</el-button>
        </el-upload>
        <div  class="sys-dialog-footer" style="text-align:center;">
          <el-button class='dialog-primary-btn' @click="toSettingPage">确定</el-button>
          <el-button class='dialog-btn' @click="changeUploadVisible(false)">取消</el-button>
        </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'

export default {
  data () {
    return {
      uploadVisible: false,
      uploadFileUrl: '',
      fileList: [],
      tableHeight: 400, // 默认高度
      dates: '', // 日期
      resultList: [],
      tableValue: [],
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
          text: '最近7天',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
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
      queryForm: this.generateForm()
    }
  },
  created () {
  },
  mounted () {
    // 初始化查询日期
    this.setDefaultDate()
    this.queryList()
  },
  methods: {
    // 跳转编辑页面
    edit () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择一条需要编辑的数据')
      } else if (len > 1) {
        this.messageTips('只能选择一条需要编辑的数据')
      } else {
        let row = this.tableValue[0]
        this.goPage('edit', row.customTemplateDecPid)
      }
    },
    // 多选框选中或取消时
    changeFun (val) {
      this.tableValue = val
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
        this.$refs.resultTable.toggleRowSelection(row, false)
      } else {
        this.$refs.resultTable.toggleRowSelection(row, true)
      }
    },
    // 删除
    deleteData () {
      let len = this.tableValue.length
      if (len === 0) {
        this.messageTips('请选择需要删除的数据！')
        return
      }
      // 删除
      let pidList = []
      for (let i in this.tableValue) {
        pidList.push(this.tableValue[i].customTemplateDecPid)
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
          url: 'API@/dec-common/customTemplate/delete',
          data: {
            'customTemplateDecPids': pidList
          },
          success: (res) => {
            this.messageTips(res.message, 'error')
            this.queryList()
          }
        })
      }).catch(() => {
      })
    },
    editDetail (row) {
      this.goPage('edit', row.customTemplateDecPid)
    },
    goPage (operationType, pid = 'new') {
      this.$router.push({
        name: 'customizeTemplate',
        params: {
          'pid': pid,
          'operationType': operationType,
          'setTitle': '自定义模版' + '-' + pid,
          'setId': 'customizeTemplate' + operationType + pid
        }
      })
    },
    lookupDetail (row) {
      this.goPage('look', row.customTemplateDecPid)
    },
    generateForm () {
      return {
        templateName: '',
        tradeCusCode: '',
        startTime: '', // 最近开始操作时间
        endTime: ''
      }
    },
    reset () {
      this.queryForm = this.generateForm()
      this.dates = []
    },
    queryList () {
      if (this.dates === '' || this.dates === null) {
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
      } else {
        this.queryForm.startTime = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryForm.endTime = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.pageList(this.$store.state.pagination)
    },
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/customTemplate/getList',
        data: {
          ...this.queryForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.resultList = res.result
        }
      })
    },
    // 设置默认的查询日期
    setDefaultDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    changeUploadVisible (visible) {
      this.uploadVisible = visible
      this.fileList = []
    },
    beforeUpload (file) {
      if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].indexOf(file.type) === -1) {
        this.messageTips('上传文件只支持xlsx,xls格式', 'error')
        this.changeUploadVisible(false)
      } else if (!(Math.ceil(file.size / 1024) <= 2048)) {
        this.messageTips('上传文件大小不能超过2MB', 'error')
        this.changeUploadVisible(false)
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        let sccCode = this.$store.state.userLoginInfo.sccCode
        let date = util.dateFormat(new Date(), 'yyyyMMdd')
        param.append('filePath', `/longshine/dec/${sccCode}/doc/${date}`)
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          success: (res) => {
            this.fileList = []
            this.fileList.push(res.result)
            this.uploadFileUrl = res.result.url
          }
        })
      }
      return false
    },
    toSettingPage () {
      window.sessionStorage.setItem('customizeTemplateUrl', this.uploadFileUrl)
      this.changeUploadVisible(false)
      this.$router.push({
        name: 'customizeTemplate',
        params: {
          'pid': 'new',
          'operationType': 'add',
          'setTitle': '自定义模版',
          'setId': 'customizeTemplate' + 'add' + 'new'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .query-main {
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
  .query-btn {
    text-align: center;
  }
  .op-btn {
    margin-bottom: 12px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  .label_ft14{
    font-size: 14px;
  }
  .avatar-uploader{
    display: inline-block;
  }
  .el-upload-list__item{
    padding: 5px 0;
  }
  .el-upload-list__item-status-label{
    top: 50%;
    transform: translateY(-50%);
  }
  .sys-dialog-footer {
    margin-top: 16px
  }
</style>
