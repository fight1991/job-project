<template>
  <!-- 随附单证——原产地对应关系证组件 -->
  <section>
    <!-- 弹出框 原产地对应关系录入 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="原产地对应关系录入"
      :visible.sync="originRelVisible"
      :before-close='closeCompnent'
      @opened='openOriginReled'
      v-dialogDrag
      width="640px">
      <div class='border'>
        <el-form label-width="150px" ref="originRelRuleForm"
        @keyup.enter.native="switchFoucsByEnter"
        :rules="originRelRuleForm" size="mini" label-position="right" :model="originRelForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="报关单商品序号" prop="decGno">
                <el-input v-model="originRelForm.decGno" ref='decGno' :maxlength="2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对应随附单证商品项号" prop="ecoGno" >
                <el-input v-model="originRelForm.ecoGno" :maxlength="3" @keyup.enter.native="saveOriginRel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-row>
          <el-button icon="fa fa-plus" @click="addOriginRel" class='secondButton' :disabled="isDisabled">新增</el-button>
          <el-button icon="fa fa-trash-o" @click="delOriginRel" class='secondButton' :disabled="isDisabled">删除</el-button>
        </el-row>
      </div>
      <el-table
        ref="riginRelTable"
        :data="decEcoRealations"
        highlight-current-row border
        size='mini'
        @selection-change="originRelChange"
        max-height="300" style="width: 100%">
        <el-table-column label="选中" min-width="50" type="selection">
        </el-table-column>
        <el-table-column  property="decGno" label="报关单商品序号" min-width="100"></el-table-column>
        <el-table-column  property="ecoGno" label="对应随附单证商品项号" min-width="100"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 弹出框 原产地对应关系录入 结束 -->
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../common/decUtil'
export default {
  name: 'origin-certificate',
  props: {
    originRelVisible: {
      type: Boolean,
      default: false
    },
    decLicense: {
      type: Object,
      require: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    tableLength: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      originRelForm: { // 原产地对应关系 form表单
        pid: '',
        decPid: '',
        licenseGno: '', // 随附单证序号
        cusCiqNo: '',
        decGno: '', // 商品序号
        ecoGno: '', // 原产地证书单证项号
        certType: '', // 随附单证代码
        ecoCertno: '' // 随附单证号
      },
      decEcoRealations: [], //
      checkedOriginRelList: [], // 原产地对应关系 被选中数据表
      originRelRuleForm: {
        decGno: [ // 报关单商品序号
          {validator: this.checkValid, message: '请输入正确报关单商品序号', trigger: 'blur'}
        ],
        ecoGno: [ // 对应随附单证商品项号
          {validator: this.checkValid, message: '请输入对应随附单证商品项号', trigger: 'blur'}
        ]
      },
      ruleRegx: {
        // 原产地证
        'decGno': '^\\d{1,2}$', // 报关单商品序号
        'ecoGno': '^.{1,3}$' // 对应随附单证商品项号
      }
    }
  },
  methods: {
    // 原产地对应关系 打开后操作
    openOriginReled () {
      this.decEcoRealations = util.simpleClone(this.decLicense.decEcoRealations)
      this.$nextTick(_ => {
        this.$refs['decGno'].focus()
      })
    },
    checkValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      let reg = new RegExp(this.ruleRegx[name])
      if (!reg.test(value)) {
        setTimeout(() => {
          this.$refs['originRelRuleForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 原产地对应关系 清空数据
    addOriginRel () {
      this.originRelForm = {
        pid: '',
        decPid: '',
        licenseGno: '', // 随附单证序号
        cusCiqNo: '',
        decGno: '', // 商品序号
        ecoGno: '', // 原产地证书单证项号
        certType: '', // 随附单证代码
        ecoCertno: '' // 随附单证号
      }
    },
    // 原产地对应关系 保存数据
    saveOriginRel () {
      if (this.isDisabled) {
        return false
      }
      this.$refs['originRelRuleForm'].validate((valid) => {
        if (valid === true) {
          if (parseInt(this.originRelForm.decGno) > this.tableLength) {
            this.messageTips('输入的商品序号不在范围内', 'error')
            this.$refs['decGno'].focus()
            this.$refs['decGno'].select()
            return false
          }
          for (let i in this.decEcoRealations) {
            if (this.decEcoRealations[i].decGno === this.originRelForm.decGno) {
              this.messageTips('报关单商品序列号不能重复', 'error')
              this.$refs['decGno'].focus()
              this.$refs['decGno'].select()
              return false
            }
          }
          if (util.isEmpty(this.originRelForm.licenseGno)) {
            // 新增
            this.originRelForm.licenseGno = this.decEcoRealations.length + 1
            // 处理针对有<19>C010190015276这种情况
            let no = this.decLicense.certCode.split('>')
            if (no.length === 2) {
              this.originRelForm.certType = this.decLicense.docuCode + no[0].replace('<', '')
              this.originRelForm.ecoCertno = no[1]
            } else {
              this.originRelForm.certType = this.decLicense.docuCode
              this.originRelForm.ecoCertno = this.decLicense.certCode
            }
            this.decEcoRealations.push(util.simpleClone(this.originRelForm))
          } else {
            // 修改
            let index = parseInt(this.originRelForm.licenseGno) - 1
            // 处理针对有<19>C010190015276这种情况
            let no = this.decLicense.certCode.split('>')
            if (no.length === 2) {
              this.originRelForm.certType = this.decLicense.docuCode + no[0].replace('<', '')
              this.originRelForm.ecoCertno = no[1]
            } else {
              this.originRelForm.certType = this.decLicense.docuCode
              this.originRelForm.ecoCertno = this.decLicense.certCode
            }
            this.decEcoRealations[index] = util.simpleClone(this.originRelForm)
            // 为了刷新列表的 操作
            this.decEcoRealations.push({})
            this.decEcoRealations.pop()
          }
          this.addOriginRel()
          this.$refs['decGno'].focus()
        }
      })
    },
    // 关闭原产地对应关系时 的回调函数
    closeCompnent () {
      this.addOriginRel()
      this.$emit('close:originCertificate', {decEcoRealations: this.decEcoRealations})
    },
    // 原产地对应关系 删除数据
    delOriginRel () {
      let delData = this.checkedOriginRelList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.decEcoRealations) {
              if (delData[index].licenseGno === this.decEcoRealations[item].licenseGno) {
                this.decEcoRealations.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedOriginRelList = []
          // 重新排序
          for (let i in this.decEcoRealations) {
            this.decEcoRealations[i].licenseGno = parseInt(i) + 1
          }
          // 重新 初始化 form表单
          this.addOriginRel()
        }).catch(() => {
        })
      }
    },
    // 原产地对应关系 获取被选择的数据
    originRelChange (value) {
      this.checkedOriginRelList = value
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
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../common/decCss';
</style>
