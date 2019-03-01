<template>
  <v-layout
    column
    justify-center
    align-center
  >
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
    <QuestionList
      v-if="user.questions"
      :questions="user.questions"/>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import QuestionList from '~/components/ui/QuestionList.vue'
import Loading from '~/components/ui/Loading.vue'

export default {
  components: {
    QuestionList,
    Loading
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.$store.dispatch('user/fetchUserQuestions', this.user.data.uid)
  },
  methods: {}
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
.message {
  text-align: center;
}
</style>
