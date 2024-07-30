<template>
  <div></div>
</template>

<script>
import { CheckoutForm } from '@spot-flow/checkout-inline-js'

export default {
  name: 'VueSpotflow',
  props: {
    merchantKey: String,
    email: String,
    amount: Number
  },
  mounted() {
    this.checkout = new CheckoutForm(this.merchantKey, this.email, this.amount)
    this.checkout.setup()
  }
}
</script>
