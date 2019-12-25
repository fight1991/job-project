<template>
<!-- 初始值模板 查询界面组件-->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.six" :model="QueryDecForm" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="境内收发货人">
              <el-input v-model="QueryDecForm.tradeCode" clearable placeholder="海关编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="消费使用/生产销售单位" class='more-txt-lh'>
              <el-input v-model="QueryDecForm.ownerCode" clearable placeholder="海关编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="申报单位" >
              <el-input v-model="QueryDecForm.agentCode" clearable placeholder="海关编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="模板名称" >
              <el-input v-model="QueryDecForm.templateName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="进出口标志">
              <el-select placeholder="" v-model="QueryDecForm.iEFlag" filterable style="width:100%">
                <el-option
                  v-for="item in iEList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="最近操作时间">
              <el-date-picker title='进出口日期' v-model="dates" style="width:100%"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryDecList" style="padding: 8px 20px;">查询</el-button>
            <el-button size="mini" @click="resetDecForm" style="padding: 8px 20px;">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table  dec-query-table'>
      <!-- 操作 -->
       <el-row class="op-btn">
        <el-dropdown @command="addTemplate">
          <el-button size="mini" class="list-btns list-icon-add"><i></i>新增</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="import">进口</el-dropdown-item>
            <el-dropdown-item command="export">出口</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-edit"  @click="editDetail"><i></i>编辑</el-button>
        <el-button size="mini" class="list-btns list-icon-delete"  @click="delDecTemplate"><i></i>删除</el-button>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table  dec-table' :data="templateQueryList" border highlight-current-row size="mini" @selection-change="changeFun" height="400px"  :max-height="$store.state.tableHeight" >
        <el-table-column  type="selection"  align='center' min-width="40"></el-table-column>
        <el-table-column label="模板名称"  align='left' prop="settingsName" min-width="150"></el-table-column>
        <el-table-column label="境内收发货人"  align='left' prop="tradeCode" min-width="150"></el-table-column>
        <el-table-column label="社会信用代码"  align='center' prop="agentCodeScc" min-width="150"></el-table-column>
        <el-table-column label="企业名称"  align='left' prop="agentName" min-width="100"></el-table-column>
        <el-table-column label="最近操作时间"  align='center' prop="updateTime" min-width="150">
        </el-table-column>
        <el-table-column label="创建人"  align='left' prop="createUser" min-width="100"></el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 主显示框 end-->
  </section>
</template>

<script>
import util from '@/common/util'
import pickerOptions from '@/common/mixin/pickerOptions'
export default {
  name: 'decTemplateQuery',
  mixins: [pickerOptions],
  data () {
    return {
      QueryDecForm: {
        tradeCode: '', // 收发货人
        ownerCode: '', // 消费使用单位
        agentCode: '', // 报关申报单位
        templateName: '', // 模板名称
        updateTimeStart: '', // 最近开始操作时间
        updateTimeEnd: '', // 最近终止操作时间
        iEFlag: '' // 进出口标志
      },
      dates: '', // 日期
      templateQueryList: [], // 报关单模板存放列表
      checkedTemplate: [], // 被选中的模板
      iEList: [
        {
          code: '',
          name: '全部'
        }, {
          code: 'E',
          name: '出口'
        }, {
          code: 'I',
          name: '进口'
        }]
    }
  },
  created () {
    // 初始化查询日期
    this.setDefualtDate()
    // 初始化报关单模板列表数据
    this.queryDecList()
  },
  mounted () {
  },
  filters: {
    changeTime (value) {
      let d = new Date(value)
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    }
  },
  methods: {
    // 重置报关单模板的查询条件
    resetDecForm  () {
      this.QueryDecForm = {
        tradeCode: '', // 收发货人
        ownerCode: '', // 消费使用单位
        agentCode: '', // 报关申报单位
        templateName: '', // 模板名称
        updateTimeStart: '', // 最近开始操作时间
        updateTimeEnd: '', // 最近终止操作时间
        iEFlag: '' // 进出口标志
      }
      this.dates = []
    },
    // 报关单模板列表查询
    queryDecList () {
      if (this.dates === '' || this.dates === null) {
        this.QueryDecForm.updateTimeStart = ''
        this.QueryDecForm.updateTimeEnd = ''
      } else {
        this.QueryDecForm.updateTimeStart = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryDecForm.updateTimeEnd = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.pageList(this.$store.state.pagination)
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
        url: 'API@/dec-common/dec/initSetting/queryInitList',
        data: {
          ...this.QueryDecForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.templateQueryList = res.result
        }
      })
    },
    // 跳转 查看界面
    lookupDetail () {
      let len = this.checkedTemplate.length
      if (len === 0) {
        this.messageTips('请选择一条需要查看的数据')
      } else if (len > 1) {
        this.messageTips('只能选择一条需要查看的数据')
      } else {
        let row = this.checkedTemplate[0]
        this.gotoDecTemplatePage(row.iEFlag === 'I' ? 'import' : 'export', 'look', row.decPid.toString())
      }
    },
    // 跳转编辑页面
    editDetail () {
      let len = this.checkedTemplate.length
      if (len === 0) {
        this.messageTips('请选择一条需要编辑的数据')
      } else if (len > 1) {
        this.messageTips('只能选择一条需要编辑的数据')
      } else {
        let row = this.checkedTemplate[0]
        this.gotoDecTemplatePage(row.iEFlag === 'I' ? 'import' : 'export', 'edit', row.decPid.toString())
      }
    },
    // 新增报关单
    addTemplate (iEFlag) {
      this.gotoDecTemplatePage(iEFlag, 'add')
    },
    /**
     * 跳转 新增、详情、编辑
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoDecTemplatePage (flag, operationType, pid = 'new') {
      let routeName
      let tabName
      if (flag === 'import') {
        tabName = '进口报关单模板'
        if (operationType === 'add') {
          routeName = 'iDecTemplateAdd'
        } else if (operationType === 'edit') {
          routeName = 'iDecTemplateEdit'
        }
      } else if (flag === 'export') {
        tabName = '出口报关单模板'
        if (operationType === 'add') {
          routeName = 'eDecTemplateAdd'
        } else if (operationType === 'edit') {
          routeName = 'eDecTemplateEdit'
        }
      }
      let setTitle = ''
      if (operationType === 'add') {
        setTitle = tabName
      } else {
        setTitle = tabName + '-' + pid
      }
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': setTitle,
          'setId': routeName + operationType + pid
        }
      })
    },
    // 删除报关单模板
    delDecTemplate () {
      let len = this.checkedTemplate.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          let pidLit = []
          for (let i in this.checkedTemplate) {
            pidLit.push(this.checkedTemplate[i].decPid)
          }
          this.$post({
            url: 'API@/dec-common/dec/initSetting/delDecInit',
            data: {
              'initHeadIds': pidLit
            },
            success: (res) => {
              this.messageTips(res.message, 'success')
              this.pageList()
            }
          })
        }).catch(() => {
        })
      }
    },
    // 列表数据选择时的变化
    changeFun (val) {
      this.checkedTemplate = util.simpleClone(val)
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
</style>
