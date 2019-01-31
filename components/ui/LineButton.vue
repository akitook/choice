<template>
  <a
    :href="shareUrl"
    target="_blank"
    class="button">
    <img
      class="icon"
      src="~/assets/icon/line.png"
      alt="Line"
    >
  </a>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  computed: {
    shareUrl() {
      return 'https://timeline.line.me/social-plugin/share?url=' + this.url
    }
  }
}
</script>
<style lang="scss" scoped>
.button {
  width: 24px;
  height: 24px;
  display: block;
  img {
    max-width: 100%;
    height: 100%;
  }
}
</style>
