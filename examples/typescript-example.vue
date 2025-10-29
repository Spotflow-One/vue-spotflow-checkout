<template>
  <div class="typescript-example-container">
    <h2>TypeScript Integration Example</h2>
    <p>Demonstrates full TypeScript support with proper typing and IntelliSense.</p>
    
    <div class="example-sections">
      <!-- Type-Safe Configuration -->
      <div class="section-card">
        <h3>Type-Safe Payment Configuration</h3>
        <p>All configuration options are fully typed with IntelliSense support.</p>
        
        <div class="config-demo">
          <div class="form-group">
            <label for="currency-select">Currency (Typed Union)</label>
            <select 
              id="currency-select"
              v-model="paymentConfig.currency"
              class="form-control"
            >
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GHS">GHS - Ghanaian Cedi</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="ZAR">ZAR - South African Rand</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="amount-input">Amount</label>
            <input 
              id="amount-input"
              v-model.number="paymentConfig.amount"
              type="number"
              class="form-control"
              placeholder="Enter amount"
            >
          </div>
          
          <div class="form-group">
            <label for="email-input">Customer Email</label>
            <input 
              id="email-input"
              v-model="paymentConfig.email"
              type="email"
              class="form-control"
              placeholder="customer@example.com"
            >
          </div>
          
          <!-- USD specific field -->
          <div v-if="paymentConfig.currency === 'USD'" class="form-group">
            <label for="local-currency">Local Currency (Required for USD)</label>
            <select 
              id="local-currency"
              v-model="paymentConfig.localCurrency"
              class="form-control"
            >
              <option value="">Select local currency</option>
              <option value="NGN">NGN</option>
              <option value="GHS">GHS</option>
              <option value="KES">KES</option>
              <option value="ZAR">ZAR</option>
            </select>
          </div>
          
          <button 
            @click="processTypedPayment"
            :disabled="!isConfigValid || processing"
            class="process-button"
          >
            {{ processing ? 'Processing...' : 'Process Typed Payment' }}
          </button>
        </div>
      </div>
      
      <!-- Error Handling with Types -->
      <div class="section-card">
        <h3>Typed Error Handling</h3>
        <p>Handle different error types with proper TypeScript support.</p>
        
        <div class="error-demo">
          <button @click="triggerValidationError" class="error-button">
            Trigger SpotflowValidationError
          </button>
          <button @click="triggerLoadError" class="error-button">
            Trigger SpotflowLoadError
          </button>
          <button @click="triggerInitError" class="error-button">
            Trigger SpotflowInitializationError
          </button>
        </div>
        
        <div v-if="currentError" class="error-display">
          <h4>{{ currentError.constructor.name }}</h4>
          <p><strong>Message:</strong> {{ currentError.message }}</p>
          <p v-if="'field' in currentError"><strong>Field:</strong> {{ (currentError as any).field }}</p>
          <p v-if="'cause' in currentError"><strong>Cause:</strong> {{ (currentError as any).cause }}</p>
        </div>
      </div>
      
      <!-- Component Events with Types -->
      <div class="section-card">
        <h3>Typed Component Events</h3>
        <p>SpotflowButton component with fully typed event handlers.</p>
        
        <SpotflowButton 
          :config="buttonConfig"
          class="typed-button"
          @payment-start="handlePaymentStart"
          @payment-success="handlePaymentSuccess"
          @payment-error="handlePaymentError"
        >
          Pay with Typed Events
        </SpotflowButton>
        
        <div v-if="events.length > 0" class="events-log">
          <h4>Event Log</h4>
          <div 
            v-for="(event, index) in events" 
            :key="index"
            class="event-entry"
          >
            <span class="event-name">{{ event.name }}</span>
            <span class="event-data">{{ event.data }}</span>
            <span class="event-time">{{ event.timestamp }}</span>
          </div>
        </div>
      </div>
      
      <!-- Advanced TypeScript Features -->
      <div class="section-card">
        <h3>Advanced TypeScript Features</h3>
        <p>Demonstrates advanced typing features and utilities.</p>
        
        <div class="advanced-demo">
          <h4>Metadata with Strong Typing</h4>
          <div class="metadata-form">
            <input 
              v-model="metadata.productName"
              placeholder="Product Name"
              class="form-control small"
            >
            <input 
              v-model="metadata.description"
              placeholder="Description"
              class="form-control small"
            >
            <input 
              v-model.number="metadata.quantity"
              type="number"
              placeholder="Quantity"
              class="form-control small"
            >
            <input 
              v-model.boolean="metadata.isGift"
              type="checkbox"
              id="is-gift"
            >
            <label for="is-gift">Is Gift</label>
          </div>
          
          <button @click="payWithMetadata" class="metadata-button">
            Pay with Typed Metadata
          </button>
        </div>
      </div>
    </div>
    
    <!-- Type Information Display -->
    <div class="type-info">
      <h3>Type Information</h3>
      <div class="type-grid">
        <div class="type-card">
          <h4>SpotflowPaymentOptions</h4>
          <p>Comprehensive interface for payment configuration with optional and required fields clearly defined.</p>
        </div>
        <div class="type-card">
          <h4>SupportedCurrency</h4>
          <p>Union type restricting currency values to: 'NGN' | 'USD' | 'GHS' | 'KES' | 'ZAR'</p>
        </div>
        <div class="type-card">
          <h4>PaymentMetadata</h4>
          <p>Structured interface for metadata with common fields and index signature for custom properties.</p>
        </div>
        <div class="type-card">
          <h4>Error Types</h4>
          <p>Specific error classes for validation, loading, and initialization failures with typed properties.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  useSpotflowPayment, 
  SpotflowButton,
  type SpotflowPaymentOptions,
  type SupportedCurrency,
  type PaymentMetadata,
  SpotflowValidationError,
  SpotflowLoadError,
  SpotflowInitializationError
} from '@spot-flow/vue-spotflow-checkout'

