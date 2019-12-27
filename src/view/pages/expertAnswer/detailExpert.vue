<template>
  <section class='sys-main'>
     <el-row class = "query-condition">
         <el-row class="content-title">
          <span>
            <img v-if="titleData.userPhoto!=null" class='user-img' :src="titleData.userPhoto">
            <img v-else class='user-img' src="https://www.5itrade.cn/files/CCBA/answer-head.png">
            <div class="user-name">
              {{titleData.userName}}
            </div>
          </span>
          <span class="left-cls">
            <div class="answer-title list-icon-answer-jing">
              <i v-if="titleData.recommendFlag === 'true'"></i>
              <span class="word-break">{{titleData.questionTitle}}</span>
            </div>
            <div>
              <img v-for="(item,index) in titleData.urlList" :key="index+'title'" :src="item" @click.stop="showfile(item)" class="detail-img">
            </div>
            <div>
              <el-button size="mini" type="primary" @click="openDialog('new', 'new')" v-if="titleData.iAnsweredFlag === 'false' && titleData.solvedFlag === 'false'">我要解答</el-button>
              <el-button size="mini" type="primary" @click="openDialog('newadd', 'new')" v-if="titleData.iAnsweredFlag === 'true' && titleData.solvedFlag === 'false'">追加解答</el-button>
            </div>
            <div class="create-time">
              {{titleData.createTime}}
            </div>
          </span>
         </el-row>
         <el-row v-for="(item,index) in listData" :key="index">
          <el-row class="content-list">
            <span>
              <img v-if="item.userPhoto!=null" class='user-img' :src="item.userPhoto">
              <img v-else class='user-img' src="https://www.5itrade.cn/files/CCBA/answer-head.png">
              <div class="user-name">
                {{item.userName}}
              </div>
            </span>
            <span class="left-cls">
              <div class="answer-content">{{item.answerText}}</div>
              <div class="content-img">
                <img v-for="(item1,index1) in item.urlList" :key="index1+'img'" :src="item1" @click.stop="showfile(item1)" class="detail-img">
              </div>
              <div>
                <span v-if="titleData.iAnsweredFlag === 'true' && titleData.solvedFlag === 'false' &&  item.userId === $store.state.userLoginInfo.userId">
                 <el-button size="mini" type="primary" @click="openDialog('edit', item.answerId)">编辑</el-button>
                </span>
                <div class="slo-right">
                  <span class="create-time">
                    <span class="small-title list-icon-answer-bq">
                      <i></i>
                      {{item.categoryName}}
                    </span>
                    <span class="mg-l-10">
                      {{item.createTime}}
                    </span>
                  </span>
                  <img v-if="item.acceptFlag === 'true'" src="https://www.5itrade.cn/files/CCBA/answer-sol.png" class="sol-img">
                </div>
              </div>
            </span>
          </el-row>
         </el-row>
         <el-row class='sys-page-list'>
          <el-col :span="24" align="right">
              <page-box :pagination='paginationInit' @change="queryList"></page-box>
          </el-col>
        </el-row>
     </el-row>
     <el-dialog :modal-append-to-body='false' :title="dialogTitle" :visible.sync="setDialogVisible" :close-on-click-modal="false" width="800px">
        <el-form label-width="65px" :model="dialogForm" ref="dialogForm" size="mini" label-position="right" class="order-label">
          <el-form-item label="答案描述">
            <el-input size="mini" type="textarea" :autosize="{minRows:5}" :maxlength="500" v-model="dialogForm.answerText"></el-input>
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="提问分类">
                <el-select v-model="dialogForm.categoryId" size="mini">
                  <el-option
                    v-for="item in categoryList"
                    :key="item.categoryId+'type'"
                    :label="item.categoryName"
                    :value="item.categoryId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="解答时间">
                <el-date-picker size="mini"  v-model="dialogForm.createTime" type="datetime" :clearable="false"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mg-t-10">
            <el-form-item label="">
              <el-checkbox v-model="checked">精选提问</el-checkbox>
            </el-form-item>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button size="mini" type="primary" @click="saveDialogForm">提交回答</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  data () {
    return {
      dialogTitle: '',
      titleData: {
        questionId: '',
        userId: '',
        questionTitle: '',
        userName: '',
        userPhoto: '',
        createTime: '',
        recommendFlag: '',
        solvedFlag: '',
        iAnsweredFlag: '',
        statusName: '',
        urlList: []
      },
      listData: [{
        userId: '',
        answerId: '',
        answerText: '',
        userName: '',
        userPhoto: '',
        categoryName: '',
        createTime: '',
        urlList: []
      }],
      checked: false,
      isEdit: false,
      setDialogVisible: false,
      dialogForm: {
        questionId: '',
        answerId: '',
        createTime: new Date(),
        answerText: '',
        categoryId: 5,
        answerPic: ''
      },
      urlList: [],
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      categoryList: [{
        categoryId: '',
        categoryName: ''
      }]
    }
  },
  created () {
    this.titleData.questionId = this.$route.params.questionId
    this.titleData.userId = this.$route.params.userId
    this.paginationInit = this.$store.state.pagination
    this.getQuestionDetail()
    this.queryList(this.$store.state.pagination)
    this.getCategory()
  },
  mounted () {
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('detailExpert') === -1) {
        return
      }
      this.titleData.questionId = to.params.questionId
      this.titleData.userId = to.params.userId
      this.paginationInit = this.$store.state.pagination
      this.getQuestionDetail()
      this.queryList(this.$store.state.pagination)
      this.getCategory()
    }
  },
  methods: {
    // 文件点击事件
    showfile (url) {
      if (!util.isEmpty(url)) {
        util.fileView(url)
      }
    },
    // 解答
    openDialog (type, answerId) {
      if (this.titleData.recommendFlag === 'true') {
        this.checked = true
      } else {
        this.checked = false
      }
      this.dialogForm = {
        questionId: this.titleData.questionId,
        answerId: '',
        createTime: new Date(),
        answerText: '',
        categoryId: 5,
        answerPic: ''
      }
      this.urlList = []
      this.imageUrl1 = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
      this.setDialogVisible = true
      if (type === 'edit') {
        this.dialogTitle = '编辑'
        this.isEdit = true
        this.getAnswerDetail(answerId)
      } else {
        this.isEdit = false
        if (type === 'newadd') {
          this.dialogTitle = '追加解答'
        } else {
          this.dialogTitle = '我要解答'
        }
      }
    },
    // 精选提问
    recommendQuestion () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/recommendQuestion',
        data: {'id': this.titleData.questionId, 'recommend': this.checked},
        router: this.$router,
        success: (res) => {}
      })
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
    // 编辑反显
    getAnswerDetail (answerId) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/getAnswerDetail',
        data: {'id': answerId},
        router: this.$router,
        success: (res) => {
          this.dialogForm.answerText = res.result.answerText
          this.dialogForm.answerId = answerId
          this.dialogForm.categoryId = res.result.categoryId
          this.dialogForm.answerPic = res.result.answerPic
          this.dialogForm.createTime = res.result.createTime
          if (res.result.answerPic) {
            this.urlList = this.skipEmptyArray(res.result.answerPic.split(','))
            for (let i = 0; i < this.urlList.length; i++) {
              this.imageUrl1 = this.urlList[0]
              this.imageUrl2 = this.urlList[1]
              this.imageUrl3 = this.urlList[2]
            }
          }
        }
      })
    },
    // 解答提交
    saveDialogForm () {
      if (util.isEmpty(this.dialogForm.answerText)) {
        this.$message({
          message: '答案描述不能为空',
          type: 'error'
        })
        return false
      }
      this.recommendQuestion()
      let url = ''
      if (this.isEdit) {
        url = 'API@/saas-activity/expertQA/updateAnswer'
      } else {
        this.dialogForm.answerId = ''
        url = 'API@/saas-activity/expertQA/proposeAnswer'
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
          this.getQuestionDetail()
          this.queryList(this.$store.state.pagination)
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
            this.dialogForm.answerPic = this.urlList.join(',')
          }
        })
      }
      return false
    },
    // 问题详情
    getQuestionDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/getQuestionDetail',
        data: {'id': this.titleData.questionId},
        router: this.$router,
        success: (res) => {
          this.titleData = res.result
          if (res.result.questionPic) {
            this.titleData.urlList = this.skipEmptyArray(res.result.questionPic.split(','))
          }
        }
      })
    },
    // 列表
    queryList (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/getAnswerList',
        data: {
          'questionId': this.titleData.questionId,
          page: pagination
        },
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.listData = util.isEmpty(res.result) ? [] : res.result
          this.listData.forEach((item) => {
            if (item.answerPic) {
              item.urlList = this.skipEmptyArray(item.answerPic.split(','))
            }
          })
          this.paginationInit = res.page
        }
      })
    },
    // 去空
    skipEmptyArray (arr) {
      var a = []
      arr.forEach(item => {
        if (item !== '') {
          a.push(item)
        }
      })
      return a
    },
    // 分類
    getCategory () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-activity/expertQA/queryCategoryList',
        data: {},
        router: this.$router,
        success: (res) => {
          this.categoryList = res.result
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.query-condition {
  background-color: #fff;
  padding: 20px;
  color: #4c4c4c;
  .content-title {
    display: flex;
    padding-bottom: 36px;
    border-bottom: 1px solid #ccc;
    .answer-title {
      margin-top: 16px;
      font-weight: bold;
      font-size: 16px;
      padding-bottom: 10px;
      i {
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 4px;
      }
    }
  }
  .content-list {
    display: flex;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    .answer-content {
      word-break: break-all;
      margin-top: 16px;
      font-size: 14px;
    }
  }
  .content-img {
    padding-top: 20px;
  }
  .sol-img {
      position: absolute;
      right: 0;
      bottom: 36px;
    }
  .create-time {
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 14px;
      color: #999;
    }
}
.sol-img {
  position: absolute;
  right: 0;
  bottom: 36px;
}
.slo-right {
    height: 60px;
  }
.left-cls {
    margin-left: 20px;
  }
.user-name {
    padding-top: 10px;
    width: 60px;
    text-align: center;
  }
.small-title {
  padding-left: 20px;
  font-size: 14px;
  color: #999;
  i {
    padding-right: 4px;
    vertical-align: -4px;
    font-weight: normal;
  }
}
.user-img{
    margin-right: 20px;
    width: 60px;
    height:60px;
    -moz-border-radius:50%;
    -webkit-border-radius:50%;
    border-radius:50%;
    vertical-align: middle;
    cursor: pointer;
  }
.detail-img{
  display: inline-block;
  padding-right: 20px;
  margin-bottom: 20px;
  width: 90px;
  height: 90px;
  cursor: pointer;
}
.close-icon{
  width: 20px;
  height: 20px;
  display: inline-block;
  position: absolute;
  right: 20px;
  top: 0;
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
</style>
