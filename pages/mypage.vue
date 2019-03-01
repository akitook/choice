<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container>
      <v-flex text-xs-center>
        <Login v-if="!user.data"/>
        <UserForm v-else-if="user.data.isNewUser" />
        <div v-else>
          <MyPage />
        </div>
      </v-flex>
    </v-container>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import Login from '~/components/pages/Login'
import UserForm from '~/components/pages/UserForm'
import MyPage from '~/components/pages/MyPage'
export default {
  components: {
    Login,
    UserForm,
    MyPage
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.$store.dispatch('user/fetchStatus')
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
