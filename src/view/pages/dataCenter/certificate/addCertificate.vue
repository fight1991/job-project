<template>
  <section class='sys-main'>
     <!-- 头部 -->
    <el-row class='sys-header'>
      <!-- 返回按钮 -->
      <el-col :span="18">
        <span @click="back" class="sys-back-btn list-icon-back"><i></i>返回</span>
      </el-col>
      <!-- 返回按钮 end-->
    </el-row>
    <el-row class = "query-table">
      <!-- <el-col> -->
        <el-form :label-width="labelFormWidth.five" :model="addForm" ref="addForm" :rules="rule" size="mini" label-position="right">
          <el-form-item label="委托企业" prop="corpName">
            <el-select v-model="addForm.corpName" filterable clearable
              remote style="width:100%"
              placeholder="输入2个字后搜索"
              :disabled="isDetailAdd"
              :remote-method="companyListFun"
              :no-data-text="noDataText"
              :default-first-option="true"
              @focus="companyListOptions=[];">
              <el-option
                v-show="searchCorpInfoView"
                v-for="(item,index) in companyListOptions"
                :key="item.ownerCodeScc +'companyListOptions'+index"
                :label="item.ownerName"
                :value="item.ownerName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="证书名称" prop="certificateName">
            <el-input size="mini" clearable :maxlength="30" v-model="addForm.certificateName"></el-input>
          </el-form-item>
          <el-form-item  label="证书编号" prop="certificateNo">
            <el-input size="mini" clearable :maxlength="30" v-model="addForm.certificateNo"></el-input>
          </el-form-item>
          <el-form-item label="到期时间" prop="expiryDate">
            <el-date-picker style="width:100%" size="mini" type="date" placeholder="选择到期时间" v-model="addForm.expiryDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="ifWarning">
            <el-checkbox label="需要进行到期预警" v-model="addForm.ifWarning" name="type" true-label='1' false-label='0'></el-checkbox>
          </el-form-item>
          <el-form-item label="附件" prop="certificateUrl">
            <el-upload
              action="http://127.0.0.1"
              :before-upload="beforeUpload"
              :file-list="fileLists"
              :show-file-list="fileType"
              :on-preview="showfileUrl"
              :on-remove="handleDelete">
              <img v-if="isImg  && !fileType" :src="addForm.certificateUrl" class="detail-img">
              <img v-if="isPdf  && !fileType" src="https://www.5itrade.cn/files/CCBA/pdf.png" @click="showfile(addForm.certificateUrl)" class="detail-img">
              <img v-if="isWord  && !fileType" src="https://www.5itrade.cn/files/CCBA/word.png" @click="showfile(addForm.certificateUrl)" class="detail-img">
              <img v-if="isExcel  && !fileType" src="https://www.5itrade.cn/files/CCBA/excel.png" @click="showfile(addForm.certificateUrl)" class="detail-img">
              <el-row>
               <el-button size="mini" class="longButton" type="primary">上传附件</el-button>
              </el-row>
            </el-upload>
              <!-- <img class="detail-img" v-if="!fileType" :src="addForm.certificateUrl"> -->
          </el-form-item>
          <el-row class="query-btn">
            <el-button type="primary" size="mini" @click="submit">确认</el-button>
            <el-button size="mini" @click="back">取消</el-button>
          </el-row>
        </el-form>
      <!-- </el-col> -->
    </el-row>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  data () {
    return {
      rule: {
        corpName: [{ required: true, message: '请输入委托企业', trigger: 'change' }],
        certificateName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
        certificateNo: [{ required: true, message: '请输入证书编号', trigger: 'blur' }],
        certificateUrl: [{ required: true, message: '请选择上传文件', trigger: 'change' }],
        expiryDate: [{ required: true, message: '请选择到期时间', trigger: 'change' }]
      },
      addForm: {
        ownerCodeScc: '',
        corpName: '',
        certificateName: '',
        certificateNo: '',
        expiryDate: '',
        ifWarning: '1',
        certificateUrl: '',
        certificatePid: ''
      },
      type: '',
      certificatePid: '',
      searchCorpInfoView: false,
      noDataText: '暂无匹配数据',
      companyListOptions: [],
      fileLists: [], // 存放文件
      fileType: true,
      isImg: false,
      isPdf: false,
      isWord: false,
      isExcel: false,
      isDetailAdd: false
    }
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('addCertificate') === -1) {
        return
      }
      this.reset()
      // this.corpList()
      if (to.query.type) {
        this.type = to.query.type
        this.certificatePid = to.query.certificatePid
        this.queryEdit()
      }
      if (to.query.corpName) {
        this.addForm.ownerCodeScc = to.query.ownerCodeScc
        this.addForm.corpName = decodeURIComponent(to.query.corpName)
        this.isDetailAdd = true
      } else {
        this.isDetailAdd = false
      }
    }
  },
  created () {
    this.reset()
    if (this.$route.query.type) {
      this.type = this.$route.query.type
      this.certificatePid = this.$route.query.certificatePid
    }
    if (this.$route.query.corpName) {
      this.addForm.ownerCodeScc = this.$route.query.ownerCodeScc
      this.addForm.corpName = decodeURIComponent(this.$route.query.corpName)
      this.isDetailAdd = true
    } else {
      this.isDetailAdd = false
    }
  },
  mounted () {
    this.queryEdit()
  },
  methods: {
    // 返回按钮
    back () {
      this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        name: 'certificate'
      })
    },
    // 重置
    reset () {
      this.addForm = {
        ownerCodeScc: '',
        corpName: '',
        certificateName: '',
        certificateNo: '',
        expiryDate: '',
        ifWarning: '1',
        certificateUrl: '',
        certificatePid: ''
      }
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.type = ''
      this.certificatePid = ''
      this.searchCorpInfoView = false
      this.noDataText = '暂无匹配数据'
      this.companyListOptions = []
      this.fileLists = [] // 存放文件
      this.fileType = true
      this.isImg = false
      this.isPdf = false
      this.isWord = false
      this.isExcel = false
      this.isDetailAdd = false
    },
    // 编辑反显
    queryEdit () {
      if (this.type === 'edit') {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-document-center/certificate/queryDetail',
          data: {pid: this.certificatePid},
          router: this.$router,
          success: (res) => {
            let addForm = {
              ownerCodeScc: res.result.ownerCodeScc,
              corpName: res.result.corpName,
              certificateName: res.result.certificateName,
              certificateNo: res.result.certificateNo,
              expiryDate: res.result.expiryDate,
              ifWarning: res.result.ifWarning,
              certificateUrl: res.result.certificateUrl,
              certificatePid: res.result.certificatePid
            }
            let url = addForm.certificateUrl
            if (!util.isEmpty(url)) {
              let suffix = util.getFileTypeByName(url)
              if (suffix === 'image/jpeg' || suffix === 'image/png' || suffix === 'image/gif' || suffix === 'image/bmp') {
                this.fileType = false
                this.isImg = true
                this.isPdf = false
                this.isWord = false
                this.isExcel = false
              } else {
                if (suffix === 'application/pdf') {
                  this.fileType = false
                  this.isImg = false
                  this.isPdf = true
                  this.isWord = false
                  this.isExcel = false
                } else if (suffix === 'application/msword' || suffix === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                  this.fileType = false
                  this.isImg = false
                  this.isPdf = false
                  this.isWord = true
                  this.isExcel = false
                } else if (suffix === 'application/vnd.ms-excel' || suffix === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                  this.fileType = false
                  this.isImg = false
                  this.isPdf = false
                  this.isWord = false
                  this.isExcel = true
                }
              }
            }
            this.addForm = addForm
          }
        })
      }
    },
    // 获取企业list
    companyListFun (val) {
      if (val !== '') {
        if (val.length >= 2) {
          this.$store.dispatch('ajax', {
            url: 'API@/saas-document-center/dccommon/queryCertificateCorps',
            data: val.trim(),
            router: this.$router,
            success: (res) => {
              if (util.isEmpty(res.result)) {
                this.companyListOptions = []
                this.searchCorpInfoView = false
                this.noDataText = '暂无匹配数据'
              } else {
                this.companyListOptions = res.result
                this.searchCorpInfoView = true
              }
            }
          })
        }
      }
    },
    // 上传图片前的格式及大小判断
    beforeUpload (file) {
      this.fileLists = []
      if (!util.getFileTypeByName(file.name)) {
        this.$message({
          message: '上传文件暂时只支持图片/PDF/word/Excel格式',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') && !(Math.ceil(file.size / 1024) <= 2048)) {
        this.$message({
          message: '上传图片大小不能超过2MB',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else if (util.getFileTypeByName(file.name) && !(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') && !(Math.ceil(file.size / 1024) <= 10240)) {
        this.$message({
          message: '上传文件大小不能超过10MB',
          type: 'error'
        })
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        let sccCode = this.$store.state.userLoginInfo.sccCode
        let date = util.dateFormat(new Date(), 'yyyyMM')
        param.append('filePath', '/longshine/document/' + sccCode + '/certificate/' + date)
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          isLoad: false,
          router: this.$router,
          success: (res) => {
            this.addForm.certificateUrl = res.result.url
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') {
              this.fileType = false
              this.isImg = true
              this.isPdf = false
              this.isWord = false
              this.isExcel = false
            } else {
              this.fileLists.push({
                name: res.result.name,
                url: res.result.url
              })
              if (file.type === 'application/pdf') {
                this.fileType = false
                this.isImg = false
                this.isPdf = true
                this.isWord = false
                this.isExcel = false
              } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                this.fileType = false
                this.isImg = false
                this.isPdf = false
                this.isWord = true
                this.isExcel = false
              } else if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                this.fileType = false
                this.isImg = false
                this.isPdf = false
                this.isWord = false
                this.isExcel = true
              }
            }
            this.$refs['addForm'].clearValidate('certificateUrl')
          }
        })
      }
      return false
    },
    // 预览
    showfileUrl (file) {
      // util.fileView(file.url)
    },
    // 文件点击事件
    showfile (url) {
      // if (!util.isEmpty(url)) {
      //   util.fileView(url)
      // }
    },
    // 附件删除
    handleDelete (file, fileList) {
      // for (let i = 0; i < this.fileLists.length; i++) {
      //   if (file.name === this.fileLists[i].name) {
      //     this.fileLists.splice(i, 1)
      //     this.addForm.certificateUrl = ''
      //   }
      // }
    },
    // 保存
    submit () {
      let url = ''
      if (this.type === 'edit') {
        url = 'API@/saas-document-center/certificate/edit'
      } else {
        url = 'API@/saas-document-center/certificate/save'
      }
      if (this.fileLists.length > 0 && this.fileType) {
        this.addForm.certificateUrl = this.fileLists[0].url
      }
      this.addForm.expiryDate = util.dateFormat(this.addForm.expiryDate, 'yyyy-MM-dd')
      this.addForm.corpName = this.addForm.corpName
      this.addForm.ownerCodeScc = this.addForm.ownerCodeScc
      this.addForm.certificateName = this.addForm.certificateName
      this.addForm.certificateNo = this.addForm.certificateNo
      this.addForm.ifWarning = this.addForm.ifWarning
      this.addForm.certificatePid = this.addForm.certificatePid
      this.saveForm(url)
    },
    // 保存接口请求
    saveForm (url) {
      this.$refs['addForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        this.$store.dispatch('ajax', {
          url: url,
          data: this.addForm,
          router: this.$router,
          success: (res) => {
            let message = ''
            if (this.type === 'edit') {
              message = '修改成功'
            } else {
              message = '保存成功'
            }
            this.$message({
              message: message,
              type: 'success'
            })
            this.$store.dispatch('CloseTab', this.$route.name)
            this.$router.push({
              path: '/dataCenter/certificate',
              query: {
                sccCode: this.addForm.ownerCodeScc,
                corpName: encodeURIComponent(this.addForm.corpName)
              }
            })
          }
        })
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
  .query-table {
    width: 680px;
    margin: 0 auto;
    background-color: #fff;
    padding: 32px 48px 20px;
    margin-top: 20px;
  }
  .query-btn {
    text-align: center;
    margin: 12px 0;
  }
  .detail-img,.no-pic{
    display: inline-block;
    padding-right: 10px;
    margin-bottom: 12px;
    width: 88px;
    height: 88px;
    cursor: pointer;
  }
</style>
