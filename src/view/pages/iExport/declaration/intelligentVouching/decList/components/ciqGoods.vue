<template>
<!-- 表体——检验检疫编码列表组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="检验检疫编码列表"
      :visible.sync="encodeTableVisible"
      @opened='openencodeListAfter'
      :before-close='closeCompnent'
      :close-on-click-modal='false'
      v-dialogDrag
      @keyup.native='updownSelect'
      width="640px">
      <el-table  ref="encodeTable" :data="encodeTableList" class="wrap-table"
        highlight-current-row border size='mini'
        @selection-change="encodeTableChanged"
        max-height="300" style="width: 100%">
        <el-table-column  width="37" align="center">
          <template slot-scope="scope">
              <el-radio v-model="encodeListRadio" @keyup.enter.native="saveEncodeTableVaue"  :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column  property="gNameNote" label="名称" min-width="150"></el-table-column>
        <el-table-column  property="typeName" label="类型" min-width="150"></el-table-column>
        <el-table-column  property="codeTs" label="HS代码" min-width="70"></el-table-column>
        <el-table-column  property="hsGName" label="HS名称" min-width="150"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button  class="dialog-primary-btn"  @click="saveEncodeTableVaue" :disabled="isDisabled">确定</el-button>
        <el-button  class="dialog-btn" size="mini" @click="closeCompnent">关闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util.js'
import decUtil from '../../common/decUtil'
export default {
  name: 'ciq-goods',
  props: {
    encodeTableVisible: {
      type: Boolean,
      default: false
    },
    encodeTableList: {
      type: Array,
      require: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      encodeListRadio: 0
    }
  },
  methods: {
    // 检验检疫列表
    openencodeListAfter () {
      this.encodeListRadio = 0
      this.$nextTick(_ => {
        this.$refs['encodeTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[0].focus()
      })
    },
    // 保存 并反填检验检疫编码表
    saveEncodeTableVaue () {
      this.$emit('close:ciqGoods', {ciqData: util.simpleClone(this.encodeTableList[this.encodeListRadio])})
    },
    // 关闭检验检疫编码表
    closeCompnent () {
      this.$emit('update:encodeTableVisible', false)
    },
    // 检验检疫编码表 获取选中的值
    encodeTableChanged (value) {
      this.encodeTableList = util.simpleClone(value)
    },
    // 下拉键切换选择
    updownSelect (e) {
      let browerType = decUtil.myBrowser()
      if (browerType === 'Chrome') {
        return
      }
      let len = this.encodeTableList.length
      if (len === 0) {
        return
      } else {
        len--
      }
      if (e && e.keyCode === 38) { // 上
        if (this.encodeListRadio === 0) {
          this.encodeListRadio = len
        } else {
          this.encodeListRadio--
        }
      }
      if (e && e.keyCode === 40) { // 下
        if (this.encodeListRadio === len) {
          this.encodeListRadio = 0
        } else {
          this.encodeListRadio++
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
