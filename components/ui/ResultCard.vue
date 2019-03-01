<template>
  <div class="card">
    <div class="card-info">
      <div class="user">
        <User
          :data="question.author"
          size="small" />
      </div>
      <h1 class="card-title">{{ question.title }}</h1>
    </div>
    <div
      class="total">
      {{ question.choice.total }} <span>votes</span>
    </div>
    <div class="choice-box">
      <div
        ref="choiceOne"
        :style="{
          background: `#FF008C url(${storageUrl1}) center center / cover`,
          width: `calc(100% - ${imageWidth}%)`}"
        :class="{ full : imageWidth <= 0}"
        class="image one"
      >
        <div
          class="contents"
        >
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
          class="contents"
        >
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
              url="https://kakidashi.hauer.jp"
              tweet="hogehoge"
              size="medium"
            />
            <LineButton
              ref="line"
              url="fff"
              size="medium"
            />
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
    }
  },
  data: function() {
    return {
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
/* EXTENDS */

%backgroundContain {
  background: center center no-repeat transparent;
  background-size: contain;
}

/* CARD */

$defaultTranslation: $cardsPositionOffset * $cardsTotal;
$defaultScale: 1 - ($cardsScaleOffset * $cardsTotal);

.card {
  width: $cardsWidth;
  max-width: $cardsMaxWidth;
  height: $cardsHeight;
  border-radius: 8px;
  background: $color-white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  will-change: transform, opacity;
}

/*
        Cascade the cards by translation and scale based on
        their nth-child index
    */

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
