<template>
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.seven" :model="QuerySuppDecForm" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="补充申报单类型">
              <el-select placeholder="" v-model="QuerySuppDecForm.supType"  filterable style="width:100%" >
                <el-option
                  v-for="item in supTypeList"
                  :key="item.code"
                  :label="item.code + ' ' + item.name"
                  :value="item.code"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="报关单编号" >
              <el-input v-model="QuerySuppDecForm.entryId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="统一编号" >
              <el-input v-model="QuerySuppDecForm.seqNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="补充申报单编号" >
              <el-input v-model="QuerySuppDecForm.supid"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="补充申报单统一编号" class= 'more-txt-lh'>
              <el-input v-model="QuerySuppDecForm.preSupid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="境内收发货人">
              <el-input v-model="QuerySuppDecForm.tradeCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="企业类别">
              <el-select placeholder="" v-model="QuerySuppDecForm.etpsCategory"  filterable style="width:100%">
                <el-option
                  v-for="item in etpsCategoryList"
                  :key="item.code"
                  :label="item.code + ' ' + item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col ::md="12" :lg="6">
            <el-form-item label="进出口标志">
              <el-select placeholder="" v-model="QuerySuppDecForm.iEFlag" style="width:100%" >
                <el-option
                  v-for="item in iEList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="24" :lg="12">
            <el-form-item label="操作日期">
              <el-date-picker  v-model="dates" style="width:100%"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                >
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
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
       <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-edit" @click="editDetail"><i></i>编辑</el-button>
        <el-button size="mini" class="list-btns list-icon-look" @click="lookDetail"><i></i>查看</el-button>
        <el-button size="mini" class="list-btns list-icon-print" @click="printSuppDec"><i></i>打印</el-button>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table' :data="suppDecList"
         border highlight-current-row size="mini"  :height="tableHeight"   >
        <el-table-column label=""  align='center'  min-width="35">
          <template slot-scope="scope">
              <input
              class="template-radio"
              :value="scope.$index"
              v-model="suppDecRadio"
              name = "copyGoods"
              @click="changeFun(scope.$index, scope.row)"
              type="radio"/>
            </template>
        </el-table-column>
        <el-table-column label="补充申报单编号" align='left' prop="supid" min-width="150"></el-table-column>
        <el-table-column label="补充申报单统一编号" align='left' prop="preSupid" min-width="150"></el-table-column>
        <el-table-column label="报关单编号" align='center' prop="entryId" min-width="150"></el-table-column>
        <el-table-column label="统一编号" align='center' prop="seqNo" min-width="100"></el-table-column>
        <el-table-column label="商品序号" align='left' prop="gNo" min-width="150"></el-table-column>
        <el-table-column label="商品编码" align='left' prop="codeTs" min-width="100"></el-table-column>
        <el-table-column label="补充申报日期" align='center' prop="declDate" min-width="80"></el-table-column>
        <el-table-column label="收发货人编码" align='left' prop="tradeCode" min-width="110"></el-table-column>
        <el-table-column label="补充申报类型" align='left' prop="supTypeValue" min-width="100"></el-table-column>
        <el-table-column label="报关状态" align='left' prop="statusValue" min-width="100"></el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import pickerOptions from '@/common/mixin/pickerOptions'
