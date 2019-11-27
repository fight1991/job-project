<template>
  <section class='sys-main'>
    <!-- 查询条件 -->
    <div class="query-header">
      <el-form :model="queryForm" size="mini" :label-width="labelFormWidth.six">
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="总运单号">
              <el-input v-model="queryForm.billNo" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运输工具航次">
              <el-input v-model="queryForm.voyageNo" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申报日期" class="form-item-mg0">
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
          <el-table-column label="总运单号" min-width="120">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.billNo}}</div>
            </template>
          </el-table-column>
          <el-table-column label="主要货物名称" min-width="150">
            <template slot-scope="scope">
              <div class='sys-td-l'>{{scope.row.mainGName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="重量(公斤)" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-r'>{{scope.row.tGrossWt}}</div>
            </template>
          </el-table-column>
          <el-table-column label="总件数" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-r'>{{scope.row.tPackNo}}</div>
            </template>
          </el-table-column>
          <el-table-column label="申报日期" min-width="130">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.dDate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="110">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{formatStatus(scope.row.status)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                <el-button size="mini" class="table-icon list-icon-look" type="text" title="详情" @click="toDetail('detail',scope.row)"><i></i></el-button>
                <el-button size="mini" class="table-icon list-icon-declare" type="text" v-if="scope.row.status === 'DD'" @click="declare([scope.row.mftHeadPid])" title="申报"><i></i></el-button>
                <el-button size="mini" class="table-icon list-icon-delete" type="text" title="删除" v-if="scope.row.status === 'DD'" @click="del([scope.row.mftHeadPid])"><i></i></el-button>
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
export default {
  data () {
    return {
      dates: ['', ''],
      queryForm: {
        billNo: '',
        voyageNo: '',
        startTime: '',
        endTime: ''
      }, // 查询传参
      shipList: [], // 表格数据
      pages: {}, // 存放分页
      fileList: [], // 文件
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
        value: 'NN',
        label: '海关入库失败'
      }, {
        value: 'NY',
        label: '海关入库成功'
      }, {
        value: 'DN',
        label: '数据中心入库失败'
      }, {
        value: 'DY',
        label: '数据中心入库成功'
      }], // 状态
      selectData: [] // 多选框
    }
  },
  created () {
    this.search()
  },
  methods: {
    // 查询
    search () {
      this.pageList()
    },
    // 重置
    reset () {
      this.queryForm = {
        billNo: '',
        voyageNo: '',
        startTime: '',
        endTime: ''
      }
      this.dates = ['', '']
      this.search()
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
        url: 'API@/dec-common/nexp/customs/queryMftList',
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
      // let list = []
      // for (let i of this.selectData) {
      //   if (i.status === 'DD') {
      //     list.push(i.mftHeadPid)
      //   } else {
      //     this.$message({
      //       message: '当前数据不满足申报条件，无法进行申报',
      //       type: 'warning'
      //     })
      //     return false
      //   }
      // }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/nexp/customs/declareMft',
        data: {mftHeadPids: list},
        router: this.$router,
        success: (res) => {
          this.$message({
            message: res.result.statusValue,
            type: 'success'
          })
          this.search()
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
          type: 'warning'
        }).then(() => {
          let list = []
          for (let i of this.selectData) {
            if (i.status === 'DD') {
              list.push(i.mftHeadPid)
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
        url: 'API@/dec-common/nexp/customs/deleteMft',
        data: {mftHeadPids: list},
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
        url: 'API@/dec-common/nexp/customs/importManifests',
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
    // 跳转到详情
    toDetail (type, data) {
      this.$router.push({
        name: 'shipBillDetail',
        params: {
          type: type,
          id: data.mftHeadPid,
          status: data.status
        }
      })
    },
    // 下载
    download () {
      window.open('http://www.5itrade.cn:8084/files/ShippingBillTemplate/快件舱单导入模板.xlsx', '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.express-txt-c{
  text-align: center;
}
.mg-b-15{
  margin-bottom: 15px;
}
</style>
