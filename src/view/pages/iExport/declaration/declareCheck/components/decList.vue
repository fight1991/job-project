<template>
  <div>
    <el-table
      class='sys-table-table dec-table'
      ref='deCheckTable'
      :data="deCheckList" height="250"
      :cell-class-name="deCellClass" @row-click='deCheckRowClick' border highlight-current-row size="mini">
      <el-table-column label="项号" prop="gNoAllColor" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.gNo}}</span>
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
          <el-popover
            popper-class="sys-dec-class"
            placement="right-start"
            trigger="hover"
            width="500"
            @show="mouseEnter(scope.row)"
            @hide="elementVisible=false">
            <decelement-view v-if="elementVisible" :datas="decElementPara" :btnIsShow="false"></decelement-view>
            <div class="pop-loading" v-else><i class="el-icon-loading"></i></div>
            <div slot="reference">
              <span>{{scope.row.gName}}</span><br>
              <span>{{scope.row.gModel}}</span>
            </div>
          </el-popover>
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
      <dec-list-item v-on="$listeners" v-bind="$attrs" :moduleName="moduleName" :itemConfig="itemConfig" :listItem="listItem" @changeColor="reRender" :disableList="disableList" :decOther="decOther"></dec-list-item>
    </div>
  </div>
</template>
<script>
import decListItem from './decListItem'
import businessUtil from '../utils/businessUtil'
import decelementView from '../../decPage/decList/components/decelement'

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
    decListItem,
    decelementView
  },
  data () {
    return {
      itemConfig: businessUtil.getDefaultDecListItemConfig(),
      listItem: {},
      decElementPara: {
        checkedgoods: '', // 商品数据
        opeType: 'look', // 操作类型 add 新增  edit 编辑  look 查看
        gModel: '', // 规格型号
        iEFlag: '', // 进出口标志 I 进口 E 出口
        gName: '',
        gtin: '' // gtin码
      },
      elementVisible: false
    }
  },
  computed: {
    isImport () {
      return this.$store.state[this.moduleName].isImport
    },
    isLook () {
      return this.$store.state[this.moduleName].isLook
    },
    iEFlag () {
      return this.$store.state[this.moduleName].iEFlag
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
    },
    // 根据商品编号codeTs查询商品列表参数
    getCheckedgoods (codeTs, callback) {
      this.$post({
        url: 'API@/saas-dictionary/dictionary/getGoods',
        data: {
          codeTs,
          iEFlag: this.iEFlag
        },
        isLoad: false,
        success: (res) => {
          if (res.result && res.result[0]) {
            callback && callback(res.result[0])
          }
        }
      })
    },
    mouseEnter ({codeTs, gModel, gName, gTin}) {
      this.decElementPara.gModel = gModel
      this.decElementPara.gName = gName
      this.decElementPara.gTin = gTin
      this.getCheckedgoods(codeTs, (res) => {
        this.decElementPara.checkedgoods = res
        this.elementVisible = true
      })
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
.pop-loading {
  display: flex;
  justify-content:center;
  font-size: 26px;
}
</style>
