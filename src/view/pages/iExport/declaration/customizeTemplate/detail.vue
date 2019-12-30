<template>
  <div class="customize-add-main">
    <el-form ref="baseInfoForm" :rules='baseInfoRule'  :model="baseInfo" label-width="90px" size="mini" label-position="right" class="baseInfo">
      <el-row :gutter="50">
        <el-col :span="6">
          <el-form-item label="模版名称" prop="templateName">
            <el-input v-model="baseInfo.templateName" :disabled="!isEditable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生效标识" prop="takeEffectFlag">
            <el-radio-group v-model="baseInfo.takeEffectFlag">
              <el-radio :label="'1'" :disabled="!isEditable">创建人</el-radio>
              <el-radio :label="'2'" :disabled="!isEditable">使用单位</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <item :item="decHead" :sheetNames="sheetNames" v-if="isLoaded" ref="decHead" :isEditable="isEditable"></item>
    <item :item="decList" :sheetNames="sheetNames" :isList="true" v-if="isLoaded" ref="decList" :isEditable="isEditable"></item>
    <item :item="containerTable" :sheetNames="sheetNames" :isList="true" v-if="isLoaded" ref="containerTable" :isEditable="isEditable"></item>
    <el-row :gutter="50" class="paddingTop10">
      <el-col :span="24" class='query-btn'>
        <el-button type="primary" @click="saveTemplate" class="save" :disabled="!isEditable">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import businessUtil from './utils/businessUtil'
import excelUtil from './utils/excelUtil'
import item from './components/item'
// import config from '@/config/config'

