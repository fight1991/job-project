export default {
  namespaced: true,
  state () {
    return {
      ticketIds: []
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
    }
  }
}
