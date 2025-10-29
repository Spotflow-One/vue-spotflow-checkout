export type SpotflowPaymentOptions = {
  merchantKey: string
  encryptionKey: string
  email: string
  currency: string
  phoneNumber?: string
  planId?: string
  amount?: number
  reference?: string
  name?: string
  callBackUrl?: string
  metadata?: Record<string, any>
  localCurrency?: string
  countryCode?: string
}

/**
 * Supported currency codes for Spotflow payments
 */
export type SupportedCurrency = 'NGN' | 'USD' | 'GHS' | 'KES' | 'ZAR'

/**
 * Custom error types for better error handling
 */
export class SpotflowValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'SpotflowValidationError'
  }
}

export class SpotflowLoadError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'SpotflowLoadError'
  }
}

export class SpotflowInitializationError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'SpotflowInitializationError'
  }
}
