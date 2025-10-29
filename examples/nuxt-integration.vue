<template>
  <div class="nuxt-integration-container">
    <h2>Nuxt.js Integration Example</h2>
    <p>This example shows how to use Spotflow payments in a Nuxt.js application.</p>
    
    <div class="integration-methods">
      <!-- Method 1: Using the Plugin -->
      <div class="method-card">
        <h3>Method 1: Using $paymentGateway Plugin</h3>
        <p>Access the payment gateway through the Nuxt plugin</p>
        
        <div class="code-example">
          <h4>In your nuxt.config.ts:</h4>
          <pre><code>export default defineNuxtConfig({
  modules: ['@spot-flow/vue-spotflow-checkout/nuxt']
})</code></pre>
        </div>
        
        <button @click="payWithPlugin" class="demo-button">
          Pay with Plugin
        </button>
      </div>
      
      <!-- Method 2: Direct Composable Usage -->
      <div class="method-card">
        <h3>Method 2: Direct Composable Usage</h3>
        <p>Import and use the composable directly</p>
        
        <button @click="payWithComposable" class="demo-button">
          Pay with Composable
        </button>
      </div>
      
      <!-- Method 3: Component Usage -->
      <div class="method-card">
        <h3>Method 3: SpotflowButton Component</h3>
        <p>Use the pre-built button component</p>
        
        <SpotflowButton 
          :config="buttonConfig"
          class="nuxt-button"
          @payment-start="onPaymentStart"
          @payment-error="onPaymentError"
        >
          Pay with Component
        </SpotflowButton>
      </div>
    </div>
    
    <!-- SSR Considerations -->
    <div class="ssr-info">
      <h3>SSR Considerations</h3>
      <div class="info-grid">
        <div class="info-card">
          <h4>✅ Client-Side Only</h4>
          <p>Payment processing automatically detects browser environment and only runs client-side.</p>
        </div>
        
        <div class="info-card">
          <h4>🔄 Hydration Safe</h4>
          <p>Components are designed to be hydration-safe and won't cause SSR mismatches.</p>
        </div>
        
        <div class="info-card">
          <h4>📱 Progressive Enhancement</h4>
          <p>Gracefully handles cases where JavaScript is disabled or hasn't loaded yet.</p>
        </div>
      </div>
    </div>
    
    <!-- Environment Configuration -->
    <div class="env-config">
      <h3>Environment Configuration</h3>
      <p>Configure your payment credentials in <code>.env</code>:</p>
      
      <div class="env-example">
        <pre><code># .env
NUXT_PUBLIC_SPOTFLOW_MERCHANT_KEY=sk_test_your_merchant_key
NUXT_PUBLIC_SPOTFLOW_ENCRYPTION_KEY=your_encryption_key

# For production
NUXT_PUBLIC_SPOTFLOW_MERCHANT_KEY=sk_live_your_live_merchant_key
NUXT_PUBLIC_SPOTFLOW_ENCRYPTION_KEY=your_live_encryption_key</code></pre>
      </div>
      
      <p>Access in your components:</p>
      <div class="usage-example">
        <pre><code>const config = useRuntimeConfig()
const paymentConfig = {
  merchantKey: config.public.spotflowMerchantKey,
  encryptionKey: config.public.spotflowEncryptionKey,
  // ... other options
}</code></pre>
      </div>
    </div>
    
    <!-- Event Log -->
    <div v-if="logs.length > 0" class="event-log">
      <h3>Event Log</h3>
      <div class="log-entries">
        <div 
          v-for="(log, index) in logs" 
          :key="index"
          class="log-entry"
          :class="log.type"
        >
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSpotflowPayment, SpotflowButton } from '@spot-flow/vue-spotflow-checkout'

// For demonstration purposes, we'll simulate the Nuxt environment
// In a real Nuxt app, you would use useRuntimeConfig() and $paymentGateway

interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error'
}

const logs = ref<LogEntry[]>([])

const addLog = (message: string, type: LogEntry['type'] = 'info') => {
  logs.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    message,
    type
  })
}

// Initialize composable
const loadSpotflow = useSpotflowPayment()

// Common payment configuration
const getPaymentConfig = (source: string) => ({
  amount: 3000,
  currency: "NGN" as const,
  email: "nuxt-customer@example.com",
  merchantKey: "sk_test_replace_with_your_merchant_key", // In real app: config.public.spotflowMerchantKey
  encryptionKey: "replace_with_your_encryption_key", // In real app: config.public.spotflowEncryptionKey
  metadata: {
    productName: "Nuxt Integration Demo",
    source,
    framework: "nuxt"
  }
})

// Button configuration
const buttonConfig = getPaymentConfig('component')

// Method 1: Using plugin (simulated)
const payWithPlugin = async () => {
  try {
    addLog('Initiating payment with Nuxt plugin...', 'info')
    
    // In a real Nuxt app, you would use:
    // const { $paymentGateway } = useNuxtApp()
    // await $paymentGateway(getPaymentConfig('plugin'))
    
    // For demo purposes, we'll use the composable
    await loadSpotflow(getPaymentConfig('plugin'))
    addLog('Payment initiated successfully via plugin', 'success')
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment failed'
    addLog(`Plugin payment error: ${message}`, 'error')
  }
}

// Method 2: Direct composable usage
const payWithComposable = async () => {
  try {
    addLog('Initiating payment with direct composable...', 'info')
    await loadSpotflow(getPaymentConfig('composable'))
    addLog('Payment initiated successfully via composable', 'success')
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment failed'
    addLog(`Composable payment error: ${message}`, 'error')
  }
}

// Event handlers for button component
const onPaymentStart = () => {
  addLog('Payment started via SpotflowButton component', 'info')
}

const onPaymentError = (error: Error) => {
  addLog(`Component payment error: ${error.message}`, 'error')
}

// Meta for SEO (Nuxt-specific)
// useSeoMeta({
//   title: 'Payment Integration - Nuxt Example',
//   description: 'Example of integrating Spotflow payments in a Nuxt.js application'
// })
</script>

<style scoped>
.nuxt-integration-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.integration-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.method-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  background: #fff;
}

.method-card h3 {
  margin: 0 0 12px 0;
  color: #00dc82; /* Nuxt green */
  font-size: 18px;
}

.method-card p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.code-example {
  margin: 16px 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 4px;
  border-left: 4px solid #00dc82;
}

.code-example h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #374151;
}

.code-example pre {
  margin: 0;
  font-size: 12px;
  background: none;
  padding: 0;
}

.demo-button {
  background: #00dc82;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.demo-button:hover {
  background: #00c16a;
}

.nuxt-button {
  background: #00dc82;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.nuxt-button:hover:not(:disabled) {
  background: #00c16a;
}

.ssr-info, .env-config {
  margin-bottom: 40px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.ssr-info h3, .env-config h3 {
  margin: 0 0 20px 0;
  color: #1e293b;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-card {
  background: white;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.info-card h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #1e293b;
}

.info-card p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.env-example, .usage-example {
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 6px;
  margin: 12px 0;
  overflow-x: auto;
}

.env-example pre, .usage-example pre {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

.env-config code {
  background: #e2e8f0;
  color: #064e3b;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.event-log {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #f9fafb;
}

.event-log h3 {
  margin: 0 0 16px 0;
  color: #374151;
}

.log-entries {
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}

.log-entry {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.info {
  background: #eff6ff;
}

.log-entry.success {
  background: #f0fdf4;
  color: #166534;
}

.log-entry.error {
  background: #fef2f2;
  color: #dc2626;
}

.timestamp {
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
}

.message {
  flex: 1;
}
</style>