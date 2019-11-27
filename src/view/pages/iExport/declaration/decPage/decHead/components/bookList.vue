<template>
  <!-- Z账册列表的组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="减免税备案清单商品列表"
      :visible.sync="ZBookVisabled"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      class='sys-dec-class'
      width="80%">
      <el-table
        ref="HBookListTable"
        :data="HBookList"
        height="400"
        highlight-current-row border
        size='mini'
        @selection-change="HBookListChange"
        max-height="300" style="width: 100%">
        <el-table-column type="selection" width="37"></el-table-column>
        <el-table-column  property="contrItem" label="备案序号" min-width="70"></el-table-column>
        <el-table-column  property="gname" label="商品名称" min-width="200"></el-table-column>
        <el-table-column  property="codeT" label="商品编码" min-width="70"></el-table-column>
        <el-table-column  property="codeS" label="附加编号" min-width="70"></el-table-column>
        <el-table-column  property="gmodel" label="规格型号" min-width="200"></el-table-column>
        <el-table-column  property="gQty" label="成交数量" min-width="70"></el-table-column>
        <el-table-column  property="gUnitName" label="成交单位" min-width="70"></el-table-column>
        <el-table-column  property="qty1" label="法定数量" min-width="70"></el-table-column>
        <el-table-column  property="unit1Name" label="法定单位" min-width="70"></el-table-column>
        <el-table-column  property="declTotal" label="成交总价" min-width="70"></el-table-column>
        <el-table-column  property="currName" label="币制" min-width="50"></el-table-column>
        <el-table-column  property="originCountryName" :label="iEFlag == 'I'?'原产国':'最终目的国'" min-width="90"></el-table-column>
        <el-table-column  property="dutyModeName" label="征免方式" min-width="80"></el-table-column>
      </el-table>
      <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
        <el-button class='dialog-primary-btn' @click="configBtn">确定</el-button>
        <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
import decUtil from '../../common/decUtil'
export default {
  name: 'dec-zbook',
  props: {
    ZBookVisabled: {
      type: Boolean,
      default: false
    },
    HBookList: {
      type: Array,
      require: true
    },
    iEFlag: {
      type: String,
      default: 'I'
    },
    districtCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checkHBookList: []
    }
  },
  created () {
  },
  methods: {
    // 确定
    configBtn () {
      if (this.checkHBookList.length === 0) {
        this.messageTips('至少选择一条数据')
        return
      }
      let tips = ''
      if (this.iEFlag === 'I') { // 进口
        tips = '是否需要将商品的“最终目的国”的赋值为CHN:中国吗？'
      } else { // 出口
        tips = '是否需要将商品的“原产地”的赋值为CHN:中国吗？'
      }
      this.$confirm(tips, '提示', {
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        for (let i in this.checkHBookList) {
          this.resetCheckHBookData(this.checkHBookList[i], '中国', 'CHN', true)
        }
        this.$emit('close:bookList', {list: this.checkHBookList})
      }).catch(() => {
        for (let i in this.checkHBookList) {
          this.resetCheckHBookData(this.checkHBookList[i], '', '', false)
        }
        this.$emit('close:bookList', {list: this.checkHBookList})
      })
    },
    resetCheckHBookData (checkHBook, countryName, country, needResetDistrictCode) {
      if (this.iEFlag === 'E') { // 出口
        checkHBook['destinationCountry'] = checkHBook.originCountry
        checkHBook['destinationCountryName'] = checkHBook.originCountryName
        checkHBook.originCountryName = countryName
        checkHBook.originCountry = country
        if (needResetDistrictCode) {
          checkHBook.districtCode = this.districtCode // 货源地
        }
      } else {
        checkHBook['destinationCountry'] = countryName
        checkHBook['destinationCountry'] = country
      }
      checkHBook.decPrice = decUtil.removeZero(checkHBook.decPrice)
      checkHBook.gQty = decUtil.removeZero(checkHBook.gQty)
      checkHBook.qty1 = decUtil.removeZero(checkHBook.qty1)
      checkHBook.qty2 = decUtil.removeZero(checkHBook.qty2)
      checkHBook.declTotal = decUtil.removeZero(checkHBook.declTotal)
    },
    // 取消
    cancleBtn () {
      this.$emit('update:ZBookVisabled', false)
    },
    // 选择变化
    HBookListChange (value) {
      this.checkHBookList = util.simpleClone(value)
    }
  }
}
</script>

<style scoped lang="less">

</style>
