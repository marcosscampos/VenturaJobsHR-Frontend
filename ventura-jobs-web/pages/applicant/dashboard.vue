<template>
  <v-container>
    <div v-if="user != null">
      <p class="text-center">Bem vindo {{user.name}}!</p>
    </div>
    <div class="grid">
      <v-btn to="/applicant/account"
             :class="$vuetify.theme.dark ? darkClass : lightClass"
             style="height: 59px; text-transform: none; font-size: 16px; word-break: break-word">
        <span style="word-break: break-word">Alterar dados da sua conta</span>
      </v-btn>
    </div>
    <div>
      <h1 class="text-center text-2xl font-light mt-10 mb-4 m-auto">Vagas respondidas</h1>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details></v-text-field>
        </v-card-title>
        <v-data-table
          loading-text="Carregando..."
          :loading="loading"
          :headers="headers"
          :items="jobs.data"
          :page.sync="pagination.page"
          :items-per-page="pagination.size"
          hide-default-footer
          :search="search"></v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            circle
            v-model="pagination.page"
            :length="total"
            total-visible="10"
            class="m-auto"
            @input="onChange">
          </v-pagination>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script>

import {mapState} from "vuex";
import moment from "moment";

export default {
  name: "dashboard",
  middleware: 'auth-applicant',
  head() {
    return {
      title: 'Dashboard'
    }
  },
  data() {
    return {
      headers: [
        {text: 'Nome', value: 'name' },
        {text: 'Descrição', value: 'description' },
        {text: 'Salário', value: 'salary.value' },
        {text: 'Cidade', value: 'location.city' },
      ],
      search: '',
      darkClass: 'link-tab',
      lightClass: 'link-tab-light',
      activeDarkClass: 'link-tab-active',
      activeLightClass: 'link-tab-light-active',
      lineLight: 'h-0.5 bg-neutral-200',
      lineDark: 'h-0.5 bg-neutral-800',
      loading: true,
      pagination: {
        page: 1,
        size: 10,
      },
      total: 1,
    }
  },
  computed: {
    ...mapState({
      jobs: state => state.jobs.jobs
    }),
  },
  beforeMount() {
    this.getJobs();
  },
  async asyncData({$httpClient, error}) {
    const user = await $httpClient.$get('v1/users/user-token')
      .catch(erro => {
        error({statusCode: 404, message: erro})
      })

    return {user}
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/GET_APPLICANT_ANSWERED_JOBS') {
        this.loading = false;
        this.total = (Math.ceil(this.jobs.total / this.jobs.pageSize))
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
    onChange() {
      this.$router.push({query: {page: this.pagination.page, size: this.pagination.size}});
      this.getJobs();
    },
    getJobs() {
      this.$store.dispatch({
        type: 'jobs/getJobApplications',
        size: this.pagination.size,
        page: this.pagination.page
      })
    },
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace(".", ",");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
    },
  }
}
</script>

<style scoped>

</style>
