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
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in jobs.Data" :key="item.Id">
            <td>{{ item.Name }}</td>
            <td>{{ item.Description }}</td>
            <td>?</td>
            <td>
              <v-btn @click="handleClick(item.Id)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
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
        return moment(date).format("DD/MM/YYYY")
      } else {
        return "";
      }
    }
  },
  head() {
    return {
      title: "Página principal"
    }
  },
  data() {
    return {
      headers: [
        {text: 'Cargo', value: 'Name'},
        {text: 'Descrição', value: 'Description'},
        {text: 'Data Final', value: 'FinalDate'},
      ],
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
    getJobs() {
      this.$store.dispatch({type: 'jobs/getAllJobs', size: 10, page: 1})
    },
    handleClick(value) {
      this.$router.push({path: `/jobs/${value}`})
    }
  },
  beforeDestroy() {
    this.unsub()
  }
}
</script>
