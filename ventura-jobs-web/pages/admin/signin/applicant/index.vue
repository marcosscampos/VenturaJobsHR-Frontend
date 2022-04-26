<template>
  <v-container fluid style="max-width: 500px">
    <h1 style="font-size: 1.7rem; text-align: center; margin: auto">Hello Applicant! Signin</h1>
    <v-form>
      <v-text-field v-model="applicant.email" label="Digite seu melhor email"></v-text-field>
      <v-text-field v-model="applicant.password" label="Digite sua senha" type="password"></v-text-field>
      <div style="display: flex">
        <v-btn @click="onsubmit" style="margin: auto !important;">Logar</v-btn>
        <v-btn style="margin: auto" @click="loginWithGoogle">Logar com o Google(Não funcional, nem clica)</v-btn>
      </div>
    </v-form>
    <p style="margin-top: 30px; font-size: 1.2rem; font-weight: 300">Don't have account?
      <NuxtLink to="/admin/signup/applicant">Signup!</NuxtLink>
    </p>
  </v-container>
</template>

<script>

export default {
  name: "index",
  data() {
    return {
      applicant: {}
    }
  },
  methods: {
    async onsubmit() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(this.applicant.email, this.applicant.password)
        await this.$router.push("/admin/applicant")
      } catch (error) {
        console.log(error)
      }
    },
    async loginWithGoogle() {
      let googleProvider = await this.$auth.loginWith('google', { params: { prompt: 'select_account' } })
      // await this.$fire.auth.signInWithPopup()
    }
  }
}
</script>

<style scoped>

</style>
