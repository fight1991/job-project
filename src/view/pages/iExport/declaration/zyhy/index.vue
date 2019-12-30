<template>
<!-- shipping 查询界面组件-->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.four" :model="queryForm" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="状态">
               <el-select placeholder="" v-model="queryForm.taskStatus" clearable
                filterable style="width:100%">
                  <el-option
                  v-for="item in stautsList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="制单日期">
              <el-date-picker title='制单日期' v-model="dates" style="width:100%"
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
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryList" class= 'btn-padding' >查询</el-button>
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
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1"
          :before-upload="beforeUpload"
          :show-file-list="false">
            <el-button size="mini" class="file-inputx list-btns list-icon-import"><i></i>导入</el-button>
        </el-upload>
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
        :data="searchResultList" border highlight-current-row size="mini"
        @selection-change="changeFun" height="400px"
        :max-height="$store.state.tableHeight" >
        <el-table-column  type="selection" align='center' min-width="40"></el-table-column>
        <el-table-column label="系统编号" align='center' prop="taskId" min-width="120" v-if="fieldList.decPid.value"></el-table-column>
        <el-table-column label="状态" align='left'  prop="taskStatusValue" min-width="100" v-if="fieldList.taskStatus.value"></el-table-column>
        <el-table-column label="创建时间" align='center'  prop="taskTime" min-width="100" v-if="fieldList.createTime.value"></el-table-column>
        <el-table-column label="操作" fixed="right" align='center' min-width="140" >
          <template slot-scope="scope">
            <el-button type="text" v-show='scope.row.taskStatus == "PROCESS_SUCCEED"' class="table-icon list-icon-look" @click="editDetail(scope.row)" title="详情"><i></i></el-button>
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
  </section>
</template>
<script>
import util from '@/common/util'
import pickerOptions from '@/common/mixin/pickerOptions'
export default {
  name: 'zyAi',
  mixins: [pickerOptions],
  data () {
    return {
      queryForm: {
        taskStatus: '', // 状态
        startTime: '',
        endTime: ''
      },
      dates: '', // 日期
      searchResultList: [], // 智能制单查询结果数据
      checkedData: [], // 被选中数据
      fileList: [], // 存放上传文件
      stautsList: [{
        codeField: 'PROCESSING',
        nameField: ' 处理中'
      }, {
        codeField: 'PROCESS_SUCCEED',
        nameField: '处理成功'
      }, {
        codeField: 'PROCESS_FAILED',
        nameField: '处理失败'
      }],
      fieldList: {
        decPid: {
          value: true,
          text: '系统编号'
        },
        taskStatus: {
          value: true,
          text: '状态'
        },
        createTime: {
          value: true,
          text: '创建日期'
        }
      }
    }
  },
  created () {
    this.getUserInfo()
    this.setDefualtDate()
    this.queryList()
  },
  mounted () {
  },
  methods: {
    // 重置报关单模板的查询条件
    resetForm  () {
      this.queryForm = {
        taskStatus: '', // 状态
        startTime: '',
        endTime: ''
      }
      this.dates = []
    },
    // 报关单模板列表查询
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
    // 分页列表
    pageList (pagination) {
      this.$post({
        url: 'API@/saas-ai/tran-ocr/listTranOcrTasks',
        data: {
          ...this.queryForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.searchResultList = res.result
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
    // 列表数据选择时的变化
    changeFun (val) {
      this.checkedData = util.simpleClone(val)
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      this.userId = this.$store.state.userLoginInfo.userId
      if (!util.isEmpty(this.userId)) {
        let fieldList = window.localStorage.getItem('intelligentVouching' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.fieldList, list)) {
            this.fieldList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem('intelligentVouching' + this.userId, JSON.stringify(this.fieldList))
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
      // key值 为SIP tableHead SIP加当前用户的id
      window.localStorage.setItem('intelligentVouching' + this.userId, JSON.stringify(this.fieldList))
    },
    // 上传文件
    beforeUpload (file) {
      let allow = ['image/png', 'image/jpeg', 'image/bmp', 'application/pdf', 'application/x-zip-compressed', 'application/zip', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allow.includes(file.type)) {
        this.messageTips('上传文件只支持图片、zip、pdf、word、excel格式', 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 10240)) {
        this.messageTips('上传文件大小不能超过10MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        param.append('filePath', '/download')
        if (file.type !== 'application/x-zip-compressed') {
          param.append('filePath', '/longshine/document/ocr/upload')
        }
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          success: (res) => {
            this.fileList = []
            this.fileList.push(res.result)
            this.upLoadExcel(res.result)
          }
        })
      }
      return false
    },
    upLoadExcel (file) {
      this.$post({
        url: 'API@/saas-ai/tran-ocr/addTranOCRTask',
        data: {
          files: [{
            fileName: file.name,
            fileUrl: file.url
          }]
        },
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.pageList()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 跳转详情页面
    editDetail (row) {
      this.$router.push({
        name: 'zyhyIntelVouching',
        params: {
          'taskId': row.taskId,
          'setTitle': 'AI制单' + '-' + row.taskId,
          'setId': 'zyhyIntelVouching@look@' + row.taskId
        }
      })
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
