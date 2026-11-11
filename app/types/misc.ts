export interface UnsubscribeReq {
  userid: string
  mobile_number: string
}

export interface UnsubscribeRes {
  msg: string
  status: number
}

export interface SenderNameReq {
  bussiness_name: string
  company_email: string
  fullname: string
  cac_number: string
  sender_name: string
  bussiness_nature: string
}

export interface SenderNameRes {
  msg: string
  status: number
}
