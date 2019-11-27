<template>
  <section>
    <el-dialog :modal-append-to-body='false'
      title="清单下载"
      :visible.sync="billDownLoadShow"
      :close-on-click-modal='false'
      v-loading="$store.state.loading"
      @open="initBillDownLoad"
      @close="$emit('update:billDownLoadVisible', false)"
      width="400px">
      <el-form label-width="80px" ref='billForm' :model="billForm" :rules="rules" size="mini" label-position="left" @keyup.enter.native="switchFoucsByEnter">
        <el-row>
          <el-col :span="24">
            <el-form-item label="清单来源">
              <el-select v-model="billForm.listOrigin"
                filterable
                @change="originChange">
                <el-option
                  v-for="item in originList"
                  :key="item.codeField"
                  :label="item.nameField"
                  :value="item.codeField"
                  :disabled="item.disabled">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="业务编号" prop='listNo'>
              <el-input v-model="billForm.listNo" @keyup.enter.native="changListNo" maxlength="18" enter="no"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="清单类型">
              <el-select v-model="billForm.declTrnrel" :disabled="isBillTypeDisable"
                filterable>
                <el-option
                  v-for="item in declTrnrelDownloadList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  :disabled="item.disabled">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class='query-btn' align="center">
            <el-button size="mini" type="primary" @click="billDownSubmit" class='dialog-btn'>下载</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import {declTrnrelDownloadList} from '../utils/decJson'
