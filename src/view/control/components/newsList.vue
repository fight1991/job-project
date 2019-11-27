<template>
  <section class="newsList-bg">
    <el-container class="newsList-content">
      <el-aside class="content-tab" width="200px">
        <el-menu
          :default-active="activeName"
          class="el-menu-vertical-demo"
          @select="getIndexPath">
          <el-menu-item index="Announcement">
            <span slot="title">平台公告</span>
          </el-menu-item>
          <el-menu-item index="PolicyLaw">
            <span slot="title">政策法规</span>
          </el-menu-item>
          <el-menu-item index="IndustryNews">
            <span slot="title">行业资讯</span>
          </el-menu-item>
          <el-menu-item index="Information">
            <span slot="title">通知公告</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="content-list">
        <div class="list-detail">
          <div class="default" v-if="newsList.length === 0"><img src="../../../assets/img/icon/news.png" alt=""></div>
          <div class="per-row"  v-for="item1 in newsList" :key="item1.pid" v-else>
            <div class="content" @click="getDetail(item1.pid)">
              <span :class="{'new-title':true, 'text-cut':true, flag:item1.isNew}">{{item1.title}}</span>
            </div>
            <div class="date">{{item1.createTime}}</div>
          </div>
        </div>
        <!--分页-->
        <el-row class='sys-page-list pagination'>
          <el-col :span="24" align="right">
            <page-box :pagination="paginationInit" @change="getNews"></page-box>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </section>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'Announcement',
      newsList: []
    }
  },
  created () {
    this.paginationInit = this.$store.state.pagination
    this.activeName = this.$route.query.type
    this.getNews()
  },
  methods: {
    getIndexPath (index) {
      this.activeName = index
      this.getNews()
    },
    // 跳转到咨询详情页
    getDetail (pid) {
      const {href} = this.$router.resolve({
        path: '/news/detail',
        query: {
          pid: pid
        }
      })
      window.open(href, '_blank')
    },
    // 获取咨询列表
    getNews (pagination) {
      this.paginationInit = pagination
      this.$store.dispatch('ajax', {
        url: 'API@/login/workspace/getNewsList',
        data: {
          conditions: '',
          endTime: '',
          startTime: '',
          type: this.activeName,
          page: pagination || this.$store.state.pagination
        },
        isLoad: false,
        router: this.$router,
        success: (res) => {
          this.newsList = this.addFlag(res.result, 3)
          this.paginationInit = res.page
        }
      })
    },
    // 处理新闻列表时间,如果是3天之内的添加标识符,day为天数
    addFlag (arr, day) {
      arr.forEach(v => {
        let tempTime = new Date(v.createTime).getTime()
        let currentTime = new Date().getTime()
        let time = (currentTime - tempTime) / 1000 / 60 / 60 / 24
        if (time - day <= 0) {
          v.isNew = true
        } else {
          v.isnew = false
        }
      })
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
.newsList-bg {
  background-color: #E5F2FF;
  height: 100%;
  width: 100%;
  padding-top: 35px;
  .content-tab {
    // text-align: center;
    .el-menu {
      border-right: none;
    }
  }
  .newsList-content {
    width: 75%;
    min-width: 950px;
    height: 90%;
    margin: 0 auto;
  }
  .content-list {
    padding: 0;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    margin-left: 30px;
    padding-bottom: 60px;
    position: relative;
    .pagination {
      position: absolute;
      right: 30px;
      bottom: 10px;
    }
    .list-detail {
      height: 100%;
      overflow-y: auto;
      position: relative;
      padding: 20px 30px 0 20px;
      box-sizing: border-box;
    }
  }
  .default {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    img {
      display: block;
      margin: 0 auto
    }
  }
  .title {
    position:absolute;
    left: 20px;
    top: 5px;
    line-height: 40px;
    color: @font-color-main;
    font-weight: bold;
  }
  .content {
    font-size: 12px;
    color: @font-color-main;
    cursor: pointer;
    flex: 1;
    position: relative;
    .new-title {
      padding-right: 35px;
      position: absolute;
      max-width: 100%;
    }
  }
  .flag::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 14px;
    right: 0;
    top: 1px;
    background: url("../../../assets/img/icon/new.png") no-repeat
  }
  .date {
    text-align: right;
    color: @font-color-title;
    font-size: 12px;
    width: 160px;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .per-row {
    padding: 10px 20px;
    display: flex;
    &:hover {
      background-color: #E5F2FF;
    }
  }
}
</style>
