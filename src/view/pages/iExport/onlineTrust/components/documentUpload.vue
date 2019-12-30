<template>
  <section class="batch-sync-dialog">
    <el-dialog
      :title="operationType == 'add' ? '单证上传' : '详情'"
      :visible.sync="documentShow"
      :close-on-click-modal='false'
      :modal-append-to-body='false'
      v-loading="$store.state.loading"
      @open="initUpload"
      @close="close"
      width="1050px">
      <el-tabs v-model="activeName" @tab-click="tabClick" v-if="operationType == 'add'">
        <el-tab-pane label="批量上传" name="first">
          <el-row>
            <el-row>
              <el-upload
                class="upload-drag" style="width:100%;"
                drag
                action="http://127.0.0.1"
                :before-upload="multipleBeforeUpload"
                :show-file-list="false"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击或将文件拖到此处，可在线识别单证</div>
                <div class="el-upload__tip" slot="tip">只支持zip文件，每个压缩包中只能包含一票单据</div>
              </el-upload>
            </el-row>
            <el-row class="mg-t-10 dec-query-table">
              <el-table class='sys-table-table dec-table'
                :data="multipleTableList" border highlight-current-row size="mini"
                :max-height="$store.state.tableHeight" >
                <el-table-column label="压缩包名" align='left' prop="files[0].fileName" min-width="130"></el-table-column>
                <el-table-column label="提运单号" align='center' width="195">
                  <template slot="header" slot-scope="scope">
                    <div class="table-head-icon list-icon-copy">提运单号<i @click="copyColumn(scope)"></i></div>
                  </template>
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.billNo" maxlength="100" clearable></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="申报截止时间" align='center' width="195">
                  <template slot="header" slot-scope="scope">
                    <div class="table-head-icon list-icon-copy">申报截止时间<i @click="copyColumn(scope)"></i></div>
                  </template>
                  <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.demandDate"
                     size="mini" type="datetime" placeholder=""
                      format= 'yyyy-MM-dd HH:mm'
                      value-format= 'yyyy-MM-dd HH:mm'
                      style="width:100%;"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="委托客户" align='left' min-width="150">
                  <template slot="header" slot-scope="scope">
                    <div class="table-head-icon list-icon-copy">委托客户<i @click="copyColumn(scope)"></i></div>
                  </template>
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.entrustCompanyName" style="width:100%" size="mini"
                      filterable remote clearable
                      :remote-method="getCorp"
                      default-first-option>
                      <el-option v-for="item in corpList" :key="item.corpId" :label="item.corpName" :value="item.corpName"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="备注" align='left' min-width="150">
                  <template slot="header" slot-scope="scope">
                    <div class="table-head-icon list-icon-copy">备注<i @click="copyColumn(scope)"></i></div>
                  </template>
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.note" maxlength="100" clearable></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="上传时间" align='center' prop="taskTime" width="150"></el-table-column>
                <el-table-column label="上传进度" align='center' min-width="100">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="scope.row.progress" :status="scope.row.status" class="upload-progress"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align='center' width="50">
                  <template slot-scope="scope">
                    <el-button title="删除" type="text" class="table-icon list-icon-delete" @click="deleteFile(scope.$index, 'multiple')"><i></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="单票上传" name="second">
          <el-row>
            <el-row>
              <el-upload
                class="upload-drag" style="width:100%;"
                drag
                action="http://127.0.0.1"
                :before-upload="singleBeforeUpload"
                :show-file-list="false"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击或将文件拖到此处，可在线识别单证</div>
                <div class="el-upload__tip" slot="tip">支持pdf,word,excel,jpg,png文件，须是同一票文件</div>
              </el-upload>
            </el-row>
            <el-row class="mg-t-10 dec-query-table">
              <el-table class='sys-table-table dec-table'
                :data="singleTableList[0].files" border highlight-current-row size="mini"
                :max-height="$store.state.tableHeight" >
                <el-table-column label="文件名称" align='left' prop="fileName" min-width="180"></el-table-column>
                <el-table-column label="上传时间" align='center' prop="uploadTime" min-width="150"></el-table-column>
                <el-table-column label="上传进度" align='center' min-width="100">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="scope.row.progress" :status="scope.row.status" class="upload-progress"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align='center' width="80" >
                  <template slot-scope="scope">
                    <el-button title="删除" type="text" class="table-icon list-icon-delete" @click="deleteFile(scope.$index, 'single')"><i></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row :gutter="20" class="mg-t-20">
              <el-form :model="singleTableList[0]" label-width="95px" size="mini">
                <el-col :span="8">
                  <el-form-item label="提运单号">
                     <el-input size="mini" v-model="singleTableList[0].billNo" maxlength="100" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="申报截止时间">
                    <el-date-picker v-model="singleTableList[0].demandDate"
                     size="mini" type="datetime"
                      placeholder=""
                      format= 'yyyy-MM-dd HH:mm'
                      value-format= 'yyyy-MM-dd HH:mm'
                      style="width:100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="委托客户">
                    <el-select v-model="singleTableList[0].entrustCompanyName" style="width:100%"
                      filterable remote clearable
                      :remote-method="getCorp"
                      default-first-option>
                      <el-option v-for="item in corpList" :key="item.corpId" :label="item.corpName" :value="item.corpName"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="拼箱">
                    <el-select v-model="singleTableList[0].lclFlag" style="width:100%"
                      filterable remote clearable
                      default-first-option>
                      <el-option
                      v-for="item in lclFlagList"
                      :key="item.codeField"
                      :label="item.nameField"
                      :value="item.codeField">
                       </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="备注">
                    <el-input size="mini" v-model="singleTableList[0].note" maxlength="100" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-row v-else>
        <el-row class="dec-query-table">
          <el-table class='sys-table-table dec-table'
            :data="entrustInfo.files" border highlight-current-row size="mini">
            <el-table-column label="文件名称" align='left' min-width="120">
              <template slot-scope="scope">
                <div class="click-txt" @click="showFile(scope.row)">{{scope.row.fileName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="上传时间" align='center' prop="uploadTime" min-width="150"></el-table-column>
          </el-table>
        </el-row>
        <el-row :gutter="20" class="mg-t-20">
          <el-form :model="entrustInfo" size="mini">
            <el-col :span="6">
              <el-form-item label="提运单号" label-width="97px">
                <div class="break-word">{{entrustInfo.billNo}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申报截止时间:" label-width="97px">
                <div class="break-word">{{entrustInfo.demandDate}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="委托客户:" label-width="69px">
                <div class="break-word">{{entrustInfo.entrustCompanyName}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="拼箱:" label-width="42px">
                <div class="break-word">{{entrustInfo.lclFlagValue}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注:" label-width="69px">
                <div class="break-word">{{entrustInfo.note}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回退原因:" label-width="69px">
                <div class="break-word">{{entrustInfo.backReason}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="冻结原因:" label-width="69px">
                <div class="break-word">{{entrustInfo.frozenReason}}</div>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-row>
      <el-row class="mg-t-20" v-if="operationType == 'add'">
        <el-col :span="24" align="center">
          <el-button size="mini" type="primary" @click="confirmForm">确定</el-button>
          <el-button size="mini" @click="close">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  props: {
    uploadVisible: {
      type: Boolean,
      default: false
    },
    operationType: {
      type: String,
      default: 'add'
    },
    entrustInfo: {
      type: Object,
      default: () => {
        return {
          files: []
        }
      }
    }
  },
  data () {
    return {
      activeName: 'first',
      documentShow: false,
      currDate: '',
      corpList: [],
      lclFlagList: [{
        codeField: '0',
        nameField: '整箱'
      }, {
        codeField: '1',
        nameField: '拼箱'
      }],
      multipleTableList: [], // 批量上传文件
      multipleTableJson: {},
      singleTableList: [{
        files: [],
        demandDate: '',
        entrustCompanyName: '',
        note: '',
        taskTime: '',
        businessNo: '',
        billNo: '',
        taskType: '0'
      }] // 单票上传文件
    }
  },
  watch: {
    'uploadVisible' (newVal, oldVal) {
      this.documentShow = newVal
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    initUpload () {
      if (this.operationType === 'add') {
        this.singleTableList = [{
          files: [],
          demandDate: '',
          entrustCompanyName: '',
          note: '',
          taskTime: util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          billNo: '',
          businessNo: '',
          taskType: '0'
        }]
        this.multipleTableList = []
        this.activeName = 'first'
      }
    },
    close () {
      this.entrustInfo = {}
      this.$emit('update:uploadVisible', false)
    },
    // 获取委托客户
    getCorp (query) {
      if (query.length < 2) {
        this.corpList = []
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: query,
          returnProps: ['sccCode', 'tradeCode', 'ciqCode', 'corpId', 'corpName']
        },
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.corpList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 删除文件
    deleteFile (index, type) {
      if (type === 'single') {
        this.singleTableList[0].files.splice(index, 1)
      } else {
        this.multipleTableList.splice(index, 1)
      }
    },
    singleBeforeUpload (file) {
      this.beforeUpload(file, 'single')
    },
    multipleBeforeUpload (file) {
      this.beforeUpload(file, 'multiple')
    },
    // 上传文件
    beforeUpload (file, type) {
      console.log(file)
      let allow = ['application/x-zip-compressed', 'application/zip']
      if (type === 'single') {
        allow = ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      }
      let message = type === 'single' ? '上传文件只支持pdf,word,excel,jpg,png格式' : '上传文件只支持zip格式'
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      let fileType = type === 'single' ? ['png', 'jpg', 'jpeg', 'doc', 'xls', 'xlsx', 'pdf', 'docx'] : ['zip']
      if (file.type && !allow.includes(file.type)) {
        this.messageTips(message, 'error')
        this.$emit('closeEditUpload')
      } else if (util.isEmpty(file.type) && !fileType.includes(fileName)) {
        this.messageTips(message, 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 20480)) {
        this.messageTips('上传文件大小不能超过20MB', 'error')
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        param.append('filePath', '/longshine/document/ocr/upload')
        if (type === 'single') {
          this.singleTableList[0].files.push({
            fileName: file.name,
            fileUrl: '',
            progress: 0,
            uploadTime: util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            status: 'success',
            billNo: '',
            businessNo: '',
            uid: file.uid,
            size: file.size
          })
        } else {
          let entrustCompanyName = ''
          if (this.$store.state.userLoginInfo.companyType === '4') { // 报关行 货代
            entrustCompanyName = this.$store.state.userLoginInfo.companyName
          }
          this.multipleTableList.push({
            files: [{fileName: file.name, fileUrl: '', uploadTime: util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')}],
            demandDate: '',
            entrustCompanyName: entrustCompanyName,
            note: '',
            taskTime: util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            progress: 0,
            status: 'success',
            billNo: '',
            businessNo: '',
            taskType: '0',
            uid: file.uid
          })
        }
        this.$upload({
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          isLoad: false,
          router: this.$router,
          progressCallback: (res) => {
            if (type === 'single') {
              this.singleTableList[0].files.forEach(e => {
                if (e.uid === file.uid) {
                  e.progress = parseInt(res * 100)
                }
              })
            } else {
              this.multipleTableList.forEach(e => {
                if (e.uid === file.uid) {
                  e.progress = parseInt(res * 100)
                }
              })
            }
          },
          success: (res) => {
            if (type === 'single') {
              this.singleTableList[0].files.forEach(e => {
                if (e.uid === file.uid) {
                  e.fileUrl = res.result.url
                }
              })
            } else {
              this.multipleTableList.forEach(e => {
                if (e.uid === file.uid) {
                  e.files[0].fileUrl = res.result.url
                }
              })
            }
          },
          error: (res) => {
            this.handleStatus(type, file)
          },
          other: (res) => {
            this.handleStatus(type, file)
          }
        })
      }
      return false
    },
    handleStatus (type, file) {
      if (type === 'single') {
        this.singleTableList[0].files.forEach(e => {
          if (e.uid === file.uid) {
            e.status = 'exception'
          }
        })
      } else {
        this.multipleTableList.forEach(e => {
          if (e.uid === file.uid) {
            e.status = 'exception'
          }
        })
      }
    },
    // tab切换
    tabClick (tab, event) {
      if (tab.name === 'first') {
        this.singleTableList = [{
          files: [],
          demandDate: '',
          entrustCompanyName: '',
          note: '',
          taskTime: util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          billNo: '',
          businessNo: '',
          taskType: '0'
        }]
      } else {
        this.multipleTableList = []
      }
    },
    // 确定上传
    confirmForm () {
      let list = this.activeName === 'first' ? this.multipleTableList : this.singleTableList[0].files
      if (list.length === 0) {
        this.messageTips('请选择文件上传', 'error')
        return false
      }
      let flag = false
      let size = 0
      list.forEach(e => {
        if (this.activeName === 'first') {
          if (!e.files[0].fileUrl) {
            flag = true
          }
        } else {
          size += e.size
          if (!e.fileUrl) {
            flag = true
          }
        }
      })
      if (flag) {
        this.messageTips('文件还未上传成功', 'error')
        return false
      }
      if (!(Math.ceil(size / 1024) <= 20480)) {
        this.messageTips('上传文件大小总和不能超过20MB', 'error')
        return false
      }
      if (this.activeName === 'first') {
        this.multipleTableList.forEach(e => {
          delete e.progress
          delete e.status
          delete e.uid
        })
      } else {
        this.singleTableList[0].files.forEach(e => {
          delete e.progress
          delete e.status
          delete e.uid
          delete e.size
        })
      }
      let data = this.activeName === 'first' ? this.multipleTableList : this.singleTableList
      this.$post({
        url: 'API@/dec-common/entrust/uploadEntrustDocument',
        data: data,
        isLoad: false,
        success: (res) => {
          this.messageTips('上传成功', 'success')
          this.$emit('update:uploadVisible', false)
          this.$parent.pageList(this.$store.state.pagination)
        }
      })
    },
    // 详情预览
    showFile (data) {
      util.fileView(data.fileUrl)
    },
    // 复制
    copyColumn (scope) {
      console.log(scope)
      let param = scope.column.label === '申报截止时间' ? 'demandDate' : (scope.column.label === '委托客户' ? 'entrustCompanyName' : 'note')
      if (this.multipleTableList.length > 0) {
        this.multipleTableList.forEach(e => {
          e[param] = this.multipleTableList[0][param]
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.break-word{
  word-break: break-all;
}
.click-txt{
  color: #287fca;
  cursor: pointer;
}
.table-head-icon{
  i{
    vertical-align: middle;
    margin-left: 4px;
    cursor: pointer;
  }
}
</style>
