<template>
  <div class="payment-container">
    <h2>Basic Payment Example</h2>
    <div class="payment-form">
      <div class="form-group">
        <label for="amount">Amount (NGN)</label>
        <input 
          id="amount"
          v-model.number="amount" 
          type="number" 
          placeholder="Enter amount"
          min="100"
        >
      </div>
      
      <div class="form-group">
        <label for="email">Customer Email</label>
        <input 
          id="email"
          v-model="email" 
          type="email" 
          placeholder="customer@example.com"
        >
      </div>
      
      <button 
        @click="handlePayment" 
        :disabled="!isFormValid || loading"
        class="pay-button"
      >
        {{ loading ? 'Processing...' : `Pay ₦${amount || 0}` }}
      </button>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSpotflowPayment } from '@spot-flow/vue-spotflow-checkout'

// Form data
const amount = ref<number>(5000)
const email = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string>('')

// Initialize Spotflow payment
const loadSpotflow = useSpotflowPayment()

// Form validation
const isFormValid = computed(() => {
  return amount.value > 0 && 
         email.value && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

// Handle payment
const handlePayment = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const config = {
      amount: amount.value,
      currency: "NGN" as const,
      email: email.value,
      reference: `payment-${Date.now()}`, // Generate unique reference
      merchantKey: "sk_test_replace_with_your_merchant_key",
      encryptionKey: "replace_with_your_encryption_key",
      // Optional metadata
      metadata: {
        productName: "Sample Product",
        description: "Basic payment example"
      }
    }
    
    await loadSpotflow(config)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Payment failed'
    console.error('Payment error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.payment-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-weight: 600;
  color: #333;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.pay-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pay-button:hover:not(:disabled) {
  background: #0056b3;
}

.pay-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  padding: 8px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>