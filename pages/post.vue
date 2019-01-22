<template>
  <v-layout
    column
    justify-center
  >
    <PostForm v-if="user.data" />
    <Login v-else/>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import PostForm from '~/components/pages/PostForm.vue'
import Login from '~/components/pages/Login.vue'

export default {
  components: {
    PostForm,
    Login
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
<style lang="scss" scoped>
</style>
