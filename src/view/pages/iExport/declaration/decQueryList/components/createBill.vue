<template>
  <!-- 备注、唛码的组件 -->
  <section>
    <div>
      <el-row>
        <el-col class='query-btn margin-b'>
          <label style='margin-right: 7px;font-size: 13px'>委托客户</label>
          <el-autocomplete
            :maxlength="70"
            size='mini'
            style='width:250px;'
            v-model="company"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            :select-when-unmatched='true'
            :highlight-first-item='true'
            @keyup.enter.native='configBtn'
            @select="handleSelect($event)">
          </el-autocomplete>
        </el-col>
      </el-row>
       <el-row style='margin-bottom: 20px;'>
        <el-col style='margin-left: 132px;'>
          <el-checkbox v-model="checked">覆盖重复数据</el-checkbox>
        </el-col>
      </el-row>
       <el-row>
        <el-col class='query-btn'>
          <el-button size="mini" type="primary" @click="configBtn" class='btn-padding'>确定</el-button>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'create-bill',
  props: {
    initParams: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      company: '', // 同步时间
      checked: true,
      companyId: ''
    }
  },
  created () {
  },
  methods: {
    configBtn () {
      if (this.company === '') {
        this.$emit('backData', {company: this.company, companyId: this.companyId, checked: this.checked, list: this.initParams})
      } else {
        if (util.isEmpty(this.companyId)) {
          this.$post({
            url: 'API@/dec-common/ccba/common/getCorpDetail',
            data: this.company,
            success: (res) => {
              if (res.code === '0000' && !util.isEmpty(res.result)) {
                this.companyId = res.result
              } else {
                this.companyId = ''
                this.company = ''
                this.messageTips('当前委托企业不存在！')
              }
            },
            other: (res) => {
              this.companyId = ''
              this.company = ''
              this.messageTips('当前委托企业不存在！')
            }
          })
        } else {
          this.$emit('backData', {company: this.company, companyId: this.companyId, checked: this.checked, list: this.initParams})
        }
      }
    },
    handleSelect (item) {
      this.companyId = item.corpId
    },
    // 可搜索框的远程搜索
    querySearch (queryString, cb) {
      if (queryString.length < 2) {
        let back = []
        cb(back)
        return
      }
      let param = {
        'corpName': queryString,
        'returnProps': ['corpName', 'corpId', 'sccCode', 'tradeCode', 'cusCorpName', 'ciqCode']
      }
      this.$post({
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: param,
        success: (res) => {
          if (res.success) {
            let json = JSON.stringify(res.result)
            json = json.replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          }
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
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .btn-padding {
    padding: 8px 20px !important;
  }
</style>
