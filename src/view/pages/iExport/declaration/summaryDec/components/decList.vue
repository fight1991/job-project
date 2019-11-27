<template>
<!-- 其表体组件 -->
  <section>
    <!--- table 开始  -->
    <div class = "dec-div" >
      <el-row>
        <el-button size="mini" icon="fa fa-plus" class="secondButton" :disabled="controller.isDisabled"  @click="refreshDecList">&nbsp;新增</el-button>
        <el-button size="mini" icon="fa fa-trash-o" class="secondButton" :disabled="controller.isDisabled"  @click="delDecList" >&nbsp;删除</el-button>
        <el-button size="mini" icon="fa fa-copy" class="secondButton" :disabled="controller.isDisabled" @click="copyDecList">&nbsp;复制</el-button>
        <el-button size="mini" icon="fa fa-arrow-up" class="secondButton" :disabled="controller.isDisabled" @click="moveUpDecList">&nbsp;上移</el-button>
        <el-button size="mini" icon="fa fa-arrow-down" class="secondButton" :disabled="controller.isDisabled" @click="downUpDecList">&nbsp;下移</el-button>
        <el-button size="mini" icon="fa fa-level-down" class="secondButton" :disabled="controller.isDisabled" @click="insertDecList">&nbsp;插入</el-button>
        <el-checkbox v-model="isCheckbox" @change='checkboxChange'></el-checkbox>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-table
          v-if='bodyShow'
          ref="decListTable"
          :data="tableList"
          highlight-current-row
          :height='230'
          style="width: 100%"
          size="mini" border
          @keydown.native.prevent='changeBody'
          @select="decListCheckChange"
          @selection-change="decListChange"
          @row-click='rowClickDecList'>
            <el-table-column min-width="50" label="单选" v-if='!isCheckbox'>
              <template slot-scope="scope">
                <el-radio v-model="bodyListRadio" @click.native='checkThisBody(scope.$index)' :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column type='selection' width="37" v-else></el-table-column>
            <el-table-column prop="gNo" label="项号" width="55"></el-table-column>
            <el-table-column prop="codeTs" label="商品编号" min-width="100"></el-table-column>
            <el-table-column prop="gName" label="商品名称" min-width="200"></el-table-column>
            <el-table-column prop="ciqName" label="检验检疫名称" min-width="180" v-if="isShowInput.isCheck"></el-table-column>
            <el-table-column prop="gQty" label="成交数量" min-width="100"></el-table-column>
            <el-table-column prop="gUnitValue" label="成交计量单位" min-width="80"></el-table-column>
            <el-table-column prop="declTotal" label="总价" min-width="100"></el-table-column>
            <el-table-column prop="tradeCurrValue" label="币制" min-width="100"></el-table-column>
            <el-table-column prop="originCountryValue" label="原产国(地区)" min-width="100"></el-table-column>
            <el-table-column prop="controlMa" label="监管要求" width="80" v-if="isShowInput.isCheck"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!--- table 结束  -->
    <!-- 表体展示 -->
    <dec-list-item  ref='decListItem' :moduleName="moduleName" :checkedTableData="checkedTableData" :tableList="tableList" @backData="backData"></dec-list-item>
  </section>
