<template>
  <!-- 选择海关编码和检验检疫编码 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="企业编码选择"
      :visible.sync="customsCodeVisabled"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='openCustomsCode'
      append-to-body
      v-dialogDrag
      class='sys-dec-class'
      width="400px">
      <div class='dec-div'>
        <el-form ref="tradeForm" :model="tradeForm" label-width="112px" size="mini" @keyup.enter.native="switchFoucsByEnter">
          <el-row v-show='tradeShow'>
            <el-col :span="24">
              <el-form-item label="海关编码" prop="tradeCode">
                <el-select placeholder=" " v-model="tradeForm.tradeCode"
                  filterable clearable default-first-option
                  dataRef='tradeCode' style="width:100%">
                  <el-option
                    v-for="item in initParams.tradeCodeList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show='ciqShow'>
            <el-col :span="24">
              <el-form-item label="检验检疫编码" prop="ciqCode">
                <el-select placeholder=" " v-model="tradeForm.ciqCode"
                  filterable clearable default-first-option
                  dataRef='ciqCode' style="width:100%">
                  <el-option
                    v-for="item in initParams.ciqCodeList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
        <el-button class='dialog-primary-btn' @click="configBtn">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import decUtil from '../../common/decUtil'
export default {
  name: 'customs-code',
  props: {
    customsCodeVisabled: {
      type: Boolean,
      default: false
    },
    initParams: {
      type: Object,
      default: () => {
        return {
          type: '',
          ciqCodeList: [],
          tradeCodeList: []
        }
      }
    }
  },
  data () {
    return {
      tradeForm: {
        tradeCode: '', // 十位海关编码
        ciqCode: '' // 十位检验检疫编码
      },
      tradeShow: true,
      ciqShow: true,
      ciqCodeList: [],
      tradeCodeList: []
    }
  },
  methods: {
    openCustomsCode () {
      if (this.initParams.ciqCodeList.length !== 2) {
        this.ciqShow = false
      } else {
        this.tradeForm.ciqCode = this.initParams.ciqCodeList[0].codeField
      }
      if (this.initParams.tradeCodeList.length !== 2) {
        this.tradeShow = false
      } else {
        this.tradeForm.tradeCode = this.initParams.tradeCodeList[0].codeField
      }
    },
    configBtn () {
      this.$emit('close:customsCode', {
        type: this.initParams.type,
        tradeCode: this.tradeForm.tradeCode,
        ciqCode: this.tradeForm.ciqCode
      })
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
<style scoped lang="less">
.sys-main{
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: auto;
    margin-left:5px;
}
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
}
</style>