export default {
  data () {
    return {
      templateUrl: 'https://test.5itrade.cn/files/2019-09-19/81/8a538896-59ed-4aed-a98e-a90ad4f238b0.xls',
      baseInfo: {
        templateName: '',
        takeEffectFlag: ''
      },
      baseInfoRule: {
        'templateName': [{required: true, validator: this.checkValid, message: '请输入模版名称，最大长度70', trigger: 'blur'}],
        'takeEffectFlag': [{required: true, validator: this.checkValid, message: '请选择生效标识', trigger: 'blur'}]
      },
      ruleRegx: {
        'templateName': '^(.){1,70}$'
      },
      decHead: {},
      decList: {},
      containerTable: {},
      sheetNames: [],
      customTemplateDecPid: 0,
      isLoaded: false,
      isEditable: true
    }
  },
  components: {
    item
  },
  created () {
    this.templateUrl = window.sessionStorage.getItem('customizeTemplateUrl')
    this.customTemplateDecPid = this.$route.params.operationType !== 'add' ? this.$route.params.pid : ''
    this.isEditable = this.$route.params.operationType !== 'look'
    if (this.customTemplateDecPid) {
      this.getDetail()
    } else {
      this.init()
    }
  },
  mounted () {

  },
  methods: {
    init (initData) {
      excelUtil.initWorkBook(this.templateUrl).then(() => {
        this.sheetNames = excelUtil.getSheetNames()
        this.formatDecHead(initData)
        this.formatDecList(initData)
        this.formatContainer(initData)
        this.isLoaded = true
      })
    },
    getDetail () {
      this.$post({
        url: 'API@/dec-common/customTemplate/getdetail',
        data: this.customTemplateDecPid,
        success: (res) => {
          this.baseInfo.templateName = res.result.templateName
          this.baseInfo.takeEffectFlag = res.result.takeEffectFlag
          this.templateUrl = res.result.templateUrl
          this.init(res.result)
        }
      })
    },
    // 校验
    checkValid (rule, value, callback) {
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if ((rule.required && !value) || (reg && !reg.test(value))) {
        setTimeout(() => {
          this.$refs['baseInfoForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    formatDecHead (initData = {}) {
      this.decHead = {
        label: '报关单表头',
        table: businessUtil.generateDecHeadTable(initData),
        sheetName: initData.templateHeadSheet || this.sheetNames[0],
        startLine: '',
        gap: ''
      }
    },
    formatDecList (initData = {}) {
      this.decList = {
        label: '报关单表体',
        table: businessUtil.generateDecListTable(initData),
        sheetName: initData.templateListSheet || this.sheetNames[0],
        startLine: initData.templateListStart || '',
        gap: initData.listSpaceCell || ''
      }
    },
    formatContainer (initData = {}) {
      this.containerTable = {
        label: '集装箱',
        table: businessUtil.generateContainerTable(initData),
        sheetName: initData.templateContainerSheet || this.sheetNames[0],
        startLine: initData.templateContainerStart || '',
        gap: initData.containerSpaceCell || ''
      }
    },
    generateFieldsByTable (table) {
      let result = {}
      table && table.forEach(item => {
        let key = item.key
        result[key + 'Cell'] = item.cellSetting.toUpperCase()
        result[key + 'Fit'] = item.cellRule
        result[key + 'View'] = item.preview
      })
      return result
    },
    saveTemplate () {
      let isValid = true
      this.$refs['baseInfoForm'].validate((valid) => {
        isValid = valid
      })
      if (!isValid) {
        return
      }
      if (!(this.$refs['decHead'].checkContentValid() && this.$refs['decList'].checkContentValid() && this.$refs['containerTable'].checkContentValid())) {
        return
      }
      // 表头至少要配置一个字段的取值
      let flag = this.decHead.table.some(v => v.cellSetting)
      if (!flag) {
        this.$message.error('表头至少要配置一个字段的取值')
        return
      }
      let param = {
        ...this.baseInfo,
        templateUrl: this.templateUrl,
        templateHeadSheet: this.decHead.sheetName,
        ...this.generateFieldsByTable(this.decHead.table),
        templateListSheet: this.decList.sheetName,
        templateListStart: this.decList.startLine,
        listSpaceCell: this.decList.gap,
        ...this.generateFieldsByTable(this.decList.table),
        templateContainerSheet: this.containerTable.sheetName,
        templateContainerStart: this.containerTable.startLine,
        containerSpaceCell: this.containerTable.gap,
        ...this.generateFieldsByTable(this.containerTable.table)
      }
      let url
      if (this.customTemplateDecPid) {
        url = 'API@/dec-common/customTemplate/edit'
        param.customTemplateDecPid = this.customTemplateDecPid
      } else {
        url = 'API@/dec-common/customTemplate/save'
      }
      this.$post({
        url: url,
        data: param,
        success: (res) => {
          this.messageTips(res.message, 'success')
          if (!this.customTemplateDecPid) {
            this.customTemplateDecPid = res.result
          }
          // 如果是新增页面的保存操作
          if (url === 'API@/dec-common/customTemplate/save') {
            // 先关闭新增
            this.$store.dispatch('CloseTab', this.$store.state.TabsStore.currentTab.tabId)
            // 在打开编辑页面
            this.$router.push({
              name: 'customizeTemplate',
              params: {
                'pid': res.result.decPid,
                'operationType': 'edit',
                'setTitle': '自定义模版' + '-' + res.result.decPid,
                'setId': 'customizeTemplate' + 'edit' + res.result.decPid
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-radio{
    font-weight: normal;
  }
  .customize-add-main{
    padding: 20px;
    height: calc(100% - 40px);
    overflow: auto;
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom : unset;
    }
    .baseInfo, .item{
      padding: 20px;
      background: #fff;
    }
    .item{
      margin: 20px 0;
    }
    .label{
      line-height: 28px;
    }
    .marginTop20{
      margin-top: 20px;
    }
    .paddingTop10{
      padding-top: 10px;
    }
    .right{
      text-align: right;
    }
    .paddingRight21{
      padding-right: 21px;
    }
    .save {
      padding: 8px 20px;
    }
    .query-btn {
      text-align: center;
    }
  }
</style>
