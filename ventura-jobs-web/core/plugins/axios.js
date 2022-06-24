export default async ({$axios, redirect, app}, inject) => {
  const tokenKey = "@ventura/token"

  app.$fire.auth.onIdTokenChanged(async token => {
    if(token != null){
      app.$cookiz.set(tokenKey, (await token.getIdTokenResult(true)).token)
    }
  })

  const httpClient = $axios.create({
    baseURL: process.env.NUXT_ENV_API_URL,
    headers: {
      common: {
        'Access-Control-Allow-Origin': 'https://ventura-jobs.herokuapp.com, https://ventura-jobs-bff.herokuapp.com, http://localhost:3000',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With',
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'authorization': 'Bearer ' + app.$cookiz.get(tokenKey)
      },
    },
    credentials: true
  })

  httpClient.onRequest(config => {
    let token = app.$cookiz.get(tokenKey)

    if(token && config.headers.common) {
      httpClient.setHeader('authorization', 'Bearer ' + token)
    }
  })

  httpClient.onResponse(response => {})

  httpClient.onResponseError(error => {
    console.log(error)
  })

  httpClient.onError(error => {
    const code = parseInt(error.response && error.response.status)
    console.log(error)

    if (code === 400)
      redirect('/400')
  })

  inject('httpClient', httpClient)
}
