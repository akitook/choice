<template>
  <div
    class="user">
    <v-avatar
      size="32"
    >
      <img
        :src="data ? data.photoURL : '/user.jpg'"
        :alt="data ? data.displayName : 'ユーザー'"
        class="thumbnail"
      >
    </v-avatar>

    <div
      class="user-name">{{ data ? data.displayName : 'ユーザー' }}</div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          photoURL: '',
          displayName: ''
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 0;
}
.thumbnail {
  width: 100%;
  height: 100%;
  margin-right: 12px;
}
.user-name {
}
</style>
