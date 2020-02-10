<template>
  <div>
    <el-dialog :modal-append-to-body='false' title="产品许可证/审批/备案信息" :visible.sync="dialogShow" width="70%" :modal='false' :close-on-click-modal="false" @open="openDialog()" @close="$emit('update:visible',false)">
      <div class="sys-jiner-class">
      <div class="border m-b-10">
        <el-form label-width="100px" :model="filingInfoForm" size="mini" @keyup.enter.native="switchFoucsByEnter" label-position="right" ref="licRuleForm" :rules="licRuleForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品编码">
                <el-input v-model="baseInfo.codeTs" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品名称">
                <el-input v-model="baseInfo.gName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检验检疫名称">
                <el-input v-model="baseInfo.ciqName" disabled></el-input>
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
              <el-form-item label="许可证类别" :class="{ 'require-color': controller.requireColor }"  prop="licTypeCode" ref="licTypeCode">
                <el-select size="mini" filterable v-model="filingInfoForm.licTypeCode" class="select-Color" :disabled="isView">
                  <el-option
                    v-for="item in LicTypeList"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="许可证编号" :class="{ 'require-color': controller.requireColor }" prop="licenceNo" ref="licenceNo">
                <el-input v-model="filingInfoForm.licenceNo" :maxlength="40"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  >
            <el-col :span="6">
              <el-form-item label="核销货物序号" prop="licWrtofDetailno" ref="licWrtofDetailno">
                <el-input v-model="filingInfoForm.licWrtofDetailno" :maxlength="2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="核销数量"  prop="licWrtofQty" ref="licWrtofQty">
                <el-input v-model="filingInfoForm.licWrtofQty" :maxlength="20" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="核销数量单位"  prop="licWrtofQtyUnit" ref="licWrtofQtyUnit">
                <el-select size="mini" filterable v-model="filingInfoForm.licWrtofQtyUnit" class="select-Color" :disabled="isView">
                  <el-option
                    v-for="item in paramsOptions['SAAS_UNIT']"
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
      <div class="m-b-10">
          <el-button @click="initData" class="list-btns list-icon-add" :disabled="isView"><i></i>新增</el-button>
          <el-button @click="savefilingInfo" class="list-btns list-icon-save"  :disabled="isView"><i></i>保存</el-button>
          <el-button @click="delfilingInfo" class="list-btns list-icon-delete"  :disabled="isView"><i></i>删除</el-button>
          <el-button class="list-btns" style="width: 100px;" @click="openLicVIN">许可证VIN信息</el-button>
      </div>
      <div class="query-table dec-query-table dec-table">
        <el-table ref="filingInfoTable" :data="baseInfo.decGoodsLimits"
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
          <el-table-column  property="licWrtofQtyUnitValue" label="核销数量单位" min-width="80"></el-table-column>
        </el-table>
      </div>
      </div>
    </el-dialog>
    <license-info :visible.sync="licVINVisible" :isView="isView" :filingInfoForm="filingInfoForm" @back:license="backLicense" @delete:license="deleteLicense" @saveFiling="savefilingInfoNoRefresh"></license-info>
  </div>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../decPage/common/decUtil'
