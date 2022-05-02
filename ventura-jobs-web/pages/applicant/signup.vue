<template>
  <div class="container">
    <div class="max-w-lg m-auto">
      <v-card class="p-5">
        <h1 class="text-center text-2xl font-light mb-4">Cadastre-se!</h1>
        <v-form @submit.prevent="submit">
          <v-text-field v-model="applicant.name" label="Digite seu nome" placeholder="John Doe"></v-text-field>
          <v-text-field v-model="applicant.email" label="Digite seu melhor email" placeholder="test@test.com"></v-text-field>
          <v-text-field v-model="applicant.password" label="Digite sua senha" :type="show ? 'text' : 'password'"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show"></v-text-field>
          <v-btn type="submit" class="w-full">Cadastrar</v-btn>
          <div class="my-7 grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center">
            <span class="h-0.5 bg-gray-700"/>
            <span class="text-slate-500 text-sm font-normal">ou</span>
            <span class="h-0.5 bg-gray-700"/>
          </div>
          <p class="text-base font-medium mt-4 text-center text-zinc-500">
            <NuxtLink to="/applicant/login">
              <v-icon class="text-zinc-500">mdi-chevron-left</v-icon>
              Já tenho cadastro
            </NuxtLink>
          </p>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "signup",
  head() {
    return {
      title: 'Cadastrar como candidato'
    }
  },
  data() {
    return {
      show: false,
      applicant: {
        name: '',
        email: '',
        password: '',
        role: 'applicant'
      },
    }
  },
  methods: {
    async submit() {
      const createUserAndSetRole = this.$fire.functions.httpsCallable("createUserAndSetRole")

      await createUserAndSetRole(this.applicant).then((result) => {
        console.log(result)
      }).then(() => {
        this.$fire.auth.signOut().then(() => {
          this.$router.push("/applicant/login")
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
