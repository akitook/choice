<template>
  <v-layout
    column
    justify-center
    align-center>
    <CardList
      v-if="globalQuestions.records.length > 0"
      :questions="globalQuestions.records"/>
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
  computed: mapState({
    globalQuestions: 'questions',
    user: 'user'
  }),
  created() {},
  mounted() {}
}
</script>
