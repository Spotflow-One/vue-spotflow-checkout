<template>
  <div class="accessibility-demo-container">
    <h2>Accessibility Features Demo</h2>
    <p>This example demonstrates the accessibility features built into the Spotflow library.</p>
    
    <!-- Screen Reader Announcements -->
    <div class="demo-section">
      <h3>Screen Reader Announcements</h3>
      <p>Test how the library announces important information to screen readers.</p>
      
      <div class="controls">
        <button @click="announcePaymentStart" class="demo-button">
          Announce Payment Start
        </button>
        <button @click="announcePaymentSuccess" class="demo-button">
          Announce Success
        </button>
        <button @click="announcePaymentError" class="demo-button">
          Announce Error
        </button>
      </div>
      
      <div class="info-box">
        <strong>Note:</strong> Use a screen reader to hear these announcements. 
        Recent announcements will appear in the live region below for testing.
      </div>
      
      <div 
        id="announcement-log"
        class="announcement-log"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ lastAnnouncement || 'No announcements yet' }}
      </div>
    </div>
    
    <!-- Keyboard Navigation -->
    <div class="demo-section">
      <h3>Keyboard Navigation</h3>
      <p>All payment buttons support full keyboard navigation.</p>
      
      <div class="keyboard-demo">
        <div class="key-instruction">
          <kbd>Tab</kbd> to navigate between buttons
        </div>
        <div class="key-instruction">
          <kbd>Enter</kbd> or <kbd>Space</kbd> to activate
        </div>
        <div class="key-instruction">
          <kbd>Escape</kbd> to cancel loading state
        </div>
      </div>
      
      <div class="button-row">
        <SpotflowButton 
          :config="basicConfig"
          class="accessible-button"
          aria-label="Pay 50 dollars for premium subscription"
          @payment-start="onPaymentStart"
          @payment-error="onPaymentError"
        >
          Premium Plan - $50
        </SpotflowButton>
        
        <SpotflowButton 
          :config="basicConfig"
          class="accessible-button"
          :disabled="true"
          aria-label="Basic plan currently unavailable"
        >
          Basic Plan (Disabled)
        </SpotflowButton>
        
        <SpotflowButton 
          :config="basicConfig"
          class="accessible-button"
          :loading-timeout="3000"
          aria-describedby="enterprise-description"
        >
          Enterprise Plan
        </SpotflowButton>
      </div>
      
      <div id="enterprise-description" class="description">
        Enterprise plan includes all features plus dedicated support and custom integrations.
      </div>
    </div>
    
    <!-- Focus Management -->
    <div class="demo-section">
      <h3>Focus Management</h3>
      <p>Demonstrates proper focus handling for modal-like payment flows.</p>
      
      <button @click="openMockModal" class="demo-button">
        Open Mock Payment Modal
      </button>
      
      <!-- Mock modal for focus management demo -->
      <div 
        v-if="showModal"
        class="modal-overlay"
        @keydown="handleModalKeydown"
        @click.self="closeMockModal"
      >
        <div class="modal-content" ref="modalRef">
          <h4>Payment Details</h4>
          <p>Focus is trapped within this modal. Try tabbing through the elements.</p>
          
          <div class="modal-form">
            <label for="modal-amount">Amount:</label>
            <input id="modal-amount" type="number" value="100" />
            
            <label for="modal-email">Email:</label>
            <input id="modal-email" type="email" placeholder="customer@example.com" />
          </div>
          
          <div class="modal-actions">
            <SpotflowButton 
              :config="modalConfig"
              class="modal-pay-button"
              @payment-start="onModalPaymentStart"
            >
              Complete Payment
            </SpotflowButton>
            <button @click="closeMockModal" class="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- High Contrast Support -->
    <div class="demo-section">
      <h3>High Contrast & Theme Support</h3>
      <p>Buttons adapt to user's system preferences for contrast and color themes.</p>
      
      <div class="theme-info">
        <div class="preference-item">
          <strong>Prefers Reduced Motion:</strong> 
          {{ preferences.prefersReducedMotion ? 'Yes' : 'No' }}
        </div>
        <div class="preference-item">
          <strong>Prefers High Contrast:</strong> 
          {{ preferences.prefersHighContrast ? 'Yes' : 'No' }}
        </div>
        <div class="preference-item">
          <strong>Prefers Dark Mode:</strong> 
          {{ preferences.prefersDarkMode ? 'Yes' : 'No' }}
        </div>
      </div>
      
      <div class="theme-demo">
        <SpotflowButton 
          :config="basicConfig"
          class="theme-button"
        >
          Theme-Adaptive Button
        </SpotflowButton>
      </div>
    </div>
    
    <!-- Error Accessibility -->
    <div class="demo-section">
      <h3>Accessible Error Handling</h3>
      <p>Errors are announced to screen readers and properly associated with form fields.</p>
      
      <div class="error-demo-form">
        <div class="form-group">
          <label for="test-email">Email Address:</label>
          <input 
            id="test-email"
            v-model="testEmail"
            type="email"
            :aria-describedby="emailError ? 'email-error' : undefined"
            :aria-invalid="!!emailError"
            @blur="validateEmail"
          />
          <div 
            v-if="emailError"
            id="email-error"
            class="error-message"
            role="alert"
            aria-live="assertive"
          >
            {{ emailError }}
          </div>
        </div>
        
        <button @click="triggerValidationDemo" class="demo-button">
          Test Validation
        </button>
      </div>
    </div>
    
    <!-- Touch Target Sizes -->
    <div class="demo-section">
      <h3>Touch Target Sizes</h3>
      <p>All interactive elements meet WCAG minimum size requirements (44x44px).</p>
      
      <div class="touch-demo">
        <div class="size-demo">
          <SpotflowButton :config="basicConfig" class="small-text-button">
            Small Text
          </SpotflowButton>
          <span class="size-label">Still 44px minimum</span>
        </div>
        
        <div class="size-demo">
          <SpotflowButton :config="basicConfig" class="large-button">
            Large Button
          </SpotflowButton>
          <span class="size-label">Larger for better usability</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  SpotflowButton,
  ScreenReaderAnnouncer,
  FocusManager,
  SCREEN_READER_MESSAGES,
  getUserAccessibilityPreferences
} from '@spot-flow/vue-spotflow-checkout'

