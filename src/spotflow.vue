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
    },
    localCurrency: {
      type: String
    },
    metadata: {
      type: Object
    },
    callBackUrl: {
      type: String
    }
  },
  beforeMount() {
    function getCdnFn() {
      const script = document.createElement('script')
      const inlineSdk = 'https://dr4h9151gox1m.cloudfront.net/dist/checkout-inline.js'
      script.src = inlineSdk
      script.onload = () => {}
      if (!document.querySelector(`[src="${inlineSdk}"]`)) {
        document.head.appendChild(script)
      }
    }
    getCdnFn()
  },

  methods: {
    makePayment() {
      if (
        this.merchantKey === undefined ||
        this.email === undefined ||
        this.encryptionKey === undefined
      ) {
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
          currency: this.currency,
          localCurrency: this.localCurrency,
          metadata: this.metadata,
          callBackUrl: this.callBackUrl
        }
        const payment = new checkout.CheckoutForm(payload)
        payment.setup(payload)
      }
    }
  }
}
</script>
