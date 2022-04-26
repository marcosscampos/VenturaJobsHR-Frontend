import colors from 'vuetify/es5/util/colors'

require('dotenv').config()

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // mode: 'spa',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Ventura Jobs HR',
    // title: 'ventura-_job-web',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'bootstrap/dist/css/bootstrap.css',
    'bootstrap-vue/dist/bootstrap-vue.css',
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/core/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyCfZvfAjDSBHghb0w-7DQ4NUBDxxVia35A',
          authDomain: 'venturajobshr.firebaseapp.com',
          projectId: 'venturajobshr',
          storageBucket: 'venturajobshr.appspot.com',
          messagingSenderId: '353670813955',
          appId: '1:353670813955:web:e30af192217a395935b136',
          measurementId: 'G-GXF505WBJK'
        },
        services: {
          auth: true,
          database: true,
          functions: true,
          firestore: true,
          realtimeDb: true
        }
      }
    ],
    '@nuxtjs/dotenv'
  ],

  // router: {
  //   middleware: 'auth'
  // },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
    credentials: false,
    proxy: true
  },

  proxy: {
    '/v1/jobs': {
      target: process.env.NUXT_ENV_API_URL,
      // pathRewrite: { '^/v1/jobs': '' }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
