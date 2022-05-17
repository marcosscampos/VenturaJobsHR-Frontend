import Swal from "sweetalert2";
// import '@sweetalert2/theme-dark'

const checar = {
  hasError(erro, callback) {
    if (erro != null) {
      var mensagem = "";
      if (erro.errors != null) {
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(erro.errors)) {
          if (mensagem != "") {
            mensagem = mensagem + "<br/>";
          }
          mensagem = mensagem + value;
        }
      }
      else {
        if (erro.status != null) {
          mensagem = mensagem + "Erro code: " + erro.status + "<br/>"
        }
        if (erro.title != null) {
          mensagem = mensagem + "Erro title: " + erro.title;
        }
      }
      // eslint-disable-next-line
      Swal.fire({
        icon: 'error',
        title: erro.message,
        html: mensagem
      });
      callback(true);
    } else {
      // eslint-disable-next-line
      Swal.fire({
        title: 'Sucesso!',
        text: 'Operação realizada com sucesso!',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
      callback(false);
    }
  },
  hasErrorNotifications(erro, callback) {
    if (erro != null) {
      var mensagem = "";
      if (erro.errors != null) {
        for(const [key, value] of Object.entries(erro.errors)) {
          for (const [entryKey, entryValue] of Object.entries(value)) {
            for(var item of entryValue) {
              if (mensagem != "") {
                mensagem = mensagem + "<br/>";
              }
              mensagem = mensagem + item.message;
            }
          }
        }
      }
      else {
          mensagem = "Erro desconhecido."
      }
      // eslint-disable-next-line
      Swal.fire({
        icon: 'error',
        title: "Falha ao validar os parâmetros!",
        html: mensagem
      });
      callback(true);
    } else {
      // eslint-disable-next-line
      Swal.fire({
        title: 'Sucesso!',
        text: 'Operação realizada com sucesso!',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
      callback(false);
    }
  },
  hasErrorWithoutSuccessMessage(erro, callback) {
    if (erro != null) {
      var mensagem = "";
      if (erro.errors != null) {
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(erro.errors)) {
          if (mensagem != "") {
            mensagem = mensagem + "<br/>";
          }
          mensagem = mensagem + value;
        }
      }
      else {
        if (erro.status != null) {
          mensagem = mensagem + "Erro code: " + erro.status + "<br/>"
        }
        if (erro.title != null) {
          mensagem = mensagem + "Erro title: " + erro.title;
        }
      }
      // eslint-disable-next-line
      Swal.fire({
        icon: 'error',
        title: erro.message,
        html: mensagem
      });
      callback(true);
    } else {
      callback(false);
    }
  },
  confirm(msg, callback) {
    // eslint-disable-next-line
    Swal.fire({
      title: msg != "" ? msg : 'Deseja confirmar a operação?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim'
    }).then((result) => {
      callback(result.value)
    })
  },

  permission(v) {
    return true;
    let permission = false;
    if (v.rolesJwt != null && v.roles != null) {
      for (var i = 0; i < v.roles.length; i++) {
        if (v.rolesJwt.includes(v.roles[i])) {
          permission = true;
          break;
        }
      }
    }
    return permission;
  },

  permission401(v) {
    return true;
    if (!this.permission(v)) {
      if (process.env.NUXT_ENV_API_URL === '/') {
        window.location = '/401';
      }
      else {
        window.location = process.env.NUXT_ENV_API_URL + '/401';
      }
    }
  }
};

export default checar;
