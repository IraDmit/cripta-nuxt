import axios from 'axios'

export const state = {
  coinsList: null,
}

export const mutations = {
  setCoinsList(state, list) {
    state.coinsList = list
  },
}

export const actions = {
  async fetchCoinsList({ commit, state }) {
    if (!state.coinsList) {
      const coinlist = await axios.get(
        `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
      )
      commit('setCoinsList', coinlist.data.Data)
    }
  },
}

export const getters = {
  getCoinsList(state) {
    return state.coinsList ? state.coinsList : 'error to load list'
  },
}
