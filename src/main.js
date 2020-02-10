import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/netWorkUtil'
import App from './App'
import router from './router'
// import Mock from './mock'
import store from './store/store'
import filters from './store/filters'
import utils from './common/util'
import './assets/style/main.less'
import './assets/style/decCommon.less'
// import './assets/style/icon.less'
import './assets/sprites/ccba.css'
import MyComponents from './components'
import Permissions from './directive/permissions'
import {pagination} from './common/mixin/pagination'
import {labelWidth} from './common/mixin/labelWidth'
import dialogDrag from './directive/dialogDrag'
import inputMax from './directive/inputMax'
Vue.use(ElementUI)
let originSrc = ''
if (utils.getQueryString('src')) {
  originSrc = utils.getQueryString('src')
  localStorage.setItem('originSrc', originSrc)
}
Vue.config.errorHandler = function (err, vm, info) {
  utils.errorReport(err, vm, info, store)
}
// Mock.bootstrap() // mock前端模拟数据
Vue.filter('date', filters.date) // 自定义过滤器
Vue.filter('money', filters.money) // 自定义过滤器
Vue.filter('strNum', filters.strNum) // 自定义过滤器
Vue.use(MyComponents) // 自定义组件
Vue.use(Permissions) // 权限指令控制
Vue.use(dialogDrag) // 权限指令控制
Vue.use(inputMax) // focus放大

Vue.prototype.messageTips = (message, type = 'warning') => {
  if (type === 'warning') {
    Vue.prototype.$message({
      dangerouslyUseHTMLString: true,
      message: message,
      customClass: `list-icon-warning-tips`,
      iconClass: `list-icon-warning-tips`,
      type: type
    })
  } else {
    Vue.prototype.$message({
      dangerouslyUseHTMLString: true,
      message: message,
      type: type
    })
  }
}
Vue.mixin(pagination)
Vue.mixin(labelWidth) // 全局混入labelWidth属性
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
