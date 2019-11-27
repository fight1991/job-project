<template>
  <el-container>
    <el-header height="45px" style='background-color: rgba(0,0,0,0) !important;'>
      <div class='page-tabs'>
        <div :class="{'collapse-btn':true,'btn-rotate':true}" @click='collapseClick()' v-if="isRotate"></div>
        <div :class="{'collapse-btn':true}" @click='collapseClick()' v-else></div>
        <el-tabs class='tabs-items' :value='getCurrentTab.path' type="card"  @tab-remove="delTab" @tab-click="setCurrentTab">
          <el-tab-pane
            :key="'tab-' + index"
            :closable = 'index!==0'
            v-for="(item, index) in openedTabs"
            v-if = '!item.isDel'
            :label="item.title"
            :name="item.path">
          </el-tab-pane>
        </el-tabs>
        <div class='tabs-close-all'>
          <el-dropdown @command="closeTabs">
            <span class="el-dropdown-link">
              关闭操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">关闭全部选项卡</el-dropdown-item>
              <el-dropdown-item command="other">关闭其他选项卡</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main class="abtrate">
      <div class='page-tab-content' v-loading="$store.state.loading" :tab="getCurrentTab.tabId">
        <div style='height:100%;box-sizing: border-box;position: relative' v-for="(item,index) in openedTabs" :key="'panel-' + index" v-show="item.path === getCurrentTab.path && item.isDel ===false">
          <component :is="item.component"></component>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import util from '@/common/util'
