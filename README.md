
# Spotflow Checkout Vue.Js

This **Spotflow Vue.js library** wraps around the [inline library](https://github.com/Spotflow-One/spotflow-checkout-inline), which enables users to make payments seamlessly.
It integrates smoothly into your Vue.js application, providing a streamlined checkout experience.

Available Features:

- Collections: Card, Bank Transfers, USSD
- Recurring payments: Tokenization and Subscriptions.

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Usage](#usage)
4. [License](#license)
5. [Contributing Guidelines](#contribting-guidelines)
6. [Contributors](#contributors)

## Requirements

1. Spoflow Encryption keys
2. Spotflow API keys
3. Node versions >= 16.x.x npm >=7.x.x

## Demo

![Alt text](./demo-image.png "a title")

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


**payment-component.vue**

 ```javascript


<template>
  <h1>Payment Component</h1>
  <div>
    <checkout 
      :amount="amount" 
      :currency="currency"
      :email="email" 
      :merchantKey="merchantKey" 
      :encryptionKey="encryptionKey" 
      :planId="planId"
      :localCurrency="localCurrency"
      :callBackUrl="callBackUrl"
      :metadata="{
        title: "Product Name",
        additionalProp: "Additional Prop"
      }"
    >
      Make Payment
    </checkout>
  </div>
</template>

 <script lang="ts">
import checkout from "@spot-flow/vue-spotflow-checkout";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    checkout,
  },
  data() {
    return {
      amount: 4000, // Not required for subscription payment
      currency: "NGN", // Not required for subscription payment
      email: "temi@mailinator.com", 
      merchantKey: "sk_test_fXXXXedhXXXXXXXXXXXXXXXX",
      encryptionKey: "SKKXXXXXXXXXXXXXXXXX", 
      planId: "9e0808304-344d-XXXXXXXXX-XXXXX834034", // Not required for a one time payment
      metadata: {
        title: "Product Name",
        additionalProps: "Additional Prop"
      },
      callBackUrl: "https://website.com",
      localCurrency: "NGN" // Not required if currency is already set to the local currency of the region
    };
  },
});
</script> 
 ```

### Parameters

Read more about our parameters and how they can be used [here](https://docs.spotflow.one/Developer%20Tools/inline-js).

| Parameter           | Required |Description     |
| ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| merchantKey         | True              | Your API Secret |
| reference           | False             | Your transaction reference. This MUST be unique for every transaction  |
| amount              | False              | Amount to charge the customer. NB: this most likely comes from the plan details. This is not required for subscription payments.    |
| currency            | False             | Currency to charge in. Defaults to NGN. This is not required for subscription payments.                |
| encryptionKey       | True               | This is the encryption key for the merchant |
| planId   | True | This is the plan id being paid for. This is not required for one time payments  |
| firstname | False | This is the Customer's First Name |
| lastname | False | This is the Customer's Last Name |
| email | True | This is the Customer's Email Address |
| metadata | False | This contains other information about the product such as the title and other additional properties |
| localCurrency | False | This is only required when a payment is being made in USD |
| callBackUrl | False | This is the URL the browser redirects to on success of a payment |
| regionId | False | This is the merchant's region where the customer is subscribed to |
| phone | False | This is the phone number of the customer |

## Contribution Guidelines

We welcome contributions from the community. Read more about our community contribution guidelines [here](/CONTRIBUTION.md).

## License

By contributing to this library, you agree that your contributions will be licensed under its [MIT license](/LICENSE).

Copyright (c) Spotflow Inc.

## Contributors

- [Olukayode Ogunnowo](http://github.com/dansagam)
- [Oluwatomisin Jimoh](https://github.com/ekiira)
