<template>
  <div class="container">
    <h2 class="page-title">{{ title }}</h2>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 12px 8px;
  text-align: center;
}
.page-title {
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
}
</style>
