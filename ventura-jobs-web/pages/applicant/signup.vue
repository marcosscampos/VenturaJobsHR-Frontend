<template>
  <div class="container">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon style="color: gray">mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container fluid style="max-width: 500px">
      <h1 style="margin: auto; font-size: 1.7rem; text-align: center">Cadastre-se!</h1>
      <v-form @submit.prevent="submit">
        <v-text-field v-model="applicant.email" label="Digite seu melhor email"></v-text-field>
        <v-text-field v-model="applicant.password" label="Digite sua senha" type="password"></v-text-field>
        <div style="display: flex">
          <v-btn type="submit" style="margin: auto !important;">Cadastrar</v-btn>
        </div>
      </v-form>
    </v-container>
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
      applicant: {
        email: '',
        password: '',
        role: 'applicant'
      },
      items: [
        {
          text: 'Login - Candidato',
          disabled: false,
          href: '/applicant/login',
        },
        {
          text: 'Cadastro - Candidato',
          disabled: true,
          href: '#',
        }
      ]
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
