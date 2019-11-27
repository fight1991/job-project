<template>
  <div class="top-header">
    <div class="logo" @click="goToWWW" title="返回官网">
      <img :src="logImgUrl">
    </div>
    <div class="header-right">
      <div class="little-icon hidden-xs-only">
        <!-- <span class="search"></span> -->
        <el-tooltip content="消息中心" placement="top">
          <el-badge :value="totalNum" :max="99" class="item">
            <span class="message" @click="goToMessage"></span>
          </el-badge>
        </el-tooltip>
        <el-tooltip content="我的联系人" placement="top">
          <el-badge :value="newPersonNum" :max="99" class="item">
            <span class="add" @click="getInfo('add')"></span>
          </el-badge>
        </el-tooltip>
        <!-- <span class="date"></span> -->
        <!-- <span class="setting"></span> -->
        <el-tooltip content="工作台设置" placement="top">
          <span class="setting" @click="setPanel"></span>
        </el-tooltip>
      </div>
      <div class="user-info">
        <i class="sys-menu-move"  @click='menuShowClick()'></i>
        <el-dropdown @command='userInfoLi' trigger="click" :hide-on-click="false">
          <span class="el-dropdown-link">
            <span class='hidden-xs-only userName'>{{$store.state.userLoginInfo.userName}}</span>
            <img v-if="$store.state.userLoginInfo.userPhoto!=''" class='user-img' :src="$store.state.userLoginInfo.userPhoto">
            <img v-else class='user-img' src="../../../assets/img/icon/admin.png">
          </span>
          <el-dropdown-menu slot="dropdown" class="ccba-control">
            <div class="personBgc"></div>
            <el-dropdown-item  class='hidden-xs-only dropDown-top'>
              <div class="userInfo">
                <div class="headImg" v-if="$store.state.userLoginInfo.userPhoto!=''"><img :src="$store.state.userLoginInfo.userPhoto" alt=""></div>
                <div class="headImg" v-else><img src="../../../assets/img/icon/admin.png" alt=""></div>
                <div class="introduce">
                  <p class="name">{{$store.state.userLoginInfo.userName}}</p>
                  <p class="corpName">{{$store.state.userLoginInfo.companyName}}</p>
                  <div class="switchCorp" @click="switchCorp">切换公司</div>
                  <div class="glory">
                    <div class="glory-items" v-for="item in userTitleList" :key="item.titleName">
                      <img src="../../../assets/img/icon/admin_vip.png" alt="">
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
              <div class="loginOut"><span>退出登录</span></div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="welcome hidden-xs-only">
      {{$store.state.userLoginInfo.companyName}}
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
    <!-- 工作台设置看板弹窗 -->
    <el-dialog title="工作台设置" :visible.sync="setDialogVisible" width="520px">
      <el-row class="set-dialog-content">
        <el-checkbox-group class="checkboxSet" v-model="checkedSet" @change="handleCheck">
          <el-checkbox v-for="item in setModules" :label="item.itemCode" :key="item.itemCode">{{item.itemDesc}}</el-checkbox>
        </el-checkbox-group>
      </el-row>
      <el-row><el-col :span="24" align="center"><el-button type="primary" size="mini" class="primary-btns" @click="setConfirm">确定</el-button></el-col></el-row>
    </el-dialog>
  </div>
