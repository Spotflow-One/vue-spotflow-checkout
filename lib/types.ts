/**
 * Configuration options for Spotflow payment processing
 * @interface SpotflowPaymentOptions
 */
export type SpotflowPaymentOptions = {
  /** Your Spotflow API secret key - Required for authentication */
  merchantKey: string
  /** Spotflow encryption key - Required for secure card payments */
  encryptionKey: string
  /** Customer's email address - Required for payment processing */
  email: string
  /** Currency code for the payment (e.g., "NGN", "USD") */
  currency: string
  /** Customer's phone number - Optional but recommended */
  phoneNumber?: string
  /** Plan ID for subscription payments - Not required for one-time payments */
  planId?: string
  /** Payment amount in the smallest currency unit - Not required for subscription payments */
  amount?: number
  /** Unique transaction reference - Auto-generated if not provided */
  reference?: string
  /** Customer's full name - Optional */
  name?: string
  /** URL to redirect to after successful payment - Optional */
  callBackUrl?: string
  /** Additional payment metadata including product information - Optional */
  metadata?: Record<string, any>
  /** Local currency code - Required only for USD payments */
  localCurrency?: string
  /** ISO country code - Optional for region-specific processing */
  countryCode?: string
}
