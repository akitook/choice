<template>
  <div class="container">
    <h2 class="title">{{ title }}</h2>
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
  padding: 16px 8px;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
.title {
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
}
</style>
