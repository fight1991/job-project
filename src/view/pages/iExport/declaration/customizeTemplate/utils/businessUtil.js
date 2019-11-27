import {decHeadItems} from './decHeadConstants'
import {decListItems} from './decListConstants'
import {containerItems} from './containerConstants'
import {tipsMessage} from './tipsMessages'
function generateTable (items, object = {}) {
  let result = []
  items && items.forEach(item => {
    let itemCode = item.key
    result.push({
      ...item,
      writeTips: getTips(itemCode),
      cellSetting: object[itemCode + 'Cell'] || '',
      cellRule: object[itemCode + 'Fit'] ? +object[itemCode + 'Fit'] : 1,
      preview: object[itemCode + 'View'] || ''
    })
  })
  return result
}
function getTips (code) {
  if (tipsMessage[code]) {
    if (tipsMessage[code].indexOf(':') > -1) {
      let index = tipsMessage[code].indexOf(':')
      return tipsMessage[code].slice(index + 1)
    } else {
      return tipsMessage[code]
    }
  } else {
    return ''
  }
}
export default{
  generateDecHeadTable (data) {
    return generateTable(decHeadItems, data)
  },
  generateDecListTable (data) {
    return generateTable(decListItems, data)
  },
  generateContainerTable (data) {
    return generateTable(containerItems, data)
  }
}
