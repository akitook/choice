<template>
  <div
    v-twemoji
    :style="styles"
    :class="randomAnimation"
    class="randomFace animated"
  >{{ randomFace }}</div>
</template>
<script>
export default {
  props: {
    size: {
      type: Number,
      default: 16
    }
  },
  computed: {
    styles() {
      return {
        '--size': this.size + 'px'
      }
    },
    randomFace() {
      const emojis = [
        '😀',
        '😁',
        '😂',
        '😆',
        '😊',
        '😏',
        '😍',
        '😚',
        '🤡',
        '🤑',
        '🤓'
      ]
      const num = Math.floor(Math.random() * Math.floor(emojis.length))
      return emojis[num]
    },
    randomAnimation() {
      const animations = [
        'flip',
        'bounce',
        'flash',
        'rubberBand',
        'shake',
        'swing',
        'jello',
        'tada',
        'heartBeat',
        'bounceInUp',
        'rotateIn',
        'zoomIn',
        'zoomInUp'
      ]
      const num = Math.floor(Math.random() * Math.floor(animations.length))
      return animations[num]
    }
  }
}
</script>
<style lang="scss">
.randomFace {
  img.emoji {
    width: var(--size);
    height: var(--size);
  }
}
</style>
