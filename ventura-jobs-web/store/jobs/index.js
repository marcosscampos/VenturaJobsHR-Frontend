import * as Mutation from "@/store/jobs/mutationTypes";

const state = {
  jobs: [],
  job: {},
  erro: null
}

const getters = {}

const actions = {
  async getAllJobs({commit}, payload) {
    this.$httpClient.$get(`v1/jobs?page=${payload.page}&size=${payload.size}`).then(response => {
      commit(Mutation.GET_ALL_JOBS, response)
    }, (reason) => {
      commit(Mutation.GET_ALL_JOBS, reason)
    })
  },

  async getCompanyPublishedJobs({commit}, payload) {
    this.$httpClient.$get('/v1/jobs/company').then(response => {
      commit(Mutation.GET_COMPANY_PUBLISHED_JOBS, response)
    }, (reason) => {
      commit(Mutation.GET_COMPANY_PUBLISHED_JOBS, reason)
    })
  },

  async createJob({commit}, payload) {
      return new Promise((resolve, reject) => {
        this.$httpClient.$post('/v1/jobs', payload.jobList).then(job => {
            resolve(job)
            commit(Mutation.CREATE_JOB, job)
        }).catch(error => {
          commit(Mutation.CREATE_JOB, error)
        })
      })

  }
}

const mutations = {
  [Mutation.GET_ALL_JOBS](state, jobs) {
    state.jobs = jobs
  },
  [Mutation.GET_COMPANY_PUBLISHED_JOBS](state, jobs) {
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
