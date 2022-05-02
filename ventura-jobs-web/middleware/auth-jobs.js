import Swal from "sweetalert2";

export default async ({app, route, redirect}) => {
  app.$fire.auth.onAuthStateChanged(async user => {
    if (user == null) {
      Swal.fire({
        icon: 'error',
        title: 'Usuário não logado!',
        html: 'Favor, para acessar a vaga, cadastre-se ou faça o login.',
        confirmButtonText: 'Fechar',
      })
      return redirect('/')
    }
  })
}
