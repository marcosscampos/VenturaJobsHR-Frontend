import Swal from "sweetalert2";
import {deleteToken} from "@/core/services/token";

export default async ({app, route, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async user => {
    if (user == null) {
      redirect('/company/login')
    } else {
      let token = await user.getIdTokenResult()

      if (token.claims.role != 'company') {
        Swal.fire({
          icon: 'error',
          title: 'Atenção!',
          html: 'Sua conta é perfil Candidato. Favor, acesse a página de login de candidatos.',
          confirmButtonText: 'Fechar'
        })

        deleteToken();
        redirect('/company/login')
        await app.$fire.auth.signOut()
      }
    }
  })
}
