<template>
  <section>
    <!-- <div class="dec-div"> -->
      <el-form ref="containerRuleForm" :rules="containerRuleForm" @keyup.enter.native="switchFoucsByEnter" :model="decContainer" label-width="100px" size="mini">
        <el-row>
          <el-col :span="24" style="display:none;"><el-input></el-input></el-col>
          <el-col :span="24">
            <el-form-item label="集装箱号"  :class="{ 'require-color': controller.requireColor }" prop="containerNo" ref="containerNo">
              <el-input v-model="decContainer.containerNo" :readonly="controller.isDisabled" @focus="tipsFillMessage('containerNo')" @keyup.enter.native="saveDecConta('1')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isDocOrCheck">
          <el-col :span="24">
            <el-form-item label="商品项号关系" :class="{ 'require-color': controller.requireColor }" prop="goodsNo" ref="goodsNo">
              <el-col :span="21">
                <el-input v-model="decContainer.goodsNo" :readonly="controller.isDisabled"
                  @focus="tipsFillMessage('goodsNo')"
                  enter='no'
                  :maxlength="255"
                  @keyup.enter.native="saveDecConta('2')"></el-input>
              </el-col>
              <el-col :span="3">
                <el-button  class="btn-pop" icon="fa fa-ellipsis-h"  @click="openGoodsGNo"></el-button>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    <!-- </div> -->
    <!-- —商品项号关系组件  -->
    <goods-gno :goodsGNoVisible.sync="goodsGNoVisible" :goodsNo='decContainer.goodsNo' declareType="summaryType" :isDisabled="controller.isDisabled" @close:goodsGno="backGoodsGNo" :tableList="tableList" :moduleName="moduleName"></goods-gno>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../decPage/common/decUtil'
import goodsGno from '../../decPage/container/components/goodsGno'
// import { mapState } from 'vuex'
export default {
  components: {
    goodsGno
  },
  props: {
    tableDecContainerlist: {
      type: Array,
      default: () => ([])
    },
    checkedList: {
      type: Array,
      default: () => ([])
    },
    moduleName: {
      type: String
    }
  },
  data () {
    return {
      goodsGNoVisible: false,
      // tableDecContainerlist: this.containerList, // 传来的集装箱数据
      containerCheckedList: this.checkedList,
      decContainer: this.resetContainerForm(), // 集装箱数据
      containerRuleForm: {
        containerNo: [ // 集装箱号
          {validator: this.checkValid, message: '必填且最大长度为11位', trigger: 'blur'}
        ],
        goodsNo: [ // 商品项号关系
          {validator: this.checkValid, message: '商品项号关系不能为空', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        'containerNo': '^[0-9a-zA-Z]{1,11}$', // 集装箱号
        'goodsNo': '^.{1,255}$' // 商品项号关系
      },
      isDocOrCheck: false // 是否涉证，涉检
    }
  },
  mounted () {
  },
  watch: {
    declareType (newVal, oldVal) {
      if (newVal.indexOf(1) !== -1 || newVal.indexOf(2) !== -1) {
        this.isDocOrCheck = true
      } else {
        this.isDocOrCheck = false
      }
    },
    checkedList (newVal, oldVal) {
      if (newVal.length !== 0) {
        this.decContainer = util.simpleClone(newVal[newVal.length - 1])
      }
    }
  },
  computed: {
    tipsMessage () {
      return this.$store.state[this.moduleName].tipsMessage
    },
    controller () {
      return this.$store.state[this.moduleName].controller
    },
    tipsNoteShow () {
      return this.$store.state[this.moduleName].tipsNoteShow
    },
    tipsNote () {
      return this.$store.state[this.moduleName].tipsNote
    },
    declareType () {
      return this.$store.state[this.moduleName].declareType
    },
    tableList () {
      return this.$store.state[this.moduleName].tableList
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
    // 用于表格点击新增
    refreshDecConta (flag) {
      this.decContainer = this.resetContainerForm()
      this.decContainer.decPid = this.controller.pid
      if (flag) {
        this.$refs.containerNo.$children[1].focus()
      }
    },
    // 初始化
    initContainerData () {
      this.decContainer = this.resetContainerForm()
    },
    // 用于复制报关单时调用
    clearDecContainerData () {
      this.decContainer.pid = ''
      this.decContainer.decPid = ''
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
        callback()
      }
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
    // 提示需要填写的内容
    tipsFillMessage (value, obj, params) {
      decUtil.tipsMessageF(this, value, obj, params, this.moduleName)
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
    // 保存 集装箱
    saveDecConta (value) {
      // let e = arguments
      if ((value === '1' && !this.isDocOrCheck) || value === '2') {
        this.$refs['containerRuleForm'].validate((valid) => {
          if (valid === false) {
            return false
          } else {
            if (!this.verifyContainerNo()) {
              this.messageTips('集装箱格式不符合ISO6346（1995）标准，请确认')
            }
            let gNo = this.decContainer.gNo
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
              // this.$emit('backContainerData', this.tableDecContainerlist)
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
              // this.$emit('backContainerData', this.tableDecContainerlist)
            }
            // e[0].target.blur()
            // e[0].target.form.querySelectorAll('input')[0].focus()
            this.refreshDecConta(true)
          }
        })
      }
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
    }
  }
}
</script>
