import storageUtils from '../utils/storageUtils';

export default {
  user: null,
  mutations: {
    SAVE_USER(state, user) {
      state.user = user
      storageUtils.put('user', user)
    }
  },
  actions: {
    login({ commit, state }, user) {
      commit('SAVE_USER', user)
    },
    'change-user'({ commit, state }, userInfo) {
      let user = state.user
      commit('SAVE_USER', { ...user, ...userInfo })
    }
  },
  getters: {
    user: state => {
      return state.user || storageUtils.get('user') || {}
    }
  }

}