<template>
  <!-- 随附单据 组件 -->
  <section>
  <el-dialog
      :modal-append-to-body='false'
      title="随附单据"
      :visible.sync="accDocVisible"
      :show-close='false'
      v-loading="$store.state.loading"
      :before-close='closeCompnent'
      @open="accDocShow"
      width="700px">
        <!-- 弹出框 编辑标记及号码附件信息 开始 -->
        <el-dialog
          :modal-append-to-body='false'
          title="编辑标记及号码附件信息"
          :visible.sync="attachVisabled"
          class='sys-dec-class'
          width="600px">
          <section >
            <div class = 'm-t-15'>
              <label class="label-class">附件名称：</label>
              <input v-model="decMarkLobsVo.attachName" disabled class="input-class"/>
              <div class="div-class">只可上传后缀名为JPG、GIF、PNG、BMP的文件,且大小不能超过1M</div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="previewPicture" icon="fa fa-eye" class="m-l-63">预览</el-button>
              <el-upload
                class="upload-demo upload-class"
                action="http://127.0.0.1"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false">
                <el-button  icon="fa fa-upload">上传</el-button>
              </el-upload>
              <!-- <el-button @click="downLoadPicture"  icon="fa fa-download">下载</el-button> -->
              <el-button @click="deletePicture"  icon="fa fa-trash-o" >删除</el-button>
            </span>
          </section>
        </el-dialog>
        <!-- 弹出框 编辑标记及号码附件信息 结束-->
       <section class="sys-dec-class">
        <div class="border">
          <el-form :model="accDocVo"  label-width="100px" size="mini">
            <el-row>
              <el-col :span="18">
                <el-form-item label="随附单据文件类别">
                  <el-select placeholder=""  v-model="accDocVo.edocCode" @change="changeFun"
                  @focus="tipsFillMessage('','saasEdocCode','SAAS_EDOC_CODE')"
                  remote filterable ref='edocCode'  default-first-option
                  :remote-method="checkParamsList"
                  @keyup.enter.native="autoSaveAccDocByE">
                    <el-option
                      v-for="item in saasEdocCode"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button class='secondButton' @click='openBatchUpload'>批量上传</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" >
                <el-form-item label="随附单据编号">
                  <el-input v-model="accDocVo.edocNo" :disabled="isInputDisabled" :maxlength="length" @keyup.enter.native="saveAccDocByE"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" >
                <el-button class='secondButton' icon="fa fa-edit" v-show='elecNoShow'  @click="creatElecNo">
                 &nbsp;自动生成代理报关委托协议
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择随附单据文件">
                  <el-upload :disabled="isBtnDisabled"
                    class="upload-demo upload-class2"
                    action="http://127.0.0.1"
                    :before-upload="beforeUpload"
                    :show-file-list="false">
                    <el-button class='secondButton' icon="fa fa-plus-circle" :disabled="isBtnDisabled">&nbsp;添加文件</el-button>
                  </el-upload>
                  <span class="span-class">(提示：只可上传后缀名为pdf的文件，单个文件大小不能超过4M，且每页不超过400K)</span>
                  <el-upload :disabled="isBtnDisabled"
                    class="upload-demo upload-class3 float-r"
                    action="http://127.0.0.1"
                    :before-upload="uploadOtherFile"
                    :show-file-list="false">
                    <el-button class='secondButton' icon="fa fa-plus-circle" :disabled="isBtnDisabled">&nbsp;添加其他文件</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="标记唛码附件">
                  <el-button class='secondButton' icon="fa fa-plus-circle" @click="openAttachContent">&nbsp;标记唛码上传</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-table  ref="accDocTable" :data="accDocList"
          highlight-current-row border
          size='mini'
          :height="300"
          style="width: 100%">
          <el-table-column  property="edocCodeValue" label="类别" min-width="50"></el-table-column>
          <el-table-column  property="edocId" label="文件名称" min-width="100"></el-table-column>
          <el-table-column  property="edocNo" label="单据编号" min-width="100"></el-table-column>
          <el-table-column  label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="downLoadPdf(scope.$index)" type="primary" size="mini" v-if="scope.row.edocId !== ''">预览</el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index)" type="primary" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer"  class="sys-dialog-footer text-center">
          <el-button class='dialog-primary-btn' @click="configBtn">上传/保存</el-button>
          <el-button class='dialog-btn' @click="cancleBtn">关闭</el-button>
        </div>
      </section>
  </el-dialog>
  <batch-upload :decPid = 'decHead.decPid' :openPath='openPath' :batchUploadVisabled.sync='batchUploadVisabled' :pageType="'documents'" @close:batchUpload="receptionBatchUpload"></batch-upload>
 </section>
