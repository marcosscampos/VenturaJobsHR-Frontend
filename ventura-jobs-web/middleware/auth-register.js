export default async ({app, $httpClient, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async auth => {
    let result = await auth.getIdTokenResult();

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${result.token}`
      }
    }

    new Promise((resolve, reject) => {
      $httpClient.$get("v1/users/user-token", config).then(res => {
        if(res == null || res == "") {
          redirect(`/${result.claims.role}/account/complete-registration`);
        }
      })
    })
  })
}
