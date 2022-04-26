import {getToken} from "~/core/services/token";

export default function({ $axios, redirect }, inject) {
  const httpClient = $axios.create({
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*',
        ContentType: 'application/json',
      }
    }
  })

  httpClient.baseURL = process.env.NUXT_ENV_API_URL;

  $axios.onRequest(config => {
    const token = getToken()

    if(token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    return config
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)

    if(code === 400)
      redirect('/400')
  })

  inject('httpClient', httpClient)
}
