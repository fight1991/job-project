<template>
  <section class='sys-main'>
    <el-row class = "query-condition">
      <el-row>
        <el-button type="primary" size="mini" style="margin: 10px 0px;" @click="upload(decPid, ownerCodeScc)">批量导入</el-button>
      </el-row>
      <el-row style="color:#287fca">
        <p>注意：</p>
        <p>1. 从报关单上传的业务单据无法在当前模块进行编辑，若有需要，请回到报关单页面进行编辑</p>
        <p>2. 在当前页面，您也无法编辑他人上传的文件</p>
      </el-row>
        <el-form :label-width="labelFormWidth.five" :model="submitData" ref="submitData" :rules="rules">
          <el-row :gutter="5">
            <el-col :md="12" :lg="12" v-for="(item,index) in submitData.licenseList" :key="index">
              <el-card class="license-card">
                <span class="list-icon-delete_all"><i class="license-close-icon" @click="delLicense(index)"></i></span>
                <el-row>
                  <el-col :span="8">
                    <el-upload
                    action="http://127.0.0.1"
                    :before-upload="(e)=>{beforeUpload(e,item,index)}"
                    :file-list="fileLists"
                    :show-file-list="item.fileType"
                    :on-preview="showfileUrl"
                    :on-remove="(e)=>{handleDelete(e,item)}">
                      <img v-if="item.isImg && !item.fileType" :src="item.documentUrl" @click.stop="showfile(item.documentUrl)" class="detail-img">
                      <img v-if="item.isPdf && !item.fileType" src="https://www.5itrade.cn/files/CCBA/pdf.png" @click.stop="showfile(item.documentUrl)" class="detail-img">
                      <img v-if="item.isWord && !item.fileType" src="https://www.5itrade.cn/files/CCBA/word.png" @click.stop="showfile(item.documentUrl)" class="detail-img">
                      <img v-if="item.isExcel && !item.fileType" src="https://www.5itrade.cn/files/CCBA/excel.png" @click.stop="showfile(item.documentUrl)" class="detail-img">
                      <el-row>
                        <el-button size="mini" type="primary">重新上传</el-button>
                      </el-row>
                    </el-upload>
                  </el-col>
                  <el-col :span="16" style="padding-top:16px;">
                    <el-form-item label="单据类型" :prop="'licenseList.'+index+'.documentType'" :rules="rules.documentType" class="mb18">
                      <el-select placeholder="请选择单据类型" size="mini" v-model="item.documentType"
                      filterable clearable
                      style="width:100%">
                        <el-option
                          v-for="(item,i) in saasEdocCode"
                          :key="'licenseList.'+index+i+item.codeField"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="单据编号" :prop="'licenseList.'+index+'.documentNo'" :rules="rules.documentNo" class="mb18">
                      <el-input clearable size="mini" :maxlength="40" v-model="item.documentNo"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            </el-row>
        </el-form>
        <el-col :span="24" class="query-btn">
          <el-button type="primary" size="mini" @click="submit">确认</el-button>
          <el-button size="mini" @click="toDetail(ownerCodeScc)">取消</el-button>
        </el-col>
    </el-row>
    <batch-upload :decPid = 'decPid' :openPath='openPath' :batchUploadVisabled.sync='batchUploadVisabled' :pageType="'licenseEdit'" @close:batchEdit="backData"></batch-upload>
  </section>
</template>

