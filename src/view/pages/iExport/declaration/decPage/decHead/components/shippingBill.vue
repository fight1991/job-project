<template>
  <!-- 舱单信息 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="舱单调取"
      :visible.sync="mftBillVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='openAfter'
      :before-close='closeMftBill'
      :show-close='true'
      v-loading="$store.state.loading"
      width="800px">
      <!-- 弹出框 集装箱信息 开始 -->
      <el-dialog :modal-append-to-body='false'
        title="集装箱信息"
        :visible.sync="containerVisible"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        class="sys-dec-class"
        :append-to-body='true'
        width="500px">
        <container-info :initParams="containerPara" @submitdatas="backContainerInfo" @closedecele="cancleContainerInfo" v-if="containerVisible"></container-info>
      </el-dialog>
      <!-- 弹出框 集装箱信息 结束 -->
      <div>
        <el-table
          ref="shippingTable"
          :data="shippingList"
          highlight-current-row border
          size='mini'
          :cell-class-name="deCellClass"
          @keydown.native.prevent='updownSelect'
          max-height="300" style="width: 100%">
          <el-table-column  min-width="50" label="单选">
            <template slot-scope="scope">
                <el-radio v-model="shippingRadio"  @keyup.enter.native="configBtn" :label="scope.$index">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column  property="customMaster" label="关区代码" min-width="80"></el-table-column>
          <el-table-column  property="trafMode" label="运输方式" min-width="80"></el-table-column>
          <el-table-column  property="iEFlag" label="提运单类型" min-width="100"></el-table-column>
          <el-table-column  property="trafName" label="运输工具名称" min-width="100"></el-table-column>
          <el-table-column  property="voyageNo" label="航班\航次" min-width="100"></el-table-column>
          <el-table-column  property="billNo" label="提运单号" min-width="200"></el-table-column>
          <el-table-column  property="iEDate" label="进出口日期" min-width="120"></el-table-column>
          <el-table-column  property="packNo" label="件数" min-width="50"></el-table-column>
          <el-table-column  property="wt" label="重量" min-width="60"></el-table-column>
          <el-table-column  property="iFlag" label="进境抵港确报标志" min-width="100"></el-table-column>
          <el-table-column  property="status" label="理货状态" min-width="100"></el-table-column>
          <el-table-column  property="eFlag" label="出口运抵状态" min-width="100"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:void(0)" class="list-icon-lookH border-0" title="查看" @click="shipDetail(scope.row)"><i class='dec-i'></i></a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer"  class="sys-dialog-footer  text-center">
        <el-button class='dialog-primary-btn' @click="openContainerInfo">查询集装箱</el-button>
        <el-button class='dialog-primary-btn' @click="configBtn">使用舱单数据</el-button>
        <el-button class='dialog-primary-btn' @click="closeMftBill">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 舱单数据明细 -->
    <shipping-detail :mftBillDetailVisible.sync='mftBillDetailVisible' :initParams="initParams" :shippingList='shippingListA' :mftContainerList='mftContainerList' @close:shippingBillDetail="mftBillDetailData"></shipping-detail>
  </section>
</template>

