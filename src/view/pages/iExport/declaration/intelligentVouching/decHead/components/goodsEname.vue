<template>
<!-- 表头——商品英文组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑商品英文名称"
      :visible.sync="goodsEnNameVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeCompnent'
      v-dialogDrag
      @open="goodsEnNameShow"
      width="640px">
      <el-table
        ref="goodsEnNameTable"
        :data="goodsEnNameList"
        highlight-current-row border
        size='mini'
        @select="goodsEnNameChange"
        max-height="300" style="width: 100%">
        <el-table-column label="选中" min-width="50" type="selection"></el-table-column>
        <el-table-column  property="gNo" label="序号" min-width="100"></el-table-column>
        <el-table-column  property="codeTs" label="商品编号" min-width="100"></el-table-column>
        <el-table-column  property="gName" label="商品名称" min-width="100"></el-table-column>
        <el-table-column  property="declGoodsEname" label="商品英文名称" min-width="100">
          <template slot-scope="scope">
            <input v-model="scope.row.declGoodsEname" :maxlength="100">
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" @click="saveGoodsEnName" :disabled="isDisabled">保存</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import decBus from '../../common/bus'
export default {
  name: 'goods-Ename',
  props: {
    goodsEnNameVisible: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    gEnName: {
      type: String,
      default: ''
    },
    goodsEnNameList: {
      type: Array
    }
  },
  data () {
    return {
      checkedGoodsEnNameList: []
    }
  },
  methods: {
    // 商品英文名称 设置默认选中
    goodsEnNameShow () {
      this.checkedGoodsEnNameList = []
      let comList = []
      if (this.gEnName) {
        comList = this.gEnName.split(',')
      }
      // 赋值英文 名称
      for (let index in comList) {
        for (let n in this.goodsEnNameList) {
          if (comList[index].split('-')[0] === this.goodsEnNameList[n].gNo) {
            this.goodsEnNameList[n].declGoodsEname = comList[index].split('-')[1]
          }
        }
      }
      // 设置默认选择
      this.$nextTick(_ => {
        if (comList.length > 0) {
          comList.forEach(item => {
            this.$refs.goodsEnNameTable.toggleRowSelection(this.goodsEnNameList.find(d => {
              if (d.gNo.toString() === item.split('-')[0]) {
                this.checkedGoodsEnNameList.push(d)
                return true
              }
            }), true)
          })
        } else {
          this.$refs.goodsEnNameTable.clearSelection()
        }
      })
    },
    // 商品英文名称 获取选中的值
    goodsEnNameChange (value) {
      this.checkedGoodsEnNameList = value
    },
    // 商品英文名称 保存选中的值
    saveGoodsEnName () {
      let list = []
      for (let i in this.checkedGoodsEnNameList) {
        // 选中的值点击保存 是需要修改对应商品列表的英文名称
        decBus.$emit('modifyDeclGoodsEname', this.checkedGoodsEnNameList[i])
        // for (let n in this.tableList) {
        //   if (this.checkedGoodsEnNameList[i].gNo === this.tableList[n].gNo) {
        //     this.tableList[n].declGoodsEname = this.checkedGoodsEnNameList[i].declGoodsEname
        //   }
        // }
        if (!util.isEmpty(this.checkedGoodsEnNameList[i].declGoodsEname)) {
          list.push(this.checkedGoodsEnNameList[i].gNo + '-' + this.checkedGoodsEnNameList[i].declGoodsEname)
        }
      }
      this.$refs.goodsEnNameTable.clearSelection()
      this.$emit('close:goodsEnName', {gEnName: list.join(',')})
    },
    closeCompnent () {
      this.$refs.goodsEnNameTable.clearSelection()
      this.$emit('update:goodsEnNameVisible', false)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
