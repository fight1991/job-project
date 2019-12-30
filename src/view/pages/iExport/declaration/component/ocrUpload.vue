<template>
  <!-- ocr上传的组件 -->
  <section>
    <div>
      <el-upload
        class="upload-demo"
        action="http://127.0.0.1"
        :before-upload="beforeUpload"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :before-remove="beforeRemove"
        :file-list="fileList">
        <span @click.stop=''>选择文件：</span>
        <el-button size="small" type="primary" style='height:32px;'>点击上传</el-button>
        <div slot="tip" class="el-upload__tip el-upload-tip-div">
          <span style="color:#606266">模板编号：</span>
          <el-input v-model="templateCode"></el-input>
          <br>允许上传格式: bmp/png/jpg/pdf，单个文件大小不能超过4M
          <br>仅支持识别报关单/备案清单</div>
      </el-upload>
    </div>
    <div slot="footer"  class="sys-dialog-footer text-center">
      <el-button class='dialog-primary-btn' @click="configBtn">开始识别</el-button>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'ocr-upload',
  data () {
    return {
      fileList: [],
      templateCode: '' // 模板编号
    }
  },
  mounted () {
  },
  methods: {
    configBtn () {
      // 开始ocr识别
      if (this.fileList.length === 0) {
        this.messageTips('请上传需要识别的文件！')
        return
      }
      let param = []
      for (let i in this.fileList) {
        param.push({
          docName: this.fileList[i].name,
          docSize: this.fileList[i].size,
          docUrl: this.fileList[i].url,
          templateCode: this.templateCode,
          source: 'accept'
        })
      }
      this.$post({
        url: 'API@/dec-common/dec/orc/uploadDecOcrPictures',
        data: param,
        success: (res) => {
          this.$alert('单证识别中，可以到识别记录中查看结果', '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            confirmButtonText: '我知道啦',
            callback: action => {
            }
          })
          this.$emit('backData')
        }
      })
    },
    cancleBtn () {
      this.$emit('backData')
    },
    // 上传随附单据的文件
    beforeUpload (file) {
      if (!['application/pdf', 'image/jpeg', 'image/png', 'image/bmp'].includes(file.type)) {
        this.messageTips('上传文件只支持bmp、png、jpg、pdf格式', 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 4096)) {
        this.messageTips('上传文件大小不能超过4MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        param.append('filePath', '/longshine/dec/' + this.$store.state.userLoginInfo.sccCode + '/doc/' + (util.dateFormat(new Date(), 'yyyyMMdd')))
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          success: (res) => {
            if (res.code === '0000') {
              this.fileList.push({
                name: res.result.name,
                url: res.result.url,
                size: res.result.size
              })
            }
          }
        })
      }
      return false
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      for (let i in this.fileList) {
        if (this.fileList[i].url === file.url) {
          this.fileList.splice(i, 1)
          break
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
  .text-center {
    text-align: center;
  }
  .el-upload__tip{
    color: red;
  }
  .el-upload-tip-div {
    margin-top: 2px;
    .el-input {
      width: 60%;
      height: 28px;
    }
  }
  .el-input /deep/ .el-input__inner{
    height: 28px !important;
  }
</style>
