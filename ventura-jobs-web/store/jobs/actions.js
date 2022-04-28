const getAllJobs = async function ({commit}, payload) {
  this.$httpClient.$get(`/v1/jobs/criteria?Page=${payload.page}&Size=${payload.size}`).then(response => {
    commit('GET_ALL_JOBS', response.Data)
  }, (reason) => {
    commit('GET_ALL_JOBS', reason)
  })
}


export default {
  getAllJobs
}
