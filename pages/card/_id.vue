<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-container>
      <div
        v-if="question.data"
      >
        <div
          :style="{height: `${cardContainerHeight}px`}"
          class="card-container"
        >
          <ResultCard
            :question="question.data"
          />
        </div>
        <div class="button-container">
          <v-btn
            flat
            color="error"
            @click="openDeleteModal">この質問を削除する</v-btn>
        </div>
        <DeleteModal
          :is-show="isShowModal"
          :question="question.data"
          @close="closeDeleteModal"
        />
      </div>
      <div v-else>
        loading
      </div>
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
    await store.dispatch('question/fetchQuestionById', params.id)
  },
  data() {
    return {
      isShowModal: false,
      windowHeight: 0,
      innerHeight: 0,
      cardContainerHeight: 0
    }
  },
  computed: {
    ...mapState(['question', 'user', 'post'])
  },
  created() {
    if (process.browser) {
      console.log(navigator.userAgent)
      const innerHeight = require('ios-inner-height')()
      this.windowHeight = window.innerHeight
      this.innerHeight = innerHeight
      // cardContainer: アドレスバーを引いた高さ - margin-top:16px - header - margin-bottom
      this.cardContainerHeight = window.innerHeight - 16 - 56 - 48
    }
  },
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
<style lang="scss" scoped>
.card-container {
  position: relative;
  width: $cardsWidth;
  max-width: $cardsMaxWidth;
  margin: 16px auto;
}
.button-container {
  text-align: center;
}
</style>
