<template>
  <section class='sys-main'>
     <!-- 头部 -->
    <el-row class='sys-header'>
      <!-- 返回按钮 -->
      <el-row class='mg-b-15'>
        <el-col :span='12' :xs='24'>
          <span @click="back" class="sys-back-btn"><i class="back-btn"></i>返回</span>
        </el-col>
        <el-col :span='12' :xs='24'>
          <el-button type="primary" size="mini" @click="add()" class="sys-fr">新建</el-button>
        </el-col>
      </el-row>
      <!-- 返回按钮 end-->
       <el-row class = "query-condition">
        <el-col :span="12">
          委托企业：<span class="top-text">{{detailForm.corpName}}</span>
        </el-col>
        <el-col :span="12">
          许可证数：<span class="top-text">{{count + ''}}</span>
        </el-col>
      </el-row>
        <el-row class = "query-body">
          <el-form label-width="0px" :model="detailForm" size="mini" label-position="right">
        <!-- 查询条件 -->
            <el-row :gutter="50">
              <el-col :span="6" :xs="12">
                <el-form-item class="form-item-mg0">
                  <el-input size="mini" clearable v-model="detailForm.input" placeholder="许可证号、涉证商品编号"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8" :xs="12">
                  <el-form-item :label-width="labelFormWidth.four" label="上传日期" class="form-item-mg0">
                  <el-date-picker size="mini"  style="width:100%;"
                    v-model="dates"
                    @change="search()"
                    type="daterange"
                    :editable='false'
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="10" :xs="12">
                <el-button size="mini" type="primary" @click="search()">查询</el-button>
                <el-button size="mini" @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
          <!-- 查询条件 end-->
          </el-form>
        </el-row>
      </el-row>
    <!-- 头部 end-->
    <!-- 主显示框 -->
    <div class='query-table'>
      <!-- 列表 list -->
      <el-row>
      <el-table class='sys-table-table' height="422px"
        border highlight-current-row size="mini"
        :data="resultList">
        <el-table-column type="expand" label="更多">
          <template slot-scope="scope">
            <div class='sys-table-detail-expand'>
              <el-row :gutter="20">
                <el-col :span="24" style="padding:0;">
                  <el-table class='sys-table-table' :data="scope.row.licenseInfos">
                    <el-table-column label="上传时间" min-width="200">
                      <template slot-scope="scope">
                        <div class='sys-td-c'>{{scope.row.updateTime || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="许可证号" min-width="200">
                      <template slot-scope="scope">
                        <div class='sys-td-l'>{{scope.row.licenseNo || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="涉证商品" min-width="100">
                      <template slot-scope="scope">
                        <div class='sys-td-r'>{{scope.row.goodCount || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="许可证截止有效日期" min-width="200">
                      <template slot-scope="scope">
                        <div class='sys-td-c'>{{scope.row.expiryDate || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="可用次数" min-width="100">
                      <template slot-scope="scope">
                        <div class='sys-td-r'>{{scope.row.availableNumValue || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="剩余可用数量" min-width="100">
                      <template slot-scope="scope">
                        <div class='sys-td-r'>{{scope.row.lastCount + '' || '-'}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                      <template slot-scope="scope">
                        <div class='sys-td-c'>
                          <el-button type="text" class="table-icon list-icon-look" @click="toDetailChild('detail',scope.row.licensePid,scope.row.ownerCodeScc)" title="查看"><i></i></el-button>
                          <el-button type="text" class="table-icon list-icon-edit" @click="toEditChild('edit',scope.row.licensePid,scope.row.ownerCodeScc)" title="编辑"><i></i></el-button>
                          <el-button type="text" class="table-icon list-icon-scan" @click="previewPicture(scope.row)" title="附件"><i></i></el-button>
                          <el-button type="text" class="table-icon list-icon-delete" @click="deleteBtn(scope.row.licensePid,scope.row.lastCount)" title="删除"><i></i></el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="许可证名称" min-width="200">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.licenseTypeValue || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="监管证件代码" min-width="200">
          <template slot-scope="scope">
            <div class='sys-td-l'>{{scope.row.licenseType || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="许可证数" min-width="100">
          <template slot-scope="scope">
            <div class='sys-td-r' style="padding-right:10px">{{scope.row.count || '-'}}</div>
          </template>
        </el-table-column>
      </el-table>
      </el-row>
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
export default {
  data () {
    return {
      detailForm: {
        corpName: '',
        sccCode: '',
        input: '',
        startTime: '',
        endTime: ''
      },
      count: '',
      dates: ['', ''],
      resultList: [
        {
          licenseTypeValue: '',
          licenseType: '',
          count: '',
          licenseInfos: []
        }
      ] // 表格数据
    }
  },
  created () {
    this.reset()
    this.paginationInit = this.$store.state.pagination
    this.detailForm.sccCode = this.$route.query.sccCode
    this.detailForm.corpName = util.isEmpty(this.$route.query.corpName) ? '' : decodeURIComponent(this.$route.query.corpName)
    this.search()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('detailListLicense') === -1) {
        return
      }
      this.reset()
      this.paginationInit = this.$store.state.pagination
      this.detailForm.sccCode = to.query.sccCode
      this.detailForm.corpName = util.isEmpty(to.query.corpName) ? '' : decodeURIComponent(to.query.corpName)
      this.search()
    }
  },
  methods: {
    // 返回按钮
    back () {
      this.$router.push({
        name: 'license'
      })
    },
    // 新建
    add () {
      this.$router.push({
        path: '/dataCenter/license/addLicense',
        query: {
          ownerCodeScc: this.detailForm.sccCode,
          corpName: encodeURIComponent(this.detailForm.corpName)
        }
      })
    },
    // 查询
    search () {
      this.queryList(this.$store.state.pagination)
    },
    // 重置查询条件
    resetQuery () {
      this.dates = ['', '']
      this.detailForm = {
        sccCode: this.$route.query.sccCode,
        corpName: util.isEmpty(this.$route.query.corpName) ? '' : decodeURIComponent(this.$route.query.corpName),
        input: '',
        startTime: '',
        endTime: ''
      }
      this.search()
    },
    // 列表
    queryList (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.detailForm.startTime = ''
        this.detailForm.endTime = ''
      } else {
        this.detailForm.startTime = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.detailForm.endTime = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/license/queryLicenseTypeList',
        data: {
          ...this.detailForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          if (!util.isEmpty(res.result)) {
            this.resultList = util.isEmpty(res.result.licenses) ? [] : res.result.licenses
            this.count = res.result.count
            this.paginationInit = res.page
          } else {
            this.resultList = []
          }
        }
      })
    },
    // 重置
    reset () {
      this.count = ''
      this.detailForm = {
        sccCode: '',
        corpName: '',
        input: '',
        startTime: '',
        endTime: ''
      }
      this.dates = ['', '']
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
    // 预览图片
    previewPicture (file) {
      util.fileView(file.licenseUrl)
    },
    // 删除
    deleteBtn (val, num) {
      if (parseInt(num) > 0) {
        this.$confirm('当前许可证尚有可用数量的剩余，若进行删除，可能影响后续报关，是否确定删除当前许可证？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          this.deleteDispatch(val)
        }).catch(() => {
        })
      } else {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          this.deleteDispatch(val)
        }).catch(() => {
        })
      }
    },
    deleteDispatch (val) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/license/delete',
        data: {pid: val},
        router: this.$router,
        success: (res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.search()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .query-condition {
    background-color: #fff;
    padding: 20px;
  }
  .top-text{
    padding-left: 10px;
    color: @font-color-main;
    font-size: 14px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px 20px 20px 20px;
    margin-top: 20px;
  }
  .sys-back-btn{
    display: inline-block;
    font-size: 13px;
    color: @font-color-main;
    vertical-align: middle;
    cursor: pointer;
    .back-btn{
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 5px;
        background: url('../../../../assets/img/icon/back.png') no-repeat center center;
        background-size: 100%;
        vertical-align: middle;
    }
}
  .sys-fr{
    float: right;
  }
  .sys-table-detail-expand{
    padding:0 15px;
    .detail-infos:last-child{
        border-bottom: 1px solid #dfe6ec;
    }
}
</style>
