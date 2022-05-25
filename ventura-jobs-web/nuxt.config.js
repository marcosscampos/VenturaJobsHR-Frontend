import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.NUXT_ENV_API_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.NUXT_ENV_API_URL
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Ventura Jobs HR',
    // title: 'ventura-_job-web',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/core/plugins/axios',
    { src: '~/core/plugins/VueEditor', ssr: false },
    '~/core/plugins/VueMask',
    '~/core/plugins/VueMoney'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxt/postcss8'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
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
    '@nuxtjs/dotenv',
    '@nuxtjs/auth-next'
  ],

  router: {
    middleware: ['auth-register']
  },

  // auth: {
  //   strategies: {
  //     google: {
  //       clientId: "353670813955-227179c13o1tff5ue3omguf8ktmo523h.apps.googleusercontent.com",
  //       clientSecret: "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",
  //       redirectUri: "https://venturajobshr.firebaseapp.com/__/auth/handler",
  //       codeChallengeMethod: "",
  //       responseType: "id_token token",
  //     }
  //   }
  // },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.NUXT_ENV_API_URL,
    proxy: false,
    credentials: false
  },

  proxy: {
    '/v1/jobs': {
      target: process.env.NUXT_ENV_API_URL,
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.lightBlue,
          secondary: colors.grey.darken1,
          accent: colors.pink.darken1,
          error: colors.red.accent3,
          background: colors.indigo.lighten5,
          info: colors.teal.darken1,
        },
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    }
  }
}
