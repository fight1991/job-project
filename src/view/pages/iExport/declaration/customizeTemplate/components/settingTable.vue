<template>
  <section class="settingTable">
    <el-form :model="dataTableForm" ref="dataTableForm">
      <el-table :data="dataTableForm.table" highlight-current-row :height='230' style="width: 100%" size="mini" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="字段名称" width="120" prop="label"></el-table-column>
        <el-table-column label="填制要求" width="120" prop="writeTips" show-overflow-tooltip></el-table-column>
        <el-table-column label="取值单元格" min-width="100">
          <template slot-scope="scope">
            <el-form-item
              :prop="'table.'+ scope.$index + '.cellSetting'"
              :rules="valid.cellSetting">
              <el-input :disabled="!isEditable" v-model="scope.row.cellSetting" class="decListInner" @blur="getPreview(scope.row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="进一步设置" min-width="180">
          <template slot-scope="scope">
            <el-select :disabled="!isEditable" size="mini" v-model="scope.row.cellRule" class="decListInner" @change="getPreview(scope.row)">
              <el-option
                v-for="item in cellRules"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="预览" min-width="200" prop="preview"></el-table-column>
      </el-table>
    </el-form>
  </section>
</template>

<script>
import excelUtil from '../utils/excelUtil'

export default {
  props: {
    dataTableForm: {
      type: Object
    },
    sheetName: {
      type: String
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      valid: {
        cellSetting: {validator: this.cellSettingValid, message: '支持输入大写字母及数字', trigger: 'blur'}
      },
      cellRules: [{
        value: 1,
        label: '整个单元格取值'
      }, {
        value: 2,
        label: '截取数字'
      }, {
        value: 3,
        label: '截取非数字'
      }]
    }
  },
  methods: {
    getPreview (row) {
      let preview = excelUtil.getCellValue(this.sheetName, row.cellSetting)
      switch (row.cellRule) {
        case 2:
          preview = preview.replace(/[^0-9]/ig, '')
          break
        case 3:
          preview = preview.replace(/[0-9]/ig, '')
          break
        default: break
      }
      row.preview = preview
    },
    cellSettingValid (rule, value, callback) {
      let reg = /^[a-zA-Z]+[0-9]+$/
      if (value && !reg.test(value)) {
        callback(new Error('只支持输入连续字母和数字'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="less">
  .settingTable{
    .el-form-item {
      margin-bottom: unset;
    }
  }
</style>
