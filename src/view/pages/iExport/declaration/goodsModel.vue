<template>
<!-- 保税商品库 -->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <el-form :label-width="labelFormWidth.four" :model="queryDecForm" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="备案号">
              <el-input
                size="mini"
                :maxlength="12"
                @keyup.native="manualNoKeyUp('1')"
                v-model="queryDecForm.manualNo">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="商品名称">
              <el-input v-model="queryDecForm.gName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="商品编号" >
              <el-input v-model="queryDecForm.codeTs"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="规格型号" >
              <el-input v-model="queryDecForm.gModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="query">查询</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table  dec-query-table'>
      <!-- 操作 -->
       <el-row class="op-btn">
         <el-dropdown trigger="click">
          <el-button size="mini" class="file-inputx list-btns list-icon-import"><i></i>导入</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item >
              <el-upload
                class="upload-demo"
                action="http://127.0.0.1"
                :before-upload="beforeUploadFun"
                :show-file-list="false">
                <span>选择文件导入</span>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item><div @click.stop="templateDownd">导入模板下载</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-add" @click="openAddPage"><i></i>新增</el-button>
        <el-button size="mini" class="list-btns list-icon-edit" @click="openEditPage"><i></i>编辑</el-button>
        <el-button size="mini" class="list-btns list-icon-delete" @click="deleteInfo"><i></i>删除</el-button>
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
      <el-table class='sys-table-table  dec-table' :data="goodsModelList"
         @selection-change="goodsModelListChange"
         border highlight-current-row size="mini"  height="400">
        <el-table-column type="selection" align='center' width="37"></el-table-column>
        <el-table-column label="备案号" align='center' prop="manualNo" min-width="80"></el-table-column>
        <el-table-column label="备案序号" align='left' prop="contrItem" min-width="50"></el-table-column>
        <el-table-column label="料件/成品标志" align='center' prop="mtpckEndprdTypecdValue" min-width="80"></el-table-column>
        <el-table-column label="商品名称" align='left' prop="gName" min-width="100"></el-table-column>
        <el-table-column label="商品编码" align='center' prop="codeTs" min-width="100"></el-table-column>
        <el-table-column label="规格型号" align='left' prop="gModel" min-width="250"></el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <el-dialog :modal-append-to-body='false'
      title="保税商品库"
      :visible.sync="goodsModelVisible"
      :before-close='beforeClose'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-loading="$store.state.loading"
      class='sys-bonded'
      width="800px">
      <el-row class="pd-lr-20">
      <el-form ref='goodsModelForm' :label-width="labelFormWidth.six" size="mini" :rules="rules"
        @keyup.enter.native="switchFoucsByEnter"
       label-position="right" :model="goodsModelForm" >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="备案号" prop='manualNo'>
                <el-input v-model="goodsModelForm.manualNo"
                  @keyup.native="manualNoKeyUp('2')"
                 :maxlength="12" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备案序号" prop='contrItem'>
                <el-input v-model="goodsModelForm.contrItem" :maxlength="5"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="料件/成品标志" prop='mtpckEndprdTypecd' class="more-txt-lh">
                <el-select placeholder=" " v-model="goodsModelForm.mtpckEndprdTypecd"
                  clearable filterable
                  ref = 'mtpckEndprdTypecd'
                  dataRef = 'mtpckEndprdTypecd'
                  style="width:100%" >
                  <el-option
                    v-for="item in productType"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="商品名称">
              <el-input v-model="goodsModelForm.gName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码" >
              <el-input v-model="goodsModelForm.codeTs" :maxlength="10" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交计量单位" >
              <el-select placeholder=" " v-model="goodsModelForm.gUnit"
                filterable remote ref='gUnit' dataRef='gUnit'
                 @focus="tipsFillMessage('gUnit', 'saasUnit','SAAS_UNIT')"
                :remote-method="checkParamsList"
                @clear="clearSelct('saasUnit')"
                style="width:100%;" disabled>
                <el-option
                  v-for="item in saasUnit"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="规格型号" prop='gModel'>
              <el-input v-model="goodsModelForm.gModel" :maxlength="200" readonly>
                <el-button slot="append" title="重新归类" icon="fa fa-ellipsis-h" @click="openElement" class="btn-pop input-btn"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="币制" >
              <el-select placeholder=" " v-model="goodsModelForm.tradeCurr"
                  filterable remote clearable ref = 'tradeCurr' dataRef = 'tradeCurr'
                  @focus="tipsFillMessage('tradeCurr', 'saasCurr','SAAS_CURR')"
                  :remote-method="checkParamsList"
                  default-first-option
                  @clear="clearSelct('saasCurr')"
                  style="width:100%" >
                <el-option
                  v-for="item in saasCurr"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原产国">
              <el-select placeholder=" " v-model="goodsModelForm.originCountry"
                filterable remote clearable ref = 'originCountry' dataRef = 'originCountry'
                @focus="tipsFillMessage('originCountry', 'saasCountry','SAAS_COUNTRY')"
                :remote-method="checkParamsList"
                @clear="clearSelct('saasCountry')"
                default-first-option
                style="width:100%">
                <el-option
                  v-for="item in saasCountry"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </el-row>
      <el-row style="margin-top:20px;" class="query-btn">
        <el-col :span="24" align="center">
          <el-button type="primary" size="mini" @click="savegoodsModel" >确定</el-button>
          <el-button size="mini" @click="canclegoodsModel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 弹出框 商品规范申报-商品申报要素 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="商品规范申报-商品申报要素"
      :visible.sync="elementVisible"
       class="sys-dec-class"
      width="640px">
      <decelement-view :datas="decElementPara" @submitdatas="backDecListSpace" @closedecele="cancleElement" v-if="elementVisible"></decelement-view>
    </el-dialog>
    <!-- 弹出框 商品规范申报-商品申报要素 结束 -->
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
      class="commodity-el-dialog__mini"
      width="800px">
      <syncdec-record :initParams='type' @cancLeData="syncDecRcordCompnent"  v-if="syncDecRcordVisable"></syncdec-record>
    </el-dialog>
    <!-- 弹出框 同步记录 结束 -->
  </section>
