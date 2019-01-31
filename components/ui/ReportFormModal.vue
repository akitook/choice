<template>
  <v-dialog
    v-model="isOpen"
    persistent
    max-width="600px">
    <v-card>
      <v-card-title class="headline">質問の報告</v-card-title>

      <v-card-text>
        <p>「{{ question.title }}」に関して</p>
        <v-radio-group
          v-model="radios"
          :mandatory="false">
          <v-radio
            label="性的な内容"
            value="report-1"/>
          <v-radio
            label="暴力的または不快な内容"
            value="report-2"/>
          <v-radio
            label="スパムや誤解を招く内容"
            value="report-3"/>
          <v-radio
            label="権利の侵害"
            value="report-4"/>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="$emit('toggleModal')"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="green darken-1"
          flat="flat"
          @click="$emit('toggleModal')"
        >
          送信
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      radios: 'report-1'
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
