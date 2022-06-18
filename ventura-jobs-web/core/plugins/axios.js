import {getToken, saveToken} from "@/core/services/token";

export default async ({ $axios, redirect, app }, inject) => {
  app.$fire.auth.onAuthStateChanged(async user => {
    if(user != null) {
      await user.getIdToken(true).then(token => {
        saveToken(token)
      }).catch(error => {
        console.log(error)
      })
    }
  })
  const httpClient = $axios.create({
    baseURL: process.env.NUXT_ENV_API_URL,
    headers: {
      common: {
        'Access-Control-Allow-Origin': 'https://ventura-jobs.herokuapp.com, http://localhost:3000',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With',
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer ' + getToken()
      }
    },
    credentials: false
  })

  $axios.onRequest(config => {
    // const token = getToken()

    // if(token && config.headers) {
    //   config.headers["Authorization"] = `Bearer ${token}`
    //

    return config
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)

    if(code === 400)
      redirect('/400')
  })

  $axios.onRequestError(err => {
    console.log(err)
  })

  inject('httpClient', httpClient)
}
