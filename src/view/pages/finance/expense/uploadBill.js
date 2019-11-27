import util from '@/common/util'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      isTips: false, // 上传时提示弹框节流阀
      isValid: false,
      dialogImageUrl: '',
      dialogImgVisible: false,
      fileList: [] // 票据上传列表
    }
  },
  computed: {
    ...mapState({
      sccCode (state) {
        return state.userLoginInfo.sccCode
      }
    }),
    isAllowUp () { // 是否允许上传
      if (this.fileList.length >= 8) {
        this.fileList.length = 8
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    // 上传数量限制回调
    limitUpload () {},
    dealFileList (type, arr) {
      let tempArr = []
      if (arr && arr.length === 0) {
        return tempArr
      }
      if (type === 'file') {
        arr.forEach(v => {
          tempArr.push({
            name: v.elecName,
            url: v.elecUrl,
            expenseBillElecId: v.expenseBillElecId
          })
        })
      } else {
        arr.forEach(v => {
          tempArr.push({
            elecName: v.name,
            elecUrl: v.url,
            expenseBillId: this.$route.query.expenseBillId || ''
          })
        })
      }
      return tempArr
    },
    handleRemove (file) {
      let index = this.fileList.indexOf(file)
      this.fileList.splice(index, 1)
      if (this.optionsType !== 'add') {
        this.deleteBill(file.expenseBillElecId)
      }
    },
    handlePictureCardPreview (url) {
      this.dialogImageUrl = url
      this.dialogImgVisible = true
    },
    // 电子票据删除
    deleteBill (id) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/bill/deleteElecBill',
        data: {
          expenseBillElecId: id
        },
        router: this.$router,
        success: () => {
          this.$message.success('删除成功')
        }
      })
    },
    // 电子票据上传
    billUpload (billList) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/bill/createElecBill',
        data: billList,
        router: this.$router,
        success: ({result}) => {
          this.fileList = result || []
        }
      })
    },
    // 上传文件
    beforeUpload ({file}) {
      if (!this.isAllowUp) {
        if (this.isTips) return
        this.$message({
          type: 'error',
          message: '最多上传8张',
          onClose: () => {
            this.isTips = false
          }
        })
        this.isTips = true
        return false
      }
      if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
        if (this.isTips) return
        this.$message({
          message: `${file.name} 文件格式错误`,
          type: 'error',
          onClose: () => {
            this.isTips = false
          }
        })
        this.isTips = true
        return false
      }
      if (!(Math.ceil(file.size / 1024) <= 4096)) {
        if (this.isTips) return
        this.$message({
          message: `${file.name} 大小不能超过4MB`,
          type: 'error',
          onClose: () => {
            this.isTips = false
          }
        })
        this.isTips = true
        return false
      }
      let param = new FormData()
      param.append('multiFile', file, file.name)
      param.append('filePath', `/longshine/finance/${this.sccCode}/doc/${util.dateFormat(new Date(), 'yyyy-MM')}`)
      this.$store.dispatch('upload', {
        url: 'FILE@/saas-upload/upload/uploadFile',
        isLoad: false,
        data: param,
        router: this.$router,
        success: ({result: {name, url}}) => {
          if (!this.isAllowUp) return
          // 如果是新增页面, 同其他数据一起提交
          this.fileList.push({
            elecName: name,
            elecUrl: url
          })
          if (this.optionsType !== 'add') {
            this.billUpload({
              elecName: name,
              elecUrl: url,
              expenseBillId: this.$route.query.expenseBillId
            })
          }
        }
      })
      return true
    }
  }
}
