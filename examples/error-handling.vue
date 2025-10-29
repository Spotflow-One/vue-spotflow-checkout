<template>
  <div class="error-handling-container">
    <h2>Error Handling Example</h2>
    <p>This example demonstrates comprehensive error handling for different failure scenarios.</p>
    
    <div class="test-scenarios">
      <h3>Test Different Error Scenarios</h3>
      
      <div class="scenario-grid">
        <!-- Validation Errors -->
        <div class="scenario-card">
          <h4>Validation Errors</h4>
          <button @click="testValidationError" class="test-button error-button">
            Test Invalid Email
          </button>
          <button @click="testMissingFields" class="test-button error-button">
            Test Missing Required Fields
          </button>
          <button @click="testInvalidCurrency" class="test-button error-button">
            Test Invalid Currency
          </button>
        </div>
        
        <!-- Network Errors -->
        <div class="scenario-card">
          <h4>Network/Loading Errors</h4>
          <button @click="testNetworkError" class="test-button error-button">
            Simulate Network Error
          </button>
          <button @click="testSDKLoadError" class="test-button error-button">
            Test SDK Load Failure
          </button>
        </div>
        
        <!-- Valid Payment -->
        <div class="scenario-card">
          <h4>Valid Payment</h4>
          <button @click="testValidPayment" class="test-button success-button">
            Test Valid Payment
          </button>
        </div>
      </div>
    </div>
    
    <!-- Error Display -->
    <div v-if="currentError" class="error-display">
      <h3>Error Details</h3>
      <div class="error-info">
        <div class="error-type">
          <strong>Type:</strong> {{ currentError.constructor.name }}
        </div>
        <div class="error-message">
          <strong>Message:</strong> {{ currentError.message }}
        </div>
        <div v-if="currentError.field" class="error-field">
          <strong>Field:</strong> {{ currentError.field }}
        </div>
        <div v-if="currentError.cause" class="error-cause">
          <strong>Cause:</strong> {{ currentError.cause }}
        </div>
      </div>
      <button @click="clearError" class="clear-button">Clear Error</button>
    </div>
    
    <!-- Success Message -->
    <div v-if="successMessage" class="success-display">
      <h3>Success!</h3>
      <p>{{ successMessage }}</p>
      <button @click="clearSuccess" class="clear-button">Clear</button>
    </div>
    
    <!-- Manual Payment Form with Error Handling -->
    <div class="manual-form">
      <h3>Manual Payment with Error Handling</h3>
      <form @submit.prevent="handleManualPayment" class="payment-form">
        <div class="form-row">
          <div class="form-group">
            <label for="amount">Amount</label>
            <input 
              id="amount"
              v-model.number="formData.amount"
              type="number"
              :class="{ 'error': fieldErrors.amount }"
              placeholder="Enter amount"
            >
            <span v-if="fieldErrors.amount" class="field-error">{{ fieldErrors.amount }}</span>
          </div>
          
          <div class="form-group">
            <label for="currency">Currency</label>
            <select 
              id="currency"
              v-model="formData.currency"
              :class="{ 'error': fieldErrors.currency }"
            >
              <option value="">Select currency</option>
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="GHS">GHS</option>
            </select>
            <span v-if="fieldErrors.currency" class="field-error">{{ fieldErrors.currency }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="formData.email"
              type="email"
              :class="{ 'error': fieldErrors.email }"
              placeholder="customer@example.com"
            >
            <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone (Optional)</label>
            <input 
              id="phone"
              v-model="formData.phoneNumber"
              type="tel"
              :class="{ 'error': fieldErrors.phoneNumber }"
              placeholder="+234 800 000 0000"
            >
            <span v-if="fieldErrors.phoneNumber" class="field-error">{{ fieldErrors.phoneNumber }}</span>
          </div>
        </div>
        
        <div v-if="formData.currency === 'USD'" class="form-group">
          <label for="localCurrency">Local Currency (Required for USD)</label>
          <select 
            id="localCurrency"
            v-model="formData.localCurrency"
            :class="{ 'error': fieldErrors.localCurrency }"
          >
            <option value="">Select local currency</option>
            <option value="NGN">NGN</option>
            <option value="GHS">GHS</option>
          </select>
          <span v-if="fieldErrors.localCurrency" class="field-error">{{ fieldErrors.localCurrency }}</span>
        </div>
        
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Processing...' : 'Process Payment' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  useSpotflowPayment, 
  SpotflowValidationError, 
  SpotflowLoadError, 
  SpotflowInitializationError 
} from '@spot-flow/vue-spotflow-checkout'

const loadSpotflow = useSpotflowPayment()

// State
const currentError = ref<Error | null>(null)
const successMessage = ref<string>('')
const loading = ref<boolean>(false)

