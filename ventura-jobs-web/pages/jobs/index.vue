<template>
  <v-container>
    <v-skeleton-loader v-if="loading" :loading="loading" type="card" max-width="560" max-height="250"></v-skeleton-loader>
    <div class="grid grid-cols-2 gap-4">
      <v-card v-for="job in jobs.Data" :key="job.Id" min-height="170" max-height="250"
              class="card card__utils" :to="`jobs/${job.Id}`" v-if="!loading">
        <v-card-title class="break-words">{{ job.Name }}</v-card-title>
        <v-card-text>{{ job.Description }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon icon style="font-size: 21px !important; margin-right: 5px !important;">mdi-calendar-clock</v-icon>
          {{ job.FinalDate | moment}}
          </v-card-actions>
      </v-card>
    </div>
       <v-pagination
         circle
         v-model="pagination.page"
         :length="total"
         total-visible="5"
         class="m-auto"
         @input="onChange">
       </v-pagination>
  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import moment from "moment";

export default {
  name: 'jobs',
  middleware: 'auth-jobs',
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
    this.getJobs()
  },
  data() {
    return {
      date: '',
      menu: '',
      flex: 6,
      pagination: {
        page: 1,
        size: 10,
      },
      total: 1,
      loading: true
    }
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
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if(mutation.type == 'jobs/GET_ALL_JOBS') {
        this.loading = false;
        this.total = (Math.ceil(this.jobs.Total / this.jobs.PageSize))
      }
    })
  },
  methods: {
    onChange() {
      this.$router.push({query: {page: this.pagination.page, size: this.pagination.size}});
      this.getJobs();
    },
    ...mapActions(['jobs/getAllJobs']),
    ...mapMutations(['jobs/GET_ALL_JOBS']),
    getJobs() {
      this.$store.dispatch({type: 'jobs/getAllJobs', size: this.pagination.size, page: this.pagination.page})
    }
  },
  getJob(id) {
    this.$router.push({path: `/jobs/${id}`})
  },
  beforeDestroy() {
    this.unsub()
  }
}
</script>
<style>
.card__utils:hover {
  text-decoration: none !important;
  transform: scale(1.03, 1.03);
  transition: 1s all;
}

.card__utils {
  transition: 1s all;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
