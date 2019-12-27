import router from '@/router'
import util from '@/common/util'
export default {
  state: {
    // 主页
    homeTab: {},
    // 当前活动页签
    currentTab: {},
    // 所有打开的页签数据
    tabsList: []
  },
  getters: {
    // 获取 打开的 tab 列表
    GetOpenedTabs (state) {
      return state.tabsList
    },
    // 获取 当前点击打开的 tab
    GetCurrentTab (state) {
      return state.currentTab
    }
  },
  mutations: {
    // 更改Title
    SetTabTitle (state, data) {
      state.tabsList.some(item => {
        if ((item.path === data.path || item.tabId === data.id) && !item.isDel) {
          item.title = data.title
          if (data.newtabId) {
            item.tabId = data.newtabId
          }
          return true
        }
        return false
      })
    },
    // 新增页签数据
    SetTabData (state, data) {
      // 判断 tab 项是否已存在
      let tabExist = state.tabsList.find(item => {
        return (item.tabId === data.tabId || item.path === data.path) && item.isDel === false
      })
      if (!tabExist) {
        state.tabsList.push(data)
      }
      if (tabExist && data.path !== tabExist.path) {
        // 如果携带了参数
        if (!util.objIsEmpty(data.query) || !util.objIsEmpty(data.params)) {
          let index = state.tabsList.findIndex(item => {
            return item === tabExist
          })
          data.query = { ...data.route.query }
          data.params = { ...data.route.params }
          state.tabsList.splice(index, 1, data)
        } else {
          data = tabExist
        }
      }
      state.currentTab = data
    },
    // 指定位置新增页签数据
    SetTabDataIndex (state, data) {
      // 判断 tab 项是否已存在
      let tabExsit = state.tabsList.find(i => i.path === data.path && i.isDel === false)
      if (!tabExsit) {
        state.tabsList.splice(data.other, 1, data)
      }
      state.currentTab = data
    },
    // 设置当前活动tab
    SetCurrentTab (state, data) {
      state.currentTab = data
    },
    SetChildSysData (state, data) {
      let result = {
        tabId: 'index',
        title: '首页',
        component: resolve => require([`@/view/pages/index.vue`], resolve),
        path: `/${data}/index`,
        route: {
          path: `/${data}/index`,
          name: `${data}-index`,
          query: {},
          params: {}
        },
        other: '',
        isDel: false
      }
      state.homeTab = result
      state.tabsList[0] = result
    }
  },
  actions: {
    // 关闭页签:data :url 或 tabId
    CloseTab ({state, commit, dispatch}, data) {
      let closeIndex = 0
      state.tabsList.some((item, index) => {
        if ((item.path === data || item.tabId === data) && !item.isDel) {
          closeIndex = index
          return true
        }
        return false
      })
      dispatch('RemoveTab', closeIndex)
    },
    // 从 tab 列表 移除 tab
    RemoveTab ({state, commit}, closeIndex) {
      let data = state.tabsList[closeIndex]
      state.tabsList.some(item => {
        if (item.path === data.path && !item.isDel) {
          item.isDel = true // isDel 为什么显示这个页面的参数
          item.component = '' // component 这个页签下的内容
          return true
        }
        return false
      })
      let firstNotDelIndex = 0 // 关闭后需要显示相邻的页签
      let showTab = [] // 存放被删除页签前面的所有已显示的页签位置
      state.tabsList.some((item, index) => {
        if (index === closeIndex) {
          return true
        }
        if (index > 0 && !item.isDel) {
          // firstNotDelIndex = index
          showTab.push(index)
          // return true
        }
        return false
      })
      if (showTab.length > 0) {
        firstNotDelIndex = showTab.pop()
      }
      if (state.currentTab.path === data.path) {
        let index = firstNotDelIndex
        let currentTab = state.tabsList[index]
        commit('SetCurrentTab', currentTab)
        if (JSON.stringify(currentTab.route.params) === '{}') {
          router.push({
            path: currentTab.route.path,
            query: currentTab.route.query
          })
        } else {
          router.push({
            name: currentTab.route.name,
            params: currentTab.route.params
          })
        }
      }
    },
    // 关闭页签 all关闭所有；other关闭其他；
    CloseTabs ({state, commit}, type) {
      if (type === 'all') {
        state.tabsList = [state.homeTab]
        commit('SetCurrentTab', state.tabsList[0])
        router.push({
          path: state.homeTab.path
        })
      } else if (type === 'other') {
        if (state.tabsList.length > 1) {
          state.tabsList.forEach(item => {
            if (item.path !== state.currentTab.path) {
              item.isDel = true
              item.component = ''
            }
          })
        }
      }
    }
  }
}
