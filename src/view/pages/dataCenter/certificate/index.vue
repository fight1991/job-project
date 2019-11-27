<template>
  <section class='sys-main'>
     <!-- 头部 -->
     <el-row class='sys-header'>
      <!-- 新建按钮 -->
      <el-row class='mg-b-15'>
        <el-col :span="18">
          <el-button type="primary" size="mini" @click="add">新建</el-button>
        </el-col>
      </el-row>
      <!-- 新建按钮 end-->
    </el-row>
    <el-row class = "query-condition data-center">
      <el-form :label-width="labelFormWidth.four" :model="queryForm" size="mini" label-position="right">
    <!-- 查询条件 -->
        <el-row>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="委托企业">
              <el-autocomplete
                size='mini' style="width:100%" clearable
                :maxlength="20"
                v-model="queryForm.corpName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="证书名称">
               <el-input v-model="queryForm.certificateName" clearable :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="证书编号">
              <el-input v-model="queryForm.certificateNo" clearable :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="上传人">
              <el-select v-model="queryForm.createUserName" style="display: unset" default-first-option :allow-create="true"  clearable filterable>
                <el-option
                  v-for="item in uploaders"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userName"
                 >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
          <el-col :md="12" :lg="12">
            <el-form-item label="到期时间" class="form-item-mg0">
              <el-date-picker size="mini"  style="width:100%;"
                v-model="expiryDate"
                type="daterange"
                :editable='false'
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="上传时间" class="form-item-mg0">
              <el-date-picker size="mini"  style="width:100%;"
                v-model="dates"
                type="daterange"
                :editable='false'
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row style="text-align:center;">
            <el-button size="mini" type="primary" @click="search()">查询</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
        </el-row>
       <!-- 查询条件 end-->
      </el-form>
    </el-row>
      <!-- 头部 end-->
      <!-- 主显示框 -->
      <div class='query-table'>
        <!-- 列表 list -->
        <el-row style="margin-bottom: 12px;">
        <el-button  size="mini" @click="delect"  class="list-btns list-icon-delete" :disabled="!checkifmy()"><i></i>删除</el-button>
        </el-row>
        <el-table class='sys-table-table' height="398px"
          border highlight-current-row size="mini" ref="certTable"
          @selection-change="selectionChange" @row-click='rowClickDecList' @select-all='selectALl'
          :data="resultList">
          <el-table-column  type="selection" min-width="50" align="center"></el-table-column>
          <el-table-column label="委托企业" min-width="100" prop="corpName">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.corpName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="证书名称" min-width="70">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.certificateName+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="证书编号" min-width="70">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.certificateNo+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="到期日期" min-width="70">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.expiryDate+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="到期预警日期" min-width="70">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.warningTime+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" min-width="70">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.createTime || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="上传人" min-width="70">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.createUserName || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                <el-button type="text" class="table-icon list-icon-edit" @click="toEdit('edit',scope.row)" v-if="scope.row.createUser == $store.state.userLoginInfo.userId" title="编辑"><i></i></el-button>
                <el-button type="text" class="table-icon list-icon-warning" @click="warningSet(scope.row)"  v-if="scope.row.createUser == $store.state.userLoginInfo.userId" title="预警"><i></i></el-button>
                <el-button type="text" class="table-icon list-icon-scan" @click="previewPicture(scope.row)" title="附件"><i></i></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-row class='sys-page-list'>
            <el-col :span="24" align="right">
                <page-box :pagination='paginationInit' @change="queryList"></page-box>
            </el-col>
        </el-row>
      </div>
      <el-dialog :modal-append-to-body='false' title="预警设置" :visible.sync="setDialogVisible" :close-on-click-modal="false" width="950px">
        <el-form label-width="150px" :model="setDialogForm" ref="setDialogForm" :rules="rule" size="mini" label-position="right" class="order-label">
          <el-row>
            <el-col :span="18" :offset="4">
              <el-form-item label="委托企业">
                <span style="padding-left:20px">{{setDialogForm.corpName}}
                  </span>
              </el-form-item>
              <el-form-item label="预警时间设置" prop='type'>
                <el-row :gutter="10">
                  <el-radio-group size='small'  v-model="setDialogForm.dateConfig" @change="datesChange">
                    <el-row style="margin-bottom:20px">
                      <el-radio label="30">到期前30天</el-radio>
                      <el-radio label="15">到期前15天</el-radio>
                      <el-radio label="5">到期前5天</el-radio>
                    </el-row>
                    <el-row >
                      <el-radio label="">自定义到期时间</el-radio>
                    </el-row>
                  </el-radio-group>
                </el-row>
              </el-form-item>
              <el-form-item label="" prop="inputDays">
                <span style="padding-left:20px">到期时间前
                  <el-input style="width:80px;margin:0 10px" size="mini" clearable v-model="setDialogForm.inputDays" :disabled="isDisabled" :maxlength="3"></el-input>
                  天</span><br>
                  <div>
                  <span style="color:red">*注:设置后,同一委托企业下的证书预警设置会一并同步</span>
                  </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button size="mini" type="primary" @click="saveDialogForm">确定</el-button>
          <el-button size="mini" @click="cancleDialogForm">取消</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
