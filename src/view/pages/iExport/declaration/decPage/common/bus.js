
import Vue from 'vue'

const buses = {}
export default {
  getBus (moduleName) {
    if (!buses[moduleName]) {
      buses[moduleName] = new Vue()
    }
    return buses[moduleName]
  },
  deleteBus (moduleName) {
    delete buses[moduleName]
  }
}
