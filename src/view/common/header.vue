<template>
  <div class="top-header">
    <div class="logo fl" @click="goToControl" title="返回工作台">
      <img :src="logImgUrl">
    </div>
    <div :class="{'split-line':$store.state.childSys.title!== '', 'fl':true}"></div>
    <div class="title fl">{{$store.state.childSys.title}}</div>
    <div class="user-info">
      <i class="sys-menu-move"  @click='menuShowClick()'></i>
      <el-dropdown @command='userInfoLi' trigger="click" :hide-on-click="false">
        <span class="el-dropdown-link">
          <span class='hidden-xs-only companyName'>{{$store.state.userLoginInfo.companyName}}&nbsp;{{$store.state.userLoginInfo.companyName? '-':''}}&nbsp;</span>
          <span class='hidden-xs-only userName'>{{$store.state.userLoginInfo.userName}}</span>
          <img v-if="$store.state.userLoginInfo.userPhoto!=''" class='user-img' :src="$store.state.userLoginInfo.userPhoto">
          <img v-else class='user-img' src="https://www.5itrade.cn/files/CCBA/admin.png">
        </span>
        <el-dropdown-menu slot="dropdown" class="ccba-control">
          <div class="personBgc"></div>
          <el-dropdown-item  class='hidden-xs-only dropDown-top'>
            <div class="userInfo">
              <div class="headImg" v-if="$store.state.userLoginInfo.userPhoto!=''"><img :src="$store.state.userLoginInfo.userPhoto" alt=""></div>
              <div class="headImg" v-else><img src="https://www.5itrade.cn/files/CCBA/admin.png" alt=""></div>
              <div class="introduce">
                <p class="name">{{$store.state.userLoginInfo.userName}}</p>
                <p class="corpName">{{$store.state.userLoginInfo.companyName}}</p>
                <div class="switchCorp list-icon-admin_switch" @click="switchCorp"><i></i>切换公司</div>
                <div class="glory">
                  <div class="glory-items list-icon-admin_vip" v-for="item in userTitleList" :key="item.titleName">
                    <i></i>
                    <p>{{item.titleName}}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-dropdown-item>
          <el-dropdown-item  class="myCenter">
            <span :class="{'line':$store.state.userLoginInfo.adminFlag === 'true'}" @click="getInfo">个人中心</span>
            <span class="line" @click="serviceCenter" v-if="$store.state.userLoginInfo.adminFlag === 'true'">服务订购</span>
            <span @click="adminCenter" v-if="$store.state.userLoginInfo.adminFlag === 'true'">管理员中心</span>
          </el-dropdown-item>
          <el-dropdown-item command="loginOut" class="dropDown-bottom">
            <div class="list-icon-admin_quit loginOut"><span><i></i>退出登录</span></div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 切换公司对话框 -->
    <el-dialog
      title="切换公司"
      :visible.sync="corpDialogVisible"
      width="400px"
      center>
      <el-radio-group v-model="corpName">
        <div class="radioSelect" v-for="item in corpList" :key="item.corpId">
         <el-radio :label="item.corpName"></el-radio>
        </div>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeCorpName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import config from '../../config/config'
import commonPath from '../../config/commonPath'
import util from '@/common/util'

