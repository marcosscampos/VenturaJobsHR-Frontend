<template>
  <v-container fluid style="max-width: 500px">
    <h1 class="text-2xl text-center">Hello Applicant! Signin</h1>
    <v-form>
      <v-text-field v-model="applicant.email" label="Digite seu melhor email"></v-text-field>
      <v-text-field v-model="applicant.password" label="Digite sua senha" type="password"></v-text-field>
      <div class="flex flex-col items-center">
        <v-btn @click="onsubmit" class="w-60">Logar</v-btn>
        <v-btn @click="loginWithGoogle" class="w-60 mt-4">Logar com o Google</v-btn>
        <p class="text-lg font-light mt-4">Don't have account?
          <NuxtLink to="/admin/signup/applicant">Signup!</NuxtLink>
        </p>
      </div>
    </v-form>
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
