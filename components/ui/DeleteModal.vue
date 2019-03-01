<template>
  <v-dialog
    v-model="isShow"
    persistent
    max-width="600px">
    <v-card>
      <v-card-title class="headline">この質問を削除しますか？</v-card-title>

      <v-card-text>
        {{ question.title }}
      </v-card-text>

      <v-card-actions>
        <v-spacer/>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="$emit('close')"
        >
          Disagree
        </v-btn>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="deleteQuestion"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    question: {
      type: Object,
      required: false,
      default: function() {
        return {}
      }
    }
  },
  methods: {
    deleteQuestion() {
      this.$store.dispatch('question/deleteQuestion', this.question.id)
      this.$router.push('/mypage')
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 12px 8px;
  text-align: center;
}
.page-title {
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
}
</style>
