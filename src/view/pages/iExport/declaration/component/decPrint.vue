<template>
  <!-- 报关单打印 -->
  <section class="sys-dec-class">
    <div class='dec-div'>
      <el-form   label-width="100px" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型">
              <el-col :span="6">
                <el-radio v-model="type" label="0" :disabled="declaration">报关单</el-radio>
              </el-col>
              <el-col :span="6">
                <el-radio v-model="type" label="1" :disabled="recordListing">备案清单</el-radio>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="打印格式">
              <el-checkbox-group v-model="printSorts">
                <el-col :span="6">
                  <el-checkbox label="1">核对单</el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="01">商检单</el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="3" :disabled="goods">商品附加页</el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="2" :disabled="container">集装箱附加页</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="签章水印">
              <el-checkbox-group v-model="signsChapter">
                <el-col :span="6">
                  <el-checkbox label="报关专用章">报关专用章</el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="报关员章">报关员章</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class='dialog-primary-btn' @click="preview">打印</el-button>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'dec-print',
  props: {
    initParams: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      printSorts: ['1'],
      type: '',
      pidList: '',
      declaration: false,
      recordListing: false,
      goods: false,
      container: false,
      signsChapter: ['报关专用章', '报关员章']
    }
  },
  mounted () {
    let initData = util.simpleClone(this.initParams)
    this.type = initData.type
    this.pidList = initData.pidList
    if (this.type === '0') { // 报关单
      this.declaration = false
      this.recordListing = true
    } else if (this.type === '2') { // 备案清单
      this.type = '1'
      this.declaration = true
      this.recordListing = false
    } else {
      this.declaration = false
      this.recordListing = false
    }
    if (this.pidList.length === 1) {
      this.getGoodsNum(this.pidList[0])
    }
  },
  methods: {
    cancleBtn () {
      this.$emit('cancLeData')
    },
    /**
     * @function 查询报关单的商品条数和集装箱条数
     * @augments pid 报关单主键
     */
    getGoodsNum (pid) {
      this.$post({
        url: 'API@/dec-common/dec/common/getRelatedNum',
        data: {
          'seqNo': pid
        },
        success: (res) => {
          let goodCount = res.result.decListNum
          let contaCount = res.result.containerNum
          if (!util.isEmpty(goodCount) && goodCount === 0) {
            this.goods = true
          } else {
            this.goods = false
          }
          if (!util.isEmpty(contaCount) && contaCount === 0) {
            this.container = true
          } else {
            this.container = false
          }
        }
      })
    },
    // 打印预览
    preview () {
      let copChapter = 0
      let userChapter = 0
      for (let i in this.signsChapter) {
        if (this.signsChapter[i] === '报关专用章') {
          copChapter = 1
        }
        if (this.signsChapter[i] === '报关员章') {
          userChapter = 1
        }
      }
      this.$post({
        url: 'API@/dec-common/dec/common/exportDecPdf',
        data: {
          'decPids': this.pidList, // 主键
          'printSorts': this.printSorts,
          'printType': this.type,
          'copChapter': copChapter,
          'userChapter': userChapter
        },
        success: (res) => {
          let list = res.result
          if (!list || list.length === 0) {
            this.messageTips('打印失败', 'error')
          } else {
            for (let item in list) {
              window.open(list[item], '_blank')
            }
            this.$emit('cancLeData')
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
  }
</style>
