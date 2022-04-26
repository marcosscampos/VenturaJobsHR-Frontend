<template>
  <v-container>
    <h1>Company profile</h1>

    <v-btn @click="logout">Logout</v-btn>
  </v-container>
</template>

<script>
import {deleteToken} from '@/core/services/token'

export default {
  name: "company",
  middleware: 'auth-company',
  head() {
    return {
      title: 'Dashboard'
    }
  },
  methods: {
    logout() {
      this.$fire.auth.signOut();
      deleteToken()
      this.$router.push('/admin/signin/company');
    }
  }
}
</script>

<style scoped>

</style>