// State
const lastAnnouncement = ref<string>('')
const showModal = ref<boolean>(false)
const testEmail = ref<string>('')
const emailError = ref<string>('')
const modalRef = ref<HTMLElement | null>(null)

// User preferences
const preferences = reactive({
  prefersReducedMotion: false,
  prefersHighContrast: false,
  prefersDarkMode: false
})

// Utilities
let announcer: ScreenReaderAnnouncer | null = null
let focusManager: FocusManager | null = null

// Configuration
const basicConfig = {
  amount: 5000,
  currency: "USD" as const,
  localCurrency: "NGN" as const,
  email: "demo@example.com",
  merchantKey: "sk_test_demo_key",
  encryptionKey: "demo_encryption_key",
  metadata: {
    source: 'accessibility_demo'
  }
}

const modalConfig = {
  ...basicConfig,
  amount: 10000,
  metadata: {
    source: 'modal_demo'
  }
}

// Lifecycle
onMounted(() => {
  announcer = new ScreenReaderAnnouncer()
  focusManager = new FocusManager()
  
  // Get user preferences
  const prefs = getUserAccessibilityPreferences()
  Object.assign(preferences, prefs)
  
  // Listen for preference changes
  const mediaQueries = [
    { query: '(prefers-reduced-motion: reduce)', key: 'prefersReducedMotion' as const },
    { query: '(prefers-contrast: high)', key: 'prefersHighContrast' as const },
    { query: '(prefers-color-scheme: dark)', key: 'prefersDarkMode' as const }
  ]
  
  mediaQueries.forEach(({ query, key }) => {
    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => {
      preferences[key] = e.matches
    }
    mediaQuery.addEventListener('change', handler)
    
    // Store for cleanup
    ;(window as any)[`cleanup_${key}`] = () => {
      mediaQuery.removeEventListener('change', handler)
    }
  })
})

onUnmounted(() => {
  announcer?.destroy()
  
  // Cleanup media query listeners
  ;['prefersReducedMotion', 'prefersHighContrast', 'prefersDarkMode'].forEach(key => {
    const cleanup = (window as any)[`cleanup_${key}`]
    if (cleanup) cleanup()
  })
})

// Screen reader announcements
const announcePaymentStart = () => {
  const message = SCREEN_READER_MESSAGES.PAYMENT_STARTED
  announcer?.announce(message, 'polite')
  lastAnnouncement.value = message
}

const announcePaymentSuccess = () => {
  const message = SCREEN_READER_MESSAGES.PAYMENT_SUCCESS
  announcer?.announce(message, 'assertive')
  lastAnnouncement.value = message
}