// Typed reactive configuration
const paymentConfig = reactive<SpotflowPaymentOptions>({
  merchantKey: "sk_test_replace_with_your_merchant_key",
  encryptionKey: "replace_with_your_encryption_key",
  email: "",
  currency: "NGN",
  amount: 5000,
  localCurrency: undefined
})

// Typed metadata
const metadata = reactive<PaymentMetadata>({
  productName: "",
  description: "",
  quantity: 1,
  isGift: false
})

// State with proper typing
const processing = ref<boolean>(false)
const currentError = ref<SpotflowValidationError | SpotflowLoadError | SpotflowInitializationError | null>(null)

// Event tracking with typed interface
interface PaymentEvent {
  name: string
  data: string
  timestamp: string
}

const events = ref<PaymentEvent[]>([])

// Initialize composable
const loadSpotflow = useSpotflowPayment()

// Computed properties with proper typing
const isConfigValid = computed((): boolean => {
  return !!(
    paymentConfig.email &&
    paymentConfig.currency &&
    paymentConfig.amount &&
    paymentConfig.amount > 0 &&
    (paymentConfig.currency !== 'USD' || paymentConfig.localCurrency)
  )
})

const buttonConfig = computed((): SpotflowPaymentOptions => ({
  ...paymentConfig,
  metadata: {
    source: 'typescript_example',
    component: 'SpotflowButton'
  }
}))

// Utility function to add events
const addEvent = (name: string, data: any = ''): void => {
  events.value.unshift({
    name,
    data: typeof data === 'string' ? data : JSON.stringify(data),
    timestamp: new Date().toLocaleTimeString()
  })
  
  // Keep only last 5 events
  if (events.value.length > 5) {
    events.value = events.value.slice(0, 5)
  }
}

