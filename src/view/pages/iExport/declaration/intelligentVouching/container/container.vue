<template>
  <!-- 表体——集装箱组件 -->
  <section>
    <div class="dec-div">
      <el-row>
        <el-button size="mini" icon="fa fa-sign-in" class="secondButton"  @click='importDecConta' :disabled="controller.isDisabled || controller.isWholeDec">&nbsp;导入</el-button>
        <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDecConta" :disabled="controller.isDisabled || controller.isWholeDec">&nbsp;新增</el-button>
        <el-button size="mini" icon="fa fa-trash-o" class="secondButton" @click="delDecConta" :disabled="controller.isDisabled || controller.isWholeDec">&nbsp;删除</el-button>
        <el-popover
          v-if='isError'
          width="300"
          @show="getTypeToHead('docuAndcertCodeNote')"
          v-model="docuAndcertCodeNote">
          <error-tips v-if="docuAndcertCodeNote" :approvalOpinions="docuAndcertCodeTips" :headClomn ="'docuAndcertCodeNote'"  @close:errorTips='closeErrorTips'></error-tips>
          <el-button size="mini" class="secondButton" slot="reference">随附单证及编号</el-button>
        </el-popover>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-table :data="tableDecContainerlist" :height='200'
            ref="tableDecContainer"
            style="width:100%" size="mini"
            @select="decContaCheckChange"
            @selection-change="decContaChange"
            @row-click= 'backDecContaInfo'>
            <el-table-column type="selection" width="55" ></el-table-column>
            <el-table-column prop="containerNo" label="集装箱号" min-width="80"></el-table-column>
            <el-table-column prop="containerSizeValue" label="集装箱规格" min-width="100"></el-table-column>
            <el-table-column prop="lclFlag" label="拼箱标识" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.lclFlag === '0' ? '否' : scope.row.lclFlag === '1' ? '是' : ''}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div>
        <el-form ref="containerRuleForm" :rules="containerRuleForm"
          @keyup.enter.native="switchFoucsByEnter"
          :model="decContainer"  label-width="100px" size="mini">
          <el-row >
            <el-col :span="24">
              <el-form-item label="集装箱号"  :class="{ 'require-color': controller.requireColor }" prop="containerNo" ref="containerNo">
                <el-input v-model="decContainer.containerNo" :readonly="controller.isDisabled || controller.isWholeDec"
                  @focus="tipsFillMessage('containerNo')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="集装箱规格"  :class="{ 'require-color': controller.requireColor }"  prop="containerSize">
                <el-select placeholder=" " v-model="decContainer.containerSize"
                  @focus="tipsFillMessage('containerSize', 'saasContainerModel','SAAS_CONTAINER_MODEL')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  @clear="clearSelct('saasContainerModel')"
                    ref="containerSize" dataRef ='containerSize'
                  clearable  filterable :disabled="controller.isDisabled" style="width:100%">
                  <el-option
                    v-for="item in saasContainerModel"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="自重(KG)" prop="containerWeight" ref="containerWeight">
                <el-input v-model="decContainer.containerWeight"
                  @focus="tipsFillMessage('containerWeight')"
                  :readonly="controller.isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="拼箱标识">
                <el-select placeholder=" " v-model="decContainer.lclFlag"
                  @focus="tipsFillMessage('lclFlag', 'commomPara2','COMMON_PARA')"
                  filterable remote default-first-option
                  clearable
                  :remote-method="checkParamsList"
                  @clear="clearSelct('commomPara2')"
                  ref="lclFlag" dataRef='lclFlag'
                  :disabled="controller.isDisabled" style="width:100%" >
                  <el-option
                    v-for="item in commomPara2"
                    :key="item.codeField"
                    :showLabel="showCustomsCode? '' : item.nameField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="商品项号关系" :class="{ 'require-color': controller.requireColor }" prop="goodsNo" ref="goodsNo">
                <el-col :span="21">
                  <el-input v-model="decContainer.goodsNo"  :readonly="controller.isDisabled"
                    @focus="tipsFillMessage('goodsNo')"
                    enter = 'no'
                    :maxlength="255"
                    @keyup.enter.native="saveDecConta" ></el-input>
                </el-col>
                <el-col :span="3">
                  <el-button  class="btn-pop" icon="fa fa-ellipsis-h"  @click="openGoodsGNo" ></el-button>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 弹出框 集装箱导入 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="集装箱导入"
      :visible.sync="importCompnentVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      class="sys-dec-class"
      width="640px">
       <execl-import :initParams="initImport" @cancLeData="closeImportCompnent" @backData="receptionImportData"  v-if="importCompnentVisible"></execl-import>
    </el-dialog>
    <!-- 弹出框 集装箱导入 结束 -->
    <!-- —商品项号关系组件  -->
    <goods-gno :goodsGNoVisible.sync="goodsGNoVisible" :goodsNo='decContainer.goodsNo' :isDisabled="controller.isDisabled" @close:goodsGno="backGoodsGNo" :tableList="tableList"></goods-gno>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../common/decUtil'