// Form data
const formData = reactive({
  amount: null as number | null,
  currency: '',
  email: '',
  phoneNumber: '',
  localCurrency: ''
})

// Field-specific errors
const fieldErrors = reactive({
  amount: '',
  currency: '',
  email: '',
  phoneNumber: '',
  localCurrency: ''
})

// Clear functions
const clearError = () => {
  currentError.value = null
}

const clearSuccess = () => {
  successMessage.value = ''
}

const clearFieldErrors = () => {
  Object.keys(fieldErrors).forEach(key => {
    fieldErrors[key as keyof typeof fieldErrors] = ''
  })
}

// Error handling utility
const handleError = (error: unknown) => {
  clearSuccess()
  clearFieldErrors()
  
  if (error instanceof SpotflowValidationError) {
    currentError.value = error
    // Highlight specific field if provided
    if (error.field && error.field in fieldErrors) {
      fieldErrors[error.field as keyof typeof fieldErrors] = error.message
    }
  } else if (error instanceof SpotflowLoadError) {
    currentError.value = error
  } else if (error instanceof SpotflowInitializationError) {
    currentError.value = error
  } else if (error instanceof Error) {
    currentError.value = error
  } else {
    currentError.value = new Error('An unknown error occurred')
  }
}

// Test scenarios
const testValidationError = async () => {
  try {
    await loadSpotflow({
      amount: 1000,
      currency: "NGN" as const,
      email: "invalid-email", // Invalid email format
      merchantKey: "test_key",
      encryptionKey: "test_encryption"
    })
  } catch (error) {
    handleError(error)
  }
}

const testMissingFields = async () => {
  try {
    await loadSpotflow({
      // Missing required fields
      amount: 1000,
      currency: "NGN" as const,
      email: "",
      merchantKey: "",
      encryptionKey: ""
    })
  } catch (error) {
    handleError(error)
  }
}

const testInvalidCurrency = async () => {
  try {
    await loadSpotflow({
      amount: 1000,
      currency: "INVALID" as any, // Invalid currency code
      email: "test@example.com",
      merchantKey: "test_key",
      encryptionKey: "test_encryption"
    })
  } catch (error) {
    handleError(error)
  }
}

const testNetworkError = () => {
  // Simulate network error
  const networkError = new SpotflowLoadError("Network connection failed")
  handleError(networkError)
}

const testSDKLoadError = () => {
  // Simulate SDK load error
  const sdkError = new SpotflowLoadError("Failed to load Spotflow SDK from CDN")
  handleError(sdkError)
}

const testValidPayment = async () => {
  try {
    clearError()
    clearFieldErrors()
    
    await loadSpotflow({
      amount: 5000,
      currency: "NGN" as const,
      email: "customer@example.com",
      merchantKey: "sk_test_replace_with_your_merchant_key",
      encryptionKey: "replace_with_your_encryption_key",
      metadata: {
        productName: "Test Product",
        testScenario: "valid_payment"
      }
    })
    
    successMessage.value = "Payment initiated successfully!"
  } catch (error) {
    handleError(error)
  }
}

// Manual form submission
const handleManualPayment = async () => {
  loading.value = true
  clearError()
  clearFieldErrors()
  clearSuccess()
  
  try {
    const config = {
      amount: formData.amount!,
      currency: formData.currency as any,
      email: formData.email,
      phoneNumber: formData.phoneNumber || undefined,
      localCurrency: formData.localCurrency || undefined,
      merchantKey: "sk_test_replace_with_your_merchant_key",
      encryptionKey: "replace_with_your_encryption_key",
      metadata: {
        productName: "Manual Payment Test",
        source: "error_handling_example"
      }
    }
    
    await loadSpotflow(config)
    successMessage.value = "Manual payment initiated successfully!"
    
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.error-handling-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.scenario-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.scenario-card h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.test-button {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-button {
  background: #dc3545;
  color: white;
}

.error-button:hover {
  background: #c82333;
}

.success-button {
  background: #28a745;
  color: white;
}

.success-button:hover {
  background: #218838;
}

.error-display, .success-display {
  border: 1px solid;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.error-display {
  border-color: #dc3545;
  background: #f8d7da;
  color: #721c24;
}

.success-display {
  border-color: #28a745;
  background: #d4edda;
  color: #155724;
}

.error-info {
  margin-bottom: 16px;
}

.error-info div {
  margin-bottom: 8px;
}

.clear-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-button:hover {
  background: #5a6268;
}

.manual-form {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

input, select {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

input.error, select.error {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.field-error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 2px;
}

.submit-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

.submit-button:hover:not(:disabled) {
  background: #0056b3;
}

.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .scenario-grid {
    grid-template-columns: 1fr;
  }
}
</style>