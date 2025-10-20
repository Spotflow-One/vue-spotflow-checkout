<template>
  <div class="model-component">
    <h5>defineModel Test (Vue 3.3+ Feature)</h5>
    <input 
      :value="model" 
      @input="model = ($event.target as HTMLInputElement).value"
      placeholder="Test defineModel..."
      class="model-input"
    />
    <p class="model-info">This component uses defineModel for two-way binding</p>
  </div>
</template>

<script setup lang="ts">
// Vue 3.3+ defineModel feature
const model = defineModel<string>()
</script>

<style scoped>
.model-component {
  border: 1px solid #007bff;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  background: #f8f9ff;
}

.model-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.model-info {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
}

h5 {
  margin: 0 0 10px 0;
  color: #007bff;
  font-size: 14px;
}
</style>
