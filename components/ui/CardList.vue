<template>
  <div
    :style="{height: `${cardContainerHeight}px`}"
    class="card-container"
  >
    <QuestionCard
      v-for="(card, index) in cards"
      :key="index"
      :question="card"
      :current="index === cardsIndex"
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
      v-if="isOpenModal"
      :is-open="isOpenModal"
      :question="cards[cardsIndex]"
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
      cardsIndex: 0,
      isShowResult: false,
      timer: null,
      approval: null,
      isOpenModal: false
    }
  },
  computed: {
    ...mapState(['user']),
    cards() {
      return this.questions.map(q => {
        return { ...q, approved: null }
      })
    }
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
  methods: {
    onThrowout(approval) {
      /*
      どちらかに投げる or タップする
      リザルト表示に変更
      4秒後
      カードが上方向に消えていく
       */
      this.approval = approval
      this.updateAnswer()
      // resultの表示
      if (this.isShowResult) {
        clearTimeout(this.timer)
      } else {
        this.isShowResult = true
      }
      this.startTimer()
      //19枚目で次のカードセットを読み込む
      if (this.cardsIndex === this.cards.length - 2) {
        this.$store.dispatch('questions/fetchQuestions', this.user.data)
      }
    },
    changeCard() {
      this.cards[this.cardsIndex].approved = this.approval
      this.cardsIndex++
      this.isShowResult = false
    },
    startTimer() {
      this.timer = setTimeout(this.changeCard, 2000)
    },
    toggleModal() {
      this.isOpenModal = !this.isOpenModal
    },
    updateAnswer() {
      const payload = {
        card: this.cards[this.cardsIndex],
        approval: this.approval,
        index: this.cardsIndex
      }
      payload.user = this.user.data
        ? {
            uid: this.user.data.uid,
            displayName: this.user.data.displayName,
            photoURL: this.user.data.photoURL
          }
        : null
      // aorb の dispatch
      this.$store.dispatch('questions/updateAnswer', payload)
      this.user.data
        ? this.$store.dispatch('questions/updateUserAnswer', payload)
        : null
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
  //transform: translateY(-50%);
}
</style>