</template>
<script>
// import { mapState } from 'vuex'
import decListItem from '../components/decListItem'
import util from '@/common/util.js'
import decUtil from '../../decPage/common/decUtil'
import summaryBus from '../common/bus.js'
export default {
  name: 'dec-list',
  components: {
    decListItem
  },
  data () {
    return {
      isShowInput: {
        isDoc: false, // 是否涉证
        isCheck: false, // 是否涉检
        isTax: false // 是否涉税
      },
      bodyShow: true,
      tableList: [], // 报关单表体列表
      checkedTableData: {},
      checkedTableList: [], // 报关单表体列表 被选中的数据
      bodyListRadio: '',
      isCheckbox: false
    }
  },
  created () {
    summaryBus.$on('setTableListToSate', this.setTableListToSate)
    summaryBus.$on('getGNameFocus', this.getGNameFocus)
  },
  watch: {
    declareType (newVal, oldVal) {
      if (newVal.indexOf(2) !== -1) {
        this.isShowInput.isCheck = true
      } else {
        this.isShowInput.isCheck = false
        this.cutBodyData()
      }
    }
  },
  computed: {
    // ...mapState({
    //   'controller': state => state.summaryData.controller,
    //   'declareType': state => state.summaryData.declareType
    // }),
    controller () {
      return this.$store.state[this.moduleName].controller
    },
    declareType () {
      return this.$store.state[this.moduleName].declareType
    }
  },
  props: {
    moduleName: {
      type: String
    }
  },
  methods: {
    // 外部获取焦点
    getGNameFocus () {
      this.$refs.decListItem.focusDecList()
    },
    // 列表数据
    setTableListToSate () {
      this.$store.commit(this.moduleName + '/changeDecPage', {key: 'tableList', value: this.tableList})
    },
    // 编辑/详情的数据
    getBodyDetail (bodyList) {
      this.tableList = util.simpleClone(bodyList)
      for (let x in this.tableList) {
        this.tableList[x].gQty = decUtil.removeZero(this.tableList[x].gQty)
        this.tableList[x].qty1 = decUtil.removeZero(this.tableList[x].qty1)
        this.tableList[x].qty2 = decUtil.removeZero(this.tableList[x].qty2)
        this.tableList[x].declTotal = decUtil.removeZero(this.tableList[x].declTotal)
      }
      let gNo = this.tableList.length + 1
      this.$refs.decListItem.changeGno(gNo)
    },
    clearBodyData () {
      for (let i in this.tableList) {
        this.tableList[i].decListPid = ''
        this.tableList[i].decPid = ''
      }
      this.$refs.decListItem.clearBodyItemData()
    },
    // 涉检不勾选  商品编号变为6位
    cutBodyData () {
      for (let x in this.tableList) {
        if (this.tableList[x].codeTs.length > 6) {
          this.tableList[x].codeTs = this.tableList[x].codeTs.slice(0, 6)
        }
      }
    },
    // 主界面头部新增
    initBodyData () {
      this.decList = this.$refs.decListItem.initBodyItemData()
      this.tableList = []
      this.checkedTableList = []
    },
    // 新增
    refreshDecList () {
      this.$refs.decListItem.resetBodyForOther()
      // 取消选择项
      if (this.isCheckbox) {
        // this.$refs.decListTable.clearSelection()
      } else {
        this.bodyListRadio = ''
        this.checkedTableList = []
      }
    },
    // 单选选择表体
    checkThisBody (index) {
      this.checkedTableList[0] = util.simpleClone(this.tableList[index])
      this.checkedTableData = util.simpleClone(this.checkedTableList[0])
      this.$refs.decListItem.formatDecList(this.checkedTableData)
    },
    // 删除 报关单表体 信息
    delDecList () {
      let delData = this.checkedTableList
      if (delData.length === 0) {
        this.messageTips('请选择需要删除的数据')
      } else {
        // 删除
        this.$confirm('确定删除选中数据？', '提示', {
          modalAppendToBody: true,
          domMount: this.$el.parentNode,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          for (let index in delData) {
            for (let item in this.tableList) {
              if (delData[index].gNo === this.tableList[item].gNo) {
                this.tableList.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedTableList = []
          this.bodyListRadio = ''
          // 重新排序
          for (let i in this.tableList) {
            this.tableList[i].gNo = parseInt(i) + 1
          }
          // 重新设置商品对应关系列表
          // this.resetGoodsEnNameList()
          // 重新 初始化 form表单
          this.refreshDecList()
        }).catch(() => {
        })
      }
    },
    // 复制 报关单 一条表体数据
    copyDecList () {
      if (this.tableList.length === 50) {
        this.messageTips('表体数据不能超过50条')
        return
      }
      if (this.isCheckbox) {
        let copyData = this.checkedTableList
        if (copyData.length !== 1) {
          this.messageTips('请选择一条需要复制的数据')
        } else {
          this.checkedTableList[0].decListPid = ''
          this.checkedTableList[0].gNo = parseInt(this.tableList.length) + 1
          this.tableList.push(util.simpleClone(this.checkedTableList[0]))
          // 需要 移动选项到新复制的数据上
          this.$refs.decListTable.clearSelection()

          this.checkedTableList.push(util.simpleClone(this.tableList[this.tableList.length - 1]))
          this.checkedTableList.forEach(item => {
            this.$refs.decListTable.toggleRowSelection(this.tableList.find(d => d.gNo === item.gNo), true)
          })
          this.checkedTableData = util.simpleClone(this.checkedTableList[0])
          // 初始化下拉框
          this.$refs.decListItem.initBodySelect()
          this.messageTips('数据复制成功', 'success')
        }
      } else {
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条需要复制的数据')
          return
        }
        this.checkedTableList[0].decListPid = ''
        this.checkedTableList[0].gNo = +this.tableList.length + 1
        this.tableList.push(util.simpleClone(this.checkedTableList[0]))
        this.bodyListRadio = +this.tableList.length - 1
        this.checkedTableData = util.simpleClone(this.checkedTableList[0])
      }
    },
    // 上移 报关单 一条表体数据
    moveUpDecList () {
      if (this.isCheckbox) {
        let moveData = this.checkedTableList
        if (moveData.length !== 1) {
          this.messageTips('请选择一条需要移动的数据')
        } else {
          let index = parseInt(this.checkedTableList[0].gNo)
          if (index === 1) {
            this.messageTips('已是第一条商品表体，无法执行上移操作。')
          } else {
            let checkedData = util.simpleClone(moveData[0])
            let checkGNo = parseInt(checkedData.gNo) - 1
            let changeData = util.simpleClone(this.tableList[checkGNo - 1])
            checkedData.gNo = parseInt(checkedData.gNo) - 1
            changeData.gNo = parseInt(changeData.gNo) + 1
            this.tableList[checkGNo - 1] = checkedData
            this.tableList[checkGNo] = changeData
            this.tableList.push({})
            this.tableList.pop()
            this.$refs.decListTable.toggleRowSelection(this.tableList[checkGNo - 1])
            this.checkedTableData = util.simpleClone(this.tableList[checkGNo - 1])
            this.$refs.decListItem.formatDecList(this.checkedTableData)
          }
        }
      } else { // 单选
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条需要移动的数据')
          return
        }
        if (this.bodyListRadio === 0) {
          this.messageTips('已是第一条商品表体，无法执行上移操作。')
          return
        }
        let checkedData = util.simpleClone(this.tableList[this.bodyListRadio])
        let checkGNo = parseInt(checkedData.gNo) - 1
        let changeData = util.simpleClone(this.tableList[checkGNo - 1])
        checkedData.gNo = parseInt(checkedData.gNo) - 1
        changeData.gNo = parseInt(changeData.gNo) + 1
        this.bodyListRadio--
        this.tableList[checkGNo - 1] = checkedData
        this.tableList[checkGNo] = changeData
        this.tableList.push({})
        this.tableList.pop()
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.checkedTableData = util.simpleClone(this.checkedTableList[0])
        this.$refs.decListItem.formatDecList(this.checkedTableData)
      }
    },

    // 下移 报关单 一条表体数据
    downUpDecList () {
      if (this.isCheckbox) {
        let moveData = this.checkedTableList
        if (moveData.length !== 1) {
          this.messageTips('请选择一条需要移动的数据')
        } else {
          let index = parseInt(this.checkedTableList[0].gNo)
          if (index === this.tableList.length) {
            this.messageTips('已是最后一条数据，无法执行下移操作。')
          } else {
            let checkedData = util.simpleClone(moveData[0]) // 需要移动的数据
            let checkGNo = parseInt(checkedData.gNo) - 1 // 需要移动的数据的位置
            let changeData = util.simpleClone(this.tableList[checkGNo + 1]) // 被交换位置的数据
            checkedData.gNo = parseInt(checkedData.gNo) + 1 // 重新设置 需要移动数据的 项号
            changeData.gNo = parseInt(changeData.gNo) - 1 // 重新设置 被移动数据的项号
            this.tableList[checkGNo] = changeData // 被移动的数据 重新设置位置
            this.tableList[checkGNo + 1] = checkedData // 移动数据 重新设置位置
            this.tableList.push({})
            this.tableList.pop()
            this.$refs.decListTable.toggleRowSelection(this.tableList[checkGNo + 1])
            this.checkedTableData = util.simpleClone(this.tableList[checkGNo + 1])
            this.$refs.decListItem.formatDecList(this.checkedTableData)
          }
        }
      } else { // 单选
        if (this.bodyListRadio === '') {
          this.messageTips('请选择一条需要移动的数据')
          return
        }
        if (this.bodyListRadio === (+this.tableList.length - 1)) {
          this.messageTips('已是最后一条数据，无法执行下移操作。')
          return
        }
        let checkedData = util.simpleClone(this.tableList[this.bodyListRadio]) // 需要移动的数据
        let checkGNo = parseInt(checkedData.gNo) - 1 // 需要移动的数据的位置
        let changeData = util.simpleClone(this.tableList[checkGNo + 1]) // 被交换位置的数据
        checkedData.gNo = parseInt(checkedData.gNo) + 1 // 重新设置 需要移动数据的 项号
        changeData.gNo = parseInt(changeData.gNo) - 1 // 重新设置 被移动数据的项号
        this.tableList[checkGNo] = changeData // 被移动的数据 重新设置位置
        this.tableList[checkGNo + 1] = checkedData // 移动数据 重新设置位置
        this.bodyListRadio++
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.checkedTableData = util.simpleClone(this.checkedTableList[0])
        this.tableList.push({})
        this.tableList.pop()
        this.$refs.decListItem.formatDecList(this.checkedTableData)
      }
    },
    // 插入 报关单 一条表体数据
    insertDecList () {
      if (this.isCheckbox) { // 多选
        let moveData = this.checkedTableList
        if (moveData.length !== 1) {
          this.messageTips('请选择需要插入的位置')
        } else {
          let gNo = this.checkedTableList[0].gNo
          this.refreshDecList()
          this.$refs.decListItem.changeGno(gNo)
          this.$refs.decListItem.changeIsInsert(true)
        }
      } else {
        if (this.bodyListRadio === '') {
          this.messageTips('请选择需要插入的位置')
        } else {
          let no = this.bodyListRadio
          let gNo = this.tableList[this.bodyListRadio].gNo
          this.refreshDecList()
          this.$refs.decListItem.changeGno(gNo)
          this.bodyListRadio = no
          this.checkedTableList.push(util.simpleClone(this.tableList[this.bodyListRadio]))
          this.$refs.decListItem.changeIsInsert(true)
        }
      }
    },
    // 修改后单选清除/插入多选勾选
    backData (data) {
      if (this.isCheckbox) {
        // 默认选中 刚插入的数据
        this.$refs.decListTable.clearSelection()
        this.$refs.decListTable.toggleRowSelection(data, true)
      }
    },
    checkboxChange (value) {
      this.bodyListRadio = ''
      this.checkedTableList = []
      this.bodyShow = false
      this.refreshDecList()
      setTimeout(() => {
        this.bodyShow = true
      }, 100) // 延迟1秒
    },
    // 点击当前行的情况
    decListCheckChange (selection, row) {
      let flag = false
      for (let i in selection) {
        if (selection[i].gNo === row.gNo) {
          flag = true
          break
        }
      }
      if (flag) {
        this.backDeccListInfo(row)
      } else {
        // this.$refs.decListTable.toggleRowSelection(row, false)
        this.refreshDecList()
      }
    },
    // 获取选中的报关单 表体 信息
    decListChange (value) {
      this.checkedTableList = util.simpleClone(value)
    },
    rowClickDecList (row, event, column) {
      if (this.isCheckbox) { // 多选执行 多选不执行
        let flag = false
        for (let i in this.checkedTableList) {
          if (this.checkedTableList[i].gNo === row.gNo) {
            flag = true
            break
          }
        }
        if (flag) {
          this.$refs.decListTable.toggleRowSelection(row, false)
          this.refreshDecList()
        } else {
          this.backDeccListInfo(row)
        }
      } else {
        this.bodyListRadio = +row.gNo - 1
        // 设置聚焦在radio 上
        this.$refs['decListTable'].bodyWrapper.lastElementChild.querySelectorAll('input[type="radio"]')[this.bodyListRadio].focus()
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.checkedTableData = util.simpleClone(this.checkedTableList[0])
        this.$refs.decListItem.formatDecList(this.checkedTableData)
      }
    },
    // 反填 报关单表体信息
    backDeccListInfo (row) {
      this.$refs.decListTable.toggleRowSelection(row, true)
      this.checkedTableData = util.simpleClone(row)
      this.$refs.decListItem.formatDecList(this.checkedTableData)
    },
    // 上下键切换
    changeBody (e) {
      if (!(e && (e.keyCode === 38 || e.keyCode === 40))) {
        return
      }
      if (this.isCheckbox) { // 如果是多选
        if (this.checkedTableList.length === 0) {
          return
        }
        if (this.checkedTableList.length > 1) {
          this.messageTips('只能选择一条数据')
          return
        }
        if (this.tableList.length === 1) {
          return
        }
        let no = +this.checkedTableList[0].gNo
        let len = this.tableList.length
        if (e.keyCode === 38) {
          if (no === 1) {
            this.checkedTableList[0] = this.tableList[len - 1]
          } else {
            this.checkedTableList[0] = this.tableList[no - 2]
          }
        } else if (e.keyCode === 40) {
          if (no === len) {
            this.checkedTableList[0] = this.tableList[0]
          } else {
            this.checkedTableList[0] = this.tableList[no]
          }
        }
        this.checkedTableData = util.simpleClone(this.checkedTableList[0])
        let list = this.checkedTableList
        this.$nextTick(_ => {
          if (list.length > 0) {
            list.forEach(item => {
              this.$refs.decListTable.toggleRowSelection(this.tableList.find(d => d.gNo === item.gNo), true)
            })
          } else {
            this.$refs.decListTable.clearSelection()
          }
        })
      } else { // 如果是单选
        let len = this.tableList.length
        if (e && e.keyCode === 38) { // 上
          if (this.bodyListRadio === 0) {
            this.bodyListRadio = len - 1
          } else {
            this.bodyListRadio--
          }
        }
        if (e && e.keyCode === 40) { // 下
          if (this.bodyListRadio === (len - 1)) {
            this.bodyListRadio = 0
          } else {
            this.bodyListRadio++
          }
        }
        this.checkedTableList[0] = util.simpleClone(this.tableList[this.bodyListRadio])
        this.checkedTableData = util.simpleClone(this.checkedTableList[0])
      }
    }
  }
}
</script>
<style lang="less" scoped>
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
}
</style>
