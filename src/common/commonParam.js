import util from './util'
import store from '../store/store'
import {storageParamsHandle} from './storageParams'

export default {
  /**
   * @description 过滤得到需要请求的表名
   * @param {String[]} tab 需要查询参数表的名字 如： ['SAAS_CUSTOMS_REL', 'SAAS_TRANSPORT_TYPE']
   * @returns {String[]} 需要请求得到的参数表名字 如：['SAAS_CUSTOMS_REL']
   */
  isRequire: function (tab) {
    let versions = util.isEmpty(window.localStorage.getItem('PARAMVERSION')) ? [] : JSON.parse(window.localStorage.getItem('PARAMVERSION'))
    let nowVersion = store.state.paramVersion
    let filterTab = []
    for (let i in tab) {
      if (!JSON.parse(window.localStorage.getItem(tab[i]))) {
        filterTab.push(tab[i])
      } else {
        if (versions.length === 0) {
          filterTab.push(tab[i])
        } else {
          for (let x in versions) {
            if (versions[x].name === tab[i]) {
              if (versions[x].version !== nowVersion) {
                filterTab.push(tab[i])
              }
              break
            }
          }
        }
      }
    }
    return filterTab
  },
  /**
   * @description 处理后端查询回来的参数
   * @param {Object[]}} result 后端查询回来的参数
   */
  saveParams: function (result) {
    let versions = util.isEmpty(window.localStorage.getItem('PARAMVERSION')) ? [] : JSON.parse(window.localStorage.getItem('PARAMVERSION'))
    let nowVersion = store.state.paramVersion
    for (let key in result) {
      if (storageParamsHandle[key]) {
        result[key] = storageParamsHandle[key](result[key])
      }
      window.localStorage.setItem(key, JSON.stringify(result[key]))
      if (versions.length === 0) {
        versions.push({
          name: key,
          version: nowVersion
        })
      } else {
        let tag = true
        for (let x in versions) {
          if (versions[x].name === key) {
            versions[x].version = nowVersion
            tag = false
            break
          }
        }
        if (tag) {
          versions.push({
            name: key,
            version: nowVersion
          })
        }
      }
    }
    window.localStorage.setItem('PARAMVERSION', JSON.stringify(versions))
  }
}
