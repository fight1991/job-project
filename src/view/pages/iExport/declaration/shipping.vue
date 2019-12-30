<template>
<!-- 出口导入模板 shipping 查询界面组件-->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.four" :model="queryShippingForm" size="mini" label-position="right">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6">
            <el-form-item label="分单号">
              <el-input v-model="queryShippingForm.hawbNo" maxlength="32" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item label="主单号">
              <el-input v-model="queryShippingForm.mawbNo" maxlength="32" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="导入日期">
              <el-date-picker title='导入日期' v-model="dates" style="width:100%"
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
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryShippingList" class= 'btn-padding' >查询</el-button>
            <el-button size="mini" @click="resetShippingForm" class= 'btn-padding'>重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
      <el-row class="op-btn">
        <el-dropdown trigger="click">
          <el-button size="mini" class="file-inputx list-btns list-icon-import"><i></i>导入</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-upload
                class="upload-demo"
                action="http://127.0.0.1"
                :before-upload="beforeUpload"
                :show-file-list="false">
                <span>选择文件导入</span>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item><div @click.stop="download">模板下载</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" class="list-btns list-icon-delete" @click="deleteFun"><i></i>删除</el-button>
        <el-button size="mini" class="list-btns list-icon-create" @click="createDeclare"><i></i>生成报关单</el-button>
        <div class="airvehicle-list-drop">
          <el-popover popper-class="airvehicle-table-popper">
            <ul>
              <li v-for="(item,index) in fieldList" :key="index">
                <el-checkbox size="mini" v-model="item.value" @change="columnFieldChange">{{item.text}}</el-checkbox>
              </li>
            </ul>
            <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
          </el-popover>
        </div>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table'
        :data="ShippingList" border highlight-current-row size="mini"
        @selection-change="changeFun" height="400px"
        :max-height="$store.state.tableHeight" >
        <el-table-column  type="selection" align='center' min-width="40"></el-table-column>
        <el-table-column label="接单编号" align='center' fixed prop="innerNo" min-width="120" v-if="fieldList[0].value"></el-table-column>
        <el-table-column label="主单号" align='left' fixed prop="mawbNo" min-width="100" v-if="fieldList[1].value"></el-table-column>
        <el-table-column label="分单号" align='left' fixed prop="hawbNo" min-width="100" v-if="fieldList[2].value"></el-table-column>
        <el-table-column label="备案号" align='center' fixed prop="emsNo" min-width="110" v-if="fieldList[3].value"></el-table-column>
        <el-table-column label="备案序号" align='left' fixed prop="gNo" min-width="100" v-if="fieldList[4].value"></el-table-column>
        <el-table-column label="申报地海关" align='left' prop="customMaster" min-width="100" v-if="fieldList[5].value"></el-table-column>
        <el-table-column label="出境关别" align='left' prop="iEPort" min-width="100" v-if="fieldList[6].value"></el-table-column>
        <el-table-column label="合同协议号" align='left' prop="contrNo" min-width="150" v-if="fieldList[7].value"></el-table-column>
        <el-table-column label="申报单位" align='left' prop="agentCode" min-width="100" v-if="fieldList[8].value"></el-table-column>
        <el-table-column label="监管方式" align='left' prop="tradeMode" min-width="100" v-if="fieldList[9].value"></el-table-column>
        <el-table-column label="征免性质" align='left' prop="cutMode" min-width="100" v-if="fieldList[10].value"></el-table-column>
        <el-table-column label="运抵国" align='left' prop="tradeCountry" min-width="100" v-if="fieldList[11].value"></el-table-column>
        <el-table-column label="成交方式" align='left' prop="transMode" min-width="100" v-if="fieldList[12].value"></el-table-column>
        <el-table-column label="包装种类" align='left' prop="wrapType" min-width="100" v-if="fieldList[13].value"></el-table-column>
        <el-table-column label="贸易国" align='left' prop="tradeAreaCode" min-width="100" v-if="fieldList[14].value"></el-table-column>
        <el-table-column label="离境口岸" align='left' prop="entyPortCode" min-width="100" v-if="fieldList[15].value"></el-table-column>
        <el-table-column label="报关单类型" align='left' prop="entryType" min-width="100" v-if="fieldList[16].value"></el-table-column>
        <el-table-column label="备注" align='left' prop="notes" min-width="300" v-if="fieldList[17].value"></el-table-column>
        <el-table-column label="其他事项确认" align='left' prop="promiseItmes" min-width="100" v-if="fieldList[18].value"></el-table-column>
        <el-table-column label="品名" align='left' prop="gName" min-width="100" v-if="fieldList[19].value"></el-table-column>
        <el-table-column label="货代名称" align='left' prop="forwardName" min-width="100" v-if="fieldList[20].value"></el-table-column>
        <el-table-column label="运输方式" align='left' prop="trafMode" min-width="100" v-if="fieldList[21].value"></el-table-column>
        <el-table-column label="发票号" align='left' prop="invNo" min-width="100" v-if="fieldList[22].value"></el-table-column>
        <el-table-column label="箱单号" align='left' prop="containerNo" min-width="100" v-if="fieldList[23].value"></el-table-column>
        <el-table-column label="FUNLOC" align='left' prop="funloc" min-width="100" v-if="fieldList[24].value"></el-table-column>
        <el-table-column label="件数" align='right' prop="packNo" min-width="50" v-if="fieldList[25].value"></el-table-column>
        <el-table-column label="毛重" align='right' prop="grossWt" min-width="50" v-if="fieldList[26].value"></el-table-column>
        <el-table-column label="净重" align='right' prop="netWt" min-width="50" v-if="fieldList[27].value"></el-table-column>
        <el-table-column label="成交数量" align='right' prop="gQty" min-width="80" v-if="fieldList[28].value"></el-table-column>
        <el-table-column label="法定第一数量" align='right' prop="qty1" min-width="100" v-if="fieldList[29].value"></el-table-column>
        <el-table-column label="法定第二数量" align='right' prop="qty2" min-width="100" v-if="fieldList[30].value"></el-table-column>
        <el-table-column label="总价" align='right' prop="declAmount" min-width="100" v-if="fieldList[31].value"></el-table-column>
        <el-table-column label="币制" align='left' prop="curr" min-width="50" v-if="fieldList[32].value"></el-table-column>
        <el-table-column label="航班号日期" align='center' prop="voyageDate" min-width="100" v-if="fieldList[33].value"></el-table-column>
        <el-table-column label="目的国" align='left' prop="destinationCountry" min-width="100" v-if="fieldList[34].value"></el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <!-- 进度条 -->
    <line-progress :url="'API@/dec-common/ccba/shipping/getShippingPercent'" @complete="progressOver" :visible.sync="lineProgressShow"></line-progress>
    <!-- 主显示框 end-->
  </section>
