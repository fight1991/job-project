<template>
<!-- 删改单登记-->
  <section class='query-main'>
    <!-- 查询条件 -->
    <div class = "query-condition">
      <!-- -->
      <el-form :label-width="labelFormWidth.six" :model="queryCondtion" size="mini" label-position="right" >
        <el-row :gutter="20">
          <el-col :span="8">
              <el-form-item label="异常类型">
                <el-select placeholder="" v-model="queryCondtion.reviseType"
                  filterable clearable style="width:100%">
                  <el-option
                    v-for="item in reviseTypeList"
                    :key="item.codeField"
                    :label="item.codeField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          <el-col :span="8">
             <el-form-item label="报关单号" prop='entryId' >
                <el-input v-model="queryCondtion.entryId" maxlength='18' clearable></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="境内收发货人">
              <el-input v-model="queryCondtion.tradeName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="发生日期">
              <el-date-picker v-model="dates" style="width:100%"
                type="daterange"
                clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class='query-btn'>
            <el-button size="mini" type="primary" @click="queryListByCondition" style="padding: 8px 20px;">查询</el-button>
            <el-button size="mini" @click="resetqueryCondtion" style="padding: 8px 20px;">重置</el-button>
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table dec-query-table'>
      <!-- 操作 -->
       <el-row class="op-btn">
        <el-button size="mini" class="list-btns list-icon-add" @click="openAddPage"><i></i>新增</el-button>
        <el-button size="mini" class="list-btns list-icon-delete" @click="deleteInfo"><i></i>删除</el-button>
      </el-row>
      <!-- 列表 list -->
      <el-table class='sys-table-table dec-table' :data="tableList"
         @selection-change="tableListChange"
         border highlight-current-row size="mini"  height="400">
        <el-table-column type="selection"  align='center' width="30"></el-table-column>
        <el-table-column label="报关单号" align='center' prop="entryId" min-width="120"></el-table-column>
        <el-table-column label="境内收发货人" align='left' prop="tradeName" min-width="150"></el-table-column>
        <el-table-column label="异常类型" align='center' prop="reviseType" min-width="100"></el-table-column>
        <el-table-column label="处理状态" align='center' prop="processStatusValue" min-width="100"></el-table-column>
        <el-table-column label="发生日期"  align='center' prop="reviseDate" min-width="100"></el-table-column>
        <el-table-column label="责任岗位" align='left'  prop="position" min-width="150"></el-table-column>
        <el-table-column label="责任人" align='left' prop="postPerson" min-width="60"></el-table-column>
        <el-table-column label="异常原因"  align='left' prop="reviseReason" min-width="200"></el-table-column>
        <el-table-column label="操作" fixed="right"  align='center'  width="70" >
          <template slot-scope="scope">
            <a href="javascript:void(0)" class="list-icon-edit border-0" title="编辑" @click="editDetail(scope.row)"><i class='dec-i'></i></a>
            <a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click.stop="lookupDetail(scope.row)"><i class='dec-i'></i></a>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination.sync='paginationInit' @change="pageList()"></page-box>
        </el-col>
      </el-row>
    </div>
    <el-dialog :modal-append-to-body='false'
      title="异常登记"
      :visible.sync="decRegisterVisible"
      :before-close='beforeClose'
      :close-on-click-modal="false"
      width="900px"
      class="register-dialog">
      <el-form :label-width="labelFormWidth.six" size="mini" :rules="rules" @keyup.enter.native="switchFoucsByEnter"
       :label-position="position" :model="decRegisterForm" ref='decRegisterForm'>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="报关单号" prop='entryId' ref='entryId'>
                <el-input v-model="decRegisterForm.entryId" maxlength='18' enter='no' @input='checkEntryId'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="境内收发货人" prop='tradeName' >
                <el-input v-model="decRegisterForm.tradeName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="异常类型" prop='reviseType'>
                <el-select placeholder="" v-model="decRegisterForm.reviseType"
                  filterable clearable dataRef ='reviseType'
                  ref='reviseType'
                  style="width:100%" :disabled="isDisabled">
                  <el-option
                    v-for="item in reviseTypeList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="发生日期" prop='reviseDate'>
                <el-date-picker
                  v-model="decRegisterForm.reviseDate"
                  type="date"
                  :editable='false'
                  :disabled="isDisabled"
                  style="width:100%"
                  placeholder=" "
                  format='yyyy-MM-dd'
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
             <el-col :span="8">
              <el-form-item label="责任岗位" prop='position'>
                <el-select placeholder="" v-model="decRegisterForm.position"
                  filterable clearable dataRef ='position'
                  style="width:100%" :disabled="isDisabled">
                  <el-option
                    v-for="item in positionList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="8">
              <el-form-item label="责任人" prop='postPerson'>
                <el-select placeholder="" v-model="decRegisterForm.postPerson"
                  filterable clearable dataRef ='postPerson'
                  style="width:100%" :disabled="isDisabled">
                  <el-option
                    v-for="item in postPersonList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.nameField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="海关是否处罚" prop='isPunish'>
                <el-select placeholder="" v-model="decRegisterForm.isPunish"
                  filterable clearable dataRef ='isPunish'
                  style="width:100%" :disabled="isDisabled">
                  <el-option
                    v-for="item in isPunishList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处罚对象" prop='markedMan'>
                <el-select placeholder="" v-model="decRegisterForm.markedMan"
                  filterable clearable dataRef ='markedMan'
                  style="width:100%" :disabled="isDisabled">
                  <el-option
                    v-for="item in markedManList"
                    :key="item.codeField"
                    :label="item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="完成日期">
                <el-date-picker
                  v-model="decRegisterForm.completionTime"
                  type="date"
                  :editable='false'
                  :disabled="isDisabled"
                  style="width:100%"
                  placeholder=" "
                  format='yyyy-MM-dd'
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="处理状态" >
                <el-select placeholder="" v-model="decRegisterForm.processStatus"
                   clearable style="width:93%"
                   :disabled="isDisabled">
                 <el-option
                    label="处理中"
                    :value="'1'">
                  </el-option>
                  <el-option
                    label="已解决"
                    :value="'2'">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="异常原因" prop='reviseReason'>
                <el-input type="textarea" maxlength="500" v-model="decRegisterForm.reviseReason"
                 @keyup.enter.native="saveDecRegister" :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDecRegister" :disabled="isDisabled">确定</el-button>
        <el-button @click="cancleDecRegister">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import pickerOptions from '@/common/mixin/pickerOptions'
