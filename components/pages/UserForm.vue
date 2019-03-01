<template>
  <V-layout
    column
    align-center
  >
    <PageTitle
      title="プロフィールの設定" />
    <p class="text-xs-left">プロフィールに応じてあなたに合わせた質問をお届けします。</p>
    <v-avatar
      :size="46"
    >
      <img
        :src="user ? user.data.photoURL : '/user.jpg'"
        class="thumbnail"
      >
    </v-avatar>

    <v-form
      ref="form"
      lazy-validation
      class="form"
    >
      <v-text-field
        v-model="name"
        :rules="nameRules"
        :counter="15"
        label="表示名"
        required
      />
      <v-radio-group
        v-model="sex"
        row>
        <v-radio
          label="男性"
          value="male"/>
        <v-radio
          label="女性"
          value="female"/>
        <v-radio
          label="その他"
          value="other"/>
      </v-radio-group>
      <v-select
        v-model="birthYear"
        :items="birthItems"
        :rules="[v => !!v || '生まれた年を選んでください']"
        label="生まれた年"
        required
        flat
      />
      <div class="btn-container">
        <v-btn
          :disabled="!sex || !birthYear || user.isSaving"
          color="success"
          right
          @click="send"
        >送信する</v-btn>
      </div>
    </v-form>
  </V-layout>
</template>
<script>
import { mapState } from 'vuex'
import PageTitle from '~/components/ui/PageTitle.vue'
import User from '~/components/ui/User'
export default {
  components: {
    PageTitle,
    User
  },
  data() {
    return {
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 15 || 'Name must be less than 8 characters'
      ],
      sex: null,
      birthYear: 1990
    }
  },
  computed: {
    ...mapState(['user']),
    birthItems() {
      const today = new Date()
      const thisYear = today.getFullYear()
      let birthArray = []
      for (let i = 1950; i <= thisYear; i++) {
        birthArray.push(i)
      }
      return birthArray.reverse()
    }
  },
  mounted() {
    this.name = this.user.data.displayName || ''
    this.sex = this.user.info.sex || ''
    this.birthYear = this.user.info.birthYear || ''
  },
  methods: {
    send() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('user/updateUser', {
          displayName: this.name,
          sex: this.sex,
          birthYear: this.birthYear,
          userData: this.user.data
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
</style>
