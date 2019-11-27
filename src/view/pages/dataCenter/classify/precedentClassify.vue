<template>
  <section class='query-main sys-main' style="margin:0px">
    <!-- 查询条件 -->
    <div class = "query-condition data-center" style="background-color:white;">
      <!-- -->
      <el-form :label-width="labelFormWidth.four" size="mini">
        <el-row>
          <el-col :md="8" :lg="8">
            <el-form-item label="商品描述" >
              <el-input v-model="queryForm.querykey" maxlength="70" clearable placeholder="请输入商品描述(必填)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="8" :lg="8">
            <el-form-item label="归类线路" class="select-Color">
              <el-select v-model="queryForm.classType" style="width:100%;">
                <el-option v-for="item in classList" :key="item.value+'class'" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :lg="8">
            <el-button size="mini" type="primary" @click="queryList" style="width:96px;">智能归类</el-button>
             <!-- <el-button size="mini" style="padding: 8px 20px;" @click="resetFun">重置</el-button> -->
          </el-col>
        </el-row>
        <!-- 查询条件 end-->
      </el-form>
    </div>
    <!-- 主显示框 -->
    <div class='query-table' style="margin-top:20px;background-color:white;padding:12px 18px;">
      <!-- 列表table开始 -->
      <el-table class='sys-table-table' border highlight-current-row :header-cell-style="{'text-align':'center'}" :height='500' size="mini" :data="queryresult" ref="reference" @filter-change="filterHandler">
        <el-table-column width="60" label="序号"  min-width="160" type="index" align="center">
        </el-table-column>
        <el-table-column label="商品编码" width="120" prop="hsCode" :filters="hsCodeList" :filter-multiple="false" column-key="hsCode">
          <template slot-scope="scope">
            <div class="customer-table-c">
              {{scope.row.hsCode || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品编码描述" min-width="100">
           <template slot-scope="scope">
             <div class="text-over-hid customer-table-l" :title="scope.row.hsDescription">
              {{scope.row.hsDescription || '-'}}
              </div>
            </template>
        </el-table-column>
        <el-table-column label="品名关键词" min-width="100">
           <template slot-scope="scope">
             <div class="text-over-hid customer-table-l" :title="scope.row.dataWord">
              {{scope.row.dataWord || '-'}}
              </div>
            </template>
        </el-table-column>
        <el-table-column label="申报次数" min-width="130">
          <template slot-scope="scope">
            <div class="customer-table-r" :title="scope.row.wordCount">
            {{scope.row.wordCount || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <div class='sys-td-c'>
              <el-button type="text" class="table-icon  list-icon-look" @click="toDetail(scope.row.hsCode)" title="查看"><i></i></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class='sys-page-list mg-b-30'>
        <el-col :span="24" align="right">
          <page-box :pagination='pagination' @change="queryList()"></page-box>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import util from '@/common/util'

export default {
  data () {
    return {
      queryForm: {
        'querykey': '',
        'classType': '3'
      },
      hsCodeList: [{
        text: '',
        value: ''
      }],
      classList: [
        {
          value: '1',
          label: '线路一'
        },
        {
          value: '2',
          label: '线路二'
        },
        {
          value: '3',
          label: '线路三'
        }
      ],
      queryresult: [],
      pagination: {
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数据条数
        total: 0 // 总条数
      }
    }
  },
  created () {
    this.resetFun()
  },
  mounted () {
  },
  methods: {
    queryList () {
      if (this.queryForm.querykey.trim().length === 0) {
        this.$message({
          message: '请输入商品描述',
          type: 'warning'
        })
        return false
      } else {
        let url = ''
        if (this.queryForm.classType === '1') {
          url = 'API@/saas-document-center/category/queryCategory'
        } else if (this.queryForm.classType === '2') {
          url = 'API@/saas-document-center/category/queryCategorySecond'
        } else {
          url = 'API@/saas-document-center/category/queryCategoryThird'
        }
        this.$store.dispatch('ajax', {
          url: url,
          data: {...this.queryForm, page: this.pagination},
          isPageList: true,
          router: this.$router,
          success: (res) => {
            if (!util.isEmpty(res.result)) {
              this.queryresult = res.result.categoryList
              this.hsCodeList = []
              if (res.result.hsList.length !== 0) {
                res.result.hsList.forEach(item => {
                  var object = {}
                  object.value = item.hsCodePre
                  object.text = item.name
                  this.hsCodeList.push(object)
                })
              }
              this.pagination = res.page
            }
          }
        })
      }
    },
    filterHandler (value) {
      if (value.hsCode) {
        this.queryForm.hs = value.hsCode[0]
      }
      this.queryList()
    },
    // 重置
    resetFun () {
      this.queryForm.hs = ''
      this.queryForm = {
        'querykey': '',
        'classType': '3'
      }
    },
    // 详情
    toDetail (hsCode) {
      this.$router.push({
        path: '/passParams/taxRule/detail',
        query: {
          'hsCode': hsCode
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.customer-table-c{
  text-align: center
}
.customer-table-r{
  text-align: right
}
.customer-table-l{
  text-align: left
}
.cus-i{
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    background-color: #fff
}
.data-center {
  .el-col {
    padding-right: 50px;
  }
}
</style>
