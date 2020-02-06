<template>
  <div
    v-if="showing"
    :class="{ animated: animating, removed: removing, current: current}"
    :style="{ transform: returnTransformString }"
    class="card">
    <div class="card-info">
      <div class="user">
        <User
          :data="question.author"
          size="small" />
      </div>
      <h1 class="card-title">{{ question.title }}</h1>
    </div>
    <div
      v-if="isShowResult"
      class="total">
      {{ question.choice.total }} <span>votes</span>
    </div>
    <div
      ref="choiceBox"
      class="choice-box">
      <div
        ref="choiceOne"
        :style="{
          background: `#FF008C url(${storageUrl1}) center center / cover`,
          width: `calc(100% - ${imageWidth}%)`}"
        :class="{ full : imageWidth <= 0}"
        class="image one"
      >
        <div
          v-if="isShowResult"
          class="contents"
        >
          <RandomTwemoji
            v-if="choiced === 'a'"
            :size="36"
            class="randomFace"
          />
          <div class="result-rate">{{ rate.one }}<span>% ({{ question.choice.one.total }})</span></div>
          <div
            :style="styles"
            class="bar-container">
            <div
              :style="{width: `${rate.one}%`}"
              class="bar one" />
          </div>
        </div>
      </div>
      <div
        ref="choiceTwo"
        :style="{
          background: `#3377F6 url(${storageUrl2}) center center / cover`,
          width: `${imageWidth}%`}"
        :class="{ full : imageWidth >= 100}"
        class="image two"
      >
        <div
          v-if="isShowResult"
          class="contents"
        >
          <RandomTwemoji
            v-if="choiced === 'b'"
            :size="36"
            class="randomFace"
          />
          <div class="result-rate">{{ rate.two }}<span>% ({{ question.choice.two.total }})</span></div>
          <div
            :style="styles"
            class="bar-container">
            <div
              :style="{width: `${rate.two}%`}"
              class="bar two" />
          </div>
        </div>
      </div>
      <!--
        <div
          v-if="icon.opacity > 0"
          :class="icon.type"
          :style="{ opacity: icon.opacity }"
          class="image-icon"/>
          -->
    </div>
    <div class="card-action">
      <v-layout
        align-center
        row>
        <v-flex grow>
          <div class="votes-number">
            {{ question.choice.total }} <span>votes</span>
          </div>
        </v-flex>
        <v-flex shrink>
          <div class="icons">
            <TweetButton
              ref="tweet"
              :url="`https://waverrr.jp/${question.id}`"
              :tweet="question.title"
              size="medium"
            />
            <LineButton
              ref="line"
              url="fff"
              size="medium"
            />
            <img
              ref="report"
              class="icon"
              src="~/assets/icon/flag.png"
              alt="報告"
              @click="$emit('toggleModal')"
            >
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script>
import interact from 'interactjs'
import storage from '~/api/firestorage'
import User from '~/components/ui/User'
import TweetButton from '~/components/ui/TweetButton'
import LineButton from '~/components/ui/LineButton'
import RandomTwemoji from '~/components/ui/RandomTwemoji'
export default {
  components: {
    User,
    TweetButton,
    LineButton,
    RandomTwemoji
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    approved: {
      type: String,
      required: false,
      default: null
    },
    current: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      showing: true,
      isShowResult: false,
      choiced: null,
      animating: true, // Controls CSS class with transition declaration
      removing: false,
      threshold: process.browser ? window.innerWidth / 3 : null, // Breakpoint distance to approve/reject a card
      maxRotation: 20, // Max rotation value in degrees
      position: {
        x: 0,
        y: 0,
        rotation: 0
      },
      icon: {
        opacity: 0,
        type: null
      },
      imageWidth: 50,
      storageUrl1: '',
      storageUrl2: ''
    }
  },
  computed: {
    returnTransformString: function() {
      if (this.animating === false || this.approved !== null) {
        const x = this.position.x
        const y = this.position.y
        const rotate = this.position.rotation
        return (
          'translate3D(' + x + 'px, ' + y + 'px, 0) rotate(' + rotate + 'deg)'
        )
      } else {
        return null
      }
    },
    styles() {
      return {
        '--oneWidth': this.rate.one + '%',
        '--twoWidth': this.rate.two + '%'
      }
    },
    rate() {
      const total = this.question.choice.total
      let oneTotal = this.question.choice.one.total
      const oneRate = Math.ceil((oneTotal / total) * 100)
      const twoRate = 100 - oneRate
      return {
        one: Number.isNaN(oneRate) ? 0 : oneRate,
        two: Number.isNaN(twoRate) ? 0 : twoRate
      }
    }
  },
  watch: {
    approved: function() {
      if (this.approved !== null) {
        const self = this

        // Remove interact listener to prevent further dragging
        interact(this.$el).unset()
        this.animating = true
        this.removing = true
        /*
        Move card off-screen in direction of approve/reject status,
        then remove it from the DOM, thereby adjusting the CSS
        nth-child selectors.
        */

        const x =
          window.innerWidth + window.innerWidth / 2 + this.$el.offsetWidth

        if (this.approved === 'b') {
          this.position.x = x
          this.position.rotation = this.maxRotation
          this.icon.type = 'b'
        } else if (this.approved === 'a') {
          this.position.x = -x
          this.position.rotation = -this.maxRotation
          this.icon.type = 'a'
        }

        this.icon.opacity = 1

        setTimeout(function() {
          self.showing = false
          self.removing = false
        }, 200)
      }
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
    const element = this.$el
    const choiceBox = this.$refs.choiceBox
    const self = this
    interact(this.$refs.choiceOne).on('tap', e => {
      this.choice('a')
      e.preventDefault()
      interact(this.$refs.choiceOne).unset()
      interact(this.$refs.choiceTwo).unset()
    })
    interact(this.$refs.choiceTwo).on('tap', e => {
      this.choice('b')
      e.preventDefault()
      interact(this.$refs.choiceOne).unset()
      interact(this.$refs.choiceTwo).unset()
    })

    interact(element).draggable({
      inertia: true,
      ignoreFrom: '.icons',
      onstart: function() {
        /*
        Disable CSS transitions during dragging.
        */
        self.animating = false
      },
      onmove: function(event) {
        /*
        Calculate new x and y coordinate values from the local value and
        the event object value. Also adjust element rotation transformation
        based on proximity to approve/reject threshold.
        */
        const x = (self.position.x || 0) + event.dx
        const y = (self.position.y || 0) + event.dy

        let rotate = self.maxRotation * (x / self.threshold)

        if (rotate > self.maxRotation) {
          rotate = self.maxRotation
        } else if (rotate < -self.maxRotation) {
          rotate = -self.maxRotation
        }

        self.position.x = x
        self.position.y = y
        self.position.rotation = rotate

        /*
        Change icon image type based on drag direction and adjust opacity
        from 0-1 based on current rotation amount. Also emit an event to
        show/hide respective button below cards during dragging.
        */

        const amount = Math.abs(rotate) / self.maxRotation

        if (rotate > 0) {
          self.icon.type = 'b'
          self.imageWidth = 50 + amount * 100
        } else if (rotate < 0) {
          self.icon.type = 'a'
          self.imageWidth = 50 - amount * 100
        }
        self.icon.opacity = amount
        self.$emit('draggedActive', self.icon.type, amount)
      },
      onend: e => {
        /*
        Check if card has passed the approve/reject threshold and emit approval
        value change event, otherwise reset card and icon to default values.
        */
        /*
        if (self.position.x < self.threshold) {
          this.choice('a')
        } else if (self.position.x > -self.threshold) {
          this.choice('b')
        } else {
        }
        */
        console.log('onend')
        self.position.x = 0
        self.position.y = 0
        self.position.rotation = 0
        self.icon.opacity = 0
        self.imageWidth = 50
        self.$emit('draggedEnded')
      }
    })
  },
  methods: {
    choice(aorb) {
      this.choiced = aorb
      this.isShowResult = true
      this.$emit('draggedThreshold', aorb)
    }
  }
}
</script>
<style lang="scss" scoped>
/* EXTENDS */

