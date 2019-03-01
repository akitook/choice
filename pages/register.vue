<template>
  <v-layout>
    <v-container>
      <v-flex text-xs-center>
        <Login v-if="!user.data"/>
        <UserForm v-else-if="user.data.isNewUser" />
        <div v-else>
          logined
        </div>
      </v-flex>
    </v-container>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import Login from '~/components/pages/Login'
import UserForm from '~/components/pages/UserForm'

export default {
  components: {
    Login,
    UserForm
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.user.data ? this.$router.push('/') : null
  },
  methods: {
    login: function(provider) {
      this.$store.dispatch('user/login', provider)
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
