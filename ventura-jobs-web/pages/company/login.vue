<template>
  <div class="container">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon style="color: gray">mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container fluid style="max-width: 500px">
      <v-form>
        <v-text-field v-model="company.email" label="Digite seu melhor email"></v-text-field>
        <v-text-field v-model="company.password" label="Digite sua senha" type="password"></v-text-field>
        <div class="flex flex-col items-center">
          <v-btn @click="onSubmit" class="w-60" style="height: 46px !important;">Logar</v-btn>
          <button @click="loginWithGoogle" class="w-60 mt-4 login-with-google-btn" type="button">Logar com o Google
          </button>
          <div class="max__width mt-4">
            <a class="twitter-before"><span class="fontawesome-twitter"></span></a>
            <button @click="loginWithTwitter" class="w-60 twitter" type="button">Logar com o Twitter</button>
          </div>
          <p class="text-lg font-light mt-4">Don't have account?
            <NuxtLink to="/company/signup">Signup!</NuxtLink>
          </p>
        </div>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import {GoogleAuthProvider, TwitterAuthProvider} from 'firebase/auth';

export default {
  name: "login",
  head() {
    return {
      title: "Login como empresa"
    }
  },
  data() {
    return {
      company: {},
      items: [
        {
          text: 'Login - Empresa',
          disabled: true,
          href: '/company/login',
        }
      ]
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(this.company.email, this.company.password)
        await this.$router.push("/company/dashboard")
      } catch (error) {
        console.log(error)
      }
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
          await setRoleOnUser(data).then(result => {
            console.log(result)
          })
        }
      }).then(() => {
        this.$router.push("/company/dashboard")
      })
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
          await setRoleOnUser(data).then(result => {
            console.log(result)
          })
        }
      }).then(() => {
        this.$router.push("/company/dashboard")
      })
    }
  }
}
</script>

<style scoped>

</style>
