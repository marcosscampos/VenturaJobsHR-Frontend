<template>
  <div class="container">
    <div class="flex">
      <div class="flex-none w-14">
        <Nuxt-Link to="/company/publishedJobs" class="arrow__utils">
          <v-btn icon height="50" width="50">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </Nuxt-Link>
      </div>
      <div class="flex-initial">
        <h1 class="text-2xl font-medium">{{ job.name }}</h1>
        <h5 class="text-base font-normal">Descrição da vaga</h5>
        <p class="font-light" v-html="job.description"></p>
        <div class="flex justify-between mb-4">
          <div>
            <p class="font-bold mb-0">Salário:</p>
            <span>R$ {{ formatPrice(job.salary.value) }}</span>
          </div>
          <div>
            <p class="font-bold mb-0">Média da vaga:</p>
            <span>{{ job.profileAverage }}</span>
          </div>
          <div>
            <p class="font-bold mb-0">Status da vaga:</p>
            <span>{{ returnJobStatus(job.status) }}</span>
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <div>
            <p>
              <v-icon icon style="font-size: 21px !important">
                mdi-calendar-clock
              </v-icon>
              Data Limite: {{ job.deadLine | moment }}
            </p>
          </div>
          <div v-if="job.status != 2 && job.status != 3">
            <v-btn @click="closeJob">Fechar</v-btn>
          </div>
          <div v-if="job.status != 3">
            <v-btn @click="openDeadLineUpdateModal">Alterar Data Limite</v-btn>
          </div>
        </div>
        <div class="ma-10" v-if="jobReport != null && jobReport.userValueList.length > 0">
          <h1 class="text-2xl font-medium">Gráfico da média dos candidatos</h1>
          <div id="chartDiv"></div>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Média</th>
                <th>Resposta dos critérios</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in jobApplications" :key="item.jobId">
                <td>{{ item.user.name }}</td>
                <td>{{ item.user.email }}</td>
                <td>{{ item.average }}</td>
                <td>
                  <v-container>
                    <v-btn @click="openCriteriaAnswerModal">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </v-container>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
        <div v-else>
          <h1>Não foi encontrado nenhuma candidatura para essa vaga.</h1>
        </div>
      </div>
    </div>
    <v-dialog v-model="criteriaDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
      </template>
      <v-card>
        <v-card-title>
          <h1 class="text-center text-2xl font-light mb-4 m-auto"> Resposta aos critérios</h1>
        </v-card-title>
        <div>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Critério</th>
                  <th>Resposta</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, id) in criteriaList" :key="id">
                  <td>{{ item.name }}</td>
                  <td>{{ returnCriteriaAnswer(item.answer) }}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deadLineDialog" width="500" persistent>
      <template v-slot:activator="{ on, attrs }">
      </template>
      <v-card>
        <v-card-title>
          <h1 class="text-center text-2xl font-light mb-4 m-auto"> Atualizar data limite</h1>
        </v-card-title>
        <div>
          <v-card-text>
            <div v-if="deadLineErrors.length">
              <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
              <ul>
                <li v-for="error in deadLineErrors"
                    style="color: #ff1744;">{{ error }}
                </li>
              </ul>
            </div>
            <v-form @submit.prevent="updateDeadLine">
              <v-menu ref="menu" v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="computedDateFormatted"
                                label="Data Limite"
                                prepend-icon="mdi-calendar"
                                readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="deadLine"
                               :active-picker.sync="activePicker"
                               min="1950-01-01"
                               @input="menu = false" locale="pt-br"></v-date-picker>
              </v-menu>
              <div class="flex flex-row justify-between">
                <v-btn @click.stop="validDeadLineForm($event)">Atualizar Data Limite</v-btn>
                <v-btn @click="closeDeadLineModal">Fechar</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import 'moment/locale/pt-br';
import check from "@/components/check";
import {mapMutations, mapState} from "vuex";

