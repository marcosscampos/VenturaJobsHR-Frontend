<template>
  <div class="container">
    <div class="max-w-lg m-auto">
      <v-card class="p-5">
        <h1 class="text-center text-2xl font-light mb-4">Cadastre-se como empresa!</h1>
        <ValidationObserver v-slot="{invalid}" ref="observer">
          <v-form @submit.prevent="submit" class="ma-auto">
            <ValidationProvider v-slot="{ errors }" rules="required|email" name="Email">
              <v-text-field v-model="company.email" label="Digite seu melhor email"
                            placeholder="test@test.com" :error-messages="errors"></v-text-field>
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" rules="required|min:6" name="Senha">
              <v-text-field v-model="company.password" label="Digite sua senha" :type="show ? 'text' : 'password'"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show"
                            :error-messages="errors"></v-text-field>
            </ValidationProvider>

            <v-btn type="submit" class="w-full" :disabled="invalid">Cadastrar</v-btn>
            <div class="my-7 grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center">
              <span class="h-0.5 bg-gray-700"/>
              <span class="text-slate-500 text-sm font-normal">ou</span>
              <span class="h-0.5 bg-gray-700"/>
            </div>
            <p class="text-base font-medium mt-4 text-center text-zinc-500">
              <NuxtLink to="/company/login">
                <v-icon class="text-zinc-500">mdi-chevron-left</v-icon>
                Já tenho cadastro
              </NuxtLink>
            </p>
          </v-form>
        </ValidationObserver>
      </v-card>
    </div>
  </div>
</template>

<script>
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
  name: "signup",
  components: {ValidationProvider, ValidationObserver},
  head() {
    return {
      title: 'Cadastrar como empresa'
    }
  },
  data() {
    return {
      show: false,
      company: {
        email: '',
        password: '',
        role: 'company'
      },
    }
  },
  methods: {
    async submit() {
      const createUserAndSetRole = this.$fire.functions.httpsCallable("createUserAndSetRole")

      await createUserAndSetRole(this.company).then((result) => {
        console.log(result)
      }).then(() => {
        this.$fire.auth.signOut().then(() => {
          this.$router.push("/company/login")
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
