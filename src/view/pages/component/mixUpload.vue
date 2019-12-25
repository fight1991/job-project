<template>
  <section class="batch-sync-dialog">
    <el-dialog
      title='混合上传'
      :visible.sync="mixUploadVisible"
      :close-on-click-modal='false'
      :modal-append-to-body='false'
      @close="closeMixUpload"
      class='remove-row-bottom'
      width="1050px">
      <div style='color: red;font-size: 12px;'>
        <span style='font-size: 14px;'>tips:</span>
        <span style='margin-left: 5px;'>系统编号为：<b>{{decPid}}</b>的报关单,此次共导入<b>{{fileNum}}</b>个文件</span>
        <p style='margin-left: 35px;'>1.勾选的的文件,将上传到报关单,未勾选将上传到资料中心</p>
        <p style='margin-left: 35px;'>2.勾选的的文件,<b>必需选择文件类型且不能重复,包括此报关单已有的随附单据</b></p>
      </div>
      <el-row class="mg-t-10 dec-query-table">
        <el-table
          class='sys-table-table dec-table'
          :data="tableList"
          border highlight-current-row size="mini"
          @selection-change="selectionChange"
          :max-height='300'>
          <el-table-column type="selection" align='center' min-width="50"></el-table-column>
          <el-table-column label="序号" type='index' align='left' width="50"></el-table-column>
          <el-table-column label="文件名称" align='left' prop="edocCode" min-width="130"></el-table-column>
          <el-table-column label="文件类型" align='left' min-width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.code" style="width:100%" size="mini"
                filterable remote clearable
                @change = 'decCodeChange'
                default-first-option>
                <el-option
                  v-for="item in docType"
                  :key="item.codeField"
                  :showLabel="showCustomsCode? '' : item.nameField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="文件大小" align='left' prop="edocSize" min-width="130"></el-table-column>
          <el-table-column label="备注" align='left' prop='note' min-width="100"></el-table-column>
        </el-table>
      </el-row>
      <el-row class="mg-t-20">
        <el-col :span="24" align="center">
          <button class='upload-btn' @click="confirmForm">确定</button>
          <button class='dialog-btn' @click="closeMixUpload">取消</button>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  name: 'mix-upload',
  props: {
    mixUploadVisible: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    decPid: {
      type: String,
      default: ''
    },
    openPath: {
      type: String,
      default: ''
    },
    fileNum: 0,
    pageType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableList: [], // 批量上传文件
      docType: [],
      selecTable: []
    }
  },
  created () {
    this.getCommonParams(['SAAS_EDOC_CODE'])
    this.tableList = util.simpleClone(this.fileList)
    this.fileNum = this.fileList.length
  },
  mounted () {
  },
  methods: {
    getCommonParams (par) {
      this.$post({
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          this.docType = JSON.parse(window.localStorage.getItem('SAAS_EDOC_CODE'))
        },
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {
          this.docType = JSON.parse(window.localStorage.getItem('SAAS_EDOC_CODE'))
        }
      })
    },
    decCodeChange (value) {
      console.log(value)
    },
    selectionChange (val) {
      this.selecTable = val
    },
    confirmForm () {
      // 1.判断勾选的数据 有没有选择文件类型和文件类型有没有重复
      let setMap = []
      // 先统一置成
      for (let n in this.tableList) {
        this.tableList[n].flag = '2'
      }
      if (this.selecTable.length > 0) {
        for (let i in this.selecTable) {
          if (!this.selecTable[i].code) {
            this.messageTips('选中的数据必需选择文件类型！', 'error')
            return
          } else {
            setMap[this.selecTable[i].code] = true
          }
        }
        if (Object.keys(setMap).length !== this.selecTable.length) {
          this.messageTips('选中的数据文件类型不能重复！', 'error')
          return
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/uploadFileMixtureConfirm',
        data: this.tableList,
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.tableList = []
          this.selecTable = []
          this.$emit('close:mixUpload', false)
          if (this.pageType === 'license') {
            this.$parent.refreshList()
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    closeMixUpload () {
      this.tableList = []
      this.selecTable = []
      this.$emit('update:mixUploadVisible', false)
    }
  }
}
</script>
<style lang="less" scoped>
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
</style>
