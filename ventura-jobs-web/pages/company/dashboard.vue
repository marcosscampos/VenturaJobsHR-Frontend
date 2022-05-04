<template>
  <v-container>
    <div class="flex flex-row align-center justify-evenly">
      <div class="mr-2">
        <NuxtLink to="/company/publishJobs" :class="$vuetify.theme.dark ? darkClass : lightClass">
          <span>Vagas publicadas</span>
        </NuxtLink>
      </div>
      <div class="mr-2">
        <NuxtLink to="/company/account" :class="$vuetify.theme.dark ? darkClass : lightClass">
          <span>Alterar dados da sua conta</span>
        </NuxtLink>
      </div>
      <v-dialog max-width="1000">
        <template v-slot:activator="{ on, attrs }">
          <div class="mr-2">
            <v-btn v-bind="attrs"
                   v-on="on" style="height: 59px; text-transform: none; font-size: 16px">
              <span>Publicar nova vaga</span>
            </v-btn>
          </div>
        </template>
        <v-card>
          <v-card-title>
            <h1 class="text-center text-2xl font-light mb-4 m-auto">Publicar nova vaga</h1>
          </v-card-title>
          <div>
            <v-card-text>
              <v-form @submit.prevent="publishJob">
                <v-text-field label="Cargo" placeholder="Desenvolvedor Java" v-model="job.Name"></v-text-field>
                <div class="mb-6 mt-4">
                  <h1 class="text-center text-xl font-light m-auto">Salário</h1>
                  <div class="v-input v-text-field v-text-field--is-booted v-text-field--placeholder">
                    <div class="v-input__control">
                      <div class="v-input__slot">
                        <div class="v-text-field__slot">
                          <money id="input-40" v-model="job.Salary" v-bind="money"></money>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <client-only placeholder="Carregando...">
                    <h1 class="text-center text-xl font-light mb-4 m-auto">Descrição da vaga</h1>
                    <vue-editor :editor-toolbar="customToolbar" v-model="job.Description"></vue-editor>
                  </client-only>
                </div>
                <v-text-field label="Empresa" placeholder="TOTVS S/A" class="mt-4" v-model="job.Company"></v-text-field>
                <v-text-field label="Cidade" placeholder="Rio de Janeiro" v-model="job.City"></v-text-field>
                <v-text-field label="Estado" placeholder="RJ" v-model="job.StateCity"></v-text-field>
                <v-select :items="items"
                          label="Forma de Contratação" v-model="job.FormOfHiring">
                </v-select>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="computedDateFormatted"
                      label="Data Limite"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="job.DeadLine"
                    :active-picker.sync="activePicker"
                    min="1950-01-01"
                    @input="menu = false"
                    locale="pt-br"
                  ></v-date-picker>
                </v-menu>

                <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                </div>

                <h1 class="text-center text-xl font-light mb-4 m-auto">Critérios</h1>

                <table>
                  <tbody>
                  <tr v-for="(item, index) in criteriaList" :key="index" class="inline-flex">
                    <td class="mr-5">
                      <v-text-field class="w-96" label="Nome" placeholder="Linguagem Java"
                                    v-model="item.name"></v-text-field>
                    </td>
                    <td class="mr-5">
                      <v-text-field class="w-96" label="Descrição" placeholder="Conhecimento em Java"
                                    v-model="item.description"></v-text-field>
                    </td>
                    <td class="mr-5 flex flex-column text-center">
                      <label for="profiles">Perfil</label>
                      <select name="profile" id="profiles" class="selectAlignAndWidth">
                        <option value="1" @click="item.profile = 1">1</option>
                        <option value="2" @click="item.profile = 2">2</option>
                        <option value="3" @click="item.profile = 3">3</option>
                        <option value="4" @click="item.profile = 4">4</option>
                        <option value="5" @click="item.profile = 5">5</option>
                      </select>
                    </td>
                    <td class="mr-5 flex flex-column text-center">
                      <label for="weights">Peso</label>
                      <select name="weight" id="weights" class="selectAlignAndWidth">
                        <option value="1" @click="item.weight = 1">1</option>
                        <option value="2" @click="item.weight = 2">2</option>
                        <option value="3" @click="item.weight = 3">3</option>
                        <option value="4" @click="item.weight = 4">4</option>
                        <option value="5" @click="item.weight = 5">5</option>
                      </select>
                    </td>
                    <td>
                      <v-btn @click="deleteRow" class="closeButton">X</v-btn>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div class="flex flex-row justify-center">
                  <v-btn @click.stop="append">Inserir Linhas</v-btn>
                </div>

                <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                </div>
                <div class="flex flex-row justify-center">
                  <v-btn @click.stop="publishJob">Publicar vaga</v-btn>
                </div>
              </v-form>
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
import { mapState, mapMutations } from "vuex";

export default {
  name: "dashboard",
  middleware: 'auth-company',
  components: {Money},
  head() {
    return {
      title: 'Dashboard'
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.job.DeadLine)
    },
    ...mapState({
      erro: state => state.jobs.erro
    })
  },
  data() {
    return {
      salary: 0,
      items: ['CLT', 'PJ', 'Autônomo'],
      criteriaList: [],
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
        Name: '',
        Salary: 0,
        Description: '',
        Company: '',
        City: '',
        StateCity: '',
        DeadLine: null,
        FormOfHiring: '',
        Criteria: []
      },
      jobs: [],
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
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if(mutation.type == 'jobs/CREATE_JOB') {
        check.hasError(this.erro, result => {
          if(!result) {
            console.log('foi')
          }
        })
      }
    })
  },
  methods: {
    publishJob() {
      this.criteriaList.forEach(x => {
        this.job.Criteria.push(x)
      })
      this.jobs.push(this.job)

      this.$store.dispatch({ type: 'jobs/createJob', Job: this.jobs })
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    append() {
      this.criteriaList.push({
        weight: 0,
        profile: 0,
        description: '',
        name: ''
      })
    },
    deleteRow(index) {
      this.criteriaList.splice(index, 1);
    },
    ...mapMutations(['jobs/CREATE_JOB'])
  }
}
</script>

<style scoped>

</style>
