<template>
  <!-- 报价提醒 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="提示"
      :visible.sync="prcVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='confirmData'
      :show-close='true'
      @opened="openDialog"
      v-loading="$store.state.loading"
      width="500px">
      <el-row class="borderN">
        <el-col :span="19" :offset="3">
          <div class="remind-flex">
            <div class="remind-flexL list-icon-tips-warning"><i></i></div>
            <div class="remind-flexR">检测到您当前有多个报价符合使用条件，请确认当前业务使用哪个报价。</div>
          </div>
        </el-col>
      </el-row>
      <el-row class="borderN mg-b-20 remind-radio">
        <el-col :span="15" :offset="5">
          <el-radio-group v-model="radioCheck">
            <el-radio v-for="item in priceList" :label="item.quotationId" :key="item.quotationId">{{item.itemName}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="borderN mg-b-20">
        <el-col :span="24" align="center">
          <el-button type="primary" class='dialog-primary-btn' size="mini" @click="confirmData('confirm')">确定</el-button>
          <el-button class='remind-dialog-btn' size="mini" @click="confirmData('cancel')">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: {
    prcVisible: {
      type: Boolean,
      default: false
    },
    operType: {
      type: String,
      default: ''
    },
    priceList: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      radioCheck: ''
    }
  },
  methods: {
    openDialog () {
      this.radioCheck = this.priceList[0].quotationId
    },
    closePrcVisible () {
      this.$emit('update:prcVisible', false)
    },
    confirmData (type) {
      this.$emit('close:priceRemind', {
        radioCheck: type === 'confirm' ? this.radioCheck : this.priceList[0].quotationId,
        operType: this.operType
      })
      this.closePrcVisible()
    }
  }
}
</script>
<style lang="less" scoped>

.borderN{
  border-bottom: none !important;
}
.mg-b-20{
  margin-bottom: 20px;
}
.remind-dialog-btn{
  height: 32px;
  line-height: 32px;
  padding: 0 15px !important;
  border: 1px solid #d8d8d8;
}
</style>
