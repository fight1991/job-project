<template>
  <!-- 批量上传 -->
  <section>
    <el-dialog
      title="批量上传单据"
      :modal-append-to-body='false'
      :visible.sync="batchUploadVisabled"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeCompnent'
      class='remove-row-bottom'
      width="600px">
      <div style='color: red;font-size: 12px;'>
        <span style='font-size: 14px;'>tips:</span>
        <span style='margin-left: 5px;'>请上传多个按照下方说明进行命名的文件，系统将根据文件名进行自动归档 :</span>
        <p style='margin-left: 35px;'>1.当前导入界面既可以支持单个本地文件的上传，又支持多个文件的压缩包上传</p>
        <p style='margin-left: 35px;'>2.压缩包内的个文件名，<b>尤其是需要上传至单一的，请以文件类型命名</b></p>
        <p style='margin-left: 35px;'>3.压缩包文件只支持zip格式,每次上传文件大小不超过20m</p>
      </div>
      <div>
        <el-form label-width="70px" size="small" style="margin:20px 30px;">
          <el-row :gutter="20">
            <el-col :span ="18">
              <el-form-item label="上传类型" >
                <el-select placeholder="" v-model="uploadType" style="width:100%" @change="uploadTypeChange">
                  <el-option
                    v-for="item in uploadTypeList"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span ="18">
              <el-form-item label="文件名">
                <el-input v-model="fileName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span ="6">
              <el-upload
                class="upload-class"
                action="http://127.0.0.1"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false">
                <button type='button'  class='upload-btn'>选择文件</button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class='dialog-btn' @click="closeCompnent">取消</button>
        <button class='upload-btn mg-l-10' @click="configBtn">确定导入</button>
      </span>
    </el-dialog>
    <mix-upload :decPid='decPid' :openPath='openPath' :fileList='tableList' @close:mixUpload="backMixUpload"  :mixUploadVisible.sync='mixUploadVisible' :pageType="pageType" v-if='mixUploadVisible'></mix-upload>
  </section>