import base64 from '@/common/base64'
import router from '@/router'
import store from '@/store/store'
export default {
  data () {
    return {
      isRotate: true
    }
  },
  computed: {
    // 打开的页签列表
    openedTabs () {
      return this.$store.getters.GetOpenedTabs
    },
    // 当前打开的页签
    getCurrentTab () {
      return this.$store.getters.GetCurrentTab
    }
  },
  watch: {},
  mounted () {
    // 通讯消息监听
    window.addEventListener('message', function (event) {
      if (event.data.type === 'editTitle' || event.data.type === 'window-open-sys' || event.data.type === 'window-open' || event.data.type === 'sys-tab' || event.data.type === 'close' || event.data.type === 'refresh' || event.data.type === 'login' || event.data.type === 'declaration' || event.data.type === 'EMS' || event.data.type === 'inner-sys') {
        let symbol = '&'
        // 判断子系统传递的URL是否已包含参数
        if (event.data.data && !util.isEmpty(event.data.data.url) && event.data.data.url.indexOf('?') === -1) {
          symbol = '?'
        }
        let eventData = event.data.data
        let sysData
        let operationType
        if (eventData) {
          sysData = {
            id: eventData && util.isEmpty(eventData.id) ? '' : eventData.id, // 业务的id或标记
            title: eventData.title, // 页签的展示名称
            url: eventData.url, // 要打开的外部URL
            newtabId: eventData.newtabId,
            tabId: eventData.tabId + '', // 页签的id
            index: null, // 页签的数组位置下标
            params: eventData.params // 其他参数
          }
          operationType = eventData.operationType
        }
        switch (event.data.type) {
          case 'window-open':
          // window-open ：由于在iframe中window.open被限制所以提到父级页面执行
            window.open(event.data.data.url, '_blank')
            break
          case 'sys-tab':
          // sys-tab: 从子系统打开2.0的路由页面
            router.push({
              name: event.data.data.url,
              params: {
                sysData: base64.encode(JSON.stringify(sysData))
              },
              query: {
                temp: base64.encode(util.isEmpty(sysData.id) ? '' : sysData.id)
              }
            })
            break
          case 'close':
            // close： 关闭指定的tab
            store.dispatch('CloseTab', sysData.tabId)
            break
          case 'editTitle':
            // close： 关闭指定的tab
            store.commit('SetTabTitle', {title: sysData.title, id: sysData.tabId, newtabId: sysData.newtabId})
            break
          case 'refresh':
            let index = 0
            // refresh：原tab标识改变了，打开最新tab的url
            let data = store.getters.GetOpenedTabs.filter((item, x) => {
              let tag = false
              if ((item.tabId === sysData.tabId) && !item.isDel) {
                tag = true
                index = x
              }
              return tag
            })
            sysData.index = index
            sysData.tabId = `${operationType}-${sysData.id}`
            sysData.url += `${symbol}sysId=CCBA&tabId=${operationType}-${sysData.id}`
            if (data.length !== 0) {
              router.push({
                name: `${store.state.childSys.type}-ems`,
                query: {
                  setId: sysData.tabId
                },
                params: {
                  sysData: base64.encode(JSON.stringify(sysData))
                }
              })
            }
            break
          case 'login':
            setTimeout(() => {
              router.push('/login')
            }, 2000)
            break
          // 子系统新窗口打开子系统,并生成页签
          case 'window-open-sys' :
            if (operationType === 'add' || operationType === 'edit' || operationType === 'look' || operationType === 'copy' || operationType === 'rewEdit' || operationType === 'rewLook') {
              if (operationType === 'copy') {
                sysData.tabId = new Date().getTime() + ''
              }
              sysData.url += `${symbol}sysId=CCBA&tabId=${sysData.tabId}`
              let routeData = router.resolve({
                name: `${event.data.data.type}-new`,
                params: {
                  sysData: base64.encode(JSON.stringify(sysData))
                }
              })
              window.open(routeData.href, '_blank')
            }
            break
          case 'declaration' :
          case 'EMS':
            // 报关单/金二菜单
            if (operationType === 'add' || operationType === 'edit' || operationType === 'look' || operationType === 'copy' || operationType === 'rewEdit' || operationType === 'rewLook') {
              if (operationType === 'copy') {
                sysData.tabId = new Date().getTime() + ''
              }
              sysData.url += `${symbol}sysId=CCBA&tabId=${sysData.tabId}`
              router.push({
                name: `${store.state.childSys.type}-ems`,
                query: {
                  setId: sysData.tabId
                },
                params: {
                  sysData: base64.encode(JSON.stringify(sysData))
                }
              })
            }
            break
          case 'inner-sys':
            router.push({
              name: eventData.routeName,
              params: {
                'pid': eventData.id,
                'setTitle': eventData.title + '-' + eventData.id,
                'setId': eventData.routeName + eventData.operationType + eventData.id
              }
            })
            break
        }
      }
    }, 1000)
  },
  methods: {
    // 修改当前活动tab
    setCurrentTab (tab, event) {
      let data = this.openedTabs.filter(item => {
        return item.path === tab.name
      })
      this.$router.push({
        path: data[0].path,
        query: data[0].query,
        params: data[0].params
      })
      this.$store.commit('SetCurrentTab', data[0])
    },
    // 移除页签
    delTab (tabName) {
      this.$store.dispatch('CloseTab', tabName)
    },
    // 关闭所有或其他页签
    closeTabs (tag) {
      this.$store.dispatch('CloseTabs', tag)
    },
    // 折叠按钮事件
    collapseClick: function () {
      this.$store.commit('collapse', !this.$store.state.collapse)
      this.isRotate = !this.isRotate
    }
  }
}
</script>
<style lang="less">
.page-tabs {
  position: relative;
  height: 41px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  background: #ffffff !important;
  margin-left: 2px;
  .tabs-items {
    margin-left: 40px;
    margin-right: 100px;
  }
  .tabs-close-all{
    position: absolute;
    width: 90px;
    padding: 0 5px;
    height: 40px;
    line-height: 40px;
    top:0;
    right: 0;
    text-align: center;
    border-top:  1px solid #e4e7ed;
    border-left:  1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    .el-dropdown{
      color: #303133;
    }
  }
  .tabs-close-all{
    position: absolute;
    width: 90px;
    padding: 0 5px;
    height: 39px;
    line-height: 39px;
    top:0;
    right: 0;
    text-align: center;
    border-left:  1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    .el-dropdown{
      color: #303133;
    }
  }
  .el-tabs__header{
    margin: 0;
  }
  .collapse-btn{
    position: absolute;
    left:0;
    top:0;
    width: 40px;
    height: 40px;
    background:url("../../assets/img/icon/btn-right.png")  no-repeat center center;
    border-bottom: 1px solid #e4e7ed;
    cursor: pointer;
    z-index: 22;
  }
  .btn-rotate {
    background:url("../../assets/img/icon/btn-left.png") no-repeat center center;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border-radius:0;
  }
}
.page-tab-content{
  transform: translate(0,0);
  position: relative;
  height: 100%;
  padding: 0 5px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
