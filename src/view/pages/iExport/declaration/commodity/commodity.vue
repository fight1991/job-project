<template>
  <!--商品资料库-->
  <section class="query-main commodity-main">
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.six" :model="QueryDecForm" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col  :md="12" :lg="6">
            <el-form-item label="进出口标志" >
              <el-select v-model="QueryDecForm.iEFlag" clearable filterable>
                <el-option value="E" label="出口" key="E"></el-option>
                <el-option value="I" label="进口" key="I"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col  :md="12" :lg="6">
            <el-form-item label="境内收发货人">
              <el-autocomplete
                :maxlength="70"
                placeholder="企业名称,输入两位字符开始匹配"
                size='mini'
                v-model="QueryDecForm.tradeName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                :highlight-first-item='true'
                >
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="消费使用/生产销售单位" class='more-txt-lh'>
              <el-autocomplete
                :maxlength="70"
                placeholder="企业名称"
                size='mini'
                v-model="QueryDecForm.ownerName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                :highlight-first-item='true'
                >
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col  :md="12" :lg="6">
            <el-form-item label="商品名称">
              <el-input v-model="QueryDecForm.gName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col  :md="12" :lg="6">
            <el-form-item label="商品编号" >
              <el-input v-model="QueryDecForm.codeTs"></el-input>
            </el-form-item>
          </el-col>
          <el-col  :md="12" :lg="6">
            <el-form-item label="规格型号" >
              <el-input v-model="QueryDecForm.gModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryList">查询</el-button>
            <el-button size="mini" @click="restFun">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
       <el-row class="op-btn">
        <el-dropdown trigger="click">
          <el-button size="mini" class="file-inputx list-btns list-icon-import"><i></i>导入</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-upload
                class="upload-demo"
                action="http://127.0.0.1"
                :before-upload="beforeUploadFun"
                :show-file-list="false">
                <span>选择文件导入</span>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item><div @click.stop="template">导入模板下载</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-delete" @click="deleteFun"><i></i>删除</el-button>
        <el-dropdown @command="synchrodata">
          <el-button size="mini" class="list-btns list-icon-sync"><i></i>同步历史数据</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="syncDecData">同步数据</el-dropdown-item>
            <el-dropdown-item command="syncRecord">同步记录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-export" @click="exportList" ><i></i>导出</el-button>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table' :data="resultList"
        height="408px"
        border highlight-current-row size="mini" @selection-change="selectFun">
        <el-table-column  type="selection" align='center' min-width="50"></el-table-column>
        <el-table-column label="进出口标志" align='center' min-width="60">
          <template slot-scope="scope">
            {{scope.row.iEFlagValue}}
          </template>
        </el-table-column>
        <el-table-column label="境内收发货人" align='left' prop="tradeName" min-width="150"></el-table-column>
        <el-table-column label="消费使用/生产销售单位" align='left' prop="ownerName" min-width="120"></el-table-column>
        <el-table-column label="商品编号" align='center' prop="codeTs" min-width="100"></el-table-column>
        <el-table-column label="商品名称" align='left' prop="gName" min-width="120"></el-table-column>
        <el-table-column label="规格型号" align='left' prop="gModel" min-width="200"></el-table-column>
        <el-table-column label="原产国" align='left' prop="originCountryValue" min-width="100"></el-table-column>
        <el-table-column label="关联报关单数" align='right' min-width="80">
          <template slot-scope="scope">
            <a href="javascript:void(0)" style="color: #287fca" title="查看关联报关单" @click="checkRltDec(scope.row)">{{scope.row.count}}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' width="80" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" class="table-icon list-icon-edit" title="编辑"   @click="gotoDetail('edit', scope.row.decListPid)"><i></i></el-button>
            <el-button type="text" class="table-icon list-icon-look" title="查看" @click="gotoDetail('view', scope.row.decListPid)"><i></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <commodity-detail :typeValue="typeValue" :detailVisible.sync="detailVisible" :id="id" @closedecele="cancleElement"></commodity-detail>
    <!-- 弹出框 同步历史数据 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="同步历史数据"
      :visible.sync="historyVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-loading="$store.state.loading"
      class="commodity-el-dialog__mini"
      width="500px">
      <sync-condition :initParams="historyParam" @submitdatas="backHistory" @closedecele="cancleHistory" v-if="historyVisible"></sync-condition>
    </el-dialog>
    <!-- 弹出框 同步历史数据 结束 -->
    <!-- 弹出框 同步记录 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="同步记录"
      :visible.sync="syncDecRcordVisable"
      :close-on-click-modal='false'
      v-dialogDrag
      v-loading="$store.state.loading"
      width="800px">
      <syncdec-record :initParams='type' @cancLeData="syncDecRcordCompnent"  v-if="syncDecRcordVisable"></syncdec-record>
    </el-dialog>
    <!-- 弹出框 同步记录 结束 -->
    <!-- 弹出框 关联报关单 开始 -->
    <el-dialog :modal-append-to-body='false'
      :title="dialogTitle"
      :visible.sync="rltDecVisible"
      :close-on-click-modal="false"
      v-dialogDrag
      v-loading="$store.state.loading"
      width="800px">
      <rltdec-record :selectedRow="selectedRow" v-if="rltDecVisible"></rltdec-record>
    </el-dialog>
    <!-- 弹出框 关联报关单 结束 -->
  </section>
