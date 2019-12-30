<template>
  <!-- 打印通知书 -->
  <section>
    <div class='print-margin'>
      <el-checkbox-group v-model="checkedList">
        <el-row>
          <el-col :span="12">
            <el-checkbox label="retE">不受理通知书</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox label="retJ">通关无纸化审结通知书</el-checkbox>
          </el-col>
        </el-row>
        <el-row class="print-margin-top">
          <el-col :span="12">
            <el-checkbox label="retP">通关无纸化放行通知书</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox label="retC">通关无纸化查验通知书</el-checkbox>
          </el-col>
        </el-row>
        <el-row class="print-margin-top">
          <el-col :span="12">
            <el-checkbox label="retCP">查验/放行通知书</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </div>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class='dialog-primary-btn' @click="configBtn">确定</el-button>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'print-notice',
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
      checkedList: [],
      printList: []
    }
  },
  mounted () {
    this.printList = util.simpleClone(this.initParams.list)
  },
  methods: {
    configBtn () {
      // 判断是否勾选需要打印的通知书
      if (this.checkedList.length === 0) {
        this.messageTips('请选择通知书类型!')
        return
      }
      // 判断是否能打印选择的通知书
      let printNoticeList = [] // 存放能打印的通知书
      let tipsMessage = []
      let retENoArr = [] // 存储无法打印不受理通知书的统一编号
      let retJNoArr = []
      let retPNoArr = []
      let retCNoArr = []
      let retCPNoArr = []
      for (let i in this.printList) { // 所选报关单
        // 当前数据具有的回执信息
        let noticeList = this.printList[i].list
        for (let n in this.checkedList) { // 所选需要打印的通知书
          if (this.checkedList[n] === 'retE') { // 不受理通知书
            // 如果存在不受理通知书
            let posIndex = -1
            posIndex = noticeList.findIndex((v, i) => {
              return v.channel === 'E'
            })
            if (posIndex > -1) { // 则存在不受理通知书
              // 逻辑: 肯能存在多票不受理通知书
              noticeList.forEach((item) => {
                if (item.channel === 'E') {
                  printNoticeList.push({
                    id: item.id, // 回执号
                    type: item.channel // 通知书类型
                  })
                }
              })
            } else { // 不存在不受理通知书
              retENoArr.push(this.printList[i].cusCiqNo)
            }
          } else if (this.checkedList[n] === 'retJ') { // 通关无纸化审结通知书
            // 如果存在通关无纸化审结通知书
            let posIndex = -1
            posIndex = noticeList.findIndex((v, i) => {
              return v.channel === 'J'
            })
            if (posIndex > -1 && this.printList[i].entryType === 'M') { // 则通关无纸化审结通知书并且报关单类型为'M'
              // 逻辑: 可能存在多票通关无纸化审结通知书
              noticeList.forEach((item) => {
                if (item.channel === 'J') {
                  printNoticeList.push({
                    id: item.id, // 回执号
                    type: item.channel // 通知书类型
                  })
                }
              })
            } else { // 不存在不受理通知书
              retJNoArr.push(this.printList[i].cusCiqNo)
            }
          } else if (this.checkedList[n] === 'retP') { // 通关无纸化放行通知书
            // 如果存在通关无纸化放行通知书
            let posIndex = -1
            posIndex = noticeList.findIndex((v, i) => {
              return ['P', 'K', 'R'].includes(v.channel)
            })
            if (posIndex > -1 && this.printList[i].entryType === 'M') { // 则存在通关无纸化放行通知书 并且报关单类型为'M'
              // 逻辑: 可能存在多票通关无纸化放行通知书
              noticeList.forEach((item) => {
                if (['P', 'K', 'R'].includes(item.channel)) {
                  printNoticeList.push({
                    id: item.id, // 回执号
                    type: item.channel // 通知书类型
                  })
                }
              })
            } else { // 不存在通关无纸化放行通知书
              retPNoArr.push(this.printList[i].cusCiqNo)
            }
          } else if (this.checkedList[n] === 'retC') { // 通关无纸化查验通知书
            // 如果存在通关无纸化查验通知书
            let posIndex = -1
            posIndex = noticeList.findIndex((v, i) => {
              return v.channel === 'C'
            })
            if (posIndex > -1 && this.printList[i].entryType === 'M') { // 则存在通关无纸化查验通知书 并且报关单类型为'M'
              // 逻辑: 可能存在多票通关无纸化查验通知书
              noticeList.forEach((item) => {
                if (item.channel === 'C') {
                  printNoticeList.push({
                    id: item.id, // 回执号
                    type: item.channel // 通知书类型
                  })
                }
              })
            } else { // 不存通关无纸化查验通知书
              retCNoArr.push(this.printList[i].cusCiqNo)
            }
          } else if (this.checkedList[n] === 'retCP') { // 查验/放行通知书 需要非 M C P
            // 如果存在查验/放行通知书
            let posIndex = -1
            posIndex = noticeList.findIndex((v, i) => {
              return ['P', 'C', 'R'].includes(v.channel)
            })
            if (posIndex > -1 && this.printList[i].entryType !== 'M') { // 则存在查验/放行通知书 并且报关单类型部位为'M'
              // 逻辑: 可能存在多票查验/放行通知书
              noticeList.forEach((item) => {
                if (['P', 'C', 'R'].includes(item.channel)) {
                  printNoticeList.push({
                    id: item.id, // 回执号
                    type: item.channel // 通知书类型
                  })
                  return false
                }
              })
            } else { // 不存在查验/放行通知书
              retCPNoArr.push(this.printList[i].cusCiqNo)
            }
          }
        }
      }
      if (retENoArr.length > 0) {
        let len = +tipsMessage.length + 1
        tipsMessage.push(len + '. 无法打印不受理通知书:' + retENoArr.join('、'))
      }
      if (retJNoArr.length > 0) {
        let len = +tipsMessage.length + 1
        tipsMessage.push(len + '. 无法打印审结通知书:' + retJNoArr.join('、'))
      }
      if (retPNoArr.length > 0) {
        let len = +tipsMessage.length + 1
        tipsMessage.push(len + '. 无法打印通关无纸化放行通知书:' + retPNoArr.join('、'))
      }
      if (retCNoArr.length > 0) {
        let len = +tipsMessage.length + 1
        tipsMessage.push(len + '. 无法打印通关无纸化查验通知书:' + retCNoArr.join('、'))
      }
      if (retCPNoArr.length > 0) {
        let len = +tipsMessage.length + 1
        tipsMessage.push(len + '. 无法打印查验/放行通知书:' + retCPNoArr.join('、'))
      }
      if (printNoticeList.length === 0) {
        this.$alert(tipsMessage.join('<br>'), '信息', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          callback: action => {
            this.cancleBtn()
          }
        })
        return
      }
      // 通知书去重
      let mapStore = {}
      let param = []
      for (let m in printNoticeList) {
        if (['P', 'C', 'R'].includes(printNoticeList[m].type)) {
          mapStore['R'] = printNoticeList[m].id
        } else {
          mapStore[printNoticeList[m].type] = printNoticeList[m].id
        }
      }
      for (let key in mapStore) {
        param.push({
          type: key,
          id: mapStore[key]
        })
      }
      if (tipsMessage.length > 0) {
        let tips = tipsMessage.join('<br>') + '<br>是否继续打印预览？'
        this.$confirm(tips, '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendPrintInfo(param)
        }).catch(() => {
          this.cancleBtn()
        })
      } else {
        this.sendPrintInfo(param)
      }
    },
    cancleBtn () {
      this.$emit('cancLeData')
    },
    // 发送需要打印的信息
    sendPrintInfo (param) {
      this.$post({
        url: 'API@/dec-common/dec/print/noticePrint',
        data: param,
        success: (res) => {
          this.$emit('backDatas', {})
          if (res.result.length > 0) {
            res.result.forEach((item) => {
              window.open(item, '_blank')
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .print-margin {
    margin: 20px;
    margin-bottom: 0;
  }
  .print-margin-top {
    margin-top: 5px;
  }
</style>
