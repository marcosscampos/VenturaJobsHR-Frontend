<template>
  <v-container>
    <v-card>
      <div>
        <Nuxt-Link to="/jobs" class="arrow__utils">
          <v-btn icon height="50" width="50">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </Nuxt-Link>
      </div>
      <v-card-title>{{ job.Data.Name }}</v-card-title>
      <v-card-subtitle>R$: {{ formatPrice(job.Data.Salary.Value) }}</v-card-subtitle>
      <v-card-text>{{ job.Data.Description }}</v-card-text>
      <v-card-text>Pode se candidatar até o dia: {{ job.Data.FinalDate | moment }} </v-card-text>
      <v-card-actions></v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
import {GET_JOB} from "~/store/jobs/mutationTypes"
import {mapActions, mapState} from 'vuex'
import moment from "moment";

export default {
  name: 'job',
  computed: mapState({
    job: state => state.jobs.job,
    error: state => state.jobs.error
  }),
  head() {
    return {
      title: `Vaga: ${this.job.Data.Name}`
    }
  },
  beforeMount() {
    this.returnJob()
  },
  mounted() {
    console.log(this.$route.params.job)
    this.unsub = this.$store.subscribe((mutation, state) => {
      if(mutation.type === `jobs/${GET_JOB}`) {
        console.log(this.job)
      }
    })
  },
  beforeDestroy() {
    this.unsub()
  },
  methods: {
    ...mapActions(
      'jobs', [GET_JOB]
    ),
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace('.', ',');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
    },
    returnJob() {
      this.$store.dispatch({type: "jobs/getJob", id: this.$route.params.job})
    },
  },
  filters: {
    moment: (date) => {
      if (date != null) {
        return moment(date).format("DD/MM/YYYY - HH:mm:ss")
      } else {
        return "";
      }
    }
  }
}

</script>

<style scoped>
.arrow__utils:hover {
  text-decoration: none !important;
}
</style>
