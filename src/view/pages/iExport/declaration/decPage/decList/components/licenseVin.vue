<template>
  <!-- 表体——许可证VIN组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑许可证VIN"
      :visible.sync="licVINVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='openLicVIN'
      :before-close='closeCompnent'
      v-dialogDrag
      width="70%">
       <div class="border">
          <el-form label-width="120px" :model="licVINForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
            <el-row  >
              <el-col :span="6">
                <el-form-item label="序号">
                  <el-input v-model="licVINForm.gNo" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="许可证类别">
                  <el-select placeholder=" " v-model="licVINForm.licTypeCode" disabled
                     ref="licTypeCode" dataRef='licTypeCode'
                    @focus="tipsFillMessage('', 'saasLicType2','SAAS_LIC_TYPE')"
                    remote  default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('saasLicType2')"
                    style="width:100%" >
                    <el-option
                      v-for="(item,index) in saasLicType2"
                      :key="index"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="许可证编号">
                  <el-input v-model="licVINForm.licenceNo" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="6">
                <el-form-item label="VIN序号">
                  <el-input v-model="licVINForm.vinNo"
                    @input='checklen("licVINForm", "vinNo", 100)'
                    :maxlength="100"
                    autofocus
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="提/运单日期">
                  <el-date-picker
                    v-model="licVINForm.billLaddate"
                    type="date"
                    :disabled="controller.isWholeDec"
                    :editable='false'
                    style="width:100%"
                    value-format="yyyy-MM-dd"
                    placeholder=" ">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="质量保质期">
                  <el-input v-model="licVINForm.qualityQgp"
                    @input='checklen("licVINForm", "qualityQgp", 100)'
                    :maxlength="100"
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="车辆识别代码(VIN)" >
                  <el-input v-model="licVINForm.vinCode"
                    @input='checklen("licVINForm", "vinCode", 20)'
                    :maxlength="20"
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="9">
                <el-form-item label="发动机号或电机号" >
                  <el-input v-model="licVINForm.motorNo"
                    @input='checklen("licVINForm", "motorNo", 100)'
                    :maxlength="100"
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="发票号">
                  <el-input v-model="licVINForm.invoiceNo"
                    @input='checklen("licVINForm", "invoiceNo", 30)'
                    :maxlength="30"
                    :readonly="controller.isWholeDec && controller.isCIQ" >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发票所列数量" >
                  <el-input v-model="licVINForm.invoiceNum"
                    @input='decCheckInt("invoiceNum", 14)'
                    placeholder="只能输入自然数"
                    :maxlength="14"
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="12">
                <el-form-item label="品名(中文名称)" >
                  <el-input v-model="licVINForm.prodCnnm"
                    @input='checklen("licVINForm", "prodCnnm", 500)'
                    :maxlength="500"
                    :readonly="controller.isWholeDec && controller.isCIQ" >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品名(英文名称)" >
                  <el-input v-model="licVINForm.prodEnnm"
                    @input='checklen("licVINForm", "prodEnnm", 500)'
                    :maxlength="500"
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="12">
                <el-form-item label="型号（英文)">
                  <el-input v-model="licVINForm.modelEn"
                    @input='checklen("licVINForm", "modelEn", 500)'
                    :maxlength="500"
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="底盘(车架)号" >
                  <el-input v-model="licVINForm.chassisNo"
                    @input='checklen("licVINForm", "chassisNo", 20)'
                    :maxlength="20"
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单价">
                  <el-input v-model="licVINForm.pricePerunit"
                    @input='checklen("licVINForm", "pricePerunit", 20)'
                    :maxlength="20" enter = 'no'
                    @keyup.enter.native ='savelicVIN'
                    :readonly="controller.isWholeDec && controller.isCIQ">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
       </div>
      <div>
        <el-row>
          <el-button icon="fa fa-plus" @click="AddlicVIN" class='secondButton' :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)">新增</el-button>
          <el-button icon="fa fa-save" @click="savelicVIN" class='secondButton' :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)">保存</el-button>
          <el-button icon="fa fa-trash-o" @click="dellicVIN" class='secondButton' :disabled="controller.isDisabled || (controller.isWholeDec && controller.isCIQ)">删除</el-button>
        </el-row>
      </div>
      <el-table  ref="licVINTable" :data="decGoodsLimitvins"
        highlight-current-row border size='mini'
        @selection-change="licVINChangeFun"
        @row-click="backLicVINInfo"
        height="300" style="width: 100%">
        <el-table-column  type="selection" min-width="50"></el-table-column>
        <el-table-column  property="gNo" label="VIN序号" min-width="50"></el-table-column>
        <el-table-column  property="billLaddate" label="提/运单日期" min-width="100"></el-table-column>
        <el-table-column  property="qualityQgp" label="质量保质期" min-width="80"></el-table-column>
        <el-table-column  property="motorNo" label="发动机号或电机号" min-width="100"></el-table-column>
        <el-table-column  property="vinCode" label="车辆识别代码(VIN)" min-width="100"></el-table-column>
        <el-table-column  property="chassisNo" label="底盘(车架)号" min-width="100"></el-table-column>
        <el-table-column  property="invoiceNo" label="发票号" min-width="100"></el-table-column>
        <el-table-column  property="invoiceNum" label="发票所列数量" min-width="80"></el-table-column>
        <el-table-column  property="prodCnnm" label="品名(中文名称)" min-width="120"></el-table-column>
        <el-table-column  property="prodEnnm" label="品名(英文名称)" min-width="120"></el-table-column>
        <el-table-column  property="modelEn" label="型号(英文)" min-width="120"></el-table-column>
        <el-table-column  property="pricePerunit" label="单价" min-width="50"></el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util.js'
