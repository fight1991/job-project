<template>
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.four" :model="QueryDecForm" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="接单编号">
              <el-input v-model="QueryDecForm.innerNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="提运单号">
              <el-input v-model="QueryDecForm.billNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="委托客户">
              <el-input v-model="QueryDecForm.company" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="件数" >
              <el-input v-model="QueryDecForm.packNo" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="运输方式" >
               <el-select size="mini" filterable v-model="QueryDecForm.trafMode" clearable>
                  <el-option
                    v-for="item in paramsOptions['SAAS_TRANSPORT_TYPE']"
                    :key="item.codeField"
                    :label="item.codeField+'-'+item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="系统状态" >
               <el-select size="mini" filterable v-model="QueryDecForm.status" clearable>
                  <el-option
                    v-for="item in statusList"
                    :key="item.value+'status'"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="接单日期">
              <el-date-picker title='进出口日期' v-model="dates" style="width:100%"
                type="daterange" clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="创建人" >
               <el-select size="mini" filterable v-model="QueryDecForm.createUser" clearable>
                  <el-option
                    v-for="item in postPersonList"
                    :key="item.codeField+'person'"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="接单类型" >
              <el-select size="mini" filterable v-model="QueryDecForm.type" clearable>
                <el-option
                  v-for="item in typeList"
                  :key="item.value+'person'"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="流水号">
              <el-input v-model="QueryDecForm.ocrNo" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" style="padding: 8px 20px;" @click="queryList">查询</el-button>
            <el-button size="mini" style="padding: 8px 20px;" @click="restFun">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
      <el-row class="op-btn">
        <el-dropdown @command="handleCommand">
          <el-button size="mini" class="list-btns list-icon-import"><i></i>导入</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="importExcel">导入Excel文件</el-dropdown-item>
            <el-dropdown-item>
              <el-upload
                class="upload-demo"
                action="http://127.0.0.1"
                :before-upload="beforeUploadPDF"
                accept="application/pdf"
                :show-file-list="false">
                <span>解析PDF文件</span>
              </el-upload>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-add" @click="gotoDetail('add','add')"><i></i>新增</el-button>
        <el-button size="mini" class="list-btns list-icon-copy" @click="copeFun"><i></i>复制</el-button>
        <el-button size="mini" class="list-btns list-icon-delete" @click="deleteFun"><i></i>删除</el-button>
        <el-button size="mini" class="list-btns list-icon-listExport" @click="exportFun"><i></i>导出</el-button>
        <el-dropdown @command="OCRupLoad">
          <el-button size="mini" class="list-btns list-icon-AI"><i></i>智能制单</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="upload">上传文件</el-dropdown-item>
            <el-dropdown-item command="record">识别记录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" type="primary" class="list-btns special-btn" @click="toAI">AI制单</el-button>
        <div style="float:right;">
          <el-button size="mini" v-if="iEFlag == 'import'" class="list-btns list-icon-declare" v-permissions="'CCBA20202010100'"  @click="orderTakenToDec"><i></i>提交</el-button>
          <el-button size="mini" v-if="iEFlag == 'export'" class="list-btns list-icon-declare" v-permissions="'CCBA20202020100'"  @click="orderTakenToDec"><i></i>提交</el-button>
          <el-button size="mini" class="list-btns list-icon-look" @click="openCdFun"><i></i>查看相关数据</el-button>
          <div class="airvehicle-list-drop" style="display: inline-block;">
            <el-popover popper-class="airvehicle-table-popper">
              <ul>
                <li v-for="(item,index) in thList" :key="index">
                  <el-checkbox size="mini" v-model="item.value" @change="columnFieldChange">{{item.label}}</el-checkbox>
                </li>
              </ul>
              <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
            </el-popover>
          </div>
        </div>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table order-table' :data="resultList" border highlight-current-row size="mini" @selection-change="selectFun" height="370px">
        <el-table-column  type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="流水号" min-width="150" v-if="thList.ocrNo.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.ocrNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="接单编号" min-width="150" v-if="thList.innerNo.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.innerNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="接单分号" min-width="150" v-if="thList.bossId.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.bossId}}</div>
          </template>
        </el-table-column>
        <el-table-column label="统一编号" min-width="150" v-if="thList.cusCiqNo.value" align="left">
          <template slot-scope="scope">
            <div><a href="javascript:void(0)" style='color: #409eff;' @click="lookDec(scope.row)">{{scope.row.cusCiqNo}}</a></div>
          </template>
        </el-table-column>
        <el-table-column label="接单标识" min-width="110" v-if="thList.ref6.value" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.ref6 == '' || scope.row.ref6 == null">自主接单</div>
            <div v-else>{{scope.row.ref6}}</div>
          </template>
        </el-table-column>
        <el-table-column label="申报状态" min-width="110" v-if="thList.decInvtStatusValue.value" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 'invt'">{{scope.row.invtStatusValue}}</div>
            <div v-else>{{scope.row.decStatusValue}}</div>
          </template>
        </el-table-column>
        <el-table-column label="系统状态" min-width="110" v-if="thList.statusValue.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.statusValue}}</div>
          </template>
        </el-table-column>
        <el-table-column label="接单类型" min-width="110" v-if="thList.type.value" align="left">
          <template slot-scope="scope">
            <div v-if="(scope.row.type == 'invt' && scope.row.status === 'I') || (scope.row.type == 'invt' && scope.row.status === '1')"><a href="javascript:void(0)" style='color: #409eff;' @click="toInvtPage(scope.row)">{{formatType(scope.row.type)}}</a></div>
            <div v-else>{{formatType(scope.row.type)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="接单日期" min-width="110" v-if="thList.rcvDate.value" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.rcvDate}}</div>
          </template>
        </el-table-column>
        <el-table-column label="申报截止日期" min-width="110" v-if="thList.demandDate.value" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.demandDate}}</div>
          </template>
        </el-table-column>
        <el-table-column label="委托客户" min-width="200" v-if="thList.company.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.company}}</div>
          </template>
        </el-table-column>
        <el-table-column label="手(账)册编号" min-width="130" v-if="thList.manualNo.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.manualNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="提运单号" min-width="130" v-if="thList.billNo.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.billNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="件数" min-width="100" v-if="thList.packNo.value" align="right">
          <template slot-scope="scope">
            <div>{{scope.row.packNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="毛重" min-width="100" v-if="thList.grossWt.value" align="right">
          <template slot-scope="scope">
            <div>{{scope.row.grossWt}}</div>
          </template>
        </el-table-column>
        <el-table-column label="运输方式" min-width="110" v-if="thList.trafModeValue.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.trafModeValue}}</div>
          </template>
        </el-table-column>
        <el-table-column label="清单类型" min-width="110" v-if="thList.billtypeValue.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.billtypeValue}}</div>
          </template>
        </el-table-column>
        <el-table-column label="报关标志" min-width="110" v-if="thList.ediIdValue.value" align="left">
          <template slot-scope="scope">
            <div>{{scope.row.ediIdValue}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <div class="order-list-btns">
              <el-button type="text" class="table-icon list-icon-edit" title="编辑" @click="gotoDetail('edit', scope.row)"><i></i></el-button>
              <el-button type="text" class="table-icon list-icon-look" title="查看" @click="gotoDetail('view', scope.row)"><i></i></el-button>
              <!-- <el-button type="text" class="table-icon list-icon-ledger" title="登账"  v-if="scope.row.ref3"  @click="toFinace(scope.row)"><i></i></el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
          <page-box :pagination.sync='paginationInit' @change="pageList"></page-box>
        </el-col>
      </el-row>
    </div>
    <el-dialog :modal-append-to-body='false' :visible.sync="detailVisible" width="1130px" class="order-dialog-noTitle" :close-on-click-modal="false" :before-close="cancleElement">
      <order-detail :typeValue="typeValue" :id="id" :userId="userId" :iEFlag="iEFlag" :status="status" @closedecele="cancleElement"  v-if="detailVisible"></order-detail>
    </el-dialog>
    <el-dialog :modal-append-to-body='false' :title="typeTitle" :visible.sync="cdVisible" width="800px" :close-on-click-modal="false">
     <div class='dec-query-table'>
          <!-- 列表table开始 -->
          <el-table class='sys-table-table dec-table' border highlight-current-row size="mini" height="300px" :data="cdList">
            <el-table-column  type="index" label="行号" align="left" min-width="50"></el-table-column>
            <el-table-column label="接单编号" min-width="120" align="left">
              <template slot-scope="scope">
                {{scope.row.innerNo || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="接单编号分号" min-width="120" align="left">
              <template slot-scope="scope">
                {{scope.row.bossId || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="统一编号" min-width="100" align="left">
              <template slot-scope="scope">
                {{scope.row.seqNo || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="件数" min-width="60" align="right">
              <template slot-scope="scope">
                {{scope.row.packNo || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="毛重" min-width="60" align="right">
              <template slot-scope="scope">
                {{scope.row.grossWt || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100" align="center">
              <template slot-scope="scope">
                <a href="javascript:void(0)" v-show="scope.row.decType!='decTs'" class="list-icon-edit border-0" title="编辑" @click="lookFun(scope.row, 'edit')" style="margin-right:10px"><i class='dec-i'></i></a>
                <a href="javascript:void(0)" v-show="scope.row.decType!='decTs'" class="list-icon-look border-0" title="查看" @click="lookFun(scope.row, 'view')" style="margin-right:10px"><i class='dec-i'></i></a>
                <a href="javascript:void(0)" class="list-icon-delete border-0" title="删除" @click="deleteDecFun(scope.row.bossId)"><i class='dec-i'></i></a>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </el-dialog>
    <!-- 导入弹窗 -->
    <el-dialog :modal-append-to-body='false' title="EXCEL导入" :visible.sync="importCompnentVisible" class="sys-dec-class" width="640px">
      <execl-import :initParams="initImport" @cancLeData="closeImportCompnent"  v-if="importCompnentVisible"></execl-import>
    </el-dialog>
    <!-- 导入弹窗 end -->
    <!-- 弹出框 OCR上传 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="上传文件"
      :visible.sync="ocrVisable"
      :close-on-click-modal='false'
      v-loading="$store.state.loading"
      class="sys-dec-class"
      width="500px">
      <ocr-upload  @backData="colseOCRCompnent"  v-if="ocrVisable"></ocr-upload>
    </el-dialog>
    <!-- 弹出框 OCR 结束 -->
    <!-- 弹出框 OCR记录 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="识别记录"
      :visible.sync="ocrRcordVisable"
      :close-on-click-modal='false'
      class="sys-dec-dialog"
      width="800px">
      <ocr-record @cancLeData="closeOCRcordCompnent"  v-if="ocrRcordVisable"></ocr-record>
    </el-dialog>
    <!-- 弹出框 OCR记录 结束 -->
     <!-- 弹出框 OCR记录 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="提示"
      :visible.sync="coverVisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      class="sys-dec-class"
      width="400px">
      <sync-cover :initParams="initCoverParam"  @cancLeData="closeCoverCompnent" @backData="receptionCoverData" v-if="coverVisable"></sync-cover>
    </el-dialog>
    <!-- 弹出框 OCR记录 结束 -->
    <!-- 弹出框 同步记录 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="同步记录"
      :visible.sync="syncDecRcordVisable"
      :close-on-click-modal='false'
      v-loading="$store.state.loading"
      class="sys-dec-dialog"
      width="800px">
      <syncdec-record @cancLeData="syncDecRcordCompnent"  v-if="syncDecRcordVisable"></syncdec-record>
    </el-dialog>
    <!-- 弹出框 同步记录 结束 -->
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from './decPage/common/decUtil'
import config from '@/config/config'
import orderDetail from './component/order.vue'
import execlImport from './component/execImport.vue'
import ocrUpload from './component/ocrUpload.vue'
import ocrRecord from './component/ocrRecord.vue'
import pickerOptions from '@/common/mixin/pickerOptions'

export default {
  components: {
    orderDetail, execlImport, ocrUpload, ocrRecord
  },
  name: 'orderQueryTable',
  mixins: [pickerOptions],
  data () {
    return {
      QueryDecForm: {
        declTrnrel: '0,2', // 报关单类型
        etpsCategory: 'D', // 企业类别
        entryId: '', // 报关单号
        seqNo: '', // 统一编号
        bossId: '', // 接单编号
        tradeCode: '', // 境内收发货人
        billNo: '', // 提运单号
        customMaster: '', // 申报地海关
        status: '', // 是否结关  业务状态
        // updateTimeStart: '', // 最近开始操作时间
        // updateTimeEnd: '', // 最近终止操作时间
        rcvStartDate: '',
        rcvEndDate: '',
        iEFlag: 'I', // 进出口标志
        createUser: '',
        type: '',
        ocrNo: '' // 流水号
      },
      id: '',
      status: '',
      decStatus: '',
      selectList: [], // 勾选数据
      bossIdList: [],
      innerNoList: [], // 勾选数据主键
      detailVisible: false, // 新增组件控制
      typeValue: '',
      resultList: [], // 列表数据
      dates: ['', ''], // 日期
      paramsOptions: {}, // 字典数据
      iEFlag: '',
      isDisabled: false,
      cdVisible: false,
      cdList: [], // 报关单数据
      checkedHead: [], // checkbox绑定的数据
      thList: {
        ocrNo: {
          value: false,
          label: '流水号'
        },
        innerNo: {
          value: true,
          label: '接单编号'
        },
        bossId: {
          value: true,
          label: '接单分号'
        },
        cusCiqNo: {
          value: true,
          label: '统一编号'
        },
        ref6: {
          value: true,
          label: '接单标识'
        },
        decInvtStatusValue: {
          value: true,
          label: '申报状态'
        },
        statusValue: {
          value: true,
          label: '系统状态'
        },
        type: {
          value: true,
          label: '接单类型'
        },
        rcvDate: {
          value: true,
          label: '接单日期'
        },
        demandDate: {
          value: true,
          label: '申报截止日期'
        },
        company: {
          value: true,
          label: '委托客户'
        },
        manualNo: {
          value: true,
          label: '手(账)册编号'
        },
        billNo: {
          value: true,
          label: '提运单号'
        },
        packNo: {
          value: true,
          label: '件数'
        },
        grossWt: {
          value: true,
          label: '毛重'
        },
        trafModeValue: {
          value: true,
          label: '运输方式'
        },
        billtypeValue: {
          value: true,
          label: '清单类型'
        },
        ediIdValue: {
          value: true,
          label: '报关标志'
        }
      },
      iEList: [{
        code: 'E',
        name: '出口'
      }, {
        code: 'I',
        name: '进口'
      }],
      statusList: [{
        value: '0',
        label: '接单生成'
      }, {
        value: '2',
        label: '报关单预录入'
      }, {
        value: '3',
        label: '待审核'
      }, {
        value: '4',
        label: '审核驳回'
      }, {
        value: '6',
        label: '审核通过'
      }, {
        value: 'R',
        label: '待复核'
      }, {
        value: 'I,1',
        label: '核注清单预录入'
      }, {
        value: 'C',
        label: '接单完成'
      }, {
        value: 'Z',
        label: '已作废'
      }], // 状态数据
      typeList: [{
        value: 'dec',
        label: '报关单'
      }, {
        value: 'decTs',
        label: '两步申报'
      }, {
        value: 'invt',
        label: '核注清单'
      }, {
        value: 'log',
        label: '物流作业'
      }], // 接单类型
      fileList: [],
      userId: '', // 当前登录用户id
      postPersonList: [], // 创建人数据
      typeTitle: '',
      initImport: {}, // 导入信息
      importCompnentVisible: false, // 导入弹窗
      ocrRcordVisable: false, // ORC记录查看
      ocrVisable: false, // ORC 上传
      coverVisable: false,
      syncDecRcordVisable: false
    }
  },
  created () {
    this.dates = [util.getNdayDate(new Date(), -7), new Date()]
    this.iEFlag = this.$route.meta.iEFlag
    // 获取登陆用户信息
    this.getUserInfo()
    this.getCommonParams()
    this.getUserUnderCrop()
    if (!util.isEmpty(this.$route.query.status)) {
      this.dates = [this.$route.query.startTime, this.$route.query.endTime]
      this.QueryDecForm.status = this.$route.query.status
      this.QueryDecForm.rcvStartDate = this.$route.query.startTime
      this.QueryDecForm.rcvEndDate = this.$route.query.endTime
      this.QueryDecForm.iEFlag = this.$route.query.iEFlag
    }
    this.queryList()
    if (!util.isEmpty(this.$route.query.innerNo)) {
      this.gotoDetail('view', {innerNo: this.$route.query.innerNo})
    }
  },
  mounted () {
  },
  methods: {
    // 获取公共字典list
    getCommonParams () {
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: {
          'tableNames': [
            'SAAS_TRANSPORT_TYPE' // 运输方式
          ]
        },
        success: (res) => {
          this.paramsOptions = res.result
        }
      })
    },
    // 新增/详情
    gotoDetail (type, row) {
      if (type !== 'add') {
        this.id = row.innerNo
        this.status = row.status
      } else {
        this.id = 'add'
        this.status = 'add'
      }
      this.detailVisible = true
      this.typeValue = type
    },
    // 商品信息弹窗关闭
    cancleElement () {
      this.detailVisible = false
      if (this.typeValue === 'view' && !util.isEmpty(this.$route.query.innerNo)) {
        this.$store.dispatch('CloseTab', this.$store.state.TabsStore.currentTab.tabId)
      } else {
        this.queryList()
      }
    },
    // 列表查询
    queryList () {
      if (this.iEFlag === 'import') {
        this.QueryDecForm.iEFlag = 'I'
      } else {
        this.QueryDecForm.iEFlag = 'E'
      }
      if (this.dates === '' || this.dates === null) {
        this.QueryDecForm.rcvStartDate = ''
        this.QueryDecForm.rcvEndDate = ''
      } else {
        this.QueryDecForm.rcvStartDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryDecForm.rcvEndDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.pageList(this.$store.state.pagination)
    },
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/ccba/common/getOrderTakenList',
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
      this.QueryDecForm = {}
      this.dates = ['', '']
      this.queryList()
    },
    // 格式化报关单类型
    formatType (val) {
      let value = ''
      for (let i = 0; i < this.typeList.length; i++) {
        if (this.typeList[i].value === val) {
          value = this.typeList[i].label
          break
        }
      }
      return value
    },
    // 获取本企业下的人员
    getUserUnderCrop () {
      this.$post({
        url: 'API@/login/corp/getCorpUsers',
        data: {},
        success: (res) => {
          if (res.code === '0000') {
            for (let i in res.result) {
              this.postPersonList.push({
                codeField: res.result[i].userId,
                nameField: res.result[i].userName
              })
            }
          }
        }
      })
    },
    // 导入弹窗
    importExcel () {
      // 设置初始参数
      this.initImport = {
        iEFlag: this.iEFlag === 'import' ? 'I' : 'E',
        type: 'OD'
      }
      this.importCompnentVisible = true
    },
    // 关闭导入组件
    closeImportCompnent (value) {
      let isQuery = value.isQuery
      if (!util.isEmpty(isQuery) && isQuery === true) {
        this.queryList()
      }
      this.importCompnentVisible = false
    },
    // 上传文件
    beforeUpload (file) {
      if (!(file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
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
            this.upLoadExcel(this.fileList)
          }
        })
      }
      return false
    },
    // 导入
    upLoadExcel (fileList) {
      let data = {
        httpUrl: fileList[0].url,
        iEFlag: this.iEFlag === 'import' ? 'I' : 'E'
      }
      this.$post({
        url: 'API@/dec-common/ccba/common/importOrderTake',
        data: data,
        success: (res) => {
          this.messageTips('导入成功', 'success')
          this.queryList()
        }
      })
    },
    // 模板下载
    download () {
      window.open('https://www.5itrade.cn/files/decTemplet/orderTakenTemp.xlsx', '_blank')
    },
    selectFun (row) {
      this.innerNoList = []
      this.bossIdList = []
      this.selectList = []
      this.selectList = row
      for (let i in row) {
        this.bossIdList.push(row[i].bossId ? row[i].bossId : row[i].innerNo)
        this.innerNoList.push(row[i].innerNo)
      }
    },
    // 删除
    deleteFun () {
      if (this.selectList.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        let url = ''
        let flag = false
        let message = ''
        if (this.iEFlag === 'import') {
          url = 'API@/dec-common/ccba/iOrderTake/delOrderTakenMain'
        } else {
          url = 'API@/dec-common/ccba/eOrderTake/delOrderTakenMain'
        }
        for (let i in this.selectList) {
          if (this.selectList[i].status === '2') {
            flag = true
          }
        }
        if (!flag) {
          message = '确认删除吗？'
        } else {
          message = '该数据已提交生成报关单，确认一并删除关联报关单，确认删除吗？'
        }
        this.$confirm(message, '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post({
            url: url,
            data: {list: this.bossIdList},
            success: (res) => {
              this.messageTips('删除成功', 'success')
              this.pageList()
            },
            other: (res) => {
              this.messageTips(res.result, 'error')
            }
          })
        }).catch(() => {
        })
      }
    },
    // 复制
    copeFun () {
      if (this.selectList.length !== 1) {
        this.messageTips('请选择一条数据')
      } else {
        this.addFun(this.selectList)
      }
    },
    // 复制请求
    addFun (row) {
      let url = ''
      if (this.iEFlag === 'import') {
        url = 'API@/dec-common/ccba/iOrderTake/addIOrder'
      } else {
        url = 'API@/dec-common/ccba/eOrderTake/addEOrder'
      }
      let data = util.simpleClone(row)
      data[0].innerNo = ''
      data[0].seqNo = ''
      data[0].status = ''
      data[0].rcvDate = ''
      data[0].demandDate = ''
      data[0].ref1 = ''
      data[0].ref5 = ''
      data[0].companyId = data[0].ref3
      this.$confirm('确认复制吗？', '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: url,
          data: data,
          success: (res) => {
            this.messageTips('复制成功', 'success')
            this.queryList()
          }
        })
      }).catch(() => {
      })
    },
    // 查看相关数据
    openCdFun () {
      if (this.innerNoList.length !== 1) {
        this.messageTips('请选择一条数据')
      } else {
        this.typeTitle = this.selectList[0].type === 'dec' ? '关联报关单-查看' : (this.selectList[0].type === 'invt' ? '关联核注清单-查看' : '关联物流作业-查看')
        this.cdVisible = true
        this.queryDecList(this.selectList[0].type)
      }
    },
    // 查看相关数据列表
    queryDecList (type) {
      let url = ''
      // if (type === 'invt') {
      //   url = 'API@/dec-common/ccba/common/getInvtDetail'
      // } else {
      if (this.iEFlag === 'import') {
        url = 'API@/dec-common/ccba/iOrderTake/queryOrderTakens'
      } else {
        url = 'API@/dec-common/ccba/eOrderTake/queryOrderTakens'
      }
      // }
      this.$post({
        url: url,
        data: {bossId: this.innerNoList[0]},
        success: (res) => {
          let list = []
          // if (type === 'invt') {
          //   list = [res.result]
          // } else {
          list = res.result
          // }
          for (let i in list) {
            list[i].packNo = this.selectList[0].packNo
            list[i].grossWt = this.selectList[0].grossWt
            list[i].decType = type
          }
          this.cdList = list
        }
      })
    },
    // 接单生成报关单,核注清单，物流作业
    orderTakenToDec () {
      if (this.innerNoList.length !== 1) {
        this.messageTips('请选择一条数据')
      } else if (this.selectList[0].status !== '0' && this.selectList[0].splitFlag !== 'Y') {
        this.messageTips('当前状态不允许提交')
      } else if (this.selectList[0].splitFlag === 'Y') {
        this.$prompt('请输入生成报关单数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          inputPattern: /^[1-9]\d*$/,
          inputErrorMessage: '请输入正整数'
        }).then(({ value }) => {
          this.takenToDec(value)
        }).catch(() => {
        })
      } else {
        let message = ''
        if (this.selectList[0].type === 'dec') {
          message = '您确认要生成报关单吗？'
        } else if (this.selectList[0].type === 'invt') {
          message = '您确认要生成核注清单吗？'
        } else if (this.selectList[0].type === 'decTs') {
          message = '您确认要生成两步申报吗？'
        } else {
          message = '您确认要生成物流作业吗？'
        }
        this.$confirm(message, '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.takenToDec()
        }).catch(() => {
        })
      }
    },
    // 生成报关单
    takenToDec (value) {
      let url = ''
      if (this.selectList[0].type === 'dec') {
        if (this.iEFlag === 'import') {
          url = 'API@/dec-common/ccba/iOrderTake/orderTakenToDec'
        } else {
          url = 'API@/dec-common/ccba/eOrderTake/orderTakenToDec'
        }
      } else if (this.selectList[0].type === 'invt') {
        url = 'API@/dec-common/ccba/common/orderTakenToInvt'
      } else if (this.selectList[0].type === 'decTs') {
        url = 'API@/dec-common//ccba/common/orderTakenToDecTs'
      } else {
        url = 'API@/dec-common/ccba/common/orderTakenToLog'
      }
      let row = {}
      if (this.selectList[0].type !== 'dec') {
        row = {
          innerNo: this.innerNoList[0],
          iEFlag: this.iEFlag === 'import' ? 'I' : 'E'
        }
      } else {
        row.innerNo = this.innerNoList[0]
        if (!util.isEmpty(value)) {
          row.splitDecNo = value
        }
      }
      if (this.selectList[0].type === 'invt') {
        let data = {
          emsNo: this.selectList[0].manualNo,
          emsTypeFlag: ' '
        }
        this.$post({
          url: 'API@/saas-ems/nemsinvt/getEtpsInfo',
          data: data,
          success: (res) => {
            if (!util.isEmpty(res.result)) {
              this.$post({
                url: url,
                data: row,
                success: (res) => {
                  this.messageTips('生成成功', 'success')
                  this.queryList()
                }
              })
            } else {
              this.messageTips('您输入的手(账)册编号不存在，请输入正确的手(账)册编号。', 'error')
            }
          }
        })
      } else {
        this.$post({
          url: url,
          data: row,
          success: (res) => {
            this.messageTips('生成成功', 'success')
            this.queryList()
          }
        })
      }
    },
    // 报关单删除
    deleteDecFun (val) {
      let url = ''
      if (this.iEFlag === 'import') {
        url = 'API@/dec-common/ccba/iOrderTake/delOrderTakenWin'
      } else {
        url = 'API@/dec-common/ccba/eOrderTake/delOrderTakenWin'
      }
      this.$post({
        url: url,
        data: {list: [val]},
        success: (res) => {
          this.messageTips('删除成功', 'success')
          this.queryDecList()
        }
      })
    },
    // 导出
    exportFun () {
      let len = this.selectList.length
      if (len === 0) {
        this.messageTips('请至少选择一条数据')
      } else {
        let pidLit = []
        for (let i in this.selectList) {
          pidLit.push(this.selectList[i].seqNo)
        }
        this.$post({
          url: 'API@/dec-common/ccba/common/exportOrderTake',
          data: {
            'iEFlag': this.iEFlag === 'import' ? 'I' : 'E',
            'list': pidLit
          },
          success: (res) => {
            window.open(res.result, '_blank')
          },
          other: (res) => {
            this.messageTips(res.message, 'error')
          }
        })
      }
    },
    // 跳转至报关单/备案清单/核注清单
    lookFun (val, type) {
      if (util.isEmpty(val.importType)) {
        if (this.selectList[0].type === 'invt') {
          let iEFlag = this.iEFlag === 'import' ? 'I' : 'E'
          let url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].EMS + `/dec/datainput/${iEFlag}/taxList?type=${type}&headPid=${val.decPid}`
          let setId = type === 'view' ? 'look' : 'edit'
          let title = type === 'view' ? '核注清单查看' : '核注清单编辑'
          this.$router.push({
            name: 'iExport-new',
            query: {
              url: encodeURIComponent(url),
              setTitle: title + '-' + val.decPid,
              setId: 'iExport-new' + setId + val.decPid
            }
          })
        } else {
          let funFlag = this.selectList[0].declTrnrel === '2' ? 'recordList' : 'declaration'
          decUtil.gotoDecPage(funFlag, this.iEFlag, type === 'view' ? 'look' : 'edit', val.decPid, 'dec', {}, this)
        }
      } else {
        if (val.importType === 'invt') {
          let iEFlag = this.iEFlag === 'import' ? 'I' : 'E'
          let url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].EMS + `/dec/datainput/${iEFlag}/taxList?type=${type}&headPid=${val.decPid}`
          let setId = type === 'view' ? 'look' : 'edit'
          let title = type === 'view' ? '核注清单查看' : '核注清单编辑'
          this.$router.push({
            name: 'iExport-new',
            query: {
              url: encodeURIComponent(url),
              setTitle: title + '-' + val.decPid,
              setId: 'iExport-new' + setId + val.decPid
            }
          })
        } else {
          let funFlag = this.selectList[0].declTrnrel === '2' ? 'recordList' : 'declaration'
          decUtil.gotoDecPage(funFlag, this.iEFlag, type === 'view' ? 'look' : 'edit', val.decPid, 'dec', {}, this)
        }
      }
    },
    // 跳转至报关单
    lookDec (val) {
      let funFlag = val.declTrnrel === '2' ? 'recordList' : 'declaration'
      decUtil.gotoDecPage(funFlag, this.iEFlag, 'look', val.decPid, 'dec', {}, this)
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      this.userId = this.$store.state.userLoginInfo.userId
      if (!util.isEmpty(this.userId)) {
        let fieldList = window.localStorage.getItem(this.iEFlag + 'RCO' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.thList, list)) {
            this.thList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem(this.iEFlag + 'RCO' + this.userId, JSON.stringify(this.thList))
          }
        }
      }
    },
    // 对比两个数组里的值是否一样
    compareFieldList (orig, compare) {
      if (orig.length === compare.length) {
        for (let i in orig) {
          if (orig[i].label !== compare[i].label) {
            return false
          }
        }
        return true
      } else {
        return false
      }
    },
    // 跳转物流费用-登账
    toFinace (data) {
      let param = `/ccba2/finance/expense/detail?type=edit&iEFlag=${data.iEFlag === 'I' ? '0' : '1'}&innerNo=${data.innerNo}&setTitle=台账编辑&setId=expense-detail${data.innerNo}`
      let url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].HOST + param
      window.open(url, '_blank')
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      // key值 为DEC tableHead DTH加当前用户的id
      window.localStorage.setItem(this.iEFlag + 'RCO' + this.userId, JSON.stringify(this.thList))
    },
    // 跳转核注清单页面
    toInvtPage (val) {
      let menuCode = JSON.parse(window.localStorage.getItem('ccbaMenuCodes'))
      let iEFlag = this.iEFlag === 'import' ? 'I' : 'E'
      let orderCode = this.iEFlag === 'import' ? 'CCBA20209030000' : 'CCBA20210030000'
      let type = 'view'
      if (menuCode[orderCode] === 'true') {
        type = 'edit'
      } else {
        type = 'view'
      }
      let url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].EMS + `/dec/datainput/${iEFlag}/taxList?type=${type}&headPid=${val.decPid}`
      let title = type === 'view' ? '核注清单查看' : '核注清单编辑'
      this.$router.push({
        name: 'iExport-new',
        query: {
          url: encodeURIComponent(url),
          setTitle: title + '-' + val.decPid,
          setId: 'iExport-new' + type + val.decPid
        }
      })
    },
    handleCommand (command) {
      if (command === 'importExcel') {
        this.importExcel()
      }
    },
    // 解析PDF
    beforeUploadPDF (file) {
      if (!(file.type === 'application/pdf')) {
        this.messageTips('解析文件只支持pdf格式', 'error')
      } else if (!(Math.ceil(file.size / 1024) <= 3072)) {
        this.messageTips('解析文件大小不能超过3MB', 'error')
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
            this.upLoadPDF(this.fileList)
          }
        })
      }
      return false
    },
    // 导入
    upLoadPDF (fileList) {
      let param = []
      if (fileList) {
        fileList.forEach(ele => {
          param.push({docName: ele.name, docSize: ele.size, docUrl: ele.url, source: 'accept'})
        })
      }
      this.$post({
        url: 'API@/dec-common/dec/orc/parsePDF',
        data: param,
        success: (res) => {
          this.messageTips('pdf解析成功', 'success')
          this.queryList()
        }
      })
    },
    // 智能制单
    OCRupLoad (type) {
      if (type === 'upload') {
        this.ocrVisable = true
      } else if (type === 'record') {
        this.ocrRcordVisable = true
      }
    },
    // 关闭 ocr 上传弹出框
    colseOCRCompnent () {
      this.ocrVisable = false
    },
    // 关闭 ocr 记录弹出框
    closeOCRcordCompnent () {
      this.ocrRcordVisable = false
    },
    // 关闭 同步记录 弹出框
    syncDecRcordCompnent () {
      this.syncDecRcordVisable = false
    },
    closeCoverCompnent () {
      this.coverVisable = false
    },
    toAI () {
      this.$router.push({
        name: 'intelligentVouchingQuery'
      })
    }
  }
}
</script>
<style scoped lang="less">
@import '~@/assets/style/common';
  .query-main {
    // background-color: #e5f2ff;
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
  .border-0 {
    border: 0;
    margin-right: 5px;
  }
  .list-icon-look:hover i,.list-icon-look:focus i{
  background-color: #fff
  }
  .list-icon-edit:hover i,.list-icon-edit:focus i{
  background-color: #fff
  }
  .list-icon-delete:hover i,.list-icon-delete:focus i{
  background-color: #fff
  }
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  .bill-icon{
    i{
      font-size: 14px;
      vertical-align: middle;
    }
    &:hover{
      i{
        color: #409EFF;
      }
    }
  }
  .order-list-btns{
    text-align: center;
  }
  .special-btn{
    padding: 6px 8px;
    vertical-align: middle;
    background-color:@sys-color-main;
    border:solid 1px @sys-color-main;
    &:hover{
      background-color:@sys-color-main;
      border:solid 1px @sys-color-main;
      color: #fff;
    }
  }
</style>
