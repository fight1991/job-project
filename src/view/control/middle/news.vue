<template>
  <div class="news">
    <div class="title">实时资讯</div>
    <div class="moreIcon"  @click="goToNewsList(activeName)">
      <img :src="moreIcon" alt="">
    </div>
    <el-tabs v-model="activeName" @tab-click="getNews">
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in newsInfo" :key="item.name">
        <div class="default" v-if="item.newsList.length === 0"><img src="../../../assets/img/icon/news.png" alt=""></div>
        <div class="per-row"  v-for="item1 in item.newsList" :key="item1.pid" v-else>
          <div class="content" @click="getDetail(item1.pid)">
            <span :class="{'new-title':true, 'text-cut':true, flag:item1.isNew}">{{item1.title}}</span>
          </div>
          <div class="date">{{item1.createTime}}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import eventBus from './eventBus'
export default {
  data () {
    return {
      moreIcon: require('../../../assets/img/oper_more.png'),
      dates: '',
      activeName: 'Announcement',
      newsInfo: [
        {
          label: '平台公告',
          name: 'Announcement',
          newsList: []
        },
        {
          label: '政策法规',
          name: 'PolicyLaw',
          newsList: []
        },
        {
          label: '行业资讯',
          name: 'IndustryNews',
          newsList: []
        }
        // {
        //   label: '通知公告',
        //   name: 'Information',
        //   newsList: []
        // }
      ]
    }
  },
  created () {
    this.getNews()
    eventBus.$on('getNews', this.getNews)
  },
  methods: {
    // 获取咨询列表
    getNews () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/workspace/getNewsList',
        data: {
          conditions: '',
          endTime: '',
          startTime: '',
          type: this.activeName,
          page: {
            pageSize: 10,
            pageIndex: 1
          }
        },
        showErrorMessage: false,
        isLoad: false,
        router: this.$router,
        success: (res) => {
          this.newsInfo.forEach(v => {
            if (v.name === this.activeName) {
              v.newsList = this.addFlag(res.result, 3)
            }
          })
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
    },
    // 跳转到咨询详情页
    getDetail (pid) {
      const {href} = this.$router.resolve({
        path: 'news/detail',
        query: {
          pid: pid
        }
      })
      window.open(href, '_blank')
    },
    // 跳转到新闻列表页
    goToNewsList (type) {
      const {href} = this.$router.resolve({
        path: 'news/newsList',
        query: {
          type: type
        }
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.news {
  position: relative;
  padding: 10px 20px;
  .moreIcon {
    padding: 10px;
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
    z-index: 66;
    img {
      width: 16px;
      height: 16px;
    }
  }
  .default {
    img {
      display: block;
      margin: 35px auto 0 auto
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
    width: 200px;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .per-row {
    padding: 10px 0;
    display: flex;
  }
}
</style>
