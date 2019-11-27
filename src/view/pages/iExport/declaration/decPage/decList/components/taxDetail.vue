<template>
<!-- 表体——智能归类组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="税则详情"
      :visible.sync="taxDetailVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeCompnent'
      width="850px">
      <div>
        <el-row class="params-info">
          <el-row class="params-border-panel">
            <el-row>
              <el-col :span="24">
                <div class="param-row">
                  <div class="param-left params-borderR">商品编号</div>
                  <div class="param-right">{{taxForm.codeTs}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="param-row">
                  <div class="param-left params-borderR">商品名称</div>
                  <div class="param-right">{{taxForm.gName}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="param-row">
                  <div class="param-left params-borderR">申报要素</div>
                  <div class="param-right">{{taxForm.gModel}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row class="param-row">
                <el-col :span="8">
                  <div class="param-row">
                    <div class="param-left params-borderR">法定第一计量单位</div>
                    <div class="param-right params-borderR">{{taxForm.unit1}}&nbsp;&nbsp;&nbsp;{{taxForm.unit1Value}}</div>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="param-row">
                    <div class="param-left params-borderR">法定第二单位</div>
                    <div class="param-right">{{taxForm.unit2}}&nbsp;&nbsp;&nbsp;{{taxForm.unit2Value}}</div>
                  </div>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">最惠国进口税率</div>
                  <div class="param-right params-borderR">{{taxForm.lowRate}}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">普通进口税率</div>
                  <div class="param-right params-borderR">{{taxForm.highRate}}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">暂定进口税率</div>
                  <div class="param-right">{{taxForm.tempRate}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">消费税率</div>
                  <div class="param-right params-borderR">{{taxForm.commRate}}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">出口税率</div>
                  <div class="param-right params-borderR">{{taxForm.outRate}}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">出口退税率</div>
                  <div class="param-right">{{taxForm.otherRate}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="param-row">
                  <div class="param-left params-borderR">协定税率</div>
                  <div class="param-right">{{taxForm.agreedRate}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">增值税率</div>
                  <div class="param-right params-borderR">{{taxForm.taxRate}}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">监管条件</div>
                  <div class="param-right params-borderR">{{taxForm.controlMa}}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-row">
                  <div class="param-left params-borderR">检验检疫类别</div>
                  <div class="param-right">{{taxForm.ciqMa}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="param-row">
                  <div class="param-left params-borderR">品目注释</div>
                  <div class="param-right">{{taxForm.itemNote}}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="param-row">
                  <div class="param-left params-borderR">备注</div>
                  <div class="param-right">{{taxForm.noteS}}</div>
                </div>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  name: 'tax-Detail',
  props: {
    taxDetailVisible: {
      type: Boolean,
      default: false
    },
    taxForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 关闭组件
    closeCompnent () {
      this.$emit('update:taxDetailVisible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.params-info{
  padding: 20px;
  background: #fff;
  .params-border-panel{
    border: 1px solid #b7b7b7;
    border-bottom: none;
    .el-row{
      border-bottom: 1px solid #B7B7B7;
      .params-borderR{
        border-right: 1px solid #B7B7B7;
      }
    }
    .param-row{
      display: table;
      width: 100%;
      >div{
        display: table-cell;
      }
      .param-left{
        width: 140px;
        padding: 15px 10px;
        text-align: center;
      }
      .param-right{
        padding: 15px 10px;
        word-break: break-all;
      }
    }
  }
}
</style>
