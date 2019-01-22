<template>
  <div>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      absolute
      temporary
      app
    >

      <v-list>
        <V-list-tile>
          <nuxt-link to="/mypage">
            <User :data="user.data" />
          </nuxt-link>
        </V-list-tile>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      flat
      color="#fff"
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <nuxt-link to="/">
          WAVERR
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn
        to="/post"
        small
        color="primary">質問する</v-btn>
    </v-toolbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import User from '../ui/User'
export default {
  components: {
    User
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { icon: 'compare_arrows', title: '答える', to: '/' },
        { icon: 'fiber_new', title: '質問する', to: '/post' },
        { icon: 'insert_chart_outlined', title: '結果を見る', to: '/result' },
        { icon: 'settings', title: '設定', to: '/setting' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'WAVERR'
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.$store.dispatch('fetchStatus')
  }
}
</script>
<style lang="scss" scoped>
</style>
