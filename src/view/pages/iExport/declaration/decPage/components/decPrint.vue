<template>
  <!-- 报关单打印 -->
  <section class="sys-dec-class">
    <div class='dec-div'>
      <el-form label-width="100px" size="mini">
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
          <el-col :span="24" style="height: 19px;">
            <el-form-item label="打印格式">
              <el-checkbox-group v-model="printSorts">
                <el-col :span="4">
                  <el-checkbox label="1">核对单</el-checkbox>
                </el-col>
                <el-col :span="4">
                  <el-checkbox label="01">商检单</el-checkbox>
                </el-col>
                <el-col :span="4">
                  <el-checkbox label="02">草单</el-checkbox>
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
          <el-col :span="24" style="height: 18px;">
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
        <el-row>
          <el-col :span="24" style="height: 18px;">
            <el-form-item label="操作人">
              <el-checkbox-group v-model="operator">
                <el-col :span="6">
                  <el-checkbox label="制单人">制单人</el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="审核人">审核人</el-checkbox>
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="审核通过时间">审核通过时间</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="height: 18px;">
            <el-form-item label="打印机">
              <el-select v-model="printerName" filterable>
                <el-option
                  v-for="item in printList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class='dialog-primary-btn' @click="previewPrint">打印预览</el-button>
      <el-button class='dialog-btn' @click="directPrint">直接打印</el-button>
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
      type: '0',
      pidList: '',
      declaration: false,
      recordListing: false,
      goods: false,
      container: false,
      signsChapter: ['报关专用章', '报关员章'],
      operator: [],
      printerName: '',
      printList: []
    }
  },
  mounted () {
    let initData = util.simpleClone(this.initParams)
    this.pidList = initData.pidList
    let storeData = JSON.parse(window.localStorage.getItem('decPrint' + this.initParams.userId))
    if (storeData) {
      this.type = storeData.type
      this.printSorts = storeData.printSorts
      this.signsChapter = storeData.signsChapter
      this.operator = storeData.operator
    }
    if (this.pidList.length === 1) {
      this.getGoodsNum(this.pidList[0])
    }
    this.getLocalPrinters()
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
          if (res.code === '0000') {
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
          } else {
            this.messageTips(res.message, 'success')
          }
        }
      })
    },
    printDecOrTs (type) {
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
      let operator1 = '0'
      let operator2 = '0'
      let operator3 = '0'
      for (let i in this.operator) {
        if (this.operator[i] === '制单人') {
          operator1 = '1'
        }
        if (this.operator[i] === '审核人') {
          operator2 = '1'
        }
        if (this.operator[i] === '审核通过时间') {
          operator3 = '1'
        }
      }
      let storeData = {
        type: this.type,
        printSorts: this.printSorts,
        signsChapter: this.signsChapter,
        operator: this.operator
      }
      if (this.initParams.pageType !== 'summaryDec') {
        window.localStorage.setItem('decPrint' + this.initParams.userId, JSON.stringify(storeData))
      }
      let url = ''
      if (type === 'print') { // 直接打印
        url = this.initParams.pageType === 'summaryDec' ? 'API@/dec-common/dec/ts/printTsPdfs' : 'API@/dec-common/dec/common/exportDecPdfs'
        this.directPrintResult(url, copChapter, userChapter, operator1, operator2, operator3)
      } else { // 打印预览
        url = this.initParams.pageType === 'summaryDec' ? 'API@/dec-common/dec/ts/printTsPdf' : 'API@/dec-common/dec/common/exportDecPdf'
        this.previewPrintResult(url, copChapter, userChapter, operator1, operator2, operator3)
      }
    },
    previewPrint () {
      this.printDecOrTs('preview')
    },
    // 打印预览
    previewPrintResult (url, copChapter, userChapter, operator1, operator2, operator3) {
      this.$post({
        url: url,
        data: {
          'decPids': this.pidList, // 主键
          'printSorts': this.printSorts,
          'printType': this.type,
          'copChapter': copChapter,
          'userChapter': userChapter,
          'operator': operator1 + operator2 + operator3
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
    },
    // 判断是否安装了卡控件
    getLocalPrinters () {
      let _this = this
      window.EportClient.getLocalPrinters((msg) => {
        if (msg.Result) {
          console.log(msg.Data)
          _this.printList = []
          for (let i in msg.Data) {
            _this.printList.push({
              label: msg.Data[i],
              value: msg.Data[i]
            })
          }
          _this.printerName = msg.Data[0]
        } else {
          // if (msg.Error) {
          //   var errMsg = msg.Error
          //   if (errMsg.length > 0) {
          //     alert(errMsg[0])
          //   }
          // }
        }
      })
    },
    // 直接打印
    directPrint () {
      let _this = this
      window.EportClient.isInstalled('iKey', (msg) => {
        if (msg.Result) {
          if (_this.printList.length === 0) {
            _this.messageTips('打印机列表列表还未加载', 'error')
            return
          }
          if (!_this.printerName) {
            _this.messageTips('请选择打印机', 'error')
            return
          }
          _this.printDecOrTs('print')
        } else {
          // 测试是否安装了卡控件
          _this.messageTips('未安装单一卡控件,请先安装后,才能直接打印', 'error')
        }
      })
    },
    directPrintResult (url, copChapter, userChapter, operator1, operator2, operator3) {
      for (let i in this.pidList) {
        this.$post({
          url: url,
          data: {
            'decPids': [this.pidList[i]], // 主键单个
            'printSorts': this.printSorts,
            'printType': this.type,
            'copChapter': copChapter,
            'userChapter': userChapter,
            'operator': operator1 + operator2 + operator3
          },
          success: (res) => {
            // 还需要修改
            let printPdf = res.result[0]
            let ranges = ''
            let marginLeft = ''
            let marginTop = ''
            for (let i in res.result) {
              printPdf = res.result[i]
              this.singleDirectPrint(printPdf, this.printerName, ranges, marginLeft, marginTop)
            }
            this.messageTips('已发往打印机,请耐心等待！')
            this.$emit('cancLeData')
          }
        })
      }
    },
    singleDirectPrint (printPdf, printerName, ranges, marginLeft, marginTop) {
      window.EportClient.printPdf(printPdf, printerName, ranges, marginLeft, marginTop, 60000, (msg) => {
        if (msg.Result) {
          let message = msg.Data
          console.log('打印' + message[0])
        } else {
          if (msg.Error) {
            let errMsg = msg.Error
            if (errMsg[0].indexOf('-6') < 0) {
              this.messageTips(errMsg[0], 'error')
            } else {
              this.messageTips('打印服务超时！', 'error')
            }
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
