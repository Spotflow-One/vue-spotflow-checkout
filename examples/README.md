# Spotflow Vue.js Examples

This directory contains comprehensive examples demonstrating various use cases for the Spotflow Vue.js library.

## Available Examples

### 1. Basic Implementation
- [`basic-payment.vue`](./basic-payment.vue) - Simple one-time payment
- [`subscription-payment.vue`](./subscription-payment.vue) - Recurring subscription payment

### 2. Component Examples
- [`button-component.vue`](./button-component.vue) - Using SpotflowButton component
- [`composable-usage.vue`](./composable-usage.vue) - Using useSpotflowPayment composable

### 3. Advanced Use Cases
- [`error-handling.vue`](./error-handling.vue) - Comprehensive error handling
- [`multiple-currencies.vue`](./multiple-currencies.vue) - Multi-currency support
- [`with-validation.vue`](./with-validation.vue) - Form validation before payment

### 4. Framework Integration
- [`nuxt-integration.vue`](./nuxt-integration.vue) - Nuxt.js integration example
- [`typescript-example.vue`](./typescript-example.vue) - TypeScript usage

### 5. Real-world Scenarios
- [`e-commerce-checkout.vue`](./e-commerce-checkout.vue) - Complete checkout flow
- [`donation-form.vue`](./donation-form.vue) - Donation/tip functionality

## Quick Start

1. Copy any example to your Vue.js project
2. Update the configuration with your Spotflow credentials:
   ```javascript
   const config = {
     merchantKey: "your_merchant_key",
     encryptionKey: "your_encryption_key",
     // ... other options
   }
   ```
3. Install the library: `npm install @spot-flow/vue-spotflow-checkout`
4. Import and use the components/composables as shown in the examples

## Configuration Notes

- Replace test keys with your actual Spotflow credentials
- Ensure you're using the correct currency codes
- For USD payments, always include `localCurrency`
- Test with small amounts first

## Need Help?

- Check the [main documentation](../README.md)
- Review the [contributing guidelines](../CONTRIBUTING.md)
- Contact support at devrel@spotflow.one