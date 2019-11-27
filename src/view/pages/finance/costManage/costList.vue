<template>
  <section class='sys-main costList'>
    <el-row class='query-condition'>
      <el-form :label-width="labelFormWidth.four"  :model="QueryForm" size="mini" label-position="left">
        <!-- 查询条件-->
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="费用名称">
              <el-input v-model="QueryForm.feeOptionName" size="mini" clearable :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="费用编号">
              <el-input size="mini" clearable v-model="QueryForm.feeOptionCode" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="会计科目">
              <el-input size="mini" clearable v-model="QueryForm.feeSubjectName" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="税率">
              <el-select v-model="QueryForm.feeRate" size="mini" clearable style="width:100%;">
                <el-option key="0" :label="'0%'" :value="0"></el-option>
                <el-option key="6" :label="'6%'" :value="6"></el-option>
                <el-option key="9" :label="'9%'" :value="9"></el-option>
                <el-option key="13" :label="'13%'" :value="13"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="创建人">
              <el-input size="mini" clearable v-model="QueryForm.createUser" :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="创建日期">
               <el-date-picker
                style="width:100%"
                v-model="dates"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
      <el-row class="query-btn" style="text-align:center">
        <el-button size="mini" type="primary" @click="getOptionList($store.state.pagination)">查询</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
      </el-row>
    </el-row>
    <!-- 列表表格开始 -->
    <div class='query-table-financeCommon'>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-add" @click="showDialog('add')"><i></i>新增</el-button>
        <el-dropdown trigger="hover">
          <el-button size="mini" class="file-inputx list-btns list-icon-import"><i></i>导入</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-upload
                class="upload-demo" style="display:inline-block;"
                action="http://127.0.0.1"
                :before-upload="beforeUpload"
                :show-file-list="false">
                <span>选择文件导入</span>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item><div @click.stop="download">模板下载</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
      <el-table size="mini" class='sys-table-table' align="left" :data="costTableList" border highlight-current-row height="530px" @cell-dblclick="editSubject">
        <el-table-column label="费用名称" min-width="100" prop="feeOptionName">
        </el-table-column>
        <el-table-column label="费用编号" min-width="100" prop="feeOptionCode">
        </el-table-column>
        <el-table-column label="税率" min-width="80" prop="feeRate" align="right">
          <template slot-scope="scope">
            {{scope.row.feeRate + '%'}}
          </template>
        </el-table-column>
        <el-table-column label="金蝶系统会计科目" min-width="140" prop="feeSubjectName" align="left">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.feeSubjectName" v-show="subjectEditShow[scope.$index]['feeSubjectName']" :ref="`costTableList${scope.$index}feeSubjectName`" @blur="blurSaveSubject(scope.row, $event)" maxlength="10"></el-input>
            <div v-show="!subjectEditShow[scope.$index]['feeSubjectName']">{{scope.row.feeSubjectName || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="80" prop="createUserName" align="center">
        </el-table-column>
        <el-table-column label="创建时间" min-width="160" prop="createTime" align="center">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80" align="center">
          <template slot-scope="scope">
            <div class="sys-td-c">
              <el-button type="text" v-if="scope.row.createUser === currentUser" title="编辑" @click.prevent="showDialog('edit',scope.row)" class="table-icon list-icon-edit"><i></i></el-button>
              <el-button type="text" title="查看" @click.prevent="showDialog('look',scope.row)" class="table-icon list-icon-look"><i></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='paginationInit' @change="getOptionList"></page-box>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :title="type === 'add' ? '新建费用': type === 'edit' ? '编辑费用' : '查看费用'"
      @close="resetDialog" :visible.sync="addFeeIsShow"
      :close-on-click-modal='false' width="560px"
      :modal-append-to-body="false">
      <div class="dec-div">
        <div class="topFlag flex" v-if="type !== 'look'">
          <img src="@/assets/img/warning.png" alt="">
          <div class="text">若需要使用账单的金蝶导出功能实现与金蝶系统的数据比对，请一定填写“会计科目”字段。</div>
        </div>
        <el-form size="mini" :label-width="'75px'" ref="addFees" :model="addFees" :rules="addFeesRule">
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form-item label="费用编号" prop="feeOptionCode">
                <el-input size="mini" :disabled="type === 'look'" :class="{'finaceCode': isDouble}" clearable v-model="addFees.feeOptionCode" :maxlength="30" @blur="checkCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form-item label="费用名称" prop="feeOptionName">
                <el-input size="mini" :disabled="isDisabled || type === 'look'" clearable v-model="addFees.feeOptionName" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form-item label="税率">
                <el-select v-model="addFees.feeRate" size="mini" style="width:100%;" :disabled="type === 'look'">
                  <el-option key="0" :label="'0%'" :value="0"></el-option>
                  <el-option key="6" :label="'6%'" :value="6"></el-option>
                  <el-option key="9" :label="'9%'" :value="9"></el-option>
                  <el-option key="13" :label="'13%'" :value="13"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form-item label="会计科目" prop="feeSubjectName">
                <el-input size="mini" :disabled="type === 'look'" clearable v-model="addFees.feeSubjectName" :maxlength="10"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="query-btn" style="text-align:center" v-if="type !== 'look'">
          <el-button size="mini" type="primary" @mousedown.native="confirmBtn($event)">确认</el-button>
          <el-button size="mini" @click="cancelBtn">取消</el-button>
        </el-row>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dates: [],
      addFeeIsShow: false,
      type: '', // 记录操作类型
      QueryForm: {
        createStartTime: '', // 起始创建时间
        createEndTime: '', // 结束创建时间
        createUser: '', // 创建人
        feeOptionCode: '', // 费用编号
        feeOptionName: '', // 费用项名称
        feeRate: '', // 税率
        feeSubjectName: '' // 科目名称
      },
      isDisabled: false,
      isDouble: false,
      addFees: {
        feeOptionCode: '',
        feeOptionName: '',
        feeRate: 0,
        feeSubjectName: ''
      },
      costTableList: [],
      paginationInit: '',
      addFeesRule: {
        feeOptionCode: [{required: true, validator: this.codeValid, message: '', trigger: 'blur'}],
        feeOptionName: [{required: true, message: '请输入费用名称', trigger: 'blur'}],
        feeSubjectName: [{pattern: /^\d+(\.\d+)?$|^$/, message: '10位或包含小数点以内的数字', trigger: 'blur'}]
      },
      tempOptionCode: '', // 临时存储费用编号
      subjectEditShow: [], // 会计科目可编辑
      fileList: [], // 导入
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: mapState({ // 查看vuex中当前登录的userId
    currentUser (state) {
      return state.userLoginInfo.userId
    }
  }),
  created () {
    this.paginationInit = this.$store.state.pagination
    this.getOptionList(this.$store.state.pagination)
  },
  methods: {
    // 获取费用项列表
    getOptionList (pagination) {
      if (this.dates && this.dates.length > 0) {
        this.QueryForm.createStartTime = this.dates[0]
        this.QueryForm.createEndTime = this.dates[1]
      } else {
        this.QueryForm.createStartTime = ''
        this.QueryForm.createEndTime = ''
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/option/gets',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: res => {
          this.paginationInit = res.page
          this.costTableList = res.result || []
          this.setShowEdit()
        }
      })
    },
    // 企业查询
    getcorps (query) {
      if (query.length < 2) {
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: query,
          returnProps: ['corpId', 'corpName']
        },
        router: this.$router,
        success: ({result}) => {
          this.corpList = (result && result.splice(0, 20)) || []
        }
      })
    },
    // 重置查询条件
    resetForm () {
      this.QueryForm = {
        createStartTime: '',
        createEndTime: '',
        createUser: '',
        feeOptionCode: '',
        feeOptionName: '',
        feeRate: '',
        feeSubjectName: ''
      }
      this.dates = []
    },
    // 重置创建费用项
    resetFees () {
      this.addFees = {
        feeOptionCode: '',
        feeOptionName: '',
        feeRate: 0,
        feeSubjectName: ''
      }
    },
    // 模态框关闭时数据初始化
    resetDialog () {
      this.isDisabled = false
      // this.resetFees()
    },
    // 显示模态框
    showDialog (type, data) {
      this.isDouble = false
      this.addFeeIsShow = true
      this.type = type
      this.$nextTick(() => {
        this.$refs['addFees'].clearValidate()
      })
      this.resetFees()
      if (type === 'add') {
        this.getFeeOptionCode()
      } else if (type === 'edit') {
        this.addFees = JSON.parse(JSON.stringify(data))
        this.isDisabled = true
        this.tempOptionCode = this.addFees.feeOptionCode
      } else {
        this.addFees = JSON.parse(JSON.stringify(data))
        this.tempOptionCode = this.addFees.feeOptionCode
      }
    },
    // 弹框取消按钮
    cancelBtn () {
      this.addFeeIsShow = false
    },
    // 弹框确定按钮
    confirmBtn (event) {
      event && event.preventDefault()
      let flag = false
      this.$refs['addFees'].validate(valid => {
        flag = valid
      })
      if (!flag) return
      this.type === 'add' ? this.creatOptions() : this.editOptions()
    },
    // 编辑费用项
    editOptions () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/option/edit',
        data: this.addFees,
        router: this.$router,
        success: (res) => {
          this.addFeeIsShow = false
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.getOptionList(this.$store.state.pagination)
        },
        other: res => {
          if (res.code === '0001') {
            let msg = ''
            if (res.result === '1') {
              this.isDouble = true
              msg = '当前编号已经存在,不可重复'
            } else {
              this.isDouble = false
              msg = '当前费用项已经存在,不可重复'
            }
            this.$message({
              type: 'error',
              message: msg
            })
          }
        }
      })
    },
    // 创建费用项
    creatOptions () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/option/create',
        data: this.addFees,
        router: this.$router,
        success: ({result}) => {
          if (result) {
            this.addFeeIsShow = false
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.getOptionList(this.$store.state.pagination)
          }
        },
        other: res => {
          if (res.code === '0001') {
            let msg = ''
            if (res.result === '1') {
              this.isDouble = true
              msg = '当前编号已经存在,不可重复'
            } else {
              this.isDouble = false
              msg = '当前费用项已经存在,不可重复'
            }
            this.$message({
              type: 'error',
              message: msg
            })
          }
        }
      })
    },
    // 生成费用编号
    getFeeOptionCode () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/option/getFeeOptionCode',
        data: '',
        router: this.$router,
        success: ({result}) => {
          if (result) {
            this.tempOptionCode = result
            this.addFees.feeOptionCode = result
          }
        }
      })
    },
    // 校验费用编号是否重复失焦事件
    checkCode () {
      let reg = /^[0-9a-zA-Z]{1,30}$/
      if (!reg.test(this.addFees.feeOptionCode)) return
      // 失焦时发送请求
      if (this.addFees.feeOptionCode === this.tempOptionCode) return
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/option/checkFeeCode',
        data: {
          feeOptionCode: this.addFees.feeOptionCode,
          feePid: this.addFees.feePid || ''
        },
        router: this.$router,
        success: ({result}) => {
          if (result) { // 重复 输入框标红并提示重复
            this.$message({
              type: 'error',
              message: '当前编号已经存在,不可重复'
            })
            this.isDouble = true
          } else {
            this.isDouble = false
            // 失焦事件和点击事件同时存在,失焦限制性,点击事件不执行了
          }
        }
      })
    },
    checkValidCode (rule, value, callback) {
      callback()
    },
    codeValid  (rule, value, callback) {
      const code = /^[0-9a-zA-Z]{1,30}$/
      if (value) {
        if (!code.test(value)) {
          callback(new Error('请输入数字、字母'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入费用编号'))
      }
    },
    // 设置会计科目单元格初始
    setShowEdit () {
      let subjectShowEdit = []
      for (let item of this.costTableList) {
        let tempShow = {}
        for (let innerItem in item) {
          tempShow[innerItem] = false
        }
        subjectShowEdit.push(tempShow)
      }
      this.subjectEditShow = subjectShowEdit
    },
    setShowEditInit () {
      for (let item of this.subjectEditShow) {
        for (let innerItem in item) {
          item[innerItem] = false
        }
      }
    },
    // 点击单元格触发
    editSubject (row, column, cell, event) {
      this.setShowEditInit()
      let nowProp = column.property
      let index = this.costTableList.findIndex(item => {
        return item.feePid === row.feePid
      })
      this.subjectEditShow[index][nowProp] = !this.subjectEditShow[index][nowProp]
      // let ref = 'costTableList' + index + nowProp
      this.$nextTick(() => {
        event.target.previousElementSibling.children[0].focus()
      })
    },
    // 会计科目失焦保存
    blurSaveSubject (val, event) {
      const rule = /^\d+(\.\d+)?$|^$/
      if (val.feeSubjectName && !rule.test(val.feeSubjectName)) {
        this.$message({
          type: 'error',
          message: '格式错误，应为10位或包含小数点以内的数字'
        })
        event.target.focus()
      } else {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-finance/option/editSubjectName',
          data: {
            feeSubjectName: val.feeSubjectName,
            feePid: val.feePid
          },
          router: this.$router,
          success: ({result}) => {
            this.getOptionList(this.$store.state.pagination)
          }
        })
      }
    },
    // 上传文件
    beforeUpload (file) {
      if (!(file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        this.$message({
          message: '上传文件只支持excel格式',
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
        url: 'API@/saas-finance/option/import',
        data: fileList[0].url,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.getOptionList(this.$store.state.pagination)
        },
        other: (res) => {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: res.message,
            type: 'error'
          })
          this.getOptionList(this.$store.state.pagination)
        }
      })
    },
    download () {
      window.open('https://www.5itrade.cn/files/financeTemplet/费用项管理导入明细.xlsx', '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: flex-start;
}
.topFlag {
    padding-left: 18px;
    margin-bottom: 20px;
    box-sizing: border-box;
    img {
      display:block;
      margin-right: 8px;
    }
  }
.query-condition {
  background-color: #fff;
  padding: 20px;
}
.table-btn {
  padding-bottom: 12px;
}
</style>
