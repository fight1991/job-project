<template>
<!-- 表体——报关修改单价/总价组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="报关修改单价/总价？"
      :visible.sync="modifyPriceVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      v-dialogDrag
      @opened = 'focusBtn'
      width="500px">
      <div class= 'priceDiv'>
        <el-button class="layer-btn2" autofocus ref='modifyDeclPrice'
          @keydown.enter.native="prevent"
          @keyup.enter.native="modifyPrice('1')"
          @keyup.native="switchFocus($event, '1')"
          @click="modifyPrice('1')">修改单价</el-button>
        <el-button class="layer-btn2"
          ref = 'modifyTotalPrice'
          @keydown.enter.native="prevent"
          @keyup.enter.native="modifyPrice('2')"
          @keyup.native="switchFocus($event, '2')"
          @click="modifyPrice('2')">修改总价</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import decUtil from '../../common/decUtil'
export default {
  name: 'modify-price',
  props: {
    modifyPriceVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 价格修改 弹出框加载的时候自动聚焦
    focusBtn () {
      this.$nextTick(_ => {
        this.$refs['modifyDeclPrice'].$el.focus()
      })
    },
    // 阻止默认的keydown 触发按钮事件
    prevent (e) {
      decUtil.prevent(e)
    },
    // 切换左右健实现光标移动
    switchFocus (e, value) {
      if (e.keyCode === 39 || e.keyCode === 37) {
        if (value === '1') {
          e.target.blur()
          this.$refs['modifyTotalPrice'].$el.focus()
        } else {
          e.target.blur()
          this.$refs['modifyDeclPrice'].$el.focus()
        }
      }
    },
    // 修改价格
    modifyPrice (value) {
      this.$emit('close:modifyPrice', {value: value})
    }
  }
}
</script>
<style lang="less" scoped>
  .priceDiv{
      text-align: center;
      padding: 10px 0;
    }
  .layer-btn2 {
    height: 32px;
    line-height: 32px;
    margin: 0 6px;
    padding: 0 15px !important;
    border: 1px solid #4898d5;
    border-radius: 2px;
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;
    text-decoration: none;
    background: #fff;
    color: #64A7EB;
  }
  .layer-btn2:focus,.layer-btn2:hover{
    background:#64A7EB;
    color: #fff;
  }
</style>
