export default ({app, redirect, route}) => {
  // const loggedIn = false;

  // if(route.name != 'jobs') {
  //   if(!loggedIn) {
  //     console.log('Usuário não logado!')
  //     redirect('/jobs')
  //   } else {
  //     console.log(`Vaga id ${route.params.id}`)
  //   }
  // }

  // app.$fire.functions.httpsCallable('roles', (options) => {
  //
  // })
  // app.$fire.auth.createUserWithEmailAndPassword(newUser.email, newUser.password).then(response => {
  //   response.
  // })
  //

  // app.$fire.auth.signInWithEmailAndPassword(newUser.email, newUser.password).then(response => {
  //   console.log(response)
  //
  //   if(response.user != null) {
  //     let user = app.$fire.auth.currentUser;
  //
  //     if (user == null && isRouteName(route.name, 'jobs')) {
  //       redirect('/jobs')
  //       console.log('Usuário não está logado!')
  //       console.log(user)
  //     } else {
  //       console.log(`Usuário logado. Vaga ID #${route.params.id}`)
  //       console.log(user.email)
  //     }
  //   } else {
  //     console.error('erro')
  //   }
  //
  // })


}

function isRouteName(name, routeName) {
  return name != routeName
}


