import {saveToken} from "@/core/services/token";

export default async ({app, route, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async user => {
    if (user == null) {
      redirect('/applicant/login')
    } else {
      let token = await user.getIdTokenResult()

      if (token.claims.role != 'applicant') {
        redirect('/applicant/login')
        await app.$fire.auth.signOut()
      } else {
        saveToken(token.token)
      }
    }
  })
}
