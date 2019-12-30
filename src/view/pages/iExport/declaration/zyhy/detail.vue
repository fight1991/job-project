<template>
   <section class='sys-main' style="height: calc(100% - 20px);overflow: inherit;">
    <div class="info-panel sys-dec-class" :style="{width: aiWidth}">
      <div class="info-title">AI识别信息</div>
      <div class="info-content">
      <div v-for="(value,key) in fieldsList" :key="key">
        <div class="panel-header">{{key}}</div>
        <div class="panel-form dec-div">
          <el-form size="mini" label-width="120px">
            <el-row v-for="item in fieldsList[key].fields" :key="item.fieldCode">
              <el-form-item :label="key=='舱单'?item.matchedTitle:item.fieldName" :class='[aiColors[item.color]]'>
                <div class="cursor-p form-txt" @click="aiShow(item.fieldCode, key)">{{item.fieldValue}}</div>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
        <div class="zy-table" v-for="(tableitem, index) in fieldsList[key].tables" :key="'table'+index">
          <table border v-if="fieldsList[key].tables && fieldsList[key].tables.length !== 0">
            <thead>
              <tr>
                <th>单选</th>
                <th v-for="(headitem, headIndex) in tableitem[0]" :key="'headitem' + headIndex">{{key=='舱单'?headitem.matchedTitle:headitem.fieldName}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(childitem, childIndex) in tableitem" :key="'childitem' + childIndex">
                <td style="text-align:center;"><el-radio v-model="selectIndex[key][index].trNo" @change="radioChange(key, index, childIndex)" :label="childIndex">&nbsp;</el-radio></td>
                <td v-for="(children, childrenIndex) in childitem" :key="'children' + childrenIndex">{{children.fieldValue}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel-form dec-div" v-show="fieldsList[key].tables && fieldsList[key].tables.length!==0" v-for="(formitem, formIndex) in fieldsList[key].tables" :key="'form'+formIndex">
          <el-form size="mini" label-width="120px">
            <el-row v-for="(formChild, formChildIndex) in formitem[selectIndex[key][formIndex].trNo]" :key="'formChild'+formChildIndex">
              <el-form-item :label="key=='舱单'?formChild.matchedTitle:formChild.fieldName" :class='[aiColors[formChild.color]]'>
                <div class="cursor-p form-txt" @click="aiShowTable(formChild.fieldCode, key, formIndex, selectIndex[key][formIndex].trNo)">{{formChild.fieldValue}}</div>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>
      </div>
    </div>
    <dec-ai-detail ref="aiDetail"></dec-ai-detail>
  </section>
</template>
<script>
import decAiDetail from './aiDetail'
export default {
  components: {
    decAiDetail
  },
  data () {
    return {
      fieldsList: {},
      aiWidth: '720px',
      aiColors: ['dec-color-red', 'dec-color-yellow', 'dec-color-black'],
      selectIndex: {} // 当前选中表格行
    }
  },
  created () {
    this.$store.commit('collapse', true)
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.$post({
        url: 'API@/saas-ai/tran-ocr/getTranOCRTaskResult',
        data: {taskId: this.$route.params.taskId},
        success: (res) => {
          let result = JSON.parse(res.result)
          console.log(result)
          let multiDocFields = result.multiDocFields
          let multiDocTables = result.multiDocTables
          let fieldsList = {}
          for (let i in multiDocFields) {
            fieldsList[i] = {
              fields: this.handleData(multiDocFields[i]),
              tables: multiDocTables[i] ? this.handleTable(multiDocTables[i]) : []
            }
          }
          for (let e in multiDocTables) {
            this.selectIndex[e] = {}
          }
          for (let k in this.selectIndex) {
            for (let j in multiDocTables[k]) {
              this.selectIndex[k][j] = { trNo: 0 }
            }
          }
          this.fieldsList = fieldsList
          this.$refs.aiDetail.getDecByOcr(result)
        }
      })
    },
    handleData (data) {
      // // 处理表头数据
      let list = data
      for (let item of list) {
        if (item.fieldCode !== undefined) {
          if (item.picReferences.length === 0 || item.picReferences.length === undefined || item.fieldValue === '') {
            item['color'] = 0
          } else if (item.picReferences.length === 1) {
            item['color'] = 1
          } else {
            item['color'] = 2
          }
        }
      }
      // 如果没有颜色和有对应该字段 则需要初始化颜色
      /**
       * 黑色字体：代表精准识别结果，在几个单证中都有此字段内容 2
         黄色字体：代表单一识别结果，只在一个单证中有此字段内容 1
          红色字体：代表无识别结果或字段为空处，需要制单人员人工补充。 0
        */
      return list
    },
    handleTable (data) {
      let list = data
      list.forEach(e => {
        e.forEach(i => {
          i.forEach(v => {
            if (v.fieldCode !== undefined) {
              if (v.picReferences.length === 0 || v.picReferences.length === undefined || v.fieldValue === '') {
                v['color'] = 0
              } else if (v.picReferences.length === 1) {
                v['color'] = 1
              } else {
                v['color'] = 2
              }
            }
          })
        })
      })
      return list
    },
    aiShow (value, key) {
      this.$refs.aiDetail.drawArea({value: value, key: key})
    },
    aiShowTable (value, key, formIndex, index) {
      this.$refs.aiDetail.drawBoyArea({value: value, key: key, formIndex: formIndex, index: index})
    },
    radioChange (key, index, trIndex) {
      this.selectIndex[key][index].trNo = trIndex
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
@import '../decPage/common/decCss';
.info-panel{
  border: 1px solid;
  height: 100%;
  overflow: hidden;
  .info-title {
    background-color: #0969C8;
    padding: 10px 0 10px 10px;
    color: #fff;
    height: 15px;
    line-height: 15px;
    font-size: 14px;
  }
  .info-content{
    height: calc(100% - 40px);
    overflow-y: auto;
  }
  .panel-header{
    background-color: #f5f5f5;
    padding: 10px 0 10px 10px;
    height: 15px;
    line-height: 15px;
    font-size: 14px;
  }
  .panel-form{
    margin-top: 0;
    /deep/.el-form-item--mini {
      display: flex;
    }
    /deep/.el-form-item--mini .el-form-item__label{
      padding: 7px 8px;
      height: auto;
      background-color: #DCEBFC;
      min-width: 120px;
    }
    /deep/.el-form-item--mini .el-form-item__content{
      height: auto;
      margin-left: 0 !important;
    }
  }
  .zy-table{
    width: 100%;
    overflow: auto;
    table{
      border: 1px solid #d8d8d8;
      thead tr{
        background-color: #e5f2ff;
        color: #4c4c4c;
        font-weight: normal;
        th {
          min-width: 90px;
          padding: 5px 3px;
        }
      }
      tr td {
        padding: 5px 3px;
        background-color: #fff;
      }
    }
  }
  .border-red{
    border: 2px solid red;
  }
  .cursor-p{
    cursor: pointer;
    height: 100%;
    padding: 0 8px;
  }
  .border-b{
    border-bottom: 1px solid #B7B7B7;
  }
}
</style>
