import {getToken, saveToken} from "@/core/services/token";

export default async ({app, route, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async user => {
    if (user == null) {
      redirect('/admin/signin/company')
    } else {
      let token = await user.getIdTokenResult()
      saveToken(token.token)
    }
  })
}
