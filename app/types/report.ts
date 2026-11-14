export interface DeliveryReport {
  content: string
  disptachtime: string
  messageid: number
  recipient: string
  remotemsgid: string
  sender_name: string
  status: string
}

export interface DeliveryReportRes {
  data: DeliveryReport[]
  page: number
  rows: number
  total: number
  status: number
}
export interface FilterDeliveryReportReq {
  status?: number
  endDate?: string
  recipient?: string
  sender?: string
  startDate?: string
  page?: number
}

export interface DownloadReport {
  content: string
  country: string
  dispatchtime: string
  length: number
  recipient: string
  remotemsgid: string
  sender_name: string
  status: string
  type: string
}

export interface DownloadReportReq {
  startDate: string
  endDate: string
  senderName?: string
  status?: string
}

export interface DownloadReportRes {
  data: DownloadReport[]
  status: number
  msg: string
}
