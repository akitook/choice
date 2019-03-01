<template>
  <div
    :class="size"
    class="user">
    <v-avatar
      :size="avatarSize"
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
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  computed: {
    avatarSize() {
      const avatarSize =
        this.size === 'small' ? 24 : this.size === 'large' ? 42 : 32
      return avatarSize
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
}

.thumbnail {
  width: 100%;
  height: 100%;
  margin-right: 12px;
}

.small .user-name {
  font-size: 12px;
}

.medium .user-name {
  font-size: 14px;
}
.user-name {
  font-weight: bold;
  color: #444444;
}
</style>