export default {
  data () {
    return {
      corpDialogVisible: false,
      corpName: '',
      corpList: [],
      userTitleList: [], // 个人荣誉
      totalNum: 0,
      logoClick: false,
      logoConfig: {
        'default': 'https://www.5itrade.cn/files/CCBA/CCBA_logo.png',
        'hegs': 'https://www.5itrade.cn/files/CCBA/HEGS_logo.png',
        'nbwl': 'https://www.5itrade.cn/files/CCBA/NBWL_logo.png'
      },
      logImgUrl: ''
    }
  },
  created () {
    this.corpName = this.$store.state.userLoginInfo.companyName
    this.getUserCorps()
    if (sessionStorage.getItem('userTitleList')) {
      this.userTitleList = JSON.parse(sessionStorage.getItem('userTitleList'))
    }
    this.logImgUrl = this.getLogo()
  },
  mounted () {},
  methods: {
    getLogo () {
      return localStorage.getItem('originSrc') ? this.logoConfig[localStorage.getItem('originSrc')] : this.logoConfig['default']
    },
    // 用户头像下拉菜单点击处理
    userInfoLi (type) {
      switch (type) {
        case 'userInfo':
          window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/userCenter?sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
          break
        case 'loginOut':
          this.loginOut()
          break
      }
    },
    // 退出系统
    loginOut () {
      this.$confirm('您确定退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        util.clearLoginStorage()
        this.$store.commit('userLoginInfo', {
          token: '', // token数据
          userName: '', // 用户姓名
          companyType: '', // 公司类型
          companyCode: '' // 公司id
        })
        this.$router.push('/login')
      }).catch(() => {})
    },
    // 菜单显示事件事件
    menuShowClick () {
      this.$store.commit('menuShow', !this.$store.state.menuShow)
    },
    getInfo (flag) {
      if (flag === 'add') {
        window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/userCenter?tabs=alllinkman&sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
      } else {
        window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/userCenter?sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
      }
    },
    switchCorp () {
      this.corpDialogVisible = true
    },
    getUserCorps () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/user/queryUserCorps',
        data: {},
        router: this.$router,
        success: (res) => {
          this.corpList = res.result
        }
      })
    },
    // 企业切换时
    changeCorpName () {
      // 如果还是选择和登录时一样的
      if (this.corpName === this.$store.state.userLoginInfo.companyName) {
        this.corpDialogVisible = false
        return
      }
      // 找到对应企业的信息
      let temp = this.corpList.find(v => {
        return v.corpName === this.corpName
      })
      // 关闭之前打开的所有页签
      this.$store.dispatch('CloseTabs', 'all')
      this.selectUserCorp(temp.corpId)
      this.$store.commit('userCompanyInfo', {
        companyType: temp.corpType, // 公司类型
        companyCode: temp.corpId, // 公司id
        companyName: temp.corpName,
        sccCode: temp.sccCode,
        adminFlag: temp.adminFlag // 是否是管理员
      })
      this.corpDialogVisible = false
    },
    // 选择公司后重新请求数据
    selectUserCorp (corpId) {
      this.$store.dispatch('ajax', {
        url: 'API@/login/login/selectUserCorp',
        data: {corpId: corpId},
        router: this.$router,
        success: (res) => {
          // 刷新当前页面
          location.reload()
        }
      })
    },
    // 服务中心
    serviceCenter () {
      window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/serviceCenter/account?sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
    },
    // 管理员中心
    adminCenter () {
      window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/companyAdmin/index?corpId=' + this.$store.state.userLoginInfo.companyCode + '&sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
    },
    // 点击logo跳转到控制台
    goToControl () {
      // 防止双击
      if (this.logoClick) return
      this.logoClick = true
      setTimeout(() => {
        this.logoClick = false
      }, 300)
      window.open(commonPath['CCBA'] + '/control?sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.top-header{
  position: relative;
  height: 62px;
  .split-line {
    width: 3px;
    background-color: #fff;
    height: calc(~"(100% - 34px)");
    margin-top: 17px;
  }
  img{
      position: relative;
      display: inline-block;
      height:100%;
      vertical-align: top;
  }
  .user-info{
      position: absolute;
      top:50%;
      transform: translateY(-50%);
      right: 15px;
      z-index: 3001;
      .userName {
          margin-right: 15px;
      }
  }
  .user-img{
    margin-right: 20px;
    width: 36px;
    height:36px;
    -moz-border-radius:50%;
    -webkit-border-radius:50%;
    border-radius:50%;
    vertical-align: middle;
    cursor: pointer;
  }
}
.personBgc {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 50%;
  background:url("https://www.5itrade.cn/files/CCBA/personBGC.png") no-repeat center top;
}
.switchCorp {
  cursor: pointer;
  width: 70px;
  margin: 0 auto;
  color: #287fca;
  font-size: 12px;
  margin-bottom: 5px;
  i {
    margin-right: 7px;
    vertical-align: middle;
  }
}

.loginOut {
  span {
    i {
      margin-right: 7px;
      vertical-align: middle;
    }
    cursor: pointer;
    height: 50px;
    display: block;
    width: 80px;
    margin:0 auto;
    font-size: 14px;
    line-height: 50px;
  }
}
.el-dropdown-link {
  color: #fff;
  .userName {
    margin-right: 15px;
  }
}
.logo {
  width: 380px;
  height: 62px;
  vertical-align: middle;
  cursor: pointer;
}
.title {
  height: 62px;
  line-height: 62px;
  font-size: 24px;
  color: #fff;
  padding-left: 20px;
}
.userInfo {
    width: 340px;
    // height: 400px;
    position: relative;
    background-color:#f4f8fc;
    padding-top: 70px;
    box-sizing: border-box;
    .glory-items {
      display: flex;
      justify-content: center;
      line-height: 24px;
      img {
        width: 20px;
        height: 20px;
        margin-top: 2px;
        margin-right: 6px;
      }
    }
    .headImg {
      height: 100px;
      width: 100px;
      position:absolute;
      left: 50%;
      top: -50px;
      transform: translateX(-50%);
      // background-color: green;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .introduce {
      color: #4c4c4c;
      padding-bottom: 20px;
      .name {
        font-weight: bold;
        font-size: 18px;
      }
    }
}

</style>
