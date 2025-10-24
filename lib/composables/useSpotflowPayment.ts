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
        reject(new Error('Failed to load Spotflow Inline SDK script.'))
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
        const error = new Error('SpotflowCheckout SDK is not loaded')
        console.error('try to load popup error')
        throw error
      }
    } catch (error) {
      console.error('Error loading popup:', error)
      throw error
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
