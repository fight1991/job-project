<template>
  <!-- 单一同步 -->
  <section>
    <div>
      <el-form :label-width="labelFormWidth.seven" :model="queryForm" size="mini" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="最近操作时间:">
              <el-date-picker
                v-model="queryForm.updateTimeStart"
                type="date"
                size='mini'
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业类别:">
              <el-select placeholder="" v-model="queryForm.etpsCategory" style="width:220px">
                <el-option
                  v-for="item in etpsCategoryListDownload"
                  :key="item.code"
                  :label="item.code + ' ' + item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
import {etpsCategoryList} from '../utils/decJson'
export default {
  name: 'batch-sync',
  data () {
    return {
      queryForm: {
        updateTimeStart: '',
        etpsCategory: 'A'
      },
      checked: false,
      isDisabled: false,
      etpsCategoryListDownload: etpsCategoryList.slice(0, etpsCategoryList.length - 1)
    }
  },
  created () {
    this.queryForm.updateTimeStart = util.dateFormat(new Date(), 'yyyy-MM-dd')
  },
  methods: {
    configBtn () {
      if (util.isEmpty(this.queryForm.updateTimeStart)) {
        this.messageTips('请选择同步日期！', 'error')
        return
      }
      let param = {}
      param['updateTimeStart'] = this.queryForm.updateTimeStart
      param['updateTimeEnd'] = this.queryForm.updateTimeStart
      param['etpsCategory'] = this.queryForm.etpsCategory
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