// Typed payment processing
const processTypedPayment = async (): Promise<void> => {
  if (!isConfigValid.value) return
  
  processing.value = true
  currentError.value = null
  
  try {
    const config: SpotflowPaymentOptions = {
      ...paymentConfig,
      reference: `ts-${Date.now()}`,
      metadata: {
        source: 'typescript_example',
        demo: true
      }
    }
    
    await loadSpotflow(config)
    addEvent('Payment Success', 'Typed payment processed successfully')
    
  } catch (error) {
    if (error instanceof SpotflowValidationError) {
      currentError.value = error
      addEvent('Validation Error', error.message)
    } else if (error instanceof SpotflowLoadError) {
      currentError.value = error
      addEvent('Load Error', error.message)
    } else if (error instanceof SpotflowInitializationError) {
      currentError.value = error
      addEvent('Initialization Error', error.message)
    } else {
      addEvent('Unknown Error', 'An unexpected error occurred')
    }
  } finally {
    processing.value = false
  }
}

// Error demonstration functions
const triggerValidationError = (): void => {
  const error = new SpotflowValidationError('Invalid email format', 'email')
  currentError.value = error
  addEvent('Manual Validation Error', error.message)
}

const triggerLoadError = (): void => {
  const error = new SpotflowLoadError('Failed to load SDK from CDN')
  currentError.value = error
  addEvent('Manual Load Error', error.message)
}

const triggerInitError = (): void => {
  const error = new SpotflowInitializationError('SDK initialization failed')
  currentError.value = error
  addEvent('Manual Init Error', error.message)
}

// Typed event handlers for SpotflowButton
const handlePaymentStart = (): void => {
  addEvent('Payment Started', 'Via SpotflowButton component')
}

const handlePaymentSuccess = (data: unknown): void => {
  addEvent('Payment Success', data)
}

const handlePaymentError = (error: Error): void => {
  addEvent('Payment Error', error.message)
  currentError.value = error as any // Type assertion for demo
}

// Advanced metadata payment
const payWithMetadata = async (): Promise<void> => {
  try {
    const config: SpotflowPaymentOptions = {
      ...paymentConfig,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: 'typescript_metadata_example'
      }
    }
    
    await loadSpotflow(config)
    addEvent('Metadata Payment', 'Payment with typed metadata')
    
  } catch (error) {
    if (error instanceof Error) {
      addEvent('Metadata Payment Error', error.message)
    }
  }
}
</script>

<style scoped>
.typescript-example-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.example-sections {
  display: grid;
  gap: 32px;
  margin-bottom: 40px;
}

.section-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-card h3 {
  margin: 0 0 8px 0;
  color: #3b82f6;
  font-size: 20px;
}

.section-card p {
  margin: 0 0 20px 0;
  color: #6b7280;
}

.config-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control.small {
  max-width: 200px;
}

label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.process-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.process-button:hover:not(:disabled) {
  background: #2563eb;
}

.process-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.error-button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-button:hover {
  background: #dc2626;
}

.error-display {
  margin-top: 16px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
}

.error-display h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.error-display p {
  margin: 4px 0;
  font-size: 14px;
}

.typed-button {
  background: #059669;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.typed-button:hover:not(:disabled) {
  background: #047857;
}

.events-log {
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.events-log h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.event-entry {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  padding: 6px 0;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  border-bottom: 1px solid #f3f4f6;
}

.event-entry:last-child {
  border-bottom: none;
}

.event-name {
  font-weight: 600;
  color: #059669;
}

.event-data {
  color: #6b7280;
}

.event-time {
  color: #9ca3af;
}

.metadata-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.metadata-button {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.metadata-button:hover {
  background: #6d28d9;
}

.type-info {
  border-top: 2px solid #e5e7eb;
  padding-top: 32px;
}

.type-info h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.type-card {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.type-card h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 14px;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.type-card p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .error-demo {
    flex-direction: column;
  }
  
  .metadata-form {
    grid-template-columns: 1fr;
  }
}
</style>