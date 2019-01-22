<template>
  <v-layout
    column
    justify-center
    align-center>
    <PageTitle title="結果" />
    <QuestionList
      v-if="userQuestions.records"
      :questions="userQuestions.records"/>
    <div v-else>
      <Loading />
    </div>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import PageTitle from '~/components/ui/PageTitle.vue'
import QuestionList from '~/components/ui/QuestionList.vue'
import Loading from '~/components/ui/Loading.vue'
export default {
  components: {
    PageTitle,
    QuestionList,
    Loading
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['userQuestions', 'user'])
  },
  created() {},
  mounted() {
    console.log(this.state)
    this.user.data
      ? this.$store.dispatch('fetchUserQuestions', this.user.data.uid)
      : null
  }
}
</script>
