<template>
  <v-container>
    <v-card max-width="500" class="ma-auto">
      <v-card-title>
        <h1 class="text-center text-2xl font-light mb-4 m-auto">Complete seu cadastro!</h1>
      </v-card-title>
      <v-card-text>
        <ValidationObserver v-slot="{invalid}" ref="observer">
          <v-form @submit.prevent="createUser">
            <ValidationProvider v-slot="{ errors }" rules="required" name="Nome">
              <v-text-field label="Nome" placeholder="John Doe" v-model="user.name"
                            :error-messages="errors"></v-text-field>
            </ValidationProvider>

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
              <v-text-field label="Endereço" v-model="user.address.completeAddress"
                            :error-messages="errors"></v-text-field>
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" rules="required" name="Complemento">
              <v-text-field label="Complemento" v-model="user.address.complement"
                            :error-messages="errors"></v-text-field>
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" rules="required" name="Cidade">
              <v-text-field label="Cidade" v-model="user.address.city" :error-messages="errors"></v-text-field>
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" rules="required" name="Estado">
              <v-text-field label="Estado" v-model="user.address.state" :error-messages="errors"></v-text-field>
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

            <div v-if="registrationErrors.length">
              <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
              <ul>
                <li v-for="error in registrationErrors"
                    style="color: #ff1744;">{{ error }}
                </li>
              </ul>
            </div>

            <div class="flex flex-row justify-center">
              <v-btn @click.stop="validForm($event)" :disabled="invalid">Finalizar cadastro</v-btn>
            </div>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import check from "@/components/check";
import {TheMask} from 'vue-the-mask'
import {extend, setInteractionMode, ValidationObserver, ValidationProvider} from "vee-validate";
import {required} from "vee-validate/dist/rules";

extend('required', {
  ...required,
  message: 'Campo {_field_} não pode ficar em branco.',
  computesRequired: true
})

setInteractionMode('eager')

export default {
  name: "complete-registration",
  components: {TheMask, ValidationProvider, ValidationObserver},
  computed: mapState({
    error: state => state.users.error
  }),
  head() {
    return {
      title: 'Complete seu cadastro'
    }
  },
  data() {
    return {
      registrationErrors: [],
      user: {
        firebaseId: null,
        name: null,
        phone: null,
        email: null,
        address: {
          completeAddress: null,
          complement: null,
          postalCode: null,
          city: null,
          state: null
        },
        userType: 0,
        legalRecord: {
          corporateName: "",
          cpf: "",
          cnpj: ""
        }
      },
      lineLight: 'h-0.5 bg-neutral-200',
      lineDark: 'h-0.5 bg-neutral-800'
    }
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'users/CREATE_USER') {
        check.hasError(this.error, result => {
          if (!result) {
            this.$router.push('/applicant/dashboard')
          }
        })
      }
    })
  },
  methods: {
    validForm(e) {
      this.registrationErrors = [];

      if (this.isNullOrWhiteSpace(this.user.phone)) {
        this.registrationErrors.push("O campo Telefone é obrigatório.");
      }

      if (this.isNullOrWhiteSpace(this.user.legalRecord.cpf)) {
        this.registrationErrors.push("O campo CPF é obrigatório.");
      }

      if (this.isNullOrWhiteSpace(this.user.address.postalCode)) {
        this.registrationErrors.push("O campo CEP é obrigatório.");
      }

      if (!this.registrationErrors.length) {
        this.createUser()
      }

      e.preventDefault();
    },
    isNullOrWhiteSpace(value) {
      return !value || !value.trim();
    },
    createUser() {
      this.user.email = this.$fire.auth.currentUser.email;
      this.user.firebaseId = this.$fire.auth.currentUser.uid;

      this.$store.dispatch({type: "users/createUser", user: this.user})
    }
  },
  ...mapMutations(['users/CREATE_USER']),
  beforeDestroy() {
    this.unsub()
  }
}
</script>
<style scoped>

</style>
