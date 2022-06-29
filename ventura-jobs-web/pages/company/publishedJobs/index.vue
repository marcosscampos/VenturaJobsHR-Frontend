<template>
  <v-container>
    <div class="mb-5">
      <v-btn @click.stop="drawer = !drawer">Filtros Avançados</v-btn>
      <v-btn @click.stop="getJobs">Limpar</v-btn>
    </div>
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
          <v-card v-for="job in jobs.data" :key="job.id"
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
          <div v-if="jobs.data != null && jobs.data.length == 0">
            <h1
              class="text-center text-xl font-light m-auto"
              style="margin: 10px 10px;">Não há registros com o critério pesquisado ou não há vagas publicadas.</h1>
          </div>
        </div>
        <v-pagination
          circle
          v-model="filter.pagination.page"
          :length="total"
          total-visible="5"
          class="m-auto"
          @input="onChange">
        </v-pagination>
      </div>
    </div>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      app
      right
      style="width: 310px !important;">
      <v-list
        nav
        dense>
        <v-form @submit.prevent="searchJobs">
          <h1 class="text-center text-xl font-light m-auto">Filtros</h1>
          <v-select :items="occupationAreaList" item-text="text" item-value="value" label="Área de ocupação"
                    v-model="filter.occupationArea">
          </v-select>

          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition"
                  offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="computedDateFormatted" label="Data Limite"
                            prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="filter.deadLine" :active-picker.sync="activePicker" min="1950-01-01"
                           @input="menu = false" locale="pt-br"></v-date-picker>
          </v-menu>

          <div class="mb-6 mt-4">
            <h1 class="text-center text-xl font-light m-auto">Salário</h1>
            <div class="v-input v-text-field v-text-field--is-booted v-text-field--placeholder">
              <div class="v-input__control">
                <div class="v-input__slot">
                  <div class="v-text-field__slot">
                    <money id="input-40" v-model="filter.salary" v-bind="money"></money>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex">
            <v-btn @click.stop="searchJobs">Pesquisar</v-btn>
          </div>
        </v-form>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import moment from "moment";
import {Money} from "v-money";

export default {
  name: "index",
  components: {Money},
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
      filter: {
        pagination: {
          page: 1,
          size: 10,
        },
        deadLine: '',
        occupationArea: 0,
        salary: 0
      },
      occupationAreaList: [
        {text: 'Gestão', value: 1},
        {text: 'Infraestrutura', value: 2},
        {text: 'Desenvolvimento', value: 3},
        {text: 'Banco de Dados', value: 4},
        {text: 'Segurança', value: 5},
        {text: 'Design', value: 6},
      ],
      total: 1,
      drawer: false,
      activePicker: null,
      dateFormatted: null,
      date: '',
      menu: '',
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2,
        masked: false
      },
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.filter.deadLine)
    },
    ...mapState({
      jobs: state => state.jobs.jobs
    }),
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/GET_COMPANY_PUBLISHED_JOBS') {
        this.loading = false;
        this.total = (Math.ceil(this.jobs.total / this.jobs.pageSize))
      }
    })
  },
  filters: {
    moment: (date) => {
      if (date != null) {
        moment.locale("pt-br");
        return moment(date).add(1, 'days').format("DD/MM/YYYY");
      } else {
        return "";
      }
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      return moment(date).format("DD/MM/YYYY");
    },
    mountFilters() {
      let minValue = new Date('0001-01-01T00:00:00Z');
      let dateFiltered = new Date(this.filter.deadLine)

      this.filters = `page=${this.filter.pagination.page}&size=${this.filter.pagination.size}`
      if(this.filter.occupationArea !== 0) {
        this.filters += `&occupationArea=${this.filter.occupationArea}`
      }

      if(this.filter.salary !== 0) {
        this.filters += `&salary=${this.filter.salary}`
      }

      if(dateFiltered > minValue && this.filter.deadLine != undefined) {
        this.filters += `&deadLine=${moment(this.filter.deadLine).format("YYYY-MM-DD")}`
      }
    },
    searchJobs() {
      this.mountFilters();
      this.$store.dispatch({type: 'jobs/getCompanyPublishedJobs', filters: this.filters})

      this.drawer = false;
      this.filter.salary = 0
      this.filter.deadLine = ''
      this.filter.occupationArea = 0
    },
    onChange() {
      this.$router.push({query: {page: this.filter.pagination.page, size: this.filter.pagination.size}});
      this.getJobs();
    },
    getJobs() {
      let filter = `page=${this.filter.pagination.page}&size=${this.filter.pagination.size}`

      this.$store.dispatch({type: 'jobs/getCompanyPublishedJobs', filters: filter})
      this.filter.salary = 0
      this.filter.deadLine = ''
      this.filter.occupationArea = 0
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
