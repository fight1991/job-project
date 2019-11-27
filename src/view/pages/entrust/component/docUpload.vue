<template>
  <section>
    <el-form label-width="107px" :model="exportForm" ref="exportForm" :rules="exportRules" size="mini">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-row>
            <el-col :span="24" v-if="paramShow.invt">
              <el-form-item label="随附单据格式">
                <el-select size="mini" filterable v-model="exportForm.acmpFormFmt" class="select-Color" @change="fmtChange" clearable>
                  <el-option label="1-结构化" value="1"></el-option>
                  <el-option label="2-非结构化" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="随附单据类型">
                <el-select size="mini" filterable v-model="exportForm.docType" @focus="tipsFillMessage('docLists','SAAS_EDOC_CODE')" class="select-Color" @change="uploadChange" clearable remote :remote-method="checkParamsList">
                  <el-option v-for="(item,index) in docLists" :key="item.codeField+index" :value="item.codeField" :label="item.codeField+'-'+item.nameField"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="随附单据编号" prop="remarks" :required="paramShow.invt && exportForm.acmpFormFmt=='1'">
                <el-input v-model="exportForm.remarks" :disabled="!paramShow.invt || isEdit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="flag!=='edit'">
              <el-form-item label="选择文件" class="form-item-mg">
                <el-upload
                  class="upload-demo"
                  action="http://127.0.0.1"
                  :before-upload="urlUpload"
                  :file-list="fileList"
                  :disabled="fileDis()"
                  :on-remove="removeFile">
                  <el-button size="small" type="primary" style="margin-right: 156px;" :disabled="fileDis()">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col align="center">
        <el-button type="primary" size="mini" @click="uploadFun">确认</el-button>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  data () {
    return {
      exportForm: {
        acmpFormFmt: '',
        docType: '',
        remarks: '',
        fileType: '',
        fileName: '',
        fileSize: '',
        fullName: '',
        billType: '1'
      },
      exportRules: {
        remarks: [{validator: this.remarkVal, message: '请输入随附单据编号', trigger: 'blur'}]
      },
      fileList: [],
      isEdit: false,
      selectObj: {
        obj: '',
        params: ''
      },
      tableNameList: {
        tableNames: [
          'SAAS_EDOC_CODE' // 随附单据
        ]
      }, // 字典标明
      docLists: [],
      decDocList: [],
      invtDocList: [{
        codeField: 'FILE',
        nameField: '文件'
      }, {
        codeField: 'R',
        nameField: '减免税证明'
      }]
    }
  },
  props: ['paramShow', 'flag', 'loadForm'],
  created () {
    this.getCommonParam()
  },
  mounted () {
    if (this.flag === 'edit') {
      this.exportForm = util.simpleClone(this.loadForm)
      this.selectObj = {
        obj: 'docLists',
        params: 'SAAS_EDOC_CODE'
      }
      this.checkParamsList(this.loadForm.docType, 'init')
      this.fileList.push({
        name: this.exportForm.fileName,
        size: this.exportForm.fileSize,
        url: this.exportForm.fullName
      })
    }
  },
  methods: {
    // 获取公共字典list
    getCommonParam () {
      let par = this.tableNameList.tableNames
      this.$post({
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
        },
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {
        }
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      this[this.selectObj.obj] = []
      // 如果是下拉框 则设置当前下拉框的默认参数
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = []
      if (util.isEmpty(this.exportForm.acmpFormFmt)) {
        list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      } else {
        list = this.invtDocList
      }
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          this[this.selectObj.obj] = list.slice(0, 10)
        })
      } else {
        let filterList = []
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        if (type === 'init') {
          this[this.selectObj.obj] = filterList.slice(0, 10)
        } else if (type === 'select') {
          this.$nextTick(() => {
            this[this.selectObj.obj] = filterList.slice(0, 10)
          })
        }
      }
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      this[selecType] = []
    },
    // 上传
    urlUpload (file) {
      if (!(Math.ceil(file.size / 1024) <= 4096)) {
        this.$message({
          message: '上传文件大小不能超过4MB',
          type: 'error'
        })
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
            this.fileList.push({
              name: res.result.name,
              size: res.result.size,
              url: res.result.url
            })
          }
        })
      }
      return false
    },
    removeFile (file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.name === this.fileList[i].name) {
          this.fileList.splice(i, 1)
          this.exportForm.fileType = ''
          this.exportForm.fileName = ''
          this.exportForm.fileSize = ''
          this.exportForm.fullName = ''
        }
      }
    },
    // 格式变化
    fmtChange (val) {
      this.exportForm.docType = ''
      this.$refs['exportForm'].clearValidate()
      if (util.isEmpty(val)) {
        this.docLists = this.decDocList
      } else {
        this.docLists = this.invtDocList
      }
      if (val === '1') this.fileList = []
    },
    // 类型变化
    uploadChange (row) {
      if (!util.isEmpty(row)) {
        this.exportForm.docType = row
      }
      if (!this.paramShow.invt) {
        if (row === '10000001' || row === '10000002' || row === '10000003') {
          this.isEdit = false
          this.fileList = []
        } else {
          this.exportForm.remarks = ''
          this.isEdit = true
        }
      } else {
        this.isEdit = false
      }
    },
    // 判断显示是否禁用上传文件
    fileDis () {
      let flag = false
      if (this.exportForm.acmpFormFmt === '1') {
        flag = true
      } else if (this.exportForm.docType === '10000001' || this.exportForm.docType === '10000002' || this.exportForm.docType === '10000003') {
        flag = true
      } else {
        flag = false
      }
      return flag
    },
    // 核注清单-随附单据格式为结构化时 必填
    remarkVal (rule, value, callback) {
      if (this.paramShow.invt && this.exportForm.acmpFormFmt === '1') {
        if (util.isEmpty(value)) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 上传
    uploadFun () {
      this.$refs['exportForm'].validate((valId) => {
        if (!valId) {
          return false
        }
        if (this.paramShow.invt && this.exportForm.acmpFormFmt === '1') {
        } else if (this.exportForm.docType === '10000001' || this.exportForm.docType === '10000002' || this.exportForm.docType === '10000003') {
        } else {
          if (this.fileList.length === 0) {
            this.$message({
              message: '请选择文件上传',
              type: 'error'
            })
            return false
          }
          this.exportForm.fileType = this.fileList[0].name.substring(this.fileList[0].name.lastIndexOf('.') + 1).toLowerCase()
          this.exportForm.fileName = this.fileList[0].name
          this.exportForm.fileSize = this.fileList[0].size
          this.exportForm.fullName = this.fileList[0].url
        }
        this.exportForm.createUser = this.$store.state.userLoginInfo.userId
        this.exportForm.createUserName = this.$store.state.userLoginInfo.userName
        this.exportForm.upTime = util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
        for (let i in this.docLists) {
          if (this.exportForm.docType === this.docLists[i].codeField) {
            this.exportForm.docTypeValue = this.docLists[i].nameField
          }
        }
        this.$emit('getData', this.exportForm)
        this.$emit('close')
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
