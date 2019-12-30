<template>
<!-- 表体——智能归类组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title="上传文件"
      :visible.sync="ORCuploadvisable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @opened='openClassifyGoodsAfter'
      :before-close='closeCompnent'
      v-dialogDrag
      width="800px">
      <el-table
        ref="classifyGoodsTable"
        :data="classifyGoodsList"
        highlight-current-row border
        size='mini'
        height="300"
        @filter-change="filterHandler"
        max-height="300" style="width: 100%">
        <el-table-column type='index' align='right' label="序号" min-width="50"></el-table-column>
        <el-table-column property="hsCode" label="商品编码" min-width="100"
          :filters="codeTsFilters"
          :filter-multiple="false"
          column-key="hsCode">
        <template slot-scope="scope">
          <span>{{scope.row.hsCode || '-'}} </span>
        </template>
        </el-table-column>
        <el-table-column property="hsDescription" label="商品编码描述" min-width="250">
          <template slot-scope="scope">
            <span>{{scope.row.hsDescription || '-'}} </span>
          </template>
        </el-table-column>
        <el-table-column property="dataWord" label="品名关键字" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.dataWord || '-'}} </span>
          </template>
        </el-table-column>
        <el-table-column property="wordCount" align='right' label="申报次数(企业内部)" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.wordCount || '-'}} </span>
          </template>
        </el-table-column>
        <el-table-column property="occupationRatio" align='right' label="申报次数(全国口岸)" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.occupationRatio || '-'}} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align='center' min-width="70" >
          <template slot-scope="scope">
            <a href="javascript:void(0)" class="list-icon-use border-0" title="使用" @click.stop="useData(scope.row)"><i class='dec-i'></i></a>
            <a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click.stop="lookTax(scope.row)"><i class='dec-i'></i></a>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-row class='sys-page-list'>
        <el-col :span="24" align="right">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 智能归类 -->
    <tax-Detail :taxDetailVisible.sync='taxDetailVisible' :taxForm='taxForm'></tax-Detail>
  </section>
</template>
<script>
import util from '@/common/util.js'
// import decUtil from '../../common/decUtil'
import taxDetail from './taxDetail'
export default {
  name: 'classify-Goods',
  components: {
    taxDetail
  },
  props: {
    ORCuploadvisable: {
      type: Boolean,
      default: false
    },
    gName: {
      type: String,
      default: ''
    },
    iEFlag: {
      type: String,
      default: 'I'
    }
  },
  data () {
    return {
      classifyGoodsList: [],
      taxDetailVisible: false,
      codeTsFilters: [],
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      taxForm: {}
    }
  },
  methods: {
    openClassifyGoodsAfter () {
      this.classifyGoodsList = []
      this.codeTsFilters = []
      this.pageList({querykey: this.gName, page: this.page})
    },
    filterHandler (value) {
      this.queryHs = this.hsCode[0]
      this.pageList({
        querykey: this.gName,
        hs: this.queryHs,
        page: this.page
      })
    },
    handleCurrentChange (page) {
      this.page.pageIndex = page
      this.pageList({
        querykey: this.gName,
        hs: this.queryHs,
        page: this.page
      })
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.pageList({
        querykey: this.gName,
        hs: this.queryHs,
        page: this.page
      })
    },
    pageList (param) {
      this.$post({
        url: 'API@/saas-document-center/category/queryCategory',
        data: param,
        success: (res) => {
          this.total = res.page.total
          if (res.result.categoryList) {
            this.classifyGoodsList = res.result.categoryList
          }
          if (res.result.hsList) {
            for (let i in res.result.hsList) {
              this.codeTsFilters.push({
                text: res.result.hsList[i].name,
                value: res.result.hsList[i].hsCodePre
              })
            }
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    },
    // 关闭组件
    closeCompnent () {
      this.classifyGoodsList = []
      this.codeTsFilters = []
      this.$emit('update:classifyGoodsVisible', false)
    },
    useData (row) {
      this.$emit('close:classifyGoods', {
        codeTs: row.hsCode
      })
    },
    lookTax (row) {
      // 查询税则详情
      this.$post({
        url: 'API@/saas-dictionary/decParam/getComplexDetail',
        data: {hsCode: row.hsCode},
        success: (res) => {
          this.taxForm = util.isEmpty(res.result) ? {} : res.result
          this.taxDetailVisible = true
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.dec-i{
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  background-color: #fff
}
.border-0 {
  border: 0;
  margin-right: 5px;
}
.el-table__column-filter-trigger i {
    color: blue;
    font-size: 14px;
}
.el-table th>.cell.highlight {
    color: #fff;
}
</style>