</template>
<script>
import config from '../../../config/config'
import commonPath from '../../../config/commonPath'
import util from '@/common/util'
import defaultImg from '../../../assets/img/icon/CCBA_logo.png'
import hegsImg from '../../../assets/img/icon/HEGS_logo.png'
// import eventBus from '../middle/eventBus.js'
export default {
  data () {
    return {
      corpDialogVisible: false,
      corpName: '',
      corpList: [],
      userTitleList: [], // 个人荣誉
      totalNum: '',
      newPersonNum: '',
      logoClick: false,
      setDialogVisible: false, // 工作台设置弹窗
      setModules: [],
      checkedSet: [],
      logoConfig: {
        'default': defaultImg,
        'hegs': hegsImg
      },
      logImgUrl: ''
    }
  },
  created () {
    this.corpName = this.$store.state.userLoginInfo.companyName
    this.queryNumber()
    this.queryPersonNum()
    this.getUserCorps()
    this.getAllModules()
    // 获取个人荣誉列表
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
    menuShowClick: function () {
      this.$store.commit('menuShow', !this.$store.state.menuShow)
    },
    // 信息详情
    getInfo (flag) {
      if (flag === 'add') {
        window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/userCenter?tabs=alllinkman&sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
      } else {
        window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/userCenter?sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
      }
    },
    // 切换公司选择弹框显示
    switchCorp () {
      this.corpDialogVisible = true
    },
    // 获取当前用户所属的公司列表
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
    // 选择公司后重新请求数据
    selectUserCorp (corpId) {
      this.$store.dispatch('ajax', {
        url: 'API@/login/login/selectUserCorp',
        data: {corpId: corpId},
        router: this.$router,
        success: (res) => {
          // 刷新当前页
          location.reload()
          // // 重新请求左侧菜单列表
          // eventBus.$emit('getAllApp')
          // // 重新请求企业风采
          // eventBus.$emit('getAllCorpDIY')
          // // 重新请求图表数据
          // eventBus.$emit('getEchart')
          // // 重新请求咨询数据
          // eventBus.$emit('getNews')
          // // 重新请求报关单数据
          // eventBus.$emit('getDecList')
        }
      })
    },
    // 企业切换时
    changeCorpName () {
      // 找到对应企业的信息
      let temp = this.corpList.find(v => {
        return v.corpName === this.corpName
      })
      if (temp) {
        this.selectUserCorp(temp.corpId)
        this.$store.commit('userCompanyInfo', {
          companyType: temp.corpType, // 公司类型
          companyCode: temp.corpId, // 公司id
          companyName: temp.corpName,
          sccCode: temp.sccCode,
          adminFlag: temp.adminFlag
        })
      }
      this.corpDialogVisible = false
    },
    // 跳转消息中心
    goToMessage () {
      window.open(config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['COMMON'] + '/newsCenter?type=notify' + '&sysId=' + config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']['SYSID'], '_blank')
    },
    // 获取消息条数
    queryNumber () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-message/message/getUnreadMessageCount',
        data: {},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          let tepNum = res.result[0].unreadCount + res.result[1].unreadCount
          this.totalNum = tepNum === 0 ? '' : tepNum
          clearInterval(this.timeOut)
          this.timeOut = setInterval(() => {
            this.queryNumber()
          }, 300000)
        },
        other: (res) => {
          clearInterval(this.timeOut)
        }
      })
    },
    // 获取新增联系人条数
    queryPersonNum () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/user/getUnreadApplyCount',
        data: {},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.newPersonNum = res.result === 0 ? '' : res.result
          clearInterval(this.timeOut)
          this.timeOut = setInterval(() => {
            this.queryPersonNum()
          }, 300000)
        },
        other: (res) => {
          clearInterval(this.timeOut)
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
    // 跳转到官网
    goToWWW () {
      // 防止双击
      if (this.logoClick) return
      this.logoClick = true
      setTimeout(() => {
        this.logoClick = false
      }, 300)
      window.open(commonPath['CCBA'] + '/index', '_self')
    },
    // 获取已勾选工作台
    setPanel () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/workspace/queryUserWorkspaceItem',
        data: {},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          let list = util.isEmpty(res.result) ? [] : res.result
          this.checkedSet = list.map(e => {
            return e.itemCode
          })
          this.setDialogVisible = true
        }
      })
    },
    // 获取所有工作台选项
    getAllModules () {
      this.$store.dispatch('ajax', {
        url: 'API@/login/workspace/queryAllWorkspaceItem',
        data: {},
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.setModules = util.isEmpty(res.result) ? [] : res.result
        }
      })
    },
    // 多选框改变
    handleCheck () {
      if (this.checkedSet.length > 4) {
        this.$message({
          type: 'error',
          message: '最多设置4个看板'
        })
        this.checkedSet.pop()
      }
    },
    // 设置工作台
    setConfirm () {
      let list = util.simpleClone(this.setModules)
      let arr = []
      this.checkedSet.map(item => {
        return list.filter(e => {
          if (item === e.itemCode) {
            arr.push(e)
          }
        })
      })
      this.$store.dispatch('ajax', {
        url: 'API@/login/workspace/setUserWorkspaceItem',
        data: arr,
        router: this.$router,
        isLoad: false,
        success: (res) => {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.setDialogVisible = false
          this.$emit('resetMiddleInfo')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.top-header{
  position: relative;
  height: 62px;
    img{
        position: relative;
        display: inline-block;
        height:100%;
        vertical-align: top;
    }
    .user-info{
        .userName {
          margin-right: 15px;
          font-size: 16px;
          vertical-align: middle;
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

  .welcome {
    padding-left: 30px;
    background:url("../../../assets/img/icon/top_com.png") no-repeat 0 22px;
    position:absolute;
    left:400px;
    top: 0;
    line-height: 62px;
    color: #fff;
    font-size: 18px;
  }
.personBgc {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 50%;
  background:url("../../../assets/img/icon/personBGC.png") no-repeat center top;
}
.switchCorp {
  cursor: pointer;
  width: 50px;
  margin: 0 auto;
  padding-left: 20px;
  background:url("../../../assets/img/icon/admin_switch.png") no-repeat 0 13px;
  color: #287fca;
  font-size: 12px;
  margin-bottom: 5px;
}
.loginOut {
  span {
    cursor: pointer;
    height: 50px;
    display: block;
    width: 80px;
    padding-left: 15px;
    margin:0 auto;
    font-size: 14px;
    line-height: 50px;
    background:url("../../../assets/img/icon/admin_quit.png") no-repeat 0 17px;
  }
}

.logo {
  display: inline-block;
  width: 380px;
  height: 62px;
  vertical-align: middle;
  cursor: pointer;
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

.header-right {
  position: absolute;
  top:50%;
  transform: translateY(-50%);
  right: 15px;
  z-index: 3001;
  display: flex;
  align-items: center;
  .little-icon {
    box-sizing:border-box;
    height: 62px;
    padding-right: 25px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .search {
      background: url("../../../assets/img/icon/top_search.png") no-repeat;
      background-clip: content-box;
      background-origin: content-box;
    }
    .message {
      background: url("../../../assets/img/icon/top_notice.png") no-repeat;
      background-clip: content-box;
      background-origin: content-box;
    }
    .add {
      background: url("../../../assets/img/icon/top_add.png") no-repeat;
      background-clip: content-box;
      background-origin: content-box;
    }
    .date {
      background: url("../../../assets/img/icon/top_date.png") no-repeat;
      background-clip: content-box;
      background-origin: content-box;
    }
    .setting {
      background: url("../../../assets/img/icon/top_set.png") no-repeat;
      background-clip: content-box;
      background-origin: content-box;
    }
    span {
      float: left;
      width: 20px;
      height: 20px;
      padding: 0 12px;
      cursor: pointer;
    }
  }
}
.set-dialog-content{
  padding-bottom: 80px;
}
.primary-btns{
  border-color: @sys-color-main;
  background-color: @sys-color-main;
  padding: 6px 20px;
}

@media screen and (max-width:900px) {
 .logo {
   width: 120px;
 }
}
@media screen and (max-width:1125px) {

 .welcome {
   display: none;
 }
}
</style>
