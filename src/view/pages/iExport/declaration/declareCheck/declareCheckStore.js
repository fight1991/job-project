export default {
  namespaced: true,
  state () {
    return {
      isImport: true,
      isLook: false,
      chkPayment: '是'
    }
  },
  mutations: {
    changeCheckPage (state, {key, value}) {
      if (state[key] !== undefined) {
        Object.assign(state, {[key]: value})
      }
    }
  },
  actions: {

  },
  getters: {

  }
}