</template>

<script>
import util from '@/common/util'
import pickerOptions from '@/common/mixin/pickerOptions'
export default {
  name: 'shippingQuery',
  mixins: [pickerOptions],
  data () {
    return {
      queryShippingForm: {
        hawbNo: '', // 主单号
        mawbNo: '', // 分单号
        startDate: '', // 最近开始操作时间
        endDate: '' // 最近终止操作时间
      },
      lineProgressShow: false,
      dates: '', // 日期
      ShippingList: [], // 报关单模板存放列表
      checkedShipping: [], // 被选中的模板
      fileList: [], // 存放上传文件
      fieldList: [{
        value: true,
        text: '接单编号'
      }, {
        value: true,
        text: '主单号'
      }, {
        value: true,
        text: '分单号'
      }, {
        value: true,
        text: '账册手册号'
      }, {
        value: true,
        text: '备案序号'
      }, {
        value: true,
        text: '申报地海关'
      }, {
        value: true,
        text: '出境关别'
      }, {
        value: true,
        text: '合同协议号'
      }, {
        value: true,
        text: '申报单位'
      }, {
        value: true,
        text: '监管方式'
      }, {
        value: true,
        text: '征免性质'
      }, {
        value: true,
        text: '运抵国'
      }, {
        value: true,
        text: '成交方式'
      }, {
        value: true,
        text: '包装种类'
      }, {
        value: true,
        text: '贸易国'
      }, {
        value: true,
        text: '离境口岸'
      }, {
        value: true,
        text: '报关单类型'
      }, {
        value: true,
        text: '备注'
      }, {
        value: true,
        text: '其他事项确认'
      }, {
        value: true,
        text: '品名'
      }, {
        value: true,
        text: '货代名称'
      }, {
        value: true,
        text: '运输方式'
      }, {
        value: true,
        text: '发票号'
      }, {
        value: true,
        text: '集装箱号'
      }, {
        value: true,
        text: 'FUNLOC'
      }, {
        value: true,
        text: '件数'
      }, {
        value: true,
        text: '毛重'
      }, {
        value: true,
        text: '净重'
      }, {
        value: true,
        text: '成交数量'
      }, {
        value: true,
        text: '法一数量'
      }, {
        value: true,
        text: '法二数量'
      }, {
        value: true,
        text: '总金额'
      }, {
        value: true,
        text: '币制'
      }, {
        value: true,
        text: '航班号日期'
      }, {
        value: true,
        text: '目的国'
      }]
    }
  },
  created () {
    // 获取登陆用户信息
    this.getUserInfo()
    // 初始化查询日期
    this.setDefualtDate()
    // 初始化列表数据
    this.queryShippingList()
    // 过去生成进度
    // this.getProcess()
  },
  mounted () {
  },
  methods: {
    // 重置报关单模板的查询条件
    resetShippingForm  () {
      this.queryShippingForm = {
        mawbNo: '', // 主单号
        hawbNo: '', // 分单号
        startDate: '', // 最近开始操作时间
        endDate: '' // 最近终止操作时间
      }
      this.dates = []
    },
    // 报关单模板列表查询
    queryShippingList () {
      if (this.dates === '' || this.dates === null) {
        this.queryShippingForm.startDate = ''
        this.queryShippingForm.endDate = ''
      } else {
        this.queryShippingForm.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryShippingForm.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.pageList(this.$store.state.pagination)
    },
    // 分页列表
    pageList (pagination) {
      this.$post({
        url: 'API@/dec-common/ccba/shipping/getShippinglist',
        data: {
          ...this.queryShippingForm,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.ShippingList = res.result
        }
      })
    },
    // 设置默认的查询日期
    setDefualtDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 删除shipping
    deleteFun () {
      let len = this.checkedShipping.length
      if (len === 0) {
        this.messageTips('至少选择一条数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          // 删除
          let pidLit = []
          for (let i in this.checkedShipping) {
            pidLit.push(this.checkedShipping[i].pid)
          }
          this.$post({
            url: 'API@/dec-common/ccba/shipping/delShipping',
            data: {
              'list': pidLit
            },
            success: (res) => {
              this.messageTips(res.message, 'success')
              this.pageList()
            },
            other: (res) => {
              this.messageTips(res.message, 'error')
            }
          })
        }).catch(() => {
        })
      }
    },
    // 生成报关单
    createDeclare () {
      let len = this.checkedShipping.length
      if (len === 0) {
        this.messageTips('请选择需要生成报关单条数据')
        return
      }
      // 如果已经存在接单编号 则不能再次生成报关单
      let pidLit = []
      let otherPidList = []
      for (let i in this.checkedShipping) {
        if (util.isEmpty(this.checkedShipping[i].innerNo)) {
          pidLit.push(this.checkedShipping[i].pid)
        } else {
          otherPidList.push(this.checkedShipping[i].innerNo)
        }
      }
      if (otherPidList.length > 0) {
        this.messageTips('接单编号为：' + otherPidList.join('、') + '的数据已生成报关单，不可重复生成！')
        return
      }
      this.$post({
        url: 'API@/dec-common/ccba/shipping/shippingToDec',
        data: {list: pidLit},
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.lineProgressShow = true
          this.pageList()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    getProcess () {
      this.$post({
        url: 'API@/dec-common/ccba/shipping/getShippingPercent',
        data: {},
        isLoad: false,
        success: (res) => {
          this.percentage = res.result
          if (res.result !== '100' && !!res.result) {
            this.processDia = true
            setTimeout(this.getProcess, 3000)
          } else {
            let that = this
            setTimeout(function () { that.processDia = false }, 600)
            this.pageList()
          }
        }
      })
    },
    // 进度条完成之后
    progressOver () {
      this.pageList()
    },
    // 列表数据选择时的变化
    changeFun (val) {
      this.checkedShipping = util.simpleClone(val)
    },
    // 获取当前登陆的个人信息
    getUserInfo () {
      this.userId = this.$store.state.userLoginInfo.userId
      if (!util.isEmpty(this.userId)) {
        let fieldList = window.localStorage.getItem('shipping' + this.userId)
        if (!util.isEmpty(fieldList)) { // 如果表头显示有记录，用记录的表头显示
          let list = JSON.parse(fieldList)
          if (this.compareFieldList(this.fieldList, list)) {
            this.fieldList = JSON.parse(fieldList)
          } else {
            window.localStorage.setItem('shipping' + this.userId, JSON.stringify(this.fieldList))
          }
        }
      }
    },
    // 对比两个数组里的值是否一样
    compareFieldList (orig, compare) {
      if (orig.length === compare.length) {
        for (let i in orig) {
          if (orig[i].text !== compare[i].text) {
            return false
          }
        }
        return true
      } else {
        return false
      }
    },
    // 调节 查询table表 表头显示字段
    columnFieldChange (value) {
      // 每次表头列表变化都需要把当前需要显示的字段 存到localStorage里 下次按现在的显示
      // key值 为SIP tableHead SIP加当前用户的id
      window.localStorage.setItem('shipping' + this.userId, JSON.stringify(this.fieldList))
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
        httpUrl: fileList[0].url
      }
      this.$post({
        url: 'API@/dec-common/ccba/shipping/importShipping',
        data: data,
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.pageList()
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 模板下载
    download () {
      window.open('https://www.5itrade.cn/files/decTemplet/shippingTemp.xls', '_blank')
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
  .btn-padding {
    padding: 8px 20px !important;
  }
  .airvehicle-table-popper{
    min-width: auto;
    ul{
      height: 400px;
      overflow:auto;
        li{
            line-height: 20px;
            .el-checkbox__label{
                font-size: 12px;
            }
        }
    }
  }
  .airvehicle-list-drop {
    float: right;
  }
</style>
