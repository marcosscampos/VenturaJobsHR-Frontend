<template>
  <div class="container">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon style="color: gray">mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container fluid style="max-width: 500px">
      <v-form>
        <v-text-field v-model="applicant.email" label="Digite seu melhor email"></v-text-field>
        <v-text-field v-model="applicant.password" label="Digite sua senha" type="password"></v-text-field>
        <div class="flex flex-col items-center">
          <v-btn @click="onsubmit" class="w-60"  style="height: 46px !important;">Logar</v-btn>
          <button @click="loginWithGoogle" class="w-60 mt-4 login-with-google-btn" type="button">Logar com o Google
          </button>
          <div class="max__width mt-4">
            <a class="twitter-before"><span class="fontawesome-twitter"></span></a>
            <button @click="loginWithTwitter" class="w-60 twitter" type="button">Logar com o Twitter</button>
          </div>
          <p class="text-lg font-light mt-4">Don't have account?
            <NuxtLink to="/applicant/signup">Signup!</NuxtLink>
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
      title: "Login como candidato"
    }
  },
  data() {
    return {
      applicant: {},
      items: [
        {
          text: 'Login - Candidato',
          disabled: true,
          href: '/applicant/login',
        }
      ]
    }
  },
  methods: {
    async onsubmit() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(this.applicant.email, this.applicant.password)
        await this.$router.push("/applicant/dashboard")
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
          role: 'applicant'
        }

        if (response.additionalUserInfo.isNewUser) {
          await setRoleOnUser(data).then(result => {
            console.log(result)
          })
        }
      }).then(() => {
        this.$router.push("/applicant/dashboard")
      })
    },
    async loginWithTwitter() {
      const setRoleOnUser = this.$fire.functions.httpsCallable("setRoleOnUser")

      let twitterProvider = new TwitterAuthProvider();
      await this.$fire.auth.signInWithPopup(twitterProvider).then(async response => {
        let data = {
          uid: response.user.uid,
          email: `Twitter Username: ${response.user.displayName}`,
          role: 'applicant'
        }

        if (response.additionalUserInfo.isNewUser) {
          await setRoleOnUser(data).then(result => {
            console.log(result)
          })
        }
      }).then(() => {
        this.$router.push("/applicant/dashboard")
      })
    }
  }
}
</script>

<style scoped>

</style>
