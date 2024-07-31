
# Spotflow Checkout Vue.Js

This Vue.js library wraps around the [inline library](https://github.com/Spotflow-One/spotflow-checkout-inline), which enables users to make payments seamlessly. 
It integrates smoothly into your Vue.js application, providing a streamlined checkout experience.


## Installation

To install the library, you can use either Yarn or npm. Choose the one that fits your project setup:

### Using Yarn

```bash
yarn add @spot-flow/vue-spotflow-checkout
 ```

### Using NPM

```bash
npm install @spot-flow/vue-spotflow-checkout
 ```

## Usage
 ```sh
 <script lang="ts">
import checkout from "@spot-flow/vue-spotflow-checkout"

export default {
  components: {
    checkout
  },
  data() {
    return {
      merchantKey: "<sk_test_f998479c0eedhXXXXXXXXXXXXXXXX>"
      email: "temi@mailinator.com",
      amount: 1000,
    };
  },
}

</script>

<template>
  <checkout 
     :amount="amount" 
     :email="email" 
     :merchantKey="merchantKey"
  >
    Make Payment
  </checkout>
</template>
 ```
