<template>
  <div
    v-if="question"
    class="item-container"
    @click="$emit('moveToDetail', question)">
    <div class="imageBox">
      <div
        :style="{
          background: `#F24E86 url(${storageUrl1}) center center / cover`,
        }"
        class="image one"
      />
      <div
        :style="{
          background: `#02B4FF url(${storageUrl2}) center center / cover`,
        }"
        class="image two"
      />
    </div>
    <div class="info-container">
      <div class="question-title">{{ question.title }}</div>
      <div class="info-numbers">
        <div class="date">{{ momentDate(question.created.seconds) }}</div>
        <div class="total"><v-icon size="16">check_circle_outline</v-icon>{{ question.choice.total }}</div>
        <div class="comment"><v-icon size="16">comment</v-icon></div>
      </div>
      <div class="bar-container">
        <div
          :style="{width: `${oneRate}%`}"
          class="bar one" />
        <div
          :style="{width: `${twoRate}%`}"
          class="bar two" />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import storage from '~/api/firestorage'
export default {
  filters: {
    moment: function(date) {
      return moment(date).format()
    }
  },
  props: {
    question: {
      type: Object,
      required: false,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      storageUrl1: '',
      storageUrl2: ''
    }
  },
  computed: {
    oneRate() {
      const total = this.question.choice.total
      const oneTotal = this.question.choice.one.total
      return (oneTotal / total) * 100
    },
    twoRate() {
      const total = this.question.choice.total
      const twoTotal = this.question.choice.two.total
      return (twoTotal / total) * 100
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
  methods: {
    calculateRate() {
      console.log('calculate')
      const total = this.question.choice.total
      const oneTotal = this.question.choice.one.total
      const twoTotal = this.question.choice.two.total
      this.oneRate = (oneTotal / total) * 100
      this.twoRate = (twoTotal / total) * 100
    },
    momentDate(seconds) {
      return moment.unix(seconds).format('YYYY/MM/DD')
    }
  }
}
</script>
<style lang="scss" scoped>
.item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin: 8px 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.imageBox {
  width: 84px;
  height: 84px;
  display: flex;
  justify-content: center;
  .image {
    width: 42px;
    &.one {
      border-radius: 8px 0 0 8px;
    }
  }
}
.info-container {
  position: relative;
  flex-grow: 1;
  height: 84px;
  padding: 8px;
  text-align: left;
}
.info-numbers {
  display: flex;
  justify-content: flex-start;
  color: #7f828b;
  font-size: 12px;
  font-weight: normal;
  .date {
    padding: 0 4px;
  }
  .total {
    padding: 0 4px;
  }
  .comment {
    padding: 0 4px;
  }
}
.bar-container {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
}
.bar {
  height: 4px;
  transition: all 0.2s linear;
  font-size: 12px;
  color: #fff;
}
.one {
  background: #f24e86 center center / cover;
}
.two {
  background: #02b4ff center center / cover;
}
.question-title {
  font-size: 14px;
  line-height: 1.5;
  font-weight: bold;
}
</style>
