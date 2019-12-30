<template>
  <div class="job-css">
    <div class="title">
      <p class="big">最新发布</p>
      <p class="light">LATEST RELEASE</p>
    </div>
    <div class="mainer">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-menu
            default-active="2"
            :default-openeds="openeds"
            class="el-menu-vertical">
            <el-submenu index="1">
              <template slot="title">
                <span class="menu-title">城市</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">
                  <el-checkbox :indeterminate="isAreaIndeter" v-model="areaCheckAll" @change="areaCheckAllChange">全选</el-checkbox>
                </el-menu-item>
                <el-checkbox-group v-model="areaChecked" @change="areaCheckChange">
                  <div v-for="(item, i) in area" :key="item">
                  <el-menu-item :index="'1-'+i">
                    <el-checkbox :label="item">{{item}}</el-checkbox>
                  </el-menu-item>
                  </div>
                </el-checkbox-group>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <span class="menu-title">职位</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">
                  <el-checkbox :indeterminate="isJobIndeter" v-model="jobCheckAll" @change="jobCheckAllChange">全选</el-checkbox>
                </el-menu-item>
                <el-checkbox-group v-model="jobChecked" @change="jobCheckChange">
                  <div v-for="(item, i) in jobType" :key="item">
                  <el-menu-item :index="'1-'+i">
                    <el-checkbox :label="item">{{item}}</el-checkbox>
                  </el-menu-item>
                  </div>
                </el-checkbox-group>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="18" v-if="isEmptyTip">
          <el-row class="search-null">
            <img src="https://www.5itrade.cn/files/CCBA/search-null.png" alt=""/>
          </el-row>
        </el-col>
        <el-col :span="18" style="padding-right:0;" v-else>
          <div v-for="(item,index) in jobList" :key="index">
            <div class="job-content" @click.prevent="toDetail(item.jobId)">
              <i class="www-icon icon-jiping" v-if="item.urgentYN === 'Y'"></i>
              <div class="content-title">{{item.jobName}}</div>
              <div class="content-list">
                <div class="content-area" v-if="item.area">
                  <i class="www-icon icon-address" title="招聘地区"></i>
                  <span>{{item.area}}</span>
                </div>
                <div class="content-info">
                  <span class="mr26" v-if="item.education">
                    <i class="www-icon icon-Education" title="学历"></i>
                    <span>{{item.education}}</span>
                  </span>
                  <span class="mr26" v-if="item.workYears">
                    <i class="www-icon icon-Years" title="工作年限"></i>
                    <span>{{item.workYears}}</span>
                  </span>
                  <span class="mr26" v-if="item.count">
                    <i class="www-icon icon-Number" title="人数"></i>
                    <span>{{item.count}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
            <!--分页-->
            <el-row class='sys-page-list'>
              <el-col :span="24" align="right">
                  <page-box :pagination='paginationInit' @change="queryList"></page-box>
              </el-col>
            </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import util from '@/common/util'
import {jobTypeList} from '@/config/www'
export default {
  data () {
    return {
      openeds: ['1', '2'],
      areaCheckAll: false,
      areaChecked: [],
      area: [], // 城市
      isAreaIndeter: true,
      jobTypeList: jobTypeList,
      jobCheckAll: false,
      isEmptyTip: false,
      jobChecked: [],
      jobType: [], // 职位
      isJobIndeter: true,
      jobList: [],
      jobTypes: [],
      jobCheckedValue: ''
    }
  },
  created () {
    this.isEmptyTip = false
    this.paginationInit = this.$store.state.pagination
    this.getAreaList()
    this.formatJobType()
    if (!util.isEmpty(this.$route.query)) {
      this.formatJobType(this.$route.query.jobType)
      if (!util.isEmpty(this.$route.query.area)) {
        let str = decodeURIComponent(this.$route.query.area)
        this.areaChecked = str.split('/')
      } else {
        this.areaChecked = []
      }
    }
  },
  watch: {
    'jobChecked': function (newData, oldData) {
      if (!util.isEmpty(newData)) {
        this.jobTypes = []
        for (let i in newData) {
          for (let j in this.jobTypeList) {
            if (this.jobTypeList[j].label === newData[i]) {
              this.jobTypes.push(this.jobTypeList[j].value)
            }
          }
        }
        if (this.jobTypes.length === 0) {
          this.jobCheckedValue = ''
        } else {
          this.jobCheckedValue = this.jobTypes.join('+')
        }
        this.search()
      }
    },
    'areaChecked': function (newData, oldData) {
      if (!util.isEmpty(newData)) {
        this.search()
      }
    }
  },
  methods: {
    // 职位列表查询
    search () {
      this.queryList(this.$store.state.pagination)
    },
    // 职位列表
    queryList (pagination) {
      this.paginationInit = pagination
      let data = {
        areaList: this.areaChecked,
        company: 'longshine',
        source: ['ccba'],
        jobType: this.jobCheckedValue,
        page: pagination
      }
      this.$store.dispatch('ajax', {
        url: 'API@/plat-manager/jobManage/getJobListByType',
        data: data,
        router: this.$router,
        isPageList: true,
        success: (res) => {
          this.jobList = util.isEmpty(res.result) ? [] : res.result
          if (this.jobList.length === 0) {
            this.isEmptyTip = true
          } else {
            this.jobList = res.result
            this.paginationInit = res.page
            this.isEmptyTip = false
          }
        }
      })
    },
    // 跳转到职位详情
    toDetail (jobId) {
      this.$router.push({
        path: '/talent/jobDetail',
        query: {
          jobId: jobId
        }
      })
    },
    // 格式化状态
    formatJobType (val) {
      for (let i in this.jobTypeList) {
        if (val) {
          if (this.jobTypeList[i].value === val) {
            this.jobChecked.push(this.jobTypeList[i].label)
          }
        } else {
          if (this.jobTypeList[i].value) {
            this.jobType.push(this.jobTypeList[i].label)
          }
        }
      }
    },
    // 城市列表
    getAreaList () {
      this.$store.dispatch('ajax', {
        url: 'API@/plat-manager/jobManage/getAreaList',
        data: {},
        router: this.$router,
        success: (res) => {
          this.area = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 城市全选
    areaCheckAllChange (val) {
      if (val === true) {
        this.areaChecked = this.area
      } else {
        this.areaChecked = []
      }
      this.isAreaIndeter = false
    },
    // 城市选择
    areaCheckChange (value) {
      let checkedCount = value.length
      this.areaCheckAll = checkedCount === this.area.length
      this.isAreaIndeter = checkedCount > 0 && checkedCount < this.area.length
    },
    // 职位全选
    jobCheckAllChange (val) {
      if (val === true) {
        this.jobChecked = this.jobType
      } else {
        this.jobChecked = []
      }
      this.isJobIndeter = false
    },
    // 职位选择
    jobCheckChange (value) {
      let checkedCount = value.length
      this.jobCheckAll = checkedCount === this.jobType.length
      this.isJobIndeter = checkedCount > 0 && checkedCount < this.jobType.length
    }
  }
}
</script>

<style lang="less" scoped>
 .job-css {
   padding: 40px 0;
   color: #333;
   .menu-title {
     font-size: 16px;
     color: #333;
   }
   .search-null {
      position: absolute;
      left: 60%;
      top: 50%;
      transform: translate(0,-50%);
   }
   .job-content {
     position: relative;
     cursor:pointer;
     margin-bottom: 10px;
     padding: 20px;
     border: 1px solid #e5e5e5;
     border-radius: 2px;
     .icon-jiping{
        position: absolute;
        right: 0;
        top: 0;
      }
     .content-title {
        color: #333;
        font-size: 16px;
        padding-bottom: 18px;
     }
     .content-list {
        color: #666;
        font-size: 14px;
        .area-img {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          display: inline-block;
        }
        .content-area {
          line-height: 24px;
        }
        .content-info {
          padding-top: 10px;
        }
        .mr26 {
          margin-right: 26px;
        }
     }
   }
 }
</style>
