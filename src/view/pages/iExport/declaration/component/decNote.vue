<template>
  <!-- 备注、唛码的组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
    :title='noteTitle'
    :visible.sync="visible"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    :before-close='closenoteCompnent'
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
        ref="note"
        v-model="note">
      </el-input>
    </div>
    <div>
      <span> {{'(' + len + ')字节'}}</span>
    </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'dec-note',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {
          noteValue: '',
          type: '',
          noteTitle: '',
          visible: false
        }
      }
    }
  },
  data () {
    return {
      note: '',
      len: 0,
      noteTitle: '',
      type: '',
      visible: false
    }
  },
  created () {
    let data = util.simpleClone(this.initParams)
    this.note = data.noteValue
    this.noteTitle = data.noteTitle
    this.visible = data.visible
    this.type = data.type
    this.computLength()
  },
  mounted () {
    this.$nextTick(_ => {
      this.$refs['note'].focus()
      this.$refs['note'].select()
    })
  },
  methods: {
    configBtn () {
      this.$emit('backDatas', {note: this.note.trim(), type: this.type})
      this.note = ''
      this.visible = false
    },
    cancleBtn () {
      this.$emit('cancLeData')
      this.note = ''
      this.visible = false
    },
    closenoteCompnent () {
      this.$emit('backDatas', {note: this.note.trim(), type: this.type})
      this.note = ''
      this.visible = false
    },
    computLength () {
      if (this.type === 'note') {
        this.note = util.getFixlenOfString(this.note, 255)
        this.len = util.decGetlen(this.note)
      } else {
        this.note = util.getFixlenOfString(this.note, 400)
        this.len = util.decGetlen(this.note)
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
