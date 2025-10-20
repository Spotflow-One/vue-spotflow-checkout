<template>
  <div class="container">
    <header>
      <h1>🧪 Vue 3.4.x - Spotflow SDK Compatibility Test</h1>
      <p>Testing Vue Spotflow SDK with Vue 3.4.x - Latest Version</p>
      <div class="test-info">
        <span class="status-badge">Vue {{ vueVersion }}</span>
        <span class="status-badge">Latest Features</span>
        <span class="status-badge">Performance Optimized</span>
      </div>
    </header>

    <!-- SDK Import Test -->
    <div class="test-section">
      <h2>📦 SDK Import Test</h2>
      <p><strong>Status:</strong> <span :class="importStatus.class">{{ importStatus.message }}</span></p>
    </div>

    <!-- SpotflowButton Test -->
    <div class="test-section">
      <h2>🔘 SpotflowButton Component Test</h2>
      <div v-if="componentAvailable">
        <SpotflowButton :config="testConfig" @success="onSuccess" @error="onError">
          💳 Pay ₦100 - Vue 3.4.x Test
        </SpotflowButton>
        <p class="status-success">✅ Component loaded successfully</p>
      </div>
      <div v-else>
        <p class="status-error">❌ Component not available</p>
      </div>
    </div>

    <!-- Composable Test -->
    <div class="test-section">
      <h2>🎯 useSpotflowPayment Test</h2>
      <button @click="testComposable" :disabled="!composableAvailable">
        🚀 Test Composable
      </button>
      <p><strong>Status:</strong> 
        <span :class="composableAvailable ? 'status-success' : 'status-error'">
          {{ composableAvailable ? '✅ Available' : '❌ Not Available' }}
        </span>
      </p>
    </div>

    <!-- Test Results -->
    <div class="test-section">
      <h2>📊 Test Results</h2>
      <ul>
        <li class="success">✅ Vue 3.4.x Installation</li>
        <li :class="importStatus.success ? 'success' : 'error'">
          {{ importStatus.success ? '✅' : '❌' }} SDK Import
        </li>
        <li :class="componentAvailable ? 'success' : 'error'">
          {{ componentAvailable ? '✅' : '❌' }} SpotflowButton
        </li>
        <li :class="composableAvailable ? 'success' : 'error'">
          {{ composableAvailable ? '✅' : '❌' }} useSpotflowPayment
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// SDK imports
let SpotflowButton: any = null
let useSpotflowPayment: any = null
let importError: Error | null = null

try {
  const module = await import('@spot-flow/vue-spotflow-checkout')
  SpotflowButton = module.SpotflowButton
  useSpotflowPayment = module.useSpotflowPayment
} catch (error) {
  importError = error as Error
}

const vueVersion = ref('3.4.x')
const componentAvailable = computed(() => !!SpotflowButton)
const composableAvailable = computed(() => !!useSpotflowPayment)

const importStatus = computed(() => ({
  success: !importError && (!!SpotflowButton || !!useSpotflowPayment),
  class: importError ? 'status-error' : 'status-success',
  message: importError ? 'Failed' : 'Success'
}))

const testConfig = ref({
  merchantKey: "sk_test_3500ece212364e11abd01984afdd67b3",
  encryptionKey: "47qqVD15YhEbmF8EhY/3F9aICG/Hn96NMz4AbLb1cRk=",
  amount: 100,
  currency: "NGN",
  email: "test@example.com",
  name: "Vue 3.4.x User",
  reference: "VUE34-" + Date.now()
})

const testComposable = async () => {
  if (useSpotflowPayment) {
    try {
      const loadSpotflow = useSpotflowPayment()
      await loadSpotflow(testConfig.value)
    } catch (error) {
      console.error('Composable test failed:', error)
    }
  }
}

const onSuccess = (response: any) => console.log('Success:', response)
const onError = (error: any) => console.error('Error:', error)

onMounted(() => {
  console.log('Vue 3.4.x test initialized')
})
</script>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 20px; }
.test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.status-badge { padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px; background: #e9ecef; }
.status-success { color: #28a745; }
.status-error { color: #dc3545; }
button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:disabled { background: #6c757d; }
ul li.success { color: #28a745; }
ul li.error { color: #dc3545; }
</style>