export default {
  name: 'decQueryTable',
  mixins: [pickerOptions],
  data () {
    return {
      QuerySuppDecForm: {
        etpsCategory: 'A', // 企业类别
        entryId: '', // 报关单号
        seqNo: '', // 统一编号
        tradeCode: '', // 境内收发货人
        supType: '', // 补充申报类型
        supid: '', // 补充申报单编号
        preSupid: '', // 补充申报单统一编号
        updateTimeStart: '', // 最近开始操作时间
        updateTimeEnd: '', // 最近终止操作时间
        iEFlag: 'I' // 进出口标志
      },
      dates: '', // 日期
      tableHeight: 400, // 默认高度
      suppDecList: [], // 报关单存放列表数据
      suppDecRadio: '', // 选择补充申报列表
      checkedData: {}, // 被选中的数据
      supTypeList: [
        {
          code: 'A',
          name: '价格补充申报单'
        }, {
          code: 'B',
          name: '归类补充申报单'
        }, {
          code: 'C',
          name: '原产地补充申报单'
        }],
      iEList: [
        {
          code: 'E',
          name: '出口'
        }, {
          code: 'I',
          name: '进口'
        }],
      etpsCategoryList: [
        {
          code: 'A',
          name: '报关申报单位'
        }, {
          code: 'B',
          name: '消费使用/生产销售单位'
        }, {
          code: 'C',
          name: '报关收发货人'
        }, {
          code: 'D',
          name: '报关录入单位'
        }],
    }
  },
  created () {
    // 初始化查询日期
    this.setDefualtDate()
    // 补充申报列表查询
    this.queryDecList()
  },
  mounted () {
  },
  methods: {
    resetDecForm  () {
      this.QuerySuppDecForm = {
        etpsCategory: 'A', // 企业类别
        entryId: '', // 报关单号
        seqNo: '', // 统一编号
        tradeCode: '', // 境内收发货人
        supType: '', // 补充申报类型
        supid: '', // 补充申报单编号
        preSupid: '', // 补充申报单统一编号
        updateTimeStart: '', // 最近开始操作时间
        updateTimeEnd: '', // 最近终止操作时间
        iEFlag: 'I' // 进出口标志
      }
      this.dates = []
    },
    // 补充申报列表查询
    queryDecList () {
      if (this.dates === '' || this.dates === null) {
        this.QuerySuppDecForm.updateTimeStart = ''
        this.QuerySuppDecForm.updateTimeEnd = ''
      } else {
        this.QuerySuppDecForm.updateTimeStart = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QuerySuppDecForm.updateTimeEnd = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
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
        url: 'API@/dec-common/dec/common/querySupplementList',
        data: {
          ...this.QuerySuppDecForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.suppDecList = res.result
        }
      })
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 报关单   recordList 备案清单 template 初始值模板
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoDecPage (funFlag, flag, operationType, pid = 'new') {
      let routeName
      let tabName
      if (funFlag === 'declaration') {
        if (flag === 'import') {
          if (operationType === 'look') {
            tabName = '进口报关单'
            routeName = 'importDecLook'
          } else if (operationType === 'edit') {
            tabName = '进口报关单'
            routeName = 'importDecEdit'
          }
        } else if (flag === 'export') {
          if (operationType === 'look') {
            tabName = '出口报关单'
            routeName = 'exportDecLook'
          } else if (operationType === 'edit') {
            tabName = '出口报关单'
            routeName = 'exportDecEdit'
          }
        }
      }
      if (funFlag === 'recordList') {
        if (flag === 'import') {
          if (operationType === 'look') {
            tabName = '进境备案清单'
            routeName = 'importRecordLook'
          } else if (operationType === 'edit') {
            tabName = '进境备案清单'
            routeName = 'importRecordEdit'
          }
        } else if (flag === 'export') {
          if (operationType === 'look') {
            tabName = '出境备案清单'
            routeName = 'exportRecordLook'
          } else if (operationType === 'edit') {
            tabName = '出境备案清单'
            routeName = 'exportRecordEdit'
          }
        }
      }
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + operationType + pid
        }
      })
    },
    changeFun (index, row) {
      this.checkedData = row
    },
    // 查看详情
    lookDetail () {
      if (this.checkedData.length === 0) {
        this.messageTips('选择一条数据', 'error')
        return false
      }
      window.sessionStorage.setItem('isSuppDec', true)
      this.gotoDecPage('declaration', this.checkedData.iEFlag === 'I' ? 'import' : 'export', 'look', this.checkedData.decPid)
    },
    // 编辑
    editDetail () {
      if (this.checkedData.length === 0) {
        this.messageTips('选择一条数据', 'error')
        return false
      }
      if (util.isExistInArray(this.checkedData.status, ['2', '4', '5', '7', '8', '9', '10', '11'])) {
        this.messageTips('当前数据状态不能编辑')
        return false
      }
      window.sessionStorage.setItem('isSuppDec', true)
      this.gotoDecPage('declaration', this.checkedData.iEFlag === 'I' ? 'import' : 'export', 'edit', this.checkedData.decPid)
    },
    // 打印 补充申报
    printSuppDec () {
      let pid = []
      if (this.checkedData.length === 0) {
        this.messageTips('选择一条数据')
        return false
      }
      pid.push(this.checkedData.pid.toString())
      this.$post({
        url: 'API@/dec-common/dec/common/exportSupplementPdf',
        data: {
          'supIds': pid,
          ieFlag: this.checkedData.iEFlag
        },
        success: (res) => {
          for (let i in res.result) {
            window.open(res.result[i], '_blank')
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
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
  .template-radio{
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }
</style>
