<template>
<!-- 表体——危险货物信息组件 -->
  <section>
    <el-dialog
      title="还有以下没有通过校验！"
      :visible.sync="aiValidVisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body='false'
      @opened='openAiValid'
      :before-close='closeCompnent'
      width="540px">
      <div style='height: 250px ;overflow-y: auto;color: red;'>
        <table sytle='color: red'>
          <tr v-for="(value, key) in validResult" :key='key'>
            <td width="20%">
              <span>必填</span>
            </td>
            <td width="40%">
              <span>{{key}}</span>
            </td>
            <td width="40%">
              <span>{{value.join()}}</span>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" @click="closeCompnent">知道了</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>

export default {
  name: 'danger-goods',
  props: {
    aiValidVisable: {
      type: Boolean,
      default: false
    },
    validResult: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    openAiValid () {
    },
    closeCompnent () {
      this.$emit('update:aiValidVisable', false)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../common/decCss';
 table,table tr th, table tr td { border:1px solid #e4eaec; }
  table { width: 100%; min-height: 25px; line-height: 25px; text-align: center; border-collapse: collapse;}
  table th {
    padding: 0px;
    font-size: 12px;
    color: white;
    background-color: #64A7EB;
    border-right-color: #e4eaec;
    height: 20px;
    vertical-align: middle;
  }
</style>
