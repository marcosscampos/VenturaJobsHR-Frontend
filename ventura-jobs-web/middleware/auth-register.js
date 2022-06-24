export default async ({app, $httpClient, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async auth => {
    if (auth != null) {
      let claims = (await auth.getIdTokenResult(true)).claims

      new Promise(async (resolve, reject) => {
        await $httpClient.$get('v1/users/user-token').then(response => {
          if (response == null || response == "") {
            redirect(`/${claims.role}/account/complete-registration`);
          }
          resolve(response)
        }).catch(err => {})
      })
    }
  })
}
