<template>
<!-- 报关单表头——业务事项组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="业务事项"
      :visible.sync="businessVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeCompnent'
      @open="businessShow"
      v-dialogDrag
      width="500px">
      <el-checkbox-group v-model="businessList" class="border-margin">
        <el-checkbox label="税单无纸化" v-show="controller.declTrnrel == '0'"></el-checkbox>
        <el-checkbox label="自主报税" v-show="controller.declTrnrel == '0'"></el-checkbox>
        <el-checkbox label="水运中转" v-show="controller.iEFlag == 'E'"></el-checkbox>
        <el-checkbox label="自报自缴"></el-checkbox>
        <el-checkbox label="担保验放"></el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveBusiness" class="dialog-primary-btn" :disabled="controller.isDisabled">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util.js'
export default {
  name: 'business-matters',
  props: {
    businessVisible: {
      type: Boolean,
      default: false
    },
    checkList: {
      type: Array,
      required: true
    },
    controller: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      businessList: []
    }
  },
  methods: {
    businessShow () {
      this.businessList = util.simpleClone(this.checkList)
    },
    // 确认 业务事项
    saveBusiness () {
      this.$emit('close:businessMatters', {checkList: this.businessList})
    },
    closeCompnent () {
      this.$emit('update:businessVisible', false)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
