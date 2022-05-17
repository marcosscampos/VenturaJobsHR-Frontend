import * as Mutation from "@/store/jobs/mutationTypes";

const state = {
  jobs: [],
  job: {},
  erro: null
}

const getters = {}

const actions = {
  async getAllJobs({commit}, payload) {
    this.$httpClient.$get(`/v1/jobs?page=${payload.page}&size=${payload.size}`).then(response => {
      commit(Mutation.GET_ALL_JOBS, response.data)
    }, (reason) => {
      commit(Mutation.GET_ALL_JOBS, reason)
    })
  },

  async createJob({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$httpClient.$post('/v1/jobs', payload.jobList).then(job => {
          resolve(job.success)
          commit(Mutation.CREATE_JOB, job.success)
      }).catch(error => {
        reject(error.response.data)
        commit(Mutation.CREATE_JOB, error.response.data)
      })
    })
  }
}

const mutations = {
  [Mutation.GET_ALL_JOBS](state, jobs) {
    state.jobs = jobs
  },
  [Mutation.CREATE_JOB](state, obj) {
    if (obj.errors != null) {
      state.erro = obj;
    } else {
      state.erro = null;
      state.job = obj;
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
