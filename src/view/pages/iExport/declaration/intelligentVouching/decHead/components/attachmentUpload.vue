<template>
  <!-- 编辑标记及号码附件信息 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑标记及号码附件信息"
      :visible.sync="attachVisabled"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeCompnent'
      class='sys-dec-class'
      @open="attachShow"
      v-dialogDrag
      width="600px">
      <div class='m-t-15'>
        <label class="label-class">附件名称：</label>
        <input v-model="decMarkLobsVo.attachName" disabled class="input-class"/>
        <div class="div-class">只可上传后缀名为JPG、GIF、PNG、BMP的文件,且大小不能超过1M</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewPicture" icon="fa fa-eye" class='m-l-63'>预览</el-button>
        <el-upload
          class="upload-demo upload-class"
          action="http://127.0.0.1"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false">
          <el-button  icon="fa fa-upload">上传</el-button>
        </el-upload>
        <el-button @click="deletePicture"  icon="fa fa-trash-o" >删除</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util.js'
export default {
  name: 'attachment-upload',
  props: {
    attachVisabled: {
      type: Boolean,
      default: false
    },
    decMarkLobsData: {
      type: Object,
      default: () => this.generateDecMarkLobsVo()
    }
  },
  data () {
    return {
      fileList: [],
      decMarkLobs: [], // 标记唛码附件
      decMarkLobsVo: this.generateDecMarkLobsVo()
    }
  },
  created () {
  },
  methods: {
    attachShow () {
      this.decMarkLobsVo = util.simpleClone(this.decMarkLobsData)
    },
    configBtn () {
      this.decMarkLobs = []
      this.decMarkLobs.push(this.decMarkLobsVo)
      this.$emit('close:attachmentUpload', {
        decMarkLobs: this.decMarkLobs
      })
    },
    closeCompnent () {
      this.$emit('update:attachVisabled', false)
    },
    // 上传图片前的格式及大小判断
    beforeAvatarUpload (file) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)) {
        this.messageTips('上传文件只支持jpg、png、gif、bmp格式', 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 1024)) {
        this.messageTips('上传文件大小不能超过1MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        param.append('filePath', '/longshine/dec/' + this.$store.state.userLoginInfo.sccCode + '/doc/' + (util.dateFormat(new Date(), 'yyyyMMdd')))
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          success: (res) => {
            if (res.result) {
              this.fileList = []
              this.fileList.push(res.result)
              let currentFile = this.fileList[0]
              this.decMarkLobsVo.attachName = currentFile.name
              this.decMarkLobsVo.attachUrl = currentFile.url
              this.configBtn()
            }
          }
        })
      }
      return false
    },
    // 预览图片
    previewPicture () {
      if (this.fileList.length === 0) {
        this.messageTips('没有可以预览的数据', 'error')
      } else {
        window.open(this.fileList[0].url, '_blank')
      }
    },
    deletePicture () {
      this.fileList = []
      this.decMarkLobsVo = this.generateDecMarkLobsVo()
      this.configBtn()
    },
    generateDecMarkLobsVo () {
      return {
        pid: '', // 主键
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        gNo: '', // 序号
        attachName: '', // 附件名称
        attachType: '', // 附件类型
        attachMent: '', // 附件（计算机无法录入的标记及号码的图案或内容，不超过1MB）
        attachUrl: '' // 附件路径
      }
    }
  }
}
</script>

<style scoped lang="less">
 .m-t-15 {
   margin-top: 15px;
 }
 .label-class {
   height:30px;
   line-height:30px;
   font-size:12px;
   vertical-align: middle;
 }
 .input-class {
   height:30px;
   line-height:30px;
   font-size:12px;
   vertical-align: middle;
   width:420px
 }
 .div-class {
   font-size:12px;
   color:red;
   margin-left:63px
 }
 .upload-class {
   display: inline-block;
   margin-top: 20px;
   margin-bottom: 10px;
 }
 .m-l-63 {
    margin-left:63px;
 }
</style>
