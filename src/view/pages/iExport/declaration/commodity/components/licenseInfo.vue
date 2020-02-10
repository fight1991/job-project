<template>
  <div>
    <el-dialog :modal-append-to-body='false'
    title="编辑许可证VIN"
    :visible.sync="dialogShow"
    width="70%"
    :modal='false'
    :close-on-click-modal="false"
    @open="openDialog()"
    @close="$emit('update:visible',false)">
      <div class="sys-jiner-class">
       <div class="border m-b-10">
          <el-form label-width="120px" :model="licVINForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
            <el-row  >
              <el-col :span="6">
                <el-form-item label="序号">
                  <el-input v-model="licVINForm.gNo" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="许可证类别">
                  <el-select size="mini" filterable v-model="licVINForm.licTypeCode" class="select-Color" disabled>
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
                <el-form-item label="许可证编号">
                  <el-input v-model="licVINForm.licenceNo" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="6">
                <el-form-item label="VIN序号">
                  <el-input v-model="licVINForm.vinNo" :maxlength="100" autofocus></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="提/运单日期" class="select-Color">
                  <el-date-picker
                    v-model="licVINForm.billLaddate"
                    type="date"
                    :editable='false'
                    style="width:100%;"
                    value-format="yyyy-MM-dd"
                    placeholder=" ">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="质量保质期">
                  <el-input v-model="licVINForm.qualityQgp" :maxlength="100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="车辆识别代码(VIN)" >
                  <el-input v-model="licVINForm.vinCode" :maxlength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="9">
                <el-form-item label="发动机号或电机号" >
                  <el-input v-model="licVINForm.motorNo" :maxlength="100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="发票号">
                  <el-input v-model="licVINForm.invoiceNo" :maxlength="30" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发票所列数量" >
                  <el-input v-model="licVINForm.invoiceNum" placeholder="只能输入自然数"  :maxlength="14" @blur="invoiceNumValid"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="12">
                <el-form-item label="品名(中文名称)" >
                  <el-input v-model="licVINForm.prodCnnm"  :maxlength="500" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品名(英文名称)" >
                  <el-input v-model="licVINForm.prodEnnm"  :maxlength="500" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  >
              <el-col :span="12">
                <el-form-item label="型号（英文">
                  <el-input v-model="licVINForm.modelEn"  :maxlength="500" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="底盘(车架)号" >
                  <el-input v-model="licVINForm.chassisNo"  :maxlength="20" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单价">
                  <el-input v-model="licVINForm.pricePerunit"  :maxlength="20" enter='no' @keyup.enter.native='savelicVIN'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
       </div>
      <div class="m-b-10">
          <el-button @click="initData" class='list-btns list-icon-add' :disabled="isView"><i></i>新增</el-button>
          <el-button @click="savelicVIN" class='list-btns list-icon-save' :disabled="isView"><i></i>保存</el-button>
          <el-button @click="dellicVIN" class='list-btns list-icon-delete' :disabled="isView"><i></i>删除</el-button>
      </div>
      <div class="query-table dec-query-table dec-table">
      <el-table  ref="licVINTable" :data="filingInfoForm.decGoodsLimitvins"
        highlight-current-row border size='mini'
        @selection-change="licVINChangeFun"
        @row-click="backLicVINInfo"
        height="300" style="width: 100%">
        <el-table-column  type="selection" min-width="50" align="center"></el-table-column>
        <el-table-column  property="vinNo" label="VIN序号" min-width="80"></el-table-column>
        <el-table-column  property="billLaddate" label="提/运单日期" min-width="120"></el-table-column>
        <el-table-column  property="qualityQgp" label="质量保质期" min-width="90"></el-table-column>
        <el-table-column  property="motorNo" label="发动机号或电机号" min-width="125"></el-table-column>
        <el-table-column  property="vinCode" label="车辆识别代码(VIN)" min-width="130"></el-table-column>
        <el-table-column  property="chassisNo" label="底盘(车架)号" min-width="120"></el-table-column>
        <el-table-column  property="invoiceNo" label="发票号" min-width="100"></el-table-column>
        <el-table-column  property="invoiceNum" label="发票所列数量" min-width="100"></el-table-column>
        <el-table-column  property="prodCnnm" label="品名(中文名称)" min-width="120"></el-table-column>
        <el-table-column  property="prodEnnm" label="品名(英文名称)" min-width="120"></el-table-column>
        <el-table-column  property="modelEn" label="型号(英文)" min-width="120"></el-table-column>
        <el-table-column  property="pricePerunit" label="单价" min-width="50"></el-table-column>
      </el-table>
      </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../decPage/common/decUtil'
export default {
  data () {
    return {
      dialogShow: false,
      licVINForm: this.initForm(),
      LicTypeList: [],
      checkedLicVINVList: []
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
    filingInfoForm: {
      type: Object,
      default: () => {
        return {}
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
      console.log(this.$attrs.LicTypeList)
      this.initData()
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
    // 单独校验 发票所列数量
    invoiceNumValid () {
      if (!(/^\d{1,14}$|^$/.test(this.licVINForm.invoiceNum))) {
        this.licVINForm.invoiceNum = ''
      }
    },
    // 新增 许可证VIN
    initData () {
      this.licVINForm = this.initForm()
      this.licVINForm.licTypeCode = this.filingInfoForm.licTypeCode
      this.licVINForm.licenceNo = this.filingInfoForm.licenceNo
    },
    initForm () {
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
    // 删除 许可证VIN
    dellicVIN () {
      let delData = this.checkedLicVINVList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$emit('delete:license', delData)
        // 清空 被选中的数组
        this.checkedLicVINVList = []
        // 重新 初始化 form表单
        this.initData()
      }
    },
    // 保存、修改 许可证VIN
    savelicVIN () {
      if (util.isEmpty(this.licVINForm.gNo)) {
        // 新增
        this.licVINForm.gNo = this.filingInfoForm.decGoodsLimitvins.length + 1
        this.$emit('back:filingInfo', {
          data: this.licVINForm,
          type: 'add'
        })
      } else {
        // 修改
        let index = parseInt(this.licVINForm.gNo) - 1
        this.$emit('back:filingInfo', {
          data: this.licVINForm,
          type: 'edit',
          index: index
        })
      }
      // 重新 初始化 form表单
      this.initData()
      // 以防 备案信息还没有保存 这里保存一边
      this.$emit('saveFiling')
    },
    // 许可证VIN talbe 选择事件
    licVINChangeFun (value) {
      this.checkedLicVINVList = value
    },
    // 许可证VIN talbe 反填值
    backLicVINInfo (row) {
      this.licVINForm = util.simpleClone(row)
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
