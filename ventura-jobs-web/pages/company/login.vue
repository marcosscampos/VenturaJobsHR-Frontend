<template>
  <div class="container">
    <div class="max-w-lg m-auto">
      <ValidationObserver v-slot="{invalid}" ref="observer">
        <v-form>
          <v-card class="p-5">
            <h1 class="text-center text-2xl font-light mb-4">Login Empresa</h1>
            <ValidationProvider v-slot="{ errors }" rules="required|email" name="Email">
              <v-text-field v-model="company.email"
                            label="Digite seu melhor email"
                            placeholder="John Doe"
                            :error-messages="errors"></v-text-field>
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" rules="required|min:6" name="Senha">
              <v-text-field v-model="company.password" label="Digite sua senha" :type="show ? 'text' : 'password'"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="show = !show" :error-messages="errors"></v-text-field>
            </ValidationProvider>

            <v-btn @click="onSubmit" class="w-full" :disabled="invalid">Entrar</v-btn>
            <div class="my-7 grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center">
              <span class="h-0.5 bg-gray-700"/>
              <span class="text-slate-500 text-sm font-normal">ou</span>
              <span class="h-0.5 bg-gray-700"/>
            </div>
            <div class="flex flex-col gap-3 my-7">
              <div class="flex justify-center items-center flex-row gap-2">
                <button @click="loginWithGoogle" class="w-60 login-with-google-btn" type="button">Google</button>
                <button @click="loginWithTwitter" class="w-60 twitter" type="button">
                  <v-icon icon class="float-left">mdi-twitter</v-icon>
                  Twitter
                </button>
              </div>
            </div>
            <p class="text-base font-medium mt-4 text-center text-zinc-500">
              <NuxtLink to="/company/signup">
                Não tenho cadastro
                <v-icon class="text-zinc-500">mdi-chevron-right</v-icon>
              </NuxtLink>
            </p>
            <p class="text-base font-medium mt-4 text-center text-zinc-500">
              <NuxtLink to="/company/forgot-password">
                <v-icon class="text-zinc-500">mdi-chevron-left</v-icon>
                Esqueci a senha
                <v-icon class="text-zinc-500">mdi-chevron-right</v-icon>
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
          @click="removeCookie">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {GoogleAuthProvider, TwitterAuthProvider} from 'firebase/auth';
import {ValidationProvider, ValidationObserver, setInteractionMode, extend} from 'vee-validate'
import {required, email, min} from 'vee-validate/dist/rules'

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

extend('min', {
  validate(value, args) {
    return value.length >= args.length
  },
  message: 'Tamanho mínimo da {_field_} é de 6 caracteres.',
  params: ['length']
})

setInteractionMode('eager')

export default {
  name: "login",
  components: {ValidationProvider, ValidationObserver},
  head() {
    return {
      title: "Login como empresa"
    }
  },
  data() {
    return {
      show: false,
      company: {},
      timeout: 4500,
      snackbar: false,
      text: ''
    }
  },
  methods: {
    removeCookie() {
      this.snackbar = false
      this.$cookiz.remove('@ventura/token')
    },
    async onSubmit() {
      await this.$fire.auth.signInWithEmailAndPassword(this.company.email, this.company.password).then(async user => {
        await user.user.getIdTokenResult(true).then(async result => {
          if(result.claims.role != "company") {
            await this.$fire.auth.signOut();
            this.snackbar = true;
            this.text = "Sua conta é perfil Candidato. Favor, acessar o login de acesso de candidatos."
          } else {
            let token = result.token
            this.$cookiz.set("@ventura/token", token)
            await this.$router.push("/company/dashboard")
          }
        })
      }).catch(() => {
        this.snackbar = true
        this.text = 'Atenção! Usuário ou senha inválidos.'
      })
    },
    async loginWithGoogle() {
      const setRoleOnUser = this.$fire.functions.httpsCallable("setRoleOnUser")

      let googleProvider = new GoogleAuthProvider();
      await this.$fire.auth.signInWithPopup(googleProvider).then(async response => {
        let data = {
          uid: response.user.uid,
          email: response.user.email,
          role: 'company'
        }

        if (response.additionalUserInfo.isNewUser) {
          await setRoleOnUser(data).then(result => { })
        }
      }).then(() => {
        this.$router.push("/company/dashboard")
      }).catch(() =>{})
    },
    async loginWithTwitter() {
      const setRoleOnUser = this.$fire.functions.httpsCallable("setRoleOnUser")

      let twitterProvider = new TwitterAuthProvider();
      await this.$fire.auth.signInWithPopup(twitterProvider).then(async response => {
        let data = {
          uid: response.user.uid,
          email: `Twitter Username: ${response.user.displayName}`,
          role: 'company'
        }

        if (response.additionalUserInfo.isNewUser) {
          await setRoleOnUser(data).then(result => {})
        }
      }).then(() => {
        this.$router.push("/company/dashboard")
      }).catch(() =>{})
    }
  }
}
</script>

<style scoped>

</style>
