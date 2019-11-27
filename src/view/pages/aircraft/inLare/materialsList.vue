<template>
  <section class='sys-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.five" :model="QueryForm" size="mini">
        <el-row :gutter="50">
          <el-col :md="12" :lg="6">
            <el-form-item label="航空器注册编号" class="more-txt-lh">
              <el-input size="mini" v-model="QueryForm.aircraftNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="供退标志">
              <el-select style="width:100%" v-model="QueryForm.iOFlag" clearable size="mini">
                <el-option v-for="item in signList" :label="item.text" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="12">
            <el-form-item label="填写时间">
              <el-date-picker size="mini" v-model="dates" style="width:100%"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="进港航班号">
              <el-input size="mini" v-model="QueryForm.flightNo" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="query-btn" style="text-align:center">
          <el-button size="mini" type="primary" class="primary-btn" @click="search">查询</el-button>
          <el-button size="mini" class="default-btn" @click="reset">重置</el-button>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <div class="query-table-common">
      <!-- 操作按钮 -->
      <el-row class="table-btn">
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1"
          :before-upload="beforeUpload"
          :show-file-list="false">
          <el-button size="mini" class="file-inputx list-btns list-icon-import"><i></i>导入</el-button>
        </el-upload>
        <el-button size="mini" class="list-btns list-icon-copy" @click="copyData"><i></i>复制</el-button>
        <el-button size="mini" class="list-btns list-icon-delete" @click="delData"><i></i>删除</el-button>
        <el-button size="mini" class="list-btns list-icon-declare" @click="declare"><i></i>申报</el-button>
        <div class="last-btn">
          <div class="airvehicle-list-drop">
            <el-popover popper-class="airvehicle-table-popper">
              <ul>
                <li v-for="(item,index) in thList" :key="index">
                  <el-checkbox size="mini" v-model="item.value">{{item.text}}</el-checkbox>
                </li>
              </ul>
              <el-button size="mini" class="list-btns list-btn-drop" icon="list-icon-dropdown" slot="reference"></el-button>
            </el-popover>
          </div>
        </div>
      </el-row>
      <!-- 操作按钮 end -->
      <!-- 列表 -->
      <el-table class='sys-table-table' :data="resultList" border highlight-current-row size="mini" @selection-change="selectVal" :height="tabHeight">
        <el-table-column  type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="系统编号" prop="supbckDynPid" align="left" min-width="120" v-if="thList[0].value"></el-table-column>
        <el-table-column label="单一窗口编号" prop="swSeqId" align="left" min-width="150" v-if="thList[1].value"></el-table-column>
        <el-table-column label="航空器注册编号" prop="aircraftNo" align="left" min-width="150" v-if="thList[2].value"></el-table-column>
        <el-table-column label="航班日期" min-width="120" align="center" v-if="thList[3].value">
          <template slot-scope="scope">
            <div>{{scope.row.flightDate | date('yyyy-MM-dd')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="进港航班号" prop="flightNo" align="left" min-width="150" v-if="thList[4].value"></el-table-column>
        <el-table-column label="供退标志" align="center" min-width="110" v-if="thList[5].value">
          <template slot-scope="scope">
            <div>{{formatFlag(scope.row.iOFlag)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="填写时间" align="center" min-width="150" v-if="thList[6].value">
          <template slot-scope="scope">
            <div>{{scope.row.createTime | date()}}</div>
          </template>
        </el-table-column>
        <el-table-column label="海关状态" align="left" min-width="110" v-if="thList[7].value">
          <template slot-scope="scope">
            <a href="javascript:void(0)" style='color: #287fca;' @click="lookReturnInfo(scope.row.supbckDynPid)">{{scope.row.rcptStatusValue}}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作状态" prop="xmlStatusValue" align="left" min-width="110" v-if="thList[8].value"></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="list-icon-edit pad0" title="编辑" v-if="scope.row.rcptStatus !== 'REC' && scope.row.rcptStatus !== 'ACC' && scope.row.rcptStatus !== 'WMA' && scope.row.rcptStatus !== 'END'" @click="editDetail('edit',scope.row.supbckDynPid)"><i class="air-i"></i></el-button>
            <el-button size="mini" type="text" class="list-icon-look pad0" title="详情" @click="editDetail('detail',scope.row.supbckDynPid)"><i class="air-i"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
          <page-box :pagination.sync="paginationInit" @change="pageList"></page-box>
        </el-col>
      </el-row>
      <!--分页end-->
      <!-- 列表 end -->
    </div>
    <!-- 回执 -->
    <return-info :data="returnList" :pid="listPid" type="CDS_SUPPLIES_LIST" @colseTemplate="closeReturn" v-if="returnVisable"></return-info>
    <!-- 回执 end -->
  </section>
</template>
<script>
import util from '@/common/util'
import returnInfo from '../component/returnDetail.vue'

export default {
  data () {
    return {
      dates: ['', ''],
      QueryForm: {
        aircraftNo: '',
        flightNo: '',
        createTimeStart: '',
        createTimeEnd: '',
        iOFlag: ''
      }, // 查询传参
      resultList: [], // 表格数据
      signList: [{
        value: 'S',
        text: '供机'
      }, {
        value: 'R',
        text: '退机'
      }],
      thList: [{
        value: true,
        text: '系统编号'
      }, {
        value: true,
        text: '单一窗口编号'
      }, {
        value: true,
        text: '航空器注册编号'
      }, {
        value: true,
        text: '航班日期'
      }, {
        value: true,
        text: '进港航班号'
      }, {
        value: true,
        text: '供退标志'
      }, {
        value: true,
        text: '填写时间'
      }, {
        value: true,
        text: '海关状态'
      }, {
        value: true,
        text: '操作状态'
      }], // 表头
      pickerOptions2: {
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
      },
      selectData: [], // 多选框的val
      fileList: [],
      returnList: [], // 回执数据
      listPid: '', // 主键
      tabHeight: '450px', // 表格高度
      returnVisable: false // 回执信息
    }
  },
  components: {
    returnInfo
  },
  created () {
    this.dates = [util.getNdayDate(new Date(), -30), new Date()]
    this.search()
  },
  mounted () {
  },
  methods: {
    // 查询
    search () {
      this.pageList(this.$store.state.pagination)
    },
    // 重置
    reset () {
      this.QueryForm = {
        aircraftNo: '',
        flightNo: '',
        createTimeStart: '',
        createTimeEnd: '',
        iOFlag: ''
      }
      this.dates = [util.getNdayDate(new Date(), -30), new Date()]
      this.search()
    },
    // 格式化供退标志
    formatFlag (val) {
      let value = ''
      for (let i = 0; i < this.signList.length; i++) {
        if (this.signList[i].value === val) {
          value = this.signList[i].text
          break
        }
      }
      return value
    },
    // 获取表格数据
    pageList (pagination) {
      this.tabHeight = '450px'
      this.returnVisable = false
      if (this.dates === '' || this.dates === null) {
        this.QueryForm.createTimeStart = ''
        this.QueryForm.createTimeEnd = ''
      } else {
        this.QueryForm.createTimeStart = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.QueryForm.createTimeEnd = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/other/getCdsSuppliesList',
        data: {
          ...this.QueryForm,
          page: pagination
        },
        router: this.$router,
        success: (res) => {
          this.paginationInit = res.page || {}
          this.resultList = res.result || []
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
      let data = {
        httpUrl: fileList[0].url,
        type: '07'
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/other/importCdsOtherData',
        data: data,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.search()
        }
      })
    },
    // 多选框
    selectVal (val) {
      this.selectData = val
    },
    // 复制
    copyData () {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择需要复制的数据',
          type: 'error'
        })
        return false
      }
      let data = util.simpleClone(this.selectData)
      for (let i of data) {
        i.supbckDynPid = ''
        i.createTime = ''
        i.createUser = ''
        i.updateTime = ''
        i.updateUser = ''
        i.xmlStatus = ''
        i.xmlStatusValue = ''
        i.xmlUrl = ''
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/other/saveCdsAirSuppliesDeclareVO',
          data: i,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '复制成功',
              type: 'success'
            })
            this.search()
          }
        })
      }
    },
    // 删除
    delData () {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'error'
        })
        return false
      }
      this.$confirm('确定删除选中数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        let ids = []
        for (let i of this.selectData) {
          ids.push(i.supbckDynPid)
        }
        let data = {
          ids: ids,
          type: '5'
        }
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/common/deleteCds',
          data: data,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.search()
          }
        })
      }).catch(() => {
      })
    },
    // 申报
    declare () {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择需要申报的数据',
          type: 'error'
        })
        return false
      }
      let ids = []
      for (let i of this.selectData) {
        ids.push(i.supbckDynPid)
      }
      let data = {
        ids: ids,
        operType: '1'
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/declareSupplyMaterial',
        data: data,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: res.result.msg,
            type: 'success'
          })
          this.search()
        }
      })
    },
    // 跳转到编辑详情页
    editDetail (type, id) {
      let title = type === 'edit' ? '供退物料申报修改' : '供退物料申报详情'
      this.$router.push({
        name: 'materialsListDetail',
        params: {
          type: type,
          id: id,
          setTitle: title + '-' + id,
          setId: this.$route.name + type + id
        }
      })
    },
    // 查看回执
    lookReturnInfo (pid) {
      this.listPid = pid
      this.returnList = []
      let data = {
        pid: pid,
        type: 'CDS_AIR_SUPPLIES'
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/getCdsRecords',
        data: data,
        router: this.$router,
        success: (res) => {
          this.returnList = util.isEmpty(res.result) ? [] : res.result
          this.returnVisable = true
          this.tabHeight = '250px'
        }
      })
    },
    // 关闭回执
    closeReturn () {
      this.returnVisable = false
      this.tabHeight = '450px'
    }
  }
}
</script>
<style lang="less" scoped>
@import (less) '../css/common.less';
</style>
