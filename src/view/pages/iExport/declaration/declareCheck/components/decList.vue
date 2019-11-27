<template>
  <div>
    <el-table class='sys-table-table dec-table' ref='deCheckTable' :data="deCheckList" height="250"
    :cell-class-name="deCellClass" @row-click='deCheckRowClick' border highlight-current-row size="mini">
      <el-table-column label="项号" prop="gNoAllColor" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.gNo}}</span><br>
          <span>{{scope.row.contrItem}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品编号" prop="codeTsColor" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.codeTs}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称及规格型号" prop="gNameAndModelColor"  min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.gName}}</span><br>
          <span>{{scope.row.gModel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量及单位" prop="gQtyAndUnitColor"  min-width="100" align='right'>
        <template slot-scope="scope">
          <span>{{scope.row.gQty + scope.row.gUnitValue}}</span><br>
          <span>{{scope.row.qty1 + scope.row.unit1Value}}</span><br>
          <span>{{scope.row.qty2 + scope.row.unit2Value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价/总价/币制" prop="priceAndTotalColor"  min-width="100" align='right'>
        <template slot-scope="scope">
          <span>{{scope.row.declPrice}}</span><br>
          <span>{{scope.row.declTotal}}</span><br>
          <span>{{scope.row.tradeCurrValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="原产国（地区）" prop="originCountryColor"  min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.originCountryValue}}</span><br>
          <span>{{scope.row.originCountry}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终目的国（地区）" prop="destinationCountryColor"  min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.destinationCountryValue}}</span><br>
          <span>{{scope.row.destinationCountry}}</span>
        </template>
      </el-table-column>
      <el-table-column  min-width="150" prop="districtCodeAndColor" :label=" isImport? '境内目的地':'境内货源地'">
        <template slot-scope="scope">
          <span>{{scope.row.districtCode + scope.row.districtCodeValue + '/' + scope.row.destCodeValue}}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="征免" prop="dutyModeColor" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.dutyModeValue}}</span><br>
          <span>{{scope.row.dutyMode}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表体展示 -->
    <div>
      <div class='check-div'>
        <span class='title-name'>tips:</span>
        <span class='content-font'>{{decOther.statistics}}</span>
      </div>
      <dec-list-item :moduleName="moduleName" :itemConfig="itemConfig" :listItem="listItem" @changeColor="reRender" :disableList="disableList" :decOther="decOther"></dec-list-item>
    </div>
  </div>
</template>
<script>
import decListItem from './decListItem'
import businessUtil from '../utils/businessUtil'
// import { mapState } from 'vuex'

export default {
  props: {
    deCheckList: {
      type: Array
    },
    decCheckConfigs: {
      type: Array
    },
    decOther: {
      type: Object
    },
    // 是否禁用popover
    disableList: {
      type: Boolean
    },
    moduleName: {
      type: String
    }
  },
  components: {
    decListItem
  },
  data () {
    return {
      itemConfig: businessUtil.getDefaultDecListItemConfig(),
      listItem: {}
    }
  },
  computed: {
    isImport () {
      return this.$store.state[this.moduleName].isImport
    },
    isLook () {
      return this.$store.state[this.moduleName].isLook
    }
  },
  methods: {
    reRender () {
      this.deCheckList.push({})
      this.deCheckList.pop()
    },
    deCellClass ({row, column, rowIndex, columnIndex}) {
      return row[column.property] === 0 ? '' : ('c' + (row[column.property] + 1))
    },
    deCheckRowClick (row) {
      this.listItem = row
      this.itemConfig = this.decCheckConfigs[this.deCheckList.indexOf(row)]
    }
  }
}
</script>

<style>
.c3 {
  background-color:#d2ffd2;
}
.c2 {
  background-color:#ffd0d8;
}
.c1 {
  background-color: #fff;
}
.img-tip{
  background: linear-gradient(45deg,transparent 7px,red 0) left;
  float: right;
  width: 10px;
  height: 10px;
}
</style>
