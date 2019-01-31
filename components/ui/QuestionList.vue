<template>
  <div class="list-container">
    <QuestionListItem
      v-for="(data, index) in questions"
      :key="index"
      :question="data"
      @moveToDetail="moveToDetail"
    />
    <div
      v-if="questions.length === 0"
      class="message"
    >
      投稿した質問はないようです。
    </div>
  </div>
</template>
<script>
import QuestionListItem from './QuestionListItem'
export default {
  components: {
    QuestionListItem
  },
  props: {
    questions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      questionItems: []
    }
  },
  mounted() {},
  methods: {
    moveToDetail(questionData) {
      this.$store.dispatch('question/setQuestion', questionData)
      this.$router.push({
        name: 'card-id',
        params: { id: questionData.id }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-container {
  width: 100%;
  padding: 8px 0;
  position: relative;
}
.message {
  text-align: center;
}
</style>
