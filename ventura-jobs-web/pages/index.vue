<template>
  <v-container fluid>
    <div>
      <h1 class="text-center text-2xl font-light mb-4">10 últimas vagas publicadas</h1>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th>Cargo</th>
            <th>Descrição</th>
            <th>Salário</th>
            <th>Cidade</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in jobs.data" :key="item.id">
            <td>{{ item.name }}</td>
            <td v-html="item.description.slice(0, 50)"></td>
            <td>R$: {{ formatPrice(item.salary.value) }}</td>
            <td>{{ item.location.city }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div>
      <v-card class="mt-5">
        <v-card-title>
          <h1 class="text-center text-2xl font-light mb-4 m-auto">Benefícios de se cadastrar como membro</h1>
        </v-card-title>
        <v-card-text>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </v-card-text>
        <v-card-subtitle class="ma-auto">
          <h4 class="text-center text-subtitle-1 mb-4 m-auto">Não tem conta? Clique em Login e cadastre-se!</h4>
        </v-card-subtitle>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import moment from "moment";

export default {
  name: 'IndexPage',
  computed: {
    ...mapState({
      jobs: state => state.jobs.jobs
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
  head() {
    return {
      title: "Página principal"
    }
  },
  data() {
    return {
      headers: [
        {text: 'Cargo', value: 'name'},
        {text: 'Descrição', value: 'description'},
        {text: 'Data Final', value: 'finalDate'},
        {text: 'Cidade', value: 'city'}
      ],
      filter: {
        pagination: {
          page: 1,
          size: 10,
        }
      },
      loading: true
    }
  },
  beforeMount() {
    this.getJobs()
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/GET_ALL_JOBS') {
        this.loading = false;
      }
    })
  },
  methods: {
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace(".", ",");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
    },
    getJobs() {
      let filter = `page=${this.filter.pagination.page}&size=${this.filter.pagination.size}`
      this.$store.dispatch({type: 'jobs/getAllJobs', filters: filter})
    },
  },
  beforeDestroy() {
    this.unsub()
  }
}
</script>
