<template>
  <!-- 编辑标记及号码附件信息 -->
  <section>
    <div class = 'm-t-15'>
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
  </section>
</template>

<script>
export default {
  name: 'attachment-upload',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      fileList: [],
      decMarkLobsVo: {
        pid: '', // 主键
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        gNo: '', // 序号
        attachName: '', // 附件名称
        attachType: '', // 附件类型
        attachMent: '', // 附件（计算机无法录入的标记及号码的图案或内容，不超过1MB）
        attachUrl: '' // 附件路径
      },
      decMarkLobs: [] // 标记唛码附件
    }
  },
  created () {
    this.decMarkLobs = this.initParams.decMarkLobs
    if (this.decMarkLobs.length > 0) {
      this.decMarkLobsVo = this.decMarkLobs[0]
    }
  },
  methods: {
    configBtn () {
      this.decMarkLobs = []
      this.decMarkLobs.push(this.decMarkLobsVo)
      this.$emit('backDatas', {
        decMarkLobs: this.decMarkLobs
      })
    },
    cancleBtn () {
      this.$emit('cancLeData')
    },
    // 上传图片前的格式及大小判断
    beforeAvatarUpload (file) {
      if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp')) {
        this.messageTips('上传文件只支持jpg、png、gif、bmp格式', 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 1024)) {
        this.messageTips('上传文件大小不能超过1MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        param.append('filePath', '/download')
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          success: (res) => {
            this.fileList = []
            this.fileList.push(res.result)
            this.decMarkLobsVo.attachName = this.fileList[0].name
            this.decMarkLobsVo.attachUrl = this.fileList[0].url
            this.configBtn()
          }
        })
      }
      return false
    },
    // 预览图片
    previewPicture () {
      if (this.decMarkLobsVo.attachUrl) {
        window.open(this.decMarkLobsVo.attachUrl, '_blank')
      } else {
        this.messageTips('没有可以预览的数据', 'error')
      }
    },
    deletePicture () {
      this.fileList = []
      this.decMarkLobsVo = {
        pid: '', // 主键
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        gNo: '', // 序号
        attachName: '', // 附件名称
        attachType: '', // 附件类型
        attachMent: '', // 附件（计算机无法录入的标记及号码的图案或内容，不超过1MB）
        attachUrl: '' // 附件路径
      }
      this.configBtn()
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
