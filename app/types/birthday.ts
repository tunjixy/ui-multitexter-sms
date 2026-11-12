export interface Birthday {
  id: number
  birthday: string
  comment: string
  content: string
  created_at: string
  destination: string
  last_sent: string
  next_sent: string
  send_time: string
  sender: string
  status: string
  total_sent: number
  userid: number
  username: string
}

export interface BirthdayRes {
  data: Birthday[]
  page: number
  rows: number
  status: number
  total: number
}

export interface BirthdayStatusRes {
  msg: string
  status: number
}

export interface DeleteBirthdayRes {
  msg: string
  status: number
}

export interface BirthdayCreateReq {
  id?: number
  displayname: string
  message: string
  birthday: string
  send_time: string
  mobile_number: string
  contact_name: string
}

export interface BirthdayCreateRes {
  msg: string
  status: number
}

export interface UploadBirthdayRes {
  msg: string
  status: number
}
