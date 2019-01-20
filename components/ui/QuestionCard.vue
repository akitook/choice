<template>
  <div
    v-if="showing"
    :class="{ animated: animating, current: current }"
    :style="{ transform: returnTransformString }"
    class="card">
    <div class="imageBox">
      <div
        :style="{
          background: `#F24E86 url(${storageUrl1}) center center / cover`,
          width: `calc(100% - ${imageWidth}%)`}"
        :class="{ full : imageWidth <= 0}"
        class="image one"
      />
      <div
        :style="{
          background: `#02B4FF url(${storageUrl2}) center center / cover`,
          width: `${imageWidth}%`}"
        :class="{ full : imageWidth >= 100}"
        class="image two"
      />
      <div
        :class="icon.type"
        :style="{ opacity: icon.opacity }"
        class="image-icon"/>
    </div>
    <div class="card-info">
      <h1 class="card-title">{{ question.title }}</h1>
      <User :data="question.author" />
    </div>
  </div>
</template>
<script>
import interact from 'interactjs'
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
    },
    approved: {
      type: Boolean,
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
      maxStars: 5,
      animating: true, // Controls CSS class with transition declaration
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
    }
  },
  watch: {
    approved: function() {
      if (this.approved !== null) {
        const self = this

        // Remove interact listener to prevent further dragging
        interact(this.$el).unset()
        this.animating = true

        /*
        Move card off-screen in direction of approve/reject status,
        then remove it from the DOM, thereby adjusting the CSS
        nth-child selectors.
        */

        const x =
          window.innerWidth + window.innerWidth / 2 + this.$el.offsetWidth

        if (this.approved === true) {
          this.position.x = x
          this.position.rotation = this.maxRotation
          this.icon.type = 'approve'
        } else if (this.approved === false) {
          this.position.x = -x
          this.position.rotation = -this.maxRotation
          this.icon.type = 'reject'
        }

        this.icon.opacity = 1

        setTimeout(function() {
          self.showing = false
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
    console.log(this.storageUrl1)
    const element = this.$el
    const self = this

    interact(element).draggable({
      inertia: true,
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
          self.icon.type = 'approve'
          self.imageWidth = 50 + amount * 100
        } else if (rotate < 0) {
          self.icon.type = 'reject'
          self.imageWidth = 50 - amount * 100
        }
        //console.log(self.imageWidth)
        self.icon.opacity = amount
        self.$emit('draggedActive', self.icon.type, amount)
      },
      onend: function(event) {
        /*
        Check if card has passed the approve/reject threshold and emit approval
        value change event, otherwise reset card and icon to default values.
        */
        console.log('onend')
        self.animating = true

        if (self.position.x > self.threshold) {
          console.log('a')
          self.$emit('draggedThreshold', true)
          self.icon.opacity = 1
        } else if (self.position.x < -self.threshold) {
          console.log('b')
          self.$emit('draggedThreshold', false)
          self.icon.opacity = 1
        } else {
          self.position.x = 0
          self.position.y = 0
          self.position.rotation = 0
          self.icon.opacity = 0
          self.imageWidth = 50
        }

        self.$emit('draggedEnded')
      }
    })
  },
  methods: {}
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
  opacity: 0;
  left: 0;
  top: 0;
  position: absolute;
  width: $cardsWidth;
  max-width: $cardsMaxWidth;
  height: $cardsHeight;
  border-radius: 8px;
  background: $colour-white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: translateY($defaultTranslation) scale($defaultScale);
  transform-origin: 50%, 100%;
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
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.imageBox {
  width: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}

.image {
  display: block;
  width: 50%;
  height: $cardsWidth;
  max-height: $cardsMaxWidth;
  background-size: cover;
  &.one {
    border-radius: 8px 0 0 0;
  }
  &.two {
    border-radius: 0 8px 0 0;
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

.image-icon.approve {
  background-image: url('/b.svg');
}

.image-icon.reject {
  background-image: url('/a.svg');
}

.card-info {
  padding: 15px;
}

.card-title {
  margin: 0 auto;
  display: block;
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  text-transform: capitalize;
}

$starSize: 24px;
$starSpacing: $starSize;
$starTotal: 5;

.stars {
  margin: 0 auto 0 auto;
  width: ($starSize * $starTotal) + ($starSpacing * ($starTotal - 1));
}

.stars:after {
  content: '';
  display: table;
  clear: both;
}

.stars > .star-active,
.stars > .star-inactive {
  float: left;
  margin-right: $starSpacing;
  width: $starSize;
  height: $starSize;
  @extend %backgroundContain;
}

.stars > .star-active:last-child,
.stars > .star-inactive:last-child {
  margin-right: 0;
}

.stars > .star-active {
  background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/617753/star-active.svg');
}

.stars > .star-inactive {
  background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/617753/star-inactive.svg');
}
</style>
