<template>
  <v-container>
    <div class="flex flex-row align-center">
      <div class="mr-2">
        <NuxtLink to class="link-tab-active">
          <span>Vagas publicadas</span>
        </NuxtLink>
      </div>
      <div class="mr-2">
        <NuxtLink to class="link-tab">
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
                <v-text-field label="Cargo" placeholder="Desenvolvedor Java"></v-text-field>
                <div class="mt-4">
                  <client-only placeholder="Carregando...">
                    <h1 class="text-center text-xl font-light mb-4 m-auto">Descrição da vaga</h1>
                    <vue-editor :editor-toolbar="customToolbar"></vue-editor>
                  </client-only>
                </div>
                <v-text-field label="Empresa" placeholder="TOTVS S/A" class="mt-4"></v-text-field>
                <v-text-field label="Cidade" placeholder="Rio de Janeiro"></v-text-field>
                <v-text-field label="Estado" placeholder="RJ"></v-text-field>
                <v-select :items="items"
                          label="Forma de Contratação">
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
                      v-model="dateFormatted"
                      label="Data Limite"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @blur="date = parseDate(dateFormatted)"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    :active-picker.sync="activePicker"
                    min="1950-01-01"
                    @change="save"
                    locale="pt-br"
                  ></v-date-picker>
                </v-menu>

                <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                  <span class="h-0.5 bg-neutral-800"/>
                  <span class="h-0.5 bg-neutral-800"/>
                </div>

                <h1 class="text-center text-xl font-light mb-4 m-auto">Critérios</h1>

                <table>
                  <tbody>
                  <tr v-for="(item, index) in criteriaList" :key="index" class="inline-flex items-baseline">
                    <td class="mr-5">
                      <v-text-field class="w-96" label="Nome" placeholder="Linguagem Java" v-model="item.name"></v-text-field>
                    </td>
                    <td class="mr-5">
                      <v-text-field class="w-96"  label="Descrição" placeholder="Conhecimento em Java"
                                    v-model="item.description"></v-text-field>
                    </td>
                    <td class="mr-5">
                      <v-text-field
                        style="width: 30px"
                        v-model="item.profile"
                        hide-details
                        single-line
                        :rules="rules"
                        placeholder="Perfil"
                        type="number"
                      />
                    </td>
                    <td class="mr-5">
                      <v-text-field
                        style="width: 30px"
                        v-model="item.weight"
                        hide-details
                        single-line
                        :rules="rules"
                        placeholder="Peso"
                        type="number"
                      />
                    </td>
                    <td>
                      <v-btn @click="deleteRow">Excluir</v-btn>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div class="flex flex-row justify-center">
                  <v-btn @click.stop="append">Inserir Linhas</v-btn>
                </div>

                <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                  <span class="h-0.5 bg-neutral-800"/>
                  <span class="h-0.5 bg-neutral-800"/>
                </div>
                <div class="flex flex-row justify-center">
                  <v-btn @click.stop="log">Publicar vaga</v-btn>
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

export default {
  name: "dashboard",
  middleware: 'auth-company',
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  },
  data() {
    return {
      rules: [
        v => !!v || "This field is required",
        v => (v && v < 6) || ''
      ],
      items: ['CLT', 'PJ', 'Autônomo'],
      criteriaList: [],
      weightList: [1, 2, 3, 4, 5],
      profileList: [1, 2, 3, 4, 5],
      returnCriterias: {
        profile: 0,
        weight: 0
      },
      customToolbar: [
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        ["bold"], ["italic"], ["underline"], ["link"],
        [{list: "ordered"}], [{list: "bullet"}], ["clean"]
      ],
      activePicker: null,
      date: null,
      menu: false,
      dateFormatted: null,
    }
  },
  methods: {
    publishJob() {

    },
    save(date) {
      this.$refs.menu.save(date)
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    append() {
      this.criteriaList.push({
        weight: this.returnCriterias.weight,
        profile: 0,
        description: '',
        name: ''
      })
    },
    deleteRow(index){
      this.criteriaList.splice(index, 1);
    },
    log() {
      console.log(this.criteriaList)
    },
    weightChanged(val) {
      this.returnCriterias.weight = val;
      console.log(this.returnCriterias.weight)
    },
    profileChanged(val) {
      this.returnCriterias.profile = val;
      console.log(this.returnCriterias.profile)
    }
  }
}
</script>

<style scoped>

</style>
