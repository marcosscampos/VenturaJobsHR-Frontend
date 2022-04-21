<template>
  <v-container>
    <v-card>
      <Nuxt-Link to="/jobs" class="arrow__utils">
        <v-btn icon height="50" width="50">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </Nuxt-Link>
      <v-card-title>{{ job.Data.Name }}</v-card-title>
      <v-card-subtitle>R$: {{ formatPrice(job.Data.Salary.Value) }}</v-card-subtitle>
      <v-card-text>{{ job.Data.Description }}</v-card-text>
      <v-card-text>Pode se candidatar até o dia: {{ job.Data.FinalDate | moment }}</v-card-text>
      <v-card-actions>
        <v-icon icon height="50" width="50">mdi-pencil-plus-outline</v-icon>
      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
import moment from "moment";

export default {
  name: 'job',
  head() {
    return {
      title: `Vaga: ${this.job.Data.Name}`
    }
  },
  data() {
    return {
      propsJob: {}
    }
  },
  async asyncData({$axios, params}) {
    const job = await $axios.$get(`/v1/jobs/${params.id}`);
    return {job}
  },
  methods: {
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace('.', ',');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
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
