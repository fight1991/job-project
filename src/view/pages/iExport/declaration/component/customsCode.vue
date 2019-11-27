<template>
  <!-- 选择海关编码和检验检疫编码 -->
  <section>
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
  </section>
</template>
<script>
// import util from '@/common/util'
export default {
  name: 'customs-code',
  props: {
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
  created () {
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
  mounted () {
  },
  methods: {
    configBtn () {
      this.$emit('backDatas', {type: this.initParams.type, tradeCode: this.tradeForm.tradeCode, ciqCode: this.tradeForm.ciqCode})
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      e.target.blur()
      // 获取当前焦点所在的 form表单
      let form = e.target.form
      // 获取form表单下的所有 input  并把为数组转化为真数组
      let focusable = Array.from(form.querySelectorAll('input'))
      let newFocusable = []
      // 过滤掉 被disable 修饰的 和 被readonly修饰但不含有placeholder的input
      newFocusable = focusable.filter(v => {
        return (!v.readOnly || v.placeholder) && !v.disabled
      })
      // 计算现在焦点在什么位置
      let index = newFocusable.findIndex((v, i) => {
        return e.target === v
      })
      // 下一个元素
      let next = newFocusable[parseInt(index) + 1]
      // 下下一个元素
      // let secondNext = newFocusable[parseInt(index) + 2]
      // 上一个元素
      let prev = newFocusable[parseInt(index) - 1]
      if (e.shiftKey) { // shift+enter 光标向上个元素移动
        if (prev) {
          if (e.target.attributes.shiftEnter && e.target.attributes.shiftEnter.nodeValue === 'no') {
            return false
          } else {
            if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            }
            prev.focus()
          }
        }
      } else if (e.ctrlKey && this.localName === 'textarea') { // Ctrl+enter 在textaera中换行
        let myValue = '\n'
        let t = e.target
        if (document.selection) { // ie<9
          t.focus()
          let sel = document.selection.createRange()
          sel.text = myValue
          t.focus()
          sel.moveStart('character', -1)
        } else if (t.selectionStart || t.selectionStart === '0') { // 现代浏览器
          let startPos = t.selectionStart
          let endPos = t.selectionEnd
          let scrollTop = t.scrollTop
          t.value = t.value.substring(0, startPos) + myValue + t.value.substring(endPos, t.value.length)
          t.focus()
          // 因为myValue回车显示为\n
          t.selectionStart = startPos + myValue.length
          t.selectionEnd = startPos + myValue.length
          t.scrollTop = scrollTop
        } else {
          t.value += myValue
          t.focus()
        }
      } else {
        if (e.target.localName === 'textarea') { // enter 光标向下个元素移动
          e.preventDefault()
          e.stopPropagation()
        }
        // 下个元素存在
        if (next) {
          if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
            return false
          }
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
