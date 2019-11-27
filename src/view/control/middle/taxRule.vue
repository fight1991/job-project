<template>
  <div class="taxrule">
    <div class="title">税则查询</div>
    <div class="taxtule-content">
      <el-form size="mini" :model="queryForm" class="mg-b-15">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item>
              <el-input v-model="queryForm.keywords" placeholder="商品编码/商品名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button class="btn-borderR" @click="search()">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table class="taxrule-table" :data="resultList" size="mini" height="245px">
        <el-table-column label=" " width="100" align="left" type="index"></el-table-column>
        <el-table-column label="商品编码" prop="codeTs" min-width="130" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="gName" min-width="200" align="left"></el-table-column>
        <el-table-column label="申报要素、退税" min-width="130" align="center">
          <template slot-scope="scope">
            <a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click="toDetail(scope.row.pkSeq)"><i class='dec-i'></i></a>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-more" v-show="resultList.length !== 0"><span @click="toList()"><i></i>查看更多</span></div>
    </div>
  </div>
</template>
<script>
import util from '@/common/util'
import config from '../../../config/config'
export default {
  data () {
    return {
      queryForm: {
        keywords: ''
      },
      resultList: []
    }
  },
  created () {
    this.paginationInit = this.$store.state.pagination
    this.search()
  },
  methods: {
    // 查询
    search () {
      this.pageList(this.$store.state.pagination)
    },
    // 获取表格
    pageList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/decParam/getComplexList',
        data: {...this.queryForm, page: pagination},
        router: this.$router,
        success: (res) => {
          let list = util.isEmpty(res.result) ? [] : res.result
          this.resultList = list.splice(0, 6)
          this.paginationInit = res.page
        }
      })
    },
    // 跳转详情
    toDetail (pid) {
      let host = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['HOST']
      let sysId = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID']
      window.open(host + `/passParams/taxRule/detail?id=${pid}&sysId=${sysId}`, '_blank')
    },
    // 跳转列表
    toList () {
      let host = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['HOST']
      let sysId = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID']
      window.open(host + `/passParams/taxRule/list?keywords=${this.queryForm.keywords}&sysId=${sysId}`, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.taxrule {
  position: relative;
  padding: 10px 20px;
  .title {
    line-height: 30px;
    color: @font-color-main;
    font-weight: bold;
  }
  .taxtule-content{
    margin-top: 15px;
    .btn-borderR{
      border-radius: 20px;
      padding: 8px 20px;
    }
    .list-icon-look{
      i{
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 6px;
        vertical-align: middle;
        margin-top: -2px;
        background: url('../../../assets/img/icon/icon-lookH.png') no-repeat;
      }
    }
    .table-more{
      text-align: center;
      color: #999;
      padding: 15px 0 10px;
      span{
        cursor: pointer;
        i {
          display: inline-block;
          width: 18px;
          height: 18px;
          background: url('../../../assets/img/icon/oper_more_1.png')no-repeat;
          vertical-align: middle;
          margin: -3px 5px 0 0;
        }
      }
    }
  }
}
</style>