import decUtil from '../../common/decUtil'
import decBus from '../../common/bus'
export default {
  name: 'product-vin',
  props: {
    licVINVisible: {
      type: Boolean,
      default: false
    },
    filingInfoForm: {
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
      licVINForm: this.resetForm(),
      decGoodsLimitvins: [],
      checkedLicVINVList: [], // 许可证VIN 列表 被选中
      licVINSelect: { // 许可证VIN
        'licTypeCode': {obj: 'saasLicType2', params: 'SAAS_LIC_TYPE'} // 许可证类别
      },
      selectObj: {
        obj: '',
        params: ''
      },
      saasLicType2: []
    }
  },
  created () {
    decBus.$on('setValueForlicVINForm', this.setValueForlicVINForm)
  },
  methods: {
    openLicVIN () {
      this.decGoodsLimitvins = util.simpleClone(this.filingInfoForm.decGoodsLimitvins)
      this.licVINForm.licTypeCode = this.filingInfoForm.licTypeCode
      this.licVINForm.licenceNo = this.filingInfoForm.licenceNo
      this.$nextTick(_ => {
        decUtil.initSelect(this, this.licVINSelect, this.licVINForm)
      })
    },
    // 新增 许可证VIN
    AddlicVIN () {
      this.licVINForm = this.resetForm()
      this.licVINForm.licTypeCode = this.filingInfoForm.licTypeCode
      this.licVINForm.licenceNo = this.filingInfoForm.licenceNo
      decUtil.initSelect(this, this.licVINSelect, this.licVINForm)
    },
    resetForm () {
      return {
        pid: '', // 主键
        goodsLimitPid: '', // 产品资质许可证信息表PID
        billLaddate: '', // 提/运单日期
        chassisNo: '', // 底盘(车架)号
        gNo: '', // 序号
        invoiceNum: '', // 发票所列数量
        licTypeCode: '', // 许可证类别代码
        licenceNo: '', // 许可证编号
        modelEn: '', // 型号（英文）
        motorNo: '', // 发动机号或电机号
        pricePerunit: '', // 单价
        prodCnnm: '', // 品名（中文名称）
        prodEnnm: '', // 品名（英文名称）
        qualityQgp: '', // 质量保质期
        vinCode: '', // 车辆识别代码（VIN）
        vinNo: ''// VIN序号
      }
    },
    // 关闭许可证VIN 弹窗
    closeCompnent () {
      // 清除input 数据
      this.AddlicVIN()
      this.$emit('close:licenseVin', {decGoodsLimitvins: this.decGoodsLimitvins})
    },
    // 保存、修改 许可证VIN
    savelicVIN () {
      if (this.controller.isWholeDec && this.controller.isCIQ) {
        return false
      }
      if (util.isEmpty(this.licVINForm.gNo)) {
        // 新增
        this.licVINForm.gNo = this.decGoodsLimitvins.length + 1
        this.decGoodsLimitvins.push(util.simpleClone(this.licVINForm))
      } else {
        // 修改
        let index = parseInt(this.licVINForm.gNo) - 1
        this.decGoodsLimitvins[index] = util.simpleClone(this.licVINForm)
        // 为了刷新列表的 操作
        this.decGoodsLimitvins.push({})
        this.decGoodsLimitvins.pop()
      }
      // 重新 初始化 form表单
      this.AddlicVIN()
    },
    // 删除 许可证VIN
    dellicVIN () {
      let delData = this.checkedLicVINVList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.decGoodsLimitvins) {
              if (delData[index].gNo === this.decGoodsLimitvins[item].gNo) {
                this.decGoodsLimitvins.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedLicVINVList = []
          // 重新排序
          for (let i in this.decGoodsLimitvins) {
            this.decGoodsLimitvins[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化 form表单
          this.AddlicVIN()
        }).catch(() => {
        })
      }
    },
    // 许可证VIN talbe 选择事件
    licVINChangeFun (value) {
      this.checkedLicVINVList = util.simpleClone(value)
    },
    // 许可证VIN talbe 反填值
    backLicVINInfo (row) {
      this.setValueForlicVINForm(row)
    },
    setValueForlicVINForm (data) {
      this.licVINForm = util.simpleClone(data)
      decUtil.initSelect(this, this.licVINSelect, this.licVINForm)
    },
    /**
   * 控制输入中英文字符长度，一个中文当做2个长度来控制
   * @param inpt
   * @param maxlen
   */
    checklen (type, ipnut, maxlen) {
      decUtil.checklen(this, type, ipnut, maxlen)
    },
    // 只允许输入正整数
    decCheckInt (ipnut, maxlen) {
      let value = this.licVINForm[ipnut]
      let t = value.replace(/[^(()\d&|)]/g, '')
      if (t.length > maxlen) {
        value = this.licVINForm[ipnut] = value.substr(0, maxlen - 1)
      } else {
        this.licVINForm[ipnut] = t
      }
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
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../common/decCss';
</style>
