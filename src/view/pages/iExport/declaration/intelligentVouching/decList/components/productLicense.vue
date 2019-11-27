<template>
  <!-- 表体——产品许可证/审批/备案信息组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑产品许可证/审批/备案信息"
      :visible.sync="filingInfoVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='openFilingInfo'
      :before-close='closeCompnent'
      width="80%">
      <div class="border">
        <el-form label-width="100px" :model="filingInfoForm" size="mini"
          @keyup.enter.native="switchFoucsByEnter"
          label-position="right" ref="licRuleForm" :rules="licRuleForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品编码">
                <el-input v-model="decList.codeTs" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品名称">
                <el-input v-model="decList.gName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检验检疫名称">
                <el-input v-model="decList.ciqName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="序号">
                <el-input v-model="filingInfoForm.gNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="许可证类别" :class="{ 'require-color': controller.requireColor }" prop="licTypeCode"  ref="licTypeCode">
              <el-select placeholder=" " v-model="filingInfoForm.licTypeCode"
                @focus="tipsFillMessage('', 'saasLicType1','SAAS_LIC_TYPE')"
                remote filterable clearable  default-first-option
                :remote-method="checkParamsList"
                @clear="clearSelct('saasLicType1')"
                dataRef='licTypeCode'
                :disabled="controller.isWholeDec && controller.isCIQ"
                 style="width:100%" autofocus>
                  <el-option
                    v-for="(item,index) in saasLicType1"
                    :key="index"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="许可证编号" :class="{ 'require-color': controller.requireColor }" prop="licenceNo" ref="licenceNo">
                <el-input v-model="filingInfoForm.licenceNo" :maxlength="40" :readonly="controller.isWholeDec && controller.isCIQ" @blur="licenceNoBlur"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="核销货物序号" prop="licWrtofDetailno" ref="licWrtofDetailno">
                <el-input v-model="filingInfoForm.licWrtofDetailno" :maxlength="2" :readonly="controller.isWholeDec && controller.isCIQ"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="核销数量"  prop="licWrtofQty" ref="licWrtofQty">
                <el-input v-model="filingInfoForm.licWrtofQty" :maxlength="20" :readonly="controller.isWholeDec && controller.isCIQ"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="核销数量单位"  prop="licWrtofQtyUnit" ref="licWrtofQtyUnit">
                <el-select placeholder=" " v-model="filingInfoForm.licWrtofQtyUnit"
                  @focus="tipsFillMessage('', 'saasUnit4','SAAS_UNIT')"
                  ref="licWrtofQtyUnit" dataRef ='licWrtofQtyUnit'
                  remote  default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasUnit4')"
                  :maxlength="3"
                  enter = 'no'
                  @keyup.enter.native ='savefilingInfo'
                  clearable filterable :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)"
                  style="width:100%">
                  <el-option
                    v-for="item in saasUnit4"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-row>
          <el-button icon="fa fa-plus" @click="AddfilingInfo" class='secondButton' :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)">新增</el-button>
          <el-button icon="fa fa-sign-in" @click="savefilingInfo" class='secondButton'  :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)">保存</el-button>
          <el-button icon="fa fa-trash-o" @click="delfilingInfo" class='secondButton'  :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)">删除</el-button>
          <el-button  @click="openLicVIN" class='secondButton'>许可证VIN信息</el-button>
        </el-row>
      </div>
      <el-table  ref="filingInfoTable" :data="decGoodsLimits"
        highlight-current-row border size='mini'
        @selection-change="filingInfoChangeFun"
        @row-click="backFilingInfo"
        height="300" style="width: 100%">
        <el-table-column  type="selection" min-width="50"></el-table-column>
        <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
        <el-table-column  property="licTypeCode" label="许可证类别代码" min-width="80"></el-table-column>
        <el-table-column  property="licTypeCodeValue" label="许可证类别名称" min-width="100"></el-table-column>
        <el-table-column  property="licenceNo" label="许可证编号" min-width="80"></el-table-column>
        <el-table-column  property="licWrtofDetailno" label="核销货物序号" min-width="50"></el-table-column>
        <el-table-column  property="licWrtofQty" label="核销数量" min-width="100"></el-table-column>
        <el-table-column  property="licWrtofQtyUnitVaue" label="核销数量单位" min-width="80"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 产品许可证/审批/备案信息 -->
    <license-vin :licVINVisible='licVINVisible' :filingInfoForm="filingInfoForm" :controller='controller'  @close:licenseVin="backLicenseVin" :moduleName="moduleName"></license-vin>
  </section>
