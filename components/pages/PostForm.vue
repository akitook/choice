<template>
  <V-layout
    column
    align-center>
    <PageTitle title="質問の作成" />
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      class="form"
    >
      <v-select
        v-model="select"
        :items="items"
        :rules="[v => !!v || 'Item is required']"
        label="質問形式"
        required
        disabled
      />
      <div class="card">
        <div class="imageBox">
          <div
            :style="{
              background: `url(${images[0].url ? images[0].url : '/a.png'}) center center / cover`,
              border: images[0].url ? 'none' : '3px dashed #F24E86'}"
            class="image a"
            @click="pickFile(1, $event)"
          >
            <input
              ref="image1"
              type="file"
              style="display: none"
              accept="image/*"
              required
              @change="onFilePicked(1, $event)"
            >
          </div>
          <div
            :style="{
              background: `url(${images[1].url ? images[1].url : '/b.png'}) center center / cover`,
              border: images[1].url ? 'none' : '3px dashed #02B4FF'}"
            class="image b"
            @click="pickFile(2, $event)"
          >
            <input
              ref="image2"
              type="file"
              style="display: none"
              accept="image/*"
              required
              @change="onFilePicked(2, $event)"
            >
          </div>
        </div>
        <v-textarea
          v-model="title"
          :counter="50"
          :rules="titleRules"
          height="80"
          outline
          flat
          placeholder="質問文を入力してください。"
        >
          <div slot="label">
            質問<small> (50文字まで)</small>
          </div>
        </v-textarea>
        <User :data="user.data" />
      </div>
      <div class="btn-container">
        <v-btn
          :disabled="title.length <= 6 || !images[0].file || !images[1].file"
          color="success"
          right
          @click="validate"
        >
          質問する！
        </v-btn>
      </div>
    </v-form>
  </V-layout>
</template>
<script>
import { mapState } from 'vuex'
import PageTitle from '~/components/ui/PageTitle.vue'
import Compressor from 'compressorjs'
import User from '../ui/User'
export default {
  components: {
    PageTitle,
    User
  },
  data() {
    return {
      valid: true,
      select: '画像とテキスト',
      items: ['画像とテキスト', 'テキストのみ'],
      title: '',
      titleRules: [
        v => !!v || '6文字以上',
        v => (v && v.length >= 6) || '質問文は6文字以上入力してください。'
      ],
      images: [
        {
          name: null,
          url: null,
          file: null
        },
        {
          name: null,
          url: null,
          file: null
        }
      ]
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    //if not login, redirect login
  },
  methods: {
    validate() {
      if (
        this.$refs.form.validate() &&
        this.images[0].file &&
        this.images[1].file
      ) {
        this.valid = false
        this.$store.dispatch('postQuestion', {
          title: this.title,
          images: this.images,
          user: this.user.data
        })
        this.$router.push('/')
      }
    },
    pickFile(image, e) {
      image === 1 ? this.$refs.image1.click() : this.$refs.image2.click()
    },
    compressor(image) {
      return new Promise(resolve => {
        new Compressor(image, {
          maxWidth: 750,
          quality: 0.8,
          success(result) {
            resolve(result)
          },
          error(err) {
            console.log(err.message)
          }
        })
      })
    },
    onFilePicked(image, e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        image === 1
          ? (this.images[0].name = files[0].name)
          : (this.images[1].name = files[0].name)
        this.compressor(files[0]).then(result => {
          if (image === 1) {
            this.images[0].url = URL.createObjectURL(result)
            this.images[0].file = result
          } else {
            this.images[1].url = URL.createObjectURL(result)
            this.images[1].file = result
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  padding: 24px 0;
}

.card {
  padding: 15px 15px 30px 15px;
  width: $cardsWidth;
  max-width: $cardsMaxWidth;
  border-radius: 8px;
  background: $colour-white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.imageBox {
  margin: 0 auto 30px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  display: block;
  width: 50%;
  height: $cardsWidth;
  max-height: $cardsMaxWidth;
  background-size: cover;
}

.btn-container {
  padding: 8px;
  text-align: center;
}
</style>
