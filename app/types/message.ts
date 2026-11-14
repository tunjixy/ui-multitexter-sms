export interface DraftMessage {
  created: string
  displayname: string
  forcednd: number
  id: number
  message: string
  message_type_id: number
  recipient: string
  user_id: string
}

export interface DraftMessageRes {
  msg: DraftMessage
  status: number
}

export interface DraftMessagesRes {
  data: DraftMessage[]
  page: number
  rows: number
  status: number
  total: number
}

export interface MessageDeleteRes {
  status: number
  msg: string
}
