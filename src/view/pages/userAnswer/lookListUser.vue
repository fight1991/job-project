<template>
  <section class='sys-main'>
     <!-- 头部 -->
     <!-- 新建按钮 -->
      <el-row class='mg-b-15'>
        <el-col :span="18">
          <el-button type="primary" size="mini" @click="openDialog('new','new')">我要提问</el-button>
        </el-col>
      </el-row>
      <!-- 新建按钮 end-->
    <el-row class = "query-condition">
      <el-form label-width="0px" :model="queryForm" size="mini" label-position="right">
    <!-- 查询条件 -->
        <el-row :gutter="50">
          <el-col :span="4" :xs="12">
            <el-form-item class="form-item-mg0">
              <el-input size="mini" clearable v-model="queryForm.searchText" :maxlength="500" placeholder="关键词"></el-input>
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
              <div class='user-answer-line sys-td-l text-over-hid list-icon-answer-jing' :title="scope.row.questionTitle"><i v-if="scope.row.recommendFlag === 'true'"></i>{{scope.row.questionTitle}}</div>
            </template>
          </el-table-column>
          <el-table-column label="最近操作时间" min-width="100">
            <template slot-scope="scope">
              <div class='sys-td-c'>{{scope.row.updateTime || '-'}}</div>
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
                <el-button type="text" class="table-icon  list-icon-look" @click="toLook(scope.row.questionId, scope.row.userId)" title="查看"><i></i></el-button>
                <el-button type="text" class="table-icon  list-icon-delete" v-if="scope.row.statusName==='待解答'" @click="deleteUser(scope.row.questionId)" title="删除"><i></i></el-button>
                <el-button type="text" class="table-icon  list-icon-edit" v-if="scope.row.statusName==='待解答'" @click="openDialog('edit',scope.row.questionId)" title="修改"><i></i></el-button>
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
      <el-dialog :modal-append-to-body='false' :title="isEdit? '修改' : '我要提问'" :visible.sync="setDialogVisible" :close-on-click-modal="false" width="800px">
        <el-form label-width="65px" :model="dialogForm" ref="dialogForm" size="mini" label-position="right" class="order-label">
          <el-row>
            <el-col :span="24">
              <el-form-item label="提问时间">
                <el-date-picker size="mini"  v-model="dialogForm.createTime" type="datetime" :clearable="false"></el-date-picker>
              </el-form-item>
              <el-form-item label="问题描述">
                <el-input size="mini" type="textarea" :autosize="{minRows:5}" :maxlength="500" v-model="dialogForm.questionTitle"></el-input>
              </el-form-item>
              <el-form-item label="图片" prop="url">
                <el-upload
                  class="avatar-uploader"
                  action="http://127.0.0.1"
                  :show-file-list="false"
                  :before-upload="beforeUpload1">
                  <span v-if="imageUrl1" class="img-url list-icon-delete_all">
                    <img :src="imageUrl1" class="detail-img">
                    <i class="close-icon" @click.stop="delImg('1')"></i>
                  </span>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-upload
                  class="avatar-uploader"
                  action="http://127.0.0.1"
                  :show-file-list="false"
                  :before-upload="beforeUpload2">
                  <span v-if="imageUrl2" class="img-url">
                    <img :src="imageUrl2" class="detail-img">
                    <i class="close-icon" @click.stop="delImg('2')"></i>
                  </span>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-upload
                  class="avatar-uploader"
                  action="http://127.0.0.1"
                  :show-file-list="false"
                  :before-upload="beforeUpload3">
                  <span v-if="imageUrl3" class="img-url">
                    <img :src="imageUrl3" class="detail-img">
                    <i class="close-icon" @click.stop="delImg('3')"></i>
                  </span>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button size="mini" type="primary" @click="saveDialogForm">提交问题</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  data () {
    return {
      queryForm: {
        searchText: ''
      },
      isEdit: false,
      setDialogVisible: false,
      dialogForm: {
        questionId: '',
        createTime: new Date(),
        questionTitle: '',
        questionPic: ''
      },
      urlList: [],
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      resultList: []
    }
  },
  created () {
    this.queryForm = {
      searchText: ''
    }
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
    // 提问
    openDialog (type, questionId) {
      this.dialogForm = {
        questionId: '',
        createTime: new Date(),
        questionTitle: '',
        questionPic: ''
      }
      this.urlList = []
      this.imageUrl1 = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
      this.setDialogVisible = true
      if (type === 'edit') {
        this.isEdit = true
        this.getQuestionDetail(questionId)
      } else {
        this.isEdit = false
      }
    },
    // 图片删除
    delImg (i) {
      if (i === '1') {
        this.imageUrl1 = ''
      } else if (i === '2') {
        this.imageUrl2 = ''
      } else {
        this.imageUrl3 = ''
      }
      this.urlList.splice(i - 1, 1)
      this.dialogForm.questionPic = this.urlList.join(',')
    },
    // 修改返显
    getQuestionDetail (questionId) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/getQuestionDetail',
        data: {'id': questionId},
        router: this.$router,
        success: (res) => {
          this.dialogForm.questionTitle = res.result.questionTitle
          this.dialogForm.questionId = questionId
          this.dialogForm.questionPic = res.result.questionPic
          this.dialogForm.createTime = res.result.createTime
          if (res.result.questionPic) {
            this.urlList = res.result.questionPic.split(',')
            for (let i = 0; i < this.urlList.length; i++) {
              this.imageUrl1 = this.urlList[0]
              this.imageUrl2 = this.urlList[1]
              this.imageUrl3 = this.urlList[2]
            }
          }
        }
      })
    },
    // 提交问题
    saveDialogForm () {
      if (util.isEmpty(this.dialogForm.questionTitle)) {
        this.$message({
          message: '问题描述不能为空',
          type: 'error'
        })
        return false
      }
      let url = ''
      if (this.isEdit) {
        url = 'API@/saas-activity/expertQA/updateQuestion'
      } else {
        this.dialogForm.questionId = ''
        url = 'API@/saas-activity/expertQA/proposeQuestion'
      }
      this.dialogForm.createTime = util.dateFormat(this.dialogForm.createTime)
      this.$store.dispatch('ajax', {
        url: url,
        data: this.dialogForm,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.setDialogVisible = false
          this.search()
        }
      })
    },
    beforeUpload1 (file) {
      this.beforeUpload(file, '1')
    },
    beforeUpload2 (file) {
      this.beforeUpload(file, '2')
    },
    beforeUpload3 (file) {
      this.beforeUpload(file, '3')
    },
    // 上传图片前的格式及大小判断
    beforeUpload (file, info) {
      let fileType = util.getFileTypeByName(file.name)
      if (!(fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/tif') || !(Math.ceil(file.size / 1024) <= 4096)) {
        this.$message({
          message: '上传图片大小不超过4M的jpg、png、tif格式',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        let date = util.dateFormat(new Date(), 'yyyyMM')
        param.append('filePath', '/longshine/document/expert_qa/' + date)
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          isLoad: false,
          router: this.$router,
          success: (res) => {
            if (info === '1') {
              this.imageUrl1 = res.result.url
              this.urlList.push(this.imageUrl1)
            } else if (info === '2') {
              this.imageUrl2 = res.result.url
              this.urlList.push(this.imageUrl2)
            } else {
              this.imageUrl3 = res.result.url
              this.urlList.push(this.imageUrl3)
            }
            this.dialogForm.questionPic = this.urlList.join(',')
          }
        })
      }
      return false
    },
    // 列表
    queryList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/getMyQuestionList4User',
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
    // 删除
    deleteUser (id) {
      this.$confirm('确认删除该问题么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-activity/expertQA/deleteQuestion',
          data: {'id': id},
          router: this.$router,
          success: (res) => {
            this.search()
          }
        })
      }).catch(() => {
      })
    },
    // 查看
    toLook (questionId, userId) {
      this.$router.push({
        name: 'userAnswer-detail',
        params: {
          questionId: questionId,
          userId: userId,
          setTitle: '查看详情-' + questionId,
          setId: questionId + 'user'
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.user-answer-line{
  i{
    vertical-align: middle;
    margin-right: 5px;
  }
}
.detail-img{
  display: inline-block;
  padding-right: 10px;
  margin-bottom: 12px;
  width: 90px;
  height: 90px;
  cursor: pointer;
}
.avatar-uploader {
  position: relative;
  display: inline-block;
  margin-right: 20px;
}
.avatar-uploader-icon {
  border: 1px solid #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.close-icon{
  width: 20px;
  height: 20px;
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
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
