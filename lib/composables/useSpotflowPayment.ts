import { ref, onUnmounted } from 'vue'
import type { SpotflowPaymentOptions } from '../types'

declare global {
  interface Window {
    SpotflowCheckout: any
  }
}

let libraryPromise: Promise<any> | null = null

/**
 * Vue composable for integrating Spotflow payment processing
 * 
 * This composable provides a seamless way to integrate Spotflow's payment gateway
 * into your Vue.js application. It handles script loading, initialization, and
 * provides a clean API for processing payments.
 * 
 * @returns {Function} A function to initiate payment processing
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useSpotflowPayment } from '@spot-flow/vue-spotflow-checkout'
 * 
 * const loadSpotflow = useSpotflowPayment()
 * 
 * const handlePayment = async () => {
 *   const config = {
 *     amount: 5000,
 *     currency: "NGN",
 *     email: "customer@example.com",
 *     merchantKey: "sk_test_...",
 *     encryptionKey: "...",
 *   }
 *   await loadSpotflow(config)
 * }
 * </script>
 * ```
 */
export function useSpotflowPayment() {
  const gateway = ref<any>(null)
  let scriptPromise: Promise<void> | null = null

  /**
   * Dynamically loads the Spotflow Inline SDK script from CDN
   * 
   * @param {string} cdnUrl - The CDN URL for the Spotflow Inline SDK
   * @returns {Promise<void>} Promise that resolves when script is loaded
   * @throws {Error} When document is not available (SSR) or script fails to load
   */
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
        reject(new Error('Failed to load Spotflow Inline SDK script.'))
      }

      if (!existing) {
        document.head.appendChild(script)
      }
    })

    return scriptPromise
  }
  /**
   * Waits for the SpotflowCheckout library to become available on the window object
   * 
   * @param {number} timeout - Maximum time to wait in milliseconds (default: 10000)
   * @returns {Promise<any>} Promise that resolves with the SpotflowCheckout library
   * @throws {Error} When library doesn't load within the timeout period
   */
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
            new Error(
              'SpotflowCheckout SDK not loaded after ' +
                timeout +
                'ms. ' +
                'Ensure the CDN script is in your HTML.'
            )
          )
        }
      }, 50) // Check every 50ms
    })

    return libraryPromise
  }
  /**
   * Initiates the Spotflow payment process
   * 
   * This function loads the Spotflow SDK, initializes the checkout form,
   * and opens the payment modal with the provided configuration.
   * 
   * @param {SpotflowPaymentOptions} options - Payment configuration options
   * @returns {Promise<void>} Promise that resolves when payment modal is displayed
   * @throws {Error} When not running in browser environment or SDK fails to load
   * 
   * @example
   * ```typescript
   * await loadSpotflow({
   *   amount: 5000,
   *   currency: "NGN",
   *   email: "customer@example.com",
   *   merchantKey: "sk_test_...",
   *   encryptionKey: "...",
   * })
   * ```
   */
  const loadSpotflow = async (options: SpotflowPaymentOptions) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('SpotflowCheckout is only available in the browser')
    }

    const cdnUrl: string = 'https://v2.inline-checkout.spotflow.one/dist/checkout-inline.js'
    await loadCdnScript(cdnUrl)
    await waitForLibrary()

    try {
      if (window.SpotflowCheckout) {
        const checkout = window.SpotflowCheckout

        gateway.value = new checkout.CheckoutForm()

        gateway.value.setup(options)
      } else {
        const error = new Error('SpotflowCheckout SDK is not loaded')
        console.error('try to load popup error')
        throw error
      }
    } catch (error) {
      console.error('Error loading popup:', error)
      throw error
    }
  }

  /**
   * Cleanup function to destroy payment gateway instance and reset state
   * 
   * This function is automatically called when the component is unmounted
   * to prevent memory leaks and ensure proper cleanup.
   */
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
