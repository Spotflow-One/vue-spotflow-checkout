# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive JSDoc documentation for all functions and types
- Input validation with custom error types (SpotflowValidationError, SpotflowLoadError, SpotflowInitializationError)
- Enhanced TypeScript definitions with proper interfaces and union types
- Complete examples directory with 6 detailed implementation examples
- Full accessibility support with WCAG 2.1 AA compliance
- Accessibility utilities library with FocusManager and ScreenReaderAnnouncer
- Enhanced build configuration with multiple output formats (ES, CJS, UMD)
- Bundle analysis and size limiting
- CI/CD pipeline with GitHub Actions
- Hacktoberfest contribution validation workflow

### Enhanced
- SpotflowButton component with keyboard navigation, loading states, and ARIA attributes
- Type safety throughout the codebase with specific interfaces
- Error handling with field-specific validation messages
- Package.json with better metadata, keywords, and development scripts
- Build output with sourcemaps and proper externals

### Fixed
- TypeScript compilation issues
- Accessibility compliance for screen readers and keyboard navigation
- Bundle size optimization

## [0.1.5] - 2024-10-XX

### Added
- Initial Vue.js wrapper for Spotflow Inline checkout
- Basic SpotflowButton component
- useSpotflowPayment composable
- Nuxt.js plugin support
- Basic TypeScript definitions

### Features
- One-time payments
- Subscription payments
- Multiple currency support
- Vue 3 composition API integration