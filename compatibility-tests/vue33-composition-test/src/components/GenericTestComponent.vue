<template>
  <div class="generic-component">
    <h5>Generic Component Test (Vue 3.3+ Feature)</h5>
    <div v-for="item in items" :key="item.id" class="generic-item">
      <slot :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number }">
// Vue 3.3+ generic component syntax
interface Props {
  items: T[]
}

defineProps<Props>()
</script>

<style scoped>
.generic-component {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}

.generic-item {
  margin: 5px 0;
}

h5 {
  margin: 0 0 10px 0;
  color: #6c757d;
  font-size: 14px;
}
</style>
