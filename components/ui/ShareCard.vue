<template>
  <div
    :style="{height: `${cardContainerHeight}px`}"
    class="card-container">
    <div class="result-card">
      <div class="imageBox">
        <div
          :style="{
          background: `#F24E86 url(${storageUrl1}) center center / cover`}"
          class="image one"
        />
        <div
          :style="{
          background: `#02B4FF url(${storageUrl2}) center center / cover`}"
          class="image two"
        />
      </div>
      <div class="card-info">
        <h1 class="card-title">{{ question.title }}</h1>
        <User :data="question.author" />
      </div>
    </div>
  </div>
</template>
<script>
import storage from '~/api/firestorage'
import User from '../ui/User'
export default {
  components: {
    User
  },
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      storageUrl1: '',
      storageUrl2: '',
      windowHeight: 0,
      cardContainerHeight: 0
    }
  },
  created() {
    if (process.browser) {
      console.log(navigator.userAgent)
      this.windowHeight = window.innerHeight
      // cardContainer: アドレスバーを引いた高さ - margin-top:16px - header - Result(40 + margin-top:24px)
      this.cardContainerHeight = window.innerHeight - 16 - 56 - 64
    }
  },
  mounted: function() {
    if (this.question) {
      storage.fetchStorageUrl(this.question.choice.one.url).then(url => {
        this.storageUrl1 = url
      })
      storage.fetchStorageUrl(this.question.choice.two.url).then(url => {
        this.storageUrl2 = url
      })
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.result-card {
  pointer-events: none;
  left: 0;
  top: 0;
  position: absolute;
  width: $cardsWidth;
  max-width: $cardsMaxWidth;
  height: $cardsHeight;
  border-radius: 8px;
  background: $color-white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  -ms-touch-action: none;
  touch-action: none;
}
.imageBox {
  width: 100%;
  height: 75%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}
.image {
  display: block;
  width: 50%;
  height: 100%;
  background-size: cover;
  &.one {
    border-radius: 8px 0 0 0;
    border-bottom: 4px solid $color-a;
  }
  &.two {
    border-radius: 0 8px 0 0;
    border-bottom: 4px solid $color-b;
  }
  &.full {
    border-radius: 8px 8px 0 0;
  }
}
</style>
