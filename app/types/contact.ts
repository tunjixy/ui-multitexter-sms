export interface ContactSalesReq {
  name: string
  email: string
  mobile: string
  company_name: string
  title: string
  employees: string
  services: string
  volume: string
  country: string
  requests: string
  source: string
  salesmail: string[]
}

export interface IntegrationRequestReq {
  name: string
  email: string
  mobile: string
  service: string
  description: string
  language: string
  amount: string
}

export interface ContactReq {
  name: string
  email: string
  message: string
  token: string
}

export interface ContactRes {
  msg: string
  status: number
}
