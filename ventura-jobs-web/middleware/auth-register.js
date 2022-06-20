import {getRole, saveRole} from "@/core/services/localStorage";
import {getToken} from "@/core/services/token";

export default async ({app, $axios, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async auth => {
    if (auth != null) {
      auth.getIdTokenResult(true).then(result => {
        saveRole(result.claims.role)
      })

      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      }

      const response = await $axios.$get('v1/users/user-token', config);
      if (response == null) {
        redirect(`/${getRole()}/account/complete-registration`);
      }
    }
  })
}
