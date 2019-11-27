<template>
  <!--  -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="历史申报价格区间查询"
      :visible.sync="temporalIntervalVisable"
      @open="initTemporalInterval"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      class = 'priceTips-dialog'
      width="500px">
       <el-form label-width="80px" ref='priceForm' :model="priceForm" size="mini" label-position="left">
        <el-row>
          <el-col :span="24">
            <el-form-item label="时间区间">
              <el-col :span="22">
                <el-form-item >
                  <el-date-picker v-model="priceForm.dates" style="width:100%"
                    type="daterange" clearable
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button icon="el-icon-search" title="查询历史的价格区间" class='query-icon-button' @click="queryPrice"></el-button>
              </el-col>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="浮动区间">
              <el-col :span="11">
                <el-form-item >
                  <el-input  v-model="priceForm.minPrice" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='2' style="text-align: center;">
                <span >-</span>
              </el-col>
              <el-col :span="11">
                <el-form-item>
                  <el-input  v-model="priceForm.maxPrice" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
       </el-form>
      <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
        <el-button  size="mini" type="primary" @click="configBtn">回填</el-button>
        <el-button size="mini" @click="cancleBtn">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
// import decUtil from '../../declaration/decPage/common/decUtil'
export default {
  name: 'temporal-interval',
  props: {
    temporalIntervalVisable: {
      type: Boolean,
      default: false
    },
    priceDialogForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      priceForm: {
        minPrice: '',
        maxPrice: '',
        dates: []
      },
      pickerOptions: {
        shortcuts: [{
          text: '当天',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            let week = start.getDay()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * week)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近7天',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            let monthDay = start.getDate() - 1
            start.setTime(start.getTime() - 3600 * 1000 * 24 * monthDay)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            let end = new Date()
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
  },
  methods: {
    configBtn () {
      if (this.priceForm.minPrice && this.priceForm.maxPrice) {
        this.$emit('close:temporalInterval', {
          minPrice: this.priceForm.minPrice,
          maxPrice: this.priceForm.maxPrice
        })
      } else {
        this.$message({
          message: '请完善浮动区间！',
          type: 'warning'
        })
      }
    },
    cancleBtn () {
      this.$emit('update:temporalIntervalVisable', false)
    },
    initTemporalInterval () {
      this.priceForm.minPrice = ''
      this.priceForm.maxPrice = ''
      this.priceForm.dates = []
    },
    queryPrice () {
      let param = {
        ...this.priceDialogForm,
        'beginDate': util.dateFormat(this.priceForm.dates[0], 'yyyy-MM-dd'),
        'endDate': util.dateFormat(this.priceForm.dates[1], 'yyyy-MM-dd')
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/decParam/common/getPriceArea',
        data: param,
        router: this.$router,
        success: (res) => {
          this.priceForm.minPrice = res.result.minPrice
          this.priceForm.maxPrice = res.result.maxPrice
        },
        other: (res) => {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
