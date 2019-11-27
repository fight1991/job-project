<template>
  <!-- 舱单详情 -->
  <section>
    <el-dialog :modal-append-to-body='false' title="舱单数据明细" :visible.sync="mftBillDetailVisible" :close-on-click-modal='false' :close-on-press-escape='false' v-loading="$store.state.loading" width="800px" @opened='openAfter'>
      <div class='dec-div mg-b-15'>
        <el-form :model="billData" size="mini" label-width="105px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="运输方式">
                <el-input v-model="billData.trafMode" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运输工具名称">
                <el-input v-model="billData.trafName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="航次号">
                <el-input v-model="billData.voyageNo" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提运单号">
                <el-input v-model="billData.billNo" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="shippingTable" class="mg-b-15" highlight-current-row style="width: 100%" size="mini" border :cell-class-name="deCellClass">
        <el-table-column label="标题" min-width="60" prop="fieldName" align="center"></el-table-column>
        <el-table-column label="智慧通关" min-width="120" prop="inputField" align="center"></el-table-column>
        <el-table-column label="原始/预配" min-width="120" prop="requestField" align="center"></el-table-column>
        <el-table-column label="运抵" min-width="120" prop="destina" align="center"></el-table-column>
        <el-table-column label="对比结果" min-width="120" prop="compare" align="center">
          <template slot-scope="scope">
            <span :class="{'isRed': !scope.row.compare}">{{scope.row.compare? 'YES': 'NO'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="mftContainerList" highlight-current-row :height='150' style="width: 100%" size="mini" border>
        <!-- <el-table-column type="index" label="序号" min-width="80"></el-table-column> -->
        <el-table-column label="智慧通关箱号" min-width="80" prop="none1"></el-table-column>
        <el-table-column label="原始/预配箱号" min-width="80" prop="no"></el-table-column>
        <el-table-column label="运抵箱号" min-width="80" prop="none2"></el-table-column>
        <el-table-column label="校验结果" min-width="80" prop="result"></el-table-column>
      </el-table>
      <div slot="footer" class="sys-dialog-footer" align="center">
        <el-button class='dialog-primary-btn' type="primary" size="mini" @click="backContainerInfo">回填集装箱</el-button>
        <el-button class='dialog-primary-btn' type="primary" size="mini" @click="backShipInfo">回填舱单数据</el-button>
        <el-button class='dialog-btn' size="mini" @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data () {
    return {
      billData: {},
      shippingTable: [], // 字段对比
      containerTable: [], // 集装箱
      tableLabel: [
        {
          label: '进出口岸',
          prop: 'voyageNo'
        },
        {
          label: '件数',
          prop: 'packNo'
        },
        {
          label: '毛重',
          prop: 'wt'
        }
      ]
    }
  },
  props: {
    mftBillDetailVisible: {
      type: Boolean,
      default: false
    },
    shippingList: {
      type: Array,
      require: true
    },
    mftContainerList: {
      type: Array,
      require: true
    },
    initParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created () {
  },
  methods: {
    // 打开弹窗
    openAfter () {
      this.createTable()
      this.billData = this.shippingList[0]
    },
    // 关闭弹窗
    closeDialog () {
      this.$emit('update:mftBillDetailVisible', false)
    },
    // 初始化表格
    createTable () {
      this.shippingTable = []
      console.log(this.initParams)
      this.tableLabel.forEach(v => {
        let isSame = this.initParams[v.prop] === this.shippingList[0][v.prop]
        this.shippingTable.push({
          fieldName: v.label,
          inputField: this.initParams[v.prop],
          requestField: this.shippingList[0][v.prop],
          destina: '',
          compare: isSame
        })
      })
    },
    // 需要对比的字段颜色黄色标识
    deCellClass ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1 || columnIndex === 2) {
        return 'yellow-mark'
      }
    },
    // 回填舱单
    backShipInfo () {
      this.$emit('close:shippingBillDetail', {
        trafName: this.shippingList[0].trafName, // 运输工具名称
        voyageNo: this.shippingList[0].voyageNo, // 航次号
        billNo: this.shippingList[0].billNo, // 提运单号
        packNo: this.shippingList[0].packNo, // 件数
        wt: this.shippingList[0].wt, // 毛重
        isShip: true
      })
    },
    // 回填集装箱
    backContainerInfo () {
      this.$emit('close:shippingBillDetail', {
        trafName: this.shippingList[0].trafName, // 运输工具名称
        voyageNo: this.shippingList[0].voyageNo, // 航次号
        billNo: this.shippingList[0].billNo, // 提运单号
        packNo: this.shippingList[0].packNo, // 件数
        wt: this.shippingList[0].wt, // 毛重
        isShip: true,
        containerInfo: this.mftContainerList // 集装箱信息
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../common/decCss';
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
}
.isRed {
  color: red;
}
</style>
