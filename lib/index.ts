export {  useSpotflowPayment } from './composables/useSpotflowPayment'
export { default as SpotflowButton } from './spotflow.vue'

// Accessibility utilities
export {
  ACCESSIBILITY_CONSTANTS,
  SCREEN_READER_MESSAGES,
  ARIA_ATTRIBUTES,
  KEYBOARD_KEYS,
  FocusManager,
  ScreenReaderAnnouncer,
  isActivationKey,
  createAccessibleError,
  calculateContrastRatio,
  meetsContrastRequirement,
  getUserAccessibilityPreferences,
} from './accessibility'

export type {
  AccessibleErrorOptions,
} from './accessibility'
