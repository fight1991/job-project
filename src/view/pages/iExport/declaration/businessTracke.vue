<template>
<!-- 业务跟踪台账 -->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <el-form :label-width="labelFormWidth.four" :model="queryForm" size="mini" label-position="right">
        <el-row :gutter='20'>
          <el-col :md="12" :lg="6">
              <el-form-item label="接单编号" >
                <el-input v-model="queryForm.bossId" clearable></el-input>
              </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="系统编号" >
              <el-input v-model="queryForm.decPid" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="统一编号" >
              <el-input v-model="queryForm.seqNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="海关编号" >
              <el-input v-model="queryForm.entryId" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :md="12" :lg="6">
              <el-form-item label="状态" >
                <el-select placeholder="" v-model="queryForm.status"  filterable style="width:100%" clearable>
                  <el-option
                    v-for="item in statusList"
                    :key="item.codeField"
                    :label="item.codeField + '-' +item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="操作人" >
              <el-select placeholder="" v-model="queryForm.createUser"  filterable style="width:100%" clearable>
                <el-option
                  v-for="item in userList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.nameField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="dates" style="width:100%"
                type="daterange" clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryList" style="padding: 8px 20px;">查询</el-button>
            <el-button size="mini" @click="resetForm" style="padding: 8px 20px;">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-listExport"  @click="listExport"><i></i>导出</el-button>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table'
        :data="dataList" border
        highlight-current-row
        size="mini"  height="400">
        <el-table-column label="接单编号" align='left' prop="bossId" min-width="140"></el-table-column>
        <el-table-column label="系统编号" align='left' prop="decPid" min-width="80"></el-table-column>
        <el-table-column label="统一编号" align='center' prop="seqNo" min-width="180"></el-table-column>
        <el-table-column label="海关编号" align='center' prop="entryId" min-width="180"></el-table-column>
        <el-table-column label="接单生成时间" align='center' prop="bossTime" min-width="180"></el-table-column>
        <el-table-column label="接单生成操作人" align='left' prop="bossUpdateUser" min-width="140"></el-table-column>
        <el-table-column label="报关单预录入时间" align='center' prop="decPreTime" min-width="180"></el-table-column>
        <el-table-column label="报关单预录入操作人" align='left' prop="decUpdateUser" min-width="140"></el-table-column>
        <el-table-column label="初审通过时间" align='center' prop="submitTime" min-width="140"></el-table-column>
        <el-table-column label="初审人" align='left' prop="submitUpdateUser" min-width="140"></el-table-column>
        <el-table-column label="复核通过时间" align='center' prop="lastSubmitTime" min-width="140"></el-table-column>
        <el-table-column label="复核人" align='left' prop="lastSubmitUpdateUser" min-width="90"></el-table-column>
        <el-table-column label="报关单状态" align='left' prop="decStatusValue" min-width="100"></el-table-column>
        <el-table-column label="放行" align='center' prop="passTime" min-width="140"></el-table-column>
        <el-table-column label="结关" align='center' prop="finTime" min-width="140"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="60" align='center'>
          <template slot-scope="scope">
            <a href="javascript:void(0)" class="list-icon-lookH" title="查看" @click.stop="lookupDetail(scope.row)"><i class='dec-i'></i></a>
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
    <!-- 弹出框 业务跟踪明细 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="业务跟踪明细"
      :visible.sync="trackeVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-dialogDrag
      class="sys-dec-class"
      width="80%">
      <tracke-detail :initParams="trackeParam" @cancLeData="closeTrackeCompnent" @backData="receptionTrackeData"  v-if="trackeVisible"></tracke-detail>
    </el-dialog>
    <!-- 弹出框 业务跟踪明细 结束 -->
  </section>
</template>

<script>
import util from '@/common/util'
import trackeDetail from './component/trackeDetail.vue'

export default {
  name: 'business-tracke',
  components: {
    trackeDetail
  },
  data () {
    return {
      queryForm: {
        bossId: '', // 接单编号
        decPid: '', // 系统编号
        seqNo: '', // 统一编号
        entryId: '', // 报关单号
        status: '', // 状态
        createTimeStart: '', // 开始时间
        createUser: '', // 操作人
        createTimeEnd: '' // 结束时间
      },
      trackeVisible: false, // 业务跟踪明细 显示控制
      trackeParam: {}, // 业务跟踪 初始化参数
      dates: [], // 日期
      dataList: [], // table参数
      userList: [], // 操作人员
      statusList: [{
        codeField: '0',
        nameField: '接单生成'
      }, {
        codeField: '2',
        nameField: '报关单预录入'
      }, {
        codeField: '3',
        nameField: '待审核'
      }, {
        codeField: '4',
        nameField: '审核驳回'
      }, {
        codeField: '6',
        nameField: '审核通过'
      }, {
        codeField: '20',
        nameField: '单一窗口暂存'
      }, {
        codeField: '21',
        nameField: '单一窗口申报中'
      }, {
        codeField: '9',
        nameField: '放行'
      }, {
        codeField: '10',
        nameField: '结关'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '当天',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            let week = start.getDay()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * week)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近7天',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            let monthDay = start.getDate() - 1
            start.setTime(start.getTime() - 3600 * 1000 * 24 * monthDay)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    // 初始化查询日期
    this.setDefualtDate()
    // 企业本企业下的人员
    this.getUserUnderCrop()
    // 初始化 列表数据
    this.queryList()
  },
  methods: {
    // 企业本企业下的人员
    getUserUnderCrop () {
      this.$post({
        url: 'API@/login/corp/getCorpUsers',
        data: {},
        success: (res) => {
          if (res.code === '0000') {
            for (let i in res.result) {
              // 过滤数据
              if (util.isEmpty(res.result[i].userId) || util.isEmpty(res.result[i].userName)) {
                continue
              }
              this.userList.push({
                codeField: res.result[i].userId,
                nameField: res.result[i].userName
              })
            }
          }
        }
      })
    },
    // 重置查询表单
    resetForm  () {
      this.queryForm = {
        bossId: '', // 接单编号
        decPid: '', // 系统编号
        seqNo: '', // 统一编号
        entryId: '', // 报关单号
        status: '', // 状态
        createTimeStart: '', // 开始时间
        createUser: '', // 操作人
        createTimeEnd: '' // 结束时间
      }
      this.dates = []
    },
    // 设置默认的查询日期
    setDefualtDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 分页列表
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/ccba/review/decHisQuery',
        data: {
          ...this.queryForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.dataList = res.result
        }
      })
    },
    // 查询列表数据
    queryList () {
      if (this.dates === '' || this.dates === null) {
        this.queryForm.createTimeStart = ''
        this.queryForm.createTimeEnd = ''
      } else {
        this.queryForm.createTimeStart = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryForm.createTimeEnd = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.pageList(this.$store.state.pagination)
    },
    // 查看详情
    lookupDetail (row) {
      this.trackeParam = {
        'bossId': row.bossId,
        'decPid': row.decPid
      }
      this.trackeVisible = true
    },
    // 关闭组件
    closeTrackeCompnent () {
      this.trackeVisible = false
    },
    // 关闭组件
    receptionTrackeData () {
      this.trackeVisible = false
    },
    // 列表导出
    listExport () {
      // 导出
      this.$post({
        url: 'API@/dec-common/ccba/review/exportDecHisExcel',
        data: this.dataList,
        success: (res) => {
          res.result && window.open(res.result, '_blank')
        }
      })
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
  .query-btn {
    text-align: center;
  }
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  .op-btn {
    margin-bottom: 14px;
  }
</style>
