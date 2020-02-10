<template>
  <div>
    <el-dialog :modal-append-to-body='false' title="检验检疫货物规格"
    :visible.sync="dialogShow"
    width="540px" :modal='false'
    :close-on-click-modal="false"
    @open="openDialog()"
    @close="$emit('update:visible',false)">
      <div class="sys-jiner-class">
      <div class="border">
        <el-form label-width="100px" @keyup.enter.native="switchFoucsByEnter" size="mini" label-position="right" :data="goodsSpecForm">
          <el-row >
            <el-col :span="24">
              <el-form-item label="成分/原料/组分">
                <el-input v-model="goodsSpecForm.stuffNote" autofocus></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="产品有效期">
                <el-date-picker
                  v-model="goodsSpecForm.prodValidDt"
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
                <el-input v-model="goodsSpecForm.prodQgp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="境外生产企业">
                <el-input v-model="goodsSpecForm.engManentCnm"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物规格">
                <el-input v-model="goodsSpecForm.goodsSpec"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物型号">
                <el-input v-model="goodsSpecForm.goodsModel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="货物品牌">
                <el-input v-model="goodsSpecForm.goodsBrand"></el-input>
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
          <div v-if="iEFlag == 'I'">
            <el-row >
              <el-col :span="24">
                <el-form-item label="生产批次">
                  <el-input v-model="goodsSpecForm.prodBatchNo" enter='no' @keyup.enter.native="saveGoodsSpec"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row >
              <el-col :span="24">
                <el-form-item label="生产批次">
                  <el-input v-model="goodsSpecForm.prodBatchNo"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row >
              <el-col :span="24">
                <el-form-item label="生产单位代码">
                  <el-input v-model="goodsSpecForm.mnufctrRegno" @keyup.enter.native="saveGoodsSpec"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      </div>
      <span slot="footer" class="sys-dialog-footer query-btn">
        <el-button type="primary" @click="saveGoodsSpec" :disabled="isView">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../decPage/common/decUtil'
export default {
  data () {
    return {
      dialogShow: false,
      goodsSpecForm: { // 检验检疫货物规格 字段
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
    infoData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    iEFlag: {
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
      this.goodsSpecForm = this.infoData
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
          let ref
          if (e.target.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
            ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
            this.$refs[ref].blur()
          } else {
            if (!util.isEmpty(e.target.attributes.dataRef)) {
              ref = e.target.attributes.dataRef.nodeValue
            }
          }
          if (ref === 'gName') {
            this.$refs['codeTs'].$children[0].focus()
            this.$refs['codeTs'].$children[0].select()
          } else {
            next.focus()
            next.select()
          }
        }
      }
    },
    // 生产日期的change事件 如果 生产日期为null 则 赋值为空
    produceDateChange () {
      if (util.isEmpty(this.goodsSpecForm.produceDate) || this.goodsSpecForm.length === 0) {
        this.goodsSpecForm.produceDate = ''
      }
    },
    // 保存 检验检疫货物规格
    saveGoodsSpec () {
      let param = []
      for (let index in this.goodsSpecForm) {
        if (util.isEmpty(this.goodsSpecForm[index]) === false) {
          param.push(this.goodsSpecForm[index])
        }
      }
      this.$emit('back:goodsSpec', {
        showGoodsSpec: param.join(','),
        goodsSpecForm: this.goodsSpecForm
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
  }
</style>
