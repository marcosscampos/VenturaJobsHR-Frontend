import mutations from "@/store/jobs/mutations";
import actions from '@/store/jobs/actions';
import getters from "@/store/jobs/getters";

const state = () => ({
  jobs: [],
  job: {},
  error: null
})

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
