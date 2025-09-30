import { defineNuxtPlugin } from "nuxt/app"
import {  useSpotflowPayment } from './composables/useSpotflowPayment'

export default defineNuxtPlugin(() => {
  // Optional: Get config from nuxt.config
  // const config = useRuntimeConfig()
  // const cdnUrl = config.public.paymentGatewayCdn as string | undefined

  return {
    provide: {
      paymentGateway:  useSpotflowPayment()


    }
  }
})