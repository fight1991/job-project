<template>
  <section class='sys-main'>
     <!-- 头部 -->
     <el-row class='sys-header'>
      <!-- 新建按钮 -->
      <el-row class='mg-b-15'>
        <el-col :span="18">
          <el-button type="primary" size="mini" @click="add">新建</el-button>
        </el-col>
      </el-row>
      <!-- 新建按钮 end-->
    </el-row>
    <el-row class = "query-condition data-center">
      <el-form :label-width="labelFormWidth.five" :model="queryForm" size="mini" label-position="right">
    <!-- 查询条件 -->
        <el-row>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="委托企业">
              <el-autocomplete
                size='mini' style="width:100%"
                :maxlength="20" clearable
                v-model="queryForm.corpName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="许可证名称">
               <el-select v-model="queryForm.licenseType" style="display: unset" default-first-option clearable :allow-create='true' filterable>
                <el-option
                  v-for="item in saasLicType"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField"
                 >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="许可证号">
              <el-input v-model="queryForm.licenseNo" clearable :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item class="form-item-mg0" label="可用次数">
              <el-select v-model="queryForm.availableNum"  clearable style="display:unset" >
                <el-option
                  label="一批一证"
                  value="1">
                </el-option>
                <el-option
                  label="非一批一证"
                  value="0">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :lg="12">
              <el-form-item label="上传时间" class="form-item-mg0"  >
                <el-date-picker size="mini"
                style="width:100%;"
                  v-model="dates"
                  type="daterange"
                  :editable='false'
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
       <!-- 查询条件 end-->
          <el-row style="text-align:center;">
            <el-button size="mini" type="primary" @click="search()">查询</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
        </el-row>
      </el-form>
    </el-row>
      <!-- 头部 end-->
      <!-- 主显示框 -->

      <div class='query-table'>
        <!-- 列表 list -->
        <el-row style="margin-bottom:12px;">
        <el-button  size="mini" @click="delect" :disabled='selection.length===0'  class="list-btns list-icon-delete"><i></i>删除</el-button>
        </el-row>
        <el-table class='sys-table-table'  height="398px" ref="licenseTable"
          border highlight-current-row size="mini" @select="selectionChange" @row-click='rowClickDecList'  @select-all='selectALl'
          :data="resultList">
          <el-table-column  type="selection" min-width="50"></el-table-column>
          <el-table-column label="委托企业" min-width="140" prop="corpName">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.corpName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="许可证名称" min-width="120" prop="licenseTypeValue">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.licenseTypeValue}}</div>
            </template>
          </el-table-column>
          <el-table-column label="监管证件代码" min-width="110" prop="licenseType">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.licenseType}}</div>
            </template>
          </el-table-column>
           <el-table-column label="许可证号" min-width="80">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.licenseNo}}</div>
            </template>
          </el-table-column>
          <el-table-column label="涉证商品" min-width="80">
            <template slot-scope="scope">
              <div class='sys-td-r'>{{scope.row.goodCount+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="许可证截止有效日期" min-width="150">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.expiryDate}}</div>
            </template>
          </el-table-column>
           <el-table-column label="可用次数" min-width="80">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.availableNumValue+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="剩余可用次数" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-r'>{{scope.row.lastCount+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" min-width="140">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.createTime+''}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                <el-button type="text" class="table-icon list-icon-look" @click="toDetailChild('detail',scope.row.licensePid,scope.row.ownerCodeScc)" title="查看"><i></i></el-button>
                <el-button type="text" class="table-icon list-icon-edit" @click="toEditChild('edit',scope.row.licensePid,scope.row.ownerCodeScc)" title="编辑"><i></i></el-button>
                <el-button type="text" class="table-icon list-icon-scan" @click="previewPicture(scope.row)" title="附件"><i></i></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-row class='sys-page-list'>
            <el-col :span="24" align="right">
                <page-box :pagination='paginationInit' @change="queryList"></page-box>
            </el-col>
        </el-row>
      </div>
  </section>
</template>

