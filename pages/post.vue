<template>
  <v-layout
    column
    justify-center
  >
    <PageTitle title="質問の作成" />
    <PostForm />
  </v-layout>
</template>
<script>
import PageTitle from '~/components/ui/PageTitle.vue'
import PostForm from '~/components/pages/PostForm.vue'

export default {
  components: {
    PageTitle,
    PostForm
  }
}
</script>
<style lang="scss" scoped>
</style>
