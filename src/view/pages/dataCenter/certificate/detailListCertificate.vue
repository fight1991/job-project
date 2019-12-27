<template>
  <section class='sys-main'>
     <!-- 头部 -->
    <el-row class='sys-header'>
      <!-- 返回按钮 -->
      <el-row class='mg-b-15'>
        <el-col :span='12' :xs='24'>
          <span @click="back" class="sys-back-btn list-icon-back"><i></i>返回</span>
        </el-col>
        <el-col :span='12' :xs='24'>
          <el-button type="primary" size="mini" @click="warningSet" class="sys-fr" style='float: right;margin-left:5px;'>预警设置</el-button>
          <el-button type="primary" size="mini" @click="add" class="sys-fr">新建</el-button>
        </el-col>
      </el-row>
      <!-- 返回按钮 end-->
        <el-row class = "query-condition">
          <el-row>
            <el-col :span="12">
              委托企业：<span class="top-text">{{certificateDetailForm.corpName}}</span>
            </el-col>
            <el-col :span="12">
              证书数：<span class="top-text">{{count}}</span>
            </el-col>
          </el-row>
        </el-row>
          <el-row class = "query-table">
          <!-- 查询条件 -->
            <el-form label-width="0px" :model="certificateDetailForm" size="mini" label-position="right">
              <el-row :gutter="50">
                <el-col :span="6" :xs="12">
                  <el-form-item class="form-item-mg0">
                    <el-input size="mini" clearable v-model="certificateDetailForm.input" placeholder="证书名称、证书编号"></el-input>
                  </el-form-item>
                  </el-col>
                  <el-col :span="8" :xs="12">
                    <el-form-item :label-width="labelFormWidth.four" label="到期日期" class="form-item-mg0">
                    <el-date-picker size="mini" style="width:100%;"
                      v-model="dates"
                      @change="search()"
                      type="daterange"
                      :editable='false'
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :xs="12">
                  <el-button size="mini" type="primary" @click="search()">查询</el-button>
                  <el-button size="mini" @click="resetQuery">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <!-- 查询条件 end-->
          </el-row>
        </el-row>
    <!-- 头部 end-->
    <!-- 主显示框 -->
    <div class='query-table'>
      <!-- 列表 list -->
      <el-table class='sys-table-table' height="422px"
        border highlight-current-row size="mini"
        :data="certificateList">
        <el-table-column label="证书名称" min-width="200">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.certificateName || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="证书编号" min-width="200">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.certificateNo || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="到期日期" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.expiryDate || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="到期预警日期" min-width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>{{scope.row.warningTime || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <div class='sys-td-c'>
              <el-button type="text" class="table-icon list-icon-edit"  @click="toEdit('edit',scope.row)" title="编辑"><i></i></el-button>
              <el-button type="text" class="table-icon list-icon-delete" @click="deleteBtn(scope.row.certificatePid)" title="删除"><i></i></el-button>
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
                  天</span>
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
      rule: {
        inputDays: [{ required: true, validator: validator.Zz0, message: '请输入正整数,最多三位', trigger: 'blur' }]
      },
      setDialogVisible: false, // 预警弹框
      setDialogForm: {
        dateConfig: '',
        inputDays: ''
      },
      isDisabled: true,
      count: '',
      certificateDetailForm: {
        corpName: '',
        sccCode: '',
        input: '',
        startTime: '',
        endTime: ''
      },
      dates: ['', ''],
      warningDays: '',
      certificateList: [] // 表格数据
    }
  },
  created () {
    this.reset()
    this.paginationInit = this.$store.state.pagination
    this.certificateDetailForm.sccCode = this.$route.query.sccCode
    this.certificateDetailForm.corpName = util.isEmpty(this.$route.query.corpName) ? '' : decodeURIComponent(this.$route.query.corpName)
    this.search()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('detailListCertificate') === -1) {
        return
      }
      this.reset()
      this.paginationInit = this.$store.state.pagination
      this.certificateDetailForm.sccCode = to.query.sccCode
      this.certificateDetailForm.corpName = util.isEmpty(to.query.corpName) ? '' : decodeURIComponent(to.query.corpName)
      this.search()
    }
  },
  methods: {
    // 返回按钮
    back () {
      this.$router.push({
        name: 'certificate'
      })
    },
    // 打开预警设置弹出框
    warningSet () {
      this.setDialogVisible = true
      if (util.isEmpty(this.warningDays)) {
        this.isDisabled = true
        this.setDialogForm.inputDays = ''
        this.setDialogForm.dateConfig = '30'
      } else if (parseInt(this.warningDays) === 5 || parseInt(this.warningDays) === 15 || parseInt(this.warningDays) === 30) {
        this.setDialogForm.dateConfig = this.warningDays + ''
        this.setDialogForm.inputDays = ''
        this.isDisabled = true
      } else {
        this.isDisabled = false
        this.setDialogForm.dateConfig = ''
        this.setDialogForm.inputDays = this.warningDays + ''
      }
      this.$nextTick(() => {
        this.$refs['setDialogForm'].clearValidate()
      })
    },
    // 关闭弹出框
    cancleDialogForm () {
      this.setDialogVisible = false
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
    saveDispatch (days) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/certificate/editTime',
        data: {corpName: this.certificateDetailForm.corpName, days: days},
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
    // 查询
    search () {
      this.queryList(this.$store.state.pagination)
    },
    // 重置查询条件
    resetQuery () {
      this.dates = ['', '']
      this.certificateDetailForm = {
        sccCode: this.$route.query.sccCode,
        corpName: util.isEmpty(this.$route.query.corpName) ? '' : decodeURIComponent(this.$route.query.corpName),
        input: '',
        startTime: '',
        endTime: ''
      }
      this.search()
    },
    // 证书列表
    queryList (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.certificateDetailForm.startTime = ''
        this.certificateDetailForm.endTime = ''
      } else {
        this.certificateDetailForm.startTime = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.certificateDetailForm.endTime = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/certificate/queryList',
        data: {
          ...this.certificateDetailForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          if (!util.isEmpty(res.result)) {
            this.certificateList = util.isEmpty(res.result.certificateInfoVOS) ? [] : res.result.certificateInfoVOS
            this.paginationInit = res.page
            this.count = res.result.count
            this.warningDays = res.result.warningDays
          } else {
            this.certificateList = []
          }
        }
      })
    },
    // 重置
    reset () {
      this.count = ''
      this.certificateDetailForm = {
        corpName: '',
        sccCode: '',
        input: '',
        startTime: '',
        endTime: ''
      }
      this.dates = ['', '']
    },
    // 新建
    add () {
      this.$router.push({
        path: '/dataCenter/certificate/addCertificate',
        query: {
          ownerCodeScc: this.certificateDetailForm.sccCode,
          corpName: encodeURIComponent(this.certificateDetailForm.corpName)
        }
      })
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
    // 删除
    deleteBtn (val) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-document-center/certificate/delete',
          data: {pid: val},
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.search()
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .query-condition {
    background-color: #fff;
    padding: 20px;
  }
  .top-text{
    padding-left: 10px;
    color: @font-color-main;
    font-size: 14px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .sys-fr{
    float: right;
  }
  .sys-table-detail-expand{
    padding:0 15px;
    .detail-infos{
        margin:0 20px;
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        .detail-info{
        padding: 5px 0;
        }
        .detail-info-title{
        background-color: #eef1f6;
        }
        .detail-img,.no-pic{
        display: inline-block;
        margin-right: 20px;
        height:100px;
        cursor: pointer;
        }
    }
    .detail-infos:last-child{
        border-bottom: 1px solid #dfe6ec;
    }
  }
</style>
