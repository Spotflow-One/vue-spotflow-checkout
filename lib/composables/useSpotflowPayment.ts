import { ref, onUnmounted } from 'vue'
import type { SpotflowPaymentOptions, SupportedCurrency } from '../types'
import { SpotflowValidationError, SpotflowLoadError, SpotflowInitializationError } from '../types'

declare global {
  interface Window {
    SpotflowCheckout: any
  }
}

let libraryPromise: Promise<any> | null = null

/**
 * Validates payment options before processing
 * @param options - The payment options to validate
 * @throws {SpotflowValidationError} When validation fails
 */
function validatePaymentOptions(options: SpotflowPaymentOptions): void {
  const requiredFields = ['merchantKey', 'encryptionKey', 'email', 'currency'] as const
  
  // Check required fields
  for (const field of requiredFields) {
    if (!options[field] || typeof options[field] !== 'string' || options[field].trim() === '') {
      throw new SpotflowValidationError(`${field} is required and must be a non-empty string`, field)
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(options.email)) {
    throw new SpotflowValidationError('Invalid email format', 'email')
  }

  // Validate currency format
  if (!/^[A-Z]{3}$/.test(options.currency)) {
    throw new SpotflowValidationError('Currency must be a 3-letter code (e.g., NGN, USD)', 'currency')
  }

  // Validate amount if provided
  if (options.amount !== undefined) {
    if (typeof options.amount !== 'number' || options.amount <= 0) {
      throw new SpotflowValidationError('Amount must be a positive number', 'amount')
    }
  }

  // Validate phone number format if provided
  if (options.phoneNumber && !/^\+?[\d\s\-\(\)]{7,15}$/.test(options.phoneNumber)) {
    throw new SpotflowValidationError('Invalid phone number format', 'phoneNumber')
  }

  // Validate callback URL if provided
  if (options.callBackUrl) {
    try {
      new URL(options.callBackUrl)
    } catch {
      throw new SpotflowValidationError('Invalid callback URL format', 'callBackUrl')
    }
  }

  // Check if USD payments have localCurrency
  if (options.currency === 'USD' && !options.localCurrency) {
    throw new SpotflowValidationError('localCurrency is required for USD payments', 'localCurrency')
  }
}

export function useSpotflowPayment() {
  const gateway = ref<any>(null)
  let scriptPromise: Promise<void> | null = null

  const loadCdnScript = (cdnUrl: string) => {
    if (typeof document === 'undefined') {
      return Promise.reject(new Error('Document is not available'))
    }

    if (scriptPromise) {
      return scriptPromise
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${cdnUrl}"]`)
    if (existing?.dataset.loaded === 'true') {
      scriptPromise = Promise.resolve()
      return scriptPromise
    }

    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = existing ?? document.createElement('script')
      script.src = cdnUrl
      script.defer = true

      script.onload = () => {
        script.dataset.loaded = 'true'
        resolve()
      }

      script.onerror = () => {
        scriptPromise = null
        reject(new SpotflowLoadError('Failed to load Spotflow Inline SDK script from CDN'))
      }

      if (!existing) {
        document.head.appendChild(script)
      }
    })

    return scriptPromise
  }
  const waitForLibrary = (timeout = 10000): Promise<any> => {
    // Return existing promise if already waiting
    if (libraryPromise) {
      return libraryPromise
    }

    libraryPromise = new Promise((resolve, reject) => {
      if (window.SpotflowCheckout) {
        return resolve(window.SpotflowCheckout)
      }

      const startTime = Date.now()

      const checkInterval = setInterval(() => {
        if (window.SpotflowCheckout) {
          clearInterval(checkInterval)
          resolve(window.SpotflowCheckout)
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval)
          libraryPromise = null
          reject(
            new SpotflowLoadError(
              `SpotflowCheckout SDK not loaded after ${timeout}ms. Ensure the CDN script is properly loaded and the network connection is stable.`
            )
          )
        }
      }, 50) // Check every 50ms
    })

    return libraryPromise
  }
  const loadSpotflow = async (options: SpotflowPaymentOptions) => {
    // Validate runtime environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new SpotflowInitializationError('SpotflowCheckout is only available in the browser environment')
    }

    // Validate payment options
    try {
      validatePaymentOptions(options)
    } catch (error) {
      if (error instanceof SpotflowValidationError) {
        throw error
      }
      throw new SpotflowValidationError('Invalid payment options provided')
    }

    try {
      const cdnUrl: string = 'https://v2.inline-checkout.spotflow.one/dist/checkout-inline.js'
      await loadCdnScript(cdnUrl)
      await waitForLibrary()

      if (!window.SpotflowCheckout) {
        throw new SpotflowInitializationError('SpotflowCheckout SDK failed to initialize properly')
      }

      const checkout = window.SpotflowCheckout
      gateway.value = new checkout.CheckoutForm()

      if (!gateway.value || typeof gateway.value.setup !== 'function') {
        throw new SpotflowInitializationError('CheckoutForm failed to initialize or setup method not available')
      }

      gateway.value.setup(options)

    } catch (error) {
      // Re-throw known errors
      if (error instanceof SpotflowValidationError || 
          error instanceof SpotflowLoadError || 
          error instanceof SpotflowInitializationError) {
        throw error
      }
      
      // Wrap unknown errors
      throw new SpotflowInitializationError(
        'An unexpected error occurred while initializing Spotflow checkout',
        error as Error
      )
    }
  }

  const cleanup = () => {
    if (gateway.value && typeof gateway.value.destroy === 'function') {
      gateway.value.destroy()
    }
    gateway.value = null
    libraryPromise = null
  }

  onUnmounted(cleanup)

  return loadSpotflow
}
