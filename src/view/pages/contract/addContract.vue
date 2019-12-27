<template>
  <section class='sys-main'>
    <el-row class='sys-header'>
      <!-- 返回按钮 end-->
      <el-col :span="18">
        <span @click="back" class="sys-back-btn list-icon-back"><i></i>返回</span>
      </el-col>
        <!-- 返回按钮 end-->
    </el-row>
    <el-row class = "query-table">
    <el-form ref="dateForm" :model="dateForm" :label-width="labelFormWidth.six" :rules="rules" class='valide-detail-form' :label-position="'right'"  v-loading="$store.state.loading">
      <el-row>
          <el-col>
            <el-form-item label="本企业:">
              <span>{{$store.state.userLoginInfo.companyName}}</span>
            <el-form-item v-if="!isCheck">
              <el-radio v-model="mycorp" :label="true" >合同甲方</el-radio>
              <el-radio v-model="mycorp" :label="false" >合同乙方</el-radio>
            </el-form-item>
            <el-form-item v-if="isCheck">
              <el-radio v-model="mycorp" :label="true" :disabled="true">合同甲方</el-radio>
              <el-radio v-model="mycorp" :label="false" :disabled="true">合同乙方</el-radio>
            </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="合作企业:" prop="entrustCompanyId">
              <el-select size="mini" v-model="dateForm.entrustCompanyId" style="width:100%;"
                filterable remote default-first-option clearable
                :remote-method="checkParamsList" :disabled="typeFlag || isCheck" placeholder="请输入两个字符后查询">
                <el-option
                  v-for="(item, index) in companyList"
                  :key="'companyList'+index"
                  :label="item.corpName"
                  :value="item.corpId">
                </el-option>
              </el-select>
              <el-form-item >
              <el-radio v-model="coopcomp" :disabled="true" :label="!mycorp">合同甲方</el-radio>
              <el-radio v-model="coopcomp" :disabled="true" :label="mycorp">合同乙方</el-radio>
            </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="合同号:" prop="contractNo">
              <el-input clearable v-model="dateForm.contractNo" maxlength="30" size="mini" :disabled="isCheck"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="合同有效期:" prop="dates">
              <el-date-picker size="mini"  v-model="dateForm.dates" @change="$forceUpdate()"
              type="daterange"  style="width:100%;" :disabled="isCheck"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算日:" prop="settlement">
              <el-row>
                <el-col :span="7">
                  <el-select  size="mini" v-model="dateForm.settlementType" placeholder="请选择" :disabled="isCheck">
                    <el-option value="0" label="每月"></el-option>
                    <el-option value="1" label="每季"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-select  size="mini" v-model="dateForm.settlementMonth" placeholder="请选择" v-if="dateForm.settlementType === '1'" :disabled="isCheck">
                    <el-option value="1" label="第一个月"></el-option>
                    <el-option value="2" label="第二个月"></el-option>
                    <el-option value="3" label="第三个月"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-select  size="mini" v-model="dateForm.settlementDay" placeholder="请选择" :disabled="isCheck">
                    <el-option
                      v-for="item in dayList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算周期:">
              <el-select  size="mini" v-model="dateForm.settlementPeriod" placeholder="请选择" disabled style="width:100%;">
                <el-option value="0" label="上月整月"></el-option>
                <el-option value="1" label="上季整季"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="付款周期:" prop="paymentPeriod">
              <el-input  size="mini" v-model="dateForm.paymentPeriod" style="width:90%;margin-right:10px" maxlength="3" :disabled="isCheck"></el-input>天
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="附件:" prop="enclosureUrl">
              <el-upload
                v-if="!isCheck"
                class="sys-avatar-uploader"
                action="http://127.0.0.1"
                :before-upload="UploadFun"
                :on-remove="handleRemove"
                :file-list="fileList"
                :limit="1">
                <el-button size="mini" type="primary" :disabled="isCheck" class="op-btn">上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传excel,word,pdf文件，且不超过10M</div>
              </el-upload>
              <span v-if="isCheck" style="color:rgb(55, 134, 199);cursor:pointer" @click="enclosureFun">{{this.name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="check-tip" v-if="isDisabledCheck && !isCheck"><i class="el-icon-warning fs-18"></i><span>&nbsp;&nbsp;请注意：当合同构建成功后，需要进行审核操作！</span></el-row>
        <el-row v-if="!isCheck">
          <el-col>
            <div style="text-align:center;margin: 12px 0;">
              <el-button type="primary" size="mini" @click="createContract()" >确定</el-button>
              <el-button size="mini" @click="back" >取消</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="isCheck">
          <el-form-item label="审核意见" prop="verifyMsg">
            <el-input type="textarea" :autosize="{minRows:3}" v-model="verifyMsg"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="isCheck">
          <el-col>
            <div style="text-align:center;margin: 12px 0;">
              <el-button type="primary" size="mini" @click="verify()">审核通过</el-button>
              <el-button size="mini" @click="reject" >审核驳回</el-button>
            </div>
          </el-col>
        </el-row>
    </el-form>
    </el-row>
  </section>
</template>
<script>
import util from '@/common/util'
import validator from '@/common/validator'
export default {
  data () {
    return {
      rules: {
        'entrustCompanyId': [{required: true, message: '请选择受托企业', trigger: 'change'}],
        'contractNo': [{required: true, message: '请输入合同号', trigger: 'blur'}],
        'dates': [{required: true, validator: this.dateCheck, message: '请输入合同有效期', trigger: 'change'}],
        'settlement': [{required: true, validator: this.settlementCheck, message: '请正确输入结算日', trigger: 'blur'}],
        'paymentPeriod': [{required: true, validator: this.paymentPeriodCheck, message: '请输入付款周期', trigger: 'blur'}, {validator: validator.Zz0, message: '请输入正整数', trigger: 'blur'}],
        'enclosureUrl': [{required: true, validator: this.uploadCheck, message: '请上传附件', trigger: 'change'}]
      },
      coopcomp: true,
      mycorp: true,
      typeFlag: false,
      isDisabledCheck: false, // 是否审核
      isCheck: false, // 审核录入
      verifyMsg: '',
      dateForm: {
        status: '',
        entrustCompanyId: '',
        contractNo: '',
        settlementType: '0',
        settlementDay: 1,
        dates: ['', ''],
        settlementPeriod: '0',
        paymentPeriod: ''
      },
      name: '',
      companyList: [],
      dayList: [],
      fileList: []
    }
  },
  created () {
    this.typeFlag = this.$route.params.flag === 'edit' || this.$route.params.flag === 'conedit' || this.$route.params.flag === 'check'
    if (this.$route.params.flag === 'check') {
      this.isCheck = true
    } else {
      this.isCheck = false
    }
    for (let i = 1; i <= 31; i++) {
      this.dayList.push(
        {
          label: i + '号',
          value: i
        }
      )
    }
    this.contractTenantConf()
  },
  mounted () {
    if (this.typeFlag) {
      this.getDetail(this.$route.params.pkSeqNo)
    }
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('addContract') === -1) {
        return
      }
      this.typeFlag = this.$route.params.flag === 'edit' || this.$route.params.flag === 'conedit' || this.$route.params.flag === 'check'
      if (this.typeFlag) {
        this.reset()
        this.getDetail(to.params.pkSeqNo)
      }
      if (to.params.flag === 'check') {
        this.isCheck = true
      } else {
        this.isCheck = false
      }
      for (let i = 1; i <= 31; i++) {
        this.dayList.push(
          {
            label: i + '号',
            value: i
          }
        )
      }
      this.contractTenantConf()
    }
  },
  methods: {
    // 查看附件
    enclosureFun () {
      util.fileView(this.fileList[0].url)
    },
    // 获取是否开启审核
    contractTenantConf () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/ccba/review/isReview',
        data: ['contract_manual_audit'],
        loading: true,
        router: this.$router,
        success: (res) => {
          this.contractAudit = res.result['contract_manual_audit'].value
          if (this.contractAudit === 'Y') {
            this.isDisabledCheck = true
            this.dateForm.status = '0'
          } else {
            this.isDisabledCheck = false
            this.dateForm.status = '1'
          }
        }
      })
    },
    // 返回按钮
    back () {
      this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        name: 'contract-list'
      })
    },
    reset () {
      this.coopcomp = true
      this.mycorp = true
      this.typeFlag = false
      this.isDisabledCheck = false // 是否审核
      this.isCheck = false // 审核录入
      this.companyList = []
      this.dayList = []
      this.fileList = []
      this.verifyMsg = ''
      this.dateForm = {
        status: '',
        entrustCompanyId: '',
        contractNo: '',
        settlementType: '0',
        settlementDay: 1,
        dates: ['', ''],
        settlementPeriod: '0',
        paymentPeriod: ''
      }
      this.$nextTick(() => {
        this.$refs['dateForm'].clearValidate()
      })
    },
    // 续签获得详情
    getDetail (val) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/getRenewalInfo',
        data: {pkSeqNo: val},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          if (this.$route.params.flag === 'conedit' || this.$route.params.flag === 'check') {
            util.copyObj(this.dateForm, res.result)
            this.dateForm.dates = [res.result.contractBeginDate, res.result.contractEndDate]
            this.fileList.push({
              name: res.result.enclosureName,
              url: res.result.enclosureUrl
            })
            this.name = this.fileList[0].name
            this.$forceUpdate()
          }
          if (this.$store.state.userLoginInfo.companyCode === res.result.entrustCompanyId) {
            this.dateForm.entrustCompanyId = res.result.companyId
            this.mycorp = false
            this.getCorpListFun('', res.result.companyId)
          } else {
            this.dateForm.entrustCompanyId = res.result.entrustCompanyId
            this.mycorp = true
            this.getCorpListFun('', res.result.entrustCompanyId)
          }
          this.dateForm.settlementType = res.result.settlementType + ''
          this.dateForm.settlementMonth = res.result.settlementMonth + ''
          this.dateForm.settlementDay = res.result.settlementDay
          this.dateForm.settlementPeriod = res.result.settlementPeriod + ''
          this.dateForm.paymentPeriod = res.result.paymentPeriod
        }
      })
    },
    // 审核通过
    verify () {
      let data = {
        'pkSeqNos': [this.$route.params.pkSeqNo],
        'verifyMsg': this.verifyMsg
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/verify',
        data: data,
        router: this.$router,
        isLoad: false,
        success: (res) => {
          if (res.code === '0000') {
            this.$message({
              message: '审核通过',
              type: 'success'
            })
          }
          this.$store.dispatch('CloseTab', this.$route.name)
          this.$router.push({
            name: 'contract-list'
          })
        }
      })
    },
    // 审核驳回
    reject () {
      let data = {
        'pkSeqNos': [this.$route.params.pkSeqNo],
        'verifyMsg': this.verifyMsg
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/reject',
        data: data,
        router: this.$router,
        isLoad: false,
        success: (res) => {
          if (res.code === '0000') {
            this.$message({
              message: '审核驳回',
              type: 'success'
            })
          }
          this.$store.dispatch('CloseTab', this.$route.name)
          this.$router.push({
            name: 'contract-list'
          })
        }
      })
    },
    // 删除钩子
    handleRemove (file, fileList) {
      this.fileList = []
    },
    // 上传
    UploadFun (file) {
      this.fileList = []
      let fileType = util.getFileTypeByName(file.name)
      if (!(fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel' || fileType === 'application/pdf' || fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        this.$message({
          message: '上传文件暂时只支持pdf/word/excel文件',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 10240)) {
        this.$message({
          message: '上传文件大小不能超过10MB',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        let sccCode = this.$store.state.userLoginInfo.sccCode
        let date = util.dateFormat(new Date(), 'yyyyMM')
        param.append('filePath', '/longshine/document/' + sccCode + '/contract/' + date)
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          router: this.$router,
          isLoad: false,
          success: (res) => {
            this.fileList.push({
              name: res.result.name,
              url: res.result.url
            })
          }
        })
      }
      return false
    },
    checkParamsList (query) {
      if (util.isEmpty(query)) {
        return false
      } else if (query.length < 2) {
        return false
      } else {
        this.getCorpListFun(query)
      }
    },
    // 获取委托公司列表
    getCorpListFun (value, corpId) {
      let datas = {}
      if (corpId) {
        datas.corpId = corpId
      } else {
        datas.corpName = value
      }
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/invitation/queryCorpList',
        data: datas,
        isLoad: false,
        success: (res) => {
          this.companyList = res.result
        }
      })
    },
    // 确认
    createContract () {
      this.$refs['dateForm'].validate((valId) => {
        if (valId) {
          let urlend = 'create'
          if (this.mycorp === true) {
            this.dateForm.companyId = this.$store.state.userLoginInfo.companyCode
          } else {
            this.dateForm.companyId = this.dateForm.entrustCompanyId
            this.dateForm.entrustCompanyId = this.$store.state.userLoginInfo.companyCode
          }
          this.dateForm.contractBeginDate = util.dateFormat(this.dateForm.dates[0], 'yyyy-MM-dd')
          this.dateForm.contractEndDate = util.dateFormat(this.dateForm.dates[1], 'yyyy-MM-dd')
          this.dateForm.enclosureName = this.fileList[0].name
          this.dateForm.enclosureUrl = this.fileList[0].url
          if (this.$route.params.flag === 'conedit') {
            urlend = 'edit'
          }
          this.$store.dispatch('ajax', {
            url: 'API@/saas-finance-expense/contract/' + urlend,
            data: this.dateForm,
            router: this.$router,
            isLoad: false,
            success: (res) => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$store.dispatch('CloseTab', this.$route.name)
              this.$router.push({
                name: 'contract-list'
              })
            }
          })
        }
      })
    },
    dateCheck (rule, value, callback) {
      if (!value) {
        return
      }
      if (util.isEmpty(value[0]) || util.isEmpty(value[1])) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    uploadCheck (rule, value, callback) {
      if (this.fileList.length === 0) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    settlementCheck (rule, value, callback) {
      callback()
    },
    paymentPeriodCheck (rule, value, callback) {
      if (util.isEmpty(this.dateForm.settlementPeriod)) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
  }
}
</script>
<style scoped lang="less">
.price-detail-celltitle{
  font-size: 14px;
  margin:10px 0px;
  color: @aid-color-light;
}
.query-table {
    width: 680px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px 50px;
    margin-top: 20px;
  }
.el-upload__tip{
  margin-top: 0;
  }
.check-tip{
  color: #409EFF;
  margin-bottom: 30px;
  vertical-align: middle;
  text-align: center;
  }
</style>
