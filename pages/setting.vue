<template>
  <v-layout>
    <v-container>
      <v-flex text-xs-center>
        <Login v-if="!user.data"/>
        <div v-else>
          <UserForm />
          <v-btn
            flat
            color="error"
            @click="logout">ログアウト</v-btn>
        </div>
      </v-flex>
    </v-container>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import UserForm from '~/components/pages/UserForm'
export default {
  components: {
    UserForm
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.user.data
      ? this.$store.dispatch('user/fetchUser', this.user.data.uid)
      : null
  },
  mounted() {},
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
