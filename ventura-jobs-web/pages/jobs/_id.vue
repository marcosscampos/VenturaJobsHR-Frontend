<template>
    <div class="container">
      <div class="flex">
        <div class="flex-none w-14">
          <Nuxt-Link to="/jobs" class="arrow__utils">
            <v-btn icon height="50" width="50">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </Nuxt-Link>
        </div>
        <div class="flex-initial m-auto">
          <h1 class="text-2xl font-medium">{{ job.content.data.name }}</h1>
          <h5 class="text-base font-normal">Descrição da vaga</h5>
          <p class="font-light" v-html="job.content.data.description"></p>
          <div class="flex">
            <p class="font-bold">Salário:</p>
            <p class="font-light ml-2">
              R$ {{ formatPrice(job.content.data.salary.value) }}
            </p>
          </div>
          <p>
            <v-icon icon style="font-size: 21px !important">
              mdi-calendar-clock
            </v-icon>
            Esta vaga irá se encerrar {{ job.content.data.finalDate | moment }}
          </p>
          <v-btn>Candidatar-se</v-btn>
        </div>
      </div>
    </div>
</template>

<script>
import moment from "moment";

export default {
  name: "job",
  head() {
    return {
      title: `Vaga: ${this.job.content.data.name}`,
    };
  },
  middleware: 'auth-jobs',
  data() {
    return {
      propsJob: {},
    };
  },
  async asyncData({$axios, params}) {
    const job = await $axios.$get(`/v1/jobs/${params.id}`);
    return {job};
  },
  methods: {
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace(".", ",");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
    },
  },
  filters: {
    moment: (date) => {
      if (date != null) {
        moment.locale("pt-br");
        return moment(date).fromNow();
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped>
.arrow__utils {
  text-decoration: none;
}

.container__colors {
  background: #363636;
  margin-top: 20px;
  border-radius: 10px;
}
</style>
