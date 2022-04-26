import axios from 'axios'

const getAllJobs = ({commit}) => {
  axios.get('/v1/jobs').then(response => {
    commit('GET_ALL_JOBS', response.data)
  }, (reason) => {
    commit('GET_ALL_JOBS', reason)
  })
}


export default {
  getAllJobs
}
