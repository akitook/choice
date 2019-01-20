<template>
  <div
    v-if="data"
    class="user">
    <v-avatar
      size="32"
    >
      <img
        :src="data.photoURL"
        :alt="data.displayName"
        class="thumbnail"
      >
    </v-avatar>

    <div class="user-name">{{ data.displayName }}</div>
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
  padding: 1rem 0;
}
.thumbnail {
  width: 100%;
  height: 100%;
  margin-right: 12px;
}
.user-name {
}
</style>
