<template>
  <v-container>
    <div>
      <h1 class="text-center font-light mb-4 m-auto">Seja bem vindo {{user.name}}!</h1>
    </div>
    <div class="grid gap-4 grid-rows-3">
      <v-btn to="/company/publishedJobs" :class="$vuetify.theme.dark ? darkClass : lightClass"
        style="height: 59px; text-transform: none; font-size: 16px; word-break: break-word">
        <span style="word-break: break-word">Vagas publicadas</span>
      </v-btn>
      <v-btn to="/company/account" :class="$vuetify.theme.dark ? darkClass : lightClass"
        style="height: 59px; text-transform: none; font-size: 16px; word-break: break-word">
        <span style="word-break: break-word">Alterar dados da sua conta</span>
      </v-btn>
      <v-dialog max-width="100%" v-model="jobDialog">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" style="height: 59px; text-transform: none; font-size: 16px;">
            <span style="word-break: break-word">Publicar nova vaga</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <h1 class="text-center text-2xl font-light mb-4 m-auto">Publicar nova vaga</h1>
          </v-card-title>
          <div>
            <v-card-text>
              <ValidationObserver v-slot="{invalid}" ref="observer">
                <v-form @submit.prevent="publishJob">
                  <ValidationProvider v-slot="{ errors }" rules="required" name="Cargo">
                    <v-text-field label="Cargo" placeholder="Desenvolvedor Java" v-model="job.name"
                      :error-messages="errors"></v-text-field>
                  </ValidationProvider>
                  <div class="mb-6 mt-4">
                    <h1 class="text-center text-xl font-light m-auto">Salário</h1>
                    <div class="v-input v-text-field v-text-field--is-booted v-text-field--placeholder">
                      <div class="v-input__control">
                        <div class="v-input__slot">
                          <div class="v-text-field__slot">
                            <money id="input-40" v-model="job.salary.value" v-bind="money"></money>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <client-only placeholder="Carregando...">
                      <ValidationProvider v-slot="{ errors }" rules="required" name="Descrição">
                        <h1 class="text-center text-xl font-light mb-4 m-auto">Descrição da vaga</h1>
                        <vue-editor :editor-toolbar="customToolbar" v-model="job.description"></vue-editor>
                        <span style="color: #ff1744; font-size: 12px; margin-top: 10px">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </client-only>
                  </div>
                  <ValidationProvider v-slot="{ errors }" rules="required" name="Empresa">
                    <v-text-field label="Empresa" placeholder="TOTVS S/A" class="mt-4" v-model="job.company.name"
                      :error-messages="errors"></v-text-field>
                  </ValidationProvider>

                  <ValidationProvider v-slot="{ errors }" rules="required" name="Cidade">
                    <v-text-field label="Cidade" placeholder="Rio de Janeiro" v-model="job.location.city"
                      :error-messages="errors"></v-text-field>
                  </ValidationProvider>

                  <ValidationProvider v-slot="{ errors }" rules="required" name="Estado">
                    <v-text-field label="Estado" placeholder="RJ" v-model="job.location.state" :error-messages="errors">
                    </v-text-field>
                  </ValidationProvider>

                  <ValidationProvider v-slot="{ errors }" rules="required" name="País">
                    <v-text-field label="País" placeholder="Brasil" v-model="job.location.country"
                      :error-messages="errors"></v-text-field>
                  </ValidationProvider>

                  <ValidationProvider v-slot="{ errors }" rules="required" name="Forma de Contratação">
                    <v-select :items="items" item-text="text" item-value="value" :error-messages="errors"
                      label="Forma de Contratação" v-model="job.formOfHiring">
                    </v-select>
                  </ValidationProvider>

                  <ValidationProvider v-slot="{ errors }" rules="required" name="Área de Ocupação">
                    <v-select :items="occupationAreaList" item-text="text" item-value="value" label="Área de ocupação"
                      v-model="job.occupationArea" :error-messages="errors">
                    </v-select>
                  </ValidationProvider>
                  <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition"
                    offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider v-slot="{ errors }" rules="required" name="Data Limite">
                        <v-text-field v-model="computedDateFormatted" label="Data Limite" :rules="errors"
                          prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker v-model="job.deadLine" :active-picker.sync="activePicker" min="1950-01-01"
                      @input="menu = false" locale="pt-br"></v-date-picker>
                  </v-menu>
                  <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                    <span :class="$vuetify.theme.dark ? lineDark : lineLight" />
                    <span :class="$vuetify.theme.dark ? lineDark : lineLight" />
                  </div>

                  <h1 class="text-center text-xl font-light mb-4 m-auto">Critérios</h1>
                  <v-dialog persistent v-model="criteriaDialog" width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" @click="cleanCriteria">
                        Cadastrar critério
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <h1 class="text-center text-2xl font-light mb-4 m-auto"> {{ operation }} critério</h1>
                      </v-card-title>
                      <div>
                        <v-card-text>
                          <div v-if="criteriaErrors.length">
                            <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
                            <ul>
                              <li v-for="error in criteriaErrors" style="color: #ff1744;">{{ error }}</li>
                            </ul>
                          </div>
                          <v-text-field class="w-96" label="Nome" placeholder="Linguagem Java" v-model="criteria.name">
                          </v-text-field>
                          <v-text-field class="w-96" label="Descrição" placeholder="Conhecimento em Java"
                            v-model="criteria.description"></v-text-field>
                          <v-select :items="profileList" label="Perfil" item-text="text" item-value="value"
                            v-model="criteria.profiletype">
                          </v-select>
                          <v-select :items="weightList" label="Peso" v-model="criteria.weight">
                          </v-select>
                          <div class="flex flex-row justify-center">
                            <div v-if="operation == null || operation === 'Cadastrar'">
                              <v-btn @click="validCriteriaForm($event, $data, false)">Cadastrar</v-btn>
                            </div>
                            <div v-else>
                              <v-btn @click="validCriteriaForm($event, $data, true)">Atualizar</v-btn>
                            </div>
                            <v-btn @click="closeCriteriaModal" class="ml-5">Fechar</v-btn>
                          </div>
                        </v-card-text>
                      </div>
                    </v-card>
                  </v-dialog>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Descrição</th>
                          <th>Perfil</th>
                          <th>Peso</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in job.criteriaList" :key="item.id">
                          <td>{{ item.name }}</td>
                          <td>{{ item.description }}</td>
                          <td>{{ returnProfileType(item.profiletype) }}</td>
                          <td>{{ item.weight }}</td>
                          <td>
                            <v-btn @click="editCriteria(item, index)">
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn @click="removeCriteria(index)">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                    <span :class="$vuetify.theme.dark ? lineDark : lineLight" />
                    <span :class="$vuetify.theme.dark ? lineDark : lineLight" />
                  </div>
                  <div class="flex flex-row justify-center">
                    <v-btn @click.stop="publishJob" :disabled="invalid">Publicar vaga</v-btn>
                  </div>
                </v-form>
              </ValidationObserver>
            </v-card-text>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import {Money} from 'v-money'
