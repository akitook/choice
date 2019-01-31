<template>
  <v-snackbar
    v-model="snackbar.isShow"
    :color="snackbar.type"
    :bottom="bottom"
    :timeout="timeout"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      bottom: true,
      timeout: 4000
    }
  },
  computed: {
    ...mapState(['snackbar'])
  },
  created() {}
}
</script>
<style lang="scss" scoped>
</style>
