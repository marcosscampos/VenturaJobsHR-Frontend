import Swal from "sweetalert2";
import {deleteToken} from "@/core/services/token";

export default async ({app, route, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async user => {
    if (user == null) {
      redirect('/applicant/login')
    } else {
      let token = await user.getIdTokenResult()

      if (token.claims.role != 'applicant') {
        Swal.fire({
          icon: 'error',
          title: 'Atenção!',
          html: 'Sua conta é perfil Empresa. Favor, acesse a página de login de empresas.',
          confirmButtonText: 'Fechar'
        })

        deleteToken();
        redirect('/applicant/login')
        await app.$fire.auth.signOut()
      }
    }
  })
}
