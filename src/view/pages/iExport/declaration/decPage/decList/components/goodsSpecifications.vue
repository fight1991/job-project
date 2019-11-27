<template>
<!-- 表体——编辑检验检疫货物规格组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑检验检疫货物规格"
      :visible.sync="goodsSpecVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='openGoodsSpec'
      :before-close='closeCompnent'
      width="540px">
      <div class="border">
        <el-form label-width="100px"
          @keydown.enter.native="switchFoucsByEnter"
          size="mini" label-position="right" :data="goodsSpecForm">
          <el-row >
            <el-col :span="24">
              <el-form-item label="成分/原料/组分">
                <el-input v-model="goodsSpecForm.stuffNote" autofocus  @input='checklen("goodsSpecForm", "stuffNote", 400)'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="产品有效期">
                <el-date-picker
                  v-model="goodsSpecForm.prodValidDt"
                  @change='prodValidDtChange'
                  @blur='prodValidDtBlur'
                  type="date"
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder=" ">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="产品保质期(天)">
                <el-input ref="prodQgp" v-model="goodsSpecForm.prodQgp"  @input='decCheckInt("prodQgp", 20)' ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="境外生产企业">
                <el-input v-model="goodsSpecForm.engManentCnm" @input='checklen("goodsSpecForm", "engManentCnm", 100)'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物规格">
                <el-input v-model="goodsSpecForm.goodsSpec" @input='checklen("goodsSpecForm", "goodsSpec", 100)'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物型号">
                <el-input v-model="goodsSpecForm.goodsModel" @input='checklen("goodsSpecForm", "goodsModel", 100)'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物品牌">
                <el-input v-model="goodsSpecForm.goodsBrand" @input='checklen("goodsSpecForm", "goodsBrand", 100)'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="生产日期">
                <el-date-picker
                  v-model="goodsSpecForm.produceDate"
                  @change='produceDateChange'
                  type="dates"
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder=" ">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if = "iEFlag == 'I'">
            <el-row >
              <el-col :span="24">
                <el-form-item label="生产批次">
                  <el-input v-model="goodsSpecForm.prodBatchNo"  @input='checklen("goodsSpecForm", "prodBatchNo", 2000)' enter='no' @keyup.enter.native="saveGoodsSpec"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row >
              <el-col :span="24">
                <el-form-item label="生产批次">
                  <el-input v-model="goodsSpecForm.prodBatchNo"  @input='checklen("goodsSpecForm", "prodBatchNo", 2000)'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row >
              <el-col :span="24">
                <el-form-item label="生产单位代码">
                  <el-input v-model="goodsSpecForm.mnufctrRegno"  @input='checklen("goodsSpecForm", "mnufctrRegno", 20)' enter='no' @keyup.enter.native="saveGoodsSpec"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" size="mini" @click="saveGoodsSpec" :disabled="isDisabled">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../common/decUtil'
export default {
  name: 'goods-specifications',
  props: {
    goodsSpecVisible: {
      type: Boolean,
      default: false
    },
    iEFlag: {
      type: String,
      default: 'I'
    },
    goodsSpecInfo: {
      type: Object,
      default: () => this.resetData()
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      goodsSpecForm: this.resetData()
    }
  },
  methods: {
    openGoodsSpec () {
      this.goodsSpecForm = util.simpleClone(this.goodsSpecInfo)
    },
    resetData () {
      return {
        stuffNote: '', // 成分/原料/组分
        prodValidDt: '', // 产品有效期
        prodQgp: '', // 产品保质期(天)
        engManentCnm: '', // 境外生产企业
        goodsSpec: '', // 货物规格
        goodsModel: '', // 货物型号
        goodsBrand: '', // 货物品牌
        produceDate: '', // 生产日期
        prodBatchNo: '', // 生产批次
        mnufctrRegno: '' // 生产单位代码
      }
    },
    /**
   * 控制输入中英文字符长度，一个中文当做2个长度来控制
   * @param inpt
   * @param maxlen
   */
    checklen (type, ipnut, maxlen) {
      decUtil.checklen(this, type, ipnut, maxlen)
    },
    // 只允许输入正整数
    decCheckInt (ipnut, maxlen) {
      let value = this.goodsSpecForm[ipnut]
      let t = value.replace(/[^(()\d&|)]/g, '')
      if (t.length > maxlen) {
        value = this.goodsSpecForm[ipnut] = value.substr(0, maxlen - 1)
      } else {
        this.goodsSpecForm[ipnut] = t
      }
    },
    saveGoodsSpec () {
      this.$emit('close:goodsSpecifications', {goodsSpecForm: this.goodsSpecForm})
    },
    closeCompnent () {
      this.$emit('update:goodsSpecVisible', false)
    },
    // 生产日期的change事件 如果 生产日期为null 则 赋值为空
    produceDateChange () {
      if (util.isEmpty(this.goodsSpecForm.produceDate) || this.goodsSpecForm.length === 0) {
        this.goodsSpecForm.produceDate = ''
      }
    },
    prodValidDtBlur () {
      this.$nextTick(() => {
        this.$refs['prodQgp'].focus()
      })
    },
    // 产品有效期的change事件 如果 产品有效期为null 则 赋值为空
    prodValidDtChange () {
      if (util.isEmpty(this.goodsSpecForm.prodValidDt)) {
        this.goodsSpecForm.prodValidDt = ''
      }
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      decUtil.switchFoucsByEnter(e, this.foucsByEnter)
    },
    foucsByEnter (e, next, secondNext) {
      // 下个元素存在
      if (next) {
        if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
          return false
        } else {
          next.focus()
          next.select()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../common/decCss';
</style>
