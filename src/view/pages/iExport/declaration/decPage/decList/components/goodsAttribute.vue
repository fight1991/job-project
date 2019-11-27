<template>
<!-- 表体——货物属性组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="货物属性"
      :visible.sync="goodsAttrVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='openGoodsAttr'
      :before-close='closeCompnent'
      width="640px">
      <el-row :gutter="10" style='border: 0px;'>
        <el-checkbox-group v-model="goodsAttrList" @change='goodsAttrChange'>
          <el-col :span="6" v-for="(item,index) in saasGoodsAttr" :key="index" class="m-t-10">
            <div class='goods-class'>
              <el-checkbox-button :label="item.codeField + '-' + item.nameField" border class='goods-class'></el-checkbox-button>
            </div>
          </el-col>
        </el-checkbox-group>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" @click="saveGoodsAttr" :disabled="isDisabled || (isWholeDec && isCIQ)">确定</el-button>
        <el-button class="dialog-btn"  size="mini" @click="closeCompnent">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util.js'
export default {
  name: 'goods-attribute',
  props: {
    goodsAttrVisible: {
      type: Boolean,
      default: false
    },
    goodsAttrCollection: {
      type: Array,
      require: true
    },
    saasGoodsAttr: {
      type: Array,
      require: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isWholeDec: {
      type: Boolean,
      default: false
    },
    isCIQ: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      goodsAttrList: []
    }
  },
  methods: {
    openGoodsAttr () {
      this.goodsAttrList = util.simpleClone(this.goodsAttrCollection)
    },
    // 控制 货物属性 的选择不超过7条
    goodsAttrChange () {
      let goodsAttrLen = this.goodsAttrList.length
      if (goodsAttrLen > 7) {
        this.goodsAttrList.pop()
        this.messageTips('不能超过7条数据')
      }
    },
    saveGoodsAttr () {
      this.$emit('close:goodsAttribute', {goodsAttrCollection: util.simpleClone(this.goodsAttrList)})
    },
    closeCompnent () {
      this.$emit('close:goodsAttribute', null)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../common/decCss';
.m-t-10{
  margin-top: 10px;
}
.goods-class{
  width:100%;
  height:100%;
}
</style>
