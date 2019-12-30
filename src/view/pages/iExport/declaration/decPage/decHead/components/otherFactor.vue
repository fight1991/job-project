<template>
<!-- 其他事项确认组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="其他事项确认"
      :visible.sync="otherPriceFactorVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened = 'openOthered'
      :before-close='closeCompnent'
      v-dialogDrag
      width="500px">
      <div class="border">
        <el-form label-width="240px" size='mini'  @keyup.enter.native="switchFoucsByEnter"
         ref='otherPriceFactorForm'
         label-position="right" :model="otherPriceFactor">
          <el-row>
            <el-col :span="24">
              <el-form-item label="特殊关系确认" :class="{ 'error-color': errorColor.promiseItem1 }">
                <el-select placeholder=" " v-model="otherPriceFactor.promiseItem1"
                    @focus="tipsFillMessage('promiseItem1', 'priceFactor1','PRICE_FACTOR')"
                    filterable remote default-first-option
                    clearable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('priceFactor1')"
                    ref="promiseItem1" dataRef ='promiseItem1'
                    style="width:100%" @change="promiseItem1Change" >
                    <el-option
                      v-for="item in priceFactor1"
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
              <el-form-item label="价格影响确认" :class="{ 'error-color': errorColor.promiseItem2 }">
                <el-select placeholder=" " v-model="otherPriceFactor.promiseItem2"
                    ref="promiseItem2" dataRef ='promiseItem2'
                    @focus="tipsFillMessage('promiseItem2', 'priceFactor2','PRICE_FACTOR')"
                    filterable remote default-first-option clearable
                    :remote-method="checkParamsList"
                    @clear="clearSelct('priceFactor2')"
                    style="width:100%" :disabled='promiseItem2Disabed'>
                    <el-option
                      v-for="item in priceFactor2"
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
              <el-form-item label="与货物有关的特许权使用费支付确认" :class="{ 'error-color': errorColor.promiseItem3 }">
                <el-select placeholder=" " v-model="otherPriceFactor.promiseItem3"
                    ref="promiseItem3" dataRef ='promiseItem3'
                    @focus="tipsFillMessage('promiseItem3', 'priceFactor3','PRICE_FACTOR')"
                    clearable filterable remote default-first-option
                    :remote-method="checkParamsList"
                    @clear="clearSelct('priceFactor3')"
                    enter="no"
                    @keyup.enter.native="saveotherPriceFactor"
                    style="width:100%">
                    <el-option
                      v-for="item in priceFactor3"
                      :key="item.codeField"
                      :showLabel="showCustomsCode? '' : item.nameField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-popover v-if="popoverVisible" v-model="popoverVisible"  trigger="auto" width="300" placement="right-start" :reference="reference">
        <error-tips :approvalOpinions="promiseTips[currentShowField + 'Note']" :headClomn ="currentShowField + 'Note'"  @close:errorTips='closeErrorTips'></error-tips>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="saveotherPriceFactor" class="dialog-primary-btn" :disabled="isDisabled">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
// import util from '@/common/util'
import decUtil from '../../common/decUtil'
import errorTips from '../../components/errorTips'

