<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button 
    ref="buttonRef" 
    v-bind="$attrs" 
    :disabled="disabled || loading"
    :class="computedClass" 
    :style="style"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    :aria-busy="loading"
    :aria-live="announceUpdates ? 'polite' : undefined"
    role="button"
    type="button"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Loading indicator for screen readers -->
    <span v-if="loading" class="sr-only">{{ loadingText }}</span>
    
    <!-- Main button content -->
    <span :class="{ 'spotflow-button-content': true, 'loading': loading }">
      <slot>
        {{ defaultButtonText }}
      </slot>
    </span>
    
    <!-- Visual loading indicator -->
    <span 
      v-if="loading && showLoadingSpinner" 
      class="spotflow-loading-spinner"
      aria-hidden="true"
    ></span>
  </button>
</template>


<script setup lang="ts">
import { ref, computed, nextTick, readonly } from 'vue'
import { useSpotflowPayment } from './composables/useSpotflowPayment'
import type { SpotflowPaymentOptions } from './types'

interface SpotflowButtonProps {
  /** Payment configuration options */
  config: SpotflowPaymentOptions
  /** Whether the button is disabled */
  disabled?: boolean
  /** CSS classes for styling */
  class?: string | string[] | Record<string, boolean>
  /** Inline styles */
  style?: string | Record<string, string | number>
  /** Custom aria-label for accessibility */
  ariaLabel?: string
  /** ID of element that describes the button */
  ariaDescribedBy?: string
  /** Whether to announce loading state changes to screen readers */
  announceUpdates?: boolean
  /** Custom loading text for screen readers */
  loadingText?: string
  /** Default button text when no slot content provided */
  defaultButtonText?: string
  /** Whether to show visual loading spinner */
  showLoadingSpinner?: boolean
  /** Timeout for automatic loading state reset (in ms) */
  loadingTimeout?: number
}

type Props = SpotflowButtonProps

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  announceUpdates: true,
  loadingText: 'Processing payment, please wait...',
  defaultButtonText: 'Pay Now',
  showLoadingSpinner: true,
  loadingTimeout: 30000 // 30 seconds
})

const emit = defineEmits<{
  /** Emitted when payment is initiated */
  paymentStart: []
  /** Emitted when payment succeeds */
  paymentSuccess: [data: unknown]
  /** Emitted when payment fails */
  paymentError: [error: Error]
  /** Emitted when button is focused */
  focus: [event: FocusEvent]
  /** Emitted when button loses focus */
  blur: [event: FocusEvent]
}>()

// This allows all native button attributes to pass through
defineOptions({
  inheritAttrs: false
})

const buttonRef = ref<HTMLButtonElement | null>(null)
const loading = ref<boolean>(false)
const loadingTimeoutId = ref<number | null>(null)

const loadSpotflow = useSpotflowPayment()

// Computed properties
const computedClass = computed(() => {
  const classes = ['spotflow-payment-button']
  
  if (loading.value) {
    classes.push('spotflow-loading')
  }
  
  if (props.disabled) {
    classes.push('spotflow-disabled')
  }
  
  // Add user-provided classes
  if (props.class) {
    if (typeof props.class === 'string') {
      classes.push(props.class)
    } else if (Array.isArray(props.class)) {
      classes.push(...props.class)
    } else {
      Object.entries(props.class).forEach(([className, condition]) => {
        if (condition) classes.push(className)
      })
    }
  }
  
  return classes.join(' ')
})

const ariaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  
  if (loading.value) {
    return `${props.loadingText}`
  }
  
  // Generate meaningful label based on config
  const amount = props.config.amount
  const currency = props.config.currency
  const planId = props.config.planId
  
  if (planId) {
    return `Subscribe to payment plan`
  } else if (amount) {
    return `Pay ${amount / 100} ${currency}`
  }
  
  return 'Process payment'
})

