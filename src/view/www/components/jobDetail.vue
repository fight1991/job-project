<template>
  <div class="detail-css">
    <div class="mainer">
      <el-row class="detail-header">
        <el-col :span="20">
          <div class="header-info">
            <h2 class="detail-title">{{jobDetail.jobName}}</h2>
            <p class="detail-company">{{formatType(jobDetail.company)}}</p>
            <div class="content-list">
              <div class="content-area" v-show="jobDetail.area">
                <i class="www-icon icon-address" title="招聘地区"></i>
                <span>{{jobDetail.area}}</span>
              </div>
              <div class="content-info">
                <span class="mr26" v-show="jobDetail.sex">
                  <i class="www-icon icon-Gender" title="性别"></i>
                  <span>{{formatType(jobDetail.sex)}}</span>
                </span>
                <span class="mr26" v-show="jobDetail.education">
                  <i class="www-icon icon-Education" title="学历"></i>
                  <span>{{jobDetail.education}}</span>
                </span>
                <span class="mr26" v-show="jobDetail.workYears">
                  <i class="www-icon icon-Years" title="工作年限"></i>
                  <span>{{jobDetail.workYears}}</span>
                </span>
                <span class="mr26" v-show="jobDetail.workNature">
                  <i class="www-icon icon-position" title="工作性质"></i>
                  <span>{{formatType(jobDetail.workNature)}}</span>
                </span>
                <span class="mr26" v-show="jobDetail.salary">
                  <i class="www-icon icon-salary" title="薪资"></i>
                  <span>{{jobDetail.salary}}</span>
                </span>
                <span class="mr26" v-show="jobDetail.count">
                  <i class="www-icon icon-Number" title="人数"></i>
                  <span>{{jobDetail.count}}人</span>
                </span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <button class="resumeBtn"  @click.prevent="openDialog">简历投递</button>
          <button class="shareBtn"  @click.prevent="share">分享</button>
        </el-col>
      </el-row>
      <div class="detail-content">
        <div v-show="jobDetail.duty">
          <p>岗位职责：</p>
          <div v-html="jobDetail.duty">{{jobDetail.duty}}</div>
        </div>
        <div class="mt26" v-show="jobDetail.requirement">
          <p>任职要求：</p>
          <div v-html="jobDetail.requirement">{{jobDetail.requirement}}</div>
        </div>
        <div class="mt26" v-show="jobDetail.workAdd">
          <p>上班地址：</p>
          <div>{{jobDetail.workAdd}}</div>
        </div>
        <div class="mt26" v-show="jobDetail.contact">
          <p>联系方式：</p>
          <div v-html="jobDetail.contact">{{jobDetail.contact}}</div>
        </div>
      </div>
    </div>
    <el-dialog title="投递简历" :visible.sync="visableflag" v-if="visableflag" width="25%" :close-on-click-modal='false' class="dialog">
      <el-row>
        <el-form ref="dialogForm" label-width="65px" :model="dialogForm" :rules="rules">
          <el-col :span="18" :offset="3">
            <el-form-item label="姓名" prop="userName">
              <el-input size="mini" v-model="dialogForm.userName" :maxlength="20" :disabled="isLogin"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input size="mini" v-model="dialogForm.mobile" :maxlength="11" :disabled="isLogin"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code" v-if="!isLogin">
              <el-input size="mini" v-model="dialogForm.code" ref="mobileCode" :maxlength="4" :disabled="isLogin"></el-input>
              <el-button class="sendCode" @click="sendCode" :disabled="timerId>0? true:false || isLogin">{{content}}</el-button>
            </el-form-item>
            <el-form-item label="简历" prop="url">
              <el-upload
                action="http://127.0.0.1"
                class="avatar-uploader"
                :before-upload="UploadFun"
                :on-remove="handleRemove"
                :show-file-list="fileType"
                :on-preview="showfileUrl"
                :file-list="fileList"
                :limit="1">
                <img v-if="dialogForm.url && !fileType" :src="dialogForm.url" class="dialog-img">
                <el-button type="primary" size="mini" class="dialog-btn" v-if="fileType">上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="dialog-btn" size="mini" @click="saveDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="shareflag" v-if="shareflag" :close-on-click-modal="false" :append-to-body='true' width="25%">
      <div class="card-qrcode">
        <div id="qrcode"></div>
        <div style="padding:10px 0;">打开微信“扫一扫”</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/common/util'