export default {
  name: 'other-factor',
  components: {
    errorTips
  },
  props: {
    otherPriceFactorVisible: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    promiseItmes: {
      type: String,
      default: ''
    },
    checkData: {
      type: Object,
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
      popoverVisible: false,
      currentShowField: '',
      currentShowNoteField: '',
      reference: '',
      otherPriceFactor: {
        promiseItem1: '',
        promiseItem2: '',
        promiseItem3: ''
      },
      selectObj: {
        obj: '',
        params: ''
      },
      priceFactorSelect: {
        'promiseItem1': {obj: 'priceFactor1', params: 'PRICE_FACTOR'}, // 特殊关系确认
        'promiseItem2': {obj: 'priceFactor2', params: 'PRICE_FACTOR'}, // 价格影响确认
        'promiseItem3': {obj: 'priceFactor3', params: 'PRICE_FACTOR'} // 与货物有关的特许权使用费支付确认
      },
      priceFactor1: [],
      priceFactor2: [],
      priceFactor3: [],
      promiseItem2Disabed: false,
      errorColor: {
        'promiseItem1': false,
        'promiseItem2': false,
        'promiseItem3': false
      },
      promiseVisible: {},
      promiseCheck: {},
      priceFactorOther: {},
      showCheckTips: {},
      promiseTips: false
    }
  },
  watch: {
    otherPriceFactor: {
      handler (newName, oldName) {
        if (this.showCheckTips) {
          this.initErrorInfo()
        }
      },
      deep: true
    }
  },
  methods: {
    // 其他确认事项 保存
    saveotherPriceFactor () {
      this.popoverVisible = false
      if (this.otherPriceFactor.promiseItem1 === '') {
        this.otherPriceFactor.promiseItem1 = '9'
      }
      if (this.otherPriceFactor.promiseItem2 === '') {
        this.otherPriceFactor.promiseItem2 = '9'
      }
      if (this.otherPriceFactor.promiseItem3 === '') {
        this.otherPriceFactor.promiseItem3 = '9'
      }
      let promiseItmes = this.otherPriceFactor.promiseItem1 + this.otherPriceFactor.promiseItem2 + this.otherPriceFactor.promiseItem3
      this.otherPriceFactor = { // 价格因素
        promiseItem1: '',
        promiseItem2: '',
        promiseItem3: ''
      }
      // 清空参数列表
      this.priceFactor1 = []
      this.priceFactor2 = []
      this.priceFactor3 = []
      this.$emit('close:otherFactor', {promiseItmes: promiseItmes})
    },
    closeCompnent () {
      this.$emit('update:otherPriceFactorVisible', false)
    },
    // 其他确认1选择变化
    promiseItem1Change (value) {
      if (value === '0') {
        this.priceFactor2 = JSON.parse(window.localStorage.getItem('PRICE_FACTOR'))
        this.otherPriceFactor.promiseItem2 = '0'
        this.initSelect(this.priceFactorSelect, this.otherPriceFactor)
        this.promiseItem2Disabed = true
      } else {
        this.promiseItem2Disabed = false
      }
    },
    // 其他其他事项确认打开后操作
    openOthered () {
      if (this.checkData.showCheckTips) {
        this.promiseCheck = this.checkData.promiseCheck
        let promiseItmesOther = this.checkData.promiseItmesOther.split('')
        this.showCheckTips = this.checkData.showCheckTips
        this.promiseTips = this.checkData.promiseTips
        this.priceFactorOther = { // 价格因素
          promiseItem1: promiseItmesOther[0],
          promiseItem2: promiseItmesOther[1],
          promiseItem3: promiseItmesOther[2]
        }
      }
      if (this.promiseItmes === '') {
        this.otherPriceFactor = { // 价格因素
          promiseItem1: '',
          promiseItem2: '',
          promiseItem3: ''
        }
      } else {
        let list = this.promiseItmes.split('')
        this.otherPriceFactor = { // 价格因素
          promiseItem1: list[0],
          promiseItem2: list[1],
          promiseItem3: list[2]
        }
        if (this.otherPriceFactor.promiseItem1 === '0') {
          this.promiseItem2Disabed = true
        } else {
          this.promiseItem2Disabed = false
        }
      }
      this.initSelect(this.priceFactorSelect, this.otherPriceFactor)
      this.$nextTick(_ => {
        this.$refs['promiseItem1'].focus()
      })
    },
    /**
     * 初始化 下拉框
     * @param arr 定义的每个模块的数据
     * @param form 表单
     */
    initSelect (arr, form) {
      decUtil.initSelect(this, arr, form)
    },
    // 根据类型显示
    getTypeToHead (clomn, colorField) {
      // 如果要显示审核记录 需要满足条件 1.审核状态必须为4审核驳回状态2.当前字段必须标记为错误 '1'
      if (this.showCheckTips && this.promiseCheck[colorField] && this.promiseCheck[colorField].toString() === '1') {
        // 如果没有值 则赋值为空
        if (!this.promiseTips[clomn]) {
          this.promiseTips[clomn] = []
        }
        this.promiseVisible[clomn] = true
      } else {
        this.promiseVisible[clomn] = false
      }
    },
    closeErrorTips (param) {
      this.promiseVisible[param.colum] = false
      this.popoverVisible = false
    },
    initErrorInfo () {
      this.errorColor = {
        'promiseItem1': false,
        'promiseItem2': false,
        'promiseItem3': false
      }
      for (let key in this.otherPriceFactor) {
        if (this.promiseCheck[key] && this.promiseCheck[key].toString() === '1') {
          if (this.otherPriceFactor[key] && this.otherPriceFactor[key] === this.priceFactorOther[key]) {
            this.errorColor[key] = true
          }
        }
      }
    },
    checkParamsList (query, type = 'select') {
      decUtil.selectSearch(this, query, type)
    },
    popDataSet (value) {
      this.getTypeToHead(this.currentShowNoteField, this.currentShowField)
      if (this.promiseVisible[this.currentShowNoteField]) {
        this.popoverVisible = true
        this.reference = this.$refs[value].$vnode.elm
      }
    },
    popHandle (value) {
      this.currentShowField = value
      this.currentShowNoteField = value + 'Note'
      if (this.popoverVisible) {
        this.popoverVisible = false
        this.$nextTick(() => {
          this.popDataSet(value)
        })
      } else {
        this.popDataSet(value)
      }
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      this.popHandle(value)
      decUtil.tipsMessageF(this, '', obj, params, this.moduleName)
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      decUtil.switchFoucsByEnter(e, this.foucsByEnter)
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
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
