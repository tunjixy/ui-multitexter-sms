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

export interface SentMessage {
  content: string
  disptachtime: string
  id: number
  priority: number
  recipient: string
  sender_name: string
  status: string
  unit_charge: string
  volume: number
}

export interface SentMessageRes {
  data: SentMessage
  status: number
}

export interface SentMessagesRes {
  data: SentMessage[]
  page: number
  rows: number
  status: number
  total: number
}

export interface ScheduledMessage {
  country_id: number
  created: string
  delivery_status_id: number
  dispatchtime: string
  displayname: string
  forcednd: number
  icount: number
  id: number
  iscancel: number
  listids: string
  message: string
  message_type_id: number
  modified: string
  recipient: string
  recurrent_count: number
  recurrent_type: number
  remotemsgid: string
  scheduledstatus: string
  status: string
  total_sent: number
  user_id: number
  tag: number
}

export interface ScheduledMessageRes {
  data: ScheduledMessage
  status: number
}

export interface ScheduledMessagesRes {
  data: ScheduledMessage[]
  page: number
  rows: number
  status: number
  total: number
}

export interface ScheduledStatusRes {
  status: number
  msg: string
}

export interface MessageDeleteRes {
  status: number
  msg: string
}
