export interface Alert {
  email_frequency: number
  email_to: string
  low_balance_threshold: number
  sms_frequency: number
  sms_to: string
  userid: number
}

export interface AlertRes {
  data: Alert
  status: number
}

export interface EditAlertReq {
  sms_frequency: number
  sms_recipients: string
  email_frequency: number
  email_recipients: string
  balance_threshold: number
}

export interface EditAlertRes {
  status: number
  msg: string
}
