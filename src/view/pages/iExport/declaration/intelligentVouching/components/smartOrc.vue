<template>
<!-- 表体——智能归类组件 -->
  <el-dialog :modal-append-to-body='false'
    class="electricDialog"
    title="上传单证"
    :visible.sync="samrtOrcVisable"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    v-loading="$store.state.loading"
    @closed ="closeSmartOrc()"
    v-dialogDrag
    width="400px">
    <el-form label-width="150"  size="mini">
      <div style="margin:20px 20px;">
        <el-form-item label="文件类型" style="border:unset">
            <el-select style="width:70%" v-model="filetype" size="small" >
              <el-option label="报关单" value="报关单"></el-option>
              <el-option label="提单" value="提单"></el-option>
              <el-option label="发票" value="发票"></el-option>
              <el-option label="装箱单" value="装箱单"></el-option>
            </el-select>
        </el-form-item>
      </div>
      <div style="margin:20px 20px;">
        <el-form-item label="选择文件">
          <el-upload
            class="upload-demo"
            multiple
            action="http://127.0.0.1"
            :before-upload="beforeUpload"
            :on-remove="removeUpload"
            :file-list="fileList">
            <el-button size="mini" class='dialog-primary-btn' type="primary" style="margin-top:0px;height:20px;line-height:20px;padding:0px 5px;">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" style="color:red">允许上传格式:bmp/png/jpg/pdf,单个文件大小不能超过4M</div>
          </el-upload>
          <el-col :span="8" :offset="5">
            <el-button class='dialog-primary-btn'  size="mini"  @click="goCheck()">开始识别</el-button>
          </el-col>
          <el-col :span="8" >
            <el-button class='dialog-btn' size="mini" @click="closeSmartOrc()">取消</el-button>
          </el-col>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import util from '@/common/util.js'
// import decUtil from '../../common/decUtil'
export default {
  name: 'classify-Goods',
  props: {
    samrtOrcVisable: {
      type: Boolean,
      default: false
    },
    decPid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      filetype: '报关单',
      fileList: [],
      ocrfileList: []
    }
  },
  methods: {
    removeUpload (file, fileList) {
      let x = this.fileList.indexOf(file)
      this.fileList.splice(x, 1)
      this.ocrfileList.splice(x, 1)
    },
    goCheck () {
      if (this.ocrfileList.length === 0) {
        this.$message({
          message: '请先上传文件',
          type: 'error'
        })
        return
      }
      let reqdata = util.simpleClone(this.ocrfileList)
      for (let x in reqdata) {
        let name = reqdata[x].docName.split('-')
        name.splice(0, 1)
        reqdata[x].docName = name.join('-')
        reqdata[x].decPid = this.decPid
      }
      this.$post({
        url: 'API@/dec-common/dec/orc/uploadDecOcrPictures',
        data: reqdata,
        isLoad: true,
        success: (res) => {
          if (res.success === 'true') {
            this.$message({
              message: '单证识别中，可以到识别记录中查看结果。',
              type: 'success'
            })
            this.$emit('close:smartOrcClose')
            this.samrtOrcVisable = false
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        }
      })
    },
    // 上传文件
    beforeUpload (file) {
      let fileType = util.getFileTypeByName(file.name)
      for (let a in this.ocrfileList) {
        if (this.filetype === this.ocrfileList[a].docType) {
          this.$message({
            message: '文件类型已存在，不可重复上传',
            type: 'error'
          })
          return
        }
      }
      if (this.fileList.length >= 3) {
        this.$message({
          message: '最多只能上传3张',
          type: 'warning'
        })
        return
      }
      if (['image/jpeg', 'image/png', 'image/bmp', 'application/pdf'].indexOf(fileType) < 0) {
        this.$message({
          message: '上传文件不符合格式',
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
        param.append('filePath', '/longshine/dec/' + this.$store.state.userLoginInfo.sccCode + '/doc/' + (util.dateFormat(new Date(), 'yyyyMMdd')))
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          success: (res) => {
            res.result.name = this.filetype + '-' + res.result.name
            this.fileList.push({...res.result})
            this.ocrfileList.push({'docName': res.result.name,
              'docSize': res.result.size,
              'docType': this.filetype,
              'docUrl': res.result.url})
          }
        })
      }
    },
    closeSmartOrc () {
      this.$emit('close:smartOrcClose')
      this.samrtOrcVisable = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
