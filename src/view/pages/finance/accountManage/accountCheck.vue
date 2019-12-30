<template>
  <section class='sys-main expenseDetail'>
    <div class="topFlag list-icon-Tips flex" v-if="reconMsg">
      <i></i>
      <div class="one-row">
        <div class="left">对账意见&nbsp;:</div>
        <div class="right">{{reconMsg || '-'}}</div>
      </div>
    </div>
    <!-- <el-row class="topBtn">
      <el-button size="mini" type="primary">添加台账</el-button>
    </el-row> -->
    <!-- 新增和使用报价区域 -->
    <el-form ref="receiveTableForm" :model="formData" :show-message="false">
      <div class="receive area" v-for="(item1, index) in formData.accountBillOptionVOs" :key="item1.expenseBillId">
        <el-row class="line up">
          <el-col :span="8">
            <div class="one-row">
              <div class="left">接单编号&nbsp;:</div>
              <div class="right">{{item1.orderNo || '-'}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="one-row">
              <div class="left">报关单号&nbsp;:</div>
              <div class="right">{{item1.decNo || '-'}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="one-row">
              <div class="left">提单号&nbsp;:</div>
              <div class="right">{{item1.billNo || '-'}}</div>
            </div>
          </el-col>
        </el-row>
        <div class="tableItems">
          <el-row class="table-btn">
            <el-button size="mini" class="list-btns list-icon-add" @click="quotationAdd(index)"><i></i>新增</el-button>
            <!-- 使用报价选项 -->
            <el-dropdown trigger="click" @command="((data) => getOfferReceive(data, index))" placement="bottom-start">
              <el-button size="mini" class="list-btns list-icon-useOffer">
                <i></i>使用报价
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in quotationList" :command="item" :key="item.quotationId">{{item.itemName+'-'+item.entrustCompanyName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
          <div class='query-table-finance'>
            <el-table size="mini" class='sys-table-table borderRightDeep' row-key="expenseBillId" :cell-class-name="getCellStyle" :row-class-name="getRowStyle" align="left" :data="item1.billOptionsVOs" border>
              <el-table-column type="index" label="序号" width="50" align="center">
              </el-table-column>
              <el-table-column prop="feeOptionName" label="费用名称" min-width="120">
                <template slot-scope="scope">
                  <div class="table-select">
                    <el-select size="mini" placeholder="请选择费用名称" clearable  v-model="scope.row.feeOptionName" style="width:100%;" @change="getRate(scope.row)" :disabled="disabledCell(scope.row)">
                      <el-option v-for="item in optionsList"
                        :key="item.feePid" :label="item.feeOptionName" :value="item.feeOptionName">
                      </el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="feePrice" label="计费单价" align="right" min-width="140">
                <template slot-scope="scope">
                  <div class="table-select align-r">
                    <el-form-item
                      :prop="'accountBillOptionVOs.' + index + '.billOptionsVOs.'+ scope.$index + '.feePrice'"
                      :rules="valid.price">
                      <el-input clearable v-model="scope.row.feePrice"  @change="computeTaxPrice(scope.row)" :disabled="disabledCell(scope.row)"></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="unit" width="100" label="计量单位" align="center">
                <template slot-scope="scope">
                  <div class="table-select align-c">
                    <el-select  v-model="scope.row.unit" placeholder="计量单位"
                      filterable remote default-first-option clearable
                      :disabled="disabledCell(scope.row)"
                      @focus="tipsFill('unitList','SAAS_SEA_UNIT', 'unitR' + index + scope.$index)"
                      :remote-method="checkParamsList"
                      style="width:100%">
                      <el-option
                        v-for="item in unitList['unitR' + index + scope.$index]"
                        :key="item.codeField"
                        :label="item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="curr" width="120" label="币制" align="center">
                <template slot-scope="scope">
                  <div class="table-select align-c">
                    <!-- <el-select  v-model="scope.row.curr" placeholder="币制"
                      filterable remote default-first-option clearable
                      @focus="tipsFill('currList', 'SAAS_CURR', 'currR' + index + scope.$index)"
                      :remote-method="checkParamsList"
                      style="width:100%">
                      <el-option
                        v-for="item in currList['currR' + index + scope.$index]"
                        :key="item.codeField"
                        :label="item.codeField + '-' + item.nameField"
                        :value="item.codeField">
                      </el-option>
                    </el-select> -->
                    <el-form-item>
                      <el-input v-model="scope.row.curr" disabled></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="num" width="100" label="数量" align="right">
                <template slot-scope="scope">
                  <div class="table-select align-r">
                    <el-form-item
                      :prop="'accountBillOptionVOs.' + index + '.billOptionsVOs.'+ scope.$index + '.num'"
                      :rules="valid.num">
                      <el-input v-model="scope.row.num" @change="computeTaxPrice(scope.row)" :disabled="disabledCell(scope.row)"></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="rate" width="80" label="税率" align="right">
                <template slot-scope="scope">
                  <div class="table-select align-c">
                    <el-select size="mini" placeholder="税率" style="width:100%;" :disabled="disabledCell(scope.row)" v-model="scope.row.rate" @change="computeTaxPrice(scope.row)">
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
                  <div class="cell-div">{{scope.row.taxPrice.toLocaleString() || '-'}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="settleCompanyName" min-width="160" label="结算企业" align="left">
                <template slot-scope="scope">
                  <div class="table-select">
                    <el-input v-model="scope.row.settleCompanyName" :disabled="disabledCell(scope.row)"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="billType" width="100" label="类型" align="center">
                <template slot-scope="scope">
                  <div class="cell-div">
                    {{scope.row.billType === 0 ? '自动登账' : scope.row.billType === 1 ? '手动登账' : '-'}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="itemName" min-width="120" label="使用报价" align="center">
                <template slot-scope="scope">
                  <div class="cell-div">{{scope.row.itemName || '-'}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createUserName" width="100" label="操作人" align="center">
                <template slot-scope="scope">
                  <div class="cell-div">{{scope.row.createUserName || '-'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="60" align="center">
                <template slot-scope="scope">
                  <div class="sys-td-c">
                    <el-button title="删除" v-if="!disabledCell(scope.row)" type="text" @click="delItems(index, scope.$index, scope.row.accountBillOptionId)" class="table-icon list-icon-delete"><i></i></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-form>
    <!-- 汇总区域 -->
    <div class="all area">
      <el-row class="companyItems">
        <div class="left">含税总金额&nbsp;:&nbsp;</div>
        <div class="right">
          <!-- <span>应收&nbsp;:&nbsp;</span> -->
          <span class="receive"  v-for="(item, index) in summarysSum" :key="'index' + index">{{(item.currName || '-') +' '+ item.sum}}</span>
        </div>
      </el-row>
    </div>
    <div class="submit">
      <el-row style="text-align:center">
        <el-button size="mini" type="primary" @click="submitBtn(1)">提交</el-button>
        <el-button size="mini"  @click="cancelEdit">取消</el-button>
        <el-button size="mini" type="primary" @click="submitBtn(3)">发送审核</el-button>
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
      feeFlag: '',
      receivablefeeOptions: {},
      payablefeeOptions: {},
      accountBillOptionIds: [], // 点击删除时存储id
      formData: {
        accountBillOptionVOs: []
      },
      optionsList: [], // 费用项列表
      quotationList: [], // 报价列表
      reconMsg: '',
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
      copyData: {
        accountBillOptionVOs: []
      },
      template: {
        serialNo: '',
        feeOptionName: '',
        feePrice: '',
        unit: '',
        curr: 'CNY',
        num: '',
        rate: 0,
        taxPrice: '',
        settleCompanyName: '',
        billType: 1,
        itemName: '',
        createUserName: ''
      },
      // {pattern: /^\d{1,9}(\.\d{1,3})?$|^$/,validator: priceValid,message:'小数点支持前9位,后3位',trigger:'blur'}
      valid: {
        price: {validator: this.priceValid, message: '小数点支持前9位,后3位', trigger: 'blur'},
        num: {validator: this.numValid, message: '小数点支持前9位,后3位', trigger: 'blur'}
      },
      selectDown: {
        curr: {downList: 'currList', params: 'SAAS_CURR'},
        unit: {downList: 'unitList', params: 'SAAS_SEA_UNIT'}
      }
    }
  },
  created () {
    let {accountBillId, feeFlag} = this.$route.query
    this.feeFlag = feeFlag === 'true'
    this.getQuotationsByAdd()
    this.getOptionList()
    this.getCommonParam(() => {
      this.getAccountDetail(accountBillId)
    })
  },
  watch: {},
  computed: {
    summarysSum: function () {
      if (!Array.isArray(this.formData.accountBillOptionVOs) || !this.formData.accountBillOptionVOs.length > 0) return []
      let newArr = []
      let allArr = []
      // 根据币制汇总
      this.formData.accountBillOptionVOs.forEach(v => {
        let temp = v['billOptionsVOs'].map(item => item.curr)
        allArr.push(...v['billOptionsVOs'])
        newArr.push(...temp)
      })
      let uniqueArr = [...new Set(newArr)]
      return this.getCategory(uniqueArr, allArr)
    }
  },
  methods: {
    // 获取账单详情
    getAccountDetail (accountBillId) {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/account/get',
        data: {
          accountBillId
        },
        router: this.$router,
        success: ({result}) => {
          this.formData.accountBillOptionVOs = result.accountBillOptionVOs || []
          this.reconMsg = result.reconMsg || ''
          // 复制数据
          if (result.accountBillOptionVOs && result.accountBillOptionVOs.length > 0) {
            // 翻译
            result.accountBillOptionVOs.forEach((v, i) => {
              if (v.billOptionsVOs && v.billOptionsVOs.length > 0) {
                this.initSelected(v.billOptionsVOs, 0, i)
              }
            })
            this.copyData.accountBillOptionVOs = JSON.parse(JSON.stringify(result.accountBillOptionVOs))
          }
        }
      })
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
          temp = list.slice(0, 30)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          temp = filterList.slice(0, 30)
        }
      } else {
        if (!util.isEmpty(JSON.parse(localStorage.getItem(params)))) {
          temp = JSON.parse(localStorage.getItem(params)).slice(0, 30)
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
      if (columnIndex === 7 || columnIndex === 4 || (columnIndex >= 9 && columnIndex < 12)) {
        return 'cell-disable'
      }
    },
    // 获取应收基础报价
    getOfferReceive (item, index) {
      // 查询报价应收/应付
      this.feeFlag ? (this.receivablefeeOptions = item) : (this.payablefeeOptions = item)
      this.getQuotationDetail(this.feeFlag, item.quotationId, index)
    },
    getQuotationDetail (feeFlag, quotationId, index) {
      let fee = feeFlag ? 'receivablefeeOptions' : 'payablefeeOptions'
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/getQuotationDetail',
        data: {
          feeFlag, // 应收true，应付false
          quotationId
        },
        router: this.$router,
        success: ({result}) => {
          if (result && result[fee] && result[fee].length > 0) {
            result[fee].forEach(v => {
              v.settleCompanyName = this[fee].entrustCompanyName
              v.billType = 1
              v.itemName = this[fee].itemName
              // 报关单有且单位为票 数量默认为1
              ;(v.unit === '35' && this.formData.accountBillOptionVOs[index].innerNo && (v.num = 1)) || (v.num = '')
              // 单位为次
              v.unit === '38' && (v.num = 1)
              // 单位为页
              if (v.unit === '36' && this.formData.accountBillOptionVOs[index].goodNum) {
                let val = this.formData.accountBillOptionVOs[index].goodNum
                if (val < 6) { // 0 或小数
                  v.num = 1
                } else if (val % 6 === 0) { // 整除
                  v.num = parseInt(val / 6)
                } else { // 向上取整
                  v.num = Math.ceil(val / 6)
                }
              }
              // 计算总价
              this.computeTaxPrice(v)
              v.feeFlag = feeFlag
            })
            // 计算追加后数组的长度,处理下拉列表属性值能够有序的增加 eg: curr0,curr1 ...
            let preLength = this.formData.accountBillOptionVOs[index]['billOptionsVOs'].length
            this.initSelected(result[fee], preLength, index)
            this.formData.accountBillOptionVOs[index]['billOptionsVOs'].push(...result[fee])
          }
        }
      })
    },
    // 新增单条
    quotationAdd (index) {
      let obj = {...this.template}
      this.formData.accountBillOptionVOs[index]['billOptionsVOs'].push(obj)
    },
    delItems (index1, index2, id) {
      if (this.formData.accountBillOptionVOs[index1]['billOptionsVOs'] && this.formData.accountBillOptionVOs[index1]['billOptionsVOs'].length === 1) {
        this.$confirm('请确认是否删除该账单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          this.formData.accountBillOptionVOs[index1]['billOptionsVOs'].splice(index2, 1)
          id && this.accountBillOptionIds.push(id)
        }).catch(() => {})
      } else {
        this.formData.accountBillOptionVOs[index1]['billOptionsVOs'].splice(index2, 1)
        id && this.accountBillOptionIds.push(id)
      }
    },
    // 提交编辑
    submitBtn (status) {
      // 表单验证
      let pass1 = false
      this.$refs['receiveTableForm'].validate(valid => {
        if (!valid) pass1 = true
      })
      if (pass1) return
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/account/edit',
        data: {
          accountBillId: this.$route.query.accountBillId,
          accountBillOptionIds: [...new Set(this.accountBillOptionIds)],
          ...this.formData,
          reconStatus: status
        },
        router: this.$router,
        success: res => {
          this.$message({
            type: 'success',
            message: status === 1 ? '提交成功' : '审核成功'
          })
          // this.getBillDetail(this.$route.query.expenseBillId)
          this.$store.dispatch('CloseTab', this.$route.name)
          this.$router.push({
            name: 'accountManage-list',
            query: {
              from: 'other'
            }
          })
        }
      })
    },
    // 取消编辑
    cancelEdit () {
      this.$refs['receiveTableForm'].clearValidate()
      this.accountBillOptionIds = []
      this.formData.accountBillOptionVOs = JSON.parse(JSON.stringify(this.copyData.accountBillOptionVOs))
    },
    // 千分符转换成数字
    dealMullimeter (num) {
      if (typeof num === 'string') {
        if (num.indexOf(',') > -1) {
          return +(num.replace(/,/g, ''))
        } else {
          return +num || 0
        }
      }
      if (typeof num === 'number') {
        return num
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
      let priceReg = /^\d{1,10}(\.\d{1,3})?$|^$/ // 小数点前10后3
      let numFeg = /^\d{1,9}(\.\d{1,3})?$|^$/ // 小数点前9后3
      if (!priceReg.test(+row.feePrice) || !numFeg.test(+row.num)) return // 避免为NaN的情况
      let temp = row.num * row.feePrice * (1 + (+row.rate) / 100)
      row.taxPrice = temp
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
    // 以货币分类汇总
    getCategory (uniqueArr, allArr) {
      let tempArr1 = []
      uniqueArr.forEach(i => {
        let temp3 = allArr.filter(q => q.curr === i && typeof (q.taxPrice === 'number' || typeof q.taxPrice === 'string'))
        let obj1 = {
          currName: i,
          sum: this.getSum(temp3.map(s => s.taxPrice))
        }
        tempArr1.push(obj1)
      })
      return tempArr1
    },
    // 单价校验
    priceValid (rule, value, callback) {
      let reg = /^\d{1,10}(\.\d{1,3})?$/
      if (!reg.test(value)) {
        this.$message({
          type: 'error',
          message: '单价为空或格式输入有误,支持小数点后3位,前10位'
        })
        callback(new Error('数量为空或格式输入有误,支持小数点后3位,前10位'))
      } else {
        callback()
      }
    },
    // 数量校验
    numValid (rule, value, callback) {
      let reg = /^\d{1,9}(\.\d{1,3})?$/
      if (!reg.test(value)) {
        this.$message({
          type: 'error',
          message: '数量为空或格式输入有误,支持小数点后3位,前9位'
        })
        callback(new Error('数量为空或格式输入有误,支持小数点后3位,前9位'))
      } else {
        callback()
      }
    },
    // 数据返填时,翻译计量单位和币制
    initSelected (arr, length, index) {
      if (!Array.isArray(arr)) return
      if (arr.length === 0) return
      arr.forEach((v, i) => {
        if (v.unit) {
          this.selectObj = {
            obj: this.selectDown['unit']['downList'],
            params: this.selectDown['unit']['params'],
            index: 'unitR' + index + (i + length)
          }
          this.checkParamsList(v.unit)
        }
        // if (v.curr) { 币制翻译取消
        //   this.selectObj = {
        //     obj: this.selectDown['curr']['downList'],
        //     params: this.selectDown['curr']['params'],
        //     index: 'curr' + type + (i + length)
        //   }
        //   this.checkParamsList(v.curr)
        // }
      })
    },
    // 台账手动新增时,获取本企业报价列表
    getQuotationsByAdd () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-finance/bill/getQuotations',
        data: {},
        router: this.$router,
        success: ({result}) => {
          this.quotationList = result || []
        }
      })
    },
    getRowStyle ({row, rowIndex}) {
      if (row.status === 0 || row.status === 1) {
        return 'row-disable'
      }
    },
    disabledCell (data) {
      return data.status === 0 || data.status === 1
    }
  }
}
</script>
<style lang="less" scoped>
  .content {
    color: #4c4c4c;
    padding: 0 18px;
    .down {
      padding-top: 18px;
    }
  }
  .flex {
    display: flex;
  }
  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .block {
    width: 25%;
    padding-bottom: 18px;
    .left {
      width: 100px;
    }
    .right {
      padding-right: 20px;
      flex: 1;
      word-break:break-all;
    }
    &:nth-child(4n) .right {
      padding-right: 0;
    }
  }
  .companyItems {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    .right {
      float: right;
      line-height: 38px;
      // flex:1;
      word-break:break-all;
      max-width: calc(~"(100% - 60px)")
    }
    .left {
      float: right;
      width: 80px;
      line-height: 38px;
    }
    .receive {
      font-weight: bold;
      font-size: 20px;
      &:after {
        content:'+';
      }
    }
    .receive {
      color:#FE4400;
      &:last-child:after{
        content:'';
      }
    }
  }
  .area {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 18px;
  }
  .all.area {
    padding: 10px 18px;
  }
  .decDetail {
    padding-bottom: 0;
  }
  .title {
    padding-bottom: 18px;
  }
  .line {
    padding-bottom: 18px;
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
  .normal {
    padding-bottom: 18px;
    padding-top: 18px;
    border-top: 1px solid #eee;
    .left {
      width: 100px;
    }
    .red {
      color:#FE4400;
      font-size: 14px;
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
  .topBtn {
    margin-bottom: 18px;
  }
  .topFlag {
    padding-left: 18px;
    margin-bottom: 18px;
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
  .flex {
    display: flex;
    align-items: center;
  }
</style>