<script>
import util from '@/common/util.js'
import containerInfo from '../components/containerInfo'
import shippingDetail from '../components/shippingBillDetail'
export default {
  name: 'shipping-bill',
  components: {
    containerInfo,
    shippingDetail
  },
  props: {
    shippingList: {
      type: Array,
      require: true
    },
    mftBillVisible: {
      type: Boolean,
      default: false
    },
    initParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      shippingRadio: 0,
      containerVisible: false,
      containerPara: {},
      mftBillDetailVisible: false,
      mftContainerList: [],
      shippingListA: []
    }
  },
  methods: {
    openAfter () {
      if (this.shippingList.length > 0) {
        this.$nextTick(_ => {
          this.$refs['shippingTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[0].focus()
        })
      }
    },
    closeMftBill () {
      this.$emit('update:mftBillVisible', false)
    },
    // 返回选择舱单数据
    configBtn () {
      if (this.shippingList.length === 0) {
        this.messageTips('没有可调取的舱单数据!')
        return
      }
      this.$emit('close:shippingBill', {
        trafName: this.shippingList[this.shippingRadio].trafName, // 运输工具名称
        voyageNo: this.shippingList[this.shippingRadio].voyageNo, // 航次号
        billNo: this.shippingList[this.shippingRadio].billNo, // 提运单号
        packNo: this.shippingList[this.shippingRadio].packNo, // 件数
        wt: this.shippingList[this.shippingRadio].wt, // 毛重
        isShip: true
      })
    },
    // 开发集装箱信息弹出框
    openContainerInfo (flag) {
      // TODO
      // 请求选的的舱单数据对应的集装箱信息
      let param
      if (this.shippingList.length > 0) {
        param = {
          billNo: this.shippingList[this.shippingRadio].billNo,
          customMaster: this.initParams.customMaster,
          iEFlag: this.initParams.iEFlag
        }
      } else {
        param = {
          billNo: this.initParams.billNo,
          customMaster: this.initParams.customMaster,
          iEFlag: this.initParams.iEFlag
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/queryCusContainer',
        data: param,
        loading: true,
        success: (res) => {
          if (flag === 'detail') {
            this.mftContainerList = util.isEmpty(res.result) ? [] : res.result
            this.mftBillDetailVisible = true
          } else {
            if (res.code === '0000') {
              if (res.result !== null && res.result.length === 0) {
                this.messageTips('无集装箱信息！')
              } else {
                this.containerPara['list'] = res.result
                this.containerPara['customMaster'] = this.initParams.customMaster
                this.containerVisible = true
              }
            } else {
              this.messageTips(res.message, 'error')
            }
          }
        }
      })
    },
    // 反填集装箱信息
    backContainerInfo (result) {
      if (this.shippingList.length > 0) {
        this.$emit('close:shippingBill', {
          trafName: this.shippingList[this.shippingRadio].trafName, // 运输工具名称
          voyageNo: this.shippingList[this.shippingRadio].voyageNo, // 航次号
          billNo: this.shippingList[this.shippingRadio].billNo, // 提运单号
          packNo: this.shippingList[this.shippingRadio].packNo, // 件数
          wt: this.shippingList[this.shippingRadio].wt, // 毛重
          isShip: true,
          containerInfo: result.containerInfo // 集装箱信息
        })
      } else {
        this.$emit('close:shippingBill', {
          isShip: false,
          containerInfo: result.containerInfo // 集装箱信息
        })
      }
      this.containerVisible = false
    },
    // 取消反填集装箱信息
    cancleContainerInfo () {
      this.containerVisible = false
    },
    // 设置 不一样的字段是 颜色变红
    deCellClass ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 4) { // 运输工具名称
        if (row.trafName !== this.initParams.trafName) {
          return 'error-class'
        }
      } else if (columnIndex === 5) { // 航班\航次
        if (row.voyageNo !== this.initParams.voyageNo) {
          return 'error-class'
        }
      } else if (columnIndex === 6) { // 提运单号
        if (row.billNo !== this.initParams.billNo) {
          return 'error-class'
        }
      } else if (columnIndex === 8) { // 件数
        if (row.packNo.toString() !== this.initParams.packNo.toString()) {
          return 'error-class'
        }
      } else if (columnIndex === 9) { // 毛重
        if (row.wt.toString() !== this.initParams.wt.toString()) {
          return 'error-class'
        }
      }
    },
    // 上下键选择数据
    updownSelect (e) {
      // let browerType = navigator.userAgent
      // if (browerType.indexOf('Chrome') > -1) {
      //   return
      // }
      let len = this.shippingList.length
      if (len === 0) {
        return
      } else {
        len--
      }
      if (e && e.keyCode === 38) { // 上
        if (this.shippingRadio === 0) {
          this.shippingRadio = len
        } else {
          this.shippingRadio--
        }
      }
      if (e && e.keyCode === 40) { // 下
        if (this.shippingRadio === len) {
          this.shippingRadio = 0
        } else {
          this.shippingRadio++
        }
      }
    },
    // 舱单详情
    shipDetail (data) {
      this.shippingListA = []
      this.shippingListA.push(data)
      this.openContainerInfo('detail')
    },
    mftBillDetailData (param) {
      this.$emit('close:shippingBill', param)
      this.mftBillDetailVisible = false
    }
  }
}
</script>

<style scoped lang="less">
  .bill-label{
    font-size: 14px;
  }
  .bill-span{
    padding-left: 10px;
    font-size: 14px;
  }
  .bill-col{
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .bill-div{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
  }
  .error-class{
    color:red;
  }
  .yellow-mark {
    color: #E1A71D;
  }
  .text-center {
    text-align: center;
  }
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle
  }
</style>
