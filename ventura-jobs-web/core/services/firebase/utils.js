// export async function createUser(email, password, role) {
//   try {
//     let createdUser = await this.$fire.auth.createUserWithEmailAndPassword(email, password)
//
//     await createdUser.user.getIdTokenResult(false).then(response => {
//       response.claims
//     })
//     // await this.$fire.auth().setCustomUserClaims(uid, {role})
//
//   } catch (e) {
//     console.error(e)
//   }
// }
//
