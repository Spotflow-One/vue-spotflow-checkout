<template>
  <div class="button-example-container">
    <h2>SpotflowButton Component Example</h2>
    
    <div class="examples-grid">
      <!-- Basic Usage -->
      <div class="example-card">
        <h3>Basic Usage</h3>
        <p>Simple payment button with minimal configuration</p>
        <SpotflowButton 
          :config="basicConfig"
          @payment-start="onPaymentStart"
          @payment-error="onPaymentError"
        >
          Pay ₦5,000
        </SpotflowButton>
      </div>
      
      <!-- Custom Styled Button -->
      <div class="example-card">
        <h3>Custom Styled</h3>
        <p>Button with custom styling and classes</p>
        <SpotflowButton 
          :config="basicConfig"
          class="custom-pay-button"
          @payment-start="onPaymentStart"
          @payment-error="onPaymentError"
        >
          <span class="button-content">
            💳 Pay with Card
          </span>
        </SpotflowButton>
      </div>
      
      <!-- Disabled State -->
      <div class="example-card">
        <h3>Disabled State</h3>
        <p>Shows how button appears when disabled</p>
        <SpotflowButton 
          :config="basicConfig"
          :disabled="true"
          @payment-start="onPaymentStart"
          @payment-error="onPaymentError"
        >
          Payment Disabled
        </SpotflowButton>
      </div>
      
      <!-- Loading State -->
      <div class="example-card">
        <h3>With Loading State</h3>
        <p>Button that shows loading state during payment</p>
        <SpotflowButton 
          :config="basicConfig"
          :disabled="isLoading"
          class="loading-button"
          @payment-start="onPaymentStartWithLoading"
          @payment-error="onPaymentErrorWithLoading"
        >
          <span v-if="!isLoading">Process Payment</span>
          <span v-else class="loading-content">
            <span class="spinner"></span>
            Processing...
          </span>
        </SpotflowButton>
      </div>
      
      <!-- Different Currencies -->
      <div class="example-card">
        <h3>USD Payment</h3>
        <p>Example of USD payment with local currency</p>
        <SpotflowButton 
          :config="usdConfig"
          class="usd-button"
          @payment-start="onPaymentStart"
          @payment-error="onPaymentError"
        >
          Pay $50 USD
        </SpotflowButton>
      </div>
      
      <!-- Subscription Button -->
      <div class="example-card">
        <h3>Subscription</h3>
        <p>Button for recurring subscription payments</p>
        <SpotflowButton 
          :config="subscriptionConfig"
          class="subscription-button"
          @payment-start="onPaymentStart"
          @payment-error="onPaymentError"
        >
          Subscribe Monthly
        </SpotflowButton>
      </div>
    </div>
    
    <!-- Event Log -->
    <div class="event-log">
      <h3>Event Log</h3>
      <div class="log-container">
        <div 
          v-for="(log, index) in eventLogs" 
          :key="index"
          class="log-entry"
          :class="log.type"
        >
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="event">{{ log.event }}</span>
          <span class="message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SpotflowButton } from '@spot-flow/vue-spotflow-checkout'

// Loading state
const isLoading = ref(false)

// Event logging
interface EventLog {
  timestamp: string
  event: string
  message: string
  type: 'info' | 'error' | 'success'
}

const eventLogs = ref<EventLog[]>([])

const addLog = (event: string, message: string, type: EventLog['type'] = 'info') => {
  eventLogs.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    event,
    message,
    type
  })
  
  // Keep only last 10 logs
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}

// Payment configurations
const basicConfig = {
  amount: 5000,
  currency: "NGN" as const,
  email: "customer@example.com",
  merchantKey: "sk_test_replace_with_your_merchant_key",
  encryptionKey: "replace_with_your_encryption_key",
  metadata: {
    productName: "Basic Product",
    description: "Basic payment example using SpotflowButton"
  }
}

const usdConfig = {
  amount: 5000, // $50.00 in cents
  currency: "USD" as const,
  localCurrency: "NGN" as const,
  email: "customer@example.com",
  merchantKey: "sk_test_replace_with_your_merchant_key",
  encryptionKey: "replace_with_your_encryption_key",
  metadata: {
    productName: "Premium Product",
    description: "USD payment example"
  }
}

const subscriptionConfig = {
  currency: "NGN" as const,
  email: "subscriber@example.com",
  planId: "plan_monthly_basic", // Replace with actual plan ID
  merchantKey: "sk_test_replace_with_your_merchant_key",
  encryptionKey: "replace_with_your_encryption_key",
  metadata: {
    subscriptionType: "monthly",
    planName: "Basic Monthly Plan"
  }
}

// Event handlers
const onPaymentStart = () => {
  addLog('payment-start', 'Payment process initiated', 'info')
}

const onPaymentError = (error: Error) => {
  addLog('payment-error', error.message, 'error')
}

const onPaymentStartWithLoading = () => {
  isLoading.value = true
  addLog('payment-start', 'Payment with loading state initiated', 'info')
  
  // Simulate loading for demo purposes
  setTimeout(() => {
    isLoading.value = false
    addLog('payment-complete', 'Loading simulation completed', 'success')
  }, 3000)
}

const onPaymentErrorWithLoading = (error: Error) => {
  isLoading.value = false
  addLog('payment-error', error.message, 'error')
}
</script>

<style scoped>
.button-example-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.example-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.example-card h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.example-card p {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

/* Custom button styles */
.custom-pay-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.custom-pay-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  min-width: 150px;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.usd-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.usd-button:hover:not(:disabled) {
  background: #218838;
}

.subscription-button {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.subscription-button:hover:not(:disabled) {
  background: #138496;
}

/* Event log styles */
.event-log {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
}

.event-log h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
}

.log-entry {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #f1f3f4;
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', monospace;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.info {
  background: #f8f9ff;
}

.log-entry.error {
  background: #fff5f5;
  color: #dc3545;
}

.log-entry.success {
  background: #f0fff4;
  color: #28a745;
}

.timestamp {
  color: #666;
  font-weight: 500;
}

.event {
  font-weight: 600;
  color: #333;
}

.message {
  color: #555;
}
</style>