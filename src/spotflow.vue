<template>
  <button @click="makePayment">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { getCdnFn } from "./utils/get-cdn-file";

declare global {
  interface Window {
    SpotflowCheckout: {
      CheckoutForm: any
    }
  }
}
export default {
  name: 'VueSpotflow',
  props: {
    merchantKey: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    encryptionKey: {
      type: String,
      required: true
    },
    planId: {
      type: String,
      required: true
    },
    currency: {
      type: String
    }
  },
  beforeMount() {
    getCdnFn();
  },

  methods: {
    makePayment() {
      if (this.merchantKey === undefined || this.email === undefined || this.encryptionKey === undefined ) {
        throw new Error('Merchant key, Email and Encryption key are required')
      }
      const checkout = window.SpotflowCheckout
      if (checkout) {
        const payload = {
        merchantKey: this.merchantKey,
        encryptionKey: this.encryptionKey,
        planId: this.planId,
        email: this.email,
        amount: this.amount || 0,
        currency: this.currency
      }
      const payment = new checkout.CheckoutForm(payload)
      payment.setup(payload)
      }
    }
  }
}
</script>


