<template>
  <v-container>
    <div class="mb-5">
      <v-btn @click.stop="drawer = !drawer">Filtros Avançados</v-btn>
      <v-btn @click.stop="getJobs">Limpar</v-btn>
    </div>
    <v-skeleton-loader v-if="loading" :loading="loading" type="card"></v-skeleton-loader>
    <div class="flex flex-column">
      <v-card v-for="job in jobs.data" :key="job.id" :to="`jobs/${job.id}`" v-if="!loading" class="mb-4">
        <v-card-title class="break-words">{{ job.name }}</v-card-title>
        <v-card-text v-html="job.description"></v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon icon style="font-size: 21px !important; margin-right: 5px !important;">mdi-calendar-clock</v-icon>
          {{ job.deadLine | moment }}
        </v-card-actions>
      </v-card>
      <div v-if="jobs.data != null && jobs.data.length == 0">
        <h1 class="text-center text-xl font-light m-auto">Não há registros com o critério pesquisado ou não há vagas publicadas.</h1>
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
import {mapState} from 'vuex'
import moment from "moment";
import {Money} from "v-money";

export default {
  name: 'jobs',
  components: {Money},
  head() {
    return {
      title: "Vagas"
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
  beforeMount() {
    this.getJobs()
  },
  data() {
    return {
      drawer: false,
      date: '',
      menu: '',
      flex: 6,
      filter: {
        pagination: {
          page: 1,
          size: 10,
        },
        deadLine: '',
        occupationArea: 0,
        salary: 0
      },
      filters: '',
      total: 1,
      loading: true,
      occupationAreaList: [
        {text: 'Gestão', value: 1},
        {text: 'Infraestrutura', value: 2},
        {text: 'Desenvolvimento', value: 3},
        {text: 'Banco de Dados', value: 4},
        {text: 'Segurança', value: 5},
        {text: 'Design', value: 6},
      ],
      activePicker: null,
      dateFormatted: null,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2,
        masked: false
      },
    }
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
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/GET_ALL_JOBS') {
        this.loading = false;
        this.total = (Math.ceil(this.jobs.total / this.jobs.pageSize))
      }
    })
  },
  methods: {
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
      this.$store.dispatch({type: 'jobs/getAllJobs', filters: this.filters})

      this.drawer = false;
      this.filter.salary = 0
      this.filter.deadLine = ''
      this.filter.occupationArea = 0
    },
    formatDate(date) {
      if (!date) return null
      return moment(date).format("DD/MM/YYYY");
    },
    onChange() {
      this.$router.push({query: {page: this.filter.pagination.page, size: this.filter.pagination.size}});
      this.getJobs();
    },
    getJobs() {
      let filter = `page=${this.filter.pagination.page}&size=${this.filter.pagination.size}`
      this.$store.dispatch({type: 'jobs/getAllJobs', filters: filter})

      this.filter.salary = 0
      this.filter.deadLine = ''
      this.filter.occupationArea = 0
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

</style>
