export interface Profile {
  alternate_email: string
  country: number
  displayname: string
  email: string
  firstname: string
  gender: string
  mobilenumber: string
  other_number: string
  othername: string
  surname: string
}

export interface ProfileRes {
  success: Profile
}

export interface ProfileSummary {
  account_type: string
  balance: string
  created: string
  displayname: string
  email: string
  freesms: number
  fullname: string
  lastmessage: string
  mobilenumber: string
  no_referer: number
  total_commission: number
  total_contacts: number
  total_message: number
  total_paid_commission: number
  userid: number
}

export interface ProfileSummaryRes {
  success: ProfileSummary
}

export interface UpdateProfileReq {
  firstname: string
  surname: string
  othername: string
  email: string
  altemail: string
  mobile_number: string
  other_number: string
  gender: string
  displayname: string
  country: number
}

export interface UpdateProfileRes {
  status: number
  msg: string
}
