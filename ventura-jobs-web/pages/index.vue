<template>
  <v-container fluid>
    <v-data-table :headers="headers"
                  :items="jobs.Data"
                  :items-per-page="10"
                  :loading="loading"
                  @click:row="handleClick"
                  class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>10 últimas vagas publicadas</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: 'IndexPage',
  computed: {
    ...mapState({
      jobs: state => state.jobs.jobs
    }),
    ...mapGetters({
      jobs: "jobs/listJobs"
    })
  },
  head() {
    return {
      title: "Página principal"
    }
  },
  data() {
    return {
      headers: [
        {text: 'Cargo', value: 'Name'},
        {text: 'Descrição', value: 'Description'},
        {text: 'Data Final', value: 'FinalDate'},
      ],
      loading: true
    }
  },
  beforeMount() {
    this.getJobs()
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/GET_ALL_JOBS') {
        this.loading = false;
      }
    })
  },
  methods: {
    getJobs() {
      this.$store.dispatch({type: 'jobs/getAllJobs', size: 10, page: 1})
    },
    ...mapActions(['jobs/getAllJobs']),
    ...mapMutations(['jobs/GET_ALL_JOBS']),
    handleClick(value) {
      this.$router.push({path: `/jobs/${value.Id}`})
    }
  },
  beforeDestroy() {
    this.unsub()
  }
}
</script>
