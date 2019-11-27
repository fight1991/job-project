<template>
  <!-- 历史商品 -->
  <section>
    <div class='border'>
      <el-form :model="QueryHistoryForm" size="mini" label-position="right">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品编码" label-width="60px">
                <el-input v-model="QueryHistoryForm.codeTs" :maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品名称" label-width="60px">
                <el-input v-model="QueryHistoryForm.gName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="型号" label-width="50px">
                <el-input v-model="QueryHistoryForm.gModel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" >
              <el-form-item label="原产国(地区)" prop="originCountry" label-width="80px">
                  <el-select placeholder="" v-model="QueryHistoryForm.originCountry"
                  @focus="tipsFillMessage('originCountry', 'saasCountry','SAAS_COUNTRY')"
                  remote default-first-option
                  :remote-method="checkParamsList"
                  ref="originCountry" dataRef ='originCountry'
                  clearable filterable style="width:100%">
                  <el-option
                    v-for="item in saasCountry"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
    </div>
    <div style="text-align:center;margin-bottom: 5px;">
      <el-button class="dialog-primary-btn" @click="queryHistoryGoodsList" >查询</el-button>
      <el-button class='dialog-btn' @click="resetForm" >重置</el-button>
    </div>
    <el-table class='sys-table-table' :data="historyGoodsList"
      border highlight-current-row size="mini"
       @current-change="changeFun" height="250"  >
        <el-table-column label="商品编码" prop="codeTs" min-width="80"></el-table-column>
        <el-table-column label="商品名称" prop="gName" min-width="150"></el-table-column>
        <el-table-column label="规格型号" prop="gModel" min-width="150"></el-table-column>
        <el-table-column label="境内收发货人" prop="tradeName" min-width="100"></el-table-column>
        <el-table-column label="原产国(地区)" prop="originCountryValue" min-width="100"></el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <page-box :pagination='paginationInit' @change="pageList"></page-box>
        </el-col>
      </el-row>
    <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
      <el-button class='dialog-primary-btn' @click="configBtn">确定</el-button>
      <el-button class='dialog-btn' @click="cancleBtn">取消</el-button>
    </div>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  name: 'history-goods',
  props: {
    initParams: {
      type: Object,
      default () {
        return {
          iEFlag: 'I'
        }
      }
    }
  },
  data () {
    return {
      QueryHistoryForm: {
        codeTs: '', // 商品代码
        gName: '', // 商品名称
        gModel: '', // 商品规格
        iEFlag: '', // 进出口标识
        originCountry: '' // 原产国(地区)
      },
      historyGoodsList: [], // 存放查询出来的商品列表
      selectedData: {}, // 被选中的商品
      saasCountry: [], // 征免方式
      selectObj: {
        obj: '',
        params: ''
      }
    }
  },
  mounted () {
    this.paginationInit = this.$store.state.pagination
    this.QueryHistoryForm.iEFlag = this.initParams.iEFlag
    if (!util.isEmpty(this.initParams.codeTs)) {
      this.QueryHistoryForm.codeTs = this.initParams.codeTs
      this.pageList(this.$store.state.pagination)
    }
  },
  methods: {
    configBtn () {
      if (this.selectedData.length === 0) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        })
        return false
      }
      this.$emit('backDatas', {goodsInfo: util.simpleClone(this.selectedData)})
    },
    cancleBtn () {
      this.$emit('cancLeData')
    },
    queryHistoryGoodsList () {
      this.pageList(this.$store.state.pagination)
    },
    changeFun (val) {
      this.selectedData = val
    },
    resetForm () {
      this.QueryHistoryForm = {
        codeTs: '', // 商品代码
        gName: '', // 商品名称
        gModel: '', // 商品规格
        iEFlag: this.initParams.iEFlag, // 进出口标识
        originCountry: '' // 原产国(地区)
      }
      this.saasCountry = []
      this.queryHistoryGoodsList()
    },
    // 分页列表
    pageList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/dec/common/getHistoryGoods ',
        data: {
          ...this.QueryHistoryForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.historyGoodsList = res.result
          this.paginationInit = res.page
        }
      })
    },
    tipsFillMessage (value, obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    checkParamsList (query) {
      let keyValue = query.trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      let filterList = []
      if (util.isEmpty(keyValue)) {
        this[this.selectObj.obj] = list.slice(0, 10)
      } else {
        filterList = list.filter(item => {
          let str = ''
          if (this.selectObj.params === 'SAAS_CURR') {
            str = item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField
          } else {
            str = item.codeField + '-' + item.nameField
          }
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        this[this.selectObj.obj] = filterList.slice(0, 10)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
  }
  .el-select-dropdown__item.selected {
    background: #0080ff;
    color: #ffffff;
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background: #dbed8a;
    font-weight: bold;
  }
  .el-select-dropdown__item {
    font-size: 12px;
    padding: 0 15px;
    height: 22px;
    line-height: 22px;
    border: #c0c0c0 solid 1px;
  }
  .el-select-dropdown__list {
    padding: 0;
  }
</style>
