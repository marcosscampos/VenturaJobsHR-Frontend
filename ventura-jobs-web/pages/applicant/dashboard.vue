<template>
  <v-container>
    <h1>Applicant profile</h1>

    <v-btn @click="logout">Logout</v-btn>
  </v-container>
</template>

<script>
import {deleteToken} from "@/core/services/token";

export default {
  name: "dashboard",
  middleware: 'auth-applicant',
  head() {
    return {
      title: 'Dashboard'
    }
  },
  methods: {
    logout() {
      this.$fire.auth.signOut();
      deleteToken()
      this.$router.push('/applicant/login');
    }
  }
}
</script>

<style scoped>

</style>
