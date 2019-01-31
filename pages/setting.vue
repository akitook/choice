<template>
  <v-layout>
    <v-flex text-xs-center>
      <div
        v-if="user.data"
        class="user">
        <img
          :src="user.data.photoURL"
          :alt="user.data.displayName"
          class="thumbnail"
        >
        <div>{{ user.data.displayName }}</div>
      </div>
      <v-btn
        flat
        color="error"
        @click="logout">ログアウト</v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.$store.dispatch('user/fetchStatus')
  },
  mounted() {
    !this.user.data ? this.$router.push('/login') : null
  },
  methods: {
    logout: function() {
      this.$router.push('/')
      this.$store.dispatch('user/logout')
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.thumbnail {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 12px;
}
</style>
