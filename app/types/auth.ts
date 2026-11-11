import type { User } from '@/types/user'

export interface LoginReq {
  email: string
  password: string
}

export interface LoginRes {
  balance: string
  status: number
  token: string
  data: User
  msg: string
}

export interface SignUpReq {
  email: string
  firstname: string
  lastname: string
  mobile_number: string
  password: string
  password_confirmation: string
  company_name?: string
  source?: string
  medium?: string
  campaign?: string
  ref?: number
}

export interface SignUpRes {
  data: {
    code: string
    msg: string
    token: string
  }
  status: number
}

export interface ForgotPasswordRes {
  msg: string
  status: number
}

export interface ResetCodeCheckRes {
  status: number
  resetcode: string
  email: string
  msg: string
}

export interface ResetPasswordReq {
  email: string
  password: string
  password_confirmation: string
  token: string
}
