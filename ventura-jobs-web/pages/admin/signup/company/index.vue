<template>
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
</template>

<script>

export default {
  name: "index",
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
      }
    }
  },
  methods: {
    async submit() {
      const createUserAndSetRole = this.$fire.functions.httpsCallable("createUserAndSetRole")

      await createUserAndSetRole(this.company).then((result) => {
        console.log(result)
      }).then(() => {
        this.$fire.auth.signOut().then(() => {
          this.$router.push("/admin/signin/company")
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
