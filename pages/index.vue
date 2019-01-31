<template>
  <v-layout
    column
    justify-center
    align-center>
    <CardList
      v-if="questions.records"
      :questions="questions.records"/>
    <div v-else>
      <Loading />
    </div>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import CardList from '~/components/ui/CardList.vue'
import Loading from '~/components/ui/Loading.vue'

export default {
  components: {
    CardList,
    Loading
  },
  computed: {
    ...mapState(['questions', 'user'])
  },
  created() {},
  mounted() {
    this.$store.dispatch('questions/fetchQuestions', this.user.data)
    console.log(this.questions)
  }
}
</script>