%backgroundContain {
  background: center center no-repeat transparent;
  background-size: contain;
}

/* CARD */

$defaultTranslation: $cardsPositionOffset * $cardsTotal;
$defaultScale: 1 - ($cardsScaleOffset * $cardsTotal);

.card {
  pointer-events: none;
  z-index: 0;
  left: 0;
  top: 0;
  opacity: 0;
  position: absolute;
  width: $cardsWidth;
  max-width: $cardsMaxWidth;
  height: $cardsHeight;
  border-radius: 8px;
  background: $color-white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: translateY($defaultTranslation) scale($defaultScale);
  transform-origin: 50%;
  will-change: transform, opacity;
  -ms-touch-action: none;
  touch-action: none;
}

/*
      Cascade the cards by translation and scale based on
      their nth-child index
  */

@for $i from 1 through $cardsTotal {
  $index: $i - 1;
  $translation: $cardsPositionOffset * $index;
  $scale: 1 - ($cardsScaleOffset * $index);

  .card:nth-child(#{$i}) {
    opacity: 1;
    z-index: $cardsTotal - $index;
    transform: translateY($translation) scale($scale);
  }
}

.card.current {
  pointer-events: auto;
}

.card.animated {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card.removed {
  transition: all 2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.choice-box {
  width: 100%;
  height: 70%;
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
    //border-radius: 8px 0 0 0;
    border-bottom: 4px solid $color-a;
    .contents {
      //border-radius: 8px 0 0 0;
    }
  }
  &.two {
    //border-radius: 0 8px 0 0;
    border-bottom: 4px solid $color-b;
    .contents {
      //border-radius: 0 8px 0 0;
    }
  }
  &.full {
    border-radius: 8px 8px 0 0;
  }
}
.image-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  width: $imageIconSize;
  height: $imageIconSize;
  transform: translateX(-50%) translateY(-50%);
  background: center center no-repeat transparent;
  background-size: contain;
}

