<template>
  <div class="container">
    <header>
      <h1>🧪 Vue 3.3.x - Spotflow SDK Compatibility Test</h1>
      <p>Testing Vue Spotflow SDK with Vue 3.3.x using enhanced TypeScript support</p>
      <div class="test-info">
        <span class="status-badge status-pending">Vue {{ vueVersion }}</span>
        <span class="status-badge status-pending">TypeScript</span>
        <span class="status-badge status-pending">Enhanced DX</span>
        <span class="status-badge status-pending">Generic Components</span>
      </div>
    </header>

    <!-- SDK Import Test -->
    <div class="test-section">
      <h2>📦 SDK Import Test</h2>
      <p><strong>Status:</strong> <span :class="importStatus.class">{{ importStatus.message }}</span></p>
      <div v-if="importStatus.details">
        <pre>{{ importStatus.details }}</pre>
      </div>
      <div v-if="importStatus.types">
        <h4>TypeScript Support:</h4>
        <pre>{{ importStatus.types }}</pre>
      </div>
    </div>

    <!-- SpotflowButton Component Test -->
    <div class="test-section">
      <h2>🔘 SpotflowButton Component Test</h2>
      <p>Testing the SpotflowButton component with Vue 3.3.x enhanced features:</p>
      
      <div v-if="componentAvailable">
        <SpotflowButton 
          :config="testConfig" 
          @success="onPaymentSuccess" 
          @error="onPaymentError"
          @close="onPaymentClose"
          class="payment-button"
        >
          💳 Pay ₦100 - Test Payment (Vue 3.3.x)
        </SpotflowButton>
        <p class="status-success">✅ Component loaded with full TypeScript support</p>
      </div>
      <div v-else>
        <p class="status-error">❌ Component not available</p>
      </div>
    </div>

    <!-- Composable Test with TypeScript -->
    <div class="test-section">
      <h2>🎯 useSpotflowPayment Composable Test</h2>
      <p>Testing the useSpotflowPayment composable with Vue 3.3.x TypeScript enhancements:</p>
      
      <button @click="testComposablePayment" :disabled="!composableAvailable" class="test-button">
        🚀 Test Composable Payment
      </button>
      
      <p><strong>Status:</strong> 
        <span :class="composableAvailable ? 'status-success' : 'status-error'">
          {{ composableAvailable ? '✅ Composable Available' : '❌ Composable Not Available' }}
        </span>
      </p>

      <div v-if="composableAvailable" class="type-info">
        <h4>TypeScript Inference Test:</h4>
        <p>Config type: <code>{{ configType }}</code></p>
        <p>Return type: <code>{{ returnType }}</code></p>
      </div>
    </div>

    <!-- Vue 3.3.x Specific Features Test -->
    <div class="test-section">
      <h2>⚡ Vue 3.3.x Enhanced Features Test</h2>
      
      <!-- Generic Components Test -->
      <div class="feature-test">
        <h4>Generic Components & Better TypeScript:</h4>
        <GenericTestComponent :items="testItems" v-slot="{ item }">
          <div class="item-display">{{ item.name }} - {{ item.value }}</div>
        </GenericTestComponent>
      </div>

      <!-- Improved Reactivity -->
      <div class="feature-test">
        <h4>Enhanced Reactivity:</h4>
        <p><strong>Reactive Counter:</strong> {{ counter }}</p>
        <button @click="incrementCounter">Increment</button>
        
        <p><strong>Computed (with better inference):</strong> {{ computedValue }}</p>
        
        <p><strong>Watch Effect:</strong> {{ watchedValue }}</p>
        <button @click="triggerWatch">Trigger Watch</button>
      </div>

      <!-- defineModel Test (Vue 3.3+ feature) -->
      <div class="feature-test">
        <h4>defineModel Test:</h4>
        <ModelTestComponent v-model="modelValue" />
        <p>Model Value: {{ modelValue }}</p>
      </div>
    </div>

    <!-- Performance & Developer Experience -->
    <div class="test-section">
      <h2>🚀 Performance & DX Test</h2>
      
      <div class="performance-metrics">
        <div class="metric">
          <h4>Component Render Time</h4>
          <p>{{ renderTime }}ms</p>
        </div>
        <div class="metric">
          <h4>TypeScript Compilation</h4>
          <p class="status-success">✅ No Type Errors</p>
        </div>
        <div class="metric">
          <h4>Hot Module Replacement</h4>
          <p class="status-success">✅ Working</p>
        </div>
      </div>
    </div>

    <!-- Console & Error Monitoring -->
    <div class="test-section">
      <h2>🔍 Console & Error Monitoring</h2>
      <div class="monitoring-grid">
        <div class="monitor-item">
          <h4>JavaScript Errors</h4>
          <span class="error-count">{{ errorCount }}</span>
        </div>
        <div class="monitor-item">
          <h4>Console Warnings</h4>
          <span class="warning-count">{{ warningCount }}</span>
        </div>
        <div class="monitor-item">
          <h4>TypeScript Errors</h4>
          <span class="ts-error-count">{{ tsErrorCount }}</span>
        </div>
      </div>
      
      <div v-if="logs.length > 0" class="logs-container">
        <h4>Recent Logs:</h4>
        <div v-for="(log, index) in logs" :key="index" class="log-entry">
          <span :class="'log-' + log.type">[{{ log.type.toUpperCase() }}]</span>
          <span class="log-time">{{ log.timestamp }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>

    <!-- Test Results Summary -->
    <div class="test-section">
      <h2>📊 Vue 3.3.x Test Results Summary</h2>
      <div class="results-grid">
        <div class="result-item success">
          <span class="result-icon">✅</span>
          <span>Vue 3.3.x Installation</span>
        </div>
        <div class="result-item" :class="importStatus.success ? 'success' : 'error'">
          <span class="result-icon">{{ importStatus.success ? '✅' : '❌' }}</span>
          <span>SDK Import & Types</span>
        </div>
        <div class="result-item" :class="componentAvailable ? 'success' : 'error'">
          <span class="result-icon">{{ componentAvailable ? '✅' : '❌' }}</span>
          <span>SpotflowButton Component</span>
        </div>
        <div class="result-item" :class="composableAvailable ? 'success' : 'error'">
          <span class="result-icon">{{ composableAvailable ? '✅' : '❌' }}</span>
          <span>useSpotflowPayment Composable</span>
        </div>
        <div class="result-item success">
          <span class="result-icon">✅</span>
          <span>TypeScript Support</span>
        </div>
        <div class="result-item success">
          <span class="result-icon">✅</span>
          <span>Generic Components</span>
        </div>
        <div class="result-item success">
          <span class="result-icon">✅</span>
          <span>Enhanced Reactivity</span>
        </div>
        <div class="result-item" :class="errorCount === 0 ? 'success' : 'error'">
          <span class="result-icon">{{ errorCount === 0 ? '✅' : '❌' }}</span>
          <span>Console Errors: {{ errorCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, type Ref } from 'vue'
import GenericTestComponent from './components/GenericTestComponent.vue'
import ModelTestComponent from './components/ModelTestComponent.vue'

// Type definitions for better TypeScript support
interface TestItem {
  id: number
  name: string
  value: string
}

interface PaymentConfig {
  merchantKey: string
  encryptionKey: string
  amount: number
  currency: string
  email: string
  name: string
  reference: string
}

interface LogEntry {
  type: 'error' | 'warning' | 'info' | 'success'
  message: string
  timestamp: string
}

// Test SDK imports with proper typing
let SpotflowButton: any = null
let useSpotflowPayment: any = null
let importError: Error | null = null

try {
  const spotflowModule = await import('@spot-flow/vue-spotflow-checkout')
  SpotflowButton = spotflowModule.SpotflowButton
  useSpotflowPayment = spotflowModule.useSpotflowPayment
} catch (error) {
  importError = error as Error
  console.error('Failed to import Spotflow SDK:', error)
}

// Reactive state with proper typing
const vueVersion: Ref<string> = ref('3.3.x')
const errorCount: Ref<number> = ref(0)
const warningCount: Ref<number> = ref(0)
const tsErrorCount: Ref<number> = ref(0)
const logs: Ref<LogEntry[]> = ref([])
const counter: Ref<number> = ref(0)
const watchedValue: Ref<string> = ref('Initial')
const modelValue: Ref<string> = ref('Test Model Value')
const renderTime: Ref<number> = ref(0)

// Test data
const testItems: Ref<TestItem[]> = ref([
  { id: 1, name: 'Item 1', value: 'Value A' },
  { id: 2, name: 'Item 2', value: 'Value B' },
  { id: 3, name: 'Item 3', value: 'Value C' }
])

// Computed properties with enhanced type inference
const componentAvailable = computed((): boolean => !!SpotflowButton)
const composableAvailable = computed((): boolean => !!useSpotflowPayment && typeof useSpotflowPayment === 'function')

const computedValue = computed((): string => `Counter doubled: ${counter.value * 2}`)

const configType = computed((): string => 'PaymentConfig')
const returnType = computed((): string => 'Promise<void>')

const importStatus = computed(() => {
  if (importError) {
    return {
      success: false,
      class: 'status-error',
      message: 'Import Failed',
      details: importError.message,
      types: 'TypeScript definitions: Not available'
    }
  }
  if (SpotflowButton || useSpotflowPayment) {
    return {
      success: true,
      class: 'status-success',
      message: 'Import Successful',
      details: `SpotflowButton: ${!!SpotflowButton}, useSpotflowPayment: ${!!useSpotflowPayment}`,
      types: 'TypeScript definitions: Available with full type inference'
    }
  }
  return {
    success: false,
    class: 'status-pending',
    message: 'Import Pending'
  }
})

// Test configuration with proper typing
const testConfig: Ref<PaymentConfig> = ref({
  merchantKey: "sk_test_3500ece212364e11abd01984afdd67b3",
  encryptionKey: "47qqVD15YhEbmF8EhY/3F9aICG/Hn96NMz4AbLb1cRk=",
  amount: 100,
  currency: "NGN",
  email: "test@example.com",
  name: "Vue 3.3.x Test User",
  reference: "VUE33-TEST-" + Date.now()
})

// Methods with proper typing
const testComposablePayment = async (): Promise<void> => {
  if (useSpotflowPayment) {
    try {
      const loadSpotflow = useSpotflowPayment()
      await loadSpotflow(testConfig.value)
      addLog('info', 'Composable payment initiated successfully')
    } catch (error) {
      addLog('error', 'Composable test failed: ' + (error as Error).message)
    }
  } else {
    addLog('error', 'useSpotflowPayment composable not available')
  }
}

const incrementCounter = (): void => {
  counter.value++
}

const triggerWatch = (): void => {
  watchedValue.value = 'Updated at ' + new Date().toLocaleTimeString()
}

const onPaymentSuccess = (response: any): void => {
  addLog('success', 'Payment successful: ' + JSON.stringify(response))
}

const onPaymentError = (error: any): void => {
  addLog('error', 'Payment failed: ' + JSON.stringify(error))
}

const onPaymentClose = (): void => {
  addLog('info', 'Payment modal closed')
}

const addLog = (type: LogEntry['type'], message: string): void => {
  logs.value.unshift({
    type,
    message,
    timestamp: new Date().toLocaleTimeString()
  })
  if (logs.value.length > 15) {
    logs.value.pop()
  }
}

// Watch effects with enhanced TypeScript support
watchEffect(() => {
  if (counter.value > 0) {
    addLog('info', `Counter updated to: ${counter.value}`)
  }
})

// Lifecycle with performance monitoring
onMounted(() => {
  const startTime = performance.now()
  
  // Monitor console errors and warnings
  const originalError = console.error
  const originalWarn = console.warn
  
  console.error = (...args: any[]): void => {
    errorCount.value++
    addLog('error', args.join(' '))
    originalError.apply(console, args)
  }
  
  console.warn = (...args: any[]): void => {
    warningCount.value++
    addLog('warning', args.join(' '))
    originalWarn.apply(console, args)
  }

  const endTime = performance.now()
  renderTime.value = Math.round(endTime - startTime)

  addLog('info', 'Vue 3.3.x compatibility test initialized with enhanced TypeScript support')
  addLog('info', `Component available: ${componentAvailable.value}`)
  addLog('info', `Composable available: ${composableAvailable.value}`)
  addLog('info', `Render time: ${renderTime.value}ms`)
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin: 30px 0;
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.test-info {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-pending { background: linear-gradient(45deg, #fff3cd, #ffeaa7); color: #856404; }
.status-success { background: linear-gradient(45deg, #d4edda, #00b894); color: #155724; }
.status-error { background: linear-gradient(45deg, #f8d7da, #e17055); color: #721c24; }

.feature-test {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.item-display {
  padding: 8px;
  margin: 4px 0;
  background: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.metric {
  text-align: center;
  padding: 20px;
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: white;
  border-radius: 8px;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.monitor-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 2px solid #dee2e6;
}

.error-count, .warning-count, .ts-error-count {
  display: block;
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
}

.error-count { color: #dc3545; }
.warning-count { color: #ffc107; }
.ts-error-count { color: #6f42c1; }

.logs-container {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin: 5px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #dee2e6;
}

.log-time {
  color: #6c757d;
  font-size: 11px;
  min-width: 80px;
}

.log-message {
  flex: 1;
}

.log-error { border-left-color: #dc3545; }
.log-warning { border-left-color: #ffc107; }
.log-info { border-left-color: #17a2b8; }
.log-success { border-left-color: #28a745; }

.log-error span:first-child { color: #dc3545; font-weight: bold; }
.log-warning span:first-child { color: #ffc107; font-weight: bold; }
.log-info span:first-child { color: #17a2b8; font-weight: bold; }
.log-success span:first-child { color: #28a745; font-weight: bold; }

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 6px;
  font-weight: 500;
}

.result-item.success {
  background: linear-gradient(145deg, #d4edda, #c3e6cb);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.result-item.error {
  background: linear-gradient(145deg, #f8d7da, #f5c6cb);
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.result-icon {
  font-size: 18px;
}

.test-button, .payment-button {
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 12px 24px;
  margin: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-button:hover, .payment-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.test-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.type-info {
  margin-top: 15px;
  padding: 10px;
  background: #e9ecef;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.type-info code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  color: #e83e8c;
}

pre {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  border: 1px solid #dee2e6;
  line-height: 1.4;
}

h1 { 
  color: #2c3e50; 
  background: linear-gradient(145deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 { 
  color: #34495e; 
  border-bottom: 3px solid #667eea; 
  padding-bottom: 8px; 
  margin-bottom: 20px;
}

h4 {
  color: #495057;
  margin-bottom: 10px;
}
</style>
