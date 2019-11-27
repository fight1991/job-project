<template>
 <div class="item">
    <h3>{{item.label}}</h3>
    <div class="container">
      <el-row :gutter="15">
        <el-col :span="3" class="right">
          <span class="label">对应模版工作表</span>
        </el-col>
        <el-col :span="4">
          <el-select size="mini" v-model="item.sheetName" :disabled="!isEditable">
            <el-option
              v-for="item in sheetNames"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <template v-if="isList">
          <el-col :span="2" class="right">
            <span class="label">起始行</span>
          </el-col>
          <el-col :span="3">
            <el-input v-model="item.startLine" type="number" size="mini" :disabled="!isEditable"></el-input>
          </el-col>
          <el-col :span="3" class="right">
            <span class="label">单个跨越行数</span>
          </el-col>
          <el-col :span="3">
            <el-input v-model="item.gap" type="number" size="mini" :disabled="!isEditable"></el-input>
          </el-col>
        </template>
      </el-row>
      <el-row class="marginTop20">
        <el-col :span="3" class="right paddingRight21">
          <span class="label">字段配置</span>
        </el-col>
        <el-col :span="21">
          <settingTable :dataTableForm="item" :sheetName="item.sheetName" ref="settingTable" :isEditable="isEditable"></settingTable>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import settingTable from './settingTable'

export default {
  props: {
    item: {
      type: Object
    },
    sheetNames: {
      type: Array
    },
    isList: {
      type: Boolean,
      default: false
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    settingTable
  },
  data () {
    return {
    }
  },
  methods: {
    checkContentValid () {
      let result = true
      this.$refs.settingTable.$refs.dataTableForm.validate((valid) => {
        result = valid
      })
      return result
    }
  }
}
</script>
<style lang="less" scoped>
  .marginTop20{
    margin-top: 20px;
  }
  .paddingRight21{
    padding-right: 21px;
  }
  .item{
    h3 {
      font-weight: initial;
      padding-bottom: 10px;
    }
    .container{
      padding: 10px;
      border: 1px solid #ccc;
    }
    .right{
      text-align: right;
    }
    .label{
      line-height: 28px;
    }
  }
</style>
