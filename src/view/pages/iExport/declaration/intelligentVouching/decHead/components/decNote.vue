<template>
  <!-- 备注、唛码的组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
    :title='noteTitle'
    :visible.sync="decNotevisible"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    :before-close='closenoteCompnent'
    @open="decNoteShow"
    v-dialogDrag
    class="sys-dec-class"
    width="640px">
    <div>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        @keyup.native="computLength"
        @keyup.enter.native="switchFoucsByEnter"
        @keydown.enter.native="prevent"
        ref="editNote"
        v-model="editNote">
      </el-input>
    </div>
    <div>
      <span> {{'(' + len + ')字节'}}</span>
    </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util.js'
export default {
  name: 'dec-note',
  props: {
    noteTitle: {
      type: String,
      default: ''
    },
    decNotevisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      len: 0,
      visible: false,
      editNote: ''
    }
  },
  methods: {
    decNoteShow () {
      this.$nextTick(_ => {
        this.$refs['editNote'].focus()
        this.$refs['editNote'].select()
      })
      this.editNote = this.note
      this.computLength()
    },
    configBtn () {
      this.$emit('close:decNote', {note: this.editNote.trim(), type: this.type})
    },
    closenoteCompnent () {
      this.configBtn()
    },
    computLength () {
      if (this.type === 'note') {
        this.editNote = util.getFixlenOfString(this.editNote, 255)
        this.len = util.decGetlen(this.editNote)
      } else {
        this.editNote = util.getFixlenOfString(this.editNote, 400)
        this.len = util.decGetlen(this.editNote)
      }
    },
    prevent (e) {
      if (e.target.localName === 'textarea') { // enter 光标向下个元素移动
        e.preventDefault()
        e.stopPropagation()
      }
    },
    switchFoucsByEnter (e) {
      if (e.shiftKey) {
      } else if (e.ctrlKey && e.target.localName === 'textarea') { // Ctrl+enter 在textaera中换行
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
          // t.value += myValue
          // t.focus()
        }
      } else {
        if (e.target.localName === 'textarea') { // enter 光标向下个元素移动
          e.preventDefault()
          e.stopPropagation()
        }
        this.configBtn()
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
