<template>
  <div class="card-container">
    <QuestionCard
      v-for="(card, index) in cards.data"
      :key="index"
      :question="card"
      :current="index === cards.index"
      :approved="card.approved"
      @draggedThreshold="onThrowout"/>
    <Result
      :show="isShowResult"
      :data="cards.data[cards.index - 1]"
      :approval="approval"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import QuestionCard from './QuestionCard'
import Result from './Result'
export default {
  components: {
    QuestionCard,
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
      approval: null
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {},
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
      this.$store.dispatch('updateAnswer', payload)
      this.$store.dispatch('updateUserAnswer', payload)
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
      this.timer = setTimeout(this.closeResult, 3000)
    }
  }
}
</script>
<style lang="scss" scoped>
.card-container {
  position: relative;
  top: 50%;
  margin: 0 auto 0 auto;
  width: $cardsWidth;
  max-width: $cardsMaxWidth;
  height: $cardsHeight + ($cardsPositionOffset * ($cardsTotal - 1));
  //transform: translateY(-50%);
}
</style>
