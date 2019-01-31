<template>
  <div
    :style="{height: `${cardContainerHeight}px`}"
    class="card-container"
  >
    <QuestionCard
      v-for="(card, index) in cards.data"
      :key="index"
      :question="card"
      :current="index === cards.index"
      :approved="card.approved"
      @draggedThreshold="onThrowout"
      @toggleModal="toggleModal"
    />
    <div
      v-if="false"
      class="test"
      style="position: fixed; bottom: 0;">
      windowHeight: {{ windowHeight }} innerHeight: {{ innerHeight }} cardContainer: {{ cardContainerHeight }}
    </div>
    <ReportFormModal
      :is-open="isOpenModal"
      :question="cards.data[cards.index]"
      @toggleModal="toggleModal"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import QuestionCard from './QuestionCard'
import ReportFormModal from './ReportFormModal'
import Result from './Result'
export default {
  components: {
    QuestionCard,
    ReportFormModal,
    Result
  },
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      windowHeight: 0,
      innerHeight: 0,
      cardContainerHeight: 0,
      config: {
        minThrowOutDistance: 250,
        maxThrowOutDistance: 300
      },
      max: 10,
      cards: {
        data: this.questions.map(q => {
          return { ...q, approved: null }
        }),
        index: 0
      },
      isShowResult: false,
      timer: null,
      approval: null,
      isOpenModal: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    if (process.browser) {
      console.log(navigator.userAgent)
      const innerHeight = require('ios-inner-height')()
      this.windowHeight = window.innerHeight
      this.innerHeight = innerHeight
      // cardContainer: アドレスバーを引いた高さ - margin-top:16px - header - Result(40 + margin-top:24px)
      this.cardContainerHeight = window.innerHeight - 16 - 56 - 64
    }
  },
  methods: {
    onThrowout(approval) {
      console.log(approval)
      this.approval = approval
      // resultの表示
      if (this.isShowResult) {
        clearTimeout(this.timer)
      } else {
        this.isShowResult = true
      }
      this.startTimer()
      const payload = {
        card: this.cards.data[this.cards.index],
        user: {
          uid: this.user.data.uid,
          displayName: this.user.data.displayName,
          photoURL: this.user.data.photoURL
        },
        approval
      }
      // aorb の dispatch
      this.$store.dispatch('questions/updateAnswer', payload)
      this.$store.dispatch('questions/updateUserAnswer', payload)
      this.cards.data[this.cards.index].approved = approval
      this.cards.index++
      if (this.cards.index >= this.cards.data.length) {
        console.log('all')
      }
    },
    closeResult() {
      this.isShowResult = false
    },
    startTimer() {
      this.timer = setTimeout(this.closeResult, 4000)
    },
    toggleModal() {
      this.isOpenModal = !this.isOpenModal
    }
  }
}
</script>
<style lang="scss" scoped>
.card-container {
  position: relative;
  width: 100vw;
  max-width: $cardsMaxWidth;
  //transform: translateY(-50%);
}
</style>
