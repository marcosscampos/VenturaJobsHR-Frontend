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
        <v-text-field v-model="company.email" label="Digite seu melhor email"></v-text-field>
        <v-text-field v-model="company.password" label="Digite sua senha" type="password"></v-text-field>
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
      title: 'Cadastrar como empresa'
    }
  },
  data() {
    return {
      company: {
        email: '',
        password: '',
        role: 'company'
      },
      items: [
        {
          text: 'Login - Empresa',
          disabled: false,
          href: '/company/login',
        },
        {
          text: 'Cadastro - Empresa',
          disabled: true,
          href: '#',
        }
      ]
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
