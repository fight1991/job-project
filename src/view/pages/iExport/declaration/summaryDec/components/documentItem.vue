<template>
  <!-- 表体——随附单证组件 -->
  <section class='sys-dec-class'>
    <div class="dec-div">
      <el-form ref="docuRuleForm" :rules="docuRuleForm"
        @keyup.enter.native="switchFoucsByEnter"
        :model="decLicense" label-width="100px"  size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item label="随附单证代码"  :class="{ 'require-color': controller.requireColor }"  prop="docuCode">
              <el-select placeholder=" " v-model="decLicense.docuCode"
                @focus="tipsFillMessage('docuCode', 'saasLicensedocu','SAAS_LICENSEDOCU')"
                remote  default-first-option clearable  filterable
                :remote-method="checkParamsList"
                @clear="clearSelct('saasLicensedocu')"
                @change= "docuCodeChanage"
                  ref="docuCode" dataRef ='docuCode'
                :disabled="controller.isDisabled" style="width:100%">
                <el-option
                  v-for="item in saasLicensedocu"
                  :key="item.codeField"
                  :showLabel="showCustomsCode? '' : item.nameField"
                  :label="item.codeField + '-' + item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="随附单证编号"  :class="{ 'require-color': controller.requireColor }"  ref="certCode">
              <el-input v-model="decLicense.certCode" :readonly="controller.isDisabled"
                @focus="tipsFillMessage('certCode')"
                :maxlength='32'
                @keyup.enter.native="beforeSaveDecLic"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 原产地证 -->
    <origin-certificate :originRelVisible='originRelVisible' :decLicense="decLicense" :isDisabled='controller.isDisabled' :tableLength='tableListLength'  @close:originCertificate="backOriginCertificate"></origin-certificate>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../decPage/common/decUtil'
