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
        <v-list-tile>
          <User :data="user.data" />
        </v-list-tile>
        <v-list-tile
          to="/mypage"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title
              v-if="!user.data"
              class="font-weight-bold"
            >
              ログイン
            </v-list-tile-title>
            <v-list-tile-title
              v-else
              class="font-weight-bold"
            >
              マイページ
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
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
            <v-list-tile-title
              class="font-weight-bold"
              v-text="item.title" />
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
          <img
            class="logo"
            src="~/assets/svg/logo.svg"
            alt="waverrr">
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn
        to="/post"
        small
        round
        depressed
        color="#FF008C"
        class="white--text font-weight-bold"
      >質問する</v-btn>
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
    this.$store.dispatch('user/fetchStatus')
  }
}
</script>
<style lang="scss" scoped>
.logo {
  width: 100px;
}
</style>
