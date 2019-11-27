<template>
  <section class='sys-main'>
    <!-- 查询条件 -->
    <div class="query-header">
      <el-form size="mini" :label-width="labelFormWidth.six" :model="queryForm" ref="queryForm" :rules="rules">
        <el-row :gutter="30">
          <el-col :md="12" :lg="8">
            <el-form-item label="进出口标志">
              <el-select v-model="queryForm.iEFlag" filterable style="width:100%;">
                <el-option v-for="item in iEFlagList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="总运单号">
              <el-input v-model="queryForm.billNo" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="关区代码">
              <el-select v-model="queryForm.cusCustomsCode"
                default-first-option remote
                filterable
                :remote-method="checkParamsList"
                @focus="tipsFillMessage('cusCustomsCodeList','SAAS_CUSTOMS_REL')"
                clearable style="width:100%" >
                <el-option
                  v-for="item in cusCustomsCodeList"
                  :key="item.codeField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="分运单号">
              <el-input v-model="queryForm.assBillNo" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="报关单号">
              <el-input v-model="queryForm.entryId" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="收发货人编码">
              <el-input v-model="queryForm.tradeCo" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="状态信息">
              <el-input v-model="queryForm.statusInfo" maxlength="2" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="收发货统一社会信用代码" class="more-txt-lh">
              <el-input v-model="queryForm.tradeScc" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="申报时间">
              <el-date-picker v-model="dates" style="width:100%;"
                type="daterange"
                :editable='false'
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="express-txt-c">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 查询条件 end -->
    <!-- 主显示框 -->
    <div class='query-body'>
      <el-row class="mg-b-12">
        <el-dropdown trigger="hover">
          <el-button size="mini" class="file-inputx list-btns list-icon-import"><i></i>导入</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-upload
                class="upload-demo"
                action="http://127.0.0.1"
                :before-upload="beforeUpload"
                :show-file-list="false">
                <span>导入模板</span>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item><div @click.stop="download">模板下载</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button size="mini" class="list-btns list-icon-declare" @click="declare"><i></i>申报</el-button> -->
        <el-button size="mini" class="list-btns list-icon-delete" @click="deletes"><i></i>删除</el-button>
      </el-row>
      <el-row>
        <el-table class='sys-table-table express-table' :data="shipList" border highlight-current-row size="mini" @selection-change="selectChange" height="530px">
          <el-table-column  type="selection" min-width="35" align="center"></el-table-column>
          <el-table-column label="序号" width="100">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{(scope.$index+1)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="海关编号" min-width="120">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.entryId}}</div>
            </template>
          </el-table-column>
          <el-table-column label="预录入编号" min-width="130">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.preEntryId}}</div>
            </template>
          </el-table-column>
          <el-table-column label="收发货人" min-width="150">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.tradeName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="总运单号" min-width="130">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.billNo}}</div>
            </template>
          </el-table-column>
          <el-table-column label="分运单号" min-width="130">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.assBillNo}}</div>
            </template>
          </el-table-column>
          <el-table-column label="单据状态" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{formatStatus(scope.row.opResult)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="追加单据状态" min-width="110">
            <!-- <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.title}}</div>
            </template> -->
          </el-table-column>
          <el-table-column label="回执状态" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{formatStatus(scope.row.opResult)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="追加回执状态" min-width="110">
            <!-- <template slot-scope="scope">
              <div class='sys-td-c'></div>
            </template> -->
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                <el-button size="mini" class="table-icon list-icon-look" type="text" title="详情" @click="toDetail('detail',scope.row)"><i></i></el-button>
                <el-button size="mini" class="table-icon list-icon-declare" type="text" v-if="scope.row.opResult === 'DD'" @click="declare([scope.row.entHeadPid])" title="申报"><i></i></el-button>
                <el-button size="mini" class="table-icon list-icon-delete" type="text" title="删除" v-if="scope.row.opResult === 'DD'" @click="del([scope.row.entHeadPid])"><i></i></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- 主显示框 end -->
  </section>
</template>
<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      dates: ['', ''],
      queryForm: {
        iEFlag: '',
        billNo: '',
        cusCustomsCode: '',
        assBillNo: '',
        entryId: '',
        startTime: '',
        endTime: '',
        tradeCo: '',
        statusInfo: '',
        tradeScc: ''
      }, // 查询传参
      rules: {
        iEFlag: [{ required: true, message: '请选择进出口标志', trigger: 'change' }],
        billNo: [{ required: true, message: '请输入总运单号', trigger: 'blur' }],
        cusCustomsCode: [{ required: true, message: '请选择关区代码', trigger: 'change' }]
      }, // 校验
      shipList: [], // 表格数据
      pages: {}, // 存放分页
      fileList: [], // 文件
      iEFlagList: [{
        value: 'I',
        label: '进口'
      }, {
        value: 'E',
        label: '出口'
      }], // 进出口标志
      tableNameList: {
        tableNames: [
          'SAAS_CUSTOMS_REL' // 海关关区
        ]
      }, // 字典标明
      selectObj: {
        obj: '',
        params: ''
      },
      cusCustomsCodeList: [],
      statusList: [{
        value: 'DD',
        label: '暂存'
      }, {
        value: 'DZ',
        label: '发送中'
      }, {
        value: 'DN',
        label: '发送失败'
      }, {
        value: 'D0',
        label: '中心入库成功'
      }, {
        value: 'D1',
        label: '中心入库失败'
      }, {
        value: 'D2',
        label: '发往海关成功'
      }, {
        value: 'D3',
        label: '发往海关失败'
      }, {
        value: 'Y',
        label: '新增、修改、追加成功'
      }, {
        value: 'N',
        label: '新增、修改、追加失败'
      }, {
        value: 'A',
        label: '允许追加'
      }, {
        value: 'R',
        label: '不允许追加'
      }, {
        value: '00',
        label: '退单'
      }, {
        value: '02',
        label: '转普货报关'
      }, {
        value: '03',
        label: '转人工审核'
      }, {
        value: '04',
        label: '请提交纸面单据'
      }, {
        value: '05',
        label: '查验'
      }, {
        value: '06',
        label: '扣留'
      }, {
        value: '07',
        label: '没收'
      }, {
        value: '08',
        label: '改单'
      }, {
        value: 'D',
        label: '删单'
      }, {
        value: '10',
        label: '审核通过'
      }, {
        value: '11',
        label: '放行'
      }, {
        value: '12',
        label: '查验后补税放行'
      }, {
        value: '13',
        label: '查验后补证放行'
      }, {
        value: '14',
        label: '查验后补税补证放行'
      }, {
        value: '15',
        label: '查验后处罚后放'
      }, {
        value: '16',
        label: '查验后改单放行'
      }, {
        value: '17',
        label: '查验后担保放行'
      }, {
        value: '18',
        label: '查验正常货物放行'
      }, {
        value: '19',
        label: '其他待处理'
      }, {
        value: '20',
        label: '退单重报'
      }, {
        value: '21',
        label: '查验后转普货报关'
      }, {
        value: '22',
        label: '查验后转A、C类报关'
      }, {
        value: '23',
        label: '查验后转个人物品报关'
      }, {
        value: '24',
        label: '查验后改单'
      }, {
        value: '30',
        label: '整改合格放行'
      }, {
        value: '31',
        label: '检疫处理合格放行'
      }, {
        value: '32',
        label: '查验后退运 '
      }, {
        value: '33',
        label: '处罚退运 '
      }, {
        value: '34',
        label: '检疫处理退运 '
      }, {
        value: '35',
        label: '处罚后检疫处理退运 '
      }, {
        value: '36',
        label: '处罚销毁 '
      }, {
        value: '37',
        label: '查验后销毁 '
      }, {
        value: '38',
        label: '检疫处理销毁 '
      }, {
        value: '39',
        label: '处罚后检疫处理销毁 '
      }, {
        value: '40',
        label: '查验后整改 '
      }, {
        value: '41',
        label: '检疫处理 '
      }, {
        value: '42',
        label: '处罚后检疫处理合格放行 '
      }, {
        value: '43',
        label: '企业申请退单 '
      }, {
        value: '44',
        label: '放弃物品退单 '
      }], // 状态
      selectData: [] // 多选框
    }
  },
  created () {
    this.getCommonParam()
    this.search()
  },
  methods: {
    // 判断缓存中是否有数据
    getCommonParam () {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map)
      } else {
        this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
      }
    },
    // 获取公共字典list
    getCommonParams (datas) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
          this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
        }
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    checkParamsList (query) {
      if (query !== '') {
        let keyValue = query.toString().trim()
        let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          this[this.selectObj.obj] = list.slice(0, 30)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          this[this.selectObj.obj] = filterList.slice(0, 30)
        }
      } else {
        if (!util.isEmpty(JSON.parse(window.localStorage.getItem(this.selectObj.params)))) {
          this[this.selectObj.obj] = JSON.parse(window.localStorage.getItem(this.selectObj.params)).slice(0, 30)
        }
      }
    },
    // 查询
    search () {
      // this.$refs['queryForm'].validate((valId) => {
      //   if (!valId) {
      //     return false
      //   }
      this.pageList()
      // })
    },
    // 重置
    reset () {
      this.dates = ['', '']
      this.queryForm = {
        iEFlag: '',
        billNo: '',
        cusCustomsCode: '',
        assBillNo: '',
        entryId: '',
        startTime: '',
        endTime: '',
        tradeCo: '',
        statusInfo: '',
        tradeScc: ''
      }
      this.shipList = []
      // this.$nextTick(() => {
      this.search()
      // })
      // this.$nextTick(() => {
      //   this.$refs['queryForm'].clearValidate()
      // })
    },
    // 获取列表数据
    pageList () {
      if (this.dates === '' || this.dates === null) {
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
      } else {
        this.queryForm.startTime = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryForm.endTime = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/nexp/customs/queryEntList',
        data: this.queryForm,
        router: this.$router,
        success: (res) => {
          this.shipList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 格式化状态
    formatStatus (val) {
      let value = ''
      for (let i = 0; i < this.statusList.length; i++) {
        if (this.statusList[i].value === val) {
          value = this.statusList[i].label
          break
        }
      }
      return value
    },
    // 上传文件
    beforeUpload (file) {
      if (!(file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        this.$message({
          message: '上传文件只支持execl格式',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else if (!(Math.ceil(file.size / 1024) <= 2048)) {
        this.$message({
          message: '上传文件大小不能超过2MB',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        param.append('filePath', '/download')
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          router: this.$router,
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
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/nexp/customs/importCommons',
        data: fileList[0].url,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.pageList()
        },
        other: (res) => {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.pageList()
        }
      })
    },
    // 多选框
    selectChange (val) {
      this.selectData = val
    },
    // 申报
    declare (list) {
      // if (this.selectData.length === 0) {
      //   this.$message({
      //     message: '请选择需要申报的数据',
      //     type: 'warning'
      //   })
      // } else {
      //   let list = []
      //   for (let i of this.selectData) {
      //     if (i.opResult === 'DD') {
      //       list.push(i.entHeadPid)
      //     } else {
      //       this.$message({
      //         message: '当前数据不满足申报条件，无法进行申报',
      //         type: 'warning'
      //       })
      //       return false
      //     }
      //   }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/nexp/customs/declareCustom',
        data: {entHeadPids: list},
        router: this.$router,
        success: (res) => {
          this.$message({
            message: res.result.statusValue,
            type: 'success'
          })
          this.pageList()
        }
      })
      // }
    },
    // 删除
    deletes () {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'warning'
        })
      } else {
        this.$confirm('您确定删除所选数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonClass: 'confirm-btn-ok',
          type: 'warning'
        }).then(() => {
          let list = []
          for (let i of this.selectData) {
            if (i.opResult === 'DD') {
              list.push(i.entHeadPid)
            } else {
              this.$message({
                message: '当前数据不满足删除条件，无法进行删除',
                type: 'warning'
              })
              return false
            }
          }
          this.delReq(list)
        }).catch(() => {
        })
      }
    },
    del (list) {
      this.$confirm('您确定删除所选数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.delReq(list)
      }).catch(() => {
      })
    },
    delReq (list) {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/nexp/customs/deleteEnt',
        data: {entHeadPids: list},
        router: this.$router,
        success: (res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.search()
        }
      })
    },
    // 跳转到详情
    toDetail (type, data) {
      this.$router.push({
        name: 'declareBillDetail',
        params: {
          type: type,
          id: data.entHeadPid,
          status: data.opResult
        }
      })
    },
    // 下载模板
    download () {
      window.open('http://www.5itrade.cn:8084/files/ShippingBillTemplate/快件报关单导入模板.xlsx', '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.express-txt-c{
  text-align: center;
}
.list-tab-btns{
  padding: 0;
  margin: 0 5px 0 0;
  i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-top: -2px;
  }
}
.mg-b-15{
  margin-bottom: 15px;
}
.confirm-btn-ok{
  background-color: #287FCA !important;
  border-color: #287FCA !important;
}
</style>
