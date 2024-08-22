<template>
  <button @click="makePayment">
    <slot></slot>
  </button>
</template>

<script lang="ts">
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
    encryption: {
      type: String,
      required: true
    },
    planId: {
      type: String,
      required: true
    }
  },
  beforeMount() {
    const script = document.createElement('script')
    script.src = 'https://dr4h9151gox1m.cloudfront.net/dist/checkout-inline.js'
    script.onload = () => {
      console.log('Library loaded')
    }
    document.head.appendChild(script)
  },

  methods: {
    makePayment() {
      if (this.merchantKey === undefined || this.email === undefined ) {
        throw new Error('Merchant key, email and amount are required')
      }
      const checkout = window.SpotflowCheckout
      if (checkout) {
        const payload = {
        merchantKey: this.merchantKey,
        encryptionKey: this.encryption,
        planId: this.planId,
        email: this.email,
        amount: this.amount || 0,
      }
        //  constructor(merchantKey: string, encryption: string, email: string, amount: number, planId: string) {
        const payment = new checkout.CheckoutForm(payload)
        payment.setup(payload)
      }
    }
  }
}
</script>


