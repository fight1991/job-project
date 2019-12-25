<template>
  <!-- 附注信息的组件 -->
  <section>
    <div class="border">
      <span>从以下模板中选择想用的初始值模板，请选择:</span>
      <el-table
        ref="templateTable"
        :data="templateList"
        highlight-current-row border size='mini'
        height="200"
        max-height="300" style="width: 100%">
        <el-table-column  label="" min-width="35" align="center">
          <template slot-scope="scope">
            <input
            class="template-radio"
            :value="scope.row.decPid"
            v-model="templateRadio"
            name = "xxx"
            @click="getTemplateRow(scope.$index, scope.row)"
            type="radio"/>
          </template>
        </el-table-column>
        <el-table-column  property="settingsName" label="模板名称" min-width="100"></el-table-column>
        <el-table-column  property="effective" label="模板可见范围" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.effective === '1' ? '使用单位可见' : '仅创建人可见'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list' style='border:0'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
      <el-row style='border:0'>
         <el-checkbox v-model="isDefult">是否为默认</el-checkbox>
      </el-row>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class='dialog-primary-btn' @click="configBtn">确定</el-button>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
import decUtil from '../common/decUtil'
export default {
  name: 'init-template',
  props: {
    initParams: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checkedTemplate: {
        decPid: '',
        settingsName: '',
        effective: '',
        isdefault: ''
      }, // 被选中的模板
      templateList: [], // 可用的模板 列表
      isDefult: false,
      templateData: {}, // 模板数据
      iEFlag: '', // 进出口标识
      templateRadio: '' // 设置默认选中
    }
  },
  mounted () {
    this.iEFlag = this.initParams
    // 查询可用的模板
    this.queryTemplate()
  },
  watch: {
    templateList: 'setDefaultCheck'
  },
  methods: {
    configBtn () {
      if (this.isDefult && this.checkedTemplate.decPid === '') { // 设置了默认 但没有选择默认数据
        this.messageTips('请选择一条数据设置默认', 'error')
        return false
      } else if (this.isDefult && this.checkedTemplate.effective === '1') { // 设置了 默认 但 选择的数据为单位可见
        this.messageTips('单位可见模板不能设置默认模板', 'error')
      } else if (this.isDefult && this.checkedTemplate.effective === '2') { // 设置了 默认 选择的数据为自己可见
        // 更新默认值的方法
        this.updateDefultTemplate(this.checkedTemplate.decPid)
        // 查询 选择的 数据 queryMergeInitSettings
        this.queryTemplateById(this.checkedTemplate.decPid)
      } else if (this.isDefult === false && this.checkedTemplate.decPid === '') { // 没有 设置默认 也没有 选择数据
        // 取消默认设置
        this.cancleDefultTemplate()
        this.$emit('backDatas', {templateData: util.simpleClone(this.templateData), type: 'cancle'})
      } else if (this.isDefult === false && this.checkedTemplate.decPid !== '') { // 没事设置默认 选择了数据
        // 取消默认设置
        this.cancleDefultTemplate()
        // 取消以前填写的默认值 查询 默认值 方法
        this.queryTemplateById(this.checkedTemplate.decPid)
      }
    },
    cancleBtn () {
      this.$emit('cancLeData')
      this.checkedTemplate = {}
    },
    // 被选中的参数
    getTemplateRow (index, value) {
      if (value.decPid === this.checkedTemplate.decPid) { // 取消选择
        this.templateRadio = ''
        this.checkedTemplate = {
          decPid: '',
          settingsName: '',
          effective: '',
          isdefault: ''
        }
      } else {
        this.checkedTemplate = util.simpleClone(value)
      }
    },
    // 更新 默认模板
    updateDefultTemplate (id) {
      this.$post({
        url: 'API@/dec-common/dec/initSetting/updateDefaultTemplate',
        data: {decPid: id,
          iEFlag: this.iEFlag
        },
        success: (res) => {
          // 不需要提示
        }
      })
    },
    // 取消默认模板
    cancleDefultTemplate () {
      this.$post({
        url: 'API@/dec-common/dec/initSetting/cancelDefultTemplate',
        data: {iEFlag: this.iEFlag},
        success: (res) => {
        }
      })
    },
    // 根据模板Id查询模板
    queryTemplateById (id) {
      this.$post({
        url: 'API@/dec-common/dec/initSetting/getDecInitDetail',
        data: {initHeadId: id, usePoint: '1'},
        success: (res) => {
          this.templateData = res.result
          this.templateData.decHeadVO.netWt = decUtil.removeZero(this.templateData.decHeadVO.netWt)
          this.templateData.decHeadVO.grossWt = decUtil.removeZero(this.templateData.decHeadVO.grossWt)
          this.templateData.decHeadVO.feeRate = decUtil.removeZero(this.templateData.decHeadVO.feeRate)
          this.templateData.decHeadVO.insurRate = decUtil.removeZero(this.templateData.decHeadVO.insurRate)
          this.templateData.decHeadVO.otherRate = decUtil.removeZero(this.templateData.decHeadVO.otherRate)
          this.tableList = res.result.decListVO // 表体
          for (let x in this.templateData.decListVO) {
            this.templateData.decListVO[x].declPrice = decUtil.removeZero(this.templateData.decListVO[x].declPrice)
            this.templateData.decListVO[x].gQty = decUtil.removeZero(this.templateData.decListVO[x].gQty)
            this.templateData.decListVO[x].qty1 = decUtil.removeZero(this.templateData.decListVO[x].qty1)
            this.templateData.decListVO[x].qty2 = decUtil.removeZero(this.templateData.decListVO[x].qty2)
            this.templateData.decListVO[x].declTotal = decUtil.removeZero(this.templateData.decListVO[x].declTotal)
          }
          this.sumbitData()
        }
      })
    },
    // 设置默认选中
    setDefaultCheck () {
      for (let i in this.templateList) {
        if (this.templateList[i].isdefault === 'Y') {
          this.templateRadio = this.templateList[i].decPid
          this.isDefult = true
          this.checkedTemplate = this.templateList[i]
          break
        }
      }
    },
    // 提交数据
    sumbitData () {
      this.$emit('backDatas', {templateData: util.simpleClone(this.templateData), type: 'sure'})
      // this.checkedTemplate = []
    },
    // 查询可用的模板
    queryTemplate () {
      this.pageList(this.$store.state.pagination)
    },
    // 分页列表
    pageList (pagination) {
      this.isDefult = false
      this.$post({
        url: 'API@/dec-common/dec/initSetting/getInitRangeList',
        data: {
          iEFlag: this.initParams,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.templateList = res.result
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.template-radio{
  width: 15px;
  height: 15px;
}
</style>