import check from "@/components/check";
import {mapState, mapMutations} from "vuex";
import {ValidationProvider, ValidationObserver, setInteractionMode, extend} from 'vee-validate'
import {required} from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'Campo {_field_} não pode ficar em branco.',
  computesRequired: true
})

setInteractionMode('eager')

export default {
  name: "dashboard",
  // middleware: ['auth-company'],
  components: {Money, ValidationProvider, ValidationObserver},
  head() {
    return {
      title: 'Dashboard'
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.job.deadLine)
    },
    ...mapState({
      erro: state => state.jobs.erro
    })
  },
  data() {
    return {
      operation: null,
      jobDialog: false,
      criteriaDialog: false,
      criteriaErrors: [],
      items: [
        {text: 'CLT', value: 1},
        {text: 'PJ', value: 2},
        {text: 'Autônomo', value: 3},
        {text: 'Estágio', value: 4}
      ],
      occupationAreaList: [
        {text: 'Gestão', value: 1},
        {text: 'Infraestrutura', value: 2},
        {text: 'Desenvolvimento', value: 3},
        {text: 'Banco de Dados', value: 4},
        {text: 'Segurança', value: 5},
        {text: 'Design', value: 6},
      ],
      profileList: [
        {text: 'Desejável', value: 1},
        {text: 'Diferencial', value: 2},
        {text: 'Relevante', value: 3},
        {text: 'Muito Relevante', value: 4},
        {text: 'Obrigatório', value: 5}
      ],
      weightList: [1, 2, 3, 4, 5],
      criteria: {
        id: 0,
        name: '',
        description: '',
        profiletype: 1,
        weight: 1
      },
      customToolbar: [
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        ["bold"], ["italic"], ["underline"], ["link"],
        [{list: "ordered"}], [{list: "bullet"}], ["clean"]
      ],
      activePicker: null,
      menu: false,
      dateFormatted: null,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2,
        masked: false
      },
      job: {
        name: '',
        salary: {
          value: 0
        },
        description: '',
        company: {
          name: '',
          id: '',
          uid: ''
        },
        location: {
          city: '',
          state: '',
          country: ''
        },
        criteriaList: [],
        deadLine: null,
        formOfHiring: '',
        occupationArea: ''
      },
      darkClass: 'link-tab',
      lightClass: 'link-tab-light',
      activeDarkClass: 'link-tab-active',
      activeLightClass: 'link-tab-light-active',
      lineLight: 'h-0.5 bg-neutral-200',
      lineDark: 'h-0.5 bg-neutral-800'
    }
  },
  beforeDestroy() {
    this.unsub();
  },
  async asyncData({$httpClient, error}) {
    const user = await $httpClient.$get('v1/users/user-token').catch(err => {error({})})
    return {user}
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'jobs/CREATE_JOB') {
        check.hasError(this.erro, result => {
          if (!result) {
            this.jobDialog = false;
            this.job = {
              name: '',
              salary: {
                value: 0
              },
              description: '',
              company: {
                name: '',
                id: '',
                uid: ''
              },
              location: {
                city: '',
                state: '',
                country: ''
              },
              criteriaList: [],
              deadLine: null,
              formOfHiring: '',
              occupationArea: ''
            }
          }
        })
      }
    })
  },
  methods: {
    validCriteriaForm(e, data, isUpdate) {
      this.criteriaErrors = [];

      if(this.isNullOrWhiteSpace(this.criteria.name)) {
        this.criteriaErrors.push("O campo Nome é obrigatório.");
      }

      if(this.isNullOrWhiteSpace(this.criteria.description)) {
        this.criteriaErrors.push("O campo Descrição é obrigatório.");
      }

      if(!this.criteriaErrors.length) {
        if(!isUpdate) {
          this.addCriteriaModal()
        } else {
          this.saveCriteriaModal(data)
        }
      }

      e.preventDefault();
    },
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
    cleanCriteria() {
      this.operation = "Cadastrar"
      this.criteria.name = ''
      this.criteria.description = ''
      this.criteria.profiletype = 1
      this.criteria.weight = 1
    },
    removeCriteria(index) {
      this.job.criteriaList.splice(index, 1);
    },
    editCriteria(value, index) {
      this.operation = "Editar"
      this.criteria = value
      this.criteria.id = index
      this.criteriaDialog = true;
    },
    closeCriteriaModal() {
      this.criteriaDialog = false;
      this.criteriaErrors = [];
    },
    closeModal() {

    },
    saveCriteriaModal(data) {
      let index = data.criteria.id

      this.job.criteriaList.splice(index, 1, {
        name: this.criteria.name,
        description: this.criteria.description,
        profiletype: this.criteria.profiletype,
        weight: this.criteria.weight
      })

      this.criteriaDialog = false;
    },
    addCriteriaModal() {
      this.job.criteriaList.push({
        name: this.criteria.name,
        description: this.criteria.description,
        profiletype: this.criteria.profiletype,
        weight: this.criteria.weight
      })

      this.criteria.name = ''
      this.criteria.description = ''
      this.criteria.profiletype = 1
      this.criteria.weight = 1
      this.criteriaDialog = false
    },
    publishJob() {
      this.job.company.uid = this.$fire.auth.currentUser.uid

      let jobList = {jobList: [this.job]}
      this.$refs.observer.validate().then(result => {
        if (result) {
          this.$store.dispatch({type: 'jobs/createJob', jobList: jobList})
        }
      }).catch(error => {
        console.log(error)
      })

    },
    isNullOrWhiteSpace(value) {
      return !value || !value.trim();
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    ...mapMutations(['jobs/CREATE_JOB'])
  }
}
</script>

<style scoped>

</style>
