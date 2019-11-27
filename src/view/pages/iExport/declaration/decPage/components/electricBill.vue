<template>
  <el-dialog :modal-append-to-body='false'
  title="引用电子底账"
  :visible.sync="electricVisible"
  v-loading="$store.state.loading"
  @open="eleBillShow"
  :before-close="beforeClose"
  class="electricDialog"
  v-dialogDrag
  width="450px">
    <div style="padding: 20px 50px;">
      <el-form size="mini" label-width="75px" :model="electricForm" class="mg-b-40" ref="electricForm" :rules="electricRules" @submit.native.prevent hide-required-asterisk>
        <el-form-item label="电子底账号:" prop="qcPassId">
          <el-input v-model="electricForm.qcPassId"></el-input>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" size="mini" @click="confirmData" style="height:28px;padding: 6px 20px;">引用</el-button>
        <el-button size="mini" @click="beforeClose" style="height:28px;padding: 8px 20px;margin-left:10px;">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    electricVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      electricForm: {
        qcPassId: ''
      },
      electricRules: {
        qcPassId: [{required: true, message: '电子底账号不能为空', trigger: 'blur'}]
      }
    }
  },
  methods: {
    eleBillShow () {
      this.electricForm = {
        qcPassId: ''
      }
      this.$nextTick(() => {
        this.$refs.electricForm.clearValidate()
      })
    },
    beforeClose () {
      this.$emit('update:electricVisible', false)
    },
    confirmData () {
      this.$refs.electricForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$post({
          url: 'API@/dec-common/dec/common/getElectronicAccount',
          data: this.electricForm,
          success: (res) => {
            if (res.result) {
              if (res.result.decHeadVO) {
                this.$emit('close:electricBill', res.result)
                this.$emit('update:electricVisible', false)
              } else {
                this.messageTips('未查询到电子底账数据', 'error')
              }
            }
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mg-b-40{
  margin-bottom: 30px;
}
</style>