// Event handlers
const handleClick = async (event: MouseEvent): Promise<void> => {
  if (props.disabled || loading.value) {
    event.preventDefault()
    return
  }
  
  event.preventDefault()
  loading.value = true
  
  // Set timeout for loading state
  if (props.loadingTimeout > 0) {
    loadingTimeoutId.value = window.setTimeout(() => {
      loading.value = false
      const timeoutError = new Error('Payment timeout - please try again')
      emit('paymentError', timeoutError)
    }, props.loadingTimeout)
  }
  
  try {
    emit('paymentStart')
    await loadSpotflow(props.config)
    // Note: Success handling would typically be managed by the Spotflow SDK
    await nextTick() // Ensure DOM updates
    
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Payment failed')
    emit('paymentError', err)
  } finally {
    loading.value = false
    if (loadingTimeoutId.value) {
      clearTimeout(loadingTimeoutId.value)
      loadingTimeoutId.value = null
    }
  }
}

const handleKeydown = (event: KeyboardEvent): void => {
  // Handle Enter and Space keys for better keyboard accessibility
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick(event as any)
  }
  
  // Handle Escape key to cancel loading state
  if (event.key === 'Escape' && loading.value) {
    loading.value = false
    if (loadingTimeoutId.value) {
      clearTimeout(loadingTimeoutId.value)
      loadingTimeoutId.value = null
    }
    buttonRef.value?.focus()
  }
}

// Focus management
const focus = (): void => {
  buttonRef.value?.focus()
}

const blur = (): void => {
  buttonRef.value?.blur()
}

// Expose public API
defineExpose({
  buttonRef,
  focus,
  blur,
  loading: readonly(loading)
})
</script>

<style scoped>
/* Base button styles */
.spotflow-payment-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 44px; /* WCAG minimum touch target size */
  min-width: 44px;
}

/* Hover state */
.spotflow-payment-button:hover:not(:disabled):not(.spotflow-loading) {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Focus state for keyboard navigation */
.spotflow-payment-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

.spotflow-payment-button:focus:not(:focus-visible) {
  box-shadow: none;
}

.spotflow-payment-button:focus-visible {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}

/* Active state */
.spotflow-payment-button:active:not(:disabled):not(.spotflow-loading) {
  transform: translateY(0);
  background: #004085;
}

/* Disabled state */
.spotflow-payment-button:disabled,
.spotflow-payment-button.spotflow-disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Loading state */
.spotflow-payment-button.spotflow-loading {
  cursor: wait;
  background: #6c757d;
}

.spotflow-payment-button.spotflow-loading:hover {
  transform: none;
  box-shadow: none;
}

/* Button content */
.spotflow-button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s ease-in-out;
}

.spotflow-button-content.loading {
  opacity: 0.7;
}

/* Loading spinner */
.spotflow-loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid #ffffff;
  animation: spotflow-spin 1s linear infinite;
}

@keyframes spotflow-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .spotflow-payment-button {
    border: 2px solid currentColor;
  }
  
  .spotflow-payment-button:focus {
    outline: 3px solid;
    outline-offset: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spotflow-payment-button,
  .spotflow-button-content,
  .spotflow-loading-spinner {
    transition: none;
    animation: none;
  }
  
  .spotflow-payment-button:hover:not(:disabled):not(.spotflow-loading) {
    transform: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .spotflow-payment-button {
    background: #0d6efd;
  }
  
  .spotflow-payment-button:hover:not(:disabled):not(.spotflow-loading) {
    background: #0b5ed7;
  }
  
  .spotflow-payment-button:active:not(:disabled):not(.spotflow-loading) {
    background: #0a58ca;
  }
  
  .spotflow-payment-button:focus-visible {
    outline-color: #6ea8fe;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .spotflow-payment-button {
    min-height: 48px; /* Larger touch target on mobile */
    font-size: 18px;
    padding: 14px 28px;
  }
}

/* Print styles */
@media print {
  .spotflow-payment-button {
    background: transparent !important;
    color: black !important;
    border: 2px solid black !important;
  }
  
  .spotflow-loading-spinner {
    display: none;
  }
}
</style>
