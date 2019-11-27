<template>
  <section class='sys-main'>
     <!-- 头部 -->
    <el-row class = "query-condition">
      <el-row>
        <el-col :span="8" :xs='24'>
          委托企业：<span class="top-text">{{resultTopData.ownerName}}</span>
        </el-col>
        <el-col :span="8" :xs='24'>
          报关单系统编号：<span class="top-text">{{resultTopData.decPid}}</span>
        </el-col>
        <el-col :span="8" :xs='24'>
          接单编号：<span class="top-text">{{resultTopData.bossId}}</span>
        </el-col>
      </el-row>
      <el-row style="padding-top:10px">
      <el-col :span="8" :xs='24'>
          统一编号：<span class="top-text">{{resultTopData.seqNo}}</span>
        </el-col>
        <el-col :span="8" :xs='24'>
          报关单号：<span class="top-text">{{resultTopData.entryId}}</span>
        </el-col>
      </el-row>
    </el-row>
      <!-- 头部 end-->
      <!-- 主显示框 -->
    <div class='query-table'>
      <el-form :label-width="labelFormWidth.five" :model="submitData" ref="submitData" :rules="rules">
          <el-row :gutter="20">
            <el-col :md="12" :lg="12" v-for="(item,index) in submitData.licenseList" :key="index">
              <el-card class="license-card">
                <i class="license-close-icon" v-if="index !== 0" @click="delLicense(index)"></i>
                <el-row>
                  <el-col :md="12" :lg="12">
                    <el-form-item label="单据类型" :prop="'licenseList.'+index+'.documentType'" :rules="rules.documentType">
                      <el-select size="mini" placeholder="请选择单据类型" v-model="item.documentType"
                      filterable clearable
                      style="width:100%;min-width:123px;">
                        <el-option
                          v-for="(item,i) in saasEdocCode"
                          :key="'licenseList'+index+i+item.documentType"
                          :label="item.codeField + '-' + item.nameField"
                          :value="item.codeField">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :lg="12">
                    <el-form-item label="单据编号" :prop="'licenseList.'+index+'.documentNo'" :rules="rules.documentNo">
                      <el-input clearable size="mini" :maxlength="40" v-model="item.documentNo"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                   <el-form-item label="单据文件" :prop="'licenseList.'+index+'.documentUrl'" :rules="rules.documentUrl">
                    <el-upload
                    action="http://127.0.0.1"
                    :before-upload="(e)=>{beforeUpload(e,item,index)}"
                    :file-list="fileLists"
                    :show-file-list="item.fileType"
                    :on-preview="showfileUrl"
                    :on-remove="(e)=>{handleDelete(e,item)}">
                    <img v-if="item.isImg  && !item.fileType" :src="item.documentUrl" class="detail-img">
                    <img v-if="item.isPdf  && !item.fileType" src="../../../../assets/img/icon/pdf.png" @click="showfile(item.documentUrl)" class="detail-img">
                    <img v-if="item.isWord  && !item.fileType" src="../../../../assets/img/icon/word.png" @click="showfile(item.documentUrl)" class="detail-img">
                    <img v-if="item.isExcel  && !item.fileType" src="../../../../assets/img/icon/excel.png" @click="showfile(item.documentUrl)" class="detail-img">
                    <el-button size="mini" type="primary" v-if="item.fileType">上传附件</el-button>
                    </el-upload>
                  </el-form-item>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-button size="mini" @click="addLicense"><img class="pointer" src="../../../../assets/img/icon/btn-add.png"/>&nbsp;&nbsp;上传更多业务单据</el-button>
          </el-row>
          <el-row class="query-btn">
            <el-button type="primary" size="mini" @click="submit">确认</el-button>
            <el-button size="mini" @click="toDetail(ownerCodeScc)">取消</el-button>
          </el-row>
        </el-form>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      rules: {
        documentType: [{ required: true, message: '请选择单据类型', trigger: 'change' }],
        documentUrl: [{ required: true, message: '请选择上传文件', trigger: 'change' }],
        documentNo: [{ required: true, message: '请输入单据编号', trigger: 'blur' }]
      },
      ownerCodeScc: '',
      resultTopData: {
        decPid: '',
        ownerName: '',
        entryId: '',
        bossId: '',
        seqNo: ''
      },
      fileLists: [],
      submitData: {
        licenseList: [
          {
            documentNo: '',
            documentType: '',
            documentUrl: '',
            createUserName: '',
            fileLists: [], // 存放文件
            fileType: true,
            isImg: false,
            isPdf: false,
            isWord: false,
            isExcel: false
          }
        ]
      },
      saasEdocCode: []
    }
  },
  created () {
    this.reset()
    this.resultTopData.decPid = this.$route.query.decPid
    this.ownerCodeScc = this.$route.query.ownerCodeScc
    this.getCommonParams()
    this.queryList()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('importLicense') === -1) {
        return
      }
      this.reset()
      this.resultTopData.decPid = to.query.decPid
      this.ownerCodeScc = to.query.ownerCodeScc
      this.getCommonParams()
      this.queryList()
    }
  },
  methods: {
    // 初始化
    reset () {
      this.resultTopData = {
        decPid: '',
        ownerName: '',
        entryId: '',
        bossId: '',
        seqNo: ''
      }
      this.submitData = {
        licenseList: [{
          documentNo: '',
          documentType: '',
          documentUrl: '',
          fileLists: [], // 存放文件
          fileType: true,
          isImg: false,
          isPdf: false,
          isWord: false,
          isExcel: false
        }]
      }
      this.$nextTick(() => {
        this.$refs['submitData'].clearValidate()
      })
    },
    // 列表
    queryList () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/business/queryDecInfo',
        data: {decPid: this.resultTopData.decPid},
        router: this.$router,
        success: (res) => {
          this.resultTopData.decPid = res.result.decPid
          this.resultTopData.ownerName = res.result.ownerName
          this.resultTopData.entryId = res.result.entryId
          this.resultTopData.bossId = res.result.bossId
          this.resultTopData.seqNo = res.result.seqNo
        }
      })
    },
    // 删除业务单据
    delLicense (index) {
      this.submitData.licenseList.splice(index, 1)
    },
    // 更多上传
    addLicense () {
      this.submitData.licenseList.push({
        documentNo: '',
        documentType: '',
        documentUrl: '',
        fileLists: [], // 存放文件
        fileType: true,
        isImg: false,
        isPdf: false,
        isWord: false,
        isExcel: false
      })
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
          decPid: this.resultTopData.decPid,
          attachs: this.submitData.licenseList
        }
        this.$store.dispatch('ajax', {
          url: 'API@/saas-document-center/business/save',
          data: data,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '导入成功',
              type: 'success'
            })
            this.toDetail(this.ownerCodeScc)
          }
        })
      })
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
    handleDelete (file, fileList, row) {
      for (let i = 0; i < this.row.fileLists.length; i++) {
        if (file.name === this.row.fileLists[i].name) {
          this.row.fileLists.splice(i, 1)
          this.row.documentUrl = ''
        }
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
            this.saasEdocCode = JSON.parse(window.localStorage.getItem('SAAS_EDOC_CODE'))
          }
        })
      } else {
        this.saasEdocCode = JSON.parse(window.localStorage.getItem('SAAS_EDOC_CODE'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .sys-main{
    min-width: 970px;
  }
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
    padding: 10px;
    margin-top: 20px;
  }
  .query-btn {
    text-align: center;
  }
  .license-close-icon{
      width: 20px;
      height: 20px;
      display: inline-block;
      background: url('../../../../assets/img/icon/close.png') no-repeat;
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
  .avatar-uploader-icon {
    border: 1px solid #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