</template>
<script>
import util from '@/common/util.js'
import batchUpload from '../../../../component/batchUpload'
import storageHandle from '@/common/storageHandle.js'

export default {
  name: 'acc-doc',
  components: {
    batchUpload
  },
  props: {
    initParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    accDocVisible: {
      type: Boolean,
      default: false
    },
    showCustomsCode: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      accDocVo: {
        pid: '', // 主键
        decPid: '', // 外键
        edocId: '', // 文件名
        edocCode: '', // 随附单证类别
        edocCodeValue: '', // 随附单证类别名称
        edocNo: '', // 随附单据编号
        opNote: '', // 操作说明
        edocFomatType: '', // 随附单据格式类型
        edocSize: '', // 随附单据文件大小
        edocCopid: '', // 随附单据文件企业名
        edocOwnerCode: '', // 所属单位海关编号
        signUnit: '', // 签名单位代码
        signTime: '', // 签名时间
        edocOwnerName: '', // 所属单位名称
        edocUrl: '' // 文件路径
      },
      accDocList: [], // 随附单据列表
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
      decMarkLobs: [], // 标记唛码附件 list
      isInputDisabled: false,
      isBtnDisabled: true,
      attachVisabled: false, // 附件 弹出框显示与否
      fileList: [],
      length: 17,
      selectObj: {
        obj: '',
        params: ''
      },
      saasEdocCode: [], // 随附单据文件类别
      elecNoShow: false,
      iEFlag: '',
      seqNo: '',
      decHead: {},
      decList: [],
      openPath: 'dec',
      batchUploadVisabled: false
    }
  },
  mounted () {
  },
  methods: {
    accDocShow () {
      let intData = util.simpleClone(this.initParams)
      this.iEFlag = intData.decHead.iEFlag
      this.seqNo = intData.decHead.seqNo
      this.decHead = intData.decHead
      this.decList = intData.decList
      this.accDocList = intData.decHead.decEdocRealations
      if (intData.decHead.decMarkLobs.length > 0) {
        this.decMarkLobsVo = intData.decHead.decMarkLobs[0]
      }
      // 聚焦点
      this.$nextTick(_ => {
        this.$refs['edocCode'].focus()
      })
    },
    changeFun (value) {
      // 判断是否为
      if (value.startsWith('1')) {
        this.isInputDisabled = false
        this.isBtnDisabled = true
        this.accDocVo.edocNo = ''
      } else {
        this.isInputDisabled = true
        this.isBtnDisabled = false
        this.accDocVo.edocNo = ''
      }
      if (value === '10000001') {
        this.elecNoShow = true
      } else {
        this.elecNoShow = false
      }
      // 控制 字段长度
      if (value === '10000001') {
        this.length = 17
      } else if (value === '10000002') {
        this.length = 12
      } else if (value === '10000003') {
        this.length = 13
      }
      // code 转为name codeField + '-' + item.nameField
      for (let n in this.saasEdocCode) {
        if (this.saasEdocCode[n].codeField === value) {
          this.accDocVo.edocCodeValue = this.saasEdocCode[n].nameField
          break
        }
      }
      // 判断类型是否已经存在
      for (let i in this.accDocList) {
        if (this.accDocList[i].edocCode === value) {
          this.messageTips('类别：' + this.accDocVo.edocCodeValue + ' 已经存在', 'error')
          this.accDocVo.edocCodeValue = ''
          this.accDocVo.edocCode = ''
          return false
        }
      }
    },
    // 特殊情况下 的保存 随附单据
    saveAccDocByE () {
      // 如果 随附单据号 为空  则不执行保存操作
      if (util.isEmpty(this.accDocVo.edocNo) && this.accDocVo.edocCode !== '10000001') {
        this.messageTips('请填写随附单据编号')
        return false
      }
      this.accDocList.push(util.simpleClone(this.accDocVo))
      this.refreshAccDoc()
      this.$refs['edocCode'].focus()
    },
    autoSaveAccDocByE () {
      if (this.accDocVo.edocCode === '10000001') {
        this.accDocList.push(util.simpleClone(this.accDocVo))
        this.refreshAccDoc()
        this.$refs['edocCode'].focus()
      }
    },
    // 生成电子协议号
    creatElecNo () {
      let message = this.verifyElecNo()
      if (message.length > 0) {
        this.messageTips(message.join('<br>'))
        return
      }
      this.$post({
        url: 'API@/dec-common/dec/common/generateConsignNo',
        data: {
          'cusCiqNo': this.seqNo,
          'iEFlag': this.iEFlag
        },
        success: (res) => {
          if (res.code === '0000') {
            this.accDocVo.edocNo = res.result.consignNo
          } else {
            this.messageTips(res.message, 'error')
          }
        }
      })
    },
    // 生成电子协议前的数据校验
    verifyElecNo () {
      let tipsMessage = []
      let mesLen = 0
      if (util.isEmpty(this.decHead.seqNo)) {
        mesLen = tipsMessage.length + 1
        tipsMessage.push(mesLen + '、统一编号不能为空')
      }
      if (util.isEmpty(this.decHead.tradeCode)) {
        mesLen = tipsMessage.length + 1
        tipsMessage.push(mesLen + '、境内收发货人10位海关编号不能为空')
      }
      if (util.isEmpty(this.decHead.ownerCode)) {
        if (this.iEFlag === 'I') {
          mesLen = tipsMessage.length + 1
          tipsMessage.push(mesLen + '、消费使用单位10位海关编号不能为空')
        } else {
          mesLen = tipsMessage.length + 1
          tipsMessage.push(mesLen + '、生产销售单位10位海关编号不能为空')
        }
      }
      if (util.isEmpty(this.decHead.agentCode)) {
        mesLen = tipsMessage.length + 1
        tipsMessage.push(mesLen + '、申报单位10位海关编号不能为空')
      }
      if (util.isEmpty(this.decHead.tradeMode)) {
        mesLen = tipsMessage.length + 1
        tipsMessage.push(mesLen + '、监管方式不能为空')
      }
      if (util.isEmpty(this.decHead.wrapType)) {
        mesLen = tipsMessage.length + 1
        tipsMessage.push(mesLen + '、包装种类不能为空')
      }
      if (this.decList.length === 0) {
        mesLen = tipsMessage.length + 1
        tipsMessage.push(mesLen + '、至少需要一条商品数据')
        return tipsMessage
      }
      for (let i in this.decList) {
        if (util.isEmpty(this.decList[i].codeTs)) {
          mesLen = tipsMessage.length + 1
          tipsMessage.push(mesLen + '、商品序号为[' + this.decList[i].gNo + ']:的商品编号不能为空')
        }
        if (util.isEmpty(this.decList[i].gQty)) {
          mesLen = tipsMessage.length + 1
          tipsMessage.push(mesLen + '、商品序号为[' + this.decList[i].gNo + ']:的成交数量不能为空')
        }
        if (util.isEmpty(this.decList[i].declPrice)) {
          mesLen = tipsMessage.length + 1
          tipsMessage.push(mesLen + '、商品序号为[' + this.decList[i].gNo + ']:的单价不能为空')
        }
        if (util.isEmpty(this.decList[i].declTotal)) {
          mesLen = tipsMessage.length + 1
          tipsMessage.push(mesLen + '、商品序号为[' + this.decList[i].gNo + ']:的总价不能为空')
        }
        if (util.isEmpty(this.decList[i].tradeCurr)) {
          mesLen = tipsMessage.length + 1
          tipsMessage.push(mesLen + '、商品序号为[' + this.decList[i].gNo + ']:的币制不能为空')
        }
        if (this.iEFlag === 'I') {
          if (util.isEmpty(this.decList[i].originCountry)) {
            mesLen = tipsMessage.length + 1
            tipsMessage.push(mesLen + '、商品序号为[' + this.decList[i].gNo + ']:的原产国(地区)不能为空')
          }
        } else {
          if (util.isEmpty(this.decList[i].destinationCountry)) {
            mesLen = tipsMessage.length + 1
            tipsMessage.push(mesLen + '、商品序号为[' + this.decList[i].gNo + ']:的最终目的国(地区)不能为空')
          }
        }
      }
      return tipsMessage
    },
    // 刷新数据
    refreshAccDoc () {
      this.accDocVo = {
        pid: '', // 主键
        decPid: '', // 外键
        edocId: '', // 文件名
        edocCode: '', // 随附单证类别
        edocFomatType: '', // 随附单据格式类型
        edocCodeValue: '', // 随附单证类别名称
        edocNo: '', // 随附单据编号
        opNote: '', // 操作说明
        edocSize: '', // 随附单据文件大小
        edocCopid: '', // 随附单据文件企业名
        edocOwnerCode: '', // 所属单位海关编号
        signUnit: '', // 签名单位代码
        signTime: '', // 签名时间
        edocOwnerName: '', // 所属单位名称
        edocUrl: '' // 文件路径
      }
      this.saasEdocCode = []
    },
    // 删除 随附单据数据
    deleteRow (rowIndex) {
      this.accDocList.splice(rowIndex, 1)
    },
    // 预览pdf
    downLoadPdf (rowIndex) {
      window.open(this.accDocList[rowIndex].edocUrl, '_blank')
    },
    // 传送数据给父组件
    configBtn () {
      this.decMarkLobs = []
      this.decMarkLobs.push(this.decMarkLobsVo)
      this.$emit('backDatas', {
        accDocList: this.accDocList,
        decMarkLobs: this.decMarkLobs
      })
    },
    // 关闭组件
    cancleBtn () {
      this.$emit('cancLeData')
    },
    closeCompnent () {
      this.$emit('cancLeData')
    },
    // 打开弹出框
    openAttachContent () {
      this.attachVisabled = true
    },
    // 预览图片
    previewPicture () {
      if (this.fileList.length === 0) {
        this.messageTips('没有可以预览的数据', 'error')
      } else {
        window.open(this.fileList[0].url, '_blank')
      }
    },
    // 删除图片
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
    },
    // 上传图片前的格式及大小判断
    beforeAvatarUpload (file) {
      if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp')) {
        this.messageTips('上传文件只支持jpg、png、gif、bmp格式', 'error')
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
            this.fileList = []
            this.fileList.push(res.result)
            this.decMarkLobsVo.attachName = this.fileList[0].name
            this.decMarkLobsVo.attachUrl = this.fileList[0].url
            // this.decMarkLobsVo.attachType = file.type.split('/')[1]
          }
        })
      }
      return false
    },
    // 上传随附单据的文件
    beforeUpload (file) {
      if (util.isEmpty(this.accDocVo.edocCode)) {
        this.messageTips('请选择随附单据文件类别!')
        this.$emit('closeEditUpload')
        return false
      }
      if (!(file.type === 'application/pdf')) {
        this.messageTips('上传文件只支持pdf格式', 'error')
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
              this.accDocVo.edocUrl = res.result.url
              this.accDocVo.edocSize = res.result.size
              // this.accDocVo.edocId = file.name // 原始的名文件
              // this.accDocVo.edocCopid = res.result.name // 保存在数据库后 生成的文件名
              // 如果文件有重名 则 在后传入的文件名上拼接文件类型
              let index = this.accDocList.findIndex((v, i) => {
                if (v.edocCopid === file.name) {
                  return true
                }
              })
              if (index > -1) { // 有重名 改文件名
                let splitName = file.name.split('.')
                this.accDocVo.edocId = splitName[0] + '-' + this.accDocVo.edocCodeValue + '.' + splitName[1] // 原始的名文件
                this.accDocVo.edocCopid = splitName[0] + '-' + this.accDocVo.edocCodeValue + '.' + splitName[1] // 保存在数据库后 生成的文件名
              } else {
                this.accDocVo.edocId = file.name // 原始的名文件
                this.accDocVo.edocCopid = res.result.name // 保存在数据库后 生成的文件名
              }
              if (this.accDocVo.edocCode.substring(0, 1) === '0') {
                this.accDocVo.edocFomatType = 'US'
              } else {
                this.accDocVo.edocFomatType = 'S'
              }
              // 保存
              this.accDocList.push(util.simpleClone(this.accDocVo))
              this.refreshAccDoc()
              this.$refs['edocCode'].focus()
            }
          }
        })
      }
      return false
    },
    // 上传 其他类型的随附单证
    uploadOtherFile (file) {
      if (util.isEmpty(this.accDocVo.edocCode)) {
        this.messageTips('请选择随附单据文件类别!')
        this.$emit('closeEditUpload')
        return false
      }
      let computFileType = ''
      if (util.isEmpty(file.type)) { // 解决部分电脑的excel文件没法获取文件类型的情况
        computFileType = util.getFileTypeByName(file.name)
      }
      if ((file.type === 'application/pdf')) {
        this.messageTips('此上传不支持pdf格式', 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 4096)) {
        this.messageTips('上传文件大小不能超过4MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        let fileType = ''
        switch (file.type) {
          case 'image/jpeg':
          case 'image/png':
          case 'image/gif':
          case 'image/bmp':
            fileType = 'img'
            break
          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            fileType = 'excel'
            break
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          case 'application/msword':
            fileType = 'word'
            break
          default :
            fileType = ''
        }
        if (computFileType === 'application/vnd.ms-excel' || computFileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          fileType = 'excel'
        }
        if (util.isEmpty(fileType)) {
          this.messageTips('该类型文件不允许转换')
          this.$emit('closeEditUpload')
          return false
        }
        let param = new FormData()
        param.append('file', file, file.name)
        this.$upload({
          url: 'API@saas-upload/upload/pdfConverter',
          data: param,
          success: (res) => {
            this.fileList = []
            if (res.result && res.result.length === 1) {
              let fileName = file.name.split('.')[0]
              let fileInfo = res.result[0]
              this.accDocVo.edocUrl = fileInfo.url
              this.accDocVo.edocSize = fileInfo.size
              this.accDocVo.edocId = fileName + '.pdf'
              this.accDocVo.edocCopid = fileName + '.pdf'
              // 如果文件有重名 则 在后传入的文件名上拼接文件类型
              let index = this.accDocList.findIndex((v, i) => {
                if (v.edocCopid === this.accDocVo.edocId) {
                  return true
                }
              })
              if (index > -1) { // 有重名 改文件名
                this.accDocVo.edocId = fileName + '-' + this.accDocVo.edocCodeValue + '.pdf' // 原始的名文件
                this.accDocVo.edocCopid = fileName + '-' + this.accDocVo.edocCodeValue + '.pdf' // 保存在数据库后 生成的文件名
              }
              if (this.accDocVo.edocCode.substring(0, 1) === '0') {
                this.accDocVo.edocFomatType = 'US'
              } else {
                this.accDocVo.edocFomatType = 'S'
              }
              // 保存
              this.accDocList.push(util.simpleClone(this.accDocVo))
              this.refreshAccDoc()
              this.$refs['edocCode'].focus()
            } else {
              this.messageTips(res.message, 'error')
            }
          }
        })
      }
    },
    // 定位当前下拉框需要的参数表
    tipsFillMessage (value, obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 远程搜索
    checkParamsList (query) {
      let keyValue = query.trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      if (this.selectObj.params === 'SAAS_EDOC_CODE') {
        list = storageHandle.getEdocCodesByRelatedBusiness(list, 'common')
      }
      let filterList = []
      if (util.isEmpty(keyValue)) {
        this[this.selectObj.obj] = list.slice(0, 10)
      } else {
        if (keyValue.length === 1) {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.charAt(0).toLowerCase() === keyValue.toLowerCase()
          })
        }
        let filterList2 = []
        filterList2 = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        filterList.push(...filterList2)
        filterList = this.unique(filterList)
        this[this.selectObj.obj] = filterList.slice(0, 10)
      }
    },
    // 去重
    unique (arr) {
      let x = new Set(arr)
      return [...x]
    },
    openBatchUpload () {
      this.$emit('cancLeData')
      this.batchUploadVisabled = true
    },
    receptionBatchUpload (param) {
      console.log(param)
    }
  }
}
</script>
<style scoped lang="less">
.border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
 }
 .attch-btn {
    width: 74px;
    height: 30px;
    background-color: 63a4ec;
 }
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
 .upload-class2 {
   display: inline-block;
 }
 .span-class {
   color:red;
   font-size: 10px;
 }
 .upload-class3 {
    display: inline-block;
 }
 .float-r {
  float:right;
 }
 .text-center {
   text-align: center;
 }
 .el-select-dropdown__item.selected {
    background: #0080ff;
    color: #ffffff;
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      background: #dbed8a;
      font-weight: bold;
  }
  .el-select-dropdown__item {
      font-size: 12px;
      padding: 0 15px;
      height: 22px;
      line-height: 22px;
      border: #c0c0c0 solid 1px;
  }
  .el-select-dropdown__list {
        padding: 0;
    }
</style>
