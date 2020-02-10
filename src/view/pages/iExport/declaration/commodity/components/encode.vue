<template>
  <div>
    <el-dialog :modal-append-to-body='false'
      title="检验检疫编码列表"
      :visible.sync="dialogShow" width="640px"
      class="dec-query-table" :modal='false'
      :close-on-click-modal="false"
      @open="openDialog()"
      @close="$emit('update:visible',false)">
      <el-table ref="encodeTable" :data="resultList" highlight-current-row border size='mini'  @selection-change="encodeTableChanged" max-height="300" style="width: 100%">
        <el-table-column width="50" align="center">
          <template slot-scope="scope">
            <el-radio v-model="encodeListRadio" :label="scope.row.ciqCo">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column  property="gNameNote" label="名称" min-width="100"></el-table-column>
        <el-table-column  property="typeName" label="类型" min-width="100"></el-table-column>
        <el-table-column  property="codeTs" label="HS代码" min-width="100"></el-table-column>
        <el-table-column  property="hsGName" label="HS名称" min-width="100"></el-table-column>
      </el-table>
      <el-row slot="footer" class="sys-dialog-footer query-btn" type="flex" justify="center">
        <el-button type="primary" size="mini" class="mg-r-10" @click="saveEncodeTableVaue" :disabled="isView">确定</el-button>
        <el-button size="mini" @click="$emit('update:visible',false)">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import util from '@/common/util'
export default {
  data () {
    return {
      dialogShow: false,
      resultList: [],
      encodeListRadio: null // 选中的检验检验编码列表
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
    encodeTableList: {
      type: Array,
      default: () => {
        return []
      }
    },
    ciqCo: {
      type: String,
      default: ''
    }
  },
  watch: {
    'visible' (newVal) {
      this.dialogShow = newVal
    }
  },
  methods: {
    openDialog () {
      this.resultList = this.encodeTableList
      this.encodeListRadio = this.ciqCo ? this.ciqCo : this.resultList[0].ciqCo
    },
    // 检验检疫编码表 获取选中的值
    encodeTableChanged (value) {
      this.resultList = util.simpleClone(value)
    },
    // 保存 并反填检验检疫编码表
    saveEncodeTableVaue () {
      let ciqData = this.resultList.filter(e => e.ciqCo === this.encodeListRadio)
      this.$emit('back:encode', ciqData[0])
    }
  }
}
</script>
<style lang="less" scoped>
.mg-r-10{
  margin-right: 10px;
}
</style>
