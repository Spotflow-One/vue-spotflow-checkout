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
