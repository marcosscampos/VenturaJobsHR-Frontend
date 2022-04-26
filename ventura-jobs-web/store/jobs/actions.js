const getAllJobs = function ({commit}) {
  this.$axios.$get('/v1/jobs').then(response => {
    commit('GET_ALL_JOBS', response)
  }, (reason) => {
    commit('GET_ALL_JOBS', reason)
  })
}


export default {
  getAllJobs
}
