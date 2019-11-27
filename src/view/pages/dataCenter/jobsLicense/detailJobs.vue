<template>
  <section class='sys-main'>
    <el-row class = "sys-header" v-if="isNull">
        <el-form :label-width="labelFormWidth.five" :model="submitData" ref="submitData">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(item,index) in submitData.licenseList" :key="index">
              <el-card class="license-card">
                <el-row>
                  <el-col :span="7" style="height:120px;line-height:120px;">
                    <el-upload
                    action="http://127.0.0.1"
                    :auto-upload="false"
                    :file-list="fileLists"
                    :show-file-list="item.fileType">
                    <img v-if="item.isImg  && !item.fileType" :src="item.documentUrl" @click.stop="showfile(item.documentUrl)" class="detail-img">
                    <img v-if="item.isPdf  && !item.fileType" src="../../../../assets/img/icon/pdf.png" @click.stop="showfile(item.documentUrl)" class="detail-img">
                    <img v-if="item.isWord  && !item.fileType" src="../../../../assets/img/icon/word.png" @click.stop="showfile(item.documentUrl)" class="detail-img">
                    <img v-if="item.isExcel  && !item.fileType" src="../../../../assets/img/icon/excel.png" @click.stop="showfile(item.documentUrl)" class="detail-img">
                    </el-upload>
                  </el-col>
                  <el-col :span="17">
                    <el-row :gutter="30">
                      <el-col :span="24">
                        <el-form-item label="单据类型：" class="type-height">
                          <span>
                            {{ item.documentTypeValue || '-' }}
                          </span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="单据编号：" class="type-height" prop="licensePath">
                          {{ item.documentNo || '-' }}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="30">
                      <el-col>
                        <el-form-item label="上传时间：" class="type-height">
                          {{ item.updateTime  || '-' }}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="30">
                      <el-col>
                        <el-form-item label="上传人：" class="type-height">
                          {{ item.updateUserName || '-' }}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            </el-row>
        </el-form>
        <el-col :span="24" class="query-btn">
          <el-button size="mini" @click="toEdit(decPid,ownerCodeScc)">编辑</el-button>
          <el-button type="primary" size="mini" @click="toDetail(decPid,ownerCodeScc)">确认</el-button>
        </el-col>
    </el-row>
    <el-row v-else class="null-img">
       <img src="../../../../assets/img/error/null.png" alt=""/>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  data () {
    return {
      ownerCodeScc: '',
      fileLists: [], // 存放文件
      isNull: true,
      submitData: {
        licenseList: [
          {
            documentUrl: '',
            documentTypeValue: '',
            documentNo: '',
            updateTime: '',
            updateUserName: '',
            fileLists: [], // 存放文件
            fileType: true,
            isImg: false,
            isPdf: false,
            isWord: false,
            isExcel: false
          }
        ]
      }
    }
  },
  created () {
    this.decPid = this.$route.query.decPid
    this.ownerCodeScc = this.$route.query.ownerCodeScc
    this.submitData.licenseList = []
  },
  mounted () {
    this.querylist()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('detailJobs') === -1) {
        return
      }
      this.decPid = to.query.decPid
      this.ownerCodeScc = to.query.ownerCodeScc
      this.submitData.licenseList = []
      this.querylist()
    }
  },
  methods: {
    // 列表
    querylist () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/business/queryAttachList',
        data: {decPid: this.decPid},
        router: this.$router,
        isPageList: true,
        success: (res) => {
          let licenseList = util.isEmpty(res.result) ? [] : res.result
          if (res.result.length === 0) {
            this.isNull = false
          } else {
            licenseList.forEach(item => {
              let url = item.documentUrl
              this.isNull = true
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
            })
            this.submitData.licenseList = licenseList
          }
        }
      })
    },
    // 预览
    showfileUrl (file) {
      util.fileView(file.url)
    },
    // 文件点击事件
    showfile (url) {
      if (!util.isEmpty(url)) {
        util.fileView(url)
      }
    },
    // 跳转到编辑页面
    toEdit (decPid, ownerCodeScc) {
      this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        path: '/dataCenter/jobsLicense/editJobs',
        query: {
          decPid: decPid,
          ownerCodeScc: ownerCodeScc
        }
      })
    },
    // 跳转到详情页面
    toDetail (decPid, ownerCodeScc) {
      this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        path: '/dataCenter/jobsLicense/jobDetailList',
        query: {
          ownerCodeScc: ownerCodeScc
        }
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
    text-align: center;
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
</style>
