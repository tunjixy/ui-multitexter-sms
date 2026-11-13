export interface UnitPrice {
  amountdue: number
  charges: number
  price: number
  total: number
}

export type PaymentGateway = 'Paystack' | 'flutterwave'

export interface UnitPriceReq {
  paymentGateway: PaymentGateway
  unit: number
}

export interface UnitPriceRes {
  data: UnitPrice
  status: number
  msg: string
}

export interface BuyUnitRes {
  url: string
  status: number
  msg: string
}

export interface VerifyPaymentReq {
  tx_ref?: string
  transid?: string
  transaction_id?: string
}

export interface VerifyPaymentRes {
  msg: string
  status: number
}

export type PaymentStatusState = 'verifying' | 'success' | 'error'