.image-icon.a {
  background-image: url('/a.svg');
}

.image-icon.b {
  background-image: url('/b.svg');
}

.card-info {
  padding: 8px 16px;
}

.card-title {
  margin: 0 auto;
  padding: 8px 0 12px 0;
  font-size: 15px;
  font-weight: bold;
  line-height: 24px;
  text-align: center;
}

.card-action {
  padding: 16px;
}

.icons {
  width: 108px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  a {
    display: block;
  }
}
.icon {
  width: 24px;
  height: 24px;
  display: block;
}

.total {
  position: absolute;
  width: 100%;
  z-index: 1;
  text-align: center;
  color: #fff;
  font-size: 24px;
  padding: 32px;
  span {
    font-size: 18px;
  }
}

.contents {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
}
.result-rate {
  font-size: 24px;
  span {
    font-size: 16px;
  }
}
.bar-container {
  position: relative;
  width: 100%;
}

.bar {
  position: absolute;
  height: 12px;
  width: 0;
  &.one {
    right: 0;
    background: $color-a;
    animation: rateOneBar 0.3s ease-in;
  }
  &.two {
    left: 0;
    background: $color-b;
    animation: rateTwoBar 0.3s ease-in;
  }
}

@keyframes rateOneBar {
  0% {
    width: 0;
  }
  100% {
    width: var(--oneWidth);
  }
}
@keyframes rateTwoBar {
  0% {
    width: 0;
  }
  100% {
    width: var(--twoWidth);
  }
}

.randomFace {
  position: absolute;
  top: 34%;
}
</style>
