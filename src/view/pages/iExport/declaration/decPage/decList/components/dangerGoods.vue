<template>
<!-- 表体——危险货物信息组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑危险货物信息"
      :visible.sync="dangerGoodsVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='dangerGoodsAfter'
      :before-close='closeCompnent'
      width="540px">
      <div class="border">
        <el-form label-width="100px" size="mini" label-position="right" :data="dangerForm" @keyup.enter.native="switchFoucsByEnter">
          <el-row >
            <el-col :span="24">
              <el-form-item label="非危险化学品">
              <el-select placeholder=" " v-model="dangerForm.noDangFlag"
                  @focus="tipsFillMessage('', 'commomPara3','COMMON_PARA')"
                  filterable clearable remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('commomPara3')"
                   ref="noDangFlag" dataRef='noDangFlag'
                  style="width:100%" autofocus>
                  <el-option
                    v-for="item in commomPara3"
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
              <el-form-item label="UN编码">
                <el-input v-model="dangerForm.unCode" @input='checklen("dangerForm", "unCode", 20)' maxlength='20'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="危险货物名称">
                <el-input v-model="dangerForm.dangName" @input='checklen("dangerForm", "dangName", 80)' maxlength='80'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="危包类别">
                <el-select placeholder=" " clearable  v-model="dangerForm.dangPackType" style="width:100%"
                  @focus="tipsFillMessage('', 'dangerLevel','DANGER_LEVEL')"
                  filterable remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('dangerLevel')"
                   ref="dangPackType" dataRef='dangPackType'>
                  <el-option
                    v-for="item in dangerLevel"
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
              <el-form-item label="危包规格">
                <el-input v-model="dangerForm.dangPackSpec" @input='checklen("dangerForm", "dangPackSpec", 24)'  maxlength='24' enter = 'no' @keyup.enter.native="sureDangerGoods"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" @click="sureDangerGoods" :disabled="isDisabled">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util.js'
import decUtil from '../../common/decUtil'

export default {
  name: 'danger-goods',
  props: {
    dangerGoodsVisible: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    dangerInfo: {
      type: Object,
      default: () => {
        return {
          noDangFlag: '', // 非危险化学品/组分
          unCode: '', // UN编码
          dangName: '', // 危险货物名称
          dangPackType: '', // 危包类别
          dangPackSpec: '' // 危包规格
        }
      }
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
      dangerForm: {
        noDangFlag: '', // 非危险化学品/组分
        unCode: '', // UN编码
        dangName: '', // 危险货物名称
        dangPackType: '', // 危包类别
        dangPackSpec: '' // 危包规格
      },
      selectObj: {
        obj: '',
        params: ''
      },
      dangerLevel: [],
      commomPara3: [],
      dangerSelect: { // 危险货物信息
        'noDangFlag': {obj: 'commomPara3', params: 'COMMON_PARA'}, // 非危险化学品
        'dangPackType': {obj: 'dangerLevel', params: 'DANGER_LEVEL'} // 非危险化学品
      }
    }
  },
  methods: {
    dangerGoodsAfter () {
      this.dangerForm = util.simpleClone(this.dangerInfo)
      decUtil.initSelect(this, this.dangerSelect, this.dangerForm)
    },
    closeCompnent () {
      this.$emit('update:dangerGoodsVisible', false)
    },
    sureDangerGoods () {
      this.$emit('close:dangerGoods', {dangerForm: this.dangerForm})
    },
    /**
     * 控制输入中英文字符长度，一个中文当做2个长度来控制
     * @param inpt
     * @param maxlen
    */
    checklen (type, ipnut, maxlen) {
      decUtil.checklen(this, type, ipnut, maxlen)
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
