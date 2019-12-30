<template>
  <!-- 备注、唛码的组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title='查询企业信息'
      :visible.sync="selectCompanyVisiable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeCompanyCompnent'
      @open="selectCompanyShow"
      v-dialogDrag
      v-loading="$store.state.loading"
      class="sys-dec-class"
      width="400px">
      <div  class='list-head' >
        <span>{{companyList.length === 0 ? '请输入海关编号:' : '请选择查询企业:'}}</span>
      </div>
      <div v-if='companyList.length !== 0' @keyup.native='updownSelect' ref='selectCompanyList'>
        <div v-for = '(v, index) in companyList' :key="index" class='list-div'>
          <el-radio v-model="companyRadio"  @keyup.enter.native="config" :label="index">{{v.code + ' ' + v.name}}</el-radio>
        </div>
      </div>
      <div v-else>
        <el-input type='text' size='small' v-model="customCode" class='list-input' placeholder="海关编号">
        </el-input>
        <el-autocomplete
        style="padding-left: 0px;"
              class='list-input'
              :maxlength="70"
              placeholder="企业名称,输入两位字符开始匹配"
              size='small'
              v-model="agentName"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              :select-when-unmatched='true'
              :highlight-first-item='true'
              @select="handleSelect($event)">
        </el-autocomplete>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-btn" @click="closeCompanyCompnent" v-show='emsType === "query"'>取消</el-button>
        <el-button class="dialog-primary-btn" @click="config" v-show='emsType === "query"'>同步</el-button>
        <el-button class="dialog-primary-btn" @click="config" v-show='emsType === "match"'>开始匹配</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util.js'
import decUtil from '../../common/decUtil'
export default {
  name: 'select-company',
  props: {
    companyList: {
      type: Array,
      required: true
    },
    selectCompanyVisiable: {
      type: Boolean,
      default: false
    },
    emsType: {
      type: String,
      default: 'query'
    }
  },
  data () {
    return {
      agentName: '',
      customCode: '',
      companyRadio: 0
    }
  },
  methods: {
    selectCompanyShow () {
      this.companyRadio = 0
      if (this.companyList.length > 0) {
        this.$nextTick(_ => {
          this.$refs['selectCompanyList'].querySelectorAll('input[type="radio"]')[0].focus()
        })
      }
    },
    closeCompanyCompnent () {
      this.$emit('close:selectCompany', null)
    },
    config () {
      let code = ''
      if (this.companyList.length !== 0) {
        code = this.companyList[this.companyRadio].code
      } else {
        if (this.customCode === '') {
          this.messageTips('请输入海关编号！')
        } else if (!/^[0-9a-zA-Z]{9,10}$/.test(this.customCode)) {
          this.messageTips('请正确输入海关编号！')
        } else {
          code = this.customCode
        }
      }
      if (code !== '') {
        this.$emit('close:selectCompany', {customCode: code, emsType: this.emsType})
      }
    },
    // 通过公司名称编码名称查询公司信息
    handleSelect (item) {
      // 如果海关名称存在 则 直接复制  如果企业海关名称不存在则发往海关查询
      if (util.isEmpty(item.tradeCode)) { // 如果企业海关编码不存在，则去查找
        let param = {
          cusCorpName: '',
          sccCode: '',
          tradeCode: ''
        }
        if (util.isEmpty(item.value)) {
          return
        }
        param.cusCorpName = item.value
        this.$post({
          url: 'API@/dec-common/dec/common/getCorpInf',
          data: param,
          success: (res) => {
            if (res.result && res.result.sccCode) {
              this.customCode = res.result.regCusCode === null ? '' : res.result.regCusCode
            }
          }
        })
      } else {
        // 自动带出一样的
        this.customCode = item.tradeCode
      }
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
          if (res.result && res.result.length > 0) {
            let json = JSON.stringify(res.result).replace(/corpName/g, 'value')
            cb(JSON.parse(json).slice(0, 10))
          } else {
            let back = []
            cb(back)
          }
        }
      })
    },
    // 下拉键切换选择
    updownSelect (e) {
      let browerType = decUtil.myBrowser()
      if (browerType === 'Chrome') {
        return
      }
      let len = this.companyList.length
      if (len === 0) {
        return
      } else {
        len--
      }
      if (e && e.keyCode === 38) { // 上
        if (this.companyRadio === 0) {
          this.companyRadio = len
        } else {
          this.companyRadio--
        }
      }
      if (e && e.keyCode === 40) { // 下
        if (this.companyRadio === len) {
          this.companyRadio = 0
        } else {
          this.companyRadio++
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.list-div {
  margin-left:30px;
  margin-top:5px;
}
.list-head {
  font-size:13px;
  margin-left:40px;
}
.list-input {
  width: 300px;
  height: 22px;
  margin-left: 40px;
  margin-top: 5px;
}
</style>
