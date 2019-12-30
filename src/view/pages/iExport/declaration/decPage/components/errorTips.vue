<template>
  <!-- 对比模板与现在的区别 -->
  <section>
    <div class = 'timeline checkcomp' v-if='approvalOpinions.length > 0'>
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, index) in approvalOpinions"
          :key="index">
          <div style="display: flex; justify-content:space-between;color:#999999;font-size:12px;">
            <div>{{item.createUser}}</div>
            <div style="text-align:right;">{{item.createDate}}</div>
          </div>
          {{item.note}}
        </el-timeline-item>
      </el-timeline>
    </div>
    <div style="text-align: center; margin: 10px 0;" v-else>
      <span>无填写建议</span>
    </div>
     <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button  class="dialog-btn" size="mini" @click="closeCompnent">关闭</el-button>
    </div>
  </section>
</template>
<script>
export default {
  name: 'error-tips',
  props: {
    approvalOpinions: { // 驳回时的审批建议
      type: Array,
      default () {
        return []
      }
    },
    moduleSource: {
      type: String,
      default: ''
    },
    headClomn: {
      type: String,
      require: true
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    closeCompnent () {
      this.$emit('close:errorTips', { type: 'head', colum: this.headClomn })
    }
  }
}
</script>

<style scoped lang="less">

.timeline{
  padding:20px 0px;
}
</style>
