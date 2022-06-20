<template>
  <div class="container">
    <div class="max-w-lg m-auto">
      <ValidationObserver v-slot="{invalid}" ref="observer">
        <v-form>
          <v-card class="p-5">
            <h1 class="text-center text-2xl font-light mb-4">Insira seu email</h1>
            <ValidationProvider v-slot="{ errors }" rules="required|email" name="Email">
              <v-text-field v-model="user.email"
                            label="Digite seu melhor email"
                            placeholder="John Doe"
                            :error-messages="errors"></v-text-field>
            </ValidationProvider>
            <v-btn @click="forgotPassword" class="w-full" :disabled="invalid">Enviar</v-btn>
            <p class="text-base font-medium mt-4 text-center text-zinc-500">
              <NuxtLink to="/company/login">
                <v-icon class="text-zinc-500">mdi-chevron-left</v-icon>
                Voltar
              </NuxtLink>
            </p>
          </v-card>
        </v-form>
      </ValidationObserver>
    </div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {ValidationProvider, ValidationObserver, setInteractionMode, extend} from 'vee-validate'
import {required, email, min} from 'vee-validate/dist/rules'
import Swal from "sweetalert2";

extend('required', {
  ...required,
  message: 'Campo {_field_} não pode ficar em branco.',
  computesRequired: true
})

extend('email', {
  ...email,
  message: 'Email inválido.',
  computesRequired: true
})

setInteractionMode('eager')
export default {
  name: "forgot-password",
  components: {ValidationProvider, ValidationObserver},
  head() {
    return {
      title: "Esqueci a senha"
    }
  },
  data() {
    return {
      show: false,
      user: {},
      timeout: 4500,
      snackbar: false,
      text: ''
    }
  },
  methods: {
    async forgotPassword() {
      await this.$fire.auth.sendPasswordResetEmail(this.user.email).then(() => {
        this.text = 'Sucesso! Verifique seu email para resetar sua senha.'
        this.snackbar = true
        setTimeout(() => {
          this.$router.push("/company/login")
        }, this.timeout)
      }).catch(() => {
        this.snackbar = true
        this.text = 'Não existe esse email em nosso banco de dados ou o email está inválido. Verifique seu email.'
      })
    },
  }
}
</script>

<style scoped>

</style>