export default {
  name: 'dec-register',
  mixins: [pickerOptions],
  data () {
    return {
      queryCondtion: {
        reviseType: '', // 删改单类型
        entryId: '', // 报关单号
        tradeName: '', // 境内收发货人
        startDate: '', // 开始日期
        endDate: '' // 结束日期
      },
      position: 'right',
      dates: '', // 日期
      isDisabled: false,
      tableList: [], // table表加载数据
      reviseTypeList: [
        {
          codeField: '删单',
          nameField: '删单'
        }, {
          codeField: '改单',
          nameField: '改单'
        }, {
          codeField: '查验',
          nameField: '查验'
        }], // 删改单参数
      positionList: [
        {
          codeField: '接单',
          nameField: '接单'
        }, {
          codeField: '录单',
          nameField: '录单'
        }, {
          codeField: '审单',
          nameField: '审单'
        }], // 责任岗位
      postPersonList: [], // 责任人
      isPunishList: [
        {
          codeField: '是',
          nameField: '是'
        }, {
          codeField: '否',
          nameField: '否'
        }], // 海关是否处罚
      markedManList: [
        {
          codeField: '境内收发货人',
          nameField: '境内收发货人'
        }, {
          codeField: '申报单位',
          nameField: '申报单位'
        }, {
          codeField: '生产销售/消费使用单位',
          nameField: '生产销售/消费使用单位'
        }], // 处罚对象
      checkedData: [], // 选中得数据
      decRegisterVisible: false, // 控制新增编辑时的弹出框
      decRegisterForm: {
        decPid: '', // 报关单主键
        entryId: '', // 报关单号
        isPunish: '', // 海关是否处罚
        markedMan: '', // 处罚对象
        pid: '', // 主键
        position: '', // 责任岗位
        postPerson: '', // 责任人
        reviseDate: '', // 删改单时间
        reviseReason: '', // 删改单原因
        reviseType: '', // 删改单类型
        completionTime: '', // 完成日期
        processStatus: '', // 处理状态
        tradeName: '' // 境内收发货人
      },
      rules: {
        entryId: [
          { required: true, message: '请输入18位报关单号', trigger: 'blur' },
          {validator: this.checkFormValid, message: '请输入18位报关单号', trigger: 'blur'}
        ],
        reviseType: [
          { required: true, message: '请选择删改单类型', trigger: 'change' }
        ],
        reviseDate: [
          { required: true, message: '请选择删改单日期', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取当前企业的报关单号
    // this.getEntryIdList()
    // 获取当前企业下的人员
    this.getUserUnderCrop()
    // 初始化 默认日期
    this.setDefualtDate()
    if (!util.isEmpty(this.$route.query.type) && this.$route.query.type === 'redirect') {
      this.queryCondtion.entryId = JSON.parse(window.localStorage.getItem('decRegisterHistory')).entryId
    }
    // 初始化列表数据
    this.queryListByCondition()
  },
  mounted () {
    if (!util.isEmpty(this.$route.query.type) && this.$route.query.type === 'redirect') {
      this.lookupDetail(JSON.parse(window.localStorage.getItem('decRegisterHistory')))
    }
  },
  methods: {
    resetqueryCondtion  () {
      this.queryCondtion = {
        reviseType: '', // 删改单类型
        entryId: '', // 报关单号
        tradeName: '', // 境内收发货人
        startDate: '', // 开始日期
        endDate: '' // 结束日期
      }
      this.dates = []
    },
    // 校验报关单号
    checkFormValid (rule, value, callback) {
      if (util.isEmpty(value)) {
        value = ''
      }
      let name = rule.field
      // let reg = new RegExp(this.ruleRegx[name])
      if (!/^[a-zA-Z0-9]{18}$/.test(value)) {
        setTimeout(() => {
          this.$refs['decRegisterForm'].clearValidate([name])
        }, 2000)
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 企业本企业下的人员
    getUserUnderCrop () {
      this.$post({
        url: 'API@/login/corp/getCorpUsers',
        data: {},
        success: (res) => {
          if (res.code === '0000') {
            for (let i in res.result) {
              this.postPersonList.push({
                codeField: res.result[i].userId,
                nameField: res.result[i].userName
              })
            }
          }
        }
      })
    },
    // 校验报关单是否正确
    checkEntryId () {
      if (this.decRegisterForm.entryId.length !== 18) {
        return
      }
      this.$post({
        url: 'API@/dec-common/dec/revise/checkEntryId',
        data: this.decRegisterForm.entryId,
        success: (res) => {
          if (util.isEmpty(res.result.decPid)) {
            this.decRegisterForm.entryId = ''
            this.$refs['entryId'].$children[1].focus()
            this.messageTips('报关单号不存在', 'error')
          } else {
            this.decRegisterForm.decPid = res.result.decPid
            this.decRegisterForm.tradeName = res.result.tradeName
            this.$refs['reviseType'].focus()
          }
        },
        other: (res) => {
          this.decRegisterForm.entryId = ''
          this.$refs['entryId'].$children[1].focus()
          this.messageTips('报关单号不存在', 'error')
        }
      })
    },
    // 打开新增页面
    openAddPage () {
      this.isDisabled = false
      this.decRegisterVisible = true
      // 设置新增默认值
      this.decRegisterForm.reviseDate = util.dateFormat(new Date(), 'yyyy-MM-dd')
      this.decRegisterForm.reviseType = '改单'
    },
    // 点击关闭按钮 清除数据
    beforeClose () {
      if (!util.isEmpty(this.$route.query.type) && this.$route.query.type === 'redirect') {
        this.$store.dispatch('CloseTab', this.$route.params.setId)
        return
      }
      this.clearDecRegisterForm()
    },
    // 清除并关闭录入框
    clearDecRegisterForm () {
      // 移除校验结果
      this.$refs['decRegisterForm'].clearValidate()
      //  重置字段
      this.decRegisterForm = {
        decPid: '', // 报关单主键
        entryId: '', // 报关单号
        isPunish: '', // 海关是否处罚
        markedMan: '', // 处罚对象
        pid: '', // 主键
        position: '', // 责任岗位
        postPerson: '', // 责任人
        reviseDate: '', // 删改单时间
        reviseReason: '', // 删改单原因
        reviseType: '', // 删改单类型
        tradeName: '', // 境内收发货人
        completionTime: '', // 完成日期
        processStatus: '' // 处理状态
      }
      this.decRegisterVisible = false
    },
    // 打开编辑页面
    editDetail (row) {
      this.decRegisterForm = util.simpleClone(row)
      this.isDisabled = false
      this.decRegisterVisible = true
    },
    // 设置默认的查询日期
    setDefualtDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.dates = [util.dateFormat(start, 'yyyy-MM-dd'), util.dateFormat(end, 'yyyy-MM-dd')]
    },
    // 查看数据
    lookupDetail (row) {
      this.decRegisterForm = util.simpleClone(row)
      this.isDisabled = true
      this.decRegisterVisible = true
    },
    // 删除 操作
    deleteInfo () {
      if (this.checkedData.length === 0) {
        this.messageTips('请选择需要删除的数据！', 'error')
        return false
      }
      let pidList = []
      for (let i in this.checkedData) {
        pidList.push(this.checkedData[i].pid)
      }
      this.$post({
        url: 'API@/dec-common/dec/revise/delDecRevises',
        data: {
          'list': pidList
        },
        success: (res) => {
          this.messageTips(res.message, 'success')
          this.pageList()
        }
      })
    },
    tableListChange (value) {
      this.checkedData = value
    },
    // 删改单查询
    queryListByCondition () {
      this.pageList(this.$store.state.pagination)
    },
    // 分页列表
    pageList (pagination) {
      if (this.dates === '' || this.dates === null) {
        this.queryCondtion.startDate = ''
        this.queryCondtion.endDate = ''
      } else {
        this.queryCondtion.startDate = util.dateFormat(this.dates[0], 'yyyy-MM-dd')
        this.queryCondtion.endDate = util.dateFormat(this.dates[1], 'yyyy-MM-dd')
      }
      this.$post({
        url: 'API@/dec-common/dec/revise/getDecRevises',
        data: {
          ...this.queryCondtion,
          page: pagination || this.paginationInit
        },
        success: (res) => {
          this.paginationInit = res.page
          this.tableList = res.result
        }
      })
    },
    // 保存
    saveDecRegister () {
      this.$refs['decRegisterForm'].validate((valid) => {
        if (valid) {
          // 确定是新增接口还是更新接口
          let url = util.isEmpty(this.decRegisterForm.pid) ? 'API@/dec-common/dec/revise/addDecRevises' : 'API@/dec-common/dec/revise/updateDecRevise'
          this.$post({
            url: url,
            data: this.decRegisterForm,
            success: (res) => {
              this.messageTips(res.message, 'success')
              this.clearDecRegisterForm()
              this.queryListByCondition()
            }
          })
        }
      })
    },
    // 取消保存的操作
    cancleDecRegister () {
      if (!util.isEmpty(this.$route.query.type) && this.$route.query.type === 'redirect') {
        this.$store.dispatch('CloseTab', this.$route.params.setId)
        return
      }
      this.clearDecRegisterForm()
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      e.srcElement.blur()
      // 获取当前焦点所在的 form表单
      let form = e.srcElement.form
      // 获取form表单下的所有 input
      let focusable = form.querySelectorAll('input')
      let newFocusable = []
      // 排除 disabled 属性的 input
      for (let n in focusable) {
        if (focusable[n].disabled === false) {
          newFocusable.push(focusable[n])
        }
      }
      focusable = newFocusable
      // 排除disabled元素
      let index
      for (let i in focusable) {
        if (e.srcElement === focusable[i]) {
          index = i
          break
        }
      }
      // 下一个元素
      let next = focusable[parseInt(index) + 1]
      // 上一个元素
      let prev = focusable[parseInt(index) - 1]
      if (e.shiftKey) { // shift+enter 光标向上个元素移动
        if (prev) {
          if (e.srcElement.attributes.shiftEnter && e.srcElement.attributes.shiftEnter.nodeValue === 'no') {
            return false
          } else {
            if (e.srcElement.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.srcElement.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            }
            prev.focus()
          }
        }
      } else if (e.ctrlKey && this.localName === 'textarea') { // Ctrl+enter 在textaera中换行
        let myValue = '\n'
        let t = e.srcElement
        if (document.selection) { // ie<9
          t.focus()
          let sel = document.selection.createRange()
          sel.text = myValue
          t.focus()
          sel.moveStart('character', -1)
        } else if (t.selectionStart || t.selectionStart === '0') { // 现代浏览器
          let startPos = t.selectionStart
          let endPos = t.selectionEnd
          let scrollTop = t.scrollTop
          t.value = t.value.substring(0, startPos) + myValue + t.value.substring(endPos, t.value.length)
          t.focus()
          // 因为myValue回车显示为\n
          t.selectionStart = startPos + myValue.length
          t.selectionEnd = startPos + myValue.length
          t.scrollTop = scrollTop
        } else {
          t.value += myValue
          t.focus()
        }
      } else {
        if (e.srcElement.localName === 'textarea') { // enter 光标向下个元素移动
          e.preventDefault()
          e.stopPropagation()
        }
        // 下个元素存在
        if (next) {
          if (e.srcElement.attributes.enter && e.srcElement.attributes.enter.nodeValue === 'no') {
            return false
          } else {
            if (e.srcElement.parentElement.offsetParent.attributes.class.nodeValue === 'el-select el-select--mini') {
              let ref = e.srcElement.parentElement.offsetParent.attributes.dataRef.nodeValue
              this.$refs[ref].blur()
            }
            next.focus()
            next.select()
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
  .query-main {
    // background-color: #f5f5f5;
    padding: 20px;
    font-size:12px;
    font-family: Arial,Microsoft YaHei,SimSun;
    height: 100%;
    overflow: auto;
  }
  .query-condition {
    background-color: #fff;
    padding: 20px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .op-btn {
    margin-bottom: 14px;
  }
  .query-btn {
    text-align: center;
  }
  .layer-btn-primary {
    height: 32px;
    line-height: 32px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #4898d5;
    border-radius: 2px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    background-color: @sys-color-btn;
    color: #fff;
  }
  .layer-btn {
    height: 32px;
    line-height: 32px;
    margin: 0 6px;
    padding: 0 15px;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    color: #333333;
  }
  .dec-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    background-color: #fff
  }
  .border-0 {
    border: 0;
    margin-right: 5px;
  }
</style>
