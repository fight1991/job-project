import XLSX from 'xlsx'
import Vue from 'vue'

let workbook

export default{
  initWorkBook (url) {
    return new Promise(function (resolve, reject) {
      Vue.prototype.$getBinaryFile({
        url: url,
        successCallBack: (res) => {
          var data = new Uint8Array(res.data)
          workbook = XLSX.read(data, {
            type: 'array'
          })
          resolve()
        }
      })
    })
  },
  getSheetNames () {
    return workbook.SheetNames || []
  },
  getCellValue (sheetName, cell) {
    let cellObj = workbook.Sheets[sheetName][cell]
    return cellObj ? cellObj.v : ''
  }
}
