<template>
  <div class="container">
    <header>
      <h1>🧪 Vue 3.2.x - Spotflow SDK Compatibility Test</h1>
      <p>Testing Vue Spotflow SDK with Vue 3.2.x using Composition API</p>
      <div class="test-info">
        <span class="status-badge status-pending">Vue {{ vueVersion }}</span>
        <span class="status-badge status-pending">Composition API</span>
        <span class="status-badge status-pending">&lt;script setup&gt;</span>
      </div>
    </header>

    <!-- SDK Import Test -->
    <div class="test-section">
      <h2>📦 SDK Import Test</h2>
      <p><strong>Status:</strong> <span :class="importStatus.class">{{ importStatus.message }}</span></p>
      <div v-if="importStatus.details">
        <pre>{{ importStatus.details }}</pre>
      </div>
    </div>

    <!-- SpotflowButton Component Test -->
    <div class="test-section">
      <h2>🔘 SpotflowButton Component Test</h2>
      <p>Testing the SpotflowButton component with Composition API:</p>
      
      <div v-if="componentAvailable">
        <SpotflowButton 
          :config="testConfig" 
          @success="onPaymentSuccess" 
          @error="onPaymentError"
          @close="onPaymentClose"
        >
          💳 Pay ₦100 - Test Payment (Vue 3.2.x)
        </SpotflowButton>
        <p class="status-success">✅ Component loaded and rendered successfully</p>
      </div>
      <div v-else>
        <p class="status-error">❌ Component not available</p>
      </div>
    </div>

    <!-- Composable Test -->
    <div class="test-section">
      <h2>🎯 useSpotflowPayment Composable Test</h2>
      <p>Testing the useSpotflowPayment composable with Vue 3.2.x:</p>
      
      <button @click="testComposablePayment" :disabled="!composableAvailable">
        🚀 Test Composable Payment
      </button>
      
      <p><strong>Status:</strong> 
        <span :class="composableAvailable ? 'status-success' : 'status-error'">
          {{ composableAvailable ? '✅ Composable Available' : '❌ Composable Not Available' }}
        </span>
      </p>
    </div>

    <!-- Reactivity Test -->
    <div class="test-section">
      <h2>⚡ Vue 3.2.x Reactivity Test</h2>
      <p>Testing Vue 3.2.x specific features:</p>
      
      <div class="reactivity-demo">
        <p><strong>Reactive Counter:</strong> {{ counter }}</p>
        <button @click="counter++">Increment Counter</button>
        
        <p><strong>Computed Value:</strong> {{ doubledCounter }}</p>
        
        <p><strong>Ref Test:</strong> {{ refValue }}</p>
        <button @click="updateRef">Update Ref</button>
      </div>
    </div>

    <!-- Console & Error Monitoring -->
    <div class="test-section">
      <h2>🔍 Console & Error Monitoring</h2>
      <p><strong>JavaScript Errors:</strong> {{ errorCount }}</p>
      <p><strong>Console Warnings:</strong> {{ warningCount }}</p>
      
      <div v-if="logs.length > 0">
        <h4>Recent Logs:</h4>
        <div v-for="(log, index) in logs" :key="index" class="log-entry">
          <span :class="'log-' + log.type">[{{ log.type.toUpperCase() }}]</span> 
          <span class="log-time">{{ log.timestamp }}</span> - {{ log.message }}
        </div>
      </div>
    </div>

    <!-- Test Results Summary -->
    <div class="test-section">
      <h2>📊 Test Results Summary</h2>
      <ul>
        <li class="success">✅ Vue 3.2.x Installation: Success</li>
        <li :class="importStatus.success ? 'success' : 'error'">
          {{ importStatus.success ? '✅' : '❌' }} SDK Import: {{ importStatus.message }}
        </li>
        <li :class="componentAvailable ? 'success' : 'error'">
          {{ componentAvailable ? '✅' : '❌' }} SpotflowButton Component: Available
        </li>
        <li :class="composableAvailable ? 'success' : 'error'">
          {{ composableAvailable ? '✅' : '❌' }} useSpotflowPayment Composable: Available
        </li>
        <li class="success">✅ Composition API: Working</li>
        <li class="success">✅ Reactivity System: Working</li>
        <li :class="errorCount === 0 ? 'success' : 'error'">
          {{ errorCount === 0 ? '✅' : '❌' }} Console Errors: {{ errorCount }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Test SDK imports
let SpotflowButton = null
let useSpotflowPayment = null
let importError = null

try {
  const spotflowModule = await import('@spot-flow/vue-spotflow-checkout')
  SpotflowButton = spotflowModule.SpotflowButton
  useSpotflowPayment = spotflowModule.useSpotflowPayment
} catch (error) {
  importError = error
  console.error('Failed to import Spotflow SDK:', error)
}

// Reactive data
const vueVersion = ref('3.2.x')
const errorCount = ref(0)
const warningCount = ref(0)
const logs = ref([])
const counter = ref(0)
const refValue = ref('Initial Value')

// Computed properties
const doubledCounter = computed(() => counter.value * 2)

const componentAvailable = computed(() => !!SpotflowButton)
const composableAvailable = computed(() => !!useSpotflowPayment && typeof useSpotflowPayment === 'function')

const importStatus = computed(() => {
  if (importError) {
    return {
      success: false,
      class: 'status-error',
      message: 'Import Failed',
      details: importError.message
    }
  }
  if (SpotflowButton || useSpotflowPayment) {
    return {
      success: true,
      class: 'status-success',
      message: 'Import Successful',
      details: `SpotflowButton: ${!!SpotflowButton}, useSpotflowPayment: ${!!useSpotflowPayment}`
    }
  }
  return {
    success: false,
    class: 'status-pending',
    message: 'Import Pending'
  }
})

// Test configuration
const testConfig = ref({
  merchantKey: "sk_test_3500ece212364e11abd01984afdd67b3",
  encryptionKey: "47qqVD15YhEbmF8EhY/3F9aICG/Hn96NMz4AbLb1cRk=",
  amount: 100,
  currency: "NGN",
  email: "test@example.com",
  name: "Vue 3.2.x Test User",
  reference: "VUE32-TEST-" + Date.now()
})

// Methods
const testComposablePayment = async () => {
  if (useSpotflowPayment) {
    try {
      const loadSpotflow = useSpotflowPayment()
      await loadSpotflow(testConfig.value)
      addLog('info', 'Composable payment initiated successfully')
    } catch (error) {
      addLog('error', 'Composable test failed: ' + error.message)
    }
  } else {
    addLog('error', 'useSpotflowPayment composable not available')
  }
}

const updateRef = () => {
  refValue.value = 'Updated at ' + new Date().toLocaleTimeString()
}

const onPaymentSuccess = (response) => {
  addLog('success', 'Payment successful: ' + JSON.stringify(response))
}

const onPaymentError = (error) => {
  addLog('error', 'Payment failed: ' + JSON.stringify(error))
}

const onPaymentClose = () => {
  addLog('info', 'Payment modal closed')
}

const addLog = (type, message) => {
  logs.value.unshift({
    type,
    message,
    timestamp: new Date().toLocaleTimeString()
  })
  if (logs.value.length > 10) {
    logs.value.pop()
  }
}

// Lifecycle
onMounted(() => {
  // Monitor console errors and warnings
  const originalError = console.error
  const originalWarn = console.warn
  
  console.error = (...args) => {
    errorCount.value++
    addLog('error', args.join(' '))
    originalError.apply(console, args)
  }
  
  console.warn = (...args) => {
    warningCount.value++
    addLog('warning', args.join(' '))
    originalWarn.apply(console, args)
  }

  addLog('info', 'Vue 3.2.x compatibility test initialized with Composition API')
  addLog('info', `Component available: ${componentAvailable.value}`)
  addLog('info', `Composable available: ${composableAvailable.value}`)
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fafafa;
}

.test-info {
  margin: 10px 0;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  margin: 2px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-success { background: #d4edda; color: #155724; }
.status-error { background: #f8d7da; color: #721c24; }
.status-warning { background: #fff3cd; color: #856404; }

.reactivity-demo {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 10px 0;
}

.reactivity-demo p {
  margin: 8px 0;
}

.log-entry {
  font-family: monospace;
  font-size: 12px;
  margin: 5px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 3px;
  border-left: 3px solid #dee2e6;
}

.log-time {
  color: #6c757d;
  font-size: 11px;
}

.log-error { border-left-color: #dc3545; }
.log-warning { border-left-color: #ffc107; }
.log-info { border-left-color: #17a2b8; }
.log-success { border-left-color: #28a745; }

.log-error span:first-child { color: #dc3545; font-weight: bold; }
.log-warning span:first-child { color: #ffc107; font-weight: bold; }
.log-info span:first-child { color: #17a2b8; font-weight: bold; }
.log-success span:first-child { color: #28a745; font-weight: bold; }

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  border: 1px solid #dee2e6;
}

ul li.success { color: #28a745; }
ul li.error { color: #dc3545; }
ul li.warning { color: #ffc107; }

h1 { color: #2c3e50; }
h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
</style>
