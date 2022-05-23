<template>
  <v-container>
    <v-skeleton-loader v-if="loading" :loading="loading" type="card"></v-skeleton-loader>
    <div class="flex flex-column">
      <v-card v-for="job in jobs.data" :key="job.id"
              class="card card__utils" :to="`jobs/${job.id}`" v-if="!loading">
        <v-card-title class="break-words">{{ job.name }}</v-card-title>
        <v-card-text v-html="job.description"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon icon style="font-size: 21px !important; margin-right: 5px !important;">mdi-calendar-clock</v-icon>
          {{ job.finalDate | moment}}
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
import {mapState} from 'vuex'
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
    console.log(this.jobs)
    this.unsub = this.$store.subscribe((mutation, state) => {
      if(mutation.type == 'jobs/GET_ALL_JOBS') {
        this.loading = false;
        this.total = (Math.ceil(this.jobs.total / this.jobs.pageSize))
      }
    })
  },
  methods: {
    onChange() {
      this.$router.push({query: {page: this.pagination.page, size: this.pagination.size}});
      this.getJobs();
    },
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
