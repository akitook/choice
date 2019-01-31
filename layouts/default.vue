<template>
  <v-app>
    <Header />
    <v-content>
      <nuxt />
    </v-content>
    <Snackbar />
  </v-app>
</template>

<script>
import Header from '~/components/layouts/Header'
import Snackbar from '~/components/layouts/Snackbar'

export default {
  components: { Header, Snackbar },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'a?b'
    }
  }
}
</script>