import validator from '@/common/validator'
import util from '@/common/util'
export default {
  data () {
    return {
      queryForm: {
        corpName: '',
        serviceName: '',
        startTime: '',
        endTime: ''
      },
      setDialogForm: {
        dateConfig: '',
        inputDays: ''
      },
      rule: {
        inputDays: [{ required: true, validator: validator.Zz0, message: '请输入正整数,最多三位', trigger: 'blur' }]
      },
      isDisabled: true,
      setDialogVisible: false, // 预警弹框
      selection: [],
      selectRow: [],
      uploaders: [],
      corpListOptions: [], // 委托企业
      dates: ['', ''],
      expiryDate: ['', ''],
      resultList: [] // 表格数据
    }
  },
  created () {
    this.getUsers()
    this.reset()
    this.paginationInit = this.$store.state.pagination
    this.corpList()
    this.search()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path === '/dataCenter/certificate') {
        this.corpList()
        this.search()
      }
    }
  },
  methods: {
    // 新建
    add () {
      this.$router.push({
        name: 'addCertificate'
      })
    },
    delect () {
      this.$confirm('确定删除当前选择的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'todelect_btn',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-document-center/certificate/delete',
          data: {pid: this.selection},
          router: this.$router,
          success: (res) => {
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.search()
            }
          }
        })
      })
    },
    // 预览图片
    previewPicture (file) {
      util.fileView(file.certificateUrl)
    },
    // 编辑
    toEdit (type, row) {
      this.$router.push({
        path: '/dataCenter/certificate/addCertificate',
        query: {
          type: type,
          certificatePid: row.certificatePid,
          ownerCodeScc: row.ownerCodeScc
        }
      })
    },
    // 获取当前企业下员工
    getUsers () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/corpManage/queryUserList',
        data: {corpId: this.$store.state.userLoginInfo.companyCode},
        router: this.$router,
        success: (res) => {
          if (res.success) {
            this.uploaders = res.result
          }
        }
      })
    },
    // 委托企业
    corpList (val) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/dccommon/queryCertificateCorps',
        data: val,
        router: this.$router,
        success: (res) => {
          if (res.success) {
            let json = JSON.stringify(res.result)
            json = json.replace(/ownerName/g, 'value')
            this.corpListOptions = JSON.parse(json)
          }
        }
      })
    },
    // 输入2个字后搜索
    querySearch (queryString, cb) {
      if (this.queryForm.corpName.length < 2) {
        return
      }
      let restaurants = this.corpListOptions
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    checkifmy () {
      if (this.selectRow.length === 0) {
        return false
      }
      for (let x = 0; x < this.selectRow.length; x++) {
        if (this.selectRow[x].createUser !== this.$store.state.userLoginInfo.userId) {
          return false
        }
      }
      return true
    },
    // 选择列表行
    rowClickDecList (row) {
      // 获取当前的pid
      if (this.selectRow.indexOf(row) >= 0) {
        this.selection.splice(this.selection.indexOf(row), 1)
        this.selectRow.splice(this.selectRow.indexOf(row), 1)
        this.$refs.certTable.toggleRowSelection(row, false)
      } else {
        this.selection.push(row.certificatePid)
        this.selectRow.push(row)
        this.$refs.certTable.toggleRowSelection(row, true)
      }
    },
    selectALl (selection) {
      this.selection = []
      this.selectRow = []
      if (selection.length !== 0) {
        for (let a in selection) {
          this.selection.push(selection[a].certificatePid)
        }
      }
      this.selectRow = selection
    },
    // 选择
    selectionChange (selection, row) {
      this.selection = []
      this.selectRow = []
      if (selection.length !== 0) {
        for (let a in selection) {
          this.selection.push(selection[a].certificatePid)
          this.selectRow.push(row)
        }
        this.selectRow = selection
      }
    },
    // 打开预警设置弹出框
    warningSet (row) {
      this.setDialogVisible = true
      this.setDialogForm.corpName = row.corpName
      if (util.isEmpty(row.warningDays)) {
        this.isDisabled = true
        this.setDialogForm.inputDays = ''
        this.setDialogForm.dateConfig = '30'
      } else if (parseInt(row.warningDays) === 5 || parseInt(row.warningDays) === 15 || parseInt(row.warningDays) === 30) {
        this.setDialogForm.dateConfig = row.warningDays + ''
        this.setDialogForm.inputDays = ''
        this.isDisabled = true
      } else {
        this.isDisabled = false
        this.setDialogForm.dateConfig = ''
        this.setDialogForm.inputDays = row.warningDays + ''
      }
      this.$nextTick(() => {
        this.$refs['setDialogForm'].clearValidate()
      })
    },
    // 预警设置保存
    saveDialogForm () {
      let days = ''
      if (this.setDialogForm.dateConfig !== '') {
        days = this.setDialogForm.dateConfig
        this.saveDispatch(days)
      } else {
        days = this.setDialogForm.inputDays
        this.$refs['setDialogForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.saveDispatch(days)
        })
      }
    },
    // 关闭弹出框
    cancleDialogForm () {
      this.setDialogVisible = false
    },
    saveDispatch (days) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/certificate/editTime',
        data: {corpName: this.setDialogForm.corpName, days: days},
        router: this.$router,
        success: (res) => {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.setDialogVisible = false
          this.search()
        }
      })
    },
    // 预警设置
    datesChange (value) {
      if (value === '') {
        this.isDisabled = false
      } else {
        this.isDisabled = true
        this.setDialogForm.inputDays = ''
        this.$nextTick(() => {
          this.$refs['setDialogForm'].clearValidate()
        })
      }
    },
    createFilter (queryString) {
      return (restaurant) => {
        if (util.isEmpty(restaurant.value)) {
          return false
        } else {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      }
    },
    // 查询
    search () {
      this.queryList(this.$store.state.pagination)
    },
    // 列表
    queryList (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
      } else {
        this.queryForm.startTime = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryForm.endTime = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      if (this.expiryDate === '' || this.expiryDate === null) {
        this.queryForm.endExpiryDate = ''
        this.queryForm.startExpiryDate = ''
      } else {
        this.queryForm.startExpiryDate = util.dateFormat(this.expiryDate[0], 'yyyy-MM-dd')
        this.queryForm.endExpiryDate = util.dateFormat(this.expiryDate[1], 'yyyy-MM-dd')
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/certificate/queryCertificateList',
        data: {
          ...this.queryForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.resultList = util.isEmpty(res.result) ? [] : res.result
          this.paginationInit = res.page
          this.selection = []
          this.selectRow = []
        }
      })
    },
    // 重置
    reset () {
      this.dates = ['', '']
      this.expiryDate = ['', '']
      this.queryForm = {
        serviceName: '',
        startTime: '',
        endTime: ''
      }
      this.search()
    },
    // 跳转到详情页面
    toDetailList (corpSccCode, corpName) {
      this.$router.push({
        path: '/dataCenter/certificate/detailListCertificate',
        query: {
          sccCode: corpSccCode,
          corpName: encodeURIComponent(corpName)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .query-condition {
    background-color: #fff;
  }
  .query-table {
    background-color: #fff;
    margin-top: 20px;
  }
  .todelect_btn:hover{
    color:black !important
  }
  .sys-main .form-item-mg0.el-form-item--mini.el-form-item {
    margin-bottom: 18px;
  }
  .query-table{
    padding:12px 18px;
  }
</style>
