export default function({ $axios, redirect, app }, inject) {
  const httpClient = $axios.create({
    baseURL: process.env.NUXT_ENV_API_URL,
    headers: {
      common: {
        'Access-Control-Allow-Origin': 'https://ventura-jobs.herokuapp.com, http://localhost:3000',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With',
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
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
