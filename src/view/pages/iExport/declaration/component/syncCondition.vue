<template>
  <!-- 保税商品和商品资料库同步的条件 -->
  <section style="padding: 0 20px;">
    <el-form ref='conditionForm' :label-width="labelFormWidth.six" :model="conditionForm" size="mini" :rules="rules" label-position="right">
      <el-row>
        <el-col :span="24">
          <el-form-item label="申报日期" prop='dates'>
            <el-date-picker v-model="conditionForm.dates"
            type="daterange" style="width:100%"
            range-separator="至"
            start-placeholde="开始日期"
            end-placeholde="结束日期"
            :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label='境内收发货人'>
            <el-autocomplete
              size='mini'
               v-model="conditionForm.tradeName"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              @keyup.enter.native="configBtn"
              @select="handleSelect">
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="sys-dialog-footer query-btn">
      <el-button type="primary" size="mini" class='btn-padding' @click="configBtn">确定</el-button>
      <el-button size="mini" class='btn-padding' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'
import pickerOptions from '@/common/mixin/pickerOptions'

export default {
  name: 'sync-condition', // 组件名
  props: {
    initParams: { // 2 代表商品资料库  1 代表保税商品库
      type: String,
      default: ''
    }
  },
  mixins: [pickerOptions],
  data () {
    return {
      conditionForm: {
        dates: '',
        tradeName: '' // 境内收发货人
      },
      tradeNameList: [], // 境内收发货人名称
      rules: {
        dates: [
          {required: true, message: '请选择申报日期区间', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    // 设置默认时间段 为一个月
    this.setDefualtDate()
    this.queryCorpInfo()
  },
  mounted () {},
  methods: {
    setDefualtDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      this.conditionForm.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 确认
    configBtn () {
      this.$refs['conditionForm'].validate((valid) => {
        if (!valid) {
          return
        }
        let param = {
          startDate: this.conditionForm.dates[0],
          endDate: this.conditionForm.dates[1],
          tradeName: this.conditionForm.tradeName
        }
        let url = this.initParams === '2' ? 'API@/dec-common/dec/decListHis/syncDecHis' : 'API@/dec-common/decParam/common/refreshBondedList'
        this.$post({
          url: url,
          data: param,
          success: (res) => {
            this.$emit('submitdatas', {})
          }
        })
      })
    },
    // 查询境内收发货人名称
    queryCorpInfo () {
      this.$post({
        url: 'API@/dec-common/dec/decListHis/getTradeName',
        data: '',
        success: (res) => {
          if (res.code === '0000' && res.result.length > 0) {
            for (let i in res.result) {
              this.tradeNameList.push({
                value: res.result[i]
              })
            }
          }
        }
      })
    },
    // 取消
    cancleBtn () {
      this.$emit('closedecele', {})
    },
    querySearch (queryString, cb) {
      let restaurants = this.tradeNameList
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results.slice(0, 10))
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      this.conditionForm.tradeName = item.value
    }
  }
}
</script>
<style scoped lang="less">
  .query-btn {
    text-align: center;
  }
  .btn-padding {
    padding: 8px 20px;
  }
</style>
