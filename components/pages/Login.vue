<template>
  <v-layout>
    <v-flex text-xs-center>
      <PageTitle title="ログイン" />
      <div class="login-form">
        <v-btn
          block
          large
          color="#DB4E41"
          class="white--text btn"
          @click="login('google')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 50 50"
            version="1.1"
            class="icon">
            <g id="surface1">
              <path
                style="fill:white"
                d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z "/>
            </g>
          </svg>
          Googleでログイン
        </v-btn>
        <v-btn
          block
          large
          color="#0099E8"
          class="white--text btn"
          @click="login('twitter')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 612 612"
            class="icon"
            xml:space="preserve">
            <g>
              <g>
                <path
                  style="fill:#fff;"
                  d="M612,116.258c-22.525,9.981-46.694,16.75-72.088,19.772c25.929-15.527,45.777-40.155,55.184-69.411
			c-24.322,14.379-51.169,24.82-79.775,30.48c-22.907-24.437-55.49-39.658-91.63-39.658c-69.334,0-125.551,56.217-125.551,125.513
			c0,9.828,1.109,19.427,3.251,28.606C197.065,206.32,104.556,156.337,42.641,80.386c-10.823,18.51-16.98,40.078-16.98,63.101
			c0,43.559,22.181,81.993,55.835,104.479c-20.575-0.688-39.926-6.348-56.867-15.756v1.568c0,60.806,43.291,111.554,100.693,123.104
			c-10.517,2.83-21.607,4.398-33.08,4.398c-8.107,0-15.947-0.803-23.634-2.333c15.985,49.907,62.336,86.199,117.253,87.194
			c-42.947,33.654-97.099,53.655-155.916,53.655c-10.134,0-20.116-0.612-29.944-1.721c55.567,35.681,121.536,56.485,192.438,56.485
			c230.948,0,357.188-191.291,357.188-357.188l-0.421-16.253C573.872,163.526,595.211,141.422,612,116.258z"/>
              </g>
            </g>
          </svg>
          Twitterでログイン
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import PageTitle from '~/components/ui/PageTitle.vue'
export default {
  components: {
    PageTitle
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.user.data ? this.$router.push('/') : null
  },
  methods: {
    login: function(provider) {
      this.$store.dispatch('login', provider)
    }
  }
}
</script>
<style>
.login-form {
  padding: 24px;
}
.btn {
  margin: 32px 0;
  font-size: 12px;
}
.icon {
  width: 32px;
  height: 32px;
  padding-right: 8px;
}
</style>
