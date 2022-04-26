<template>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="job in jobs.Data" :key="job.Id" :cols="flex">
        <v-card max-width="500" min-height="170" max-height="250" class="card card__utils" :to="`jobs/${job.Id}`">
          <v-card-title>{{ job.Name }}</v-card-title>
          <v-card-text>{{ job.Description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!--    <v-pagination v-model="page" :length="page_number" total-visible="5" @input="onChange"></v-pagination>-->
  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

export default {
  name: 'jobs',
  head() {
    return {
      title: "Vagas"
    }
  },
  computed: {
    ...mapState({
      jobs: state => state.jobs.jobs
    }),
    ...mapGetters({
      jobs: "jobs/listJobs"
    })
  },
  beforeMount() {
    this.$store.dispatch('jobs/getAllJobs')
    console.log(this.jobs)
  },
  data() {
    return {
      flex: 6,
      page: parseInt(this.$route.query.page, 10) || 1,
      page_number: null,
      loader: null,
    }
  },
  methods: {
    onChange() {
      this.$router.push({query: {page: this.page}});
    },
    ...mapActions(['jobs/getAllJobs']),
    ...mapMutations(['jobs/GET_ALL_JOBS'])
  },
  getJob(id) {
    this.$router.push({path: `/jobs/${id}`})
  }
}
</script>
<style>
.card__utils:hover {
  text-decoration: none !important;
  transform: scale(1.05, 1.05);
  transition: 1s all;
}

.card__utils {
  transition: 1s all;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
