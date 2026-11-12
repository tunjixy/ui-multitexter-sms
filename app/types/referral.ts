export interface Referral {
  email: string
  name: string
}

export interface ReferralRes {
  data: Referral[]
  status: number
}

export interface Commission {
  amount: number
  email: string
  name: string
  payment_status: string
}

export interface CommissionRes {
  data: Commission[]
  status: number
}
