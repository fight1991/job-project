<template>
  <section class='query-main sys-main' style="margin:-20px">
    <!-- 查询条件 -->
    <div class = "query-condition data-center" style="margin:20px;background-color:white;">
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
              <el-select size="mini" filterable v-model="queryForm.auditStatus" default-first-option  clearable>
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
          <el-col :span="14" :offset="10" class='query-btn' style="margin-top:2px">
            <el-button size="mini" type="primary" style="padding: 8px 20px;" @click="queryList">查询</el-button>
            <el-button size="mini" style="height:30px" @click="resetFun">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table' style="margin:20px;background-color:white;padding:12px 18px;">
      <!-- 按钮 -->
      <el-row class="op-btn" style="margin-bottom:12px;">
        <el-button size="mini" @click="confirm(true)" class="list-icon-check" style="font-size:12px;"  :disabled="nowselect.length===0" ><i class="cus-i" ></i>审核通过</el-button>
        <el-button size="mini" @click="confirm(false)" class="list-icon-reject" style="margin-left:6px;font-size:12px;" :disabled="nowselect.length===0"><i class="cus-i" ></i>审核驳回</el-button>
      </el-row>
      <!-- 列表table开始 -->
      <el-table class='sys-table-table' border highlight-current-row :header-cell-style="{'text-align':'center'}" :height='500' size="mini" :data="queryresult" ref="reference" @select="selectionChange" @row-click='rowclick' @select-all='slectall' >
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
        <el-table-column label="操作" min-width="80" fixed="right">
          <template slot-scope="scope">
            <div class="customer-table-c">
            <el-button type="text" @click="confirmDetail(scope.row)" title="审核" class="table-icon list-icon-subimtCheck"><i class="cus-i"></i></el-button>
            <el-button type="text" @click="getconfirmrecord(scope.row.customId)"  class="table-icon list-icon-scan" title="操作记录"><i class="cus-i"></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='pagination' @change="queryList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <el-dialog :modal-append-to-body='false'
      title="审核详情"
      :visible.sync="confirmview"
      :close-on-click-modal='false'
      width="50%"
      >
      <div class="dec-div query-mini">
      <el-form size="mini" :label-width="labelFormWidth.seven" :model="confirmshow" @closed='confirmreason = ""'>
        <el-row >
          <el-col>
            <el-form-item label="客户代码：">
              {{confirmshow.customCode}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="客户名称：">
              {{confirmshow.customName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col>
            <el-form-item label="社会信用代码：">
              {{confirmshow.sccCode}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="海关编码：">
              {{confirmshow.tradeCode}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="检验检疫编码：">
              {{confirmshow.ciqCode}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col>
            <el-form-item label="联系人：">
              {{confirmshow.contactUser}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="联系方式：">
              {{confirmshow.contactWay}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="公司地址：">
              {{confirmshow.address}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col>
            <el-form-item label="所属国：">
              {{confirmshow.customCountryValue}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="邮政编码：">
              {{confirmshow.postCode}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="E-MAIL：">
              {{confirmshow.email}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col style="padding-bottom:0px">
            <el-form-item label="备注：">
              {{confirmshow.remark}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="审核意见：" maxlength="400" class="audit-remark">
                <el-input type="textarea" v-model="confirmshow.auditRemark" :rows="2" :disabled="confirmshow.auditStatus !== 'WAITING'"></el-input>
            </el-form-item>
        </el-row>
        <div style="text-align:center;margin-top:26px">
          <el-button type="primary" size="mini" @click="oneconfirm(true)" v-if="confirmshow.auditStatus === 'WAITING'">审核通过</el-button>
          <el-button  size="mini" style="margin-left:10px" @click="oneconfirm(false)"  v-if="confirmshow.auditStatus === 'WAITING'">审核驳回</el-button>
        </div>
        <el-row >
        </el-row>
      </el-form>
      </div>
    </el-dialog>
    <el-dialog :modal-append-to-body='false'
      title="操作记录"
      :visible.sync="recordview"
      :close-on-click-modal='false'
      width="50%"
      >
      <div  class="dec-div">
        <el-table class='sys-table-table' border highlight-current-row :header-cell-style="{'text-align':'center'}" size="mini" :data="recordresult">
        <el-table-column label="时间" min-width="130" >
          <template slot-scope="scope">
            <div class ="customer-table-c">
            {{formateDate(scope.row.auditTime) || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客户状态" min-width="100">
          <template slot-scope="scope">
            <div class="text-over-hid customer-table-c">
            {{scope.row.auditStatusValue || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="100">
           <template slot-scope="scope">
             <div class="text-over-hid customer-table-c" >
              {{scope.row.auditUser || '-'}}
              </div>
            </template>
        </el-table-column>
        <el-table-column label="审核意见" min-width="130">
          <template slot-scope="scope">
            <div class="text-over-hid" :title="scope.row.auditRemark">
            {{scope.row.auditRemark || '-'}}
            </div>
          </template></el-table-column>
      </el-table>
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
      confirmreason: '',
      ifedit: false, // 是否为编辑
      recordresult: [],
      corps: [],
      confirmshow: {}, // 审核详情
      confirmview: false, // 审核详情
      countrys: [], // 国家
      recordview: false,
      nowselect: [], // 当前选中项
      newRule: {
        customCode: [{required: true, message: '请输入客户代码', trigger: 'blur'}],
        customCorpName: [{required: true, message: '请选择客户名称', trigger: 'blur'}],
        sccCode: [{required: true, message: '请输入社会信用代码', trigger: 'blur'}],
        customCountry: [{required: true, message: '请输入所属国', trigger: 'blur'}]
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
        'customCountry': '',
        'customId': '',
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
    // 时间格式化
    formateDate (d) {
      return util.dateFormat(d)
    },
    oneconfirm (flag) {
      let url = '/custom-manage/customAuditRefuce'
      if (flag) {
        url = '/custom-manage/customAuditComplete'
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login' + url,
        data: {
          customId: this.confirmshow.customId,
          auditRemark: this.confirmshow.auditRemark,
          customCode: this.confirmshow.customCode
        },
        router: this.$router,
        success: (res) => {
          let msg = '操作成功'
          if (res.result) {
            msg = res.result
          }
          this.$message({
            message: msg,
            type: 'success'
          })
          this.confirmview = false
          this.queryList()
        }
      })
    },
    confirm (flag) {
      let url = 'custom-manage/batchcustomAuditRefuce'
      if (flag) {
        url = 'custom-manage/batchCustomAuditComplete'
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/' + url,
        data: this.nowselect,
        router: this.$router,
        success: (res) => {
          let msg = '操作成功'
          if (res.result) {
            msg = res.result
          }
          this.$message({
            message: msg,
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    // 审核记录
    getconfirmrecord (customId) {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getAuditRecordList',
        data: {
          customId: customId
        },
        router: this.$router,
        success: (res) => {
          this.recordresult = res.result
          this.recordview = true
        }
      })
    },
    // getcorps (query) {
    //   if (query.length < 2) {
    //     return
    //   }
    //   this.$store.dispatch('ajax', {
    //     url: 'API@/login/corp/getCorpByCond',
    //     data: {
    //       corpName: query
    //     },
    //     router: this.$router,
    //     success: (res) => {
    //       this.corps = res.result
    //     }
    //   })
    // },
    // 选择公司后
    translatecustom () {
      this.newcustomer.sccCode = this.newcustomer.customName.sccCode
      this.newcustomer.tradeCode = this.newcustomer.customName.tradeCode
      this.newcustomer.ciqCode = this.newcustomer.customName.ciqCode
      this.newcustomer.customCorpId = this.newcustomer.customName.corpId
      this.newcustomer.customName = this.newcustomer.customName.corpName
    },
    getcode () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getCustomList',
        data: this.queryForm,
        router: this.$router,
        success: (res) => {
          this.corpList = res.result
        }
      })
    },
    opennewdia () {
      this.newdiaview = true
      this.ifedit = false
      if (this.newcustomer.customCode) {
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/getRandomCode',
        data: {},
        router: this.$router,
        isLoad: false,
        success: (res) => {
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
        this.newcustomer = {customCode: ''}
        this.corps = []
      }
    },
    confirmDetail (row) {
      this.confirmshow = row
      this.confirmview = true
    },
    selectionChange (selection, row) {
      if (row.auditStatus !== 'WAITING') {
        this.$refs.reference.toggleRowSelection(row, false)
        return
      }
      this.nowselect = selection
    },
    slectall (selection) {
      this.nowselect = []
      for (let a = 0; a < selection.length; a++) {
        if (selection[a].auditStatus === 'WAITING') {
          this.nowselect.push(selection[a])
        } else {
          this.$refs.reference.toggleRowSelection(selection[a], false)
          a--
        }
      }
    },
    rowclick (row) {
      if (row.auditStatus !== 'WAITING') {
        return
      }
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
    resetFun () {
      this.queryForm = {}
      this.queryList()
    },
    // 保存新增客户
    savenew () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/custom-manage/saveCustom',
        data: this.newcustomer,
        router: this.$router,
        success: (res) => {
          this.newcustomer = {}
          this.newdiaview = false
          this.$message({
            message: ' 保存成功',
            type: 'success'
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
.query-table{
  padding:12px 18px;
}
.dec-div .el-col{
  float: none;
}
.query-main /deep/ .el-form-item__label{
  text-align: right;
}
</style>
