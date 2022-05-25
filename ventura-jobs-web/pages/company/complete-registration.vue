<template>
<v-container>
  <v-card max-width="500" class="ma-auto">
    <v-card-title>
      <h1 class="text-center text-2xl font-light mb-4 m-auto">Complete seu cadastro!</h1>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="createUser">
        <v-text-field label="Nome" placeholder="John Doe" v-model="user.name"></v-text-field>
        <div class="v-text-field__slot">
          <label>Telefone</label>
          <the-mask :mask="['(##) ####-####', '(##) #####-####']"
                    placeholder="(##) #####-####"
                    type="tel"
                    class="v-input__slot mask-input"
                    v-model="user.phone"></the-mask>
        </div>
        <v-text-field label="Nome Fantasia" placeholder="Ventura Jobs HR" v-model="user.legalRecord.corporateName"></v-text-field>
        <div class="v-text-field__slot">
          <label>CNPJ</label>
          <the-mask :mask="[ '##.###.###/####-##']"
                    placeholder="##.###.###/####-##"
                    class="v-input__slot mask-input"
                    v-model="user.legalRecord.cnpj"></the-mask>
        </div>

        <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
          <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
          <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
        </div>

        <h1 class="text-center text-xl font-light mb-4 m-auto">Endereço</h1>
        <v-text-field label="Endereço" v-model="user.address.completeAddress"></v-text-field>
        <v-text-field label="Complemento" v-model="user.address.complement"></v-text-field>
        <v-text-field label="Cidade" v-model="user.address.city"></v-text-field>
        <v-text-field label="Estado" v-model="user.address.state"></v-text-field>
        <div class="v-text-field__slot">
          <label>CEP</label>
          <the-mask :mask="['#####-###']"
                    placeholder="#####-###"
                    class="v-input__slot mask-input"
                    v-model="user.address.postalCode"></the-mask>
        </div>

        <div class="my-7 grid grid-cols-[1fr] gap-x-2 items-center">
          <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
          <span :class="$vuetify.theme.dark ? lineDark : lineLight"/>
        </div>

        <div class="flex flex-row justify-center">
          <v-btn @click.stop="createUser">Finalizar cadastro</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import check from "@/components/check";
import {TheMask} from 'vue-the-mask'

export default {
  name: "complete-registration",
  components: {TheMask},
  computed: mapState({
    error: state => state.users.error
  }),
  head() {
    return {
      title: 'Complete seu cadastro'
    }
  },
  data() {
    return {
      user: {
        firebaseId: null,
        name: null,
        phone: null,
        email: null,
        address: {
          completeAddress: null,
          complement: null,
          postalCode: null,
          city: null,
          state: null
        },
        userType: 0,
        legalRecord: {
          corporateName: "",
          cpf: "",
          cnpj: ""
        }
      },
      lineLight: 'h-0.5 bg-neutral-200',
      lineDark: 'h-0.5 bg-neutral-800'
    }
  },
  mounted() {
    this.unsub = this.$store.subscribe((mutation, state) => {
      if(mutation.type == 'users/CREATE_USER') {
        check.hasError(this.error, result => {
          if(!result) {
            this.$router.push('/company/dashboard')
          }
        })
      }
    })
  },
  methods: {
    createUser() {
      this.user.email = this.$fire.auth.currentUser.email;
      this.user.firebaseId = this.$fire.auth.currentUser.uid;

      this.$store.dispatch({ type: "users/createUser", user: this.user })
    }
  },
  ...mapMutations(['users/CREATE_USER']),
  beforeDestroy() {
    this.unsub()
  }
}
</script>

<style scoped>

</style>
