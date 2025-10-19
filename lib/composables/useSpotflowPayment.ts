import { ref, onUnmounted } from 'vue'
import type { SpotflowPaymentOptions } from '../types'

declare global {
  interface Window {
    SpotflowCheckout: any
  }
}

let libraryPromise: Promise<any> | null = null

export function useSpotflowPayment() {
  const gateway = ref<any>(null)
  const loadCdnScript = (cdnUrl: string) => {
    const script = document.createElement('script')
    script.src = cdnUrl
    script.defer = true

    script.onload = () => {}

    script.onerror = () => {
      console.error('Failed to load Spotflow Inline SDK script.')
    }

    document.head.appendChild(script)
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
        console.error('try to load popup error')
        throw new Error('SpotflowCheckout SDK is not loaded')
      }
    } catch (error) {
      console.error('Error loading popup:', error)
    }
  }

  const cleanup = () => {
    if (gateway.value && typeof gateway.value.destroy === 'function') {
      gateway.value.destroy()
    }
    gateway.value = null
  }

  onUnmounted(cleanup)

  return loadSpotflow
}
