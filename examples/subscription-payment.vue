<template>
  <div class="subscription-container">
    <h2>Subscription Payment Example</h2>
    
    <div class="plan-selection">
      <h3>Choose Your Plan</h3>
      <div class="plans">
        <div 
          v-for="plan in plans" 
          :key="plan.id"
          :class="['plan-card', { active: selectedPlan?.id === plan.id }]"
          @click="selectedPlan = plan"
        >
          <h4>{{ plan.name }}</h4>
          <div class="price">{{ plan.currency }}{{ plan.price }}/{{ plan.interval }}</div>
          <p>{{ plan.description }}</p>
        </div>
      </div>
    </div>
    
    <div class="customer-form">
      <h3>Customer Information</h3>
      <div class="form-group">
        <label for="customer-email">Email Address</label>
        <input 
          id="customer-email"
          v-model="customerEmail" 
          type="email" 
          placeholder="customer@example.com"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="customer-name">Full Name</label>
        <input 
          id="customer-name"
          v-model="customerName" 
          type="text" 
          placeholder="John Doe"
        >
      </div>
      
      <div class="form-group">
        <label for="customer-phone">Phone Number</label>
        <input 
          id="customer-phone"
          v-model="customerPhone" 
          type="tel" 
          placeholder="+234XXXXXXXXXX"
        >
      </div>
    </div>
    
    <div class="subscription-summary" v-if="selectedPlan">
      <h3>Subscription Summary</h3>
      <div class="summary-item">
        <span>Plan:</span>
        <span>{{ selectedPlan.name }}</span>
      </div>
      <div class="summary-item">
        <span>Price:</span>
        <span>{{ selectedPlan.currency }}{{ selectedPlan.price }}/{{ selectedPlan.interval }}</span>
      </div>
      <div class="summary-item">
        <span>Next billing:</span>
        <span>{{ nextBillingDate }}</span>
      </div>
    </div>
    
    <button 
      @click="handleSubscription" 
      :disabled="!canSubscribe || loading"
      class="subscribe-button"
    >
      {{ loading ? 'Processing...' : `Subscribe to ${selectedPlan?.name || 'Plan'}` }}
    </button>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSpotflowPayment } from '@spot-flow/vue-spotflow-checkout'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  description: string
  planId: string // Spotflow plan ID
}

// Available plans
const plans = ref<Plan[]>([
  {
    id: '1',
    name: 'Basic',
    price: 2500,
    currency: '₦',
    interval: 'month',
    description: 'Perfect for individuals getting started',
    planId: 'plan_basic_monthly_2500'
  },
  {
    id: '2',
    name: 'Pro',
    price: 5000,
    currency: '₦',
    interval: 'month',
    description: 'Great for growing businesses',
    planId: 'plan_pro_monthly_5000'
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 10000,
    currency: '₦',
    interval: 'month',
    description: 'For large organizations',
    planId: 'plan_enterprise_monthly_10000'
  }
])

// Form state
const selectedPlan = ref<Plan | null>(null)
const customerEmail = ref<string>('')
const customerName = ref<string>('')
const customerPhone = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string>('')

// Initialize Spotflow payment
const loadSpotflow = useSpotflowPayment()

// Computed properties
const canSubscribe = computed(() => {
  return selectedPlan.value && 
         customerEmail.value && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.value)
})

const nextBillingDate = computed(() => {
  if (!selectedPlan.value) return ''
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString()
})

// Handle subscription
const handleSubscription = async () => {
  if (!canSubscribe.value || !selectedPlan.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const config = {
      planId: selectedPlan.value.planId,
      currency: "NGN" as const,
      email: customerEmail.value,
      name: customerName.value,
      phoneNumber: customerPhone.value,
      reference: `subscription-${Date.now()}`,
      merchantKey: "sk_test_replace_with_your_merchant_key",
      encryptionKey: "replace_with_your_encryption_key",
      metadata: {
        productName: selectedPlan.value.name,
        description: `${selectedPlan.value.name} subscription`,
        subscriptionType: selectedPlan.value.interval
      }
    }
    
    await loadSpotflow(config)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Subscription failed'
    console.error('Subscription error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.subscription-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.plan-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
}

.plan-card.active {
  border-color: #007bff;
  background: #f8f9ff;
}

.plan-card h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin: 8px 0;
}

.customer-form, .subscription-summary {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
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

.summary-item {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.summary-item:last-child {
  border-bottom: none;
}

.subscribe-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.subscribe-button:hover:not(:disabled) {
  background: #218838;
}

.subscribe-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  padding: 12px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-top: 16px;
}
</style>