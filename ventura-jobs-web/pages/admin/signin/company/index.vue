<template>
  <v-container fluid style="max-width: 500px">
    <h1 style="font-size: 1.7rem; text-align: center; margin: auto">Hello Company! Signin</h1>
    <v-form>
      <v-text-field v-model="company.email" label="Digite seu melhor email"></v-text-field>
      <v-text-field v-model="company.password" label="Digite sua senha" type="password"></v-text-field>
      <div style="display: flex">
        <v-btn @click="onSubmit" style="margin: auto !important;">Logar</v-btn>
      </div>
    </v-form>
    <p style="margin-top: 30px; font-size: 1.2rem; font-weight: 300">Don't have account?
      <NuxtLink to="/admin/signup/company">Signup!</NuxtLink>
    </p>
  </v-container>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      company: {}
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(this.company.email, this.company.password)
        await this.$router.push("/admin/company")
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>

</style>
