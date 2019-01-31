<template>
  <transition
    enter-active-class="animated bounceInUp"
    leave-active-class="animated bounceOutDown"
  >
    <div
      v-if="show && data"
      class="result"
    >
      <div class="bar-title">Result > {{ data.title }}</div>
      <div class="bar-container">
        <div
          :style="{width: `${oneRate}%`}"
          class="bar one">
          A: {{ data.choice.one.total }}<span>票</span>
        </div>
        <div
          :style="{width: `${twoRate}%`}"
          class="bar two">
          B: {{ data.choice.two.total }}<span>票</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
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
      oneRate: 50,
      twoRate: 50
    }
  },
  watch: {
    data: function(newVal, oldVal) {
      this.data ? this.calculateRate() : null
    }
  },
  methods: {
    calculateRate() {
      const total = this.data.choice.total
      const oneTotal = this.data.choice.one.total
      const twoTotal = this.data.choice.two.total
      this.oneRate = (oneTotal / total) * 100
      this.twoRate = (twoTotal / total) * 100
    }
  }
}
</script>
<style lang="scss" scoped>
.v-snack__content {
  padding: 0 !important;
}
.result {
  position: fixed;
  font-size: 14px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}
.bar-title {
  padding: 0 4px;
  font-size: 11px;
}
.bar-container {
  display: flex;
  align-items: center;
}
.bar {
  height: 24px;
  padding: 0 4px;
  transition: all 0.2s linear;
  font-size: 12px;
  color: #fff;
  span {
    font-size: 8px;
  }
}
.one {
  background: $color-a center center / cover;
}
.two {
  background: $color-b center center / cover;
}
</style>
