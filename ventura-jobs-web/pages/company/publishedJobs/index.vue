<template>
  <v-container>
    <v-skeleton-loader v-if="loading" :loading="loading" type="card"></v-skeleton-loader>
    <div class="flex">
      <div class="flex-none w-14">
        <Nuxt-Link to="/company/dashboard" class="arrow__utils">
          <v-btn icon height="50" width="50">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </Nuxt-Link>
      </div>
      <div class="flex-auto">
        <div class="grid gap-4 grid-cols-1">
          <v-card v-for="job in jobs" :key="job.id"
                  class="card" :to="`/company/publishedJobs/${job.id}`" v-if="!loading">
            <v-card-title class="break-words">{{ job.name }}</v-card-title>
            <v-card-text v-html="job.description"></v-card-text>
            <v-card-actions>
              <p>Status:
                <span v-if="job.status == 1">
                  <v-chip label small color='green lighten-4' class='ml-0 mr-2 black--text'>
                    <span class='black--text'>{{ returnJobStatus(job.status) }}</span>
                  </v-chip>
                </span>
                <span v-if="job.status == 2">
                  <v-chip label small color='red lighten-4' class='ml-0 mr-2 black--text'>
                    <span class='black--text'>{{ returnJobStatus(job.status) }}</span>
                  </v-chip>
                </span>
                <span v-if="job.status == 3">
                  <v-chip label small color='yellow lighten-4' class='ml-0 mr-2 black--text'>
                    <span class='black--text'>{{ returnJobStatus(job.status) }}</span>
                  </v-chip>
                </span>
              </p>
              <v-spacer></v-spacer>
              <v-icon icon style="font-size: 21px !important; margin-right: 5px !important;">mdi-calendar-clock</v-icon>
              {{ job.deadLine | moment }}
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import moment from "moment";

export default {
  name: "index",
  head() {
    return {
      title: "Vagas publicadas"
    }
  },
  beforeMount() {
    this.getJobs()
  },
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState({
      jobs: state => state.jobs.jobs
    }),
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/GET_COMPANY_PUBLISHED_JOBS') {
        this.loading = false;
      }
    })
  },
  filters: {
    moment: (date) => {
      if (date != null) {
        return moment(date).format("DD/MM/YYYY")
      } else {
        return "";
      }
    }
  },
  methods: {
    getJobs() {
      this.$store.dispatch({type: 'jobs/getCompanyPublishedJobs'})
    },
    returnJobStatus(status) {
      switch (status) {
        case 1:
          return "Publicado"
        case 2:
          return "Expirado"
        case 3:
          return "Cancelado"
      }
    },
    getJob(id) {
      this.$router.push({path: `/publishedJobs/${id}`})
    },
  }
}
</script>

<style scoped>

</style>
