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
        <h1 class="text-2xl font-medium">{{ job.name }}</h1>
        <div class="flex">
          <div>
            <p class="font-light">
              Salário: R$ {{ formatPrice(job.salary.value) }}
            </p>
          </div>
          <div>
            <p class="font-light ml-5">
              <v-icon icon style="font-size: 21px !important">
                mdi-calendar-clock
              </v-icon>
              Expira em: {{ job.deadLine | moment }}
            </p>
          </div>
        </div>

        <div class="flex">
          <div>
            <h1 class="text-lg font-medium">Área de ocupação</h1>
            <div><p class="font-light">{{ returnOccupationArea(job.occupationArea) }}</p></div>
          </div>
          <div class="ml-5">
            <h1 class="text-lg font-medium">Forma de Contratação</h1>
            <div><p class="font-light">{{ returnFormOfHiring(job.formOfHiring) }}</p></div>
          </div>
        </div>

        <h5 class="text-lg font-normal">Descrição da vaga</h5>
        <p class="font-light mb-10" v-html="job.description"></p>

        <h1 class="text-lg font-medium mb-4">Critérios</h1>
        <div class="mb-20">
          <v-row no-gutters justify="space-between">
            <v-col v-for="criteria in job.criteriaList" :key="criteria.id" class="mb-2 mr-3">
              <v-card max-width="500" min-height="200" max-height="200">
                <v-card-title>
                  <h1 style="word-break: keep-all">{{ criteria.name }}</h1>
                </v-card-title>
                <v-card-text style="min-height: 75px">
                  <p>{{ criteria.description }}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <div class="flex flex-row">
                    <p class="font-medium text-base ml-3" style="margin-bottom: 0">Perfil Desejado: </p>
                    <p class="font-light text-base">{{ returnProfileType(criteria.profileType) }}</p>
                  </div>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div v-if="canApply != null && canApply === false">
          <p class="text-center text-lg font-medium text-lime-700">
            <v-icon>
              mdi-check
            </v-icon>
            Você já se candidatou a essa vaga!
          </p>
        </div>

        <v-form @submit.prevent="applyToJob" class="flex justify-center" v-else>
          <v-dialog persistent v-model="answerDialog" width="570">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" v-if="user.userType == 1">
                Candidatar
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <h1 class="text-center text-2xl font-medium m-auto">Confirmar candidatura</h1>
              </v-card-title>
              <div>
                <v-card-text>
                  <div v-for="(criteria, index) in job.criteriaList" :key="criteria.id">
                    <h1 class="text-center font-normal m-auto">{{ criteria.name }}</h1>
                    <v-slider step="1"
                              ticks="always"
                              tick-size="5"
                              :tick-labels="answerList"
                              min="1"
                              max="5"
                              @input="addToAnswerList(criteria, $event, index)"
                              style="padding:10px"></v-slider>
                  </div>
                  <div class="flex flex-row justify-center">
                    <div>
                      <v-btn @click="applyToJob">Candidatar-se</v-btn>
                    </div>
                    <v-btn @click="answerDialog = false" class="ml-5">Fechar</v-btn>
                  </div>
                </v-card-text>
              </div>
            </v-card>
          </v-dialog>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {mapMutations, mapState} from "vuex";
import check from "@/components/check";

export default {
  name: "job",
  computed: {
    ...mapState({
      error: state => state.jobs.erro
    })
  },
  head() {
    return {
      title: `Vaga: ${this.job.name}`,
    };
  },
  data: () => ({
    value: 0,
    answerDialog: false,
    criteriaApplication: {
      answer: '',
      criteriaId: ''
    },
    jobApplication: {
      userId: null,
      jobId: null,
      criteriaList: []
    },
    answerList: [1, 2, 3, 4, 5],
  }),
  async asyncData({$httpClient, params}) {
    let [job, user, canApply] = await Promise.all([
      $httpClient.$get(`v1/jobs/${params.id}`),
      $httpClient.$get('v1/users/user-token'),
      $httpClient.$get(`v1/jobs/${params.id}/can-apply`)
    ])

    return {job, user, canApply};
  },
  beforeDestroy() {
    this.unsub();
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/APPLY_TO_JOB') {
        check.hasError(this.error, result => {
          if (!result) {
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        })
      }
    });
  },
  ...mapMutations(['jobs/APPLY_TO_JOB']),
  methods: {
    returnProfileType(profile) {
      switch (profile) {
        case 1:
          return "Desejável"
        case 2:
          return "Diferencial"
        case 3:
          return "Relevante"
        case 4:
          return "Muito Relevante"
        case 5:
          return "Obrigatório"
      }
    },
    addToAnswerList(data, event, index) {
      this.criteriaApplication = {
        answer: event,
        criteriaId: data.id
      }

      this.jobApplication.criteriaList.splice(index, 1, this.criteriaApplication)
    },
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace(".", ",");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
    },
    applyToJob() {
      this.jobApplication.jobId = this.$route.params.id
      this.jobApplication.userId = this.user.id
      let applicationObject = {application: this.jobApplication}

      this.$store.dispatch({type: 'jobs/applyToJob', application: applicationObject})
    },
    returnOccupationArea(occupation) {
      switch (occupation) {
        case 1:
          return "Gerência"
        case 2:
          return "Infraestrutura"
        case 3:
          return "Desenvolvimento"
        case 4:
          return "Banco de Dados"
        case 5:
          return "Segurança"
        case 6:
          return "Design"
      }
    },
    returnFormOfHiring(formOfHiring) {
      switch (formOfHiring) {
        case 1:
          return "CLT";
        case 2:
          return "PJ";
        case 3:
          return "Autônomo";
        case 4:
          return "Estágio"
      }
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
