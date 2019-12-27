<template>
  <section class='sys-main'>
     <!-- 头部 -->
    <el-row class = "query-condition">
      <el-form label-width="0px" :model="queryForm" size="mini" label-position="right">
    <!-- 查询条件 -->
        <el-row :gutter="50">
          <el-col :span="4" :xs="12">
            <el-form-item class="form-item-mg0">
              <el-input size="mini" clearable v-model="queryForm.searchText" placeholder="关键词"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12">
          <el-form-item class="form-item-mg0">
            <el-select v-model="queryForm.type" size="mini" clearable placeholder="选择状态">
              <el-option
                v-for="item in statusList"
                :key="item.code+'type'"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="10" :xs="12">
            <el-button size="mini" type="primary" @click="search()">筛选</el-button>
          </el-col>
        </el-row>
       <!-- 查询条件 end-->
      </el-form>
    </el-row>
      <!-- 头部 end-->
      <!-- 主显示框 -->
      <div class='query-table'>
        <!-- 列表 list -->
        <el-table class='sys-table-table'  height="498px"
          border highlight-current-row size="mini"
          :data="resultList">
          <el-table-column label="序号" type="index" width="50" align="center">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{(paginationInit.pageIndex-1)*paginationInit.pageSize+(scope.$index+1)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="问题" min-width="180">
            <template slot-scope="scope">
              <div class='expert-answer-line sys-td-l text-over-hid list-icon-answer-jing' :title="scope.row.questionTitle"><i  v-if="scope.row.recommendFlag === 'true'"></i>{{scope.row.questionTitle}}</div>
            </template>
          </el-table-column>
          <el-table-column label="提问时间" min-width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.createTime || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.statusName || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>
                <el-button type="text" class="table-icon  list-icon-edit" v-if="scope.row.statusName ==='未解决'" @click="toLook(scope.row.questionId, scope.row.userId)" title="解答"><i></i></el-button>
                <el-button type="text" class="table-icon  list-icon-look" v-else @click="toLook(scope.row.questionId, scope.row.userId)" title="查看"><i></i></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-row class='sys-page-list'>
            <el-col :span="24" align="right">
                <page-box :pagination='paginationInit' @change="queryList"></page-box>
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
        searchText: '',
        status: ''
      },
      statusList: [],
      resultList: []
    }
  },
  created () {
    this.queryForm = {
      searchText: '',
      status: ''
    }
    this.getStatus()
    this.paginationInit = this.$store.state.pagination
    this.search()
  },
  mounted () {
  },
  methods: {
    // 查询
    search () {
      this.queryList(this.$store.state.pagination)
    },
    // 列表
    queryList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/getAllQuestionList4Expert',
        data: {
          ...this.queryForm,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.resultList = util.isEmpty(res.result) ? [] : res.result
          this.paginationInit = res.page
        }
      })
    },
    // 状态
    getStatus () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/getSelectConstantList',
        data: {'type': 'EXPERT_QA-EXPERT-ALL_QUESTION'},
        router: this.$router,
        success: (res) => {
          this.statusList = res.result
        }
      })
    },
    // 查看
    toLook (questionId, userId) {
      this.$router.push({
        name: 'expertAnswer-detail',
        params: {
          questionId: questionId,
          userId: userId,
          setTitle: '查看详情-' + questionId,
          setId: questionId + 'expert'
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.expert-answer-line{
  i{
    vertical-align: middle;
    margin-right: 5px;
  }
}
.query-condition {
  background-color: #fff;
  padding: 20px;
}
.query-table {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  font-size: 14px;
  color: @font-color-main;
}
</style>
