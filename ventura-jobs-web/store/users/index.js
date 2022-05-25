import * as Mutation from '@/store/users/mutationTypes'

const state = {
  user: {},
  error: null
}

const getters = {}

const actions = {
  async createUser({ commit }, payload) {
    this.$httpClient.$post('v1/users', payload.user).then(response => {
      commit(Mutation.CREATE_USER, response)
    }, reason => {
      commit(Mutation.CREATE_USER, reason)
    })
  }
}

const mutations = {
  [Mutation.CREATE_USER](state, obj) {
    if(obj.errors != null) {
      state.error = obj
    } else {
      state.error = null;
      state.user = obj;
    }
  }
}

export default {
  namespaced: true,
    state,
    actions,
    getters,
    mutations
}