</template>
<script>
import util from '@/common/util.js'
import decUtil from '../../common/decUtil'
import decBus from '../../common/bus'
import licenseVin from './licenseVin'
export default {
  name: 'product-license',
  components: {
    licenseVin
  },
  props: {
    filingInfoVisible: {
      type: Boolean,
      default: false
    },
    decList: {
      type: Object,
      require: true
    },
    controller: {
      type: Object,
      require: true
    },
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      filingInfoForm: this.resetForm(),
      decGoodsLimits: [],
      licVINVisible: false,
      checkedFilingInfoList: [],
      filingInfoSelect: { // 产品许可证/审批/备案信息
        'licTypeCode': {obj: 'saasLicType1', params: 'SAAS_LIC_TYPE'}, // 许可证类别
        'licWrtofQtyUnit': {obj: 'saasUnit4', params: 'SAAS_UNIT'} // 核销数量
      },
      licRuleForm: {
        licTypeCode: [ // 许可证类别
          {validator: this.checkValid, message: '输入许可证类别', trigger: 'blur'}
        ],
        licenceNo: [ // 许可证编号
          {validator: this.checkValid, message: '输入许可证编号', trigger: 'blur'}
        ],
        licWrtofQty: [ // 核销数量
          {validator: this.checkValid, message: '输入整数最多14位，小数最多5的非负数', trigger: 'blur'}
        ]
      },
      saasLicType1: [],
      saasUnit4: [],
      selectObj: {
        obj: '',
        params: ''
      },
      ruleRegx: {
        // 产品资质
        'licTypeCode': '^[0-9a-zA-Z]{1,6}$', // 许可证类别
        'licenceNo': '^.{1,40}$', // 许可证编号
        'licWrtofQty': '^\\d{1,14}(\\.\\d{1,5})?$|^$' // 核销数量
      }
    }
  },
  created () {
    decBus.$on('setValueForFilingInfoForm', this.setValueForFilingInfoForm)
  },
  methods: {
    checkValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['licRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    openFilingInfo () {
      this.decGoodsLimits = util.simpleClone(this.decList.decGoodsLimits)
    },
    // 关闭 产品资质  备案信息 弹出框
    closeCompnent () {
      // 清除input数据
      this.AddfilingInfo()
      this.$emit('close:productLicense', {decGoodsLimits: this.decGoodsLimits})
    },
    // 清空 产品资质 备案信息
    AddfilingInfo () {
      this.filingInfoForm = this.resetForm()
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'saasLicType1', value: []})
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'saasUnit4', value: []})
    },
    resetForm () {
      return {
        goodsLimitPid: '', // 主键
        decListPid: '', // 表体 主键
        gNo: '', // 序号
        licTypeCode: '', // 许可证类别代码
        licTypeCodeValue: '', // 许可证类别名称
        licWrtofQty: '', // 许可证核销数量
        licWrtofQtyUnit: '', // 许可证核销数量单位
        licWrtofQtyUnitVaue: '', // 许可证核销数量单位名称
        licenceNo: '', // 许可证编号
        licWrtofDetailno: '', // 许可证核销明细序号
        goodsNo: '', // 商品序号
        decGoodsLimitvins: [] // 许可证VIN
      }
    },
    // 保存 产品资质 备案信息
    savefilingInfo () {
      if (this.controller.isWholeDec && this.controller.isCIQ) {
        return false
      }
      let flag = this.savefilingInfoNoRefresh()
      if (flag === true) {
        // 重新 初始化表单
        this.AddfilingInfo()
      }
    },
    // 保存 产品资质 备案信息 不清除 表单数据
    savefilingInfoNoRefresh () {
      let flag = false
      this.$refs['licRuleForm'].validate((valid) => {
        if (valid === false) {
          flag = false
        } else {
          // 许可证类型 code 转name
          let list = this.saasLicType1
          for (let i in list) {
            if (list[i].codeField === this.filingInfoForm.licTypeCode) {
              this.filingInfoForm.licTypeCodeValue = list[i].nameField
            }
          }
          // 核销数量单位code 转name
          let list2 = this.saasUnit4
          for (let i in list2) {
            if (list2[i].codeField === this.filingInfoForm.licWrtofQtyUnit) {
              this.filingInfoForm.licWrtofQtyUnitVaue = list2[i].nameField
            }
          }
          if (util.isEmpty(this.filingInfoForm.gNo)) {
            // 新增
            this.filingInfoForm.gNo = this.decGoodsLimits.length + 1
            this.decGoodsLimits.push(util.simpleClone(this.filingInfoForm))
          } else {
            // 修改
            let index = parseInt(this.filingInfoForm.gNo) - 1
            this.decGoodsLimits[index] = util.simpleClone(this.filingInfoForm)
            this.decGoodsLimits.push({})
            this.decGoodsLimits.pop()
          }
          flag = true
        }
      })
      return flag
    },
    // 删除 产品资质 备案信息
    delfilingInfo () {
      let delData = this.checkedFilingInfoList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.decGoodsLimits) {
              if (delData[index].gNo === this.decGoodsLimits[item].gNo) {
                this.decGoodsLimits.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedFilingInfoList = []
          // 重新排序
          for (let i in this.decGoodsLimits) {
            this.decGoodsLimits[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化表单
          this.AddfilingInfo()
        }).catch(() => {
        })
      }
    },
    // 产品资质 备案信息 获取被选中的值
    filingInfoChangeFun (value) {
      this.checkedFilingInfoList = util.simpleClone(value)
    },
    // 反填数据 产品资质 备案信息
    backFilingInfo (row) {
      this.setValueForFilingInfoForm(row)
      this.filingInfoForm = util.simpleClone(row)
      // 初始化下拉框
      decUtil.initSelect(this, this.filingInfoSelect, this.filingInfoForm)
    },
    setValueForFilingInfoForm (data) {
      // 初始化数据
      this.filingInfoForm = util.simpleClone(data)
      this.filingInfoForm.decGoodsLimitvins = []
      // 初始化下拉框
      decUtil.initSelect(this, this.filingInfoSelect, this.filingInfoForm)
    },
    // 打开 许可证VIN
    openLicVIN () {
      // 判断时否满足 弹出 条件
      this.$refs['licRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          this.licVINVisible = true
        }
      })
    },
    backLicenseVin (param) {
      if (param !== null) {
        this.filingInfoForm.decGoodsLimitvins = util.simpleClone(param.decGoodsLimitvins)
      }
      this.licVINVisible = false
      // 以防 备案信息还没有保存 这里保存一次
      this.savefilingInfoNoRefresh()
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
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
    // 校验证书有效性
    licenceNoBlur () {
      if (['410', '411'].includes(this.filingInfoForm.licTypeCode) && this.filingInfoForm.licenceNo) {
        this.$post({
          url: 'API@/dec-common/dec/common/checkDecLicence',
          data: {licTypeCode: this.filingInfoForm.licTypeCode, licenceNo: this.filingInfoForm.licenceNo},
          success: (res) => {},
          other: (res) => {
            this.messageTips(res.message, 'error')
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../common/decCss';
</style>
