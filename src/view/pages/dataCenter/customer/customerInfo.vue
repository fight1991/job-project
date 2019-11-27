<template>
  <section class='query-main sys-main' style="margin:0px">
    <!-- 查询条件 -->
    <div class = "query-condition data-center" style="background-color:white;">
      <!-- -->
      <el-form :label-width="labelFormWidth.four" size="mini">
        <el-row>
          <el-col :md="8" :lg="8">
            <el-form-item label="客户代码" class="select-Color">
              <el-input v-model="queryForm.customCode" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="8" :lg="8">
            <el-form-item label="客户名称" >
              <el-input v-model="queryForm.customName" maxlength="70"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="8" :lg="8">
            <el-form-item label="审核状态">
              <el-select size="mini" filterable v-model="queryForm.auditStatus" default-first-option clearable>
                <el-option
                  v-for="item in cusstatusList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="14" :offset="10" class='query-btn' style='margin-top:2px'>
            <el-button size="mini" type="primary" style="padding: 8px 20px;" @click="queryList">查询</el-button>
            <el-button size="mini" style="height:30px" @click="resetFun">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table' style="margin-top:20px">
      <!-- 按钮 -->
      <el-row style="background-color:white;padding:12px 18px;">
      <el-row class="op-btn" style="margin-bottom:12px">
        <el-button size="mini" @click="opennewdia()" class="list-icon-add" ><i class="cus-i"></i>新增</el-button>
        <el-button size="mini" @click="delectcus()" :disabled="nowselect.length === 0" class="list-icon-delete btn-margin"><i class="cus-i"></i>删除</el-button>
        <el-dropdown @command='downloadFun' class="btn-margin">
            <el-button size="mini" class="list-icon-import">
              <i class="cus-i"></i>导入
            </el-button>
            <el-dropdown-menu slot="dropdown" size='mini'>
              <el-dropdown-item command="nomal" >
                <el-upload
                class="upload-demo"
                action="http://127.0.0.1"
                :before-upload="beforeUpload"
                :show-file-list="false">
                <span>导入文件选择</span>
              </el-upload>
              </el-dropdown-item>
              <el-dropdown-item command="download" >
                <span>导入模板下载</span>
              </el-dropdown-item>
              <el-dropdown-item command="record">
                <span>导入记录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        <el-button size="mini"  @click="exportcus()" :disabled="nowselect.length===0" class="list-icon-export btn-margin"><i class="cus-i"></i>导出</el-button>
      </el-row>

      <!-- 列表table开始 -->
      <el-table class='sys-table-table' border highlight-current-row :header-cell-style="{'text-align':'center'}" :height='500' size="mini" :data="queryresult" ref="reference" @select="selectionChange" @select-all='selectionChange' @row-click='rowselect'>
        <el-table-column  type="selection" width="35">
        </el-table-column>
        <el-table-column label="客户代码" min-width="130" >
          <template slot-scope="scope">
            <div class='customer-table-c'>
            {{scope.row.customCode || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" min-width="100">
          <template slot-scope="scope">
            <div class="text-over-hid" :title="scope.row.customName">
            {{scope.row.customName || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="社会信用代码" min-width="100">
           <template slot-scope="scope">
             <div class="text-over-hid customer-table-c" :title="scope.row.sccCode">
              {{scope.row.sccCode || '-'}}
              </div>
            </template>
        </el-table-column>
        <el-table-column label="海关编码" min-width="130">
          <template slot-scope="scope">
            <div class="text-over-hid customer-table-c" :title="scope.row.tradeCode">
            {{scope.row.tradeCode || '-'}}
            </div>
          </template></el-table-column>
        <el-table-column label="检验检疫编码" min-width="100">
          <template slot-scope="scope">
            <div class="text-over-hid customer-table-c" :title="scope.row.ciqCode">
            {{scope.row.ciqCode || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" min-width="110">
          <template slot-scope="scope">
            <div class="text-over-hid customer-table-c" :title="scope.row.auditStatusValue">
            {{scope.row.auditStatusValue || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <div class='customer-table-c'>
            <el-button type="text" @click="gotoDetail(scope.row,'view')" title="查看" class="table-icon list-icon-look"><i class="cus-i"></i></el-button>
            <el-button type="text" @click="gotoDetail(scope.row,'edit')" title="编辑" class="table-icon list-icon-edit"><i class="cus-i"></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='pagination' @change="queryList()"></page-box>
        </el-col>
      </el-row>
      </el-row>
    </div>
    <el-dialog :modal-append-to-body='false'
      :title="ifedit?'修改客户信息':'新增客户信息'"
      :visible.sync="newdiaview"
      :close-on-click-modal='false'
      :append-to-body='true'
      @closed='newcustomerClosed'
      width="50%"

      >
      <div class="dec-div">
      <el-form size="mini" :label-width=labelFormWidth.five label-position="left" class="order-label" :model="newcustomer" ref='newcustinput' :rules='newRule'>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="客户代码"  prop='customCode'>
              <el-input v-model="newcustomer.customCode" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="客户名称" prop='customName'>
              <el-select v-model="newcustomer.customName" maxlength="70" style="width:100%"
                filterable remote clearable placeholder=" " allow-create @change="translatecustom()" @clear='clearCorp()'
                :remote-method="getcorps"
                default-first-option >
                <el-option
                  v-for="item in corps"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="社会信用代码" class="more-txt-lh" :prop="newcustomer.customCountry ==='1'?'sccCode':''">
              <el-input v-model="newcustomer.sccCode" :disabled="!!newcustomer.customCorpId" maxlength="18"   @keyup.enter.native="getcode()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="海关编码">
              <el-input v-model="newcustomer.tradeCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验检疫编码" class="more-txt-lh">
              <el-input v-model="newcustomer.ciqCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="所属国" prop='customCountry'>
              <el-select v-model="newcustomer.customCountry" filterable style="width:100%" @change="newcustomer.customCountry!=='1'?$refs['newcustinput'].clearValidate():''">
                <el-option
                  v-for="item in countrys"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人">
              <el-input v-model="newcustomer.contactUser" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式">
              <el-input v-model="newcustomer.contactWay" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="公司地址">
              <el-input v-model="newcustomer.address" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码">
              <el-input v-model="newcustomer.postCode" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="E-MAIL">
              <el-input v-model="newcustomer.email" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="备注" maxlength="400">
              <el-input v-model="newcustomer.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="ifedit">
          <el-col :span="24">
            <el-form-item label="审核意见"  maxlength="400">
              <el-input v-model="newcustomer.auditRemark" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align:center">
          <el-button type="primary" size="mini" @click="savenew">确定</el-button>
          <el-button  size="mini" @click="newdiaview = false">取消</el-button>
        </div>
      </el-form>
      </div>
    </el-dialog>
    <el-dialog :modal-append-to-body='false'
      title="导入记录"
      :visible.sync="recordview"
      :close-on-click-modal='false'
      width="50%"
      >
      <div  class="dec-div">
      <el-form size="mini" :label-width="labelFormWidth.seven" :model="inputrecord"  :rules='newRule'>
        <el-row>
          <el-col :span="8">
            <el-form-item label="导入时间：" maxlength="400">
              {{inputrecord.importTime}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="导入成功条数：" maxlength="400">
              {{inputrecord.successCount}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="导入失败条数：" maxlength="400">
              {{inputrecord.failedCount}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="导入失败详情：" maxlength="400">
                <el-input type="textarea" v-model="inputrecord.failReasons" :rows="4" :disabled="true"></el-input>
            </el-form-item>
        </el-row>
        <el-row >
        </el-row>
      </el-form>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  data () {
    return {
      queryForm: {
        'auditStatus': '',
        'customCode': '',
        'customName': ''
      },
      pagination: {
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数据条数
        total: 0 // 总条数
      },
      ifedit: false, // 是否为编辑
      corps: [],
      countrys: [], // 国家
      recordview: false,
      nowselect: [], // 当前选中项
      newRule: {
        customCode: [{required: true, message: '请输入客户代码', trigger: 'blur'}],
        customCorpName: [{required: true, message: '请选择客户名称', trigger: 'blur'}],
        sccCode: [{required: true, message: '请输入社会信用代码', trigger: 'change'}],
        customCountry: [{required: true, message: '请输入所属国', trigger: 'blur'}],
        customName: [{required: true, message: '请输入客户名称', trigger: 'blur'}]
      },
      queryresult: [],
      selecttion: [],
      inputrecord: {}, // 导入记录
      newcustomer: {
        'address': '',
        'contactUser': '',
        'contactWay': '',
        'customCode': '',
        'customCorpId': '',
        'customCountry': '1',
        'customId': 0,
        'customName': '',
        'email': '',
        'tradeCode': '',
        'ciqCode': '',
        'postCode': '',
        'remark': '',
        'sccCode': ''
      },
      newdiaview: false,
      // 待审核、审核通过、审核驳回
      cusstatusList: [{
        code: 'COMPLETE',
        name: '审核通过'
      }, {
        code: 'WAITING',
        name: '待审核'
      }, {
        code: 'REFUCED',
        name: '审核驳回'
      }]
    }
  },
  created () {
    this.getCountry()
    this.queryList()
  },
  mounted () {
  },
  methods: {
    queryList () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getCustomList',
        data: {...this.queryForm, page: this.pagination},
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.queryresult = res.result
          this.pagination = res.page
          this.nowselect = []
        }
      })
    },
    getcorps (query) {
      if (query.length < 2) {
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: query,
          returnProps: ['sccCode', 'tradeCode', 'ciqCode', 'corpId', 'corpName']
        },
        router: this.$router,
        success: (res) => {
          this.corps = res.result
        }
      })
    },
    // 选择公司后
    translatecustom () {
      if (this.newcustomer.customName && typeof this.newcustomer.customName !== 'string') {
        this.newcustomer.sccCode = this.newcustomer.customName.sccCode
        this.newcustomer.tradeCode = this.newcustomer.customName.tradeCode
        this.newcustomer.ciqCode = this.newcustomer.customName.ciqCode
        this.newcustomer.customCorpId = this.newcustomer.customName.corpId
        this.newcustomer.customName = this.newcustomer.customName.corpName
      } else {
        this.newcustomer.customCorpId = ''
      }
    },
    // 删除公司
    clearCorp () {
      this.newcustomer.sccCode = ''
      this.newcustomer.tradeCode = ''
      this.newcustomer.ciqCode = ''
      this.newcustomer.customCorpId = ''
      this.newcustomer.customName = ''
    },
    getcode () {
      this.queryForm.page = {
        pageSize: this.$store.state.pagination.pageSize,
        pageIndex: this.$store.state.pagination.pageIndex
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getCustomList',
        data: this.queryForm,
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.corpList = res.result
        }
      })
    },
    // 删除
    delectcus () {
      this.$confirm('是否确认删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: 'API@/login/custom-manage/batchDeleteCustom',
          data: this.nowselect,
          router: this.$router,
          isLoad: true,
          success: (res) => {
            this.$message({
              message: '删除成功',
              type: 'warning'
            })
            this.queryList()
          }
        })
      })
    },
    // 新增弹框
    opennewdia () {
      this.newdiaview = true
      this.ifedit = false
      if (this.newcustomer.customCode) {
        this.$refs['newcustinput'].clearValidate()
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getRandomCode',
        data: {},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.$refs['newcustinput'].clearValidate()
          this.newcustomer.customCode = res.result
        }
      })
    },
    getCountry () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/cascadeGetArea',
        data: {codeId: '0',
          type: '0'},
        router: this.$router,
        success: (res) => {
          this.countrys = res.result
        }
      })
    },
    newcustomerClosed () {
      if (this.ifedit) {
        this.newcustomer = {customCode: '', customId: 0, customCountry: '1'}
      } else {
        this.newcustomer = {
          customCode: this.newcustomer.customCode,
          customId: 0,
          customCountry: '1',
          sccCode: ''
        }
      }
      this.corps = []
    },
    // 查看或编辑
    gotoDetail (row, type) {
      if (type === 'edit') {
        this.ifedit = true
        this.newdiaview = true
        this.newcustomer = util.simpleClone(row)
        this.$nextTick(() => {
          if (this.newcustomer.customCountry !== '1') {
            this.$refs['newcustinput'].clearValidate()
          }
        })
      } else {
        this.$router.push({
          path: '/dataCenter/customer/customerDetail',
          query: {
            customId: row.customId,
            setTitle: '客户详情-' + row.customCode,
            setId: row.customId + 'cus'
          }
        })
      }
    },
    // 导出
    exportcus () {
      let reqdata = []
      for (let a in this.nowselect) {
        reqdata.push(this.nowselect[a].customId)
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/exportCustoms',
        data: reqdata,
        router: this.$router,
        success: (res) => {
          window.open(res.result)
        }
      })
    },
    // 选择变化
    selectionChange (selection, row) {
      this.nowselect = selection
    },
    // 行点击
    rowselect (row) {
      if (this.nowselect.indexOf(row) >= 0) {
        this.$refs.reference.toggleRowSelection(row, false)
        util.removeByValue(this.nowselect, row)
      } else {
        this.$refs.reference.toggleRowSelection(row, true)
        this.nowselect.push(row)
      }
    },
    getEtpsnos () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-ems/nemsinvt/getEtpsnos',
        data: this.newcustomer,
        router: this.$router,
        success: (res) => {
          this.corpList = res.result
        }
      })
    },
    // 下载
    downloadFun (type) {
      if (type === 'record') {
        this.recordview = true
        this.$store.dispatch('ajax', {
          url: 'API@/login/custom-manage/getFailedImportDetail',
          data: {},
          router: this.$router,
          success: (res) => {
            this.inputrecord = res.result
          }
        })
      } else if (type === 'download') {
        window.open('https://www.5itrade.cn/files/decTemplet/Customer.xls')
      }
    },
    // 上传
    beforeUpload (file) {
      let fileType = util.getFileTypeByName(file.name)
      if (!(fileType === 'application/vnd.ms-excel')) {
        this.$message({
          message: '上传文件只支持exl格式',
          type: 'error'
        })
      } else if (!(Math.ceil(file.size / 1024) <= 4096)) {
        this.$message({
          message: '上传文件大小不能超过4MB',
          type: 'error'
        })
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        param.append('filePath', '/download')
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          router: this.$router,
          success: (res) => {
            this.uploadfilepath(res.result.url)
          }
        })
      }
      return false
    },
    // 导入
    uploadfilepath (url) {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/importCorpAssMember',
        data: url,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: ' 导入成功',
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    resetFun () {
      this.queryForm = {}
      this.queryList()
    },
    // 保存新增客户
    savenew () {
      this.$refs['newcustinput'].validate(valid => {
        if (valid) {
          let url = 'custom-manage/updateCustom'
          if (this.newcustomer.customId === 0) {
            url = 'custom-manage/saveCustom'
          }
          this.$store.dispatch('ajax', {
            url: 'API@/login/' + url,
            data: this.newcustomer,
            router: this.$router,
            success: (res) => {
              this.newdiaview = false
              this.newcustomer = {
                'address': '',
                'contactUser': '',
                'contactWay': '',
                'customCode': '',
                'customCorpId': '',
                'customCountry': '1',
                'customId': 0,
                'customName': '',
                'email': '',
                'tradeCode': '',
                'ciqCode': '',
                'postCode': '',
                'remark': '',
                'sccCode': ''}
              this.$message({
                message: ' 保存成功',
                type: 'success'
              })
              this.queryList()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.customer-table-c{
  text-align: center
}
.cus-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
}
.el-select{
  display: block;
}
.btn-margin{
  margin-left: 6px !important;
}
</style>