import licenseInfo from './licenseInfo.vue'
export default {
  components: {
    licenseInfo
  },
  data () {
    return {
      dialogShow: false,
      filingInfoForm: this.initForm(),
      licRuleForm: {
        licTypeCode: [ // 许可证类别
          {required: true, message: '输入许可证类别', trigger: 'change'}
        ]
      },
      checkedFilingInfoList: [],
      LicTypeList: [],
      licVINVisible: false
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    },
    licTypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    paramsOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    controller: {
      type: Object,
      default: () => {
        return {
          requiredColor: true
        }
      }
    }
  },
  watch: {
    'visible' (newVal) {
      this.dialogShow = newVal
    }
  },
  methods: {
    openDialog () {
      this.initData()
      this.LicTypeList = this.licTypeList
    },
    // 清空 产品资质 备案信息
    initData () {
      this.filingInfoForm = this.initForm()
      this.$nextTick(() => {
        this.$refs['licRuleForm'].clearValidate()
      })
    },
    initForm () {
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
          let ref
          if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
            ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
            this.$refs[ref].blur()
          } else {
            if (!util.isEmpty(e.target.attributes.dataRef)) {
              ref = e.target.attributes.dataRef.nodeValue
            }
          }
          if (ref === 'gName') {
            this.$refs['codeTs'].$children[0].focus()
            this.$refs['codeTs'].$children[0].select()
          } else {
            next.focus()
            next.select()
          }
        }
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
          for (let i in this.LicTypeList) {
            if (this.LicTypeList[i].codeField === this.filingInfoForm.licTypeCode) {
              this.filingInfoForm.licTypeCodeValue = this.LicTypeList[i].nameField
            }
          }
          // 核销数量单位code 转name
          for (let i in this.paramsOptions['SAAS_UNIT']) {
            if (this.paramsOptions['SAAS_UNIT'][i].codeField === this.filingInfoForm.licWrtofQtyUnit) {
              this.filingInfoForm.licWrtofQtyUnitValue = this.paramsOptions['SAAS_UNIT'][i].nameField
            }
          }
          if (util.isEmpty(this.filingInfoForm.gNo)) {
            // 新增
            this.filingInfoForm.gNo = this.baseInfo.decGoodsLimits.length + 1
            this.$emit('back:filingInfo', {
              data: this.filingInfoForm,
              type: 'add'
            })
          } else {
            // 修改
            let index = parseInt(this.filingInfoForm.gNo) - 1
            this.$emit('back:filingInfo', {
              data: this.filingInfoForm,
              type: 'edit',
              index: index
            })
          }
          flag = true
        }
      })
      return flag
    },
    // 保存 产品资质 备案信息
    savefilingInfo () {
      let flag = this.savefilingInfoNoRefresh()
      if (flag === true) {
        // 重新 初始化表单
        this.initData()
      }
    },
    // 删除 产品资质 备案信息
    delfilingInfo () {
      let delData = this.checkedFilingInfoList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$emit('delete:filingInfo', delData)
        // 清空 被选中的数组
        this.checkedFilingInfoList = []
        // 重新 初始化表单
        this.initData()
      }
    },
    // 反填数据 产品资质 备案信息
    backFilingInfo (row) {
      // 初始化数据
      this.filingInfoForm = util.simpleClone(row)
    },
    // 产品资质 备案信息 获取被选中的值
    filingInfoChangeFun (value) {
      this.checkedFilingInfoList = value
    },
    // 打开 许可证VIN
    openLicVIN () {
      // 判断时否满足 弹出 条件
      this.$refs['licRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          // 显示弹出框
          this.licVINVisible = true
        }
      })
    },
    backLicense (params) {
      if (params.type === 'add') {
        this.filingInfoForm.decGoodsLimitvins.push(util.simpleClone(params.data))
      } else {
        this.filingInfoForm.decGoodsLimitvins[params.index] = util.simpleClone(params.data)
        // 为了刷新列表的 操作
        this.filingInfoForm.decGoodsLimitvins.push({})
        this.filingInfoForm.decGoodsLimitvins.pop()
      }
    },
    deleteLicense (params) {
      for (let index in params) {
        for (let item in this.filingInfoForm.decGoodsLimitvins) {
          if (params[index].gNo === this.filingInfoForm.decGoodsLimitvins[item].gNo) {
            this.filingInfoForm.decGoodsLimitvins.splice(item, 1)
            break
          }
        }
      }
      // 重新排序
      for (let i in this.filingInfoForm.decGoodsLimitvins) {
        this.filingInfoForm.decGoodsLimitvins[i].gNo = parseInt(i) + 1
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .m-b-10{
    margin-bottom: 10px;
  }
  .border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
  }
</style>
