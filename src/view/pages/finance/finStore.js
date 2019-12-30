export default {
  namespaced: true,
  state () {
    return {
      ticketIds: [],
      billIds: [] // 费用项id
    }
  },
  getters: {
    getTictetIs (state) {
      return state.ticketIds
    }
  },
  mutations: {
    setTicketIds (state, data) {
      state.ticketIds = data
    },
    setBillIds (state, data) {
      state.billIds = data
    }
  }
}
