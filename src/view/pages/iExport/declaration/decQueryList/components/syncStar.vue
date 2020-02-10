<template>
  <section class="batch-sync-dialog">
    <el-dialog :modal-append-to-body='false'
      title="同步信息填写"
      :visible.sync="syncShow"
      :close-on-click-modal='false'
      v-dialogDrag
      v-loading="$store.state.loading"
      @open="openDialog"
      @close="$emit('update:syncStarVisiable', false)"
      width="400px">
      <el-form :model="syncForm" label-width="100px" class="pd-lr-20" size="mini" ref="syncForm" :rules="rules">
        <el-form-item label="海关编号" prop="entryNo">
          <el-input v-model="syncForm.entryNo"></el-input>
        </el-form-item>
        <el-form-item label="报关行人员id" prop="jobId">
          <el-input v-model="syncForm.jobId"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24" align="center">
          <el-button size="mini" type="primary" @click="configBtn">确定</el-button>
          <el-button size="mini" @click="$emit('update:syncStarVisiable', false)">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: {
    syncStarVisiable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      syncShow: false,
      syncForm: {
        entryNo: '',
        jobId: ''
      },
      rules: {
        entryNo: [{required: true, message: '请输入海关编号', trigger: 'blur'}],
        jobId: [{required: true, message: '请输入报关行人员id', trigger: 'blur'}]
      }
    }
  },
  watch: {
    'syncStarVisiable' (newVal, oldVal) {
      this.syncShow = newVal
    }
  },
  methods: {
    openDialog () {
      this.syncForm = {
        entryNo: '',
        jobId: ''
      }
      this.$nextTick(() => {
        this.$refs['syncForm'].clearValidate()
      })
    },
    configBtn () {
      this.$refs['syncForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$post({
          url: 'API@/dec-common/corp/msg/getDecInfo',
          data: this.syncForm,
          success: (res) => {
            this.messageTips(res.message, 'success')
            this.$emit('update:syncStarVisiable', false)
            this.$emit('back', {})
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