import originCertificate from '../../decPage/documents/components/originCertificate'
import summaryBus from '../common/bus.js'
// import { mapState } from 'vuex'
export default {
  name: 'documents-item',
  props: {
    licenselist: {
      type: Array,
      default: () => {
        return []
      }
    },
    decCheckLicense: {
      type: Object,
      default: () => {
        return {}
      }
    },
    moduleName: {
      type: String
    }
  },
  components: {
    originCertificate
  },
  data () {
    return {
      billSync: false,
      decLicense: {
        pid: '', // 主键
        decPid: '', // 外键
        certCode: '', // 单证编号
        docuCode: '', // 单证代码
        gNo: '', // 序号
        decEcoRealations: [] // 原产地证明
      },
      originRelVisible: false,
      tableListLength: 0,
      docuRuleForm: {
        docuCode: [
          {validator: this.checkValid, message: '输入随附单证代码', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        // 随附单证
        'docuCode': '^[0-9a-zA-Z]{1,6}$' // 随附单证代码
      },
      selectObj: {
        obj: '',
        params: ''
      },
      saasLicensedocu: [],
      docuSelect: { // 随附单证
        'docuCode': {obj: 'saasLicensedocu', params: 'SAAS_LICENSEDOCU'} // 随附单证代码
      }
    }
  },
  watch: {
    'decCheckLicense': function (newVal, oldVal) {
      this.decLicense = util.simpleClone(newVal)
    }
  },
  created () {
    summaryBus.getBus(this.moduleName).$on('setDocFieldToSate', this.setDocFieldToSate)
  },
  computed: {
    controller () {
      return this.$store.state[this.moduleName].controller
    },
    tipsMessage () {
      return this.$store.state[this.moduleName].tipsMessage
    },
    tipsNoteShow () {
      return this.$store.state[this.moduleName].tipsNoteShow
    },
    tipsNote () {
      return this.$store.state[this.moduleName].tipsNote
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    }
  },
  methods: {
    clearDocumentsItemData () {
      this.decLicense.pid = ''
      this.decLicense.decPid = ''
    },
    checkValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['docuRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 清除 随附单证 新增数据
    refreshItemDoc () {
      this.decLicense = this.resetDocumentsFrom()
      this.saasLicensedocu = []
    },
    resetDocumentsFrom () {
      return { // 随附单证数据
        pid: '', // 主键
        decPid: '', // 外键
        certCode: '', // 单证编号
        docuCode: '', // 单证代码
        gNo: '', // 序号
        decEcoRealations: [] // 原产地证明
      }
    },
    // 随附单证 判断重复的方法
    docuCodeChanage (value) {
      let index = -1
      index = this.licenselist.findIndex((item, i) => {
        return item.docuCode === value
      })
      if (index > -1) {
        this.decLicense.docuCode = ''
        this.saasLicensedocu = []
        this.$refs['docuCode'].focus()
        this.messageTips('随附单证代码不能重复')
      }
      if (['5', '6', '8', '9', 'A', 'B', 'D', 'G', 'O', 'S', 'n', 'u'].includes(this.decLicense.docuCode)) {
        this.messageTips('选中的随附单证未实现联网核查')
      }
    },
    beforeSaveDecLic () {
      // 校验
      this.$refs['docuRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          if (this.decLicense.docuCode === 'U') {
            if (!/^[0-9A-Za-z]{12}:[0-9]{1,2}$/.test(this.decLicense.certCode)) {
              this.messageTips('随附单证代码U时，随附单证编号录入规则为12位通关证明编码:商品项号')
              return
            }
          }
          if (this.decLicense.docuCode === 'A') {
            if (!/^[0-9A-Za-z]{15}$|^[0-9A-Za-z]{18}$/.test(this.decLicense.certCode)) {
              this.messageTips('随附单证代码A时，随附单证编号录入规则固定为15位或18位字符')
              return
            }
          }
          if (['Y', 'E', 'R', 'F', 'J'].includes(this.decLicense.docuCode)) {
            // 原产地证
            this.openOriginItemRel()
          } else {
            this.saveDecLic()
          }
        }
      })
    },
    // 保存 随附单证
    saveDecLic () {
      // 确报以前需要原产地对应信息，xiu改后又不需要原产地对应信息
      let arr = ['Y', 'E', 'R', 'F', 'J']
      if (!arr.includes(this.decLicense.docuCode)) {
        this.decLicense.decEcoRealations = []
      } else { // 如果是原产地, 防止单证编号修改而 对应关系里的单证编号没有被修改
        for (let n in this.decLicense.decEcoRealations) {
          let no = this.decLicense.certCode.split('>')
          if (no.length === 2) {
            this.decLicense.decEcoRealations[n].certType = this.decLicense.docuCode + no[0].replace('<', '')
            this.decLicense.decEcoRealations[n].ecoCertno = no[1]
          } else {
            this.decLicense.decEcoRealations[n].certType = this.decLicense.docuCode
            this.decLicense.decEcoRealations[n].ecoCertno = this.decLicense.certCode
          }
        }
      }
      if (this.decLicense.docuCode !== 'c' && util.isEmpty(this.decLicense.certCode)) {
        this.decLicense.certCode = 'NA'
      }
      let gNo = this.decLicense.gNo
      if (util.isEmpty(gNo)) { // 如果gNo 无值  走新增路线
        this.decLicense.gNo = this.licenselist.length + 1
        this.licenselist.push(util.simpleClone(this.decLicense))
      } else { // 如果gNo 有值  走修改路线
        for (let i in this.licenselist) {
          if (this.licenselist[i].gNo === gNo) {
            this.licenselist[i] = this.decLicense
            // 为了刷新列表的 操作
            this.licenselist.push({})
            this.licenselist.pop()
            break
          }
        }
      }
      this.$emit('backData', this.licenselist)
      this.refreshItemDoc()
    },
    // 打开 原产地对应关系 弹出框
    openOriginItemRel () {
      let str = this.decLicense.docuCode
      let isFlag = false
      let arr = ['Y', 'E', 'R', 'F', 'J', 'k', 'd']
      for (let i in arr) {
        if (str === arr[i]) {
          isFlag = true
        }
      }
      if (isFlag) {
        // TODO
        summaryBus.getBus(this.moduleName).$emit('setTableListToSate', null)
        this.tableListLength = this.$store.state.summaryData.tableList.length
        this.originRelVisible = true
      } else {
        this.messageTips('单证代码不是Y/E/R/F/J/k/d!')
      }
    },
    // 原产地证回参
    backOriginCertificate (param) {
      this.decLicense.decEcoRealations = util.simpleClone(param.decEcoRealations)
      this.saveDecLic()
      this.originRelVisible = false
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
    },
    checkParamsList (query, type = 'select') {
      decUtil.selectSearch(this, query, type)
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      decUtil.switchFoucsByEnter(e, this.foucsByEnter)
    },
    foucsByEnter (e, next, secondNext) {
      // 下个元素存在
      if (next) {
        if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
          return false
        } else {
          next.focus()
          next.select()
        }
      }
    },
    // 提供给外面调用
    initDocumentsSelect () {
      decUtil.initSelect(this, this.docuSelect, this.decLicense)
    },
    getDocumentsDetail (listVo) {
      this.licenselist = util.simpleClone(listVo)
    },
    initDocumentsData () {
      this.decLicense = this.resetDocumentsFrom()
      this.licenselist = []
    },
    clearDocumentsData () {
      this.decLicense.pid = ''
      this.decLicense.decPid = ''
      for (let n in this.licenselist) {
        this.licenselist[n].pid = ''
        this.licenselist[n].decPid = ''
      }
    },
    setDocFieldToSate () {
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'licenselist', value: this.licenselist})
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../decPage/common/decCss';
.span-match {
    font-size: 12px;
    background-color: #096AC6;
    color: #fff;
    margin-right: 5px;
    cursor: pointer;
}
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
}
</style>