import decUtil from '../../decPage/common/decUtil'
export default {
  data () {
    return {
      billDownLoadShow: false,
      billForm: this.initBillForm(),
      rules: {
        listNo: [
          {required: true, message: '请输入业务编号', trigger: 'blur'}
        ]
      },
      originList: [{codeField: '1', nameField: '清单编号'}, {codeField: '2', nameField: '企业内部编号'}], // 清单来源数据
      declTrnrelDownloadList: declTrnrelDownloadList,
      isBillTypeDisable: false,
      billBossIdDisabled: false
    }
  },
  props: {
    billDownLoadVisible: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Array,
      default: () => []
    },
    sccCode: {
      type: String,
      default: ''
    },
    isConBossId: {
      type: String,
      default: ''
    },
    queryType: {
      type: Boolean,
      default: true
    }
  },
  created () {
  },
  watch: {
    'billDownLoadVisible': function (newData, oldData) {
      if (newData) {
        this.billDownLoadShow = newData
      }
    }
  },
  methods: {
    initBillForm () {
      return {
        listOrigin: '1', // 清单来源
        listNo: '', // 清单号
        emsListNo: '', // 企业内部编号清单编号
        bossId: '', // 接单编号
        corpBusiNo: '', // 客户业务号
        declTrnrel: '' // 清单类型
      }
    },
    clearBillFields () {
      this.billForm.listNo = ''
      this.billForm.emsListNo = ''
      this.billForm.bossId = ''
      this.billForm.corpBusiNo = ''
      this.billForm.declTrnrel = ''
    },
    initBillDownLoad () {
      this.billForm = this.initBillForm()
      this.billBossIdDisabled = false
      this.isBillTypeDisable = false
    },
    // 接单来源变化
    originChange (val) {
      this.clearBillFields()
      this.isBillTypeDisable = false
      this.billBossIdDisabled = false
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
          if (e.target.parentElement.offsetParent.attributes.class.nodeValue.indexOf('el-select') > -1) {
            ref = e.target.parentElement.offsetParent.attributes.dataRef.nodeValue
            // this.$refs[ref].blur()
          } else {
            if (!util.isEmpty(e.target.attributes.dataRef)) {
              ref = e.target.attributes.dataRef.nodeValue
            }
          }
          if (ref === 'tradeCoScc' || ref === 'ownerCodeScc') {
            // 如果是十八位信用代码
            if (ref === 'tradeCoScc') {
              if (this.decHead.tradeCoScc.length !== 18) {
                next.focus()
                next.select()
              } else {
                secondNext.focus()
                secondNext.select()
              }
            } else {
              if (this.decHead.ownerCodeScc.length !== 18) {
                next.focus()
                next.select()
              } else {
                secondNext.focus()
                secondNext.select()
              }
            }
          } else {
            next.focus()
            next.select()
          }
        }
      } else {}
    },
    // 企业内部编号查询清单编号
    getListNo (val, flag) {
      let data = {
        emsListNo: val,
        orgCode: this.userInfo[8],
        scc_code: this.sccCode
      }
      this.$post({
        url: 'API@/dec-common/dec/rest/getListNo',
        data: data,
        success: (res) => {
          if (res.result.length > 0) {
            this.billForm.emsListNo = res.result[0]
            this.isRelevanceBossId(this.billForm.emsListNo, '2', flag)
          } else {
            this.messageTips('查询无数据!', 'error')
          }
        }
      })
    },
    // 清单号 失去焦点的操作
    changListNo () {
      if (this.billForm.listNo.length > 0) {
        if (this.billForm.listOrigin === '2') {
          this.getListNo(this.billForm.listNo, false)
        } else {
          if (this.billForm.listNo.length !== 18) {
            // 自动补齐到18位
            let listNo = this.billForm.listNo
            let flag = true
            while (flag) {
              listNo = '0' + listNo
              if (listNo.length === 18) {
                flag = false
              }
            }
            this.billForm.listNo = listNo
          }
          this.isRelevanceBossId(this.billForm.listNo, '2', false)
        }
      }
    },
    // 查询是否已经关联接单编号
    /**
     * @param {String} type 1.为报关单下载  2.为清单下载
     * @param {String} id 当type为1时 id 为报关单统一编号, 当type 为2 时 id 为小清单号
     */
    isRelevanceBossId (id, type, flag) {
      let param = {}
      if (type === '1') {
        param['seqNo'] = id
      } else {
        param['listNo'] = id
      }
      this.$post({
        url: 'API@/dec-common/dec/common/isRelToBoss',
        data: param,
        success: (res) => {
          if (res && res.result && res.result.declTrnrel) {
            this.billForm.declTrnrel = res.result.declTrnrel
            this.isBillTypeDisable = true
            if (flag) {
              this.billDownLoad()
            }
          } else {
            if (flag) {
              this.billDownLoad()
            } else {
              this.isBillTypeDisable = false
              this.billForm.declTrnrel = ''
            }
          }
        }
      })
    },
    // 清单下载时遇到不同的字段是否需要覆盖
    coverLocalBill (decVo) {
      this.$post({
        url: 'API@/dec-common/dec/common/getAndSaveDec',
        data: decVo,
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.billBossIdDisabled = false
          this.$emit('update:billDownLoadVisible', false)
          // 查询刚下载的清单
          this.$emit('backQueryForm', {
            QueryDecForm: {
              declTrnrel: '0,2', // 报关单类型
              etpsCategory: 'D', // 企业类别
              entryId: '', // 报关单号
              seqNo: res.result.cusCiqNo ? res.result.cusCiqNo : res.result.seqNo, // 统一编号
              // bossNo: res.result.bossNo ? res.result.bossNo : this.billForm.bossId,
              corpBusiNo: res.result.corpBusiNo ? res.result.corpBusiNo : this.billForm.corpBusiNo,
              bossId: res.result.bossNo ? res.result.bossNo : this.billForm.bossId, // 接单编号
              tradeCode: '', // 境内收发货人
              billNo: '', // 提运单号
              customMaster: '', // 申报地海关
              status: '', // 状态包括报关单状态和审核状态
              clientSeqno: '', // 客户业务号
              createUser: '', // 创建人
              updateTimeStart: '', // 最近开始操作时间
              updateTimeEnd: '', // 最近终止操作时间
              iEFlag: res.result.iEFlag // 进出口标志
            },
            isDisabled: false
          })
          this.$emit('update:queryType', false)
          this.$parent.pageList()
          this.clearBillFields()
        }
      })
    },
    commonFunction (res) {
      if (res.result.code === '0000') {
        this.messageTips(res.message, 'success')
        this.billBossIdDisabled = false
        this.$emit('update:billDownLoadVisible', false)
        // 查询刚下载的清单
        this.$emit('backQueryForm', {
          QueryDecForm: {
            declTrnrel: '0,2', // 报关单类型
            etpsCategory: 'D', // 企业类别
            entryId: '', // 报关单号
            seqNo: res.result.cusCiqNo ? res.result.cusCiqNo : res.result.seqNo, // 统一编号
            // bossNo: res.result.bossNo ? res.result.bossNo : this.billForm.bossId,
            corpBusiNo: res.result.corpBusiNo ? res.result.corpBusiNo : this.billForm.corpBusiNo,
            bossId: res.result.bossNo ? res.result.bossNo : this.billForm.bossId, // 接单编号
            tradeCode: '', // 境内收发货人
            billNo: '', // 提运单号
            customMaster: '', // 申报地海关
            status: '', // 状态包括报关单状态和审核状态
            clientSeqno: '', // 客户业务号
            createUser: '', // 创建人
            updateTimeStart: '', // 最近开始操作时间
            updateTimeEnd: '', // 最近终止操作时间
            iEFlag: res.result.iEFlag // 进出口标志
          },
          isDisabled: false
        })
        this.$parent.pageList()
        this.clearBillFields()
        this.isBillTypeDisable = false
      }
      if (res.result.code === '1004') {
        let portData = res.result
        let downParams = {}
        downParams['seqNo'] = portData.seqNo // 统一编号
        downParams['bossId'] = portData.bossId ? portData.bossId : this.billForm.bossId // 接单编号
        downParams['corpBusiNo'] = portData.corpBusiNo ? portData.corpBusiNo : this.billForm.corpBusiNo // 客户业务号
        downParams['cusCiqNo'] = portData.cusCiqNo // 关检查关联号
        downParams['iEFlag'] = portData.iEFlag // 进出口标识
        downParams['signData'] = portData.signData // 标注数据
        downParams['extField'] = portData.extField // 额外标识
        downParams['status'] = portData.status // 状态
        downParams['sccCode'] = this.sccCode // 社会信用代码
        downParams['certNo'] = this.userInfo[0] // 证书号
        downParams['icCode'] = this.userInfo[5] // 卡号
        downParams['password'] = window.localStorage.getItem(this.userId) // 卡密码
        this.downLoad(downParams)
      }
    },
    billDownSubmit () {
      this.$refs['billForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.billForm.listOrigin === '2') {
          this.getListNo(this.billForm.listNo, true)
        } else {
          this.isRelevanceBossId(this.billForm.listNo, '2', true)
        }
      })
    },
    billDownLoad () {
      if (this.isConBossId === 'Y' && util.isEmpty(this.billForm.bossId) && util.isEmpty(this.billForm.corpBusiNo)) {
        this.messageTips('接单编号和客户业务号必填其一')
        return
      }
      if (this.billForm.listOrigin === '1') {
        if (this.billForm.listNo.length !== 18) {
          // 自动补齐到18位
          let listNo = this.billForm.listNo
          let flag = true
          while (flag) {
            listNo = '0' + listNo
            if (listNo.length === 18) {
              flag = false
            }
          }
          this.billForm.listNo = listNo
        }
      }
      // 取当
      let postData = {
        'sccCode': this.sccCode
      }
      postData['listNo'] = this.billForm.listOrigin === '2' ? this.billForm.emsListNo : this.billForm.listNo // 清单号
      postData['bossId'] = this.billForm.bossId // 接单编号
      postData['corpBusiNo'] = this.billForm.corpBusiNo // 客户业务号
      postData['orgCode'] = this.userInfo[8]
      postData['needUpdate'] = false
      postData['declTrnrel'] = this.billForm.declTrnrel
      this.$post({
        url: 'API@/dec-common/dec/common/getDecData',
        data: postData,
        success: (res) => {
          if (res.result.code === 'EXIST') { // 如果库里面有这条信息的参数
            this.$confirm('此数据在本系统存在，是否覆盖？', '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning'
            }).then(() => {
              postData['needUpdate'] = true
              this.$post({
                url: 'API@/dec-common/dec/common/getDecData',
                data: postData,
                success: (res) => {
                  this.commonFunction(res)
                }
              })
            }).catch(() => {
              this.clearBillFields()
              this.isBillTypeDisable = false
              this.billBossIdDisabled = false
              this.$emit('update:billDownLoadVisible', false)
            })
          } else if (res.result.code === 'UPDATE') { //
            this.$confirm(res.result.message, '提示', {
              modalAppendToBody: true,
              domMount: this.$el.parentNode,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning'
            }).then(() => {
              this.coverLocalBill(res.result.decVO)
            }).catch(() => {
              this.clearBillFields()
              this.billBossIdDisabled = false
              this.$emit('update:billDownLoadVisible', false)
              this.isBillTypeDisable = false
            })
          } else {
            this.commonFunction(res)
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 下载
    downLoad (param) {
      window.EportClient.signData(param.password, param.seqNo + '||', (msg) => {
        if (msg.Result) {
          param['signData'] = msg.Data[0]
          window.EportClient.spcClearEnv(function (msg) {})
          delete param.password
          this.$post({
            url: 'API@/dec-common/dec/common/decDown',
            data: param,
            success: (res) => {
              this.messageTips(res.message, 'success')
              this.clearBillFields()
              this.billBossIdDisabled = false
              this.$emit('update:billDownLoadVisible', false)
              // 查询刚下载的清单
              this.$emit('backQueryForm', {
                QueryDecForm: {
                  declTrnrel: '0,2', // 报关单类型
                  etpsCategory: 'D', // 企业类别
                  entryId: '', // 报关单号
                  seqNo: res.result.data.cusCiqNo ? res.result.data.cusCiqNo : res.result.data.seqNo, // 统一编号
                  bossId: '', // 接单编号
                  tradeCode: '', // 境内收发货人
                  billNo: '', // 提运单号
                  customMaster: '', // 申报地海关
                  status: '', // 是否结关
                  clientSeqno: '', // 客户业务号
                  createUser: '', // 创建人
                  corpBusiNo: '', //  客户端统一编号
                  updateTimeStart: '', // 最近开始操作时间
                  updateTimeEnd: '', // 最近终止操作时间
                  iEFlag: res.result.data.iEFlag // 进出口标志
                },
                isDisabled: false
              })
              this.$parent.pageList()
              this.messageTips(msg.Error[0], 'success')
            },
            other: () => {
              this.messageTips(msg.Error[0], 'error')
            }
          })
        } else {
          this.messageTips(msg.error.join(','), 'error')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-btn{
  background-color: #287fca;
  border-color: #287fca;
}
</style>