</template>

<script>
import util from '@/common/util'
import execlImport from './component/execImport.vue'
import syncCondition from './component/syncCondition.vue'
import decelementView from './component/decelement.vue'
import syncdecRecord from './component/syncDecRcord.vue'
import rightsUtil from '@/common/rightsUtil'

export default {
  name: 'goodsModel',
  components: {
    execlImport,
    syncCondition,
    decelementView,
    syncdecRecord
  },
  data () {
    return {
      queryDecForm: {
        manualNo: '', // 备案号
        gName: '', // 商品名称
        codeTs: '', // 商品编码
        gModel: ''
      },
      goodsModelList: [], // table表加载数据
      productType: [{codeField: '3', nameField: '料件'}, {codeField: '4', nameField: '成品'}], // 出口成品/进口料件代码
      checkedData: [], // 选中得数据
      goodsModelVisible: false, // 控制新增编辑时的弹出框
      elementVisible: false, // 申报要素
      decElementPara: {}, // 申报要素初始化数据
      historyParam: '', // 初始化历史数据组件
      historyVisible: false, // 历史数据同步组件控制
      saasCountry: [], // 原产地国参数表
      saasCurr: [], // 币制参数表
      saasUnit: [], // 成交计量参数表
      selectObj: {
        obj: '',
        params: ''
      },
      goodsModelForm: {
        pid: '', // 主键
        mtpckEndprdTypecd: '', // 料件/成品标志
        manualNo: '', // 备案号
        contrItem: '', // 备案序号
        gModel: '', // 规格型号
        codeTs: '', // 10位商品编码
        gName: '', // 商品名称
        gUnit: '', // 成交计量单位
        tradeCurr: '', // 币制
        originCountry: '' // 原产国
      },
      rules: {
        manualNo: [
          { required: true, message: '请输入备案号', trigger: 'blur' },
          { validator: this.validateManualNo, trigger: 'blur' }
        ],
        contrItem: [
          { required: true, message: '请输入备案序号', trigger: 'blur' },
          { validator: this.validateContrItem, trigger: 'blur' }
        ],
        mtpckEndprdTypecd: [
          { required: true, message: '请选择料件/成品标志', trigger: 'blur' }
        ],
        gModel: [
          { required: true, message: '规格型号需要有值', trigger: 'blur' }
        ]
      },
      syncDecRcordVisable: false,
      type: 'bond'
    }
  },
  created () {
    // 获取公共参数
    this.getCommonParams()
  },
  mounted () {
    // 初始化列表
    this.pageList()
  },
  methods: {
    // 获取公共字典list
    getCommonParams () {
      let par = ['SAAS_UNIT', 'SAAS_CURR', 'SAAS_COUNTRY']
      this.$post({
        useStorage: true,
        storageKey: par,
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': par
        },
        success: (res) => {
        }
      })
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
            this.importDecHisData(res.result.url)
          }
        })
      }
      return false
    },
    // 导入保税商品库
    importDecHisData (url) {
      this.$post({
        url: 'API@/dec-common/decParam/common/importBondedGoodsList',
        data: {
          httpUrl: url,
          type: 'GD'
        },
        success: (res) => {
          this.messageTips('导入成功', 'success')
          this.pageList()
        }
      })
    },
    templateDownd () {
      window.open('https://www.5itrade.cn/files/decTemplet/BondedCommodityStore.xlsx')
    },
    reset () {
      this.queryDecForm = {
        manualNo: '', // 备案号
        gName: '', // 商品名称
        codeTs: '', // 商品编码
        gModel: '' // 商品编码
      }
    },
    // 打开新增页面
    openAddPage () {
      this.goodsModelVisible = true
    },
    validateManualNo (rule, value, callback) {
      if (!/^[A-Za-z0-9]{12}$|^$/.test(value)) {
        callback(new Error('请输入12位字母加数字'))
      } else {
        callback()
      }
    },
    validateContrItem (rule, value, callback) {
      if (!/^[0-9]{0,5}$/.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    },
    manualNoKeyUp (value) {
      if (value === '1') {
        this.queryDecForm.manualNo = this.queryDecForm.manualNo.toUpperCase()
      } else if (value === '2') {
        this.goodsModelForm.manualNo = this.goodsModelForm.manualNo.toUpperCase()
      }
    },
    beforeClose () {
      this.resetgoodsModelForm()
      this.$refs['goodsModelForm'].resetFields()
      this.goodsModelVisible = false
    },
    // 打开编辑页面
    openEditPage () {
      if (this.checkedData.length !== 1) {
        this.messageTips('选择一条需要编辑的数据')
        return false
      }
      this.goodsModelForm = util.simpleClone(this.checkedData[0])
      // 初始化下拉框
      this.initSelectParam()
      this.goodsModelVisible = true
    },
    // 删除 操作
    deleteInfo () {
      if (this.checkedData.length === 0) {
        this.messageTips('请选择需要删除的数据')
        return false
      }
      let pidList = []
      for (let i in this.checkedData) {
        pidList.push(this.checkedData[i].pid)
      }
      this.$confirm('确定删除选中数据？', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: 'API@/dec-common/decParam/common/delDecGoodsHisList',
          data: {
            'list': pidList
          },
          success: (res) => {
            this.messageTips(res.message, 'success')
            this.pageList()
          }
        })
      }).catch(() => {
      })
    },
    // 导出
    exportList () {
      rightsUtil.checkRights(() => {
        // 列表导出
        let len = this.checkedData.length
        if (len === 0) {
          this.messageTips('请选择需要导出的数据！')
          return false
        } else {
          let data = {}
          data = this.checkedData
          this.$post({
            url: 'API@/dec-common/dec/decListHis/exportBondListHis',
            data: data,
            success: (res) => {
              window.open(res.result, '_blank')
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
      this.historyParam = '1'
      this.historyVisible = true
    },
    // 接收申报要素回来的参数
    backDecListSpace (para) {
      this.goodsModelForm.gModel = para.specModel
      this.elementVisible = false
    },
    // 取消申报要素
    cancleElement () {
      this.elementVisible = false
    },
    // 数据同步
    backHistory () {
      this.pageList()
      this.historyVisible = false
    },
    // 数据同步取消
    cancleHistory () {
      this.historyVisible = false
    },
    goodsModelListChange (value) {
      this.checkedData = value
    },
    // 商品资料库
    query () {
      if (!/^[A-Za-z0-9]{0,12}$/.test(this.manualNo)) {
        this.messageTips('请正确填写备案号')
        return
      }
      this.pageList(this.$store.state.pagination)
    },
    // 分页列表
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/decParam/common/getBondedGoodsHisList',
        data: {
          ...this.queryDecForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.goodsModelList = res.result
        }
      })
    },
    // 查询gModel
    queryGModel () {
      // 判断是否能打开申报要素
      let filedArr = ['contrItem', 'manualNo', 'mtpckEndprdTypecd']
      if (this.goodsModelForm.manualNo.length !== 12) {
        return
      }
      for (let i in filedArr) {
        if (util.isEmpty(this.goodsModelForm[filedArr[i]])) {
          return
        }
      }
      this.$post({
        url: 'API@/dec-common/decParam/common/getBondedGoodsDetail',
        data: {
          'contrItem': this.goodsModelForm.contrItem,
          'manualNo': this.goodsModelForm.manualNo,
          'mtpckEndprdTypecd': this.goodsModelForm.mtpckEndprdTypecd
        },
        success: (res) => {
          if (res.result.length > 0) { // 有数据时候
            let data = res.result[0]
            this.goodsModelForm.codeTs = data.codeTs
            this.goodsModelForm.gModel = data.gModel
            this.goodsModelForm.gName = data.gName
            this.goodsModelForm.gUnit = data.gUnit
            this.goodsModelForm.tradeCurr = data.tradeCurr
            this.goodsModelForm.originCountry = data.originCountry
            this.initSelectParam()
          } else { // 没有数据的时候
            this.goodsModelForm.codeTs = ''
            this.goodsModelForm.gModel = ''
          }
        }
      })
    },
    // 初始化下拉框的置
    initSelectParam () {
      if (util.isEmpty(this.goodsModelForm.tradeCurr)) {
        this.saasCurr = []
      } else {
        this.selectObj = {
          obj: 'saasCurr',
          params: 'SAAS_CURR'
        }
        this.checkParamsList(this.goodsModelForm.tradeCurr)
      }
      if (util.isEmpty(this.goodsModelForm.originCountry)) {
        this.saasCountry = []
      } else {
        this.selectObj = {
          obj: 'saasCountry',
          params: 'SAAS_COUNTRY'
        }
        this.checkParamsList(this.goodsModelForm.originCountry)
      }
      if (util.isEmpty(this.goodsModelForm.gUnit)) {
        this.saasUnit = []
      } else {
        this.selectObj = {
          obj: 'saasUnit',
          params: 'SAAS_UNIT'
        }
        this.checkParamsList(this.goodsModelForm.gUnit)
      }
    },
    // 查询商品信息
    getGoodsInfo () {
      // 查询商品列表参数
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          'codeTs': this.goodsModelForm.codeTs,
          'iEFlag': this.goodsModelForm.mtpckEndprdTypecd === '3' ? 'I' : 'E'
        },
        success: (res) => {
          let productList = res.result
          if (productList === null || productList === undefined || productList.length === 0) {
          } else {
            this.decElementPara = {
              checkedgoods: res.result[0], // 加载数据
              opeType: 'edit', // 操作类型 add 新增  edit 编辑  look 查看
              gModel: this.goodsModelForm.gModel, // 规格型号
              iEFlag: this.goodsModelForm.mtpckEndprdTypecd === '3' ? 'I' : 'E' // 进出口标志
            }
            this.elementVisible = true
          }
        }
      })
    },
    // 打开申报要素重新归类
    openElement () {
      if (util.isEmpty(this.goodsModelForm.gModel)) {
        this.messageTips('需要填写规格型号')
        return
      }
      this.getGoodsInfo()
    },
    // 保存
    savegoodsModel () {
      this.$refs['goodsModelForm'].validate((valid) => {
        if (valid) {
          if (this.goodsModelForm.pid === '') { // 新增
            this.addGoodsModel()
          } else { // 编辑
            this.editGoodsModel()
          }
        }
      })
    },
    // 新增
    addGoodsModel () {
      this.goodsModelForm['isForceCover'] = '0'
      this.$post({
        url: 'API@/dec-common/decParam/common/saveDecGoodsHis',
        data: this.goodsModelForm, // 0 新增保存 1 覆盖新增保存
        success: (res) => {
          if (res.result.isForceCover === '0') { //  0 保存成功  1 数据已经存在
            this.messageTips(res.message, 'success')
            this.resetgoodsModelForm()
            this.$refs['goodsModelForm'].resetFields()
            this.goodsModelVisible = false
            this.pageList()
          } else {
            this.$confirm('此数据已经存在,是否覆盖', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }).then(() => {
              this.goodsModelForm['isForceCover'] = '1'
              this.$post({
                url: 'API@/dec-common/decParam/common/saveDecGoodsHis',
                data: this.goodsModelForm,
                success: (res) => {
                  this.messageTips(res.message, 'success')
                  this.resetgoodsModelForm()
                  this.$refs['goodsModelForm'].resetFields()
                  this.goodsModelVisible = false
                  this.pageList()
                }
              })
            }).catch(() => {
            })
          }
        }
      })
    },
    // 编辑
    editGoodsModel () {
      this.$post({
        url: 'API@/dec-common/decParam/common/saveDecGoodsHis',
        data: this.goodsModelForm,
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.resetgoodsModelForm()
          this.$refs['goodsModelForm'].resetFields()
          this.goodsModelVisible = false
          this.pageList()
        }
      })
    },
    // 却下拉框聚焦
    tipsFillMessage (value, obj, params) {
      // 如果时下拉框 则设置当前下拉框的默认参数
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      e.target.blur()
      // 获取当前焦点所在的 form表单
      let form = e.target.form
      // 获取form表单下的所有 input  并把为数组转化为真数组
      let focusable = Array.from(form.querySelectorAll('input'))
      let newFocusable = []
      // 过滤掉 被disable 修饰的 和 被readonly修饰但不含有placeholder的input
      newFocusable = focusable.filter(v => {
        return (!v.readOnly || v.placeholder) && !v.disabled
      })
      // 计算现在焦点在什么位置
      let index = newFocusable.findIndex((v, i) => {
        return e.target === v
      })
      // 下一个元素
      let next = newFocusable[parseInt(index) + 1]
      // 下下一个元素
      // let secondNext = newFocusable[parseInt(index) + 2]
      // 上一个元素
      let prev = newFocusable[parseInt(index) - 1]
      if (e.shiftKey) { // shift+enter 光标向上个元素移动
        if (prev) {
          if (e.target.attributes.shiftEnter && e.target.attributes.shiftEnter.nodeValue === 'no') {
            return false
          } else {
            if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            }
            prev.focus()
          }
        }
      } else if (e.ctrlKey && e.target.localName === 'textarea') { // Ctrl+enter 在textaera中换行
        let myValue = '\n'
        let t = e.target
        if (document.selection) { // ie<9
          t.focus()
          let sel = document.selection.createRange()
          sel.text = myValue
          t.focus()
          sel.moveStart('character', -1)
        } else if (t.selectionStart || t.selectionStart === '0') { // 现代浏览器
          let startPos = t.selectionStart
          let endPos = t.selectionEnd
          let scrollTop = t.scrollTop
          t.value = t.value.substring(0, startPos) + myValue + t.value.substring(endPos, t.value.length)
          t.focus()
          // 因为myValue回车显示为\n
          t.selectionStart = startPos + myValue.length
          t.selectionEnd = startPos + myValue.length
          t.scrollTop = scrollTop
        } else {
          t.value += myValue
          t.focus()
        }
      } else {
        if (e.target.localName === 'textarea') { // enter 光标向下个元素移动
          e.preventDefault()
          e.stopPropagation()
        }
        // 下个元素存在
        if (next) {
          if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
            return false
          } else {
            let ref
            if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            } else {
              if (!util.isEmpty(e.target.attributes.dataRef)) {
                ref = e.target.attributes.dataRef.nodeValue
              }
            }
            if (ref === 'mtpckEndprdTypecd') {
              this.queryGModel()
            } else {
              next.focus()
              next.select()
            }
          }
        }
      }
    },
    canclegoodsModel () {
      this.resetgoodsModelForm()
      this.$refs['goodsModelForm'].resetFields()
      this.goodsModelVisible = false
    },
    resetgoodsModelForm () {
      this.goodsModelForm = {
        pid: '', // 主键
        mtpckEndprdTypecd: '', // 料件/成品标志
        manualNo: '', // 备案号
        contrItem: '', // 备案序号
        gModel: '', // 规格型号
        codeTs: '' // 10位商品编码
      }
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      this[selecType] = []
    },
    // 远程搜索
    checkParamsList (query) {
      this[this.selectObj.obj] = []
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      if (util.isEmpty(keyValue)) {
        this.$nextTick(() => {
          this[this.selectObj.obj] = list.slice(0, 10)
        })
      } else {
        let filterList = []
        let filterList2 = [] //
        filterList = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().startsWith(keyValue.toLowerCase())
        })
        filterList2 = list.filter(item => {
          let str = item.codeField + '-' + item.nameField
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        // 去重
        filterList.push(...filterList2)
        filterList = this.unique(filterList)
        this[this.selectObj.obj] = filterList.slice(0, 10)
      }
    },
    // 去重
    unique (arr) {
      let x = new Set(arr)
      return [...x]
    }
  }
}
</script>

<style scoped lang="less">
  .query-main {
    padding: 20px;
    font-size:12px;
    font-family: Arial,Microsoft YaHei,SimSun;
    height: 100%;
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
  .layer-btn-primary {
    width:70px;
    height: 30px;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;
    text-decoration: none;
    background-color: #287fca;
    color: #fff;
    border:none;
  }
   .layer-btn {
    width:70px;
    height: 30px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    color: #333333;
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
  .query-btn {
    text-align: center;
  }
  .el-col{
    padding-left: 25px;
    padding-right: 25px;
  }
</style>
