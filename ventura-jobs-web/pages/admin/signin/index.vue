<template>
  <v-container>
    <h1>Choose your login method:
      <NuxtLink to="/admin/signin/company">Company</NuxtLink>
      or
      <NuxtLink to="/admin/signin/applicant">Applicant</NuxtLink>.
    </h1>
  </v-container>
</template>

<script>
export default {
  name: "signin"
}
</script>

<style scoped>

</style>
