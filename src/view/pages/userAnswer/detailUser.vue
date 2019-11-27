<template>
  <section class='sys-main'>
     <el-row class = "query-condition">
         <el-row class="content-title">
          <span>
            <img v-if="titleData.userPhoto!=null" class='user-img' :src="titleData.userPhoto">
            <img v-else class='user-img' src="../../../assets/img/answer-head.png">
            <div class="user-name">
              {{titleData.userName}}
            </div>
          </span>
          <span class="left-cls">
            <div class="answer-title">
              <img src="../../../assets/img/answer-jing.png" class='jing-img' v-if="titleData.recommendFlag === true">
              <span class="word-break">{{titleData.questionTitle}}</span>
              <span class="small-title" v-if="titleData.categoryName">
                <img src="../../../assets/img/answer-bq.png" class='small-img'>
                {{titleData.categoryName}}
                </span>
            </div>
            <div>
              <img v-for="(item,index) in titleData.urlList" :key="index+'title'" :src="item" @click.stop="showfile(item)" class="detail-img">
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
              <img v-else class='user-img' src="../../../assets/img/answer-head.png">
              <div class="user-name">
                {{item.userName}}
              </div>
            </span>
            <span class="left-cls">
              <div class="answer-content">{{item.answerText}}</div>
              <div class="content-img">
                <img v-for="(item1,index1) in item.urlList" :key="index1+'img'" :src="item1" @click.stop="showfile(item1)" class="detail-img">
              </div>
              <div v-if="item.acceptFlag === 'false'">
                <span v-if="titleData.solvedFlag === 'false' && titleData.userId === $store.state.userLoginInfo.userId" class="slo-right">
                 <el-button size="mini" type="primary" @click="acceptAnswer(item.answerId)">已解决</el-button>
                </span>
                <span class="create-time">
                  <span class="small-title">
                    <img src="../../../assets/img/answer-bq.png" class='small-img'>
                    {{item.categoryName}}
                  </span>
                  <span class="mg-l-10">
                    {{item.createTime}}
                  </span>
                </span>
              </div>
              <div v-if="item.acceptFlag === 'true'" class="slo-right">
                <span class="create-time">
                  <span class="small-title">
                    <img src="../../../assets/img/answer-bq.png" class='small-img'>
                    {{item.categoryName}}
                  </span>
                  <span class="mg-l-10">
                    {{item.createTime}}
                  </span>
                </span>
                <img src="../../../assets/img/answer-sol.png" class="sol-img">
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
  </section>
</template>

<script>
import util from '@/common/util'
export default {
  data () {
    return {
      titleData: {
        questionId: '',
        userId: '',
        questionTitle: '',
        userName: '',
        userPhoto: '',
        createTime: '',
        categoryName: '',
        recommendFlag: '',
        urlList: []
      },
      listData: [{
        userId: '',
        answerId: '',
        answerText: '',
        userName: '',
        userPhoto: '',
        createTime: '',
        urlList: []
      }]
    }
  },
  created () {
    this.titleData.questionId = this.$route.params.questionId
    this.titleData.userId = this.$route.params.userId
    this.paginationInit = this.$store.state.pagination
    this.getQuestionDetail()
    this.queryList(this.$store.state.pagination)
  },
  mounted () {
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('detailUser') === -1) {
        return
      }
      this.titleData.questionId = to.params.questionId
      this.titleData.userId = to.params.userId
      this.paginationInit = this.$store.state.pagination
      this.getQuestionDetail()
      this.queryList(this.$store.state.pagination)
    }
  },
  methods: {
    // 文件点击事件
    showfile (url) {
      if (!util.isEmpty(url)) {
        util.fileView(url)
      }
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
    // 已解决
    acceptAnswer (answerId) {
      this.$confirm('是否确认已解决？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-activity/expertQA/acceptAnswer',
          data: {'id': answerId},
          router: this.$router,
          success: (res) => {
            this.queryList(this.$store.state.pagination)
            this.getQuestionDetail()
          }
        })
      })
    },
    // 修改返显
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
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 10px;
      .jing-img {
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
  .slo-right {
    height: 60px;
  }
  .create-time {
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 14px;
      color: #999;
    }
}
.left-cls {
    margin-left: 20px;
  }
.user-name {
    padding-top: 10px;
    padding-left: 10px;
    width: 60px;
    text-align: center;
  }
.small-title {
  padding-left: 20px;
  font-size: 14px;
  font-weight: normal;
  color: #999;
  .small-img {
    font-weight: normal;
    padding-right: 4px;
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
  margin-bottom: 12px;
  width: 90px;
  height: 90px;
  cursor: pointer;
}
.avatar-uploader {
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
