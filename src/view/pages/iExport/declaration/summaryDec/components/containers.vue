<template>
  <!-- 表体——集装箱组件 -->
  <section>
    <div class="dec-div">
      <el-row>
        <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDecConta" :disabled="controller.isDisabled">&nbsp;新增</el-button>
        <el-button size="mini" icon="fa fa-trash-o" class="secondButton" @click="delDecConta" :disabled="controller.isDisabled">&nbsp;删除</el-button>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-table :data="tableDecContainerlist" :height='(declareType.indexOf(1)!==-1)? 200 : 440'
            ref="tableDecContainer"
            style="width:100%" size="mini"
            @select="decContaCheckChange"
            @selection-change="decContaChange"
            @row-click='backDecContaInfo'>
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="containerNo" label="集装箱号" min-width="80"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <container-item ref="containerItem" :moduleName="moduleName" :tableDecContainerlist="tableDecContainerlist" :checkedList="checkedDecContaList" @backData="backContainerData"></container-item>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'
import decUtil from '../../decPage/common/decUtil'
import goodsGno from '../../decPage/container/components/goodsGno'
import containerItem from './containerItem.vue'
// import { mapState } from 'vuex'
export default {
  components: {
    goodsGno, containerItem
  },
  data () {
    return {
      goodsGNoVisible: false,
      importCompnentVisible: false,
      initImport: {},
      checkList: [],
      tableDecContainerlist: [],
      checkedDecContaList: [], // 被选中的 集装箱数据
      commomPara2: [],
      isError: false,
      docuAndcertCodeNote: false,
      docuAndcertCodeTips: []
    }
  },
  created () {
  },
  watch: {

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
    // 删除 集装箱
    delDecConta () {
      let delData = this.checkedDecContaList
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
      this.$refs.containerItem.refreshDecConta()
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
    getContainersDetail (listVo) {
      this.tableDecContainerlist = util.simpleClone(listVo)
    },
    // 清空form及表格
    initContainerData () {
      this.$refs.containerItem.initContainerData()
      this.tableDecContainerlist = []
    },
    // 复制时清空主键
    clearDecContainerData () {
      this.$refs.containerItem.clearDecContainerData()
      for (let m in this.tableDecContainerlist) {
        this.tableDecContainerlist[m].pid = ''
        this.tableDecContainerlist[m].decPid = ''
      }
    },
    // 获取form新增的数据
    backContainerData (param) {
      this.tableDecContainerlist = util.simpleClone(param)
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
