export interface PaymentHistory {
  transid: string
  amount_pay: string
  units: string
  status: string
  time: string
  date: string
}

export interface PaymentHistoryRes {
  data: PaymentHistory[]
  status: number
}

export interface RechargeHistory {
  balance: string
  date: string
  description: string
  transaction: string
  units: string
}

export interface RechargeHistoryRes {
  msg: RechargeHistory[]
}

export interface TransactionHistory {
  balance: string
  bundlebalance: string
  date: string
  description: string
  transaction: string
  units: string
}
export interface TransactionHistoryRes {
  msg: TransactionHistory[]
}
