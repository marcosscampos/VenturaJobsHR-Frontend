<template>
  <div class="container">
    <div class="max-w-lg m-auto">
      <v-form>
        <v-card class="p-5">
          <h1 class="text-center text-2xl font-light mb-4">Entre no seu perfil</h1>
          <v-text-field v-model="company.email" label="Digite seu melhor email"  placeholder="John Doe"></v-text-field>
          <v-text-field v-model="company.password" label="Digite sua senha" :type="show ? 'text' : 'password'"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show"></v-text-field>
          <v-btn @click="onSubmit" class="w-full">Entrar</v-btn>
          <div class="my-7 grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center">
            <span class="h-0.5 bg-gray-700"/>
            <span class="text-slate-500 text-sm font-normal">ou</span>
            <span class="h-0.5 bg-gray-700"/>
          </div>
          <div class="flex flex-col gap-3 my-7">
            <div class="flex justify-center items-center flex-row gap-2">
              <button @click="loginWithGoogle" class="w-60 login-with-google-btn" type="button">Google</button>
              <button @click="loginWithTwitter" class="w-60 twitter" type="button">
                <v-icon icon class="float-left">mdi-twitter</v-icon>
                Twitter
              </button>
            </div>
          </div>
          <p class="text-base font-medium mt-4 text-center text-zinc-500">
            <NuxtLink to="/company/signup">
              Não tenho cadastro
              <v-icon class="text-zinc-500">mdi-chevron-right</v-icon>
            </NuxtLink>
          </p>
        </v-card>
      </v-form>
    </div>
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
      show: false,
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