import goodsGno from './components/goodsGno'
import execlImport from '../../../declaration/component/execImport.vue'
import errorTips from '../components/errorTips'
import decBus from '../common/bus.js'
export default {
  name: 'dec-container',
  components: {
    goodsGno,
    execlImport,
    errorTips
  },
  props: {
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      goodsGNoVisible: false,
      importCompnentVisible: false,
      initImport: {},
      checkList: [],
      decContainer: this.resetContainerForm(), // 集装箱数据
      tableDecContainerlist: [],
      checkedDecContaList: [], // 被选中的 集装箱数据
      containerRuleForm: {
        containerNo: [ // 集装箱号
          {validator: this.checkValid, message: '必填且最大长度为11位', trigger: 'blur'}
        ],
        containerSize: [ // 集装箱规格
          {validator: this.checkValid, message: '集装箱规格不能为空', trigger: 'blur'}
        ],
        containerWeight: [ // 自重
          {validator: this.checkValid, message: '输入整数最大13位，小数最大4位的非负数', trigger: 'blur'}
        ],
        goodsNo: [ // 商品项号关系
          {validator: this.checkValid, message: '商品项号关系不能为空', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        // 集装箱
        'containerNo': '^[0-9a-zA-Z]{1,11}$', // 集装箱号
        'containerSize': '^[0-9a-zA-Z]{1,3}$', // 集装规格
        'containerWeight': '^[1-9]{1}[0-9]{0,12}(\\.\\d{1,4})?$|^$', // 自重
        'goodsNo': '^.{1,255}$' // 商品项号关系
      },
      selectObj: {
        obj: '',
        params: ''
      },
      saasContainerModel: [],
      commomPara2: [],
      containerSelect: { // 集装箱
        'containerSize': {obj: 'saasContainerModel', params: 'SAAS_CONTAINER_MODEL'}, // 集装箱规格
        'lclFlag': {obj: 'commomPara2', params: 'COMMON_PARA'} // 拼箱标识
      },
      isError: false,
      docuAndcertCodeNote: false,
      docuAndcertCodeTips: []
    }
  },
  created () {
    decBus.$on('focusContainerNo', this.focusContainerNo)
    decBus.$on('backContainerList', this.backContainerList)
    decBus.$on('initDocCheck', this.initDocCheck)
  },
  watch: {
    tableDecContainerlist: 'computedConta'
  },
  computed: {
    controller () {
      return this.$store.state[this.moduleName].controller
    },
    tipsNoteShow () {
      return this.$store.state[this.moduleName].tipsNoteShow
    },
    tipsNote () {
      return this.$store.state[this.moduleName].tipsNote
    },
    tableList () {
      return this.$store.state[this.moduleName].tableList
    },
    showCustomsCode () {
      return this.$store.state[this.moduleName].showCustomsCode
    }
  },
  methods: {
    resetContainerForm () {
      return {
        pid: '', // 主键
        decPid: '', // 外键
        containerNo: '', // 集装箱号
        containerSize: '', // 集装箱规格
        containerSizeValue: '', // 集装箱规格名称
        containerWeight: '', // 箱货重量
        goodsNo: '', // 商品项号
        lclFlag: '', // 拼箱标识
        gNo: '', // 序号
        note: '' // note
      }
    },
    // 计算 集装箱数
    computedConta () {
      let list = this.tableDecContainerlist
      let num = 0
      for (let i in list) {
        if (list[i].containerSizeValue.indexOf('L') > 0) {
          num += 2
        } else if (list[i].containerSizeValue.indexOf('S') > 0) {
          num++
        }
      }
      if (num > 0) {
        this.$store.commit(this.moduleName + '/changeShow', {key: 'contaCount', value: num})
      } else {
        this.$store.commit(this.moduleName + '/changeShow', {key: 'contaCount', value: ''})
      }
    },
    checkValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['containerRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        if (name === 'containerNo') {
          let flag = this.verifyContainerNo()
          if (!flag) {
            this.messageTips('集装箱格式不符合ISO6346（1995）标准，请确认')
          }
        }
        callback()
      }
    },
    // 保存 集装箱
    saveDecConta () {
      let e = arguments
      this.$refs['containerRuleForm'].validate((valid) => {
        if (valid === false) {
          return false
        } else {
          // if (!this.verifyContainerNo()) {
          //   this.messageTips('集装箱格式不符合ISO6346（1995）标准，请确认')
          // }
          let gNo = this.decContainer.gNo
          let list = this.saasContainerModel
          // 获取 规格型号名称并赋值
          for (let i in list) {
            if (list[i].codeField === this.decContainer.containerSize) {
              this.decContainer.containerSizeValue = list[i].nameField
            }
          }
          if (util.isEmpty(gNo)) { // 如果gNo 无值  走新增路线
            // 校验 集装箱号是否重复
            for (let n in this.tableDecContainerlist) {
              if (this.tableDecContainerlist[n].containerNo === this.decContainer.containerNo) {
                this.messageTips('集装箱号已存在', 'error')
                return false
              }
            }
            this.decContainer.gNo = this.tableDecContainerlist.length + 1
            this.tableDecContainerlist.push(util.simpleClone(this.decContainer))
          } else { // 如果gNo 有值  走修改路线
            // 1. 确定修改后的数据会不会存在 集装箱号相同
            for (let n in this.tableDecContainerlist) {
              // 不需要跟自身比较
              if (this.tableDecContainerlist[n].gNo === gNo) {
                continue
              }
              if (this.tableDecContainerlist[n].containerNo === this.decContainer.containerNo) {
                this.$message.closeAll()
                this.messageTips('集装箱号已存在', 'error')
                return false
              }
            }
            for (let i in this.tableDecContainerlist) {
              if (this.tableDecContainerlist[i].gNo === gNo) {
                this.tableDecContainerlist[i] = util.simpleClone(this.decContainer)
                // 为了刷新列表的 操作
                this.tableDecContainerlist.push({})
                this.tableDecContainerlist.pop()
                break
              }
            }
          }
          e[0].target.blur()
          e[0].target.form.querySelectorAll('input')[0].focus()
          this.refreshDecConta()
        }
      })
    },
    // 检验集装箱号
    verifyContainerNo () {
      let value = this.decContainer.containerNo.split('')
      let getNumber = new Map()
      let num = 10
      // 生成字母与数字对照表
      for (let i = 0; i < 26; i++) {
        let word = String.fromCharCode((65 + i))
        // 对应码取消了11的倍数，比如11，22，33，所以我们要排除掉
        if (num === 11 || num === 22 || num === 33) {
          num += 1
        }
        getNumber.set(word, num)
        num += 1
      }
      let sum = 0
      // 取四个字母对应的数字，并进行计算
      for (let m = 0; m < 4; m++) {
        sum += getNumber.get(value[m]) * Math.pow(2, m)
      }
      // 对前6个数字进行计算
      for (let n = 4; n < 10; n++) {
        sum += value[n] * Math.pow(2, n)
      }
      // 再对10取余是防止出现校验码为10的情况，假如校验码为10，则取0
      let checkDigit = sum % 11 % 10
      // 判断校验码是否与最后一位数字相等
      if (checkDigit === Number(value[10])) {
        return true
      } else {
        return false
      }
    },
    // 删除 集装箱
    delDecConta () {
      let delData = this.checkedDecContaList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$confirm('确定删除选中数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.tableDecContainerlist) {
              if (delData[index].gNo === this.tableDecContainerlist[item].gNo) {
                this.tableDecContainerlist.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedDecContaList = []
          // 重新排序
          for (let i in this.tableDecContainerlist) {
            this.tableDecContainerlist[i].gNo = parseInt(i) + 1
          }
          // 重新 初始化 form表单
          this.refreshDecConta()
        }).catch(() => {
        })
      }
    },
    // 选中反填集装箱信息
    backDecContaInfo (row) {
      this.$refs.tableDecContainer.toggleRowSelection(row, true)
      this.setValueForDecContaForm(row)
    },
    setValueForDecContaForm (data) {
      this.decContainer = util.simpleClone(data)
      this.initContainerSelect()
    },
    // 清除 集装箱 Form
    refreshDecConta () {
      this.decContainer = this.resetContainerForm()
      this.decContainer.decPid = this.controller.pid
      this.saasContainerModel = []
      this.commomPara2 = []
    },
    // 提供给外面调用
    initContainerSelect () {
      decUtil.initSelect(this, this.containerSelect, this.decContainer)
    },
    // 获取 集装箱 被选中的值
    decContaChange (value) {
      this.checkedDecContaList = value
    },
    // 勾选多选框时的操作
    decContaCheckChange (selection, row) {
      let flag = false
      for (let i in selection) {
        if (selection[i].gNo === row.gNo) {
          flag = true
          break
        }
      }
      if (flag) {
        this.backDecContaInfo(row)
      } else {
        this.$refs.tableDecContainer.toggleRowSelection(row, false)
        this.refreshDecConta()
      }
    },
    // 打开 商品项号关系 弹出框
    openGoodsGNo () {
      this.goodsGNoVisible = true
    },
    backGoodsGNo (param) {
      let list = []
      let checkedGoodsGNo = util.simpleClone(param.checkedGoodsGNo)
      if (checkedGoodsGNo.length > 0) {
        for (let index in checkedGoodsGNo) {
          list.push(checkedGoodsGNo[index].gNo)
        }
        this.decContainer.goodsNo = list.join(',')
      } else {
        this.decContainer.goodsNo = ''
      }
      this.goodsGNoVisible = false
    },
    // 打开表体导入窗口
    importDecConta () {
      let containerNoList = []
      for (let i in this.tableDecContainerlist) {
        containerNoList.push(this.tableDecContainerlist[i].containerNo)
      }
      // 设置初始参数
      this.initImport = {
        containerNoList: containerNoList,
        type: 'CN' // 集装箱
      }
      // 打开导入窗口
      this.importCompnentVisible = true
    },
    // 关闭表体导入窗口
    closeImportCompnent () {
      this.importCompnentVisible = false
    },
    // 接收数据并关闭表体导入窗口
    receptionImportData (resData) {
      if (resData.type === 'CN') { // 集装箱导入回参
        this.backImportContainerData(resData.res)
      }
      this.importCompnentVisible = false
    },
    // 集装箱导入回参
    backImportContainerData (res) {
      if (res.result.length > 0) {
        let list = res.result
        for (let i in list) {
          list[i]['gNo'] = +this.tableDecContainerlist.length + 1
          this.tableDecContainerlist.push(list[i])
        }
        this.messageTips(res.message, 'success')
      } else {
        this.messageTips(res.message)
      }
    },
    // 清除下拉框数据
    clearSelct (selecType) {
      decUtil.clearSelct(this, selecType)
    },
    checkParamsList (query, type = 'select') {
      decUtil.selectSearch(this, query, type)
    },
    focusContainerNo () {
      this.$refs['containerNo'].$children[1].focus()
    },
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
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
          next.focus()
          next.select()
        }
      }
    },
    getContainersDetail (listVo) {
      this.tableDecContainerlist = util.simpleClone(listVo)
    },
    initContainerData () {
      this.decContainer = this.resetContainerForm()
      this.tableDecContainerlist = []
      this.saasContainerModel = [] // 集装箱规格
      this.commomPara2 = [] // 拼箱标识
    },
    clearDecContainerData () {
      this.decContainer.pid = ''
      this.decContainer.decPid = ''
      for (let m in this.tableDecContainerlist) {
        this.tableDecContainerlist[m].pid = ''
        this.tableDecContainerlist[m].decPid = ''
      }
    },
    backContainerList (containerList) {
      for (let i in containerList) {
        let containerVo = this.resetContainerForm()
        containerVo.containerNo = containerList[i].no
        containerVo.gNo = this.tableDecContainerlist.length + 1
        // 校验 集装箱号是否重复
        for (let n in this.tableDecContainerlist) {
          if (this.tableDecContainerlist[n].containerNo === containerVo.containerNo) {
            return false
          }
        }
        this.tableDecContainerlist.push(containerVo)
      }
    },
    initDocCheck (isError, docuAndcertCodeTips) {
      this.isError = isError
      this.docuAndcertCodeTips = docuAndcertCodeTips
    },
    getTypeToHead () {
      if (this.isError) {
        this.docuAndcertCodeNote = true
      }
    },
    closeErrorTips (param) {
      this.docuAndcertCodeNote = false
    }
  }
}
</script>
<style lang="less" scoped>
@import '../common/decCss';
  .dec-div{
    margin-top:5px;
    border: 1px solid #B7B7B7;
    border-bottom: 0;
    background-color: #fff;
  }
</style>
