<template>
  <a
    :href="tweetUrl"
    target="_blank"
    class="button">
    <img
      class="icon"
      src="~/assets/icon/twitter.png"
      alt="twitter">
  </a>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    tweet: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  computed: {
    tweetUrl() {
      return (
        'https://twitter.com/intent/tweet?url=' +
        this.url +
        '&text=' +
        this.tweet +
        '&hashtags=優柔不断'
      )
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