<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
import storageHandle from '@/common/storageHandle'
import batchUpload from '../../component/batchUpload'
export default {
  components: {
    batchUpload
  },
  data () {
    return {
      rules: {
        documentNo: [{ required: true, message: '请输入单据编号', trigger: 'blur' }],
        documentType: [{ required: true, message: '请选择单据类型', trigger: 'change' }]
      },
      fileLists: [],
      decPid: '',
      ownerCodeScc: '',
      submitData: {
        licenseList: [{
          documentNo: '',
          documentType: '',
          documentTypeValue: '',
          documentUrl: '',
          fileLists: [], // 存放文件
          fileType: true,
          isImg: false,
          isPdf: false,
          isWord: false,
          isExcel: false
        }]
      },
      saasEdocCode: [],
      batchUploadVisabled: false,
      openPath: 'dataCenter'
    }
  },
  created () {
    this.decPid = this.$route.query.decPid
    this.ownerCodeScc = this.$route.query.ownerCodeScc
    this.submitData.licenseList = [{
      documentNo: '',
      documentType: '',
      documentTypeValue: '',
      documentUrl: '',
      fileLists: [],
      fileType: true,
      isImg: false,
      isPdf: false,
      isWord: false,
      isExcel: false
    }]
    this.getCommonParams()
  },
  mounted () {
    this.querylist()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('editJobs') === -1) {
        return
      }
      this.decPid = to.query.decPid
      this.ownerCodeScc = to.query.ownerCodeScc
      this.submitData.licenseList = [{
        documentNo: '',
        documentType: '',
        documentTypeValue: '',
        documentUrl: '',
        fileLists: [],
        fileType: true,
        isImg: false,
        isPdf: false,
        isWord: false,
        isExcel: false
      }]
      this.getCommonParams()
      this.querylist()
    }
  },
  methods: {
    // 列表
    querylist () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/business/queryEditAttachList',
        data: {decPid: this.decPid},
        router: this.$router,
        success: (res) => {
          let licenseList = util.isEmpty(res.result) ? [] : res.result
          licenseList.forEach(item => {
            let url = item.documentUrl
            if (!util.isEmpty(url)) {
              let suffix = util.getFileTypeByName(url)
              if (suffix === 'image/jpeg' || suffix === 'image/png' || suffix === 'image/gif' || suffix === 'image/bmp') {
                item.fileType = false
                item.isImg = true
                item.isPdf = false
                item.isWord = false
                item.isExcel = false
              } else {
                if (suffix === 'application/pdf') {
                  item.fileType = false
                  item.isImg = false
                  item.isPdf = true
                  item.isWord = false
                  item.isExcel = false
                } else if (suffix === 'application/msword' || suffix === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                  item.fileType = false
                  item.isImg = false
                  item.isPdf = false
                  item.isWord = true
                  item.isExcel = false
                } else if (suffix === 'application/vnd.ms-excel' || suffix === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                  item.fileType = false
                  item.isImg = false
                  item.isPdf = false
                  item.isWord = false
                  item.isExcel = true
                }
              }
            }
          })
          this.submitData.licenseList = licenseList
        }
      })
    },
    // 删除业务单据
    delLicense (index) {
      this.submitData.licenseList.splice(index, 1)
    },
    // 保存
    submit () {
      this.$refs['submitData'].validate((valId) => {
        if (!valId) {
          return false
        }
        let list = []
        list = this.submitData.licenseList
        for (let i = 0; i < list.length; i++) {
          for (let j = list.length - 1; j > i; j--) {
            if (list[i].documentNo === list[j].documentNo && list[i].documentType === list[j].documentType) {
              this.$message({
                message: '此单据类型和单据编号已存在',
                type: 'error'
              })
              return
            }
          }
        }
        let data = {
          ownerCodeScc: this.ownerCodeScc,
          decPid: this.decPid,
          attachs: this.submitData.licenseList
        }
        this.$store.dispatch('ajax', {
          url: 'API@/saas-document-center/business/edit',
          data: data,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.toDetail(this.ownerCodeScc)
          }
        })
      })
    },
    // 上传图片前的格式及大小判断
    beforeUpload (file, row, index) {
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
        param.append('filePath', '/longshine/document/' + sccCode + '/job_license/' + date)
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          isLoad: false,
          router: this.$router,
          success: (res) => {
            row.documentUrl = res.result.url
            row.createUserName = res.result.name
            row.fileLists = []
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') {
              row.fileType = false
              row.isImg = true
              row.isPdf = false
              row.isWord = false
              row.isExcel = false
            } else {
              row.fileLists.push({
                name: res.result.name,
                url: res.result.url
              })
              if (file.type === 'application/pdf') {
                row.fileType = false
                row.isImg = false
                row.isPdf = true
                row.isWord = false
                row.isExcel = false
              } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                row.fileType = false
                row.isImg = false
                row.isPdf = false
                row.isWord = true
                row.isExcel = false
              } else if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                row.fileType = false
                row.isImg = false
                row.isPdf = false
                row.isWord = false
                row.isExcel = true
              }
            }
            this.$refs['submitData'].clearValidate('licenseList.' + index + '.documentUrl')
          }
        })
      }
      return false
    },
    // 附件删除
    handleDelete (file, fileList, row) {
      for (let i = 0; i < this.row.fileLists.length; i++) {
        if (file.name === this.row.fileLists[i].name) {
          this.row.fileLists.splice(i, 1)
          this.row.documentUrl = ''
        }
      }
    },
    // // 预览
    showfileUrl (file) {
      util.fileView(file.url)
    },
    // 文件点击事件
    showfile (url) {
      if (!util.isEmpty(url)) {
        util.fileView(url)
      }
    },
    // 获取公共字典list
    getCommonParams () {
      let par = ['SAAS_EDOC_CODE']
      let tableNames = commonParam.isRequire(par)
      if (tableNames.length > 0) {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-dictionary/dictionary/getParam',
          data: {
            'tableNames': tableNames
          },
          router: this.$router,
          success: (res) => {
            commonParam.saveParams(res.result)
            this.saasEdocCode = storageHandle.getEdocCodesByRelatedBusiness(JSON.parse(window.localStorage.getItem('SAAS_EDOC_CODE')), 'common')
          }
        })
      } else {
        this.saasEdocCode = storageHandle.getEdocCodesByRelatedBusiness(JSON.parse(window.localStorage.getItem('SAAS_EDOC_CODE')), 'common')
      }
    },
    // 导入
    upload (decPid, ownerCodeScc) {
      // this.$router.push({
      //   path: '/dataCenter/jobsLicense/importLicense',
      //   query: {
      //     decPid: decPid,
      //     ownerCodeScc: ownerCodeScc
      //   }
      // })
      this.batchUploadVisabled = true
    },
    // 跳转到详情页面
    toDetail (ownerCodeScc) {
      this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        path: '/dataCenter/jobsLicense',
        query: {
          ownerCodeScc: ownerCodeScc
        }
      })
    },
    backData () {
      this.querylist()
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
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .query-btn {
    text-align: center;
  }
  .license-close-icon{
      width: 20px;
      height: 20px;
      display: inline-block;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
    }
  .license-card{
    position: relative;
    margin-bottom: 20px;
    padding-right: 10px;
  }
  .detail-img,.no-pic{
    display: inline-block;
    padding-right: 10px;
    margin-bottom: 12px;
    width: 88px;
    height: 88px;
    cursor: pointer;
  }
  .avatar-uploader {
    margin:20px auto;
    text-align: center;
  }
  .avatar-uploader-icon {
    border: 1px solid #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .mb18 {
    margin-bottom: 18px;
  }
</style>
