<template>
  <transition
    enter-active-class="animated resultIn"
    leave-active-class="animated resultOut"
  >
    <div
      v-if="show && data"
      class="result"
    >
      <div class="total">{{ data.choice.total }} <span>votes</span></div>
      <div
        :style="{height: `${containerHeight}px`}"
        class="imageBox">
        <div
          :style="{
          background: `#FF008C url(${storageUrl1}) center center / cover`}"
          class="image one"
        >
          <div class="contents">
            <div class="result-rate">{{ oneRate }}<span>% ({{ data.choice.one.total }})</span></div>
            <div class="bar-container">
              <div
                :style="{width: `${oneRate}%`}"
                class="bar one" />
            </div>
          </div>
        </div>
        <div
          :style="{
          background: `#3377F6 url(${storageUrl2}) center center / cover`}"
          class="image two"
        >
          <div class="contents">
            <div class="result-rate">{{ twoRate }}<span>% ({{ data.choice.two.total }})</span></div>
            <div class="bar-container">
              <div
                :style="{width: `${twoRate}%`}"
                class="bar two" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import storage from '~/api/firestorage'
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {
        return null
      }
    },
    approval: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      oneRate: 0,
      twoRate: 0,
      storageUrl1: '',
      storageUrl2: '',
      containerHeight: 0
    }
  },
  watch: {
    data: function(newVal, oldVal) {
      this.data ? this.calculateRate() : null
      storage.fetchStorageUrl(this.data.choice.one.url).then(url => {
        this.storageUrl1 = url
      })
      storage.fetchStorageUrl(this.data.choice.two.url).then(url => {
        this.storageUrl2 = url
      })
    }
  },
  created() {
    if (process.browser) {
      // cardContainer: アドレスバーを引いた高さ - margin-top:16px - header
      this.containerHeight = window.innerHeight - 56
    }
  },
  methods: {
    calculateRate() {
      const total = this.data.choice.total
      const oneTotal = this.data.choice.one.total
      const twoTotal = this.data.choice.two.total
      this.oneRate = Math.ceil((oneTotal / total) * 100)
      this.twoRate = 100 - this.oneRate
    }
  }
}
</script>
<style lang="scss" scoped>
.result {
  font-size: 14px;
  width: 100%;
}
.imageBox {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
}
.image {
  color: #fff;
  width: 50%;
  height: 100%;
}
.total {
  position: relative;
  text-align: center;
  z-index: 1;
  color: #fff;
  font-size: 24px;
  padding: 32px;
  span {
    font-size: 18px;
  }
}
.one {
  background: $color-a center center / cover;
}
.two {
  background: $color-b center center / cover;
}
.contents {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}
.result-rate {
  font-size: 42px;
  span {
    font-size: 24px;
  }
}
.bar-container {
  position: relative;
  width: 100%;
}
.result-in .bar {
  transition: all 4s ease-in 1s;
}
.bar {
  position: absolute;
  width: 0;
  height: 12px;
  &.one {
    right: 0;
  }
  &.two {
    left: 0;
  }
}
</style>
