<template>
  <!-- Z账册列表的组件 -->
  <section>
    <el-table
      ref="HBookListTable"
      :data="HBookList"
      height="400"
      highlight-current-row border
      size='mini'
      @selection-change="HBookListChange"
      max-height="300" style="width: 100%">
      <el-table-column type="selection" width="30"></el-table-column>
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
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'dec-zbook',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      HBookList: [],
      checkHBookList: [],
      iEFlag: '',
      districtCode: ''
    }
  },
  created () {
    let data = util.simpleClone(this.initParams)
    this.HBookList = data.list
    this.iEFlag = data.iEFlag
    this.districtCode = data.districtCode
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
          if (this.iEFlag === 'E') { // 出口
            this.checkHBookList[i]['destinationCountry'] = this.checkHBookList[i].originCountry
            this.checkHBookList[i]['destinationCountryName'] = this.checkHBookList[i].originCountryName
            this.checkHBookList[i].originCountryName = '中国'
            this.checkHBookList[i].originCountry = 'CHN'
            this.checkHBookList[i].districtCode = this.districtCode // 货源地
          } else { // 进口
            this.checkHBookList[i]['destinationCountry'] = 'CHN'
            this.checkHBookList[i]['destinationCountryName'] = '中国'
          }
          this.checkHBookList[i].decPrice = this.removeZero(this.checkHBookList[i].decPrice)
          this.checkHBookList[i].gQty = this.removeZero(this.checkHBookList[i].gQty)
          this.checkHBookList[i].qty1 = this.removeZero(this.checkHBookList[i].qty1)
          this.checkHBookList[i].qty2 = this.removeZero(this.checkHBookList[i].qty2)
          this.checkHBookList[i].declTotal = this.removeZero(this.checkHBookList[i].declTotal)
        }
        this.$emit('backDatas', {list: this.checkHBookList})
      }).catch(() => {
        for (let i in this.checkHBookList) {
          if (this.iEFlag === 'E') { // 出口
            this.checkHBookList[i]['destinationCountry'] = this.checkHBookList[i].originCountry
            this.checkHBookList[i]['destinationCountryName'] = this.checkHBookList[i].originCountryName
            this.checkHBookList[i].originCountryName = ''
            this.checkHBookList[i].originCountry = ''
          } else {
            this.checkHBookList[i]['destinationCountry'] = ''
            this.checkHBookList[i]['destinationCountry'] = ''
          }
          this.checkHBookList[i].decPrice = this.removeZero(this.checkHBookList[i].decPrice)
          this.checkHBookList[i].gQty = this.removeZero(this.checkHBookList[i].gQty)
          this.checkHBookList[i].qty1 = this.removeZero(this.checkHBookList[i].qty1)
          this.checkHBookList[i].qty2 = this.removeZero(this.checkHBookList[i].qty2)
          this.checkHBookList[i].declTotal = this.removeZero(this.checkHBookList[i].declTotal)
        }
        this.$emit('backDatas', {list: this.checkHBookList})
      })
    },
    removeZero (value) {
      if (util.isEmpty(value)) {
        return ''
      } else {
        return parseFloat(value) === 0 ? '' : parseFloat(value)
      }
    },
    // 取消
    cancleBtn () {
      this.$emit('cancLeData')
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
