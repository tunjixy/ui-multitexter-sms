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