const announcePaymentError = () => {
  const message = SCREEN_READER_MESSAGES.PAYMENT_ERROR
  announcer?.announce(message, 'assertive')
  lastAnnouncement.value = message
}

// Event handlers
const onPaymentStart = () => {
  announcer?.announce('Payment process initiated from accessible button', 'polite')
  lastAnnouncement.value = 'Payment process initiated'
}

const onPaymentError = (error: Error) => {
  announcer?.announce(`Payment failed: ${error.message}`, 'assertive')
  lastAnnouncement.value = `Error: ${error.message}`
}

// Modal management
const openMockModal = async () => {
  focusManager?.captureFocus()
  showModal.value = true
  
  await nextTick()
  if (modalRef.value) {
    focusManager?.setInitialFocus(modalRef.value)
  }
}

const closeMockModal = () => {
  showModal.value = false
  focusManager?.restoreFocus()
}

const handleModalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMockModal()
    return
  }
  
  if (modalRef.value) {
    focusManager?.trapFocus(modalRef.value, event)
  }
}

const onModalPaymentStart = () => {
  announcer?.announce('Modal payment started', 'polite')
  // In real scenario, you might close modal on successful payment
  setTimeout(() => {
    closeMockModal()
    announcer?.announce('Payment completed and modal closed', 'polite')
  }, 1000)
}

// Email validation
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (testEmail.value && !emailRegex.test(testEmail.value)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
}

const triggerValidationDemo = () => {
  if (!testEmail.value) {
    emailError.value = 'Email address is required'
    announcer?.announce('Validation error: Email address is required', 'assertive')
  } else {
    validateEmail()
  }
}
</script>

<style scoped>
.accessibility-demo-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-section {
  margin-bottom: 48px;
  padding: 24px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #ffffff;
}

.demo-section h3 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 20px;
}

.demo-section p {
  margin: 0 0 20px 0;
  color: #4a5568;
  line-height: 1.6;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.demo-button {
  padding: 8px 16px;
  border: 1px solid #3182ce;
  background: #3182ce;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-height: 44px;
}

.demo-button:hover {
  background: #2c5aa0;
}

.demo-button:focus {
  outline: 2px solid #63b3ed;
  outline-offset: 2px;
}

.info-box {
  padding: 12px 16px;
  background: #ebf8ff;
  border: 1px solid #90cdf4;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #2a69ac;
}

.announcement-log {
  padding: 12px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-family: monospace;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.keyboard-demo {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.key-instruction {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 4px;
  font-size: 14px;
}

kbd {
  padding: 2px 6px;
  background: #4a5568;
  color: white;
  border-radius: 3px;
  font-size: 12px;
  font-family: monospace;
}

.button-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.accessible-button {
  min-height: 44px;
  min-width: 120px;
}

.description {
  font-size: 14px;
  color: #718096;
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 4px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content h4 {
  margin: 0 0 16px 0;
  color: #2d3748;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.modal-form label {
  font-weight: 600;
  color: #4a5568;
}

.modal-form input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-pay-button {
  background: #48bb78;
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #cbd5e0;
  background: white;
  color: #4a5568;
  border-radius: 4px;
  cursor: pointer;
  min-height: 44px;
}

.cancel-button:hover {
  background: #f7fafc;
}

/* Theme preferences */
.theme-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 4px;
}

.preference-item {
  font-size: 14px;
  color: #4a5568;
}

.theme-demo {
  display: flex;
  justify-content: center;
}

.theme-button {
  background: #805ad5;
}

/* Error demo */
.error-demo-form {
  max-width: 300px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.form-group label {
  font-weight: 600;
  color: #4a5568;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  min-height: 44px;
}

.form-group input[aria-invalid="true"] {
  border-color: #e53e3e;
  background-color: #fed7d7;
}

.error-message {
  color: #e53e3e;
  font-size: 14px;
  padding: 4px 8px;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 4px;
}

/* Touch targets */
.touch-demo {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.size-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.size-label {
  font-size: 12px;
  color: #718096;
}

.small-text-button {
  font-size: 12px;
  min-height: 44px;
  min-width: 44px;
}

.large-button {
  font-size: 18px;
  padding: 16px 32px;
  min-height: 56px;
}

/* Responsive design */
@media (max-width: 768px) {
  .keyboard-demo {
    flex-direction: column;
  }
  
  .button-row {
    flex-direction: column;
  }
  
  .touch-demo {
    flex-direction: column;
  }
  
  .controls {
    flex-direction: column;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .demo-section {
    border: 2px solid;
  }
  
  .demo-button,
  .accessible-button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>