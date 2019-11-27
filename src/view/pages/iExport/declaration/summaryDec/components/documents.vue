<template>
  <!-- 表体——随附单证组件 -->
  <section class='sys-dec-class'>
    <div class="dec-div">
      <el-row>
        <el-button size="mini" icon="fa fa-plus" class="secondButton" @click="refreshDoc" :disabled="controller.isDisabled">&nbsp;新增</el-button>
        <el-button size="mini" icon="fa fa-trash-o" class="secondButton" @click="delDoc" :disabled="controller.isDisabled">&nbsp;删除</el-button>
        <el-button size="mini" class="secondButton" @click="openOriginRel">原产地</el-button>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="licenselist"
            :height='190' style="width: 100%" size="mini"
            ref="decLicTable"
            highlight-current-row border
            @select="decLicCheckChange"
            @selection-change="decLicChange"
            @row-click= 'backDecLicInfo' >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="docuCode" label="单证代码" min-width="80">
            </el-table-column>
            <el-table-column prop="certCode" label="单证编号" min-width="100"></el-table-column>
        </el-table>
        </el-col>
      </el-row>
    </div>
      <!-- 表体展示 -->
    <document-item  ref='documentItem' :moduleName="moduleName" :decCheckLicense="decCheckLicense" :licenselist="licenselist"></document-item>
  </section>
</template>
<script>
import util from '@/common/util'
import documentItem from '../components/documentItem'
// import { mapState } from 'vuex'
export default {
  name: 'documents',
  components: {
    documentItem
  },
  data () {
    return {
      licenselist: [],
      checkedDecLicList: [],
      decCheckLicense: {}
    }
  },
  watch: {},
  created () {
  },
  computed: {
    // ...mapState({
    //   'controller': state => state.summaryData.controller
    // }),
    controller () {
      return this.$store.state[this.moduleName].controller
    }
  },
  props: {
    moduleName: {
      type: String
    }
  },
  methods: {
    // 编辑/详情的数据
    getDocumentsDetail (listVo) {
      this.licenselist = util.simpleClone(listVo)
    },
    clearDocumentsData () {
      this.$refs.documentItem.clearDocumentsItemData()
      for (let n in this.licenselist) {
        this.licenselist[n].pid = ''
        this.licenselist[n].decPid = ''
      }
    },
    // 主界面头部新增
    initDocumentsData () {
      this.refreshDoc()
      this.licenselist = []
    },
    // 清除 随附单证 新增数据
    refreshDoc () {
      this.$refs.documentItem.refreshItemDoc()
    },
    // 删除随附单证
    delDoc () {
      let delData = this.checkedDecLicList
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
            for (let item in this.licenselist) {
              if (delData[index].docuCode === this.licenselist[item].docuCode) {
                this.licenselist.splice(item, 1)
                break
              }
            }
          }
          // 清空 被选中的数组
          this.checkedDecLicList = []
          // 重新 初始化 form表单
          this.refreshDoc()
        }).catch(() => {
        })
      }
    },
    // 获取 随附单证 被选中的值
    decLicChange (value) {
      this.checkedDecLicList = value
    },
    // 点击多选框时候的操作
    decLicCheckChange (selection, row) {
      let flag = false
      for (let i in selection) {
        if (selection[i].gNo === row.gNo) {
          flag = true
          break
        }
      }
      if (flag) {
        this.backDecLicInfo(row)
      } else {
        this.$refs.decLicTable.toggleRowSelection(row, false)
        this.refreshDoc()
      }
    },
    // 单击 随附单证 反填 数据
    backDecLicInfo (row) {
      this.$refs.decLicTable.toggleRowSelection(row, true)
      this.setValueForDecLicForm(row)
    },
    setValueForDecLicForm (data) {
      this.decCheckLicense = util.simpleClone(data)
      this.$nextTick(() => {
        this.$refs.documentItem.initDocumentsSelect()
      })
    },
    // 打开 原产地对应关系 弹出框
    openOriginRel () {
      this.$refs.documentItem.openOriginItemRel()
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../decPage/common/decCss';
.span-match {
    font-size: 12px;
    background-color: #096AC6;
    color: #fff;
    margin-right: 5px;
    cursor: pointer;
}
.dec-div{
  margin-top:5px;
  border: 1px solid #B7B7B7;
  border-bottom: 0;
  background-color: #fff;
}
</style>
