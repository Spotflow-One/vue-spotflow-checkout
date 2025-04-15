
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
        productName: 'Product Name'
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
      currency: "NGN",
      email: "temi@mailinator.com", 
      merchantKey: "sk_test_fXXXXedhXXXXXXXXXXXXXXXX",
      encryptionKey: "SKKXXXXXXXXXXXXXXXXX", 
      planId: "9e0808304-344d-XXXXXXXXX-XXXXX834034", // Not required for a one time payment
      metadata: {
        productName: "Product Name",
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
| amount              | False              | Amount to charge the customer. NB: this most likely comes from the plan details. This is not required for subscription payments.   |
| currency            | True             | Currency to charge in.           |
| localCurrency       | False            | This is only required when a payment is being made in USD  |
| encryptionKey       | True               | This is the encryption key for the merchant. This is required for card payments. |
| planId   | False | This is the plan ID being paid for however, this is not required for one time payments.   |
| firstName | False | This is the Customer's First Name |
| lastName | False | This is the Customer's Last Name |
| phone | False | This is the Customer's Phone Number |
| email | True | This is the Customer's Email Address |
| metadata | True | This contains other information about the product such as the product name and other additional properties. Product Name should not be passed if planId is being passed |
| callBackUrl | False | This is the URL the browser redirects to on success of a payment |

## Contribution Guidelines

We welcome contributions from the community. Read more about our community contribution guidelines [here](/CONTRIBUTION.md).

## License

By contributing to this library, you agree that your contributions will be licensed under its [MIT license](/LICENSE).

Copyright (c) Spotflow Inc.

## Contributors

- [Olukayode Ogunnowo](http://github.com/dansagam)
- [Oluwatomisin Jimoh](https://github.com/ekiira)
