<template>
  <!-- 对比模板与现在的区别 -->
  <section>
    <el-row>
      <el-form ref='recordForm' :rules="compRule" :model="subForm">
        <el-form-item v-if="$route.path.indexOf('edit')>=0">
          <el-input type="textarea" placeholder="输入审批意见..." style="font-size:12px;" maxlength="200" v-model="subForm.compDetail">
          </el-input>
      </el-form-item>
      </el-form>
    </el-row>
    <div slot="footer"  v-if="$route.path.indexOf('edit')>=0"  class="sys-dialog-footer" style="text-align:right;padding-bottom:10px;border-bottom:1px solid #f5f5f5">
      <el-button  size="mini" @click="subForm.compDetail = ''">清空</el-button>
      <el-button  size="mini" type="primary" @click="saveVerifyInfo()">确定</el-button>
    </div>
    <div class = 'timeline checkcomp'>
    <el-timeline>
    <el-timeline-item
      v-for="(item, index) in checkobj"
      :key="index">
      <div style="display: flex; justify-content:space-between;color:#999999;font-size:12px;">
        <div>{{item.createUser}}</div>
        <div style="text-align:right;">{{item.createDate}}</div>
      </div>
      {{item.note}}
    </el-timeline-item>
  </el-timeline>
    </div>
  </section>
</template>
<script>
export default {
  name: 'compare-template',
  props: {
    checkobj: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      compRule: {
        compDetail: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
      },
      subForm: {
        compDetail: ''
      },
      isQuote: '', // 是否引用模板列表
      checkList: []// 被选择的数据
    }
  },
  mounted () {
    this.subForm.compDetail = this.value
  },
  methods: {
    saveVerifyInfo () {
      this.$refs['recordForm'].validate(valid => {
        if (valid) {
          this.$emit('backNote', this.subForm.compDetail)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

.timeline{
  padding:20px 0px;
}
</style>
