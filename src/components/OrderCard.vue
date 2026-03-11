<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: [Number, String],
    default: 0
  }
});

</script>

<template>
    <div class="card">
        <h3> {{ title }}</h3>
        <h3> {{ count }} 건</h3>
    </div>

</template>

<style scoped>

</style>