import eventBus from '../../www/common/eventBus'
import QRCode from 'qrcodejs2'
export default {
  data () {
    return {
      rules: {
        'userName': [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {pattern: /^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/, message: '姓名不能包含特殊字符', trigger: 'blur'},
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        'mobile': [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^(1)(3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        'code': [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {pattern: /^\d{4}$/, message: '请输入4位数字', trigger: 'blur'}
        ],
        'url': [{required: true, validator: this.uploadCheck, message: '请上传附件', trigger: 'change'}]
      },
      shareflag: false,
      jobId: '',
      jobDetail: {
        jobName: '',
        company: '',
        area: '',
        sex: '',
        education: '',
        workYears: '',
        workNature: '',
        salary: '',
        count: '',
        duty: '',
        requirement: '',
        workAdd: '',
        contact: ''
      },
      visableflag: false,
      isLogin: false,
      fileType: true,
      dialogForm: {
        userName: '',
        mobile: '',
        code: '',
        url: ''
      },
      fileList: [],
      content: '获取验证码', // 按钮里显示的内容
      totalTime: 60, // 记录具体倒计时时间
      timerId: 0, // 存储定时器的值
      format: [
        {
          value: ' ',
          label: '不限'
        }, {
          value: 'M',
          label: '男'
        }, {
          value: 'F',
          label: '女'
        }, {
          value: 'full',
          label: '全职'
        }, {
          value: 'part',
          label: '兼职'
        }, {
          value: 'longnows',
          label: '朗新一诺(苏州)信息科技有限公司'
        }, {
          value: 'longshine',
          label: '朗新金关信息科技有限公司'
        }
      ] // 格式化
    }
  },
  created () {
    if (this.$route.query) {
      this.jobId = this.$route.query.jobId
      this.getJobDetail()
    }
  },
  watch: {

  },
  methods: {
    // 二維碼
    qrcode () {
      let url = 'https://www.5itrade.cn/wx/talent/' + this.jobId
      let qrcode1 = new QRCode('qrcode', {
        width: 200,
        height: 200
      })
      qrcode1.makeCode(url)
    },
    // 分享
    share () {
      this.shareflag = true
      this.$nextTick(() => {
        this.qrcode()
      })
    },
    // 职位详情
    getJobDetail () {
      let data = {
        company: 'longshine',
        source: ['ccba'],
        jobId: this.jobId
      }
      this.$store.dispatch('ajax', {
        url: 'API@/plat-manager/jobManage/getJobDetail',
        data: data,
        router: this.$router,
        success: ({ result }) => {
          if (!util.isEmpty(result)) {
            for (let i in result) {
              if (result[i]) {
                result[i] = this.brContent(result[i])
              } else {
                result[i] = ''
              }
            }
            this.jobDetail = result
          }
        }
      })
    },
    // 重置
    rest () {
      this.dialogForm = {
        userName: '',
        mobile: '',
        code: '',
        url: ''
      }
      this.fileType = true
      this.fileList = []
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    uploadCheck (rule, value, callback) {
      if (util.isEmpty(this.dialogForm.url)) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 投递弹窗
    openDialog () {
      this.visableflag = true
      clearInterval(this.timerId)
      this.timerId = 0
      this.totalTime = 60
      this.content = '发送验证码'
      this.rest()
      if (window.localStorage.getItem('token')) {
        this.isLogin = true
        this.dialogForm = {
          userName: this.$store.state.userLoginInfo.userName,
          mobile: this.$store.state.userLoginInfo.mobile
        }
      } else {
        this.isLogin = false
      }
    },
    // 确认按钮
    saveDialog () {
      if (this.fileList.length > 0 && this.fileType) {
        this.dialogForm.url = this.fileList[0].url
      }
      this.$refs['dialogForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        if (!this.isLogin && this.timerId === 0) {
          this.$message({
            type: 'error',
            message: '请先获取验证码'
          })
          return false
        }
        if (window.localStorage.getItem('token')) {
          this.sendResume()
        } else {
          this.getLogin()
        }
      })
    },
    // 登录接口
    getLogin () {
      let data = {
        code: this.dialogForm.code,
        mobileCode: this.dialogForm.mobile,
        password: ''
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/login/login',
        data: data,
        showErrorMessage: false,
        router: this.$router,
        success: res => {
          if (res.code === '0000') { // 注册未登录
            window.localStorage.setItem('token', res.result.ssoToken)
            this.sendResume('resister')
          }
        },
        other: res => {
          if (res.code === '0003') { // 未注册
            this.sendResume('unResister')
          }
          if (res.code === '0001') { // 验证码失效
            this.dialogForm.code = ''
            this.$message({
              type: 'error',
              message: res.message
            })
            // 移除表单校验结果
            this.$refs['dialogForm'].clearValidate('code')
            this.$refs['mobileCode'].focus()
          }
        }
      })
    },
    // 获取用户信息
    getUserInfo () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/login/getLoginUserInfo',
        data: {
          ssoToken: window.localStorage.getItem('token')
        },
        router: this.$router,
        success: (res) => {
          let datas = {
            token: window.localStorage.getItem('token'), // token数据
            userId: util.isEmpty(res.result.userId) ? '' : res.result.userId,
            userName: util.isEmpty(res.result.userName) ? '' : res.result.userName,
            mobile: util.isEmpty(res.result.mobile) ? '' : res.result.mobile,
            userPhoto: util.isEmpty(res.result.userPhoto) ? '' : res.result.userPhoto,
            companyName: util.isEmpty(res.result.corpName) ? '' : res.result.corpName,
            adminFlag: util.isEmpty(res.result.adminFlag) ? '' : res.result.adminFlag,
            sccCode: util.isEmpty(res.result.sccCode) ? '' : res.result.sccCode,
            companyCode: util.isEmpty(res.result.corpId) ? '' : res.result.corpId,
            cusCorpName: util.isEmpty(res.result.cusCorpName) ? '' : res.result.cusCorpName, // 企业海关名
            ciqCode: util.isEmpty(res.result.ciqCode) ? '' : res.result.ciqCode // 企业检验检疫代码
          }
          this.$store.commit('userLoginInfo', datas)
          eventBus.$emit('changeLogin')
        }
      })
    },
    // 发送简历
    sendResume (type) {
      let data = {
        jobId: this.$route.query.jobId,
        jobName: this.jobDetail.jobName,
        source: 'ccba',
        userName: this.dialogForm.userName,
        mobile: this.dialogForm.mobile,
        code: this.dialogForm.code,
        url: this.dialogForm.url
      }
      this.$store.dispatch('ajax', {
        url: 'API@/plat-manager/resumeManage/sendResumeByccba',
        data: data,
        router: this.$router,
        success: res => {
          if (res.code === '0000') { // 成功
            this.$message({
              type: 'success',
              message: '您的简历信息已提交成功，请等待短信或电话通知，谢谢！'
            })
            if (type === 'resister') {
              // 重置表单
              this.$refs['dialogForm'].resetFields()
              // 清空定时器和重置验证码按钮
              clearInterval(this.timerId)
              this.timerId = 0
              this.totalTime = 60
              this.content = '发送验证码'
              this.getUserInfo()
            }
            if (type === 'unResister') {
              let data = {
                code: this.dialogForm.code,
                mobileCode: this.dialogForm.mobile,
                password: ''
              }
              this.$store.dispatch('ajax', {
                url: 'API@/login/login/login',
                data: data,
                router: this.$router,
                success: res => {
                  if (res.code === '0000') {
                    window.localStorage.setItem('token', res.result.ssoToken)
                    this.getUserInfo()
                  }
                }
              })
            }
            this.visableflag = false
          }
        }
      })
    },
    // 获取验证码请求
    sendCode () {
      let mobile = this.dialogForm.mobile
      let reg = /^(1)(3|4|5|6|7|8|9)\d{9}$/
      if (!mobile) {
        this.$message({
          type: 'error',
          message: '请输入手机号'
        })
        return
      }
      if (!reg.test(mobile)) {
        return
      }
      // 倒计时开启
      this.countDown()
      // 发送请求 获取验证码
      this.$store.dispatch('ajax', {
        url: 'API@/login/login/getValidateCode',
        data: {
          mobile: this.dialogForm.mobile,
          type: 'login'
        },
        router: this.$router,
        success: res => {
          if (res.code === '0000') {
            this.$message({
              type: 'success',
              message: res.message
            })
          }
        }
      })
    },
    countDown () { // 倒计时功能
    // 如果发现有定时器运行 return
      if (this.timerId) return
      this.content = this.totalTime + '秒'
      this.timerId = setInterval(() => {
        this.totalTime--
        this.content = this.totalTime + '秒'
        if (this.totalTime < 0) {
          // 清除定时器
          clearInterval(this.timerId)
          this.timerId = 0
          this.totalTime = 60
          this.content = '重新发送'
        }
      }, 1000)
    },
    // 换行
    brContent (val) {
      let brContent = ''
      if (typeof val === 'string') {
        if (val.indexOf('$') !== -1) {
          brContent = val.replace(/\$/g, '<br>')
        } else if (val.indexOf('+') !== -1) {
          brContent = val.replace(/\+/g, '、')
        } else {
          brContent = val
        }
      } else {
        brContent = val
      }

      return brContent
    },
    // 上传
    UploadFun (file) {
      this.fileList = []
      if (!(Math.ceil(file.size / 1024) <= 10240)) {
        this.$message({
          message: '上传文件大小不能超过10MB',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        let date = util.dateFormat(new Date(), 'yyyyMM')
        param.append('filePath', '/longshine/document/resume/' + date)
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          router: this.$router,
          isLoad: false,
          success: (res) => {
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') {
              this.dialogForm.url = res.result.url
              this.fileType = false
            } else {
              this.fileList.push({
                name: res.result.name,
                url: res.result.url
              })
              this.fileType = true
            }
            this.$refs['dialogForm'].clearValidate('url')
          }
        })
      }
      return false
    },
    // 删除钩子
    handleRemove (file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.name === this.fileList[i].name) {
          this.fileList.splice(i, 1)
          this.dialogForm.url = ''
        }
      }
    },
    // pdf 预览
    showfileUrl (file) {
      util.fileView(file.url)
    },
    // 格式化
    formatType (val) {
      for (let i in this.format) {
        if (this.format[i].value === val) {
          return this.format[i].label
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.detail-css {
  padding-top: 60px;
  padding-bottom: 60px;
  .detail-header {
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 20px;
    .header-info {
      .detail-title{
        color: #333;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .detail-company {
        color: #666;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .content-list {
         color: #666;
         font-size: 14px;
       i {
         margin-right: 8px;
         display: inline-block;
       }
       .content-area {
         line-height: 24px;
       }
       .content-info {
         padding-top: 10px;
       }
     }
    }
    .resumeBtn {
      width: 110px;
      height: 34px;
      font-size: 14px;
      background-color: #0A5CA0;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .shareBtn {
      margin-top: 10px;
      background-color: #fff;
      width: 110px;
      height: 34px;
      font-size: 14px;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .detail-content {
    padding-top: 18px;
    color: #333;
    font-size: 14px;
    line-height: 24px;
  }
  .mr26 {
    margin-right: 26px;
  }
  .mt26 {
    margin-top: 20px;
  }
  .dialog {
    .sendCode {
      position: absolute;
      right: 6px;
      top: 8px;
      border: none;
      border-left: 1px solid #ccc;
      border-radius: 0;
      box-sizing: border-box;
      padding: 0;
      width:90px;
    }
    .dialog-img {
      display: inline-block;
      padding-right: 10px;
      margin-bottom: 12px;
      width: 89px;
      height: 89px;
      cursor: pointer;
    }
  }
}
.card-qrcode{
  text-align: center;
    #qrcode{
    display: inline-block;
  }
}
</style>
