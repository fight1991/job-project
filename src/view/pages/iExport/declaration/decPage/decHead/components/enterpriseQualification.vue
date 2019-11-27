<template>
<!-- 报关单表头——企业资质信息组件 -->
  <section>
    <!-- 企业资质 弹出框 开始-->
    <el-dialog :modal-append-to-body='false'
      title="编辑企业资质信息"
      :visible.sync="entQuaVisible"
      :before-close='closeCompnent'
      @open="entQuaShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      v-dialogDrag
      width="650px">
      <div class="border">
        <el-form label-width="120px" :model="copLimitsForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
          <el-row  >
            <el-col :span="12">
              <el-form-item label="企业资质类别">
                <el-select placeholder=" " v-model="copLimitsForm.entQualiftypeCode"
                  @focus="tipsFillMessage('', 'saasEntQualifType','SAAS_ENT_QUALIF_TYPE')"
                  remote filterable  clearable default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasEntQualifType')"
                   ref="entQualiftypeCode" dataRef ='entQualiftypeCode'
                  style="width:100%" @change ="entQuaChanged" >
                  <el-option
                    v-for="(item,index) in saasEntQualifType"
                    :key="index"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业资质编号">
                <el-input v-model="copLimitsForm.entQualifNo"  :maxlength='40' @keyup.enter.native="savedEntQua" enter = 'no'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-row class="border-bottom">
          <el-button icon="fa fa-plus" @click="AddEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">新增</el-button>
          <el-button icon="fa fa-sign-in" @click="savedEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">保存</el-button>
          <el-button icon="fa fa-trash-o" @click="deldEntQua" class="secondButton" size="mini" :disabled="controller.isDisabled">删除</el-button>
        </el-row>
      </div>
      <el-table  ref="entQuaTable" :data="decCopLimits"
        highlight-current-row border size='mini'
        @selection-change="copLimitschangeFun"
        @row-click="backCopLimitsInfo"
        max-height="300" style="width: 100%">
        <el-table-column  type="selection" min-width="50"></el-table-column>
        <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
        <el-table-column  property="entQualiftypeCode" label="企业资质类别代码" min-width="100"></el-table-column>
        <el-table-column  property="entQualiftypeName" label="企业资质类别名称" min-width="100"></el-table-column>
        <el-table-column  property="entQualifNo" label="企业资质编号" min-width="100"></el-table-column>
      </el-table>
      <el-checkbox v-model="checkPromise" @change='cropPromiseClick'><span class="tips">企业承诺：本单位持有海关要求的合格保证、标签标识及其他证明声明材料，知悉相关材料内容，保证符合法律法规要求，并自存留档。</span></el-checkbox>
    </el-dialog>
    <!--使用人 弹出框 结束-->
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../common/decUtil'
export default {
  name: 'enterprise-qualification',
  props: {
    decCopLimits: {
      type: Array,
      required: true
    },
    controller: {
      type: Object,
      require: true
    },
    entQuaVisible: {
      type: Boolean,
      default: false
    },
    copmpanyPromise: {
      type: Boolean,
      default: false
    },
    selectObj: {
      type: Object,
      require: true
    },
    saasEntQualifType: {
      type: Array,
      require: true
    },
    showCustomsCode: {
      type: Boolean,
      default: true
    },
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      copLimitsForm: {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      },
      cropLimit: {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '1', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      },
      checkPromise: false,
      checkedEntQuaList: [] // 被选中的企业资质
    }
  },
  methods: {
    // 打开弹出层
    entQuaShow () {
      this.copLimitsForm = {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      }
      this.saasEntQualifType = []
      this.checkPromise = this.copmpanyPromise
      this.promiseChange(this.checkPromise)
    },
    // 新增 企业资质
    AddEntQua () {
      this.copLimitsForm = {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        entQualifNo: '', // 企业资质编号
        entQualiftypeCode: '', // 企业资质类别代码
        entQualiftypeName: '' // 企业资质类别名称
      }
      this.saasEntQualifType = []
      this.$refs['entQualiftypeCode'].focus()
    },
    // 企业资质类别值变化时的操作
    entQuaChanged (value) {
      let list = this.saasEntQualifType
      for (let index in list) {
        if (list[index].codeField === value) {
          this.copLimitsForm.entQualiftypeName = list[index].nameField
          break
        }
      }
    },
    // 企业资质对话框手动关闭的处理逻辑
    closeCompnent () {
      this.$emit('close:entQua', {
        decCopLimits: this.decCopLimits,
        cropLimit: this.cropLimit
      })
    },
    // 保存 企业资质
    savedEntQua () {
      if (util.isEmpty(this.copLimitsForm.gNo)) {
        // 新增
        this.copLimitsForm.gNo = this.decCopLimits.length + 1
        this.decCopLimits.push(util.simpleClone(this.copLimitsForm))
      } else {
        // 修改
        let index = parseInt(this.copLimitsForm.gNo) - 1
        this.decCopLimits[index] = util.simpleClone(this.copLimitsForm)
        this.decCopLimits.push({})
        this.decCopLimits.pop()
      }
      // 清除 input 框
      this.AddEntQua()
    },
    // 删除 企业资质信息
    deldEntQua () {
      let delData = this.checkedEntQuaList
      if (delData.length === 0) {
        this.messageTips('至少选择一条数据')
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
            for (let item in this.decCopLimits) {
              if (delData[index].gNo === this.decCopLimits[item].gNo) {
                this.decCopLimits.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedEntQuaList = []
          // 重新排序
          for (let i in this.decCopLimits) {
            this.decCopLimits[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化表单
          this.AddEntQua()
        }).catch(() => {
        })
      }
    },
    // 获取 选中的企业资质
    copLimitschangeFun (value) {
      this.checkedEntQuaList = value
    },
    // 反填企业资质信息
    backCopLimitsInfo (row) {
      this.copLimitsForm = util.simpleClone(row)
    },
    // 企业
    cropPromiseClick () {
      this.promiseChange(this.checkPromise)
    },
    promiseChange (flag) {
      if (flag) {
        this.cropLimit = {
          pid: '', // 主键
          decPid: '', // 报关单主键
          gNo: '1', // 序号
          entQualifNo: '', // 企业资质编号
          entQualiftypeCode: this.controller.iEFlag === 'I' ? '101040' : '102053', // 企业资质类别代码
          entQualiftypeName: '合格保证' // 企业资质类别名称
        }
      } else { // 删除
        this.cropLimit = {
          pid: '', // 主键
          decPid: '', // 报关单主键
          gNo: '1', // 序号
          entQualifNo: '', // 企业资质编号
          entQualiftypeCode: '', // 企业资质类别代码
          entQualiftypeName: '' // 企业资质类别名称
        }
      }
    },
    // 远程搜索
    checkParamsList (query, type = 'select') {
      decUtil.selectSearch(this, query, type)
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
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
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/decCss';
  .tips{
    font-size: 10px;
    color: @font-color-btn;
  }
  .m-t-10{
    margin-top: 10px;
  }
</style>
