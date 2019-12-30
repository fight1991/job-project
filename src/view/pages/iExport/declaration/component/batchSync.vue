<template>
  <!-- 单一同步 -->
  <section>
    <div>
      <el-row>
        <el-col class='query-btn margin-b'>
          <label style='margin-right: 7px;'>最近操作时间:</label>
          <el-date-picker
            v-model="updateTimeStart"
            type="date"
            size='mini'
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>
       <el-row>
        <el-col class='margin-b' style='margin-left: 119px;'>
          <el-checkbox v-model="checked">覆盖重复数据</el-checkbox>
        </el-col>
      </el-row>
       <el-row>
        <el-col class='query-btn'>
          <el-button size="mini" type="primary" @click="configBtn" :disabled="isDisabled" class='btn-padding'>立即同步</el-button>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'batch-sync',
  data () {
    return {
      updateTimeStart: '', // 同步时间
      checked: false,
      isDisabled: false
    }
  },
  created () {
    this.updateTimeStart = util.dateFormat(new Date(), 'yyyy-MM-dd')
  },
  methods: {
    configBtn () {
      if (util.isEmpty(this.updateTimeStart)) {
        this.messageTips('请选择同步日期！', 'error')
        return
      }
      let param = {}
      param['updateTimeStart'] = this.updateTimeStart
      param['updateTimeEnd'] = this.updateTimeStart
      if (this.checked) {
        param['isNeedUpdate'] = '1'
      }
      this.$post({
        url: 'API@/saas-sync/dec/sync/batchCheckSeqNo',
        data: param,
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.isDisabled = true
          this.$emit('backData', {})
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
 .query-btn {
    text-align: center;
  }
  .margin-b {
    margin-bottom: 20px;
  }
  .btn-padding {
    padding: 8px 20px !important;
    background-color: #287fca;
    border-color: #287fca;
  }
</style>
