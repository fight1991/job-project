<template>
  <section class='airvehicle-return'>
    <div>
      <el-row style="margin-bottom:17px;">
          <el-button  class='list-btns  list-icon-refresh' style='margin: 0 6px 0 0;'  @click="refresh"><i ></i>刷新</el-button>
          <el-button  class='list-btns  list-icon-close' style='margin: 0 6px 0 0;' @click="closeTemplate"><i ></i>关闭</el-button>
        <div class="aireturn-title">航空器回执</div>
      </el-row>
      <el-row>
        <el-table class='sys-table-table dec-table' border highlight-current-row size="mini" :data="resultList">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column label="申报对象" min-width="150">
            <template >
              海关
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="回执时间" align="center" min-width="150"></el-table-column>
          <el-table-column prop="rcptStatusValue" label="回执状态" align="left" min-width="150"></el-table-column>
          <el-table-column prop="rcptCntt" align="left" label="回执内容" min-width="200"></el-table-column>
        </el-table>
      </el-row>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  data () {
    return {
      resultList: []
    }
  },
  props: ['data', 'pid', 'type'],
  created () {
    this.resultList = util.isEmpty(this.data) ? [] : this.data
  },
  watch: {
    data: 'refresh'
  },
  methods: {
    refresh () {
      let data = {
        pid: this.pid,
        type: this.type
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/getCdsRecords',
        data: data,
        router: this.$router,
        success: (res) => {
          this.resultList = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    closeTemplate () {
      this.$emit('colseTemplate')
      this.resultList = []
    }
  }
}
</script>
<style lang="less" scoped>
@import (less) '../css/common.less';
</style>