export default {
  name: "companyJob",
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.deadLine)
    },
    ...mapState({
      error: state => state.jobs.erro
    })
  },
  data() {
    return {
      activePicker: null,
      menu: false,
      deadLineErrors: [],
      dateFormatted: null,
      criteriaDialog: false,
      deadLineDialog: false,
      deadLine: null,
      headers: [
        {text: "Nome Critério", value: "name"},
        {text: "Resposta Critério", value: "answer"}
      ],
      criteriaList: []
    }
  },
  head() {
    return {
      title: `Vaga: ${this.job.name}`,
    };
  },
  async asyncData({$httpClient, params, error}) {
      try {
        const job = await $httpClient.$get(`/v1/jobs/${params.id}`)
        const jobReport = await $httpClient.$get(`/v1/jobs/${params.id}/job-report`)
        const jobApplications = await $httpClient.$get(`/v1/jobs/${params.id}/job-applications`)

        return {job, jobReport, jobApplications};
      }catch (e) {
        error({statusCode: 400, message: e})
      }
  },
  beforeDestroy() {
    this.unsub();
  },
  mounted() {
    this.createObjectCriteriaList();
    this.createReport(this.jobReport);

    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/UPDATE_DEADLINE_JOB') {
        check.hasError(this.error, result => {
          if (!result) {
            this.deadLineDialog = false;
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        })
      }

      if (mutation.type == 'jobs/CLOSE_JOB') {
        check.hasError(this.error, result => {
          if (!result) {
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        })
      }
    })
  },
  methods: {
    validDeadLineForm(e) {
      this.deadLineErrors = [];

      if (this.isNullOrWhiteSpace(this.deadLine)) {
        this.deadLineErrors.push("O campo Data Limite é obrigatório.");
      }

      if (!this.deadLineErrors.length) {
        this.updateDeadLine()
      }

      e.preventDefault();
    },
    formatDate(date) {
      if (!date) return null
      return moment(date).format("DD/MM/YYYY");
    },
    openDeadLineUpdateModal() {
      this.deadLineDialog = true;
    },
    closeDeadLineModal() {
      this.deadLineDialog = false;
      this.deadLineErrors = [];
      this.deadLine = null;
    },
    closeJob() {
      check.confirm('Tem certeza que deseja fechar a vaga? Não é possível retornar ao estado anterior.', result => {
        if (result) {
          let jobId = {
            id: this.job.id
          }
          this.$store.dispatch({type: 'jobs/closeJob', id: jobId})
        }
      })
    },
    updateDeadLine() {
      let updatedDeadLine = {
        id: this.job.id,
        deadLine: this.deadLine
      }
      this.$store.dispatch({type: 'jobs/updateDeadLineJob', update: updatedDeadLine});
    },
    createObjectCriteriaList() {
      for (let i = 0; i < this.jobApplications.length; i++) {
        for (let item of this.jobApplications[i].criteriaList) {
          this.criteriaList.push({name: item.name, answer: item.answer});
        }
      }
    },
    openCriteriaAnswerModal() {
      this.criteriaDialog = true
    },
    createReport(report) {
      let {am4core, am4charts} = this.$am4core();
      const chartDiv = document.getElementById("chartDiv");

      am4core.ready(() => {
        let chart = am4core.create(chartDiv, am4charts.XYChart);
        chart.data = report.userValueList;

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Média do candidato";

        let series = chart.series.push(new am4charts.ColumnSeries());
        series.columns.template.tooltipText = "Nome: {categoryX}\nMédia: {valueY}";
        series.dataFields.valueY = "average";
        series.dataFields.categoryX = "name";
      })

    },
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace(".", ",");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
    },
    returnJobStatus(status) {
      switch (status) {
        case 1:
          return "Publicada"
        case 2:
          return "Expirada"
        case 3:
          return "Fechada"
      }
    },
    returnCriteriaAnswer(answer) {
      switch (answer) {
        case 1:
          return "Insuficiente"
        case 2:
          return "Regular"
        case 3:
          return "Bom"
        case 4:
          return "Muito bom"
        case 5:
          return "Excelente"
      }
    },
    isNullOrWhiteSpace(value) {
      return !value || !value.trim();
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
  ...mapMutations(['jobs/CLOSE_JOB', 'jobs/UPDATE_DEADLINE_JOB'])
}
</script>

<style scoped>
#chartDiv {
  width: 100%;
  height: 400px;
}
</style>
