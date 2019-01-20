<template>
  <div class="list-container">
    <QuestionListItem
      v-for="(data, index) in questions"
      :key="index"
      :question="data"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import QuestionListItem from './QuestionListItem'
export default {
  components: {
    QuestionListItem
  },
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.list-container {
  padding: 8px 0;
  position: relative;
}
</style>
