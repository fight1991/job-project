<template>
  <section class='sys-main expenseDetail' ref="container">
    <!-- 批量费用登记 -->
    <div class="receive area">
      <div class="title">批量费用登记</div>
      <el-row class="table-btn">
        <el-button size="mini" class="list-btns list-icon-add" @click="quotationAdd(true)"><i></i>新增</el-button>
      </el-row>
      <div class='query-table-finance addForm'>
        <el-form ref="tableForm" :model="mutiRegisterData" :show-message="false" @keyup.enter.native="nextInputFocus">
          <el-table size="mini" :class="{'sys-table-table': true, 'borderRightDeep': true}" row-key="expenseBillOptionId" :cell-class-name="getCellStyle" align="left" :data="mutiRegisterData.optionVOs" border>
            <el-table-column type="index" label="序号" width="50" align="center">
            </el-table-column>
            <el-table-column prop="feeOptionName" label="应收/应付" width="140px">
              <template slot-scope="scope">
                <div class="table-select">
                  <el-form-item
                    :prop="'optionVOs.'+ scope.$index + '.feeFlag'"
                    :rules="valid.feeFlag">
                    <el-select size="mini" placeholder="收付类型" filterable default-first-option v-model="scope.row.feeFlag" style="width:100%;" @change="getRate(scope.row)">
                      <el-option key="0" :label="'应收'" :value="true"></el-option>
                      <el-option key="1" :label="'应付'" :value="false"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="feeOptionName" label="费用名称" width="130px">
              <template slot-scope="scope">
                <div class="table-select">
                  <el-form-item
                    :prop="'optionVOs.'+ scope.$index + '.feeOptionName'"
                    :rules="valid.feeOptionName">
                    <el-select size="mini" placeholder="请选择费用名称" clearable filterable default-first-option v-model="scope.row.feeOptionName" style="width:100%;" @change="getRate(scope.row)">
                      <el-option v-for="item in optionsList"
                        :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="feePrice" label="计费单价" align="right" min-width="140">
              <template slot-scope="scope">
                <div class="table-select align-r">
                  <el-form-item
                    :prop="'optionVOs.'+ scope.$index + '.feePrice'"
                    :rules="valid.price">
                    <el-input clearable v-model="scope.row.feePrice" @change="computeTaxPrice(scope.row)"></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="unit" width="100" label="计量单位" align="center">
              <template slot-scope="scope">
                <div class="table-select align-c">
                  <el-form-item :prop="'optionVOs.'+ scope.$index + '.unit'" :rules="valid.unit">
                    <el-select  v-model="scope.row.unit" placeholder="计量单位"
                      filterable remote default-first-option clearable
                      @focus="tipsFill('unitList','SAAS_SEA_UNIT', 'unitR'+ scope.$index)"
                      :remote-method="checkParamsList"
                      style="width:100%">
                      <el-option
                        v-for="item in unitList['unitR'+ scope.$index]"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="curr" width="120" label="币制" align="center">
              <template slot-scope="scope">
                <div class="table-select align-c">
                  <el-form-item>
                    <el-input  v-model="scope.row.curr" disabled></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" width="100" label="数量" align="right">
              <template slot-scope="scope">
                <div class="table-select align-r">
                  <el-form-item
                    :prop="'optionVOs.'+ scope.$index + '.num'"
                    :rules="valid.num">
                    <el-input v-model="scope.row.num" @change="computeTaxPrice(scope.row)"></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rate" width="80" label="税率" align="right">
              <template slot-scope="scope">
                <div class="table-select align-c">
                  <el-select size="mini" placeholder="税率" style="width:100%;" filterable default-first-option v-model="scope.row.rate" @change="computeTaxPrice(scope.row)">
                    <el-option key="0" :label="'0%'" :value="0"></el-option>
                    <el-option key="6" :label="'6%'" :value="6"></el-option>
                    <el-option key="9" :label="'9%'" :value="9"></el-option>
                    <el-option key="13" :label="'13%'" :value="13"></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="taxPrice" width="100" label="含税总价" align="right">
              <template slot-scope="scope">
                <div class="cell-div">{{scope.row.taxPrice && scope.row.taxPrice.toLocaleString() || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="settleCompanyName" min-width="160" label="结算企业" align="left">
              <template slot-scope="scope">
                <div class="table-select" v-if="scope.row.feeFlag">
                  <!-- 应收 -->
                  <el-form-item :prop="'optionVOs.'+ scope.$index + '.settleCompanyName'" :rules="valid.settleCompanyName">
                    <el-input v-model="scope.row.settleCompanyName"></el-input>
                  </el-form-item>
                </div>
                <div class="table-select" v-else>
                  <!-- 应付 -->
                  <el-form-item :prop="'optionVOs.'+ scope.$index + '.settleCompanyName'" :rules="valid.settleCompanyName">
                    <el-select size="mini" v-model="scope.row.settleCompanyName" style="width:100%;" filterable default-first-option @change="getSetComId(scope.row)" :disabled="disabledCell(scope.row)">
                      <el-option v-for="item in contractCorpList" :key="item.settleCompanyId" :value="item.settleCompanyName" :label="item.settleCompanyName"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="60" align="center">
              <template slot-scope="scope">
                <div class="sys-td-c">
                  <el-button title="删除" type="text" @click="delItems(scope.row)" class="table-icon list-icon-delete"><i></i></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <div class="submit">
      <el-row style="text-align:center">
        <el-button size="mini" type="primary" @click="registerConfirm">确定</el-button>
        <el-button size="mini" @click="cancelEdit">取消</el-button>
      </el-row>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      isValid: false,
      billIds: [],
      mutiRegisterData: {
        optionVOs: [] // 表格数据
      },
      corpList: [], // 存储委托企业列表
      optionsList: [], // 费用项列表
      currList: {
        curr0: []
      }, // 币制
      unitList: { // 计量单位
        unit0: []
      },
      // 查询的字典字段
      tableNameList: {
        tableNames: [
          'SAAS_CURR', // 币制
          'SAAS_SEA_UNIT' // 计量单位
        ]
      },
      selectObj: {
        obj: '',
        params: ''
      },
      template: {
        feeFlag: false,
        feeOptionName: '',
        feePrice: '',
        unit: '',
        curr: 'CNY',
        num: '',
        rate: 0,
        taxPrice: '',
        settleCompanyName: ''
      },
      // {pattern: /^\d{1,9}(\.\d{1,3})?$|^$/,validator: priceValid,message:'小数点支持前9位,后3位',trigger:'blur'}
      valid: {
        price: {validator: this.priceValid, message: '小数点支持前9位,后3位', trigger: 'blur'},
        num: {validator: this.numValid, message: '小数点支持前9位,后3位', trigger: 'blur'},
        feeOptionName: {validator: this.feeOptionValid, message: '费用名称不能为空', trigger: 'change'},
        unit: {validator: this.feeOptionValid, message: '计量单位不能为空', trigger: 'change'},
        settleCompanyName: {validator: this.feeOptionValid, message: '结算企业不能为空', trigger: 'blur'},
        feeFlag: {required: true, message: '请选择收付类型', trigger: 'change'}
      },
      selectDown: {
        curr: {downList: 'currList', params: 'SAAS_CURR'},
        unit: {downList: 'unitList', params: 'SAAS_SEA_UNIT'}
      },
      allInput: [],
      fixInput: [],
      contractCorpList: [] // 应付结算企业
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getAllInput()
    })
  },
  created () {
    this.mutiRegisterData.optionVOs = [{...this.template}]
    this.billIds = this.$store.state['finance-module'].billIds
    this.getOptionList()
    this.getContractCorps()
    this.getCommonParam()
  },
  watch: {
    'mutiRegisterData.optionVOs.length': function () { // 更新dom节点
      this.$nextTick(() => {
        this.getAllInput(false)
      })
    },
    '$route': function (to) { // 当前页签隐藏时,存储的input地址发生改变需重新获取
      if (to.name === 'expense-multiExpenseRegister') {
        this.$nextTick(() => {
          if (this.mutiRegisterData.optionVOs.length > 0) {
            this.getAllInput()
          }
        })
      }
    }
  },
  computed: {
  },
  methods: {
    // 下一个input聚焦
    nextInputFocus (e) {
      let temp = e.target
      let index = this.allInput.indexOf(temp)
      if (index > -1 && index < this.allInput.length - 1) {
        this.allInput[index + 1].focus()
        this.allInput[index + 1].select()
      }
    },
    // 获取所有input框
    getAllInput (isFirst = true) {
      let tempInput = this.$refs.container.querySelectorAll('td:not(.is-hidden) input:not([disabled=disabled])')
      if (tempInput && tempInput.length > 0) {
        this.allInput = [...Array.from(tempInput)]
        isFirst && this.allInput[0].focus()
      }
    },
    // 获取费用名称下拉列表
    getOptionList () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/option/getAll',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.optionsList = result || []
        }
      })
    },
    // 判断缓存中是否有数据
    getCommonParam (callback) {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map, callback)
      } else {
        callback && callback()
      }
    },
    // 获取公共字典list
    getCommonParams (datas, callback) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
          callback && callback()
        }
      })
    },
    checkParamsList (query) {
      let {obj, params, index} = this.selectObj
      let temp = []
      if (query !== '') {
        let keyValue = query.toString().trim()
        let list = JSON.parse(localStorage.getItem(params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          temp = list.slice(0, 40)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          temp = filterList.slice(0, 40)
        }
      } else {
        if (!util.isEmpty(JSON.parse(localStorage.getItem(params)))) {
          temp = JSON.parse(localStorage.getItem(params)).slice(0, 40)
        }
      }
      // 添加响应式
      if (index) {
        this[obj][index] = temp
        this.$delete(this[obj], index)
        this.$set(this[obj], index, temp)
      } else {
        this[obj] = temp
      }
    },
    // 创建字典参数列表
    tipsFill (obj, params, index) {
      this.selectObj = {
        obj,
        params,
        index
      }
    },
    // 获取单元格样式
    getCellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 5 || columnIndex === 8) {
        return 'cell-disable'
      }
    },
    // 新增单条
    quotationAdd (feeFlag) {
      let obj = {...this.template}
      this.mutiRegisterData.optionVOs.push(obj)
    },
    disabledCell (data) {
      return data.status === 0 || data.status === 1
    },
    // 确认按钮
    registerConfirm () {
      // 表单验证
      let pass = false
      this.$refs['tableForm'].validate(valid => {
        if (!valid) pass = true
      })
      if (pass) return
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/addBillOptions',
        data: {
          expenseBillIds: this.billIds,
          optionVOs: this.mutiRegisterData.optionVOs
        },
        router: this.$router,
        success: res => {
          this.$message({
            type: 'success',
            message: '登记成功!'
          })
          this.$store.dispatch('CloseTab', this.$route.name)
          this.$router.push({
            name: 'expense-list',
            query: {
              from: 'other'
            }
          })
        }
      })
    },
    // 取消按钮
    cancelEdit () {
      this.mutiRegisterData.optionVOs = [{...this.template}]
    },
    // 千分符转换成数字
    dealMullimeter (num) {
      if (typeof num === 'string') {
        if (num.indexOf(',') > -1) {
          return +(num.replace(/,/g, ''))
        } else {
          return +num || 0
        }
      } else if (typeof num === 'number') {
        return num
      } else {
        return 0
      }
    },
    // 处理toFixed 4舍5不入的问题 eg: 5.22556 => 5.226
    changeFixed (temp) {
      let reg = /\d+(\.\d{3}5){1}/
      if (reg.test(temp)) { // 小数点第四位为5的话自动+1
        let arr = temp.toString().split('.')
        let tempLeft = arr[0]
        let tempRight = +arr[1].substring(0, 4) + 1
        temp = tempLeft + '.' + tempRight
      }
      return +temp || 0
    },
    computeTaxPrice (row) {
      let priceReg = !row.feeFlag ? /^-\d{1,10}(\.\d{1,3})?$|^\d{1,10}(\.\d{1,3})?$/ : /^\d{1,10}(\.\d{1,3})?$|^$/ // 小数点前10后3
      let numFeg = /^\d{1,9}(\.\d{1,3})?$|^$/ // 小数点前9后3
      if (!priceReg.test(+row.feePrice) || !numFeg.test(+row.num)) return // 避免为NaN的情况
      let temp = row.num * row.feePrice * (1 + (+row.rate) / 100)
      row.taxPrice = temp
    },
    delItems (row) {
      let index = this.mutiRegisterData.optionVOs.findIndex(item => row === item)
      if (this.mutiRegisterData.optionVOs.length === 1) {
        this.mutiRegisterData.optionVOs = [{...this.template}]
      } else {
        this.mutiRegisterData.optionVOs.splice(index, 1)
      }
    },
    getRate (row) {
      if (row.feeOptionName) {
        let temp = this.optionsList.find(item => item.feeOptionName === row.feeOptionName)
        row.rate = temp.feeRate
        // 新增一条时,添加feePid
        !row.feePid && (row.feePid = temp.feePid)
        // 总价发生变化
        this.computeTaxPrice(row)
      }
    },
    // 数组求和
    getSum (arr) {
      if (arr.length === 0) {
        return '0'
      }
      if (arr.length === 1) {
        return this.dealMullimeter(arr[0]).toLocaleString()
      }
      return arr.reduce((prev, curr, idx, arr) => {
        return (this.dealMullimeter(prev) + this.dealMullimeter(curr)).toLocaleString()
      })
    },
    // 单价校验
    priceValid (rule, value, callback) {
      let name = rule.field.split('.')[0]
      let reg = name === 'billPayableBodyVOList' ? /^-\d{1,10}(\.\d{1,3})?$|^\d{1,10}(\.\d{1,3})?$/ : /^\d{1,10}(\.\d{1,3})?$/
      if (!reg.test(value)) {
        callback(new Error('数量为空或格式输入有误,支持小数点后3位,前10位'))
        if (this.isValid) return
        this.$message({
          type: 'error',
          message: '单价为空或格式输入有误,支持小数点后3位,前10位',
          onClose: () => {
            this.isValid = false
          }
        })
        this.isValid = true
      } else {
        callback()
      }
    },
    // 数量校验
    numValid (rule, value, callback) {
      let reg = /^\d{1,9}(\.\d{1,3})?$/
      if (!reg.test(value)) {
        callback(new Error('数量为空或格式输入有误,支持小数点后3位,前9位'))
        if (this.isValid) return
        this.$message({
          type: 'error',
          message: '数量为空或格式输入有误,支持小数点后3位,前9位',
          onClose: () => {
            this.isValid = false
          }
        })
        this.isValid = true
      } else {
        callback()
      }
    },
    // 校验费用项
    feeOptionValid (rule, value, callback) {
      if (!value) {
        callback(new Error(rule.message))
        if (this.isValid) return
        this.$message({
          type: 'error',
          message: rule.message,
          onClose: () => {
            this.isValid = false
          }
        })
        this.isValid = true
      } else {
        callback()
      }
    },
    // 搜索委托企业
    querySearch (queryString, cb) {
      let temp = []
      if (queryString.trim().length < 2) {
        cb(temp)
        return
      }
      this.$store.dispatch('ajax', {
        url: 'API@/login/corp/getCorpByCondAssignProp',
        data: {
          corpName: queryString,
          returnProps: ['corpId', 'corpName']
        },
        router: this.$router,
        success: ({result}) => {
          let corpList = (result && result.splice(0, 20)) || []
          if (corpList.length > 0) {
            let tempArr = corpList.map(item => ({value: item.corpName}))
            cb(tempArr)
          } else {
            cb(temp)
          }
        }
      })
    },
    // 结算企业查询
    getContractCorps () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance-expense/contract/getCompanyNames',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.contractCorpList = result || []
        }
      })
    },
    querySearchContract (queryString, cb) {
      let results = []
      if (this.contractCorpList.length === 0) return cb(results)
      let restaurants = this.contractCorpList
      if (queryString.trim().length > 1) {
        results = restaurants.filter(v => {
          return v && v.indexOf(queryString) >= 0
        })
      }
      if (results.length === 0) return cb(results)
      let tempArr = results.map(item => ({value: item}))
      cb(tempArr)
    },
    // 结算企业变化获取id
    getSetComId (row) {
      if (row.settleCompanyName) {
        let temp = this.contractCorpList.find(item => item.settleCompanyName === row.settleCompanyName)
        row.settleCompanyId = temp.settleCompanyId
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .area {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 18px;
  }
  .title {
    padding-bottom: 18px;
    font-size: 16px;
  }
  .one-row {
    width: 100%;
    display: flex;
    align-items: flex-start;
    color: #4c4c4c;
    .left {
      width: 85px;
    }
    .right {
      flex: 1;
    }
  }
  .table-btn {
    padding-bottom: 12px;
  }
  .cell-div {
    padding: 5px 12px;
    line-height: 18px;
  }
  .cell-div.last-column {
    position: relative;
    .del-icon {
      cursor: pointer;
      img {
        display: block;
        margin: 0 auto;
      }
    }
  }
  .table-btn,.query-table-finance {
    padding-left: 4px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
</style>
