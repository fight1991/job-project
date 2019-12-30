<template>
<!-- 报关单表头——使用人信息组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="编辑使用人信息"
      :visible.sync="decUserVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeDecUser'
      @opened='openDecUser'
      v-dialogDrag
      width="50%">
      <div class="border">
        <el-form label-width="120px" :model="userForm" size="mini" label-position="right" @keyup.enter.native="switchFoucsByEnter">
          <el-row  >
            <el-col :span="12">
              <el-form-item label="使用单位联系人">
                <el-input v-model="userForm.useOrgpersonCode" ref='useOrgpersonCode' :maxlength="20" @input='checklen("userForm", "useOrgpersonCode", 100)'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用单位联系电话">
                <el-input v-model="userForm.useOrgpersonTel" :maxlength="20" enter='no'  @input='checklen("userForm", "useOrgpersonCode", 100)' @keyup.enter.native='saveDecUser'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-row>
          <el-button icon="fa fa-plus" @click="AddDecUser" class="secondButton" size="mini" :disabled="isDisabled">新增</el-button>
          <el-button icon="fa fa-sign-in" @click="saveDecUser" class="secondButton" size="mini" :disabled="isDisabled">保存</el-button>
          <el-button icon="fa fa-trash-o" @click="delDecUser" class="secondButton" size="mini" :disabled="isDisabled">删除</el-button>
        </el-row>
      </div>
      <el-table  ref="userTable" :data="userList"
        highlight-current-row border size='mini'
        @selection-change="decUserchangeFun"
        @row-click="backDecUserInfo"
        max-height="300" style="width: 100%">
        <el-table-column  type="selection" min-width="50"></el-table-column>
        <el-table-column  type="index" property="gNo" label="序号" min-width="50"></el-table-column>
        <el-table-column  property="useOrgpersonCode" label="使用单位联系人" min-width="100"></el-table-column>
        <el-table-column  property="useOrgpersonTel" label="使用单位联系电话" min-width="100"></el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../common/decUtil'
export default {
  name: 'dec-user',
  props: {
    decUserVisible: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    userListArr: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      userList: [],
      checkedUserList: [], // 被选中的联系人信息
      userForm: {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        useOrgpersonCode: '', // 使用单位联系人
        useOrgpersonTel: '' // 使用单位联系电话
      }
    }
  },
  methods: {
    openDecUser () {
      this.userList = util.simpleClone(this.userListArr)
    },
    // 新增使用人
    AddDecUser () {
      this.userForm = {
        pid: '', // 主键
        decPid: '', // 报关单主键
        gNo: '', // 序号
        useOrgpersonCode: '', // 使用单位联系人
        useOrgpersonTel: '' // 使用单位联系电话
      }
      this.$refs.useOrgpersonCode.focus()
    },
    // 保存使用人
    saveDecUser () {
      if (!this.userForm.useOrgpersonCode || !this.userForm.useOrgpersonTel) {
        return false
      }
      if (util.isEmpty(this.userForm.gNo)) {
        // 新增
        this.userForm.gNo = (this.userList.length + 1).toString()
        this.userList.push(util.simpleClone(this.userForm))
      } else {
        // 修改
        let index = parseInt(this.userForm.gNo) - 1
        this.userList[index] = util.simpleClone(this.userForm)
        this.userList.push({})
        this.userList.pop()
      }
      this.AddDecUser()
    },
    // 删除 使用人
    delDecUser () {
      let delData = this.checkedUserList
      if (delData.length === 0) {
        this.messageTips('至少选择一条数据')
      } else {
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.userList) {
              if (delData[index].gNo.toString() === this.userList[item].gNo) {
                this.userList.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedUserList = []
          // 重新排序
          for (let i in this.userList) {
            this.userList.gNo = parseInt(i) + 1
          }
          // 重新 初始化表单
          this.AddDecUser()
        }).catch(() => {
        })
      }
    },
    // 提交使用人数据
    closeDecUser () {
      this.$emit('close:decUser', {userList: this.userList})
    },
    // 反填联系人信息
    backDecUserInfo (row) {
      this.userForm = util.simpleClone(row)
    },
    // 获取选中数据  使用人
    decUserchangeFun (value) {
      this.checkedUserList = value
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
    /**
   * 控制输入中英文字符长度，一个中文当做2个长度来控制
   * @param inpt
   * @param maxlen
   */
    checklen (type, ipnut, maxlen) {
      let str = this.userForm[ipnut]
      let len = str.length
      // utf-8字节长度
      let realLength = 0
      let charCode
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128 && charCode !== 10) {
          realLength += 1
        } else {
          // 如果是中文则长度加2
          realLength += 2
        }
        if (realLength > maxlen) {
          this.userForm[ipnut] = str.substr(0, i)
          return
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/decCss';
</style>
