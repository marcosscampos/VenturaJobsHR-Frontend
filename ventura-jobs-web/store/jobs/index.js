import * as Mutation from './mutationTypes';

const state = {
  jobs: [],
  job: {},
  error: {}
}

const getters = {}

const actions = {
  async getAllJobs({commit}, payload) {
    this.$axios.$get('/v1/jobs').then(response => {
      commit(Mutation.GET_ALL_JOBS, response)
    }, (reason) => {
      commit(Mutation.GET_ALL_JOBS, reason)
    })
  },
  async getJob({commit}, payload) {
    this.$axios.$get(`/v1/jobs/${payload.id}`).then(response => {
      commit(Mutation.GET_JOB, response)
    }, (reason) => {
      commit(Mutation.GET_JOB, reason)
    })
  }
}

const mutations = {
  [Mutation.GET_ALL_JOBS](state, payload) {
    if (payload.errors != null || payload.statusCode === 500) {
      state.error = payload
    } else {
      state.jobs = payload
      state.error = null
    }
  },
  [Mutation.GET_JOB](state, payload) {
    state.job = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

