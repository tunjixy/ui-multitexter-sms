export interface Shared {
  amount: string
  date_shared: string
  recipient: string
}

export interface SharedRes {
  data: Shared[]
  status: number
}

export interface ShareUnitReq {
  to: string
  numberOfUnit: number
}

export interface ShareUnitRes {
  status: number
  msg: string
}