</template>

<script>
import util from '@/common/util'
import commodityDetail from './commodityDetail.vue'
import syncCondition from '../component/syncCondition.vue'
import syncdecRecord from '../component/syncDecRcord.vue'
import rltdecRecord from '../component/rltdecRecord.vue'
import rightsUtil from '@/common/rightsUtil'

export default {
  components: {
    commodityDetail,
    syncCondition,
    syncdecRecord,
    rltdecRecord
  },
  name: 'decQueryTable',
  data () {
    return {
      QueryDecForm: {
        tradeName: '',
        gName: '',
        ownerName: '',
        codeTs: '',
        gModel: '',
        iEFlag: 'I',
        ciqCode: ''
      },
      dialogTitle: '关联报关单',
      detailVisible: false,
      id: null,
      typeValue: '',
      selectList: [], // 勾选数据
      innerNoList: [], // 勾选数据主键
      fileList: [],
      resultList: [], // 列表数据
      paramsOptions: {}, // 字典数据
      selectedRow: {}, // 点击查看关联报关单
      historyParam: '', // 初始化历史数据组件
      historyVisible: false, // 历史数据同步组件控制
      type: 'goods',
      syncDecRcordVisable: false,
      rltDecVisible: false
    }
  },
  created () {
    this.getCommonParams()
  },
  mounted () {
    this.queryList()
  },
  methods: {
    // 获取公共字典list
    getCommonParams () {
      let par = [
        'SAAS_TRANSPORT_TYPE' // 运输方式
      ]
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getParam',
        useStorage: true,
        storageKey: par,
        hasStorageCallback: () => {
          this.paramsOptions = {
            'SAAS_TRANSPORT_TYPE': JSON.parse(window.localStorage.getItem('SAAS_TRANSPORT_TYPE')) // 单位
          }
        },
        data: {
          'tableNames': par
        },
        success: (res) => {
          this.paramsOptions = {
            'SAAS_TRANSPORT_TYPE': JSON.parse(window.localStorage.getItem('SAAS_TRANSPORT_TYPE')) // 单位
          }
        }
      })
    },
    // 新增/详情
    gotoDetail (type, value) {
      this.detailVisible = true
      this.typeValue = type
      this.id = value
    },
    queryList () {
      this.pageList(this.$store.state.pagination)
    },
    // 列表查询
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/dec/decListHis/queryList',
        data: {
          ...this.QueryDecForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.resultList = res.result
        }
      })
    },
    // 重置
    restFun () {
      this.QueryDecForm = {
        tradeName: '',
        gName: '',
        ownerName: '',
        codeTs: '',
        gModel: '',
        iEFlag: 'I'
      }
      this.queryList()
    },
    selectFun (row) {
      this.innerNoList = []
      this.selectList = []
      this.selectList = row
      for (let i in row) {
        this.innerNoList.push(row[i].decListPid)
      }
    },
    // 商品信息弹窗关闭
    cancleElement () {
      this.detailVisible = false
      this.queryList() // 重新刷新
    },
    // 数据同步
    backHistory () {
      this.messageTips('任务已受理', 'success')
      this.queryList()
      this.historyVisible = false
    },
    // 数据同步取消
    cancleHistory () {
      this.historyVisible = false
    },
    // 删除
    deleteFun () {
      if (this.innerNoList.length === 0) {
        this.messageTips('请选择需要删除的数据', 'error')
      } else {
        this.$confirm('确认删除吗？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post({
            url: 'API@/dec-common/dec/decListHis/delDecHis',
            data: {ids: this.innerNoList},
            success: (res) => {
              this.messageTips('删除成功', 'success')
              this.pageList()
            }
          })
        }).catch(() => {
        })
      }
    },
    // 导出
    exportList () {
      rightsUtil.checkRights(() => {
      // 列表导出
        let len = this.selectList.length
        if (len === 0) {
          this.messageTips('请选择需要导出的数据！')
          return false
        } else {
          let data = {}
          data = this.selectList
          this.$post({
            url: 'API@/dec-common/dec/decListHis/exportDecListHis',
            data: data,
            success: (res) => {
              res.result && window.open(res.result, '_blank')
            }
          })
        }
      })
    },
    // 批量同步单一窗口报关单数据
    synchrodata (value) {
      if (value === 'syncDecData') {
        this.syncHistoryData()
      } else {
        this.syncDecRcordVisable = true
      }
    },
    syncDecRcordCompnent () {
      this.syncDecRcordVisable = false
    },
    // 同步历史数据
    syncHistoryData () {
      this.historyParam = '2'
      this.historyVisible = true
    },
    // 导入
    beforeUploadFun (file) {
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
      if (!((computFileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (computFileType === ''))) {
        this.messageTips('上传文件只支持xlsx格式', 'error')
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 10240)) {
        this.messageTips('上传文件大小不能超过10MB', 'error')
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
            this.importDecHisData(res.result.url)
          }
        })
      }
      return false
    },
    // 导入商品数据excel
    importDecHisData (url) {
      this.$post({
        url: 'API@/dec-common/dec/decListHis/importDecHisData',
        data: {httpUrl: url},
        success: (res) => {
          this.messageTips('导入成功', 'success')
          this.queryList()
        }
      })
    },
    template () {
      window.open('https://www.5itrade.cn/files/decTemplet/productInformation.xlsx')
    },
    querySearch (queryString, cb) {
      if (queryString.length < 2) {
        let back = []
        cb(back)
        return
      }
      let param = {
        'corpName': queryString,
        'returnProps': ['corpName']
      }
      this.$post({
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: param,
        success: (res) => {
          if (res.success) {
            let json = JSON.stringify(res.result)
            json = json.replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          }
        }
      })
    },
    checkRltDec (value) {
      if (value.declTrnrel === '0') {
        this.dialogTitle = '关联报关单'
      } else if (value.declTrnrel === '2') {
        this.dialogTitle = '关联备案清单'
      }
      this.rltDecVisible = true
      this.selectedRow = value
    }
  }
}
</script>

<style scoped lang="less">
  .query-main {
    // background-color: #f5f5f5;
    padding: 20px;
    font-size:12px;
    font-family: Arial,Microsoft YaHei,SimSun;
    height: calc(100% - 40px);
    overflow: auto;
  }
  .query-condition {
    background-color: #fff;
    padding: 20px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .op-btn {
    margin-bottom: 14px;
  }
  .query-btn {
    text-align: center;
  }
  .icon-btn {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: sub;
    margin-right: 5px;
  }
  .m-r-10{
    margin-right: 10px;
  }
  .span-right{
    float: right;
    margin-right: 5%;
    color: #0b93f3;
    margin-top: 6px;
  }
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
  }
  .button-primary{
    margin-left: 24px;
    line-height: 24px;
    font-size: 14px;
    height: 28px;
    border-radius: 4px;
    background-color: #096AC6;
    border: 0px;
    color: #fff;
    padding: 0px 12px;
  }
</style>
