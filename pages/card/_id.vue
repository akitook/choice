<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-container>
      <QuestionListItem
        v-if="question.data"
        :question="question.data"
      />
      <ResultCard
        v-if="question.data"
        :question="question.data"
      />
      <v-btn
        flat
        color="error"
        @click="openDeleteModal">この質問を削除する</v-btn>
      <DeleteModal
        :is-show="isShowModal"
        :question="question.data"
        @close="closeDeleteModal"
      />
    </v-container>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import QuestionListItem from '~/components/ui/QuestionListItem'
import ResultCard from '~/components/ui/ResultCard'
import DeleteModal from '~/components/ui/DeleteModal'
export default {
  components: {
    QuestionListItem,
    ResultCard,
    DeleteModal
  },
  async fetch({ store, params }) {
    !this.question
      ? store.dispatch('question/fetchQuestionById', params.id)
      : null
  },
  data() {
    return {
      isShowModal: false
    }
  },
  computed: {
    ...mapState(['question', 'user'])
  },
  created() {},
  mounted() {},
  methods: {
    openDeleteModal() {
      this.isShowModal = true
    },
    closeDeleteModal() {
      this.isShowModal = false
    }
  }
}
</script>
