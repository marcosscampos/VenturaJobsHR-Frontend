import {saveToken} from "@/core/services/token";

export default async ({app, route, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async user => {
    if (user == null) {
      redirect('/admin/signin/company')
    } else {
      let token = await user.getIdTokenResult()

      if (token.claims.role != 'company') {
        redirect('/admin/signin/company')
        await app.$fire.auth.signOut()
      } else {
        saveToken(token.token)
      }
    }
  })
}