<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      queryForm: {
        corpName: '',
        startTime: '',
        endTime: ''
      },
      selectRow: [],
      selection: [],
      saasLicType: [], // 许可证类型
      dates: ['', ''],
      corpListOptions: [], // 委托企业
      resultList: [] // 表格数据
    }
  },
  created () {
    this.reset()
    this.paginationInit = this.$store.state.pagination
    this.corpList()
    this.search()
    this.getCommonParams()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path === '/dataCenter/license') {
        this.corpList()
        this.search()
      }
    }
  },
  methods: {
    // 新建
    add () {
      this.$router.push({
        name: 'addLicense'
      })
    },
    // 委托企业
    corpList (val) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/dccommon/queryLicenseCorps',
        data: val,
        router: this.$router,
        success: (res) => {
          if (res.success) {
            let json = JSON.stringify(res.result)
            json = json.replace(/ownerName/g, 'value')
            this.corpListOptions = JSON.parse(json)
          }
        }
      })
    },
    // 跳转到详情页面
    toDetailChild (type, licensePid, ownerCodeScc) {
      this.$router.push({
        path: '/dataCenter/license/manageDetail',
        query: {
          type: type,
          id: licensePid,
          ownerCodeScc: ownerCodeScc
        }
      })
    },
    // 预览图片
    previewPicture (file) {
      util.fileView(file.licenseUrl)
    },
    toEditChild (type, licensePid, ownerCodeScc) {
      this.$router.push({
        path: '/dataCenter/license/manageDetail',
        query: {
          type: type,
          id: licensePid,
          ownerCodeScc: ownerCodeScc
        }
      })
    },
    // 删除
    delect () {
      this.$confirm('确定删除当前选择的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-document-center/license/delete',
          data: {pid: this.selection},
          router: this.$router,
          success: (res) => {
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.search()
            }
          }
        })
      })
    },
    // 选择列表行
    rowClickDecList (row) {
      // 获取当前的pid
      if (this.selectRow.indexOf(row) >= 0) {
        this.selection.splice(this.selection.indexOf(row), 1)
        this.selectRow.splice(this.selectRow.indexOf(row), 1)
        this.$refs.licenseTable.toggleRowSelection(row, false)
      } else {
        this.selection.push(row.licensePid)
        this.selectRow.push(row)
        this.$refs.licenseTable.toggleRowSelection(row, true)
      }
    },
    selectALl (selection) {
      this.selection = []
      this.selectRow = []
      if (selection.length !== 0) {
        for (let a in selection) {
          this.selection.push(selection[a].licensePid)
        }
      }
      this.selectRow = selection
    },
    // 选择
    selectionChange (selection, row) {
      this.selection = []
      this.selectRow = []
      if (selection.length !== 0) {
        for (let a in selection) {
          this.selection.push(selection[a].licensePid)
          this.selectRow.push(row)
        }
        this.selectRow = selection
      }
    },
    // 输入2个字后搜索
    querySearch (queryString, cb) {
      if (this.queryForm.corpName.length < 2) {
        return
      }
      let restaurants = this.corpListOptions
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 获取公共字典list
    getCommonParams () {
      let par = ['SAAS_LICENSE']
      let tableNames = commonParam.isRequire(par)
      if (tableNames.length > 0) {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-dictionary/dictionary/getParam',
          data: {
            'tableNames': tableNames
          },
          router: this.$router,
          success: (res) => {
            commonParam.saveParams(res.result)
            this.saasLicType = JSON.parse(window.localStorage.getItem('SAAS_LICENSE'))
          }
        })
      } else {
        this.saasLicType = JSON.parse(window.localStorage.getItem('SAAS_LICENSE'))
      }
    },
    createFilter (queryString) {
      return (restaurant) => {
        if (util.isEmpty(restaurant.value)) {
          return false
        } else {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      }
    },
    // 查询
    search () {
      this.queryList(this.$store.state.pagination)
    },
    // 列表
    queryList (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
      } else {
        this.queryForm.startTime = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryForm.endTime = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/license/queryLicenseList',
        data: {
          ...this.queryForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.resultList = util.isEmpty(res.result) ? [] : res.result
          this.paginationInit = res.page
          this.selection = []
          this.selectRow = []
        }
      })
    },
    // 重置
    reset () {
      this.dates = ['', '']
      this.queryForm = {
        serviceName: '',
        startTime: '',
        endTime: ''
      }
      this.search()
    },
    // 跳转到详情页面
    toDetailList (corpSccCode, corpName) {
      this.$router.push({
        path: '/dataCenter/license/detailListLicense',
        query: {
          sccCode: corpSccCode,
          corpName: encodeURIComponent(corpName)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .query-condition {
    background-color: #fff;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .sys-main .form-item-mg0.el-form-item--mini.el-form-item {
    margin-bottom: 18px;
  }
  .query-table{
    padding:12px 18px;
  }
</style>
