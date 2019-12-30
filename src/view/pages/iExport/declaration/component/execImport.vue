<template>
  <!-- 附注信息的组件 -->
  <section>
    <el-form label-width="70px" size="small" style="margin:20px 30px;">
      <el-row :gutter="20" style="border:0">
        <el-col :span ="18">
          <el-input v-model="fileName" disabled class="file-input" placeholder="请选择对应的excel模板文件！"></el-input>
        </el-col>
        <el-col :span ="6">
          <el-upload
              class="upload-demo"
              action="http://127.0.0.1"
              :before-upload="beforeUpload"
              :show-file-list="false">
              <el-button  class="file-inputx">选择文件</el-button>
            </el-upload>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="border:0;margin-top:15px">
        <el-col :span ="18">
          <el-form-item label="导入类型" >
            <el-select placeholder="" v-model="importType" style="width:100%" @change="importTypeChange">
              <el-option
                v-for="item in importTypeList"
                :key="item.code"
                :label="item.value"
                :value="item.code"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span ="6">
          <el-button @click="upLoadExcel" class="file-inputx">上传</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="border:0;margin-top:15px" v-if="importType !== 'MB'">
        <el-col :span ="18">
          <el-form-item label="模板下载" >
            <el-select placeholder="" v-model="downLoadType" style="width:100%" @change="downLoadChang">
              <el-option
                v-for="item in downLoadTypeList"
                :key="item.code"
                :label="item.value"
                :value="item.code"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span ="6">
          <el-button class="file-inputx" @click="downLoadTemplate" >下载
          </el-button>
        </el-col>
      </el-row>
      <template v-else>
        <el-row :gutter="20" style="border:0;margin-top:15px">
          <el-col :span ="18">
            <el-form-item label="导入模版" >
              <el-select placeholder="" v-model="customTemplateDecPid" style="width:100%">
                <el-option value="0" label="请选择"></el-option>
                <el-option
                  v-for="item in customizeTemplates"
                  :key="item.customTemplateDecPid"
                  :label="item.templateName"
                  :value="item.customTemplateDecPid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="border:0;margin-top:15px">
          <el-col :span ="18">
            <el-form-item label="申报类型" >
              <el-select placeholder="" v-model="declareType" style="width:100%">
                <el-option
                  v-for="item in declareTypes"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'execl-import',
  props: {
    initParams: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      importTypeList: [{
        value: '自定义模版导入',
        code: 'MB'
      }, {
        value: '报关单数据导入',
        code: '0'
      }, {
        value: '备案清单数据导入',
        code: '1'
      }, {
        value: 'H账册导入',
        code: 'H'
      }],
      downLoadTypeList: [
        {
          value: '报关单模板下载',
          code: 'A'
        }, {
          value: '备案清单下载',
          code: 'B'
        }],
      fileName: '', // 文件名
      fileUrl: '', // 文件路径
      importType: '0', // 上传类型
      downLoadType: 'A', // 下载模板
      fileList: [],
      customTemplateDecPid: '0',
      declareType: 'I,0',
      loadUrl: 'https://www.5itrade.cn/files/decTemplet/decImportTemplet.xlsx', // 需要下的文件路径
      customizeTemplates: [],
      declareTypes: [{
        value: '进口报关单',
        code: 'I,0'
      }, {
        value: '出口报关单',
        code: 'E,0'
      }, {
        value: '进境备案清单',
        code: 'I,1'
      }, {
        value: '出境备案清单',
        code: 'E,1'
      }]
    }
  },
  mounted () {
    if (!util.isEmpty(this.initParams.iEFlag) && this.initParams.type === 'DL') {
      this.importTypeList = [
        {
          value: '报关单表体数据导入',
          code: 'DL'
        }]
      this.downLoadTypeList = [
        {
          value: '报关单表体模板下载',
          code: 'DL'
        }]
      this.importType = 'DL' // 上传类型
      this.downLoadType = 'DL' // 下载模板
      this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/declistImportTemplet.xlsx'
    } else if (this.initParams.type === 'CN') { // 集装箱导入
      this.importTypeList = [
        {
          value: '集装箱数据导入',
          code: 'CN'
        }]
      this.downLoadTypeList = [
        {
          value: '集装箱模板下载',
          code: 'CN'
        }]
      this.importType = 'CN' // 上传类型
      this.downLoadType = 'CN' // 下载模板
      this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/containerImportTemplet.xls'
    } else if (!util.isEmpty(this.initParams.iEFlag) && this.initParams.type === 'OD') {
      this.importTypeList = [{
        value: '一体化接单(报关单)',
        code: 'dec'
      }, {
        value: '一体化接单(核注清单)',
        code: 'invt'
      }, {
        value: '一体化接单(报关单+核注清单)',
        code: 'decInvt'
      }, {
        value: '批量接单',
        code: 'order'
      }]
      this.downLoadTypeList = [{
        value: '一体化接单(报关单/核注清单)',
        code: 'integratedLoad'
      }, {
        value: '批量接单',
        code: 'orderLoad'
      }]
      this.importType = 'dec'
      this.downLoadType = 'integratedLoad'
      this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/importIntegratedOrder.xlsx'
    }
  },
  methods: {
    importTypeChange () {
      if (this.importType === 'MB' && this.customizeTemplates.length === 0) {
        this.$post({
          url: 'API@/dec-common/customTemplate/getAllTemplate',
          data: {},
          success: (res) => {
            this.customizeTemplates = res.result
          }
        })
      }
    },
    // Excel 导入
    upLoadExcel () {
      if (this.fileList.length === 0) {
        this.messageTips('请先选择需要导入的文件')
      } else {
        if (this.importType === 'MB') {
          if (!this.customTemplateDecPid) {
            this.messageTips('请先选择导入模版')
          } else {
            let declareType = this.declareType.split(',')
            this.$post({
              url: 'API@/dec-common/customTemplate/importCustomTemplateExcel',
              data: {
                'customTemplateDecPid': +this.customTemplateDecPid,
                'iEFlag': declareType[0],
                'type': declareType[1],
                'url': this.fileUrl
              },
              success: (res) => {
                this.messageTips(res.message, 'success')
                this.fileList = []
                this.$emit('cancLeData', {'res': res, isQuery: true})
              },
              other: res => {
                this.messageTips(res.message, 'warning')
              }
            })
          }
        } else if (this.importType === 'H') { // H账册
          this.$post({
            url: 'API@/dec-common/dec/common/importCurEms',
            data: {
              httpUrl: this.fileUrl,
              type: this.importType
            },
            success: (res) => {
              this.$message(res.message)
              this.fileList = []
              this.$emit('cancLeData', {isQuery: true})
            }
          })
        } else if (this.importType === 'DL') { // 报关单表体导入
          this.$post({
            url: 'API@/dec-common/dec/common/importDecList',
            data: {
              httpUrl: this.fileUrl, // 文件路径 如："https://sere.execl"
              iEFlag: this.initParams.iEFlag, // 进出口标识 I 进口 E 出口
              gNoList: this.initParams.gNoList, // 报关单商品数据 序号 ['1','2','3']
              manualNo: this.initParams.manualNo, // 备案号
              limitSeqNoList: [], // 许可证的gNo 暂时没有用
              type: this.importType
            },
            success: (res) => {
              this.fileList = []
              this.$emit('backData', {'res': res, type: this.importType})
            }
          })
        } else if (this.importType === 'CN') { // 集装箱导入
          this.$post({
            url: 'API@/dec-common/dec/common/importDecContainer',
            data: {
              httpUrl: this.fileUrl,
              containerNoList: this.initParams.containerNoList
            },
            success: (res) => {
              this.fileList = []
              this.$emit('backData', {'res': res, type: this.importType})
            }
          })
        } else if (this.initParams.type === 'OD') { // 接单导入
          if (this.importType !== 'order') {
            this.$post({
              url: 'API@/dec-common/ccba/common/importIntegratedOrder',
              data: {
                httpUrl: this.fileUrl, // 文件路径 如："https://sere.execl"
                iEFlag: this.initParams.iEFlag, // 进出口标识 I 进口 E 出口
                importType: this.importType
              },
              success: (res) => {
                this.fileList = []
                this.$emit('cancLeData', {'res': res, isQuery: true})
              }
            })
          } else {
            this.$post({
              url: 'API@/dec-common/ccba/common/importOrderTake',
              data: {
                httpUrl: this.fileUrl, // 文件路径 如："https://sere.execl"
                iEFlag: this.initParams.iEFlag // 进出口标识 I 进口 E 出口
              },
              success: (res) => {
                this.fileList = []
                this.$emit('cancLeData', {'res': res, isQuery: true})
              }
            })
          }
        } else { // 报关单/备案清单
          this.$post({
            url: 'API@/dec-common/dec/common/importDecExcelData',
            data: {
              httpUrl: this.fileUrl,
              type: this.importType
            },
            success: (res) => {
              this.fileList = []
              this.messageTips(res.message)
              this.$emit('cancLeData', {isQuery: true})
            },
            other: (res) => {
              this.messageTips(res.message)
            }
          })
        }
      }
    },
    downLoadChang (value) {
      if (value === 'A') {
        this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/decImportTemplet.xlsx'
      } else if (value === 'B') {
        this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/decImportTemplet.xlsx'
      } else if (value === 'DL') {
        this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/declistImportTemplet.xlsx'
      } else if (value === 'integratedLoad') {
        this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/importIntegratedOrder.xlsx'
      } else if (value === 'orderLoad') {
        this.loadUrl = 'https://www.5itrade.cn/files/decTemplet/orderTakenTemp.xlsx'
      }
    },
    downLoadTemplate () {
      window.open(this.loadUrl, '_blank')
    },
    // 上传文件
    beforeUpload (file) {
      let computFileType = '' // 存在 自己计算出来的 文件类型
      if (util.isEmpty(file.type)) { // 解决部分电脑的excel文件没法获取文件类型的情况
        let fileName = file.name
        let type = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
        if (type === 'xls') {
          computFileType = 'application/vnd.ms-excel'
        } else if (type === 'xlsx') {
          computFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      } else {
        computFileType = file.type
      }
      if (!(computFileType === 'application/vnd.ms-excel' || (computFileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (computFileType === ''))) {
        this.messageTips('上传文件只支持execl格式', 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 2048)) {
        this.messageTips('上传文件大小不能超过2MB', 'error')
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
            this.fileName = this.fileList[0].name
            this.fileUrl = this.fileList[0].url
          }
        })
      }
      return false
    }
  }
}
</script>

<style scoped lang="less">
.file-inputx {
    width: 89px;
    text-align: center;
    background-color: #63a4ec;
    color: #fff;
    padding: 12px 15px;
}
.file-input{
  height: 32px;
  line-height: 32px;
}
</style>
