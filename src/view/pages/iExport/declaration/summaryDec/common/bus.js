
import Vue from 'vue'

const summaryBuses = {}
export default {
  getBus (moduleName) {
    if (!summaryBuses[moduleName]) {
      summaryBuses[moduleName] = new Vue()
    }
    return summaryBuses[moduleName]
  },
  deleteBus (moduleName) {
    delete summaryBuses[moduleName]
  }
}
