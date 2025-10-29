import { defineNuxtPlugin } from "nuxt/app"
import { useSpotflowPayment } from './composables/useSpotflowPayment'
import type { SpotflowPaymentOptions } from './types'

/**
 * Nuxt plugin for Spotflow payment integration
 * Provides $paymentGateway utility for handling payments across the application
 */
export default defineNuxtPlugin(() => {
  // Optional: Get config from nuxt.config
  // const config = useRuntimeConfig()
  // const cdnUrl = config.public.paymentGatewayCdn as string | undefined

  const paymentGateway = useSpotflowPayment()

  return {
    provide: {
      /** Spotflow payment gateway utility */
      paymentGateway
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $paymentGateway: (options: SpotflowPaymentOptions) => Promise<void>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $paymentGateway: (options: SpotflowPaymentOptions) => Promise<void>
  }
}