</template>
<script>
import util from '@/common/util'
import mixUpload from './mixUpload'
export default {
  name: 'batch-upload',
  components: {
    mixUpload
  },
  props: {
    batchUploadVisabled: {
      type: Boolean,
      default: false
    },
    decPid: {
      type: String,
      default: ''
    },
    openPath: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mixUploadVisible: false,
      tableList: [],
      fileList: [],
      uploadType: '1',
      uploadTypeList: [{
        value: '上传单一窗口',
        code: '1'
      }, {
        value: '保存系统',
        code: '2'
      }, {
        value: '混合上传',
        code: '3'
      }],
      fileName: '',
      sumbitVo: {
        url: '', // 文件路径
        edocCode: '', // 原文件名
        decPid: '' // 报关单号
      }
    }
  },
  methods: {
    uploadTypeChange (value) {},
    configBtn () {
      let url = ''
      if (this.uploadType === '1') { // 单一窗口
        url = 'API@/dec-common/dec/common/uploadFileDanyi'
      } else if (this.uploadType === '2') { // 保存系统
        url = 'API@/dec-common/dec/common/uploadFileSaveSystem'
        // url = 'API@/saas-document-center/business/uploadFileSaveSystem'
      } else if (this.uploadType === '3') { // 混合上传
        url = 'API@/dec-common/dec/common/uploadFileMixture'
      }
      this.sumbitVo.decPid = this.decPid
      if (this.pageType === 'documents') {
        if (util.isEmpty(this.sumbitVo.decPid)) {
          this.$message({
            type: 'error',
            message: '请先暂存报关单'
          })
          return false
        }
      }
      if (util.isEmpty(this.sumbitVo.url)) {
        this.$message({
          type: 'error',
          message: '请上传文件'
        })
        return false
      }
      let param = [this.sumbitVo]
      if (this.uploadType === '3') {
        param = this.sumbitVo
        // let type = param.edocCode.substring(param.edocCode.lastIndexOf('.') + 1).toLowerCase()
        // if (!['zip'].includes(type)) {
        //   this.$message({
        //     type: 'error',
        //     message: '混合上传只能上传zip压缩包'
        //   })
        //   return false
        // }
      }
      this.$post({
        url: url,
        data: param,
        success: (res) => {
          if (this.uploadType === '3') {
            this.tableList = []
            for (let i in res.result) {
              this.tableList.push({
                decPid: res.result[i].decPid,
                edocCode: res.result[i].fileName,
                url: res.result[i].url,
                code: res.result[i].edocCode,
                note: res.result[i].note,
                flag: '2',
                edocSize: res.result[i].edocSize
              })
            }
            this.mixUploadVisible = true
          } else {
            this.closeCompnent()
            if (this.pageType === 'license') {
              this.$emit('close:batchlist')
            } else if (this.pageType === 'documents') {
              this.$message({
                type: 'success',
                message: '上传已完成，上传成功。请刷新报关单界面后，前往随附单据中查看详情。'
              })
            } else if (this.pageType === 'licenseEdit') {
              this.$emit('close:batchEdit')
            }
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    closeCompnent () {
      this.fileList = []
      this.uploadType = '1'
      this.fileName = ''
      this.sumbitVo = {
        url: '', // 文件路径
        edocCode: '', // 原文件名
        decPid: '' // 报关单号
      }
      this.$emit('update:batchUploadVisabled', false)
    },
    refreshList () {
      if (this.pageType === 'license') {
        this.$emit('close:batchlist')
      } else if (this.pageType === 'licenseEdit') {
        this.$emit('close:batchEdit')
      }
    },
    // 上传图片前的格式及大小判断
    beforeAvatarUpload (file) {
      // let computFileType = '' // 存在 自己计算出来的 文件类型
      if (util.isEmpty(file.type)) { // 解决部分电脑的excel文件没法获取文件类型的情况
        let fileName = file.name
        let type = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
        if (type === 'rar') {
          this.messageTips('不支持rar类型的压缩包,请使用zip压缩包', 'error')
          this.$emit('closeEditUpload')
          return
        }
        // computFileType = util.getFileTypeByName(type)
      } else {
        // computFileType = file.type
      }
      // if (this.uploadType === '3') { // 混合上传
      //   if (!['application/x-zip-compressed', 'application/zip'].includes(computFileType)) {
      //     this.messageTips('混合上传只能上传zip压缩包！', 'error')
      //     this.$emit('closeEditUpload')
      //     return
      //   }
      // }
      if (!(Math.ceil(file.size / 1024) <= 20480)) {
        this.messageTips('上传文件大小不能超过20MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        let sccCode = this.$store.state.userLoginInfo.sccCode
        let date = util.dateFormat(new Date(), 'yyyyMM')
        if (this.uploadType === '1') { // 上传到报关单
          param.append('filePath', '/longshine/dec/' + sccCode + '/doc/' + date)
        } else { // 其他
          param.append('filePath', '/longshine/document/' + sccCode + '/job_license/' + date)
        }
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          success: (res) => {
            if (res.result) {
              this.fileList = []
              this.fileList.push(res.result)
              let currentFile = this.fileList[0]
              this.fileName = currentFile.name
              this.sumbitVo.edocCode = currentFile.name
              this.sumbitVo.url = currentFile.url
            }
          }
        })
      }
      return false
    },
    backMixUpload (param) {
      this.mixUploadVisible = false
      this.closeCompnent()
    }
  }
}
</script>

<style scoped lang="less">
  .upload-class {
    display: inline-block;
  }
  .upload-btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    padding: 8px 15px;
    font-size: 14px;
    border-radius: 4px;
    background-color: #287fca;
    border-color: #287fca;
    color: #fff;
  }
  .dialog-btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    padding: 8px 15px;
    font-size: 14px;
    border-radius: 4px;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
  }
  .mg-l-10{
    margin-left: 10px;
  }
</style>
