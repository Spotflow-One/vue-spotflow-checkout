# Vue Spotflow SDK Compatibility Testing

This directory contains test projects for validating the Vue Spotflow SDK across different Vue versions.

## Test Matrix

| Vue Version | API Style | Test Project | Status |
|-------------|-----------|--------------|--------|
| Vue 2.7.x   | Options API | `vue2-options-test/` | ⏳ Pending |
| Vue 3.2.x   | Composition API | `vue32-composition-test/` | ⏳ Pending |
| Vue 3.3.x   | Composition API | `vue33-composition-test/` | ⏳ Pending |
| Vue 3.4.x   | Composition API | `vue34-composition-test/` | ⏳ Pending |

## Test Scenarios

Each test project validates:

### 1. SDK Installation & Import
- ✅ Package installation via npm/yarn
- ✅ Import statements work correctly
- ✅ TypeScript definitions available

### 2. Component Integration
- ✅ SpotflowButton component renders
- ✅ useSpotflowPayment composable works
- ✅ Props and events function correctly

### 3. Payment Flow Testing
- ✅ Payment initiation
- ✅ Payment processing
- ✅ Success/error callbacks
- ✅ Console error checking

### 4. Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari (if available)
- ✅ Edge

## Test Credentials

### Test Environment (Recommended)
```javascript
const testConfig = {
  merchantKey: "sk_test_3500ece212364e11abd01984afdd67b3",
  encryptionKey: "47qqVD15YhEbmF8EhY/3F9aICG/Hn96NMz4AbLb1cRk=",
  amount: 100, // Small test amount
  currency: "NGN",
  email: "test@example.com",
  name: "Test User",
  reference: "TEST-" + Date.now()
}
```

### Live Environment (Use with caution - real money)
```javascript
const liveConfig = {
  merchantKey: "sk_live_6f446ad7d9854b0b8f2db0807eb2e5ab",
  encryptionKey: "HziLxqxa+9QgMyb0kqk1xYqjn1P23f4McHaqHJph41A=",
  amount: 100, // Use small amounts for testing
  currency: "NGN",
  email: "test@example.com"
}
```

## Quick Start

```bash
# Install dependencies for all test projects
npm run install:all

# Run all compatibility tests
npm run test:compatibility

# Run specific version test
npm run test:vue2
npm run test:vue32
npm run test:vue33
npm run test:vue34
```

## Test Results Template

For each Vue version, document:

- [ ] **Installation**: Package installs without errors
- [ ] **Imports**: All imports work correctly  
- [ ] **SpotflowButton**: Component renders and functions
- [ ] **useSpotflowPayment**: Composable works as expected
- [ ] **Payment Flow**: Full checkout completes successfully
- [ ] **Console**: No JavaScript errors or warnings
- [ ] **TypeScript**: Type definitions work correctly
- [ ] **Browser Compatibility**: Works across major browsers

## Reporting Issues

If you find compatibility issues:

1. Use the [Issue Template](../ISSUE_TEMPLATE.md)
2. Include:
   - Vue version and browser
   - Error messages/screenshots
   - Steps to reproduce
   - Expected vs actual behavior

## Contributing

1. Create branch from `hacktoberfest`
2. Add test results to this README
3. Submit PR with `hacktoberfest-accepted` label
4. Tag @spotflow_one with #Hacktoberfest #Opensource
