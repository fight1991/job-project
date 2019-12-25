<template>
  <section class='sys-main invoiceDetail'>
    <div class="topFlag list-icon-Tips flex" v-if="optionsType === 'edit' && isSplitPrice">
      <i></i>
      <div class="text">当前开票金额已超过100000元,系统将自动进行拆分开票操作</div>
    </div>
    <!-- 发票类型区域 -->
    <div class="area">
      <div class="title">发票类型&nbsp;:&nbsp;{{invoiceTypeValue || '-'}}</div>
      <el-table class='sys-table-table' align="left" size="mini" :max-height="300"
        :data="accountBillTableList" border highlight-current-row>
        <el-table-column type="index" width="50" label="序号" align="center">
        </el-table-column>
        <el-table-column label="账单企业" width="180" prop="settleCompanyName">
        </el-table-column>
        <el-table-column label="接单编号" width="160" prop="orderNo">
          <template slot-scope="scope">
            {{scope.row.orderNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="报关单号" width="190" prop="decNo">
          <template slot-scope="scope">
            {{scope.row.decNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="提单号" width="160" prop="billNo">
          <template slot-scope="scope">
            {{scope.row.billNo || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="费用项" min-width="100" prop="feeOptionName">
        </el-table-column>
        <el-table-column label="币制" min-width="100" prop="curr" align="center">
        </el-table-column>
        <el-table-column label="金额" min-width="100" prop="taxPrice" align="right" fixed="right">
          <template slot-scope="scope">
            {{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="委托企业" width="180" prop="entrustCompanyName" fixed="right">
          <template slot-scope="scope">
            {{scope.row.entrustCompanyName || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="开航/放行日" min-width="100" prop="sailDay" align="center" fixed="right">
          <template slot-scope="scope">
            {{scope.row.sailDay || '-'}}
          </template>
        </el-table-column>
      </el-table>
      <div class="total" v-if="amount.length > 0">
        <span class="compute">总计&nbsp;:&nbsp;</span><span class="totalNum" v-for="item in amount" :key="item.curr">{{item.curr +' '+ (item.price && item.price.toLocaleString() || '-' )}}</span>
      </div>
    </div>
    <!-- 发票拆分区域 -->
    <div class="area">
      <el-row class="table-btn" v-if="optionsType === 'edit'">
        <el-button size="mini" class="list-btns list-icon-add" @click="addInvioceItem"><i></i>新增</el-button>
      </el-row>
      <div class='query-table-finance'>
        <el-form :show-message="false" :model="invoiceOptionData" ref="invoiceOptionData">
          <el-table size="mini"
            :class="{'sys-table-table': true, 'borderRightDeep': optionsType==='edit'}"
            :cell-class-name="(optionsType==='edit' && getCellStyle) || ''" align="left"
            :data="invoiceOptionData.invoiceOptionTableList" border
            @cell-dblclick="editInvoiceNum">
            <el-table-column type="index" label="序号" width="50" align="center">
            </el-table-column>
            <el-table-column prop="feeType" label="费用分类" min-width="80" align="center">
              <template slot-scope="scope">
                <div class="table-select" v-if="optionsType === 'edit'">
                  <el-form-item
                    :prop="'invoiceOptionTableList.'+ scope.$index + '.feeType'"
                    :rules="valid.feeTypeAndRate">
                    <el-select size="mini" placeholder="请选择费用名称" clearable  v-model="scope.row.feeType" style="width:100%;">
                      <el-option key='1' label="代理费用" :value="'1'"></el-option>
                      <el-option key='2' label="运输费用" :value="'2'"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.feeTypeValue || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="feePrice" label="不含税金额" align="right" min-width="100">
              <template slot-scope="scope">
                <div class="table-select align-r" v-if="optionsType === 'edit'">
                  <el-form-item
                    :prop="'invoiceOptionTableList.'+ scope.$index + '.feePrice'"
                    :rules="valid.price">
                    <el-input clearable v-model="scope.row.feePrice" @focus="dealMullimeter(scope.row)" @blur="numToMullimeter(scope.row)"></el-input>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{scope.row.feePrice.toLocaleString()}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="rate" width="80" label="税率" align="right">
              <template slot-scope="scope">
                <div class="table-select align-c" v-if="optionsType === 'edit'">
                  <el-form-item
                    :prop="'invoiceOptionTableList.'+ scope.$index + '.rate'"
                    :rules="valid.feeTypeAndRate">
                    <el-select size="mini" placeholder="税率" style="width:100%;" v-model="scope.row.rate" @change="computeTaxPrice(scope.row)">
                      <el-option key="0" :label="'0%'" :value="0"></el-option>
                      <el-option key="6" :label="'6%'" :value="6"></el-option>
                      <el-option key="9" :label="'9%'" :value="9"></el-option>
                      <el-option key="13" :label="'13%'" :value="13"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="cell-div" v-else>{{typeof scope.row.rate === 'number' ? (scope.row.rate + '%') : '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="taxPrice" label="含税总额" align="right" min-width="100">
              <template slot-scope="scope">
                <div class="cell-div" >{{scope.row.taxPrice.toLocaleString()}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceNum" label="发票号" align="center" min-width="100">
              <template slot-scope="scope">
                <div class="table-select align-r" v-if="optionsType === 'edit'">
                  <el-form-item
                    :prop="'invoiceOptionTableList.'+ scope.$index + '.invoiceNum'"
                    :rules="valid.invoiceNum">
                    <el-input clearable v-model="scope.row.invoiceNum" :maxlength="8"></el-input>
                  </el-form-item>
                </div>
                <div v-else>
                  <el-input style="border: 1px solid #ccc;" size="mini" v-model="scope.row.invoiceNum" v-show="scope.row.doubleClick" autofocus :maxlength="8" @blur="saveInvoiceNum(scope.row)"></el-input>
                  <div class="cell-div" v-show="!scope.row.doubleClick">{{scope.row.invoiceNum || '-'}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="60" align="center" v-if="optionsType === 'edit'">
              <template slot-scope="scope">
                <div class="sys-td-c">
                  <el-button title="删除" type="text" class="table-icon list-icon-delete" @click="delOpItem(scope.$index)"><i></i></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <div class="submit" v-if="optionsType === 'edit'">
      <el-row style="text-align:center">
        <el-button size="mini" type="primary" @click="submitBtn">提交</el-button>
        <el-button size="mini"  @click="cancelEdit">取消</el-button>
      </el-row>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      optionsType: '',
      amount: [],
      isSplitPrice: false,
      accountBillTableList: [],
      invoiceOptionData: {
        invoiceOptionTableList: [
          {
            feePrice: '',
            feeType: '',
            feeTypeValue: '',
            invoiceNum: '',
            rate: '',
            taxPrice: ''
          }
        ]
      },
      invoiceTypeValue: '',
      invoiceType: '',
      accountBillOptionIds: [],
      invoiceTemplate: {
        feePrice: '',
        feeType: '',
        feeTypeValue: '',
        invoiceNum: '',
        rate: '',
        taxPrice: ''
      },
      valid: {
        price: {validator: this.priceValid, message: '不含税金额不超过8800', trigger: 'blur'},
        feeTypeAndRate: {validator: this.feeTypeAndRateValid, trigger: 'change'},
        invoiceNum: {validator: this.invoiceNumValid, message: '请输入发票号', trigger: 'blur'}
      }
    }
  },
  created () {
    let {type, invoiceId, invoiceType} = this.$route.query
    this.optionsType = type
    if (type === 'edit') {
      let optionsId = [...this.$store.state['finance-module'].ticketIds]
      this.accountBillOptionIds = optionsId
      this.invoiceType = invoiceType
      this.getInvoiceDetailByAccounts(optionsId, invoiceType)
    } else {
      this.getInvoiceDetail(invoiceId)
    }
  },
  watch: {},
  methods: {
    // 查看详情
    getInvoiceDetail (id) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/invoice/get',
        data: {
          invoiceId: id
        },
        router: this.$router,
        success: ({result}) => {
          let {accountBillVOs, invoiceOptionVOs, invoiceType, invoiceTypeValue, amountVOs} = result
          this.accountBillTableList = accountBillVOs || [] // doubleClick: false,
          if (invoiceOptionVOs && invoiceOptionVOs.length > 0) {
            invoiceOptionVOs.forEach(v => {
              v.doubleClick = false
            })
          }
          this.invoiceOptionData.invoiceOptionTableList = invoiceOptionVOs || []
          this.invoiceTypeValue = invoiceTypeValue
          this.invoiceType = invoiceType
          this.amount = amountVOs
        }
      })
    },
    // 从账单创建发票跳转过来
    getInvoiceDetailByAccounts (id, invoiceType) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/invoice/getAccounts',
        data: {
          accountBillOptionIds: id,
          invoiceType
        },
        router: this.$router,
        success: ({result}) => {
          let {accountBillVOs, invoiceOptionVOs, invoiceType, invoiceTypeValue, amountVOs} = result
          this.accountBillTableList = accountBillVOs || []
          if (invoiceOptionVOs) {
            this.invoiceOptionData.invoiceOptionTableList = invoiceOptionVOs || []
          }
          this.invoiceTypeValue = invoiceTypeValue
          this.invoiceType = invoiceType
          this.amount = amountVOs
          // 自动拆分
          this.splitPriceAuto(amountVOs)
        }
      })
    },
    // 发票拆分新增
    addInvioceItem () {
      this.invoiceOptionData.invoiceOptionTableList.push({...this.invoiceTemplate})
    },
    // 发票拆分删除
    delOpItem (index) {
      this.invoiceOptionData.invoiceOptionTableList.splice(index, 1)
    },
    // 计算含税总额
    computeTaxPrice (row) {
      let temp = this.dealMullimeter(row.feePrice, 'num')
      let priceReg = /^\d+(\.\d+)?$|^$/
      if (!row.rate && row.rate !== 0) return
      if (!priceReg.test(temp)) return // 避免为NaN的情况
      row.taxPrice = temp * (1 + (+row.rate) / 100)
    },
    // 自动拆分
    splitPriceAuto (amountVOs, base = 88000) {
      let sum = 0
      amountVOs.forEach(v => {
        if (v.price >= 0) {
          sum += v.price
        }
      })
      if (sum < 100000) {
        this.invoiceOptionData.invoiceOptionTableList = [{...this.invoiceTemplate}]
        return
      }
      this.isSplitPrice = true
      let maxLength = Math.floor(sum / 1.13 / base)
      let remain = sum / 1.13 - base * maxLength
      let tempList = []
      for (let i = 0; i < maxLength; i++) {
        if (i > 9) break // 最多拆分10条
        let obj = {...this.invoiceTemplate}
        obj.feePrice = base.toLocaleString()
        tempList.push(obj)
      }
      let end = {...this.invoiceTemplate}
      end.feePrice = remain.toLocaleString()
      this.invoiceOptionData.invoiceOptionTableList = [...tempList, {...end}]
    },
    // 千分符转换成数字
    dealMullimeter (row, type) {
      if (type) {
        if (typeof row === 'string') {
          if (row.indexOf(',') > -1) {
            row = +(row.replace(/,/g, ''))
          } else {
            row = +row || 0
          }
          return row
        }
        if (typeof row === 'number') {
          return row
        }
      }
      if (typeof row.feePrice === 'string') {
        if (row.feePrice.indexOf(',') > -1) {
          row.feePrice = +(row.feePrice.replace(/,/g, ''))
        }
        return row.feePrice
      }
      if (typeof row.feePrice === 'number') {
        return row.feePrice
      }
    },
    numToMullimeter (row) {
      if (row.feePrice !== '') {
        row.feePrice = (+row.feePrice).toLocaleString()
      }
      this.computeTaxPrice(row)
    },
    // 不含税金额校验
    priceValid (rule, value, callback) {
      let temp = (value && value.replace(/,/g, '')) || ''
      let reg = /^\d{1,9}(\.\d{1,3})?$/
      if (!reg.test(temp)) {
        this.$message({
          type: 'error',
          message: '单价为空或格式输入有误'
        })
        callback(new Error('单价为空或格式输入有误'))
      } else if (temp - 88000 > 0) {
        this.$message({
          type: 'error',
          message: '不含税金额不超过88000'
        })
        callback(new Error('不含税金额不超过88000'))
      } else {
        callback()
      }
    },
    // 不含税金额校验
    feeTypeAndRateValid (rule, value, callback) {
      let message = '请选择税率'
      if (rule.field.endsWith('feeType')) {
        message = '请选择费用名称'
      }
      if (!value && value !== 0) {
        this.$message({
          type: 'error',
          message: message
        })
        callback(new Error(message))
      } else {
        callback()
      }
    },
    // 发票号校验
    invoiceNumValid (rule, value, callback) {
      let reg = /^\d{8}$|^$/
      if (!reg.test(value)) {
        this.$message({
          type: 'error',
          message: '请输入正确格式的8位发票号'
        })
        callback(new Error('请输入正确格式的8位发票号'))
      } else {
        callback()
      }
    },
    // 提交
    submitBtn () {
      let flag = true
      this.$refs['invoiceOptionData'].validate(valid => {
        if (!valid) {
          flag = false
        }
      })
      if (!flag) return
      let params = JSON.parse(JSON.stringify(this.invoiceOptionData.invoiceOptionTableList))
      params.forEach(v => {
        this.dealMullimeter(v)
      })
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/invoice/create',
        data: {
          accountBillOptionIds: this.accountBillOptionIds,
          invoiceType: this.invoiceType,
          optionVOs: params
        },
        router: this.$router,
        success: () => {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          let {setId} = this.$route.query
          this.$store.dispatch('CloseTab', setId)
          this.$router.push({
            name: 'accountManage-list',
            query: {
              from: 'other'
            }
          })
        }
      })
    },
    // 取消
    cancelEdit () {
      this.$refs['invoiceOptionData'].clearValidate()
      this.invoiceOptionData.invoiceOptionTableList = [{...this.invoiceTemplate}]
    },
    // 获取单元格样式
    getCellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 4) {
        return 'cell-disable'
      }
    },
    // 双击编辑发票号
    editInvoiceNum (row, column, cell, e) {
      if (column.property === 'invoiceNum' && !row.invoiceNum) {
        row.doubleClick = true
        this.$nextTick(() => {
          e.target.previousElementSibling.firstElementChild && e.target.previousElementSibling.firstElementChild.focus()
        })
      }
    },
    // 失焦保存
    saveInvoiceNum (row) {
      let reg = /^\d{8}$|^$/
      if (!reg.test(row.invoiceNum)) {
        this.$message({
          type: 'error',
          message: '请输入正确格式的8位发票号'
        })
        return
      }
      if (!row.invoiceNum) {
        row.doubleClick = false
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/invoice/addInvoiceNum',
        data: {
          invoiceNum: row.invoiceNum,
          invoiceOptionId: row.invoiceOptionId
        },
        router: this.$router,
        success: () => {
          this.$message({
            type: 'success',
            message: '发票号已更新'
          })
          row.doubleClick = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .title {
    color: #4c4c4c;
    padding-bottom: 18px;
  }
  .content {
    color: #4c4c4c;
    padding: 0 18px;
    .down {
      padding-top: 18px;
    }
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .area {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 18px;
  }
  .line {
    padding-bottom: 18px;
    border-bottom: 1px solid #eee;
  }
  .table-btn {
    padding-bottom: 12px;
  }
  .cell-div {
    padding: 8px 12px;
    line-height: 18px;
  }
  .table-btn {
    padding-left: 4px;
  }
  .total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px 0 5px;
    .compute {
      color: #4c4c4c;
      margin-right: 10px;
    }
  }
  .totalNum {
    font-weight: bold;
    font-size: 20px;
    color: #FE4400;
    &:after {
      content:'+';
    }
    &:last-child:after{
      content:'';
    }
  }
  .topFlag {
    padding-left: 18px;
    margin-bottom: 20px;
    height: 40px;
    box-sizing: border-box;
    border: 1px solid #ffc56b;
    background-color: #ffe9c7;
    border-radius: 2px;
    i {
      margin-right: 8px;
      padding-left: 1px;
    }
  }
</style>
