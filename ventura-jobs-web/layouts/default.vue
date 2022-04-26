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
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list-item @click="logout" v-if="user != null">
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="Logout" />
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
        @click="setVariant"
      >
        <v-icon>mdi-{{ `chevron-${!miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" @click="$router.push('/')" class="toolbar-title"/>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
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
  data () {
    return {
      user: null,
      Logout: 'Logout',
      clipped: false,
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Página Principal',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Vagas',
          to: '/jobs'
        },
        {
          icon: 'mdi-account',
          title: 'Login',
          to: '/admin/signin'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Ventura Jobs HR'
    }
  },
  beforeMount() {
    this.miniVariant = JSON.parse(localStorage.getItem('miniVariant'))
  },
  mounted() {
  },
  methods: {
    logout() {
      console.log("deslogou")
    },
    setVariant() {
      if(localStorage.getItem('miniVariant') == null)
          localStorage.setItem('miniVariant', this.miniVariant)
      else {
        localStorage.removeItem('miniVariant')
        localStorage.setItem('miniVariant', this.miniVariant)
      }
    },
  }
}
</script>
<style>
.toolbar-title:hover {
  cursor: pointer;
}
</style>
