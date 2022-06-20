<template>
  <div class="container">
    <div class="flex">
      <div class="flex-none w-14">
        <Nuxt-Link to="/company/dashboard" class="arrow__utils">
          <v-btn icon height="50" width="50">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </Nuxt-Link>
      </div>
      <div class="flex-1 w-64">
        <v-card max-width="500" class="m-auto">
          <v-card-title>
            <h1 class="text-center text-2xl font-light mb-4 m-auto">Atualizar Cadastro</h1>
          </v-card-title>
          <v-card-text>
            <ValidationObserver v-slot="{invalid}" ref="observer">
              <div v-if="profileErrors.length">
                <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
                <ul>
                  <li v-for="error in profileErrors"
                      style="color: #ff1744;">{{ error }}
                  </li>
                </ul>
              </div>
              <v-form @submit.prevent="updateUser">
                <ValidationProvider v-slot="{ errors }" rules="required" name="Nome">
                  <v-text-field label="Nome"
                                placeholder="John Doe"
                                v-model="user.name"
                                :error-messages="errors"></v-text-field>
                </ValidationProvider>

                <v-text-field label="Email" v-model="user.email" disabled></v-text-field>

                <div class="v-text-field__slot">
                  <label>Telefone</label>
                  <the-mask :mask="['(##) ####-####', '(##) #####-####']"
                            placeholder="(##) #####-####"
                            type="tel"
                            class="v-input__slot mask-input"
                            v-model="user.phone"></the-mask>
                </div>

                <div class="v-text-field__slot">
                  <label>CPF</label>
                  <the-mask :mask="[ '###.###.###-##']"
                            placeholder="###.###.###-##"
                            class="v-input__slot mask-input"
                            v-model="user.legalRecord.cpf"></the-mask>
                </div>

                <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                </div>

                <h1 class="text-center text-xl font-light mb-4 m-auto">Endereço</h1>
                <ValidationProvider v-slot="{ errors }" rules="required" name="Endereço">
                  <v-text-field label="Endereço"
                                v-model="user.address.completeAddress"
                                :error-messages="errors"></v-text-field>
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required" name="Complemento">
                  <v-text-field label="Complemento"
                                v-model="user.address.complement"
                                :error-messages="errors"></v-text-field>
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required" name="Cidade">
                  <v-text-field label="Cidade"
                                v-model="user.address.city"
                                :error-messages="errors"></v-text-field>
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="required" name="Estado">
                  <v-text-field label="Estado"
                                v-model="user.address.state"
                                :error-messages="errors"></v-text-field>
                </ValidationProvider>

                <div class="v-text-field__slot">
                  <label>CEP</label>
                  <the-mask :mask="['#####-###']"
                            placeholder="#####-###"
                            class="v-input__slot mask-input"
                            v-model="user.address.postalCode"></the-mask>
                </div>

                <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                  <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
                </div>

                <div class="flex flex-row justify-center">
                  <v-btn @click.stop="validProfileForm($event)" :disabled="invalid">Atualizar cadastro</v-btn>
                </div>
              </v-form>
            </ValidationObserver>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import {TheMask} from "vue-the-mask";
import check from "@/components/check";
import {mapMutations, mapState} from "vuex";
import {ValidationProvider, ValidationObserver, setInteractionMode, extend} from 'vee-validate'
import {required} from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'Campo {_field_} não pode ficar em branco.',
  computesRequired: true
})
setInteractionMode('eager')

export default {
  name: "account",
  components: {TheMask, ValidationProvider, ValidationObserver},
  computed: mapState({
    error: state => state.users.error
  }),
  head() {
    return {
      title: 'Atualizar cadastro'
    }
  },
  data() {
    return {
      lineLight: 'h-0.5 bg-neutral-200',
      lineDark: 'h-0.5 bg-neutral-800',
      profileErrors: []
    }
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
      if (mutation.type == 'users/UPDATE_USER') {
        check.hasError(this.error, result => {
          if (!result) {
          }
        })
      }
    })
  },
  methods: {
    isNullOrWhiteSpace(value) {
      return !value || !value.trim();
    },
    validProfileForm(e) {
      this.profileErrors = [];

      if (this.isNullOrWhiteSpace(this.user.phone)) {
        this.profileErrors.push("O campo Telefone é obrigatório.");
      }

      if (this.isNullOrWhiteSpace(this.user.legalRecord.cpf)) {
        this.profileErrors.push("O campo CPF é obrigatório.");
      }

      if (this.isNullOrWhiteSpace(this.user.address.postalCode)) {
        this.profileErrors.push("O campo CEP é obrigatório.");
      }

      if (!this.profileErrors.length) {
        this.updateUser();
      }

      e.preventDefault();
    },
    createUserObject() {
      return {
        id: this.user.id,
        name: this.user.name,
        phone: this.user.phone,
        email: this.user.email,
        address: this.user.address,
        legalRecord: this.user.legalRecord
      }
    },
    updateUser() {
      let updatedUser = this.createUserObject();
      this.$refs.observer.validate().then(result => {
        if (result) {
          this.$store.dispatch({type: "users/updateUser", user: updatedUser})
        }
      })
    }
  },
  beforeDestroy() {
    this.unsub()
  },
  ...mapMutations(['users/UPDATE_USER']),
}
</script>

<style scoped>

</style>
