<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
    >
      <v-list>
        <v-list-item to="/" router exact class="mb-2" v-if="user == null">
          <v-list-item-action>
            <v-icon>mdi-apps</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Página Principal</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/jobs" router exact class="mb-2" v-if="user != null">
          <v-list-item-action>
            <v-icon>mdi-chart-bubble</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Vagas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="'/' + role + '/dashboard'" router exact class="mb-2" v-if="user != null">
          <v-list-item-action>
            <v-icon>mdi-desktop-mac-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user == null" class="px-1">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Login
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list>
                  <v-list-item to="/company/login" router exact>
                    <v-list-item-action>
                      <v-icon>mdi-briefcase</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>Login como empresa</v-list-item-content>
                  </v-list-item>
                  <v-list-item to="/applicant/login" router exact>
                    <v-list-item-action>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>Login como candidato</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-list-item>
        <v-list-item class="mb-2" v-else @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
        @click="setVariant"
      >
        <v-icon>mdi-{{ `chevron-${!miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" @click="$router.push(user != null ? `/${role}/dashboard` : '/')" class="toolbar-title"/>
      <v-spacer/>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} Ventura Jobs HR</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      user: null,
      clipped: false,
      drawer: '',
      miniVariant: false,
      title: 'Ventura Jobs HR',
      role: ''
    }
  },
  beforeMount() {
    this.miniVariant = JSON.parse(localStorage.getItem('miniVariant'))
    this.drawer = !this.isMobile()
  },
  methods: {
    setVariant() {
      if (localStorage.getItem('miniVariant') == null)
        localStorage.setItem('miniVariant', this.miniVariant)
      else {
        localStorage.removeItem('miniVariant')
        localStorage.setItem('miniVariant', this.miniVariant)
      }
    },
    logout() {
      this.$fire.auth.signOut()
      this.$router.push('/')
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  },
  created() {
    this.$fire.auth.onAuthStateChanged(async user => {
      this.user = user != null || user != undefined ? user.uid : null
      if (user != null) {
        await user.getIdTokenResult().then(x => {
          this.role = x.claims.role
        })
      }
    })
  }
}
</script>
<style>
.toolbar-title:hover {
  cursor: pointer;
}
</style>
