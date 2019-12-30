<template>
<!-- 表体——危险货物信息组件 -->
  <section class="dec-common-dialog">
    <el-dialog
      title="发送委托"
      :visible.sync="sendEntrustVisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body='false'
      @opened='openAiValid'
      :before-close='cancle'
      width="540px">
      <div class='conent'>
        <p style='font-size: 14px; margin-bottom: 10px;'>请填写委托报关行</p>
        <el-autocomplete v-model="companyName" :maxlength="70" size='mini'
          placeholder="企业名称,输入两位字符开始匹配"
          @select="handleSelect"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          :select-when-unmatched='true'
          :highlight-first-item='true' >
        </el-autocomplete>
        <p style='margin-top: 10px; color: red;'>* 如您需要的报关行查询不到，代表对方非CCBA注册用户</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="config">委托</el-button>
         <el-button type="default" @click="cancle">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>

export default {
  name: 'send-entrust',
  props: {
    sendEntrustVisable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      companyName: '',
      sccCode: ''
    }
  },
  methods: {
    openAiValid () {
      this.companyName = ''
      this.sccCode = ''
    },
    cancle () {
      this.$emit('update:sendEntrustVisable', false)
    },
    config () {
      if (!this.companyName) {
        this.messageTips('请填写委托报关行', 'error')
        return false
      }
      if (this.companyName && !this.sccCode) {
        this.messageTips('改报关行非CCBA注册用户', 'error')
        return false
      }
      this.$emit('close:sendEntrust', {
        sccCode: this.sccCode
      })
    },
    handleSelect (item) {
      this.companyName = item.value
      this.sccCode = item.sccCode
    },
    querySearch (queryString, cb) {
      this.sccCode = ''
      if (queryString.length < 2) {
        let back = []
        cb(back)
        return
      }
      let param = {
        'corpName': queryString,
        'returnProps': ['corpName', 'sccCode']
      }
      this.$post({
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: param,
        success: (res) => {
          let back = []
          if (res.result && res.result.length > 0) {
            let json = JSON.stringify(res.result).replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          } else {
            cb(back)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../declaration/decPage/common/decCss';
.conent {
    margin-bottom: 30px;
    margin-top: 20px;
    margin-left: 50px;
    margin-right: 100px;
}
</style>
