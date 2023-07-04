export const state = {
  fixed_tickers: [],
}

export const mutations = {
  setFixedTickers(state, data) {
    state.fixed_tickers = data
  },
  removeItem(state, data, idx) {
    state.fixed_tickers = data.splice(idx, 1)
  },
  addItem(state, data) {
    state.fixed_tickers.push(data)
  },
}

export const actions = {
  updateFixedTickers({ commit }, data) {
    commit('setFixedTickers', data)
  },
  async updateLocalStorage({ commit }) {
    await commit('setFixedTickers', JSON.parse(localStorage?.fixed_tickers))
  },
}

export const getters = {
  getFixedTickers(state) {
    return state.fixed_tickers
  },
}
