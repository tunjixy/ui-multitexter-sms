export interface SenderId {
  business_nature: string
  cac_number: string
  company_name: string
  date_registered: string
  id: number
  sample_message: string
  sender: string
  service_description: string
  status: number
  status_name: string
}

export interface SenderIdRes {
  data: SenderId[]
  status: number
}

export interface CreateSenderIdReq {
  senderName: string
  companyName: string
  cacNumber: string
  businessNature: string
  serviceDescription: string
  sampleMessage: string
  licenceDoc?: Blob
  cacDoc: Blob
}

export interface CreateSenderIdRes {
  msg: string
  status: number
}

export interface DeleteSenderIdRes {
  msg: string
  status: number
}
