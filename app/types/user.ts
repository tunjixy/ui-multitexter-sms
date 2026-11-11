export interface ActivateUserReq {
  activation_code: string
}

export interface ActivateUserRes {
  msg: string
  status: number
}

export interface RequestVerificationLinkRes {
  status: number
  msg: string
  data: {
    msg: string
  }
}

export interface User {
  id: string
  activated: number
  activation_code: string
  altemail: string
  api_token: string
  country_id: number
  created: string
  displayname: string
  email: string
  firstname: string
  gender: string
  isflagged: number
  issales: number
  lastbonus: string
  lastmailsent: string
  lastname: string
  mobilenumber: string
  othernames: string
  othernumbers: string
  referer: string
}

export interface UserDetail {
  activated: number
  balance: string
  bundle: {
    bundlebalance: number
    expire: boolean
    isbundle: number
  }
  created: string
  displayname: string
  email: string
  freesms: number
  fullname: string
  lastmessage: string
  mobilenumber: string
  userid: number
}

export interface UserDetailRes {
  success: UserDetail
}
