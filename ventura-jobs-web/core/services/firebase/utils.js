export default {
  async createUser(email, password) {
    try {
      await this.$fire.auth.createUserWithEmailAndPassword(email, password)
    } catch(e) {
      console.error(e)
    }
  }
}
